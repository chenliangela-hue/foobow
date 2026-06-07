# Foobow Localization Workflow

## Objective

Foobow must feel natural in English and Simplified Chinese at MVP, with a structure that can expand to more languages without rewriting UI copy or safety text.

## MVP Locales

- `en`: default English.
- `zh-Hans`: Simplified Chinese for the original concept audience and culturally specific deed examples.

## Content Principles

- Keep symbolic comfort language warm but avoid claims that users can buy luck, virtue, forgiveness, or guaranteed karma.
- Translate concepts, not just words. Some Chinese cultural examples such as `放生` need ecological safety context in English.
- Do not use guilt, shame, or pressure in donation, ad, or subscription copy.
- Keep moderation/reporting language direct and clear in every locale.

## Workflow

- Store UI strings as stable keys grouped by screen and product object.
- Require English source copy and Simplified Chinese translation before a feature is marked release-ready.
- Review donation, disaster, hospital, school, and remembrance copy separately for cultural and legal sensitivity.
- Run pseudo-length review for button labels, tab labels, badges, and cards before visual signoff.
- Keep accessibility labels translated alongside visible labels.

## Required String Groups

- Navigation: Today, Map, Deeds, Community, Profile.
- Daily ritual: mood options, recommended deed, reflection prompt.
- Deed actions: virtual release, crossing assistance, feeding, cleanup, planting, lighting, blessing.
- Social: blessing wall, reactions, report/block states.
- Profile: privacy mode, export data, delete account, donation history.
- Monetization: donation prompt, subscription prompt, ad-free copy, transparency disclaimer.
- Admin/moderation: report status, review action, policy reason.

## QA Requirements

- Verify `html.lang` or native app locale state matches the selected language.
- Check all tab labels and primary buttons at mobile widths.
- Confirm WCAG contrast after any localized copy changes.
- Confirm donation copy remains transparent and does not imply users can purchase karma.

## Open Decisions

- Translation owner and review process.
- Whether Traditional Chinese is required for first release.
- Whether locale is account-synced or device-local before login.
