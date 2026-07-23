# Foobow Database Structure

This document describes the intended product data model. It is framework-neutral until the backend stack is selected.

## Core Tables

Use `bigint generated always as identity` for internal primary keys. Expose stable opaque `public_id` values to clients for dynamic user-facing records. Static catalog tables use their unique `slug` as the public identifier. Use `timestamptz` for all event timestamps and `numeric(12,2)` for money.

### users

- `id bigint primary key`
- `public_id text unique not null`
- `email text unique nulls not distinct`
- `display_name text not null`
- `locale text not null default 'en'`
- `timezone text not null default 'America/Toronto'`
- `account_status text not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `deleted_at timestamptz`

### profiles

- `id`
- `public_id`
- `user_id`
- `avatar_key`
- `bio`
- `privacy_mode`
- `quiet_ranking_enabled`
- `theme_preference`
- `notification_preference`

### mood_checkins

- `id`
- `public_id`
- `user_id`
- `mood`
- `note`
- `checked_in_on`
- `recommended_deed_type_id`

### deed_types

- `id`
- `name`
- `slug`
- `category`
- `description`
- `ritual_instructions`
- `default_karma_points`
- `status`

### map_spots

- `id`
- `name`
- `slug`
- `category`
- `latitude`
- `longitude`
- `region`
- `story`
- `status`
- `campaign_id`

### deed_actions

- `id`
- `public_id`
- `user_id`
- `deed_type_id`
- `map_spot_id`
- `status`
- `visibility`
- `completed_at`
- `metadata`

### focus_soundscapes

- `id`
- `slug`
- `name`
- `category`
- `description`
- `status`

### focus_sessions

- `id`
- `public_id`
- `user_id`
- `deed_action_id`
- `soundscape_id`
- `target_duration_seconds`
- `elapsed_seconds`
- `completion_threshold_percent`
- `reduced_motion`
- `status`
- `completion_idempotency_key`
- `started_at`
- `completed_at`
- `expires_at`
- `metadata`

### focus_reflections

- `id`
- `public_id`
- `user_id`
- `focus_session_id`
- `mood`
- `body`
- `visibility`
- `created_at`
- `deleted_at`

### karma_events

- `id`
- `public_id`
- `user_id`
- `deed_action_id`
- `event_type`
- `points`
- `reason`
- `created_at`

### journal_entries

- `id`
- `public_id`
- `user_id`
- `deed_action_id`
- `body`
- `visibility`
- `created_at`
- `deleted_at`

### blessings

- `id`
- `public_id`
- `author_user_id`
- `body`
- `visibility`
- `reaction_count`
- `moderation_status`
- `created_at`
- `removed_at`

### blessing_reactions

- `id`
- `public_id`
- `blessing_id`
- `user_id`
- `reaction_type`
- `created_at`

### donation_campaigns

- `id`
- `name`
- `slug`
- `partner_name`
- `category`
- `verification_status`
- `description`
- `target_amount`
- `current_amount`
- `starts_at`
- `ends_at`
- `status`

### donations

- `id`
- `public_id`
- `user_id`
- `campaign_id`
- `amount`
- `currency`
- `payment_status`
- `receipt_url`
- `created_at`

### badges

- `id`
- `name`
- `category`
- `description`
- `criteria`
- `status`

### user_badges

- `id`
- `user_id`
- `badge_id`
- `earned_at`
- `visibility`

### group_missions

- `id`
- `name`
- `group_type`
- `category`
- `goal_count`
- `current_count`
- `starts_at`
- `ends_at`
- `status`

### group_memberships

- `id`
- `group_mission_id`
- `user_id`
- `role`
- `status`

### safety_reports

- `id`
- `reporter_user_id`
- `target_type`
- `target_id`
- `reason`
- `moderation_status`
- `moderator_note`
- `created_at`
- `resolved_at`

### subscriptions

- `id`
- `user_id`
- `plan`
- `status`
- `started_at`
- `renews_at`
- `canceled_at`

## Required States

- `privacy_mode`: public, friends_only, anonymous, private.
- `moderation_status`: visible, reported, reviewing, hidden, removed, dismissed.
- `verification_status`: unverified, pending_review, verified, rejected.
- `deed_action.status`: started, completed, journaled, shared.
- `focus_session.status`: started, completed, abandoned, expired.
- `focus_reflection.mood`: calm, lighter, same, heavy, grateful, hopeful.
- `donation.payment_status`: pending, completed, failed, refunded.
- `subscription.status`: trial, active, past_due, canceled.

## Data Rules

- Journal entries are private by default.
- Blessings can be anonymous but must still be linked to an internal user for abuse prevention.
- Karma events are symbolic and must not be purchasable.
- Focus-session karma is awarded only when a server-side duration threshold is met and must be idempotent.
- Focus reflections are private by default and must be handled like journal entries for export/delete flows.
- A verified donation campaign must have `verification_status = verified` before accepting payments.
- Donation records must support receipts and refunds.
- Quiet ranking mode must exclude user identity from public ranking surfaces.

## Relationships

- `profiles.user_id` references `users.id` one-to-one.
- `mood_checkins.user_id`, `deed_actions.user_id`, `karma_events.user_id`, `journal_entries.user_id`, `blessings.author_user_id`, `donations.user_id`, `user_badges.user_id`, `group_memberships.user_id`, and `subscriptions.user_id` reference `users.id`.
- `deed_actions.deed_type_id` references `deed_types.id`.
- `deed_actions.map_spot_id` references `map_spots.id`.
- `focus_sessions.user_id` references `users.id`.
- `focus_sessions.deed_action_id` references `deed_actions.id`.
- `focus_sessions.soundscape_id` references `focus_soundscapes.id`.
- `focus_reflections.focus_session_id` references `focus_sessions.id`.
- `karma_events.deed_action_id` references `deed_actions.id`.
- `karma_events.focus_session_id` references `focus_sessions.id`.
- `journal_entries.deed_action_id` references `deed_actions.id`.
- `blessing_reactions.blessing_id` references `blessings.id`.
- `donations.campaign_id` references `donation_campaigns.id`.
- `user_badges.badge_id` references `badges.id`.
- `group_memberships.group_mission_id` references `group_missions.id`.

## Indexes

- `users`: unique lower-email index for case-insensitive lookup.
- `profiles`: index on `privacy_mode` for moderation/admin review filters.
- `mood_checkins`: unique `(user_id, checked_in_on)` and index on `(user_id, checked_in_on desc)`.
- `map_spots`: index on `(category, status)` and geospatial index on location when PostGIS is introduced.
- `deed_actions`: indexes on `(user_id, completed_at desc)`, `(deed_type_id, completed_at desc)`, and `(map_spot_id, completed_at desc)`.
- `focus_sessions`: indexes on `(user_id, started_at desc)`, `deed_action_id`, and `(status, expires_at)`.
- `focus_reflections`: indexes on `(user_id, created_at desc)` and `focus_session_id`.
- `karma_events`: index on `(user_id, created_at desc)`.
- `karma_events`: unique partial index on `(source_type, source_public_id)` for idempotent focus-session completion.
- `journal_entries`: index on `(user_id, created_at desc)` with private visibility enforced in access policy.
- `blessings`: partial index on `(created_at desc)` where `moderation_status = 'visible'`.
- `donation_campaigns`: partial index on `(status, starts_at, ends_at)` where `verification_status = 'verified'`.
- `donations`: unique `idempotency_key`, index on `(user_id, created_at desc)`, and index on `(campaign_id, payment_status)`.
- `safety_reports`: index on `(moderation_status, created_at)`.

## Privacy, Retention, And Audit

- Soft-delete users first, then hard-delete or anonymize PII after the retention window required by payment, tax, fraud, and safety obligations.
- Journal bodies should be deleted or encrypted per user deletion request unless legally required to retain abuse evidence.
- Donation receipts may need longer retention than profile data; keep receipt records separate from public profile surfaces.
- Moderation actions should be audit logged with moderator ID, target, action, reason, and timestamp.
- Anonymous public content should retain internal author linkage for abuse prevention until the safety retention period expires.

## Migration Strategy

- First migration draft: [`database/migrations/0001_initial.sql`](../database/migrations/0001_initial.sql).
- Focus session migration draft: [`database/migrations/0002_focus_sessions.sql`](../database/migrations/0002_focus_sessions.sql).
- First seed draft: [`database/seeds/0001_reference_data.sql`](../database/seeds/0001_reference_data.sql).
- Every schema change must have a forward migration and a rollback note.
- Add nullable columns first, backfill, then enforce `not null` constraints.
- Create large indexes concurrently in production.
- Never rewrite large tables with volatile defaults.
- Add foreign-key indexes manually because PostgreSQL does not create them automatically.
- Seed data should include initial deed types, map spots, badges, and verified test donation campaigns.

## Media And Object Storage (enterprise principle)

**No large binary objects are ever stored in the database.** Images, GIFs, short video, Lottie animations, and audio live in object storage (Supabase Storage, S3-compatible, CDN-backed). The database stores only a `media_assets` row per file — bucket, storage key, content type, dimensions, duration, checksum, and moderation status — and everything references media by `media_asset_id`.

Buckets (provisioned by `apps/api/scripts/supabase-storage-provision.ts`):

- `public-assets` — public, CDN-served: curated animations (release fish, wish lamp), location views, soundscape art, decorative media.
- `user-uploads` — private: user photos (e.g. "Pray for family"). Served only through short-lived signed URLs; never public.
- `ai-generated` — private by default: AI-produced images, promoted to public only after moderation approval.

Delivery: public bucket via CDN URL; private buckets via signed URLs minted server-side with a short TTL. Uploads are validated for content type and size, checksummed, virus/no-op scanned, and set to `status = 'pending'` until processed, then `ready`.

## Media, AI, Commerce, And Admin Tables (Phase 2)

See [`database/migrations/0003_media_and_commerce.sql`](../database/migrations/0003_media_and_commerce.sql).

- `media_assets` — object-storage pointers only (bucket, storage_key, kind, content_type, byte_size, width/height/duration_ms, checksum_sha256, alt_text, status, moderation_status). Unique `(bucket, storage_key)`.
- `ai_generations` — one row per AI response (kind, locale, model, input/output tokens, `cost_usd`, response_text, status, moderation_status). Tokens and cost are tracked per request for budgeting and rate-limit accounting. AI outputs are warm reflections, never predictions or guaranteed outcomes.
- `blessing_intentions` — "Pray for family" and similar (category, recipient_label, message, locale, optional `ai_generation_id` and `media_asset_id`, visibility). Private by default.
- `wish_lamps` — symbolic 心灯 offerings that expire (lamp_type, wish_text, optional media/AI links, lit_at, expires_at).
- `catalog_items` — pricing (商品定价): kind (donation/premium_pack/lamp_offering/subscription), price, currency, billing_interval, status, sort_order.
- `orders` — commerce (订单): amount, currency, payment_provider (stripe/applepay/googlepay/wechatpay/manual), payment_status, review_status, unique `idempotency_key`. Backs the admin income/orders dashboard.
- `admin_users` — admin backend operators (role: owner/admin/reviewer). Separate from app `users`.
- `admin_audit_log` — every admin action (审计日志): action, target, detail jsonb, ip_address.

### Phase 2 data rules

- Symbolic karma/福报 remains non-purchasable; only real donations and optional premium content (packs, subscriptions, lamp offerings) are paid, and money is always transparent and separate.
- Every money path carries a unique idempotency key (`orders.idempotency_key`).
- User-generated and AI content carry a moderation status; private buckets and private-by-default visibility protect user photos and intentions.
- AI generation is rate-limited and cost-tracked; long generations should run through a background job queue rather than blocking requests.
- Retention: `user-uploads` and blessing intentions are deleted on account deletion; `ai_generations` retains minimal non-PII context and cost records for accounting.

### Enterprise scaling notes

- Time-partition high-volume append tables (`ai_generations`, `karma_events`, `orders`, `admin_audit_log`) by month once volume warrants; keep hot partitions indexed.
- Add row-level security so users can only read their own owned rows; admin/service access uses the service role.
- Serve all media through a CDN; never proxy binaries through the API.
- Keep the SQL migration the source of truth for DB-specific constraints and indexes; Prisma models mirror it as the ORM surface is needed (added alongside the Phase 3 AI endpoints).

## Future PostgreSQL Extensions

- PostGIS for real map spots, radius filters, route paths, and geospatial campaign queries.
- `pg_trgm` for fuzzy search over deed names, map spots, and campaigns.
- `pgaudit` or equivalent audit logging for moderation and donation-sensitive actions.
