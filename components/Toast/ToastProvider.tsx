"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./Toast.module.css";

type ToastType = "success" | "error";

type ToastInput = {
  type: ToastType;
  title: string;
  message?: string;
  durationMs?: number;
};

type ToastItem = ToastInput & { id: string; leaving?: boolean };

type ToastCtx = {
  toast: (t: ToastInput) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const EXIT_MS = 220;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  const toast = useCallback((t: ToastInput) => {
    const id = uid();
    const durationMs = t.durationMs ?? 2400;

    setItems((s) => [...s, { ...t, id, leaving: false }]);

    // start exit animation slightly before removing
    const exitAt = Math.max(0, durationMs - EXIT_MS);

    const exitTimer = window.setTimeout(() => {
      setItems((s) =>
        s.map((x) => (x.id === id ? { ...x, leaving: true } : x)),
      );

      const removeTimer = window.setTimeout(() => {
        setItems((s) => s.filter((x) => x.id !== id));
        delete timersRef.current[id];
      }, EXIT_MS);

      timersRef.current[id] = removeTimer;
    }, exitAt);

    timersRef.current[id] = exitTimer;
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <Ctx.Provider value={value}>
      {children}

      <div className={styles.stack} role="status" aria-live="polite">
        {items.map((t) => (
          <div
            key={t.id}
            className={[
              styles.toast,
              t.type === "success" ? styles.success : styles.error,
              t.leaving ? styles.leaving : "",
            ].join(" ")}
            style={
              {
                ["--life" as const]: `${t.durationMs ?? 2400}ms`,
              } as React.CSSProperties
            }
          >
            <div className={styles.titleRow}>
              <span className={styles.title}>{t.title}</span>
            </div>
            {t.message ? <div className={styles.msg}>{t.message}</div> : null}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useToast must be used within ToastProvider");
  return v;
}
