"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useThemeToggle } from "@/components/theme/theme-provider";
import { cn } from "@/lib/ui/cn";

const PREVIEW_PATH = "/preview/giao-dien";

type Props = {
  /** Luôn hiện khi URL có ?theme= */
  force?: boolean;
};

function subscribeTheme(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => obs.disconnect();
}

function getThemeSnapshot(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemePreviewToolbar({ force = false }: Props) {
  const pathname = usePathname();
  const { setTheme } = useThemeToggle();
  const mode = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => "light");

  const onPreviewRoute = pathname.startsWith("/preview");
  if (!force && !onPreviewRoute) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 shadow-xl backdrop-blur-md print:hidden",
        "border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)]",
      )}
      role="toolbar"
      aria-label="Xem trước theme"
    >
      <span className="proptech-kicker mr-1 hidden text-[0.6rem] sm:inline">
        Preview theme
      </span>
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
          mode === "light"
            ? "bg-brand-600 text-white"
            : "hover:bg-silver-100 dark:hover:bg-white/10",
        )}
      >
        Sáng
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
          mode === "dark"
            ? "bg-gold-500 text-ink-900"
            : "hover:bg-silver-100 dark:hover:bg-white/10",
        )}
      >
        Tối
      </button>
      <span className="mx-1 hidden h-4 w-px bg-[var(--border)] sm:block" />
      <Link
        href="/?theme=light"
        className="rounded-lg px-2 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300 hover:underline"
      >
        Trang chủ (sáng)
      </Link>
      <Link
        href="/?theme=dark"
        className="rounded-lg px-2 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300 hover:underline"
      >
        Trang chủ (tối)
      </Link>
      <Link
        href={PREVIEW_PATH}
        className="rounded-lg bg-silver-100 px-2 py-1.5 text-xs font-semibold dark:bg-white/10"
      >
        So sánh 2 bản
      </Link>
    </div>
  );
}
