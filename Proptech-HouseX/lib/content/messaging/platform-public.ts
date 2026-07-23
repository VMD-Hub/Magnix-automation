import type { ComponentType } from "react";
import { Icon } from "@/components/icons";

/** L1 — Trang chủ & quảng bá nền tảng (góc nhìn khách hàng). */

export const PLATFORM_HERO = {
  kicker: "Cổng BĐS Proptech — ưu tiên người mua nhà",
  /** Mobile — một dòng, intent rõ cho UX/SEO. */
  h1Compact: "Tìm nhà, so sánh dự án, ước tính vay",
  h1Line1: "Nơi thông tin chuẩn và",
  h1Accent: "sản phẩm thật được ưu tiên",
  lead: "Tin kiểm duyệt, vị trí minh bạch và công cụ vay — liên hệ an toàn khi bạn sẵn sàng trao đổi.",
} as const;

export type TrustItem = {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
};

export const PLATFORM_TRUST: TrustItem[] = [
  {
    Icon: Icon.BadgeCheck,
    title: "Tin rõ, dễ so sánh",
    desc: "Ảnh, vị trí và giá niêm yết được kiểm tra trước khi hiển thị",
  },
  {
    Icon: Icon.FileCheck,
    title: "Phản hồi từ cộng đồng",
    desc: "Thấy thông tin chưa khớp? Góp ý để chúng tôi cập nhật nhanh",
  },
  {
    Icon: Icon.ShieldCheck,
    title: "Liên hệ an toàn",
    desc: "Số điện thoại được bảo vệ — chỉ hiện khi bạn xác nhận email",
  },
  {
    Icon: Icon.Coins,
    title: "Quyết định có căn cứ",
    desc: "Tính trả góp, wiki nhà ở xã hội và định giá — bổ trợ hành trình chọn nhà",
  },
];

export const PLATFORM_BROKER_CTA = {
  title: "Có BĐS muốn giới thiệu?",
  desc: "Đăng tin rõ ràng — tiếp cận khách đã xác nhận liên hệ, để đúng người tìm thấy bạn sớm hơn.",
} as const;

/** Phase D — surface homepage: 4 hub tên chuẩn ngành (canonical URL). */
export const PLATFORM_NAMING_SURFACE = {
  title: "Bắt đầu đúng chỗ",
  subtitle:
    "Wiki nhà ở xã hội, vay mua nhà, tính trả góp và thiết kế–thi công — cùng cổng House X.",
  items: [
    {
      label: "Wiki nhà ở xã hội",
      href: "/wiki-nha-o-xa-hoi",
      desc: "Điều kiện, hồ sơ & vay NOXH",
      Icon: Icon.FileCheck,
    },
    {
      label: "Vay mua nhà",
      href: "/vay-mua-nha",
      desc: "Hồ sơ & ngân hàng hỗ trợ",
      Icon: Icon.Coins,
    },
    {
      label: "Tính trả góp hàng tháng",
      href: "/tinh-tra-gop",
      desc: "Ước lượng khoản vay mua nhà",
      Icon: Icon.Calculator,
    },
    {
      label: "Thiết kế & thi công",
      href: "/thiet-ke-thi-cong-noi-that",
      desc: "Studio đối tác chiến lược",
      Icon: Icon.Layers,
    },
  ],
} as const;

export const PLATFORM_FOOTER_BLURB =
  "Công cụ mua nhà thông minh — wiki nhà ở xã hội, tính trả góp, dự án và thông tin minh bạch trên cùng cổng House X." as const;
