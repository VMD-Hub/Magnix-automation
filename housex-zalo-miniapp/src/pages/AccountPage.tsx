import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageBrandHeader } from "@/components/PageBrandHeader";
import { useAuth } from "@/auth-context";
import { AUTH_DEV_BYPASS } from "@/config";
import { createMiniappHandoff } from "@/services/api";
import {
  loginViaZaloMiniApp,
  loginWithPhoneInMiniApp,
  probeZaloMiniApp,
} from "@/services/zalo-miniapp-auth";
import {
  getPreferredLane,
  laneHomePath,
  LANE_LABELS,
  setPreferredLane,
  type UserLane,
} from "@/services/lane";
import { sanitizeHandoffNext } from "@/services/webview";

function isValidVnPhoneInput(raw: string): boolean {
  return /^0\d{9}$/.test(raw) || /^\+84\d{9}$/.test(raw);
}

export function AccountPage() {
  const { user, loading, logout, setUser, canAgent, refresh } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [asAgent, setAsAgent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [busyZalo, setBusyZalo] = useState(false);
  const [busyHandoff, setBusyHandoff] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [inZalo, setInZalo] = useState<boolean | null>(null);
  const [lane, setLane] = useState<UserLane | null>(() => getPreferredLane());

  useEffect(() => {
    let alive = true;
    void (async () => {
      const ok = await probeZaloMiniApp();
      if (alive) setInZalo(ok);
    })();
    return () => {
      alive = false;
    };
  }, []);

  function pickLane(next: UserLane) {
    setPreferredLane(next);
    setLane(next);
    navigate(laneHomePath(next));
  }

  async function openFullProfileWeb() {
    setErr(null);
    setBusyHandoff(true);
    try {
      const next = sanitizeHandoffNext(
        canAgent ? "/moi-gioi/tai-khoan" : "/khach-hang/tai-khoan",
      );
      const { code } = await createMiniappHandoff();
      const q = new URLSearchParams({
        handoff: "1",
        code,
        next,
      });
      navigate(`/mo?${q.toString()}`);
    } catch (ex) {
      setErr(
        ex instanceof Error
          ? ex.message
          : "Không mở được hồ sơ web. Thử đăng nhập lại.",
      );
    } finally {
      setBusyHandoff(false);
    }
  }

  async function onZaloLogin() {
    setErr(null);
    setBusyZalo(true);
    try {
      const u = await loginViaZaloMiniApp({
        preferredRole: asAgent ? "BROKER" : "CUSTOMER",
        phoneFallback: isValidVnPhoneInput(phone.trim())
          ? phone.trim()
          : undefined,
      });
      setUser(u);
      await refresh();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Đăng nhập Zalo thất bại");
    } finally {
      setBusyZalo(false);
    }
  }

  async function onPhoneLogin(e: FormEvent) {
    e.preventDefault();
    setErr(null);

    const trimmed = phone.trim();
    if (!isValidVnPhoneInput(trimmed)) {
      setErr("Nhập số điện thoại Việt Nam hợp lệ (10 số, bắt đầu bằng 0).");
      return;
    }

    setBusy(true);
    try {
      const u = await loginWithPhoneInMiniApp({
        phone: trimmed,
        asAgent,
      });
      setUser(u);
      await refresh();
    } catch (ex) {
      const msg = ex instanceof Error ? ex.message : "Đăng nhập thất bại";
      setErr(
        msg.includes("accessToken") || msg.includes("Token")
          ? AUTH_DEV_BYPASS
            ? "Máy chủ chưa bật đăng nhập thử nghiệm. Thêm ZALO_AUTH_DEV_BYPASS=true vào .env API."
            : "Không xác thực được Zalo. Mở Mini App trong ứng dụng Zalo rồi thử lại."
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
        <PageBrandHeader
          kicker="TÀI KHOẢN"
          title={user.name}
          lead={
            canAgent
              ? "Tài khoản môi giới / CTV"
              : "Tài khoản khách hàng"
          }
        />
        <div className="card">
          <p className="muted">
            SĐT: {user.phoneMasked}
            {user.ctvCode ? ` · Mã CTV ${user.ctvCode}` : ""}
          </p>
        </div>
        <div className="card account-lane-pick">
          <p className="muted" style={{ marginBottom: 8 }}>
            Mục tiêu mua nhà
          </p>
          <div className="account-lane-row">
            {(["noxh", "cctm"] as const).map((id) => (
              <button
                key={id}
                type="button"
                className={`chip${lane === id ? " chip-active" : ""}`}
                onClick={() => pickLane(id)}
              >
                {LANE_LABELS[id]}
              </button>
            ))}
          </div>
        </div>
        {err ? <p className="err">{err}</p> : null}
        <button
          type="button"
          className="btn"
          style={{ marginBottom: 10 }}
          disabled={busyHandoff}
          onClick={() => void openFullProfileWeb()}
        >
          {busyHandoff
            ? "Đang mở hồ sơ…"
            : canAgent
              ? "Hồ sơ môi giới đầy đủ (web)"
              : "Xem hồ sơ đầy đủ"}
        </button>
        {canAgent ? (
          <Link className="btn secondary" to="/agent" style={{ marginBottom: 10 }}>
            Vào HouseX Agent
          </Link>
        ) : null}
        <button type="button" className="btn secondary" onClick={logout}>
          Đăng xuất
        </button>
      </div>
    );
  }

  const showZaloPrimary = !AUTH_DEV_BYPASS;

  return (
    <div>
      <PageBrandHeader
        kicker="TÀI KHOẢN"
        title="Kết nối House X"
        lead="Đăng nhập để lưu hồ sơ, nhận tư vấn và theo dõi ưu đãi."
      />

      {showZaloPrimary ? (
        <div className="card account-login-zalo">
          <p className="muted" style={{ marginBottom: 12 }}>
            Dùng tài khoản Zalo của bạn — nhanh, không cần mật khẩu riêng.
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => void onZaloLogin()}
            disabled={busyZalo || busy || inZalo === false}
          >
            {busyZalo ? "Đang kết nối Zalo…" : "Đăng nhập bằng Zalo"}
          </button>
          {inZalo === false ? (
            <p className="err" style={{ marginTop: 10 }}>
              Chưa nhận được phiên Zalo. Hãy mở Mini App từ trong ứng dụng Zalo.
            </p>
          ) : null}
          {inZalo === null ? (
            <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Đang kiểm tra phiên Zalo…
            </p>
          ) : null}
        </div>
      ) : null}

      <form onSubmit={onPhoneLogin} className="card">
        <p className="muted" style={{ marginBottom: 10 }}>
          {showZaloPrimary
            ? "Hoặc nhập số điện thoại để hoàn tất / liên kết hồ sơ"
            : AUTH_DEV_BYPASS
              ? "Đăng nhập thử nghiệm (dev) bằng số điện thoại"
              : "Nhập số điện thoại để đăng nhập"}
        </p>
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
        {(AUTH_DEV_BYPASS || showZaloPrimary) && (
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
        )}
        {err ? <p className="err">{err}</p> : null}
        <button
          className="btn"
          type="submit"
          disabled={busy || busyZalo || !phone.trim()}
        >
          {busy ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>

      {!showZaloPrimary && !AUTH_DEV_BYPASS ? (
        <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
          Lưu ý: đăng nhập đầy đủ cần mở Mini App bên trong Zalo để xác thực tài
          khoản.
        </p>
      ) : null}
    </div>
  );
}
