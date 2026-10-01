import { type AnyPgColumn, pgTable, text, timestamp, integer, jsonb, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./rbac";

export const categoriesTable = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  icon: text("icon"),
  color: text("color").default("#ff6a00"),
  parentId: text("parent_id").references((): AnyPgColumn => categoriesTable.id),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  courseCount: integer("course_count").notNull().default(0),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex("categories_slug_idx").on(table.slug),
  parentIdx: index("categories_parent_idx").on(table.parentId),
  orderIdx: index("categories_order_idx").on(table.order),
}));

export const insertCategorySchema = createInsertSchema(categoriesTable).omit({ createdAt: true, updatedAt: true, courseCount: true });

export type Category = z.infer<typeof insertCategorySchema>;