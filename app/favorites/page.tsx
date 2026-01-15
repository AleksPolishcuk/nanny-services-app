"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./favorites.module.css";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { getNanniesByIds } from "@/service/firebase/favirites";
import NannyCard from "@/components/NannyCard/NannyCard";
import type { Nanny } from "@/types/nanny";

export default function FavoritesPage() {
  const { user, isAuthLoading } = useAuth();
  const isAuthenticated = !!user;

  const { ids, loading: favLoading } = useFavorites();

  const [items, setItems] = useState<Nanny[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      setLoading(false);
      return;
    }

    const run = async () => {
      setLoading(true);
      try {
        const res = await getNanniesByIds(ids);
        setItems(res);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [ids, isAuthenticated]);

  const empty = useMemo(
    () => !loading && items.length === 0,
    [loading, items.length]
  );

  if (isAuthLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p className={styles.state}>Loading…</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p className={styles.state}>Please log in to see favorites.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Favorites</h1>

        {loading || favLoading ? (
          <p className={styles.state}>Loading…</p>
        ) : empty ? (
          <p className={styles.state}>No favorites yet.</p>
        ) : (
          <section className={styles.list}>
            {items.map((n) => (
              <NannyCard key={n.id} nanny={n} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
