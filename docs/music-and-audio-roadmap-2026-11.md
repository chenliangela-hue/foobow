# Foobow music, soundscape and game audio roadmap

Date: 2026-11-09. Status: proposed future implementation. No music generated/licensed, files copied, playback setting changed or production audio enabled by this plan.

Track in [Foobow Web Delivery](https://github.com/users/chenliangela-hue/projects/2). Integrate [mini-games #5](https://github.com/chenliangela-hue/foobow/issues/5), [background collections #46](https://github.com/chenliangela-hue/foobow/issues/46), the Together/rankings roadmap, existing API gate #20 and deferred mobile #3/#44.

Published epic: [music/audio #73](https://github.com/chenliangela-hue/foobow/issues/73). Companion [Together/rankings #60](https://github.com/chenliangela-hue/foobow/issues/60) keeps silent and audible play equally eligible.

## 1. Listening experience and current baseline

Make Foobow sound like one warm illustrated world: original or properly licensed, polished music; believable environmental sound; tactile but restrained game feedback; seamless transitions; and immediate control. People can play entirely silently with the same progress and score. Music is optional, not an engagement gate.

Current source has several independent playback paths: shared ritual synthesizers create/obtain an AudioContext and connect directly to its destination; app soundscapes create their own context, noise/filter/LFO and volume slider; sanctuary games call global sound functions; chants use an HTML audio element and an externally hosted track catalog. The inspected soundscape toggle controls its own path, not a demonstrated master mute across all paths. A source comment calling a chant library authorized does not establish composition/recording/redistribution rights; audit evidence before retaining/mirroring tracks.

Actors: silent/first-time visitor, player enabling audio, assistive-technology user, musician/sound designer, rights reviewer, asset publisher, game author and operator. Objects: cue, stems/loop region, sound effect, licensed master, audio scene, bus state, saved preference, playback owner, content manifest and quality evidence.

Target: one audio controller for landing/app/games, shared audio scene definitions, explicit user consent to audible playback, persistent mute/volume controls and a small approved music library served through existing media delivery. Native mobile implementation remains deferred.

## 2. Controls and behavioral contract

- New visitors start silent. An explicit "Enable sound"/play action unlocks audio. A click merely used to complete a game is not assumed to authorize music. Remember the choice, but respect browser autoplay denial after reload and show a clear resume control instead of reporting playback that failed.
- Always expose a keyboard-accessible **Mute all** control. It stops music, ambience, effects, voice/chants and newly queued sounds; it must not be possible for a delayed callback, new game, unlock handler or route change to leak audio after mute. Preserve previous bus volumes for unmute and never reset mute when switching pages/modes/collections.
- Offer independent Music, Nature/ambience, Effects and Voice/chants toggles/sliders under settings, plus master volume. Music mute means music is off even when effects remain enabled; Mute all is a stronger separate setting. Show explicit state/text and accessible slider labels, not only an icon or color. No sound required to operate controls.
- Store bounded versioned preferences locally; no account required. Share state on landing/app routes of the same canonical origin, migrate relevant old settings after inventory, support blocked/corrupt/full storage and reset with existing local-data deletion. Cross-tab mute should propagate using storage events/BroadcastChannel where supported; fallback behavior is documented and tested.
- One visible playback owner per origin where feasible. Entering a game fades/ducks the website bed and starts its assigned scene; leaving restores the prior scene only if still enabled. Two tabs, overlapping modals or rapid navigation must not create multiple background tracks. Hidden tab/background playback pauses by default; explicit future long meditation/background mode needs its own battery/platform contract.
- Voice/chants are an explicit optional mode with correct language/cultural labels, not random background entertainment. Prefer one foreground audio source: voice ducks or stops music. Screen-reader output is external to the web mixer; silent mode and clear visual instructions avoid competition, and optional narration never duplicates focused screen-reader announcements by default.
- Respect audio interruptions, suspended contexts, headphone/device changes and network failure. Resume only the same intended scene under current user settings. No auto-resume after the user manually paused/muted. Dark/light/background rotation does not automatically swap tracks or adjust volume; link an optional music family only at a safe scene boundary.
- Sound and voice are never prerequisites for score, credits, timing or successful play. Rhythmic mini-games use visible/tactile alternatives. Accessibility assistance and mute have no ranking penalty.

## 3. Sonic identity and twelve music families

Palette: sparse warm felt piano, soft plucked strings, wood/mallet tones, gentle bowed textures and clean field recordings. A small original Foobow motif may recur across arrangements. Avoid constant triumph fanfares, sharp peaks, high-pressure countdown music, heavy bass, intrusive loops or unreviewed religious/cultural samples. Tempo and instrumentation are creative starting points, not clinical claims about relaxation.

| Family | Context and game mappings | Music / ambience direction |
| --- | --- | --- |
| MUS01 Home by the Lake | Landing and Today | Welcoming 60-80 BPM or beatless motif, gentle water; long quiet spaces behind text |
| MUS02 Lantern Courtyard | Blessings, G04 Kyoto, G07 lamp, G12 loving-kindness | Soft plucked motif, low warm pads, distant water; no unlicensed chant |
| MUS03 Cloud Path | Map exploration | Airy sparse texture and travel chime, optional ambience-only mode; no constant action cue |
| MUS04 Garden Together | Community/Together, G30 concept | Hopeful light arrangement, subtle garden birds; no artificial cheering to imply real users |
| MUS05 Koi Sanctuary | G01 East Lake | Spacious water detail and warm bell/plucked tones; music leaves room for release/ripple effects |
| MUS06 Neighbour Street | G02 crossing, G16 umbrella, G19 seat, G20 path | Gentle acoustic pattern, restrained rain/street bed; safe-signal chime intelligible, visual equivalent always present |
| MUS07 Roots and Rain | G03 grove, G18 pollinators | Soft wooden percussion or beatless strings, rain/leaf details; no falsely authentic or sacred indigenous recording |
| MUS08 Reading Retreat | Profile, G05 reading, G29 book rescue | Quiet felt piano and room tone, page/cloth detail; optional no-music reading mode |
| MUS09 Wooden Quiet | G06 wooden fish, G08 incense, G09 wheel | Minimal sustain/ambience, ample silence; player's instrument is foreground, optional secular sound-object palette |
| MUS10 Pebble Garden | G10 breath, G11 gratitude, G14 senses, G25/G28 concepts | Unhurried sparse textures; no forced breathing cadence or requirement to hear instructions |
| MUS11 A Little Care | G13 quest cards, G17 shelter, G21-G24 concepts | Gentle, optimistic acoustic cues and tactile fabric/wood; no emotional guilt cues |
| MUS12 Sea Light | G15 cleanup, G26/G27 concepts | Broad coastal ambience and soft melodic fragments, non-startling completion sound |

Pilot three complete sonic scenes first: MUS01 website, MUS05 East Lake and MUS09 Wooden Quiet. Music-family IDs are distinct from AU implementation-task IDs. Prove contrasting needs and global controls before producing twelve full suites. Every released current/future game declares an `audioSceneId` or explicit silent scene; game registration validation rejects missing/unapproved audio references. Discovery-only games remain concepts until their #5 tasks are promoted.

Per family propose one main 2-4 minute loop, one minimal/low-stimulation arrangement (or approved stem-based mix), an ambience layer and a short completion cue. Default may be just one flattened bed plus effects to reduce CPU/network use. Dark/light arrangements are optional and share identity; do not manufacture a second soundtrack for every image. Scene changes crossfade at a musically safe boundary; a site background change alone does not restart audio.

Effect kit: hover/selection optional, gentle button confirmation, koi release/water ripple, footsteps/signal, soil/leaf/rain, lantern placement/breeze, page turn, wood tap, stone placement, soft completion. Vary a few approved samples naturally at bounded rate/polyphony; no loud cue on every point. Mute applies to synthesized and sampled effects alike.

## 4. Music production, rights and asset quality

Prioritize commissioned original or licensed production music with explicit rights for web/native interactive use, looping, editing/stems, commercial distribution, territories and offline downloads. Review both composition and sound-recording rights; public-domain composition does not make a particular recording free. Keep source, composer/performer, license version, proof, required credits, expiration and Content ID handling with each accepted asset. Reject assets whose rights do not cover actual use; no ripping streaming-service audio or hotlinking unverified tracks.

AI-generated candidates are optional: require an approved provider/budget/terms, provenance and human musician review for artifacts, resemblance, cultural context and mix quality. No training on private user material or assumption of exclusive copyright. Store candidates privately; automation can process and propose, not approve publication. Existing media policy and storage review are reused. No new paid music/AI provider is selected in this planning task.

Technical targets to tune through listening tests:

- Retain lossless source masters at 48 kHz/24-bit PCM where the source supports it; keep accepted original quality rather than inventing fidelity by upsampling. Deliver tested compressed encodings, e.g. Opus with AAC/MP3 fallback according to actual browser support and license/build review.
- Proposed background music reference -20 LUFS integrated +/-2 LU with true peak <=-1 dBTP; audition effects against the mixed scene rather than apply a long-track loudness target blindly to tiny clips. These are product mix targets, not a hearing-safety guarantee or a broadcast requirement. Device volume/listening conditions remain outside the app's control.
- Verify seamless loop points and codec padding with real playback. No clicks at starts/stops/loop seams or abrupt transitions. Fade short effects as needed; use gain ramps for state changes. Limit peaks/polyphony and duck music under voice/key cues (initial duck target 6-10 dB, refined by listening tests).
- Listen on headphones, phone speaker and laptop at low/moderate volume; confirm mono compatibility, no harsh highs, excessive hiss, clipping or missing quiet cues. Evaluate repetition/fatigue across at least three full loops. Preserve appropriate dynamic range; do not master for maximum loudness.
- Proposed quality rubric, two reviewers: musical fit, recording/mix quality, loop/transition quality, effect integration and low-fatigue character each >=4/5; no critical rights, clipping, artifact or mute defect. Involve a musician/sound designer rather than equate bitrate with musical quality.

Reference measurement guidance: [AES loudness guidance](https://aes2.org/wp-content/uploads/2024/01/20210924_TD1008_v3.13.pdf) and [FFmpeg loudnorm/filters](https://ffmpeg.org/ffmpeg-filters.html#loudnorm). Measure and audition; do not claim any loudness number treats anxiety or guarantees inner peace.

## 5. Reuse-first stack and music-source references

Research snapshot 2026-11-09; observed versions are not upgrades. No production dependency is added by planning.

| Candidate | Strengths and maintenance evidence | Limits and recommendation |
| --- | --- | --- |
| Existing Web Audio / HTMLAudioElement | Fits current app and synthesized rituals, browser-native streaming/gain/pause; no new runtime library | Adapt behind one controller with buses and lifecycle. Existing direct-to-destination paths must migrate; no assumption that the soundscape slider mutes everything |
| [Howler.js](https://github.com/goldfire/howler.js), registry 2.2.4, MIT | Mature sprites, volume/fade/loop, HTML audio fallback and codec management; repo nonarchived, last observed push Nov 2025 | Registry stable release dates to Sept 2023 and website advertises an older version; review current mobile/autoplay regressions and tests. Candidate for sampled playback only if it materially reduces code; do not automatically add another AudioContext or mixer |
| [Tone.js](https://tonejs.github.io/), registry 15.1.22, MIT | Active Nov 2026 repository, musical transport/synth scheduling and examples | More synthesis/scheduling scope than background playback needs; defer unless a real interactive composition mechanic needs it. Do not combine Tone/Howler/custom synthesis without explicit shared-context ownership |
| [FFmpeg](https://ffmpeg.org/ffmpeg-filters.html#loudnorm) | Mature decode/transcode, loudness/peak analysis, fades and loop inspection | Use operator/CI processing, not a giant browser WASM bundle. Record exact patched build, codec support and LGPL/GPL/build-dependent notices; do not write a new loudness analyzer |
| [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) | Official pack states CC0, 100 sounds, released 2020; useful prototype UI vocabulary | Adapt selected gentle samples after listening, not an entire generic arcade palette; rights of this pack do not cover unrelated music. Keep license evidence with assets |
| Existing CDN/media manifest and BG06/#52 publisher | Object storage avoids binaries in DB, immutable keys and verified media delivery can be shared | Extend validated audio MIME/size/codec metadata; image-only manifests/private staging limits need compatibility review. An upload stub is not a working publisher |
| [Expo Audio](https://docs.expo.dev/versions/latest/sdk/audio/) | Framework-supported native playback candidate for existing Expo architecture | Deferred; choose versions compatible with the accepted Expo upgrade, test silent switch/audio focus/interruption and native resources. Web autoplay behavior cannot stand in for native tests |

Before adoption inspect relevant open issues, resolved advisory tree, license notices, example build and tests. Mature release age alone does not establish a defect; activity alone does not prove correctness. Default proposal is existing Web Audio plus HTML media streaming for long beds, centralized under a small adapter interface; select a library only after a measured pilot.

## 6. Architecture and asset contract

Proposed `AudioController`: `enableFromGesture`, `setMasterMuted`, `setBusMuted/Volume`, `enterScene`, `leaveScene`, `playCue`, `pause/resume`, `dispose`. Input/game components request named approved cues, not create AudioContexts, mutate a global volume or play URLs directly. Pure scene/mix priority rules are independent of browser/Expo adapters.

Routing: sources -> Music / Ambience / Effects / Voice buses -> master gain -> reviewed dynamics protection -> destination. All paths honor master state, including legacy HTML elements when graph routing is unavailable. Connect controlled cross-origin media through the graph only when CORS is correct; a MediaElementSource without proper CORS can become silent. Migrate approved tracks to permitted controlled delivery after rights review, or retain an explicit individually controlled adapter; never claim an unconnected player is covered by master mute.

Use one shared context where browser capability permits, bounded active voices (proposed at most 12 effects), one music scene and at most one transitioning next scene, explicit cancellation tokens for async load/play. Stop/disconnect nodes and timers on dispose. Prefer media-element streaming for long tracks so a full decoded album is not held in memory; small effects can use bounded decoded buffers. First silent page load need not fetch/decode music. No full soundtrack preloading or microphone permission.

Proposed versioned audio manifest: `assetId`, `revision`, hash, approved rights record ID, cue/scene ID, codec/MIME, byte size, duration, sample rate/channels, loop boundaries, measured loudness/peak and localized attribution keys. Public manifest contains no private contracts or AI prompts. Private provenance tracks source/licensing/review. URLs/keys are allowlisted and immutable; unavailable/unapproved/expired assets resolve to silence, never an unrelated track. Existing SQL media kind `audio` fits assets, but arbitrary provider buckets and image/text AI job tables still need the BG06 compatibility decision; no schema change assumed.

Saved preference proposal `foobow.audio.v1`: master mute/volume, per-bus mute/volume, explicit audio-enabled intent, optional music-family choice. Never save current private ritual/wish text or infer religious affiliation from playback. Preference expiry/reset and host consistency follow the theme migration inventory. No listening analytics per user by default; operational errors use cue IDs and codes, not user intentions.

Streaming/CDN: verify GET MIME, range/CORS where required, expected bytes/hash, codec decode and cache headers; prefer controlled same-site/allowlisted origin. Asset processing uses existing reviewed storage/upload pipeline, separate from background image selection. Rights revocation disables manifest eligibility and stops future loads at successful refresh; browser/offline cache limitations are documented. Keep silence as the safe rollback state.

## 7. Game, website and future-content integration

Add `audioSceneId` and allowed cue mappings to the #5 game definition, with an explicit silent fallback and disposal contract. Integrate first with landing/Today, East Lake and Wooden Fish; then migrate all ritual functions, sanctuary sound helpers, soundscape synths and chants. A game is not integrated until mute tests prove no bypass path. No need to recreate art or existing game rules to replace an audio adapter.

Map each current/future game to a music family in the table; add asset/scene compatibility validation to the existing catalog tooling when implemented. Events such as ready, accepted action, completion, pause and exit can trigger bounded cues. Scores or leaderboard milestones do not trigger louder/punitive music, and silent players receive identical credits. Background collection may suggest a family by metadata, but user choice/mute takes precedence and swapping scenery does not restart a track mid-phrase.

Native later: preserve bus/scene/consent contracts, use supported Expo audio and offline assets with cache limits, test platform interruptions and background restrictions. No forced background entitlement or app-store capability merely for ambience. Package a minimal licensed fallback set, not all collection music. Mobile work depends on web release and #44/#3 gates.

## 8. Validation, rollout and delivery tasks

Functional matrix: first visit silent; blocked autoplay; enable/disable; music-only mute; master mute across every current path; mute while fetching/decoding/fading/unlocking; route/scene changes; repeat clicks; pause/exit/dispose; resume after interruption; page reload and storage denial; two tabs; hidden-tab pause; headphones/device changes; offline/missing/corrupt/unsupported codec; CORS failure; expired rights/revoked cue; browser volume versus app volume. A queued sound after mute is a release-blocking defect.

Testing: pure bus/priority/state tests first; mocked adapters for deterministic load/cancellation; browser audio graph/state checks plus recorded/loopback or controlled manual listening to detect bypasses. Checking a muted icon or gain value alone does not prove all sound is silent. Visual equivalents, keyboard/AT, six locales, light/dark controls and 200% zoom are required. Test actual iOS Safari/Android Chrome plus desktop Chromium/Firefox/WebKit; browser automation may have different autoplay policy than real devices.

Proposed performance budgets: silent startup transfers no full tracks; initial enabled-scene first useful audio within 2s on agreed network/device, without blocking input; a two-minute compressed bed typically targeted <=3 MB subject to codec/listening review; short cue typically <=100 KB. Monitor decoded-buffer memory, CPU and battery, no accumulating contexts/listeners after 20 scene transitions, no clipped combined mix, and avoid competing with game frame budgets. Record actual encoding/device/cache/profile rather than assume compressed size equals decoded memory.

Human acceptance: 8-12 participants with different sound preferences, plus musician and accessibility review. Compare music/ambience/silent options, track scene fit, fatigue after three loops, intelligibility, control discoverability and comfort. Proposed target >=80% find mute within 5 seconds and >=75% rate scene fit 4/5 or higher; no unresolved rights, startling-volume or mute defect. Small sample is exploratory and cannot prove a wellbeing effect. Never require users to listen to test other game features.

| Task ID | Work / responsible role | Depends on | Acceptance / state |
| --- | --- | --- | --- |
| AU01 | Audit every audio path, controls and current track rights / engineering + rights review | None | Inventory contexts/elements/direct destination/timers, storage, network and all current sound sources; rights evidence gaps; Todo |
| AU02 | Sonic bible, cue map and composition briefs / musician + UX | AU01, shared art bible #7 | Twelve family directions, three pilot briefs, mute/accessibility/mix rubric, shared motif and cultural review; Todo |
| AU03 | Produce/license and approve three pilot sound scenes / musician + reviewer | AU02 | Website/East Lake/Wooden Quiet masters, looping/effects/minimal arrangements and complete composition/master-use rights; no paid provider assumed; Todo |
| AU04 | Audio processing, manifest and verified media delivery / engineering + operations | AU01, AU03, BG06/#52 | Build-dependent tools/licenses reviewed; measured renditions/loop/peak metadata, private provenance, CDN decode/range/CORS/cache and silence fallback; Todo |
| AU05 | Shared audio controller and global mute foundation / engineering | AU01 | One consent/state owner, gain buses and HTML-element adapters, cancellation and persistence, no muted-path bypass; failing tests first; Todo |
| AU06 | Scene music/ambience mixer, transitions and lifecycle / engineering | AU04, AU05 | Streaming/loop/crossfade/duck, bounded resources, owner/focus/interruption/codec failure handling; Todo |
| AU07 | Integrate current and future game/website audio adapters / engineering | AU06, game shell #9 | Pilot scenes then every current path, `audioSceneId` registry and silent future default, score parity and no direct-play bypass; Todo |
| AU08 | Accessible sound settings and persistent mute UI / UX + engineering | AU05 | Enable sound, mute all, per-bus controls, safe defaults, labels/focus/AT, reset and cross-route/tab behavior; Todo |
| AU09 | Listening, accessibility, device and performance acceptance / QA + musician | AU07, AU08 | Full functional/negative/rights/listening matrix, all-game mute coverage and resource traces; blocking defects fixed; Todo |
| AU10 | Staged web audio release and operator runbook / operations + product | AU09, API gate #20 | Approved assets, flags, budget/rights ownership, preview/live checks and instant silent rollback; Todo |
| AU11 | Deferred native audio adapter and interruption/device parity / mobile engineering | AU10, MG-F08/#44, mobile gate #3 | After web acceptance: supported Expo audio, offline rights, silent switch/audio focus/headphones/resource and AT checks; Todo, deferred |

AU10 also blocks existing native mobile spike #44. Indicative web effort with sound-design capacity: audit/brief 1-2 weeks, pilot composition/licensing 2-4, controller/mixer/adapters 2-4, listening/device/release 1-2; 6-12 weeks before overlap and provider/rights delays. Twelve full families, native parity and new music providers are outside the initial three-scene estimate. Re-estimate after AU03.

## 9. Proposed ADR 006 and tracking

Proposed decision: centralized user-controlled audio over existing platform APIs, shared scenes/buses and approved media manifest; start silent, preserve mute, provide music-only and all-sound control, integrate through game adapters. Prefer a small measured reuse of native APIs; add Howler only if compatibility/codec lifecycle savings justify it; defer Tone unless interactive musical scheduling is needed. No streaming-service scraping, browser FFmpeg bundle, extra provider, live AI soundtrack or paid engagement advantage.

Trade-offs: one controller is more migration work initially but makes reliable mute and mixing possible. Custom platform adapters must be tested across browser/native policies; licensed original music requires specialist time. Keep legacy paths behind reversible adapters until coverage passes, then remove bypasses. Silence is always functional and the first recovery action.

All implementation tasks start Todo; no playback is changed by publishing this plan.

| Task | Issue | Task | Issue |
| --- | --- | --- | --- |
| AU01 Audio/rights audit | [#74](https://github.com/chenliangela-hue/foobow/issues/74) | AU02 Sonic bible | [#75](https://github.com/chenliangela-hue/foobow/issues/75) |
| AU03 Approved pilot music | [#76](https://github.com/chenliangela-hue/foobow/issues/76) | AU04 Media pipeline | [#77](https://github.com/chenliangela-hue/foobow/issues/77) |
| AU05 Global controller/mute | [#78](https://github.com/chenliangela-hue/foobow/issues/78) | AU06 Mixer/lifecycle | [#79](https://github.com/chenliangela-hue/foobow/issues/79) |
| AU07 Game/site adapters | [#80](https://github.com/chenliangela-hue/foobow/issues/80) | AU08 User controls | [#81](https://github.com/chenliangela-hue/foobow/issues/81) |
| AU09 Listening/device QA | [#82](https://github.com/chenliangela-hue/foobow/issues/82) | AU10 Web release | [#83](https://github.com/chenliangela-hue/foobow/issues/83) |
| AU11 Deferred native | [#84](https://github.com/chenliangela-hue/foobow/issues/84) | Shared art direction | [#7](https://github.com/chenliangela-hue/foobow/issues/7) |
