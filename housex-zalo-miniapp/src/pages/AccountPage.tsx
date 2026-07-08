import { useState, type FormEvent } from "react";
import { useAuth } from "@/auth-context";
import { AUTH_DEV_BYPASS } from "@/config";
import { loginWithZaloDev } from "@/services/api";

export function AccountPage() {
  const { user, loading, logout, setUser, canAgent } = useAuth();
  const [phone, setPhone] = useState("0901234567");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onDevLogin(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const u = await loginWithZaloDev(phone, `dev-${phone}`);
      setUser(u);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Đăng nhập thất bại");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="muted">Đang tải…</p>;
  }

  if (user) {
    return (
      <div>
        <p className="muted">TÀI KHOẢN</p>
        <h1 className="brand" style={{ fontSize: 22 }}>
          {user.name}
        </h1>
        <div className="card">
          <p>
            Vai trò: <strong>{user.role}</strong>
            {canAgent ? " · có tab Agent" : ""}
          </p>
          <p className="muted" style={{ marginTop: 8 }}>
            SĐT: {user.phoneMasked}
            {user.ctvCode ? ` · CTV ${user.ctvCode}` : ""}
          </p>
        </div>
        <button type="button" className="btn secondary" onClick={logout}>
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="muted">ĐĂNG NHẬP</p>
      <h1 className="brand" style={{ fontSize: 22 }}>
        Kết nối House X
      </h1>
      <p className="lead">
        Trong Zalo sẽ dùng getAccessToken + SĐT. Local: mock qua API bypass.
      </p>

      {AUTH_DEV_BYPASS ? (
        <form onSubmit={onDevLogin} className="card">
          <label className="muted" htmlFor="phone">
            SĐT (dev)
          </label>
          <input
            id="phone"
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
          />
          {err ? <p className="err">{err}</p> : null}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Đang đăng nhập…" : "Login mock → API"}
          </button>
        </form>
      ) : (
        <div className="card">
          <p>
            Bật <code>VITE_AUTH_DEV_BYPASS=true</code> +{" "}
            <code>ZALO_AUTH_DEV_BYPASS=true</code> trên API local để test, hoặc
            chạy trong Zalo Simulator với accessToken thật.
          </p>
        </div>
      )}
    </div>
  );
}
