import styles from "./categories.module.css";


export default function CategoriesPage() {
  return (
    <div className={styles.page}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <h1 className={styles.logo}>Campus Lost and Found</h1>

        <div className={styles.icons}>
          <span className={styles.icon}>🔔</span>
          <span className={styles.icon}>☰</span>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.field}>
            <label>Type of Product</label>
            <select>
              <option>Type of the product</option>
              <option>Phone</option>
              <option>Bag</option>
              <option>ID Card</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Size</label>
            <input type="text" placeholder="Size of the product" />
          </div>

          <div className={styles.field}>
            <label>Color</label>
            <input type="text" placeholder="Color of the product" />
          </div>

          <div className={styles.field}>
            <label>How long have you lost it (Optional)</label>
            <input type="text" />
          </div>

          <div className={styles.field}>
          <label>Status</label>

        <div className={styles.radioGroup}>
          <label className={styles.radioItem}>
            <input type="radio" name="status" value="lost" />
            <span>Lost</span>
          </label>

          <label className={styles.radioItem}>
            <input type="radio" name="status" value="found" />
            <span>Found</span>
          </label>
          </div>
        </div>


          <button className={styles.searchBtn}>Search</button>
        </div>
      </main>


      <div className={styles.help}><a href="/help">?</a></div>
    </div>
  );
}
