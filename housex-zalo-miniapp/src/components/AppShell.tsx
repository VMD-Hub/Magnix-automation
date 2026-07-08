import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/auth-context";

export function AppShell() {
  const { canAgent } = useAuth();

  return (
    <div className="shell">
      <main className="shell-main">
        <Outlet />
      </main>
      <nav className="tabbar" aria-label="Chính">
        <NavLink to="/" end>
          <span className="dot" />
          Tìm nhà
        </NavLink>
        <NavLink to={canAgent ? "/agent" : "/tai-khoan"}>
          <span className="dot" />
          {canAgent ? "Agent" : "Đăng nhập"}
        </NavLink>
        <NavLink to="/tai-khoan">
          <span className="dot" />
          Tài khoản
        </NavLink>
      </nav>
    </div>
  );
}
