"use client";

import { cn } from "@/lib/ui/cn";
import {
  fmtVndFull,
  readNoxhWizardSnapshot,
  statusTone,
  STATUS_LABELS,
  type NoxhWizardSnapshot,
} from "@/lib/leads/noxh-wizard-snapshot";

type Props = {
  /** Lead.opsMeta hoặc snapshot đã parse. */
  opsMeta?: unknown;
  wizardSnapshot?: NoxhWizardSnapshot | null;
  /** Lead.message — fallback cho lead cũ. */
  fallbackMessage?: string | null;
  compact?: boolean;
};

export function NoxhWizardOpsSummary({
  opsMeta,
  wizardSnapshot: snapshotProp,
  fallbackMessage,
  compact = false,
}: Props) {
  const snapshot =
    snapshotProp ?? (opsMeta ? readNoxhWizardSnapshot(opsMeta) : null);

  if (!snapshot) {
    if (!fallbackMessage) return null;
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        <p className="font-medium">Tóm tắt kỹ thuật (lead cũ — chưa có bản chi tiết)</p>
        <p className="mt-1 break-words font-mono text-[11px] text-amber-800">
          {fallbackMessage}
        </p>
        <p className="mt-2 text-amber-700">
          Lead mới từ wizard sẽ có đầy đủ thu nhập, nợ và ghi chú song ngữ cho Ops.
        </p>
      </div>
    );
  }

  const s = snapshot.situation;
  const ev = snapshot.evaluation;
  const cr = snapshot.credit;

  const tierTone =
    snapshot.tier === "HOT"
      ? "border-emerald-300 bg-emerald-50"
      : snapshot.tier === "WARM"
        ? "border-amber-300 bg-amber-50"
        : snapshot.tier === "COLD"
          ? "border-slate-300 bg-slate-50"
          : "border-rose-300 bg-rose-50";

  return (
    <div className="space-y-3 text-sm">
      <div className={cn("rounded-lg border p-3", tierTone)}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-slate-800">
            {snapshot.tier}
          </span>
          <span className="font-semibold text-slate-900">{snapshot.tierLabelVi}</span>
          <span className="text-xs text-slate-500">({snapshot.tierLabelEn})</span>
        </div>
        <p className="mt-2 text-slate-800">{snapshot.recommendedAction}</p>
        {snapshot.reasonLabelsVi.length > 0 ? (
          <ul className="mt-2 list-inside list-disc text-xs text-slate-600">
            {snapshot.reasonLabelsVi.map((label, i) => (
              <li key={label}>
                {label}
                <span className="text-slate-400">
                  {" "}
                  / {snapshot.reasonLabelsEn[i] ?? snapshot.reasonCodes[i]}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {!compact ? (
        <>
          <Section title="Hồ sơ khách khai báo" titleEn="Declared profile">
            <FactRow
              label="Nhóm đối tượng"
              en="Object group"
              value={
                <>
                  {s.objectGroupLabel}
                  {s.objectGroupCode ? (
                    <span className="text-slate-500"> ({s.objectGroupCode})</span>
                  ) : null}
                </>
              }
            />
            <FactRow
              label="Tình trạng hôn nhân"
              en="Marital status"
              value={`${s.maritalStatusLabelVi} / ${s.maritalStatusLabelEn}`}
            />
            <FactRow
              label="Thu nhập người đứng đơn"
              en="Applicant income"
              value={`${fmtVndFull(s.applicantMonthlyIncome)}/tháng`}
            />
            {s.spouseMonthlyIncome != null ? (
              <FactRow
                label="Thu nhập vợ/chồng"
                en="Spouse income"
                value={`${fmtVndFull(s.spouseMonthlyIncome)}/tháng`}
              />
            ) : null}
            <FactRow
              label="Tổng thu nhập hộ"
              en="Household income"
              value={`${fmtVndFull(s.householdMonthlyIncome)}/tháng`}
              highlight
            />
            <FactRow
              label="Nhà tại tỉnh/TP dự án"
              en="Home in project province"
              value={
                s.ownsHomeInProvince
                  ? `Có${s.areaPerPersonSqm != null ? ` · ${s.areaPerPersonSqm} m²/người` : ""}`
                  : "Chưa có / không đứng tên"
              }
            />
            <FactRow
              label="Đã hưởng chính sách nhà ở"
              en="Prior housing benefit"
              value={s.everBenefitedHousingPolicy ? "Có" : "Không"}
            />
            <FactRow
              label="Dự định vay NH"
              en="Bank loan intent"
              value={s.intendToBorrow ? "Có" : "Không"}
            />
            {s.intendToBorrow ? (
              <>
                <FactRow
                  label="Trả nợ hiện tại"
                  en="Existing debt payment"
                  value={
                    s.existingMonthlyDebtPayment != null
                      ? `${fmtVndFull(s.existingMonthlyDebtPayment)}/tháng`
                      : "0 đ/tháng"
                  }
                />
                <FactRow
                  label="Hạn mức thẻ tín dụng"
                  en="Credit card limits"
                  value={
                    s.creditCardLimitTotal != null && s.creditCardLimitTotal > 0
                      ? fmtVndFull(s.creditCardLimitTotal)
                      : "Không có / 0"
                  }
                />
                <FactRow
                  label="Nợ xấu"
                  en="Bad debt"
                  value={`${s.badDebtLabelVi} / ${s.badDebtLabelEn}`}
                />
              </>
            ) : null}
            <FactRow
              label="Thời điểm dự định mua"
              en="Purchase timeframe"
              value={`${s.timeframeLabelVi} / ${s.timeframeLabelEn}`}
            />
          </Section>

          <Section title="Kết quả sàng lọc NOXH" titleEn="NOXH eligibility">
            <p className="mb-2 text-xs text-slate-500">
              {ev.overallLabelVi} · {ev.overallLabelEn} · {snapshot.rulesVersion}
            </p>
            <ConditionRow
              label="Đối tượng"
              en="Object"
              status={ev.objectStatus}
              reason={ev.objectReason}
            />
            <ConditionRow
              label="Nhà ở"
              en="Housing"
              status={ev.housingStatus}
              reason={ev.housingReason}
            />
            <ConditionRow
              label="Thu nhập"
              en="Income"
              status={ev.incomeStatus}
              reason={ev.incomeReason}
            />
            {ev.incomeCeiling != null ? (
              <p className="mt-1 text-xs text-slate-600">
                Trần áp dụng: {fmtVndFull(ev.incomeCeiling)}/tháng · Thu nhập xét:{" "}
                {fmtVndFull(ev.effectiveIncome)}/tháng
                {ev.incomeNearCeiling ? " · Sát trần" : ""}
              </p>
            ) : null}
          </Section>

          {s.intendToBorrow ? (
            <Section title="Khả năng vay ngân hàng" titleEn="Credit readiness">
              <p className="font-medium text-slate-800">
                {cr.flagLabelVi}{" "}
                <span className="text-xs font-normal text-slate-500">
                  / {cr.flagLabelEn}
                </span>
              </p>
              {cr.dtiPercent ? (
                <p className="mt-1 text-slate-700">
                  DTI ước tính: <strong>{cr.dtiPercent}</strong> · Nghĩa vụ quy đổi:{" "}
                  {fmtVndFull(cr.estimatedMonthlyObligation)}/tháng
                </p>
              ) : null}
              {cr.reasons.length > 0 ? (
                <ul className="mt-2 list-inside list-disc text-xs text-slate-600">
                  {cr.reasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              ) : null}
            </Section>
          ) : null}

          {(ev.alternativeHints.length > 0 || ev.nextSteps.length > 0) && (
            <Section title="Hướng xử lý Ops" titleEn="Ops guidance">
              {ev.alternativeHints.length > 0 ? (
                <div className="mb-2 rounded border border-violet-200 bg-violet-50 p-2 text-xs text-violet-900">
                  <p className="font-medium">Lưu ý chuyển nhóm / không loại sớm</p>
                  <ul className="mt-1 list-inside list-disc">
                    {ev.alternativeHints.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {ev.nextSteps.length > 0 ? (
                <ul className="list-inside list-disc text-xs text-slate-600">
                  {ev.nextSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              ) : null}
            </Section>
          )}

          <p className="text-[10px] text-slate-400">
            Ghi nhận: {new Date(snapshot.capturedAt).toLocaleString("vi-VN")} · Chỉ
            Admin
          </p>
        </>
      ) : null}
    </div>
  );
}

function Section({
  title,
  titleEn,
  children,
}: {
  title: string;
  titleEn: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}{" "}
        <span className="font-normal normal-case text-slate-400">/ {titleEn}</span>
      </h4>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}

function FactRow({
  label,
  en,
  value,
  highlight,
}: {
  label: string;
  en: string;
  value: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-between gap-x-2 gap-y-0.5 text-xs">
      <span className="text-slate-500">
        {label} <span className="text-slate-400">/ {en}</span>
      </span>
      <span
        className={cn(
          "text-right text-slate-800",
          highlight && "font-semibold text-brand-800",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function ConditionRow({
  label,
  en,
  status,
  reason,
}: {
  label: string;
  en: string;
  status: keyof typeof STATUS_LABELS;
  reason: string;
}) {
  const tone = statusTone(status);
  const badge =
    tone === "ok"
      ? "bg-emerald-100 text-emerald-800"
      : tone === "bad"
        ? "bg-rose-100 text-rose-800"
        : tone === "warn"
          ? "bg-amber-100 text-amber-800"
          : "bg-slate-100 text-slate-600";

  const st = STATUS_LABELS[status];

  return (
    <div className="rounded border border-slate-100 bg-slate-50/50 px-2 py-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-700">
          {label} <span className="text-slate-400">/ {en}</span>
        </span>
        <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold", badge)}>
          {st.vi} / {st.en}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-slate-600">{reason}</p>
    </div>
  );
}
