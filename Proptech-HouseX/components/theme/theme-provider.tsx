"use client";

import { useEffect } from "react";
import {
  THEME_PREVIEW_COOKIE,
  THEME_STORAGE_KEY,
  isThemeMode,
} from "@/lib/theme/constants";

function applyTheme(mode: "light" | "dark") {
  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.dataset.theme = mode;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* private mode */
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("theme");
    if (isThemeMode(q)) applyTheme(q);
  }, []);

  useEffect(() => {
    if (!window.location.pathname.startsWith("/preview")) return;
    document.cookie = `${THEME_PREVIEW_COOKIE}=1;path=/;max-age=86400;SameSite=Lax`;
  }, []);

  return children;
}

export function useThemeToggle() {
  const setTheme = (mode: "light" | "dark") => {
    applyTheme(mode);
    const url = new URL(window.location.href);
    url.searchParams.set("theme", mode);
    window.history.replaceState({}, "", url.toString());
  };

  const current = (): "light" | "dark" =>
    document.documentElement.classList.contains("dark") ? "dark" : "light";

  return { setTheme, current };
}
