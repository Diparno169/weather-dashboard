"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Laptop,
  Trash2,
  MapPin,
  RotateCcw,
  Download,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useLocationContext } from "@/contexts/LocationContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { cn } from "@/lib/utils";
import type { WindUnit } from "@/types/weather";

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{title}</p>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function SegButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-blue-500 text-white shadow-[0_0_16px_-2px_rgba(59,130,246,0.7)]"
          : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      )}
    >
      {children}
    </button>
  );
}

export default function SettingsPage() {
  const { unit, setUnit, windUnit, setWindUnit, resetPreferences, useMyLocation, locating, clearRecents } =
    useLocationContext();
  const { favorites, persist } = useFavorites();
  const { theme, setTheme } = useTheme();
  const { canInstall, promptInstall } = useInstallPrompt();
  const [mounted, setMounted] = useState(false);
  const [cleared, setCleared] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const flash = (msg: string) => {
    setCleared(msg);
    setTimeout(() => setCleared(null), 2500);
  };

  const handleResetSettings = () => {
    resetPreferences();
    setTheme("system");
    flash("Settings reset to defaults");
  };

  const handleClearEverything = () => {
    localStorage.clear();
    resetPreferences();
    persist([]);
    clearRecents();
    setTheme("system");
    flash("All local data cleared");
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-300">
          <SettingsIcon className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Settings</span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Preferences
        </h1>
      </div>

      <GlassCard glow="none" className="divide-y divide-black/[0.06] p-6 dark:divide-white/10">
        <Row title="Temperature unit" description="Applies across the whole app">
          <div className="inline-flex rounded-2xl border border-black/[0.06] bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.04]">
            <SegButton active={unit === "metric"} onClick={() => setUnit("metric")}>
              °C
            </SegButton>
            <SegButton active={unit === "imperial"} onClick={() => setUnit("imperial")}>
              °F
            </SegButton>
          </div>
        </Row>

        <Row title="Wind speed unit" description="Independent of the temperature unit">
          <div className="inline-flex rounded-2xl border border-black/[0.06] bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.04]">
            {(["kmh", "mph", "ms"] as WindUnit[]).map((w) => (
              <SegButton key={w} active={windUnit === w} onClick={() => setWindUnit(w)}>
                {w === "kmh" ? "km/h" : w === "mph" ? "mph" : "m/s"}
              </SegButton>
            ))}
          </div>
        </Row>

        <Row title="Theme" description="Match system, or force light / dark">
          <div className="inline-flex rounded-2xl border border-black/[0.06] bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.04]">
            <SegButton active={mounted && theme === "light"} onClick={() => setTheme("light")}>
              <Sun className="h-4 w-4" />
            </SegButton>
            <SegButton active={mounted && theme === "dark"} onClick={() => setTheme("dark")}>
              <Moon className="h-4 w-4" />
            </SegButton>
            <SegButton active={mounted && theme === "system"} onClick={() => setTheme("system")}>
              <Laptop className="h-4 w-4" />
            </SegButton>
          </div>
        </Row>

        <Row title="Location permission" description="Re-request browser geolocation">
          <Button variant="ghost" size="sm" onClick={useMyLocation} disabled={locating}>
            <MapPin className="h-4 w-4" />
            {locating ? "Requesting…" : "Use my location"}
          </Button>
        </Row>

        {canInstall && (
          <Row title="Install app" description="Add Skyline to your home screen or dock">
            <Button variant="ghost" size="sm" onClick={promptInstall}>
              <Download className="h-4 w-4" /> Install
            </Button>
          </Row>
        )}

        <Row title="Reset settings" description="Restore temperature unit, wind unit, and theme to defaults">
          <Button variant="ghost" size="sm" onClick={handleResetSettings}>
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </Row>
      </GlassCard>

      <h2 className="mb-2 mt-10 text-lg font-semibold text-slate-900 dark:text-white">
        Data &amp; storage
      </h2>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Everything is stored locally in your browser — nothing is sent to a server.
      </p>
      <GlassCard glow="garnet" className="divide-y divide-black/[0.06] p-6 dark:divide-white/10">
        <Row title="Recent searches" description="Clear your search history">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearRecents();
              flash("Recent searches cleared");
            }}
          >
            <Trash2 className="h-4 w-4" /> Clear
          </Button>
        </Row>
        <Row title="Favorite cities" description={`${favorites.length} saved`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              persist([]);
              flash("Favorites cleared");
            }}
          >
            <Trash2 className="h-4 w-4" /> Clear
          </Button>
        </Row>
        <Row title="All local data" description="Reset unit, wind unit, theme, favorites, and search history">
          <Button variant="secondary" size="sm" onClick={handleClearEverything}>
            <Trash2 className="h-4 w-4" /> Clear everything
          </Button>
        </Row>
      </GlassCard>

      {cleared && (
        <p className="mt-4 text-sm font-medium text-cyan-600 dark:text-cyan-300">{cleared}</p>
      )}
    </main>
  );
}
