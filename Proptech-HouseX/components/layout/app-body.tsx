"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  MiniAppEmbedProvider,
  useMiniAppEmbed,
} from "@/components/miniapp/miniapp-embed-context";
import { ThemeShell } from "@/components/theme/theme-shell";
import { isVuNguyenPersonalBrandPath } from "@/lib/personal-brand/vu-nguyen/nfc-mode";

function SiteChrome({
  children,
  header,
  verificationBanner,
  footer,
  forceMinimal,
}: {
  children: ReactNode;
  header: ReactNode;
  verificationBanner: ReactNode;
  footer: ReactNode;
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
      {header}
      {verificationBanner}
      <main className="flex-1">{children}</main>
      {footer}
    </ThemeShell>
  );
}

type AppBodyProps = {
  children: ReactNode;
  header: ReactNode;
  verificationBanner: ReactNode;
  footer: ReactNode;
};

function AppBodyChrome({
  children,
  header,
  verificationBanner,
  footer,
}: AppBodyProps) {
  const pathname = usePathname() ?? "";
  const adminConsole = pathname.startsWith("/admin");
  const personalBrandShell = isVuNguyenPersonalBrandPath(pathname);

  if (adminConsole) {
    return <div className="flex min-h-screen flex-col bg-slate-100">{children}</div>;
  }

  return (
    <MiniAppEmbedProvider>
      <SiteChrome
        forceMinimal={personalBrandShell}
        header={header}
        verificationBanner={verificationBanner}
        footer={footer}
      >
        {children}
      </SiteChrome>
    </MiniAppEmbedProvider>
  );
}

/**
 * Embed Mini App: ẩn header/footer web — điều hướng về home do thanh Mini App
 * («← Quay lại») + breadcrumb «Trang chủ» (postMessage), không thêm bar trùng.
 */
export function AppBody({
  children,
  header,
  verificationBanner,
  footer,
}: AppBodyProps) {
  const pathname = usePathname() ?? "";
  const maybePersonalBrand = isVuNguyenPersonalBrandPath(pathname);

  return (
    <Suspense
      fallback={
        <SiteChrome
          forceMinimal={maybePersonalBrand}
          header={header}
          verificationBanner={verificationBanner}
          footer={footer}
        >
          {children}
        </SiteChrome>
      }
    >
      <AppBodyChrome
        header={header}
        verificationBanner={verificationBanner}
        footer={footer}
      >
        {children}
      </AppBodyChrome>
    </Suspense>
  );
}
