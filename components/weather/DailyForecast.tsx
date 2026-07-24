"use client";

import { Droplets, Wind, Waves } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { WeatherIcon } from "./WeatherIcon";
import type { DailyForecastItem, TempUnit, WindUnit } from "@/types/weather";
import { formatDay, formatWindSpeed } from "@/utils/weather";

interface Props {
  daily: DailyForecastItem[];
  unit: TempUnit;
  windUnit: WindUnit;
  tzOffset: number;
}

export function DailyForecast({ daily, unit, windUnit, tzOffset }: Props) {
  return (
    <div id="forecast">
      <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">5-Day Forecast</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {daily.map((d, i) => (
          <GlassCard
            key={d.dt}
            glow="garnet"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="flex flex-col gap-3 p-4 sm:text-center"
          >
            <div className="flex items-center justify-between sm:flex-col sm:gap-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {i === 0 ? "Today" : formatDay(d.dt, tzOffset)}
              </span>
              <WeatherIcon code={d.icon} className="h-9 w-9 text-cyan-300" />
              <div className="flex items-center gap-2 text-sm sm:flex-col sm:gap-0.5">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {Math.round(d.tempMax)}°{unit === "metric" ? "C" : "F"}
                </span>
                <span className="text-slate-500 dark:text-slate-500">
                  {Math.round(d.tempMin)}°{unit === "metric" ? "C" : "F"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-black/[0.06] pt-3 text-[11px] text-slate-500 dark:border-white/10 dark:text-slate-400 sm:text-center">
              <div className="flex items-center gap-1 sm:flex-col sm:gap-0.5">
                <Droplets className="h-3.5 w-3.5 text-blue-400" />
                {Math.round(d.pop * 100)}%
              </div>
              <div className="flex items-center gap-1 sm:flex-col sm:gap-0.5">
                <Wind className="h-3.5 w-3.5" />
                {formatWindSpeed(d.windSpeed, unit, windUnit)}
              </div>
              <div className="flex items-center gap-1 sm:flex-col sm:gap-0.5">
                <Waves className="h-3.5 w-3.5" />
                {d.humidity}%
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
