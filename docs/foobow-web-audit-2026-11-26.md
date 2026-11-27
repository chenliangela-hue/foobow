# Foobow live web audit and action plan

Audit date: November 26, 2026. Scope: public homepage and guest web app at www.foobow.com in Edge at 1280 and 390 pixels.

## Findings and decisions

- Homepage and Today advertise sample participation metrics and the older game lineup. Adopt the local Quiet Worlds entry points and remove unsupported global totals.
- Blessings mixes nine playable rituals with standalone panels, saved wishes, and blessing composition. Retire Wooden Fish, Wish Lamp Workshop, Incense Courtyard, Prayer Wheel, Gratitude Pebble Garden, Loving-Kindness Lanterns, Kindness Quest, and Five Senses Garden as games. Preserve basic breathing, sleep guidance, saved records, and blessing composition as wellness/account workflows. Retire the Sanctuary arcade scenarios and koi previews while keeping location selection and symbolic deeds.
- Map and Deeds already have separate place and activity objects. Make the matching deed the primary map action and keep the games entry in Today and Blessings. Provide recovery from a deed search with no matches.
- Community already has a local preview notice. Preserve the account and moderation boundaries. Profile repeats its progress heading and uses enterprise terminology for personal settings. Clarify the account, activity, and privacy sections.
- All six guest screens fit both tested widths. No uncaught browser script errors were observed in the navigation pass. Live authenticated flows and production persistence were outside this public guest audit.

## Execution order

1. Verify game retirement, redirects, and the three replacement puzzles. [#89](https://github.com/chenliangela-hue/foobow/issues/89)
2. Polish game discovery and instructions, including localized card descriptions and visible input guidance. [#90](https://github.com/chenliangela-hue/foobow/issues/90)
3. Tighten Map and Deeds task flow and no-results recovery. [#91](https://github.com/chenliangela-hue/foobow/issues/91)
4. Simplify Profile progress and privacy wording and verify Community preview boundaries. [#92](https://github.com/chenliangela-hue/foobow/issues/92)
5. Run responsive and keyboard acceptance, review the browser and visual regression results, and compare against a hosted preview before any production promotion. [#93](https://github.com/chenliangela-hue/foobow/issues/93)

GitHub repository issues hold acceptance criteria. Issues #89–#93 are on the existing [Foobow Web Delivery Project](https://github.com/users/chenliangela-hue/projects/2). The saved project-owner login can update the board. The default CLI account can update repository issues and needs separate project access for board updates.
