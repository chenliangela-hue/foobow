import { Deed, MapSpot, CategoryOption, MoodOption } from "../types";
import {
  ApiBlessing,
  ApiBlessingCreateRequest,
  ApiCheckinCreateRequest,
  ApiDeedActionCreateRequest,
  ApiDeedType,
  ApiMapSpot,
  ApiPage
} from "../types/api";
import { apiGet, apiPost } from "./apiClient";
import { toBlessingBody, toDeed, toMapSpot } from "./mappers";

export const categories: CategoryOption[] = [
  { id: "all", label: "All" },
  { id: "animals", label: "Animals" },
  { id: "elders", label: "Elders" },
  { id: "environment", label: "Nature" },
  { id: "community", label: "Community" },
  { id: "learning", label: "Learning" }
];

export const moods: MoodOption[] = [
  { id: "calm", label: "Calm", deed: "Release fish at East Lake" },
  { id: "heavy", label: "Heavy", deed: "Light a path home" },
  { id: "lonely", label: "Lonely", deed: "Send an anonymous blessing" },
  { id: "grateful", label: "Grateful", deed: "Help elder cross safely" }
];

export const deeds: Deed[] = [
  {
    id: "release-fish",
    title: "Virtual 放生",
    categoryId: "animals",
    description: "Release a digital fish into a selected lake or river.",
    shortDescription: "Release a digital fish without ecological harm.",
    points: 5,
    mark: "water"
  },
  {
    id: "elder-crosswalk",
    title: "扶奶奶过马路",
    categoryId: "elders",
    description: "Guide an elder through a calm crosswalk scene.",
    shortDescription: "Guide an elder through a safe crosswalk.",
    points: 5,
    mark: "elder"
  },
  {
    id: "anonymous-blessing",
    title: "Anonymous blessing",
    categoryId: "community",
    description: "Send one quiet supportive sentence to another user.",
    shortDescription: "Send support without pressure or identity exposure.",
    points: 2,
    mark: "blessing"
  },
  {
    id: "coastline-cleanup",
    title: "Clean a coastline",
    categoryId: "environment",
    description: "Remove virtual litter from a beach and add to a city mission.",
    shortDescription: "Restore a shared beach, park, or riverbank.",
    points: 4,
    mark: "earth"
  },
  {
    id: "shelter-day",
    title: "Sponsor a shelter day",
    categoryId: "animals",
    description: "Symbolically sponsor a day of food and shelter for a rescue animal.",
    shortDescription: "Cover a rescue animal's food and warmth for a day.",
    points: 5,
    mark: "paw"
  },
  {
    id: "walk-neighbour-dog",
    title: "Walk a neighbour's dog",
    categoryId: "animals",
    description: "Take a neighbour's dog for a gentle walk and let both of them rest easier.",
    shortDescription: "Offer to walk a dog whose owner is unwell or away.",
    points: 3,
    mark: "paw"
  },
  {
    id: "winter-birds",
    title: "Feed the winter birds",
    categoryId: "animals",
    description: "Scatter a little seed so small birds find food through the cold.",
    shortDescription: "Leave seed out for birds on a cold day.",
    points: 2,
    mark: "bird"
  },
  {
    id: "call-elder",
    title: "Call an elder to listen",
    categoryId: "elders",
    description: "Call an elder with no agenda but to listen — the visit is the gift.",
    shortDescription: "Phone an older relative just to hear their day.",
    points: 3,
    mark: "elder"
  },
  {
    id: "teach-phone",
    title: "Teach a phone trick",
    categoryId: "elders",
    description: "Patiently teach an older person one small thing that makes their phone kinder.",
    shortDescription: "Show an elder one useful thing on their phone.",
    points: 3,
    mark: "phone"
  },
  {
    id: "care-home-flowers",
    title: "Bring flowers to a care home",
    categoryId: "elders",
    description: "Bring a few fresh flowers to a care home so residents can enjoy them.",
    shortDescription: "Leave fresh flowers where elders can enjoy them.",
    points: 4,
    mark: "flower"
  },
  {
    id: "plant-tree",
    title: "Plant a tree",
    categoryId: "environment",
    description: "Plant a young tree in the shared forest, tied to real reforestation partners.",
    shortDescription: "Add a young tree to the shared digital forest.",
    points: 5,
    mark: "leaf"
  },
  {
    id: "unplug-devices",
    title: "Unplug idle devices",
    categoryId: "environment",
    description: "Unplug the devices quietly drawing power, and let the night be a little lighter.",
    shortDescription: "Switch off what you are not using tonight.",
    points: 2,
    mark: "leaf"
  },
  {
    id: "litter-five",
    title: "Pick up five pieces of litter",
    categoryId: "environment",
    description: "Pick up five pieces of litter on your way and leave the path a little cleaner.",
    shortDescription: "Leave a small patch cleaner than you found it.",
    points: 3,
    mark: "earth"
  },
  {
    id: "food-drive",
    title: "Add to a food drive",
    categoryId: "community",
    description: "Add non-perishable food to a drive so a neighbour's shelf is not empty.",
    shortDescription: "Contribute a tin to a local food drive.",
    points: 4,
    mark: "meal"
  },
  {
    id: "soup-kitchen",
    title: "Serve at a soup kitchen",
    categoryId: "community",
    description: "Offer an hour at a soup kitchen where a warm meal meets a hard day.",
    shortDescription: "Give an hour where warm meals are shared.",
    points: 5,
    mark: "meal"
  },
  {
    id: "carry-groceries",
    title: "Carry a neighbour's groceries",
    categoryId: "community",
    description: "Notice a neighbour with heavy bags and carry them the last stretch home.",
    shortDescription: "Help someone home with a heavy bag.",
    points: 3,
    mark: "hands"
  },
  {
    id: "read-aloud",
    title: "Read aloud to a child",
    categoryId: "learning",
    description: "Read a story aloud to a child and let the world stay small and safe for a while.",
    shortDescription: "Share a story with a child who needs one.",
    points: 4,
    mark: "book"
  },
  {
    id: "share-skill",
    title: "Teach a skill you love",
    categoryId: "learning",
    description: "Teach a skill you love to someone who wants to learn it — knowledge shared is doubled.",
    shortDescription: "Pass on one thing you know to someone eager.",
    points: 4,
    mark: "book"
  },
  {
    id: "donate-book",
    title: "Donate a book you loved",
    categoryId: "learning",
    description: "Pass a book you loved to a library or a stranger so it finds a new reader.",
    shortDescription: "Give a loved book a second reader.",
    points: 3,
    mark: "book"
  }
];

export const mapSpots: MapSpot[] = [
  {
    id: "east-lake",
    name: "East Lake, Wuhan",
    categoryId: "animals",
    categoryLabel: "Animal kindness",
    description: "Release a digital fish into the lake and add one ripple to the shared kindness map.",
    x: "58%",
    y: "43%",
    ripples: 1280,
    latitude: 30.5539,
    longitude: 114.3644,
    coordinates: "30.5539° N, 114.3644° E",
    sanctuary: "Lotus Lake Sanctuary (东湖莲池净域)",
    environment: "Freshwater aquatic sanctuary & wetland biosphere"
  },
  {
    id: "toronto-crosswalk",
    name: "Toronto crosswalk",
    categoryId: "elders",
    categoryLabel: "Elder care",
    description: "Guide an elder safely across a winter street and add care to the elder-support layer.",
    x: "25%",
    y: "36%",
    ripples: 840,
    latitude: 43.6532,
    longitude: -79.3832,
    coordinates: "43.6532° N, 79.3832° W",
    sanctuary: "Compassion Crosswalk (多伦多慈爱驿站)",
    environment: "Winter pedestrian safety corridor & elder care network"
  },
  {
    id: "amazon-grove",
    name: "Amazon restoration grove",
    categoryId: "environment",
    categoryLabel: "Environment",
    description: "Water a young tree in a shared digital forest connected to environmental campaigns.",
    x: "41%",
    y: "67%",
    ripples: 2190,
    latitude: -3.4653,
    longitude: -62.2159,
    coordinates: "3.4653° S, 62.2159° W",
    sanctuary: "Bodhi Forest Sanctuary (亚马逊菩提林苑)",
    environment: "Tropical rainforest canopy & carbon stewardship zone"
  },
  {
    id: "night-corridor",
    name: "Night walk corridor",
    categoryId: "community",
    categoryLabel: "Emotional support",
    description: "Light a path for someone walking home with worry, grief, or loneliness.",
    x: "72%",
    y: "71%",
    ripples: 1650,
    latitude: 35.0116,
    longitude: 135.7681,
    coordinates: "35.0116° N, 135.7681° E",
    sanctuary: "Metta Lantern Corridor (夜行心灯长廊)",
    environment: "Pedestrian illumination trail & quiet companionship route"
  },
  {
    id: "reading-room",
    name: "Shared reading room",
    categoryId: "learning",
    categoryLabel: "Learning",
    description: "Read aloud, share a skill, or pass on a loved book in a shared learning corner.",
    x: "50%",
    y: "50%",
    ripples: 520,
    latitude: 51.7548,
    longitude: -1.2544,
    coordinates: "51.7548° N, 1.2544° W",
    sanctuary: "Wisdom Reading Sanctuary (般若智慧伴读舍)",
    environment: "Intergenerational literacy room & community archive"
  }
];

export const initialBlessings = [
  "May your next step feel lighter than the last.",
  "For anyone carrying guilt today: one kind action is still real."
];

export class FoobowApiService {
  async getDeeds(): Promise<Deed[]> {
    const result = await apiGet<ApiPage<ApiDeedType>>("/deed-types");
    if (result.ok && Array.isArray(result.data.items)) {
      const mapped = result.data.items.map(toDeed).filter((deed): deed is Deed => deed !== null);
      if (mapped.length > 0) return mapped;
    }
    return deeds;
  }

  async getMapSpots(): Promise<MapSpot[]> {
    const result = await apiGet<ApiPage<ApiMapSpot>>("/map-spots");
    if (result.ok && Array.isArray(result.data.items)) {
      const mapped = result.data.items.map(toMapSpot).filter((spot): spot is MapSpot => spot !== null);
      if (mapped.length > 0) return mapped;
    }
    return mapSpots;
  }

  async getBlessings(): Promise<string[]> {
    const result = await apiGet<ApiPage<ApiBlessing>>("/blessings");
    if (result.ok && Array.isArray(result.data.items)) {
      const mapped = result.data.items
        .map(toBlessingBody)
        .filter((body): body is string => body !== null);
      if (mapped.length > 0) return mapped;
    }
    return initialBlessings;
  }

  async submitCheckin(mood: string, note?: string): Promise<boolean> {
    const body: ApiCheckinCreateRequest = note ? { mood, note } : { mood };
    const result = await apiPost("/checkins", body);
    return result.ok;
  }

  async submitDeedCompletion(deedTypeId: string, mapSpotId?: string): Promise<boolean> {
    const body: ApiDeedActionCreateRequest = {
      deed_type_id: deedTypeId,
      ...(mapSpotId ? { map_spot_id: mapSpotId } : {}),
      status: "completed",
      visibility: "anonymous"
    };
    const result = await apiPost("/deed-actions", body);
    return result.ok;
  }

  async submitBlessing(bodyText: string): Promise<boolean> {
    const body: ApiBlessingCreateRequest = { body: bodyText, visibility: "anonymous" };
    const result = await apiPost("/blessings", body);
    return result.ok;
  }

  async syncState(data: { karma: number; streak: number; journal?: string; rituals_completed?: string[] }) {
    const result = await apiPost<{ status: string; merged: Record<string, unknown> }>("/sync", data);
    return result;
  }

  async startFocusSession(soundscape?: string, durationSeconds?: number) {
    const result = await apiPost<{ focus_session: { id: string } }>("/focus-sessions", {
      soundscape_slug: soundscape,
      target_duration_seconds: durationSeconds ?? 20
    });
    return result;
  }

  async completeFocusSession(sessionId: string, elapsedSeconds: number, reflectionMood?: string) {
    const result = await apiPost(`/focus-sessions/${sessionId}/complete`, {
      elapsed_seconds: elapsedSeconds,
      reflection_mood: reflectionMood
    });
    return result;
  }
}

export const apiService = new FoobowApiService();
