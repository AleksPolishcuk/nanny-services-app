"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./favorites.module.css";

export default function FavoritesPage() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>Loading auth...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Favorites</h1>
          <p className={styles.text}>
            This page is available only for authorized users.
          </p>
          <Link className={styles.link} href="/nannies">
            Go to Nannies
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.top}>
          <h1 className={styles.title}>Favorites</h1>
        </header>

        <section className={styles.list}>
          <div className={styles.cardPlaceholder}>
            Favorite card #1 (placeholder)
          </div>
          <div className={styles.cardPlaceholder}>
            Favorite card #2 (placeholder)
          </div>
        </section>
      </div>
    </main>
  );
}
