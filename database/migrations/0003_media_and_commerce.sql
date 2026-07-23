-- Foobow media, AI, blessings, commerce, and admin schema.
-- Phase 2 of the 福报 elevation. Enterprise principles:
--   * Binaries (images/gifs/short video/Lottie/audio) NEVER live in the
--     database. `media_assets` stores only object-storage metadata; bytes
--     live in Supabase Storage buckets and are served via CDN (public
--     bucket) or short-lived signed URLs (private buckets).
--   * All money paths carry an idempotency key. Symbolic karma is never
--     purchasable; only real donations and optional premium content are.
--   * User-generated and AI content carry a moderation status.
--   * AI generations track tokens and cost for per-request budgeting.

-- ---------------------------------------------------------------------------
-- Media registry (object-storage pointers only, never blobs)
-- ---------------------------------------------------------------------------
create table media_assets (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  owner_user_id bigint references users(id) on delete set null,
  bucket text not null check (bucket in ('public-assets', 'user-uploads', 'ai-generated')),
  storage_key text not null,
  kind text not null check (kind in ('image', 'gif', 'video', 'lottie', 'audio')),
  content_type text not null,
  byte_size bigint not null default 0 check (byte_size >= 0),
  width integer check (width is null or width >= 0),
  height integer check (height is null or height >= 0),
  duration_ms integer check (duration_ms is null or duration_ms >= 0),
  checksum_sha256 text,
  alt_text text,
  status text not null default 'pending' check (status in ('pending', 'ready', 'quarantined', 'removed')),
  moderation_status text not null default 'visible' check (moderation_status in ('visible', 'reported', 'reviewing', 'hidden', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, storage_key)
);

create index media_assets_owner_idx on media_assets (owner_user_id, created_at desc);
create index media_assets_bucket_status_idx on media_assets (bucket, status);

-- ---------------------------------------------------------------------------
-- AI generations (warm reflections; never predictions or guaranteed outcomes)
-- ---------------------------------------------------------------------------
create table ai_generations (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  user_id bigint references users(id) on delete set null,
  kind text not null check (kind in ('blessing_reply', 'deed_reflection', 'wish_lamp_reply', 'daily_blessing')),
  locale text not null default 'en',
  prompt_context jsonb not null default '{}',
  model text not null,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  cost_usd numeric(10, 4) not null default 0 check (cost_usd >= 0),
  response_text text,
  status text not null default 'pending' check (status in ('pending', 'streaming', 'complete', 'failed', 'moderated')),
  moderation_status text not null default 'visible' check (moderation_status in ('visible', 'reported', 'reviewing', 'hidden', 'removed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index ai_generations_user_created_idx on ai_generations (user_id, created_at desc);
create index ai_generations_kind_created_idx on ai_generations (kind, created_at desc);

-- ---------------------------------------------------------------------------
-- Blessing intentions ("Pray for my family", etc.)
-- ---------------------------------------------------------------------------
create table blessing_intentions (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  user_id bigint not null references users(id) on delete cascade,
  category text not null check (category in ('family', 'health', 'study', 'travel', 'remembrance', 'gratitude', 'general')),
  recipient_label text,
  message text,
  locale text not null default 'en',
  ai_generation_id bigint references ai_generations(id) on delete set null,
  media_asset_id bigint references media_assets(id) on delete set null,
  visibility text not null default 'private' check (visibility in ('private', 'anonymous', 'public')),
  status text not null default 'active' check (status in ('active', 'archived', 'removed')),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index blessing_intentions_user_created_idx on blessing_intentions (user_id, created_at desc);
create index blessing_intentions_category_idx on blessing_intentions (category, created_at desc);

-- ---------------------------------------------------------------------------
-- Wish lamps (心灯) — symbolic offerings that expire
-- ---------------------------------------------------------------------------
create table wish_lamps (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  user_id bigint not null references users(id) on delete cascade,
  lamp_type text not null check (lamp_type in ('peace', 'health', 'study', 'safe_travel', 'remembrance', 'gratitude')),
  wish_text text,
  locale text not null default 'en',
  media_asset_id bigint references media_assets(id) on delete set null,
  ai_generation_id bigint references ai_generations(id) on delete set null,
  lit_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

create index wish_lamps_user_lit_idx on wish_lamps (user_id, lit_at desc);
create index wish_lamps_active_idx on wish_lamps (expires_at) where wish_text is not null;

-- ---------------------------------------------------------------------------
-- Commerce: catalog (商品定价) and orders (订单). Symbolic + charity only.
-- ---------------------------------------------------------------------------
create table catalog_items (
  id bigint generated always as identity primary key,
  slug text not null unique,
  kind text not null check (kind in ('donation', 'premium_pack', 'lamp_offering', 'subscription')),
  name text not null,
  description text,
  price_amount numeric(12, 2) not null default 0 check (price_amount >= 0),
  currency text not null default 'USD',
  billing_interval text not null default 'one_time' check (billing_interval in ('one_time', 'monthly', 'yearly')),
  status text not null default 'active' check (status in ('active', 'hidden', 'retired')),
  sort_order integer not null default 0,
  media_asset_id bigint references media_assets(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index catalog_items_kind_status_idx on catalog_items (kind, status, sort_order);

create table orders (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  user_id bigint references users(id) on delete set null,
  catalog_item_id bigint references catalog_items(id) on delete set null,
  item_kind text not null,
  amount numeric(12, 2) not null default 0 check (amount >= 0),
  currency text not null default 'USD',
  payment_provider text check (payment_provider in ('stripe', 'applepay', 'googlepay', 'wechatpay', 'manual')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  review_status text not null default 'none' check (review_status in ('none', 'pending', 'approved', 'rejected')),
  idempotency_key text not null unique,
  external_ref text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  reviewed_at timestamptz
);

create index orders_payment_status_created_idx on orders (payment_status, created_at desc);
create index orders_user_created_idx on orders (user_id, created_at desc);
create index orders_review_status_idx on orders (review_status, created_at desc);

-- ---------------------------------------------------------------------------
-- Admin backend: operators and audit log (审计日志)
-- ---------------------------------------------------------------------------
create table admin_users (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  email text not null unique,
  display_name text not null,
  role text not null default 'reviewer' check (role in ('owner', 'admin', 'reviewer')),
  status text not null default 'active' check (status in ('active', 'suspended')),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index admin_users_email_lower_unique on admin_users (lower(email));

create table admin_audit_log (
  id bigint generated always as identity primary key,
  admin_user_id bigint references admin_users(id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  detail jsonb not null default '{}',
  ip_address text,
  created_at timestamptz not null default now()
);

create index admin_audit_log_admin_created_idx on admin_audit_log (admin_user_id, created_at desc);
create index admin_audit_log_target_idx on admin_audit_log (target_type, target_id);
