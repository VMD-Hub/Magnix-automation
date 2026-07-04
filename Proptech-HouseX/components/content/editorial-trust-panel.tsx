import Link from "next/link";
import type { EditorialExpert, LegalSourceRef } from "@/lib/content/editorial-trust";
import {
  EDITORIAL_METHODOLOGY_PATH,
  formatEditorialDate,
} from "@/lib/content/editorial-trust";

export function EditorialTrustPanel({
  updatedAt,
  publishedAt,
  sources,
  expert,
  variant = "article",
  className,
}: {
  updatedAt: Date;
  publishedAt?: Date | null;
  sources: LegalSourceRef[];
  expert: EditorialExpert | null;
  variant?: "article" | "tool";
  className?: string;
}) {
  if (sources.length === 0 && !expert) return null;

  const updatedLabel = formatEditorialDate(updatedAt);
  const publishedLabel = publishedAt ? formatEditorialDate(publishedAt) : null;

  return (
    <aside
      className={`mt-10 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6${className ? ` ${className}` : ""}`}
      aria-label="Nguồn tham chiếu và thông tin biên tập"
    >
      <h2 className="text-base font-bold text-slate-900">
        Nguồn &amp; cập nhật
      </h2>

      <dl className="mt-3 space-y-1 text-sm text-slate-600">
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-semibold text-slate-700">Cập nhật lần cuối:</dt>
          <dd>{updatedLabel}</dd>
        </div>
        {publishedLabel ? (
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-semibold text-slate-700">Xuất bản:</dt>
            <dd>{publishedLabel}</dd>
          </div>
        ) : null}
        {expert ? (
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-semibold text-slate-700">Biên tập:</dt>
            <dd>{expert.name}</dd>
          </div>
        ) : null}
      </dl>

      {sources.length > 0 ? (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Căn cứ pháp lý &amp; nguồn tham chiếu
          </p>
          <ul className="mt-2 space-y-3">
            {sources.map((s) => (
              <li
                key={s.id}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <p className="font-semibold text-slate-900">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-800 hover:underline"
                  >
                    {s.label}
                  </a>
                </p>
                <p className="mt-1 leading-relaxed text-slate-600">{s.cite}</p>
                {s.effectiveNote ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Hiệu lực: {s.effectiveNote}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-5 text-xs leading-relaxed text-slate-500">
        {variant === "tool"
          ? "Kết quả công cụ là sàng lọc sơ bộ theo bộ quy tắc đang áp dụng — điều kiện chính thức do cơ quan có thẩm quyền xác nhận."
          : "House X tổng hợp và đối chiếu nguồn công khai — không thay công bố của cơ quan nhà nước hoặc chủ đầu tư."}{" "}
        <Link
          href={EDITORIAL_METHODOLOGY_PATH}
          className="font-medium text-brand-700 hover:underline"
        >
          Phương pháp biên tập
        </Link>
        .
      </p>
    </aside>
  );
}
