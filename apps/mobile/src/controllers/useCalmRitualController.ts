import { useState } from "react";
import { apiService } from "../services/foobowService";
import { Deed } from "../types";

export function useCalmRitualController(
  selectedDeed: Deed,
  onKarmaAdd?: (points: number) => void,
  onJournalAdd?: (text: string) => void
) {
  const [soundscape, setSoundscape] = useState("Water");
  const [focusReady, setFocusReady] = useState(false);

  const startFocusSession = () => {
    setFocusReady(true);
  };

  const completeFocusedRitual = () => {
    if (!focusReady) return;
    if (onKarmaAdd) {
      onKarmaAdd(selectedDeed.points + 2);
    }
    if (onJournalAdd) {
      onJournalAdd("I took a calm moment before completing one symbolic deed.");
    }
    void apiService.submitDeedCompletion(selectedDeed.id);
    setFocusReady(false);
  };

  return {
    soundscape,
    setSoundscape,
    focusReady,
    startFocusSession,
    completeFocusedRitual
  };
}
