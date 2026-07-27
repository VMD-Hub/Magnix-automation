import type { HanoiGrowthCorridorId } from "@/lib/content/growth-corridors-hanoi";
import { HANOI_GROWTH_CORRIDOR_AXIS_IDS } from "@/lib/content/growth-corridors-hanoi";
import type { FunnelStage } from "@/lib/content/growth-corridor-funnel";
import { FUNNEL_STAGES } from "@/lib/content/growth-corridor-funnel";

export type HanoiCorridorArticlePlanSlot = {
  corridorId: Exclude<HanoiGrowthCorridorId, "hn-framework">;
  stage: FunnelStage;
  slug: string;
  titleVi: string;
  objective: string;
  status: "planned" | "published";
  publishedSlug?: string;
};

/** 5 trục × 3 tầng = 15 slot SEO Vùng Thủ đô. */
export const HANOI_GROWTH_CORRIDOR_ARTICLE_PLAN: readonly HanoiCorridorArticlePlanSlot[] =
  [
    {
      corridorId: "hn-east-southeast",
      stage: "macro",
      slug: "cao-toc-5b-hanh-lang-kinh-te-ven-bien-dong-nam-vung-thu-do-2026",
      titleVi:
        "Quy hoạch cao tốc 5B và hành lang kinh tế ven biển: Bệ phóng bứt phá của trục Đông Nam Vùng Thủ đô",
      objective:
        "Phân tích bản đồ kết nối giao thương giữa lõi Hà Nội với cụm cảng biển Hải Phòng và vùng di sản Quảng Ninh.",
      status: "published",
      publishedSlug:
        "cao-toc-5b-hanh-lang-kinh-te-ven-bien-dong-nam-vung-thu-do-2026",
    },
    {
      corridorId: "hn-east-southeast",
      stage: "potential",
      slug: "di-dan-quan-phia-dong-hung-yen-dong-tien-2026",
      titleVi:
        'Xu hướng di dân về "Quận phía Đông": Tại sao dòng tiền đầu tư trung hạn vẫn gọi tên Hưng Yên?',
      objective:
        "Phân tích làn sóng ly tâm dịch chuyển sang bờ Đông sông Hồng nhờ hạ tầng và đại đô thị sinh thái đồng bộ.",
      status: "published",
      publishedSlug: "di-dan-quan-phia-dong-hung-yen-dong-tien-2026",
    },
    {
      corridorId: "hn-east-southeast",
      stage: "reality",
      slug: "du-an-dai-do-thi-chung-cu-truc-phia-dong-ha-noi-2026",
      titleVi:
        "Đánh giá các dự án đại đô thị và chung cư cao cấp trục phía Đông đáng xuống tiền nhất năm nay",
      objective:
        "Review định tính Ocean Park và trục đường 5 — giá/tiến độ/pháp lý theo nguồn công bố, không bịa bảng giá.",
      status: "published",
      publishedSlug: "du-an-dai-do-thi-chung-cu-truc-phia-dong-ha-noi-2026",
    },

    {
      corridorId: "hn-airport-north",
      stage: "macro",
      slug: "quy-hoach-nhat-tan-noi-bai-dai-lo-vo-nguyen-giap-2026",
      titleVi:
        "Quy hoạch Nhật Tân – Nội Bài và trục Đại lộ Võ Nguyên Giáp: Biểu tượng phát triển mới của Hà Nội",
      objective:
        "Toàn cảnh quy hoạch hai bên đại lộ và định hướng Đông Anh lên quận / đô thị thông minh Bắc sông Hồng.",
      status: "published",
      publishedSlug: "quy-hoach-nhat-tan-noi-bai-dai-lo-vo-nguyen-giap-2026",
    },
    {
      corridorId: "hn-airport-north",
      stage: "potential",
      slug: "bds-thanh-pho-san-bay-noi-bai-bac-song-hong-2026",
      titleVi:
        'Đón sóng đầu tư bất động sản "Thành phố sân bay" và xu hướng sở hữu căn hộ Bắc sông Hồng',
      objective:
        "Phân tích tiềm năng cho thuê / thương mại phục vụ chuyên gia KCN Đông Anh, Sóc Sơn và phụ cận.",
      status: "published",
      publishedSlug: "bds-thanh-pho-san-bay-noi-bai-bac-song-hong-2026",
    },
    {
      corridorId: "hn-airport-north",
      stage: "reality",
      slug: "du-an-can-ho-dat-nen-dong-anh-me-linh-2026",
      titleVi:
        "Gọi tên các dự án căn hộ, đất nền đón đầu quy hoạch đô thị thông minh Bắc Hà Nội",
      objective:
        "Chỉ điểm khu vực Đông Anh, Mê Linh — checklist pháp lý và neo NOXH House X khi có.",
      status: "published",
      publishedSlug: "du-an-can-ho-dat-nen-dong-anh-me-linh-2026",
    },

    {
      corridorId: "hn-ring-road-4",
      stage: "macro",
      slug: "tien-do-vanh-dai-4-vung-thu-do-2026",
      titleVi:
        "Bản đồ tiến độ Vành đai 4 – Vùng Thủ đô: Chặng nước rút khơi thông mọi điểm nghẽn giao thông",
      objective:
        "Cập nhật timeline thi công, ngày thông xe dự kiến và cầu vượt sông Hồng trên tuyến.",
      status: "published",
      publishedSlug: "tien-do-vanh-dai-4-vung-thu-do-2026",
    },
    {
      corridorId: "hn-ring-road-4",
      stage: "potential",
      slug: "tod-doc-vanh-dai-4-vung-thu-do-2026",
      titleVi:
        "Mô hình đô thị TOD dọc tuyến Vành đai 4: Bản đồ kho báu mới cho các nhà đầu tư bất động sản",
      objective:
        "Phân tích định hướng quỹ đất quanh nút giao Vành đai 4 và đô thị vệ tinh.",
      status: "published",
      publishedSlug: "tod-doc-vanh-dai-4-vung-thu-do-2026",
    },
    {
      corridorId: "hn-ring-road-4",
      stage: "reality",
      slug: "dat-nen-nha-pho-don-dau-vanh-dai-4-bac-ninh-hung-yen-2026",
      titleVi:
        "Sắp thông xe Vành đai 4: Đất nền, nhà phố khu vực nào tại Bắc Ninh, Hưng Yên, Mê Linh sẽ tăng trưởng mạnh nhất?",
      objective:
        "Khoanh vùng điểm nóng pháp lý an toàn — so sánh định tính, không cam kết biên độ giá.",
      status: "published",
      publishedSlug:
        "dat-nen-nha-pho-don-dau-vanh-dai-4-bac-ninh-hung-yen-2026",
    },

    {
      corridorId: "hn-west-thang-long",
      stage: "macro",
      slug: "quy-hoach-truc-phia-tay-dai-lo-thang-long-hoa-lac-2026",
      titleVi:
        "Quy hoạch trục phía Tây Hà Nội: Định hình trung tâm công nghệ, giáo dục bậc cao Hòa Lạc",
      objective:
        "Phân tích mở rộng không gian phía Tây và tiến độ metro / hạ tầng dọc Đại lộ Thăng Long.",
      status: "published",
      publishedSlug: "quy-hoach-truc-phia-tay-dai-lo-thang-long-hoa-lac-2026",
    },
    {
      corridorId: "hn-west-thang-long",
      stage: "potential",
      slug: "an-cu-phia-tay-nam-tu-liem-my-dinh-2026",
      titleVi:
        "Nhu cầu an cư thực tế tại lõi phía Tây: Lực đẩy giữ vững làn sóng bất động sản cao tầng Nam Từ Liêm",
      objective:
        "Lý giải thanh khoản Mỹ Đình, Tây Mỗ, Đại Mỗ nhờ tiện ích xã hội đồng bộ và bài toán tài chính trung thực.",
      status: "published",
      publishedSlug: "an-cu-phia-tay-nam-tu-liem-my-dinh-2026",
    },
    {
      corridorId: "hn-west-thang-long",
      stage: "reality",
      slug: "can-ho-cao-cap-dai-lo-thang-long-dang-mo-ban-2026",
      titleVi:
        "Danh sách các dự án căn hộ cao cấp đang mở bán dọc trục Đại lộ Thăng Long có chính sách tài chính tốt nhất",
      objective:
        "So sánh định tính chính sách thanh toán / ân hạn — đối chiếu nguồn CĐT, CTA tư vấn House X.",
      status: "published",
      publishedSlug: "can-ho-cao-cap-dai-lo-thang-long-dang-mo-ban-2026",
    },

    {
      corridorId: "hn-southwest-ha-nam",
      stage: "macro",
      slug: "quy-hoach-truc-phia-nam-ha-nam-ve-tinh-2026",
      titleVi:
        "Quy hoạch trục kinh tế phía Nam: Khi Hà Nam trở thành đô thị vệ tinh công nghiệp và dịch vụ lớn của Thủ đô",
      objective:
        "Phân tích QL1A, cao tốc Pháp Vân – Cầu Giẽ và nút giao liên tỉnh.",
      status: "published",
      publishedSlug: "quy-hoach-truc-phia-nam-ha-nam-ve-tinh-2026",
    },
    {
      corridorId: "hn-southwest-ha-nam",
      stage: "potential",
      slug: "dat-nen-nha-pho-kcn-sach-phia-nam-ha-noi-2026",
      titleVi:
        "Đất nền, nhà phố ven các khu công nghiệp sạch phía Nam Hà Nội: Kênh trú ẩn dòng tiền bền vững",
      objective:
        "Đánh giá nhu cầu nhà ở chuyên gia khi FDI / nhà máy dịch chuyển về Hà Nam và phụ cận.",
      status: "published",
      publishedSlug: "dat-nen-nha-pho-kcn-sach-phia-nam-ha-noi-2026",
    },
    {
      corridorId: "hn-southwest-ha-nam",
      stage: "reality",
      slug: "bds-sinh-thai-do-thi-dich-vu-tay-nam-vung-thu-do-2026",
      titleVi:
        "Săn tìm bất động sản sinh thái, đô thị dịch vụ đón sóng quy hoạch trục Tây Nam Vùng Thủ đô",
      objective:
        "Giới thiệu khung chọn dự án tại Phủ Lý, Duy Tiên, Thường Tín, Thanh Trì — pháp lý trước giá.",
      status: "published",
      publishedSlug: "bds-sinh-thai-do-thi-dich-vu-tay-nam-vung-thu-do-2026",
    },
  ] as const;

export function assertHanoiFunnelPlanComplete(): void {
  if (HANOI_GROWTH_CORRIDOR_ARTICLE_PLAN.length !== 15) {
    throw new Error(
      `Expected 15 Hanoi funnel slots, got ${HANOI_GROWTH_CORRIDOR_ARTICLE_PLAN.length}`,
    );
  }
  for (const axis of HANOI_GROWTH_CORRIDOR_AXIS_IDS) {
    for (const stage of FUNNEL_STAGES) {
      const hit = HANOI_GROWTH_CORRIDOR_ARTICLE_PLAN.find(
        (s) => s.corridorId === axis && s.stage === stage,
      );
      if (!hit) throw new Error(`Missing Hanoi funnel slot: ${axis} / ${stage}`);
    }
  }
}
