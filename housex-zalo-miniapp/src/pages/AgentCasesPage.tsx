import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  claimCtvCase,
  listAgentServices,
  listCtvCases,
  type CtvCaseListItem,
} from "@/services/agent";

function defaultConsultLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AgentCasesPage() {
  const { canAgent, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CtvCaseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [showClaim, setShowClaim] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consultAt, setConsultAt] = useState(defaultConsultLocal);
  const [busy, setBusy] = useState(false);
  const [claimErr, setClaimErr] = useState<string | null>(null);
  const [claimUnlocked, setClaimUnlocked] = useState<boolean | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [cases, services] = await Promise.all([
        listCtvCases(),
        listAgentServices().catch(() => null),
      ]);
      setItems(cases);
      const noxh = services?.items.find((s) => s.code === "NOXH_CLAIM");
      setClaimUnlocked(noxh ? noxh.unlocked : true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Không tải được hồ sơ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canAgent) void reload();
  }, [canAgent, reload]);

  async function onClaim(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setClaimErr(null);
    try {
      const created = await claimCtvCase({
        customerName: name.trim(),
        phone: phone.trim(),
        message: message.trim() || undefined,
        consultScheduledAt: consultAt,
      });
      setShowClaim(false);
      setName("");
      setPhone("");
      setMessage("");
      window.location.assign(`/agent/ho-so/${created.id}`);
    } catch (ex) {
      setClaimErr(ex instanceof Error ? ex.message : "Thả lead thất bại");
    } finally {
      setBusy(false);
    }
  }

  if (authLoading) return <p className="muted">Đang tải…</p>;
  if (!canAgent) return <Navigate to="/tai-khoan" replace />;

  return (
    <div>
      <Link to="/agent" className="muted">
        ← Agent
      </Link>
      <div className="section-head">
        <h1 className="brand" style={{ fontSize: 22, margin: 0 }}>
          Hồ sơ NOXH
        </h1>
        <button
          type="button"
          className="muted"
          style={{
            background: "none",
            border: 0,
            color: "var(--hx-accent-2)",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => setShowClaim((v) => !v)}
        >
          {showClaim ? "Đóng" : "+ Thả lead"}
        </button>
      </div>

      {claimUnlocked === false ? (
        <div className="card" style={{ marginBottom: 12 }}>
          <p style={{ margin: 0 }}>
            Dịch vụ thả lead chưa mở. Đậu khóa{" "}
            <Link to="/agent/dich-vu/CTV_ONBOARDING">Đào tạo hội nhập CTV</Link>{" "}
            để unlock.
          </p>
        </div>
      ) : null}

      {showClaim ? (
        <form className="card" onSubmit={onClaim}>
          <h2>Thả lead mới</h2>
          <p className="muted" style={{ marginBottom: 10 }}>
            House X tư vấn khách — bạn theo dõi tiến độ minh bạch.
          </p>
          <input
            className="input"
            placeholder="Họ tên khách"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={claimUnlocked === false}
          />
          <input
            className="input"
            placeholder="SĐT khách"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            required
            disabled={claimUnlocked === false}
          />
          <textarea
            className="input textarea"
            placeholder="Ghi chú (tuỳ chọn)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            disabled={claimUnlocked === false}
          />
          <input
            className="input"
            type="datetime-local"
            value={consultAt}
            onChange={(e) => setConsultAt(e.target.value)}
            required
            disabled={claimUnlocked === false}
          />
          {claimErr ? <p className="err">{claimErr}</p> : null}
          <button
            className="btn"
            type="submit"
            disabled={busy || claimUnlocked === false}
          >
            {busy ? "Đang gửi…" : "Tạo hồ sơ"}
          </button>
        </form>
      ) : null}

      {loading ? <p className="muted">Đang tải hồ sơ…</p> : null}
      {err ? <p className="err">{err}</p> : null}
      {!loading && !err && items.length === 0 ? (
        <div className="card">
          <p>Chưa có hồ sơ. Bấm “Thả lead” để bắt đầu.</p>
        </div>
      ) : null}

      {items.map((c) => (
        <Link key={c.id} to={`/agent/ho-so/${c.id}`} className="card tool-card">
          <p className="muted">{c.code}</p>
          <h2 style={{ marginTop: 4 }}>{c.customerName}</h2>
          <p>
            {c.phoneMasked}
            {c.projectName ? ` · ${c.projectName}` : ""}
          </p>
          <p style={{ marginTop: 6 }}>
            {c.milestoneLabel} · HS {c.docPercent}%
          </p>
          <span className="tool-card-cta">Chi tiết →</span>
        </Link>
      ))}
    </div>
  );
}
