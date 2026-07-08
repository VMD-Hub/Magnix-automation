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
          Tab này dành cho môi giới / CTV. Đăng nhập tài khoản BROKER hoặc đăng
          ký CTV trên web.
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
        <p>GET /api/ctv/cases — Phase 2.</p>
      </div>
      <div className="card">
        <h2>Thông báo</h2>
        <p>GET /api/ctv/notifications — Phase 2.</p>
      </div>
      <div className="card">
        <h2>Hoa hồng</h2>
        <p>GET /api/ctv/commissions — Phase 2.</p>
      </div>
    </div>
  );
}
