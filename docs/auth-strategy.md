# Foobow Auth Strategy

## Objective

Foobow needs account security that feels lightweight for daily ritual users but strong enough for profile privacy, donation history, moderation, and future paid subscription features.

## Recommended MVP Direction

Use a managed identity provider for MVP instead of building custom authentication. Shortlist:

- Auth0: strongest enterprise fit for social login, MFA, auditability, rules/actions, and future organization accounts.
- Clerk: strongest developer velocity for consumer app profiles, passkeys, session management, and hosted account UI.
- Supabase Auth: strongest fit if the backend later standardizes on Supabase-managed Postgres and row-level security.

Default recommendation: start with Clerk for prototype-to-MVP speed unless enterprise SSO or complex B2B organization controls become first-release requirements. If enterprise procurement and SSO are required early, choose Auth0.

## Required Login Methods

- Email magic link or one-time code.
- Apple Sign In for iOS release readiness.
- Google sign-in for Android and web acquisition.
- Optional anonymous local mode for browsing the prototype-level experience before account creation.

## Account Objects

- User: stable account identity owned by the auth provider.
- Profile: app-level display name, avatar/companion, language, privacy mode, notification preferences.
- Session: short-lived app session mapped to the API bearer token.
- Consent record: terms, privacy, notification, and donation transparency acknowledgements.
- Deletion/export request: user-controlled account lifecycle request.

## Security Requirements

- Server verifies every bearer token before returning `/me`, journal, donation history, or private profile data.
- Donation history never appears on public profiles by default.
- Users can export data and request deletion from Profile settings.
- Support MFA/passkeys once payments, subscriptions, or family groups are live.
- Moderation/admin routes require a separate role claim from the identity provider.

## UX Requirements

- Let users explore public map spots and deed types before login.
- Require login before saving journal entries, posting blessings, reporting content, donating, subscribing, or joining groups.
- Explain that symbolic karma is not tied to payment, subscription, or ad interactions.
- Keep account prompts calm and utility-focused, not guilt-based.

## Open Decisions

- Final provider: Clerk, Auth0, or Supabase Auth.
- Whether anonymous device-local mode can sync after account creation.
- Whether family/group plans need organization accounts in the first paid tier.
