"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import {
  Droplets,
  Eye,
  Gauge,
  MapPin,
  ThermometerSun,
  Wind,
} from "lucide-react";
import type { CurrentWeather, TempUnit, WindUnit } from "@/types/weather";
import { formatTemp, formatTime, formatWindSpeed, visibilityKm } from "@/utils/weather";

export interface MapMarkerData {
  lat: number;
  lon: number;
  city: string;
  country: string;
  state?: string;
  current: CurrentWeather | null;
  unit: TempUnit;
  windUnit: WindUnit;
}

interface WorldMapProps {
  marker: MapMarkerData | null;
  flyToSignal: number;
  onMapReady?: (recenter: () => void) => void;
}

const WORLD_CENTER: [number, number] = [20, 0];
const WORLD_ZOOM = 2;
const FOCUS_ZOOM = 9;

function buildPulseIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:26px;height:26px;">
        <div class="skyline-marker-pulse" style="position:absolute;inset:0;border-radius:9999px;background:rgba(34,211,238,0.55);"></div>
        <div style="position:absolute;inset:6px;border-radius:9999px;background:#22d3ee;border:2px solid white;box-shadow:0 0 12px rgba(34,211,238,0.8);"></div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  });
}

/** Runs inside the Leaflet context to fly to new coordinates and expose a recenter handle. */
function MapController({
  marker,
  flyToSignal,
  onMapReady,
}: {
  marker: MapMarkerData | null;
  flyToSignal: number;
  onMapReady?: (recenter: () => void) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!marker) return;
    map.flyTo([marker.lat, marker.lon], FOCUS_ZOOM, { duration: 1.4 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyToSignal]);

  useEffect(() => {
    if (!onMapReady) return;
    onMapReady(() => {
      if (marker) {
        map.flyTo([marker.lat, marker.lon], FOCUS_ZOOM, { duration: 1 });
      } else {
        map.flyTo(WORLD_CENTER, WORLD_ZOOM, { duration: 1 });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marker, onMapReady]);

  return null;
}

export function WorldMap({ marker, flyToSignal, onMapReady }: WorldMapProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const icon = useMemo(() => buildPulseIcon(), []);

  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const c = marker?.current;

  return (
    <MapContainer
      center={marker ? [marker.lat, marker.lon] : WORLD_CENTER}
      zoom={marker ? FOCUS_ZOOM : WORLD_ZOOM}
      minZoom={2}
      worldCopyJump
      zoomControl={false}
      scrollWheelZoom
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer key={tileUrl} url={tileUrl} attribution={attribution} />
      <ZoomControl position="bottomright" />
      <MapController marker={marker} flyToSignal={flyToSignal} onMapReady={onMapReady} />

      {marker && (
        <Marker position={[marker.lat, marker.lon]} icon={icon}>
          <Popup>
            <div className="w-60 rounded-2xl border border-white/10 bg-[#0a0f1c]/95 p-4 text-slate-100 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <MapPin className="h-3.5 w-3.5" />
                <p className="text-xs font-medium uppercase tracking-wide">
                  {marker.city}
                  {marker.state ? `, ${marker.state}` : ""}, {marker.country}
                </p>
              </div>

              {c ? (
                <>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-3xl font-semibold text-white">
                      {formatTemp(c.temp, marker.unit)}
                    </span>
                    <span className="mb-1 text-xs capitalize text-slate-400">
                      {c.description}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <ThermometerSun className="h-3.5 w-3.5 text-slate-500" />
                      Feels {formatTemp(c.feelsLike, marker.unit)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Droplets className="h-3.5 w-3.5 text-slate-500" />
                      {c.humidity}% humidity
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-slate-500" />
                      {c.pressure} hPa
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wind className="h-3.5 w-3.5 text-slate-500" />
                      {formatWindSpeed(c.windSpeed, marker.unit, marker.windUnit)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-slate-500" />
                      {visibilityKm(c.visibility)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      {formatTime(c.dt, c.timezoneOffset)} local
                    </div>
                  </div>

                  <div className="mt-3 border-t border-white/10 pt-2 text-[11px] text-slate-500">
                    {marker.lat.toFixed(3)}, {marker.lon.toFixed(3)}
                  </div>
                </>
              ) : (
                <p className="mt-2 text-xs text-slate-400">Loading conditions…</p>
              )}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
