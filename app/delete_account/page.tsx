"use client";

import { useState } from "react";
import styles from "./delete_account.module.css";
import AppHeader from "@/components/AppHeader";

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`${styles.container} ${open ? styles.blur : ""}`}>
        <AppHeader />

        <main className={styles.main}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarItem}>
              <a href="/device">Device</a>
            </div>

            <div className={styles.sidebarItem}>
              <a href="/change_password">Change Password</a>
            </div>

            <div
              className={styles.sidebarItem}
              onClick={() => setOpen(true)}
              style={{ cursor: "pointer" }}
            >
              Delete account
            </div>

            <div className={styles.sidebarItem}>
              <a href="/feedback">Feedback</a>
            </div>
          </aside>

          <section className={styles.content}>
            <h2>Device</h2>

            <div className={styles.card}>
              <p>
                <strong>Device:</strong> iPhone 82 Pro Max
              </p>
              <p className={styles.location}>Phnom Penh, Cambodia</p>
              <button className={styles.logoutOne}>Log out this device</button>
            </div>

            <button className={styles.logoutAll}>Log out all devices</button>
          </section>
        </main>

        <div className={styles.help}>?</div>
      </div>
    </>
  );
}
