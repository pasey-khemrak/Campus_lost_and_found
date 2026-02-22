"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/src/db/lib/supabaseClient";
import styles from "../postdetail.module.css";
import AppHeader from "@/components/AppHeader";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<"lost" | "found" | "returned">("lost");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const normalizeImages = (postData: any): string[] => {
    if (Array.isArray(postData.photo)) return postData.photo.filter(Boolean);
    if (Array.isArray(postData.photos)) return postData.photos.filter(Boolean);
    if (typeof postData.photo === "string") {
      const trimmed = postData.photo.trim();
      if (!trimmed) return [];
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        const inner = trimmed.slice(1, -1).trim();
        if (!inner) return [];
        return inner.split(",").map((v: string) => v.trim().replace(/^"+|"+$/g, "")).filter(Boolean);
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
        const { data: authData } = await supabase.auth.getUser();
        const currentAuthUser = authData?.user ?? null;
        setCurrentUserId(currentAuthUser?.id ?? null);

        let currentUserProfile = null;
        if (currentAuthUser) {
          const { data: ownProfile } = await supabase
            .from("users")
            .select("name, contact, profile")
            .eq("id", currentAuthUser.id)
            .maybeSingle();
          currentUserProfile = ownProfile ?? null;
        }

        const { data: postData } = await supabase.from("posts").select("*").eq("id", id).single();
        if (!postData) return;

        let userData = null;
        const userIdKey = postData.user_id ?? null;
        if (userIdKey) {
          const { data: byId } = await supabase.from("users").select("name, profile, contact").eq("id", userIdKey).maybeSingle();
          userData = byId ?? null;
        }

        const images = normalizeImages(postData);
        const isCurrentUserPost = !!currentAuthUser && String(postData.user_id) === String(currentAuthUser.id);

        if (mounted) {
          setPost({
            ...postData,
            user: userData,
            images,
            imageUrl: images[0] || "/watch.webp",
            contact:
              postData.contact ||
              userData?.contact ||
              (isCurrentUserPost ? currentUserProfile?.contact ?? "" : ""),
            userName:
              postData.user_name ||
              postData.name ||
              userData?.name ||
              (isCurrentUserPost ? currentUserProfile?.name ?? "" : "Unknown User"),
            userProfile:
              postData.user_profile ||
              postData.profile ||
              userData?.profile ||
              (isCurrentUserPost ? currentUserProfile?.profile ?? "/default-avatar.png" : "/default-avatar.png"),
          });

          setEditTitle(postData.title ?? "");
          setEditDescription(postData.description ?? "");
          setEditStatus(postData.status ?? "lost");
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
      }
    }

    if (id) fetchPost();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!post) return <p>Loading...</p>;

  const isOwner = currentUserId === post.user_id;

  const handleSave = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      alert("Title and description cannot be empty.");
      return;
    }

    setIsLoading(true);

    try {
      // 1️⃣ Update posts table
      const { error: postError } = await supabase
        .from("posts")
        .update({ title: editTitle, description: editDescription, status: editStatus })
        .eq("id", post.id);

      if (postError) throw postError;

      // 2️⃣ Update lost_items or found_items table based on original status
      if (post.status === "lost") {
        await supabase
          .from("lost_items")
          .update({ status: editStatus })
          .eq("post_id", post.id);
      } else if (post.status === "found") {
        await supabase
          .from("found_items")
          .update({ status: editStatus })
          .eq("post_id", post.id);
      }

      // 3️⃣ Update local state
      setPost({ ...post, title: editTitle, description: editDescription, status: editStatus });
      setIsEditing(false);
      alert("Post updated successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update post.");
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;

    setIsLoading(true);
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    setIsLoading(false);
    if (error) {
      alert(error.message);
      return;
    }

    alert("Post deleted successfully!");
    window.location.href = "/post"; // redirect to posts list
  };

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
            {isOwner && (
              <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                <button onClick={() => setIsEditing(!isEditing)} style={{ cursor: "pointer" }}>
                  {isEditing ? "Cancel" : "Edit"}
                </button>
                <button onClick={handleDelete} style={{ cursor: "pointer", color: "red" }}>
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className={styles.descriptionBox}>
            {isEditing ? (
              <>
                <div>
                  <label>Title:</label>
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ width: "100%" }} />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1px solid black",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  />
                </div>
                <div>
                  <label>Status:</label>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as any)}>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                    <option value="returned">Returned</option>
                  </select>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  style={{
                    marginTop: "8px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <h3>{post.title}</h3>
                <h3>Description:</h3>
                <p>{post.description}</p>
                <br />
                <p>Location: {post.location_of_items || "Unknown"}</p>
                <p>Category: {post.product_category}</p>
                <p>Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
                <p>Contact: {post.contact || "No contact info available"}</p>
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
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}