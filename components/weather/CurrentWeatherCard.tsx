"use client";

import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { WeatherIcon } from "./WeatherIcon";
import type { CurrentWeather, TempUnit } from "@/types/weather";
import { formatFullDate, formatTemp, formatTime } from "@/utils/weather";
import { cn } from "@/lib/utils";

interface Props {
  weather: CurrentWeather;
  unit: TempUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function CurrentWeatherCard({ weather, unit, isFavorite, onToggleFavorite }: Props) {
  return (
    <GlassCard
      glow="blue"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500/20 blur-[90px]" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <MapPin className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium">
              {weather.city}, {weather.country}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            {formatFullDate(weather.dt, weather.timezoneOffset)} ·{" "}
            {formatTime(weather.dt, weather.timezoneOffset)}
          </p>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-6xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-7xl">
              {Math.round(weather.temp)}°
            </span>
            <div className="mb-2">
              <p className="text-lg font-medium capitalize text-slate-700 dark:text-slate-200">
                {weather.description}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Feels like {formatTemp(weather.feelsLike, unit)}
              </p>
            </div>
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            H: {formatTemp(weather.tempMax, unit)} · L: {formatTemp(weather.tempMin, unit)}
          </p>
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <WeatherIcon
              code={weather.icon}
              className="h-24 w-24 text-cyan-300 drop-shadow-[0_0_25px_rgba(34,211,238,0.5)] sm:h-28 sm:w-28"
            />
          </motion.div>

          <button
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-black/5 transition-colors hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-400 dark:text-slate-400"
              )}
            />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
