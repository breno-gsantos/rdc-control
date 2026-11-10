CREATE TABLE "account_credential_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"account_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"can_view_credentials" boolean DEFAULT true NOT NULL,
	"can_reveal_password" boolean DEFAULT false NOT NULL,
	"granted_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "account_credential_permissions_unique" ON "account_credential_permissions" ("account_id","user_id");--> statement-breakpoint
CREATE INDEX "account_credential_permissions_user_idx" ON "account_credential_permissions" ("user_id");--> statement-breakpoint
CREATE INDEX "account_credential_permissions_account_idx" ON "account_credential_permissions" ("account_id");--> statement-breakpoint
ALTER TABLE "account_credential_permissions" ADD CONSTRAINT "account_credential_permissions_account_id_accounts_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "account_credential_permissions" ADD CONSTRAINT "account_credential_permissions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "account_credential_permissions" ADD CONSTRAINT "account_credential_permissions_granted_by_users_id_fkey" FOREIGN KEY ("granted_by") REFERENCES "users"("id") ON DELETE SET NULL;