"use client";

import styles from "./nannies.module.css";

export default function NanniesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.top}>
          <h1 className={styles.title}>Nannies</h1>

          <div className={styles.controls}>
            <button className={styles.fakeSelect} type="button">
              Filters (placeholder)
            </button>
          </div>
        </header>

        <section className={styles.list}>
          <div className={styles.cardPlaceholder}>Card #1 (placeholder)</div>
          <div className={styles.cardPlaceholder}>Card #2 (placeholder)</div>
          <div className={styles.cardPlaceholder}>Card #3 (placeholder)</div>
        </section>

        <div className={styles.footer}>
          <button className={styles.loadMore} type="button">
            Load more (placeholder)
          </button>
        </div>
      </div>
    </main>
  );
}
