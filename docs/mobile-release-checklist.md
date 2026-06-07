# Foobow Mobile Release Checklist

## Objective

Prepare the Expo mobile scaffold for a disciplined App Store and Google Play path without pretending the current prototype is production-ready.

## Current State

- Expo Router tab routes exist for Today, Map, Deeds, Community, and Profile.
- TypeScript typecheck passes.
- Core prototype flows are represented in the mobile shell.
- Production authentication, real map SDK, payment/subscription integration, and persistent backend connection remain future work.

## App Store Readiness

- Apple Sign In is required if any third-party social login is offered.
- Privacy nutrition labels must cover account data, donation/payment metadata, diagnostics, and optional location use.
- Donation and subscription copy must not imply users can buy luck, virtue, forgiveness, or guaranteed karma.
- User-generated blessings require report/block and moderation policy disclosure.
- Account deletion must be available in-app once account creation is live.

## Google Play Readiness

- Data Safety form must cover profile, journal/reflection, donation, diagnostics, and approximate location usage.
- Payments must use the appropriate channel: in-app subscriptions through store billing, charitable donations through compliant payment/partner flow.
- Ads must be clearly disclosed and removable through paid tier if offered.
- Moderation and reporting controls must be visible for social features.

## Build Gates

- `npm run test:mobile`
- `npm run test:api`
- `npm run test:browser`
- `npm run test:visual`
- `npm run test:security`
- Manual PA pass on at least one iOS-sized and one Android-sized viewport.

## Release Assets

- App icon and adaptive icon.
- Splash screen.
- Store screenshots for Today, Map, Deeds, Community, Profile.
- Short description focused on symbolic good deeds and emotional comfort.
- Privacy policy and terms links.
- Donation transparency statement.

## Open Decisions

- Bundle identifier and app display name.
- Store account ownership.
- First paid tier scope: ad-free only, premium themes, family/group features, or deeper stats.
- Whether donations launch at MVP or after verified partner onboarding.
