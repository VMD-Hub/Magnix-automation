import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageBrandHeader } from "@/components/PageBrandHeader";
import { useAuth } from "@/auth-context";
import { AUTH_DEV_BYPASS, HOUSEX_API_BASE } from "@/config";
import { createMiniappHandoff } from "@/services/api";
import {
  completeZaloLoginWithPhone,
  loginViaZaloMiniApp,
  loginWithPhoneInMiniApp,
  NeedPhoneError,
  probeZaloMiniApp,
  runZaloDiagnostics,
  type DiagLine,
  type PendingZaloSession,
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

const PHASE_LABEL: Partial<Record<ZaloLoginPhase, string>> = {
  authorize: "Đang xin quyền Zalo…",
  phone: "Đang lấy số điện thoại…",
  profile: "Đang lấy thông tin hiển thị…",
  server: "Đang liên kết tài khoản House X…",
  need_phone: "Zalo đã kết nối — cần số điện thoại",
};

function friendlyAuthMessage(raw: string): string {
  const cleaned = raw.replace(/^\[[A-Z0-9_]+\]\s*/i, "").trim();
  if (/ZALO_APP_SECRET|AppSecret|auth\/zalo\/diag/i.test(cleaned)) {
    return "Zalo đã kết nối. Nhập số điện thoại liên hệ để hoàn tất đăng nhập.";
  }
  return cleaned || "Không đăng nhập được. Thử lại.";
}

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
  const [pendingZalo, setPendingZalo] = useState<PendingZaloSession | null>(
    null,
  );
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [inZalo, setInZalo] = useState<boolean | null>(null);
  const [lane, setLane] = useState<UserLane | null>(() => getPreferredLane());
  const [diagOpen, setDiagOpen] = useState(false);
  const [diagBusy, setDiagBusy] = useState(false);
  const [diagLines, setDiagLines] = useState<DiagLine[] | null>(null);

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
    setPendingZalo(null);
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
        // Không bắt nhập SĐT trước — ưu tiên lấy từ Zalo.
        phoneFallback: customerPhone.trim() || undefined,
        onPhase: onAuthPhase,
      });
      setUser(u);
      finishLoginSuccess();
    } catch (ex) {
      if (ex instanceof NeedPhoneError) {
        setPendingZalo(ex.prep);
        setPhase("need_phone");
        setErr(ex.message);
        return;
      }
      setPhase("idle");
      setErr(
        friendlyAuthMessage(
          ex instanceof Error ? ex.message : "Không đăng nhập được bằng Zalo",
        ),
      );
    } finally {
      setBusyZalo(false);
    }
  }

  async function onCustomerPhoneSubmit(e?: FormEvent) {
    e?.preventDefault();
    setErr(null);
    const trimmed = customerPhone.trim();
    if (!isValidVnPhoneInput(trimmed)) {
      setErr("Nhập số điện thoại Việt Nam hợp lệ (10 số, bắt đầu bằng 0).");
      return;
    }
    setBusyCustomer(true);
    try {
      if (pendingZalo) {
        if (pendingZalo.preferredRole === "BROKER") {
          setErr(
            "Môi giới cần cho phép chia sẻ SĐT Zalo — không dùng số nhập tay. Bấm lại CTA môi giới và chọn Cho phép trên popup.",
          );
          setBusyCustomer(false);
          return;
        }
        setPhase("server");
        const u = await completeZaloLoginWithPhone(
          pendingZalo,
          trimmed,
          onAuthPhase,
        );
        setUser(u);
        finishLoginSuccess();
        return;
      }

      // Dev bypass only — production luôn đi Zalo.
      setPhase("authorize");
      const u = await loginWithPhoneInMiniApp({
        phone: trimmed,
        preferredRole: "CUSTOMER",
        onPhase: onAuthPhase,
      });
      setUser(u);
      finishLoginSuccess();
    } catch (ex) {
      if (ex instanceof NeedPhoneError) {
        setPendingZalo(ex.prep);
        setPhase("need_phone");
        setErr(ex.message);
        return;
      }
      setPhase(pendingZalo ? "need_phone" : "idle");
      const msg = ex instanceof Error ? ex.message : "Đăng nhập thất bại";
      setErr(
        msg.includes("accessToken") || msg.includes("Token")
          ? AUTH_DEV_BYPASS
            ? "Máy chủ chưa bật đăng nhập thử nghiệm local."
            : "Cần mở trong Zalo và cho phép xác thực."
          : friendlyAuthMessage(msg),
      );
    } finally {
      setBusyCustomer(false);
    }
  }

  async function onBrokerZaloLogin() {
    setBrokerErr(null);
    setErr(null);
    setBusyBroker(true);
    setPhase("authorize");
    try {
      const u = await loginViaZaloMiniApp({
        preferredRole: "BROKER",
        onPhase: onAuthPhase,
      });
      setUser(u);
      finishLoginSuccess();
    } catch (ex) {
      if (ex instanceof NeedPhoneError) {
        setPendingZalo({ ...ex.prep, preferredRole: "BROKER" });
        setPhase("need_phone");
        setBrokerErr(
          "Chưa lấy được SĐT từ Zalo. Cho phép chia sẻ số đang dùng Zalo (còn hoạt động), rồi bấm lại.",
        );
        return;
      }
      setPhase("idle");
      setBrokerErr(
        friendlyAuthMessage(
          ex instanceof Error
            ? ex.message
            : "Không đăng ký / đăng nhập được. Thử lại trong Zalo.",
        ),
      );
    } finally {
      setBusyBroker(false);
    }
  }

  async function onBrokerDevSubmit(e: FormEvent) {
    e.preventDefault();
    if (!AUTH_DEV_BYPASS) return;
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
        ex instanceof Error ? ex.message : "Đăng nhập thử nghiệm thất bại.",
      );
    } finally {
      setBusyBroker(false);
    }
  }

  async function onRunDiagnostics() {
    setDiagBusy(true);
    setDiagOpen(true);
    try {
      const lines = await runZaloDiagnostics();
      setDiagLines(lines);
    } catch {
      setDiagLines([
        {
          key: "unexpected",
          label: "Chẩn đoán",
          status: "fail",
          detail: "Không chạy được chẩn đoán. Thử mở lại Mini App.",
        },
      ]);
    } finally {
      setDiagBusy(false);
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
            Đăng nhập bằng Zalo thành công. SĐT liên hệ trên hồ sơ: {user.phoneMasked}.
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
        {user.opsTools?.telesales ? (
          <Link className="btn secondary" to="/ops" style={{ marginBottom: 10 }}>
            CRM Telesales
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
    phase !== "idle" && phase !== "done" ? (PHASE_LABEL[phase] ?? null) : null;
  const anyBusy = busyZalo || busyCustomer || busyBroker;
  let apiHost = "timnhaxahoi.com";
  try {
    apiHost = new URL(HOUSEX_API_BASE).host;
  } catch {
    /* keep default */
  }
  const badApi = /localhost|127\.0\.0\.1/i.test(apiHost);

  return (
    <div>
      <PageBrandHeader
        kicker="TÀI KHOẢN"
        title="Kết nối House X"
        lead="Đăng nhập bằng Zalo để lưu hồ sơ và nhận tư vấn."
      />

      {badApi ? (
        <p className="account-api-stamp account-api-stamp--bad" role="status">
          Bản lỗi — máy chủ {apiHost}. Cần deploy lại.
        </p>
      ) : null}

      {phaseHint && phase !== "need_phone" ? (
        <p className="account-progress" role="status" aria-live="polite">
          {phaseHint}
        </p>
      ) : null}

      <section className="card account-block">
        <h2 className="account-block-title">Khách mua nhà</h2>
        <p className="muted account-block-lead">
          Một chạm — dùng Zalo đang mở trên máy này.
        </p>

        {zaloReady && !pendingZalo ? (
          <>
            <button
              type="button"
              className="btn account-login-zalo-btn"
              disabled={anyBusy || inZalo === false}
              onClick={() => void onZaloCustomerLogin()}
            >
              {busyZalo
                ? phaseHint ?? "Đang đăng nhập…"
                : "Đăng nhập bằng Zalo"}
            </button>
            {inZalo === false ? (
              <p className="err" style={{ marginTop: 10 }}>
                Mở Mini App từ trong ứng dụng Zalo.
              </p>
            ) : null}
          </>
        ) : null}

        {(pendingZalo && pendingZalo.preferredRole !== "BROKER") ||
        !zaloReady ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void onCustomerPhoneSubmit();
            }}
            className="account-phone-form"
            style={{ marginTop: pendingZalo || !zaloReady ? 12 : 0 }}
          >
            <label className="muted" htmlFor="customer-phone">
              Số điện thoại liên hệ
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
              autoFocus={Boolean(pendingZalo)}
            />
            {err ? <p className="err">{err}</p> : null}
            <button
              className="btn"
              type="submit"
              disabled={anyBusy || !customerPhone.trim()}
            >
              {busyCustomer
                ? phaseHint ?? "Đang xử lý…"
                : pendingZalo
                  ? "Hoàn tất đăng nhập"
                  : "Tiếp tục"}
            </button>
          </form>
        ) : err ? (
          <p className="err" style={{ marginTop: 10 }}>
            {err}
          </p>
        ) : null}
      </section>

      <section className="card account-block account-block--broker">
        <h2 className="account-block-title">Môi giới / CTV</h2>
        <p className="muted account-block-lead">
          Dành cho cộng đồng môi giới. Cần Zalo có số điện thoại đang gắn và còn
          hoạt động — chọn Cho phép khi được hỏi.
        </p>
        {zaloReady ? (
          <>
            <button
              type="button"
              className="btn"
              disabled={anyBusy || inZalo === false}
              onClick={() => void onBrokerZaloLogin()}
            >
              {busyBroker
                ? phaseHint ?? "Đang xử lý…"
                : "Đăng nhập môi giới bằng Zalo"}
            </button>
            {pendingZalo?.preferredRole === "BROKER" ? (
              <p className="err" style={{ marginTop: 10 }}>
                Cho phép chia sẻ SĐT trên popup Zalo, rồi bấm lại nút trên.
              </p>
            ) : null}
            {brokerErr ? <p className="err">{brokerErr}</p> : null}
          </>
        ) : (
          <form onSubmit={onBrokerDevSubmit}>
            <label className="muted" htmlFor="broker-phone">
              SĐT thử nghiệm (local)
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
              {busyBroker ? phaseHint ?? "Đang xử lý…" : "Đăng nhập thử nghiệm"}
            </button>
          </form>
        )}
      </section>

      <section className="card account-diag">
        <button
          type="button"
          className="account-diag-toggle"
          aria-expanded={diagOpen}
          onClick={() => {
            if (!diagOpen && !diagLines) void onRunDiagnostics();
            else setDiagOpen((v) => !v);
          }}
        >
          {diagOpen ? "▾" : "▸"} Gặp sự cố đăng nhập?
        </button>
        {diagOpen ? (
          <div className="account-diag-body">
            <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
              Chỉ dùng khi cần hỗ trợ kỹ thuật. Bản: <code>{__HX_BUILD_ID__}</code>
            </p>
            <button
              type="button"
              className="btn secondary"
              style={{ marginTop: 8 }}
              disabled={diagBusy}
              onClick={() => void onRunDiagnostics()}
            >
              {diagBusy ? "Đang kiểm tra…" : "Chạy chẩn đoán"}
            </button>
            {diagLines ? (
              <ul className="account-diag-list">
                {diagLines.map((line) => (
                  <li key={line.key} className={`account-diag-item diag-${line.status}`}>
                    <span className="account-diag-badge">
                      {line.status === "ok" ? "✓" : line.status === "warn" ? "!" : "✕"}
                    </span>
                    <span>
                      <strong>{line.label}</strong>
                      <br />
                      <span className="muted" style={{ fontSize: 12 }}>
                        {line.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
