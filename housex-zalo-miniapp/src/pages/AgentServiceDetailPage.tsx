import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  entitlementLabel,
  getAgentService,
  serviceCategoryLabel,
  submitQuiz,
  type AgentServiceDetail,
  type QuizSubmitResult,
} from "@/services/agent";

export function AgentServiceDetailPage() {
  const { code = "" } = useParams();
  const { canAgent, loading: authLoading } = useAuth();
  const [detail, setDetail] = useState<AgentServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<QuizSubmitResult | null>(null);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  useEffect(() => {
    if (!canAgent || !code) return;
    setLoading(true);
    setErr(null);
    setResult(null);
    setAnswers({});
    void getAgentService(code)
      .then(setDetail)
      .catch((e) =>
        setErr(e instanceof Error ? e.message : "Không tải được nội dung"),
      )
      .finally(() => setLoading(false));
  }, [canAgent, code]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!detail?.quiz) return;
    setBusy(true);
    setSubmitErr(null);
    try {
      const res = await submitQuiz(detail.quiz.id, answers);
      setResult(res);
      if (res.passed) {
        setDetail(await getAgentService(code));
      }
    } catch (ex) {
      setSubmitErr(ex instanceof Error ? ex.message : "Nộp bài thất bại");
    } finally {
      setBusy(false);
    }
  }

  if (authLoading) return <p className="muted">Đang tải…</p>;
  if (!canAgent) return <Navigate to="/tai-khoan" replace />;

  return (
    <div>
      <Link to="/agent/dich-vu" className="muted">
        ← Dịch vụ / Đào tạo
      </Link>

      {loading ? <p className="muted">Đang tải…</p> : null}
      {err ? <p className="error">{err}</p> : null}

      {detail ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              alignItems: "flex-start",
              marginTop: 8,
            }}
          >
            <h1 className="brand" style={{ fontSize: 22, margin: 0 }}>
              {detail.name}
            </h1>
            <span
              className={
                detail.unlocked ? "badge badge-ok" : "badge badge-locked"
              }
            >
              {entitlementLabel(detail.status, detail.unlocked)}
            </span>
          </div>
          <p className="muted">
            {serviceCategoryLabel(detail.category)}
            {detail.requiresCode ? ` · Cần hoàn thành ${detail.requiresCode}` : ""}
          </p>
          <p className="lead">{detail.description}</p>

          {detail.contentMarkdown ? (
            <div className="card" style={{ whiteSpace: "pre-wrap" }}>
              {detail.contentMarkdown}
            </div>
          ) : null}

          {detail.quiz ? (
            <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
              <h2 style={{ fontSize: 18 }}>{detail.quiz.title}</h2>
              <p className="muted">
                Đậu từ {detail.quiz.passScore} điểm trở lên để mở quyền liên
                quan.
              </p>

              {detail.quiz.questions.map((q, idx) => (
                <fieldset
                  key={q.id}
                  className="card"
                  style={{ border: 0, marginBottom: 12 }}
                >
                  <legend style={{ fontWeight: 600 }}>
                    {idx + 1}. {q.prompt}
                  </legend>
                  {q.options.map((opt) => (
                    <label
                      key={opt.id}
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                        marginTop: 8,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.id}
                        checked={answers[q.id] === opt.id}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))
                        }
                        required
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </fieldset>
              ))}

              {submitErr ? <p className="error">{submitErr}</p> : null}
              {result ? (
                <p className={result.passed ? "success" : "error"}>
                  {result.passed
                    ? `Đậu ${result.score}% — đã mở: ${result.unlockedServiceCodes.join(", ")}`
                    : `Chưa đậu (${result.score}% / cần ${result.passScore}%). Học lại và thử tiếp.`}
                </p>
              ) : null}

              <button className="btn" type="submit" disabled={busy}>
                {busy ? "Đang chấm…" : "Nộp bài"}
              </button>
            </form>
          ) : (
            <p className="muted" style={{ marginTop: 12 }}>
              {detail.unlocked
                ? "Dịch vụ đã mở. Không có bài kiểm tra gắn kèm."
                : "Chưa có bài kiểm tra — liên hệ Ops nếu cần mở thủ công."}
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}
