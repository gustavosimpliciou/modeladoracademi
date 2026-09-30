import { pgTable, text, timestamp, integer, jsonb, boolean, real, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./rbac";
import { academyCoursesTable, academyModulesTable, academyLessonsTable } from "./academy";

export const enrollmentsTable = pgTable("enrollments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  courseId: text("course_id").notNull().references(() => academyCoursesTable.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("active"),
  accessType: text("access_type").notNull().default("enrolled"),
  enrolledAt: timestamp("enrolled_at", { withTimezone: true }).notNull().defaultNow(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  progress: integer("progress").notNull().default(0),
  currentModuleId: text("current_module_id"),
  currentLessonId: text("current_lesson_id"),
  lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true }),
  totalTimeSpent: integer("total_time_spent").notNull().default(0),
  certificateId: text("certificate_id"),
  enrolledBy: text("enrolled_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userCourseIdx: uniqueIndex("enrollments_user_course_idx").on(table.userId, table.courseId),
  userIdx: index("enrollments_user_idx").on(table.userId),
  courseIdx: index("enrollments_course_idx").on(table.courseId),
  statusIdx: index("enrollments_status_idx").on(table.status),
}));

export const moduleProgressTable = pgTable("module_progress", {
  id: text("id").primaryKey(),
  enrollmentId: text("enrollment_id").notNull().references(() => enrollmentsTable.id, { onDelete: "cascade" }),
  moduleId: text("module_id").notNull().references(() => academyModulesTable.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("locked"),
  progress: integer("progress").notNull().default(0),
  completedLessons: integer("completed_lessons").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  enrollmentModuleIdx: uniqueIndex("module_progress_enrollment_module_idx").on(table.enrollmentId, table.moduleId),
  enrollmentIdx: index("module_progress_enrollment_idx").on(table.enrollmentId),
}));

export const lessonProgressTable = pgTable("lesson_progress", {
  id: text("id").primaryKey(),
  enrollmentId: text("enrollment_id").notNull().references(() => enrollmentsTable.id, { onDelete: "cascade" }),
  lessonId: text("lesson_id").notNull().references(() => academyLessonsTable.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("locked"),
  isCompleted: boolean("is_completed").notNull().default(false),
  videoPosition: integer("video_position").notNull().default(0),
  watchTime: integer("watch_time").notNull().default(0),
  watchPercent: real("watch_percent").notNull().default(0),
  lastWatchedAt: timestamp("last_watched_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  enrollmentLessonIdx: uniqueIndex("lesson_progress_enrollment_lesson_idx").on(table.enrollmentId, table.lessonId),
  enrollmentIdx: index("lesson_progress_enrollment_idx").on(table.enrollmentId),
}));

export const insertEnrollmentSchema = createInsertSchema(enrollmentsTable).omit({ createdAt: true, updatedAt: true, enrolledAt: true });
export const insertModuleProgressSchema = createInsertSchema(moduleProgressTable).omit({ createdAt: true, updatedAt: true });
export const insertLessonProgressSchema = createInsertSchema(lessonProgressTable).omit({ createdAt: true, updatedAt: true });

export type Enrollment = z.infer<typeof insertEnrollmentSchema>;
export type ModuleProgress = z.infer<typeof insertModuleProgressSchema>;
export type LessonProgress = z.infer<typeof insertLessonProgressSchema>;

export const ENROLLMENT_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  PENDING: "pending",
} as const;

export const ACCESS_TYPES = {
  ENROLLED: "enrolled",
  AUDIT: "audit",
  MANUAL: "manual",
  TRIAL: "trial",
} as const;