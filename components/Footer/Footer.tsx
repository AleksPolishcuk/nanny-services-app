"use client";

import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer
      className={[styles.footer, isHome ? styles.home : styles.inner].join(" ")}
    >
      <div className={styles.container}>
        <p className={styles.text}>
          &copy; {new Date().getFullYear()} Nanny.Services. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
