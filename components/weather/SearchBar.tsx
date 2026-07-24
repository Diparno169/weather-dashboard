"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader2, MapPin, Search, SearchX } from "lucide-react";
import { geocodeCity } from "@/services/weatherService";
import type { GeoResult } from "@/types/weather";
import { Button } from "@/components/ui/Button";

interface Props {
  onSelectCity: (result: GeoResult) => void;
  onUseLocation: () => void;
  locating: boolean;
}

export function SearchBar({ onSelectCity, onUseLocation, locating }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setError(null);
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await geocodeCity(query.trim());
        setResults(res);
        setError(null);
        setOpen(true);
      } catch (err) {
        setResults([]);
        setError(err instanceof Error ? err.message : "Couldn't search right now. Try again.");
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close the dropdown on outside click or Escape — it otherwise stays open forever.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const showDropdown = open && (results.length > 0 || error || (!loading && query.trim().length >= 2));

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="flex items-center gap-2 rounded-2xl border border-black/[0.08] bg-white/80 px-4 py-3 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.3)] backdrop-blur-xl transition-colors focus-within:border-cyan-500/50 focus-within:shadow-[0_0_30px_-8px_rgba(34,211,238,0.35)] dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none dark:focus-within:border-cyan-400/50 dark:focus-within:shadow-[0_0_30px_-8px_rgba(34,211,238,0.5)]">
        <Search className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => (results.length > 0 || error) && setOpen(true)}
          placeholder="Search for a city..."
          aria-label="Search for a city"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500 sm:text-base"
        />
        {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-cyan-400" />}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onUseLocation}
          disabled={locating}
          className="shrink-0"
          aria-label="Use current location"
        >
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          <span className="hidden sm:inline">Locate</span>
        </Button>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0f1c]/95"
          >
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-rose-500 dark:text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {!error && !loading && results.length === 0 && (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                <SearchX className="h-4 w-4 shrink-0" />
                No places found for &ldquo;{query.trim()}&rdquo;
              </div>
            )}

            {!error && (
              <ul>
                {results.map((r, i) => (
                  <li key={`${r.name}-${r.lat}-${i}`}>
                    <button
                      onClick={() => {
                        onSelectCity(r);
                        setQuery(`${r.name}, ${r.country}`);
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-black/5 hover:text-cyan-600 dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-cyan-300"
                    >
                      <MapPin className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                      <span>
                        {r.name}
                        {r.state ? `, ${r.state}` : ""}, {r.country}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
