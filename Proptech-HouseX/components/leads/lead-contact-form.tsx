"use client";

import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/tools/phone-input";
import { readStoredLeadUtm } from "@/lib/leads/client-utm";
import {
  interestWaitlistFormCopy,
  type LeadCaptureIntent,
} from "@/lib/content/messaging/interest-waitlist-copy";
import {
  rentalNeedPmWaitlistCopy,
  rentalTaxHelpFormCopy,
} from "@/lib/content/messaging/rental-waitlist-copy";
import type { RentalLeadIntentInput } from "@/lib/rules/rental-lead-intent";
import type { PartnerReferralKind } from "@/lib/leads/rental-partner-referral";

type Props = {
  listingId?: string;
  projectId?: string;
  /** consult = tư vấn/gọi; waitlist = nhận tin, không cold-call (ADR-016 P0). */
  intent?: LeadCaptureIntent;
  /** ADR-018 — hub thuê / tin RENT. */
  rentalIntent?: RentalLeadIntentInput;
  /** Tiêu đề form — mặc định theo ngữ cảnh / intent. */
  title?: string;
  /** Gọn cho sidebar tin đăng. */
  compact?: boolean;
  /** Mở sẵn (không cần bấm nút) — dùng trên trang dự án. */
  defaultOpen?: boolean;
  placeholderMessage?: string;
};

function defaultTitle(
  intent: LeadCaptureIntent,
  listingId?: string,
  projectId?: string,
  rentalIntent?: RentalLeadIntentInput,
) {
  if (rentalIntent === "landlord") return "Chủ nhà — cần tìm khách thuê";
  if (rentalIntent === "tax_help") return "Tư vấn thuế / kế toán cho thuê";
  if (rentalIntent === "need_pm") return rentalNeedPmWaitlistCopy.title;
  if (intent === "waitlist") return interestWaitlistFormCopy.title;
  if (listingId) return "Để lại số — tư vấn tin này";
  if (projectId) return "Đăng ký tư vấn dự án";
  return "Để lại thông tin liên hệ";
}

export function LeadContactForm({
  listingId,
  projectId,
  intent = "consult",
  rentalIntent,
  title,
  compact = false,
  defaultOpen = false,
  placeholderMessage,
}: Props) {
  const formId = useId();
  const [open, setOpen] = useState(defaultOpen || !compact);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [emailDigestOptIn, setEmailDigestOptIn] = useState(false);
  const [partnerReferralOptIn, setPartnerReferralOptIn] = useState(false);
  const [partnerReferralKind, setPartnerReferralKind] =
    useState<PartnerReferralKind>("BOTH");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needPmWaitlist = rentalIntent === "need_pm";
  const waitlist = intent === "waitlist" || needPmWaitlist;
  const taxHelp = rentalIntent === "tax_help";
  const waitlistCopy = needPmWaitlist
    ? rentalNeedPmWaitlistCopy
    : interestWaitlistFormCopy;

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => {
        const u = j.data?.user;
        if (!u || u.role !== "CUSTOMER") return;
        if (u.name) setName(u.name);
        if (u.email) setEmail(u.email);
      })
      .catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError(
        waitlist
          ? "Vui lòng đồng ý nhận cập nhật theo cam kết kênh."
          : "Vui lòng đồng ý cho phép liên hệ.",
      );
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (waitlist && emailDigestOptIn && !email.trim()) {
        setError("Nhập email nếu muốn nhận bản tin / digest qua email.");
        setLoading(false);
        return;
      }
      const utm = readStoredLeadUtm();
      const channelPreference = waitlist
        ? emailDigestOptIn
          ? ["in_app", "email"]
          : ["in_app"]
        : ["voice_call", "in_app"];
      const body: Record<string, string | boolean | undefined | object | string[]> = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        message: message.trim() || undefined,
        listingId,
        projectId,
        rentalIntent,
        source: rentalIntent && !listingId && !projectId ? "web:rental_hub" : undefined,
        captureType: waitlist ? "waitlist" : "consult_request",
        channelPreference,
        marketingEmailOptIn: waitlist ? emailDigestOptIn : false,
        ...(taxHelp && partnerReferralOptIn
          ? {
              partnerReferralOptIn: true,
              partnerReferralKind,
            }
          : {}),
        ...(utm ? { utm } : {}),
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": `${formId}-${phone.trim()}-${listingId ?? projectId ?? rentalIntent ?? "x"}`,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message ?? "Không gửi được yêu cầu.");
        return;
      }
      setDone(true);
    } catch {
      setError("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  }

  const heading = title ?? defaultTitle(intent, listingId, projectId, rentalIntent);
  const messagePlaceholder =
    placeholderMessage ??
    (rentalIntent === "landlord"
      ? "Khu vực, loại căn, giá thuê kỳ vọng…"
      : rentalIntent === "tax_help"
        ? "Số căn đang cho thuê / thắc mắc thuế…"
        : needPmWaitlist
          ? rentalNeedPmWaitlistCopy.placeholderMessage
          : waitlist
            ? interestWaitlistFormCopy.placeholderMessage
            : undefined);

  if (done) {
    return (
      <div
        className={
          compact
            ? "rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center"
            : "rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center"
        }
      >
        <p className="font-semibold text-emerald-900">
          {waitlist ? waitlistCopy.successTitle : "Đã gửi yêu cầu tư vấn"}
        </p>
        <p className="mt-2 text-sm text-emerald-800">
          {waitlist ? (
            waitlistCopy.successBody
          ) : (
            <>
              Chuyên viên sẽ liên hệ trong giờ làm việc. Bạn có thể theo dõi trạng
              thái tại{" "}
              <a href="/khach-hang/tai-khoan" className="font-semibold underline">
                tài khoản khách hàng
              </a>
              .
            </>
          )}
        </p>
        {needPmWaitlist ? (
          <div className="mt-3 flex flex-col items-center gap-2 text-sm sm:flex-row sm:justify-center">
            <a
              href={rentalNeedPmWaitlistCopy.successToolHref}
              className="font-semibold text-emerald-900 underline"
            >
              {rentalNeedPmWaitlistCopy.successToolCta}
            </a>
            <span className="hidden text-emerald-700 sm:inline">·</span>
            <a
              href={rentalNeedPmWaitlistCopy.successHubHref}
              className="font-semibold text-emerald-900 underline"
            >
              {rentalNeedPmWaitlistCopy.successHubCta}
            </a>
          </div>
        ) : waitlist ? (
          <div className="mt-3 flex flex-col items-center gap-2 text-sm sm:flex-row sm:justify-center">
            <a
              href="/khach-hang/tai-khoan"
              className="font-semibold text-emerald-900 underline"
            >
              {interestWaitlistFormCopy.successAccountCta}
            </a>
            <span className="hidden text-emerald-700 sm:inline">·</span>
            <a
              href={interestWaitlistFormCopy.successEligibilityHref}
              className="font-semibold text-emerald-900 underline"
            >
              {interestWaitlistFormCopy.successEligibilityCta}
            </a>
          </div>
        ) : null}
      </div>
    );
  }

  if (compact && !open) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        {waitlist ? waitlistCopy.compactTrigger : "Để lại số điện thoại"}
      </Button>
    );
  }

  const inputCls =
    "mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <form
      onSubmit={submit}
      className={
        compact
          ? "mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left"
          : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      }
    >
      <p
        className={
          compact
            ? "text-xs font-semibold text-slate-800"
            : "text-lg font-bold text-slate-900"
        }
      >
        {heading}
      </p>
      {!compact && (
        <p className="mt-1 text-sm text-slate-600">
          {waitlist ? (
            waitlistCopy.intro
          ) : taxHelp ? (
            rentalTaxHelpFormCopy.intro
          ) : (
            <>
              Ghi nhận nhu cầu gắn với {listingId ? "tin đăng" : "dự án"} này —
              môi giới hoặc vận hành HouseX sẽ phản hồi trong giờ làm việc.
            </>
          )}
        </p>
      )}
      {waitlist && compact ? (
        <p className="mt-1 text-[11px] text-slate-600">
          {waitlistCopy.intro}
        </p>
      ) : null}
      {taxHelp && compact ? (
        <p className="mt-1 text-[11px] text-slate-600">
          {rentalTaxHelpFormCopy.intro}
        </p>
      ) : null}

      <div className={`grid gap-3 ${compact ? "mt-3" : "mt-5 sm:grid-cols-2"}`}>
        <label className="block sm:col-span-1">
          <span className="text-xs font-medium text-slate-700">Họ tên *</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </label>
        <label className="block sm:col-span-1">
          <span className="text-xs font-medium text-slate-700">
            Số điện thoại *
          </span>
          <PhoneInput
            required
            value={phone}
            onChange={setPhone}
            className={inputCls}
          />
        </label>
        <label className={`block ${compact ? "" : "sm:col-span-2"}`}>
          <span className="text-xs font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
        </label>
        <label className={`block ${compact ? "" : "sm:col-span-2"}`}>
          <span className="text-xs font-medium text-slate-700">Nội dung</span>
          <textarea
            rows={compact ? 2 : 3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={messagePlaceholder}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
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
          {waitlist ? (
            <>
              {waitlistCopy.consentLabel} (xem{" "}
              <a href="/bao-mat" className="text-brand-700 underline">
                chính sách bảo mật
              </a>
              ).
            </>
          ) : (
            <>
              Tôi đồng ý HouseX liên hệ qua điện thoại/email để tư vấn theo thông
              tin đã cung cấp (xem{" "}
              <a href="/bao-mat" className="text-brand-700 underline">
                chính sách bảo mật
              </a>
              ).
            </>
          )}
        </span>
      </label>

      {taxHelp ? (
        <>
          <label className="mt-2 flex items-start gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={partnerReferralOptIn}
              onChange={(e) => setPartnerReferralOptIn(e.target.checked)}
              className="mt-0.5 rounded border-slate-300"
            />
            <span>{rentalTaxHelpFormCopy.partnerConsentLabel}</span>
          </label>
          {partnerReferralOptIn ? (
            <label className="mt-2 block text-xs text-slate-600">
              <span className="font-medium text-slate-700">Loại hỗ trợ</span>
              <select
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm"
                value={partnerReferralKind}
                onChange={(e) =>
                  setPartnerReferralKind(e.target.value as PartnerReferralKind)
                }
              >
                <option value="BOTH">Kế toán + pháp lý HĐ</option>
                <option value="ACCOUNTING">Kế toán / thuế</option>
                <option value="LEGAL">Pháp lý hợp đồng thuê</option>
              </select>
            </label>
          ) : null}
        </>
      ) : null}

      {waitlist ? (
        <label className="mt-2 flex items-start gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={emailDigestOptIn}
            onChange={(e) => setEmailDigestOptIn(e.target.checked)}
            className="mt-0.5 rounded border-slate-300"
          />
          <span>
            Nhận thêm bản tin / digest tiến độ qua <strong>email</strong> (kênh
            phụ — cập nhật chính vẫn trên thông báo tài khoản). Có thể hủy bất
            cứ lúc nào.
          </span>
        </label>
      ) : null}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <div className={`flex gap-2 ${compact ? "mt-3" : "mt-5"}`}>
        <Button
          type="submit"
          disabled={loading}
          className={compact ? "flex-1" : undefined}
        >
          {loading
            ? "Đang gửi…"
            : waitlist
              ? waitlistCopy.submitLabel
              : "Gửi yêu cầu"}
        </Button>
        {compact && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Huỷ
          </Button>
        )}
      </div>
    </form>
  );
}
