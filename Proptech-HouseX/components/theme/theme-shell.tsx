"use client";

import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemePreviewToolbarGate } from "@/components/theme/theme-preview-toolbar-gate";

export function ThemeShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ThemeProvider>
        {children}
        <Suspense fallback={null}>
          <ThemePreviewToolbarGate />
        </Suspense>
      </ThemeProvider>
    </Suspense>
  );
}
