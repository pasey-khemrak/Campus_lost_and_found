"use client";

import Link from "next/link";
import styles from "../help.module.css";


export default function HelpPage() {
  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <h1>Campus Lost and Found</h1>
        <div className={styles.icons}>
          <span>🔔</span>
          <span>☰</span>
        </div>
      </header>

      <main className={styles.main}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarItem}>
            <Link href="/help/page1">How to post lost item?</Link>
          </div>
          <div className={styles.sidebarItem}>
            <Link href="/help/page2">How to post found item?</Link>
          </div>
          <div className={styles.sidebarItem}>
            <Link href="/help/page3">How to find lost item?</Link>
          </div>
          <div className={styles.sidebarItem}>
            <Link href="/help/page4">How to find item by criteria?</Link>
          </div>
          <div className={styles.sidebarItem}>
            <Link href="/help/page5">How to change password?</Link>
          </div>
          <div className={styles.sidebarItem}>
            <Link href="/help/page6">How to delete account?</Link>
          </div>
        </aside>

        {/* CONTENT */}
        <section className={styles.content}>
          <h2>Help</h2>

          <div className={styles.card}>
            <p>
              Go to feature at the top right corner of the screen and click on "Settings" then go to change password option.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
