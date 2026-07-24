"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchCurrentWeather,
  fetchDailyForecast,
  fetchHourlyForecast,
  fetchAirQuality,
} from "@/services/weatherService";
import type {
  AirQuality,
  CurrentWeather,
  DailyForecastItem,
  HourlyForecastItem,
  TempUnit,
} from "@/types/weather";

interface WeatherBundle {
  current: CurrentWeather | null;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  aqi: AirQuality | null;
  loading: boolean;
  error: string | null;
}

export function useWeather(unit: TempUnit) {
  const [bundle, setBundle] = useState<WeatherBundle>({
    current: null,
    hourly: [],
    daily: [],
    aqi: null,
    loading: false,
    error: null,
  });

  const load = useCallback(
    async (lat: number, lon: number) => {
      setBundle((b) => ({ ...b, loading: true, error: null }));
      try {
        const [current, hourly, daily, aqi] = await Promise.all([
          fetchCurrentWeather(lat, lon, unit),
          fetchHourlyForecast(lat, lon, unit),
          fetchDailyForecast(lat, lon, unit),
          fetchAirQuality(lat, lon).catch(() => null),
        ]);
        setBundle({ current, hourly, daily, aqi, loading: false, error: null });
      } catch (err: any) {
        setBundle((b) => ({
          ...b,
          loading: false,
          error: err?.message ?? "Failed to load weather data.",
        }));
      }
    },
    [unit]
  );

  return { ...bundle, load };
}

/** Refetches automatically whenever coords or unit change. */
export function useWeatherForCoords(
  lat: number | null,
  lon: number | null,
  unit: TempUnit
) {
  const weather = useWeather(unit);

  useEffect(() => {
    if (lat != null && lon != null) {
      weather.load(lat, lon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon, unit]);

  return weather;
}
