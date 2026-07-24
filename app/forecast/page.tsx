"use client";

import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { DailyForecast } from "@/components/weather/DailyForecast";
import { SearchBar } from "@/components/weather/SearchBar";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { UnitToggle } from "@/components/weather/UnitToggle";
import { SkeletonCard, ErrorState, EmptyState } from "@/components/ui/States";
import { useLocationContext } from "@/contexts/LocationContext";
import { formatTemp } from "@/utils/weather";

export default function ForecastPage() {
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
    loading,
    error,
    reload,
  } = useLocationContext();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-300">
          <CalendarDays className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Forecast</span>
        </div>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Hourly &amp; 5-day outlook
            </h1>
            {current && (
              <p className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <WeatherIcon code={current.icon} className="h-5 w-5 text-cyan-500 dark:text-cyan-300" />
                {current.city}, {current.country} · {formatTemp(current.temp, unit)}
              </p>
            )}
          </div>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <SearchBar onSelectCity={selectCity} onUseLocation={useMyLocation} locating={locating} />
      </div>

      {loading && !current && <SkeletonCard />}
      {error && !loading && <ErrorState message={error} onRetry={reload} />}
      {!coords && !loading && !error && <EmptyState />}

      {current && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          {hourly.length > 0 && (
            <HourlyForecast hourly={hourly} unit={unit} windUnit={windUnit} tzOffset={current.timezoneOffset} />
          )}
          {daily.length > 0 && (
            <DailyForecast daily={daily} unit={unit} windUnit={windUnit} tzOffset={current.timezoneOffset} />
          )}
        </motion.div>
      )}
    </main>
  );
}
