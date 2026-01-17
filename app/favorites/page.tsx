"use client";

import { useMemo } from "react";
import styles from "./favorites.module.css";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import NannyCard from "@/components/NannyCard/NannyCard";
import Filters from "@/components/Filters/Filters";

export default function FavoritesPage() {
  const { user, isAuthLoading } = useAuth();
  const isAuthenticated = !!user;

  const { nannies, loading: favLoading } = useFavorites();

  const empty = useMemo(
    () => !favLoading && nannies.length === 0,
    [favLoading, nannies.length]
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
        {favLoading ? (
          <p className={styles.state}>Loading…</p>
        ) : empty ? (
          <p className={styles.state}>No favorites yet.</p>
        ) : (
          <section className={styles.list}>
            {nannies.map((n) => (
              <NannyCard key={n.id} nanny={n} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
