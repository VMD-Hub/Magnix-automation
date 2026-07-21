import type { AdminRole } from "@/lib/admin/roles";

export type AdminNavBadgeKey = "opsLeadsNew" | "conflictsOpen";

export type AdminNavItem = {
  href: string;
  /** Nhãn trên thanh nav. */
  label: string;
  /** Tooltip / mô tả ngắn. */
  title: string;
  roles: AdminRole[];
  badge?: AdminNavBadgeKey;
  /** Khớp prefix cho trang con (vd. /admin/articles/[id]). */
  matchPrefix?: boolean;
};

export type AdminNavGroup = {
  id: string;
  label: string;
  roles: AdminRole[];
  items: AdminNavItem[];
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: "content",
    label: "Nội dung",
    roles: ["super"],
    items: [
      {
        href: "/admin/content-queue",
        label: "Content queue",
        title:
          "Magnix content factory — L3 bắt buộc CTA tool NƠXH (điều kiện / vay)",
        roles: ["super"],
        matchPrefix: true,
      },
      {
        href: "/admin/listings",
        label: "Tin đăng CTV",
        title: "Duyệt tin môi giới đăng bán (listing)",
        roles: ["super"],
        matchPrefix: true,
      },
      {
        href: "/admin/early-signals",
        label: "Tin sớm NOXH",
        title: "Early Signal — duyệt tin báo/CĐT trước publish (không phải tin đăng CTV)",
        roles: ["super"],
        matchPrefix: true,
      },
      {
        href: "/admin/re-service-orgs",
        label: "Registry DV BĐS",
        title:
          "Tổ chức KD dịch vụ BĐS (sàn / môi giới) — tài sản dữ liệu nội bộ, chỉ Chủ quản",
        roles: ["super"],
        matchPrefix: true,
      },
      {
        href: "/admin/articles",
        label: "Tin tức",
        title: "Bài viết & tin tức",
        roles: ["super"],
        matchPrefix: true,
      },
      {
        href: "/admin/projects",
        label: "Landing dự án",
        title: "Trang landing dự án BĐS",
        roles: ["super"],
        matchPrefix: true,
      },
    ],
  },
  {
    id: "crm",
    label: "CRM & Lead",
    roles: ["super", "ops"],
    items: [
      {
        href: "/admin/ops-leads",
        label: "Lead marketing",
        title: "Pipeline telesales — chỉ Super (staff dùng /ops/telesales)",
        roles: ["super"],
        badge: "opsLeadsNew",
        matchPrefix: true,
      },
      {
        href: "/admin/email-marketing",
        label: "Email marketing",
        title: "Nurture email ADR-017 — KPI, enroll, gửi/dừng (Super)",
        roles: ["super"],
        matchPrefix: true,
      },
      {
        href: "/admin/ops-grants",
        label: "Quyền telesales",
        title: "Cấp / thu hồi CRM Telesales theo SĐT hoặc Zalo id",
        roles: ["super"],
        matchPrefix: true,
      },
      {
        href: "/admin/noxh-cases",
        label: "Hồ sơ NOXH",
        title: "Checklist pháp lý & mốc M1–M5",
        roles: ["super", "ops"],
        matchPrefix: true,
      },
      {
        href: "/admin/conflicts",
        label: "Xung đột",
        title: "Xung đột attribution Ops vs CTV",
        roles: ["super", "ops"],
        badge: "conflictsOpen",
        matchPrefix: true,
      },
      {
        href: "/admin/inbound-leads",
        label: "Magnix Inbound",
        title: "Lead inbound Magnix — triage Ops",
        roles: ["super", "ops"],
        matchPrefix: true,
      },
    ],
  },
  {
    id: "help",
    label: "Hỗ trợ",
    roles: ["super", "ops"],
    items: [
      {
        href: "/admin/playbook",
        label: "Playbook",
        title: "Đào tạo & SOP Ops — hướng dẫn trong Admin",
        roles: ["super", "ops"],
        matchPrefix: true,
      },
    ],
  },
  {
    id: "sales",
    label: "Sales & CTV",
    roles: ["super", "ops"],
    items: [
      {
        href: "/admin/conversion",
        label: "Chuyển đổi",
        title: "Funnel Journey P: đề xuất → cam kết → thắng/thua + nurture",
        roles: ["super", "ops"],
        matchPrefix: true,
      },
      {
        href: "/admin/unit-bookings",
        label: "Giữ suất F1",
        title: "Đặt chỗ / giữ suất mua F1",
        roles: ["super"],
        matchPrefix: true,
      },
      {
        href: "/admin/promotions",
        label: "Khuyến mãi",
        title: "Chiến dịch vòng quay & khuyến mãi",
        roles: ["super"],
        matchPrefix: true,
      },
      {
        href: "/admin/ctv",
        label: "Duyệt CTV",
        title: "Đơn đăng ký cộng tác viên",
        roles: ["super"],
        matchPrefix: true,
      },
    ],
  },
];

export function adminNavGroupsForRole(role: AdminRole): AdminNavGroup[] {
  return ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.roles.includes(role)),
  })).filter((group) => group.roles.includes(role) && group.items.length > 0);
}

export function isAdminNavActive(
  pathname: string,
  item: AdminNavItem,
): boolean {
  if (item.matchPrefix) {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }
  return pathname === item.href;
}
