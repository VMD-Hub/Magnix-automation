"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { telHref } from "@/lib/privacy/phone";
import { turnstileSiteKey } from "@/lib/security/turnstile-public";
import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { LeadContactForm } from "@/components/leads/lead-contact-form";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "revealed"; phone: string }
  | { kind: "need_login" }
  | { kind: "need_verify_email"; email?: string }
  | { kind: "not_customer" }
  | { kind: "need_captcha" }
  | { kind: "error"; message: string };

export function BrokerContactCard({
  code,
  listingId,
  brokerName,
  maskedPhone,
  licenseVerified,
  brokerLabel,
  autoReveal = false,
}: {
  code: string;
  listingId: string;
  brokerName: string;
  maskedPhone: string;
  licenseVerified?: boolean;
  brokerLabel?: string;
  autoReveal?: boolean;
}) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRequired = Boolean(turnstileSiteKey());
  const pendingRevealRef = useRef(false);

  const fetchContact = useCallback(
    async (token?: string | null) => {
      setState({ kind: "loading" });
      setResendMsg(null);
      try {
        const res = turnstileRequired
          ? await fetch(`/api/listings/${code}/contact`, {
              method: "POST",
              headers: {
                accept: "application/json",
                "content-type": "application/json",
              },
              body: JSON.stringify({ turnstileToken: token }),
            })
          : await fetch(`/api/listings/${code}/contact`, {
              headers: { accept: "application/json" },
            });
        const json = await res.json().catch(() => ({}));

        if (res.status === 401) {
          setState({ kind: "need_login" });
          return;
        }
        if (res.status === 403 && json?.error?.code === "EMAIL_NOT_VERIFIED") {
          const me = await fetch("/api/auth/me")
            .then((r) => r.json())
            .catch(() => ({}));
          setState({
            kind: "need_verify_email",
            email: me.data?.user?.email,
          });
          return;
        }
        if (res.status === 403 && json?.error?.code === "CUSTOMER_ONLY") {
          setState({ kind: "not_customer" });
          return;
        }
        if (res.status === 403 && json?.error?.code === "CAPTCHA_FAILED") {
          setTurnstileToken(null);
          setState({
            kind: "error",
            message: json?.error?.message ?? "Xác minh không thành công.",
          });
          return;
        }
        if (res.status === 429) {
          setState({
            kind: "error",
            message: "Bạn đã xem quá nhiều số. Vui lòng thử lại sau.",
          });
          return;
        }
        if (!res.ok) {
          setState({
            kind: "error",
            message: json?.error?.message ?? "Không lấy được số. Thử lại sau.",
          });
          return;
        }
        setState({ kind: "revealed", phone: json.data.phone as string });
      } catch {
        setState({ kind: "error", message: "Lỗi kết nối. Thử lại sau." });
      }
    },
    [code, turnstileRequired],
  );

  const reveal = useCallback(() => {
    if (turnstileRequired && !turnstileToken) {
      pendingRevealRef.current = true;
      setState({ kind: "need_captcha" });
      return;
    }
    void fetchContact(turnstileToken);
  }, [fetchContact, turnstileRequired, turnstileToken]);

  useEffect(() => {
    if (autoReveal) void reveal();
  }, [autoReveal, reveal]);

  useEffect(() => {
    if (turnstileToken && pendingRevealRef.current) {
      pendingRevealRef.current = false;
      void fetchContact(turnstileToken);
    }
  }, [turnstileToken, fetchContact]);

  async function resendVerification() {
    setResending(true);
    setResendMsg(null);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const json = await res.json().catch(() => ({}));
      setResendMsg(
        res.ok
          ? "Đã gửi lại email xác nhận. Kiểm tra hộp thư (và spam)."
          : (json?.error?.message ?? "Không gửi được email."),
      );
    } catch {
      setResendMsg("Lỗi kết nối.");
    } finally {
      setResending(false);
    }
  }

  const next = encodeURIComponent(`/tin-dang/${code}?reveal=1`);
  const loginHref = `/dang-nhap?next=${next}`;
  const registerHref = `/dang-ky/khach-hang?next=${next}`;

  return (
    <div className="proptech-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-xl font-bold text-brand-700">
          {brokerName.charAt(0)}
        </span>
        <div>
          <p className="flex items-center gap-1 font-semibold text-slate-900">
            {brokerName}
            {licenseVerified ? (
              <Icon.BadgeCheck className="text-base text-brand-600" />
            ) : null}
          </p>
          {brokerLabel ? (
            <p className="text-xs text-slate-500">{brokerLabel}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-silver-50 p-3 text-center ring-1 ring-silver-200">
        {state.kind === "revealed" ? (
          <a
            href={telHref(state.phone)}
            className="text-xl font-bold tracking-wider text-brand-700"
          >
            {state.phone}
          </a>
        ) : (
          <span className="text-xl font-bold tracking-wider text-slate-400">
            {maskedPhone}
          </span>
        )}
      </div>

      {turnstileRequired &&
      (state.kind === "idle" ||
        state.kind === "need_captcha" ||
        state.kind === "loading" ||
        state.kind === "error") ? (
        <div className="mt-4 flex justify-center">
          <TurnstileWidget
            onToken={(t) => setTurnstileToken(t)}
            onExpire={() => setTurnstileToken(null)}
          />
        </div>
      ) : null}

      <div className="mt-4 space-y-2">
        {state.kind === "revealed" ? (
          <ButtonLink href={telHref(state.phone)} className="w-full">
            <Icon.Phone className="text-base" /> Gọi {state.phone}
          </ButtonLink>
        ) : (
          <Button
            type="button"
            className="w-full"
            onClick={reveal}
            disabled={state.kind === "loading"}
          >
            <Icon.Phone className="text-base" />
            {state.kind === "loading" ? "Đang tải…" : "Hiện số điện thoại"}
          </Button>
        )}

        <Button type="button" variant="zalo" className="w-full">
          <Icon.Chat className="text-base" /> Chat Zalo
        </Button>
        <LeadContactForm listingId={listingId} compact />
      </div>

      {state.kind === "need_login" ? (
        <div className="mt-3 space-y-2 rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-900">
          <p>Đăng nhập tài khoản khách hàng và xác nhận email để xem số.</p>
          <div className="flex justify-center gap-2">
            <Link
              href={loginHref}
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
            >
              Đăng nhập
            </Link>
            <Link
              href={registerHref}
              className="rounded-lg border border-brand-300 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      ) : null}

      {state.kind === "need_verify_email" ? (
        <div className="mt-3 space-y-2 rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-900">
          <p>
            Bạn cần <strong>xác nhận email</strong>
            {state.email ? (
              <>
                {" "}
                (<span className="font-medium">{state.email}</span>)
              </>
            ) : null}{" "}
            trước khi xem số điện thoại.
          </p>
          <button
            type="button"
            onClick={resendVerification}
            disabled={resending}
            className="text-xs font-semibold text-brand-700 underline hover:text-brand-800"
          >
            {resending ? "Đang gửi…" : "Gửi lại email xác nhận"}
          </button>
          {resendMsg ? <p className="text-xs text-amber-800">{resendMsg}</p> : null}
        </div>
      ) : null}

      {state.kind === "not_customer" ? (
        <p className="mt-3 rounded-lg bg-slate-100 p-3 text-center text-sm text-slate-700">
          Bạn đang đăng nhập tài khoản môi giới. Để xem SĐT liên hệ, hãy dùng{" "}
          <Link href={registerHref} className="font-semibold text-brand-700 underline">
            tài khoản khách hàng
          </Link>
          .
        </p>
      ) : null}

      {state.kind === "error" ? (
        <p className="mt-3 rounded-lg bg-rose-50 p-3 text-center text-sm text-rose-700">
          {state.message}
        </p>
      ) : null}

      <p className="mt-3 text-center text-xs text-slate-400">
        <Icon.ShieldCheck className="mr-1 inline text-sm" />
        {turnstileRequired
          ? "Xác minh + tài khoản khách đã xác nhận email mới xem được số."
          : "Chỉ khách hàng đã xác nhận email mới xem được số liên hệ."}
      </p>
    </div>
  );
}
