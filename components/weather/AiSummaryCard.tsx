"use client";

import { Shirt, Sparkles, Umbrella, Wind } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { CurrentWeather, TempUnit } from "@/types/weather";
import { generateWeatherSummary } from "@/utils/weather";

interface Props {
  weather: CurrentWeather;
  unit: TempUnit;
}

export function AiSummaryCard({ weather, unit }: Props) {
  const { summary, clothing, umbrella, activity } = generateWeatherSummary({
    condition: weather.condition,
    temp: weather.temp,
    feelsLike: weather.feelsLike,
    windSpeed: weather.windSpeed,
    humidity: weather.humidity,
    unit,
  });

  return (
    <GlassCard
      glow="cyan"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Today&apos;s Summary</h3>
      </div>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{summary}</p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-start gap-2 rounded-2xl border border-black/[0.06] bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]">
          <Shirt className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
          <p className="text-xs text-slate-500 dark:text-slate-400">{clothing}</p>
        </div>
        <div className="flex items-start gap-2 rounded-2xl border border-black/[0.06] bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]">
          <Umbrella className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {umbrella ? "Bring an umbrella today." : "No umbrella needed today."}
          </p>
        </div>
        <div className="flex items-start gap-2 rounded-2xl border border-black/[0.06] bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]">
          <Wind className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <p className="text-xs text-slate-500 dark:text-slate-400">{activity}</p>
        </div>
      </div>
    </GlassCard>
  );
}
