"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/weather/Hero";
import { WeatherBackground } from "@/components/weather/WeatherBackground";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { HighlightsGrid } from "@/components/weather/HighlightsGrid";
import { AiSummaryCard } from "@/components/weather/AiSummaryCard";
import { UnitToggle } from "@/components/weather/UnitToggle";
import { SkeletonCard, ErrorState, EmptyState } from "@/components/ui/States";
import { useLocationContext } from "@/contexts/LocationContext";
import { useFavorites } from "@/hooks/useFavorites";
import { resolveWeatherScene } from "@/utils/weather";

export default function HomePage() {
  const {
    coords,
    unit,
    setUnit,
    windUnit,
    selectCity,
    useMyLocation,
    locating,
    current,
    hourly,
    daily,
    aqi,
    loading,
    error,
    reload,
  } = useLocationContext();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const scene = resolveWeatherScene(current);

  const handleToggleFavorite = () => {
    if (!current) return;
    if (isFavorite(current.city, current.country)) {
      removeFavorite(current.city, current.country);
    } else {
      addFavorite({
        name: current.city,
        country: current.country,
        lat: current.coords.lat,
        lon: current.coords.lon,
      });
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <WeatherBackground scene={scene} />

      <Hero onSelectCity={selectCity} onUseLocation={useMyLocation} locating={locating} />

      <section
        id="current"
        className="mx-auto max-w-6xl space-y-10 px-4 pb-24 sm:px-6 lg:px-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Current Conditions
          </h2>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>

        {loading && !current && <SkeletonCard />}
        {error && !loading && <ErrorState message={error} onRetry={reload} />}
        {!coords && !loading && !error && <EmptyState />}

        {current && (
          <motion.div initial="hidden" animate="visible" className="space-y-10">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CurrentWeatherCard
                  weather={current}
                  unit={unit}
                  isFavorite={isFavorite(current.city, current.country)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
              <AiSummaryCard weather={current} unit={unit} />
            </div>

            <HighlightsGrid weather={current} aqi={aqi} unit={unit} windUnit={windUnit} />

            {(hourly.length > 0 || daily.length > 0) && (
              <Link
                href="/forecast"
                className="group flex items-center justify-between rounded-3xl border border-black/[0.06] bg-white/70 p-5 backdrop-blur-xl transition-colors hover:border-cyan-500/30 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-400/30"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    See the full hourly &amp; 5-day forecast
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Hour-by-hour precipitation, highs and lows
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-cyan-600 transition-transform group-hover:translate-x-1 dark:text-cyan-300" />
              </Link>
            )}
          </motion.div>
        )}
      </section>
    </main>
  );
}
