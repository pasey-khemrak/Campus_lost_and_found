"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase, isSupabaseAvailable } from "@/app/src/db/lib/supabaseClient";
import styles from "./feedback.module.css";
import homeStyles from "../home/home.module.css";

export default function Page() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseAvailable()) {
        console.error("Supabase is not available");
        return;
      }
      
      const { data: { user } } = await supabase!.auth.getUser();
      if (!user) router.replace("/login");
    }
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = feedbackText.trim();
    if (!trimmed) {
      alert("Please enter your feedback.");
      return;
    }

    if (!isSupabaseAvailable()) {
      alert("Database connection not available");
      return;
    }

    setIsLoading(true);
    const { data: { user }, error: authError } = await supabase!.auth.getUser();
    if (authError || !user) {
      alert("Please log in to submit feedback.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase!.from("feedback").insert({
      user_id: user.id,
      message: trimmed,
    });

    setIsLoading(false);
    if (error) {
      alert(error.message);
      return;
    }

    alert("Thank you for your feedback!");
    setFeedbackText("");
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    
    if (!isSupabaseAvailable()) {
      alert("Database connection not available");
      setIsLoading(false);
      return;
    }
    
    const { data: { user }, error: getUserError } = await supabase!.auth.getUser();
    if (getUserError || !user) {
      alert("No user found.");
      setIsLoading(false);
      setShowConfirm(false);
      return;
    }

    try {
      // Call server-side API route
      const res = await fetch("/api/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error deleting account");
        setShowConfirm(false);
        setIsLoading(false);
        return;
      }

      alert("Account deleted successfully!");
      setShowConfirm(false);
      setIsLoading(false);
      router.push("/signup");
    } catch (err) {
      alert("Server error. Try again.");
      setShowConfirm(false);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={showConfirm ? styles.blur : ""}>
        <header className={homeStyles.header}>
          <div className={homeStyles.left}>
            <Link href="/" className={homeStyles.logoLink}>
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
            </Link>
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
              <a href="/device">Device</a>
            </div>

            <div className={styles.sidebarItem}>
              <a href="/change_password">Change Password</a>
            </div>

            <div
              className={styles.sidebarItem}
              onClick={() => setShowConfirm(true)}
              style={{ cursor: "pointer" }}
            >
              Delete account
            </div>

            <div className={styles.sidebarItem}>
              <a href="/feedback">Feedback</a>
            </div>
          </aside>

          <section className={styles.content}>
            <h2>FeedBack</h2>

            <form className={styles.card} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label>Feedback</label>
                <textarea
                  placeholder="Your feedback here..."
                  rows={5}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                />
              </div>

              <div className={styles.buttonContainer}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </section>
        </main>

        <div className={styles.help}><Link href="/help">?</Link></div>
      </div>

      {showConfirm && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>Are you sure you want to delete your account?</h3>
            <p>This action can’t be undone after you confirm.</p>

            <div className={styles.modalButtons}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
                className={styles.confirmBtn}
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}