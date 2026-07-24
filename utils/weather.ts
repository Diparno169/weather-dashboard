import type { WeatherScene, TempUnit, WindUnit } from "@/types/weather";

/** Maps a condition keyword + day/night icon suffix to a background scene. */
export function getWeatherScene(iconCode: string, weatherId: number): WeatherScene {
  const isNight = iconCode.endsWith("n");

  if (weatherId >= 200 && weatherId < 300) return "thunderstorm";
  if (weatherId >= 300 && weatherId < 600) return "rain";
  if (weatherId >= 600 && weatherId < 700) return "snow";
  if (weatherId >= 700 && weatherId < 800) return "mist";
  if (weatherId === 800) return isNight ? "clear-night" : "clear-day";
  return "clouds";
}

/** Resolves the animated background scene for a given current-weather reading. */
export function resolveWeatherScene(weather: { icon: string; condition: string } | null): WeatherScene {
  if (!weather) return "clear-night";
  const c = weather.condition.toLowerCase();
  const weatherId = c.includes("thunder")
    ? 200
    : c.includes("drizzle")
    ? 300
    : c.includes("rain")
    ? 500
    : c.includes("snow")
    ? 600
    : c.includes("mist") || c.includes("fog") || c.includes("haze")
    ? 700
    : c.includes("cloud")
    ? 801
    : 800;
  return getWeatherScene(weather.icon, weatherId);
}

export function formatTemp(temp: number, unit: TempUnit): string {
  return `${Math.round(temp)}°${unit === "metric" ? "C" : "F"}`;
}

/**
 * The app's internal contract: raw windSpeed is m/s when the reading was
 * requested as "metric", mph when "imperial" — weatherService.ts converts
 * WeatherAPI's kph/mph fields into this shape on the way in.
 * `sourceUnit` describes what the raw number already is; `displayUnit` is
 * the person's independent preference from Settings.
 */
export function formatWindSpeed(
  speed: number,
  sourceUnit: TempUnit,
  displayUnit: WindUnit = sourceUnit === "metric" ? "kmh" : "mph"
): string {
  const metersPerSecond = sourceUnit === "metric" ? speed : speed * 0.44704;

  switch (displayUnit) {
    case "ms":
      return `${metersPerSecond.toFixed(1)} m/s`;
    case "mph":
      return `${Math.round(metersPerSecond * 2.23694)} mph`;
    case "kmh":
    default:
      return `${Math.round(metersPerSecond * 3.6)} km/h`;
  }
}

export function formatTime(unixSeconds: number, tzOffsetSeconds = 0): string {
  const date = new Date((unixSeconds + tzOffsetSeconds) * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

export function formatHour(unixSeconds: number, tzOffsetSeconds = 0): string {
  const date = new Date((unixSeconds + tzOffsetSeconds) * 1000);
  return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true, timeZone: "UTC" });
}

export function formatDay(unixSeconds: number, tzOffsetSeconds = 0): string {
  const date = new Date((unixSeconds + tzOffsetSeconds) * 1000);
  return date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}

export function formatFullDate(unixSeconds: number, tzOffsetSeconds = 0): string {
  const date = new Date((unixSeconds + tzOffsetSeconds) * 1000);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function visibilityKm(meters: number): string {
  return `${(meters / 1000).toFixed(1)} km`;
}

export function aqiLabel(aqi: number): { label: string; color: string } {
  switch (aqi) {
    case 1:
      return { label: "Good", color: "text-emerald-400" };
    case 2:
      return { label: "Fair", color: "text-cyan-400" };
    case 3:
      return { label: "Moderate", color: "text-amber-400" };
    case 4:
      return { label: "Poor", color: "text-orange-500" };
    case 5:
      return { label: "Very Poor", color: "text-garnet-500" };
    default:
      return { label: "Unknown", color: "text-slate-400" };
  }
}

/** Simple rule-based natural-language summary — no external AI call required. */
export function generateWeatherSummary(params: {
  condition: string;
  temp: number;
  feelsLike: number;
  windSpeed: number;
  humidity: number;
  unit: TempUnit;
}): { summary: string; clothing: string; umbrella: boolean; activity: string } {
  const { condition, temp, windSpeed, humidity, unit } = params;
  const c = condition.toLowerCase();
  const isCold = unit === "metric" ? temp < 10 : temp < 50;
  const isHot = unit === "metric" ? temp > 28 : temp > 82;
  const rainy = c.includes("rain") || c.includes("drizzle") || c.includes("thunder");
  const windy = unit === "metric" ? windSpeed * 3.6 > 25 : windSpeed > 15;

  let summary = `It's currently ${condition.toLowerCase()} with a temperature around ${Math.round(
    temp
  )}°${unit === "metric" ? "C" : "F"}.`;
  if (rainy) summary += " Expect wet conditions through the day.";
  else if (isHot) summary += " A warm one — stay hydrated.";
  else if (isCold) summary += " Bundle up, it's chilly out there.";
  else summary += " Conditions look pleasant overall.";
  if (humidity > 75) summary += " Humidity is on the higher side.";

  const clothing = isCold
    ? "Layer up with a warm coat, scarf, and gloves."
    : isHot
    ? "Light, breathable clothing and sunglasses recommended."
    : rainy
    ? "A waterproof jacket will keep you comfortable."
    : "A light jacket or sweater should be perfect.";

  const activity = rainy
    ? "Great day for indoor plans — museums, cafés, or a movie."
    : windy
    ? "Fine for a walk, but secure loose items if you're outdoors long."
    : isHot
    ? "Best for early morning or evening outdoor activities."
    : "Ideal conditions for outdoor activities like a run or a park visit.";

  return { summary, clothing, umbrella: rainy, activity };
}
