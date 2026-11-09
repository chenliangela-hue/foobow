# Foobow background collections and automatic rotation roadmap

Date: 2026-11-09. Status: proposed future implementation; no images generated, providers provisioned, schedules activated, runtime changed, or spending authorized by this plan.

Execution tracker: [Foobow Web Delivery](https://github.com/users/chenliangela-hue/projects/2). Companion program: [Little Worlds of Kindness mini-games #5](https://github.com/chenliangela-hue/foobow/issues/5). Use the same art direction, accessibility rules, and web-first priority.

Companion [audio roadmap #73](https://github.com/chenliangela-hue/foobow/issues/73) can suggest a music family for a collection, but scenery rotation never resets mute or restarts music automatically. [Together/rankings #60](https://github.com/chenliangela-hue/foobow/issues/60) uses the same readable surfaces; its web release is an additional native-mobile gate through #44.

## 1. Desired experience and current baseline

Create a library of coordinated illustrated background collections. A collection provides a distinct but related scene for every supported page and a matched light/dark pair for each scene. Users can keep one collection, browse alternatives, or opt into a periodic change. The interface remains recognizably Foobow across pages, seasons, devices and appearance modes.

Actors: visitor, returning player, keyboard/screen-reader user, artist/AI operator, reviewer, asset publisher, and release operator. Objects: collection, page scene, mode/crop rendition, provenance record, approved release manifest, rotation schedule, local preference, and cached image.

Confirmed source baseline:

- `prototype/app/index.html` declares paired backgrounds for Today, Blessings, Map, Deeds, Community and Profile. `prototype/app/styles.css` switches light/dark backdrop groups and animates page layers.
- `prototype/landing.css` currently uses the fixed night-lake hero and dark palette. A landing-light asset exists, but the inspected landing code does not expose the app's complete light/dark theme integration. Adding landing mode parity is a task, not assumed existing behavior.
- `setupCdnAssetPipeline()` in `prototype/app/app.js` rewrites app backdrop URLs from a configured CDN base. It does not provide a reviewed pack catalog, image decoding/race handling, scheduler, selector or robust asset fallback. The current local-storage CDN override is not a suitable production URL trust boundary.
- `scripts/sync-assets-r2.mjs` computes checksums and writes the legacy manifest. Its configured upload branch only logs an endpoint; it does not upload or verify objects. The default S3 API endpoint must not be assumed to be a working public/cacheable delivery URL.
- `prototype/assets/foobow/asset-manifest.json` is an existing asset inventory, not a theme policy. Do not replace its shape or break mobile asset-parity/catalog checks without a compatibility plan.
- Existing media policy keeps AI drafts private and approved assets public. SQL migration 0003 restricts `media_assets.bucket` to `public-assets`, `user-uploads`, `ai-generated`; `ai_generations.kind` is for textual product flows and has no background-image job kind. Do not assume arbitrary R2 bucket names or image jobs already fit those tables. The table's default moderation value `visible` is not evidence of a theme review; require an approval receipt tied to accepted hashes before release eligibility.

Target: one small, versioned theme catalog plus a shared resolver used by landing and app routes, optional approved-asset CDN delivery, a quiet appearance picker, and an offline-safe baseline. Native mobile implementation remains deferred until the web backlog and the game roadmap's web/security gates are complete. BG12 also becomes a blocking prerequisite of the existing mobile spike #44, so neither program bypasses the remaining web scope.

## 2. Art direction and page mapping

Reuse the mini-game art bible task [MG-F02/#7](https://github.com/chenliangela-hue/foobow/issues/7): warm painted 2.5D storybook worlds; jade, linen and amber; gentle cartoon silhouettes; consistent brush texture, scale, perspective, shadows and lighting. Backgrounds are scenery supporting the UI, with fewer details and lower contrast behind text. No recognizable artist imitation, copied franchise imagery, baked-in labels, watermarks, or private photos.

| Page key | Scene role | Composition and content constraints |
| --- | --- | --- |
| landing | A welcoming sanctuary vista | Clear hero text/CTA safe zone, memorable edge scenery, quiet center and legible mobile crop; image never contains the headline |
| today | A morning courtyard or garden | Uncluttered space behind daily check-in and thought; recognizably part of the selected collection |
| blessings | A lantern pavilion or sheltered place | Warm, optional culturally reviewed motifs; no implied promises or religious participation requirement |
| map | A travel overlook or quiet cartographic frame | Subdued decorative edges; do not obscure map labels/pins or replace actual map tiles with generated geography |
| deeds | A friendly path with visible signs of care | Plants, shared shelter or community scenes; no suffering, guilt, or donation pressure |
| community | A shared garden or town square | Warm gathering atmosphere without depicting actual user activity or implying real aggregate participation |
| profile | A private alcove or reading nook | Calm, personal and uncluttered; scenery must not imply knowledge of the player's identity or home |

Auth/error/checkout/admin surfaces inherit readable neutral tokens or a curated baseline, not a busy rotating hero. Inventory every public route in BG01 and record exclusions explicitly. For additional landing/campaign routes, add page keys and reviewed scenes before enrollment.

Game worlds and game foreground sprites remain bound to their game definitions. Do not put a random landscape under gameplay geometry. Selected collections can influence an outer frame or approved compatible game skin only after the corresponding #5 game task passes scene/interaction validation. Lock scenery during active rituals/games.

Light and dark are two intentional paintings of the same place: preserve camera, major silhouettes, safe zones, palette family and page identity. Change light sources, sky, reflections and atmosphere; dark mode is not a brightness filter, and light mode is not an overexposed dark image. The image pair and UI tokens must be reviewed together. Never darken foreground controls as part of image processing.

## 3. Collection library and staged production

Propose twelve collection directions; validate the first three before mass generation. Collections are fictional illustrations inspired by natural/cultural settings, not photographs or claims about real landmarks.

| Collection | Light atmosphere | Matched dark atmosphere | Production stage |
| --- | --- | --- | --- |
| Lotus Lake | Soft lake reflections, lotus and jade reeds | Moonlit teal water, restrained lantern light | Pilot A; closest to current brand |
| Bamboo Courtyard | Dappled bamboo shade and warm stone | Indigo bamboo silhouettes, warm doorway | Pilot B |
| Cloud Mountain | Cream mist and green terraces | Blue mountain layers beneath stars | Pilot C |
| Rainy Tea Garden | Sheltered veranda, gentle rain | Lamplit veranda, rain reflections | Expansion |
| Cherry Blossom Walk | Pale blossoms around a quiet path | Plum-blue dusk, softly lit petals | Expansion, cultural review |
| Autumn Neighbourhood | Golden leaves, friendly brick street | Warm windows and amber streetlights | Expansion |
| Forest Creek | Ferns, moss and a small stream | Deep emerald canopy, subtle fireflies | Expansion |
| Coastal Kindness | Clean cove, grass and soft sea light | Navy water and a distant lighthouse | Expansion |
| Wildflower Meadow | Open sky and diverse flowers | Twilight meadow, low-glare stars | Expansion |
| Community Garden | Planters, paths and shared benches | Quiet garden paths with warm lights | Expansion |
| Reading Retreat | Wood, paper, plants and books | Cozy reading lamp, deep walnut tones | Expansion |
| Winter Warmth | Muted snow beyond a sheltered window | Warm interior against a blue winter sky | Expansion; optional seasonal choice |

A complete collection has 7 page scenes x 2 appearance modes = 14 approved master compositions, plus reviewed landscape/square/portrait treatments. Three pilot collections therefore require 42 approved compositions before all pages are covered. With three crop families and WebP/AVIF encodings, a baseline deliverable can reach 252 files, excluding thumbnails, additional resolutions and originals. Track actual counts and bytes rather than committing to generate all twelve immediately.

Generate one approved style anchor and page storyboard first, then page compositions, then paired dark/light edits and mobile outpainting/crop review. Do not generate every image independently from an unrelated prompt or assume the generator supports a reproducible seed. If reproducible seeds/reference conditioning are supported, record them; otherwise preserve exact accepted outputs and hashes.

Suggested source composition: approximately 3072 px wide or provider-supported equivalent, with mobile-specific outpainting when cropping loses the scene. Delivery renditions are tuned to supported viewports, not uploaded at source resolution by default. A typical first pass uses desktop landscape, tablet/square and phone portrait; add smaller srcset widths only when profiling justifies them. Neutral JPEG/solid fallback remains available if newer image formats fail on the supported matrix.

## 4. Selection and rotation rules

Keep two independent preferences: appearance (`system`, `light`, `dark`) and scenery (`fixed` or `automatic`, collection ID, rotation cadence). Migration preserves any valid existing app light/dark choice. For new visitors propose system appearance and automatic daily collection. The daily default is a product proposal to validate in BG09, not a change made by this plan.

| Choice | Behavior | Persistence / boundary |
| --- | --- | --- |
| Keep this collection | Pin one approved collection for all enrolled pages | Versioned local preference shared between `/` and `/app/` on the same origin; no account required |
| Automatic daily | Follow the published daily UTC calendar | One collection per UTC date; apply at a safe boundary, not suddenly during play |
| Automatic weekly | Follow a published Monday-00:00-UTC weekly calendar | No locale/timezone inference; expose readable cadence description |
| New visit | Choose from the eligible pool once per visit | Visit defined by sessionStorage lifetime, stable across route changes/reloads; background tabs/new tabs may have independent visits |
| Surprise me | Explicitly select another eligible collection | User-triggered action with visible result; fixed versus automatic choice remains explicit |
| Simple background | Use bundled low-detail mode-specific fallback | Available even offline; no album or identity data needed |

Selection precedence: explicit simple/fixed preference -> chosen automatic mode -> published baseline -> bundled mode-correct fallback -> solid color. The appearance preference selects the paired image inside the same collection; it does not select a new collection. System appearance uses media-query changes only when system is selected. Landing and app must not overwrite each other's settings on initialization.

For daily/weekly rotation, publish date slots in advance referencing only approved complete collections. This is an automatic client selection from an approved calendar; no cron service is needed to rotate already published art. Validate non-overlapping slots, UTC parsing, collection availability windows, gaps and clock extremes. A new catalog release must preserve already published active slots unless a revocation requires replacement. Never use array index modulo a changing pool, which can unexpectedly reshuffle every user's collection.

For new-visit selection use a bounded approved list and ordinary random selection once, not browser fingerprinting. When there is more than one eligible collection, avoid the previous choice where storage is available. Empty/one-item pools, removed collections and disabled storage must still work. Persist only preference IDs and minimal last-choice data, not a browsing history.

Apply a scheduled change on next navigation, foreground return or after the active ritual/modal/form finishes. No frequent background slideshow or high-rate timer by default. Revalidate the small manifest at app/landing entry and, for long-lived visible sessions, at a bounded interval (proposed 15 minutes) with backoff; do not fetch it per animation frame or on every render. Offline users keep an approved last-known manifest briefly within the documented validity policy, then use the bundled baseline; never claim immediate offline revocation.

When an image loads: resolve -> fetch only the needed rendition -> decode -> confirm request is still current -> swap. Old requests cannot overwrite a later page/mode/collection selection. Keep the previous valid image or solid mode-correct backdrop until the new image is ready. Optional 300-500 ms opacity blend only; no zoom/parallax in reduced motion, and no flash of a bright picture during dark startup. A mode change applies safe UI tokens immediately while its image loads. User input/focus never waits for an image.

## 5. AI-assisted content pipeline and publication

The automatic part of the first implementation is rotation among approved images. The generation/import/processing pipeline can be automated separately; new AI output stays a candidate until reviewed. This matches the existing private-AI-draft media policy.

`brief + approved style references -> generate/import candidates -> private staging -> provenance + automated checks -> human art/crop/readability review -> processed approved renditions -> bucket upload + public readback -> immutable release manifest -> active catalog pointer -> scheduled/user selection`

1. Brief records collection/page/mode/crop, safe zones, style version, palette, cultural/seasonal notes and exclusions. Prompts contain no user reflections, identity, private photos or secrets.
2. Use the available authorized image-generation workflow for operator-led batches first. Save output IDs/model version, prompt/reference provenance, supported generation settings, output hashes, rights/usage review and AI-origin metadata. The plan does not select a new paid model/API or assume a subscription authorizes unattended API use.
3. A future scheduled generation job requires an approved provider, credentials in the existing secret mechanism, an explicit budget, queue/concurrency limit, bounded retry and output deduplication, and a review inbox. Schedule it to propose candidates; it cannot self-approve public publication. No recurring generation automation is created in this planning task.
4. Validate file signature/MIME/extension, bounded decoded pixels/bytes, successful decode, dimensions, crop, color space and metadata. Strip location/private EXIF, re-encode delivered files, reject unexpected animation/SVG/executable types, and quarantine malformed/oversized inputs. A native image library must be patched and isolated with processing resource limits.
5. Visual approval checks style, perspective, artifacts, text/logo intrusion, cultural context and safe zones on real UI overlays. Automated saliency/luminance/OCR checks can flag candidates; they cannot approve subjective style or establish accessibility. Generate a contact sheet showing all seven pages in both modes and desktop/phone crops for each candidate collection.
6. Build responsive WebP/AVIF and thumbnails, sRGB metadata and hashes. Keep heavy originals/private provenance out of the public catalog. Register accepted assets and approval evidence using the existing media conventions where compatible; see the storage constraint below.
7. Upload approved immutable objects, verify public GET status/MIME/bytes/hash through the delivery host, and publish a versioned manifest only after every referenced object is available. Promote the active pointer last. Interrupted uploads cannot make incomplete collections eligible.
8. Refresh/revoke through a reviewed manifest release. Roll back the pointer without deleting existing image objects. Draft retention and garbage collection are proposed policies to approve, not automatic deletion in this scope.

## 6. Storage, manifest, ownership and caching

Prefer existing infrastructure. Pilot drafts can remain in local private operator storage; cloud draft staging can use existing private `ai-generated` storage if it fits the original size/type limits. Approved public delivery should evaluate the existing R2 configuration/custom domain against the already-supported Supabase `public-assets` path in BG06. Choose one canonical public delivery origin for this feature; do not duplicate originals or public releases across clouds without a need. A private-looking prefix inside a public bucket is not private staging.

Proposed immutable key layout: `themes/<collectionId>/<revision>/<page>/<light|dark>/<crop>-<width>-<contentHash>.<format>`. IDs/keys are validated, not concatenated from arbitrary user input. Public catalog contains relative object keys, allowlisted origin, hashes, dimensions, byte counts, focal/safe-zone metadata, page/mode compatibility and localized display-name keys. It cannot contain storage credentials, draft prompts, private object URLs or executable styles.

Example contract shape (illustrative, not a deployed schema):

```json
{
  "schemaVersion": 1,
  "releaseId": "themes-2026-11-r1",
  "styleVersion": "little-worlds-v1",
  "baselineCollectionId": "lotus-lake",
  "allowedPages": ["landing", "today", "blessings", "map", "deeds", "community", "profile"],
  "collections": [{"id":"lotus-lake", "revision":"r1", "status":"approved", "displayNameKey":"collectionLotus", "sceneIndexKey":"themes/lotus-lake/r1/scenes.json"}],
  "rotation": {"timeZone":"UTC", "daily":[{"startsAt":"2026-12-01T00:00:00Z", "endsAt":"2026-12-02T00:00:00Z", "collectionId":"lotus-lake"}], "weekly":[]}
}
```

The example date is a placeholder, not a scheduled launch. The scene index must define all required page/mode pairs and available renditions, hashes/bytes/sizes/formats, focal point and safe-zone bounds. Release validation resolves every index and checks completeness before promotion. Runtime validates bounds and shape of the catalog/index; a missing dark variant falls back safely rather than selecting the light variant in dark mode.

Proposed preference key `foobow.appearance.v1`: schema version, appearance mode, scenery mode, selected collection ID, cadence, and bounded recent choice. Final naming and migration follow BG01's inventory. Preference is device-local; clear/reset participates in existing local-data deletion. No cookies/account required for v1. Cross-account synchronization is future work requiring identity ownership and authorization; never include the whole app state/journal in the theme preference.

A review-controlled static manifest and private provenance ledger are enough for the first slice; no database migration is required. If production admin/SQL registration is introduced, read applied migration 0003 and Prisma schema first: current bucket checks cannot represent an arbitrary R2 delivery bucket, and current AI kinds cannot record image jobs. Reuse an explicit storage-provider/object interface with a forward migration or keep authoritative asset records in the compatible existing provider. Specify editor ownership, access roles, audit trail, uniqueness, retention and rollback before schema implementation. Never rewrite 0003 or insert fake supported bucket/kind values.

Delivery plan:

- A verified custom asset domain is the preferred R2 public/cache path. The S3 API endpoint is an API origin; `r2.dev` is for development, not the production default. Confirm configured DNS/TLS/CORS and cache behavior before claiming CDN readiness. [Cloudflare public bucket guidance](https://developers.cloudflare.com/r2/buckets/public-buckets/).
- Hashed image URLs: long immutable cache (proposed one year). Immutable versioned manifests may also cache long. Mutable active pointer: short cache (proposed max-age 60s with revalidation), explicit release ID, and bounded application refresh. Do not overwrite long-cached image bytes at the same key.
- Reuse normal browser cache and a bundled fallback first. Do not add a service worker just for rotation; it introduces cache lifecycle complexity. An existing/future PWA may pin a bounded last-known release with documented eviction and revocation semantics.
- Fetch one active page/mode rendition, lazily load gallery thumbnails, and optionally prefetch the paired mode after idle only when data-saving/network policy permits. Do not preload 12 collections or all 14 page/mode images on entry. Cap concurrent image work (proposed two) and retain at most the current/next decoded backdrop.
- Public asset CORS is not an authorization boundary. Browser access is read-only; upload/review/publish credentials are server/operator-only and least privilege. Use fixed origin allowlists and escaped/validated keys; do not trust localStorage/remote JSON as arbitrary CSS URLs.

## 7. Reuse-first technology decision

Research snapshot 2026-11-09; versions are observations, not upgrades. No new dependency or provider is added by this planning change. Recheck maintenance/security/compatibility and preserve notices before actual reuse.

| Candidate | Strengths / current evidence | Risks / assumptions to avoid | Recommendation |
| --- | --- | --- | --- |
| Existing manifest, paired images, CSS layers and CDN config | Fits current app, already tested page/mode behavior and asset checksums | Current uploader does not upload; landing theme parity and robust resolver absent; untrusted CDN override and dual-group loading need review | Adapt. Add a separate versioned theme catalog/selector and preserve legacy asset manifest compatibility |
| [sharp](https://github.com/lovell/sharp), 0.35.5, Apache-2.0 | Sept 27 release; active repo/closed issues in November; well-documented resize/crop/WebP/AVIF pipeline with tests. [Output formats](https://sharp.pixelplumbing.com/api-output/) | Native libvips/platform builds and transitive license obligations, malformed-file resource usage; test Windows and Linux clean installs | Preferred offline/CI image processor after dependency review. No handwritten codec or resize engine; keep image editing/generation in the authorized visual workflow |
| [rclone](https://github.com/rclone/rclone), 1.76.0, MIT | Nov 6 release; active issue handling; S3/R2 support with [Cloudflare integration docs](https://developers.cloudflare.com/r2/examples/rclone/) | Destructive `sync` can delete targets; config can contain secrets; provider checksum/ETag semantics differ | Prefer bounded `copy`/upload of approved artifacts plus explicit GET/hash verification for the first operator publishing path. No recursive remote sync/delete |
| [AWS SDK S3 client](https://github.com/aws/aws-sdk-js-v3), registry 3.1164.0, Apache-2.0 | Typed object upload/head/metadata APIs; supported R2 S3 adapter route | More dependencies/credential/retry code; provider feature compatibility, bundle boundary and resolved advisory tree need review | Alternative only if application-managed publishing becomes necessary. Keep outside browser bundles; do not add both SDK and another uploader without need |
| Browser HTML/CSS/JS, image decode, matchMedia, storage | No new UI runtime; matches existing code; native responsive image and opacity controls | Cache, decoding races, storage denial, CSP, forced colors and browser variants still need tests | Use for selection/resolver/gallery first; no React rewrite, slideshow package or WebGL renderer required |
| Cloudflare Images/paid transforms or a separate CMS | Can offer image transformation/editor workflows | Additional provider, cost and operational ownership; current scale can prebuild images | Defer unless measured workflow/traffic needs justify it. Storage is not free merely because bandwidth is unmetered; track storage/request/processing costs |

Closed upstream issues are evidence of activity, not proof of quality; implementation review includes relevant open image-decoder/platform/upload regressions, resolved dependency audit, example invocation and tests. sharp has transitive/native license notices beyond its top-level Apache license. Existing hand-authored/reviewed CSS overlays remain preferable to AI-generated text panels.

## 8. Validation and acceptance

| Dimension | Required validation and proposed target |
| --- | --- |
| Visual consistency | Contact sheets across all seven pages, both modes and phone/desktop; same collection recognizable, focal objects/safe zones preserved; two-reviewer style rubric >=4/5 per dimension; reject critical artifacts or inconsistent pairings |
| Readability/accessibility | All enrolled UI text remains >=4.5:1 normal / >=3:1 large, UI state >=3:1 where applicable. Check actual composited image/overlays, loading/transition frames and page scroll, all six locales, keyboard/focus, 200% zoom, 320px reflow, reduced motion, forced colors and NVDA/VoiceOver. Image luminance averages alone cannot establish contrast |
| Selection | Fixed choice survives app/landing navigation/reload, mode change keeps collection ID, system mode respects OS change, manual wins over schedule, migrated theme stays intact, clear/reset works. Invalid/removed ID/storage denial has a readable fallback |
| Rotation | Daily and Monday-week UTC boundaries, leap day/DST-independent dates, slots/gaps/overlap/eligibility, same collection across routes, no unexpected shuffle on catalog addition, new-visit semantics, no-repeat if pool >1, no change during games/forms |
| Races/failure | Fast route/theme/picker changes; slow/missing/corrupt images; incompatible format; missing mode/crop; malformed/oversized catalog; untrusted origin/path; duplicate release; partial upload; timeout/backoff; offline/stale cache; decode error and context cleanup. Stale load cannot win |
| Performance | Proposed image budgets: selected phone background <=180 KB, desktop <=400 KB, thumbnail <=25 KB; exception requires measured art/quality trade-off. Catalog <=100 KB. Decode only current/next; page load does not fetch every pack or inactive page. No material CLS from scenery; target CLS <=0.1, p75 LCP <=2.5s and INP <=200ms on recorded device/network profile; compare to current baseline |
| Upload/publishing | Dry-run changes no remote objects; MIME/dimensions/hash match public GET; immutable keys; approval bound to hashes; catalog completeness; active pointer last; failed/unauthorized publish cannot expose drafts; rollback and revocation tested |
| Player comprehension | 6-8 moderated sessions: users can choose/pin/revert within 30 seconds without help, distinguish appearance from collection and cadence, and describe the pages as visually related. Include accessibility-specific review. Small-sample preference is directional, not proof of retention benefit |
| Regression/release | Existing root/catalog/env/advisory tests, targeted landing/app/browser/visual checks with frozen manifest/time/seed. Multi-engine desktop and actual iOS Safari/Android Chrome. Preview then authorized live verification; record actual SHA/devices/results/limits. API and deferred mobile advisory gates #20/#3 stay visible |

Freeze catalog, clock and randomness in visual tests; do not let live daily changes invalidate snapshots. Use the existing Node test runner/Playwright tooling and add pure resolver/rotation contract tests before implementation. Do not add redundant test frameworks. Test hero image priority/preload against LCP rather than blindly marking decorative images lazy; background failure must never hide the CTA.

## 9. Operations, cost, recovery and delivery sequence

Generation and rotation are separate controls. Rotating published assets requires no inference call. Initial image generation is an operator-reviewed batch, then an optional scheduled candidate-generation job only after provider/budget choice. Let B be the approved monthly generation budget: stop when committed cost + worst-case next request exceeds B, cap candidate count and retries, and show queue/cost reports. Budget amount/provider remain unresolved operating choices; planning can proceed without spending.

Track candidate count, approval yield, approved bytes, request count/cache hit rate, load/decode failure rate and processing time with existing operational tooling; no user-level theme browsing history by default. Estimate storage as master bytes + rendition bytes + retained release bytes; estimate monthly requests from active pages and refresh frequency using current provider pricing. Measure actual cache behavior. Do not promise zero cost.

Content lifecycle: `draft -> processed -> in-review -> approved -> published -> retired/revoked`. Approval is tied to a release/hash; changing bytes invalidates it. Retain at least two known-good releases and proposed 30-day recovery window; private rejected-draft retention proposed 30 days. Approve retention and legal-hold requirements before any deletion job. Roll back active catalog pointer and keep bundled fallback; no production bulk deletion in initial implementation. Revocation removes eligibility on next successful refresh; local/offline caches may persist until eviction, which must be disclosed operationally.

| Task ID | Work and role | Depends on | Acceptance / state |
| --- | --- | --- | --- |
| BG01 | Inventory routes, theme preferences, images and loading baseline / engineering + QA | None | Existing keys/entry routes/asset bytes/requests/contrast captured; compatibility and exclusions documented; Todo |
| BG02 | Unified background art bible and paired contact-sheet prototypes / art + UX | BG01, MG-F02/#7 | Seven-page safe zones and paired appearance specification; three pilot collection concepts aligned with game art; Todo |
| BG03 | Versioned collection manifest and preferences contract / engineering | BG02 | Validated IDs/keys/origins/renditions/schedules/completeness; compatibility with existing asset manifest; local preference migration; no speculative schema change; Todo |
| BG04 | AI generation/import brief and reviewed pilot assets / art + reviewer | BG02 | One anchor then complete paired pilot scenes with provenance/rights/crop/contact-sheet approval. No unattended paid generation until provider/budget approval; Todo |
| BG05 | Offline rendition processing and asset validation / engineering | BG03, BG04 | Processor choice reviewed, Windows/Linux bounded decoding/crop/format/hash/metadata pipeline; readable responsive output within budgets; Todo |
| BG06 | Bucket publication, custom-domain/cache verification and rollback / engineering + operations | BG05 | Pick existing R2 or Supabase public delivery; real upload/readback and least privilege; immutable release then active pointer, private drafts, rollback; no claim that current stub already uploads; Todo |
| BG07 | Shared landing/app theme resolver and fallback adapter / engineering | BG03 | Coherent page/mode/pack resolution, early safe tokens, decode and race cancellation, local fallback, bounded loading and compatible theme migration; Todo |
| BG08 | Deterministic calendar and visit rotation / engineering | BG07 | Daily/weekly/visit/manual rules and safe boundary holds pass pure/negative tests; no background timer slideshow; Todo |
| BG09 | Accessible appearance/collection gallery and user preferences / UX + engineering | BG07, BG08 | Preview, pin, cadence, surprise/reset/simple mode, localized copy, keyboard/AT; proposed defaults validated; no account required; Todo |
| BG10 | Integrate landing and all enrolled web pages / engineering | BG06, BG08, BG09 | Landing light/dark parity; seven-page matched collections; shared preference; no unreviewed game-world substitution or active-session change; Todo |
| BG11 | Web visual/accessibility/performance/player acceptance / QA + art | BG10 | Full matrix above with frozen fixtures, actual device/browser evidence and human review; fix blocking defects; Todo |
| BG12 | Release runbook, content calendar and operator handoff / operations + product | BG11, API gate #20 | Candidate review/publish/retire/revoke/recover, budgets and ownership agreed, preview/live acceptance only within release authority; Todo |
| BG13 | Deferred native mobile collection adapter / mobile engineering | BG12, MG-F07/#33, MG-F08/#44, mobile gate #3 | Only after web completion: Expo asset/image/cache/theme preference parity, bounded offline packs, physical device/AT/performance checks; no current mobile feature implementation; Todo, deferred |

First vertical slice: one fully paired collection on landing and Today, with fixed selection, validated manifest, approved assets and bundled fallback. Then add safe calendar rotation and gallery, finish the other five app pages, and grow to three pilot collections after acceptance. Broad production criteria still cover all enrolled pages. BG01/BG02 are prerequisites to art/engine implementation, not a request to regenerate assets immediately.

Indicative effort with art/review capacity: inventory/design 1-2 weeks; three-pilot generation/processing 2-4 weeks; resolver/preferences/rotation/integration 2-3 weeks; QA/hardening/runbook 1-2 weeks. Approximately 6-11 weeks before overlap, re-estimated after the first accepted paired collection. More variants, unavailable reviewers/provider setup, native mobile or unattended generation operations extend this; no fixed deadline promised.

## 10. Proposed ADR 004: reviewed background collections

Status: Proposed. Decision owners: Foobow product/art and engineering integration owners.

Choose coherent page/mode collections and a versioned validated manifest. Reuse existing CSS/DOM rendering, local preference storage, approved asset infrastructure and browser cache. Prefer prebuilt images over per-request generation/transformation. Automatic daily/weekly calendar selection is client-side and needs no scheduler provider. Generation may be automated into private candidate staging; publication remains reviewed, consistent with existing AI media policy.

Alternatives: random image per page (reject: style drift, mismatch and unpredictable tests); live AI generation per visit (reject: latency/cost/rights/review risks); paid image transformation/CMS service (defer until measured need); approved static collection with no rotation (use as first slice and fallback). Existing R2 delivery with rclone copy is the preferred upload candidate, subject to BG06's real connectivity/public-origin review; existing Supabase delivery is the compatible alternative. Add no redundant storage stack or custom uploader merely for this feature.

Consequences: consistent world identity, reversible releases, low runtime complexity and no inference cost per visit. Trade-offs: reviewed paired art takes time; manifest/calendar ownership is needed; a new collection must cover all enrolled pages before broad eligibility. Admin/database expansion requires a forward migration because existing constraints do not represent arbitrary provider buckets or image generation jobs. Revisit only if publishing frequency, catalog size or operator workflow demonstrates the static release approach is inadequate.

## 11. Research and tracking references

- [Cloudflare public buckets/custom domains](https://developers.cloudflare.com/r2/buckets/public-buckets/), [Rclone R2 integration](https://developers.cloudflare.com/r2/examples/rclone/), [R2 pricing](https://developers.cloudflare.com/r2/pricing/): confirm current delivery and costs before activation.
- [sharp](https://sharp.pixelplumbing.com/), [output formats](https://sharp.pixelplumbing.com/api-output/), [resize behavior](https://sharp.pixelplumbing.com/api-resize/), [rclone S3 support](https://rclone.org/s3/): mature image processing/upload options rather than new codecs/storage algorithms.
- [Image decoding](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode), [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion), [WCAG 2.2](https://www.w3.org/TR/WCAG22/): relevant platform and readability behavior.
- Repository source, existing media schema/policy, legacy manifest and mini-game roadmap #5 are the compatibility baseline. Upstream releases/registry/license metadata and a small closed-issue sample were checked; dependency-tree audit and executable processor/upload review remain implementation gates.

Published epic: [background collections #46](https://github.com/chenliangela-hue/foobow/issues/46). Thirteen child tasks are in the existing Foobow Web Delivery Project with priorities, phase, sequence and blocking dependencies. All new implementation items start Todo; this is a plan for future work.

| Task | Issue | Task | Issue |
| --- | --- | --- | --- |
| BG01 Inventory | [#47](https://github.com/chenliangela-hue/foobow/issues/47) | BG02 Art bible | [#48](https://github.com/chenliangela-hue/foobow/issues/48) |
| BG03 Manifest/preferences | [#49](https://github.com/chenliangela-hue/foobow/issues/49) | BG04 Reviewed pilot art | [#50](https://github.com/chenliangela-hue/foobow/issues/50) |
| BG05 Rendition processor | [#51](https://github.com/chenliangela-hue/foobow/issues/51) | BG06 Bucket publishing | [#52](https://github.com/chenliangela-hue/foobow/issues/52) |
| BG07 Shared resolver | [#53](https://github.com/chenliangela-hue/foobow/issues/53) | BG08 Rotation rules | [#54](https://github.com/chenliangela-hue/foobow/issues/54) |
| BG09 User gallery | [#55](https://github.com/chenliangela-hue/foobow/issues/55) | BG10 Page integration | [#56](https://github.com/chenliangela-hue/foobow/issues/56) |
| BG11 Acceptance | [#57](https://github.com/chenliangela-hue/foobow/issues/57) | BG12 Release/runbook | [#58](https://github.com/chenliangela-hue/foobow/issues/58) |
| BG13 Deferred native adapter | [#59](https://github.com/chenliangela-hue/foobow/issues/59) | Shared art bible | [MG-F02/#7](https://github.com/chenliangela-hue/foobow/issues/7) |

Start BG01/#47. The first playable implementation slice is a paired landing/Today collection with manual selection and fallback; automated rotation follows tested selection rules, not live unreviewed image generation.
