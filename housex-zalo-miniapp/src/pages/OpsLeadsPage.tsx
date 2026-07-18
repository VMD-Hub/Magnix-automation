import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  clearOpsSecret,
  createHotLead,
  getOpsSecret,
  listOpsLeads,
} from "@/services/ops-telesales";

export function OpsLeadsPage() {
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
    if (!getOpsSecret()) {
      nav("/ops", { replace: true });
      return;
    }
    void (async () => {
      const res = await listOpsLeads("NEW");
      if (!res.ok) {
        setMsg(res.error ?? "Lỗi tải");
        return;
      }
      setItems(res.data?.items ?? []);
    })();
  }, [nav]);

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
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Ops — Lead gọi</h1>
        <button
          type="button"
          className="text-xs text-slate-500"
          onClick={() => {
            clearOpsSecret();
            nav("/ops");
          }}
        >
          Đăng xuất Ops
        </button>
      </div>

      <form onSubmit={(e) => void addHot(e)} className="space-y-2 rounded-xl border border-slate-200 p-3">
        <p className="text-xs font-semibold text-slate-700">Thêm lead hot</p>
        <input
          className="w-full rounded-lg border px-2 py-2 text-sm"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded-lg border px-2 py-2 text-sm"
          placeholder="SĐT *"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-rose-800 py-2 text-sm font-semibold text-white"
        >
          Lưu + Task gọi lần 1
        </button>
      </form>

      {msg ? <p className="text-xs text-rose-800">{msg}</p> : null}

      <ul className="divide-y rounded-xl border border-slate-200 bg-white">
        {items.map((row) => (
          <li key={row.id}>
            <Link
              to={`/ops/leads/${row.id}`}
              className="block px-3 py-3 hover:bg-slate-50"
            >
              <p className="font-medium text-slate-900">
                {row.customerName ?? "Khách"}{" "}
                <span className="text-sm font-normal text-slate-500">
                  {row.phoneMasked}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                {row.sourceLabel} · {row.statusLabel}
              </p>
            </Link>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="px-3 py-4 text-sm text-slate-500">
            Không có lead Mới — thử web Ops hoặc thêm hot ở trên.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
