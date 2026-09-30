import { pgTable, text, timestamp, integer, jsonb, boolean, real, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./rbac";

export const academyCoursesTable = pgTable("academy_courses", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description"),
  description: text("description").notNull(),
  category: text("category").notNull(),
  level: text("level").notNull(),
  duration: text("duration").notNull(),
  modules: integer("modules").notNull().default(0),
  lessons: integer("lessons").notNull().default(0),
  progress: integer("progress").notNull().default(0),
  thumbnail: text("thumbnail"),
  coverImage: text("cover_image"),
  bannerImage: text("banner_image"),
  accentColor: text("accent_color").default("#ff6a00"),
  status: text("status").notNull().default("draft"),
  currentModule: text("current_module"),
  currentLesson: text("current_lesson"),
  instructor: text("instructor"),
  instructorId: text("instructor_id"),
  instructorRole: text("instructor_role"),
  objectives: jsonb("objectives").$type<string[]>().notNull().default([]),
  requirements: jsonb("requirements").$type<string[]>().notNull().default([]),
  settings: jsonb("settings").$type<{
    sequentialAccess: boolean;
    allowGoBack: boolean;
    requireVideo: boolean;
    requireActivity: boolean;
    requireQuiz: boolean;
    minQuizScore: number;
    issueCertificate: boolean;
    allowComments: boolean;
    allowDownload: boolean;
  }>().notNull().default({
    sequentialAccess: true,
    allowGoBack: true,
    requireVideo: true,
    requireActivity: false,
    requireQuiz: false,
    minQuizScore: 70,
    issueCertificate: true,
    allowComments: true,
    allowDownload: false,
  }),
  visibility: text("visibility").notNull().default("enrolled_only"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex("courses_slug_idx").on(table.slug),
  statusIdx: index("courses_status_idx").on(table.status),
  categoryIdx: index("courses_category_idx").on(table.category),
  instructorIdx: index("courses_instructor_idx").on(table.instructorId),
}));

export const academyModulesTable = pgTable("academy_modules", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => academyCoursesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  position: integer("position").notNull(),
  lessonCount: integer("lesson_count").notNull().default(0),
  completedLessons: integer("completed_lessons").notNull().default(0),
  progress: integer("progress").notNull().default(0),
  status: text("status").notNull().default("available"),
  settings: jsonb("settings").$type<{
    lockedInitially: boolean;
    requirePreviousModule: boolean;
    allowFreeAccess: boolean;
    requireAllLessons: boolean;
    requireQuiz: boolean;
    requireActivity: boolean;
  }>().notNull().default({
    lockedInitially: false,
    requirePreviousModule: true,
    allowFreeAccess: false,
    requireAllLessons: true,
    requireQuiz: false,
    requireActivity: false,
  }),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  courseIdx: index("modules_course_idx").on(table.courseId),
  positionIdx: index("modules_position_idx").on(table.courseId, table.position),
}));

export const academyLessonsTable = pgTable("academy_lessons", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => academyCoursesTable.id, { onDelete: "cascade" }),
  moduleId: text("module_id").notNull().references(() => academyModulesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail"),
  videoUrl: text("video_url"),
  videoProvider: text("video_provider").default("upload"),
  videoId: text("video_id"),
  duration: text("duration").notNull(),
  videoDuration: integer("video_duration").notNull().default(0),
  position: integer("position").notNull(),
  type: text("type").notNull().default("video"),
  status: text("status").notNull().default("available"),
  completed: integer("completed").notNull().default(0),
  videoPosition: integer("video_position").notNull().default(0),
  highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
  materials: jsonb("materials").$type<Array<{ id: string; name: string; type: string; size: string; url: string | null; order: number }>>().notNull().default([]),
  contentBlocks: jsonb("content_blocks").$type<Array<{ id: string; type: string; content: any; order: number }>>().notNull().default([]),
  nextLessonId: text("next_lesson_id"),
  completionSettings: jsonb("completion_settings").$type<{
    mode: "manual" | "video_percent" | "activity" | "quiz" | "all";
    videoPercent: number;
  }>().notNull().default({ mode: "video_percent", videoPercent: 90 }),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  courseIdx: index("lessons_course_idx").on(table.courseId),
  moduleIdx: index("lessons_module_idx").on(table.moduleId),
  positionIdx: index("lessons_position_idx").on(table.moduleId, table.position),
}));

export const academyActivityEventsTable = pgTable("academy_activity_events", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => usersTable.id),
  title: text("title").notNull(),
  course: text("course").notNull(),
  time: text("time").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index("activity_events_user_idx").on(table.userId),
}));

export const academyActivitiesTable = pgTable("academy_activities", {
  id: text("id").primaryKey(),
  courseId: text("course_id").references(() => academyCoursesTable.id, { onDelete: "cascade" }),
  moduleId: text("module_id").references(() => academyModulesTable.id, { onDelete: "cascade" }),
  lessonId: text("lesson_id").references(() => academyLessonsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  status: text("status").notNull().default("active"),
  maxScore: integer("max_score").default(100),
  type: text("type").notNull(),
  submissionType: text("submission_type").notNull().default("upload"),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  courseIdx: index("activities_course_idx").on(table.courseId),
  moduleIdx: index("activities_module_idx").on(table.moduleId),
}));

export const activitySubmissionsTable = pgTable("activity_submissions", {
  id: text("id").primaryKey(),
  activityId: text("activity_id").notNull().references(() => academyActivitiesTable.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  content: text("content"),
  files: jsonb("files").$type<Array<{ id: string; name: string; url: string; type: string; size: number }>>().notNull().default([]),
  status: text("status").notNull().default("submitted"),
  score: integer("score"),
  feedback: text("feedback"),
  gradedBy: text("graded_by").references(() => usersTable.id),
  gradedAt: timestamp("graded_at", { withTimezone: true }),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  activityUserIdx: uniqueIndex("submissions_activity_user_idx").on(table.activityId, table.userId),
  userIdx: index("submissions_user_idx").on(table.userId),
  statusIdx: index("submissions_status_idx").on(table.status),
}));

export const insertAcademyCourseSchema = createInsertSchema(academyCoursesTable).omit({ createdAt: true, updatedAt: true, publishedAt: true });
export const insertAcademyModuleSchema = createInsertSchema(academyModulesTable).omit({ createdAt: true, updatedAt: true });
export const insertAcademyLessonSchema = createInsertSchema(academyLessonsTable).omit({ createdAt: true, updatedAt: true });
export const insertAcademyActivityEventSchema = createInsertSchema(academyActivityEventsTable).omit({ createdAt: true });
export const insertAcademyActivitySchema = createInsertSchema(academyActivitiesTable).omit({ createdAt: true, updatedAt: true });
export const insertActivitySubmissionSchema = createInsertSchema(activitySubmissionsTable).omit({ submittedAt: true, updatedAt: true, gradedAt: true });

export type AcademyCourse = z.infer<typeof insertAcademyCourseSchema>;
export type AcademyModule = z.infer<typeof insertAcademyModuleSchema>;
export type AcademyLesson = z.infer<typeof insertAcademyLessonSchema>;
export type AcademyActivityEvent = z.infer<typeof insertAcademyActivityEventSchema>;
export type AcademyActivity = z.infer<typeof insertAcademyActivitySchema>;
export type ActivitySubmission = z.infer<typeof insertActivitySubmissionSchema>;