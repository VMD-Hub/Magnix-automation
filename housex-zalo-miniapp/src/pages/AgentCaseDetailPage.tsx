import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  addCtvCaseNote,
  createCareActivity,
  getCtvCase,
  nudgeCtvCase,
  updateCtvCaseSchedule,
  uploadCareImage,
  type CareActivityType,
  type CtvCaseDetail,
} from "@/services/agent";

const CARE_TYPES: Array<{ id: CareActivityType; label: string }> = [
  { id: "CALL", label: "Gọi" },
  { id: "CHAT", label: "Chat" },
  { id: "MEET", label: "Gặp" },
  { id: "SITE_VISIT", label: "Thăm DA" },
  { id: "DOCUMENT", label: "Giấy tờ" },
  { id: "OTHER", label: "Khác" },
];

const TIER_LABEL: Record<string, string> = {
  CONNECTOR: "Connector",
  CONSULTANT: "Consultant",
  DEVELOPER_PARTNER: "Developer Partner",
  MASTER_BROKER: "Master Broker",
};

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
  const [careType, setCareType] = useState<CareActivityType>("CALL");
  const [careNote, setCareNote] = useState("");
  const [careFile, setCareFile] = useState<File | null>(null);

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
      setActionMsg("Đã ghi ghi chú hỗ trợ.");
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Không ghi được tiến độ");
    } finally {
      setBusy(false);
    }
  }

  async function onSaveCare() {
    if (!row || careNote.trim().length < 3 || !careFile) return;
    setBusy(true);
    setActionMsg(null);
    try {
      const { url } = await uploadCareImage(row.id, careFile);
      await createCareActivity(row.id, {
        activityType: careType,
        note: careNote.trim(),
        imageUrls: [url],
      });
      const d = await getCtvCase(row.id);
      setRow(d);
      setCareNote("");
      setCareFile(null);
      setActionMsg("Đã ghi chăm sóc hợp lệ — đồng hồ độc quyền được làm mới.");
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Không ghi được CS");
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

  const calendarLeft = row.lockCompliance?.calendarDaysUntilLockExpiry;

  return (
    <div>
      <Link to="/agent/ho-so" className="muted">
        ← Hồ sơ
      </Link>
      <p className="muted" style={{ marginTop: 8 }}>
        {row.code}
        {row.dealTier ? ` · ${TIER_LABEL[row.dealTier] ?? row.dealTier}` : ""}
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
        {calendarLeft != null ? (
          <p className="muted" style={{ marginTop: 6 }}>
            Còn ~{calendarLeft} ngày dương lịch độc quyền (tối đa 60; im 30 ngày
            không CS → nhả)
          </p>
        ) : null}
        {row.lockCompliance?.needsProgressWarning ? (
          <p className="err" style={{ marginTop: 8 }}>
            Cần ghi CS hợp lệ (ghi chú + ảnh) để giữ độc quyền.
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
        <h2>Chăm sóc (CS hợp lệ)</h2>
        <p className="muted" style={{ marginBottom: 8 }}>
          Enum + ghi chú + ≥1 ảnh — reset đồng hồ im 30 ngày.
        </p>
        <div className="agent-filter-pills" style={{ marginBottom: 8 }}>
          {CARE_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={careType === t.id ? "is-on" : ""}
              onClick={() => setCareType(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <textarea
          className="input textarea"
          rows={3}
          placeholder="Nội dung chăm sóc…"
          value={careNote}
          onChange={(e) => setCareNote(e.target.value)}
        />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ marginTop: 8, display: "block" }}
          onChange={(e) => setCareFile(e.target.files?.[0] ?? null)}
        />
        <button
          className="btn"
          type="button"
          style={{ marginTop: 8 }}
          disabled={busy || careNote.trim().length < 3 || !careFile}
          onClick={onSaveCare}
        >
          Gửi CS
        </button>
        {(row.careActivities?.length ?? 0) > 0 ? (
          <ul className="unit-list" style={{ marginTop: 12 }}>
            {row.careActivities!.slice(0, 5).map((a) => (
              <li key={a.id}>
                <strong>
                  {a.activityType} · {a.status}
                </strong>
                <span>{a.note}</span>
              </li>
            ))}
          </ul>
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
        <h2>Ghi chú hỗ trợ</h2>
        <textarea
          className="input textarea"
          rows={3}
          placeholder="Ghi chú nội bộ (không thay CS hợp lệ)…"
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
          Lưu ghi chú
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
