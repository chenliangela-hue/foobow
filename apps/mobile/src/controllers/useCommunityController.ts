import { useState } from "react";
import { initialBlessings } from "../services/foobowService";

export function useCommunityController(onKarmaAdd?: (points: number) => void) {
  const [blessingInput, setBlessingInput] = useState("");
  const [blessings, setBlessings] = useState<string[]>(initialBlessings);

  const sendBlessing = () => {
    const message = blessingInput.trim();
    if (!message) return;
    setBlessings((items) => [message, ...items]);
    setBlessingInput("");
    if (onKarmaAdd) {
      onKarmaAdd(2);
    }
  };

  return {
    blessingInput,
    setBlessingInput,
    blessings,
    sendBlessing
  };
}
