"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HouseXHeaderLogo } from "@/components/brand/housex-header-logo";
import { AdminNavBadge } from "@/components/admin/admin-nav-badge";
import { useAdminQueueCounts } from "@/components/admin/use-admin-queue-counts";
import { useAdminRole } from "@/lib/admin/admin-role-context";
import {
  adminNavGroupsForRole,
  isAdminNavActive,
  type AdminNavBadgeKey,
} from "@/lib/admin/nav";
import { ADMIN_ROLE_LABEL, defaultAdminHome } from "@/lib/admin/roles";
import { cn } from "@/lib/ui/cn";

export function AdminHeader() {
  const pathname = usePathname() ?? "/admin";
  const counts = useAdminQueueCounts();
  const role = useAdminRole();
  const home = defaultAdminHome(role);
  const groups = adminNavGroupsForRole(role);

  function badgeFor(key?: AdminNavBadgeKey): number {
    if (!counts || !key) return 0;
    if (key === "opsLeadsNew") return counts.opsLeadsNew;
    if (key === "conflictsOpen") return counts.conflictsOpen;
    return 0;
  }

  return (
    <header className="admin-chrome shrink-0">
      <div className="admin-chrome__top site-header-bar proptech-header-ruby">
        <div className="admin-chrome__top-inner mx-auto max-w-7xl">
          <div className="admin-chrome__brand">
            <HouseXHeaderLogo
              href={home}
              surface="ruby"
              className="admin-chrome__logo"
            />
            <div className="admin-chrome__console-label">
              <span className="admin-chrome__console-title">Console vận hành</span>
              <span className="admin-chrome__console-sub">House X Platform</span>
            </div>
          </div>

          <div className="admin-chrome__actions">
            <span className="admin-chrome__role-pill">
              {ADMIN_ROLE_LABEL[role]}
              {role === "super" ? (
                <span className="admin-chrome__role-tier">L3</span>
              ) : null}
            </span>
            <AdminLogoutButton />
            <Link href="/" className="admin-chrome__ghost-btn hidden sm:inline">
              ← Về site
            </Link>
          </div>
        </div>
      </div>

      <nav
        className="admin-chrome__nav"
        aria-label="Điều hướng quản trị"
      >
        <div className="admin-chrome__nav-scroll mx-auto max-w-7xl">
          {groups.map((group) => (
            <div key={group.id} className="admin-chrome__group">
              <span className="admin-chrome__group-label">{group.label}</span>
              <div className="admin-chrome__group-items">
                {group.items.map((item) => {
                  const active = isAdminNavActive(pathname, item);
                  const badge = badgeFor(item.badge);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={item.title}
                      className={cn(
                        "admin-chrome__nav-link",
                        active && "admin-chrome__nav-link--active",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                      <AdminNavBadge count={badge} />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
}

function AdminLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="admin-chrome__ghost-btn"
    >
      Đăng xuất
    </button>
  );
}
