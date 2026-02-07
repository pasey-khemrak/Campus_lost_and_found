import styles from "./changepassword.module.css";

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
          <div className={styles.sidebarItem}> <a href="">Device</a></div>
          <div className={styles.sidebarItem}><a href="">Change Password</a></div>
          <div className={styles.sidebarItem}><a href="">Delete account</a></div>
          <div className={styles.sidebarItem}><a href="">Feedback</a></div>
        </aside>

        <section className={styles.content}>
          <h2>Change Password</h2>

          <div className={styles.card}>
            <div className={styles.field}>
              <label>Old Password</label>
              <input type="password" placeholder="Old Password" />
            </div>
            <div className={styles.field}>
              <label>New Password</label>
              <input type="password" placeholder="New Password" />
            </div>
            <div className={styles.field}>
              <label>Confirm New Password</label>
              <input type="password" placeholder="Confirm New Password" />
            </div>
            <div className={styles.buttonContainer}>
              <button className={styles.changeButton}>Change Password</button>
            </div> 
          </div>
        </section>
      </main>

      <div className={styles.help}>?</div>
    </div>
  );
}
