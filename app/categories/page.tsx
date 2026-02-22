"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./categories.module.css";
import AppHeader from "@/components/AppHeader";

export default function CategoriesPage() {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (category) params.append("category", category);
    if (status) params.append("status", status);
    if (name) params.append("name", name);

    router.push(`/post?${params.toString()}`);
  };

  return (
    <div className={styles.page}>
      <AppHeader
        showSearch
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search for the items"
      />

      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.field}>
            <label>Type of Product</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Type of the product</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Documents">Documents</option>
              <option value="Accessories">Accessories</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Name </label>
            <input
              type="text"
              placeholder="Name of the product"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Status</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioItem}>
                <input
                  type="radio"
                  name="status"
                  value="lost"
                  checked={status === "lost"}
                  onChange={() => setStatus("lost")}
                />
                <span>Lost</span>
              </label>

              <label className={styles.radioItem}>
                <input
                  type="radio"
                  name="status"
                  value="found"
                  checked={status === "found"}
                  onChange={() => setStatus("found")}
                />
                <span>Found</span>
              </label>
            </div>
          </div>

          <button className={styles.searchBtn} onClick={handleSearch}>
            Search
          </button>
        </div>
      </main>

      <div className={styles.help}>
        <a href="/help">?</a>
      </div>
    </div>
  );
}
