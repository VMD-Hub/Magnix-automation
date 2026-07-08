import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  formatCommission,
  getCommissions,
  statusLabelVi,
  type CommissionSummary,
} from "@/services/agent";

export function AgentCommissionsPage() {
  const { canAgent, loading: authLoading } = useAuth();
  const [data, setData] = useState<CommissionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!canAgent) return;
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const d = await getCommissions();
        if (alive) setData(d);
      } catch (e) {
        if (alive) setErr(e instanceof Error ? e.message : "Lỗi tải hoa hồng");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [canAgent]);

  if (authLoading) return <p className="muted">Đang tải…</p>;
  if (!canAgent) return <Navigate to="/tai-khoan" replace />;

  return (
    <div>
      <Link to="/agent" className="muted">
        ← Agent
      </Link>
      <h1 className="brand" style={{ fontSize: 22 }}>
        Hoa hồng
      </h1>

      {loading ? <p className="muted">Đang tải…</p> : null}
      {err ? <p className="err">{err}</p> : null}

      {data ? (
        <>
          <div className="card">
            <h2>Tổng quan</h2>
            <p className="price" style={{ marginTop: 8 }}>
              {formatCommission(data.totalAmount)}
            </p>
            <p className="muted">Tổng theo mọi trạng thái</p>
            <ul className="unit-list">
              {Object.entries(data.totalsByStatus ?? {}).map(([k, v]) =>
                v.count > 0 ? (
                  <li key={k}>
                    <strong>{statusLabelVi(k)}</strong>
                    <span>
                      {v.count} khoản · {formatCommission(v.amount)}
                    </span>
                  </li>
                ) : null,
              )}
            </ul>
          </div>

          {(data.items ?? []).length === 0 ? (
            <div className="card">
              <p>Chưa có khoản hoa hồng.</p>
            </div>
          ) : (
            data.items.map((item) => (
              <div key={item.id} className="card">
                <h2>{formatCommission(item.amount)}</h2>
                <p>
                  {statusLabelVi(item.status)}
                  {item.lead?.project?.name
                    ? ` · ${item.lead.project.name}`
                    : item.lead?.listing?.code
                      ? ` · ${item.lead.listing.code}`
                      : ""}
                </p>
              </div>
            ))
          )}
        </>
      ) : null}
    </div>
  );
}
