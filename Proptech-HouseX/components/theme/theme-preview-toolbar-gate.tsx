"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ThemePreviewToolbar } from "@/components/theme/theme-preview-toolbar";

export function ThemePreviewToolbarGate() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const force = searchParams.has("theme");
  const onPreview = pathname.startsWith("/preview");

  if (!force && !onPreview) return null;

  return <ThemePreviewToolbar force={force || onPreview} />;
}
