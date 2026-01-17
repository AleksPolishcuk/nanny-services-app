"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Filters.module.css";
import type { FilterOption } from "@/types/filters";

type Props = {
  value: FilterOption;
  onChange: (v: FilterOption) => void;
};

const OPTIONS: { value: FilterOption; label: string }[] = [
  { value: "A_Z", label: "A to Z" },
  { value: "Z_A", label: "Z to A" },
  { value: "LT_10", label: "Less than 10$" },
  { value: "GT_10", label: "Greater than 10$" },
  { value: "RATING_DESC", label: "Popular" },
  { value: "RATING_ASC", label: "Not popular" },
  { value: "ALL", label: "Show all" },
];

export default function Filter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel = useMemo(() => {
    return OPTIONS.find((o) => o.value === value)?.label ?? "A to Z";
  }, [value]);

  useEffect(() => {
    if (!open) return;

    const onDocClick = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleSelect = (v: FilterOption) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <p className={styles.label}>Filters</p>

      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.triggerText}>{selectedLabel}</span>

        <span
          className={[styles.chevron, open ? styles.chevronOpen : ""].join(" ")}
          aria-hidden="true"
        >
          <svg width="18" height="18">
            <use href="/sprite.svg#icon-chevron-down" />
          </svg>
        </span>
      </button>

      {open && (
        <ul className={styles.menu} role="listbox" aria-label="Filters">
          {OPTIONS.map((opt) => {
            const isActive = opt.value === value;

            return (
              <li key={opt.value}>
                <button
                  type="button"
                  className={[
                    styles.item,
                    isActive ? styles.itemActive : "",
                  ].join(" ")}
                  onClick={() => handleSelect(opt.value)}
                  role="option"
                  aria-selected={isActive}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
