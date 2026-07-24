"use client";

import {
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  Cloud,
  ShieldAlert,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { AirQuality, CurrentWeather, TempUnit, WindUnit } from "@/types/weather";
import { aqiLabel, formatTemp, formatTime, formatWindSpeed, visibilityKm } from "@/utils/weather";

interface Props {
  weather: CurrentWeather;
  aqi: AirQuality | null;
  unit: TempUnit;
  windUnit: WindUnit;
}

export function HighlightsGrid({ weather, aqi, unit, windUnit }: Props) {
  const items = [
    {
      label: "Feels Like",
      value: formatTemp(weather.feelsLike, unit),
      icon: Thermometer,
      color: "text-blue-400",
    },
    {
      label: "Humidity",
      value: `${weather.humidity}%`,
      icon: Droplets,
      color: "text-cyan-400",
    },
    {
      label: "Wind Speed",
      value: formatWindSpeed(weather.windSpeed, unit, windUnit),
      icon: Wind,
      color: "text-blue-300",
    },
    {
      label: "Pressure",
      value: `${weather.pressure} hPa`,
      icon: Gauge,
      color: "text-rose-400",
    },
    {
      label: "Visibility",
      value: visibilityKm(weather.visibility),
      icon: Eye,
      color: "text-cyan-300",
    },
    {
      label: "Cloud Cover",
      value: `${weather.clouds}%`,
      icon: Cloud,
      color: "text-slate-500 dark:text-slate-300",
    },
    {
      label: "Sunrise",
      value: formatTime(weather.sunrise, weather.timezoneOffset),
      icon: Sunrise,
      color: "text-amber-400",
    },
    {
      label: "Sunset",
      value: formatTime(weather.sunset, weather.timezoneOffset),
      icon: Sunset,
      color: "text-orange-400",
    },
    {
      label: "Air Quality",
      value: aqi ? aqiLabel(aqi.aqi).label : "—",
      icon: ShieldAlert,
      color: aqi ? aqiLabel(aqi.aqi).color : "text-slate-500",
    },
  ];

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Today&apos;s Highlights</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item, i) => (
          <GlassCard
            key={item.label}
            glow="cyan"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="p-4 sm:p-5"
          >
            <div className="mb-3 flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-xs font-medium uppercase tracking-wide">{item.label}</span>
            </div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">{item.value}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
