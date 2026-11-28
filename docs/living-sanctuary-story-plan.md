# A Life You Set Free — 福报 living sanctuary

2026-11-11. Owner-requested playable web prototype; no account economy, verified impact, public rankings or release claim. Continues G01/#8 and the existing [mini-game epic #5](https://github.com/chenliangela-hue/foobow/issues/5), [rankings #60](https://github.com/chenliangela-hue/foobow/issues/60) and [audio #73](https://github.com/chenliangela-hue/foobow/issues/73). Earlier `/review/` work is preserved.

## Product objective and story

A player gives a virtual creature a beginning, shares a playful moment, and returns to discover a life beyond that moment. 福报 becomes a felt exchange of kindness and warm wishes. Personal titles celebrate participation; no title establishes moral worth, supernatural outcomes or real ecological impact.

Actors: first-time/returning player, keyboard/touch/reduced-motion player, optional location user, future account holder and content reviewer. Objects: habitat, curated place context, species, release receipt, seed wallet, life chapter and personal collection. Current site has standalone ritual rewards; target is a coherent returning relationship with creatures. The prototype isolates this new economy from existing karma to avoid silently changing earned scores.

Opening: a koi imagines water without edges. Choose a pond, lake, river or sea; select a compatible creature; spend kindness seeds; watch it move into the water. Guide it with the pointer, a touch, or semantic gathering/exploring controls. Its reply is a wish such as “May your heart feel this free, too.” Release counts and species are derived from journal receipts. Personal titles unlock at 3, 8 and 20 releases, independent of wallet balance.

Life chapters: beginning → finding a home (1 day) → growing together (3 days) → a life in bloom (7 days). These are fictional story milestones, not biological age claims. Companions never starve, die, lose progress or demand daily attention. There are no absence penalties or notifications. Journal history includes species, habitat and date; only the most recent 24 creatures in a habitat are rendered to bound scene work.

## Reuse research and decision

Reviewed public sources on 2026-11-11, plus the existing renderer ADR, game/audio/rankings plans and `/review/` implementation. Package metadata inspected locally for exact Pixi 8.22.0/MIT. No dependency added or upgraded in this change.

| Candidate | Reusable strengths and evidence | Assumptions/flaws to avoid | Decision |
| --- | --- | --- | --- |
| [PixiJS repository/release](https://github.com/pixijs/pixijs/releases/tag/v8.22.0), [npm](https://www.npmjs.com/package/pixi.js), [Application docs](https://pixijs.com/8.x/guides/components/application) | Existing locked dependency, MIT, sprite scene graph, maintained release stream, upstream examples/tests/docs. Own original creature textures; reuse small overhead-rendering pattern from local review. | Current release and open fixes do not prove browser stability. Renderer/context/memory profiling still needed; no assumption WebGPU works everywhere or that fallback is automatic. | Adapt pinned Pixi as prototype adapter with compatible WebGL and an explicit Canvas 2D fallback. Keep ADR 003 proposed pending benchmark. |
| [Phaser release/download](https://phaser.io/download/), [renderer update](https://phaser.io/news/2026/04/phaser-4-renderer-faster-cleaner-and-built-for-modern-games), [source](https://github.com/phaserjs/phaser) | Maintained full scene/input/tween framework, MIT, examples and test ecosystem; plausible for deeper simulation. | Additional framework/dependency scope for this small loop. No fresh advisory or comparative benchmark performed. | Reject for this slice; evaluate only if its systems replace substantial bespoke code. |
| [PLAYNE developer site](https://www.playne.co/), [developer page](https://vismaya.itch.io/playne) | Emotional design reference: a world visibly grows with returning practice. | Commercial creative work, not reusable open-source code/assets; no copying characters, music, writing or clinical claims. | Adapt only the broad design principle; original story and implementation. |
| Existing DOM + Web Audio + Canvas | Existing site skills and accessible controls; no provider, remote playback or account required. Original procedural motif and creature illustrations. | Site-wide audio paths remain separate; this prototype does not claim to deliver AU01–AU10. | Use platform capabilities, isolate music ownership, silence by default, explicit mute and hidden-tab stop. |

Root dependency health is checked by the existing npm audit tooling. API/mobile findings belong to their existing release gates; no broad security claim follows from the root check. No upstream code was ported besides the unmodified MIT Pixi distribution, accompanied by its license.

## Current implementation boundary and acceptance

- `/sanctuary/`, linked from Today sanctuary shortcuts, is a reviewable vertical slice with an English/Chinese toggle. Existing production games and `/review/` remain independent. All six site locales are a later integration gate.
- Four habitat buttons sit below an original symbolic SVG atlas. Optional geolocation chooses the nearest **of four featured places**, with a displayed distance. This is not live map/nearby water discovery. Coordinates are used transiently, never persisted or sent to a map service. Curated settings are stories, not release recommendations.
- Six fictionalized creature choices include two koi types, a pond turtle, minnow, clownfish and ray. Habitat restrictions preserve narrative consistency; they are not ecological suitability advice.
- Device-only welcome wallet: 80 seeds; 10 per UTC calendar-day visit; priced creatures consume seeds. This is a prototype return loop, not evidence of a real good deed. Never buy karma with money. Do not wire local seeds into public ranks.
- Save key `foobow.sanctuary.prototype.v1`, maximum 500 release receipts, safe integer seed cap 10,000, bounded IDs/timestamps and species/habitat validation. Store no user text, exact location or account identity. Corrupt/unsupported saves remain untouched and play becomes temporary. Storage-write failures show a notice. Explicit two-step deletion clears only this key. No DB/API contract changes or migrations.
- Silence is default on every entry; an explicit button enables original locally synthesized music. Mute suspends the context immediately. Pause/hidden tabs mute and do not automatically resume music. No new provider or music rights dependency. Audio listening/mix review remains required.
- Pointer/touch play has keyboard-native gathering and exploring equivalents; reduced motion shows immediate static positions. Pause stops rendering; page disposal releases resources. GPU failure uses a separate Canvas 2D path and visible notice. No timing, audio or precise gesture is required for release/progress.

Prototype exclusions: live map layers, production score spending, verified deed ingestion, cloud sync, public leaderboards, real animal purchasing/release, payments, notifications, social sharing and offline service-worker guarantees. Browser-local data can be edited or lost and is unsuitable for authoritative rewards. Multi-tab conflict resolution is not implemented; use one prototype tab. Device clock edits can alter chapter/visit timing; production must use server-owned time and idempotency.

## Visual direction and assets

Extend the existing moon-garden direction as a single game component, retaining site brand context; no new style draw. One overhead coordinate system, jade water, ivory creature bodies and warm golden release action. The central live element is the companion following the player's light. The sidebar answers “Who shall I release, and what story have I begun?”; phone layout places the water scene before the choices.

AI-painted review candidate: `prototype/sanctuary/assets/moon-garden.png`, copied unchanged from the preserved `prototype/review/assets/sleeping-river-v3.png`, generated 2026-11-11; the original prompt/provenance is copied to `moon-garden.prompt.md`. This makes the new route self-contained without modifying the earlier review. It is one reused illustration, not four location-specific artworks. Habitat color grading is exploratory. Production needs approved pond/lake/river/reef scenes with consistent perspective, responsive compressed textures and ecological/cultural art review. No stock image, recorded track or third-party artwork has been imported. Procedural creature sprites, atlas and music motif are original code. The Pixi distribution is copied from root's exact 8.22.0 dependency, MIT notice under `prototype/sanctuary/vendor/`.

## Implementation checklist

- Completed: pure rules with failing-first tests; bounded persistence and validation; habitat/species catalog; bilingual story/journal; pointer/touch/keyboard scene; optional original music; reversible entry link.
- Completed: scoped real-browser workflow/visual verification; see final evidence below.
- Todo before production: human playtest/art/audio approval; six-locale review; compressed distinct habitats; physical iOS/Android web checks, Firefox/WebKit, zoom/focus/contrast audit, GPU context recovery and measured frame/memory budgets; integrate accepted roadmap shell/audio ownership.
- Blocked on product/backend decisions: map provider-backed nearby search; earning/spending policy for real deed scores; server-owned bounded credits, retention/deletion, idempotent release transactions and opt-in public ranking lane. Prototype seeds and personal titles must not be migrated as authoritative balances.

## Next vertical slices and recovery

1. Review the playable relationship loop and tune narrative, creature behavior, price pace and art. Preserve an always-free/small-companion route so optional play stays welcoming.
2. Complete renderer/art/lifecycle gates F01–F04 and adopt the same loop inside East Lake's established launch route. Integrate six locales and shared audio controls before replacing any production flow.
3. Add real account deed receipts through existing application/API ownership, with atomic balance spending, retry idempotency and negative tests. Keep verified impact and virtual play in separate lanes.
4. Add opted-in nearby-place discovery using the agreed map architecture; habitat suitability requires editorial review and never authorizes real animal release.
5. Expand authored life letters and seasonal worlds. Only after the server/identity/moderation work in #60 may personal play contribute to an approved public ranking lane.

Rollback: remove the single Today shortcut and stop serving `/sanctuary/`; no existing game save, database or account balance changed. The isolated local key may be retained or deleted by its own control. No commit, external publish, deployment or merge is authorized by this implementation report.

## Verification evidence

- `npm test`: 43/43 passed with localhost permissions. Includes three new failing-first rules tests for spending/idempotency, daily visits/life chapters and malformed saves. A sandboxed HTTP smoke retry failed with socket restrictions; the elevated rerun passed.
- `npm run test:browser:sanctuary`: 16/16 passed on repository-pinned Chromium desktop and Pixel 5 emulation, in normal and reduced motion. Covers release/journal/reload, wallet bounds, unchanged account karma, pause, bilingual keyboard flow/dialog focus return, corrupted saves, blocked storage, explicit music/mute, later life chapters, location denial/privacy, 1440/768/390 widths and a body-text enlargement probe. The latter is not a complete browser/OS text-zoom certification.
- Existing `npm run test:browser`: 147 passed, 1 expected skip (wide-viewport navigation test on the phone project); no failures.
- Today visual baseline: final comparison 2/2 passed. The intentional phone shortcut adds one row, and its reviewed phone baseline was updated without changing prior East Lake review baselines.
- `npm run test:catalog`, `npm run test:env`, `npm run test:advisories`: passed. Fresh root `npm audit --audit-level=high`: zero vulnerabilities. API/mobile/DB/security suites and the complete `test:all` gate were not rerun for this isolated static route; their existing release gates remain independent.
- Source syntax checks passed for new modules. Taste source lint on the new HTML: 0 FAIL, 0 WARN. `git diff --check` passed. SHA-256 matches prove the bundled Pixi is unchanged from installed 8.22.0 and the copied painted scene is unchanged from the prior review master.
- Screenshots reviewed at desktop/tablet/phone widths, English/Chinese and the open journal; stable copies in `artifacts/living-sanctuary-2026-11-11/`. No viewport horizontal overflow in the scoped checks. The full Taste inspector was not run with project Node 20.19.4 (it requires Node 22+); existing Playwright rendering and source lint were used. No full contrast/screen-reader certification, physical devices, WebKit/Firefox, context-loss/memory/frame benchmark, offline cache test, music listening/mastering review, human playtest or live deployment check is claimed.
- Browser checks are added to `npm run test:all` and the existing CI verify job; no remote CI run has been triggered or observed for this uncommitted work.
- Local preview left running at `http://127.0.0.1:4189/sanctuary/`; page and self-contained painted asset both returned HTTP 200. Launch again with `python -m http.server 4189 --bind 127.0.0.1 --directory prototype`. This is local only; no deployment or external publish occurred.

### Visual critique, final local round

ROUND 2

Seen in one second: a moonlit pool and a life offered freedom.

Idea (one sentence): a virtual release becomes a companion's continuing story.

Live thing: creature selection, responsive swimming, warm replies and time-based journal chapters.

Layout words by section: water=full-height scene / choices=compact side panel / journal=reading surface; phone=scene then choices.

Scores (subjective, not acceptance evidence): design 6.5 · usability 7.5 · creativity 7.5 · content 7 → overall 7.1.

Caps applied: one painted scene and procedural creature art; no photographic set or finished habitat art collection. Existing game direction retained without a new style draw.

Top three remaining problems:
1. `desktop.png`: the single pond painting is reused for lake, river and sea. Replace with approved location-specific environments before production, retaining the underwater coordinate system.
2. `phone.png`: scene/choices are sequential, so releasing requires a return to the water. The primary choice anchor and automatic return after release now make this explicit; physical-device testing should validate the rhythm.
3. `journal.png`: opening letters currently share a gentle voice across species. Add distinct authored creature personalities and more illustrated life events after the relationship loop is accepted.

Asset credits: original AI-painted candidate and preserved prompt in `prototype/sanctuary/assets/`; original code-made creatures, atlas and five-note synthesized motif; unmodified PixiJS MIT distribution with license in `vendor/`. No found stock media used. The scene, creature polish and motif remain review candidates, not approved final production art/audio.

## Follow-up: owner-supplied repositories and agent skills

Reviewed 2026-11-11 after the owner asked to use the supplied engine/resource list. This section supersedes the prototype's earlier procedural-koi description where noted; it does not mark ADR 003 accepted or replace the broader roadmap's gates.

### Evidence and selection

The supplied ranking is a starting list, not an independently validated quality ranking. Star totals fluctuate and are not evidence of architectural fit, usable assets, license coverage or browser performance. Read the actual upstream skill/API material before selecting mechanisms. No new engine, AI service, global skill or dependency was installed by this follow-up.

| Candidate and primary references | Strengths worth using | Limits and decision for Foobow |
| --- | --- | --- |
| [Phaser](https://github.com/phaserjs/phaser), [official skills](https://github.com/phaserjs/phaser/tree/master/skills), [curves/path-following skill](https://raw.githubusercontent.com/phaserjs/phaser/master/skills/curves-and-paths/SKILL.md), [examples](https://github.com/phaserjs/examples), [npm](https://www.npmjs.com/package/phaser) | MIT; coherent scene, input, physics, camera and tween systems; official examples and skill tree. Registry observed 4.2.1, modified July 9, 2026. Path-following material distinguishes actual arrival from simply changing a counter. | Strong candidate for a later collision/physics/multi-scene game. Replacing the existing renderer for this small encounter would add a second framework without a demonstrated need. Adapt the explicit journey/arrival design principle, not Phaser source or APIs into Pixi. No claim that an LLM familiarity ranking or skill count proves quality. |
| [PixiJS](https://github.com/pixijs/pixijs), [official skills](https://github.com/pixijs/pixijs/tree/dev/skills), [mesh guide](https://pixijs.com/8.x/guides/components/scene-objects/mesh), [npm](https://www.npmjs.com/package/pixi.js) | MIT; already pinned locally, sprite/mesh/scene primitives and a tested fallback boundary. The installed 8.22.0 package includes official mesh, events, performance, container and accessibility skills. | **Use installed engine as-is, adapt the game's renderer.** Use `MeshRope` for a bending fish body, semantic DOM actions alongside pointer/touch input, bounded texture caches and cleanup. Registry now reports 8.23.0, modified Nov 11, 2026. Do not silently upgrade the existing validated lockfile just to say “latest”; assess that separate release before an upgrade. Frame/memory/context-recovery benchmarking remains open. |
| [Babylon.js](https://github.com/BabylonJS/Babylon.js), [license](https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/license.md) | Apache-2.0; full 3D authoring/rendering and game systems; useful when a navigable spatial world is the product. | Defer. No reviewed 3D models, camera/game design or device budget for this slice. No source copied or package installed. An engine cannot supply a coherent art direction or story by itself. |
| [Three.js](https://github.com/mrdoob/three.js) | MIT; flexible 3D rendering with extensive examples/documentation; plausible for future authored dioramas. | Defer. It is a rendering library; game/session/input/rules still need ownership. A full 3D migration is outside this prototype and not justified by current play needs. |
| [LittleJS](https://github.com/KilledByAPixel/LittleJS), [npm](https://www.npmjs.com/package/littlejsengine) | MIT, small dependency-free engine, readable source and examples, repository tests/bench directory. Registry observed 1.29.1, modified Nov 2, 2026. | Good candidate for an isolated small arcade game. Reject a second engine in the current sanctuary: its minimalism does not remove the existing renderer or content work. |
| [GDevelop](https://github.com/4ian/GDevelop), [license scope](https://raw.githubusercontent.com/4ian/GDevelop/master/LICENSE.md) | Core engine/IDE/extensions are MIT; visual event authoring and web export can let non-coding collaborators author games. | Defer until visual-editor ownership is actually needed. Export/build/assets/extension permissions require review; engine MIT does not grant rights to the GDevelop name/logo or every imported asset. Current repository workflow does not need an editor migration. |

This is a focused fit/license/documentation/maintenance screening. It is not a full issue-health, dependency/advisory or cross-browser adoption audit of all six engines. Only the installed Pixi code runs here; the rest remain candidates. Current dependency files and the bundled MIT notice were retained.

### Other supplied collections and AI tools

- [Phaser official examples](https://github.com/phaserjs/examples) are the preferred API reference. [sausi-7/games](https://github.com/sausi-7/games) and [noowxela/phaser-examples](https://github.com/noowxela/phaser-examples) are idea galleries, not production dependencies. The former shows 34 stars in the retrieved repository snapshot despite its 142-game description; quantity does not establish mature quality. No game code or art was copied.
- [awesome-open-source-games](https://github.com/michelpereira/awesome-open-source-games) is a discovery index; assess the individual game's code/assets/licenses before reuse. [attogram/games](https://github.com/attogram/games) concerns assembling a game portal rather than Foobow's authored companion loop; reject it as a replacement for this experience.
- [Yakoub-ai/phaser4-gamedev](https://github.com/Yakoub-ai/phaser4-gamedev) is a community Claude Code plugin, distinct from Phaser's official skill tree. It was inspected as a candidate, not installed or treated as authoritative over repository rules.
- [Phaser Game Agent source export](https://www.phaser.io/news/2026/08/take-your-phaser-game-agent-game-home-source-code-and-all) is documented by Phaser. Its [MCP manual](https://www.phaser.io/agent/mcp/manual) describes an account/credit-based service. That is distinct from using the MIT Phaser library locally. No account connection, credit use or source transfer was performed.
- [OpenGame's paper](https://arxiv.org/abs/2604.18394) describes an agentic workflow and evaluation. Reuse the principle of generate → run → inspect → repair, with actual behavior tests; do not treat research benchmarks as proof a generated Foobow game is ready. Several similarly named forks surfaced and the linked project landing page could not be fetched; canonical distribution/license/setup was not sufficiently resolved to adopt or run it.
- [OhMyGame](https://github.com/WhiteTowerAI/ohmygame) is an Apache-2.0 beta studio with bring-your-own-key workflows and its own studio skill. [Agent Game Forge](https://github.com/0x0funky/agent-game-forge) is a local-first game IDE. Both duplicate authoring orchestration already available here; defer adoption until their workspace/export/provider fit is reviewed. No external model received repository content.
- [Cinevva](https://app.cinevva.com/about.html) describes a browser-native game platform. An applicable open-source engine license and source integration were not established in this review. Do not equate the hosted platform with the permissively licensed engines above; not adopted.
- Matter/Rapier are not needed for fish arrival/separation. No rigid-body simulation is required; adding one without a measured game need would increase dependency and integration cost.

### Skills actually applied and resulting code

Read the installed `node_modules/pixi.js/skills/pixijs-scene-mesh/SKILL.md` and its `references/mesh-rope.md`, plus container, events, performance and accessibility skills. Public upstream reference is the [official Pixi skill tree](https://github.com/pixijs/pixijs/tree/dev/skills). These instructions were used directly; they were not merely added to a list.

- `water.mjs`: original body textures now deform over a 17-point Pixi `MeshRope`, inside a `Container` with a separate underwater shadow. Turtle retains a sprite. The point constructor/options and leaf/container boundary follow the upstream API guidance. No upstream example body was copied verbatim. The Canvas fallback uses the same art without mesh deformation.
- `journey.mjs`: original renderer-independent acceleration/arrival/separation rules, frame-delta cap and a three-arrival state machine. The current companion leads while other fish yield; a full school cannot prevent its arrival. There is no rigid-body dependency. The existing cap of 24 visible companions remains; journal totals are independent of rendered count.
- A release now opens an optional three-part encounter: find light, share the water, find a first home. Progress advances on actual proximity/dwell in normal motion. The guided semantic action performs an immediate equivalent in reduced motion. Pause blocks arrivals. Skipping and replaying preserve the wallet and saved release count.
- Returning players can use **Visit a companion** without spending seeds or buying another creature. Interactive encounter state is transient; the existing bounded version-1 journal and its 1/3/7-day life chapters are unchanged.
- `journey-copy.mjs`: English/Chinese passages and distinct wishes for all six creature choices. Narration makes room for the water rather than covering the play area. Hidden helper text now respects `[hidden]` even when scene typography sets `display`.
- Original painted koi asset `assets/koi-painted-v2.png` was generated with the built-in image tool on Nov 11, 2026, without reference images. Its full prompt/provenance is in `assets/koi-painted-v2.prompt.md`. Inspected RGBA 1536×1024, 1,587,599 bytes; the sprite was copied unchanged and rendered down into a cached texture. No background-removal script or externally sourced game art. Other creatures remain procedural and still require visual polish. Image failure falls back to the original procedural koi.

### Acceptance and remaining gates for this follow-up

- Completed: failing-first pure behavior tests for ordered/paused/duplicate arrivals, steering/arrival/separation/frame bounds and head-stable/tail-bending mesh points. Full root suite: **46/46 passed**.
- Final scoped browser result: **22/22 passed** on desktop/phone Chromium. Includes actual touch/pointer proximity arrivals, keyboard/reduced-motion equivalents, pause, replay, free return visits, unchanged wallet/journal counts, missing Pixi plus missing painted-art fallback, and a 30-record journal with a crowded school that still allows the guided companion to arrive. Normal-motion complete journeys passed on both viewports; no page errors in the covered journey tests. Screenshots were reviewed after the final run.
- Earlier 147-pass/1-skip existing web regression result remains historical evidence from the initial delivery above; it was not rerun for this isolated `/sanctuary/` follow-up. No shared app code, original Today baseline, dependencies or API/DB contracts changed in this follow-up.
- Human art/comprehension/audio acceptance, six locales, production score/ranking/map integration, distinct habitat environments, physical devices, supported non-Chromium browsers and measured render/context/memory budgets remain open. The new image is an art candidate; pixel dimensions are not evidence of finished game quality.
- Recovery: removing the encounter UI/imports and restoring the prior `water.mjs` rolls back this slice; no save/schema migration is needed. The old procedural textures remain available for missing-art rendering. No external publish, commit or deployment occurred.

Proposed future engine assignment, not a new implementation commitment: keep Pixi for animal/lantern illustrated interactions; evaluate Phaser on a small river-cleanup or safe-crossing prototype if collisions and scene tooling materially simplify it; assess Babylon/Three only for a separately accepted 3D concept. Every game still needs its own authored action, story, art and playtest gate in the existing task board.

### Follow-up visual review

ROUND 3

Seen in one second: a painted koi in a moon garden, with a journey to take together.

Idea (one sentence): release becomes shared exploration, ending in a companion's personal wish.

Live thing: mesh-deformed swimming, school separation and three actual proximity arrivals.

Layout words by section: scene=water / encounter=compact action dock / choices=side panel; phone=water then choices.

Scores (subjective): design 6.5 · usability 8 · creativity 7.5 · content 8 → overall 7.3.

Caps applied: the experience still relies on one illustrated environment; the original remaining art/device/human acceptance gates are open. This is not a measured player-quality score.

Top three remaining problems:
1. `artifacts/living-sanctuary-skills-2026-11-11/desktop.png`: habitat choices still reuse the pond environment. Author and approve distinct habitats next.
2. The golden koi now matches the painting more closely; the other five choices still use procedural art. They need an equally coherent approved character set.
3. The soundtrack remains the initial synthesized motif. Reviewed music, listening/mix/device checks and site-wide audio ownership remain in #73.

No stock assets were copied from any example/game repository. The new built-in-generated koi and its full prompt are saved at `prototype/sanctuary/assets/koi-painted-v2.png` and `prototype/sanctuary/assets/koi-painted-v2.prompt.md`.

## 2026-11-13 — modern game-feel polish

Objective: let the illustrated world lead, make the next action apparent, and make swimming/arrival feedback feel coherent. Affected actors are first-time/returning web players, touch users and keyboard/reduced-motion players. The current prototype showed a long collection panel next to the water, could flip a fish's heading abruptly, and gave limited feedback during a guided swim. Target: water-first entry, explicit reversible collection view, continuous turning, a visible route/arrival response and safe optional audio. Existing receipts, prices, rank thresholds and life chapters remain unchanged.

### Decisions and reuse

- Reuse the existing pinned Pixi renderer, mesh fish, semantic DOM controls, bilingual story content and browser tooling. No new engine, provider, dependency, account integration or assets were introduced.
- Adapt [Pixi's performance guidance](https://pixijs.com/8.x/guides/concepts/performance-tips): reuse a small bounded set of 28 effect sprites and one shared flower texture. A separate particle library or high-count particle system is unnecessary here. This is a resource bound, not a measured FPS/memory claim.
- Apply the [Game Accessibility Guidelines' direct-entry principle](https://gameaccessibilityguidelines.com/allow-the-game-to-be-started-without-the-need-to-navigate-through-multiple-levels-of-menus/): open on the playable world and offer collection choices explicitly. Keep the existing semantic guided action; do not require accurate pointing, audio or timing. The inaccessible interactive-indicator guideline URL was not relied upon.
- The design skill's existing-game-component route was used: retain the painted moon-garden direction and brand, without drawing a new page design or replacing the stack. QA uses the repository's existing Playwright configuration and original fallback tests.

### Completed implementation

- Default immersive water view. **Show collection** / **Return to the water** exposes or hides choices without restarting the encounter. **Choose a companion** opens the collection and places keyboard focus on its habitat control. `#journey` links still open the collection directly.
- Starting a release opens the water view and focuses its guiding action. **Just swim** dismisses the optional story while retaining immersive free play. No data migration, extra spending, award or public rank is involved.
- Heading changes are bounded per frame, and movement follows the turning body rather than jumping instantly to an opposite angle. A failing-first test captured the previous flip before implementation.
- A restrained moving trail points from the companion toward its active flower while guided swimming is underway. Desktop gets a short contextual label; phones retain the ring and semantic action without a duplicate floating label.
- Arrival triggers a short, bounded petal flourish; reduced motion retains static state changes. Optional two/three-note arrival chimes play only after explicit audio enablement. Mute stops active and queued notes; voices are capped to prevent unlimited overlap from rapid replay. A focused audio test checks muted/queued/bounded behavior.
- Pause gets a visible reassurance status; input and animation stay paused. Existing hidden-tab pause/mute behavior remains. Main progress, keyboard guidance, replay and corruption/graphics fallbacks remain available.
- New companions wait in clear water instead of under the action dock, including reduced-motion placement. The normal-motion lead still yields a reproducible arrival with a crowded school.

### QA evidence and findings

Checklist: completed implementation and local verification; blocked only for production-level human/art/device/backend gates listed below. No external publish or deployment.

- Root suite: **48/48 passed**, including heading-turn regression, ordered journey/reward invariants, corrupted saves and bounded/muted arrival audio.
- Final full scoped desktop/phone browser suite: **26/26 passed** after the phone screenshot corrections. Earlier focused checks also passed 4/4 for free-swim/audio and 6/6 for responsive views and actual touch/pointer arrival. The existing local preview and page returned HTTP 200 at `http://127.0.0.1:4189/sanctuary/`.
- Source syntax checks and HTML taste lint passed (0 FAIL, 0 WARN). `git diff --check` passed. No formatter/linter/build stack was added. No broader API/mobile/DB or advisory audit was needed to validate this dependency-free static-route change; no new security/release claim follows from these checks.
- Layout/visual: reviewed desktop, 768px tablet and phone openings, the collection view, active encounter and completion. Resolved a phone label/story collision and an initial companion/action-panel collision; both were visible in screenshots despite otherwise green behavior tests. Final screenshots are retained in `artifacts/living-sanctuary-polish-2026-11-13/`.
- Content: existing English/Chinese wishes and virtual-only language preserved; local navigation/goal/pause strings added in both languages. Other four site locales remain a production integration gate.
- Interaction/workflow: immersive/collection switching, release focus, pause/resume, real arrivals, replay, free swimming, optional audio, journal, deep link and daily visit covered by scoped checks. Existing score receipts and balances remain isolated from account karma.
- Accessibility: semantic controls, explicit expanded state, focus transfer, dialog focus return, reduced-motion equivalents and viewport overflow checks covered. Body-text enlargement is a probe, not full browser/OS text-zoom certification. No full screen-reader, contrast or physical-device certification is claimed.

Remaining: distinct environment art for each habitat, polished art for the other creatures, human playtest and language/audio review, physical iOS/Android devices, supported Firefox/WebKit, context-loss and measured frame/GPU/memory budgets, shared site audio ownership, real nearby-place discovery and server-owned account score/ranking integration. Prior broad browser/visual results above are historical; the original app launch routes were not modified in this pass.

Recovery: revert this dated play-view/feedback slice to the previous sanctuary files; the existing version-1 local save remains valid. All pre-existing unrelated working-tree changes were preserved.

### Visual critique

ROUND 4

Seen in one second: the water and a swimming companion, with a clear invitation to begin.

Idea: a quiet world comes first; choices and progress support the relationship.

Live thing: gradual swimming turns, a guided-light trail, arrival blooms and an uninterrupted switch between guided and free play.

Layout: opening=full-width water / playing=water plus compact action dock / collection=explicit side or stacked view.

Subjective scores: design 6.5 · usability 8 · creativity 7.5 · content 8 → overall 7.3. These are critique notes, not measured acceptance ratings. Existing single-environment art limitations remain.

Three remaining visible limitations: one painting still represents four habitats; non-koi creatures need matching finished art; the narrow phone header uses two rows to retain readable controls. Existing original/generated asset provenance is unchanged; no new stock or generated image was added by this polish pass. The full Taste inspector remains unrun with project Node 20; source lint and actual Playwright screenshots were used.
## Beneath the Lilies · 2026-11-17 review sample

Open `/sanctuary/`, then choose **Beneath the Lilies**. One free virtual koi release opens a shallow freshwater scene. Point, touch, or use arrow keys in Surface view to guide the koi. Koi view follows the same fish at eye level. Pause freezes automatic swimming and camera motion, and reduced-motion visitors start paused with discrete steering available. Sound is opt-in. The sample has English and Simplified Chinese copy and uses session-only state. It has no link to the seed wallet, journal, location permission, or account rewards.

- **Adapt Three.js r187.** The latest stable npm version at implementation time was `0.187.0`. Its MIT WebGPU renderer runs the same TSL materials on WebGPU and WebGL 2. The pinned, tree-shaken build has no runtime package dependencies. The release notes and upstream security page were checked. Physical-device rendering and performance still need review. [Release](https://github.com/mrdoob/three.js/releases/tag/r187) · [Renderer documentation](https://github.com/mrdoob/three.js/blob/dev/manual/pages/webgpurenderer.html) · [Security page](https://github.com/mrdoob/three.js/security)
- **Keep PixiJS for the illustrated pond.** Its MIT 8.23 release is actively maintained and improves pointer-event handling. Its sprite-based scene is well suited to the existing illustration and was retained as the fallback. A perspective camera and native 3D meshes would require additional work in that stack. [Release](https://github.com/pixijs/pixijs/releases/tag/v8.23.0)
- **Pass on Babylon.js for this sample.** Its current Apache-2.0 npm distribution, WebGPU support, sample playground, and glTF tooling suit larger scenes. There is no physics, editor, or imported-model pipeline in this slice. [Package and examples](https://www.npmjs.com/package/@babylonjs/core) · [Releases](https://github.com/BabylonJS/Babylon.js/releases)
- **Adapt the interaction principle from ABZÛ.** Let the player observe underwater life through fluid movement and long sightlines. The freshwater layout, art, koi meshes, controls, and audio implementation were authored for Foobow. [Official reference](https://abzugame.com/)
- **Use Koi Farm and Subside as visual references.** Koi Farm shows how distinct markings read from overhead. Subside uses close foreground objects and a distant underwater view to establish scale. This sample uses those broad composition principles in an original scene with one free release. [Koi Farm](https://koifarmgame.com/) · [Subside](https://store.steampowered.com/app/2550040/Subside/)

The entry artwork is an original generated freshwater-pond still (`prototype/sanctuary/dive/assets/pond.webp`). The prompt specified a submerged kohaku koi, lotus stems, mossy basalt and afternoon light, using a muted jade and vermilion palette. The playable scene is rendered live with authored geometry and materials. The existing synthesized sanctuary motif provides optional audio. Removing the entry link and `dive/` directory rolls the sample back without changing saved data.

The local engine is bundled from `three@0.187.0` with esbuild 0.28.1, ESM target `es2022`, minification, tree shaking, and preserved license comments. Its source archive matches npm integrity `sha512-Qiu7R+Cmh8CstZsY1uJOSWnVlfo7ZtNLV7mF8Jltk3LB3AtDu9cRZlcnRKkAk8Y4z6KKw35z7Y7Urd7jWY8etA==`. To rebuild, extract `build/three.core.js`, `build/three.webgpu.js`, and `build/three.tsl.js`, re-export the engine and TSL symbols used in `pond.mjs`, `habitat.mjs`, and `koi.mjs`, and bundle that entry into `vendor/three.webgpu.js` using `--bundle --minify --format=esm --target=es2022 --legal-comments=eof`. The local MIT license ships alongside it. This prototype introduces no package-lock or provider changes.

Local acceptance covered 48 root tests, 6 dive checks and 26 existing sanctuary browser checks across desktop and emulated phone Chromium. The repository Playwright web-server readiness probe timed out, so the browser suite used Playwright routes serving the same local files. A separate Chromium smoke test reached the actual preview server, released the koi, switched cameras, enabled and muted sound, and returned to Sanctuary in Chinese. Captures cover the entry and both views at desktop and phone sizes, plus the controls at tablet width with 200% root text size. The graphics probe used WebGL 2. Native WebGPU, physical phone performance, Safari and Firefox rendering, and product-owner art review remain open before broader integration.
