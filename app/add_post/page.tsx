"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/src/db/lib/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "./add_post.module.css";
import AppHeader from "@/components/AppHeader";

export default function AddPostPage() {
  const router = useRouter();

  const [postType, setPostType] = useState<"lost" | "found">("lost");
  const [images, setImages] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const maxImages = 3;
  const categories = ["Electronics", "Clothing", "Documents", "Accessories", "Others"];

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
      setIsLoading(false);
    }
    checkUser();
  }, [router]);

  if (isLoading) return <p>Loading...</p>;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > maxImages) {
      return alert("You can upload up to 3 images only.");
    }
    setImages((prev) => [...prev, ...files]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return router.push("/login");

    try {
      const imageUrls: string[] = [];

      let userSnapshot = {
        name: (user.user_metadata?.name as string) || "Unknown User",
        contact: (user.user_metadata?.contact as string) || "",
        profile: (user.user_metadata?.profile as string) || "",
      };

      const { data: userRow } = await supabase
        .from("users")
        .select("name, contact, profile")
        .eq("p_id", user.id)
        .maybeSingle();

      if (userRow) {
        userSnapshot = {
          name: userRow.name || userSnapshot.name,
          contact: userRow.contact || userSnapshot.contact,
          profile: userRow.profile || userSnapshot.profile,
        };
      }

      for (const file of images) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage.from("post_images").upload(fileName, file);

        if (uploadError) {
          console.error(uploadError);
          return alert("Image upload failed");
        }

        const { data } = supabase.storage.from("post_images").getPublicUrl(fileName);
        imageUrls.push(data.publicUrl);
      }

      const basePostPayload = {
        user_id: user.id,
        title,
        product_category: category,
        description,
        photo: imageUrls,
        status: postType,
        location_of_items: location,
        created_at: new Date(),
      };

      const payloadCandidates: Record<string, any>[] = [
        {
          ...basePostPayload,
          user_name: userSnapshot.name,
          user_profile: userSnapshot.profile,
          contact: userSnapshot.contact,
        },
        {
          ...basePostPayload,
          name: userSnapshot.name,
          profile: userSnapshot.profile,
          contact: userSnapshot.contact,
        },
        {
          ...basePostPayload,
          contact: userSnapshot.contact,
        },
        basePostPayload,
      ];

      let postData: any = null;
      let postError: any = null;

      for (const payload of payloadCandidates) {
        const result = await supabase.from("posts").insert(payload).select().single();

        if (!result.error) {
          postData = result.data;
          postError = null;
          break;
        }

        postError = result.error;
      }

      if (postError) {
        console.error(postError);
        return alert(postError.message || "Insert failed");
      }

      if (postType === "lost") {
        await supabase.from("lost_items").insert({
          post_id: postData.id,
          user_id: user.id,
          type_of_product: title,
          description,
          product_category: category,
          location_of_items: location,
          created_at: new Date(),
        });
      }

      if (postType === "found") {
        await supabase.from("found_items").insert({
          post_id: postData.id,
          user_id: user.id,
          type_of_product: title,
          description,
          product_category: category,
          location_of_items: location,
          created_at: new Date(),
        });
      }

      alert("Post created successfully");
      router.push("/post");
    } catch (err) {
      console.error(err);
      alert("Unexpected error");
    }
  }

  return (
    <div className={styles.page}>
      <AppHeader />

      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Add Lost / Found Item</h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label>Type</label>
              <select value={postType} onChange={(e) => setPostType(e.target.value as "lost" | "found")}>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Item Name</label>
              <input required onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className={styles.field}>
              <label>Category</label>
              <select required value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Location</label>
              <input required onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div className={styles.field}>
              <label>Description</label>
              <textarea required onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className={styles.field}>
              <label>Photos (1-3)</label>

              <div className={styles.imageGrid}>
                {images.map((file, i) => (
                  <div key={i} className={styles.imagePreview}>
                    <img src={URL.createObjectURL(file)} alt="preview" />
                    <button type="button" onClick={() => removeImage(i)} className={styles.removeBtn}>
                      X
                    </button>
                  </div>
                ))}

                {images.length < maxImages && (
                  <label className={styles.uploadBox}>
                    +
                    <input type="file" accept="image/*" multiple hidden onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Submit Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
