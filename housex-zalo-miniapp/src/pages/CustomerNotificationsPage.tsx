import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  listCustomerNotifications,
  markCustomerNotificationsRead,
  type CustomerNotification,
} from "@/services/customer-notifications";

/** ADR-016 P2 — inbox in-app khách (waitlist / mở bán). */
export function CustomerNotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CustomerNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    setErr(null);
    try {
      const d = await listCustomerNotifications();
      setItems(d.items);
      setUnread(d.unreadCount);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Không tải thông báo");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.role === "CUSTOMER") void reload();
  }, [user?.role]);

  async function markAll() {
    await markCustomerNotificationsRead();
    await reload();
  }

  if (authLoading) return <p className="muted">Đang tải…</p>;
  if (!user || user.role !== "CUSTOMER") {
    return <Navigate to="/tai-khoan" replace />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg font-semibold">Thông báo</h1>
        {unread > 0 ? (
          <button type="button" className="btn secondary" onClick={() => void markAll()}>
            Đánh dấu đã đọc ({unread})
          </button>
        ) : null}
      </div>
      <p className="muted text-sm">
        Cập nhật dự án đã đăng ký nhận tin — không gọi điện chỉ vì đăng ký.
      </p>
      {loading ? <p className="muted">Đang tải…</p> : null}
      {err ? <p className="err">{err}</p> : null}
      {!loading && !items.length ? (
        <p className="muted">Chưa có thông báo.</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((n) => (
          <li
            key={n.id}
            className={`card ${n.readAt ? "" : "border-sky-300"}`}
          >
            <p className="font-medium text-sm">{n.title}</p>
            <p className="text-sm text-slate-700 mt-1">{n.body}</p>
            <p className="muted text-xs mt-1">
              {new Date(n.createdAt).toLocaleString("vi-VN")}
            </p>
            {n.href?.startsWith("/du-an/") ? (
              <Link className="btn secondary mt-2 inline-block" to={n.href}>
                Xem dự án
              </Link>
            ) : n.href ? (
              <a className="btn secondary mt-2 inline-block" href={n.href}>
                Mở liên kết
              </a>
            ) : null}
          </li>
        ))}
      </ul>
      <Link to="/tai-khoan" className="muted">
        ← Tài khoản
      </Link>
    </div>
  );
}
