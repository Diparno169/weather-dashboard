"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import type { WeatherScene } from "@/types/weather";

interface Props {
  scene: WeatherScene;
}

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        top: Math.random() * 60,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
      })),
    []
  );
  return (
    <>
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-slate-500 dark:bg-white"
          style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 3 + s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

function RainDrops() {
  const drops = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.6 + Math.random() * 0.5,
      })),
    []
  );
  return (
    <>
      {drops.map((d) => (
        <motion.span
          key={d.id}
          className="absolute top-0 h-10 w-px bg-gradient-to-b from-cyan-300/0 via-cyan-300/60 to-cyan-300/0"
          style={{ left: `${d.left}%` }}
          animate={{ y: ["-5%", "110%"] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: "linear" }}
        />
      ))}
    </>
  );
}

function SnowFlakes() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 4,
        size: Math.random() * 3 + 2,
      })),
    []
  );
  return (
    <>
      {flakes.map((f) => (
        <motion.span
          key={f.id}
          className="absolute top-0 rounded-full bg-slate-400/80 dark:bg-white/80"
          style={{ left: `${f.left}%`, width: f.size, height: f.size }}
          animate={{ y: ["-5%", "110%"], x: [0, 15, -15, 0] }}
          transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: "linear" }}
        />
      ))}
    </>
  );
}

function Lightning() {
  return (
    <motion.div
      className="absolute inset-0 bg-cyan-300 dark:bg-cyan-100"
      animate={{ opacity: [0, 0, 0.5, 0, 0.25, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2.5 }}
    />
  );
}

function CloudDrift({ tint }: { tint: string }) {
  const clouds = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        top: 10 + i * 18,
        size: 180 + i * 60,
        duration: 40 + i * 15,
        opacity: 0.08 - i * 0.01,
      })),
    []
  );
  return (
    <>
      {clouds.map((c) => (
        <motion.div
          key={c.id}
          className={`absolute rounded-full blur-3xl ${tint}`}
          style={{ top: `${c.top}%`, width: c.size, height: c.size * 0.5, opacity: c.opacity }}
          animate={{ x: ["-20%", "120%"] }}
          transition={{ duration: c.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </>
  );
}

const sceneConfig: Record<WeatherScene, { gradient: string }> = {
  "clear-day": {
    gradient:
      "from-sky-200 via-sky-50 to-white dark:from-blue-900/40 dark:via-[#030712] dark:to-[#030712]",
  },
  "clear-night": {
    gradient:
      "from-indigo-100 via-sky-50 to-white dark:from-indigo-950/60 dark:via-[#030712] dark:to-[#030712]",
  },
  clouds: {
    gradient:
      "from-slate-200 via-slate-50 to-white dark:from-slate-800/50 dark:via-[#030712] dark:to-[#030712]",
  },
  rain: {
    gradient:
      "from-cyan-100 via-slate-50 to-white dark:from-cyan-950/50 dark:via-[#030712] dark:to-[#030712]",
  },
  thunderstorm: {
    gradient:
      "from-slate-300 via-slate-50 to-white dark:from-slate-900/70 dark:via-[#030712] dark:to-[#030712]",
  },
  snow: {
    gradient:
      "from-slate-100 via-sky-50 to-white dark:from-slate-700/30 dark:via-[#030712] dark:to-[#030712]",
  },
  mist: {
    gradient:
      "from-slate-200 via-slate-50 to-white dark:from-slate-800/40 dark:via-[#030712] dark:to-[#030712]",
  },
};

export function WeatherBackground({ scene }: Props) {
  const config = sceneConfig[scene];
  const reduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-sky-50 transition-colors duration-500 dark:bg-[#030712]">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          className={`absolute inset-0 bg-gradient-to-b ${config.gradient}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 1.2 }}
        >
          {/* Ambient glow orbs — always present, brand signature. Static (no pulsing loop) when reduced motion is preferred. */}
          <motion.div
            className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]"
            animate={reduceMotion ? { opacity: 0.5 } : { opacity: [0.4, 0.7, 0.4] }}
            transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-rose-600/15 blur-[120px]"
            animate={reduceMotion ? { opacity: 0.4 } : { opacity: [0.3, 0.6, 0.3] }}
            transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]"
            animate={reduceMotion ? { opacity: 0.3 } : { opacity: [0.2, 0.5, 0.2] }}
            transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />

          {!reduceMotion && (
            <>
              {scene === "clear-night" && <Stars />}
              {scene === "rain" && <RainDrops />}
              {scene === "thunderstorm" && (
                <>
                  <RainDrops />
                  <Lightning />
                </>
              )}
              {scene === "snow" && <SnowFlakes />}
              {(scene === "clouds" || scene === "mist") && <CloudDrift tint="bg-slate-400/10" />}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
