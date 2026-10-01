import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import ClientStorageService from "@/domain/services/client-storage";
import type { ThemeMode, ThemeProviderTypes } from "./theme-provider-types";

const THEME_KEY = "portal-theme";

export const ThemeContext = createContext<ThemeProviderTypes>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

function readStoredTheme(): ThemeMode {
  const stored = ClientStorageService.getItem<ThemeMode>(THEME_KEY);
  return stored === "light" || stored === "dark" ? stored : "dark";
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>(readStoredTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.style.colorScheme = theme;
    ClientStorageService.setItem(THEME_KEY, theme);
  }, [theme]);

  const setTheme = (next: ThemeMode) => {
    setThemeState(next);
  };

  const toggleTheme = () => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
