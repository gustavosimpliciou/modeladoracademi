import { pgTable, text, timestamp, integer, jsonb, boolean, real, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./rbac";
import { academyCoursesTable, academyModulesTable, academyLessonsTable } from "./academy";

export const quizzesTable = pgTable("quizzes", {
  id: text("id").primaryKey(),
  courseId: text("course_id").references(() => academyCoursesTable.id, { onDelete: "cascade" }),
  moduleId: text("module_id").references(() => academyModulesTable.id, { onDelete: "cascade" }),
  lessonId: text("lesson_id").references(() => academyLessonsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  timeLimit: integer("time_limit"),
  minScore: integer("min_score").notNull().default(70),
  maxAttempts: integer("max_attempts").notNull().default(3),
  shuffleQuestions: boolean("shuffle_questions").notNull().default(false),
  shuffleAnswers: boolean("shuffle_answers").notNull().default(false),
  showResultsImmediately: boolean("show_results_immediately").notNull().default(true),
  showCorrectAnswers: boolean("show_correct_answers").notNull().default(false),
  isRequired: boolean("is_required").notNull().default(false),
  status: text("status").notNull().default("draft"),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  courseIdx: index("quizzes_course_idx").on(table.courseId),
  moduleIdx: index("quizzes_module_idx").on(table.moduleId),
  lessonIdx: index("quizzes_lesson_idx").on(table.lessonId),
}));

export const questionsTable = pgTable("questions", {
  id: text("id").primaryKey(),
  quizId: text("quiz_id").notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
  questionBankId: text("question_bank_id"),
  text: text("text").notNull(),
  type: text("type").notNull().default("multiple_choice"),
  difficulty: text("difficulty").notNull().default("medium"),
  points: integer("points").notNull().default(1),
  explanation: text("explanation"),
  order: integer("order").notNull().default(0),
  options: jsonb("options").$type<Array<{ id: string; text: string; isCorrect: boolean }>>().notNull().default([]),
  correctAnswer: text("correct_answer"),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  quizIdx: index("questions_quiz_idx").on(table.quizId),
  bankIdx: index("questions_bank_idx").on(table.questionBankId),
}));

export const questionBankTable = pgTable("question_bank", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  category: text("category"),
  difficulty: text("difficulty").notNull().default("medium"),
  type: text("type").notNull().default("multiple_choice"),
  options: jsonb("options").$type<Array<{ id: string; text: string; isCorrect: boolean }>>().notNull().default([]),
  correctAnswer: text("correct_answer"),
  explanation: text("explanation"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index("question_bank_category_idx").on(table.category),
  difficultyIdx: index("question_bank_difficulty_idx").on(table.difficulty),
}));

export const quizAttemptsTable = pgTable("quiz_attempts", {
  id: text("id").primaryKey(),
  quizId: text("quiz_id").notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  answers: jsonb("answers").$type<Array<{ questionId: string; answer: string | string[]; isCorrect: boolean; points: number }>>().notNull().default([]),
  score: integer("score").notNull().default(0),
  maxScore: integer("max_score").notNull().default(0),
  percentage: real("percentage").notNull().default(0),
  status: text("status").notNull().default("in_progress"),
  timeSpent: integer("time_spent").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  gradedAt: timestamp("graded_at", { withTimezone: true }),
}, (table) => ({
  quizUserIdx: index("quiz_attempts_quiz_user_idx").on(table.quizId, table.userId),
  userIdx: index("quiz_attempts_user_idx").on(table.userId),
  statusIdx: index("quiz_attempts_status_idx").on(table.status),
}));

export const insertQuizSchema = createInsertSchema(quizzesTable).omit({ createdAt: true, updatedAt: true });
export const insertQuestionSchema = createInsertSchema(questionsTable).omit({ createdAt: true, updatedAt: true });
export const insertQuestionBankSchema = createInsertSchema(questionBankTable).omit({ createdAt: true, updatedAt: true });
export const insertQuizAttemptSchema = createInsertSchema(quizAttemptsTable).omit({ startedAt: true, completedAt: true, gradedAt: true });

export type Quiz = z.infer<typeof insertQuizSchema>;
export type Question = z.infer<typeof insertQuestionSchema>;
export type QuestionBank = z.infer<typeof insertQuestionBankSchema>;
export type QuizAttempt = z.infer<typeof insertQuizAttemptSchema>;