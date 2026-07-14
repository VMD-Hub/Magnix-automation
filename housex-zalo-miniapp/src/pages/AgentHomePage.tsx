import { Link } from "react-router-dom";
import { useAuth } from "@/auth-context";
import { useEffect, useState } from "react";
import { PageBrandHeader } from "@/components/PageBrandHeader";
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
        <PageBrandHeader
          kicker="HOUSEX AGENT"
          title="Khu vực môi giới"
          lead="Đăng nhập tài khoản môi giới / CTV để xem hồ sơ và hoa hồng."
        />
        <Link className="btn" to="/tai-khoan">
          Tới Tài khoản
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageBrandHeader
        kicker="HOUSEX AGENT"
        title={`Xin chào, ${user?.name ?? ""}`}
        lead={user?.ctvCode ? `Mã CTV ${user.ctvCode}` : undefined}
      />

      <Link to="/agent/dich-vu?tab=product" className="card tool-card">
        <h2>Quản lý dịch vụ</h2>
        <p>Dịch vụ đang mở · khóa học cần đậu để unlock</p>
        <span className="tool-card-cta">Xem dịch vụ →</span>
      </Link>

      <Link to="/agent/dich-vu?tab=training" className="card tool-card">
        <h2>Đào tạo nội bộ</h2>
        <p>E-learning hội nhập CTV · bài kiểm tra</p>
        <span className="tool-card-cta">Vào học →</span>
      </Link>

      <Link to="/agent/dich-vu?tab=legal" className="card tool-card">
        <h2>Pháp lý BĐS</h2>
        <p>Hành nghề · giao dịch · kiến thức nền</p>
        <span className="tool-card-cta">Đọc & thi →</span>
      </Link>

      <Link to="/agent/ho-so" className="card tool-card">
        <h2>Hồ sơ NOXH</h2>
        <p>Theo dõi tiến độ · thả lead (cần mở dịch vụ)</p>
        <span className="tool-card-cta">Mở hồ sơ →</span>
      </Link>

      <Link to="/agent/thong-bao" className="card tool-card">
        <h2>
          Thông báo
          {unread > 0 ? (
            <span
              style={{
                marginLeft: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--hx-accent-2)",
              }}
            >
              {unread} mới
            </span>
          ) : null}
        </h2>
        <p>Mốc hồ sơ · xung đột attribution · SLA · hoa hồng</p>
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
