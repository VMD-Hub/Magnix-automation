import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth-context";
import { useHomeTabPath } from "@/components/LaneSwitcher";

/**
 * 3 tab cố định — không trùng "Đăng nhập" với "Tài khoản".
 * Khách: Tìm nhà | Công cụ | Tài khoản
 * CTV:   Tìm nhà | Agent  | Tài khoản
 */
export function AppShell() {
  const { canAgent } = useAuth();
  const homePath = useHomeTabPath();
  const location = useLocation();
  const homeActive =
    location.pathname === "/" ||
    location.pathname === "/noxh" ||
    location.pathname === "/cctm" ||
    location.pathname === "/kham-pha" ||
    location.pathname.startsWith("/du-an/");

  return (
    <div className="shell">
      <main className="shell-main">
        <Outlet />
      </main>
      <nav className="tabbar" aria-label="Chính">
        <NavLink to={homePath} className={homeActive ? "active" : undefined}>
          <>
            <span className={`dot${homeActive ? " on" : ""}`} />
            Tìm nhà
          </>
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
