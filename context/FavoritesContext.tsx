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
import { getFavoriteIds, setFavorite } from "@/service/firebase/favirites";

type FavoritesCtx = {
  ids: string[];
  isFav: (id: string) => boolean;
  toggle: (id: string) => Promise<void>;
  loading: boolean;
};

const Ctx = createContext<FavoritesCtx | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const uid = user?.uid ?? null;

  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const sync = useCallback(async () => {
    if (!uid) {
      setIds([]);
      return;
    }

    setLoading(true);
    try {
      const favIds = await getFavoriteIds(uid);
      setIds(favIds);
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

      try {
        await setFavorite(uid, id, next);
      } catch {
        setIds((prev) => (next ? prev.filter((x) => x !== id) : [...prev, id]));
        throw new Error("favorite_update_failed");
      }
    },
    [uid, ids]
  );

  const value = useMemo(
    () => ({ ids, isFav, toggle, loading }),
    [ids, isFav, toggle, loading]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFavorites() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFavorites must be used within FavoritesProvider");
  return v;
}
