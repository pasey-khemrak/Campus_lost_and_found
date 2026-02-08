"use client";

import { useState } from "react";
import styles from "../help.module.css";


export default function Page() {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className={styles.container}>
      {/* BLUR WRAPPER */}
      <div className={showConfirm ? styles.blur : ""}>
        <header className={styles.navbar}>
          <h1>Campus Lost and Found</h1>
          <div className={styles.icons}>
            <span>🔔</span>
            <span>☰</span>
          </div>
        </header>

        <main className={styles.main}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarItem}>
              <a href="/help/page1">How to post lost item?</a>
            </div>
            <div className={styles.sidebarItem}>
              <a href="/help/page2">How to post found item?</a>
            </div>
            <div className={styles.sidebarItem}>
              <a href="/help/page3">How to find lost item?</a>
            </div>
            <div className={styles.sidebarItem}>
              <a href="/help/page4">How to find item by criteria?</a>
            </div>
            <div className={styles.sidebarItem}>
              <a href="/help/page5">How to change password?</a>
            </div>
            <div className={styles.sidebarItem}>
              <a href="/help/page6">How to delete account?</a>
            </div>

    
          </aside>

          <section className={styles.content}>
            <h2>Help</h2>

            <div className={styles.card}>
              <div className={styles.field}>
                <label>Go to feature at the top right corner of the screen and click on "Settings" then go to delete account option.</label>
            
              </div>
            </div>
          </section>
        </main>

      </div>
    </div>
  );
}
