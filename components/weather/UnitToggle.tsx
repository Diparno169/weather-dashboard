"use client";

import type { TempUnit } from "@/types/weather";
import { cn } from "@/lib/utils";

interface Props {
  unit: TempUnit;
  onChange: (unit: TempUnit) => void;
}

export function UnitToggle({ unit, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Temperature unit"
      className="inline-flex rounded-2xl border border-black/[0.06] bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.04]"
    >
      {(["metric", "imperial"] as TempUnit[]).map((u) => (
        <button
          key={u}
          onClick={() => onChange(u)}
          aria-pressed={unit === u}
          className={cn(
            "rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors",
            unit === u ? "bg-blue-500 text-white shadow-[0_0_16px_-2px_rgba(59,130,246,0.7)]" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          )}
        >
          °{u === "metric" ? "C" : "F"}
        </button>
      ))}
    </div>
  );
}
