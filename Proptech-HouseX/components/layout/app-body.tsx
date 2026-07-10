"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { EmailVerificationBanner } from "@/components/layout/header-auth";
import { ThemeShell } from "@/components/theme/theme-shell";

/**
 * Tách shell site vs console admin — dùng pathname client (SSR + hydrate khớp).
 * Admin không bọc ThemeShell Suspense để tránh trang login trắng khi chunk chậm.
 */
export function AppBody({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const adminConsole = pathname.startsWith("/admin");

  if (adminConsole) {
    return <div className="flex min-h-screen flex-col bg-slate-100">{children}</div>;
  }

  return (
    <ThemeShell>
      <SiteHeader />
      <EmailVerificationBanner />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </ThemeShell>
  );
}
