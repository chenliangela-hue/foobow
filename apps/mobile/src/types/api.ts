// Wire-format DTOs for the Foobow API (docs/openapi.json).
// Keep these snake_case and separate from the view models in ./index.ts;
// src/services/mappers.ts converts between the two.

export type ApiPageInfo = {
  next_cursor?: string | null;
  has_more?: boolean;
};

export type ApiPage<T> = {
  items: T[];
  page_info?: ApiPageInfo;
};

export type ApiDeedType = {
  id: string;
  slug: string;
  name: string;
  localized_name?: Record<string, string>;
  category: string;
  description: string;
  ritual_instructions?: string;
  default_karma_points: number;
  status: string;
};

export type ApiMapSpot = {
  id: string;
  slug: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  region?: string;
  story?: string;
  status: string;
};

export type ApiBlessing = {
  id: string;
  body: string;
  visibility: string;
  moderation_status?: string;
  created_at?: string;
};

export type ApiCheckinCreateRequest = {
  mood: string;
  note?: string;
};

export type ApiDeedActionCreateRequest = {
  deed_type_id: string;
  map_spot_id?: string;
  status: "started" | "completed";
  visibility?: "public" | "friends_only" | "anonymous" | "private";
};

export type ApiBlessingCreateRequest = {
  body: string;
  visibility: "anonymous" | "public" | "private";
};
