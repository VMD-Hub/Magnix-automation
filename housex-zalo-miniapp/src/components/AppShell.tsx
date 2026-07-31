import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  IconAgent,
  IconHome,
  IconServices,
  IconTools,
  IconUser,
} from "@/components/AppIcons";
import { AgentHelpFab } from "@/components/AgentHelpFab";
import { AgentTabbar } from "@/components/AgentTabbar";
import { useHomeTabPath } from "@/components/LaneSwitcher";

/**
 * Khách: 4 tab Tìm nhà | Dịch vụ | Công cụ | Tài khoản
 * CTV trên /agent/* hoặc /tai-khoan: 5 tab SoT (Giỏ giữa) + Help FAB
 */
export function AppShell() {
  const { canAgent } = useAuth();
  const homePath = useHomeTabPath();
  const location = useLocation();
  const onAgentRoutes =
    location.pathname === "/agent" || location.pathname.startsWith("/agent/");
  const useAgentTabbar =
    canAgent && (onAgentRoutes || location.pathname === "/tai-khoan");

  const homeActive =
    location.pathname === "/" ||
    location.pathname === "/noxh" ||
    location.pathname === "/cctm" ||
    location.pathname === "/kham-pha" ||
    location.pathname.startsWith("/du-an/");

  return (
    <div className={`shell ${useAgentTabbar ? "shell-agent" : ""}`}>
      <main className="shell-main">
        <Outlet />
      </main>
      {useAgentTabbar ? (
        <>
          <AgentTabbar />
          {location.pathname !== "/agent/khai-bao" ? <AgentHelpFab /> : null}
        </>
      ) : (
        <nav className="tabbar" aria-label="Chính">
          <NavLink to={homePath} className={homeActive ? "active" : undefined}>
            <span className="tabbar-icon">
              <IconHome size={22} />
            </span>
            <span className="tabbar-label">Tìm nhà</span>
          </NavLink>
          <NavLink to="/dich-vu">
            <span className="tabbar-icon">
              <IconServices size={22} />
            </span>
            <span className="tabbar-label">Dịch vụ</span>
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
      )}
    </div>
  );
}
