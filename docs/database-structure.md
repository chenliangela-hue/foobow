# Foobow Database Structure

This document describes the intended product data model. It is framework-neutral until the backend stack is selected.

## Core Tables

### users

- `id`
- `email`
- `display_name`
- `locale`
- `timezone`
- `account_status`
- `created_at`
- `updated_at`
- `deleted_at`

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

