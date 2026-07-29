# Foobow Community — safety-by-design

## The problem

We want a RedNote (小红书) / Xiaohongshu-style visual community where people share their good deeds and support each other. But free user uploads — arbitrary text and especially arbitrary images — are the single largest legal and moderation liability a small team can take on: illegal imagery (incl. CSAM), hate speech, defamation, copyright, spam, and PII all arrive through that door, and reviewing them at scale needs staff we do not have.

Industry guidance is consistent: unmoderated UGC exposes a platform to risks that scale faster than the content itself; the safe pattern is **pre-moderation (screen before publish)** plus structured contribution, not reactive cleanup ([Concentrix](https://www.concentrix.com/insights/blog/moderating-user-generated-content/), [Mocono](https://mocono.io/how-to-handle-user-generated-content-without-legal-risks/), [2POINT](https://www.2pointagency.com/glossary/ugc-moderation-policies-comprehensive-insights-for-effective-user-generated-content-management/)).

## The solution: users share *app-generated* content, not free uploads

Instead of an upload box, the primary thing a user shares is a **Kindness Card** that Foobow generates from an action they took in the app:

- a **good deed** they completed (from our curated catalog),
- a **milestone** (a streak, a merit level),
- a **lamp lit** or **blessing kept**.

The card's imagery is **our illustration** (the deed's mark/animation), never a user photo. The text is **our template** (deed name + category + date), with at most a short **optional note** the user adds. This removes the highest-risk vectors entirely:

| Risk vector | How the design removes/limits it |
| --- | --- |
| Illegal / harmful **images** | No image upload at all. Card art is app-generated; there is no path to post a photo. |
| Hate speech / defamation / **free text** | The shared object is a structured card. Free text is limited to a short optional note and short replies, which are filtered (below). |
| Copyright | Users cannot upload media; all imagery is Foobow's own. |
| Spam / scams / links | Notes and replies reject URLs and are rate-limited. |
| PII leakage | Short fields + a client hint + server filter for emails/phone numbers. |

This is the RedNote *feel* — a warm, visual, scrollable card feed you interact with — without the RedNote *risk surface*.

## Layered controls (defence in depth)

1. **Structured contribution (primary).** Shares are app-generated cards. This is the biggest single risk reducer.
2. **No image upload.** Deferred until (and unless) we can fund image moderation; documented as an explicit product decision.
3. **Short, filtered free text.** Optional note (≤140) and replies (≤240) pass a pre-publish filter: profanity list, URL block, email/phone block, and a length/rate limit per user. Pre-moderation, not post.
4. **Curated tags only.** Users pick from our project categories; no free hashtags.
5. **Report + auto-withdraw.** Any post/reply can be reported; a report threshold auto-hides pending review (already built: reporting withdraws immediately).
6. **Server-authoritative moderation status.** Every Community Post / Reply carries a `moderation_status` from creation (see `database/migrations/0003_media_and_commerce.sql` and the ODD spec); the client never shows `hidden`/`removed` content.
7. **Optional AI triage later.** If volume grows, route only the short free-text fields through an automated classifier and queue ambiguous cases — hybrid moderation keeps cost and latency low ([Utopia](https://www.utopiaanalytics.com/article/user-generated-content-moderation), [Infosys BPM](https://www.infosysbpm.com/blogs/trust-safety/ugc-moderations.html)). The card art never needs review because we made it.

## Where enforcement lives

- **Client** provides the fast hint (disable Post on empty/oversize, strip obvious URLs) for good UX.
- **Server is authoritative**: the API re-runs the filter on submit, sets `moderation_status`, rate-limits per user, and is the only writer of the feed. The prototype demonstrates the model client-side; production must enforce it server-side because a client check is advisory only.

## Rollout

- **Now (prototype):** "Share a deed" builds a Kindness Card from a catalog deed with an optional short note; "Ask for help" stays short filtered text; no image upload anywhere. Reactions are one-press; replies are short filtered text; report withdraws.
- **Next (API):** move posts/replies to `community_posts` / `post_replies` tables with server-side filter + rate limit + moderation status; add a report threshold and an admin review queue (the admin console already has an Order-review pattern to reuse).
- **Later (optional):** curated, pre-approved sticker/illustration packs from the `public-assets` bucket if users want more expression — still no arbitrary uploads.
