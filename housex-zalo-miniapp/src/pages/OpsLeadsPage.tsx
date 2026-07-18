import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  checkTelesalesAccess,
  createHotLead,
  listOpsLeads,
} from "@/services/ops-telesales";

export function OpsLeadsPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState<
    Array<{
      id: string;
      statusLabel: string;
      customerName: string | null;
      phoneMasked: string | null;
      sourceLabel: string;
    }>
  >([]);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    void (async () => {
      if (!user) {
        nav("/ops", { replace: true });
        return;
      }
      const access = await checkTelesalesAccess();
      if (!access.ok || !access.data?.allowed) {
        nav("/ops", { replace: true });
        return;
      }
      const res = await listOpsLeads("NEW");
      if (!res.ok) {
        setMsg(res.error ?? "Lỗi tải");
        return;
      }
      setItems(res.data?.items ?? []);
    })();
  }, [user, loading, nav]);

  async function addHot(e: React.FormEvent) {
    e.preventDefault();
    const res = await createHotLead({ name: name || "Khách hot", phone });
    if (!res.ok) {
      setMsg(res.error ?? "Tạo thất bại");
      return;
    }
    setMsg(res.data?.created ? "Đã tạo" : "Lead mở đã có — mở lại");
    if (res.data?.leadId) nav(`/ops/leads/${res.data.leadId}`);
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">CRM Telesales</h1>
        <Link to="/tai-khoan" className="text-xs text-slate-500">
          Tài khoản
        </Link>
      </div>
      <p className="text-xs text-slate-600">Inbox NEW — gọi trước, ghi chip sau.</p>

      <form
        onSubmit={(e) => void addHot(e)}
        className="space-y-2 rounded-lg border bg-white p-3"
      >
        <input
          className="w-full rounded border px-2 py-1.5 text-sm"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded border px-2 py-1.5 text-sm"
          placeholder="SĐT *"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-rose-800 py-2 text-sm font-semibold text-white"
        >
          Thêm lead hot + Task gọi 1
        </button>
      </form>

      {msg ? <p className="text-xs text-brand-800">{msg}</p> : null}

      <ul className="divide-y rounded-lg border bg-white">
        {items.map((row) => (
          <li key={row.id}>
            <Link
              to={`/ops/leads/${row.id}`}
              className="block px-3 py-3 text-sm hover:bg-slate-50"
            >
              <span className="font-medium">
                {row.customerName ?? "Khách"} {row.phoneMasked}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                {row.statusLabel} · {row.sourceLabel}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
