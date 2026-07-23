import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// Storage keys are versioned so a future schema change can migrate or
// abandon old values without colliding.
export const storageKeys = {
  karma: "foobow.v1.karma",
  streak: "foobow.v1.streak",
  journal: "foobow.v1.journal",
  quietMode: "foobow.v1.quietMode",
  privateJournal: "foobow.v1.privateJournal",
  seniorMode: "foobow.v1.seniorMode"
} as const;

async function getStoredValue<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

async function setStoredValue<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Persistence is best-effort; in-memory state stays authoritative.
  }
}

export async function clearStoredProfile(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(storageKeys));
  } catch {
    // Best-effort cleanup.
  }
}

// useState that hydrates from AsyncStorage once and saves on change.
// Writes are suppressed until hydration finishes so the stored value is
// never clobbered by the initial default.
export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    getStoredValue<T>(key).then((stored) => {
      if (!active) return;
      if (stored !== null) {
        setValue(stored);
      }
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    void setStoredValue(key, value);
  }, [key, value, hydrated]);

  return [value, setValue] as const;
}
