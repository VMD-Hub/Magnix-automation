import { NOXH_HANDBOOK_PATH } from "@/lib/content/article-routes";
import {
  NOXH_CATALOG_PATH,
  NOXH_CATALOG_TITLE,
  NOXH_HANDBOOK_TITLE,
} from "@/lib/content/messaging/noxh-public";

/** Primary header links — tối đa ~6 (competitive review E1). */
export const NAV_PRIMARY = [
  { label: "Mua bán", href: "/mua-ban" },
  { label: "Cho thuê", href: "/cho-thue" },
  { label: "Dự án", href: "/du-an" },
  { label: "Vay", href: "/tai-chinh" },
  { label: "Định giá", href: "/dinh-gia" },
  { label: "Công cụ", href: "/cong-cu" },
] as const;

/** Secondary — gói trong «Thêm» trên desktop; nhóm riêng trên mobile. */
export const NAV_MORE = [
  { label: "Khuyến mãi", href: "/khuyen-mai" },
  { label: "Dịch vụ", href: "/dich-vu" },
  { label: NOXH_HANDBOOK_TITLE, href: NOXH_HANDBOOK_PATH },
  { label: NOXH_CATALOG_TITLE, href: NOXH_CATALOG_PATH },
] as const;
