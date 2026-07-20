export type ThemeScheme = "system" | "light" | "dark";
export type ResolvedThemeScheme = Exclude<ThemeScheme, "system">;

export const THEME_SCHEME_STORAGE_KEY = "theme";
export const THEME_SCHEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";
export const AVAILABLE_THEME_SCHEMES: readonly ThemeScheme[] = [
  "system",
  "dark",
  "light",
];

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
