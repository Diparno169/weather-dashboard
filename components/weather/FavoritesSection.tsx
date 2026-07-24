"use client";

import { Star, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { FavoriteCity } from "@/types/weather";

interface Props {
  favorites: FavoriteCity[];
  onSelect: (fav: FavoriteCity) => void;
  onRemove: (name: string, country: string) => void;
}

export function FavoritesSection({ favorites, onSelect, onRemove }: Props) {
  return (
    <div id="favorites">
      <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Favorite Cities</h2>

      {favorites.length === 0 ? (
        <GlassCard glow="none" className="flex flex-col items-center gap-2 p-8 text-center">
          <Star className="h-8 w-8 text-slate-400 dark:text-slate-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No favorites yet. Tap the heart on a city&apos;s weather card to save it here.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {favorites.map((fav, i) => (
            <GlassCard
              key={`${fav.name}-${fav.country}`}
              glow="garnet"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="group relative flex flex-col gap-1 p-4"
            >
              <button
                onClick={() => onSelect(fav)}
                className="text-left"
                aria-label={`View weather for ${fav.name}`}
              >
                <p className="font-medium text-slate-900 dark:text-white">{fav.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">{fav.country}</p>
              </button>
              <button
                onClick={() => onRemove(fav.name, fav.country)}
                aria-label={`Remove ${fav.name} from favorites`}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-xl text-slate-500 opacity-70 transition-opacity hover:bg-black/10 hover:text-rose-500 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 dark:hover:bg-white/10 dark:hover:text-rose-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
