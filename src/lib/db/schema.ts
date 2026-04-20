import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  real,
  jsonb,
  timestamp,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  userId: uuid("user_id").primaryKey(),
  displayName: text("display_name"),
  publicOptIn: boolean("public_opt_in").notNull().default(false),
  byokEncrypted: text("byok_encrypted"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const soulReadings = pgTable("soul_readings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(),
  answers: jsonb("answers").notNull(),
  vector: jsonb("vector").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow(),
  retriesUsed: integer("retries_used").notNull().default(0),
});

export const zanpakuto = pgTable(
  "zanpakuto",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().unique(),
    sealedName: text("sealed_name").notNull(),
    trueName: text("true_name"),
    releaseCommand: text("release_command"),
    bladeType: text("blade_type").notNull(),
    guardDesc: text("guard_desc").notNull(),
    hiltColor: text("hilt_color").notNull(),
    element: text("element").notNull(),
    innerWorldDesc: text("inner_world_desc").notNull(),
    innerWorldImageUrl: text("inner_world_image_url"),
    spiritPersona: jsonb("spirit_persona").notNull(),
    model3dUrl: text("model_3d_url"),
    state: text("state").notNull().default("sealed"),
    shikaiUnlockedAt: timestamp("shikai_unlocked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    check("zanpakuto_state_check", sql`${t.state} IN ('sealed','shikai','bankai')`),
  ]
);

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  zanpakutoId: uuid("zanpakuto_id").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow(),
  summary: text("summary"),
  messageCount: integer("message_count").notNull().default(0),
  qualityScore: real("quality_score"),
});

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id").notNull(),
    role: text("role").notNull(),
    content: text("content").notNull(),
    tokenCount: integer("token_count").notNull().default(0),
    moderationFlag: boolean("moderation_flag").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    check("messages_role_check", sql`${t.role} IN ('user','spirit','system')`),
  ]
);

export const shareCards = pgTable("share_cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  zanpakutoId: uuid("zanpakuto_id").notNull(),
  state: text("state").notNull(),
  imageUrl: text("image_url").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const canonBankai = pgTable("canon_bankai", {
  id: uuid("id").primaryKey().defaultRandom(),
  characterName: text("character_name").notNull(),
  canonBankaiName: text("canon_bankai_name").notNull(),
  releaseCommand: text("release_command").notNull(),
  audioUrl: text("audio_url"),
  sfxUrl: text("sfx_url"),
  imageUrl: text("image_url"),
  loreSnippet: text("lore_snippet"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
