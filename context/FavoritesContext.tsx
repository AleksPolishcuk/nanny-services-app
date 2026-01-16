"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getFavoriteIds,
  setFavorite,
  getNanniesByIds,
} from "@/service/firebase/favirites";
import { get, ref } from "firebase/database";
import { db } from "@/service/firebase/firebase";
import type { Nanny } from "@/types/nanny";

type FavoritesCtx = {
  ids: string[];
  nannies: Nanny[];
  isFav: (id: string) => boolean;
  toggle: (id: string) => Promise<void>;
  loading: boolean;
};

const Ctx = createContext<FavoritesCtx | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [ids, setIds] = useState<string[]>([]);
  const [nannies, setNannies] = useState<Nanny[]>([]);
  const [loading, setLoading] = useState(false);

  const sync = useCallback(async () => {
    if (!uid) {
      setIds([]);
      setNannies([]);
      return;
    }

    setLoading(true);
    try {
      const favIds = await getFavoriteIds(uid);
      setIds(favIds);

      if (favIds.length > 0) {
        const favNannies = await getNanniesByIds(favIds);
        setNannies(favNannies);
      } else {
        setNannies([]);
      }
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    void sync();
  }, [sync, uid]);

  const isFav = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    async (id: string) => {
      if (!uid) return;

      const next = !ids.includes(id);

      setIds((prev) => (next ? [...prev, id] : prev.filter((x) => x !== id)));

      if (next) {
        const tempNanny: Nanny = {
          id,
          name: "Loading...",
          avatar_url: "",
          birthday: new Date().toISOString(),
          experience: "",
          reviews: [],
          education: "",
          kids_age: "",
          price_per_hour: 0,
          location: "",
          about: "",
          characters: [],
          rating: 0,
          createdAt: Date.now(),
        };
        setNannies((prev) => [...prev, tempNanny]);

        try {
          const nannySnapshot = await get(ref(db, `nannies/${id}`));
          if (nannySnapshot.exists()) {
            const nannyData = nannySnapshot.val() as Omit<Nanny, "id">;

            setNannies((prev) =>
              prev.map((n) => (n.id === id ? { id, ...nannyData } : n))
            );
          }
        } catch (error) {
          console.error("Failed to fetch nanny:", error);

          setNannies((prev) => prev.filter((n) => n.id !== id));
        }
      } else {
        setNannies((prev) => prev.filter((n) => n.id !== id));
      }

      try {
        await setFavorite(uid, id, next);
      } catch (error) {
        console.error("Failed to update favorite in Firebase:", error);

        setIds(ids);
        setNannies((prev) => {
          if (next) {
            return prev.filter((n) => n.id !== id);
          } else {
            sync();
            return prev;
          }
        });
        throw new Error("favorite_update_failed");
      }
    },
    [uid, ids, sync]
  );

  const value = useMemo(
    () => ({ ids, nannies, isFav, toggle, loading }),
    [ids, nannies, isFav, toggle, loading]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFavorites() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFavorites must be used within FavoritesProvider");
  return v;
}
