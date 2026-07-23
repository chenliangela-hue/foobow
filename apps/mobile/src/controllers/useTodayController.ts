import { useState } from "react";
import { apiService, moods } from "../services/foobowService";
import { MoodOption } from "../types";

export function useTodayController(
  onKarmaAdd?: (points: number) => void,
  initialStreak = 7
) {
  const [selectedMood, setSelectedMood] = useState<MoodOption>(moods[0]);
  const [streak, setStreak] = useState(initialStreak);
  const [journal, setJournal] = useState("");

  const completeDaily = () => {
    if (onKarmaAdd) {
      onKarmaAdd(4);
    }
    setStreak((prev) => prev + 1);
    setJournal((prev) => prev || "I completed one quiet deed and chose a lighter next step.");
    void apiService.submitCheckin(selectedMood.id);
  };

  return {
    selectedMood,
    setSelectedMood,
    streak,
    journal,
    setJournal,
    completeDaily,
    moods
  };
}
