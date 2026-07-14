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
  type ZaloLoginPhase,
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

const PHASE_LABEL: Record<Exclude<ZaloLoginPhase, "idle" | "done">, string> = {
  authorize: "Đang xin quyền Zalo…",
  phone: "Đang lấy số điện thoại…",
  profile: "Đang lấy thông tin hiển thị…",
  server: "Đang liên kết tài khoản House X…",
};

export function AccountPage() {
  const { user, loading, logout, setUser, canAgent } = useAuth();
  const navigate = useNavigate();
  const [customerPhone, setCustomerPhone] = useState("");
  const [brokerPhone, setBrokerPhone] = useState("");
  const [busyCustomer, setBusyCustomer] = useState(false);
  const [busyZalo, setBusyZalo] = useState(false);
  const [busyBroker, setBusyBroker] = useState(false);
  const [busyHandoff, setBusyHandoff] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [brokerErr, setBrokerErr] = useState<string | null>(null);
  const [phase, setPhase] = useState<ZaloLoginPhase>("idle");
  const [justLoggedIn, setJustLoggedIn] = useState(false);
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

  function onAuthPhase(next: ZaloLoginPhase) {
    setPhase(next);
  }

  function finishLoginSuccess() {
    setPhase("done");
    setJustLoggedIn(true);
    setErr(null);
    setBrokerErr(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  async function onZaloCustomerLogin() {
    setErr(null);
    setBusyZalo(true);
    setPhase("authorize");
    try {
      const u = await loginViaZaloMiniApp({
        preferredRole: "CUSTOMER",
        phoneFallback: isValidVnPhoneInput(customerPhone.trim())
          ? customerPhone.trim()
          : undefined,
        onPhase: onAuthPhase,
      });
      setUser(u);
      finishLoginSuccess();
    } catch (ex) {
      setPhase("idle");
      setErr(ex instanceof Error ? ex.message : "Không đăng nhập được bằng Zalo");
    } finally {
      setBusyZalo(false);
    }
  }

  async function onCustomerPhoneSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    const trimmed = customerPhone.trim();
    if (!isValidVnPhoneInput(trimmed)) {
      setErr("Nhập số điện thoại Việt Nam hợp lệ (10 số, bắt đầu bằng 0).");
      return;
    }
    setBusyCustomer(true);
    setPhase("authorize");
    try {
      const u = await loginWithPhoneInMiniApp({
        phone: trimmed,
        preferredRole: "CUSTOMER",
        onPhase: onAuthPhase,
      });
      setUser(u);
      finishLoginSuccess();
    } catch (ex) {
      setPhase("idle");
      const msg = ex instanceof Error ? ex.message : "Đăng nhập thất bại";
      setErr(
        msg.includes("accessToken") || msg.includes("Token")
          ? AUTH_DEV_BYPASS
            ? "Máy chủ chưa bật đăng nhập thử nghiệm local."
            : "Cần mở trong Zalo và cho phép xác thực."
          : msg,
      );
    } finally {
      setBusyCustomer(false);
    }
  }

  async function onBrokerSubmit(e: FormEvent) {
    e.preventDefault();
    setBrokerErr(null);
    const trimmed = brokerPhone.trim();
    if (!isValidVnPhoneInput(trimmed)) {
      setBrokerErr("Nhập số điện thoại Việt Nam hợp lệ (10 số, bắt đầu bằng 0).");
      return;
    }
    setBusyBroker(true);
    setPhase("authorize");
    try {
      const u = await loginWithPhoneInMiniApp({
        phone: trimmed,
        preferredRole: "BROKER",
        onPhase: onAuthPhase,
      });
      setUser(u);
      finishLoginSuccess();
    } catch (ex) {
      setPhase("idle");
      setBrokerErr(
        ex instanceof Error
          ? ex.message
          : "Không đăng ký / đăng nhập được. Thử lại trong Zalo.",
      );
    } finally {
      setBusyBroker(false);
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
              ? "Cộng đồng môi giới House X"
              : "Tài khoản khách — lưu tư vấn và ưu đãi"
          }
        />
        {justLoggedIn ? (
          <p className="account-success" role="status">
            Đăng nhập thành công. Hồ sơ của bạn đã sẵn sàng.
          </p>
        ) : null}
        <div className="card">
          <p className="muted">
            SĐT: {user.phoneMasked}
            {user.ctvCode ? ` · Mã môi giới ${user.ctvCode}` : ""}
          </p>
        </div>
        {!canAgent ? (
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
        ) : null}
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
              ? "Hồ sơ môi giới trên web"
              : "Xem hồ sơ đầy đủ"}
        </button>
        {canAgent ? (
          <Link className="btn secondary" to="/agent" style={{ marginBottom: 10 }}>
            Vào không gian môi giới
          </Link>
        ) : null}
        <button type="button" className="btn secondary" onClick={logout}>
          Đăng xuất
        </button>
      </div>
    );
  }

  const zaloReady = !AUTH_DEV_BYPASS;
  const phaseHint =
    phase !== "idle" && phase !== "done" ? PHASE_LABEL[phase] : null;
  const anyBusy = busyZalo || busyCustomer || busyBroker;

  return (
    <div>
      <PageBrandHeader
        kicker="TÀI KHOẢN"
        title="Tài khoản House X"
        lead="Chọn đúng nhóm bên dưới — khách mua nhà hoặc cộng đồng môi giới."
      />

      {phaseHint ? (
        <p className="account-progress" role="status" aria-live="polite">
          {phaseHint}
        </p>
      ) : null}

      <section className="card account-block">
        <h2 className="account-block-title">1. Khách mua nhà</h2>
        <p className="muted account-block-lead">
          Đăng nhập bằng Zalo để lưu yêu cầu tư vấn, ưu đãi và hồ sơ mua nhà. Chưa
          có tài khoản thì hệ thống tạo giúp bạn lần đầu.
        </p>

        {zaloReady ? (
          <>
            <button
              type="button"
              className="btn account-login-zalo-btn"
              onClick={() => void onZaloCustomerLogin()}
              disabled={anyBusy || inZalo === false}
            >
              {busyZalo ? phaseHint ?? "Đang kết nối Zalo…" : "Đăng nhập bằng Zalo"}
            </button>
            {inZalo === false ? (
              <p className="err" style={{ marginTop: 10 }}>
                Chưa nhận được phiên Zalo. Mở Mini App từ trong ứng dụng Zalo.
              </p>
            ) : null}
            {inZalo === null ? (
              <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                Đang kiểm tra phiên Zalo…
              </p>
            ) : null}
          </>
        ) : null}

        <form onSubmit={onCustomerPhoneSubmit} className="account-phone-form">
          <p className="muted" style={{ margin: "14px 0 8px", fontSize: 12 }}>
            {zaloReady
              ? "Nếu Zalo chưa chia sẻ số — nhập SĐT rồi tiếp tục:"
              : "Nhập SĐT để đăng nhập (chế độ local):"}
          </p>
          <label className="muted" htmlFor="customer-phone">
            Số điện thoại
          </label>
          <input
            id="customer-phone"
            className="input"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="09xxxxxxxx"
            inputMode="tel"
            autoComplete="tel"
            disabled={anyBusy}
          />
          {err ? <p className="err">{err}</p> : null}
          <button
            className="btn secondary"
            type="submit"
            disabled={anyBusy || !customerPhone.trim()}
          >
            {busyCustomer ? phaseHint ?? "Đang xử lý…" : "Tiếp tục với số điện thoại"}
          </button>
        </form>
      </section>

      <section className="card account-block account-block--broker">
        <h2 className="account-block-title">2. Cộng đồng môi giới House X</h2>
        <p className="muted account-block-lead">
          Dành cho môi giới / cộng tác viên. Đăng ký tham gia lần đầu bằng số
          điện thoại, hoặc đăng nhập lại nếu bạn đã có tài khoản môi giới.
        </p>
        <form onSubmit={onBrokerSubmit}>
          <label className="muted" htmlFor="broker-phone">
            Số điện thoại đăng ký cộng đồng
          </label>
          <input
            id="broker-phone"
            className="input"
            value={brokerPhone}
            onChange={(e) => setBrokerPhone(e.target.value)}
            placeholder="09xxxxxxxx"
            inputMode="tel"
            autoComplete="tel"
            required
            disabled={anyBusy}
          />
          {brokerErr ? <p className="err">{brokerErr}</p> : null}
          <button
            className="btn"
            type="submit"
            disabled={anyBusy || !brokerPhone.trim()}
          >
            {busyBroker
              ? phaseHint ?? "Đang xử lý…"
              : "Đăng ký / đăng nhập cộng đồng môi giới"}
          </button>
        </form>
      </section>
    </div>
  );
}
