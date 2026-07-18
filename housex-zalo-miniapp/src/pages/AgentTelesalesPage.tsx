import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth-context";
import { PageBrandHeader } from "@/components/PageBrandHeader";
import {
  checkBrokerTelesalesAccess,
  listBrokerTelesalesLeads,
} from "@/services/broker-telesales";

export function AgentTelesalesPage() {
  const { canAgent, user, loading } = useAuth();
  const nav = useNavigate();
  const [lane, setLane] = useState<string | null>(null);
  const [items, setItems] = useState<
    Array<{
      id: string;
      statusLabel: string;
      customerName: string | null;
      phoneMasked: string | null;
      sourceLabel: string;
    }>
  >([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    void (async () => {
      if (!canAgent || !user) {
        nav("/tai-khoan", { replace: true });
        return;
      }
      const access = await checkBrokerTelesalesAccess();
      if (!access.ok || !access.data?.allowed) {
        setMsg(
          access.data?.reason ??
            "Chỉ CTV hoặc môi giới nội sàn dùng lane này. Ops pool: #/ops",
        );
        return;
      }
      setLane(access.data.lane);
      const res = await listBrokerTelesalesLeads();
      if (!res.ok) {
        setMsg(res.error ?? "Lỗi tải");
        return;
      }
      setItems(res.data?.items ?? []);
    })();
  }, [canAgent, user, loading, nav]);

  if (!canAgent) {
    return (
      <div>
        <PageBrandHeader
          kicker="HOUSEX AGENT"
          title="Telesales"
          lead="Cần đăng nhập tài khoản môi giới."
        />
        <Link className="btn" to="/tai-khoan">
          Tài khoản
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-16">
      <PageBrandHeader
        kicker="HOUSEX AGENT"
        title="Telesales"
        lead={
          lane === "noi_san"
            ? "Nội sàn — lead Super phân bổ. SOP gọi Phase 1."
            : "CTV — chỉ lead/hồ sơ thuộc bạn. Không pool Ops."
        }
      />

      {msg ? <p className="text-xs text-rose-800">{msg}</p> : null}

      <ul className="divide-y rounded-lg border bg-white">
        {items.length === 0 && !msg ? (
          <li className="px-3 py-6 text-center text-sm text-slate-500">
            Chưa có lead trong phạm vi.
          </li>
        ) : (
          items.map((row) => (
            <li key={row.id}>
              <Link
                to={`/agent/telesales/${row.id}`}
                className="block px-3 py-3 text-sm hover:bg-slate-50"
              >
                <span className="font-medium">
                  {row.customerName ?? "—"} · {row.phoneMasked}
                </span>
                <br />
                <span className="text-xs text-slate-500">
                  {row.statusLabel} · {row.sourceLabel}
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>

      <p className="text-[11px] text-slate-500">
        Ops pool riêng tại <Link to="/ops">#/ops</Link> (cần grant TELESALES_CRM).
      </p>
    </div>
  );
}
