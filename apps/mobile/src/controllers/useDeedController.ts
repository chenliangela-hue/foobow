import { useMemo, useState } from "react";
import { deeds } from "../services/foobowService";
import { CategoryId, Deed } from "../types";

export function useDeedController(onKarmaAdd?: (points: number) => void) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [selectedDeedId, setSelectedDeedId] = useState("release-fish");

  const visibleDeeds = useMemo(
    () => deeds.filter((deed) => activeCategory === "all" || deed.categoryId === activeCategory),
    [activeCategory]
  );

  const selectedDeed: Deed = useMemo(
    () => visibleDeeds.find((deed) => deed.id === selectedDeedId) || visibleDeeds[0] || deeds[0],
    [visibleDeeds, selectedDeedId]
  );

  const chooseCategory = (categoryId: CategoryId) => {
    const nextDeeds = deeds.filter((deed) => categoryId === "all" || deed.categoryId === categoryId);
    setActiveCategory(categoryId);
    setSelectedDeedId(nextDeeds[0]?.id || "release-fish");
  };

  const performRitual = () => {
    if (onKarmaAdd) {
      onKarmaAdd(selectedDeed.points);
    }
  };

  return {
    activeCategory,
    selectedDeedId,
    setSelectedDeedId,
    visibleDeeds,
    selectedDeed,
    chooseCategory,
    performRitual
  };
}
