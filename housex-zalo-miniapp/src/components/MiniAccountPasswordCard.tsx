import { useState } from "react";
import { HOUSEX_API_BASE, TOKEN_STORAGE_KEY } from "@/config";

async function authFetch(path: string, body: unknown) {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const res = await fetch(`${HOUSEX_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return {
    ok: res.ok,
    message: json?.data?.message ?? json?.error?.message,
    error: json?.error?.message as string | undefined,
  };
}

/** Đặt / đổi MK tài khoản — OTP email (không magic-link). */
export function MiniAccountPasswordCard({
  passwordReady,
  defaultEmail = "",
}: {
  passwordReady?: boolean;
  defaultEmail?: string;
}) {
  const ready = Boolean(passwordReady);
  const [mode, setMode] = useState<"set" | "change">(ready ? "change" : "set");
  const [email, setEmail] = useState(
    defaultEmail.includes("@users.housex.local") ? "" : defaultEmail,
  );
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [current, setCurrent] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendOtp() {
    setBusy(true);
    setErr(null);
    const r = await authFetch("/api/auth/password/request-otp", {
      email,
      purpose: "SET_PASSWORD",
    });
    setBusy(false);
    if (!r.ok) {
      setErr(r.error ?? "Lỗi");
      return;
    }
    setOtpSent(true);
    setMsg(r.message ?? "Đã gửi mã OTP.");
  }

  async function saveSet(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setErr("Mật khẩu xác nhận không khớp");
      return;
    }
    setBusy(true);
    setErr(null);
    const r = await authFetch("/api/auth/password/set", {
      email,
      otp,
      password,
    });
    setBusy(false);
    if (!r.ok) {
      setErr(r.error ?? "Lỗi");
      return;
    }
    setMsg(r.message ?? "Đã đặt mật khẩu");
    setMode("change");
  }

  async function saveChange(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setErr("Mật khẩu xác nhận không khớp");
      return;
    }
    setBusy(true);
    setErr(null);
    const r = await authFetch("/api/auth/password/change", {
      currentPassword: current,
      newPassword: password,
    });
    setBusy(false);
    if (!r.ok) {
      setErr(r.error ?? "Lỗi");
      return;
    }
    setMsg("Đã đổi mật khẩu");
    setCurrent("");
    setPassword("");
    setConfirm("");
  }

  return (
    <div className="card" style={{ marginBottom: 10 }}>
      <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>Mật khẩu tài khoản</p>
      <p className="muted" style={{ marginTop: 6, fontSize: 12 }}>
        Dùng chung web + Mini App. Xác minh bằng mã OTP trong email — không bấm
        link lạ. Quyền tool không có mật khẩu riêng.
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button
          type="button"
          className={`chip${mode === "set" ? " chip-active" : ""}`}
          onClick={() => setMode("set")}
        >
          Đặt MK
        </button>
        <button
          type="button"
          className={`chip${mode === "change" ? " chip-active" : ""}`}
          onClick={() => setMode("change")}
        >
          Đổi MK
        </button>
      </div>

      {mode === "set" ? (
        <form onSubmit={(e) => void saveSet(e)} style={{ marginTop: 10 }}>
          <input
            className="input"
            type="email"
            required
            placeholder="Email công việc"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="button"
            className="btn secondary"
            style={{ marginTop: 8 }}
            disabled={busy}
            onClick={() => void sendOtp()}
          >
            Gửi mã OTP
          </button>
          {otpSent ? (
            <>
              <input
                className="input"
                style={{ marginTop: 8 }}
                placeholder="OTP 6 số"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <input
                className="input"
                style={{ marginTop: 8 }}
                type="password"
                placeholder="Mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <input
                className="input"
                style={{ marginTop: 8 }}
                type="password"
                placeholder="Xác nhận"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <button type="submit" className="btn" style={{ marginTop: 8 }} disabled={busy}>
                Lưu mật khẩu
              </button>
            </>
          ) : null}
        </form>
      ) : (
        <form onSubmit={(e) => void saveChange(e)} style={{ marginTop: 10 }}>
          <input
            className="input"
            type="password"
            placeholder="MK hiện tại"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
          <input
            className="input"
            style={{ marginTop: 8 }}
            type="password"
            placeholder="MK mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <input
            className="input"
            style={{ marginTop: 8 }}
            type="password"
            placeholder="Xác nhận"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button type="submit" className="btn" style={{ marginTop: 8 }} disabled={busy}>
            Đổi mật khẩu
          </button>
        </form>
      )}
      {msg ? <p className="account-success">{msg}</p> : null}
      {err ? <p className="err">{err}</p> : null}
    </div>
  );
}
