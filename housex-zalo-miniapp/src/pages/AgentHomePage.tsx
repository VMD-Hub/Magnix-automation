import { Link } from "react-router-dom";
import { useAuth } from "@/auth-context";

export function AgentHomePage() {
  const { canAgent, user } = useAuth();

  if (!canAgent) {
    return (
      <div>
        <h1 className="brand" style={{ fontSize: 22 }}>
          HouseX Agent
        </h1>
        <p className="lead">
          Khu vực dành cho môi giới / CTV đã được duyệt. Đăng nhập tài khoản
          môi giới để xem hồ sơ và hoa hồng.
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
      <div className="card">
        <h2>Hồ sơ NOXH</h2>
        <p>Theo dõi tiến độ hồ sơ bạn giới thiệu.</p>
      </div>
      <div className="card">
        <h2>Thông báo</h2>
        <p>Cập nhật mốc, SLA và kết quả thẩm định.</p>
      </div>
      <div className="card">
        <h2>Hoa hồng</h2>
        <p>Xem số tiền đã ghi nhận và kỳ chi.</p>
      </div>
    </div>
  );
}
