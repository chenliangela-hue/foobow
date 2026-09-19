export type CategoryId = "all" | "animals" | "elders" | "environment" | "community" | "learning" | "support";
export type TabId = "today" | "blessings" | "map" | "deeds" | "community" | "profile";

export type BlessingCategory = "family" | "health" | "study" | "travel" | "remembrance" | "gratitude";

export type BlessingIntention = {
  id: string;
  category: BlessingCategory;
  recipient?: string;
  message?: string;
  replyText: string;
  createdAt: string;
};

export type WishLamp = {
  id: string;
  wish: string;
  createdAt: string;
};

export type Deed = {
  id: string;
  title: string;
  categoryId: Exclude<CategoryId, "all">;
  description: string;
  shortDescription?: string;
  points: number;
  mark?: string;
};

export type MapSpot = {
  id: string;
  name: string;
  categoryId: Exclude<CategoryId, "all">;
  categoryLabel: string;
  description: string;
  x: `${number}%`;
  y: `${number}%`;
  ripples?: number;
  latitude?: number;
  longitude?: number;
  coordinates?: string;
  sanctuary?: string;
  environment?: string;
};

export type CategoryOption = {
  id: CategoryId;
  label: string;
};

export type MoodOption = {
  id: string;
  label: string;
  deed: string;
};

export type UserProfile = {
  karma: number;
  streak: number;
  journal: string;
  quietMode: boolean;
  privateJournal: boolean;
  seniorMode: boolean;
};
