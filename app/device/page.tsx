"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/app/src/db/lib/supabaseClient";
import styles from "./device.module.css";
import homeStyles from "../home/home.module.css";

function parseDeviceFromUserAgent(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  let device = "";
  let platform = "";

  if (/iPhone|iPod/.test(ua)) {
    device = "iPhone";
    platform = "iOS";
  } else if (/iPad/.test(ua)) {
    device = "iPad";
    platform = "iOS";
  } else if (/Android/.test(ua)) {
    platform = "Android";
    const modelMatch = ua.match(/Android[^;]*;\s*([^)]+)\)/);
    if (modelMatch) {
      const model = modelMatch[1].trim();
      if (!/^\d+\.\d+$/.test(model)) device = model;
    }
    if (!device) device = "Android Device";
  } else if (/Windows/.test(ua)) {
    platform = "Windows";
  } else if (/Mac OS X|Macintosh/.test(ua)) {
    platform = "Mac";
  } else if (/Linux/.test(ua)) {
    platform = "Linux";
  }

  let browser = "";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua) && !/Chromium|Edg/.test(ua)) browser = "Chrome";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
  else if (/Firefox\//.test(ua)) browser = "Firefox";

  if (device && platform && device !== "Android Device") return `${device} (${platform})`;
  if (device && platform) return `${device}`;
  if (device) return device;
  if (browser && platform) return `${browser} on ${platform}`;
  if (platform) return platform;
  return "Unknown";
}

export default function Page() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [deviceModel, setDeviceModel] = useState<string>("Loading...");
  const [location, setLocation] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function detectDevice() {
      try {
        const ua = navigator as Navigator & { userAgentData?: { getHighEntropyValues: (hints: string[]) => Promise<{ model?: string; platform?: string }> } };
        if (ua.userAgentData?.getHighEntropyValues) {
          const values = await ua.userAgentData.getHighEntropyValues(["model", "platform"]);
          if (values.model && values.model.trim()) {
            const platform = values.platform ? ` (${values.platform})` : "";
            setDeviceModel(`${values.model}${platform}`);
            return;
          }
        }
      } catch {}
      setDeviceModel(parseDeviceFromUserAgent());
    }
    detectDevice();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Location not available");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { Accept: "application/json", "User-Agent": "CampusLostAndFound/1.0" } }
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "";
          const country = data.address?.country || "";
          setLocation(city && country ? `${city}, ${country}` : country || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        } catch {
          setLocation(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
        }
      },
      () => setLocation("Location permission denied")
    );
  }, []);

  const handleLogoutThisDevice = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleLogoutAllDevices = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    if (getUserError || !user) {
      alert("No user found.");
      setIsLoading(false);
      setShowConfirm(false);
      return;
    }

    try {
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
            <h2>Device</h2>

            <div className={styles.card}>
              <p><strong>Device:</strong> {deviceModel}</p>
              <p className={styles.location}><strong>Location:</strong> {location}</p>
              <button className={styles.logoutOne} onClick={handleLogoutThisDevice}>
                🚪 Log out this device
              </button>
            </div>

            <button className={styles.logoutAll} onClick={handleLogoutAllDevices}>
              Log out all devices
            </button>
          </section>
        </main>

        <div className={styles.help}><a href="/help">?</a></div>
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