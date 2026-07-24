# Foobow AI Blessings — provider-agnostic design

Phase 3 ships the 祈福 **Blessings** experience (Pray for someone, Wish lamp) with the full UI/UX and a **mock blessing engine**, so it works today with **no API key**. The design is provider-agnostic: any one of several AI providers can power it later by supplying that provider's **API key**.

## How generation works

`prototype/app/app.js` defines `blessingEngine`:

- **Mock mode (default, now):** composes a warm, symbolic, locale-aware blessing locally from curated line sets (`BLESSING_LINES`). No network, no key. Every line is gentle reflection — it never promises luck, virtue, health, or outcomes.
- **Live mode (later):** the same `generate({ category, recipient, message, locale })` call routes through the backend — `POST {apiBase}/blessings/intentions` — which calls the configured model and returns the same `{ text }` shape. The result is persisted to the `ai_generations` table (Phase 2) with token counts and `cost_usd` for budgeting, and is moderated before display.

Swapping mock → live is a single call-site change plus server configuration; the UI does not change.

## Cost model: generate once, serve forever (default)

The product is designed so **runtime AI token spend is zero**, which is the default posture — not a fallback:

1. **Author content once, offline.** AI-written lines (blessings, deed reflections, lamp whispers, prompts) are generated during development and committed to [`content/blessing-pack.v1.json`](../content/blessing-pack.v1.json).
2. **Publish to object storage.** `npm --prefix apps/api run content:upload` pushes the pack to the `public-assets` bucket, served over CDN at `…/object/public/public-assets/content/blessing-pack.v1.json`.
3. **The app reads the pack, not a model.** It fetches the pack once per session and picks lines locally. Every user shares the same pre-generated content, so cost does not scale with traffic. If the CDN is unreachable the UI simply omits the extra line.
4. **Growing the library costs nothing at runtime.** Add lines to the pack, re-run the upload, and every client picks them up — no code deploy, no per-request model calls.

If live per-user generation is enabled later, keep the bill bounded by: caching responses by `(category, locale, recipient-less)` so common requests are served from the pack; rate-limiting per user; capping `max_tokens`; and tracking `cost_usd` per row in `ai_generations` (Phase 2 schema) so spend is visible before it is surprising.

## Providers and keys

The provider is chosen server-side and is pluggable. Add whichever key(s) you want to use:

| Provider | Model family | Env var (server) |
| --- | --- | --- |
| Anthropic | Claude | `ANTHROPIC_API_KEY` |
| OpenAI | GPT / ChatGPT | `OPENAI_API_KEY` |
| Google | Gemini | `GEMINI_API_KEY` |

A `BLESSING_AI_PROVIDER` setting selects the active one; the server normalizes each provider's response to `{ text, input_tokens, output_tokens }`.

### Note on "OAuth of ChatGPT / Claude / Gemini"

The consumer sign-ins for the ChatGPT app, Claude, or the Gemini app are **not** a supported way to call those models programmatically from a product — they authenticate a person in a chat UI, not an application. Production generation needs a provider **API key** (above). Because the engine is provider-agnostic, you can start with any single key and add others later without touching the UI. Until a key is added, the mock engine keeps the whole feature usable.

## Safety rules (all providers)

- Warm reflection only — never predictions, guarantees, or "buying luck".
- Locale-aware output; keep the symbolic-comfort disclaimer visible.
- Rate-limit and cost-track every call (`ai_generations`); run long generations through a background job queue.
- Moderate output before display; user photos stay in the private `user-uploads` bucket and are opt-in.

## Images

Text generation is live-ready via the providers above. "Upload a photo → new blessing image" needs a separate image model (a diffusion API); the media pipeline (private `user-uploads` / `ai-generated` buckets, `media_assets`) is already in place from Phase 2, so an image provider can be added without schema changes.
