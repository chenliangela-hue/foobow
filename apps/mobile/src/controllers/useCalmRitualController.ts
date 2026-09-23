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
  const [sessionId, setSessionId] = useState<string | null>(null);

  const startFocusSession = () => {
    setFocusReady(true);
    void apiService.startFocusSession(soundscape.toLowerCase(), 20).then((res) => {
      if (res.ok && res.data?.focus_session?.id) {
        setSessionId(res.data.focus_session.id);
      }
    });
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
    if (sessionId) {
      void apiService.completeFocusSession(sessionId, 20, "calm");
      setSessionId(null);
    }
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
