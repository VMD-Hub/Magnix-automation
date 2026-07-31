"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ContractState = {
  status: string;
  signedAt: string | null;
  version: string;
  currentVersion: string;
  title: string;
  termsText: string;
  signed: boolean;
  gateEnabled: boolean;
};

/** Form ký e-contract: terms + OTP + canvas tuỳ chọn. */
export function CtvPartnerContractPanel() {
  const [state, setState] = useState<ContractState | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [emailMasked, setEmailMasked] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/ctv/partner-contract");
      if (res.status === 401 || res.status === 403) {
        window.location.href = "/dang-ky/moi-gioi";
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setErr(json?.error?.message ?? "Không tải được e-contract.");
        return;
      }
      setState(json.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function pointerPos(
    canvas: HTMLCanvasElement,
    e: React.PointerEvent<HTMLCanvasElement>,
  ) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawing.current = true;
    canvas.setPointerCapture(e.pointerId);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const p = pointerPos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const p = pointerPos(canvas, e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function onPointerUp() {
    drawing.current = false;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function canvasDataUrl(): string | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let hasInk = false;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i]! > 0) {
        hasInk = true;
        break;
      }
    }
    if (!hasInk) return null;
    return canvas.toDataURL("image/png");
  }

  async function requestOtp() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/ctv/partner-contract/request-otp", {
        method: "POST",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json?.error?.message ?? "Không gửi được OTP.");
        return;
      }
      setOtpSent(true);
      setEmailMasked(json.data?.emailMasked ?? null);
      setMsg(`Đã gửi mã OTP tới ${json.data?.emailMasked ?? "email đăng ký"}.`);
      void load();
    } finally {
      setBusy(false);
    }
  }

  async function sign() {
    if (!accepted || otp.trim().length !== 6) return;
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/ctv/partner-contract/sign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          otp: otp.trim(),
          accepted: true,
          signatureDataUrl: canvasDataUrl(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json?.error?.message ?? "Không ký được.");
        return;
      }
      setMsg("Đã ký e-contract thành công.");
      setOtp("");
      void load();
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Đang tải…</p>;
  }
  if (!state) {
    return (
      <p className="text-sm text-rose-600">{err ?? "Không tải được."}</p>
    );
  }

  if (state.signed) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
        <h2 className="text-lg font-bold text-slate-900">Đã ký e-contract</h2>
        <p className="mt-2 text-sm text-slate-600">
          Phiên bản <strong>{state.version}</strong>
          {state.signedAt
            ? ` · ${new Date(state.signedAt).toLocaleString("vi-VN")}`
            : ""}
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Bạn có thể khai báo deal A+B+C trên{" "}
          <Link href="/moi-gioi/khai-bao" className="text-brand-700 underline">
            Khai báo
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">{state.title}</h2>
        <p className="mt-1 text-xs text-slate-500">
          Phiên bản {state.currentVersion} · trạng thái {state.status}
          {state.gateEnabled
            ? " · bắt buộc trước khi khai báo deal"
            : " · gate tạm tắt (soft-launch)"}
        </p>
        <div className="mt-4 max-h-72 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm whitespace-pre-wrap text-slate-700">
          {state.termsText}
        </div>
        <label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="mt-1"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <span>Tôi đã đọc và đồng ý điều khoản phiên bản này.</span>
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-900">Xác minh OTP email</h3>
        <p className="mt-1 text-sm text-slate-500">
          Mã 6 số gửi vào email tài khoản House X.
        </p>
        <Button
          type="button"
          size="sm"
          className="mt-3"
          disabled={busy || !accepted}
          onClick={() => void requestOtp()}
        >
          {otpSent ? "Gửi lại OTP" : "Gửi OTP"}
        </Button>
        {emailMasked ? (
          <p className="mt-2 text-xs text-slate-500">Đã gửi tới {emailMasked}</p>
        ) : null}
        {otpSent ? (
          <label className="mt-3 block text-sm font-medium text-slate-700">
            Mã OTP
            <input
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="mt-1 w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm tracking-widest"
              placeholder="••••••"
            />
          </label>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-900">
          Chữ ký tay (tuỳ chọn)
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Vẽ chữ ký trên khung dưới — có thể bỏ trống và chỉ dùng OTP.
        </p>
        <canvas
          ref={canvasRef}
          width={480}
          height={160}
          className="mt-3 w-full touch-none rounded-lg border border-dashed border-slate-300 bg-white"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="mt-2"
          onClick={clearCanvas}
        >
          Xóa chữ ký
        </Button>
      </div>

      {msg ? <p className="text-sm text-emerald-700">{msg}</p> : null}
      {err ? <p className="text-sm text-rose-600">{err}</p> : null}

      <Button
        type="button"
        className="w-full sm:w-auto"
        disabled={busy || !accepted || otp.trim().length !== 6}
        onClick={() => void sign()}
      >
        {busy ? "Đang ký…" : "Ký e-contract"}
      </Button>
    </div>
  );
}
