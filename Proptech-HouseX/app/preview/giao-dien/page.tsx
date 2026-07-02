import type { Metadata } from "next";
import {
  ThemePreviewLinks,
  ThemeShowcase,
} from "@/components/theme/theme-showcase";
import { getBrandName } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Preview giao diện — Light & Dark",
  robots: { index: false, follow: false },
};

export default function ThemePreviewPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 pb-24 container-px">
      <header className="mb-8 max-w-3xl">
        <p className="proptech-kicker">Pre-deploy · Staging</p>
        <h1 className="lux-heading-accent mt-2 text-3xl font-extrabold">
          Xem trước giao diện {getBrandName()}
        </h1>
        <p className="mt-3 text-[var(--muted)] leading-relaxed">
          So sánh hai phiên bản <strong>Sáng (Light)</strong> và{" "}
          <strong>Tối (Dark)</strong> trước khi deploy chính thức. Palette Kim
          · Ruby · Gold giữ nguyên — chỉ đảo nền và surface.
        </p>
        <div className="mt-6">
          <ThemePreviewLinks />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <section aria-labelledby="preview-light-heading">
          <h2
            id="preview-light-heading"
            className="mb-3 text-sm font-bold uppercase tracking-wider text-brand-700"
          >
            ☀️ Light — Thường (60% Silver Kim)
          </h2>
          <ThemeShowcase mode="light" />
        </section>
        <section aria-labelledby="preview-dark-heading">
          <h2
            id="preview-dark-heading"
            className="mb-3 text-sm font-bold uppercase tracking-wider text-gold-500"
          >
            🌙 Dark — Tối (Ink + Ruby glow)
          </h2>
          <ThemeShowcase mode="dark" />
        </section>
      </div>

      <aside className="lux-detail-panel mt-10 p-6 text-sm text-[var(--muted)]">
        <p className="font-semibold text-[var(--foreground)]">Hướng dẫn duyệt thử</p>
        <ul className="mt-3 list-inside list-disc space-y-1.5">
          <li>
            Thanh công cụ dưới cùng — chuyển Sáng/Tối trên mọi trang{" "}
            <code className="rounded bg-silver-100 px-1 dark:bg-white/10">/preview/*</code>
          </li>
          <li>
            Thêm{" "}
            <code className="rounded bg-silver-100 px-1 dark:bg-white/10">?theme=dark</code>{" "}
            hoặc{" "}
            <code className="rounded bg-silver-100 px-1 dark:bg-white/10">?theme=light</code>{" "}
            vào URL bất kỳ
          </li>
          <li>Trang preview không được index Google (robots noindex)</li>
        </ul>
      </aside>
    </div>
  );
}
