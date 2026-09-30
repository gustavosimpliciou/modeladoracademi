import { pgTable, text, timestamp, integer, jsonb, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./rbac";

export const mediaTable = pgTable("media", {
  id: text("id").primaryKey(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  type: text("type").notNull(),
  category: text("category").notNull(),
  width: integer("width"),
  height: integer("height"),
  duration: integer("duration"),
  uploadedBy: text("uploaded_by").references(() => usersTable.id),
  folder: text("folder").default("general"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  metadata: jsonb("metadata").$type<Record<string, any>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  typeIdx: index("media_type_idx").on(table.type),
  categoryIdx: index("media_category_idx").on(table.category),
  folderIdx: index("media_folder_idx").on(table.folder),
  uploadedByIdx: index("media_uploaded_by_idx").on(table.uploadedBy),
}));

export const mediaFoldersTable = pgTable("media_folders", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  parentId: text("parent_id").references(() => mediaFoldersTable.id),
  path: text("path").notNull(),
  createdBy: text("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  pathIdx: uniqueIndex("media_folders_path_idx").on(table.path),
  parentIdx: index("media_folders_parent_idx").on(table.parentId),
}));

export const insertMediaSchema = createInsertSchema(mediaTable).omit({ createdAt: true, updatedAt: true });
export const insertMediaFolderSchema = createInsertSchema(mediaFoldersTable).omit({ createdAt: true, updatedAt: true });

export type Media = z.infer<typeof insertMediaSchema>;
export type MediaFolder = z.infer<typeof insertMediaFolderSchema>;

export const MEDIA_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  DOCUMENT: "document",
  MODEL_3D: "model_3d",
  ARCHIVE: "archive",
  OTHER: "other",
} as const;

export const MEDIA_CATEGORIES = {
  IMAGES: "images",
  VIDEOS: "videos",
  DOCUMENTS: "documents",
  MODELS_3D: "models_3d",
} as const;

export const ALLOWED_MIME_TYPES = {
  [MEDIA_TYPES.IMAGE]: ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"],
  [MEDIA_TYPES.VIDEO]: ["video/mp4", "video/webm", "video/quicktime"],
  [MEDIA_TYPES.DOCUMENT]: ["application/pdf", "application/zip", "application/x-zip-compressed"],
  [MEDIA_TYPES.MODEL_3D]: ["model/stl", "application/sla", "model/obj", "model/3mf", "model/gltf-binary"],
  [MEDIA_TYPES.ARCHIVE]: ["application/zip", "application/x-zip-compressed", "application/x-rar-compressed"],
} as const;