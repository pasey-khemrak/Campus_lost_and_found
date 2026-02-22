"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/src/db/lib/supabaseClient";
import styles from "../postdetail.module.css";
import AppHeader from "@/components/AppHeader";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  const normalizeImages = (postData: any): string[] => {
    if (Array.isArray(postData.photo)) return postData.photo.filter(Boolean);
    if (Array.isArray(postData.photos)) return postData.photos.filter(Boolean);

    if (typeof postData.photo === "string") {
      const trimmed = postData.photo.trim();
      if (!trimmed) return [];

      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        const inner = trimmed.slice(1, -1).trim();
        if (!inner) return [];
        return inner
          .split(",")
          .map((v: string) => v.trim().replace(/^"+|"+$/g, ""))
          .filter(Boolean);
      }

      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch {
          return [trimmed];
        }
      }

      return [trimmed];
    }

    return [];
  };

  useEffect(() => {
    async function fetchPost() {
      const { data: authData } = await supabase.auth.getUser();
      const currentAuthUser = authData.user;
      let currentUserProfile: any = null;

      if (currentAuthUser) {
        const { data: ownProfile } = await supabase
          .from("users")
          .select("name, contact, profile")
          .eq("p_id", currentAuthUser.id)
          .maybeSingle();
        currentUserProfile = ownProfile;
      }

      const { data: postData } = await supabase.from("posts").select("*").eq("id", id).single();

      if (!postData) return;

      let userData: any = null;
      const userIdKey = String(postData.user_id ?? "");

      if (userIdKey) {
        const { data: byPid } = await supabase
          .from("users")
          .select("name, profile, contact")
          .eq("p_id", userIdKey)
          .maybeSingle();

        if (byPid) {
          userData = byPid;
        } else {
          const { data: byId } = await supabase
            .from("users")
            .select("name, profile, contact")
            .eq("id", userIdKey)
            .maybeSingle();
          userData = byId;
        }
      }

      const images = normalizeImages(postData);
      const isCurrentUserPost =
        !!currentAuthUser && String(postData.user_id) === String(currentAuthUser.id);

      setPost({
        ...postData,
        user: userData,
        images,
        imageUrl: images[0] || "/watch.webp",
        contact:
          postData.contact ||
          userData?.contact ||
          (isCurrentUserPost ? currentUserProfile?.contact || currentAuthUser?.user_metadata?.contact : "") ||
          "",
        userName:
          postData.user_name ||
          postData.name ||
          userData?.name ||
          (isCurrentUserPost ? currentUserProfile?.name || currentAuthUser?.user_metadata?.name : "") ||
          "Unknown User",
        userProfile:
          postData.user_profile ||
          postData.profile ||
          userData?.profile ||
          (isCurrentUserPost ? currentUserProfile?.profile || currentAuthUser?.user_metadata?.profile : "") ||
          "/default-avatar.png",
      });
    }

    if (id) fetchPost();
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <AppHeader showSearch searchPlaceholder="Search for the items" />

      <main className={styles.content}>
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <img src={post.imageUrl} className={styles.image} alt={post.title || "Post image"} />
          </div>
        </div>

        <div className={styles.detailSection}>
          <div className={styles.authorCard}>
            <div className={styles.avatar}>
              <img src={post.userProfile} className={styles.avatarImg} alt={post.userName || "User avatar"} />
            </div>
            <span className={styles.authorName}>{post.userName}</span>
          </div>

          <div className={styles.descriptionBox}>
            <h3>{post.title}</h3>
            <h3>Description:</h3>
            <p>{post.description}</p>
            <br />
            <p>Location: {post.location_of_items || "Unknown"}</p>
            <p>Category: {post.product_category}</p>
            <p>Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
            <p>Contact: {post.contact || "No contact info available"}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
