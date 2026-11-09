# Foobow Together, geographic rankings and game discovery roadmap

Date: 2026-11-09. Status: proposed future work. No public ranking, account/location collection, schema migration or live community counter is enabled by this plan.

Track in the existing [Foobow Web Delivery Project](https://github.com/users/chenliangela-hue/projects/2), alongside [mini-games #5](https://github.com/chenliangela-hue/foobow/issues/5), [backgrounds #46](https://github.com/chenliangela-hue/foobow/issues/46), map #1, community #2, mobile advisories #3 and API release gate #20.

Published epic: [Together/rankings #60](https://github.com/chenliangela-hue/foobow/issues/60). Companion [audio roadmap #73](https://github.com/chenliangela-hue/foobow/issues/73) preserves silent-play score parity.

## 1. Product objective and recommendation

Help people feel, "Other people are doing this with me." Offer optional global, country/territory, province/state/prefecture and city participation rankings, while making collective progress and encouragement the default experience. Scores describe participation under published rules, not human goodness, generosity or therapeutic improvement. People can enjoy every game privately and receive the same gameplay experience without appearing on a board.

There are four different surfaces, each with its own meaning:

1. **Together:** delayed, thresholded counts and shared milestones such as "This week, our community completed 200 quiet moments." Separate symbolic play from self-reported deeds. Never fabricate participants, online status or real-world impact.
2. **Participation boards:** opt-in aliases ranked by bounded eligible credits within a particular lane, period and geographic scope. "How it counts" and "Hide me" are easy to find.
3. **Game discovery:** rank games, not users, by disclosed measures such as most played or player favorites within a region. Keep editorial recommendations and sponsored placement labeled separately.
4. **Personal progress:** private history and personal bests; game-specific skill scores, existing karma, journals and community participation are not interchangeable balances.

Actors: private/anonymous visitor, authenticated participant, player who opts into public rankings, moderator, campaign verifier, content author and operator. Objects: game/deed definition, completion receipt, scoring policy, contribution credit, region node, period membership, public alias, aggregate snapshot, shared goal and moderation adjustment.

Scope: web first, including phone browsers. Native mobile adoption is deferred. New real-time chat, friend graph, prizes, payment rewards, biometric/device fingerprinting, live location and a new multiplayer backend are outside the initial scope.

## 2. Existing baseline and integration constraints

- Product/API docs already mention rankings and quiet mode. Migration 0001 has private profiles, `quiet_ranking_enabled` default true, deed actions, karma events, coarse free-text map region and groups. Reuse those objects; do not create a second user identity or independent karma wallet.
- The inspected API deed path derives points from deed types, but uses a demo-user path in the service and can create a completed action from a request. This is not sufficient proof of production-owned identity or completed game validation. `/rankings` is documented; a production, privacy-filtered geographic projection was not found in the inspected runtime.
- Browser karma is a local presentation counter, with a capped meter plus other additive paths, tap/combo rewards and replayable interactions. It cannot become an authoritative public score or be imported as a historical leaderboard balance.
- Community Mosaic is explicitly illustrative. Production identity, moderation, disclosure thresholds and aggregate API remain gated by #2. New Together counts must meet these gates; no relabeling sample totals as real people.
- A map's virtual destination is not where the player lives. Existing free-text `map_spots.region` is not a normalized country/state/city hierarchy or proof of residence.
- Migration 0002 already defines focus-session completion idempotency and a unique karma source link. Reuse these receipt/ownership patterns for valid focus actions, extending them through reviewed adapters for other games; do not invent a second unrelated completion engine or assume the focus constraint implements cross-game daily caps.
- Mini-game definitions/session/reward contracts are proposed in #5; the ranking adapter must integrate with those contracts and future games rather than scatter increments through click handlers.

First implementation slice: one validated East Lake completion -> one server receipt -> private eligible participation credit -> a synthetic/controlled aggregate preview. Public opt-in aliases and city boards follow identity/privacy/moderation acceptance. Existing local play and karma remain compatible during migration.

## 3. Product references and reuse decisions

Research checked official sources on 2026-11-09. Reference patterns do not establish that Foobow will achieve the same engagement or wellbeing outcomes. Do not copy their brand, content, art or private APIs.

| Reference | Pattern worth adapting | Limits to avoid / decision |
| --- | --- | --- |
| [Forest](https://www.forestapp.cc/) | Plant Together and friends/leaderboard features combine a visual shared world with focus participation | Adapt shared-garden milestones and optional boards; avoid punishment for leaving, time-spent escalation or making competition necessary |
| [Finch](https://help.finchcare.com/hc/en-us/articles/42149821015693-New-User-Guide) | Friends can exchange encouragement and good vibes | Adapt preset encouragement and supportive progress. A separate friendship/contact system is not needed for v1 |
| [Habitica](https://habitica.com/static/features) | Parties, quests and real-life task framing support varied activities | Adapt cooperative, asynchronous goals. Avoid negative consequences for missed days; repository license metadata is NOASSERTION, so no source/art copying is proposed |
| [Strava club eligibility](https://support.strava.com/en-us/articles/15401784-why-aren-t-my-activities-counting-towards-a-club-leaderboard) and [activity privacy](https://support.strava.com/en-us/articles/15401987-how-do-my-activity-privacy-controls-work-on-strava) | Explicit activity categories, privacy exclusions and eligibility explain why a score counts | Adapt explainable eligibility and correction tools. Do not borrow location exposure, speed competition or assume private activities may count publicly |
| [Nakama leaderboards](https://heroiclabs.com/docs/nakama/concepts/leaderboards/), Apache-2.0 | Authoritative score writes, period resets and board/query concepts; repo active November 9 | Reuse documented patterns conceptually. Reject adding another game server for the first slice; current Nest/Postgres can own these rules |
| [PostgreSQL window functions](https://www.postgresql.org/docs/current/functions-window.html) | Aggregates plus `dense_rank` provide ties and regional boards without a new service | Use existing PostgreSQL queries/projections with tests and indexes. Add a separate leaderboard/cache service only if real profiling demonstrates a need |
| [GeoNames](https://www.geonames.org/export/) | Downloadable place IDs/admin hierarchy with attribution requirements | Candidate for a reviewed subset/import, not a per-request location API. Check license, jurisdiction coverage, translations and boundary corrections; no need for a paid map/geocoding provider |

Nakama is a maintained alternative, not an adopted dependency. Redis sorted sets and managed leaderboard services are later scale options, not necessary infrastructure now; they introduce operational, consistency, licensing and provider decisions. Retain PostgreSQL as the source of truth, even if a disposable cache is later added. Version/license/advisory reviews and representative tests are required before any dependency adoption.

## 4. Scoring model: separate lanes with bounded credits

The proposed defaults below need simulation and pilot approval before implementation; they are not a rewrite of current karma. Do not describe them as objective moral values.

| Lane / display | Eligible evidence | Proposed score | Exclusions |
| --- | --- | --- | --- |
| Quiet Play participation | Server-validated eligible game/session completion | 1 credit for first eligible completion of a scoring group per UTC day, maximum 3 credits across this lane per day | Raw taps, repeated completion, faster play, combo multipliers, time spent, paid cosmetics, donations, skipping/partial sessions and unvalidated offline claims |
| Everyday Kindness, self-reported | User explicitly confirms an original real-world quest under the published rule | 1 credit per distinct approved quest group/day, maximum 3 per day; visibly labeled self-reported | Drawing/saving a card, photos as automatic proof, duplicate claims, money amount, unverifiable claims represented as verified impact |
| Verified community actions, later | An approved partner verifies a narrowly defined activity under a campaign contract | Separate campaign-specific board and evidence policy, never merged by arbitrary multipliers with other lanes | Donation amount, unapproved partners, campaign IDs supplied only by a client, inflated attendance or inferred impact |
| Game-specific skill/personal best | Rules for that exact game and version | Private by default; an optional separate skill board requires its own accessible/fair metric | Comparing incomparable game scores or converting dexterity/speed into a good-deed ranking |
| Existing karma and journal | Existing app behavior | Continue private display until a separate compatibility decision | Never backfill public rankings from localStorage or legacy unreviewed points |

Weekly boards are the primary proposed board period: Monday 00:00 UTC to next Monday, with tied scores shown as equal place. Monthly exploration may follow; lifetime progress remains private by default. A maximum weekly participation score is therefore 21 in each of the two initial lanes. No combined cross-lane total is shown on public boards. Replaying a game remains enjoyable after the credit cap and never produces a scolding message.

Scoring groups prevent variant farming: East Lake species/skins share one group; Kyoto location lantern and personal loving-kindness lantern are distinct experiences but daily lane cap still applies. New games require an explicit group/policy mapping before credits are enabled. Retired policies remain immutable with effective dates; mid-period changes require a public correction/version notice and reproducible recomputation, not silent score changes.

Completion validity is a bounded integrity check, not proof that a client is honest or a person uniquely exists. The server owns user identity, session state, policy/version, timestamps, action eligibility and credit amount. Never accept a client-supplied delta/rank/region path. Replay protection, per-policy daily constraints and idempotent completion keys are enforced transactionally. Server checks should not introduce timing barriers or demand motor precision from accessibility users.

Offline completion is provisional and private. Proposed public credit requires a preissued valid server session/receipt and bounded reconciliation window; completely offline local play earns no retrospective public rank by default. The exact window and trusted timestamp rule are acceptance decisions in R02/R05. No guest/demo account is included in public totals; no fabricated migration scores.

## 5. Geography: global, country, province/state and city

Use a versioned administrative hierarchy: world -> country/territory -> admin1 (state/province/prefecture or equivalent) -> city/municipality. Store stable IDs and parent links; show localized names. Some places lack one level or use different structures, so an absent state level can be skipped explicitly. Validate city-parent assignments; do not parse display-name strings or infer a country from language.

Keep two different dimensions:

- **Chosen home community:** a voluntary coarse community selected by the participant. It is self-declared, not verified residence. No GPS, address or IP geolocation needed. A player may choose global-only and never disclose a country/city.
- **Virtual deed destination:** the curated game/map place where a symbolic action occurs. Use only for clearly named destination activity summaries. Playing in a Kyoto scene does not join the Kyoto residents board or imply a real deed in Japan.

The public default for new and existing users remains excluded/quiet. Opting into one geographic detail level does not automatically publish finer levels. Public ranking consent specifies the lane and maximum geographic granularity; global-only aliases are supported. Explicit city-board participation inherently discloses that chosen city; explain it before consent. A private profile and an opt-in public board identity require a scoped alias projection, not exposing profile/email/journal metadata.

Freeze the user's eligible community membership when their first credit in a weekly period is accepted; allow at most one active home path per period. Changes take effect next period; withdrawal can take effect immediately for public visibility. Region edits cannot move the same score through many boards or retroactively harvest regional rewards. Correcting a mistaken region follows an audited operator path. Changes to boundaries use versioned crosswalks; no destructive rename/merge of historical facts.

Each credit contributes once to its leaf scope and once to each ancestor board. Never add world + country + state + city totals together as separate deeds. Geo rollups are non-additive across levels; participants/credits use explicit distinct keys. Country/state/city comparisons can show totals and contribution days per eligible opted-in account with a disclosed denominator; this is not population-adjusted civic virtue. Do not compare small cities to nations or use geographic rank to imply a place is kinder.

Review neutral territory naming, translations, city duplicates, merged municipalities and disputed/unsupported boundaries. Start with a curated subset (for example selected US, Japan and Canada cities), label coverage, and expand without pretending worldwide city coverage is already complete. Global participation remains available when detailed geography is unsupported.

## 6. Together, encouragement and more cooperative play

Primary Community panel: a quiet illustrated shared garden with this week's collective activity, a clearly dated refresh label, category filters from a fixed approved list, and "Join a quiet moment". A finished game can show "Others joined this activity this week" using a valid bucket, rather than a live exact count. The underlying participant measure is eligible accounts, not guaranteed unique human beings; explain it in metric details. Do not invent concurrent people, names or timing.

Initial social interactions are preset, moderated encouragement without direct messages: "Glad you're here", "We cared for this place together", "Thank you for taking a moment". Reactions do not award rank points or send unsolicited notifications. Friendship/chat/group administration is a separate future scope.

| Cooperative mode / game mapping | Shared outcome | Integration requirement |
| --- | --- | --- |
| Lake of Kindness / G01 Koi Haven | Each eligible completed journey contributes a light to a fictional sanctuary | Aggregate confirmed receipts; no fish release or ecological impact claim |
| A Safe Way Together / G02, G16, G19, G20 | Community path slowly illuminates through kindness sessions | Count completions without identifying recipients or showing residence |
| Roots Together / G03, G18 | A shared digital grove reaches weekly growth milestones | Virtual canopy only; no conversion into real trees or carbon claims |
| Constellation of Wishes / G04, G07, G12 | Completed private intentions add abstract lights | Never publish wishes, recipient identities or religious affiliation |
| Pages Shared / G05, G29 | Digital reading nook gradually fills with book silhouettes | Original/licensed text; no claim of real donated books |
| A Little Care / G17, G21-G23 | A virtual shelter/community room becomes warmer | Fictional outcome; real actions remain self-reported unless verified |
| A Cleaner Shore / G15 | A cooperative artwork reveals a clean shoreline | No kg-plastic conversion without an independent verified campaign |
| Moments in Company / G06-G12, G14, G24-G28 | A garden of anonymous abstract marks | Count eligible quiet-play participation without implying a particular mood or health result; G13 quest confirmations remain in the separate self-reported lane |

These are cooperative modes for the 30-game roadmap, not eight duplicate standalone games. For discovery-only G21-G30, keep modes as concept tests until those games are promoted. A user can contribute with their public alias hidden only if they separately choose eligible aggregate sharing; quiet-ranking preference alone never authorizes aggregate use of private sessions. Record separate consent for newly shared eligible actions. Unshared private/history actions stay excluded even if someone later opts into a board; no retroactive sharing by default.

## 7. Game popularity and discovery ranking

Provide separate "Most played this week", "Community favorites", and editorial "Try something gentle" shelves. Scope can be world/country/admin1/city where disclosure thresholds permit. Mark samples/editorial seeds explicitly; early launch can use editorial recommendations rather than fake popularity.

Most played uses distinct eligible, consented accounts completing a game at most once per period for the popularity numerator. Show its definition and refresh time; do not call it best/highest-quality. Favorites use one opt-in explicit vote per account/game, with undo and abuse handling. Small/new-game samples receive no fabricated rating; reserve a labeled discovery slot to reduce incumbency bias. Exposure-normalized completion/retention metrics may guide private curation, but do not rank using raw time spent, paid placement or clickbait.

Different genres need different evaluation; a 30-second chime is not worse than a three-minute cleanup. Keep personal recommendations deterministic and preference-based initially, without importing mood/journal data into public ranking. No new machine-learning recommender provider is needed.

## 8. Privacy, integrity and moderation gates

Proposed disclosure thresholds: at least 20 eligible opted-in accounts for an aggregate cell, and at least 50 eligible explicit board opt-ins before named/alias city boards are considered. These are initial thresholds for review, not a formal anonymity guarantee. Aliases, sparse cohorts, differencing and repeated queries can still identify people. Publish only approved period/category/scope combinations; do not permit arbitrary intersecting filters, exact timestamps, near-real-time participant deltas, or exact small-cell denominators. Round/bucket public counts after suppression, and suppress complementary/parent-child cells when subtraction would reveal a small group.

Use delayed snapshots (proposed hourly with a displayed time), bounded top-N alias results and the authenticated user's own opt-in rank; no complete public roster. Snapshot publication must respect recent privacy revocation and moderation exclusions. Withdrawn users disappear from public results immediately through query-time eligibility/revocation checks, even before aggregate rebuild completes. Do not let a stale cache bypass consent; invalidate affected boards. Legal deletion and anonymous aggregate retention policy require review before rollout.

Restrict API access by owned identity, not request body user_id. Server-authoritative scoring, idempotency, replay/cap enforcement, rate limits, bot/restricted-account exclusion, manual review and appeal handle abuse. No promise of eliminating Sybil accounts. Never collect identity documents, precise residence or invasive device fingerprints simply to rank symbolic games. Defer prizes and cash stakes. Age/child participation policy is unresolved; no public identifiable youth board until ownership/age safeguards are approved.

All test/demo/seed activity is excluded from live counters. Every result includes period, lane/policy, metric definition, eligible scope, refresh status and whether it is illustrative. Donations and subscriptions confer no score/multiplier/access advantage. Moderated aliases, revoke/correction records and operator audit logs are required before public boards.

## 9. Backend, data and compatibility plan

Retain NestJS, Prisma and PostgreSQL, with pure TypeScript scoring policies and tested adapters. No new provider/Redis/Nakama service in v1. Existing client karma is never the source of truth. Proposed new objects, finalized only after reading all current migrations and Prisma relations:

| Object | Owner / lifecycle and constraints |
| --- | --- |
| region catalog | Public versioned IDs, parent/type/code/locale names/source/attribution; indexed parent/type; validated acyclic tree and supported coverage |
| ranking preference / membership | Owned by user; lane/public-alias/aggregate consent and chosen maximum detail; effective period, geography version, withdrawal; no coordinates; one eligible home path per user/period |
| scoring policy registry | Versioned game/deed group -> lane/validation/caps; immutable effective periods and allowlists; content author cannot award arbitrary client deltas |
| eligible contribution ledger | Owned server facts linking validated receipt and policy/version/lane, UTC accounting day, membership snapshot, eligibility/revocation; unique receipt credit and capped daily group keys in a transaction |
| adjustment / moderation log | Operator-only reason code/audited actor; compensating adjustments or revocations, no destructive rewriting of credit history; no private reflection in reasons |
| period/region/game projections | Rebuildable derived scores/counts, eligibility version and publication time; unique projection keys, indexed scope/lane/period/score and user; consent changes invalidate caches |

Map shared catalog categories deliberately: current SQL categories and web discovery categories are not identical. Use reviewed stable mapping, including future games; don't silently reinterpret a donation category as scoreable. Preserve existing public IDs, API envelopes and progress. A future `GameDefinition` adds `scoringPolicyId`, `scoringGroupId`, `completionAdapterVersion`, `participationMode`, and compatible `audioSceneId`; these fields are proposed contracts, not runtime changes here.

Proposed API evolution: authenticated start/complete session routes validate completion; existing deed-action routes remain compatible but cannot automatically bypass new validation. `GET /rankings` returns lane/scope/period/snapshot/ties and approved alias rows; separate `/community/activity-summary` and `/games/discovery` return thresholded projections; owned preference endpoints handle opt-in/withdrawal. Use existing pagination/error conventions, bounded filters and ETags; no raw ledger/public user history endpoint. Update OpenAPI in the implementation change, not by pretending these routes already exist.

Transactionally record completion and credit, then derive projections with an idempotent watermark/rebuild job. Use a DB outbox if asynchronous delivery requires it; do not introduce a broker speculatively. Recompute from ledger in test/staging to verify incremental totals, ties and revocations. Use `dense_rank` for equal scores; deterministic private ordering does not imply a better rank for earlier/faster completion. Roll up distinct events across geographic paths without double counting.

Retention proposal: session validation facts sufficient for integrity review for 90 days; period ledger/adjustment records for 12 months; short-lived API cache minutes; old public snapshots retired on schedule and consent withdrawal. Final retention, deletion/anonymization and moderation audit requirements must be approved before migrations. No private historical action is published/backfilled without explicit eligible consent and validation. Schema changes are forward migrations; restore/rebuild projections or disable flags on failure, not delete source history.

## 10. Validation, rollout and task sequence

Required tests: table-driven scoring across all existing/future registered games; first/duplicate/replay/partial/skip/offline completions; cross-user forged receipt/score/region; concurrent cap races; UTC/week boundaries; rule changes and ties; city-parent validation; regional move timing; a consent truth table covering private/unshared history, quiet aliases, separately authorized new aggregate sharing and revoked/restricted/deleted/demo exclusions; sparse-cell/complementary suppression; cache invalidation; deterministic full rebuild versus incremental totals; DB authorization/constraints and rollback exercise.

UX/QA: six locales; light/dark backgrounds from #46; loading/empty/error/stale/hidden/suppressed states; keyboard/focus/screen reader, 200% zoom and phone/desktop layouts; no public data leakage in HTML/exports/analytics; no exact location or journal data. Audio mute/disabled sound has zero effect on eligibility. Record actual API/DB/browser/performance evidence; automated tests alone cannot validate comfort or privacy guarantees.

Pilot: 12-20 consented participants comparing a cooperative-only view with optional boards; include participants with low scores and accessibility users. Measure rule comprehension, sense of belonging, voluntary replay and pressure/discomfort, with optional private feedback. Proposed targets: >=80% understand what counts and how to leave, >=75% find Together supportive, no unresolved privacy or coercion complaint. Small pilot data is directional, not proof of a population effect. Stop public rollout for private-data exposure, consent failure or score inflation; do not improve retention by pressuring users.

Proposed release stages: private/synthetic proof -> genuine aggregate-only global pilot -> country/admin1 coverage -> opt-in alias boards where threshold/consent gates pass -> selected city pilot -> expansion. Feature flags separately control contribution collection, public aggregates, alias boards, regional detail and game discovery. Keep illustrative UI clearly labeled until real eligible data exists. API dependency gate #20 and community #2 remain release prerequisites.

| Task ID | Work / responsible role | Depends on | Acceptance / state |
| --- | --- | --- | --- |
| RK01 | Baseline current scores, identity, routes and consent / product + engineering | None | Inventory all reward paths, demo versus owned identity and local/cloud data; document existing contracts and reference decisions; Todo |
| RK02 | Scoring rules and 30-game eligibility registry / product + engineering | RK01, MG-F01/#6 | Simulate proposed lanes/caps/UTC/ties/farming and offline rules; explicit mapping/compatibility and non-moral copy; Todo |
| RK03 | Geographic hierarchy and self-selected membership contract / data + UX | RK01 | Reviewed attributed region subset, stable parent IDs, localized country/admin1/city labels, coverage and movement rules; Todo |
| RK04 | Production identity, scoped consent and privacy gates / engineering + review | RK01, community #2 | Owned authenticated writes, quiet/default exclusion, aliases and aggregate consent separated, sparse/child-policy decisions, withdrawal; Todo, gated |
| RK05 | Server completion and participation ledger integration / engineering | RK02, RK04, MG-F05/#25 | Idempotent validated credits, transactional caps, replay/forgery negatives, compatible karma and audited changes; forward schema only; Todo |
| RK06 | Regional projections, ranking APIs and rebuild / engineering | RK03, RK05 | Four-level rollups/ties/periods, suppression, fixed filters, incremental/full parity, auth/pagination/cache and consent invalidation; Todo |
| RK07 | Optional geographic boards and private progress UI / UX + engineering | RK06 | Global/country/admin1/city navigation where eligible, explanation/opt-out, equal ties, empty/stale/suppressed states and accessibility; Todo |
| RK08 | Together cooperative modes and game discovery / UX + engineering | RK06, community #2 | Truthful shared progress/encouragement, eight cooperative mode mappings, separate game popularity, no invented users or exposed private data; Todo |
| RK09 | Moderation, abuse handling and correction tools / engineering + operations | RK05, RK06 | Alias moderation, exclusion, audited adjustments/appeals, rate limits and revocation; no paid advantage; Todo |
| RK10 | Privacy/integrity/accessibility QA and player pilot / QA + product | RK07, RK08, RK09 | Full validation above, actual devices/API/DB and comfort feedback, blocking defects fixed; Todo |
| RK11 | Staged web launch and operational acceptance / operations + product | RK10, API gate #20 | Flags, cohort rollout, disclosure/retention ownership, rebuild/rollback and live verification; no release inferred from plan; Todo |
| RK12 | Deferred mobile ranking/Together adapter / mobile engineering | RK11, MG-F08/#44, mobile gate #3 | After web acceptance: owned API/consent parity, no local score trust, device/AT/withdrawal tests; Todo, deferred |

RK11 also blocks the existing native mobile spike #44, preserving the web-first priority. Indicative engineering/design/QA range: baseline/rules/geography 2-3 weeks, identity/ledger 2-4, projections/UI/moderation 3-5, pilot/release 2-3; 9-15 weeks before overlap and external identity/privacy inputs. Re-estimate after RK02; no new mobile or partner-verification delivery is included in this web range.

## 11. Proposed ADR 005 and tracking

Proposed decision: separate public participation from private legacy karma and game skill; optional public ranks plus cooperation-first Together; use existing Postgres-backed server-authoritative ledger/projections and a curated geographic hierarchy. Reject ranking raw client totals, donation-weighted virtue, inferred residence and a new game server without a demonstrated need. Benefits: comprehensible fairer caps, compatibility, auditability and truthful community signals. Costs: identity/consent/moderation complexity, weaker participation coverage while opt-in cohorts are small, and imperfect anti-abuse; keep unsupported boards hidden rather than inventing activity.

All scoring thresholds, retention and rollout defaults are proposals to validate in named tasks. No unresolved choice blocks publishing the plan. All implementation tasks start Todo.

| Task | Issue | Task | Issue |
| --- | --- | --- | --- |
| RK01 Baseline | [#61](https://github.com/chenliangela-hue/foobow/issues/61) | RK02 Scoring registry | [#62](https://github.com/chenliangela-hue/foobow/issues/62) |
| RK03 Geography | [#63](https://github.com/chenliangela-hue/foobow/issues/63) | RK04 Identity/consent | [#64](https://github.com/chenliangela-hue/foobow/issues/64) |
| RK05 Contribution ledger | [#65](https://github.com/chenliangela-hue/foobow/issues/65) | RK06 Projections/API | [#66](https://github.com/chenliangela-hue/foobow/issues/66) |
| RK07 Ranking UI | [#67](https://github.com/chenliangela-hue/foobow/issues/67) | RK08 Together/discovery | [#68](https://github.com/chenliangela-hue/foobow/issues/68) |
| RK09 Moderation | [#69](https://github.com/chenliangela-hue/foobow/issues/69) | RK10 QA/pilot | [#70](https://github.com/chenliangela-hue/foobow/issues/70) |
| RK11 Web release | [#71](https://github.com/chenliangela-hue/foobow/issues/71) | RK12 Deferred mobile | [#72](https://github.com/chenliangela-hue/foobow/issues/72) |
