import { storageKeys, usePersistentState } from "../services/storageService";

export function useProfileController() {
  const [quietMode, setQuietMode] = usePersistentState(storageKeys.quietMode, true);
  const [privateJournal, setPrivateJournal] = usePersistentState(storageKeys.privateJournal, true);
  const [seniorMode, setSeniorMode] = usePersistentState(storageKeys.seniorMode, false);

  return {
    quietMode,
    setQuietMode,
    privateJournal,
    setPrivateJournal,
    seniorMode,
    setSeniorMode
  };
}
