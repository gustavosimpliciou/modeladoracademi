import { pgTable, text, timestamp, integer, jsonb, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./rbac";

export const notificationsTable = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"),
  referenceType: text("reference_type"),
  referenceId: text("reference_id"),
  actionUrl: text("action_url"),
  isRead: boolean("is_read").notNull().default(false),
  readAt: timestamp("read_at", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index("notifications_user_idx").on(table.userId),
  readIdx: index("notifications_read_idx").on(table.userId, table.isRead),
  referenceIdx: index("notifications_reference_idx").on(table.referenceType, table.referenceId),
}));

export const notificationTemplatesTable = pgTable("notification_templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull(),
  variables: jsonb("variables").$type<string[]>().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const announcementsTable = pgTable("announcements", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"),
  targetAudience: text("target_audience").notNull().default("all"),
  targetCourses: jsonb("target_courses").$type<string[]>().notNull().default([]),
  targetModules: jsonb("target_modules").$type<string[]>().notNull().default([]),
  targetUsers: jsonb("target_users").$type<string[]>().notNull().default([]),
  sendAt: timestamp("send_at", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  status: text("status").notNull().default("draft"),
  createdBy: text("created_by").references(() => usersTable.id),
  sentBy: text("sent_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  statusIdx: index("announcements_status_idx").on(table.status),
  sendAtIdx: index("announcements_send_at_idx").on(table.sendAt),
}));

export const insertNotificationSchema = createInsertSchema(notificationsTable).omit({ sentAt: true, readAt: true });
export const insertNotificationTemplateSchema = createInsertSchema(notificationTemplatesTable).omit({ createdAt: true, updatedAt: true });
export const insertAnnouncementSchema = createInsertSchema(announcementsTable).omit({ createdAt: true, updatedAt: true, sentAt: true });

export type Notification = z.infer<typeof insertNotificationSchema>;
export type NotificationTemplate = z.infer<typeof insertNotificationTemplateSchema>;
export type Announcement = z.infer<typeof insertAnnouncementSchema>;

export const NOTIFICATION_TYPES = {
  INFO: "info",
  WARNING: "warning",
  NEWS: "news",
  COURSE: "course",
  QUIZ: "quiz",
  CERTIFICATE: "certificate",
  ASSIGNMENT: "assignment",
  SYSTEM: "system",
} as const;

export const ANNOUNCEMENT_TYPES = {
  INFO: "info",
  WARNING: "warning",
  NEWS: "news",
  COURSE: "course",
  QUIZ: "quiz",
  CERTIFICATE: "certificate",
} as const;