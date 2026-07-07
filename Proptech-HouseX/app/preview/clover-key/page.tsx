import Link from "next/link";
import { CloverKeyMark } from "@/components/brand/clover-key-mark";
import { HouseXRadarO } from "@/components/brand/housex-radar-o";
import { HouseXChromeX } from "@/components/brand/housex-chrome-x";
import { HOUSEX_COLORS } from "@/lib/brand/housex-mark.config";

/** Preview duyệt — chìa khóa cỏ bốn lá thay chữ X. */
export const dynamic = "force-static";

function WordmarkWithKey({
  variant,
  label,
}: {
  variant: "default" | "onDark";
  label: string;
}) {
  const textColor =
    variant === "onDark" ? HOUSEX_COLORS.navyOnDark : HOUSEX_COLORS.navy;

  return (
    <div
      className={
        variant === "onDark"
          ? "rounded-2xl bg-gradient-to-br from-brand-900 via-brand-800 to-ink-900 p-8"
          : "rounded-2xl border border-[var(--border)] bg-[var(--brand-logo-paper)] p-8"
      }
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold-500">
        {label}
      </p>
      <span
        className="inline-flex items-baseline text-[1.15rem] font-bold uppercase leading-none tracking-[0.05em] sm:text-[1.35rem]"
        style={{ color: textColor }}
      >
        <span>H</span>
        <HouseXRadarO className="mx-[0.02em] h-[0.78em] w-[0.78em]" />
        <span>USE</span>
        <CloverKeyMark
          variant={variant}
          className="mx-[0.06em] h-[1.72em] w-[1.22em] -translate-y-[0.06em]"
        />
        <span className="text-[0.56em] lowercase tracking-[0.02em]">.vn</span>
      </span>
    </div>
  );
}

const KEY_SIZES = [32, 48, 72] as const;

export default function CloverKeyPreviewPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-center text-xs text-[var(--muted)]">
        Duyệt biểu tượng chìa khóa cỏ bốn lá —{" "}
        <Link href="/" className="font-semibold text-brand-600 hover:underline">
          Trang chủ
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 container-px">
        <p className="proptech-kicker">Brand mark · POC</p>
        <h1 className="mt-2 text-2xl font-extrabold text-[var(--foreground)] sm:text-3xl">
          Chìa khóa cỏ bốn lá — thay chữ X
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Bản vẽ SVG vàng kim: đài clover 4 lá (gân filigree), thân lưới, chân
          răng. Chưa thay logo production — chỉ để bạn duyệt hình dạng và tỷ lệ.
        </p>

        <section className="mt-10 grid gap-6 sm:grid-cols-3">
          {KEY_SIZES.map((size) => (
            <div
              key={size}
              className="flex flex-col items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <CloverKeyMark style={{ height: size, width: "auto" }} />
              <p className="mt-3 text-xs text-[var(--muted)]">{size}px</p>
            </div>
          ))}
        </section>

        <section className="mt-10 space-y-6">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            Trong wordmark (thay X)
          </h2>
          <WordmarkWithKey variant="default" label="Header — nền giấy logo" />
          <WordmarkWithKey variant="onDark" label="Hero ruby — chữ sáng" />
        </section>

        <section className="mt-10 proptech-empty-state p-6 dark:bg-brand-950/20">
          <h2 className="text-sm font-bold text-brand-800 dark:text-brand-200">
            So sánh với X hiện tại
          </h2>
          <div className="mt-4 flex flex-wrap items-end gap-8">
            <div>
              <p className="mb-2 text-xs text-[var(--muted)]">X gold (hiện tại)</p>
              <span className="inline-flex items-baseline text-xl font-bold uppercase tracking-wide text-[#333]">
                HOUSE
                <HouseXChromeX className="mx-1 h-8 w-8" />
              </span>
            </div>
            <div>
              <p className="mb-2 text-xs text-[var(--muted)]">Chìa khóa (đề xuất)</p>
              <span className="inline-flex items-baseline text-xl font-bold uppercase tracking-wide text-[#333]">
                HOUSE
                <CloverKeyMark className="mx-1 h-10 w-7 -translate-y-0.5" />
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
