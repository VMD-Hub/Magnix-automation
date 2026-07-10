import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { EmailVerificationBanner } from "@/components/layout/header-auth";
import { ThemeScript } from "@/components/theme/theme-script";
import { ThemeShell } from "@/components/theme/theme-shell";
import { UtmCapture } from "@/components/leads/utm-capture";
import { getSiteUrl } from "@/lib/site-config";
import { buildOrganizationJsonLd } from "@/lib/seo/organization-json-ld";
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <ThemeScript />
        <UtmCapture />
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
