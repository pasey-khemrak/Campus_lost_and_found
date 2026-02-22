"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./AppHeader.module.css";

interface AppHeaderProps {
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
}

export default function AppHeader({
  showSearch = false,
  searchValue = "",
  searchPlaceholder = "Search by item name or category...",
  onSearchChange,
}: AppHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logoWrapper}>
          <Image src="/logo.png" alt="Campus Logo" width={50} height={50} className={styles.logo} />
        </div>
        <span className={styles.title}>Campus Lost and Found</span>
      </div>

      {showSearch && (
        <div className={styles.searchBox}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      )}

      <div className={styles.icons}>
        <div className={styles.iconWrapper}>
          <button type="button" className={styles.iconButton} onClick={() => setShowNotif((v) => !v)}>
            🔔
          </button>
          {showNotif && (
            <div className={styles.notificationBox}>
              <h4>Notifications</h4>
            </div>
          )}
        </div>

        <div className={styles.iconWrapper}>
          <button type="button" className={styles.iconButton} onClick={() => setShowMenu((v) => !v)}>
            ☰
          </button>
          {showMenu && (
            <div className={styles.dropdownMenu}>
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
  );
}
