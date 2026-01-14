"use client";

import Link from "next/link";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          {/* LEFT */}
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
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 17L17 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 7H17V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.right} aria-hidden="true">
            <div className={styles.statCard}>
              <div className={styles.checkBox}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 7L10.5 16.5L4 10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
