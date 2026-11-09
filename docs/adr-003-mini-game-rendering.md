# ADR 003: Incremental illustrated mini-game rendering

Status: Proposed; engine adoption pending benchmark task F03.
Date: 2026-11-09.
Deciders: Foobow product owner and engineering integration owner.

## Context

Foobow already ships five Canvas 2D world scenes and nine DOM/CSS/Canvas Quiet Moments. The requested improvement is understandable, attractive, repeatable play with a shared art direction. A global framework replacement does not itself solve scale, action feedback, content, accessibility or enjoyment. Web completion precedes mobile feature work.

## Proposed decision

Keep the current web shell, API, catalog and progress contracts. Extract pure portable session rules and a minimal renderer boundary on East Lake first. Keep semantic UI outside the canvas. Compare existing Canvas 2D with pinned PixiJS on equivalent content; evaluate Phaser only if its built-in game systems justify selecting it instead. Adopt at most one new web renderer after measured performance, lifecycle, accessibility, dependency and production-build review. Simple rituals retain DOM/CSS where appropriate.

Use compatible WebGL as the proposed rich-renderer baseline. WebGPU is optional and feature-detected, with an explicitly tested DOM/static core-play fallback if GPU initialization fails. Do not assume a library's Canvas fallback is production-ready. Avoid true 3D unless a tested design needs it.

Native mobile remains a later gate. Retain Expo/React Native/TypeScript architecture. Recheck the supported Expo/RN/Skia package matrix and advisories, then compare native Skia with an isolated WebView using the accepted web game. Shared rules/content/assets are feasible; shared renderer implementation is not assumed.

## Options and trade-offs

| Option | Complexity / cost | Benefits | Consequences |
| --- | --- | --- | --- |
| Current Canvas + DOM | Lowest incremental dependency cost; existing team familiarity | Offline behavior, tested shell, no new production package | More custom rendering/lifecycle code; retain if benchmark benefit is weak |
| PixiJS + semantic shell | Moderate; one renderer adapter/build integration | Sprite/texture/effect tooling matches illustrated worlds | Bundle/context/memory testing and dependency upkeep; preferred spike candidate |
| Phaser + semantic shell | Moderate/high for small rituals | More complete game lifecycle/input/tween systems | Extra framework scope and migration work; use only if it replaces enough bespoke logic |
| Three.js / full web app rewrite | High art/runtime/migration cost | Appropriate for some future spatial experiences | No demonstrated need in current loop; defer |
| One Skia renderer for web/native now | High compatibility and web startup risk | Potential renderer sharing | CanvasKit and package transition review, delayed web improvement; reject as immediate path |

MIT license metadata was observed for PixiJS, Phaser, Three.js and both Skia package names. See the dated roadmap for exact version observations, maintenance signals, limitations and source links. Dependency-tree audit, license notices, example/test evaluation and actual shipped bytes remain adoption prerequisites.

## Actions / reconsideration

- [ ] F01 preserves current launch routes, saves, rewards and test evidence.
- [ ] F02 establishes art scale and motion consistency before asset expansion.
- [ ] F03 records comparable measurements and changes this ADR to Accepted only with a justified selection.
- [ ] F04 proves the boundary in one complete game; no speculative generic engine.
- [ ] Reassess if the preferred renderer misses startup/frame/accessibility budgets, cannot recover from context loss, or adds more code than it removes.
- [ ] Mobile tasks remain blocked until the web and dependency gates are complete.

Full specification: [mini-game roadmap](mini-game-refactor-roadmap-2026-11.md).
