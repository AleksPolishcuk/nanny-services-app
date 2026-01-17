"use client";

import { useState, useMemo } from "react";
import styles from "./favorites.module.css";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import NannyCard from "@/components/NannyCard/NannyCard";
import Filters from "@/components/Filters/Filters";
import type { PriceFilter, SortOption, FilterOption } from "@/types/filters";
import { applyFiltersAndSort } from "@/utils/sortNannies";

const PAGE_SIZE = 3;

export default function FavoritesPage() {
  const { user, isAuthLoading } = useAuth();
  const isAuthenticated = !!user;

  const { nannies: allFavorites, loading: favLoading } = useFavorites();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sort, setSort] = useState<SortOption>("SHOW_ALL");
  const [price, setPrice] = useState<PriceFilter>("ALL");
  const [filterValue, setFilterValue] = useState<FilterOption>("ALL");

  const onFilterChange = (v: FilterOption) => {
    setFilterValue(v);

    if (v === "ALL") {
      setPrice("ALL");
      setSort("SHOW_ALL");
    } else if (v === "LT_10" || v === "GT_10") {
      setPrice(v);
      setSort("SHOW_ALL");
    } else {
      setSort(v);
      setPrice("ALL");
    }

    setVisibleCount(PAGE_SIZE);
  };

  const filteredItems = useMemo(() => {
    return applyFiltersAndSort({ items: allFavorites, sort, price });
  }, [allFavorites, sort, price]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const hasMore = useMemo(() => {
    return visibleCount < filteredItems.length;
  }, [visibleCount, filteredItems.length]);

  const loadMore = () => {
    setVisibleCount((prev) => {
      const nextCount = prev + PAGE_SIZE;

      return Math.min(nextCount, filteredItems.length);
    });
  };

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

  if (favLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p className={styles.state}>Loading favorites…</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.filters}>
          <Filters value={filterValue} onChange={onFilterChange} />
        </div>

        {allFavorites.length === 0 ? (
          <p className={styles.state}>No favorites yet.</p>
        ) : filteredItems.length === 0 ? (
          <p className={styles.state}>
            No favorites match the selected filters.
          </p>
        ) : (
          <>
            <section className={styles.list}>
              {visibleItems.map((nanny) => (
                <NannyCard key={nanny.id} nanny={nanny} />
              ))}
            </section>

            {hasMore && (
              <div className={styles.bottom}>
                <button
                  className={styles.loadMore}
                  type="button"
                  onClick={loadMore}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
