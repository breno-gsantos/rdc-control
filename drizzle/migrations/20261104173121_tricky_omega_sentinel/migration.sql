CREATE TABLE "banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "systems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(150) NOT NULL UNIQUE
);
--> statement-breakpoint
DROP INDEX "accounts_bank_idx";--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "system_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "bank_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "system";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "bank";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_system_id_systems_id_fkey" FOREIGN KEY ("system_id") REFERENCES "systems"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_bank_id_banks_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_responsible_id_users_id_fkey", ADD CONSTRAINT "accounts_responsible_id_users_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE RESTRICT;