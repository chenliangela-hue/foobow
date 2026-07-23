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
  { id: "support", label: "Blessings" }
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
    description: "Release a digital fish without ecological harm.",
    points: 5
  },
  {
    id: "elder-crosswalk",
    title: "扶奶奶过马路",
    categoryId: "elders",
    description: "Guide an elder through a safe crosswalk.",
    points: 5
  },
  {
    id: "anonymous-blessing",
    title: "Anonymous blessing",
    categoryId: "support",
    description: "Send support without pressure or identity exposure.",
    points: 2
  },
  {
    id: "coastline-cleanup",
    title: "Clean a coastline",
    categoryId: "environment",
    description: "Restore a shared beach, park, or riverbank.",
    points: 4
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
    y: "43%"
  },
  {
    id: "toronto-crosswalk",
    name: "Toronto crosswalk",
    categoryId: "elders",
    categoryLabel: "Elder care",
    description: "Guide an elder safely across a winter street and add care to the elder-support layer.",
    x: "25%",
    y: "36%"
  },
  {
    id: "amazon-grove",
    name: "Amazon restoration grove",
    categoryId: "environment",
    categoryLabel: "Environment",
    description: "Water a young tree in a shared digital forest connected to environmental campaigns.",
    x: "41%",
    y: "67%"
  },
  {
    id: "night-corridor",
    name: "Night walk corridor",
    categoryId: "support",
    categoryLabel: "Emotional support",
    description: "Light a path for someone walking home with worry, grief, or loneliness.",
    x: "72%",
    y: "71%"
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
}

export const apiService = new FoobowApiService();
