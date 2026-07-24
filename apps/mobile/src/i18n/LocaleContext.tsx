import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import { ReactNode, createContext, useContext, useMemo } from "react";
import { storageKeys, usePersistentState } from "../services/storageService";
import { en, es, fr, ja, th, zhHans } from "./translations";

export type LocaleTag = "en" | "zh-Hans" | "fr" | "es" | "th" | "ja";
export type LocalePreference = "system" | LocaleTag;

export const supportedLocales: LocaleTag[] = ["en", "zh-Hans", "fr", "es", "th", "ja"];

export const localeNames: Record<LocaleTag, string> = {
  en: "English",
  "zh-Hans": "中文",
  fr: "Français",
  es: "Español",
  th: "ไทย",
  ja: "日本語"
};

const catalog = { en, "zh-Hans": zhHans, fr, es, th, ja };

function deviceLocale(): LocaleTag {
  const languageCode = getLocales()[0]?.languageCode ?? "en";
  if (languageCode === "zh") return "zh-Hans";
  return (supportedLocales as string[]).indexOf(languageCode) === -1
    ? "en"
    : (languageCode as LocaleTag);
}

function resolveLocale(preference: LocalePreference): LocaleTag {
  return preference === "system" ? deviceLocale() : preference;
}

type LocaleContextValue = {
  locale: LocaleTag;
  preference: LocalePreference;
  setPreference: (preference: LocalePreference) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
};

const defaultI18n = new I18n(catalog);
defaultI18n.enableFallback = true;
defaultI18n.defaultLocale = "en";

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  preference: "system",
  setPreference: () => undefined,
  t: (key, options) => defaultI18n.t(key, options)
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = usePersistentState<LocalePreference>(
    storageKeys.locale,
    "system"
  );

  const value = useMemo<LocaleContextValue>(() => {
    const locale = resolveLocale(preference);
    const i18n = new I18n(catalog);
    i18n.enableFallback = true;
    i18n.defaultLocale = "en";
    i18n.locale = locale;
    return {
      locale,
      preference,
      setPreference,
      t: (key, options) => i18n.t(key, options)
    };
  }, [preference, setPreference]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n(): LocaleContextValue {
  return useContext(LocaleContext);
}
