export type ThemeMode = "light" | "dark";

export interface ThemeProviderTypes {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}
