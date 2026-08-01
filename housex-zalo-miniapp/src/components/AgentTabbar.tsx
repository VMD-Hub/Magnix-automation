import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  IconAgent,
  IconBell,
  IconCart,
  IconDeclare,
  IconUser,
} from "@/components/AppIcons";
import { listNotifications } from "@/services/agent";

function tabClass(isActive: boolean, extra?: string) {
  return [extra, isActive ? "active" : null].filter(Boolean).join(" ");
}

/**
 * Tabbar Agent — SoT 5 mục, Giỏ hàng nổi giữa (Citics-lite).
 * Agent · Khai báo · Giỏ hàng · Thông báo · Tài khoản
 */
export function AgentTabbar() {
  const location = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    void listNotifications()
      .then((d) => {
        const n = Number(d?.unreadCount);
        setUnread(Number.isFinite(n) && n > 0 ? Math.floor(n) : 0);
      })
      .catch(() => setUnread(0));
  }, [location.pathname]);

  /** Hub Agent + màn con gắn home (không gồm khai-báo / giỏ / thông báo). */
  const agentHubActive =
    location.pathname === "/agent" ||
    location.pathname.startsWith("/agent/dich-vu") ||
    location.pathname.startsWith("/agent/ho-so") ||
    location.pathname.startsWith("/agent/hoa-hong") ||
    location.pathname.startsWith("/agent/telesales");

  return (
    <nav className="tabbar tabbar-agent" aria-label="Agent">
      <NavLink
        to="/agent"
        end
        className={() => tabClass(agentHubActive)}
        aria-current={agentHubActive ? "page" : undefined}
      >
        <span className="tabbar-icon" aria-hidden>
          <IconAgent size={20} />
        </span>
        <span className="tabbar-label">Agent</span>
      </NavLink>

      <NavLink
        to="/agent/khai-bao"
        className={({ isActive }) => tabClass(isActive)}
      >
        <span className="tabbar-icon" aria-hidden>
          <IconDeclare size={20} />
        </span>
        <span className="tabbar-label">Khai báo</span>
      </NavLink>

      <NavLink
        to="/agent/gio-hang"
        className={({ isActive }) => tabClass(isActive, "tabbar-cart")}
        aria-label="Giỏ hàng — kho dự án hợp tác"
      >
        <span className="tabbar-cart-fab" aria-hidden>
          <IconCart size={22} />
        </span>
        <span className="tabbar-label">Giỏ hàng</span>
      </NavLink>

      <NavLink
        to="/agent/thong-bao"
        className={({ isActive }) => tabClass(isActive)}
      >
        <span className="tabbar-icon tabbar-icon-badge" aria-hidden>
          <IconBell size={20} />
          {unread > 0 ? (
            <span className="tabbar-badge">{unread > 9 ? "9+" : unread}</span>
          ) : null}
        </span>
        <span className="tabbar-label">Thông báo</span>
      </NavLink>

      <NavLink
        to="/tai-khoan"
        className={({ isActive }) => tabClass(isActive)}
      >
        <span className="tabbar-icon" aria-hidden>
          <IconUser size={20} />
        </span>
        <span className="tabbar-label">Tài khoản</span>
      </NavLink>
    </nav>
  );
}
