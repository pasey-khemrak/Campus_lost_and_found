import Image from "next/image";
import styles from "./postdetail.module.css";

export default function PostDetailPage() {
  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.left}>
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

      {/* CONTENT */}
      <main className={styles.content}>
        {/* LEFT IMAGE SECTION */}
        <div className={styles.imageSection}>
          <button className={styles.arrow}>‹</button>

          <div className={styles.imageWrapper}>
            <Image
              src="/watch.webp"
              alt="Item image"
              fill
              className={styles.image}
            />
          </div>

          <button className={styles.arrow}>›</button>

          <div className={styles.dots}>
            <span className={styles.dotActive}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        </div>

        {/* RIGHT DETAIL SECTION */}
        <div className={styles.detailSection}>
          <div className={styles.authorCard}>
            <div className={styles.avatar}></div>
            <span className={styles.authorName}>Author Name</span>
          </div>

          <div className={styles.descriptionBox}>
            <h3>Description:</h3>
            <p>
              Is branched in my up strictly remember. Songs but chief has ham
              widow downs. Genius or so up vanity cannot. Large do tried going
              about water defer by. Silent son man she wished mother. Distrusts
              allowance do knowledge eagerness assurance additions to.
              <br /><br />
              Sportsman do offending supported extremity breakfast by listening.
              Decisively advantages nor expression unpleasing she led met.
              Estate was tended ten boy nearer seemed. As so seeing latter he
              should thirty whence. Steepest speaking up attended it as.
              Moderate net an on be gave show snug tore.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
