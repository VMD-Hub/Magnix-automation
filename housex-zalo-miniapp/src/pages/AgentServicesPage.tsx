import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  entitlementLabel,
  listAgentServices,
  serviceCategoryLabel,
  type AgentServiceCategory,
  type AgentServiceListItem,
} from "@/services/agent";

const TABS: Array<{ key: "ALL" | AgentServiceCategory; label: string }> = [
  { key: "ALL", label: "Tất cả" },
  { key: "PRODUCT", label: "Dịch vụ" },
  { key: "TRAINING", label: "Đào tạo" },
  { key: "LEGAL", label: "Pháp lý" },
];

export function AgentServicesPage() {
  const { canAgent, loading: authLoading } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab")?.toUpperCase() || "ALL") as
    | "ALL"
    | AgentServiceCategory;
  const [items, setItems] = useState<AgentServiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!canAgent) return;
    setLoading(true);
    setErr(null);
    void listAgentServices()
      .then((d) => setItems(d.items))
      .catch((e) =>
        setErr(e instanceof Error ? e.message : "Không tải được danh mục"),
      )
      .finally(() => setLoading(false));
  }, [canAgent]);

  const filtered = useMemo(
    () => (tab === "ALL" ? items : items.filter((i) => i.category === tab)),
    [items, tab],
  );

  if (authLoading) return <p className="muted">Đang tải…</p>;
  if (!canAgent) return <Navigate to="/tai-khoan" replace />;

  return (
    <div>
      <Link to="/agent" className="muted">
        ← Agent
      </Link>
      <h1 className="brand" style={{ fontSize: 22, marginTop: 8 }}>
        Quản lý dịch vụ
      </h1>
      <p className="lead" style={{ marginBottom: 12 }}>
        Mỗi dịch vụ mở sau khi đậu khóa đào tạo / pháp lý tương ứng.
      </p>

      <div className="chip-row" style={{ marginBottom: 16 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={tab === t.key ? "chip chip-active" : "chip"}
            onClick={() =>
              setParams(t.key === "ALL" ? {} : { tab: t.key.toLowerCase() })
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <p className="muted">Đang tải…</p> : null}
      {err ? <p className="error">{err}</p> : null}

      {!loading && !err
        ? filtered.map((s) => (
            <Link
              key={s.id}
              to={`/agent/dich-vu/${encodeURIComponent(s.code)}`}
              className="card tool-card"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  alignItems: "flex-start",
                }}
              >
                <h2 style={{ margin: 0 }}>{s.name}</h2>
                <span
                  className={
                    s.unlocked ? "badge badge-ok" : "badge badge-locked"
                  }
                >
                  {entitlementLabel(s.status, s.unlocked)}
                </span>
              </div>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                {serviceCategoryLabel(s.category)}
                {s.isRequiredForCtv ? " · Bắt buộc" : ""}
                {s.requiresCode ? ` · Cần ${s.requiresCode}` : ""}
              </p>
              <p>{s.description}</p>
              <span className="tool-card-cta">
                {s.hasQuiz && !s.unlocked
                  ? "Học & làm bài →"
                  : s.unlocked
                    ? "Xem chi tiết →"
                    : "Xem yêu cầu →"}
              </span>
            </Link>
          ))
        : null}

      {!loading && !err && filtered.length === 0 ? (
        <p className="muted">Chưa có mục trong nhóm này.</p>
      ) : null}
    </div>
  );
}
