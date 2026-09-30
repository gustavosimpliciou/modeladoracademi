import { pgTable, text, timestamp, integer, jsonb, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./rbac";

export const settingsTable = pgTable("settings", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  label: text("label").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").notNull().default(false),
  validation: jsonb("validation").$type<Record<string, any>>(),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  keyIdx: uniqueIndex("settings_key_idx").on(table.key),
  categoryIdx: index("settings_category_idx").on(table.category),
}));

export const brandSettingsTable = pgTable("brand_settings", {
  id: text("id").primaryKey(),
  platformName: text("platform_name").notNull().default("Nativos3D Academy"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  loginImageUrl: text("login_image_url"),
  heroImageUrl: text("hero_image_url"),
  primaryColor: text("primary_color").notNull().default("#ff6a00"),
  secondaryColor: text("secondary_color").notNull().default("#111111"),
  accentColor: text("accent_color").notNull().default("#ff8126"),
  supportEmail: text("support_email"),
  websiteUrl: text("website_url"),
  instagramUrl: text("instagram_url"),
  youtubeUrl: text("youtube_url"),
  tiktokUrl: text("tiktok_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  githubUrl: text("github_url"),
  customCss: text("custom_css"),
  customJs: text("custom_js"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const homePageSectionsTable = pgTable("home_page_sections", {
  id: text("id").primaryKey(),
  sectionKey: text("section_key").notNull().unique(),
  title: text("title").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  order: integer("order").notNull().default(0),
  content: jsonb("content").notNull(),
  settings: jsonb("settings").$type<Record<string, any>>().notNull().default({}),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  sectionKeyIdx: uniqueIndex("home_sections_key_idx").on(table.sectionKey),
  orderIdx: index("home_sections_order_idx").on(table.order),
}));

export const insertSettingSchema = createInsertSchema(settingsTable).omit({ createdAt: true, updatedAt: true });
export const insertBrandSettingsSchema = createInsertSchema(brandSettingsTable).omit({ createdAt: true, updatedAt: true });
export const insertHomePageSectionSchema = createInsertSchema(homePageSectionsTable).omit({ createdAt: true, updatedAt: true });

export type Setting = z.infer<typeof insertSettingSchema>;
export type BrandSettings = z.infer<typeof insertBrandSettingsSchema>;
export type HomePageSection = z.infer<typeof insertHomePageSectionSchema>;

export const SETTING_CATEGORIES = {
  GENERAL: "general",
  BRAND: "brand",
  EMAIL: "email",
  NOTIFICATIONS: "notifications",
  SECURITY: "security",
  STORAGE: "storage",
  CERTIFICATES: "certificates",
  COURSES: "courses",
  SYSTEM: "system",
} as const;