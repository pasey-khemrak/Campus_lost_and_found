"use client";

import { useState } from "react";
import styles from "./device.module.css";

export default function Page() {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className={styles.container}>
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
              <a href="/device">Device</a>
            </div>

            <div className={styles.sidebarItem}>
              <a href="/change_password">Change Password</a>
            </div>
            <div
              className={styles.sidebarItem}
              onClick={() => setShowConfirm(true)}
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
              <p><strong>Device:</strong> iPhone 82 Pro Max</p>
              <p className={styles.location}>Phnom Penh, Cambodia</p>
              <button className={styles.logoutOne}>
                🚪 Log out this device
              </button>
            </div>

            <button className={styles.logoutAll}>
              Log out all devices
            </button>
          </section>
        </main>

      <div className={styles.help}><a href="/help">?</a></div>
      </div>
      {showConfirm && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>Are you sure you want to delete your account?</h3>
            <p>This action can’t be undone after you confirm.</p>

            <div className={styles.modalButtons}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
                className={styles.confirmBtn}
                onClick={() => {
                  alert("Account deleted");
                  setShowConfirm(false);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
