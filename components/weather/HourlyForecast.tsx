"use client";

import { motion } from "framer-motion";
import { Droplets, Wind } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { WeatherIcon } from "./WeatherIcon";
import type { HourlyForecastItem, TempUnit, WindUnit } from "@/types/weather";
import { formatHour, formatWindSpeed } from "@/utils/weather";

interface Props {
  hourly: HourlyForecastItem[];
  unit: TempUnit;
  windUnit: WindUnit;
  tzOffset: number;
}

export function HourlyForecast({ hourly, unit, windUnit, tzOffset }: Props) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Hourly Forecast</h2>
      <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2">
        {hourly.map((h, i) => (
          <GlassCard
            key={h.dt}
            glow="blue"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="flex min-w-[104px] shrink-0 flex-col items-center gap-1.5 p-4"
          >
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {i === 0 ? "Now" : formatHour(h.dt, tzOffset)}
            </span>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
            >
              <WeatherIcon code={h.icon} className="h-8 w-8 text-cyan-300" />
            </motion.div>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">
              {Math.round(h.temp)}°{unit === "metric" ? "C" : "F"}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-blue-300">
              <Droplets className="h-3 w-3" />
              {Math.round(h.pop * 100)}%
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-500">
              <Wind className="h-3 w-3" />
              {formatWindSpeed(h.windSpeed, unit, windUnit)}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
