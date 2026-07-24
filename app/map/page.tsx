"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Droplets,
  Eye,
  Gauge,
  Globe2,
  Info,
  LocateFixed,
  MapPin,
  ThermometerSun,
  Wind,
} from "lucide-react";
import { SearchBar } from "@/components/weather/SearchBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ErrorState, SkeletonCard } from "@/components/ui/States";
import { useLocationContext } from "@/contexts/LocationContext";
import { reverseGeocode } from "@/services/weatherService";
import type { MapMarkerData } from "@/components/map/WorldMap";
import { formatTemp, formatTime, formatWindSpeed, visibilityKm } from "@/utils/weather";

const WorldMap = dynamic(
  () => import("@/components/map/WorldMap").then((m) => m.WorldMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-[#0a0f1c]">
        <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-600">
          <Globe2 className="h-8 w-8 animate-pulse" />
          <span className="text-xs">Loading world map…</span>
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  const {
    coords,
    unit,
    windUnit,
    current,
    loading,
    error,
    reload,
    selectCity,
    useMyLocation,
    locating,
    recents,
  } = useLocationContext();

  const [placeName, setPlaceName] = useState<{ city: string; country: string; state?: string } | null>(
    null
  );
  const [flyToSignal, setFlyToSignal] = useState(0);
  const recenterRef = useRef<(() => void) | null>(null);
  const lastCoordsKey = useRef<string | null>(null);

  // Whenever coords change (search, geolocation, recent, or initial hydration),
  // bump the fly-to signal once per unique location and resolve state/region.
  useEffect(() => {
    if (!coords) return;
    const key = `${coords.lat.toFixed(4)},${coords.lon.toFixed(4)}`;
    if (key === lastCoordsKey.current) return;
    lastCoordsKey.current = key;
    setFlyToSignal((n) => n + 1);

    let cancelled = false;
    reverseGeocode(coords.lat, coords.lon)
      .then((res) => {
        if (cancelled) return;
        if (res) {
          setPlaceName({ city: res.name, country: res.country, state: res.state });
        }
      })
      .catch(() => {
        /* non-fatal: popup falls back to weather API's city/country */
      });
    return () => {
      cancelled = true;
    };
  }, [coords]);

  const handleMapReady = useCallback((recenter: () => void) => {
    recenterRef.current = recenter;
  }, []);

  const marker: MapMarkerData | null = coords
    ? {
        lat: coords.lat,
        lon: coords.lon,
        city: placeName?.city ?? current?.city ?? "Selected location",
        country: placeName?.country ?? current?.country ?? "",
        state: placeName?.state,
        current,
        unit,
        windUnit,
      }
    : null;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-300">
          <Globe2 className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Weather Map</span>
        </div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Explore the world
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => recenterRef.current?.()}
              disabled={!coords}
            >
              <Compass className="h-4 w-4" />
              Recenter
            </Button>
            <Button variant="ghost" size="sm" onClick={useMyLocation} disabled={locating}>
              <LocateFixed className="h-4 w-4" />
              {locating ? "Locating…" : "My location"}
            </Button>
          </div>
        </div>
        <SearchBar onSelectCity={selectCity} onUseLocation={useMyLocation} locating={locating} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard glow="cyan" className="overflow-hidden p-0 lg:col-span-2">
          <div className="h-[380px] w-full sm:h-[460px] lg:h-[600px]">
            <WorldMap marker={marker} flyToSignal={flyToSignal} onMapReady={handleMapReady} />
          </div>
        </GlassCard>

        <div className="space-y-4">
          {!coords && (
            <GlassCard glow="none" className="flex flex-col items-center gap-3 p-8 text-center">
              <Globe2 className="h-10 w-10 text-slate-400 dark:text-slate-600" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Search anywhere in the world
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Country, state, city, town, or village — the map will fly right to it.
                </p>
              </div>
            </GlassCard>
          )}

          {coords && loading && <SkeletonCard />}

          {coords && !loading && error && <ErrorState message={error} onRetry={reload} />}

          {coords && !loading && !error && current && (
            <motion.div
              key={`${coords.lat}-${coords.lon}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <GlassCard glow="blue" className="p-5">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5" />
                  <p className="text-xs font-medium uppercase tracking-wide">
                    {marker?.city}
                    {marker?.state ? `, ${marker.state}` : ""}, {marker?.country}
                  </p>
                </div>
                <div className="mt-1 flex items-end gap-2">
                  <span className="text-4xl font-semibold text-slate-900 dark:text-white">
                    {formatTemp(current.temp, unit)}
                  </span>
                  <span className="mb-1 text-sm capitalize text-slate-500 dark:text-slate-400">
                    {current.description}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    Feels {formatTemp(current.feelsLike, unit)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    {current.humidity}% humidity
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    {current.pressure} hPa
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    {formatWindSpeed(current.windSpeed, unit, windUnit)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    {visibilityKm(current.visibility)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Compass className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    {formatTime(current.dt, current.timezoneOffset)} local
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3 text-xs text-slate-500 dark:border-white/10 dark:text-slate-500">
                  <span>Lat {coords.lat.toFixed(3)}</span>
                  <span>Lon {coords.lon.toFixed(3)}</span>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {recents.length > 0 && (
            <GlassCard glow="none" className="p-5">
              <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Jump to a recent search
              </p>
              <div className="flex flex-wrap gap-2">
                {recents.map((r) => (
                  <button
                    key={`${r.name}-${r.country}`}
                    onClick={() => selectCity({ name: r.name, country: r.country, lat: r.lat, lon: r.lon })}
                    className="rounded-xl border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </GlassCard>
          )}

          <GlassCard glow="none" className="flex gap-3 p-5">
            <Info className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-500">
              Powered by OpenStreetMap tiles with a live Leaflet map — drag, scroll to zoom,
              and tap the marker for full conditions.
            </p>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
