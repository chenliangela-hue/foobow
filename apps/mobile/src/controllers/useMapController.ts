import { useMemo, useState } from "react";
import { mapSpots } from "../services/foobowService";
import { CategoryId, MapSpot } from "../types";

export function useMapController() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [selectedSpotId, setSelectedSpotId] = useState("east-lake");

  const visibleSpots = useMemo(
    () => mapSpots.filter((spot) => activeCategory === "all" || spot.categoryId === activeCategory),
    [activeCategory]
  );

  const selectedSpot: MapSpot = useMemo(
    () => visibleSpots.find((spot) => spot.id === selectedSpotId) || visibleSpots[0] || mapSpots[0],
    [visibleSpots, selectedSpotId]
  );

  const chooseCategory = (categoryId: CategoryId) => {
    const nextSpots = mapSpots.filter((spot) => categoryId === "all" || spot.categoryId === categoryId);
    setActiveCategory(categoryId);
    setSelectedSpotId(nextSpots[0]?.id || "east-lake");
  };

  return {
    activeCategory,
    selectedSpotId,
    setSelectedSpotId,
    visibleSpots,
    selectedSpot,
    chooseCategory
  };
}
