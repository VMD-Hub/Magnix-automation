import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth-context";
import { AUTH_DEV_BYPASS } from "@/config";
import { loginWithZaloDev } from "@/services/api";

export function AccountPage() {
  const { user, loading, logout, setUser, canAgent, refresh } = useAuth();
  const [phone, setPhone] = useState("");
  const [asAgent, setAsAgent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onDevLogin(e: FormEvent) {
    e.preventDefault();
    setErr(null);

    const trimmed = phone.trim();
    if (!/^0\d{9}$/.test(trimmed) && !/^\+84\d{9}$/.test(trimmed)) {
      setErr("Nhập số điện thoại Việt Nam hợp lệ (10 số, bắt đầu bằng 0).");
      return;
    }

    setBusy(true);
    try {
      const u = await loginWithZaloDev(
        trimmed,
        `dev-${trimmed}`,
        asAgent ? "BROKER" : "CUSTOMER",
      );
      setUser(u);
      await refresh();
    } catch (ex) {
      const msg = ex instanceof Error ? ex.message : "Đăng nhập thất bại";
      setErr(
        msg.includes("accessToken") || msg.includes("Token")
          ? "Máy chủ chưa bật đăng nhập thử nghiệm. Thêm ZALO_AUTH_DEV_BYPASS=true vào .env API rồi chạy lại npm run dev."
          : msg,
      );
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
            {canAgent ? "Tài khoản môi giới / CTV" : "Tài khoản khách hàng"}
          </p>
          <p className="muted" style={{ marginTop: 8 }}>
            SĐT: {user.phoneMasked}
            {user.ctvCode ? ` · Mã CTV ${user.ctvCode}` : ""}
          </p>
        </div>
        {canAgent ? (
          <Link className="btn" to="/agent" style={{ marginBottom: 10 }}>
            Vào HouseX Agent
          </Link>
        ) : null}
        <button type="button" className="btn secondary" onClick={logout}>
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="muted">TÀI KHOẢN</p>
      <h1 className="brand" style={{ fontSize: 22 }}>
        Kết nối House X
      </h1>
      <p className="lead">
        Đăng nhập bằng số điện thoại để lưu hồ sơ và nhận tư vấn.
      </p>

      {AUTH_DEV_BYPASS ? (
        <form onSubmit={onDevLogin} className="card">
          <label className="muted" htmlFor="phone">
            Số điện thoại
          </label>
          <input
            id="phone"
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09xxxxxxxx"
            inputMode="tel"
            autoComplete="tel"
            required
          />
          <label
            className="muted"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <input
              type="checkbox"
              checked={asAgent}
              onChange={(e) => setAsAgent(e.target.checked)}
            />
            Đăng nhập Agent (CTV thử nghiệm)
          </label>
          {err ? <p className="err">{err}</p> : null}
          <button className="btn" type="submit" disabled={busy || !phone.trim()}>
            {busy ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>
      ) : (
        <div className="card">
          <p>
            Mở House X trong Zalo để đăng nhập bằng tài khoản Zalo của bạn.
          </p>
        </div>
      )}
    </div>
  );
}
