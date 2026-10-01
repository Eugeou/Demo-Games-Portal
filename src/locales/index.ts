import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ClientStorageService from "@/domain/services/client-storage";
import en from "./en";
import vi from "./vi";

const resources = {
  vi: {
    translation: vi,
  },
  en: {
    translation: en,
  },
};

export const languages = ["vi", "en"] as const;
export type AppLanguage = (typeof languages)[number];
export const LANGUAGE_STORAGE_KEY = "portal-lang";

export const languageLabels: Record<AppLanguage, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

export function isAppLanguage(value: string): value is AppLanguage {
  return languages.includes(value as AppLanguage);
}

export function readStoredLanguage(): AppLanguage {
  const stored = ClientStorageService.getItem<string>(LANGUAGE_STORAGE_KEY);
  return stored && isAppLanguage(stored) ? stored : "vi";
}

export function persistLanguage(language: AppLanguage) {
  ClientStorageService.setItem(LANGUAGE_STORAGE_KEY, language);
  document.documentElement.lang = language;
}

const appInstance = i18n.createInstance();
appInstance.use(initReactI18next).init({
  resources,
  lng: readStoredLanguage(),
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});

if (typeof document !== "undefined") {
  document.documentElement.lang = appInstance.language === "en" ? "en" : "vi";
}

export default appInstance;
