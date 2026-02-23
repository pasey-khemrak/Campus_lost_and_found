"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase, isSupabaseAvailable } from "@/app/src/db/lib/supabaseClient";
import styles from "../postdetail.module.css";
import AppHeader from "@/components/AppHeader";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);


  const [currentIndex, setCurrentIndex] = useState(0);

  const normalizeImages = (postData: any): string[] => {
    if (Array.isArray(postData.photo)) return postData.photo.filter(Boolean);
    if (typeof postData.photo === "string") {
      const trimmed = postData.photo.trim();
      if (!trimmed) return [];
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        return trimmed
          .slice(1, -1)
          .split(",")
          .map((v: string) => v.trim().replace(/^"+|"+$/g, ""))
          .filter(Boolean);
      }
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch {}
      }
      return [trimmed];
    }
    return [];
  };

  useEffect(() => {
    let mounted = true;

    async function fetchPost() {
      try {
        if (!isSupabaseAvailable()) {
          console.error("Supabase is not available");
          return;
        }

        const { data: authData } = await supabase!.auth.getUser();
        const user = authData?.user ?? null;
        setCurrentUserId(user?.id ?? null);

        const { data: postData, error } = await supabase!
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !postData) {
          console.error("Fetch post error:", error);
          return;
        }

        let userData = null;

        if (postData.user_id) {
          const { data } = await supabase!
            .from("users")
            .select("name, profile, contact")
            .eq("id", postData.user_id)
            .maybeSingle();

          userData = data;
        }

        const images = normalizeImages(postData);

        if (mounted) {
          setPost({
            ...postData,
            images,
            imageUrl: images[0] || "/watch.webp",
            userName:
              userData?.name || postData.user_name || "Unknown User",
            userProfile:
              userData?.profile ||
              postData.user_profile ||
              "/default-avatar.png",
            contact:
              postData.contact ||
              userData?.contact ||
              "No contact info",
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    if (id) fetchPost();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (!post) return <p>Loading...</p>;

  const isOwner = currentUserId === post.user_id;

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev < post.images.length - 1 ? prev + 1 : prev
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
  
    if (!isSupabaseAvailable()) {
      alert("Database connection not available");
      return;
    }
  
    setIsLoading(true);
  
    try {
      console.log("Deleting post (CASCADE):", post.id);
      const { error } = await supabase!
        .from("posts")
        .delete()
        .eq("id", post.id);
  
      if (error) throw error;
  
      alert("Post deleted successfully!");
      window.location.href = "/post";
  
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(err.message || "Delete failed");
    }
  
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <AppHeader showSearch searchPlaceholder="Search for the items" />

      <main className={styles.content}>
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper} style={{ position: "relative" }}>
            
            {post.images.length > 1 && (
              <button
                onClick={prevImage}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  cursor: "pointer",
                }}
              >
                ◀
              </button>
            )}

            <img
              src={post.images[currentIndex]}
              className={styles.image}
              alt="post"
            />

            {/* RIGHT BUTTON */}
            {post.images.length > 1 && (
              <button
                onClick={nextImage}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  cursor: "pointer",
                }}
              >
                ▶
              </button>
            )}
          </div>
        </div>

        <div className={styles.detailSection}>
          <div className={styles.authorCard}>
            <div className={styles.avatar}>
              <img
                src={post.userProfile}
                className={styles.avatarImg}
                alt="avatar"
              />
            </div>

            <span className={styles.authorName}>{post.userName}</span>

            {isOwner && (
              <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  style={{ cursor: "pointer", color: "red" }}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>

          <div className={styles.descriptionBox}>
            <h3>{post.title}</h3>

            <h3>Description:</h3>
            <p>{post.description}</p>

            <br />

            <p>Location: {post.location_of_items || "Unknown"}</p>
            <p>Category: {post.product_category}</p>
            <p>
              Posted on:{" "}
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <p>Contact: {post.contact}</p>

            <p>
              Status:{" "}
              <span
                style={{
                  color:
                    post.status === "returned"
                      ? "green"
                      : post.status === "lost"
                      ? "red"
                      : "black",
                }}
              >
                {post.status}
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}