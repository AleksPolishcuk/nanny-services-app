"use client";

import { useEffect, useState } from "react";
import styles from "./ToastProvider.module.css";

type ToastProps = {
  message: string;
  type?: "info" | "warning" | "error" | "success";
  duration?: number;
  onClose: () => void;
};

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${
        isVisible ? styles.show : styles.hide
      }`}
    >
      {message}
      <button
        className={styles.closeBtn}
        onClick={() => {
          setIsVisible(false);
          onClose();
        }}
      >
        <svg width="12" height="12" aria-hidden="true">
          <use href="/sprite.svg#icon-close" />
        </svg>
      </button>
    </div>
  );
}
