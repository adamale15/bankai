CREATE TABLE "canon_bankai" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_name" text NOT NULL,
	"canon_bankai_name" text NOT NULL,
	"release_command" text NOT NULL,
	"audio_url" text,
	"sfx_url" text,
	"image_url" text,
	"lore_snippet" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"zanpakuto_id" uuid NOT NULL,
	"started_at" timestamp with time zone DEFAULT now(),
	"summary" text,
	"message_count" integer DEFAULT 0 NOT NULL,
	"quality_score" real
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"token_count" integer DEFAULT 0 NOT NULL,
	"moderation_flag" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "messages_role_check" CHECK ("messages"."role" IN ('user','spirit','system'))
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"display_name" text,
	"public_opt_in" boolean DEFAULT false NOT NULL,
	"byok_encrypted" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "share_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"zanpakuto_id" uuid NOT NULL,
	"state" text NOT NULL,
	"image_url" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "share_cards_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "soul_readings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"answers" jsonb NOT NULL,
	"vector" jsonb NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now(),
	"retries_used" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "soul_readings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "zanpakuto" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"sealed_name" text NOT NULL,
	"true_name" text,
	"release_command" text,
	"blade_type" text NOT NULL,
	"guard_desc" text NOT NULL,
	"hilt_color" text NOT NULL,
	"element" text NOT NULL,
	"inner_world_desc" text NOT NULL,
	"inner_world_image_url" text,
	"spirit_persona" jsonb NOT NULL,
	"model_3d_url" text,
	"state" text DEFAULT 'sealed' NOT NULL,
	"shikai_unlocked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "zanpakuto_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "zanpakuto_state_check" CHECK ("zanpakuto"."state" IN ('sealed','shikai','bankai'))
);
