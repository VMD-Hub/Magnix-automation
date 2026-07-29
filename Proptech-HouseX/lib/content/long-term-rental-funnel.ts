import {
  BTR_ARTICLE_META,
  BTR_PILLAR_SLUG,
  type BtrToneGroup,
} from "@/lib/content/long-term-rental-btr";

export type BtrFunnelSlot = {
  order: number;
  slug: string;
  titleVi: string;
  objective: string;
  toneGroup: BtrToneGroup;
  status: "planned" | "published";
  publishedSlug?: string;
};

/** 12 slot SEO Nhà ở cho thuê dài hạn (BTR). */
export const BTR_ARTICLE_PLAN: readonly BtrFunnelSlot[] = [
  {
    order: 1,
    slug: "mo-hinh-build-to-rent-nha-o-cho-thue-dai-han-tai-cau-truc-2026",
    titleVi:
      "Xu hướng Build-to-Rent: Mô hình nhà ở cho thuê dài hạn sẽ tái cấu trúc thị trường bất động sản ra sao?",
    objective:
      "Định nghĩa BTR, vận hành quốc tế và lộ trình xuất hiện tại Việt Nam theo định hướng chính sách.",
    toneGroup: "policy-macro",
    status: "published",
    publishedSlug:
      "mo-hinh-build-to-rent-nha-o-cho-thue-dai-han-tai-cau-truc-2026",
  },
  {
    order: 2,
    slug: BTR_PILLAR_SLUG,
    titleVi:
      "Chính sách nhà ở cho thuê dài hạn: Trụ cột an cư quốc gia đến 2030",
    objective:
      "Pillar: chỉ đạo Chính phủ / Bộ Xây dựng, ưu đãi quỹ đất–thuế (theo công bố), vị trí trong Luật Nhà ở / dự thảo.",
    toneGroup: "policy-macro",
    status: "published",
    publishedSlug: BTR_PILLAR_SLUG,
  },
  {
    order: 3,
    slug: "hop-dong-thue-nha-dai-han-15-20-nam-lech-pha-cung-cau-2026",
    titleVi:
      "Hợp đồng thuê nhà 15–20 năm: Giải pháp khơi thông lệch pha cung cầu đô thị?",
    objective:
      "Cơ chế thuê dài hạn thí điểm / định hướng tại đô thị lớn; quyền lợi người thuê vs mua đứt.",
    toneGroup: "policy-macro",
    status: "published",
    publishedSlug:
      "hop-dong-thue-nha-dai-han-15-20-nam-lech-pha-cung-cau-2026",
  },
  {
    order: 4,
    slug: "gia-nha-vuot-kha-nang-co-nen-thue-dai-han-2026",
    titleVi:
      "Giá nhà vượt khả năng chi trả: Có nên chọn thuê dài hạn thay vì mua bằng mọi giá?",
    objective:
      "Empathetic: giải tỏa áp lực sở hữu; so sánh định tính chất lượng sống vs gánh nợ.",
    toneGroup: "mindset-culture",
    status: "published",
    publishedSlug: "gia-nha-vuot-kha-nang-co-nen-thue-dai-han-2026",
  },
  {
    order: 5,
    slug: "thue-can-ho-dai-han-vs-chung-cu-mini-phong-tro-2026",
    titleVi:
      "Căn hộ cho thuê dài hạn chuyên nghiệp so với chung cư mini và phòng trọ truyền thống",
    objective:
      "Bảng so sánh PCCC, vận hành, tiện ích, ổn định giá thuê — bắt buộc có bảng.",
    toneGroup: "mindset-culture",
    status: "published",
    publishedSlug: "thue-can-ho-dai-han-vs-chung-cu-mini-phong-tro-2026",
  },
  {
    order: 6,
    slug: "quyen-loi-nguoi-thue-nha-o-cho-thue-the-he-moi-2026",
    titleVi:
      "Người thuê kỳ vọng gì ở nhà ở cho thuê thế hệ mới: giá ổn định và quyền lợi dài hạn?",
    objective:
      "Nỗi đau tăng giá đột ngột / hợp đồng ngắn; giải pháp tổ hợp chuyên nghiệp.",
    toneGroup: "mindset-culture",
    status: "published",
    publishedSlug: "quyen-loi-nguoi-thue-nha-o-cho-thue-the-he-moi-2026",
  },
  {
    order: 7,
    slug: "tod-vanh-dai-nha-o-cho-thue-dai-han-2026",
    titleVi:
      "TOD và nhà ở cho thuê dài hạn dọc metro / vành đai: Logic quỹ đất quanh nút giao",
    objective:
      "Ưu tiên quỹ đất quanh ga / nút vành đai cho thuê dài hạn theo định hướng đô thị.",
    toneGroup: "corridor-tod",
    status: "published",
    publishedSlug: "tod-vanh-dai-nha-o-cho-thue-dai-han-2026",
  },
  {
    order: 8,
    slug: "can-ho-cho-thue-chuyen-gia-truc-ql13-vanh-dai-4-2026",
    titleVi:
      "Căn hộ cho thuê chuyên gia trên trục QL13 và hành lang Vành đai 4",
    objective:
      "Nhu cầu KCN / chuyên gia; đối chiếu hành lang tăng trưởng — không bịa giá thuê.",
    toneGroup: "corridor-tod",
    status: "published",
    publishedSlug: "can-ho-cho-thue-chuyen-gia-truc-ql13-vanh-dai-4-2026",
  },
  {
    order: 9,
    slug: "dong-von-dau-tu-can-ho-cho-thue-dai-han-2026",
    titleVi:
      "Dòng vốn dài hạn vào căn hộ cho thuê: Vì sao quỹ đầu tư quan tâm phân khúc này?",
    objective:
      "Logic yield định tính / dòng tiền đều — không cam kết lợi nhuận.",
    toneGroup: "cashflow-ops",
    status: "published",
    publishedSlug: "dong-von-dau-tu-can-ho-cho-thue-dai-han-2026",
  },
  {
    order: 10,
    slug: "du-an-can-ho-van-hanh-cho-thue-dai-han-2026",
    titleVi:
      "Khung chọn dự án căn hộ phù hợp vận hành cho thuê dài hạn",
    objective:
      "Checklist thiết kế / bàn giao / vận hành; đối chiếu ID Town, Emerald, HGX — không bảng giá bịa.",
    toneGroup: "cashflow-ops",
    status: "published",
    publishedSlug: "du-an-can-ho-van-hanh-cho-thue-dai-han-2026",
  },
  {
    order: 11,
    slug: "tinh-dong-tien-don-bay-can-ho-cho-thue-2026",
    titleVi:
      "Tiền thuê về có đủ trả góp không? Cách tính dòng tiền căn hộ cho thuê",
    objective:
      "Tách tiền thuê / phí / thuế / vay — tự điền; CTA tool dòng tiền.",
    toneGroup: "cashflow-ops",
    status: "published",
    publishedSlug: "tinh-dong-tien-don-bay-can-ho-cho-thue-2026",
  },
  {
    order: 12,
    slug: "thue-cho-thue-nha-2026-ma-nganh-68103",
    titleVi:
      "Cá nhân cho thuê nhà có phải nộp thuế không? Ngưỡng doanh thu, cách kê khai và mã ngành 68103",
    objective:
      "Ngưỡng miễn thuế 100tr/năm, mẫu 01/TTS; mã ngành dịch vụ cho thuê nhà của hộ KD / DN là 68103.",
    toneGroup: "cashflow-ops",
    status: "published",
    publishedSlug: "thue-cho-thue-nha-2026-ma-nganh-68103",
  },
] as const;

export function assertBtrFunnelPlanComplete(): void {
  if (BTR_ARTICLE_PLAN.length !== 12) {
    throw new Error(
      `Expected 12 BTR funnel slots, got ${BTR_ARTICLE_PLAN.length}`,
    );
  }
  for (const slot of BTR_ARTICLE_PLAN) {
    const meta = BTR_ARTICLE_META[slot.slug];
    if (!meta) throw new Error(`Missing BTR_ARTICLE_META for ${slot.slug}`);
    if (meta.toneGroup !== slot.toneGroup) {
      throw new Error(`Tone group mismatch for ${slot.slug}`);
    }
  }
  const pillar = BTR_ARTICLE_PLAN.find((s) => s.slug === BTR_PILLAR_SLUG);
  if (!pillar) throw new Error("Missing BTR pillar slot");
}
