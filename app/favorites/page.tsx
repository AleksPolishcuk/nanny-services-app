"use client";

import { useState, useMemo } from "react";
import styles from "./favorites.module.css";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import NannyCard from "@/components/NannyCard/NannyCard";
import Filter from "@/components/Filters/Filters";
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
  const [uiValue, setUiValue] = useState<FilterOption>("ALL");

  const onFilterChange = (v: FilterOption) => {
    setUiValue(v);

    if (v === "ALL") {
      setPrice("ALL");
      setSort("SHOW_ALL");
      setVisibleCount(PAGE_SIZE);
      return;
    }

    if (v === "LT_10" || v === "GT_10") {
      setPrice(v);
      setSort("SHOW_ALL");
      setVisibleCount(PAGE_SIZE);
      return;
    }

    setSort(v);
    setPrice("ALL");
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
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredItems.length));
  };

  const stateText = useMemo(() => {
    if (isAuthLoading) return "Loading…";
    if (!isAuthenticated) return "Please log in to see favorites.";
    if (favLoading) return "Loading favorites…";
    if (allFavorites.length === 0) return "No favorites yet.";
    if (filteredItems.length === 0)
      return "No favorites match the selected filters.";
    return null;
  }, [
    isAuthLoading,
    isAuthenticated,
    favLoading,
    allFavorites.length,
    filteredItems.length,
  ]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.filters}>
          <Filter value={uiValue} onChange={onFilterChange} />
        </div>

        {stateText ? (
          <p className={styles.state}>{stateText}</p>
        ) : (
          <>
            <section className={styles.list}>
              {visibleItems.map((n) => (
                <NannyCard key={n.id} nanny={n} />
              ))}
            </section>

            {hasMore && (
              <div className={styles.bottom}>
                <button
                  type="button"
                  className={styles.loadMore}
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
