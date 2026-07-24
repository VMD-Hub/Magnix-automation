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

/**
 * Dòng giải thích địa giới — giọng biên tập người, không dùng cụm AI kiểu
 * “còn tìm theo tên quen gọi”.
 * Ví dụ Tây Ninh: bao gồm Long An, Tây Ninh (cũ).
 */
export function buildNoxhProvinceAdminBoundaryLine(
  entry: NoxhProvinceEntry,
): string {
  if (entry.aliasesOld.length === 0) {
    return `Danh mục địa giới hành chính hiện hành — ${entry.nameNew}.`;
  }
  const included = [...entry.aliasesOld, `${entry.nameNew} (cũ)`].join(", ");
  return `Danh mục địa giới hành chính mới (bao gồm: ${included}).`;
}

export function buildNoxhProvinceHubDescription(
  entry: NoxhProvinceEntry,
): string {
  const boundary =
    entry.aliasesOld.length > 0
      ? ` ${buildNoxhProvinceAdminBoundaryLine(entry)}`
      : "";
  return normalizeSeoDescription(
    `Nhà ở xã hội ${entry.nameNew} trên House X: danh mục dự án, giá và điều kiện mua.${boundary} Tư vấn hồ sơ qua House X.`,
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
          text: `${buildNoxhProvinceAdminBoundaryLine(entry)} Trên House X, tìm ${entry.aliasesOld.join(" hoặc ")} vẫn ra đúng danh mục ${entry.nameNew} — vì các dự án thuộc địa giới hành chính mới này.`,
        },
      ],
    });
  }

  faqs.push({
    q: "Điều kiện mua nhà ở xã hội xem ở đâu?",
    blocks: [
      {
        type: "p",
        text: "Xem Wiki nhà ở xã hội trên House X: điều kiện, hồ sơ và quy trình theo văn bản công bố. Bạn nên tự kiểm tra sơ bộ trước, rồi mở từng dự án tại tỉnh này để xem giá và đăng ký tư vấn nếu cần.",
      },
    ],
  });

  faqs.push({
    q: "Xem danh mục dự án nhà ở xã hội toàn quốc ở đâu?",
    blocks: [
      {
        type: "p",
        text: "Mở danh mục dự án NOXH toàn quốc trên House X để xem mọi dự án. Các trang theo tỉnh (TP.HCM, Đồng Nai, Cần Thơ, Hà Nội, Đà Nẵng…) giúp bạn lọc đúng khu vực đang sống hoặc làm việc.",
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
