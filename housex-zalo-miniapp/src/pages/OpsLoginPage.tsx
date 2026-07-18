import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearOpsSecret, getOpsSecret, opsLogin } from "@/services/ops-telesales";

export function OpsLoginPage() {
  const nav = useNavigate();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getOpsSecret()) nav("/ops/leads", { replace: true });
  }, [nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await opsLogin(secret);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    nav("/ops/leads", { replace: true });
  }

  return (
    <div className="mx-auto max-w-md space-y-4 p-4">
      <h1 className="text-lg font-bold text-slate-900">Ops telesales</h1>
      <p className="text-sm text-slate-600">
        Đăng nhập bằng ADMIN_OPS_SECRET hoặc ADMIN_SECRET (không dùng tài khoản CTV).
      </p>
      <form onSubmit={(e) => void submit(e)} className="space-y-3">
        <input
          type="password"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="Mật khẩu Ops"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          required
        />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-lg bg-rose-800 px-3 py-2 text-sm font-semibold text-white"
        >
          Vào pipeline gọi
        </button>
      </form>
      <button
        type="button"
        className="text-xs text-slate-500 underline"
        onClick={() => {
          clearOpsSecret();
          setSecret("");
        }}
      >
        Xoá phiên Ops trên máy này
      </button>
    </div>
  );
}
