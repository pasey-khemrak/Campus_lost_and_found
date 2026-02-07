import Image from "next/image";
import styles from "./post.module.css";

const items = [
  { title: "Item 1", status: "lost" },
  { title: "Item 2", status: "found" },
  { title: "Item 3", status: "returned" },
  { title: "Item 1", status: "lost" },
  { title: "Item 2", status: "found" },
  { title: "Item 1", status: "lost" },
  { title: "Item 2", status: "found" },
  { title: "Item 3", status: "returned" },
  { title: "Item 1", status: "lost" },
  { title: "Item 2", status: "found" },
];

export default function Page() {
  return (
    <div className={styles.container}>
      {/* HEADER (your exact header) */}
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
          <input type="text" placeholder="Search for the items" />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.icons}>
          <span>🔔</span>
          <span>☰</span>
        </div>
      </header>

      {/* ITEMS GRID */}
      <main className={styles.grid}>
        {items.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardTitle}>{item.title}</div>

            <div className={styles.imageBox}>IMG</div>

            <p className={styles.descTitle}>Description:</p>
            <p className={styles.descText}>Any description of the photo</p>

            <div className={styles.status}>
              <span
                className={`${styles.dot} ${styles[item.status]}`}
              />
              {item.status === "lost" && "Lost item"}
              {item.status === "found" && "Found items"}
              {item.status === "returned" && "Returned to the owner"}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
