# Foobow ODD Spec

## Objective

Build a map-first virtual good karma app where users complete small symbolic deeds, receive emotional comfort, socialize safely, and optionally support verified real-world causes.

## Core Objects

| Object | Responsibility | Key States | Owner |
| --- | --- | --- | --- |
| User | Account identity, language, safety preferences | guest, registered, restricted, deleted | User |
| Profile | Public/private presentation of a user | public, friends-only, anonymous, private | User |
| Mood Check-In | Daily emotional input that guides recommendations | started, completed, skipped | User |
| Deed Type | Reusable virtual good deed template | draft, active, retired | Product/Admin |
| Map Spot | Location or campaign node on the world map | active, seasonal, completed, hidden | Product/Admin |
| Deed Action | A user's completed symbolic action | started, completed, journaled, shared | User |
| Karma Event | Non-financial progress event | earned, adjusted, revoked | System/Admin |
| Journal Entry | Private reflection tied to user or deed action | private, exported, deleted | User |
| Blessing | Anonymous or attributed supportive social post | visible, reported, hidden, removed | User/Moderator |
| Donation Campaign | Verified real-world cause or operating support | draft, verified, active, closed | Admin/Partner |
| Donation | User contribution to a campaign | pending, completed, refunded, receipted | User/System |
| Badge | Milestone or category recognition | locked, earned, hidden | System |
| Group Mission | Family, city, school, company, or community challenge | open, active, completed, archived | Group Owner/Admin |
| Community Post | A shared good deed or a request for help, posted to the feed | visible, reported, hidden, removed | User/Moderator |
| Post Reply | A supportive answer to a Community Post | visible, reported, hidden, removed | User/Moderator |
| Post Reaction | One press of support per person for a post (never a pile-on score) | added, withdrawn | User |
| Post Tag | Project category used to browse the feed | active, retired | Product/Admin |
| Safety Report | Report against content, profile, campaign, or behavior | open, reviewing, actioned, dismissed | Moderator |
| Subscription | Optional paid support plan | trial, active, past_due, canceled | User/System |

## Feature Map By Object

- User/Profile: onboarding, language, dark/light mode, privacy mode, quiet ranking mode, notification controls, data export/delete.
- Mood Check-In: daily state capture, recommended deed, streak update, reflection prompt.
- Deed Type/Map Spot: catalog, map pins, thematic layers, seasonal rituals, collective impact.
- Deed Action/Karma Event/Badge: ritual completion, symbolic progress, category ranking, badges, map stamps.
- Journal Entry: private reflection, user-controlled export/delete.
- Blessing/Group Mission: anonymous wall, kindness chains, group challenges, low-pressure reactions.
- Community Post/Post Reply/Post Reaction/Post Tag: a feed where people share a good deed or ask for help, answer each other, and offer support. Shape follows conventions common to open-source forums (Discourse, Lemmy): a post owns its replies, carries a kind (`share` | `ask`) and an optional project tag, and holds a moderation status from creation so reporting withdraws it immediately. Support is deliberately one-press-per-person and reversible — the product avoids leaderboards and pile-on scoring. Implemented in `prototype/app/community.js`, specified test-first in `tests/browser/foobow.community.spec.mjs`.
- Donation Campaign/Donation/Subscription: verified donation prompts, receipts, sponsorships, ad-free premium support.
- Safety Report: content moderation, fake charity controls, block/report/mute.

## User-Visible Flows

- First session: choose language and privacy posture, complete one starter deed, see what is symbolic versus verified real impact.
- Daily ritual: mood check-in, recommended deed, short ritual, karma event, optional private journal.
- Map exploration: browse map pins, switch layers, open a spot, perform location-specific deed.
- Community support: post or react to anonymous blessings, continue a kindness chain, report unsafe content.
- Donation: open verified campaign, choose a small amount, confirm transparency wording, store receipt.
- Profile: review deed history, badges, impact map, journal, donation history, settings.

## Data / API / Integration Impacts

- The MVP can remain static, but the object model should prepare for user accounts, map content, deed actions, social content, moderation, donations, and subscriptions.
- Map integration should support provider swapping later, with Foobow-owned objects storing canonical map spots and campaign metadata.
- Donation integration must use verified campaign state, receipt records, and clear separation from symbolic karma.
- Moderation must be modeled from the start because anonymous blessings and public campaigns are trust-sensitive.

## Current Gaps And Risks

- Current prototype uses local persistence only; production persistence is not implemented.
- Map is illustrative, not provider-backed.
- Donation flow is transparent but not integrated with a payment or charity verification provider.
- No real authentication, privacy enforcement, moderation queue, or admin console exists yet.
- CI currently validates static artifacts and smoke behavior; full browser PA tests should be added once a real app framework exists.
- Acceptance criteria are tracked in [Acceptance Criteria](acceptance-criteria.md).

## Implementation Slices

1. Project foundation
   - Goal: keep the repo self-documenting and verifiable.
   - Deliverables: memory, ODD, project plan, task board, database/API docs, CI checks.
   - Verification: unit, smoke, and PA checks pass.

2. Prototype hardening
   - Goal: improve app-like behavior without backend dependency.
   - Deliverables: local persistence, richer map/deed data, accessibility polish, responsive QA.
   - Verification: scripted interaction smoke tests and manual PA review.

3. MVP app scaffold
   - Goal: introduce production app structure after prototype flows stabilize.
   - Deliverables: frontend app shell, route/state model, shared design tokens, test harness.
   - Verification: CI build, unit tests, smoke tests.

4. Backend readiness
   - Goal: support accounts, deed actions, blessings, moderation, and donations.
   - Deliverables: database migrations, API contracts, seed data, admin moderation slice.
   - Verification: schema tests, API contract tests, security checks.
