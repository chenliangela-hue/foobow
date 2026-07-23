import { useEffect, useMemo, useState } from "react";
import { apiService, mapSpots as fallbackSpots } from "../services/foobowService";
import { CategoryId, MapSpot } from "../types";

export function useMapController() {
  const [mapSpots, setMapSpots] = useState<MapSpot[]>(fallbackSpots);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [selectedSpotId, setSelectedSpotId] = useState(fallbackSpots[0].id);

  useEffect(() => {
    let active = true;
    apiService.getMapSpots().then((items) => {
      if (active) setMapSpots(items);
    });
    return () => {
      active = false;
    };
  }, []);

  const visibleSpots = useMemo(
    () => mapSpots.filter((spot) => activeCategory === "all" || spot.categoryId === activeCategory),
    [mapSpots, activeCategory]
  );

  const selectedSpot: MapSpot = useMemo(
    () => visibleSpots.find((spot) => spot.id === selectedSpotId) || visibleSpots[0] || mapSpots[0],
    [visibleSpots, selectedSpotId, mapSpots]
  );

  const chooseCategory = (categoryId: CategoryId) => {
    const nextSpots = mapSpots.filter((spot) => categoryId === "all" || spot.categoryId === categoryId);
    setActiveCategory(categoryId);
    setSelectedSpotId(nextSpots[0]?.id || mapSpots[0].id);
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
