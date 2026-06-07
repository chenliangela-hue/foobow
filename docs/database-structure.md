# Foobow Database Structure

This document describes the intended product data model. It is framework-neutral until the backend stack is selected.

## Core Tables

Use `bigint generated always as identity` for primary keys unless an external provider requires opaque public IDs. Use `timestamptz` for all event timestamps and `numeric(12,2)` for money. Store user-facing public IDs as separate opaque tokens only when needed.

### users

- `id bigint primary key`
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
- `user_id`
- `avatar_key`
- `bio`
- `privacy_mode`
- `quiet_ranking_enabled`
- `theme_preference`
- `notification_preference`

### mood_checkins

- `id`
- `user_id`
- `mood`
- `note`
- `checked_in_on`
- `recommended_deed_type_id`

### deed_types

- `id`
- `name`
- `category`
- `description`
- `ritual_instructions`
- `default_karma_points`
- `status`

### map_spots

- `id`
- `name`
- `category`
- `latitude`
- `longitude`
- `region`
- `story`
- `status`
- `campaign_id`

### deed_actions

- `id`
- `user_id`
- `deed_type_id`
- `map_spot_id`
- `status`
- `visibility`
- `completed_at`
- `metadata`

### karma_events

- `id`
- `user_id`
- `deed_action_id`
- `event_type`
- `points`
- `reason`
- `created_at`

### journal_entries

- `id`
- `user_id`
- `deed_action_id`
- `body`
- `visibility`
- `created_at`
- `deleted_at`

### blessings

- `id`
- `author_user_id`
- `body`
- `visibility`
- `reaction_count`
- `moderation_status`
- `created_at`
- `removed_at`

### blessing_reactions

- `id`
- `blessing_id`
- `user_id`
- `reaction_type`
- `created_at`

### donation_campaigns

- `id`
- `name`
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
- `donation.payment_status`: pending, completed, failed, refunded.
- `subscription.status`: trial, active, past_due, canceled.

## Data Rules

- Journal entries are private by default.
- Blessings can be anonymous but must still be linked to an internal user for abuse prevention.
- Karma events are symbolic and must not be purchasable.
- A verified donation campaign must have `verification_status = verified` before accepting payments.
- Donation records must support receipts and refunds.
- Quiet ranking mode must exclude user identity from public ranking surfaces.

## Relationships

- `profiles.user_id` references `users.id` one-to-one.
- `mood_checkins.user_id`, `deed_actions.user_id`, `karma_events.user_id`, `journal_entries.user_id`, `blessings.author_user_id`, `donations.user_id`, `user_badges.user_id`, `group_memberships.user_id`, and `subscriptions.user_id` reference `users.id`.
- `deed_actions.deed_type_id` references `deed_types.id`.
- `deed_actions.map_spot_id` references `map_spots.id`.
- `karma_events.deed_action_id` references `deed_actions.id`.
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
- `karma_events`: index on `(user_id, created_at desc)`.
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
- First seed draft: [`database/seeds/0001_reference_data.sql`](../database/seeds/0001_reference_data.sql).
- Every schema change must have a forward migration and a rollback note.
- Add nullable columns first, backfill, then enforce `not null` constraints.
- Create large indexes concurrently in production.
- Never rewrite large tables with volatile defaults.
- Add foreign-key indexes manually because PostgreSQL does not create them automatically.
- Seed data should include initial deed types, map spots, badges, and verified test donation campaigns.

## Future PostgreSQL Extensions

- PostGIS for real map spots, radius filters, route paths, and geospatial campaign queries.
- `pg_trgm` for fuzzy search over deed names, map spots, and campaigns.
- `pgaudit` or equivalent audit logging for moderation and donation-sensitive actions.
