import axios from "axios";
import { WEATHERAPI_BASE } from "@/constants";
import type {
  AirQuality,
  CurrentWeather,
  DailyForecastItem,
  GeoResult,
  HourlyForecastItem,
  TempUnit,
} from "@/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;

const client = axios.create({ timeout: 12000 });

function requireKey() {
  if (!API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_WEATHERAPI_KEY. Add it to your .env.local file.");
  }
  return API_KEY;
}

// ---------------------------------------------------------------------------
// WeatherAPI.com returns numeric condition codes (e.g. 1000 = "Sunny") plus a
// separate `is_day` flag, rather than OpenWeather's "01d"/"01n" icon strings.
// We re-encode as "<code><d|n>" (e.g. "1000d") so WeatherIcon.tsx and the
// background-scene resolver keep working against a single string shape.
// ---------------------------------------------------------------------------
function encodeIcon(code: number | undefined, isDay: number | undefined): string {
  return `${code ?? 1000}${isDay === 0 ? "n" : "d"}`;
}

/** UTC offset, in seconds, of an IANA timezone at a given instant — computed
 *  locally via Intl, since WeatherAPI doesn't return a numeric UTC offset. */
function tzOffsetSeconds(tzId: string | undefined, atMs: number): number {
  if (!tzId) return 0;
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tzId,
      timeZoneName: "shortOffset",
    }).formatToParts(new Date(atMs));
    const tzName = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+0";
    const m = tzName.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/i);
    if (!m) return 0;
    const sign = m[1] === "-" ? -1 : 1;
    const hours = parseInt(m[2], 10);
    const minutes = m[3] ? parseInt(m[3], 10) : 0;
    return sign * (hours * 3600 + minutes * 60);
  } catch {
    return 0;
  }
}

/**
 * Every formatter in utils/weather.ts works on the convention
 * `new Date((dt + timezoneOffset) * 1000)` rendered in the UTC timezone —
 * i.e. `dt` is a true instant and `timezoneOffset` shifts it to the
 * location's local wall-clock time. This helper builds a `dt` that
 * reproduces an explicit local wall-clock reading under that convention.
 */
function localToDt(y: number, mo: number, d: number, h: number, mi: number, tzOffset: number): number {
  const localAsUtc = Date.UTC(y, mo - 1, d, h, mi) / 1000;
  return localAsUtc - tzOffset;
}

/** Parses WeatherAPI's "YYYY-MM-DD HH:mm" (24h, local) datetime strings. */
function parse24h(value: string) {
  const [datePart, timePart] = value.split(" ");
  const [y, mo, d] = datePart.split("-").map(Number);
  const [h, mi] = (timePart ?? "00:00").split(":").map(Number);
  return { y, mo, d, h, mi };
}

/** Parses WeatherAPI's "06:45 AM" astro (sunrise/sunset) time strings. */
function parseAmPm(value: string | undefined): { h: number; mi: number } | null {
  if (!value) return null;
  const m = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const mi = parseInt(m[2], 10);
  const period = m[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return { h, mi };
}

/** Keeps the app's existing internal contract: raw windSpeed is m/s when the
 *  reading was requested as "metric", mph when "imperial" — formatWindSpeed()
 *  elsewhere depends on this, so we convert WeatherAPI's kph down to m/s. */
function windSpeedFor(unit: TempUnit, kph: number | undefined, mph: number | undefined): number {
  return unit === "metric" ? (kph ?? 0) / 3.6 : mph ?? 0;
}

function tempFor(unit: TempUnit, c: number | undefined, f: number | undefined): number {
  return unit === "metric" ? c ?? 0 : f ?? 0;
}

export async function fetchCurrentWeather(
  lat: number,
  lon: number,
  unit: TempUnit
): Promise<CurrentWeather> {
  const key = requireKey();
  // forecast.json with days=1 gives current conditions AND today's astro
  // (sunrise/sunset) and min/max in a single request.
  const { data } = await client.get(`${WEATHERAPI_BASE}/forecast.json`, {
    params: { key, q: `${lat},${lon}`, days: 1, aqi: "no", alerts: "no" },
  });

  const location = data.location ?? {};
  const current = data.current ?? {};
  const today = data.forecast?.forecastday?.[0];
  const tzOffset = tzOffsetSeconds(location.tz_id, Date.now());

  let sunrise = 0;
  let sunset = 0;
  if (today?.astro && today?.date) {
    const [y, mo, d] = today.date.split("-").map(Number);
    const sr = parseAmPm(today.astro.sunrise);
    const ss = parseAmPm(today.astro.sunset);
    if (sr) sunrise = localToDt(y, mo, d, sr.h, sr.mi, tzOffset);
    if (ss) sunset = localToDt(y, mo, d, ss.h, ss.mi, tzOffset);
  }

  return {
    city: location.name ?? "",
    country: location.country ?? "",
    coords: { lat: location.lat ?? lat, lon: location.lon ?? lon },
    temp: tempFor(unit, current.temp_c, current.temp_f),
    feelsLike: tempFor(unit, current.feelslike_c, current.feelslike_f),
    tempMin:
      today?.day?.mintemp_c != null
        ? tempFor(unit, today.day.mintemp_c, today.day.mintemp_f)
        : tempFor(unit, current.temp_c, current.temp_f),
    tempMax:
      today?.day?.maxtemp_c != null
        ? tempFor(unit, today.day.maxtemp_c, today.day.maxtemp_f)
        : tempFor(unit, current.temp_c, current.temp_f),
    condition: current.condition?.text ?? "",
    description: current.condition?.text ?? "",
    icon: encodeIcon(current.condition?.code, current.is_day),
    humidity: current.humidity ?? 0,
    pressure: current.pressure_mb ?? 1013,
    windSpeed: windSpeedFor(unit, current.wind_kph, current.wind_mph),
    windDeg: current.wind_degree ?? 0,
    visibility: Math.round((current.vis_km ?? 10) * 1000),
    clouds: current.cloud ?? 0,
    sunrise,
    sunset,
    dt: Math.floor(Date.now() / 1000),
    timezoneOffset: tzOffset,
  };
}

export async function fetchHourlyForecast(
  lat: number,
  lon: number,
  unit: TempUnit
): Promise<HourlyForecastItem[]> {
  const key = requireKey();
  // days=2 so there are always ≥8 upcoming hours even late in the day.
  const { data } = await client.get(`${WEATHERAPI_BASE}/forecast.json`, {
    params: { key, q: `${lat},${lon}`, days: 2, aqi: "no", alerts: "no" },
  });

  const location = data.location ?? {};
  const tzOffset = tzOffsetSeconds(location.tz_id, Date.now());
  const forecastDays = (data.forecast?.forecastday ?? []) as any[];
  const allHours = forecastDays.flatMap((fd) => fd.hour ?? []);
  const nowLocalMs = Date.now() + tzOffset * 1000;

  const upcoming = allHours.filter((h) => {
    const { y, mo, d, h: hh, mi } = parse24h(h.time);
    const localAsUtcMs = Date.UTC(y, mo - 1, d, hh, mi);
    // 30-minute grace window so the current hour isn't dropped right at the boundary.
    return localAsUtcMs >= nowLocalMs - 30 * 60 * 1000;
  });

  return upcoming.slice(0, 8).map((h) => {
    const { y, mo, d, h: hh, mi } = parse24h(h.time);
    return {
      dt: localToDt(y, mo, d, hh, mi, tzOffset),
      temp: tempFor(unit, h.temp_c, h.temp_f),
      icon: encodeIcon(h.condition?.code, h.is_day),
      condition: h.condition?.text ?? "",
      pop: (h.chance_of_rain ?? 0) / 100,
      windSpeed: windSpeedFor(unit, h.wind_kph, h.wind_mph),
      humidity: h.humidity ?? 0,
    };
  });
}

export async function fetchDailyForecast(
  lat: number,
  lon: number,
  unit: TempUnit
): Promise<DailyForecastItem[]> {
  const key = requireKey();
  // Requested at 5 days; WeatherAPI's free/trial plan caps forecast length
  // (commonly 3 days) — this simply returns however many the plan allows,
  // and the UI already renders whatever length it gets.
  const { data } = await client.get(`${WEATHERAPI_BASE}/forecast.json`, {
    params: { key, q: `${lat},${lon}`, days: 5, aqi: "no", alerts: "no" },
  });

  const location = data.location ?? {};
  const tzOffset = tzOffsetSeconds(location.tz_id, Date.now());
  const forecastDays = (data.forecast?.forecastday ?? []) as any[];

  return forecastDays.map((fd) => {
    const [y, mo, d] = fd.date.split("-").map(Number);
    return {
      dt: localToDt(y, mo, d, 12, 0, tzOffset),
      tempMin: tempFor(unit, fd.day?.mintemp_c, fd.day?.mintemp_f),
      tempMax: tempFor(unit, fd.day?.maxtemp_c, fd.day?.maxtemp_f),
      icon: encodeIcon(fd.day?.condition?.code, 1),
      condition: fd.day?.condition?.text ?? "",
      pop: (fd.day?.daily_chance_of_rain ?? 0) / 100,
      windSpeed: windSpeedFor(unit, fd.day?.maxwind_kph, fd.day?.maxwind_mph),
      humidity: fd.day?.avghumidity ?? 0,
    };
  });
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQuality> {
  const key = requireKey();
  const { data } = await client.get(`${WEATHERAPI_BASE}/current.json`, {
    params: { key, q: `${lat},${lon}`, aqi: "yes" },
  });
  const aq = data.current?.air_quality ?? {};
  // WeatherAPI's US EPA index runs 1 (Good) – 6 (Hazardous); this app's
  // aqiLabel() scale runs 1 (Good) – 5 (Very Poor), so the top tier is capped.
  const epaIndex = Math.round(aq["us-epa-index"] ?? 1);

  return {
    aqi: Math.min(Math.max(epaIndex, 1), 5),
    co: aq.co ?? 0,
    no2: aq.no2 ?? 0,
    o3: aq.o3 ?? 0,
    pm2_5: aq.pm2_5 ?? 0,
    pm10: aq.pm10 ?? 0,
  };
}

export async function geocodeCity(query: string): Promise<GeoResult[]> {
  const key = requireKey();
  const { data } = await client.get(`${WEATHERAPI_BASE}/search.json`, {
    params: { key, q: query },
  });
  return (data as any[]).map((d) => ({
    name: d.name,
    country: d.country,
    state: d.region || undefined,
    lat: d.lat,
    lon: d.lon,
  }));
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeoResult | null> {
  const key = requireKey();
  // WeatherAPI's search/autocomplete endpoint also accepts "lat,lon" and
  // resolves it to the nearest known place — its documented reverse-geocoding path.
  const { data } = await client.get(`${WEATHERAPI_BASE}/search.json`, {
    params: { key, q: `${lat},${lon}` },
  });
  const d = (data as any[])[0];
  if (!d) return null;
  return { name: d.name, country: d.country, state: d.region || undefined, lat: d.lat, lon: d.lon };
}
