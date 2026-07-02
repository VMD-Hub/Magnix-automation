export const THEME_STORAGE_KEY = "housex-theme" as const;
export const THEME_PREVIEW_COOKIE = "housex-theme-preview" as const;

export type ThemeMode = "light" | "dark";

export function isThemeMode(v: string | null | undefined): v is ThemeMode {
  return v === "light" || v === "dark";
}
