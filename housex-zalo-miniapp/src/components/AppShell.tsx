import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/auth-context";

/**
 * 3 tab cố định — không trùng "Đăng nhập" với "Tài khoản".
 * Khách: Tìm nhà | Công cụ | Tài khoản
 * CTV:   Tìm nhà | Agent  | Tài khoản
 */
export function AppShell() {
  const { canAgent } = useAuth();

  return (
    <div className="shell">
      <main className="shell-main">
        <Outlet />
      </main>
      <nav className="tabbar" aria-label="Chính">
        <NavLink to="/" end>
          {({ isActive }) => (
            <>
              <span className={`dot${isActive ? " on" : ""}`} />
              Tìm nhà
            </>
          )}
        </NavLink>
        {canAgent ? (
          <NavLink to="/agent">
            {({ isActive }) => (
              <>
                <span className={`dot${isActive ? " on" : ""}`} />
                Agent
              </>
            )}
          </NavLink>
        ) : (
          <NavLink to="/cong-cu">
            {({ isActive }) => (
              <>
                <span className={`dot${isActive ? " on" : ""}`} />
                Công cụ
              </>
            )}
          </NavLink>
        )}
        <NavLink to="/tai-khoan">
          {({ isActive }) => (
            <>
              <span className={`dot${isActive ? " on" : ""}`} />
              Tài khoản
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
}
