CREATE TABLE "permissions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" text PRIMARY KEY NOT NULL,
	"role_id" text NOT NULL,
	"permission_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role_id" text NOT NULL,
	"assigned_by" text,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"first_name" text,
	"last_name" text,
	"image_url" text,
	"role_id" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "academy_activities" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text,
	"module_id" text,
	"lesson_id" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"instructions" text,
	"due_date" timestamp with time zone,
	"status" text DEFAULT 'active' NOT NULL,
	"max_score" integer DEFAULT 100,
	"type" text NOT NULL,
	"submission_type" text DEFAULT 'upload' NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_activity_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"title" text NOT NULL,
	"course" text NOT NULL,
	"time" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_courses" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"short_description" text,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"level" text NOT NULL,
	"duration" text NOT NULL,
	"modules" integer DEFAULT 0 NOT NULL,
	"lessons" integer DEFAULT 0 NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"thumbnail" text,
	"cover_image" text,
	"banner_image" text,
	"accent_color" text DEFAULT '#ff6a00',
	"status" text DEFAULT 'draft' NOT NULL,
	"current_module" text,
	"current_lesson" text,
	"instructor" text,
	"instructor_id" text,
	"instructor_role" text,
	"objectives" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"requirements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"settings" jsonb DEFAULT '{"sequentialAccess":true,"allowGoBack":true,"requireVideo":true,"requireActivity":false,"requireQuiz":false,"minQuizScore":70,"issueCertificate":true,"allowComments":true,"allowDownload":false}'::jsonb NOT NULL,
	"visibility" text DEFAULT 'enrolled_only' NOT NULL,
	"published_at" timestamp with time zone,
	"scheduled_at" timestamp with time zone,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "academy_courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "academy_lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"module_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"thumbnail" text,
	"video_url" text,
	"video_provider" text DEFAULT 'upload',
	"video_id" text,
	"duration" text NOT NULL,
	"video_duration" integer DEFAULT 0 NOT NULL,
	"position" integer NOT NULL,
	"type" text DEFAULT 'video' NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"completed" integer DEFAULT 0 NOT NULL,
	"video_position" integer DEFAULT 0 NOT NULL,
	"highlights" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"materials" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"content_blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"next_lesson_id" text,
	"completion_settings" jsonb DEFAULT '{"mode":"video_percent","videoPercent":90}'::jsonb NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_modules" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image" text,
	"position" integer NOT NULL,
	"lesson_count" integer DEFAULT 0 NOT NULL,
	"completed_lessons" integer DEFAULT 0 NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"settings" jsonb DEFAULT '{"lockedInitially":false,"requirePreviousModule":true,"allowFreeAccess":false,"requireAllLessons":true,"requireQuiz":false,"requireActivity":false}'::jsonb NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"activity_id" text NOT NULL,
	"user_id" text NOT NULL,
	"content" text,
	"files" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"score" integer,
	"feedback" text,
	"graded_by" text,
	"graded_at" timestamp with time zone,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_folders" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"parent_id" text,
	"path" text NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"type" text NOT NULL,
	"category" text NOT NULL,
	"width" integer,
	"height" integer,
	"duration" integer,
	"uploaded_by" text,
	"folder" text DEFAULT 'general',
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_bank" (
	"id" text PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"category" text,
	"difficulty" text DEFAULT 'medium' NOT NULL,
	"type" text DEFAULT 'multiple_choice' NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"correct_answer" text,
	"explanation" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" text PRIMARY KEY NOT NULL,
	"quiz_id" text NOT NULL,
	"question_bank_id" text,
	"text" text NOT NULL,
	"type" text DEFAULT 'multiple_choice' NOT NULL,
	"difficulty" text DEFAULT 'medium' NOT NULL,
	"points" integer DEFAULT 1 NOT NULL,
	"explanation" text,
	"order" integer DEFAULT 0 NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"correct_answer" text,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"quiz_id" text NOT NULL,
	"user_id" text NOT NULL,
	"answers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"max_score" integer DEFAULT 0 NOT NULL,
	"percentage" real DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"time_spent" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"graded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text,
	"module_id" text,
	"lesson_id" text,
	"title" text NOT NULL,
	"description" text,
	"time_limit" integer,
	"min_score" integer DEFAULT 70 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"shuffle_questions" boolean DEFAULT false NOT NULL,
	"shuffle_answers" boolean DEFAULT false NOT NULL,
	"show_results_immediately" boolean DEFAULT true NOT NULL,
	"show_correct_answers" boolean DEFAULT false NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificate_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text,
	"name" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"logo_url" text,
	"institution_name" text DEFAULT 'Nativos3D Academy' NOT NULL,
	"background_image" text,
	"signature_url" text,
	"signature_name" text,
	"signature_role" text,
	"text_content" text,
	"qr_code_position" jsonb DEFAULT '{"x":80,"y":80,"size":15}'::jsonb NOT NULL,
	"logo_position" jsonb DEFAULT '{"x":50,"y":15,"size":20}'::jsonb NOT NULL,
	"text_position" jsonb DEFAULT '{"x":50,"y":50}'::jsonb NOT NULL,
	"colors" jsonb DEFAULT '{"primary":"#ff6a00","secondary":"#111111","text":"#ffffff"}'::jsonb NOT NULL,
	"fonts" jsonb DEFAULT '{"heading":"Barlow Condensed","body":"DM Sans"}'::jsonb NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"user_id" text NOT NULL,
	"certificate_number" text NOT NULL,
	"template_id" text,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoked_by" text,
	"revocation_reason" text,
	"pdf_url" text,
	"verification_url" text,
	CONSTRAINT "certificates_certificate_number_unique" UNIQUE("certificate_number")
);
--> statement-breakpoint
CREATE TABLE "assignment_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"assignment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"content" text,
	"files" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"score" integer,
	"feedback" text,
	"graded_by" text,
	"graded_at" timestamp with time zone,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"attempt_number" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text,
	"module_id" text,
	"lesson_id" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"instructions" text,
	"due_date" timestamp with time zone,
	"max_score" integer DEFAULT 100,
	"type" text NOT NULL,
	"submission_type" text DEFAULT 'upload' NOT NULL,
	"allowed_file_types" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"max_file_size" integer DEFAULT 52428800,
	"is_required" boolean DEFAULT false NOT NULL,
	"allow_resubmission" boolean DEFAULT true NOT NULL,
	"max_submissions" integer DEFAULT 3,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "banners" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"mobile_image_url" text,
	"link_url" text,
	"button_text" text,
	"button_url" text,
	"position" text DEFAULT 'hero' NOT NULL,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"status" text DEFAULT 'active' NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"target_audience" text DEFAULT 'all',
	"courses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"image" text,
	"icon" text,
	"color" text DEFAULT '#ff6a00',
	"parent_id" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"course_count" integer DEFAULT 0 NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "instructor_courses" (
	"id" text PRIMARY KEY NOT NULL,
	"instructor_id" text NOT NULL,
	"course_id" text NOT NULL,
	"role" text DEFAULT 'instructor' NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assigned_by" text
);
--> statement-breakpoint
CREATE TABLE "instructors" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"email" text,
	"photo" text,
	"bio" text,
	"short_bio" text,
	"specialties" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"social_links" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"course_count" integer DEFAULT 0 NOT NULL,
	"student_count" integer DEFAULT 0 NOT NULL,
	"rating" integer DEFAULT 0,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "instructors_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "instructors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text DEFAULT 'info' NOT NULL,
	"target_audience" text DEFAULT 'all' NOT NULL,
	"target_courses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"target_modules" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"target_users" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"send_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_by" text,
	"sent_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"type" text NOT NULL,
	"variables" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notification_templates_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text DEFAULT 'info' NOT NULL,
	"reference_type" text,
	"reference_id" text,
	"action_url" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_analytics" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"enrolled_count" integer DEFAULT 0 NOT NULL,
	"active_count" integer DEFAULT 0 NOT NULL,
	"completed_count" integer DEFAULT 0 NOT NULL,
	"dropped_count" integer DEFAULT 0 NOT NULL,
	"avg_progress" real DEFAULT 0 NOT NULL,
	"avg_time_spent" integer DEFAULT 0 NOT NULL,
	"total_time_spent" integer DEFAULT 0 NOT NULL,
	"completion_rate" real DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_analytics" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"unique_viewers" integer DEFAULT 0 NOT NULL,
	"completions" integer DEFAULT 0 NOT NULL,
	"avg_watch_time" integer DEFAULT 0 NOT NULL,
	"avg_watch_percent" real DEFAULT 0 NOT NULL,
	"drop_off_points" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_analytics" (
	"id" text PRIMARY KEY NOT NULL,
	"quiz_id" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"completions" integer DEFAULT 0 NOT NULL,
	"avg_score" real DEFAULT 0 NOT NULL,
	"avg_percentage" real DEFAULT 0 NOT NULL,
	"pass_rate" real DEFAULT 0 NOT NULL,
	"avg_time_spent" integer DEFAULT 0 NOT NULL,
	"question_stats" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_activity" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"course_id" text,
	"module_id" text,
	"lesson_id" text,
	"action" text NOT NULL,
	"duration" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" text,
	"user_agent" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"source" text,
	"stack_trace" text,
	"context" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"user_id" text,
	"request_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"platform_name" text DEFAULT 'Nativos3D Academy' NOT NULL,
	"logo_url" text,
	"favicon_url" text,
	"login_image_url" text,
	"hero_image_url" text,
	"primary_color" text DEFAULT '#ff6a00' NOT NULL,
	"secondary_color" text DEFAULT '#111111' NOT NULL,
	"accent_color" text DEFAULT '#ff8126' NOT NULL,
	"support_email" text,
	"website_url" text,
	"instagram_url" text,
	"youtube_url" text,
	"tiktok_url" text,
	"linkedin_url" text,
	"twitter_url" text,
	"github_url" text,
	"custom_css" text,
	"custom_js" text,
	"seo_title" text,
	"seo_description" text,
	"seo_keywords" text,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "home_page_sections" (
	"id" text PRIMARY KEY NOT NULL,
	"section_key" text NOT NULL,
	"title" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"content" jsonb NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "home_page_sections_section_key_unique" UNIQUE("section_key")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	"type" text NOT NULL,
	"category" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"validation" jsonb,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"course_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"access_type" text DEFAULT 'enrolled' NOT NULL,
	"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"progress" integer DEFAULT 0 NOT NULL,
	"current_module_id" text,
	"current_lesson_id" text,
	"last_accessed_at" timestamp with time zone,
	"total_time_spent" integer DEFAULT 0 NOT NULL,
	"certificate_id" text,
	"enrolled_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"enrollment_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"status" text DEFAULT 'locked' NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"video_position" integer DEFAULT 0 NOT NULL,
	"watch_time" integer DEFAULT 0 NOT NULL,
	"watch_percent" real DEFAULT 0 NOT NULL,
	"last_watched_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "module_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"enrollment_id" text NOT NULL,
	"module_id" text NOT NULL,
	"status" text DEFAULT 'locked' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"completed_lessons" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_activities" ADD CONSTRAINT "academy_activities_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_activities" ADD CONSTRAINT "academy_activities_module_id_academy_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."academy_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_activities" ADD CONSTRAINT "academy_activities_lesson_id_academy_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."academy_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_activities" ADD CONSTRAINT "academy_activities_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_activities" ADD CONSTRAINT "academy_activities_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_activity_events" ADD CONSTRAINT "academy_activity_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_courses" ADD CONSTRAINT "academy_courses_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_courses" ADD CONSTRAINT "academy_courses_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_lessons" ADD CONSTRAINT "academy_lessons_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_lessons" ADD CONSTRAINT "academy_lessons_module_id_academy_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."academy_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_lessons" ADD CONSTRAINT "academy_lessons_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_lessons" ADD CONSTRAINT "academy_lessons_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_modules" ADD CONSTRAINT "academy_modules_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_modules" ADD CONSTRAINT "academy_modules_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_modules" ADD CONSTRAINT "academy_modules_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_submissions" ADD CONSTRAINT "activity_submissions_activity_id_academy_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."academy_activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_submissions" ADD CONSTRAINT "activity_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_submissions" ADD CONSTRAINT "activity_submissions_graded_by_users_id_fk" FOREIGN KEY ("graded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_folders" ADD CONSTRAINT "media_folders_parent_id_media_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_folders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_folders" ADD CONSTRAINT "media_folders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_bank" ADD CONSTRAINT "question_bank_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_bank" ADD CONSTRAINT "question_bank_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_module_id_academy_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."academy_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_lesson_id_academy_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."academy_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate_templates" ADD CONSTRAINT "certificate_templates_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate_templates" ADD CONSTRAINT "certificate_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate_templates" ADD CONSTRAINT "certificate_templates_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_template_id_certificate_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."certificate_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_revoked_by_users_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_graded_by_users_id_fk" FOREIGN KEY ("graded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_module_id_academy_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."academy_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_lesson_id_academy_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."academy_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "banners" ADD CONSTRAINT "banners_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "banners" ADD CONSTRAINT "banners_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instructor_courses" ADD CONSTRAINT "instructor_courses_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instructor_courses" ADD CONSTRAINT "instructor_courses_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_sent_by_users_id_fk" FOREIGN KEY ("sent_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_templates" ADD CONSTRAINT "notification_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_templates" ADD CONSTRAINT "notification_templates_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_analytics" ADD CONSTRAINT "course_analytics_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_analytics" ADD CONSTRAINT "lesson_analytics_lesson_id_academy_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."academy_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_module_id_academy_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."academy_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_lesson_id_academy_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."academy_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_logs" ADD CONSTRAINT "admin_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_settings" ADD CONSTRAINT "brand_settings_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_settings" ADD CONSTRAINT "brand_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "home_page_sections" ADD CONSTRAINT "home_page_sections_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "home_page_sections" ADD CONSTRAINT "home_page_sections_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_academy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."academy_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_enrolled_by_users_id_fk" FOREIGN KEY ("enrolled_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_academy_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."academy_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_progress" ADD CONSTRAINT "module_progress_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_progress" ADD CONSTRAINT "module_progress_module_id_academy_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."academy_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "role_permissions_role_perm_idx" ON "role_permissions" USING btree ("role_id","permission_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_user_role_idx" ON "user_roles" USING btree ("user_id","role_id");--> statement-breakpoint
CREATE INDEX "user_roles_user_idx" ON "user_roles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_clerk_id_idx" ON "users" USING btree ("clerk_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "activities_course_idx" ON "academy_activities" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "activities_module_idx" ON "academy_activities" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "activity_events_user_idx" ON "academy_activity_events" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "courses_slug_idx" ON "academy_courses" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "courses_status_idx" ON "academy_courses" USING btree ("status");--> statement-breakpoint
CREATE INDEX "courses_category_idx" ON "academy_courses" USING btree ("category");--> statement-breakpoint
CREATE INDEX "courses_instructor_idx" ON "academy_courses" USING btree ("instructor_id");--> statement-breakpoint
CREATE INDEX "lessons_course_idx" ON "academy_lessons" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "lessons_module_idx" ON "academy_lessons" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "lessons_position_idx" ON "academy_lessons" USING btree ("module_id","position");--> statement-breakpoint
CREATE INDEX "modules_course_idx" ON "academy_modules" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "modules_position_idx" ON "academy_modules" USING btree ("course_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "submissions_activity_user_idx" ON "activity_submissions" USING btree ("activity_id","user_id");--> statement-breakpoint
CREATE INDEX "submissions_user_idx" ON "activity_submissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "submissions_status_idx" ON "activity_submissions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "media_folders_path_idx" ON "media_folders" USING btree ("path");--> statement-breakpoint
CREATE INDEX "media_folders_parent_idx" ON "media_folders" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "media_type_idx" ON "media" USING btree ("type");--> statement-breakpoint
CREATE INDEX "media_category_idx" ON "media" USING btree ("category");--> statement-breakpoint
CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder");--> statement-breakpoint
CREATE INDEX "media_uploaded_by_idx" ON "media" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "question_bank_category_idx" ON "question_bank" USING btree ("category");--> statement-breakpoint
CREATE INDEX "question_bank_difficulty_idx" ON "question_bank" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "questions_quiz_idx" ON "questions" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "questions_bank_idx" ON "questions" USING btree ("question_bank_id");--> statement-breakpoint
CREATE INDEX "quiz_attempts_quiz_user_idx" ON "quiz_attempts" USING btree ("quiz_id","user_id");--> statement-breakpoint
CREATE INDEX "quiz_attempts_user_idx" ON "quiz_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quiz_attempts_status_idx" ON "quiz_attempts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "quizzes_course_idx" ON "quizzes" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "quizzes_module_idx" ON "quizzes" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "quizzes_lesson_idx" ON "quizzes" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "cert_templates_course_idx" ON "certificate_templates" USING btree ("course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "certificates_course_user_idx" ON "certificates" USING btree ("course_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "certificates_number_idx" ON "certificates" USING btree ("certificate_number");--> statement-breakpoint
CREATE INDEX "certificates_user_idx" ON "certificates" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "assignment_submissions_assignment_user_idx" ON "assignment_submissions" USING btree ("assignment_id","user_id");--> statement-breakpoint
CREATE INDEX "assignment_submissions_user_idx" ON "assignment_submissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "assignment_submissions_status_idx" ON "assignment_submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "assignments_course_idx" ON "assignments" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "assignments_module_idx" ON "assignments" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "assignments_lesson_idx" ON "assignments" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "banners_status_idx" ON "banners" USING btree ("status");--> statement-breakpoint
CREATE INDEX "banners_position_idx" ON "banners" USING btree ("position");--> statement-breakpoint
CREATE INDEX "banners_date_idx" ON "banners" USING btree ("start_date","end_date");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "categories_order_idx" ON "categories" USING btree ("order");--> statement-breakpoint
CREATE UNIQUE INDEX "instructor_courses_instructor_course_idx" ON "instructor_courses" USING btree ("instructor_id","course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "instructors_slug_idx" ON "instructors" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "instructors_user_idx" ON "instructors" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "instructors_active_idx" ON "instructors" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "announcements_status_idx" ON "announcements" USING btree ("status");--> statement-breakpoint
CREATE INDEX "announcements_send_at_idx" ON "announcements" USING btree ("send_at");--> statement-breakpoint
CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_read_idx" ON "notifications" USING btree ("user_id","is_read");--> statement-breakpoint
CREATE INDEX "notifications_reference_idx" ON "notifications" USING btree ("reference_type","reference_id");--> statement-breakpoint
CREATE UNIQUE INDEX "course_analytics_course_date_idx" ON "course_analytics" USING btree ("course_id","date");--> statement-breakpoint
CREATE INDEX "course_analytics_course_idx" ON "course_analytics" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "course_analytics_date_idx" ON "course_analytics" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_analytics_lesson_date_idx" ON "lesson_analytics" USING btree ("lesson_id","date");--> statement-breakpoint
CREATE INDEX "lesson_analytics_lesson_idx" ON "lesson_analytics" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_analytics_date_idx" ON "lesson_analytics" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "quiz_analytics_quiz_date_idx" ON "quiz_analytics" USING btree ("quiz_id","date");--> statement-breakpoint
CREATE INDEX "quiz_analytics_quiz_idx" ON "quiz_analytics" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "quiz_analytics_date_idx" ON "quiz_analytics" USING btree ("date");--> statement-breakpoint
CREATE INDEX "user_activity_user_idx" ON "user_activity" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_activity_course_idx" ON "user_activity" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "user_activity_action_idx" ON "user_activity" USING btree ("action");--> statement-breakpoint
CREATE INDEX "user_activity_date_idx" ON "user_activity" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "admin_logs_user_idx" ON "admin_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "admin_logs_resource_idx" ON "admin_logs" USING btree ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "admin_logs_action_idx" ON "admin_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "admin_logs_date_idx" ON "admin_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "system_logs_level_idx" ON "system_logs" USING btree ("level");--> statement-breakpoint
CREATE INDEX "system_logs_source_idx" ON "system_logs" USING btree ("source");--> statement-breakpoint
CREATE INDEX "system_logs_date_idx" ON "system_logs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "home_sections_key_idx" ON "home_page_sections" USING btree ("section_key");--> statement-breakpoint
CREATE INDEX "home_sections_order_idx" ON "home_page_sections" USING btree ("order");--> statement-breakpoint
CREATE UNIQUE INDEX "settings_key_idx" ON "settings" USING btree ("key");--> statement-breakpoint
CREATE INDEX "settings_category_idx" ON "settings" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "enrollments_user_course_idx" ON "enrollments" USING btree ("user_id","course_id");--> statement-breakpoint
CREATE INDEX "enrollments_user_idx" ON "enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "enrollments_course_idx" ON "enrollments" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "enrollments_status_idx" ON "enrollments" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_progress_enrollment_lesson_idx" ON "lesson_progress" USING btree ("enrollment_id","lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_progress_enrollment_idx" ON "lesson_progress" USING btree ("enrollment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "module_progress_enrollment_module_idx" ON "module_progress" USING btree ("enrollment_id","module_id");--> statement-breakpoint
CREATE INDEX "module_progress_enrollment_idx" ON "module_progress" USING btree ("enrollment_id");