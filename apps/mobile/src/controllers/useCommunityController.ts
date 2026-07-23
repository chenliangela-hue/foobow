import { useEffect, useState } from "react";
import { apiService, initialBlessings } from "../services/foobowService";

export function useCommunityController(onKarmaAdd?: (points: number) => void) {
  const [blessingInput, setBlessingInput] = useState("");
  const [blessings, setBlessings] = useState<string[]>(initialBlessings);

  useEffect(() => {
    let active = true;
    apiService.getBlessings().then((items) => {
      if (active) setBlessings(items);
    });
    return () => {
      active = false;
    };
  }, []);

  const sendBlessing = () => {
    const message = blessingInput.trim();
    if (!message) return;
    setBlessings((items) => [message, ...items]);
    setBlessingInput("");
    if (onKarmaAdd) {
      onKarmaAdd(2);
    }
    void apiService.submitBlessing(message);
  };

  return {
    blessingInput,
    setBlessingInput,
    blessings,
    sendBlessing
  };
}
