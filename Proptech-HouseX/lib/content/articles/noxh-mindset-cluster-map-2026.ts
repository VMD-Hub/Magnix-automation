/**
 * SEO content map — cụm **định hướng nhận thức** chọn NOXH 2026.
 * Mục tiêu: chuyển đổi qua thay đổi góc nhìn — không dẫn dắt ép buộc.
 * Bài vệ tinh được thêm dần vào `noxh-mindset-series-2026.ts` khi có copy đầy đủ.
 */

export const NOXH_MINDSET_TAG = {
  slug: "chon-noxh-dung-cach",
  name: "Chọn NOXH đúng cách",
} as const;

export const NOXH_MINDSET_PILLAR = {
  slug: "chon-noxh-dung-cach-theo-nang-luc",
  href: "/tin-tuc/chon-noxh-dung-cach-theo-nang-luc",
  title:
    "Chọn nhà ở xã hội đúng cách: Đừng mua theo cảm xúc, hãy mua theo năng lực và nhu cầu thật",
} as const;

/** 5 niềm tin mới — lặp trong copy cluster */
export const NOXH_MINDSET_CORE_BELIEFS = [
  {
    id: "total-cost",
    headline: "Giá bán không phải là toàn bộ chi phí",
    detail:
      "Trả nợ, đi lại, sinh hoạt, nội thất và quỹ dự phòng đều là phần của quyết định.",
  },
  {
    id: "center-not-always",
    headline: "Gần trung tâm không phải lúc nào cũng tốt hơn",
    detail:
      "Vị trí đẹp nhưng tài chính quá căng có thể thành áp lực sống kéo dài.",
  },
  {
    id: "connectivity",
    headline: "Xa hơn nhưng kết nối tốt có thể là lựa chọn thông minh hơn",
    detail:
      "Đi lại nhanh, hạ tầng ổn và giá hợp lý — xa không còn là bất lợi tuyệt đối.",
  },
  {
    id: "hot-not-fit",
    headline: "Dự án hot không đồng nghĩa với dự án phù hợp",
    detail: "Hot tạo cảm giác khan hiếm; người mua thật cần sự bền vững.",
  },
  {
    id: "slow-right",
    headline: "Mua nhà là quyết định tài chính dài hạn, không phải phản xạ chốt nhanh",
    detail: "Chậm một tuần để kiểm tra kỹ còn tốt hơn vội một ngày rồi mắc kẹt nhiều năm.",
  },
] as const;

/** Thông điệp trung tâm — dùng trong excerpt, kết bài, CTA mềm */
export const NOXH_MINDSET_CORE_MESSAGES = [
  "Chọn nhà đúng không phải là chọn căn hot nhất.",
  "Ngôi nhà tốt nhất là ngôi nhà phù hợp với đời sống của bạn.",
  "Giá rẻ hơn nhưng sống bền vững hơn thường là lựa chọn thông minh hơn.",
  "Nhà ở xã hội là để an cư, không phải để chạy theo cảm xúc nhất thời.",
  "Quyết định chậm một chút nhưng đúng thường tốt hơn mua nhanh rồi căng nhiều năm.",
] as const;

export type MindsetLayer = "illusion" | "standards" | "compare" | "action";
export type MindsetPsychStep = "pulled" | "real-cost" | "new-standard" | "safe-decision";

/** 15 bài vệ tinh publish (#4, #10 đã bỏ). Lớp 2: #8, #15, #16, #17. */
export const NOXH_MINDSET_CLUSTER_SATELLITES = [
  {
    order: 1,
    slug: "vi-sao-mua-nha-sai-vi-chay-theo-do-hot",
    title: "Vì sao nhiều người mua nhà sai chỉ vì chạy theo độ hot?",
    layer: "illusion" as const,
    psychStep: "pulled" as const,
    keywords: ["mua nhà theo độ hot", "dự án NOXH hot"],
    status: "published" as const,
  },
  {
    order: 2,
    slug: "gan-trung-tam-chua-chac-tot-nhat-noxh",
    title:
      "Gần trung tâm chưa chắc đã là lựa chọn tốt nhất cho người mua nhà ở xã hội",
    layer: "illusion" as const,
    psychStep: "new-standard" as const,
    keywords: ["mua NOXH gần trung tâm", "vị trí mua nhà ở xã hội"],
    status: "published" as const,
  },
  {
    order: 3,
    slug: "xa-hon-nhung-di-nhanh-hon-khi-nao-khon-ngoan",
    title: "Xa hơn nhưng đi nhanh hơn: Khi nào đó là lựa chọn khôn ngoan?",
    layer: "compare" as const,
    psychStep: "new-standard" as const,
    keywords: ["NOXH xa trung tâm", "kết nối giao thông NOXH"],
    status: "published" as const,
  },
  {
    order: 5,
    slug: "du-an-hot-suat-nhanh-vi-tri-dep-mat-tinh-tao",
    title:
      "Dự án hot, suất nhanh, vị trí đẹp: Ba yếu tố dễ làm người mua mất tỉnh táo",
    layer: "illusion" as const,
    psychStep: "pulled" as const,
    keywords: ["sợ mất suất NOXH", "mua nhà vội vàng"],
    status: "published" as const,
  },
  {
    order: 6,
    slug: "khi-nao-chon-du-an-hop-tui-tien",
    title: "Khi nào nên chọn dự án hợp túi tiền thay vì dự án ai cũng săn?",
    layer: "compare" as const,
    psychStep: "safe-decision" as const,
    keywords: ["chọn dự án NOXH hợp túi tiền"],
    status: "published" as const,
  },
  {
    order: 7,
    slug: "chon-nha-de-o-khac-chon-nha-giu-suat",
    title: "Chọn nhà để ở khác gì chọn nhà để giữ suất hoặc đầu tư?",
    layer: "compare" as const,
    psychStep: "new-standard" as const,
    keywords: ["mua NOXH để ở", "an cư NOXH"],
    status: "published" as const,
  },
  {
    order: 8,
    slug: "ba-tieu-chuan-moi-chon-noxh",
    title: "3 tiêu chuẩn mới người mua nhà ở xã hội nên dùng để ra quyết định",
    layer: "standards" as const,
    psychStep: "new-standard" as const,
    keywords: ["tiêu chuẩn chọn nhà ở xã hội"],
    status: "published" as const,
  },
  {
    order: 9,
    slug: "checklist-chot-mua-noxh-tai-chinh-ha-tang-cic",
    title:
      "Checklist trước khi chốt mua: Tài chính, hạ tầng, CIC và quỹ dự phòng",
    layer: "action" as const,
    psychStep: "safe-decision" as const,
    keywords: ["checklist mua NOXH", "kiểm tra trước khi mua nhà ở xã hội"],
    status: "published" as const,
  },
  {
    order: 11,
    slug: "nha-xa-ket-noi-tot-dang-mua-hon",
    title: "Tại sao nhà xa hơn nhưng kết nối tốt có thể đáng mua hơn?",
    layer: "compare" as const,
    psychStep: "safe-decision" as const,
    keywords: ["NOXH vùng ven", "hạ tầng NOXH"],
    status: "published" as const,
  },
  {
    order: 12,
    slug: "dung-mua-vi-so-mat-co-hoi",
    title: "Đừng mua vì sợ mất cơ hội: cách ra quyết định bình tĩnh hơn",
    layer: "illusion" as const,
    psychStep: "pulled" as const,
    keywords: ["FOMO mua nhà", "sợ mất suất NOXH"],
    status: "published" as const,
  },
  {
    order: 13,
    slug: "vung-ven-khong-xau-khong-gian-song-noxh",
    title:
      "Vùng ven không xấu: Khi nhà ở xã hội cho bạn không gian sống đáng giá hơn",
    layer: "compare" as const,
    psychStep: "new-standard" as const,
    keywords: ["NOXH vùng ven", "không gian sống NOXH", "mua nhà vùng ven"],
    status: "published" as const,
  },
  {
    order: 14,
    slug: "lam-sao-khong-bi-roi-khi-tim-mua-noxh",
    title: "Làm sao để không bị rối khi tìm mua nhà ở xã hội?",
    layer: "action" as const,
    psychStep: "safe-decision" as const,
    keywords: [
      "tìm mua nhà ở xã hội",
      "tổng kho NOXH",
      "HouseX nhà ở xã hội",
    ],
    status: "published" as const,
  },
  {
    order: 15,
    slug: "chi-phi-an-sau-khi-xuong-tien-mua-noxh",
    title:
      "Mua nhà không chỉ trả tiền nhà: những chi phí ẩn sau khi xuống tiền",
    layer: "standards" as const,
    psychStep: "real-cost" as const,
    keywords: [
      "chi phí ẩn mua nhà",
      "tổng chi phí sở hữu NOXH",
      "chi phí sau khi mua nhà",
    ],
    status: "published" as const,
  },
  {
    order: 16,
    slug: "30-phut-di-chuyen-co-phai-mat-mat-noxh",
    title: "30 phút di chuyển có thật sự là mất mát?",
    layer: "standards" as const,
    psychStep: "new-standard" as const,
    keywords: [
      "chi phí thời gian đi làm",
      "NOXH xa trung tâm",
      "30 phút di chuyển",
    ],
    status: "published" as const,
  },
  {
    order: 17,
    slug: "dta-happy-home-nhon-trach-noi-o-de-so-huu",
    title:
      "DTA Happy Home Nhơn Trạch: chọn một nơi ở dễ sở hữu, dễ sống và có dư địa phát triển",
    layer: "standards" as const,
    psychStep: "new-standard" as const,
    keywords: [
      "DTA Happy Home Nhơn Trạch",
      "NOXH Nhơn Trạch",
      "mua NOXH vùng ven",
    ],
    status: "published" as const,
  },
] as const;

/**
 * Luồng đọc gợi ý:
 * … → #8 ba tiêu chuẩn → **Lớp 2** (#15 → #16 → #17 ví dụ DTA) → #9 checklist → **#14 HouseX**.
 */
export const NOXH_MINDSET_JOURNEY_END = {
  afterChecklistSlug: "checklist-chot-mua-noxh-tai-chinh-ha-tang-cic",
  endpointSlug: "lam-sao-khong-bi-roi-khi-tim-mua-noxh",
  endpointHref: "/tin-tuc/lam-sao-khong-bi-roi-khi-tim-mua-noxh",
} as const;

/** Liên kết sang cụm thẩm định vay — lớp 4 hành động */
export const NOXH_MINDSET_ACTION_LINKS = {
  loanPillar: "/tin-tuc/tham-dinh-khoan-vay-mua-nha-o-xa-hoi",
  check60s: "/cong-cu/kiem-tra-vay-noxh",
  check60sArticle: "/tin-tuc/kiem-tra-kha-nang-vay-noxh-60-giay",
  hanMucVay: "/cong-cu/tinh-han-muc-vay",
  dieuKienNoxh: "/cong-cu/dieu-kien-noxh",
  cic: "/tin-tuc/cach-tra-cic-an-toan-truoc-khi-vay",
  datCoc: "/tin-tuc/checklist-truoc-khi-dat-coc-noxh",
  taiChinhCaNhan: "/tin-tuc/sai-lam-tai-chinh-tuong-du-tien-mua-nha",
  lienHe: "/lien-he",
  duAnNoxh: "/du-an?projectType=NHA_O_XA_HOI",
  dtaHappyHome: "/du-an/dta-happy-home-nhon-trach",
} as const;

const LAYER_LABEL: Record<MindsetLayer, string> = {
  illusion: "Tránh chọn theo cảm xúc và áp lực thị trường",
  standards: "Chọn theo nhu cầu và năng lực thật",
  compare: "So sánh vị trí, chi phí và phương án hợp lý",
  action: "Kiểm tra trước khi quyết",
};

const SLUG_META = new Map(
  NOXH_MINDSET_CLUSTER_SATELLITES.map((a) => [a.slug, a] as const),
);

function hrefForSlug(slug: string): string {
  return `/tin-tuc/${slug}`;
}

/** Hub trên pillar — chỉ link bài đã publish (truyền slugSet) */
export function noxhMindsetClusterHubSection(
  publishedSlugs: ReadonlySet<string> = new Set(),
): string {
  const layers: MindsetLayer[] = ["illusion", "standards", "compare", "action"];

  const sections = layers.map((layer) => {
    const articles = NOXH_MINDSET_CLUSTER_SATELLITES.filter(
      (a) => a.layer === layer,
    );
    const rows = articles
      .map((a) => {
        if (publishedSlugs.has(a.slug)) {
          return `- [${a.title}](${hrefForSlug(a.slug)})`;
        }
        return `- ${a.title} *(sắp cập nhật)*`;
      })
      .join("\n");
    return `### ${LAYER_LABEL[layer]}\n\n${rows}`;
  });

  return `## Các bài liên quan chủ đề chọn NOXH đúng cách

HouseX tổng hợp các bài hướng dẫn giúp bạn **tự đối chiếu thông tin** trước khi quyết định — hỗ trợ chọn theo năng lực và nhu cầu ở thật.

${sections.join("\n\n")}

**Khi cần kiểm tra hồ sơ và khả năng vay:**

- [Thẩm định vay NOXH](${NOXH_MINDSET_ACTION_LINKS.loanPillar})
- [Kiểm tra vay trong 60 giây](${NOXH_MINDSET_ACTION_LINKS.check60s})
- [Điều kiện mua NOXH](${NOXH_MINDSET_ACTION_LINKS.dieuKienNoxh})`;
}

/** Internal link map — bổ sung dần khi publish từng bài */
const RELATED_SLUGS: Record<string, readonly string[]> = {
  [NOXH_MINDSET_PILLAR.slug]: [
    "vi-sao-mua-nha-sai-vi-chay-theo-do-hot",
    "du-an-hot-suat-nhanh-vi-tri-dep-mat-tinh-tao",
    "dung-mua-vi-so-mat-co-hoi",
    "gan-trung-tam-chua-chac-tot-nhat-noxh",
    "xa-hon-nhung-di-nhanh-hon-khi-nao-khon-ngoan",
    "nha-xa-ket-noi-tot-dang-mua-hon",
    "vung-ven-khong-xau-khong-gian-song-noxh",
    "khi-nao-chon-du-an-hop-tui-tien",
    "chon-nha-de-o-khac-chon-nha-giu-suat",
    "ba-tieu-chuan-moi-chon-noxh",
    "chi-phi-an-sau-khi-xuong-tien-mua-noxh",
    "30-phut-di-chuyen-co-phai-mat-mat-noxh",
    "dta-happy-home-nhon-trach-noi-o-de-so-huu",
    "checklist-chot-mua-noxh-tai-chinh-ha-tang-cic",
    "lam-sao-khong-bi-roi-khi-tim-mua-noxh",
  ],
  "vi-sao-mua-nha-sai-vi-chay-theo-do-hot": [
    NOXH_MINDSET_PILLAR.slug,
    "du-an-hot-suat-nhanh-vi-tri-dep-mat-tinh-tao",
    "dung-mua-vi-so-mat-co-hoi",
    "checklist-chot-mua-noxh-tai-chinh-ha-tang-cic",
  ],
  "du-an-hot-suat-nhanh-vi-tri-dep-mat-tinh-tao": [
    NOXH_MINDSET_PILLAR.slug,
    "vi-sao-mua-nha-sai-vi-chay-theo-do-hot",
    "dung-mua-vi-so-mat-co-hoi",
    "gan-trung-tam-chua-chac-tot-nhat-noxh",
  ],
  "dung-mua-vi-so-mat-co-hoi": [
    NOXH_MINDSET_PILLAR.slug,
    "vi-sao-mua-nha-sai-vi-chay-theo-do-hot",
    "du-an-hot-suat-nhanh-vi-tri-dep-mat-tinh-tao",
    "checklist-chot-mua-noxh-tai-chinh-ha-tang-cic",
  ],
  "gan-trung-tam-chua-chac-tot-nhat-noxh": [
    NOXH_MINDSET_PILLAR.slug,
    "xa-hon-nhung-di-nhanh-hon-khi-nao-khon-ngoan",
    "ba-tieu-chuan-moi-chon-noxh",
    "du-an-hot-suat-nhanh-vi-tri-dep-mat-tinh-tao",
  ],
  "xa-hon-nhung-di-nhanh-hon-khi-nao-khon-ngoan": [
    NOXH_MINDSET_PILLAR.slug,
    "gan-trung-tam-chua-chac-tot-nhat-noxh",
    "nha-xa-ket-noi-tot-dang-mua-hon",
    "khi-nao-chon-du-an-hop-tui-tien",
  ],
  "nha-xa-ket-noi-tot-dang-mua-hon": [
    NOXH_MINDSET_PILLAR.slug,
    "gan-trung-tam-chua-chac-tot-nhat-noxh",
    "xa-hon-nhung-di-nhanh-hon-khi-nao-khon-ngoan",
    "vung-ven-khong-xau-khong-gian-song-noxh",
  ],
  "vung-ven-khong-xau-khong-gian-song-noxh": [
    NOXH_MINDSET_PILLAR.slug,
    "nha-xa-ket-noi-tot-dang-mua-hon",
    "xa-hon-nhung-di-nhanh-hon-khi-nao-khon-ngoan",
    "khi-nao-chon-du-an-hop-tui-tien",
  ],
  "khi-nao-chon-du-an-hop-tui-tien": [
    NOXH_MINDSET_PILLAR.slug,
    "chon-nha-de-o-khac-chon-nha-giu-suat",
    "du-an-hot-suat-nhanh-vi-tri-dep-mat-tinh-tao",
    "dung-mua-vi-so-mat-co-hoi",
  ],
  "chon-nha-de-o-khac-chon-nha-giu-suat": [
    NOXH_MINDSET_PILLAR.slug,
    "ba-tieu-chuan-moi-chon-noxh",
    "khi-nao-chon-du-an-hop-tui-tien",
    "dung-mua-vi-so-mat-co-hoi",
  ],
  "ba-tieu-chuan-moi-chon-noxh": [
    NOXH_MINDSET_PILLAR.slug,
    "chi-phi-an-sau-khi-xuong-tien-mua-noxh",
    "checklist-chot-mua-noxh-tai-chinh-ha-tang-cic",
    "chon-nha-de-o-khac-chon-nha-giu-suat",
  ],
  "chi-phi-an-sau-khi-xuong-tien-mua-noxh": [
    NOXH_MINDSET_PILLAR.slug,
    "ba-tieu-chuan-moi-chon-noxh",
    "30-phut-di-chuyen-co-phai-mat-mat-noxh",
    "dta-happy-home-nhon-trach-noi-o-de-so-huu",
  ],
  "30-phut-di-chuyen-co-phai-mat-mat-noxh": [
    NOXH_MINDSET_PILLAR.slug,
    "chi-phi-an-sau-khi-xuong-tien-mua-noxh",
    "dta-happy-home-nhon-trach-noi-o-de-so-huu",
    "nha-xa-ket-noi-tot-dang-mua-hon",
  ],
  "dta-happy-home-nhon-trach-noi-o-de-so-huu": [
    NOXH_MINDSET_PILLAR.slug,
    "30-phut-di-chuyen-co-phai-mat-mat-noxh",
    "vung-ven-khong-xau-khong-gian-song-noxh",
    "khi-nao-chon-du-an-hop-tui-tien",
  ],
  "checklist-chot-mua-noxh-tai-chinh-ha-tang-cic": [
    NOXH_MINDSET_PILLAR.slug,
    "dta-happy-home-nhon-trach-noi-o-de-so-huu",
    "30-phut-di-chuyen-co-phai-mat-mat-noxh",
    "lam-sao-khong-bi-roi-khi-tim-mua-noxh",
  ],
  "lam-sao-khong-bi-roi-khi-tim-mua-noxh": [
    NOXH_MINDSET_PILLAR.slug,
    "checklist-chot-mua-noxh-tai-chinh-ha-tang-cic",
    "ba-tieu-chuan-moi-chon-noxh",
    "khi-nao-chon-du-an-hop-tui-tien",
  ],
};

const CTA_BY_SLUG: Record<string, { label: string; href: string }> = {
  [NOXH_MINDSET_PILLAR.slug]: {
    label: "Tự kiểm tra năng lực trước khi chọn căn",
    href: NOXH_MINDSET_ACTION_LINKS.check60s,
  },
  "vi-sao-mua-nha-sai-vi-chay-theo-do-hot": {
    label: "Kiểm tra hồ sơ trước khi chốt vì “hot”",
    href: NOXH_MINDSET_ACTION_LINKS.check60s,
  },
  "du-an-hot-suat-nhanh-vi-tri-dep-mat-tinh-tao": {
    label: "Giữ tỉnh táo — kiểm tra tài chính trước khi giữ suất",
    href: NOXH_MINDSET_ACTION_LINKS.check60s,
  },
  "dung-mua-vi-so-mat-co-hoi": {
    label: "Bình tĩnh trước — kiểm tra hồ sơ trước khi cọc",
    href: NOXH_MINDSET_ACTION_LINKS.check60s,
  },
  "gan-trung-tam-chua-chac-tot-nhat-noxh": {
    label: "So sánh áp lực tài chính — không chỉ nhìn km",
    href: NOXH_MINDSET_ACTION_LINKS.hanMucVay,
  },
  "xa-hon-nhung-di-nhanh-hon-khi-nao-khon-ngoan": {
    label: "So sánh chi phí & thời gian đi lại thực tế",
    href: NOXH_MINDSET_ACTION_LINKS.hanMucVay,
  },
  "nha-xa-ket-noi-tot-dang-mua-hon": {
    label: "Đánh giá chi phí sống & kết nối thực tế",
    href: NOXH_MINDSET_ACTION_LINKS.hanMucVay,
  },
  "vung-ven-khong-xau-khong-gian-song-noxh": {
    label: "So sánh phương án vùng ven — theo năng lực thật",
    href: NOXH_MINDSET_ACTION_LINKS.hanMucVay,
  },
  "khi-nao-chon-du-an-hop-tui-tien": {
    label: "Kiểm tra dự án có thật sự vừa sức không",
    href: NOXH_MINDSET_ACTION_LINKS.hanMucVay,
  },
  "chon-nha-de-o-khac-chon-nha-giu-suat": {
    label: "Mua để ở thật — kiểm tra năng lực trước",
    href: NOXH_MINDSET_ACTION_LINKS.check60s,
  },
  "ba-tieu-chuan-moi-chon-noxh": {
    label: "Áp dụng 3 tiêu chuẩn — kiểm tra tài chính trước",
    href: NOXH_MINDSET_ACTION_LINKS.check60s,
  },
  "chi-phi-an-sau-khi-xuong-tien-mua-noxh": {
    label: "Tính tổng chi phí thật — không chỉ giá bán",
    href: NOXH_MINDSET_ACTION_LINKS.hanMucVay,
  },
  "30-phut-di-chuyen-co-phai-mat-mat-noxh": {
    label: "So sánh áp lực sở hữu — không chỉ số phút đi lại",
    href: NOXH_MINDSET_ACTION_LINKS.hanMucVay,
  },
  "dta-happy-home-nhon-trach-noi-o-de-so-huu": {
    label: "Xem DTA Happy Home Nhơn Trạch trên HouseX",
    href: NOXH_MINDSET_ACTION_LINKS.dtaHappyHome,
  },
  "checklist-chot-mua-noxh-tai-chinh-ha-tang-cic": {
    label: "Chạy checklist 4 điểm — bắt đầu kiểm tra 60 giây",
    href: NOXH_MINDSET_ACTION_LINKS.check60s,
  },
  "lam-sao-khong-bi-roi-khi-tim-mua-noxh": {
    label: "Xem dự án nhà ở xã hội trên HouseX",
    href: NOXH_MINDSET_ACTION_LINKS.duAnNoxh,
  },
};

export function noxhMindsetClusterRelatedSection(
  slug: string,
  publishedSlugs: ReadonlySet<string>,
): string {
  const related = RELATED_SLUGS[slug];
  if (!related?.length) return "";

  const links = related
    .filter((s) => publishedSlugs.has(s))
    .map((s) => {
      const meta = SLUG_META.get(s);
      const title = meta?.title ?? s;
      const blurb = NOXH_MINDSET_RELATED_BLURBS[slug]?.[s];
      return blurb
        ? `- [${title}](${hrefForSlug(s)}) — ${blurb}`
        : `- [${title}](${hrefForSlug(s)})`;
    });

  if (!links.length) return "";
  return `## Đọc tiếp các bài liên quan chủ đề chọn NOXH đúng cách\n\n${links.join("\n")}`;
}

/** Mô tả một dòng sau link — pilot layout bài #17; mở rộng cụm sau khi duyệt. */
const NOXH_MINDSET_RELATED_BLURBS: Partial<
  Record<string, Partial<Record<string, string>>>
> = {
  "dta-happy-home-nhon-trach-noi-o-de-so-huu": {
    [NOXH_MINDSET_PILLAR.slug]:
      "Khung tư duy chọn NOXH theo năng lực thật, không chạy theo độ hot",
    "30-phut-di-chuyen-co-phai-mat-mat-noxh":
      "Thời gian đi lại vs áp lực sở hữu — góc nhìn người trẻ",
    "vung-ven-khong-xau-khong-gian-song-noxh":
      "Chất lượng sống ở vùng ven, không chỉ mỗi giá rẻ",
    "khi-nao-chon-du-an-hop-tui-tien":
      "Khi nào nên chọn căn vừa sức thay vì giữ suất vì sợ lỡ",
  },
};

const CLOSING_SOFT = `## HouseX — Đồng hành an cư của người lao động

Nếu bạn muốn rà soát thêm về điều kiện, tài chính hoặc so sánh dự án, [để lại thông tin](${NOXH_MINDSET_ACTION_LINKS.lienHe}) — đội ngũ HouseX sẽ đồng hành miễn phí, giúp bạn tự đưa ra quyết định phù hợp hơn.`;

function readerToolsBullets(
  heading: string,
  items: ReadonlyArray<{ label: string; href: string }>,
): string {
  if (items.length === 0) return "";
  const rows = items.map((i) => `- [${i.label}](${i.href})`).join("\n");
  return `\n\n## ${heading}\n\n${rows}`;
}

const PILLAR_READER_LINK = {
  label: "Chọn NOXH theo năng lực — bài tổng quan",
  href: NOXH_MINDSET_PILLAR.href,
} as const;

export function noxhMindsetClusterClosing(
  slug: string,
  publishedSlugs: ReadonlySet<string>,
): string {
  const related = noxhMindsetClusterRelatedSection(slug, publishedSlugs);
  const cta = CTA_BY_SLUG[slug];
  const ctaBlock = cta
    ? `## Gợi ý bước tiếp theo\n\n→ [${cta.label}](${cta.href})`
    : "";

  const toolsHint =
    slug === NOXH_MINDSET_PILLAR.slug
      ? readerToolsBullets("Công cụ tự kiểm tra", [
          { label: "Kiểm tra vay trong 60 giây", href: NOXH_MINDSET_ACTION_LINKS.check60s },
          { label: "Tính hạn mức vay", href: NOXH_MINDSET_ACTION_LINKS.hanMucVay },
          { label: "Điều kiện mua NOXH", href: NOXH_MINDSET_ACTION_LINKS.dieuKienNoxh },
        ])
      : slug === "vi-sao-mua-nha-sai-vi-chay-theo-do-hot" ||
          slug === "du-an-hot-suat-nhanh-vi-tri-dep-mat-tinh-tao" ||
          slug === "dung-mua-vi-so-mat-co-hoi"
        ? readerToolsBullets("Trước khi giữ chỗ", [
            PILLAR_READER_LINK,
            { label: "Checklist trước khi đặt cọc", href: NOXH_MINDSET_ACTION_LINKS.datCoc },
          ])
        : slug === "gan-trung-tam-chua-chac-tot-nhat-noxh" ||
            slug === "xa-hon-nhung-di-nhanh-hon-khi-nao-khon-ngoan" ||
            slug === "nha-xa-ket-noi-tot-dang-mua-hon" ||
            slug === "vung-ven-khong-xau-khong-gian-song-noxh"
          ? readerToolsBullets("Chọn vị trí theo năng lực", [
              { label: "Tính hạn mức vay", href: NOXH_MINDSET_ACTION_LINKS.hanMucVay },
              PILLAR_READER_LINK,
            ])
          : slug === "khi-nao-chon-du-an-hop-tui-tien" ||
              slug === "chon-nha-de-o-khac-chon-nha-giu-suat"
            ? readerToolsBullets("Trước khi chốt", [
                { label: "Điều kiện mua NOXH", href: NOXH_MINDSET_ACTION_LINKS.dieuKienNoxh },
                { label: "Kiểm tra vay trong 60 giây", href: NOXH_MINDSET_ACTION_LINKS.check60s },
                PILLAR_READER_LINK,
              ])
            : slug === "ba-tieu-chuan-moi-chon-noxh"
              ? readerToolsBullets("Áp dụng 3 tiêu chuẩn", [
                  { label: "Kiểm tra vay trong 60 giây", href: NOXH_MINDSET_ACTION_LINKS.check60s },
                  { label: "Tính hạn mức vay", href: NOXH_MINDSET_ACTION_LINKS.hanMucVay },
                  PILLAR_READER_LINK,
                ])
              : slug === "chi-phi-an-sau-khi-xuong-tien-mua-noxh"
                ? readerToolsBullets("Tổng chi phí sở hữu", [
                    { label: "Tính hạn mức vay", href: NOXH_MINDSET_ACTION_LINKS.hanMucVay },
                    { label: "Sai lầm tài chính khi mua nhà", href: NOXH_MINDSET_ACTION_LINKS.taiChinhCaNhan },
                    { label: "Checklist trước khi chốt mua", href: "/tin-tuc/checklist-chot-mua-noxh-tai-chinh-ha-tang-cic" },
                  ])
                : slug === "30-phut-di-chuyen-co-phai-mat-mat-noxh"
                  ? readerToolsBullets("So sánh thêm", [
                      { label: "Tính hạn mức vay", href: NOXH_MINDSET_ACTION_LINKS.hanMucVay },
                      { label: "Chi phí ẩn sau khi xuống tiền", href: "/tin-tuc/chi-phi-an-sau-khi-xuong-tien-mua-noxh" },
                      { label: "Xa hơn nhưng đi nhanh hơn — khi nào hợp lý?", href: "/tin-tuc/xa-hon-nhung-di-nhanh-hon-khi-nao-khon-ngoan" },
                    ])
                  : slug === "dta-happy-home-nhon-trach-noi-o-de-so-huu"
                    ? readerToolsBullets("Tra cứu & công cụ", [
                        { label: "DTA Happy Home trên HouseX", href: NOXH_MINDSET_ACTION_LINKS.dtaHappyHome },
                        { label: "So sánh NOXH nội thành vs vùng ven", href: "/tin-tuc/so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026" },
                        { label: "Kiểm tra điều kiện NOXH", href: NOXH_MINDSET_ACTION_LINKS.dieuKienNoxh },
                      ])
                    : slug === "checklist-chot-mua-noxh-tai-chinh-ha-tang-cic"
                ? readerToolsBullets("Công cụ checklist", [
                    { label: "Kiểm tra vay trong 60 giây", href: NOXH_MINDSET_ACTION_LINKS.check60s },
                    { label: "Tra CIC an toàn", href: NOXH_MINDSET_ACTION_LINKS.cic },
                    { label: "Thẩm định vay NOXH", href: NOXH_MINDSET_ACTION_LINKS.loanPillar },
                    { label: "Checklist trước khi đặt cọc", href: NOXH_MINDSET_ACTION_LINKS.datCoc },
                  ])
                : slug === "lam-sao-khong-bi-roi-khi-tim-mua-noxh"
                  ? readerToolsBullets("Bắt đầu tra cứu", [
                      { label: "Danh mục dự án NOXH", href: NOXH_MINDSET_ACTION_LINKS.duAnNoxh },
                      { label: "Điều kiện mua NOXH", href: NOXH_MINDSET_ACTION_LINKS.dieuKienNoxh },
                      PILLAR_READER_LINK,
                    ])
                  : "";

  return [related, ctaBlock, CLOSING_SOFT + toolsHint].filter(Boolean).join("\n\n");
}

export function noxhMindsetPublishedSlugs(
  articles: ReadonlyArray<{ slug: string; status: string }>,
): Set<string> {
  return new Set(
    articles.filter((a) => a.status === "PUBLISHED").map((a) => a.slug),
  );
}

export function noxhMindsetClusterArticleLinks(
  publishedSlugs: ReadonlySet<string>,
): ReadonlyArray<{ href: string; label: string }> {
  const pillar = {
    href: NOXH_MINDSET_PILLAR.href,
    label: NOXH_MINDSET_PILLAR.title,
  };
  const satellites = NOXH_MINDSET_CLUSTER_SATELLITES.filter((a) =>
    publishedSlugs.has(a.slug),
  ).map((a) => ({ href: hrefForSlug(a.slug), label: a.title }));
  return [pillar, ...satellites];
}
