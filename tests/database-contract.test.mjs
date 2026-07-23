import test from "node:test";
import assert from "node:assert/strict";
import { hasAll, readText } from "./helpers.mjs";

test("initial migration creates core product tables", async () => {
  const sql = await readText("database/migrations/0001_initial.sql");
  const missing = hasAll(sql, [
    "create table users",
    "create table profiles",
    "create table deed_types",
    "create table map_spots",
    "create table mood_checkins",
    "create table deed_actions",
    "create table karma_events",
    "create table journal_entries",
    "create table blessings",
    "create table donation_campaigns",
    "create table donations",
    "create table safety_reports",
    "idempotency_key text not null unique",
    "payment_provider text",
    "provider_payment_id text",
    "paid_at timestamptz",
    "public_id text not null unique",
    "target_public_id text not null"
  ]);

  assert.deepEqual(missing, []);
});

test("initial migration includes access-path indexes and privacy constraints", async () => {
  const sql = await readText("database/migrations/0001_initial.sql");
  const missing = hasAll(sql, [
    "users_email_lower_unique",
    "mood_checkins_user_date_idx",
    "deed_actions_user_completed_idx",
    "blessings_visible_created_idx",
    "donation_campaigns_verified_active_idx",
    "safety_reports_status_created_idx",
    "privacy_mode text not null default 'private'",
    "moderation_status text not null default 'visible'"
  ]);

  assert.deepEqual(missing, []);
});

test("reference seed data includes MVP deed, map, badge, and donation records", async () => {
  const sql = await readText("database/seeds/0001_reference_data.sql");
  const missing = hasAll(sql, [
    "release-fish",
    "elder-crosswalk",
    "anonymous-blessing",
    "coastline-cleanup",
    "operating-support",
    "blessing_001",
    "blessing_002",
    "east-lake-wuhan",
    "toronto-crosswalk",
    "seven-day-ritual",
    "does not buy luck, virtue, or guaranteed karma"
  ]);

  assert.deepEqual(missing, []);
});

test("Prisma schema mirrors public IDs, donation idempotency, and moderation models", async () => {
  const schema = await readText("apps/api/prisma/schema.prisma");
  const config = await readText("apps/api/prisma.config.ts");
  const missing = hasAll(schema, [
    "model User",
    "publicId",
    "@map(\"public_id\")",
    "model MoodCheckin",
    "@@unique([userId, checkedInOn])",
    "model Blessing",
    "blessingReactions",
    "moderationStatus",
    "model Donation",
    "idempotencyKey",
    "@map(\"idempotency_key\")",
    "model SafetyReport",
    "safetyReports",
    "targetPublicId",
    "model Subscription"
  ]);

  assert.deepEqual(missing, []);

  const configMissing = hasAll(config, [
    "defineConfig",
    "schema: \"prisma/schema.prisma\"",
    "migrations",
    "process.env.DATABASE_URL",
    "127.0.0.1:1"
  ]);

  assert.deepEqual(configMissing, []);
  assert.equal(schema.includes("url      = env(\"DATABASE_URL\")"), false);
});

test("media and commerce migration defines enterprise media, AI, and admin tables", async () => {
  const sql = await readText("database/migrations/0003_media_and_commerce.sql");
  const missing = hasAll(sql, [
    "create table media_assets",
    "create table ai_generations",
    "create table blessing_intentions",
    "create table wish_lamps",
    "create table catalog_items",
    "create table orders",
    "create table admin_users",
    "create table admin_audit_log",
    "check (bucket in ('public-assets', 'user-uploads', 'ai-generated'))",
    "cost_usd numeric(10, 4)",
    "idempotency_key text not null unique",
    "unique (bucket, storage_key)"
  ]);
  assert.deepEqual(missing, []);
});

test("storage provisioning and docs keep binaries out of the database", async () => {
  const storageScript = await readText("apps/api/scripts/supabase-storage-provision.ts");
  const provisionScript = await readText("apps/api/scripts/supabase-provision.ts");
  const docs = await readText("docs/database-structure.md");
  const apiPackage = await readText("apps/api/package.json");

  const missing = hasAll(storageScript + provisionScript + docs + apiPackage, [
    "public-assets",
    "user-uploads",
    "ai-generated",
    "0003_media_and_commerce.sql",
    "db:supabase-storage",
    "No large binary objects are ever stored in the database",
    "media_assets",
    "signed URLs"
  ]);
  assert.deepEqual(missing, []);
});

test("focus session migration and Prisma draft support Calm Ritual persistence", async () => {
  const sql = await readText("database/migrations/0002_focus_sessions.sql");
  const schema = await readText("apps/api/prisma/schema.prisma");
  const docs = await readText("docs/database-structure.md");

  const missing = hasAll(sql + schema + docs, [
    "create table focus_soundscapes",
    "create table focus_sessions",
    "create table focus_reflections",
    "completion_idempotency_key text unique",
    "completion_threshold_percent",
    "reduced_motion",
    "karma_events_source_unique",
    "model FocusSoundscape",
    "model FocusSession",
    "model FocusReflection",
    "focusSessions",
    "focusReflections",
    "sourcePublicId",
    "focus_session.status",
    "Focus-session karma is awarded only when a server-side duration threshold is met"
  ]);

  assert.deepEqual(missing, []);
});
