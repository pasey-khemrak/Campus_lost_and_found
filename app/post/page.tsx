"use client";

import Link from "next/link";
import { supabase } from "@/app/src/db/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./post.module.css";
import AppHeader from "@/components/AppHeader";

interface PostUI {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  contact: string;
  status: "lost" | "found";
  images: string[];
  createdAt: string;
}

export default function Page() {
  const [posts, setPosts] = useState<PostUI[]>([]);
  const [headerSearch, setHeaderSearch] = useState("");

  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const statusFilter = searchParams.get("status");
  const nameParam = searchParams.get("name") || "";

  const normalizeImages = (post: any): string[] => {
    if (Array.isArray(post.photo)) return post.photo.filter(Boolean);
    if (Array.isArray(post.photos)) return post.photos.filter(Boolean);

    if (typeof post.photo === "string") {
      const trimmed = post.photo.trim();
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

  const loadPosts = async () => {
    let query = supabase.from("posts").select("*").order("created_at", { ascending: false });

    if (categoryFilter) query = query.eq("product_category", categoryFilter);
    if (statusFilter) query = query.eq("status", statusFilter);

    const { data: postData, error } = await query;

    if (error) {
      console.error("Post Error:", error);
      return;
    }

    if (!postData) {
      setPosts([]);
      return;
    }

    const search = (headerSearch.trim() || nameParam).trim().toLowerCase();

    const formattedPosts: PostUI[] = (
      await Promise.all(
        postData.map(async (post: any) => {
          let itemData: any = null;

          try {
            if (post.status === "lost") {
              const { data } = await supabase
                .from("lost_items")
                .select("type_of_product")
                .eq("post_id", post.id)
                .limit(1)
                .single();
              itemData = data;
            } else {
              const { data } = await supabase
                .from("found_items")
                .select("type_of_product")
                .eq("post_id", post.id)
                .limit(1)
                .single();
              itemData = data;
            }
          } catch {

          }

          const itemName = itemData?.type_of_product || post.text || "Item";

          if (search) {
            const keywords = search.split(" ");
            const fullText =
              `${post.title || ""} ${post.description || ""} ${itemName} ${post.product_category || ""}`.toLowerCase();
            const matchesAll = keywords.every((word) => fullText.includes(word));
            if (!matchesAll) return null;
          }

          return {
            id: post.id,
            title: post.title || itemName,
            description: post.description || "",
            category: post.product_category || "",
            location: post.location_of_items || "Unknown location",
            contact: post.contact || "No contact info",
            status: post.status,
            images: normalizeImages(post),
            createdAt: post.created_at,
          };
        })
      )
    ).filter(Boolean) as PostUI[];

    setPosts(formattedPosts);
  };

  useEffect(() => {
    if (nameParam) setHeaderSearch((prev) => (prev ? prev : nameParam));
  }, [nameParam]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadPosts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [categoryFilter, statusFilter, headerSearch, nameParam]);

  return (
    <div className={styles.container}>
      <AppHeader
        showSearch
        searchValue={headerSearch}
        onSearchChange={setHeaderSearch}
        searchPlaceholder="Search by item name or category..."
      />

      <main className={styles.main}>
        {posts.length === 0 && <p className={styles.empty}>No posts found.</p>}

        <div className={styles.cards}>
          {posts.map((post) => (
            <Link href={`/post_detail/${post.id}`} key={post.id}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>{post.title}</div>

                {post.images.length > 0 ? (
                  <img src={post.images[0]} alt="item" className={styles.image} />
                ) : (
                  <div className={styles.imagePlaceholder}>IMG</div>
                )}

                <p className={styles.titleText}>Title: {post.title}</p>
                <p className={styles.contact}>Contact: {post.contact}</p>
                <p className={styles.location}>Location: {post.location}</p>
                <div className={styles.status}>
                  <span className={`${styles.dot} ${post.status === "lost" ? styles.lost : styles.found}`} />
                  {post.status === "lost" ? "Lost Item" : "Found Item"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
