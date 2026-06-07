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
    "east-lake-wuhan",
    "toronto-crosswalk",
    "seven-day-ritual",
    "does not buy luck, virtue, or guaranteed karma"
  ]);

  assert.deepEqual(missing, []);
});

test("Prisma schema mirrors public IDs, donation idempotency, and moderation models", async () => {
  const schema = await readText("apps/api/prisma/schema.prisma");
  const missing = hasAll(schema, [
    "model User",
    "publicId",
    "@map(\"public_id\")",
    "model MoodCheckin",
    "@@unique([userId, checkedInOn])",
    "model Blessing",
    "moderationStatus",
    "model Donation",
    "idempotencyKey",
    "@map(\"idempotency_key\")",
    "model SafetyReport",
    "targetPublicId",
    "model Subscription"
  ]);

  assert.deepEqual(missing, []);
});
