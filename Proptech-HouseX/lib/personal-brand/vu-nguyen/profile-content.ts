/**
 * Nội dung trang digital profile — Vũ Nguyễn (Lớp 3 Personal Brand).
 * Sub-project: docs/strategy/personal-brand/projects/vu-nguyen-profile/
 */

import { getContactFormIntentHref } from "@/lib/content/contact-form-routing";
import { getLegalEntityDisclosure } from "@/lib/content/legal-entity";
import {
  getSupportEmail,
  getSupportPhoneDisplay,
  getSupportPhoneTel,
  getSiteUrl,
} from "@/lib/site-config";

export const VU_NGUYEN_SLUG = "vu-nguyen" as const;

export const VU_NGUYEN_PROFILE_PATH = `/${VU_NGUYEN_SLUG}` as const;

/** Avatar mặc định — `public/brand/vu-nguyen/portrait.png` */
export const VU_NGUYEN_PORTRAIT_PATH = "/brand/vu-nguyen/portrait.png" as const;

/** Căn & phóng to trong vòng tròn h-28 — lấp kín, không lộ khung vuông. */
export const VU_NGUYEN_PORTRAIT_OBJECT_POSITION = "50% 22%";
export const VU_NGUYEN_PORTRAIT_SCALE = 1.28;

/** Nhãn trang DNA thương hiệu từ danh thiếp (không case). */
export const VU_NGUYEN_STORIES_LABEL = "Câu chuyện House X" as const;

/** Lời cảm ơn cuối danh thiếp — song ngữ, không thêm liên kết. */
export const VU_NGUYEN_THANK_YOU = {
  vi: "Cảm ơn bạn đã kết nối.",
  en: "Thank you for connecting.",
} as const;

/** Ghi chú dịch vụ — khẳng định cam kết, không phủ định trách nhiệm. */
export const VU_NGUYEN_SERVICE_NOTE =
  "Chia sẻ trên đây giúp bạn định hướng — mọi cam kết chính thức được ghi nhận trong hợp đồng dịch vụ liên quan." as const;

export function getVuNguyenProfileUrl(query?: Record<string, string>): string {
  const base = `${getSiteUrl()}${VU_NGUYEN_PROFILE_PATH}`;
  if (!query || Object.keys(query).length === 0) return base;
  const params = new URLSearchParams(query);
  return `${base}?${params.toString()}`;
}

export function getVuNguyenPortraitSrc(): string {
  const fromEnv = process.env.NEXT_PUBLIC_VU_NGUYEN_PORTRAIT_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : VU_NGUYEN_PORTRAIT_PATH;
}

export function getVuNguyenVideoUrl(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_VU_NGUYEN_VIDEO_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : null;
}

export function getVuNguyenZaloUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_VU_NGUYEN_ZALO_URL?.trim();
  if (fromEnv) return fromEnv;
  const tel = getSupportPhoneTel().replace(/\D/g, "");
  const local = tel.startsWith("+84") ? `0${tel.slice(3)}` : tel;
  return `https://zalo.me/${local}`;
}

export const VU_NGUYEN_PROFILE = {
  slug: VU_NGUYEN_SLUG,
  name: "Vũ Nguyễn",
  nameEn: "Vu Nguyen",
  initials: "VN",
  organizationRole: "Co-Founder · House X",
  jobTitle: "Luật sư · Cố vấn rủi ro pháp lý & tài chính đầu tư BĐS",
  tagline: "Rà soát rủi ro pháp lý trước khi bạn xuống tiền.",
  intro:
    "Đồng sáng lập House X. Đồng hành cùng bạn trên hành trình an cư — từ rà soát pháp lý và dòng tiền vay đến khi hoàn tất thủ tục.",
  reviewOffer: {
    title: "Rà soát 15 phút miễn phí",
    desc: "Dành cho người đang cân nhắm mua NOXH hoặc đầu tư BĐS — tập trung rủi ro sổ hồng, hợp đồng và dòng tiền.",
    href: getContactFormIntentHref("ra-soat-phap-ly-15-phut"),
  },
  processSteps: [
    {
      step: "1",
      title: "Rà soát rủi ro",
      desc: "Checklist pháp lý & tài chính trước khi quyết định xuống tiền.",
    },
    {
      step: "2",
      title: "Công cụ minh bạch",
      desc: "Kiểm tra điều kiện NOXH, tính khoản vay và hồ sơ rõ ràng trên nền tảng House X.",
    },
    {
      step: "3",
      title: "Hoàn tất thủ tục",
      desc: "Đàm phán, ký kết và nộp hồ sơ — một đầu mối phụ trách đến khi bàn giao.",
    },
  ],
  tools: [
    {
      label: "Kiểm tra điều kiện NOXH",
      href: "/cong-cu/dieu-kien-noxh",
      desc: "Sơ bộ đối tượng & hồ sơ",
    },
    {
      label: "Tính khoản vay",
      href: "/cong-cu/tinh-khoan-vay",
      desc: "Dòng tiền & lãi suất",
    },
    {
      label: "Liên hệ House X",
      href: "/lien-he",
      desc: "Gửi yêu cầu tư vấn",
    },
  ],
  knowsAbout: [
    "Rủi ro pháp lý bất động sản",
    "Nhà ở xã hội (NOXH)",
    "Tài chính mua nhà",
    "Đàm phán giao dịch BĐS",
  ],
  disclaimer: VU_NGUYEN_SERVICE_NOTE,
  legalDisclosure: getLegalEntityDisclosure().vi,
  contact: {
    email: getSupportEmail(),
    phoneDisplay: getSupportPhoneDisplay(),
    phoneTel: getSupportPhoneTel(),
    zaloUrl: "", // filled at runtime via getVuNguyenZaloUrl()
  },
  seo: {
    title: "Vũ Nguyễn — Co-Founder House X · Cố vấn pháp lý & tài chính BĐS",
    description:
      "Luật sư Vũ Nguyễn — Co-Founder House X. Rà soát rủi ro pháp lý và tài chính trước khi xuống tiền mua nhà. Đặt lịch tư vấn 15 phút.",
  },
} as const;

export function getVuNguyenProfile() {
  return {
    ...VU_NGUYEN_PROFILE,
    contact: {
      ...VU_NGUYEN_PROFILE.contact,
      zaloUrl: getVuNguyenZaloUrl(),
    },
  };
}
