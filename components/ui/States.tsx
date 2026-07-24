"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CloudOff, SatelliteDish, WifiOff } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "./Button";

export function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-black/[0.06] bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.03] sm:p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-3 w-32 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
          <div className="h-14 w-40 animate-pulse rounded-2xl bg-black/10 dark:bg-white/10" />
          <div className="h-3 w-24 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="h-24 w-24 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <GlassCard glow="garnet" className="flex flex-col items-center gap-4 p-10 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10"
      >
        <AlertTriangle className="h-7 w-7 text-rose-400" />
      </motion.div>
      <div>
        <p className="font-medium text-slate-900 dark:text-white">Something went wrong</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </GlassCard>
  );
}

export function EmptyState() {
  return (
    <GlassCard glow="none" className="flex flex-col items-center gap-4 p-10 text-center">
      <SatelliteDish className="h-10 w-10 text-slate-400 dark:text-slate-600" />
      <div>
        <p className="font-medium text-slate-900 dark:text-white">Search for a city to begin</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Or use your current location to see the forecast instantly.
        </p>
      </div>
    </GlassCard>
  );
}

export function OfflineState() {
  return (
    <GlassCard glow="garnet" className="flex flex-col items-center gap-4 p-10 text-center">
      <WifiOff className="h-10 w-10 text-rose-400" />
      <div>
        <p className="font-medium text-slate-900 dark:text-white">You&apos;re offline</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Reconnect to fetch the latest weather data.
        </p>
      </div>
    </GlassCard>
  );
}

export function NotFoundState() {
  return (
    <GlassCard glow="none" className="flex flex-col items-center gap-4 p-10 text-center">
      <CloudOff className="h-10 w-10 text-slate-400 dark:text-slate-600" />
      <div>
        <p className="font-medium text-slate-900 dark:text-white">No results found</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Try a different city name.</p>
      </div>
    </GlassCard>
  );
}
