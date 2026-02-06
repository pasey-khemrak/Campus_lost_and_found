import styles from "./profile.module.css";

export default function ProfilePage() {
  return (
    <div className={styles.page}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <h1 className={styles.logo}>Campus Lost and Found</h1>

        <div className={styles.icons}>
          <span>🔔</span>
          <span>☰</span>
        </div>
      </header>

      {/* Main */}
      <main className={styles.container}>
        <div className={styles.card}>
          {/* Avatar */}
          <div className={styles.avatar}></div>

          {/* Username */}
          <div className={styles.field}>
            <label>Username</label>
            <select>
              <option>Username</option>
            </select>
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" placeholder="Email" />
          </div>

          {/* Address */}
          <div className={styles.field}>
            <label>Address</label>
            <input type="text" placeholder="Address..." />
          </div>

          {/* Sign out */}
          <button className={styles.signOutBtn}>Sign out</button>
        </div>
      </main>

      {/* Help */}
      <div className={styles.help}>?</div>
    </div>
  );
}
