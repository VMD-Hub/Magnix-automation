import Link from "next/link";
import { getBrandName } from "@/lib/site-config";
import { HouseXLogo } from "@/components/brand/housex-logo";
import { PLATFORM_HERO } from "@/lib/content/messaging/platform-public";
import { cn } from "@/lib/ui/cn";

type Props = {
  /** Bọc trong `.dark` khi mode = dark */
  mode: "light" | "dark";
};

/** Mock UI chính — hero, card, CTA, footer strip. */
export function ThemeShowcase({ mode }: Props) {
  return (
    <div
      className={cn(
        mode === "dark" && "dark",
        "overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]",
      )}
    >
      {/* Mini header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3 backdrop-blur-sm">
        <HouseXLogo showWordmark showTagline size="header" iconClassName="text-xl" />
        <span className="lux-gold-cta pointer-events-none inline-flex h-9 items-center rounded-xl bg-gold-500 px-4 text-xs font-semibold text-white">
          Đăng tin
        </span>
      </div>

      {/* Hero */}
      <div className="lux-hero relative px-4 py-10 sm:py-12">
        <div className="lux-hero-mesh" aria-hidden />
        <p className="lux-hero-kicker proptech-kicker relative z-[1] text-gold-400">
          {PLATFORM_HERO.kicker}
        </p>
        <h2 className="lux-hero-title relative z-[1] mt-2 text-2xl font-extrabold text-white sm:text-3xl">
          {PLATFORM_HERO.h1Line1}
          <br />
          <span className="lux-hero-title-accent text-brand-300">
            {PLATFORM_HERO.h1Accent}
          </span>
        </h2>
        <div className="relative z-[1] mt-5 lux-glass max-w-sm rounded-xl p-3">
          <div className="flex gap-2">
            <span className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-center text-xs font-semibold text-white">
              Mua bán
            </span>
            <span className="flex-1 rounded-lg py-2 text-center text-xs font-medium text-[var(--muted)]">
              Cho thuê
            </span>
          </div>
          <div className="mt-2 flex gap-2">
            <div className="h-10 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)]" />
            <span className="lux-gold-cta inline-flex h-10 items-center rounded-xl bg-gold-500 px-4 text-xs font-semibold text-white">
              Tìm
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="proptech-section-glow space-y-4 px-4 py-6">
        <div>
          <h3 className="lux-heading-accent text-lg font-bold">Dự án nổi bật</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">Pháp lý rõ ràng · minh bạch</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="proptech-card overflow-hidden p-0">
            <div className="aspect-[16/10] bg-gradient-to-br from-ink-800 to-brand-900" />
            <div className="p-3">
              <p className="font-bold text-brand-700 dark:text-brand-300">{getBrandName()} Riverside</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Quận 7 · TP.HCM</p>
              <p className="mt-2 text-sm font-bold text-brand-700 dark:text-gold-400">
                Từ 2,8 tỷ
              </p>
            </div>
          </article>
          <article className="proptech-card overflow-hidden p-0">
            <div className="aspect-[16/10] bg-gradient-to-br from-ink-700 to-ink-900" />
            <div className="p-3">
              <p className="font-bold text-brand-700 dark:text-brand-300">An Cư NOXH</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Long An</p>
              <p className="mt-2 text-sm font-bold text-brand-700 dark:text-gold-400">
                Từ 980 triệu
              </p>
            </div>
          </article>
        </div>

        <div className="lux-stat-card grid grid-cols-3 gap-2 p-3 text-center text-xs">
          <div>
            <p className="text-[var(--muted)]">Số căn</p>
            <p className="mt-1 font-bold">1.200</p>
          </div>
          <div>
            <p className="text-[var(--muted)]">Bàn giao</p>
            <p className="mt-1 font-bold">2027</p>
          </div>
          <div>
            <p className="text-[var(--muted)]">Pháp lý</p>
            <p className="mt-1 font-bold text-wood-500">Rõ</p>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-ink-900 via-brand-900 to-ink-800 p-4">
          <p className="font-bold text-white">Bạn là môi giới?</p>
          <p className="mt-1 text-sm text-silver-200">Đăng tin miễn phí hôm nay</p>
          <span className="lux-gold-cta mt-3 inline-flex rounded-xl bg-gold-500 px-4 py-2 text-sm font-semibold text-white">
            Đăng tin ngay
          </span>
        </div>
      </div>

      <div className="proptech-footer-glow px-4 py-4 text-center text-xs text-slate-400">
        © {getBrandName()} · Ruby · Gold · Kim
      </div>

      <p className="border-t border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {mode === "light" ? "Phiên bản sáng (Light)" : "Phiên bản tối (Dark)"}
      </p>
    </div>
  );
}

export function ThemePreviewLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/?theme=light"
        className="lux-gold-cta rounded-xl bg-gold-500 px-4 py-2 text-sm font-semibold text-white"
      >
        Duyệt site — Sáng
      </Link>
      <Link
        href="/?theme=dark"
        className="rounded-xl border border-brand-600 bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Duyệt site — Tối
      </Link>
      <Link
        href="/du-an?theme=light"
        className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium hover:border-brand-300"
      >
        /du-an
      </Link>
      <Link
        href="/mua-ban?theme=dark"
        className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium hover:border-brand-300"
      >
        /mua-ban (tối)
      </Link>
    </div>
  );
}
