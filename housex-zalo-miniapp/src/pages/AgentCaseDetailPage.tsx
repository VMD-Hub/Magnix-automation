import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  getCtvCase,
  nudgeCtvCase,
  type CtvCaseDetail,
} from "@/services/agent";

export function AgentCaseDetailPage() {
  const { id = "" } = useParams();
  const { canAgent, loading: authLoading } = useAuth();
  const [row, setRow] = useState<CtvCaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [nudgeMsg, setNudgeMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!canAgent || !id) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const d = await getCtvCase(id);
        if (alive) setRow(d);
      } catch (e) {
        if (alive) setErr(e instanceof Error ? e.message : "Lỗi tải hồ sơ");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [canAgent, id]);

  async function onNudge() {
    if (!row) return;
    setBusy(true);
    setNudgeMsg(null);
    try {
      const res = await nudgeCtvCase(row.id);
      setNudgeMsg(res.message);
    } catch (e) {
      setNudgeMsg(e instanceof Error ? e.message : "Không gửi được nhắc");
    } finally {
      setBusy(false);
    }
  }

  if (authLoading) return <p className="muted">Đang tải…</p>;
  if (!canAgent) return <Navigate to="/tai-khoan" replace />;
  if (loading) return <p className="muted">Đang tải…</p>;
  if (err || !row) {
    return (
      <div>
        <p className="err">{err ?? "Không tìm thấy"}</p>
        <Link to="/agent/ho-so" className="btn secondary">
          Về danh sách
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/agent/ho-so" className="muted">
        ← Hồ sơ
      </Link>
      <p className="muted" style={{ marginTop: 8 }}>
        {row.code}
      </p>
      <h1 className="brand" style={{ fontSize: 22 }}>
        {row.customerName}
      </h1>
      <p className="muted">{row.phoneMasked}</p>
      {row.projectName ? <p className="muted">{row.projectName}</p> : null}

      <div className="card">
        <h2>Tiến độ</h2>
        <p>
          {row.milestoneLabel} ({row.milestoneProgress})
        </p>
        <p className="muted" style={{ marginTop: 6 }}>
          Hồ sơ giấy tờ: {row.docPassed}/{row.docRequired} ({row.docPercent}%)
        </p>
        {row.opsNote ? (
          <p className="muted" style={{ marginTop: 8 }}>
            Ops: {row.opsNote}
          </p>
        ) : null}
      </div>

      {row.missingDocs?.length ? (
        <div className="card">
          <h2>Giấy tờ còn thiếu</h2>
          <ul className="unit-list">
            {row.missingDocs.map((d) => (
              <li key={d.id}>
                <strong>{d.label}</strong>
                <span>
                  {d.statusLabel}
                  {d.ctvActionHint ? ` — ${d.ctvActionHint}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <button className="btn" type="button" disabled={busy} onClick={onNudge}>
        {busy ? "Đang gửi…" : "Nhắc khách (qua House X)"}
      </button>
      {nudgeMsg ? <p className="ok">{nudgeMsg}</p> : null}

      {row.assistLogs?.length ? (
        <div className="card" style={{ marginTop: 12 }}>
          <h2>Lịch sử hỗ trợ</h2>
          <ul className="unit-list">
            {row.assistLogs.slice(0, 5).map((l) => (
              <li key={l.id}>
                <strong>{l.assistType}</strong>
                <span>{l.message}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
