# Foobow Mobile Release Checklist

## Objective

Prepare the Expo mobile scaffold for a disciplined App Store and Google Play path without pretending the current prototype is production-ready.

## Current State

- Expo Router tab routes exist for Today, Map, Deeds, Blessings (祈福), Community, and Profile.
- TypeScript typecheck passes cleanly with zero errors.
- Core prototype flows and zen micro-scenes (Wooden Fish, Incense, Prayer Wheel, Lotus Pond) are fully represented.
- Production authentication is key-gated via Clerk with secure device token cache and guest mode preserved.
- Live API synchronization (`/api/v1/sync`) and Calm Ritual focus sessions (`/api/v1/focus-sessions`) are wired with offline fallback.
- Complete offline asset bundle: 30 high-resolution Zen sanctuary assets packaged locally in `apps/mobile/assets/foobow/` mirroring the Cloudflare R2 CDN asset manifest with verified SHA256 checksums.
- Standalone Expo packaging and EAS build configuration are verified (`apps/mobile/app.json` and `apps/mobile/eas.json`).
- Store listing specification is completed in `docs/store-listing.md` covering English and Simplified Chinese descriptions, keywords, privacy nutrition labels, and Google Play Data Safety.

## App Store Readiness

- Apple Sign In is supported via Clerk authentication when enabled.
- Privacy nutrition labels declared: product interaction diagnostics only; no third-party tracking; reflections and karma stored locally.
- Strict pure giving ethics: voluntary financial offerings fund open-source development and server hosting with 0 karma points awarded; no buying-luck or pay-to-win claims.
- User-generated content and community posts include safe reporting controls and withdrawal moderation.
- Account deletion and local data clearing controls are directly accessible in Profile.

## Google Play Readiness

- Data Safety declarations specified in `docs/store-listing.md`.
- Voluntary donations decoupled from in-game perks/karma to comply with store billing guidelines.
- Zero ads policy.
- Moderation, report actions, and content withdrawal fully functional across community features.

## Build Gates

- `npm run test:mobile` (Expo mobile TypeScript typecheck)
- `npm run test:api` (NestJS + HTTP runtime tests & typecheck)
- `npm run test:browser` (Playwright functional & PA tests)
- `npm run test:visual` (Playwright visual regression baselines)
- `npm run test:security` (npm audit security checks with zero high/critical vulnerabilities)
- Offline asset bundle integrity check (30/30 assets with valid SHA256 checksums)
- EAS build profile validation (`development`, `preview` APK, `production` AAB)

## Release Assets

- App icon (`icon.png`), adaptive icon (`android-icon-*.png`), and favicon (`favicon.png`).
- Splash screen (`splash-icon.png`).
- 30 pre-bundled Zen sanctuary backgrounds, logos, and 3D objects with Cloudflare R2 CDN parity.
- Store metadata and promotional copy in English and Simplified Chinese (`docs/store-listing.md`).
- Privacy policy and terms disclosures.
- Pure giving and zero-karma transparency statement.

## Packaging & Configuration

- **Bundle Identifier (iOS)**: `com.foobow.app`
- **Package Name (Android)**: `com.foobow.app`
- **URL Scheme**: `foobow`
- **EAS Profiles**:
  - `development`: Internal distribution with dev client enabled.
  - `preview`: Internal distribution with standalone Android APK generation (`buildType: "apk"`).
  - `production`: Store distribution with `autoIncrement: true` and AAB generation.
- **Store Listing**: Fully documented in `docs/store-listing.md`.
