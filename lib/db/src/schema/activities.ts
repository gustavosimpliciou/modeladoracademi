import { pgTable, text, timestamp, integer, jsonb, boolean, real, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./rbac";
import { academyCoursesTable, academyModulesTable, academyLessonsTable } from "./academy";

export const assignmentsTable = pgTable("assignments", {
  id: text("id").primaryKey(),
  courseId: text("course_id").references(() => academyCoursesTable.id, { onDelete: "cascade" }),
  moduleId: text("module_id").references(() => academyModulesTable.id, { onDelete: "cascade" }),
  lessonId: text("lesson_id").references(() => academyLessonsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  maxScore: integer("max_score").default(100),
  type: text("type").notNull(),
  submissionType: text("submission_type").notNull().default("upload"),
  allowedFileTypes: jsonb("allowed_file_types").$type<string[]>().notNull().default([]),
  maxFileSize: integer("max_file_size").default(52428800),
  isRequired: boolean("is_required").notNull().default(false),
  allowResubmission: boolean("allow_resubmission").notNull().default(true),
  maxSubmissions: integer("max_submissions").default(3),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  courseIdx: index("assignments_course_idx").on(table.courseId),
  moduleIdx: index("assignments_module_idx").on(table.moduleId),
  lessonIdx: index("assignments_lesson_idx").on(table.lessonId),
}));

export const assignmentSubmissionsTable = pgTable("assignment_submissions", {
  id: text("id").primaryKey(),
  assignmentId: text("assignment_id").notNull().references(() => assignmentsTable.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  content: text("content"),
  files: jsonb("files").$type<Array<{ id: string; name: string; url: string; type: string; size: number }>>().notNull().default([]),
  status: text("status").notNull().default("submitted"),
  score: integer("score"),
  feedback: text("feedback"),
  gradedBy: text("graded_by").references(() => usersTable.id),
  gradedAt: timestamp("graded_at", { withTimezone: true }),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  attemptNumber: integer("attempt_number").notNull().default(1),
}, (table) => ({
  assignmentUserIdx: index("assignment_submissions_assignment_user_idx").on(table.assignmentId, table.userId),
  userIdx: index("assignment_submissions_user_idx").on(table.userId),
  statusIdx: index("assignment_submissions_status_idx").on(table.status),
}));

export const insertAssignmentSchema = createInsertSchema(assignmentsTable).omit({ createdAt: true, updatedAt: true });
export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissionsTable).omit({ submittedAt: true, gradedAt: true });

export type Assignment = z.infer<typeof insertAssignmentSchema>;
export type AssignmentSubmission = z.infer<typeof insertAssignmentSubmissionSchema>;

export const ASSIGNMENT_TYPES = {
  EXERCISE: "exercise",
  PROJECT: "project",
  UPLOAD: "upload",
  TEXT: "text",
  PRACTICE: "practice",
  CHALLENGE: "challenge",
} as const;

export const SUBMISSION_TYPES = {
  UPLOAD: "upload",
  TEXT: "text",
  LINK: "link",
  CODE: "code",
} as const;