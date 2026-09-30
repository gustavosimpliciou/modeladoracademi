import { pgTable, text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./rbac";

export const adminLogsTable = pgTable("admin_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id"),
  oldValues: jsonb("old_values").$type<Record<string, any>>(),
  newValues: jsonb("new_values").$type<Record<string, any>>(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata").$type<Record<string, any>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index("admin_logs_user_idx").on(table.userId),
  resourceIdx: index("admin_logs_resource_idx").on(table.resourceType, table.resourceId),
  actionIdx: index("admin_logs_action_idx").on(table.action),
  dateIdx: index("admin_logs_date_idx").on(table.createdAt),
}));

export const systemLogsTable = pgTable("system_logs", {
  id: text("id").primaryKey(),
  level: text("level").notNull(),
  message: text("message").notNull(),
  source: text("source"),
  stackTrace: text("stack_trace"),
  context: jsonb("context").$type<Record<string, any>>().notNull().default({}),
  userId: text("user_id").references(() => usersTable.id, { onDelete: "set null" }),
  requestId: text("request_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  levelIdx: index("system_logs_level_idx").on(table.level),
  sourceIdx: index("system_logs_source_idx").on(table.source),
  dateIdx: index("system_logs_date_idx").on(table.createdAt),
}));

export const insertAdminLogSchema = createInsertSchema(adminLogsTable).omit({ createdAt: true });
export const insertSystemLogSchema = createInsertSchema(systemLogsTable).omit({ createdAt: true });

export type AdminLog = z.infer<typeof insertAdminLogSchema>;
export type SystemLog = z.infer<typeof insertSystemLogSchema>;

export const ADMIN_ACTIONS = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  PUBLISH: "publish",
  UNPUBLISH: "unpublish",
  DUPLICATE: "duplicate",
  REORDER: "reorder",
  UPLOAD: "upload",
  DOWNLOAD: "download",
  ASSIGN: "assign",
  UNASSIGN: "unassign",
  GRADE: "grade",
  REVOKE: "revoke",
  BLOCK: "block",
  UNBLOCK: "unblock",
  EXPORT: "export",
  IMPORT: "import",
  LOGIN: "login",
  LOGOUT: "logout",
  IMPERSONATE: "impersonate",
} as const;

export const RESOURCE_TYPES = {
  COURSE: "course",
  MODULE: "module",
  LESSON: "lesson",
  QUIZ: "quiz",
  QUESTION: "question",
  ACTIVITY: "activity",
  ASSIGNMENT: "assignment",
  CERTIFICATE: "certificate",
  CERTIFICATE_TEMPLATE: "certificate_template",
  USER: "user",
  INSTRUCTOR: "instructor",
  STUDENT: "student",
  MEDIA: "media",
  BANNER: "banner",
  CATEGORY: "category",
  NOTIFICATION: "notification",
  ANNOUNCEMENT: "announcement",
  SETTING: "setting",
  ROLE: "role",
  PERMISSION: "permission",
} as const;