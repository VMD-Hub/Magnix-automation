"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

type Mode = "set" | "change" | "reset";

/**
 * Đặt / đổi / quên mật khẩu tài khoản (OTP email) — không liên quan quyền tool.
 */
export function AccountPasswordPanel({
  passwordReady,
  defaultEmail = "",
  className,
}: {
  passwordReady: boolean;
  defaultEmail?: string;
  className?: string;
}) {
  const [mode, setMode] = useState<Mode>(passwordReady ? "change" : "set");
  const [email, setEmail] = useState(
    defaultEmail.includes("@users.housex.local") ? "" : defaultEmail,
  );
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  async function requestOtp(purpose: "SET_PASSWORD" | "RESET_PASSWORD") {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/password/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error?.message ?? "Không gửi được mã.");
        return;
      }
      setOtpSent(true);
      setMsg(json.data?.message ?? "Đã gửi mã OTP.");
    } catch {
      setErr("Lỗi kết nối.");
    } finally {
      setBusy(false);
    }
  }

  async function submitSet(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setErr("Mật khẩu xác nhận không khớp.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/password/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error?.message ?? "Đặt mật khẩu thất bại.");
        return;
      }
      setMsg(json.data?.message ?? "Đã đặt mật khẩu.");
      setMode("change");
      setOtp("");
      setPassword("");
      setConfirm("");
      window.location.reload();
    } catch {
      setErr("Lỗi kết nối.");
    } finally {
      setBusy(false);
    }
  }

  async function submitChange(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setErr("Mật khẩu xác nhận không khớp.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/password/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword: password,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error?.message ?? "Đổi mật khẩu thất bại.");
        return;
      }
      setMsg("Đã đổi mật khẩu.");
      setCurrentPassword("");
      setPassword("");
      setConfirm("");
    } catch {
      setErr("Lỗi kết nối.");
    } finally {
      setBusy(false);
    }
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setErr("Mật khẩu xác nhận không khớp.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error?.message ?? "Đặt lại thất bại.");
        return;
      }
      setMsg(json.data?.message ?? "Đã đặt lại mật khẩu.");
      setOtp("");
      setPassword("");
      setConfirm("");
      setMode("change");
    } catch {
      setErr("Lỗi kết nối.");
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm";

  return (
    <section
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      <h2 className="text-sm font-semibold text-slate-900">Mật khẩu tài khoản</h2>
      <p className="mt-1 text-xs text-slate-600">
        Mật khẩu thuộc tài khoản House X (web + Mini App). Quyền tool (telesales…)
        không có mật khẩu riêng. Xác minh bằng <strong>mã OTP 6 số</strong> gửi
        email — không cần bấm link trong mail.
      </p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {!passwordReady ? (
          <button
            type="button"
            className={cn(
              "rounded-full px-2.5 py-1",
              mode === "set" ? "bg-brand-800 text-white" : "bg-slate-100",
            )}
            onClick={() => setMode("set")}
          >
            Đặt mật khẩu
          </button>
        ) : (
          <button
            type="button"
            className={cn(
              "rounded-full px-2.5 py-1",
              mode === "change" ? "bg-brand-800 text-white" : "bg-slate-100",
            )}
            onClick={() => setMode("change")}
          >
            Đổi mật khẩu
          </button>
        )}
        <button
          type="button"
          className={cn(
            "rounded-full px-2.5 py-1",
            mode === "reset" ? "bg-brand-800 text-white" : "bg-slate-100",
          )}
          onClick={() => setMode("reset")}
        >
          Quên mật khẩu
        </button>
      </div>

      {mode === "set" ? (
        <form onSubmit={(e) => void submitSet(e)} className="mt-3 space-y-2">
          <label className="block text-xs">
            Email công việc
            <input
              type="email"
              required
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy || !email}
            onClick={() => void requestOtp("SET_PASSWORD")}
          >
            Gửi mã OTP
          </Button>
          {otpSent ? (
            <>
              <label className="block text-xs">
                Mã OTP (6 số)
                <input
                  inputMode="numeric"
                  pattern="\d{6}"
                  required
                  className={inputCls}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </label>
              <label className="block text-xs">
                Mật khẩu mới
                <input
                  type="password"
                  required
                  minLength={6}
                  className={inputCls}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label className="block text-xs">
                Xác nhận mật khẩu
                <input
                  type="password"
                  required
                  minLength={6}
                  className={inputCls}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </label>
              <Button type="submit" size="sm" disabled={busy}>
                Lưu mật khẩu
              </Button>
            </>
          ) : null}
        </form>
      ) : null}

      {mode === "change" ? (
        <form onSubmit={(e) => void submitChange(e)} className="mt-3 space-y-2">
          <label className="block text-xs">
            Mật khẩu hiện tại
            <input
              type="password"
              required
              className={inputCls}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </label>
          <label className="block text-xs">
            Mật khẩu mới
            <input
              type="password"
              required
              minLength={6}
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="block text-xs">
            Xác nhận mật khẩu mới
            <input
              type="password"
              required
              minLength={6}
              className={inputCls}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>
          <Button type="submit" size="sm" disabled={busy}>
            Đổi mật khẩu
          </Button>
        </form>
      ) : null}

      {mode === "reset" ? (
        <form onSubmit={(e) => void submitReset(e)} className="mt-3 space-y-2">
          <label className="block text-xs">
            Email đã gắn tài khoản
            <input
              type="email"
              required
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy || !email}
            onClick={() => void requestOtp("RESET_PASSWORD")}
          >
            Gửi mã OTP
          </Button>
          {otpSent ? (
            <>
              <label className="block text-xs">
                Mã OTP (6 số)
                <input
                  inputMode="numeric"
                  pattern="\d{6}"
                  required
                  className={inputCls}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </label>
              <label className="block text-xs">
                Mật khẩu mới
                <input
                  type="password"
                  required
                  minLength={6}
                  className={inputCls}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label className="block text-xs">
                Xác nhận
                <input
                  type="password"
                  required
                  minLength={6}
                  className={inputCls}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </label>
              <Button type="submit" size="sm" disabled={busy}>
                Đặt lại mật khẩu
              </Button>
            </>
          ) : null}
        </form>
      ) : null}

      {msg ? <p className="mt-2 text-xs text-brand-800">{msg}</p> : null}
      {err ? <p className="mt-2 text-xs text-rose-600">{err}</p> : null}
    </section>
  );
}
