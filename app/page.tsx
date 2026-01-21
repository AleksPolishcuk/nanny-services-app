"use client";

import Link from "next/link";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.left}>
            <div className={styles.leftInner}>
              <h1 className={styles.title}>Make Life Easier for the Family:</h1>

              <p className={styles.subtitle}>
                Find Babysitters Online for All Occasions
              </p>

              <div className={styles.ctaContainer}>
                <Link className={styles.cta} href="/nannies">
                  <span>Get started</span>
                  <span className={styles.ctaIcon} aria-hidden="true">
                    <svg width="32" height="32">
                      <use href="/sprite.svg#icon-arrow-up-right" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.right} aria-hidden="true">
            <div className={styles.statCard}>
              <div className={styles.checkBox}>
                <svg width="30" height="30">
                  <use href="/sprite.svg#icon-fe_check" />
                </svg>
              </div>

              <div className={styles.statText}>
                <div className={styles.statLabel}>Experienced nannies</div>
                <div className={styles.statValue}>15,000</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
