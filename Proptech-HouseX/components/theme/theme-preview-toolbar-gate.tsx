"use client";

import { useEffect, useState } from "react";
import { ThemePreviewToolbar } from "@/components/theme/theme-preview-toolbar";

export function ThemePreviewToolbarGate() {
  const [show, setShow] = useState(false);
  const [force, setForce] = useState(false);

  useEffect(() => {
    const onPreview = window.location.pathname.startsWith("/preview");
    const hasTheme = new URLSearchParams(window.location.search).has("theme");
    setForce(hasTheme || onPreview);
    setShow(onPreview || hasTheme);
  }, []);

  if (!show) return null;

  return <ThemePreviewToolbar force={force} />;
}
