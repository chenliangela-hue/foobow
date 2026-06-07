# Foobow API Interface

This is the product-level API shape for future implementation. It avoids framework-specific details until the backend stack is selected.

## Auth And User

- `POST /auth/session`
  - Purpose: create or refresh a user session.
- `GET /me`
  - Purpose: return account, profile, language, privacy, and subscription state.
- `PATCH /me/profile`
  - Purpose: update display name, avatar, privacy mode, quiet ranking, theme, language, and notifications.
- `POST /me/export`
  - Purpose: request user data export.
- `DELETE /me`
  - Purpose: request account deletion.

## Daily Ritual

- `POST /checkins`
  - Purpose: create today's mood check-in and receive a recommended deed.
- `GET /today`
  - Purpose: return daily recommendation, streak, journal prompt, and active campaigns.
- `POST /journal-entries`
  - Purpose: save a private reflection.

## Map And Deeds

- `GET /map-spots`
  - Purpose: return map spots filtered by region, category, campaign, or layer.
- `GET /deed-types`
  - Purpose: return active virtual good deed templates.
- `POST /deed-actions`
  - Purpose: start or complete a symbolic deed.
- `GET /deed-actions/me`
  - Purpose: return personal deed history and impact map.

## Gamification

- `GET /karma/me`
  - Purpose: return symbolic progress, category totals, streaks, and recent karma events.
- `GET /badges/me`
  - Purpose: return earned and locked badges.
- `GET /rankings`
  - Purpose: return category, group, city, and global rankings with quiet-mode filtering.

## Community

- `GET /blessings`
  - Purpose: return moderated anonymous blessing wall.
- `POST /blessings`
  - Purpose: create a blessing.
- `POST /blessings/{id}/reactions`
  - Purpose: add low-pressure reactions such as bless, support, thank you, or same feeling.
- `POST /reports`
  - Purpose: report content, profile, campaign, or abusive behavior.

## Donations And Subscription

- `GET /donation-campaigns`
  - Purpose: return verified donation campaigns and sponsored missions.
- `POST /donations`
  - Purpose: start a donation to a verified donation campaign.
- `GET /donations/me`
  - Purpose: return donation history and receipts.
- `GET /subscription/plans`
  - Purpose: return paid support options.
- `POST /subscription`
  - Purpose: start or update a subscription.

## Admin / Moderation

- `GET /admin/reports`
  - Purpose: review safety reports.
- `PATCH /admin/reports/{id}`
  - Purpose: resolve or escalate a report.
- `POST /admin/deed-types`
  - Purpose: create or update deed templates.
- `POST /admin/map-spots`
  - Purpose: create or update map spots and campaigns.
- `PATCH /admin/donation-campaigns/{id}`
  - Purpose: verify, reject, activate, or close donation campaigns.

## API Rules

- Public responses must respect `privacy_mode` and quiet ranking mode.
- Journal bodies must never appear in public APIs.
- Donation endpoints must reject unverified campaigns.
- Karma points cannot be purchased through donation or subscription APIs.
- Moderation status must be checked before community content is returned.

