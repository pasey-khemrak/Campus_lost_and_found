"use client";

import Link from "next/link";
import styles from "../help.module.css";
import homeStyles from "../../home/home.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";


export default function HelpPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div className={styles.container}>
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
            <Link href="/help/page1">How to post lost item?</Link>
          </div>
          <div className={styles.sidebarItem}>
            <Link href="/help/page2">How to post found item?</Link>
          </div>
          <div className={styles.sidebarItem}>
            <Link href="/help/page3">How to find lost item?</Link>
          </div>
          <div className={styles.sidebarItem}>
            <Link href="/help/page4">How to find item by criteria?</Link>
          </div>
          <div className={styles.sidebarItem}>
            <Link href="/help/page5">How to change password?</Link>
          </div>
          <div className={styles.sidebarItem}>
            <Link href="/help/page6">How to delete account?</Link>
          </div>
        </aside>

        {/* CONTENT */}
        <section className={styles.content}>
          <h2>Help</h2>

          <div className={styles.card}>
            <p>
              Select a topic from the left to learn how to use Campus Lost and Found.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
