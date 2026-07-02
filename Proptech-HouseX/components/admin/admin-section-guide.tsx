"use client";

import type { SectionGuide } from "@/lib/content/project-landing-guidelines";
import {
  PROJECT_LANDING_IMAGE,
  PROJECT_LANDING_QUICK_REFERENCE,
} from "@/lib/content/project-landing-guidelines";
import { cn } from "@/lib/ui/cn";

export function AdminSectionGuide({
  guide,
  className,
}: {
  guide: SectionGuide;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-slate-700",
        className,
      )}
    >
      <p className="font-semibold text-amber-950">{guide.title} — hướng dẫn</p>
      <p className="mt-1 text-slate-600">{guide.summary}</p>

      {guide.limits && guide.limits.length > 0 && (
        <dl className="mt-2 grid gap-1 sm:grid-cols-2">
          {guide.limits.map((l) => (
            <div key={l.label} className="flex gap-2 text-xs">
              <dt className="shrink-0 font-medium text-slate-500">{l.label}:</dt>
              <dd className="text-slate-700">{l.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {guide.imageSpec && (
        <div className="mt-3 rounded-md border border-amber-300/60 bg-white/70 px-3 py-2 text-xs">
          <p className="font-semibold text-slate-800">Tiêu chuẩn ảnh</p>
          <ul className="mt-1 space-y-0.5 text-slate-600">
            <li>
              <span className="font-medium text-slate-500">Tỷ lệ:</span>{" "}
              {guide.imageSpec.aspect}
            </li>
            <li>
              <span className="font-medium text-slate-500">Khuyến nghị:</span>{" "}
              {guide.imageSpec.recommended}
            </li>
            <li>
              <span className="font-medium text-slate-500">Tối thiểu:</span>{" "}
              {guide.imageSpec.minimum}
            </li>
            <li>
              <span className="font-medium text-slate-500">Định dạng:</span>{" "}
              {guide.imageSpec.formats}
            </li>
            <li>
              <span className="font-medium text-slate-500">Dung lượng:</span>{" "}
              {guide.imageSpec.maxSize}
            </li>
            {guide.imageSpec.count && (
              <li>
                <span className="font-medium text-slate-500">Số lượng:</span>{" "}
                {guide.imageSpec.count}
              </li>
            )}
          </ul>
        </div>
      )}

      {guide.tips.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-relaxed text-slate-600">
          {guide.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AdminQuickReferencePanel() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Checklist nhanh trước khi publish
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {PROJECT_LANDING_QUICK_REFERENCE.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        Chi tiết từng mục xem khung hướng dẫn màu vàng bên dưới. Vị trí: ảnh bản đồ{" "}
        {PROJECT_LANDING_IMAGE.locationMapAspect} ({PROJECT_LANDING_IMAGE.locationMapWidth}×
        {PROJECT_LANDING_IMAGE.locationMapHeight} px) + text. Gallery:{" "}
        {PROJECT_LANDING_IMAGE.galleryAspect}.
      </p>
    </div>
  );
}
