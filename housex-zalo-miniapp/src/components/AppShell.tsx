import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  IconAgent,
  IconHome,
  IconTools,
  IconUser,
} from "@/components/AppIcons";
import { useHomeTabPath } from "@/components/LaneSwitcher";
import { getHxBuildId } from "@/utils/build-id";

/**
 * 3 tab cố định — không trùng "Đăng nhập" với "Tài khoản".
 * Khách: Tìm nhà | Công cụ | Tài khoản
 * CTV:   Tìm nhà | Agent  | Tài khoản
 */
export function AppShell() {
  const { canAgent } = useAuth();
  const homePath = useHomeTabPath();
  const location = useLocation();
  const buildId = getHxBuildId();
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
        <p className="hx-build-stamp" aria-hidden>
          House X · {buildId}
        </p>
      </main>
      <nav className="tabbar" aria-label="Chính">
        <NavLink
          to={homePath}
          className={homeActive ? "active" : undefined}
        >
          <span className="tabbar-icon">
            <IconHome size={22} />
          </span>
          <span className="tabbar-label">Tìm nhà</span>
        </NavLink>
        {canAgent ? (
          <NavLink to="/agent">
            <span className="tabbar-icon">
              <IconAgent size={22} />
            </span>
            <span className="tabbar-label">Agent</span>
          </NavLink>
        ) : (
          <NavLink to="/cong-cu">
            <span className="tabbar-icon">
              <IconTools size={22} />
            </span>
            <span className="tabbar-label">Công cụ</span>
          </NavLink>
        )}
        <NavLink to="/tai-khoan">
          <span className="tabbar-icon">
            <IconUser size={22} />
          </span>
          <span className="tabbar-label">Tài khoản</span>
        </NavLink>
      </nav>
    </div>
  );
}
