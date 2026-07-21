"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import { track } from "@/lib/analytics/track";
import { articlePath } from "@/lib/content/article-routes";
import { NOXH_CATALOG_PATH } from "@/lib/content/project-catalog-routes";
import { NoxhChecklistPrint } from "@/components/tools/noxh-checklist-print";
import { VndInput } from "@/components/tools/vnd-input";
import { PhoneInput } from "@/components/tools/phone-input";
import { DecimalInput } from "@/components/tools/decimal-input";
import {
  evaluateNoxhEligibility,
  type MaritalStatus,
  type ConditionStatus,
} from "@/lib/finance/noxh-eligibility";
import {
  assessCreditReadiness,
  type BadDebtStatus,
} from "@/lib/finance/credit-readiness";
import {
  classifyLead,
  type LeadTier,
  type PurchaseTimeframe,
} from "@/lib/finance/noxh-lead";
import {
  NOXH_OBJECT_GROUPS,
  type NoxhObjectGroupId,
  CURRENT_NOXH_RULES,
} from "@/lib/finance/noxh-rules";

/* ---------- helpers ---------- */

const inputCls =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

const STEP_LABELS = ["Đối tượng", "Nhà ở", "Thu nhập", "Tài chính", "Kết quả"];

/** Thứ tự nhóm đối tượng hiển thị (nhóm phổ biến trước). */
const OBJECT_ORDER: NoxhObjectGroupId[] = [
  "LOW_INCOME_URBAN",
  "WORKER",
  "CIVIL_SERVANT",
  "ARMED_FORCES",
  "MERIT",
  "POOR_URBAN",
  "POOR_RURAL",
  "LAND_RECOVERED",
  "RETURNED_OFFICIAL_HOUSING",
  "NONE",
];

const MARITAL_OPTIONS: { id: MaritalStatus; label: string; hint: string }[] = [
  { id: "SINGLE", label: "Độc thân / chưa kết hôn", hint: "Trần 25 triệu/tháng" },
  {
    id: "SINGLE_WITH_MINOR",
    label: "Độc thân, đang nuôi con nhỏ",
    hint: "Trần 35 triệu/tháng",
  },
  { id: "MARRIED", label: "Đã kết hôn", hint: "Tổng 2 vợ chồng ≤ 50 triệu/tháng" },
];

const TIMEFRAME_OPTIONS: { id: PurchaseTimeframe; label: string }[] = [
  { id: "NOW", label: "Trong 1 tháng" },
  { id: "WITHIN_3M", label: "1 – 3 tháng" },
  { id: "WITHIN_6M_PLUS", label: "Trên 6 tháng" },
  { id: "UNSURE", label: "Chưa rõ" },
];

/* ---------- small UI atoms ---------- */

function YesNo({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  const opts = [
    { v: true, label: "Có" },
    { v: false, label: "Không" },
  ];
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      {opts.map((o) => (
        <button
          key={o.label}
          type="button"
          onClick={() => onChange(o.v)}
          className={cn(
            "h-11 rounded-xl border text-sm font-semibold transition-colors",
            value === o.v
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function statusTone(s: ConditionStatus): {
  dot: string;
  text: string;
  label: string;
} {
  switch (s) {
    case "PASS":
      return { dot: "bg-emerald-500", text: "text-emerald-700", label: "Đạt" };
    case "FAIL":
      return { dot: "bg-red-500", text: "text-red-700", label: "Chưa đạt" };
    default:
      return { dot: "bg-amber-500", text: "text-amber-700", label: "Cần bổ sung" };
  }
}

function PillarCard({
  title,
  status,
  reason,
}: {
  title: string;
  status: ConditionStatus;
  reason: string;
}) {
  const tone = statusTone(status);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className={cn("h-2.5 w-2.5 rounded-full", tone.dot)} />
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <span className={cn("ml-auto text-xs font-semibold", tone.text)}>
          {tone.label}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{reason}</p>
    </div>
  );
}

const TIER_META: Record<
  LeadTier,
  { label: string; box: string; text: string }
> = {
  HOT: {
    label: "Sẵn sàng — nên gặp chuyên gia ngay",
    box: "border-emerald-200 bg-emerald-50",
    text: "text-emerald-800",
  },
  WARM: {
    label: "Có tiềm năng — cần chuyên gia hỗ trợ",
    box: "border-amber-200 bg-amber-50",
    text: "text-amber-800",
  },
  COLD: {
    label: "Cần thêm thời gian / phương án khác",
    box: "border-sky-200 bg-sky-50",
    text: "text-sky-800",
  },
  OUT: {
    label: "Có thể phù hợp nhà ở thương mại hơn",
    box: "border-slate-200 bg-slate-50",
    text: "text-slate-700",
  },
};

/* ---------- main wizard ---------- */

export function NoxhEligibilityWizard() {
  const [step, setStep] = useState(0);

  // B1 — đối tượng
  const [objectGroup, setObjectGroup] = useState<NoxhObjectGroupId | null>(null);

  // B2 — nhà ở
  const [ownsHome, setOwnsHome] = useState<boolean | null>(null);
  const [areaPerPerson, setAreaPerPerson] = useState<number>(0);
  const [everBenefited, setEverBenefited] = useState<boolean | null>(null);

  // B3 — thu nhập
  const [marital, setMarital] = useState<MaritalStatus | null>(null);
  const [applicantIncome, setApplicantIncome] = useState<number>(0);
  const [spouseIncome, setSpouseIncome] = useState<number>(0);

  // B4 — tài chính & tín dụng
  const [timeframe, setTimeframe] = useState<PurchaseTimeframe | null>(null);
  const [intendToBorrow, setIntendToBorrow] = useState<boolean | null>(null);
  const [existingDebt, setExistingDebt] = useState<number>(0);
  const [cardLimit, setCardLimit] = useState<number>(0);
  const [badDebt, setBadDebt] = useState<BadDebtStatus | null>(null);

  // B5 — lead (soft gate)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const evaluation = useMemo(
    () =>
      evaluateNoxhEligibility({
        objectGroup,
        ownsHomeInProvince: ownsHome === true,
        areaPerPersonSqm:
          ownsHome === true ? (areaPerPerson > 0 ? areaPerPerson : undefined) : undefined,
        everBenefitedHousingPolicy: everBenefited === true,
        maritalStatus: marital ?? "SINGLE",
        applicantMonthlyIncome: applicantIncome,
        spouseMonthlyIncome: spouseIncome,
      }),
    [
      objectGroup,
      ownsHome,
      areaPerPerson,
      everBenefited,
      marital,
      applicantIncome,
      spouseIncome,
    ],
  );

  const credit = useMemo(
    () =>
      assessCreditReadiness({
        intendToBorrow: intendToBorrow === true,
        householdMonthlyIncome:
          marital === "MARRIED" ? applicantIncome + spouseIncome : applicantIncome,
        existingMonthlyDebtPayment: existingDebt,
        creditCardLimitTotal: cardLimit,
        badDebtSelfOrSpouse: badDebt ?? "UNKNOWN",
      }),
    [intendToBorrow, marital, applicantIncome, spouseIncome, existingDebt, cardLimit, badDebt],
  );

  const classification = useMemo(
    () =>
      classifyLead(evaluation, credit, {
        timeframe: timeframe ?? "UNSURE",
        hasContact: unlocked,
      }),
    [evaluation, credit, timeframe, unlocked],
  );

  useEffect(() => {
    track("noxh_tool_view");
  }, []);

  useEffect(() => {
    if (step !== 4 || evaluation.overall !== "ELIGIBLE") return;
    void fetch("/api/promotions/noxh-pass", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ overall: "ELIGIBLE" }),
    }).catch(() => undefined);
  }, [step, evaluation.overall]);

  function goNext() {
    track("noxh_step_complete", { step: step + 1, stepName: STEP_LABELS[step] });
    const nextStep = Math.min(4, step + 1);
    if (nextStep === 4) {
      track("noxh_result_view", {
        overall: evaluation.overall,
        creditFlag: credit.flag,
      });
    }
    setStep(nextStep);
  }

  function handlePrint() {
    track("noxh_pdf_download", { tier: classification.tier });
    window.print();
  }

  const groupInfo = objectGroup ? NOXH_OBJECT_GROUPS[objectGroup] : null;

  const canNext = (() => {
    switch (step) {
      case 0:
        return objectGroup !== null;
      case 1:
        return (
          everBenefited !== null &&
          ownsHome !== null &&
          (ownsHome === false || areaPerPerson > 0)
        );
      case 2:
        return marital !== null && applicantIncome > 0;
      case 3:
        return (
          timeframe !== null &&
          intendToBorrow !== null &&
          (intendToBorrow === false || badDebt !== null)
        );
      default:
        return true;
    }
  })();

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setFormError("Vui lòng nhập họ tên, số điện thoại và email để nhận file.");
      return;
    }
    if (!consent) {
      setFormError("Vui lòng đồng ý nhận lộ trình và tư vấn qua email.");
      return;
    }
    setFormError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/tools/noxh-eligibility", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          marketingEmailOptIn: consent,
          input: {
            objectGroup: objectGroup ?? "NONE",
            ownsHomeInProvince: ownsHome === true,
            areaPerPersonSqm:
              ownsHome === true && areaPerPerson > 0 ? areaPerPerson : undefined,
            everBenefitedHousingPolicy: everBenefited === true,
            maritalStatus: marital ?? "SINGLE",
            applicantMonthlyIncome: applicantIncome,
            spouseMonthlyIncome: marital === "MARRIED" ? spouseIncome : undefined,
            intendToBorrow: intendToBorrow === true,
            existingMonthlyDebtPayment: existingDebt || undefined,
            creditCardLimitTotal: cardLimit || undefined,
            badDebtSelfOrSpouse: badDebt ?? "UNKNOWN",
            timeframe: timeframe ?? "UNSURE",
          },
        }),
      });

      if (!res.ok) {
        let message = "Không gửi được thông tin. Vui lòng thử lại sau.";
        try {
          const body = (await res.json()) as {
            error?: { message?: string };
          };
          if (body.error?.message) message = body.error.message;
        } catch {
          /* ignore parse error */
        }
        setFormError(message);
        return;
      }

      setUnlocked(true);
      const finalClass = classifyLead(evaluation, credit, {
        timeframe: timeframe ?? "UNSURE",
        hasContact: true,
      });
      track("noxh_lead_submit", {
        tier: finalClass.tier,
        overall: evaluation.overall,
        creditFlag: credit.flag,
      });
    } catch {
      setFormError(
        "Không kết nối được máy chủ. Kiểm tra mạng và thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const overallMeta = {
    ELIGIBLE: {
      label: "Có khả năng đủ điều kiện mua NOXH",
      box: "border-emerald-200 bg-emerald-50",
      text: "text-emerald-800",
    },
    CONDITIONAL: {
      label: "Gần đủ — cần bổ sung thông tin",
      box: "border-amber-200 bg-amber-50",
      text: "text-amber-800",
    },
    NOT_ELIGIBLE: {
      label: "Chưa đủ điều kiện mua NOXH",
      box: "border-red-200 bg-red-50",
      text: "text-red-800",
    },
  }[evaluation.overall];

  const tierMeta = TIER_META[classification.tier];

  return (
    <>
    <div className="rounded-2xl border border-silver-200 bg-white/90 p-5 shadow-sm sm:p-6 print:hidden">
      {/* progress */}
      <ol className="mb-6 flex items-center gap-1.5">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-1.5">
            <span
              className={cn(
                "h-1.5 rounded-full transition-colors",
                i <= step ? "bg-brand-600" : "bg-slate-200",
              )}
            />
            <span
              className={cn(
                "hidden text-[11px] font-medium sm:block",
                i === step ? "text-brand-700" : "text-slate-400",
              )}
            >
              {i + 1}. {label}
            </span>
          </li>
        ))}
      </ol>

      {/* STEP 1 — đối tượng */}
      {step === 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Bạn thuộc nhóm đối tượng nào?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Theo Điều 76 Luật Nhà ở 2023. Chọn nhóm sát nhất với bạn.
          </p>
          <div className="mt-4 grid gap-2">
            {OBJECT_ORDER.map((id) => {
              const g = NOXH_OBJECT_GROUPS[id];
              const active = objectGroup === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setObjectGroup(id)}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-colors",
                    active
                      ? "border-brand-600 bg-brand-50"
                      : "border-slate-200 bg-white hover:bg-slate-50",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        active ? "text-brand-800" : "text-slate-800",
                      )}
                    >
                      {g.label}
                    </span>
                    {g.requiresIncome ? (
                      <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                        Xét thu nhập
                      </span>
                    ) : g.eligibleForPurchase ? (
                      <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                        Miễn thu nhập
                      </span>
                    ) : null}
                  </span>
                  {g.note ? (
                    <span className="mt-1 block text-xs text-slate-500">{g.note}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2 — nhà ở */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Tình trạng nhà ở</h2>
          <div>
            <span className="text-sm font-medium text-slate-700">
              Bạn đã có nhà thuộc sở hữu tại tỉnh/TP nơi có dự án chưa?
            </span>
            <YesNo value={ownsHome} onChange={setOwnsHome} />
          </div>

          {ownsHome === true && (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Diện tích ở bình quân đầu người hiện tại (m²)
              </span>
              <DecimalInput
                value={areaPerPerson || 0}
                onChange={setAreaPerPerson}
                min={0}
                max={500}
                className={inputCls}
                aria-label="Diện tích bình quân đầu người"
              />
              <span className="mt-1 block text-xs text-slate-400">
                Dưới {CURRENT_NOXH_RULES.minAreaPerPersonSqm} m²/người vẫn đủ điều kiện.
              </span>
            </label>
          )}

          <div>
            <span className="text-sm font-medium text-slate-700">
              Bạn đã từng mua/thuê mua NOXH hoặc hưởng chính sách hỗ trợ nhà ở chưa?
            </span>
            <YesNo value={everBenefited} onChange={setEverBenefited} />
          </div>
        </div>
      )}

      {/* STEP 3 — thu nhập */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Thu nhập</h2>
          <div>
            <span className="text-sm font-medium text-slate-700">
              Tình trạng hôn nhân
            </span>
            <div className="mt-2 grid gap-2">
              {MARITAL_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMarital(m.id)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-3 text-left transition-colors",
                    marital === m.id
                      ? "border-brand-600 bg-brand-50"
                      : "border-slate-200 bg-white hover:bg-slate-50",
                  )}
                >
                  <span className="text-sm font-semibold text-slate-800">
                    {m.label}
                  </span>
                  <span className="text-xs text-slate-500">{m.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Thu nhập bình quân/tháng của bạn
            </span>
            <VndInput
              value={applicantIncome}
              onChange={setApplicantIncome}
              placeholder="Ví dụ: 18000000"
              className={inputCls}
              aria-label="Thu nhập hàng tháng"
            />
          </label>

          {marital === "MARRIED" && (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Thu nhập bình quân/tháng của vợ/chồng
              </span>
              <VndInput
                value={spouseIncome}
                onChange={setSpouseIncome}
                placeholder="Ví dụ: 15000000"
                className={inputCls}
                aria-label="Thu nhập vợ chồng"
              />
            </label>
          )}
          <p className="text-xs text-slate-400">
            Thu nhập thực nhận bình quân 12 tháng liền kề (theo NĐ 136/2026).
          </p>
        </div>
      )}

      {/* STEP 4 — tài chính & tín dụng */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-slate-900">
            Phương án tài chính & tín dụng
          </h2>

          <div>
            <span className="text-sm font-medium text-slate-700">
              Bạn dự định mua khi nào?
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {TIMEFRAME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTimeframe(t.id)}
                  className={cn(
                    "h-11 rounded-xl border text-sm font-semibold transition-colors",
                    timeframe === t.id
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-slate-700">
              Bạn có dự định vay ngân hàng để mua không?
            </span>
            <YesNo value={intendToBorrow} onChange={setIntendToBorrow} />
          </div>

          {intendToBorrow === true && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Tổng khoản trả nợ vay hiện tại/tháng (nếu có)
                </span>
                <VndInput
                  value={existingDebt}
                  onChange={setExistingDebt}
                  placeholder="0"
                  className={inputCls}
                  aria-label="Trả nợ hàng tháng"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Tổng hạn mức thẻ tín dụng đang dùng (nếu có)
                </span>
                <VndInput
                  value={cardLimit}
                  onChange={setCardLimit}
                  placeholder="0"
                  className={inputCls}
                  aria-label="Hạn mức thẻ"
                />
                <span className="mt-1 block text-xs text-slate-400">
                  Hạn mức thẻ cao làm giảm hạn mức có thể vay khi ngân hàng xét hồ sơ.
                </span>
              </label>
              <div>
                <span className="text-sm font-medium text-slate-700">
                  Bạn hoặc vợ/chồng có đang nợ xấu nhóm 2 trở lên không?
                </span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "NONE", label: "Không" },
                      { id: "GROUP_2_PLUS", label: "Có" },
                      { id: "UNKNOWN", label: "Không chắc" },
                    ] as { id: BadDebtStatus; label: string }[]
                  ).map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setBadDebt(o.id)}
                      className={cn(
                        "h-11 rounded-xl border text-sm font-semibold transition-colors",
                        badDebt === o.id
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                <span className="mt-1 block text-xs text-slate-400">
                  Nợ xấu nhóm 2 (kể cả của vợ/chồng) thường khiến ngân hàng khó duyệt vay.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 5 — kết quả */}
      {step === 4 && (
        <div className="space-y-5">
          <div className={cn("rounded-2xl border p-5", overallMeta.box)}>
            <p className={cn("text-base font-bold", overallMeta.text)}>
              {overallMeta.label}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Kết quả sơ bộ theo {CURRENT_NOXH_RULES.legalBasis[0]} và NĐ 100/2024
              (bản {evaluation.rulesVersion}). Không thay thế xác nhận của cơ quan
              có thẩm quyền.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <PillarCard
              title="Đối tượng"
              status={evaluation.object.status}
              reason={evaluation.object.reason}
            />
            <PillarCard
              title="Nhà ở"
              status={evaluation.housing.status}
              reason={evaluation.housing.reason}
            />
            <PillarCard
              title="Thu nhập"
              status={evaluation.income.status}
              reason={evaluation.income.reason}
            />
          </div>

          {credit.applicable && (
            <div
              className={cn(
                "rounded-xl border p-4",
                credit.flag === "BLOCKER"
                  ? "border-red-200 bg-red-50"
                  : credit.flag === "CAUTION"
                    ? "border-amber-200 bg-amber-50"
                    : "border-emerald-200 bg-emerald-50",
              )}
            >
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Icon.ShieldCheck className="text-base" /> Khả năng vay & tín dụng
              </p>
              {unlocked ? (
                <ul className="mt-2 space-y-1">
                  {credit.reasons.map((r, i) => (
                    <li key={i} className="text-xs leading-relaxed text-slate-700">
                      • {r}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-xs text-slate-600">
                  {credit.flag === "BLOCKER"
                    ? "Hồ sơ có điểm cần xử lý trước khi vay — xem chi tiết & giải pháp bên dưới."
                    : credit.flag === "CAUTION"
                      ? "Có vài điểm cần lưu ý về khả năng vay — xem chi tiết bên dưới."
                      : "Chưa phát hiện rào cản tín dụng rõ ràng."}
                </p>
              )}
            </div>
          )}

          {/* soft gate */}
          {!unlocked ? (
            <form
              onSubmit={submitLead}
              className="proptech-ruby-soft-panel p-5"
            >
              <p className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Icon.FileCheck className="text-lg text-brand-600" /> Nhận lộ trình chi tiết
                qua email + checklist hồ sơ (PDF)
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Để lại thông tin — chúng tôi gửi lộ trình và tư vấn chi tiết qua email cho trường
                hợp của bạn. Không lo bị gọi làm phiền; ưu tiên trao đổi bằng email để bạn chủ
                động đọc và phản hồi.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Họ tên *</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">
                    Số điện thoại *
                  </span>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    className={inputCls}
                    required
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-medium text-slate-700">
                    Email (để nhận file) *
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                  />
                </label>
              </div>
              <label className="mt-3 flex items-start gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300"
                />
                <span>
                  Tôi đồng ý HouseX gửi lộ trình và liên hệ tư vấn qua email (xem{" "}
                  <a href="/bao-mat" className="text-brand-700 underline">
                    chính sách bảo mật
                  </a>
                  ).
                </span>
              </label>
              {formError && (
                <p className="mt-2 text-xs text-red-600">{formError}</p>
              )}
              <Button type="submit" disabled={submitting} className="mt-4 w-full">
                {submitting ? "Đang gửi…" : "Nhận lộ trình và tư vấn chi tiết qua email"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className={cn("rounded-2xl border p-5", tierMeta.box)}>
                <p className={cn("text-sm font-bold", tierMeta.text)}>
                  {tierMeta.label}
                </p>
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-semibold text-slate-800">
                    Việc cần làm tiếp theo:
                  </p>
                  <ul className="space-y-1">
                    {evaluation.nextSteps.map((s, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm leading-relaxed text-slate-700"
                      >
                        <Icon.ChevronRight className="mt-0.5 shrink-0 text-brand-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="mt-4"
                >
                  <Icon.FileCheck className="text-base" /> Tải checklist hồ sơ (PDF)
                </Button>
              </div>

              <div className="rounded-2xl border border-brand-100 bg-white p-5 text-center">
                <p className="flex items-center justify-center gap-2 text-base font-bold text-slate-900">
                  <Icon.Headset className="text-lg text-brand-600" />
                  Để chuyên gia HouseX tư vấn hồ sơ của bạn
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Chúng tôi sẽ giải thích rõ tình trạng hồ sơ và tìm giải pháp phù hợp
                  nhất — dù bạn đã đủ điều kiện hay còn vướng mắc.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <ButtonLink
                    href="/lien-he"
                    variant="primary"
                    size="md"
                    onClick={() => track("noxh_cta_click", { cta: "lien-he" })}
                  >
                    Đặt lịch tư vấn
                  </ButtonLink>
                  <ButtonLink
                    href={NOXH_CATALOG_PATH}
                    variant="brand"
                    size="md"
                    onClick={() => track("noxh_cta_click", { cta: "du-an-noxh" })}
                  >
                    Xem dự án NOXH
                  </ButtonLink>
                </div>
              </div>

              <div className="rounded-2xl border border-silver-200 bg-white p-5">
                <p className="text-sm font-bold text-slate-900">
                  Bước tiếp theo hữu ích
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <a
                    href="/cong-cu/tinh-khoan-vay"
                    onClick={() => track("noxh_cta_click", { cta: "loan-calc" })}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
                  >
                    <Icon.Calculator className="text-base text-brand-600" />
                    Tính khoản vay mua nhà
                  </a>
                  <a
                    href={articlePath("dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat")}
                    onClick={() => track("noxh_cta_click", { cta: "article" })}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
                  >
                    <Icon.FileCheck className="text-base text-brand-600" />
                    Đọc chi tiết điều kiện mua NOXH 2026
                  </a>
                  {evaluation.overall === "ELIGIBLE" ? (
                    <a
                      href="/khuyen-mai"
                      onClick={() => track("noxh_cta_click", { cta: "khuyen-mai" })}
                      className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm font-semibold text-brand-800 transition-colors hover:border-brand-400"
                    >
                      <Icon.BadgeCheck className="text-base text-brand-600" />
                      Tham gia vòng quay khuyến mãi
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* nav */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm font-semibold text-slate-500 hover:text-brand-700 disabled:opacity-40"
        >
          ← Quay lại
        </button>
        {step < 4 ? (
          <Button type="button" onClick={goNext} disabled={!canNext}>
            Tiếp tục
          </Button>
        ) : (
          <span className="text-xs text-slate-400">
            Bước {step + 1}/{STEP_LABELS.length}
          </span>
        )}
      </div>
    </div>

    {unlocked && groupInfo ? (
      <NoxhChecklistPrint
        evaluation={evaluation}
        credit={credit}
        objectGroupLabel={groupInfo.label}
        objectGroupId={objectGroup!}
        requiresIncome={groupInfo.requiresIncome}
        intendToBorrow={intendToBorrow === true}
      />
    ) : null}
    </>
  );
}
