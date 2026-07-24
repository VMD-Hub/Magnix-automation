import { articlePath } from "@/lib/content/article-routes";

/**
 * Pillar + 10 bài vệ tinh · funnel ToF/MoF/BoF · internal link map · CTA theo ý định.
 */

export const NOXH_LOAN_TOOL_60S = "/cong-cu/kiem-tra-vay-noxh" as const;

export const NOXH_LOAN_PILLAR = {
  slug: "tham-dinh-khoan-vay-mua-nha-o-xa-hoi",
  href: articlePath("tham-dinh-khoan-vay-mua-nha-o-xa-hoi"),
  title: "Thẩm định khoản vay mua nhà ở xã hội: Tự kiểm tra trước khi nộp hồ sơ",
} as const;

/** 10 bài vệ tinh — thứ tự xuất bản đề xuất trong content map. */
export const NOXH_LOAN_CLUSTER_SATELLITES = [
  {
    order: 1,
    slug: "kiem-tra-kha-nang-vay-noxh-60-giay",
    href: articlePath("kiem-tra-kha-nang-vay-noxh-60-giay"),
    title: "Kiểm tra nhanh thời hạn vay mua nhà ở xã hội",
    funnel: "tof" as const,
    keywords: [
      "kiểm tra khả năng vay mua nhà ở xã hội",
      "vay mua nhà ở xã hội trong 60 giây",
      "tự kiểm tra khả năng vay mua nhà",
    ],
  },
  {
    order: 2,
    slug: "mua-nha-o-xa-hoi-co-duoc-vay-ngan-hang-khong",
    href: articlePath("mua-nha-o-xa-hoi-co-duoc-vay-ngan-hang-khong"),
    title: "Mua nhà ở xã hội có được vay ngân hàng không? Điều kiện cần biết",
    funnel: "tof" as const,
    keywords: [
      "mua nhà ở xã hội có được vay ngân hàng không",
      "điều kiện vay mua nhà ở xã hội",
    ],
  },
  {
    order: 3,
    slug: "cach-tra-cic-an-toan-truoc-khi-vay",
    href: articlePath("cach-tra-cic-an-toan-truoc-khi-vay"),
    title: "Kiểm tra CIC an toàn: Người mua nhà cần biết trước khi vay",
    funnel: "tof" as const,
    keywords: ["cách kiểm tra CIC an toàn", "kiểm tra CIC trước khi vay"],
  },
  {
    order: 4,
    slug: "no-xau-nhom-2-vay-mua-nha-o-xa-hoi",
    href: articlePath("no-xau-nhom-2-vay-mua-nha-o-xa-hoi"),
    title: "Nợ xấu nhóm 2 có vay mua nhà ở xã hội được không?",
    funnel: "mof" as const,
    keywords: ["nợ xấu nhóm 2 có vay được không"],
  },
  {
    order: 5,
    slug: "dieu-kien-vay-noxh-theo-tuoi-hon-nhan",
    href: articlePath("dieu-kien-vay-noxh-theo-tuoi-hon-nhan"),
    title:
      "Cách tính tuổi vay mua nhà: Độc thân, đã kết hôn, có con nên lưu ý gì",
    funnel: "mof" as const,
    keywords: ["cách tính tuổi vay mua nhà", "tuổi vay mua nhà ở xã hội"],
  },
  {
    order: 6,
    slug: "vay-noxh-can-thu-nhap-bao-nhieu",
    href: articlePath("vay-noxh-can-thu-nhap-bao-nhieu"),
    title: "Vay mua nhà ở xã hội cần thu nhập bao nhiêu là phù hợp?",
    funnel: "mof" as const,
    keywords: [
      "vay mua nhà ở xã hội cần thu nhập bao nhiêu",
      "thu nhập để mua nhà ở xã hội",
    ],
  },
  {
    order: 7,
    slug: "ho-so-vay-mua-nha-o-xa-hoi",
    href: articlePath("ho-so-vay-mua-nha-o-xa-hoi"),
    title: "Hồ sơ vay mua nhà ở xã hội gồm những gì? Checklist đầy đủ",
    funnel: "bof" as const,
    keywords: ["hồ sơ vay mua nhà ở xã hội", "checklist hồ sơ vay nhà ở xã hội"],
  },
  {
    order: 8,
    slug: "checklist-truoc-khi-dat-coc-noxh",
    href: articlePath("checklist-truoc-khi-dat-coc-noxh"),
    title: "Đừng đặt cọc khi chưa kiểm tra khả năng vay mua nhà",
    funnel: "bof" as const,
    keywords: ["đặt cọc trước khi kiểm tra khả năng vay"],
  },
  {
    order: 9,
    slug: "sai-lam-tin-moi-gioi-chac-vay-noxh",
    href: articlePath("sai-lam-tin-moi-gioi-chac-vay-noxh"),
    title: "Sai lầm thường gặp khi tin môi giới nói “chắc chắn vay được”",
    funnel: "bof" as const,
    keywords: ["môi giới nói chắc chắn vay được có nên tin không"],
  },
  {
    order: 10,
    slug: "sai-lam-tai-chinh-tuong-du-tien-mua-nha",
    href: articlePath("sai-lam-tai-chinh-tuong-du-tien-mua-nha"),
    title:
      "Sai lầm tài chính cá nhân khiến bạn tưởng đủ tiền mua nhà nhưng thực ra chưa đủ",
    funnel: "bof" as const,
    keywords: [
      "sai lầm tài chính khi mua nhà",
      "mua nhà nhưng chưa đủ tiền",
    ],
  },
] as const;

/** Internal link map — slug → danh sách slug liên quan (theo content map §5). */
const RELATED_SLUGS: Record<string, readonly string[]> = {
  [NOXH_LOAN_PILLAR.slug]: [
    "cach-tra-cic-an-toan-truoc-khi-vay",
    "mua-nha-o-xa-hoi-co-duoc-vay-ngan-hang-khong",
    "ho-so-vay-mua-nha-o-xa-hoi",
    "checklist-truoc-khi-dat-coc-noxh",
    "no-xau-nhom-2-vay-mua-nha-o-xa-hoi",
    "kiem-tra-kha-nang-vay-noxh-60-giay",
    "dieu-kien-vay-noxh-theo-tuoi-hon-nhan",
    "vay-noxh-can-thu-nhap-bao-nhieu",
    "sai-lam-tin-moi-gioi-chac-vay-noxh",
    "sai-lam-tai-chinh-tuong-du-tien-mua-nha",
  ],
  "kiem-tra-kha-nang-vay-noxh-60-giay": [
    "mua-nha-o-xa-hoi-co-duoc-vay-ngan-hang-khong",
    "cach-tra-cic-an-toan-truoc-khi-vay",
    "ho-so-vay-mua-nha-o-xa-hoi",
    NOXH_LOAN_PILLAR.slug,
  ],
  "mua-nha-o-xa-hoi-co-duoc-vay-ngan-hang-khong": [
    "kiem-tra-kha-nang-vay-noxh-60-giay",
    "cach-tra-cic-an-toan-truoc-khi-vay",
    "no-xau-nhom-2-vay-mua-nha-o-xa-hoi",
    "ho-so-vay-mua-nha-o-xa-hoi",
  ],
  "cach-tra-cic-an-toan-truoc-khi-vay": [
    "no-xau-nhom-2-vay-mua-nha-o-xa-hoi",
    "sai-lam-tin-moi-gioi-chac-vay-noxh",
    "kiem-tra-kha-nang-vay-noxh-60-giay",
    NOXH_LOAN_PILLAR.slug,
  ],
  "no-xau-nhom-2-vay-mua-nha-o-xa-hoi": [
    "cach-tra-cic-an-toan-truoc-khi-vay",
    "mua-nha-o-xa-hoi-co-duoc-vay-ngan-hang-khong",
    "sai-lam-tin-moi-gioi-chac-vay-noxh",
  ],
  "dieu-kien-vay-noxh-theo-tuoi-hon-nhan": [
    "mua-nha-o-xa-hoi-co-duoc-vay-ngan-hang-khong",
    "ho-so-vay-mua-nha-o-xa-hoi",
    "kiem-tra-kha-nang-vay-noxh-60-giay",
  ],
  "ho-so-vay-mua-nha-o-xa-hoi": [
    "kiem-tra-kha-nang-vay-noxh-60-giay",
    "mua-nha-o-xa-hoi-co-duoc-vay-ngan-hang-khong",
    "dieu-kien-vay-noxh-theo-tuoi-hon-nhan",
    "vay-noxh-can-thu-nhap-bao-nhieu",
  ],
  "checklist-truoc-khi-dat-coc-noxh": [
    "kiem-tra-kha-nang-vay-noxh-60-giay",
    "cach-tra-cic-an-toan-truoc-khi-vay",
    "ho-so-vay-mua-nha-o-xa-hoi",
    "sai-lam-tin-moi-gioi-chac-vay-noxh",
  ],
  "vay-noxh-can-thu-nhap-bao-nhieu": [
    "mua-nha-o-xa-hoi-co-duoc-vay-ngan-hang-khong",
    "kiem-tra-kha-nang-vay-noxh-60-giay",
    "ho-so-vay-mua-nha-o-xa-hoi",
  ],
  "sai-lam-tin-moi-gioi-chac-vay-noxh": [
    "kiem-tra-kha-nang-vay-noxh-60-giay",
    "cach-tra-cic-an-toan-truoc-khi-vay",
    "checklist-truoc-khi-dat-coc-noxh",
    "sai-lam-tai-chinh-tuong-du-tien-mua-nha",
  ],
  "sai-lam-tai-chinh-tuong-du-tien-mua-nha": [
    "hieu-sai-mua-nha-dung-cho-du-tien",
    "kiem-tra-kha-nang-vay-noxh-60-giay",
    "vay-noxh-can-thu-nhap-bao-nhieu",
    "checklist-truoc-khi-dat-coc-noxh",
    NOXH_LOAN_PILLAR.slug,
  ],
  "hieu-sai-mua-nha-dung-cho-du-tien": [
    "sai-lam-tai-chinh-tuong-du-tien-mua-nha",
    "checklist-truoc-khi-dat-coc-noxh",
    NOXH_LOAN_PILLAR.slug,
    "vay-noxh-can-thu-nhap-bao-nhieu",
  ],
  /** Bài bổ sung — vợ/chồng đồng vay */
  "vay-noxh-vo-chong-dong-vay-cic": [
    "dieu-kien-vay-noxh-theo-tuoi-hon-nhan",
    "cach-tra-cic-an-toan-truoc-khi-vay",
    "vay-noxh-can-thu-nhap-bao-nhieu",
    NOXH_LOAN_PILLAR.slug,
  ],
};

/** CTA theo ý định — content map §7 */
const CTA_BY_SLUG: Record<string, { heading: string; primary: string; href: string }> = {
  "kiem-tra-kha-nang-vay-noxh-60-giay": {
    heading: "Bước tiếp theo",
    primary: "Kiểm tra nhanh thời hạn vay",
    href: NOXH_LOAN_TOOL_60S,
  },
  "mua-nha-o-xa-hoi-co-duoc-vay-ngan-hang-khong": {
    heading: "Bước tiếp theo",
    primary: "Xem điều kiện vay phù hợp",
    href: NOXH_LOAN_TOOL_60S,
  },
  "cach-tra-cic-an-toan-truoc-khi-vay": {
    heading: "Bước tiếp theo",
    primary: "Kiểm tra CIC an toàn",
    href: "https://creditconnect.vn/",
  },
  "ho-so-vay-mua-nha-o-xa-hoi": {
    heading: "Bước tiếp theo",
    primary: "Tải checklist hồ sơ — kiểm tra tuổi vay trước",
    href: NOXH_LOAN_TOOL_60S,
  },
  "checklist-truoc-khi-dat-coc-noxh": {
    heading: "Bước tiếp theo",
    primary: "Xem bạn có nên đặt cọc chưa",
    href: NOXH_LOAN_TOOL_60S,
  },
  "sai-lam-tai-chinh-tuong-du-tien-mua-nha": {
    heading: "Bước tiếp theo",
    primary: "Tự đánh giá sức mua nhà",
    href: "/cong-cu/tinh-han-muc-vay",
  },
};

const SLUG_TITLE = new Map<string, string>([
  [NOXH_LOAN_PILLAR.slug, NOXH_LOAN_PILLAR.title],
  ...NOXH_LOAN_CLUSTER_SATELLITES.map((a) => [a.slug, a.title] as const),
  [
    "vay-noxh-vo-chong-dong-vay-cic",
    "Vay NOXH khi đã kết hôn — đồng vay, CIC và chi phí hộ",
  ],
  [
    "hieu-sai-mua-nha-dung-cho-du-tien",
    "Mua nhà có cần “đủ tiền” không? 4 hiểu sai khiến người mua lần đầu đứng ngoài",
  ],
]);

function linkForSlug(slug: string): string {
  if (slug === NOXH_LOAN_PILLAR.slug) return NOXH_LOAN_PILLAR.href;
  return articlePath(slug);
}

function titleForSlug(slug: string): string {
  return SLUG_TITLE.get(slug) ?? slug;
}

/** Hub section cho pillar — funnel ToF / MoF / BoF */
export function noxhLoanClusterHubSection(): string {
  const byFunnel = (f: "tof" | "mof" | "bof") =>
    NOXH_LOAN_CLUSTER_SATELLITES.filter((a) => a.funnel === f);

  const row = (a: (typeof NOXH_LOAN_CLUSTER_SATELLITES)[number]) =>
    `- [${a.title}](${a.href})`;

  return `## Cụm bài thẩm định vay NOXH — đọc theo hành trình

Cụm nội dung này xoay quanh hành trình **trước khi vay mua nhà ở xã hội**: hiểu vấn đề → tự kiểm tra → chuẩn bị hồ sơ → tránh sai lầm. Bạn có thể bắt đầu từ [kiểm tra 60 giây](${NOXH_LOAN_TOOL_60S}) hoặc đọc tuần tự theo giai đoạn dưới đây.

### Giai đoạn 1 — Tạo nhu cầu và niềm tin (Top of funnel)

${byFunnel("tof").map(row).join("\n")}

### Giai đoạn 2 — Xử lý rủi ro thật (Middle of funnel)

${byFunnel("mof").map(row).join("\n")}

### Giai đoạn 3 & 4 — Chuẩn bị hồ sơ, tránh sai lầm (Bottom of funnel)

${byFunnel("bof").map(row).join("\n")}

**Công cụ hỗ trợ:** [Kiểm tra vay NOXH 60 giây](${NOXH_LOAN_TOOL_60S}) · [Tính hạn mức vay](/cong-cu/tinh-han-muc-vay) · [Kiểm tra điều kiện NOXH](/cong-cu/dieu-kien-noxh)`;
}

/** Block liên kết cuối bài — tối đa 3 bài, không lặp hub funnel. */
export function noxhLoanClusterRelatedSection(
  slug: string,
  maxLinks = 3,
): string {
  if (slug === NOXH_LOAN_PILLAR.slug) return "";

  const related = RELATED_SLUGS[slug];
  if (!related?.length) return "";

  const links = related
    .slice(0, maxLinks)
    .map((s) => `- [${titleForSlug(s)}](${linkForSlug(s)})`)
    .join("\n");

  return `## Bài liên quan

${links}`;
}

const CLOSING_BASE = `## Chuyên gia HouseX đồng hành rà soát miễn phí

Cần rà soát sâu hơn sau khi tự kiểm tra — [để lại thông tin](/lien-he). Chuyên gia nội bộ HouseX đồng hành miễn phí, **không cam kết duyệt vay**.`;

/** CTA + related + closing chuẩn cluster */
export function noxhLoanClusterClosing(slug: string): string {
  const related = noxhLoanClusterRelatedSection(slug);
  const cta = CTA_BY_SLUG[slug];
  const ctaBlock = cta
    ? `## ${cta.heading}

→ **[${cta.primary}](${cta.href})**`
    : "";

  const defaultTools =
    slug === NOXH_LOAN_PILLAR.slug
      ? `\n\nBắt đầu tự kiểm tra: [kiểm tra nhanh thời hạn vay](${NOXH_LOAN_TOOL_60S}) · [hạn mức vay](/cong-cu/tinh-han-muc-vay) · [điều kiện NOXH](/cong-cu/dieu-kien-noxh).`
      : slug !== "cach-tra-cic-an-toan-truoc-khi-vay" &&
          !CTA_BY_SLUG[slug]
        ? `\n\nTiếp tục tự kiểm tra: [kiểm tra nhanh thời hạn vay](${NOXH_LOAN_TOOL_60S}) · [hạn mức vay](/cong-cu/tinh-han-muc-vay).`
        : "";

  return [related, ctaBlock, CLOSING_BASE + defaultTools]
    .filter(Boolean)
    .join("\n\n");
}

/** Link list cho hub UI (tool landing, messaging) */
export function noxhLoanClusterArticleLinks(): ReadonlyArray<{
  href: string;
  label: string;
}> {
  return NOXH_LOAN_CLUSTER_SATELLITES.map((a) => ({
    href: a.href,
    label: a.title,
  }));
}
