import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  claimCtvCase,
  type AffiliateDealTier,
} from "@/services/agent";

const TIERS: Array<{
  id: AffiliateDealTier;
  name: string;
  hint: string;
}> = [
  { id: "CONNECTOR", name: "Connector", hint: "Chỉ nối — House X tư vấn chốt" },
  {
    id: "CONSULTANT",
    name: "Consultant",
    hint: "Tư vấn đầu + phối hợp HS",
  },
  {
    id: "DEVELOPER_PARTNER",
    name: "Developer Partner",
    hint: "Đồng hành hồ sơ NOXH",
  },
  {
    id: "MASTER_BROKER",
    name: "Master Broker",
    hint: "A–Z (cần đủ điều kiện)",
  },
];

function defaultConsultLocal(): string {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  d.setHours(9, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Khai báo A+B+C → POST /api/ctv/cases (dealTier + project). */
export function AgentDeclarePage() {
  const { canAgent } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const prefillProject = params.get("project")?.trim() ?? "";

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [projectLabel, setProjectLabel] = useState(prefillProject);
  const [tier, setTier] = useState<AffiliateDealTier>("CONNECTOR");
  const [consultAt, setConsultAt] = useState(defaultConsultLocal);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = useMemo(
    () =>
      customerName.trim().length >= 2 &&
      phone.trim().length >= 9 &&
      !busy,
    [customerName, phone, busy],
  );

  if (!canAgent) {
    return (
      <div className="agent-subpage">
        <p>Cần đăng nhập CTV.</p>
        <Link to="/tai-khoan">Tới Tài khoản</Link>
      </div>
    );
  }

  async function onSubmit() {
    if (!canSubmit) return;
    setBusy(true);
    setErr(null);
    try {
      const created = await claimCtvCase({
        customerName: customerName.trim(),
        phone: phone.trim(),
        projectLabel: projectLabel.trim() || undefined,
        dealTier: tier,
        consultScheduledAt: consultAt || undefined,
      });
      navigate(`/agent/ho-so/${created.id}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Không gửi được khai báo";
      if (msg.includes("CONTRACT_REQUIRED")) {
        setErr(
          "Cần ký e-contract trước khi khai báo. Vào Agent → E-contract.",
        );
      } else {
        setErr(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="agent-subpage">
      <header className="agent-sub-top">
        <h1>Khai báo giao dịch</h1>
      </header>
      <p className="agent-sub-lead">
        Chọn khách (A), dự án (B) và mức hợp tác (C) — House X bố trí hỗ trợ theo
        lựa chọn của bạn.
      </p>
      <label className="agent-field">
        <span>A · Họ tên khách</span>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Nguyễn Văn A"
          autoComplete="name"
        />
      </label>
      <label className="agent-field">
        <span>A · SĐT khách</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09xxxxxxxx"
          inputMode="tel"
          autoComplete="tel"
        />
      </label>
      <label className="agent-field">
        <span>B · Dự án / sản phẩm</span>
        <input
          value={projectLabel}
          onChange={(e) => setProjectLabel(e.target.value)}
          placeholder="Chọn từ Giỏ hàng hoặc gõ tên"
        />
      </label>
      <p className="agent-field-label">C · Mức hợp tác trên deal này</p>
      <div className="agent-tier-list">
        {TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`agent-tier ${tier === t.id ? "is-on" : ""}`}
            onClick={() => setTier(t.id)}
          >
            <strong>{t.name}</strong>
            <span>{t.hint}</span>
          </button>
        ))}
      </div>
      <label className="agent-field">
        <span>Lịch tư vấn (mặc định +24h)</span>
        <input
          type="datetime-local"
          value={consultAt}
          onChange={(e) => setConsultAt(e.target.value)}
        />
      </label>
      <button
        type="button"
        className="btn"
        style={{ width: "100%" }}
        disabled={!canSubmit}
        onClick={onSubmit}
      >
        {busy ? "Đang gửi…" : "Gửi khai báo"}
      </button>
      {err ? (
        <p className="err">
          {err}
          {err.includes("e-contract") ? (
            <>
              {" "}
              <Link to="/agent/e-contract">Ký ngay</Link>
            </>
          ) : null}
        </p>
      ) : null}
      <p className="agent-sub-note">
        Chọn dự án từ <Link to="/agent/gio-hang">Giỏ hàng</Link>. Đổi mức sau khi
        Ops đã gọi sẽ bị khóa (SoT).
      </p>
    </div>
  );
}
