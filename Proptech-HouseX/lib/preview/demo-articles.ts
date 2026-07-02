import type { ArticleCardData, ArticleDetail, ArticleTagSummary } from "@/lib/data/article-types";
import { applyEditorialMedia, EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { NOXH_TREND_ARTICLES_2026 } from "@/lib/content/articles/noxh-trend-series-2026";
import { TOD_NHON_TRACH_ARTICLES_2026 } from "@/lib/content/articles/tod-nhon-trach-series-2026";
import { LTK_PROJECT_SLUG } from "@/lib/preview/phu-tho-dmc-mock";
import { CS_PROJECT_SLUG } from "@/lib/preview/kdc-chang-song-mock";

const NOW = new Date("2026-06-29T00:00:00.000Z");

export const DEMO_ARTICLE_TAGS: ArticleTagSummary[] = [
  {
    slug: "noxh",
    name: "Nhà ở xã hội",
    description: "Chính sách, quy trình và cập nhật dự án NOXH.",
    articleCount: 3,
  },
  {
    slug: "phap-ly",
    name: "Pháp lý & chính sách",
    description: "Luật Nhà ở, điều kiện đối tượng và hồ sơ mua NOXH.",
    articleCount: 2,
  },
  {
    slug: "tien-do-du-an",
    name: "Tiến độ dự án",
    description: "Cập nhật giá bán, khởi công, bàn giao và mở hồ sơ.",
    articleCount: 2,
  },
  {
    slug: "dau-tu",
    name: "Kiến thức đầu tư",
    description: "Phân tích NOXH vs thương mại, dòng tiền và an cư.",
    articleCount: 1,
  },
  {
    slug: "goc-chuyen-gia",
    name: "Góc chuyên gia",
    description: "Nhận định thị trường và xu hướng nhà ở.",
    articleCount: 1,
  },
  {
    slug: "nha-o-xa-hoi-ly-thuong-kiet",
    name: "NOXH Lý Thường Kiệt",
    description: "Phú Thọ DMC — giá, tiến độ và hồ sơ đăng ký.",
    articleCount: 0,
  },
  {
    slug: "dta-happy-home-nhon-trach",
    name: "DTA Happy Home",
    description: "NOXH Nhơn Trạch — giá căn, vay và Block A10.",
    articleCount: 0,
  },
  {
    slug: "ha-tang-giao-thong",
    name: "Hạ tầng & giao thông",
    description: "Metro, đường sắt, cao tốc và kết nối vùng ven.",
    articleCount: 0,
  },
  {
    slug: "do-thi-ve-tinh-tod",
    name: "Đô thị vệ tinh & TOD",
    description: "Phát triển đô thị định hướng giao thông công cộng.",
    articleCount: 0,
  },
];

const DEMO_ARTICLES_RAW: ArticleDetail[] = [
  {
    id: "demo-article-ltk-gia",
    slug: "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026",
    title: "Giá nhà ở xã hội Lý Thường Kiệt công bố chính thức cuối 6/2026",
    excerpt:
      "Sở Xây dựng TP.HCM và CĐT công bố mức 23,25 triệu/m² — căn tham chiếu từ ~800 triệu đến ~1,8 tỷ tùy diện tích.",
    body: `Cuối tháng 6/2026, Sở Xây dựng TP.HCM và Công ty Cổ phần Đức Mạnh đã công bố phương án giá bán cho dự án Nhà ở xã hội Lý Thường Kiệt (tên thương mại Phú Thọ DMC) tại 324 Lý Thường Kiệt, Quận 10 — chi tiết trên [VnExpress](https://vnexpress.net/hai-du-an-nha-xa-hoi-noi-thanh-tp-hcm-co-gia-tu-23-trieu-va-35-trieu-mot-m2-5090748.html).

${EDITORIAL_FIGURES.ltkPhoiCanh}

Mức giá chính thức: 23.251.398 đồng/m², đã bao gồm VAT, chưa gồm 2% phí bảo trì và hệ số điều chỉnh theo vị trí căn hộ. Với diện tích 34,5–77 m², giá căn tham chiếu khoảng 800 triệu – 1,8 tỷ.

Dự án mở bán 755 căn NOXH; hơn 12.000 hồ sơ đăng ký từ các đợt rà soát trước. Công trình đang hoàn thiện cuối, dự kiến bàn giao khoảng tháng 8/2026.

Đọc thêm: [TP.HCM công bố giá 2 NOXH nội thành](/tin-tuc/tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc) · [So sánh với DTA Happy Home](/tin-tuc/so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026) · Trang dự án [/du-an/nha-o-xa-hoi-ly-thuong-kiet](/du-an/nha-o-xa-hoi-ly-thuong-kiet).

Người quan tâm cần đáp ứng điều kiện đối tượng NOXH theo Luật Nhà ở. [Đăng ký tư vấn hồ sơ](/lien-he) trên HouseX.`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-06-28T00:00:00.000Z"),
    updatedAt: NOW,
    coverImageUrl:
      "https://odt.vn/storage/03-2026/phu-tho-dmc-phoi-canh-1.jpg",
    authorName: "HouseX Biên tập",
    seoTitle: "Giá NOXH Lý Thường Kiệt 6/2026 — ~23,25 triệu/m²",
    seoDesc:
      "Công bố giá Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC): 23,25 tr/m², 755 căn bán, bàn giao 08/2026.",
    tags: [
      { slug: "noxh", name: "Nhà ở xã hội" },
      { slug: "tien-do-du-an", name: "Tiến độ dự án" },
      { slug: "nha-o-xa-hoi-ly-thuong-kiet", name: "NOXH Lý Thường Kiệt" },
    ],
    projects: [
      { slug: LTK_PROJECT_SLUG, name: "Nhà ở xã hội Lý Thường Kiệt" },
    ],
  },
  {
    id: "demo-article-cs-tiendo",
    slug: "tien-do-noxh-kdc-chang-song-phuoc-tan-2026",
    title: "Tiến độ NOXH KDC Chàng Sông Phước Tân — hạ tầng và móng",
    excerpt:
      "CĐT Hùng Cường đang san lấp, hoàn thiện HTKT nội khu; phối hợp địa phương rà soát đối tượng trước đợt đóng tiền 1.",
    body: `Dự án Nhà ở xã hội thuộc KDC Chàng Sông tại phường Phước Tân, TP. Biên Hòa do Công ty Cổ phần Hợp tác Quốc tế Hùng Cường phát triển đang ở giai đoạn đầu.

Theo cập nhật tháng 6/2026: công tác san lấp, hoàn thiện hạ tầng kỹ thuật nội khu và xây dựng phần móng đang được triển khai. Chủ đầu tư phối hợp với địa phương lập danh sách rà soát đối tượng ưu tiên trước khi công bố đóng tiền đợt 1.

Về pháp lý, dự án đã có quyết định phê duyệt báo cáo ĐTM và phê duyệt thiết kế kỹ thuật thi công. Giá bán và quy mô căn cụ thể sẽ được công bố khi mở đăng ký chính thức.

Khu vực Phước Tân thuộc vùng công nghiệp phía Nam Biên Hòa — phù hợp công nhân và người lao động an cư gần nơi làm việc.`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-06-25T00:00:00.000Z"),
    updatedAt: NOW,
    coverImageUrl:
      "https://khome.asia/wp-content/uploads/2025/12/nxh2-1.webp",
    authorName: "HouseX Biên tập",
    seoTitle: "Tiến độ NOXH KDC Chàng Sông Phước Tân 2026",
    seoDesc:
      "Cập nhật NOXH KDC Chàng Sông: san lấp, hạ tầng, móng. CĐT Hùng Cường — chưa công bố giá.",
    tags: [
      { slug: "noxh", name: "Nhà ở xã hội" },
      { slug: "tien-do-du-an", name: "Tiến độ dự án" },
    ],
    projects: [
      { slug: CS_PROJECT_SLUG, name: "Nhà ở xã hội KDC Chàng Sông" },
    ],
  },
  {
    id: "demo-article-noxh-dk",
    slug: "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
    title: "Ai được mua nhà ở xã hội năm 2026? — Tóm tắt điều kiện",
    excerpt:
      "Đối tượng thu nhập thấp, công nhân, CBCCVC và các nhóm theo Luật Nhà ở — điều kiện nhà ở và cư trú cần lưu ý.",
    body: `Nhà ở xã hội (NOXH) là loại hình nhà ở do Nhà nước có chính sách hỗ trợ, bán hoặc cho thuê với giá thấp hơn thị trường. Người mua phải thuộc nhóm đối tượng quy định và đáp ứng điều kiện về thu nhập, nhà ở và cư trú.

Các nhóm thường gặp: người thu nhập thấp tại đô thị; công nhân, lao động tại khu công nghiệp; cán bộ, công chức, viên chức; người có công với cách mạng; và một số trường hợp đặc thù theo Nghị định hướng dẫn Luật Nhà ở.

Hồ sơ đăng ký thường gồm: đơn đăng ký, giấy tờ chứng minh đối tượng, cam kết không sở hữu nhà ở hoặc diện tích nhà ở tối thiểu theo quy định, và giấy tờ cư trú tại địa phương (nếu dự án ưu tiên cư dân khu vực).

Mỗi dự án có thể có thêm tiêu chí ưu tiên (ví dụ hộ bị thu hồi đất, công nhân KCN). Nên theo dõi thông báo Sở Xây dựng và chủ đầu tư từng dự án cụ thể.`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-06-20T00:00:00.000Z"),
    updatedAt: NOW,
    coverImageUrl: null,
    authorName: "HouseX Biên tập",
    seoTitle: "Điều kiện mua nhà ở xã hội 2026 — Tóm tắt",
    seoDesc:
      "Ai được mua NOXH? Đối tượng, hồ sơ và lưu ý pháp lý theo Luật Nhà ở — cập nhật 2026.",
    tags: [
      { slug: "noxh", name: "Nhà ở xã hội" },
      { slug: "phap-ly", name: "Pháp lý & chính sách" },
      { slug: "goc-chuyen-gia", name: "Góc chuyên gia" },
    ],
    projects: [],
  },
  ...NOXH_TREND_ARTICLES_2026,
  ...TOD_NHON_TRACH_ARTICLES_2026,
];

const DEMO_ARTICLES: ArticleDetail[] = DEMO_ARTICLES_RAW.map(applyEditorialMedia);

function toCard(a: ArticleDetail): ArticleCardData {
  const { body: _b, seoTitle: _st, seoDesc: _sd, status: _s, ...card } = a;
  return card;
}

export function listDemoArticleCards(params: {
  page?: number;
  pageSize?: number;
  tagSlug?: string;
  projectSlug?: string;
} = {}): { items: ArticleCardData[]; total: number } {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 12;
  let filtered = DEMO_ARTICLES.filter((a) => a.status === "PUBLISHED");

  if (params.tagSlug) {
    filtered = filtered.filter((a) =>
      a.tags.some((t) => t.slug === params.tagSlug),
    );
  }
  if (params.projectSlug) {
    filtered = filtered.filter((a) =>
      a.projects.some((p) => p.slug === params.projectSlug),
    );
  }

  filtered.sort(
    (a, b) =>
      (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0),
  );

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize).map(toCard),
    total,
  };
}

export function getDemoArticleBySlug(slug: string): ArticleDetail | null {
  const a = DEMO_ARTICLES.find(
    (x) => x.slug === slug && x.status === "PUBLISHED",
  );
  return a ?? null;
}

export function getDemoArticlesForProject(
  projectSlug: string,
  limit = 6,
): ArticleCardData[] {
  return listDemoArticleCards({ projectSlug, pageSize: limit }).items;
}

export function getDemoTagBySlug(slug: string): ArticleTagSummary | null {
  const tag = DEMO_ARTICLE_TAGS.find((t) => t.slug === slug);
  if (!tag) return null;
  const count = DEMO_ARTICLES.filter(
    (a) =>
      a.status === "PUBLISHED" && a.tags.some((t) => t.slug === slug),
  ).length;
  return { ...tag, articleCount: count };
}

export function listDemoTags(): ArticleTagSummary[] {
  return DEMO_ARTICLE_TAGS.map((t) => {
    const count = DEMO_ARTICLES.filter(
      (a) =>
        a.status === "PUBLISHED" && a.tags.some((x) => x.slug === t.slug),
    ).length;
    return { ...t, articleCount: count };
  }).filter((t) => t.articleCount > 0);
}

/** Slugs dùng khi seed DB — đồng bộ với demo. */
export const SEED_ARTICLE_TAG_SLUGS = DEMO_ARTICLE_TAGS.map((t) => t.slug);
