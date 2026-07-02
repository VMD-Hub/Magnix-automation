import type { ComponentType } from "react";
import { Icon } from "@/components/icons";
import { RADA_SHORT } from "@/lib/content/messaging/rada";

/** L1 — Trang chủ & quảng bá nền tảng. */

export const PLATFORM_HERO = {
  kicker: "Sàn bất động sản có quy trình xác minh",
  h1Line1: "Nơi thông tin chuẩn và",
  h1Accent: "sản phẩm thật được ưu tiên",
  lead: `House X kiểm duyệt tin đăng, đối chiếu thông tin và xử lý báo cáo sai lệch — để người mua không bị dẫn sai nơi, sai giá; môi giới đăng tin đúng chuẩn thì được tin tưởng. ${RADA_SHORT} Sai lệch có báo cáo — người đăng tin vi phạm chịu cơ chế xử lý của sàn.`,
} as const;

export type TrustItem = {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
};

export const PLATFORM_TRUST: TrustItem[] = [
  {
    Icon: Icon.BadgeCheck,
    title: "Tiêu chuẩn duyệt tin",
    desc: "Địa chỉ, ảnh và mô tả trong quy tắc kiểm duyệt",
  },
  {
    Icon: Icon.FileCheck,
    title: "Báo cáo tin sai",
    desc: "Khách báo cáo · xử lý và phạt minh bạch",
  },
  {
    Icon: Icon.ShieldCheck,
    title: "Liên hệ an toàn",
    desc: "Số điện thoại bảo vệ — xem sau xác nhận email",
  },
  {
    Icon: Icon.Coins,
    title: "Công cụ hỗ trợ",
    desc: "Tính khoản vay, định giá — bổ trợ quyết định",
  },
];

export const PLATFORM_BROKER_CTA = {
  title: "Bạn là môi giới hoặc chủ nhà?",
  desc: "Đăng tin đúng chuẩn — được ưu tiên; sai lệch bị xử lý theo quy chế sàn.",
} as const;

export const PLATFORM_FOOTER_BLURB =
  "Sàn BĐS kiểm duyệt thông tin, xác minh theo quy trình — tài chính, thẩm định và nội thất trên cùng nền tảng." as const;
