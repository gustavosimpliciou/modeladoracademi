import { pgTable, text, timestamp, integer, jsonb, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./rbac";

export const bannersTable = pgTable("banners", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  mobileImageUrl: text("mobile_image_url"),
  linkUrl: text("link_url"),
  buttonText: text("button_text"),
  buttonUrl: text("button_url"),
  position: text("position").notNull().default("hero"),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  status: text("status").notNull().default("active"),
  priority: integer("priority").notNull().default(0),
  targetAudience: text("target_audience").default("all"),
  courses: jsonb("courses").$type<string[]>().notNull().default([]),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  statusIdx: index("banners_status_idx").on(table.status),
  positionIdx: index("banners_position_idx").on(table.position),
  dateIdx: index("banners_date_idx").on(table.startDate, table.endDate),
}));

export const insertBannerSchema = createInsertSchema(bannersTable).omit({ createdAt: true, updatedAt: true });

export type Banner = z.infer<typeof insertBannerSchema>;

export const BANNER_POSITIONS = {
  HERO: "hero",
  ABOVE_FOLD: "above_fold",
  BETWEEN_SECTIONS: "between_sections",
  SIDEBAR: "sidebar",
  FOOTER: "footer",
  POPUP: "popup",
} as const;

export const BANNER_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SCHEDULED: "scheduled",
  EXPIRED: "expired",
} as const;