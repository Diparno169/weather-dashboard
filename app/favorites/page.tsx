"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { FavoritesSection } from "@/components/weather/FavoritesSection";
import { useFavorites } from "@/hooks/useFavorites";
import { useLocationContext } from "@/contexts/LocationContext";
import type { FavoriteCity } from "@/types/weather";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { selectCity } = useLocationContext();
  const router = useRouter();

  const handleSelect = (fav: FavoriteCity) => {
    selectCity({ name: fav.name, country: fav.country, lat: fav.lat, lon: fav.lon });
    router.push("/");
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-300">
          <Star className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Saved</span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Favorite Cities
        </h1>
        <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
          Tap a city to jump straight to its current weather. Saved locally on this device.
        </p>
      </div>

      <FavoritesSection favorites={favorites} onSelect={handleSelect} onRemove={removeFavorite} />
    </main>
  );
}
