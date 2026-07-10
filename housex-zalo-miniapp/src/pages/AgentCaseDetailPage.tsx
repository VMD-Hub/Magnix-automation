import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  addCtvCaseNote,
  getCtvCase,
  nudgeCtvCase,
  updateCtvCaseSchedule,
  type CtvCaseDetail,
} from "@/services/agent";

function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AgentCaseDetailPage() {
  const { id = "" } = useParams();
  const { canAgent, loading: authLoading } = useAuth();
  const [row, setRow] = useState<CtvCaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [nudgeMsg, setNudgeMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [consultAt, setConsultAt] = useState("");
  const [progressNote, setProgressNote] = useState("");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!canAgent || !id) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const d = await getCtvCase(id);
        if (alive) {
          setRow(d);
          setConsultAt(toLocalInputValue(d.consultScheduledAt));
        }
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

  async function onSaveSchedule() {
    if (!row || !consultAt) return;
    setBusy(true);
    setActionMsg(null);
    try {
      const d = await updateCtvCaseSchedule(row.id, consultAt);
      setRow(d);
      setActionMsg("Đã cập nhật lịch tư vấn.");
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Không lưu được lịch");
    } finally {
      setBusy(false);
    }
  }

  async function onSaveProgress() {
    if (!row || progressNote.trim().length < 3) return;
    setBusy(true);
    setActionMsg(null);
    try {
      await addCtvCaseNote(row.id, progressNote.trim());
      const d = await getCtvCase(row.id);
      setRow(d);
      setProgressNote("");
      setActionMsg("Đã ghi tiến độ — lock có thể được gia hạn nếu đủ điều kiện.");
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Không ghi được tiến độ");
    } finally {
      setBusy(false);
    }
  }

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
        {row.lockCompliance?.businessDaysUntilLockExpiry != null ? (
          <p className="muted" style={{ marginTop: 6 }}>
            Còn {row.lockCompliance.businessDaysUntilLockExpiry} ngày làm việc
            giữ lead
          </p>
        ) : null}
        {row.lockCompliance?.needsProgressWarning ? (
          <p className="err" style={{ marginTop: 8 }}>
            Cần ghi tiến độ tư vấn trong 7 ngày LV để giữ lock.
          </p>
        ) : null}
        {row.lockCompliance?.needsScheduleWarning ? (
          <p className="err" style={{ marginTop: 8 }}>
            Chưa có lịch tư vấn — hãy đặt lịch bên dưới.
          </p>
        ) : null}
        {row.opsNote ? (
          <p className="muted" style={{ marginTop: 8 }}>
            Ops: {row.opsNote}
          </p>
        ) : null}
      </div>

      <div className="card">
        <h2>Lịch tư vấn</h2>
        <input
          className="input"
          type="datetime-local"
          value={consultAt}
          onChange={(e) => setConsultAt(e.target.value)}
        />
        <button
          className="btn secondary"
          type="button"
          style={{ marginTop: 8 }}
          disabled={busy || !consultAt}
          onClick={onSaveSchedule}
        >
          Lưu lịch
        </button>
      </div>

      <div className="card">
        <h2>Ghi tiến độ</h2>
        <textarea
          className="input textarea"
          rows={3}
          placeholder="Đã gọi khách, hẹn gặp…"
          value={progressNote}
          onChange={(e) => setProgressNote(e.target.value)}
        />
        <button
          className="btn secondary"
          type="button"
          style={{ marginTop: 8 }}
          disabled={busy || progressNote.trim().length < 3}
          onClick={onSaveProgress}
        >
          Lưu tiến độ
        </button>
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
      {actionMsg ? <p className="ok">{actionMsg}</p> : null}

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
