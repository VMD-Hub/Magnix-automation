import type { GrowthCorridorId } from "@/lib/content/growth-corridors";
import { GROWTH_CORRIDOR_AXIS_IDS } from "@/lib/content/growth-corridors";

/**
 * Phễu chuyển đổi nội dung theo trục:
 * Vĩ mô (hạ tầng / quy hoạch) → Tiềm năng (dòng tiền / biên độ) → Thực tế (dự án / giá).
 */
export type FunnelStage = "macro" | "potential" | "reality";

export const FUNNEL_STAGES: readonly FunnelStage[] = [
  "macro",
  "potential",
  "reality",
] as const;

export const FUNNEL_STAGE_LABEL_VI: Record<FunnelStage, string> = {
  macro: "Vĩ mô",
  potential: "Tiềm năng",
  reality: "Thực tế",
};

export type CorridorArticlePlanStatus = "planned" | "published";

export type CorridorArticlePlanSlot = {
  corridorId: Exclude<GrowthCorridorId, "framework">;
  stage: FunnelStage;
  /** Slug SEO mục tiêu (ổn định cho URL khi publish). */
  slug: string;
  titleVi: string;
  objective: string;
  status: CorridorArticlePlanStatus;
  /** Nếu đã ship dưới slug khác / cùng slug — gắn bài demo hiện có. */
  publishedSlug?: string;
};

/**
 * 6 trục × 3 tầng = 18 slot SEO.
 * Bài đã publish gắn `status: published` + `publishedSlug`.
 */
export const GROWTH_CORRIDOR_ARTICLE_PLAN: readonly CorridorArticlePlanSlot[] = [
  // —— Trục 1: Bắc – Nam ——
  {
    corridorId: "north-south-saigon-river",
    stage: "macro",
    slug: "truc-doc-song-sai-gon-hanh-lang-kinh-te-ty-do-2026",
    titleVi:
      "Đột phá quy hoạch trục dọc sông Sài Gòn: Khi dòng sông trở thành hành lang kinh tế tỷ đô",
    objective:
      "Phân tích đề án phát triển kinh tế dịch vụ, du lịch và giao thông thủy dọc sông Sài Gòn từ Củ Chi về Nhà Bè.",
    status: "published",
    publishedSlug: "truc-doc-song-sai-gon-hanh-lang-kinh-te-ty-do-2026",
  },
  {
    corridorId: "north-south-saigon-river",
    stage: "potential",
    slug: "ly-tam-bds-nam-sai-gon-can-gio-dong-tien-2026",
    titleVi:
      "Xu hướng ly tâm bất động sản: Vì sao dòng tiền thông minh đang đổ về Nam Sài Gòn và Cần Giờ?",
    objective:
      "Lý giải sức hút BĐS ven sông, tiềm năng tăng giá khi siêu cảng trung chuyển quốc tế Cần Giờ được đẩy mạnh.",
    status: "published",
    publishedSlug: "ly-tam-bds-nam-sai-gon-can-gio-dong-tien-2026",
  },
  {
    corridorId: "north-south-saigon-river",
    stage: "reality",
    slug: "top-du-an-can-ho-biet-thu-ven-song-nam-sai-gon-2026",
    titleVi:
      "Top dự án căn hộ và biệt thự ven sông Nam Sài Gòn đáng đầu tư nhất hiện nay",
    objective:
      "Đánh giá vị trí, giá bán, pháp lý các dự án nổi bật tại Quận 7, Nhà Bè hưởng lợi trục hạ tầng Bắc–Nam.",
    status: "published",
    publishedSlug: "top-du-an-can-ho-biet-thu-ven-song-nam-sai-gon-2026",
  },

  // —— Trục 2: Đông – Tây ——
  {
    corridorId: "east-west-vvk-mct",
    stage: "macro",
    slug: "truc-dong-tay-tphcm-vo-van-kiet-mai-chi-tho-2026",
    titleVi:
      "Trục Đông - Tây TP.HCM: Xương sống liên kết vùng kết nối các thủ phủ công nghiệp",
    objective:
      "Toàn cảnh hạ tầng Võ Văn Kiệt – Mai Chí Thọ kéo dài: Long An xuyên lõi trung tâm đến Đồng Nai.",
    status: "published",
    publishedSlug: "truc-dong-tay-tphcm-vo-van-kiet-mai-chi-tho-2026",
  },
  {
    corridorId: "east-west-vvk-mct",
    stage: "potential",
    slug: "bds-truc-dong-tay-bien-do-gia-cua-ngo-2026",
    titleVi:
      "Bất động sản trục Đông - Tây: Điểm sáng đầu tư nhờ hạ tầng giao thương liền mạch",
    objective:
      "Phân tích biên độ tăng giá quỹ đất dọc đại lộ, đặc biệt cửa ngõ phía Tây và phía Đông.",
    status: "published",
    publishedSlug: "bds-truc-dong-tay-bien-do-gia-cua-ngo-2026",
  },
  {
    corridorId: "east-west-vvk-mct",
    stage: "reality",
    slug: "can-ho-vo-van-kiet-mai-chi-tho-an-cu-dau-tu-2026",
    titleVi:
      "Căn hộ đại lộ Võ Văn Kiệt - Mai Chí Thọ: Lựa chọn an cư và đầu tư hộ khẩu TP.HCM lý tưởng",
    objective:
      "Review, so sánh chung cư cao cấp/tầm trung dọc tuyến — lợi thế di chuyển vào trung tâm.",
    status: "published",
    publishedSlug: "can-ho-vo-van-kiet-mai-chi-tho-an-cu-dau-tu-2026",
  },

  // —— Trục 3: Kinh tế biển phía Đông ——
  {
    corridorId: "east-coast-brvt",
    stage: "macro",
    slug: "hanh-lang-kinh-te-bien-phia-dong-tphcm-cai-mep-2026",
    titleVi:
      "Hành lang kinh tế biển phía Đông: Bệ phóng đưa kinh tế TP.HCM vươn tầm quốc tế",
    objective:
      "Phân tích quy hoạch chuỗi logistics từ TP.HCM qua Nhơn Trạch, Long Thành đến cảng Cái Mép – Thị Vải.",
    status: "published",
    publishedSlug: "hanh-lang-kinh-te-bien-phia-dong-tphcm-cai-mep-2026",
  },
  {
    corridorId: "east-coast-brvt",
    stage: "potential",
    slug: "nhon-trach-cu-tang-truong-ha-tang-tod-2026",
    titleVi:
      "Đón sóng đầu tư bất động sản dọc hành lang kinh tế biển phía Đông TP.HCM",
    objective:
      "Đánh giá phân khúc BĐS công nghiệp / đô thị vệ tinh khi cao tốc Biên Hòa – Vũng Tàu, Bến Lức – Long Thành đồng bộ.",
    status: "published",
    publishedSlug: "nhon-trach-cu-tang-truong-ha-tang-tod-2026",
  },
  {
    corridorId: "east-coast-brvt",
    stage: "reality",
    slug: "bds-do-thi-bien-phia-dong-cua-ngo-dau-tu-dai-han-2026",
    titleVi:
      "Sở hữu bất động sản đô thị biển: Cơ hội đầu tư dài hạn tại phía Đông cửa ngõ",
    objective:
      "Giới thiệu đại đô thị sinh thái / NOXH vệ tinh (DTA Happy Home) đón dòng chuyên gia và lao động KCN.",
    status: "published",
    publishedSlug: "bds-do-thi-bien-phia-dong-cua-ngo-dau-tu-dai-han-2026",
  },

  // —— Trục 4: Vành đai 3 & 4 ——
  {
    corridorId: "ring-road-3-4",
    stage: "macro",
    slug: "tien-do-vanh-dai-3-vanh-dai-4-do-thi-ve-tinh-2026",
    titleVi:
      "Tiến độ thi công Vành đai 3 & Vành đai 4: Bản đồ thay đổi diện mạo đô thị vệ tinh TP.HCM",
    objective:
      "Cập nhật timeline, mốc hoàn thành Vành đai 3 và triển khai Vành đai 4 qua Bình Dương, Đồng Nai, Long An.",
    status: "published",
    publishedSlug: "tien-do-vanh-dai-3-vanh-dai-4-do-thi-ve-tinh-2026",
  },
  {
    corridorId: "ring-road-3-4",
    stage: "potential",
    slug: "tod-doc-vanh-dai-3-mo-vang-nha-dau-tu-2026",
    titleVi:
      'Mô hình đô thị TOD dọc đường Vành đai 3: "Mỏ vàng" mới của nhà đầu tư bất động sản',
    objective:
      "Phân tích quỹ đất quanh nút giao Vành đai 3 theo mô hình đô thị gắn giao thông công cộng.",
    status: "published",
    publishedSlug: "tod-doc-vanh-dai-3-mo-vang-nha-dau-tu-2026",
  },
  {
    corridorId: "ring-road-3-4",
    stage: "reality",
    slug: "dat-nen-nha-pho-don-dau-thong-xe-vanh-dai-3-2026",
    titleVi:
      "Săn tìm đất nền, nhà phố đón đầu ngày thông xe đường Vành đai 3 TP.HCM",
    objective:
      "Chỉ điểm khu vực / dự án tại Thủ Đức, Củ Chi, Bình Chánh, Thuận An hưởng lợi lớn.",
    status: "published",
    publishedSlug: "dat-nen-nha-pho-don-dau-thong-xe-vanh-dai-3-2026",
  },

  // —— Trục 5: Sân bay ——
  {
    corridorId: "airport-long-thanh",
    stage: "macro",
    slug: "metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026",
    titleVi:
      "Kế hoạch vận hành Sân bay Long Thành: Trục giao thông kết nối liên cảng tăng tốc chặng cuối",
    objective:
      "Phân tích khai thác thương mại và tuyến huyết mạch kết nối Tân Sơn Nhất – Long Thành (đường sắt / cao tốc).",
    status: "published",
    publishedSlug: "metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026",
  },
  {
    corridorId: "airport-long-thanh",
    stage: "potential",
    slug: "bds-thanh-pho-san-bay-long-thanh-mo-hinh-sinh-loi-2026",
    titleVi:
      'Bất động sản "Thành phố sân bay": Mô hình sinh lời bền vững được chứng minh toàn cầu',
    objective:
      "Phân tích tiềm năng cho thuê, thương mại và gia tăng giá trị BĐS bán kính 5–10 km quanh Long Thành.",
    status: "published",
    publishedSlug: "bds-thanh-pho-san-bay-long-thanh-mo-hinh-sinh-loi-2026",
  },
  {
    corridorId: "airport-long-thanh",
    stage: "reality",
    slug: "id-town-long-thanh-ha-tang-san-bay-metro-2026",
    titleVi:
      "Gọi tên các dự án căn hộ, đất nền hưởng lợi lớn nhất từ trục kết nối Sân bay Long Thành",
    objective:
      "Đánh giá dự án tại Nhơn Trạch, Long Thành (iD Town / iD Junction) trước thềm sân bay khai thác.",
    status: "published",
    publishedSlug: "id-town-long-thanh-ha-tang-san-bay-metro-2026",
  },

  // —— Trục đặc biệt: QL13 ——
  {
    corridorId: "ql13-northeast",
    stage: "macro",
    slug: "lai-thieu-quy-hoach-2040-phuong-trung-tam-metro-2026",
    titleVi:
      "Đại lộ Quốc lộ 13: Xương sống kinh tế và quy hoạch Đại lộ tài chính khu Đông Bắc",
    objective:
      "Cập nhật mở rộng QL13, hướng tuyến metro dọc dải phân cách kết nối về Quận 1 / cửa ngõ Thủ Đức.",
    status: "published",
    publishedSlug: "lai-thieu-quy-hoach-2040-phuong-trung-tam-metro-2026",
  },
  {
    corridorId: "ql13-northeast",
    stage: "potential",
    slug: "mua-can-ho-lai-thieu-o-thuc-hay-dau-tu-cho-thue-2026",
    titleVi:
      'Bất động sản trục Quốc lộ 13: "Vùng trũng dòng tiền" đón sóng dịch chuyển đô thị',
    objective:
      "Phân tích ly tâm về Lái Thiêu, Thuận An; nhu cầu thuê từ chuyên gia KCN VSIP và cửa ngõ TP.HCM.",
    status: "published",
    publishedSlug: "mua-can-ho-lai-thieu-o-thuc-hay-dau-tu-cho-thue-2026",
  },
  {
    corridorId: "ql13-northeast",
    stage: "reality",
    slug: "can-ho-lai-thieu-quoc-lo-13-du-an-noi-bat-2026",
    titleVi:
      "Bảng giá và tiến độ các dự án căn hộ cao cấp dọc Quốc lộ 13 đang mở bán",
    objective:
      "So sánh Emerald 68, A&T Sky Garden, Astral City và quỹ sắp ra mắt (HGX thương mại, Emerald Boulevard).",
    status: "published",
    publishedSlug: "can-ho-lai-thieu-quoc-lo-13-du-an-noi-bat-2026",
  },
] as const;

export function getFunnelSlotsForCorridor(
  corridorId: Exclude<GrowthCorridorId, "framework">,
): CorridorArticlePlanSlot[] {
  return GROWTH_CORRIDOR_ARTICLE_PLAN.filter((s) => s.corridorId === corridorId);
}

export function assertFunnelPlanComplete(): void {
  if (GROWTH_CORRIDOR_ARTICLE_PLAN.length !== 18) {
    throw new Error(
      `Expected 18 funnel slots, got ${GROWTH_CORRIDOR_ARTICLE_PLAN.length}`,
    );
  }
  for (const axis of GROWTH_CORRIDOR_AXIS_IDS) {
    for (const stage of FUNNEL_STAGES) {
      const hit = GROWTH_CORRIDOR_ARTICLE_PLAN.find(
        (s) => s.corridorId === axis && s.stage === stage,
      );
      if (!hit) {
        throw new Error(`Missing funnel slot: ${axis} / ${stage}`);
      }
    }
  }
}
