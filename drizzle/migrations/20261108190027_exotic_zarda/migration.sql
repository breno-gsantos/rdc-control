CREATE TABLE "account_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"account_id" uuid NOT NULL,
	"username" varchar(255) NOT NULL,
	"password_encrypted" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_credentials_account_idx" ON "account_credentials" ("account_id");--> statement-breakpoint
ALTER TABLE "account_credentials" ADD CONSTRAINT "account_credentials_account_id_accounts_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE;