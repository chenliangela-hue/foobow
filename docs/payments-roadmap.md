# Foobow Payments Roadmap

Payments stay **deferred for the MVP** (`FEATURE_DONATIONS_ENABLED=false`). This note records the agreed direction so later work does not design itself into a single-provider corner.

## Principles

- Donation and subscription money is always separate from symbolic karma; copy must never imply purchasing luck, virtue, or outcomes (see product spec and `DONATION_TRANSPARENCY_COPY`).
- The API already models donations with idempotency keys and webhook-driven status; keep that provider-agnostic shape.
- Add a `payment_provider` discriminator to donation/subscription records rather than assuming Stripe.

## Provider plan

| Provider | Use | Notes |
| --- | --- | --- |
| Stripe | First card rails + subscription billing, web checkout | Test mode first; webhooks already sketched in the OpenAPI draft |
| Apple Pay | iOS wallet payments | Via Stripe Payment Request API for donations; note App Store rules: digital subscription content sold in-app must use Apple In-App Purchase, so ad-free/subscription tiers on iOS likely need StoreKit/IAP instead of card rails |
| Google Pay | Android wallet payments | Via Stripe; same store-policy caution for in-app digital subscriptions (Google Play Billing) |
| WeChat Pay | China audience donations | Requires a WeChat merchant account and likely a China-registered entity; Stripe supports WeChat Pay as a payment method in supported regions — evaluate that first before direct integration |

## Sequencing

1. Stripe test mode for verified donation campaigns (web/checkout-link first, no store-policy exposure).
2. Apple Pay / Google Pay as Stripe payment methods on the same rails.
3. Store-compliant IAP path (StoreKit + Play Billing) if in-app subscriptions ship.
4. WeChat Pay evaluation (Stripe-managed vs direct merchant integration).

## Env placeholders

`.env.local` already reserves `STRIPE_*` keys. Add provider-prefixed keys (`WECHATPAY_*`, IAP shared secrets) only when the corresponding phase starts.
