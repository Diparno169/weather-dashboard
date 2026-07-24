"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeatherForCoords } from "@/hooks/useWeather";
import {
  LAST_LOCATION_KEY,
  MAX_RECENTS,
  RECENTS_STORAGE_KEY,
  UNIT_STORAGE_KEY,
  WIND_UNIT_STORAGE_KEY,
} from "@/constants";
import type { Coordinates, GeoResult, TempUnit, WindUnit } from "@/types/weather";

export interface RecentSearch extends Coordinates {
  name: string;
  country: string;
}

interface LocationContextValue {
  coords: Coordinates | null;
  unit: TempUnit;
  setUnit: (unit: TempUnit) => void;
  windUnit: WindUnit;
  setWindUnit: (unit: WindUnit) => void;
  resetPreferences: () => void;
  selectCity: (result: GeoResult) => void;
  useMyLocation: () => void;
  locating: boolean;
  geoError: string | null;
  recents: RecentSearch[];
  clearRecents: () => void;
  removeRecent: (name: string, country: string) => void;
  current: ReturnType<typeof useWeatherForCoords>["current"];
  hourly: ReturnType<typeof useWeatherForCoords>["hourly"];
  daily: ReturnType<typeof useWeatherForCoords>["daily"];
  aqi: ReturnType<typeof useWeatherForCoords>["aqi"];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [unit, setUnitState] = useState<TempUnit>("metric");
  const [windUnit, setWindUnitState] = useState<WindUnit>("kmh");
  const [recents, setRecents] = useState<RecentSearch[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const geo = useGeolocation();

  const { current, hourly, daily, aqi, loading, error, load } = useWeatherForCoords(
    coords?.lat ?? null,
    coords?.lon ?? null,
    unit
  );

  // Hydrate persisted state on mount (unit, last-viewed city, recents).
  useEffect(() => {
    try {
      const savedUnit = localStorage.getItem(UNIT_STORAGE_KEY) as TempUnit | null;
      if (savedUnit) setUnitState(savedUnit);

      const savedWindUnit = localStorage.getItem(WIND_UNIT_STORAGE_KEY) as WindUnit | null;
      if (savedWindUnit) setWindUnitState(savedWindUnit);

      const savedLocation = localStorage.getItem(LAST_LOCATION_KEY);
      if (savedLocation) setCoords(JSON.parse(savedLocation));

      const savedRecents = localStorage.getItem(RECENTS_STORAGE_KEY);
      if (savedRecents) setRecents(JSON.parse(savedRecents));
    } catch {
      // ignore corrupted storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (geo.coords) setCoords(geo.coords);
  }, [geo.coords]);

  useEffect(() => {
    if (coords && hydrated) {
      localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(coords));
    }
  }, [coords, hydrated]);

  const setUnit = useCallback((u: TempUnit) => {
    setUnitState(u);
    localStorage.setItem(UNIT_STORAGE_KEY, u);
  }, []);

  const setWindUnit = useCallback((u: WindUnit) => {
    setWindUnitState(u);
    localStorage.setItem(WIND_UNIT_STORAGE_KEY, u);
  }, []);

  /** Resets temperature/wind preferences to defaults immediately — no reload required. */
  const resetPreferences = useCallback(() => {
    setUnitState("metric");
    setWindUnitState("kmh");
    localStorage.setItem(UNIT_STORAGE_KEY, "metric");
    localStorage.setItem(WIND_UNIT_STORAGE_KEY, "kmh");
  }, []);

  const pushRecent = useCallback((entry: RecentSearch) => {
    setRecents((prev) => {
      const filtered = prev.filter(
        (r) => !(r.name === entry.name && r.country === entry.country)
      );
      const next = [entry, ...filtered].slice(0, MAX_RECENTS);
      localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const selectCity = useCallback(
    (result: GeoResult) => {
      setCoords({ lat: result.lat, lon: result.lon });
      pushRecent({
        name: result.name,
        country: result.country,
        lat: result.lat,
        lon: result.lon,
      });
    },
    [pushRecent]
  );

  const useMyLocation = useCallback(() => geo.locate(), [geo]);

  const clearRecents = useCallback(() => {
    setRecents([]);
    localStorage.removeItem(RECENTS_STORAGE_KEY);
  }, []);

  const removeRecent = useCallback((name: string, country: string) => {
    setRecents((prev) => {
      const next = prev.filter((r) => !(r.name === name && r.country === country));
      localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reload = useCallback(() => {
    if (coords) load(coords.lat, coords.lon);
  }, [coords, load]);

  const value = useMemo<LocationContextValue>(
    () => ({
      coords,
      unit,
      setUnit,
      windUnit,
      setWindUnit,
      resetPreferences,
      selectCity,
      useMyLocation,
      locating: geo.loading,
      geoError: geo.error,
      recents,
      clearRecents,
      removeRecent,
      current,
      hourly,
      daily,
      aqi,
      loading,
      error,
      reload,
    }),
    [
      coords,
      unit,
      setUnit,
      windUnit,
      setWindUnit,
      resetPreferences,
      selectCity,
      useMyLocation,
      geo.loading,
      geo.error,
      recents,
      clearRecents,
      removeRecent,
      current,
      hourly,
      daily,
      aqi,
      loading,
      error,
      reload,
    ]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return ctx;
}
