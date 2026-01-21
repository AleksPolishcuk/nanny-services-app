"use client";

import { useEffect, useState, useMemo } from "react";
import styles from "./nannies.module.css";
import type { Nanny } from "@/types/nanny";
import { getNanniesPage, type NanniesCursor } from "@/service/firebase/rtdb";
import NannyCard from "@/components/NannyCard/NannyCard";
import Filter from "@/components/Filters/Filters";
import type { PriceFilter, SortOption, FilterOption } from "@/types/filters";
import { applyFiltersAndSort } from "@/utils/sortNannies";

const PAGE_SIZE = 3;

export default function NanniesPage() {
  const [items, setItems] = useState<Nanny[]>([]);
  const [cursor, setCursor] = useState<NanniesCursor>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);

  const [sort, setSort] = useState<SortOption>("SHOW_ALL");
  const [price, setPrice] = useState<PriceFilter>("ALL");
  const [uiValue, setUiValue] = useState<FilterOption>("ALL");

  const onFilterChange = (v: FilterOption) => {
    setUiValue(v);

    if (v === "ALL") {
      setPrice("ALL");
      setSort("SHOW_ALL");
      return;
    }

    if (v === "LT_10" || v === "GT_10") {
      setPrice(v);
      return;
    }

    setSort(v);
  };

  const visibleItems = useMemo(() => {
    return applyFiltersAndSort({ items, sort, price });
  }, [items, sort, price]);

  const loadFirst = async () => {
    setLoading(true);
    try {
      const res = await getNanniesPage({ limit: PAGE_SIZE, cursor: null });
      setItems(res.items);
      setCursor(res.cursor);
      setHasMore(res.hasMore && res.items.length === PAGE_SIZE);
    } finally {
      setLoading(false);
      setFirstLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const res = await getNanniesPage({ limit: PAGE_SIZE, cursor });
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.cursor);
      setHasMore(res.hasMore && res.items.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFirst();
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.filters}>
            <Filter value={uiValue} onChange={onFilterChange} />
          </div>

          {firstLoading ? (
            <p className={styles.state}>Loading…</p>
          ) : visibleItems.length === 0 ? (
            <p className={styles.state}>No nannies found.</p>
          ) : (
            <section className={styles.list}>
              {visibleItems.map((n) => (
                <NannyCard key={n.id} nanny={n} />
              ))}
            </section>
          )}

          {hasMore && visibleItems.length > 0 && (
            <div className={styles.bottom}>
              <button
                type="button"
                className={styles.loadMore}
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
