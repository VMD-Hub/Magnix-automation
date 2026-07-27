import { NOXH_TAG_BTR } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { TOD_CONCEPT_EDITORIAL } from "@/lib/content/articles/article-editorial-voice";
import {
  BTR_LEGAL_DISCLAIMER,
  BTR_SUPPORT_CLOSING,
} from "@/lib/content/articles/long-term-rental-editorial-voice";
import { BTR_PILLAR_SLUG } from "@/lib/content/long-term-rental-btr";
import { GROWTH_CORRIDORS_PILLAR_SLUG } from "@/lib/content/growth-corridors";
import { HANOI_GROWTH_CORRIDORS_PILLAR_SLUG } from "@/lib/content/growth-corridors-hanoi";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");
const PILLAR_HREF = `/tin-tuc/kien-thuc/${BTR_PILLAR_SLUG}`;
const HUB_HREF = "/tin-tuc/kien-thuc/chu-de/nha-o-cho-thue-dai-han";
const HCMC_CORRIDORS = `/tin-tuc/kien-thuc/${GROWTH_CORRIDORS_PILLAR_SLUG}`;
const HN_CORRIDORS = `/tin-tuc/kien-thuc/${HANOI_GROWTH_CORRIDORS_PILLAR_SLUG}`;

/**
 * Nhóm 3 — TOD / vành đai & nhu cầu chuyên gia (Bài 7–8).
 */
export const BTR_CORRIDOR_SERIES_2026: ArticleDetail[] = [
  {
    id: "article-btr-07-tod",
    slug: "tod-vanh-dai-nha-o-cho-thue-dai-han-2026",
    title:
      "TOD và nhà ở cho thuê dài hạn dọc metro / vành đai: Logic quỹ đất quanh nút giao",
    excerpt:
      "Định hướng ưu tiên quỹ đất quanh ga metro và nút vành đai cho nhà ở cho thuê dài hạn giúp cư dân tiếp cận việc làm bằng giao thông công cộng — phân biệt lõi TOD với vệ tinh đường bộ.",
    body: `## Vì sao thuê dài hạn gắn với TOD và vành đai?

Nhà ở cho thuê dài hạn chỉ bền nếu người thuê đến được chỗ làm trong thời gian chấp nhận được. TOD (phát triển định hướng giao thông công cộng) đặt nhà ở – thương mại trong bán kính đi bộ quanh ga; vành đai mở kết nối liên vùng. Kết hợp hai lớp này, chính sách có thể ưu tiên quỹ đất quanh nút giao cho sản phẩm thuê thay vì chỉ bán lẻ cao tầng.

${TOD_CONCEPT_EDITORIAL}

Bài trụ cột thuê dài hạn: [Chính sách đến 2030](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Quỹ đất quanh ga / nút giao — đọc tín hiệu quy hoạch thế nào?

1. Có đồ án / chấp thuận ưu tiên nhà ở cho thuê trong bán kính ga không?
2. Nút vành đai mang lợi thế ô tô — khác lõi TOD đi bộ; đừng đánh đồng.
3. Tiến độ metro / đường song hành theo công bố — không suy ra giá thuê tương lai.

Khung trục TP.HCM: [Sáu trục tăng trưởng](${HCMC_CORRIDORS}). Vùng Thủ đô: [Năm trục Vùng Thủ đô](${HN_CORRIDORS}).

${EDITORIAL_FIGURES.metroHub}

## Lợi ích với người thuê và với vận hành BTR?

| Bên | Lợi ích định tính |
|-----|-------------------|
| Người thuê | Giảm phụ thuộc xe cá nhân; ổn định thời gian đi làm |
| Vận hành BTR | Tỷ lệ lấp đầy gắn việc làm quanh hành lang |
| Quy hoạch | Giảm áp lực nội đô lịch sử nếu phân bổ đúng quỹ đất |

${EDITORIAL_FIGURES.thuThiem}

## Đọc tiếp nhu cầu chuyên gia trên hành lang công nghiệp?

[Căn hộ cho thuê chuyên gia QL13 & Vành đai 4](/tin-tuc/kien-thuc/can-ho-cho-thue-chuyen-gia-truc-ql13-vanh-dai-4-2026) · Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${BTR_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-25T14:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/concept-b-metro-viaduct-day.png",
    authorName: "Ban biên tập House X",
    seoTitle:
      "TOD & vành đai — nhà ở cho thuê dài hạn quanh nút giao | HouseX",
    seoDesc:
      "Logic quỹ đất thuê dài hạn quanh ga metro và nút vành đai; phân biệt TOD đi bộ với vệ tinh đường bộ.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
  {
    id: "article-btr-08-ql13",
    slug: "can-ho-cho-thue-chuyen-gia-truc-ql13-vanh-dai-4-2026",
    title:
      "Căn hộ cho thuê chuyên gia trên trục QL13 và hành lang Vành đai 4",
    excerpt:
      "Nhu cầu thuê của kỹ sư / chuyên gia quanh KCN Bình Dương và vành đai liên tỉnh — đối chiếu trục QL13 và Vành đai 4; không bịa giá thuê hay công suất lấp đầy.",
    body: `## Vì sao chuyên gia KCN tạo nhu cầu thuê ổn định?

Các khu công nghiệp lớn (VSIP, Việt Hương và chuỗi phụ trợ trên hành lang Đông Bắc TP.HCM – Bình Dương) thu hút lao động kỹ thuật và chuyên gia nước ngoài cần chỗ ở gần việc, hợp đồng rõ, PCCC và dịch vụ đạt chuẩn — ít chấp nhận phòng trọ phân tán. Phân khúc căn hộ cho thuê chuyên gia gắn trực tiếp nhu cầu đó.

Trục tham chiếu: [Chủ đề Quốc lộ 13](/tin-tuc/kien-thuc/chu-de/truc-quoc-lo-13-dong-bac) · Khung sáu trục: [Sáu trục tăng trưởng đô thị TP.HCM](${HCMC_CORRIDORS}). Vành đai vùng Thủ đô (nếu đối chiếu Bắc): [Năm trục tăng trưởng Vùng Thủ đô Hà Nội](${HN_CORRIDORS}) · [Chủ đề Vành đai 4](/tin-tuc/kien-thuc/chu-de/truc-vanh-dai-4-vung-thu-do).

${EDITORIAL_FIGURES.hcmSkyline}

## QL13 / Lái Thiêu – Thuận An đọc nhu cầu thuê thế nào?

| Yếu tố | Logic định tính |
|--------|-----------------|
| Khoảng cách tới cổng KCN | Phút di chuyển ca làm — không chỉ km bản đồ |
| Metro / QL13 | Tiến độ theo công bố; lợi thế dài hạn |
| Chuẩn căn | Nội thất, phí quản lý, chỗ để xe |
| Hợp đồng | Dài hạn hơn 6–12 tháng nếu hướng BTR |

Không công bố bảng giá thuê “chuẩn” theo m² trên bài này.

${EDITORIAL_FIGURES.metroHub}

## Vành đai 4 và thuê chuyên gia — đừng nhầm với sốt thửa đất?

Vành đai mở kết nối liên tỉnh; nhu cầu thuê gắn việc làm và thời gian di chuyển. Thửa đất quanh nút giao là logic khác (pháp lý đất / tích sản). Thuê căn hộ chuyên gia ưu tiên tòa có vận hành, không ưu tiên “gần đường chưa có hạ tầng nội khu”. Xem TOD: [TOD & thuê dài hạn](/tin-tuc/kien-thuc/tod-vanh-dai-nha-o-cho-thue-dai-han-2026).

${EDITORIAL_FIGURES.thuThiem}

## Soft neo dự án dễ vận hành cho thuê?

Khung chọn dự án (không bảng giá): [Dự án vận hành cho thuê dài hạn](/tin-tuc/kien-thuc/du-an-can-ho-van-hanh-cho-thue-dai-han-2026). Bài trụ cột: [Thuê dài hạn đến 2030](${PILLAR_HREF}). Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${BTR_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-26T10:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/urban-skyline-golden-hour.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Căn hộ cho thuê chuyên gia — QL13 & Vành đai 4 | HouseX",
    seoDesc:
      "Nhu cầu thuê chuyên gia KCN trên trục QL13 và vành đai; đối chiếu hành lang tăng trưởng — không bịa giá thuê.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
];
