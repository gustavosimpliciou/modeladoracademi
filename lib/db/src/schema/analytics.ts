import { pgTable, text, timestamp, integer, jsonb, real, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./rbac";
import { academyCoursesTable, academyModulesTable, academyLessonsTable } from "./academy";

export const courseAnalyticsTable = pgTable("course_analytics", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => academyCoursesTable.id, { onDelete: "cascade" }),
  date: timestamp("date", { withTimezone: true }).notNull(),
  enrolledCount: integer("enrolled_count").notNull().default(0),
  activeCount: integer("active_count").notNull().default(0),
  completedCount: integer("completed_count").notNull().default(0),
  droppedCount: integer("dropped_count").notNull().default(0),
  avgProgress: real("avg_progress").notNull().default(0),
  avgTimeSpent: integer("avg_time_spent").notNull().default(0),
  totalTimeSpent: integer("total_time_spent").notNull().default(0),
  completionRate: real("completion_rate").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  courseDateIdx: uniqueIndex("course_analytics_course_date_idx").on(table.courseId, table.date),
  courseIdx: index("course_analytics_course_idx").on(table.courseId),
  dateIdx: index("course_analytics_date_idx").on(table.date),
}));

export const lessonAnalyticsTable = pgTable("lesson_analytics", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id").notNull().references(() => academyLessonsTable.id, { onDelete: "cascade" }),
  date: timestamp("date", { withTimezone: true }).notNull(),
  views: integer("views").notNull().default(0),
  uniqueViewers: integer("unique_viewers").notNull().default(0),
  completions: integer("completions").notNull().default(0),
  avgWatchTime: integer("avg_watch_time").notNull().default(0),
  avgWatchPercent: real("avg_watch_percent").notNull().default(0),
  dropOffPoints: jsonb("drop_off_points").$type<Array<{ time: number; viewers: number }>>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  lessonDateIdx: uniqueIndex("lesson_analytics_lesson_date_idx").on(table.lessonId, table.date),
  lessonIdx: index("lesson_analytics_lesson_idx").on(table.lessonId),
  dateIdx: index("lesson_analytics_date_idx").on(table.date),
}));

export const userActivityTable = pgTable("user_activity", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  courseId: text("course_id").references(() => academyCoursesTable.id, { onDelete: "cascade" }),
  moduleId: text("module_id").references(() => academyModulesTable.id, { onDelete: "cascade" }),
  lessonId: text("lesson_id").references(() => academyLessonsTable.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  duration: integer("duration"),
  metadata: jsonb("metadata").$type<Record<string, any>>().notNull().default({}),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index("user_activity_user_idx").on(table.userId),
  courseIdx: index("user_activity_course_idx").on(table.courseId),
  actionIdx: index("user_activity_action_idx").on(table.action),
  dateIdx: index("user_activity_date_idx").on(table.createdAt),
}));

export const quizAnalyticsTable = pgTable("quiz_analytics", {
  id: text("id").primaryKey(),
  quizId: text("quiz_id").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  attempts: integer("attempts").notNull().default(0),
  completions: integer("completions").notNull().default(0),
  avgScore: real("avg_score").notNull().default(0),
  avgPercentage: real("avg_percentage").notNull().default(0),
  passRate: real("pass_rate").notNull().default(0),
  avgTimeSpent: integer("avg_time_spent").notNull().default(0),
  questionStats: jsonb("question_stats").$type<Array<{ questionId: string; correctRate: number; avgTime: number }>>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  quizDateIdx: uniqueIndex("quiz_analytics_quiz_date_idx").on(table.quizId, table.date),
  quizIdx: index("quiz_analytics_quiz_idx").on(table.quizId),
  dateIdx: index("quiz_analytics_date_idx").on(table.date),
}));

export const insertCourseAnalyticsSchema = createInsertSchema(courseAnalyticsTable).omit({ createdAt: true });
export const insertLessonAnalyticsSchema = createInsertSchema(lessonAnalyticsTable).omit({ createdAt: true });
export const insertUserActivitySchema = createInsertSchema(userActivityTable).omit({ createdAt: true });
export const insertQuizAnalyticsSchema = createInsertSchema(quizAnalyticsTable).omit({ createdAt: true });

export type CourseAnalytics = z.infer<typeof insertCourseAnalyticsSchema>;
export type LessonAnalytics = z.infer<typeof insertLessonAnalyticsSchema>;
export type UserActivity = z.infer<typeof insertUserActivitySchema>;
export type QuizAnalytics = z.infer<typeof insertQuizAnalyticsSchema>;

export const ANALYTICS_ACTIONS = {
  PAGE_VIEW: "page_view",
  LESSON_START: "lesson_start",
  LESSON_COMPLETE: "lesson_complete",
  LESSON_PROGRESS: "lesson_progress",
  VIDEO_PLAY: "video_play",
  VIDEO_PAUSE: "video_pause",
  VIDEO_SEEK: "video_seek",
  QUIZ_START: "quiz_start",
  QUIZ_COMPLETE: "quiz_complete",
  QUIZ_ANSWER: "quiz_answer",
  ASSIGNMENT_SUBMIT: "assignment_submit",
  ASSIGNMENT_GRADE: "assignment_grade",
  CERTIFICATE_EARN: "certificate_earn",
  COURSE_ENROLL: "course_enroll",
  COURSE_COMPLETE: "course_complete",
  SEARCH: "search",
  DOWNLOAD: "download",
} as const;