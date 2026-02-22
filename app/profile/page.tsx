"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/app/src/db/lib/supabaseClient";
import styles from "./profile.module.css";
import homeStyles from "../home/home.module.css";

interface ProfileForm {
  firstName: string;
  lastName: string;
  contact: string;
  profile: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [form, setForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    contact: "",
    profile: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const splitName = (fullName: string) => {
    const cleaned = (fullName || "").trim();
    if (!cleaned) return { firstName: "", lastName: "" };

    const parts = cleaned.split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };

    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(" "),
    };
  };

  const getFullName = (firstName: string, lastName: string) =>
    `${firstName} ${lastName}`.trim();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    async function loadProfile() {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) {
        const msg = authError.message.toLowerCase();
        if (msg.includes("invalid refresh token") || msg.includes("refresh token not found")) {
          await supabase.auth.signOut();
          router.replace("/login");
          return;
        }

        setMessage(authError.message);
        setIsLoading(false);
        return;
      }

      const currentUser = authData.user;

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setAuthUserId(currentUser.id);
      setEmail(currentUser.email ?? "");

      const { data: existingProfile, error: fetchError } = await supabase
        .from("users")
        .select("name, contact, profile")
        .or(`p_id.eq.${currentUser.id},id.eq.${currentUser.id}`)
        .maybeSingle();

      if (fetchError) {
        setMessage(fetchError.message);
        setIsLoading(false);
        return;
      }

      if (!existingProfile) {
        const defaultName = (currentUser.user_metadata?.name as string) ?? "New User";
        const defaultContact = (currentUser.user_metadata?.contact as string) ?? "";

        const { data: insertedProfile, error: insertError } = await supabase
          .from("users")
          .insert({
            p_id: currentUser.id,
            name: defaultName,
            contact: defaultContact,
          })
          .select("name, contact, profile")
          .single();

        if (insertError) {
          setMessage(insertError.message);
        } else if (insertedProfile) {
          const parsed = splitName(insertedProfile.name ?? "");
          setForm({
            firstName: parsed.firstName,
            lastName: parsed.lastName,
            contact: insertedProfile.contact ?? "",
            profile: insertedProfile.profile ?? "",
          });
        }
      } else {
        const parsed = splitName(existingProfile.name ?? "");
        setForm({
          firstName: parsed.firstName,
          lastName: parsed.lastName,
          contact: existingProfile.contact ?? "",
          profile: existingProfile.profile ?? "",
        });
      }

      setIsLoading(false);
    }

    loadProfile();
  }, [router]);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authUserId) {
      router.push("/login");
      return;
    }

    setIsSaving(true);
    setMessage("");

    let profileImageUrl = form.profile.trim();

    if (selectedImage) {
      const extension = selectedImage.name.split(".").pop() || "jpg";
      const filePath = `profile/${authUserId}/${Date.now()}.${extension}`;
      const bucketCandidates = ["profile_images", "post_images"];
      let uploaded = false;

      for (const bucket of bucketCandidates) {
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, selectedImage, { upsert: true });

        if (!uploadError) {
          const { data: publicData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);
          profileImageUrl = publicData.publicUrl;
          uploaded = true;
          break;
        }

        if (!uploadError.message.toLowerCase().includes("bucket not found")) {
          setMessage(uploadError.message);
          setIsSaving(false);
          return;
        }
      }

      if (!uploaded) {
        setMessage(
          "Storage bucket not found. Create 'profile_images' bucket or allow uploads to 'post_images'."
        );
        setIsSaving(false);
        return;
      }
    }

    const { error } = await supabase
      .from("users")
      .update({
        name: getFullName(form.firstName, form.lastName),
        contact: form.contact.trim(),
        profile: profileImageUrl,
        updated_at: new Date().toISOString(),
      })
      .or(`p_id.eq.${authUserId},id.eq.${authUserId}`);

    if (error) {
      setMessage(error.message);
    } else {
      setForm((prev) => ({ ...prev, profile: profileImageUrl }));
      setSelectedImage(null);
      setPreviewUrl("");
      setMessage("Profile updated successfully.");
    }

    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <main className={styles.container}>
          <p>Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className={homeStyles.container}>
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

   
      <main className={styles.container}>
        {!isEditing ? (
          <div className={styles.card}>
            <div className={styles.avatarCircle}>
              {!avatarLoadError ? (
                <img
                  src={form.profile || "/default-avatar.png"}
                  alt="Profile avatar"
                  className={styles.avatar}
                  onError={() => setAvatarLoadError(true)}
                  onLoad={() => setAvatarLoadError(false)}
                />
              ) : (
                <span className={styles.avatarPlaceholder}>Profile</span>
              )}
            </div>

            <div className={styles.infoBlock}>
              <p><strong>First Name:</strong> {form.firstName || "Not set"}</p>
              <p><strong>Last Name:</strong> {form.lastName || "Not set"}</p>
              <p><strong>Email:</strong> {email || "Not set"}</p>
              <p><strong>Phone:</strong> {form.contact || "Not set"}</p>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => {
                  setMessage("");
                  setIsEditing(true);
                }}
              >
                Edit Profile
              </button>
              <button type="button" className={styles.signOutBtn} onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <form className={styles.card} onSubmit={handleSave}>
            <div className={styles.avatarCircle}>
              {!avatarLoadError ? (
                <img
                  src={previewUrl || form.profile || "/default-avatar.png"}
                  alt="Profile avatar"
                  className={styles.avatar}
                  onError={() => setAvatarLoadError(true)}
                  onLoad={() => setAvatarLoadError(false)}
                />
              ) : (
                <span className={styles.avatarPlaceholder}>Profile</span>
              )}
            </div>

            <div className={styles.field}>
              <label>First Name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Email (from auth)</label>
              <input type="email" value={email} disabled />
            </div>

            <div className={styles.field}>
              <label>Phone</label>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                placeholder="Phone number"
              />
            </div>

            <div className={styles.field}>
              <label>Profile Image</label>
              <input
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setSelectedImage(file);
                  setPreviewUrl(file ? URL.createObjectURL(file) : "");
                  setAvatarLoadError(false);
                }}
              />
            </div>

            {message && <p className={styles.message}>{message}</p>}

            <div className={styles.actions}>
              <button type="submit" className={styles.primaryBtn} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => {
                  setMessage("");
                  setSelectedImage(null);
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl("");
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
              <button type="button" className={styles.signOutBtn} onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          </form>
        )}
      </main>

      <div className={styles.help}>
        <Link href="/help">?</Link>
      </div>
    </div>
  );
}
