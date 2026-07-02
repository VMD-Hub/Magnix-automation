import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { EmailVerificationBanner } from "@/components/layout/header-auth";
import { ThemeScript } from "@/components/theme/theme-script";
import { ThemeShell } from "@/components/theme/theme-shell";
import { getSiteUrl } from "@/lib/site-config";
import {
  SEO_DESCRIPTION_DEFAULT,
  SEO_TITLE_DEFAULT,
} from "@/lib/content/messaging/brand";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SEO_TITLE_DEFAULT,
    template: "%s | House X",
  },
  description: SEO_DESCRIPTION_DEFAULT,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <ThemeScript />
        <ThemeShell>
          <SiteHeader />
          <EmailVerificationBanner />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ThemeShell>
      </body>
    </html>
  );
}
