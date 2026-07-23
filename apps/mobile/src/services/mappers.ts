import { ApiBlessing, ApiDeedType, ApiMapSpot } from "../types/api";
import { CategoryId, Deed, MapSpot } from "../types";

type ItemCategory = Exclude<CategoryId, "all">;

const apiCategoryToLocal: Record<string, ItemCategory> = {
  animals: "animals",
  elders: "elders",
  environment: "environment",
  support: "support"
};

const categoryLabels: Record<ItemCategory, string> = {
  animals: "Animal kindness",
  elders: "Elder care",
  environment: "Environment",
  support: "Emotional support"
};

// The map view renders spots on a stylized world canvas, so real
// coordinates are projected equirectangularly and clamped away from the
// edges to keep pins fully visible.
function toCanvasPercent(longitude: number, latitude: number) {
  const x = ((longitude + 180) / 360) * 100;
  const y = ((90 - latitude) / 180) * 100;
  const clamp = (value: number) => Math.min(92, Math.max(8, Math.round(value)));
  return {
    x: `${clamp(x)}%` as MapSpot["x"],
    y: `${clamp(y)}%` as MapSpot["y"]
  };
}

export function toDeed(dto: ApiDeedType): Deed | null {
  const categoryId = apiCategoryToLocal[dto.category];
  if (!categoryId || dto.status !== "active") {
    return null;
  }
  return {
    id: dto.id,
    title: dto.name,
    categoryId,
    description: dto.description,
    points: dto.default_karma_points
  };
}

export function toMapSpot(dto: ApiMapSpot): MapSpot | null {
  const categoryId = apiCategoryToLocal[dto.category];
  if (!categoryId || dto.status !== "active") {
    return null;
  }
  return {
    id: dto.id,
    name: dto.name,
    categoryId,
    categoryLabel: categoryLabels[categoryId],
    description: dto.story ?? "",
    ...toCanvasPercent(dto.longitude, dto.latitude)
  };
}

export function toBlessingBody(dto: ApiBlessing): string | null {
  if (dto.moderation_status && dto.moderation_status !== "visible") {
    return null;
  }
  return dto.body;
}
