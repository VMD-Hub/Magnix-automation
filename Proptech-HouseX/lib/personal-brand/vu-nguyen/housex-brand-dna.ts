/**
 * DNA & định hướng House X — trang phụ từ danh thiếp Vũ Nguyễn (không SEO, không case).
 * Case minh họa → pipeline bài /tin-tuc trên website chính.
 */

import { HOUSEX_HERO_SLIDES } from "@/lib/brand/hero-assets";
import { BRAND_TAGLINE, BRAND_TAGLINE_HEADER } from "@/lib/content/messaging/brand";
import { TOOL_BRAND_IMAGES } from "@/lib/content/tool-brand-visuals";

export type BrandPillarCard = {
  step: "1" | "2" | "3";
  title: string;
  desc: string;
  image: {
    jpg: string;
    webp?: string;
    alt: string;
    objectPosition?: string;
  };
};

export const HOUSEX_BRAND_DNA_CARD = {
  tagline: BRAND_TAGLINE,
  header: BRAND_TAGLINE_HEADER,
  promise:
    "Nền tảng Proptech đặt người mua làm trung tâm — chuẩn hóa thông tin, hỗ trợ quyết định có căn cứ trước khi cam kết tài chính.",
  pillars: [
    {
      step: "1",
      title: "Smart Tools",
      desc: "Hệ công cụ số và nội dung chuẩn hóa — giúp người mua tự đánh giá điều kiện, dòng tiền và hồ sơ trước bước cam kết.",
      image: {
        jpg: TOOL_BRAND_IMAGES["finance-hub"].jpg,
        webp: TOOL_BRAND_IMAGES["finance-hub"].webp,
        alt: "Smart Tools — hệ công cụ số House X",
        objectPosition: "50% 45%",
      },
    },
    {
      step: "2",
      title: "Trusted Utility",
      desc: "Quy trình biên tập và đối chiếu pháp lý — thông tin được kiểm chứng, phù hợp tiêu chuẩn tin cậy của nền tảng.",
      image: {
        jpg: TOOL_BRAND_IMAGES["noxh-check"].jpg,
        webp: TOOL_BRAND_IMAGES["noxh-check"].webp,
        alt: "Trusted Utility — kiểm chứng và tiện ích đáng tin House X",
        objectPosition: "50% 45%",
      },
    },
    {
      step: "3",
      title: "Đồng hành an cư",
      desc: "Từ rà soát rủi ro đến hoàn tất thủ tục — một hệ sinh thái web, Mini App và đội ngũ chuyên môn.",
      image: {
        jpg: HOUSEX_HERO_SLIDES[1]!.jpg1280,
        webp: HOUSEX_HERO_SLIDES[1]!.webp1280,
        alt: "Đồng hành an cư — hành trình nhà ở House X",
        objectPosition: HOUSEX_HERO_SLIDES[1]!.objectPosition,
      },
    },
  ] satisfies readonly BrandPillarCard[],
  direction:
    "Định hướng dài hạn của House X là xây dựng nền tảng số tìm nhà Việt Nam: công nghệ phục vụ quyết định có căn cứ, tiện ích minh bạch xuyên suốt hành trình an cư — từ khám phá dự án nhà ở xã hội đến hoàn tất thủ tục.",
  exploreLinks: [
    {
      label: "Câu chuyện đầy đủ trên web",
      href: "/gioi-thieu/cau-chuyen",
      desc: "Hành trình hình thành thương hiệu",
    },
    {
      label: "Công cụ & dự án NOXH",
      href: "/cong-cu",
      desc: "Kiểm tra điều kiện, tính vay, catalog",
    },
    {
      label: "Về House X",
      href: "/gioi-thieu",
      desc: "Giới thiệu nền tảng",
    },
  ],
} as const;
