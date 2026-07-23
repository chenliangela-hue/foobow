import { useEffect, useMemo, useState } from "react";
import { apiService, deeds as fallbackDeeds } from "../services/foobowService";
import { CategoryId, Deed } from "../types";

export function useDeedController(onKarmaAdd?: (points: number) => void) {
  const [deeds, setDeeds] = useState<Deed[]>(fallbackDeeds);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [selectedDeedId, setSelectedDeedId] = useState(fallbackDeeds[0].id);

  useEffect(() => {
    let active = true;
    apiService.getDeeds().then((items) => {
      if (active) setDeeds(items);
    });
    return () => {
      active = false;
    };
  }, []);

  const visibleDeeds = useMemo(
    () => deeds.filter((deed) => activeCategory === "all" || deed.categoryId === activeCategory),
    [deeds, activeCategory]
  );

  const selectedDeed: Deed = useMemo(
    () => visibleDeeds.find((deed) => deed.id === selectedDeedId) || visibleDeeds[0] || deeds[0],
    [visibleDeeds, selectedDeedId, deeds]
  );

  const chooseCategory = (categoryId: CategoryId) => {
    const nextDeeds = deeds.filter((deed) => categoryId === "all" || deed.categoryId === categoryId);
    setActiveCategory(categoryId);
    setSelectedDeedId(nextDeeds[0]?.id || deeds[0].id);
  };

  const performRitual = () => {
    if (onKarmaAdd) {
      onKarmaAdd(selectedDeed.points);
    }
    void apiService.submitDeedCompletion(selectedDeed.id);
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
