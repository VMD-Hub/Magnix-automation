"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { EmailVerificationBanner } from "@/components/layout/header-auth";
import {
  MiniAppEmbedProvider,
  useMiniAppEmbed,
} from "@/components/miniapp/miniapp-embed-context";
import { ThemeShell } from "@/components/theme/theme-shell";
import { isVuNguyenPersonalBrandPath } from "@/lib/personal-brand/vu-nguyen/nfc-mode";

function SiteChrome({
  children,
  forceMinimal,
}: {
  children: ReactNode;
  /** Personal brand / shell không header site */
  forceMinimal?: boolean;
}) {
  const embed = useMiniAppEmbed();
  const minimal = Boolean(forceMinimal) || embed;

  if (minimal) {
    return (
      <ThemeShell>
        <main className="flex min-h-dvh flex-1 flex-col">{children}</main>
      </ThemeShell>
    );
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

function AppBodyChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const adminConsole = pathname.startsWith("/admin");
  const personalBrandShell = isVuNguyenPersonalBrandPath(pathname);

  if (adminConsole) {
    return <div className="flex min-h-screen flex-col bg-slate-100">{children}</div>;
  }

  return (
    <MiniAppEmbedProvider>
      <SiteChrome forceMinimal={personalBrandShell}>{children}</SiteChrome>
    </MiniAppEmbedProvider>
  );
}

/**
 * Embed Mini App: ẩn header/footer web — điều hướng về home do thanh Mini App
 * («← Quay lại») + breadcrumb «Trang chủ» (postMessage), không thêm bar trùng.
 */
export function AppBody({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const maybePersonalBrand = isVuNguyenPersonalBrandPath(pathname);

  return (
    <Suspense
      fallback={
        <SiteChrome forceMinimal={maybePersonalBrand}>{children}</SiteChrome>
      }
    >
      <AppBodyChrome>{children}</AppBodyChrome>
    </Suspense>
  );
}
