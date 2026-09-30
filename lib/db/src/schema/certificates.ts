import { pgTable, text, timestamp, integer, jsonb, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./rbac";
import { academyCoursesTable } from "./academy";

export const certificatesTable = pgTable("certificates", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => academyCoursesTable.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  certificateNumber: text("certificate_number").notNull().unique(),
  templateId: text("template_id").references(() => certificateTemplatesTable.id),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  revokedBy: text("revoked_by").references(() => usersTable.id),
  revocationReason: text("revocation_reason"),
  pdfUrl: text("pdf_url"),
  verificationUrl: text("verification_url"),
}, (table) => ({
  courseUserIdx: uniqueIndex("certificates_course_user_idx").on(table.courseId, table.userId),
  numberIdx: uniqueIndex("certificates_number_idx").on(table.certificateNumber),
  userIdx: index("certificates_user_idx").on(table.userId),
}));

export const certificateTemplatesTable = pgTable("certificate_templates", {
  id: text("id").primaryKey(),
  courseId: text("course_id").references(() => academyCoursesTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  logoUrl: text("logo_url"),
  institutionName: text("institution_name").notNull().default("Nativos3D Academy"),
  backgroundImage: text("background_image"),
  signatureUrl: text("signature_url"),
  signatureName: text("signature_name"),
  signatureRole: text("signature_role"),
  textContent: text("text_content"),
  qrCodePosition: jsonb("qr_code_position").$type<{ x: number; y: number; size: number }>().notNull().default({ x: 80, y: 80, size: 15 }),
  logoPosition: jsonb("logo_position").$type<{ x: number; y: number; size: number }>().notNull().default({ x: 50, y: 15, size: 20 }),
  textPosition: jsonb("text_position").$type<{ x: number; y: number }>().notNull().default({ x: 50, y: 50 }),
  colors: jsonb("colors").$type<{ primary: string; secondary: string; text: string }>().notNull().default({ primary: "#ff6a00", secondary: "#111111", text: "#ffffff" }),
  fonts: jsonb("fonts").$type<{ heading: string; body: string }>().notNull().default({ heading: "Barlow Condensed", body: "DM Sans" }),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  courseIdx: index("cert_templates_course_idx").on(table.courseId),
}));

export const insertCertificateSchema = createInsertSchema(certificatesTable).omit({ issuedAt: true });
export const insertCertificateTemplateSchema = createInsertSchema(certificateTemplatesTable).omit({ createdAt: true, updatedAt: true });

export type Certificate = z.infer<typeof insertCertificateSchema>;
export type CertificateTemplate = z.infer<typeof insertCertificateTemplateSchema>;