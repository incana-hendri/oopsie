CREATE TABLE "squads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp with time zone,
	"name" text NOT NULL,
	"description" text,
	"settings" jsonb,
	"active" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"squad_id" uuid NOT NULL,
	"deleted_at" timestamp with time zone,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"hashed_password" text NOT NULL,
	"full_name" text NOT NULL,
	"avatar_url" text,
	"role" text DEFAULT 'member' NOT NULL,
	"settings" jsonb,
	"last_login" timestamp with time zone,
	"status" text DEFAULT 'active' NOT NULL,
	CONSTRAINT "users_squad_id_username_unique" UNIQUE("squad_id","username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "ios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"squad_id" uuid NOT NULL,
	"target_user_id" uuid NOT NULL,
	"nominator_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"proof_image" text,
	"status" text DEFAULT 'nominated' NOT NULL,
	"points" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"squad_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"read_at" text
);
--> statement-breakpoint
CREATE TABLE "rankings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"squad_id" uuid NOT NULL,
	"name" text NOT NULL,
	"min_points" integer NOT NULL,
	"max_points" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seconds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"squad_id" uuid NOT NULL,
	"io_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ios" ADD CONSTRAINT "ios_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ios" ADD CONSTRAINT "ios_nominator_id_users_id_fk" FOREIGN KEY ("nominator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seconds" ADD CONSTRAINT "seconds_io_id_ios_id_fk" FOREIGN KEY ("io_id") REFERENCES "public"."ios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seconds" ADD CONSTRAINT "seconds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;