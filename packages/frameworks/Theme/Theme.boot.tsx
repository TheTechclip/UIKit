"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemeScheme = "system" | "light" | "dark";
export type ResolvedThemeScheme = Exclude<ThemeScheme, "system">;

export const THEME_SCHEME_STORAGE_KEY = "theme";
export const THEME_SCHEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";
export const AVAILABLE_THEME_SCHEMES: readonly ThemeScheme[] = [
  "system",
  "dark",
  "light",
];

export interface ThemeBootstrapperProps {
  children: ReactNode;
  initialTheme?: ThemeScheme;
}

type ThemeContextValue = {
  theme: ThemeScheme;
  setTheme: (theme: ThemeScheme) => void;
  resolvedTheme: ResolvedThemeScheme;
  themes: readonly ThemeScheme[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedThemeScheme {
  return window.matchMedia(THEME_SCHEME_MEDIA_QUERY).matches ? "dark" : "light";
}

export function isThemeScheme(
  value: string | null | undefined,
): value is ThemeScheme {
  return value === "system" || value === "light" || value === "dark";
}

export function resolveThemeScheme(
  theme: ThemeScheme | null | undefined,
): ResolvedThemeScheme | undefined {
  return theme === "light" || theme === "dark" ? theme : undefined;
}

function readStoredTheme(fallback: ThemeScheme): ThemeScheme {
  try {
    const storedTheme = window.localStorage.getItem(THEME_SCHEME_STORAGE_KEY);
    return isThemeScheme(storedTheme) ? storedTheme : fallback;
  } catch {
    return fallback;
  }
}

function persistTheme(theme: ThemeScheme) {
  try {
    window.localStorage.setItem(THEME_SCHEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable, including in private browsing contexts.
  }

  document.cookie = `${THEME_SCHEME_STORAGE_KEY}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

function applyTheme(theme: ThemeScheme, systemTheme: ResolvedThemeScheme) {
  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const root = document.documentElement;

  root.dataset.theme = resolvedTheme;
  root.dataset.colorMode = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
}

export default function ThemeBootstrapper({
  children,
  initialTheme = "system",
}: ThemeBootstrapperProps) {
  const [theme, setTheme] = useState<ThemeScheme>(() =>
    typeof window === "undefined"
      ? initialTheme
      : readStoredTheme(initialTheme),
  );
  const [systemTheme, setSystemTheme] = useState<ResolvedThemeScheme>(() =>
    typeof window === "undefined" ? "light" : getSystemTheme(),
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(THEME_SCHEME_MEDIA_QUERY);
    const updateSystemTheme = () => setSystemTheme(getSystemTheme());

    updateSystemTheme();
    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_SCHEME_STORAGE_KEY) {
        setTheme(readStoredTheme(initialTheme));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [initialTheme]);

  useEffect(() => {
    applyTheme(theme, systemTheme);
    persistTheme(theme);
  }, [systemTheme, theme]);

  const setThemeScheme = useCallback((nextTheme: ThemeScheme) => {
    setTheme(nextTheme);
  }, []);
  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeScheme,
      resolvedTheme,
      themes: AVAILABLE_THEME_SCHEMES,
    }),
    [resolvedTheme, setThemeScheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return (
    useContext(ThemeContext) ?? {
      theme: "system" as ThemeScheme,
      setTheme: () => {},
      resolvedTheme: "light" as ResolvedThemeScheme,
      themes: AVAILABLE_THEME_SCHEMES,
    }
  );
}
