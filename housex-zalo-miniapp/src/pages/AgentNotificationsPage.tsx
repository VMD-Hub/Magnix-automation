import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  listNotifications,
  markNotificationsRead,
  type BrokerNotification,
} from "@/services/agent";
import {
  brokerNotificationCategory,
  stripNotificationRef,
} from "@/utils/notifications";

export function AgentNotificationsPage() {
  const { canAgent, loading: authLoading } = useAuth();
  const [items, setItems] = useState<BrokerNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    setErr(null);
    try {
      const d = await listNotifications();
      setItems(d.items);
      setUnread(d.unreadCount);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Không tải thông báo");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canAgent) void reload();
  }, [canAgent]);

  async function markAll() {
    await markNotificationsRead();
    await reload();
  }

  if (authLoading) return <p className="muted">Đang tải…</p>;
  if (!canAgent) return <Navigate to="/tai-khoan" replace />;

  return (
    <div>
      <Link to="/agent" className="muted">
        ← Agent
      </Link>
      <div className="section-head">
        <h1 className="brand" style={{ fontSize: 22, margin: 0 }}>
          Thông báo
        </h1>
        {unread > 0 ? (
          <button
            type="button"
            className="muted"
            style={{
              background: "none",
              border: 0,
              color: "var(--hx-accent-2)",
              cursor: "pointer",
            }}
            onClick={() => void markAll()}
          >
            Đánh dấu đã đọc ({unread})
          </button>
        ) : null}
      </div>

      {loading ? <p className="muted">Đang tải…</p> : null}
      {err ? <p className="err">{err}</p> : null}
      {!loading && items.length === 0 ? (
        <div className="card">
          <p>Chưa có thông báo.</p>
          <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>
            Cập nhật mốc hồ sơ, xung đột attribution và SLA sẽ hiện tại đây.
          </p>
        </div>
      ) : null}

      {items.map((n) => {
        const category = brokerNotificationCategory(n.type);
        const body = stripNotificationRef(n.body);
        const inner = (
          <>
            <p
              className="muted"
              style={{ margin: "0 0 4px", fontSize: 11, letterSpacing: "0.04em" }}
            >
              {category.toUpperCase()}
            </p>
            <h2 style={{ margin: 0 }}>{n.title}</h2>
            <p style={{ marginTop: 8 }}>{body}</p>
            <p className="muted" style={{ marginTop: 6 }}>
              {new Date(n.createdAt).toLocaleString("vi-VN")}
              {!n.read ? " · Chưa đọc" : ""}
            </p>
          </>
        );
        return n.caseId ? (
          <Link
            key={n.id}
            to={`/agent/ho-so/${n.caseId}`}
            className="card tool-card"
            style={!n.read ? { borderColor: "rgba(225,29,72,0.45)" } : undefined}
          >
            {inner}
          </Link>
        ) : (
          <div
            key={n.id}
            className="card"
            style={!n.read ? { borderColor: "rgba(225,29,72,0.45)" } : undefined}
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}
