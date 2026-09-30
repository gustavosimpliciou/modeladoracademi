import { pgTable, text, timestamp, boolean, integer, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rolesTable = pgTable("roles", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  permissions: jsonb("permissions").$type<string[]>().notNull().default([]),
  isSystem: boolean("is_system").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  roleId: text("role_id").references(() => rolesTable.id),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  clerkIdIdx: uniqueIndex("users_clerk_id_idx").on(table.clerkId),
  emailIdx: uniqueIndex("users_email_idx").on(table.email),
  roleIdx: index("users_role_idx").on(table.roleId),
}));

export const permissionsTable = pgTable("permissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  category: text("category").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userRolesTable = pgTable("user_roles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  roleId: text("role_id").notNull().references(() => rolesTable.id, { onDelete: "cascade" }),
  assignedBy: text("assigned_by").references(() => usersTable.id),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
}, (table) => ({
  userRoleIdx: uniqueIndex("user_roles_user_role_idx").on(table.userId, table.roleId),
  userIdx: index("user_roles_user_idx").on(table.userId),
}));

export const rolePermissionsTable = pgTable("role_permissions", {
  id: text("id").primaryKey(),
  roleId: text("role_id").notNull().references(() => rolesTable.id, { onDelete: "cascade" }),
  permissionId: text("permission_id").notNull().references(() => permissionsTable.id, { onDelete: "cascade" }),
}, (table) => ({
  rolePermIdx: uniqueIndex("role_permissions_role_perm_idx").on(table.roleId, table.permissionId),
}));

export const insertRoleSchema = createInsertSchema(rolesTable);
export const insertUserSchema = createInsertSchema(usersTable).omit({ createdAt: true, updatedAt: true, lastLoginAt: true });
export const insertPermissionSchema = createInsertSchema(permissionsTable);
export const insertUserRoleSchema = createInsertSchema(userRolesTable).omit({ assignedAt: true });
export const insertRolePermissionSchema = createInsertSchema(rolePermissionsTable);

export type Role = z.infer<typeof insertRoleSchema>;
export type User = z.infer<typeof insertUserSchema>;
export type Permission = z.infer<typeof insertPermissionSchema>;
export type UserRole = z.infer<typeof insertUserRoleSchema>;
export type RolePermission = z.infer<typeof insertRolePermissionSchema>;

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  INSTRUCTOR: "INSTRUCTOR",
  STUDENT: "STUDENT",
} as const;

export const PERMISSIONS = {
  COURSES_VIEW: "courses.view",
  COURSES_CREATE: "courses.create",
  COURSES_EDIT: "courses.edit",
  COURSES_DELETE: "courses.delete",
  COURSES_PUBLISH: "courses.publish",
  MODULES_MANAGE: "modules.manage",
  LESSONS_MANAGE: "lessons.manage",
  VIDEOS_MANAGE: "videos.manage",
  ACTIVITIES_MANAGE: "activities.manage",
  QUIZZES_MANAGE: "quizzes.manage",
  STUDENTS_VIEW: "students.view",
  STUDENTS_MANAGE: "students.manage",
  CERTIFICATES_MANAGE: "certificates.manage",
  ANALYTICS_VIEW: "analytics.view",
  SETTINGS_MANAGE: "settings.manage",
  USERS_MANAGE: "users.manage",
  LOGS_VIEW: "logs.view",
  MEDIA_MANAGE: "media.manage",
  BANNERS_MANAGE: "banners.manage",
  CATEGORIES_MANAGE: "categories.manage",
  INSTRUCTORS_MANAGE: "instructors.manage",
  NOTIFICATIONS_SEND: "notifications.send",
  ANALYTICS_EXPORT: "analytics.export",
} as const;