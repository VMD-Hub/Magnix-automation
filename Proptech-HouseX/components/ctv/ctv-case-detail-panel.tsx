"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CtvCareForm } from "@/components/ctv/ctv-care-form";
import { cn } from "@/lib/ui/cn";
import { DEAL_TIER_LABEL } from "@/lib/ctv/deal-tiers";

export type CtvCaseDetailView = {
  id: string;
  code: string;
  customerName: string;
  phoneMasked: string;
  projectName: string | null;
  dealTier: string | null;
  milestoneLabel: string;
  milestoneProgress: string;
  docPercent: number;
  docPassed: number;
  docRequired: number;
  opsNote: string | null;
  attributionLocked: boolean;
  lockCompliance?: {
    calendarDaysUntilLockExpiry: number | null;
    needsProgressWarning: boolean;
    needsScheduleWarning: boolean;
  };
  documents: {
    id: string;
    label: string;
    status: string;
    statusLabel: string;
    rejectReason: string | null;
    ctvActionHint: string | null;
  }[];
  careActivities?: {
    id: string;
    activityType: string;
    note: string;
    status: string;
    occurredAt: string;
  }[];
};

type Props = {
  detail: CtvCaseDetailView;
  actionMsg?: string | null;
  onNudge: () => void;
  onAssistNote: () => void;
  onCareSaved: () => void;
  showOpenLink?: boolean;
};

/** Panel chi tiết hồ sơ CTV + CS (dùng trên board và `/ho-so/[id]`). */
export function CtvCaseDetailPanel({
  detail,
  actionMsg,
  onNudge,
  onAssistNote,
  onCareSaved,
  showOpenLink = false,
}: Props) {
  const calendarLeft = detail.lockCompliance?.calendarDaysUntilLockExpiry;

  return (
    <>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {detail.code}
        {detail.dealTier
          ? ` · ${DEAL_TIER_LABEL[detail.dealTier] ?? detail.dealTier}`
          : ""}
      </p>
      <h3 className="mt-1 text-xl font-bold text-slate-900">
        {detail.customerName}
      </h3>
      <p className="text-sm text-slate-500">
        Liên hệ: {detail.phoneMasked}
        {detail.projectName ? ` · ${detail.projectName}` : ""}
      </p>
      {detail.attributionLocked ? (
        <p className="mt-2 rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-800">
          Đã cọc — quyền giới thiệu đã chốt.
        </p>
      ) : null}

      <p className="mt-4 text-sm font-medium text-slate-800">
        {detail.milestoneProgress} — {detail.milestoneLabel}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Hồ sơ giấy tờ: {detail.docPassed}/{detail.docRequired} ({detail.docPercent}
        %)
      </p>
      {calendarLeft != null ? (
        <p className="mt-1 text-xs text-slate-500">
          Còn ~{calendarLeft} ngày dương lịch độc quyền (tối đa 60; im 30 ngày
          không CS → nhả)
        </p>
      ) : null}
      {detail.lockCompliance?.needsProgressWarning ? (
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Cần ghi CS hợp lệ (ghi chú + ảnh) để giữ độc quyền.
        </p>
      ) : null}
      {detail.lockCompliance?.needsScheduleWarning ? (
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Chưa có lịch tư vấn — hãy cập nhật lịch trên hồ sơ.
        </p>
      ) : null}
      {detail.opsNote ? (
        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Ops: {detail.opsNote}
        </p>
      ) : null}

      {actionMsg ? (
        <p className="mt-3 text-sm text-emerald-700">{actionMsg}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={onNudge}>
          Nhắc qua HouseX
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onAssistNote}>
          Đã hỗ trợ ngoài đời
        </Button>
        <Link
          href="/cong-cu/dieu-kien-noxh"
          className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Gửi checklist NOXH
        </Link>
        {showOpenLink ? (
          <Link
            href={`/moi-gioi/ho-so/${detail.id}`}
            className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-brand-700 hover:bg-brand-50"
          >
            Mở trang đầy đủ
          </Link>
        ) : null}
      </div>

      <CtvCareForm
        caseId={detail.id}
        careActivities={detail.careActivities}
        onSaved={onCareSaved}
      />

      <h4 className="mt-6 text-sm font-bold text-slate-900">Checklist giấy tờ</h4>
      <ul className="mt-2 space-y-2">
        {detail.documents
          .filter((d) => d.status !== "NOT_REQUIRED")
          .map((d) => (
            <li
              key={d.id}
              className="rounded-lg border border-slate-100 px-3 py-2 text-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-slate-800">{d.label}</span>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    d.status === "PASSED" && "text-emerald-600",
                    (d.status === "MISSING" || d.status === "REJECTED") &&
                      "text-rose-600",
                    d.status === "REVIEWING" && "text-amber-600",
                  )}
                >
                  {d.statusLabel}
                </span>
              </div>
              {d.rejectReason ? (
                <p className="mt-1 text-xs text-rose-600">{d.rejectReason}</p>
              ) : null}
              {d.ctvActionHint &&
              (d.status === "MISSING" || d.status === "REJECTED") ? (
                <p className="mt-1 text-xs text-slate-500">{d.ctvActionHint}</p>
              ) : null}
            </li>
          ))}
      </ul>

      <p className="mt-6 text-xs text-slate-400">
        Mọi tư vấn pháp lý do chuyên viên HouseX phụ trách.
      </p>
    </>
  );
}
