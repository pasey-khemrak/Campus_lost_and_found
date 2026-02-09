import {
  serial,
  varchar,
  text,
  timestamp,
  pgTable,
  integer,
  foreignKey,
} from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  p_id: varchar("p_id", { length: 100 }).notNull(),
  contact: varchar("contact", { length: 20 }),
  profile: text("profile"),
  department: varchar("department", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Posts Table
export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    productCategory: varchar("product_category", { length: 255 }),
    description: text("description"),
    photo: varchar("photo", { length: 500 }),
    date: timestamp("date").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  }),
);

// Lost Items Table
export const lostItems = pgTable(
  "lost_items",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id").notNull(),
    userId: integer("user_id").notNull(),
    typeOfProduct: varchar("type_of_product", { length: 255 }),
    sizeOfProduct: varchar("size_of_product", { length: 100 }),
    description: text("description"),
    productCategory: varchar("product_category", { length: 255 }),
    locationOfItems: varchar("location_of_items", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    postIdFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }),
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  }),
);

// Type definitions for application use
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type LostItem = typeof lostItems.$inferSelect;
export type NewLostItem = typeof lostItems.$inferInsert;
