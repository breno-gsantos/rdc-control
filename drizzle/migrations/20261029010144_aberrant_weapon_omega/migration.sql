CREATE TYPE "account_status" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TYPE "notification_type" AS ENUM('urgent', 'attention', 'update', 'system');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('admin', 'director', 'manager', 'coordinator', 'supervisor', 'promoter', 'developer');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(200) NOT NULL,
	"system" varchar(150) NOT NULL,
	"username" varchar(255) NOT NULL,
	"password_encrypted" text NOT NULL,
	"bank" varchar(100) NOT NULL,
	"city" varchar(120) NOT NULL,
	"state" varchar(2) NOT NULL,
	"category" varchar(100) NOT NULL,
	"responsible_id" uuid,
	"due_date" date,
	"status" "account_status" DEFAULT 'active'::"account_status" NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid,
	"account_id" uuid,
	"action" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"account_id" uuid,
	"title" varchar(255) NOT NULL,
	"detail" text DEFAULT '' NOT NULL,
	"type" "notification_type" DEFAULT 'system'::"notification_type" NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'promoter'::"user_role" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "accounts_status_idx" ON "accounts" ("status");--> statement-breakpoint
CREATE INDEX "accounts_due_date_idx" ON "accounts" ("due_date");--> statement-breakpoint
CREATE INDEX "accounts_responsible_idx" ON "accounts" ("responsible_id");--> statement-breakpoint
CREATE INDEX "accounts_bank_idx" ON "accounts" ("bank");--> statement-breakpoint
CREATE INDEX "accounts_name_idx" ON "accounts" ("name");--> statement-breakpoint
CREATE INDEX "activities_created_idx" ON "activities" ("created_at");--> statement-breakpoint
CREATE INDEX "activities_account_idx" ON "activities" ("account_id");--> statement-breakpoint
CREATE INDEX "activities_user_idx" ON "activities" ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_user_created_idx" ON "notifications" ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "notifications_user_unread_idx" ON "notifications" ("user_id","is_read");--> statement-breakpoint
CREATE INDEX "notifications_account_idx" ON "notifications" ("account_id");--> statement-breakpoint
CREATE INDEX "users_name_idx" ON "users" ("name");--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_responsible_id_users_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_account_id_accounts_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_account_id_accounts_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL;