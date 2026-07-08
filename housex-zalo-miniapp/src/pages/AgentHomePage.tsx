import { Link } from "react-router-dom";
import { useAuth } from "@/auth-context";
import { useEffect, useState } from "react";
import { listNotifications } from "@/services/agent";

export function AgentHomePage() {
  const { canAgent, user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!canAgent) return;
    void listNotifications()
      .then((d) => setUnread(d.unreadCount))
      .catch(() => setUnread(0));
  }, [canAgent]);

  if (!canAgent) {
    return (
      <div>
        <h1 className="brand" style={{ fontSize: 22 }}>
          HouseX Agent
        </h1>
        <p className="lead">
          Khu vực dành cho môi giới / CTV. Đăng nhập tài khoản môi giới để xem
          hồ sơ và hoa hồng.
        </p>
        <Link className="btn" to="/tai-khoan">
          Tới Tài khoản
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="muted">HOUSEX AGENT</p>
      <h1 className="brand" style={{ fontSize: 22 }}>
        Xin chào, {user?.name}
      </h1>
      {user?.ctvCode ? (
        <p className="muted" style={{ marginBottom: 16 }}>
          Mã CTV {user.ctvCode}
        </p>
      ) : null}

      <Link to="/agent/ho-so" className="card tool-card">
        <h2>Hồ sơ NOXH</h2>
        <p>Theo dõi tiến độ · thả lead mới</p>
        <span className="tool-card-cta">Mở hồ sơ →</span>
      </Link>

      <Link to="/agent/thong-bao" className="card tool-card">
        <h2>Thông báo {unread > 0 ? `(${unread})` : ""}</h2>
        <p>Cập nhật mốc, SLA và hoa hồng</p>
        <span className="tool-card-cta">Xem thông báo →</span>
      </Link>

      <Link to="/agent/hoa-hong" className="card tool-card">
        <h2>Hoa hồng</h2>
        <p>Số tiền đã ghi nhận và kỳ chi</p>
        <span className="tool-card-cta">Xem hoa hồng →</span>
      </Link>
    </div>
  );
}
