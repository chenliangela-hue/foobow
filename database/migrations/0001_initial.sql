-- Foobow initial PostgreSQL schema.
-- Framework-neutral migration draft. Apply through the selected backend migration tool later.

create table users (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  email text unique nulls not distinct,
  display_name text not null,
  locale text not null default 'en',
  timezone text not null default 'America/Toronto',
  account_status text not null default 'registered' check (account_status in ('guest', 'registered', 'restricted', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index users_email_lower_unique on users (lower(email)) where email is not null;

create table profiles (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  user_id bigint not null unique references users(id) on delete cascade,
  avatar_key text,
  bio text,
  privacy_mode text not null default 'private' check (privacy_mode in ('public', 'friends_only', 'anonymous', 'private')),
  quiet_ranking_enabled boolean not null default true,
  theme_preference text not null default 'system' check (theme_preference in ('system', 'light', 'dark')),
  notification_preference text not null default 'daily' check (notification_preference in ('none', 'daily', 'campaigns')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_privacy_mode_idx on profiles (privacy_mode);

create table deed_types (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  category text not null check (category in ('animals', 'elders', 'environment', 'support', 'donation', 'remembrance')),
  description text not null,
  ritual_instructions text not null,
  default_karma_points bigint not null default 1 check (default_karma_points >= 0),
  status text not null default 'active' check (status in ('draft', 'active', 'retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index deed_types_category_status_idx on deed_types (category, status);

create table donation_campaigns (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  partner_name text not null,
  category text not null,
  verification_status text not null default 'pending_review' check (verification_status in ('unverified', 'pending_review', 'verified', 'rejected')),
  description text not null,
  target_amount numeric(12, 2),
  current_amount numeric(12, 2) not null default 0 check (current_amount >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'active', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index donation_campaigns_verified_active_idx
  on donation_campaigns (status, starts_at, ends_at)
  where verification_status = 'verified';

create table map_spots (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  category text not null,
  latitude double precision not null,
  longitude double precision not null,
  region text not null,
  story text not null,
  status text not null default 'active' check (status in ('active', 'seasonal', 'completed', 'hidden')),
  campaign_id bigint references donation_campaigns(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index map_spots_category_status_idx on map_spots (category, status);
create index map_spots_campaign_id_idx on map_spots (campaign_id);

create table mood_checkins (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  user_id bigint not null references users(id) on delete cascade,
  mood text not null check (mood in ('calm', 'heavy', 'lonely', 'grateful', 'hopeful', 'anxious')),
  note text,
  checked_in_on date not null,
  recommended_deed_type_id bigint references deed_types(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, checked_in_on)
);

create index mood_checkins_user_date_idx on mood_checkins (user_id, checked_in_on desc);
create index mood_checkins_recommended_deed_idx on mood_checkins (recommended_deed_type_id);

create table deed_actions (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  user_id bigint not null references users(id) on delete cascade,
  deed_type_id bigint not null references deed_types(id) on delete restrict,
  map_spot_id bigint references map_spots(id) on delete set null,
  status text not null default 'started' check (status in ('started', 'completed', 'journaled', 'shared')),
  visibility text not null default 'private' check (visibility in ('public', 'friends_only', 'anonymous', 'private')),
  completed_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index deed_actions_user_completed_idx on deed_actions (user_id, completed_at desc);
create index deed_actions_type_completed_idx on deed_actions (deed_type_id, completed_at desc);
create index deed_actions_spot_completed_idx on deed_actions (map_spot_id, completed_at desc);

create table karma_events (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  user_id bigint not null references users(id) on delete cascade,
  deed_action_id bigint references deed_actions(id) on delete set null,
  event_type text not null check (event_type in ('earned', 'adjusted', 'revoked')),
  points bigint not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index karma_events_user_created_idx on karma_events (user_id, created_at desc);
create index karma_events_deed_action_idx on karma_events (deed_action_id);

create table journal_entries (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  user_id bigint not null references users(id) on delete cascade,
  deed_action_id bigint references deed_actions(id) on delete set null,
  body text not null,
  visibility text not null default 'private' check (visibility in ('private', 'exported', 'deleted')),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index journal_entries_user_created_idx on journal_entries (user_id, created_at desc);
create index journal_entries_deed_action_idx on journal_entries (deed_action_id);

create table blessings (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  author_user_id bigint references users(id) on delete set null,
  body text not null,
  visibility text not null default 'anonymous' check (visibility in ('public', 'anonymous', 'private')),
  reaction_count bigint not null default 0 check (reaction_count >= 0),
  moderation_status text not null default 'visible' check (moderation_status in ('visible', 'reported', 'reviewing', 'hidden', 'removed', 'dismissed')),
  created_at timestamptz not null default now(),
  removed_at timestamptz
);

create index blessings_visible_created_idx on blessings (created_at desc) where moderation_status = 'visible';
create index blessings_author_idx on blessings (author_user_id);

create table blessing_reactions (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  blessing_id bigint not null references blessings(id) on delete cascade,
  user_id bigint not null references users(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('bless', 'support', 'thank_you', 'same_feeling')),
  created_at timestamptz not null default now(),
  unique (blessing_id, user_id, reaction_type)
);

create index blessing_reactions_user_idx on blessing_reactions (user_id);

create table donations (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  user_id bigint not null references users(id) on delete restrict,
  campaign_id bigint not null references donation_campaigns(id) on delete restrict,
  idempotency_key text not null unique,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'USD',
  payment_provider text,
  provider_payment_id text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'completed', 'failed', 'refunded')),
  receipt_url text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  updated_at timestamptz not null default now()
);

create index donations_user_created_idx on donations (user_id, created_at desc);
create index donations_campaign_status_idx on donations (campaign_id, payment_status);

create table badges (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  category text not null,
  description text not null,
  criteria jsonb not null default '{}',
  status text not null default 'active' check (status in ('draft', 'active', 'retired'))
);

create table user_badges (
  id bigint generated always as identity primary key,
  user_id bigint not null references users(id) on delete cascade,
  badge_id bigint not null references badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  visibility text not null default 'private' check (visibility in ('public', 'friends_only', 'anonymous', 'private')),
  unique (user_id, badge_id)
);

create index user_badges_badge_idx on user_badges (badge_id);

create table group_missions (
  id bigint generated always as identity primary key,
  name text not null,
  group_type text not null check (group_type in ('family', 'city', 'school', 'company', 'community')),
  category text not null,
  goal_count bigint not null check (goal_count > 0),
  current_count bigint not null default 0 check (current_count >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'open' check (status in ('open', 'active', 'completed', 'archived'))
);

create table group_memberships (
  id bigint generated always as identity primary key,
  group_mission_id bigint not null references group_missions(id) on delete cascade,
  user_id bigint not null references users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'moderator', 'member')),
  status text not null default 'active' check (status in ('invited', 'active', 'removed')),
  unique (group_mission_id, user_id)
);

create index group_memberships_user_idx on group_memberships (user_id);

create table safety_reports (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  reporter_user_id bigint references users(id) on delete set null,
  target_type text not null check (target_type in ('profile', 'blessing', 'campaign', 'deed_action', 'group_mission')),
  target_public_id text not null,
  reason text not null,
  moderation_status text not null default 'open' check (moderation_status in ('open', 'reviewing', 'actioned', 'dismissed')),
  moderator_note text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index safety_reports_status_created_idx on safety_reports (moderation_status, created_at);
create index safety_reports_reporter_idx on safety_reports (reporter_user_id);

create table subscriptions (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  user_id bigint not null references users(id) on delete restrict,
  plan text not null check (plan in ('free', 'supporter', 'family')),
  status text not null default 'trial' check (status in ('trial', 'active', 'past_due', 'canceled')),
  started_at timestamptz not null default now(),
  renews_at timestamptz,
  canceled_at timestamptz
);

create index subscriptions_user_status_idx on subscriptions (user_id, status);
