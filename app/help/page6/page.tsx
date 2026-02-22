"use client";

import { useState } from "react";
import styles from "../help.module.css";
import homeStyles from "../../home/home.module.css";
import Image from "next/image";
import Link from "next/link";


export default function Page() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div className={styles.container}>
      {/* BLUR WRAPPER */}
      <div className={showConfirm ? styles.blur : ""}>
      <header className={homeStyles.header}>
        <div className={homeStyles.left}>
          <div className={homeStyles.logoWrapper}>
            <Image
              src="/logo.png"
              alt="Campus Logo"
              width={50}
              height={50}
              className={homeStyles.logo}
            />
          </div>
          <span className={homeStyles.title}>Campus Lost and Found</span>
        </div>

        <div className={homeStyles.icons}>
          <div className={homeStyles.iconWrapper}>
            <span onClick={() => setShowNotif(!showNotif)}>🔔</span>
            {showNotif && (
              <div className={homeStyles.notificationBox}>
                <h4>Notifications</h4>
              </div>
            )}
          </div>

          <div className={homeStyles.iconWrapper}>
            <span onClick={() => setShowMenu(!showMenu)}>☰</span>
            {showMenu && (
              <div className={homeStyles.dropdownMenu}>
                <Link href="/profile">Profile</Link>
                <Link href="/device">Settings</Link>
                <Link href="/post">All Posts</Link>
                <Link href="/categories">Categories</Link>
                <Link href="/add_post">Add Post</Link>
              </div>
            )}
          </div>
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
