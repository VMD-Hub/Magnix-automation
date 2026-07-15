"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { EmailVerificationBanner } from "@/components/layout/header-auth";
import { MiniAppEmbedBar } from "@/components/miniapp/miniapp-embed-bar";
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
        {embed ? <MiniAppEmbedBar /> : null}
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
 * Tách shell site vs console admin — dùng pathname client (SSR + hydrate khớp).
 * Admin không bọc ThemeShell Suspense để tránh trang login trắng khi chunk chậm.
 * Embed Mini App (?hx_embed=miniapp): ẩn header/footer web — giữ cảm giác app.
 */
export function AppBody({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const maybePersonalBrand = isVuNguyenPersonalBrandPath(pathname);

  return (
    <Suspense
      fallback={
        <MiniAppEmbedProvider>
          <SiteChrome forceMinimal={maybePersonalBrand}>{children}</SiteChrome>
        </MiniAppEmbedProvider>
      }
    >
      <AppBodyChrome>{children}</AppBodyChrome>
    </Suspense>
  );
}
