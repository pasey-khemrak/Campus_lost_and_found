import Image from "next/image";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.left}>
          <div className={styles.logoWrapper}>
            <Image
              src="/logo.png"
              alt="Campus Logo"
              width={50}
              height={50}
              className={styles.logo}
            />
          </div>
          <span className={styles.title}>Campus Lost and Found</span>
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search for the items"
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.icons}>
          <span>🔔</span>
          <span>☰</span>
        </div>
      </header>

      {/* Main */}
      <main className={styles.main}>
        <h1 className={styles.heading}>Latest 3 found items</h1>

        <div className={styles.cards}>
          {[1, 2, 3].map((item) => (
            <div key={item} className={styles.card}>
              <h3>Item {item}</h3>

              <div className={styles.imageBox}>
                <span>IMG</span>
                <div className={styles.dots}>•••</div>
              </div>

              <p className={styles.descTitle}>Description:</p>
              <p className={styles.desc}>Any description of the photo</p>
            </div>
          ))}
        </div>

        <button className={styles.seeMore}>See more</button>
      </main>

      <button className={styles.addBtn}>+</button>
      <div className={styles.help}><a href="/help">?</a></div>
    </div>
  );
}
