import Link from "next/link";
import { CTV_AFFILIATE_COMPARE } from "@/lib/content/ctv-affiliate-landing";

/** Infographic HTML — so sánh cắt máu vs CTV (không phụ thuộc ảnh). */
export function CtvCashflowInfographic() {
  const { oldModel, newModel, heading } = CTV_AFFILIATE_COMPARE;

  return (
    <figure
      className="my-8"
      aria-labelledby="ctv-infographic-title"
    >
      <figcaption
        id="ctv-infographic-title"
        className="mb-4 text-lg font-bold text-slate-900"
      >
        {heading}
      </figcaption>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Mô hình cũ
          </p>
          <h3 className="mt-1 text-base font-bold text-slate-800">
            {oldModel.title}
          </h3>
          <ol className="mt-4 space-y-0">
            {oldModel.steps.map((step, i) => (
              <li key={step} className="relative flex gap-3 pb-6 last:pb-0">
                {i < oldModel.steps.length - 1 ? (
                  <span
                    className="absolute left-[0.7rem] top-7 bottom-0 w-px bg-slate-200"
                    aria-hidden
                  />
                ) : null}
                <span className="relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed text-slate-600">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
            Mô hình House X
          </p>
          <h3 className="mt-1 text-base font-bold text-brand-900">
            {newModel.title}
          </h3>
          <ol className="mt-4 space-y-0">
            {newModel.steps.map((step, i) => (
              <li key={step} className="relative flex gap-3 pb-6 last:pb-0">
                {i < newModel.steps.length - 1 ? (
                  <span
                    className="absolute left-[0.7rem] top-7 bottom-0 w-px bg-brand-200"
                    aria-hidden
                  />
                ) : null}
                <span className="relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed text-slate-700">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">
        Sơ đồ minh họa quy trình — không phải bảng hoa hồng. Chi tiết thưởng sau khi
        hồ sơ được duyệt.{" "}
        <Link href="/affiliate-bat-dong-san" className="text-brand-700 hover:underline">
          Về hub cộng tác viên
        </Link>
      </p>
    </figure>
  );
}
