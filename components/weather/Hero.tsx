"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CloudSun, Wind, Droplets } from "lucide-react";
import { SearchBar } from "./SearchBar";
import type { GeoResult } from "@/types/weather";

interface Props {
  onSelectCity: (result: GeoResult) => void;
  onUseLocation: () => void;
  locating: boolean;
}

export function Hero({ onSelectCity, onUseLocation, locating }: Props) {
  const reduceMotion = useReducedMotion();
  return (
    <section id="home" className="relative flex min-h-[92vh] items-center pt-28 sm:pt-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300"
          >
            Live weather, anywhere on Earth
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white"
          >
            Know the sky
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              before you step out.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-5 max-w-md text-base text-slate-600 sm:text-lg dark:text-slate-400"
          >
            Precise, beautifully presented forecasts — hourly, five-day, and
            right now — built for people who plan their day around the sky.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8"
          >
            <SearchBar onSelectCity={onSelectCity} onUseLocation={onUseLocation} locating={locating} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative mx-auto hidden h-80 w-80 items-center justify-center sm:flex lg:h-96 lg:w-96"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl"
            animate={reduceMotion ? { scale: 1 } : { scale: [1, 1.1, 1] }}
            transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            animate={reduceMotion ? { y: 0 } : { y: [0, -18, 0] }}
            transition={reduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 flex h-56 w-56 items-center justify-center rounded-full border border-black/[0.06] bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] lg:h-64 lg:w-64"
          >
            <CloudSun className="h-28 w-28 text-cyan-300 drop-shadow-[0_0_30px_rgba(34,211,238,0.6)] lg:h-32 lg:w-32" />
          </motion.div>

          <motion.div
            animate={reduceMotion ? { y: 0, x: 0 } : { y: [0, 12, 0], x: [0, -6, 0] }}
            transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -left-4 top-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-black/[0.06] bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
          >
            <Wind className="h-6 w-6 text-blue-300" />
          </motion.div>

          <motion.div
            animate={reduceMotion ? { y: 0, x: 0 } : { y: [0, -14, 0], x: [0, 8, 0] }}
            transition={reduceMotion ? undefined : { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-2 bottom-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-black/[0.06] bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
          >
            <Droplets className="h-6 w-6 text-cyan-300" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
