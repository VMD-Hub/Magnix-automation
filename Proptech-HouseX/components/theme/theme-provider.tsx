"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const q = searchParams.get("theme");
    if (isThemeMode(q)) applyTheme(q);
  }, [searchParams]);

  useEffect(() => {
    if (!pathname.startsWith("/preview")) return;
    document.cookie = `${THEME_PREVIEW_COOKIE}=1;path=/;max-age=86400;SameSite=Lax`;
  }, [pathname]);

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
