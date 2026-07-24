import type { Metadata } from "next";
import type { RichFaqItem } from "@/lib/content/faq-content";
import {
  getNoxhProvinceBySlug,
  listNoxhProvinceHubsEnabled,
  NOXH_PROVINCE_HUB_BASE,
  noxhProvinceHubPath,
  type NoxhProvinceEntry,
} from "@/lib/content/noxh-province-registry";
import { normalizeSeoDescription } from "@/lib/seo/meta-text";
import { getSiteUrl } from "@/lib/site-config";

export function resolveNoxhProvinceHubEntry(
  slug: string,
): NoxhProvinceEntry | undefined {
  const entry = getNoxhProvinceBySlug(slug);
  if (!entry?.hubEnabled) return undefined;
  return entry;
}

export function buildNoxhProvinceHubTitle(entry: NoxhProvinceEntry): string {
  return `Nhà ở xã hội ${entry.nameNew} — danh mục dự án trên House X`;
}

export function buildNoxhProvinceHubDescription(
  entry: NoxhProvinceEntry,
): string {
  const aliases =
    entry.aliasesOld.length > 0
      ? ` Gồm khu vực quen gọi ${entry.aliasesOld.join(", ")}.`
      : "";
  return normalizeSeoDescription(
    `Nhà ở xã hội ${entry.nameNew} mới nhất 2026 trên House X: danh mục dự án, giá và điều kiện mua.${aliases} Tư vấn hồ sơ qua House X.`,
  );
}

export function buildNoxhProvinceHubMetadata(
  entry: NoxhProvinceEntry,
  page: number,
): Metadata {
  const path = noxhProvinceHubPath(entry.slug);
  const canonical =
    page > 1
      ? `${getSiteUrl()}${path}?page=${page}`
      : `${getSiteUrl()}${path}`;

  return {
    title: buildNoxhProvinceHubTitle(entry),
    description: buildNoxhProvinceHubDescription(entry),
    alternates: { canonical },
  };
}

/** FAQ alias địa giới — không lộ salesRegion. */
export function buildNoxhProvinceHubFaqs(
  entry: NoxhProvinceEntry,
): RichFaqItem[] {
  const faqs: RichFaqItem[] = [
    {
      q: `Nhà ở xã hội ${entry.nameNew} có những dự án nào trên House X?`,
      blocks: [
        {
          type: "p",
          text: `Trang này liệt kê các dự án nhà ở xã hội tại ${entry.nameNew}. Chọn dự án để xem giá, mặt bằng, điều kiện mua và đăng ký tư vấn trên House X.`,
        },
      ],
    },
  ];

  if (entry.aliasesOld.length > 0) {
    const primaryAlias = entry.aliasesOld[0];
    faqs.push({
      q: `Tìm nhà ở xã hội ${primaryAlias} còn đúng không?`,
      blocks: [
        {
          type: "p",
          text: `Tên quen gọi như ${entry.aliasesOld.join(", ")} vẫn dùng để tìm kiếm. Theo đơn vị hành chính hiện hành, các khu vực này thuộc ${entry.nameNew}. House X giữ cả tên mới và tên quen gọi để bạn không bỏ lỡ dự án.`,
        },
      ],
    });
  }

  faqs.push({
    q: "Điều kiện mua nhà ở xã hội xem ở đâu?",
    blocks: [
      {
        type: "p",
        text: "Trên House X có hướng dẫn nhà ở xã hội: điều kiện, hồ sơ và quy trình theo văn bản công bố. Bạn nên tự kiểm tra sơ bộ trước, rồi mở từng dự án tại tỉnh này để xem giá và đăng ký tư vấn nếu cần.",
      },
    ],
  });

  faqs.push({
    q: "Xem tất cả dự án nhà ở xã hội trên House X ở đâu?",
    blocks: [
      {
        type: "p",
        text: "Mở danh mục nhà ở xã hội toàn quốc trên House X để xem mọi dự án. Các trang theo tỉnh (TP.HCM, Đồng Nai, Hà Nội, Đà Nẵng…) giúp bạn lọc đúng khu vực đang sống hoặc làm việc.",
      },
    ],
  });

  return faqs;
}

export function noxhProvinceHubPageHref(
  slug: string,
  page: number,
): string {
  const base = noxhProvinceHubPath(slug);
  return page > 1 ? `${base}?page=${page}` : base;
}

export {
  listNoxhProvinceHubsEnabled,
  noxhProvinceHubPath,
  NOXH_PROVINCE_HUB_BASE,
};
