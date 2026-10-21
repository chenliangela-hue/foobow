# Web Peace Game Research

Date: 2026-10-17
Scope: lightweight web interactions that support kindness, joy, reflection, and calm. Mobile implementation remains deferred.

## Product principles

- Keep each experience optional, short, and useful without an account.
- Reward presence and real-world follow-through without competitive pressure or claims of guaranteed emotional outcomes.
- Store private reflection text only when the user clearly chooses to save it. Prefer device-local counters for lightweight rituals.
- Reuse the current Foobow ritual focus view, localization, keyboard behavior, reduced-motion support, and browser persistence.

## Evidence and content candidates

| Candidate | Evidence or source | Strengths to reuse | Limits to avoid | Decision |
| --- | --- | --- | --- | --- |
| Gratitude Pebble Garden | [Greater Good in Action: Three Good Things](https://ggia.berkeley.edu/practice/three-good-things) | Three concrete positive moments, brief written reflection, daily cadence | Do not promise happiness or keep private text without clear consent | **Adapt now.** Convert three moments into tactile pebbles and persist only a completion count. |
| Kindness Quest Cards | [Random Acts of Kindness Foundation printables](https://www.randomactsofkindness.org/printables) and a [prosociality meta-analysis](https://pubmed.ncbi.nlm.nih.gov/32881540/) | A small real-world deed, voluntary choice, varied recipients | Research effects are modest and variable; do not imply that every act improves mood | **Adapted.** Nine original prompts across Nearby, At Home, and Reach Out; rewards occur only after the user confirms real completion. |
| Five Senses Grounding Garden | [WHO: Doing What Matters in Times of Stress](https://www.who.int/thailand/activities/doing-what-matters-in-times-of-stress) | Simple grounding, values, kindness, and a few-minutes format | Avoid clinical positioning, breath-hold requirements, or replacing professional care | **Adapted.** A five-stop sensory path with notice and skip controls, neutral wellbeing copy, and no forced breathing. |
| Community Kindness Mosaic | [KIND Challenge randomized trial](https://pubmed.ncbi.nlm.nih.gov/39158741/) | One voluntary act per week and visible community connection | Effects varied by country; anonymous activity must be moderated and cannot verify impact automatically | **Plan after account and moderation gates.** Aggregate verified action types, never private reflections. |
| Loving-Kindness Lantern | [Online loving-kindness randomized trial](https://pubmed.ncbi.nlm.nih.gov/27333950/) | Short wishes for self, a close person, and the wider world | Foobow already has wish lamps and blessing flows, so another standalone version would duplicate them | **Merge later.** Add a three-recipient mode to the existing lantern instead of a new game. |

## Open-source pattern review

| Candidate | Maintenance and adoption signal | License and fit | Recommendation |
| --- | --- | --- | --- |
| [Presently](https://github.com/alisonthemonster/Presently) | Large Android history, hundreds of stars, strong local-first and test practices | The repository did not expose a clear license during review; it is also Android-specific | **Reject code reuse.** Keep the privacy lesson: entries should stay under the user's control. |
| [Unfold](https://github.com/vanshika114/unfolddd) | Recent lightweight web project with offline local storage and several wellbeing flows | MIT, but its broad dashboard and mixed frameworks would add overlapping scope | **Adapt the small-pattern approach only.** No code copied and no dependency added. |
| [Taskly](https://github.com/TobiOparinde/Taskly---Daily-Journal-Planner) | Recent project with 31 documented tests, local storage, and three gratitude prompts | React/Firebase stack is heavier than Foobow's static prototype, and adoption is currently minimal | **Reject as a dependency.** The three-prompt structure validates a familiar interaction pattern. |
| [CoupleCards](https://github.com/qiaeru/couplecards) | Recently maintained, mobile-first card drawing with keyboard and screen-reader support | MIT; its relationship content does not fit Foobow, while the draw/reveal pattern does | **Adapt the interaction pattern only.** No code copied and no dependency added. |

## Delivery order

1. Gratitude Pebble Garden: private three-moment ritual, complete in the current slice.
2. Kindness Quest Cards: original deed deck with truthful completion, completed in this slice.
3. Five Senses Grounding Garden: accessibility-first, skip-friendly sensory path, completed in this slice.
4. Community Kindness Mosaic: only after production identity, moderation, and privacy controls are ready.

No third-party production dependency or copied source code is needed for the first three experiences.
