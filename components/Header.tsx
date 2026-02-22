"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

export function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
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
        <span onClick={() => setShowNotif(!showNotif)}>🔔</span>

        {showNotif && (
          <div className={styles.notificationBox}>
            <div className={styles.notificationItem}>
              Your lost item was found!
            </div>
            <div className={styles.notificationItem}>
              Someone commented on your post.
            </div>
            <div className={styles.notificationItem}>
              Item returned successfully.
            </div>
          </div>
        )}

        <div className={styles.iconWrapper}>
          <span onClick={() => setShowMenu(!showMenu)}>☰</span>

          {showMenu && (
            <div className={styles.dropdownMenu}>
              <Link href="/device">Settings</Link>
              <Link href="/post">All Posts</Link>
              <Link href="/categories">Categories</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
