"use client";

import { useCallback, useEffect, useState } from "react";
import { FAVORITES_STORAGE_KEY } from "@/constants";
import type { FavoriteCity } from "@/types/weather";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
  }, []);

  const persist = useCallback((next: FavoriteCity[]) => {
    setFavorites(next);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addFavorite = useCallback(
    (city: Omit<FavoriteCity, "addedAt">) => {
      setFavorites((prev) => {
        if (prev.some((f) => f.name === city.name && f.country === city.country)) return prev;
        const next = [...prev, { ...city, addedAt: Date.now() }];
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const removeFavorite = useCallback(
    (name: string, country: string) => {
      setFavorites((prev) => {
        const next = prev.filter((f) => !(f.name === name && f.country === country));
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const isFavorite = useCallback(
    (name: string, country: string) =>
      favorites.some((f) => f.name === name && f.country === country),
    [favorites]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite, persist };
}
