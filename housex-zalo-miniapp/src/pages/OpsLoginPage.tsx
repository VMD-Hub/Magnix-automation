import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth-context";
import { checkTelesalesAccess } from "@/services/ops-telesales";
import {
  loginViaZaloMiniApp,
  NeedPhoneError,
} from "@/services/zalo-miniapp-auth";

/**
 * Entry CRM Telesales — Zalo login + Super-Admin grant (không dùng ADMIN_OPS_SECRET).
 */
export function OpsLoginPage() {
  const { user, loading, refresh, setUser } = useAuth();
  const nav = useNavigate();
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    void (async () => {
      if (!user) return;
      if (user.opsTools?.telesales) {
        nav("/ops/leads", { replace: true });
        return;
      }
      const access = await checkTelesalesAccess();
      if (access.ok && access.data?.allowed) {
        nav("/ops/leads", { replace: true });
        return;
      }
      setMsg("Tài khoản chưa được Super Admin cấp quyền CRM Telesales.");
    })();
  }, [user, loading, nav]);

  async function loginZalo() {
    setBusy(true);
    setMsg(null);
    try {
      const loggedIn = await loginViaZaloMiniApp();
      setUser(loggedIn);
      await refresh();
      const access = await checkTelesalesAccess();
      if (access.ok && access.data?.allowed) {
        nav("/ops/leads", { replace: true });
        return;
      }
      setMsg(
        "Đã đăng nhập Zalo nhưng chưa được cấp quyền. Liên hệ Super Admin.",
      );
    } catch (e) {
      if (e instanceof NeedPhoneError) {
        setMsg("Zalo đã kết nối — hoàn tất SĐT tại trang Tài khoản rồi quay lại.");
      } else {
        setMsg(e instanceof Error ? e.message : "Đăng nhập thất bại");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 p-4">
      <h1 className="text-lg font-bold text-slate-900">CRM Telesales</h1>
      <p className="text-sm text-slate-600">
        Công cụ gọi / SMS / Zalo + nhật ký lead. Chỉ tài khoản được Super Admin
        duyệt mới vào được.
      </p>
      {loading ? (
        <p className="text-sm text-slate-500">Đang kiểm tra phiên…</p>
      ) : user ? (
        <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 text-sm">
          <p>
            Đã đăng nhập: <strong>{user.name}</strong> ({user.phoneMasked})
          </p>
          {msg ? <p className="text-rose-600">{msg}</p> : null}
          <Link to="/tai-khoan" className="text-xs text-rose-800 underline">
            Về tài khoản
          </Link>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => void loginZalo()}
          className="w-full rounded-lg bg-rose-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Đang đăng nhập…" : "Đăng nhập Zalo để vào telesales"}
        </button>
      )}
      {msg && !user ? <p className="text-sm text-rose-600">{msg}</p> : null}
    </div>
  );
}
