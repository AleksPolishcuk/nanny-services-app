"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
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

type ToastItem = ToastInput & { id: string };

type ToastCtx = {
  toast: (t: ToastInput) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((t: ToastInput) => {
    const id = uid();
    const durationMs = t.durationMs ?? 2400;

    setItems((s) => [...s, { ...t, id, durationMs }]);

    window.setTimeout(() => {
      setItems((s) => s.filter((x) => x.id !== id));
    }, durationMs);
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
            ].join(" ")}
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
