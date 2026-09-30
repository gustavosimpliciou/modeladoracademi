import { createInsertSchema } from "drizzle-zod";
import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const academyCoursesTable = pgTable("academy_courses", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  level: text("level").notNull(),
  duration: text("duration").notNull(),
  modules: integer("modules").notNull(),
  lessons: integer("lessons").notNull(),
  progress: integer("progress").notNull().default(0),
  thumbnail: text("thumbnail").notNull(),
  status: text("status").notNull().default("in_progress"),
  currentModule: text("current_module"),
  currentLesson: text("current_lesson"),
  instructor: text("instructor").notNull(),
  instructorRole: text("instructor_role").notNull(),
  objectives: text("objectives").array().notNull(),
  requirements: text("requirements").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const academyModulesTable = pgTable("academy_modules", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  position: integer("position").notNull(),
  lessonCount: integer("lesson_count").notNull(),
  completedLessons: integer("completed_lessons").notNull().default(0),
  progress: integer("progress").notNull().default(0),
  status: text("status").notNull().default("available"),
});

export const academyLessonsTable = pgTable("academy_lessons", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  moduleId: text("module_id").notNull(),
  title: text("title").notNull(),
  duration: text("duration").notNull(),
  position: integer("position").notNull(),
  type: text("type").notNull().default("video"),
  status: text("status").notNull().default("available"),
  completed: integer("completed").notNull().default(0),
  videoPosition: integer("video_position").notNull().default(0),
  videoDuration: integer("video_duration").notNull().default(1116),
  description: text("description").notNull(),
  highlights: text("highlights").array().notNull(),
  materials: jsonb("materials").$type<Array<{ id: string; name: string; type: string; size: string; url: string | null }>>().notNull(),
  nextLessonId: text("next_lesson_id"),
});

export const academyActivityEventsTable = pgTable("academy_activity_events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  course: text("course").notNull(),
  time: text("time").notNull(),
  type: text("type").notNull(),
});

export const academyActivitiesTable = pgTable("academy_activities", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  course: text("course").notNull(),
  module: text("module").notNull(),
  status: text("status").notNull(),
  dueDate: text("due_date").notNull(),
  type: text("type").notNull(),
});

export const insertAcademyCourseSchema = createInsertSchema(academyCoursesTable).omit({ createdAt: true });
export const insertAcademyModuleSchema = createInsertSchema(academyModulesTable);
export const insertAcademyLessonSchema = createInsertSchema(academyLessonsTable);
export const insertAcademyActivityEventSchema = createInsertSchema(academyActivityEventsTable);
export const insertAcademyActivitySchema = createInsertSchema(academyActivitiesTable);

export type AcademyCourse = z.infer<typeof insertAcademyCourseSchema>;
export type AcademyModule = z.infer<typeof insertAcademyModuleSchema>;
export type AcademyLesson = z.infer<typeof insertAcademyLessonSchema>;