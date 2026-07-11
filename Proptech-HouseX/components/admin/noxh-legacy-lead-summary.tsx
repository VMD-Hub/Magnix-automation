"use client";

import {
  formatLegacyNoxhLeadPreviewVi,
  legacyReasonLabelsVi,
  LEGACY_CREDIT_LABELS,
  parseLegacyNoxhLeadMessage,
} from "@/lib/leads/noxh-legacy-message";
import {
  OVERALL_LABELS,
  STATUS_LABELS,
  TIER_LABELS,
} from "@/lib/leads/noxh-wizard-snapshot";
import { cn } from "@/lib/ui/cn";

type Props = {
  message: string;
  /** Bổ sung từ NoxhCase nếu có. */
  objectGroupLabel?: string | null;
  intendToBorrowFromCase?: boolean | null;
};

export function NoxhLegacyLeadSummary({
  message,
  objectGroupLabel,
  intendToBorrowFromCase,
}: Props) {
  const parsed = parseLegacyNoxhLeadMessage(message);
  if (!parsed) {
    return (
      <p className="text-xs text-slate-600 break-words">{message}</p>
    );
  }

  const preview = formatLegacyNoxhLeadPreviewVi(parsed);
  const reasonVi = legacyReasonLabelsVi(parsed.reasonCodes);
  const tierTone =
    parsed.tier === "HOT"
      ? "border-emerald-300 bg-emerald-50"
      : parsed.tier === "WARM"
        ? "border-amber-300 bg-amber-50"
        : parsed.tier === "COLD"
          ? "border-slate-300 bg-slate-50"
          : "border-rose-300 bg-rose-50";

  return (
    <div className="space-y-3 text-sm">
      <div className={cn("rounded-lg border p-3", tierTone)}>
        <p className="text-xs font-medium text-amber-900">
          Lead cũ — chưa lưu thu nhập/nợ (VND) trên hệ thống
        </p>
        <p className="mt-1 text-xs text-amber-800">
          Số tiền cụ thể: Google Sheet (n8n) hoặc submit wizard mới. Dưới đây là
          bản dịch từ ghi chú kỹ thuật.
        </p>
        {parsed.tier ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold uppercase">
              {parsed.tier}
            </span>
            <span className="font-semibold text-slate-900">
              {TIER_LABELS[parsed.tier].vi}
            </span>
            <span className="text-xs text-slate-500">
              ({TIER_LABELS[parsed.tier].en})
            </span>
          </div>
        ) : null}
        <p className="mt-2 font-medium text-slate-800">{preview}</p>
        {reasonVi.length > 0 ? (
          <ul className="mt-2 list-inside list-disc text-xs text-slate-600">
            {reasonVi.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs">
        <h4 className="font-bold text-slate-700">Chi tiết / Details</h4>
        <dl className="mt-2 space-y-1">
          {objectGroupLabel ? (
            <Row label="Nhóm đối tượng" en="Object" value={objectGroupLabel} />
          ) : null}
          {parsed.overall ? (
            <Row
              label="Tổng thể NOXH"
              en="Overall"
              value={`${OVERALL_LABELS[parsed.overall].vi} / ${OVERALL_LABELS[parsed.overall].en}`}
            />
          ) : null}
          {parsed.housing ? (
            <Row
              label="Nhà ở"
              en="Housing"
              value={`${STATUS_LABELS[parsed.housing].vi} / ${STATUS_LABELS[parsed.housing].en}`}
            />
          ) : null}
          {parsed.income ? (
            <Row
              label="Thu nhập (trạng thái)"
              en="Income status"
              value={`${STATUS_LABELS[parsed.income].vi}${parsed.incomeNearCeiling ? " · sát trần" : ""}`}
            />
          ) : null}
          {(parsed.intendToBorrow ?? intendToBorrowFromCase) != null ? (
            <Row
              label="Vay NH"
              en="Borrow"
              value={
                (parsed.intendToBorrow ?? intendToBorrowFromCase)
                  ? "Có / Yes"
                  : "Không / No"
              }
            />
          ) : null}
          {parsed.creditFlag ? (
            <Row
              label="Tín dụng"
              en="Credit"
              value={`${LEGACY_CREDIT_LABELS[parsed.creditFlag].vi} / ${LEGACY_CREDIT_LABELS[parsed.creditFlag].en}`}
            />
          ) : null}
          {parsed.dtiBucket ? (
            <Row label="DTI ước tính" en="DTI" value={`~${parsed.dtiBucket}`} />
          ) : null}
          {parsed.rulesVersion ? (
            <Row label="Quy tắc" en="Rules" value={parsed.rulesVersion} />
          ) : null}
        </dl>
      </div>
    </div>
  );
}

function Row({
  label,
  en,
  value,
}: {
  label: string;
  en: string;
  value: string;
}) {
  return (
    <div className="flex flex-wrap justify-between gap-x-2">
      <dt className="text-slate-500">
        {label} <span className="text-slate-400">/ {en}</span>
      </dt>
      <dd className="text-right font-medium text-slate-800">{value}</dd>
    </div>
  );
}
