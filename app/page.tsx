"use client";

import Link from "next/link";
import { supabase } from "@/app/src/db/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./home/home.module.css";
import AppHeader from "@/components/AppHeader";

interface Post {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: "lost" | "found";
  images: string[];
  contact: string;
  createdAt: string;
}

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [headerSearch, setHeaderSearch] = useState("");

  const normalizeImages = (post: any): string[] => {
    if (Array.isArray(post.image)) return post.image.filter(Boolean);
    if (Array.isArray(post.photo)) return post.photo.filter(Boolean);
    if (Array.isArray(post.photos)) return post.photos.filter(Boolean);

    const rawImage = typeof post.photo === "string" ? post.photo : post.image;
    if (typeof rawImage === "string") {
      const trimmed = rawImage.trim();
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
    const { data: postData, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Post Error:", error);
      return;
    }

    if (!postData) {
      setPosts([]);
      return;
    }

    const search = headerSearch.trim().toLowerCase();

    const formattedPosts: Post[] = (
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
            // optional
          }

          const itemName = itemData?.type_of_product || post.text || "Item";

          if (search) {
            const keywords = search.split(" ");
            const fullText = `${post.title || ""} ${post.description || ""} ${itemName} ${post.product_category || ""}`.toLowerCase();
            const matchesAll = keywords.every((word) => fullText.includes(word));
            if (!matchesAll) return null;
          }

          return {
            id: post.id,
            title: post.title || itemName,
            description: post.description || "",
            category: post.product_category || "",
            location: post.location_of_items || "Unknown",
            contact: post.contact || "No contact info",
            status: post.status,
            images: normalizeImages(post),
            createdAt: post.created_at,
          };
        })
      )
    ).filter(Boolean) as Post[];

    setPosts(formattedPosts);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadPosts();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [headerSearch]);

  const handleAddPostClick = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      router.push("/login?message=Please%20login%20first");
      return;
    }
    router.push("/add_post");
  };

  return (
    <div className={styles.container}>
      <AppHeader
        showSearch
        searchValue={headerSearch}
        onSearchChange={setHeaderSearch}
        searchPlaceholder="Search by item name or category..."
      />

      <main className={styles.main}>
        <h1 className={styles.heading}>Latest 3 posts</h1>
        {posts.length === 0 && <p>No posts found.</p>}

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

        {posts.length > 0 && (
          <Link href="/post">
            <button className={styles.seeMore}>See more</button>
          </Link>
        )}
      </main>

      <button className={styles.addBtn} onClick={handleAddPostClick}>
        +
      </button>

      <div className={styles.help}>
        <Link href="/help">?</Link>
      </div>
    </div>
  );
}
