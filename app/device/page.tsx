import styles from "./device.module.css";

export default function Page() {
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
        <aside className={styles.sidebar}>
          <div className={styles.sidebarItem}>Device</div>
          <div className={styles.sidebarItem}>Change Password</div>
          <div className={styles.sidebarItem}>Delete account</div>
          <div className={styles.sidebarItem}>Feedback</div>
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

      <div className={styles.help}>?</div>
    </div>
  );
}
