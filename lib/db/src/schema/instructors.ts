import { pgTable, text, timestamp, integer, jsonb, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./rbac";

export const instructorsTable = pgTable("instructors", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => usersTable.id, { onDelete: "set null" }).unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  email: text("email"),
  photo: text("photo"),
  bio: text("bio"),
  shortBio: text("short_bio"),
  specialties: jsonb("specialties").$type<string[]>().notNull().default([]),
  socialLinks: jsonb("social_links").$type<{ linkedin?: string; twitter?: string; github?: string; website?: string; youtube?: string }>().notNull().default({}),
  isActive: boolean("is_active").notNull().default(true),
  courseCount: integer("course_count").notNull().default(0),
  studentCount: integer("student_count").notNull().default(0),
  rating: integer("rating").default(0),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex("instructors_slug_idx").on(table.slug),
  userIdx: uniqueIndex("instructors_user_idx").on(table.userId),
  activeIdx: index("instructors_active_idx").on(table.isActive),
}));

export const instructorCoursesTable = pgTable("instructor_courses", {
  id: text("id").primaryKey(),
  instructorId: text("instructor_id").notNull().references(() => instructorsTable.id, { onDelete: "cascade" }),
  courseId: text("course_id").notNull(),
  role: text("role").notNull().default("instructor"),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
  assignedBy: text("assigned_by").references(() => usersTable.id),
}, (table) => ({
  instructorCourseIdx: uniqueIndex("instructor_courses_instructor_course_idx").on(table.instructorId, table.courseId),
}));

export const insertInstructorSchema = createInsertSchema(instructorsTable).omit({ createdAt: true, updatedAt: true, courseCount: true, studentCount: true, rating: true });
export const insertInstructorCourseSchema = createInsertSchema(instructorCoursesTable).omit({ assignedAt: true });

export type Instructor = z.infer<typeof insertInstructorSchema>;
export type InstructorCourse = z.infer<typeof insertInstructorCourseSchema>;