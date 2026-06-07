# Foobow API Interface

This is the product-level API shape for future implementation. It avoids framework-specific details until the backend stack is selected.

## Auth And User

Base path: `/api/v1`.

All authenticated endpoints require a bearer session token. Public discovery endpoints can be read-only, rate-limited, and must never expose private journals or hidden/moderated content.

## Common Contracts

### Pagination

Collection endpoints use cursor pagination:

```json
{
  "items": [],
  "page_info": {
    "next_cursor": "opaque-cursor-or-null",
    "has_next_page": false
  }
}
```

### Error Shape

```json
{
  "error": {
    "code": "validation_error",
    "message": "Request validation failed.",
    "details": [
      { "field": "amount", "issue": "must be greater than zero" }
    ],
    "request_id": "req_123"
  }
}
```

### Standard Error Codes

- `unauthorized`
- `forbidden`
- `not_found`
- `validation_error`
- `conflict`
- `rate_limited`
- `moderation_required`
- `unverified_campaign`
- `idempotency_conflict`
- `internal_error`

### Rate Limits

- Anonymous read endpoints: strict IP/device limits.
- Authenticated social write endpoints: per-user rate limits.
- Donation creation: per-user and per-idempotency-key limits.
- Report endpoints: per-user limits with abuse monitoring.

- `POST /auth/session`
  - Purpose: create or refresh a user session.
- `GET /me`
  - Purpose: return account, profile, language, privacy, and subscription state.
- `PATCH /me/profile`
  - Purpose: update display name, avatar, privacy mode, quiet ranking, theme, language, and notifications.
  - Request: `{ "display_name": "Quiet Helper", "locale": "en", "privacy_mode": "private", "quiet_ranking_enabled": true }`
  - Response: `{ "profile": { "id": "profile_123", "privacy_mode": "private" } }`
- `POST /me/export`
  - Purpose: request user data export.
- `DELETE /me`
  - Purpose: request account deletion.

## Daily Ritual

- `POST /checkins`
  - Purpose: create today's mood check-in and receive a recommended deed.
  - Request: `{ "mood": "heavy", "note": "optional private note" }`
  - Response: `{ "checkin": {}, "recommended_deed": {}, "streak": 8 }`
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
  - Request: `{ "deed_type_id": "deed_release_fish", "map_spot_id": "spot_east_lake", "status": "completed", "visibility": "anonymous" }`
  - Response: `{ "deed_action": {}, "karma_event": {}, "badges_earned": [] }`
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
  - Request: `{ "body": "May your next step feel lighter.", "visibility": "anonymous" }`
  - Response: `{ "blessing": { "id": "blessing_123", "moderation_status": "visible" } }`
- `POST /blessings/{id}/reactions`
  - Purpose: add low-pressure reactions such as bless, support, thank you, or same feeling.
- `POST /reports`
  - Purpose: report content, profile, campaign, or abusive behavior.
  - Request: `{ "target_type": "blessing", "target_id": "blessing_123", "reason": "harassment" }`
  - Response: `{ "report": { "id": "report_123", "moderation_status": "open" } }`

## Donations And Subscription

- `GET /donation-campaigns`
  - Purpose: return verified donation campaigns and sponsored missions.
- `POST /donations`
  - Purpose: start a donation to a verified donation campaign.
  - Headers: `Idempotency-Key: client-generated-unique-key`
  - Request: `{ "campaign_id": "campaign_123", "amount": "3.00", "currency": "USD" }`
  - Response: `{ "donation": { "id": "donation_123", "payment_status": "pending" }, "checkout": { "url": "https://payment-provider.example/..." } }`
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
- Donation creation must be idempotent by `Idempotency-Key`.
- Webhooks from a future payment provider must verify signatures before updating payment status.
- List endpoints must use cursor pagination, not unbounded arrays.
- Public IDs should be opaque and must not reveal user count or sequence position.
- All write endpoints must return request IDs in error responses for support/debugging.

## Payment / Donation Webhook Flow

- Client creates donation with an idempotency key.
- Server verifies campaign is active and `verification_status = verified`.
- Server creates pending donation record and payment-provider checkout.
- Payment provider sends signed webhook.
- Server verifies signature and updates payment status.
- Receipt URL is attached only after successful payment confirmation.
- Karma progress is not increased by payment; donation impact is shown separately.
