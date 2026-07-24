import type { Metadata } from "next";
import { CloudSun, Zap, ShieldCheck, Gauge } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "About — Skyline",
  description: "What Skyline is, how it's built, and where the data comes from.",
};

const points = [
  {
    icon: Zap,
    title: "Live data",
    body: "Current conditions, hourly and 5-day forecasts, and air quality come straight from the WeatherAPI.com API.",
  },
  {
    icon: Gauge,
    title: "Built for speed",
    body: "Next.js App Router, React Server Components where it counts, and code-split client interactivity.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "Favorites, recent searches, and preferences live only in your browser's local storage.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_0_30px_-4px_rgba(34,211,238,0.7)]">
          <CloudSun className="h-7 w-7 text-white" />
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          About Skyline
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-400">
          Skyline is a portfolio weather app built to look and feel like a premium commercial
          product — precise forecasts, presented beautifully, for people who plan their day
          around the sky.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {points.map((p) => (
          <GlassCard key={p.title} glow="cyan" className="p-6">
            <p.icon className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">{p.title}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{p.body}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard glow="none" className="mt-6 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-white">Tech stack</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion ·
          Lucide icons · next-themes ·
        </p>
      </GlassCard>
    </main>
  );
}
