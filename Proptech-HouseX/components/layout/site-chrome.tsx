import { headers } from "next/headers";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { EmailVerificationBanner } from "@/components/layout/header-auth";

/** Ẩn header/footer site trên console admin — tránh double chrome + lỗi hydrate. */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const adminConsole = pathname.startsWith("/admin");

  if (adminConsole) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <EmailVerificationBanner />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
