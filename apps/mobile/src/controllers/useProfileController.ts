import { useState } from "react";

export function useProfileController() {
  const [quietMode, setQuietMode] = useState(true);
  const [privateJournal, setPrivateJournal] = useState(true);
  const [seniorMode, setSeniorMode] = useState(false);

  return {
    quietMode,
    setQuietMode,
    privateJournal,
    setPrivateJournal,
    seniorMode,
    setSeniorMode
  };
}
