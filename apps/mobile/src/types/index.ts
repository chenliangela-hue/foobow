export type CategoryId = "all" | "animals" | "elders" | "environment" | "support";
export type TabId = "today" | "map" | "deeds" | "community" | "profile";

export type Deed = {
  id: string;
  title: string;
  categoryId: Exclude<CategoryId, "all">;
  description: string;
  points: number;
};

export type MapSpot = {
  id: string;
  name: string;
  categoryId: Exclude<CategoryId, "all">;
  categoryLabel: string;
  description: string;
  x: `${number}%`;
  y: `${number}%`;
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
