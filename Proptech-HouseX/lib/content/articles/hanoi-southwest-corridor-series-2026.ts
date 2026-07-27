import { NOXH_TAG_HN_SOUTHWEST } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { NORTHERN_SUPPORT_CLOSING } from "@/lib/content/articles/northern-editorial-voice";
import { HANOI_GROWTH_CORRIDORS_PILLAR_SLUG } from "@/lib/content/growth-corridors-hanoi";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");
const PILLAR_HREF = `/tin-tuc/kien-thuc/${HANOI_GROWTH_CORRIDORS_PILLAR_SLUG}`;
const HUB_HREF =
  "/tin-tuc/kien-thuc/chu-de/truc-tay-nam-ha-nam-ninh-binh";

/**
 * Trục Tây Nam (Hà Nội – Hà Nam – Ninh Bình) — ba lớp: quy hoạch–thể chế → dịch chuyển không gian → thẩm định.
 * Giọng chuyên gia: thửa đất / sổ đỏ; không cam kết biên độ giá.
 */
export const HANOI_SOUTHWEST_CORRIDOR_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-hn-southwest-01",
    slug: "quy-hoach-truc-phia-nam-ha-nam-ve-tinh-2026",
    title:
      "Quy hoạch hành lang phía Nam: Hà Nam trong phân vai đô thị vệ tinh – đối trọng của Thủ đô",
    excerpt:
      "QL1A và cao tốc Pháp Vân – Cầu Giẽ tạo hành lang Nam Vùng Thủ đô; Hà Nam được đọc như đô thị vệ tinh công nghiệp – dịch vụ trong khung chùm đô thị hướng tâm — tách khỏi logic Vành đai 4 hay Thăng Long.",
    body: `## Hành lang phía Nam gắn Hà Nam và cửa ngõ Pháp Vân – Cầu Giẽ thế nào trong phân công vùng?

Trong mô hình chùm đô thị hướng tâm (bổ sung khung QĐ 1569/QĐ-TTg), phía Nam hạt nhân Hà Nội nối với Hà Nam (và tiếp nối Ninh Bình trong liên kết vùng) qua Quốc lộ 1A và cao tốc Pháp Vân – Cầu Giẽ. Đây là hành lang trung chuyển hàng hóa – lao động và dần hình thành đô thị vệ tinh / đối trọng công nghiệp – dịch vụ: nơi việc làm tại KCN và dịch vụ phía Nam tạo nhu cầu an cư gần chỗ làm, đồng thời giữ khả năng lên Hà Nội khi cần.

Đọc trong khung năm hành lang: [Năm trục tăng trưởng Vùng Thủ đô Hà Nội](${PILLAR_HREF}). Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## QL1A và Pháp Vân – Cầu Giẽ đóng vai trò gì?

| Hạ tầng | Vai trò tham chiếu |
|---------|-------------------|
| Quốc lộ 1A | Trục Bắc–Nam truyền thống, mật độ dân cư và dịch vụ ven đường |
| Cao tốc Pháp Vân – Cầu Giẽ | Rút ngắn thời gian liên vùng phía Nam; giảm áp lực đoạn nội đô cửa ngõ |
| Nút giao liên tỉnh | Điểm chọn chỗ ở / kho / dịch vụ phụ trợ — cần đọc quy hoạch chi tiết |

Người tìm nhà nên đo thời gian thực tế giờ cao điểm thay vì chỉ nhìn khoảng cách trên bản đồ.

## Hà Nam với tư cách đô thị vệ tinh — đọc thế nào cho đúng?

Trong mô hình đô thị chùm, Hà Nam thường được truyền thông và quy hoạch vùng nhắc như vệ tinh công nghiệp – dịch vụ phía Nam Thủ đô: quỹ đất và chi phí thường “mềm” hơn lõi, đổi lại phụ thuộc hạ tầng kết nối và chất lượng tiện ích nội tỉnh. Không đồng nhất Hà Nam với mọi điểm nóng phía Nam Hà Nội (Thường Tín, Thanh Trì) — mỗi đoạn có mật độ đô thị và pháp lý khác nhau.

${EDITORIAL_FIGURES.metroHub}

## Phân biệt trục Tây Nam với Vành đai 4 và Thăng Long?

- Vành đai 4: vòng ngoài liên tỉnh Hà Nội – Hưng Yên – Bắc Ninh — logic nút giao và đô thị vệ tinh quanh vành đai.
- Thăng Long – Hòa Lạc: công nghệ – giáo dục và cao tầng phía Tây.
- Tây Nam: QL1A / Pháp Vân – Cầu Giẽ, KCN sạch và đô thị dịch vụ – sinh thái phía Nam.

| Lớp đọc | Bài trên cùng hành lang |
|---------|-------------------------|
| Quy hoạch – thể chế (bài này) | Quy hoạch trục phía Nam – Hà Nam |
| Dịch chuyển không gian | [Thửa đất, nhà phố ven KCN sạch](/tin-tuc/kien-thuc/dat-nen-nha-pho-kcn-sach-phia-nam-ha-noi-2026) |
| Thẩm định dự án | [BĐS sinh thái – đô thị dịch vụ](/tin-tuc/kien-thuc/bds-sinh-thai-do-thi-dich-vu-tay-nam-vung-thu-do-2026) |

${NORTHERN_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

*Vai trò vệ tinh và tiến độ nút giao theo quy hoạch / công bố địa phương — cập nhật khi có quyết định mới.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T14:45:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Quy hoạch trục phía Nam — Hà Nam vệ tinh, QL1A & Pháp Vân–Cầu Giẽ | HouseX",
    seoDesc:
      "Macro Tây Nam Vùng Thủ đô: QL1A, cao tốc Pháp Vân – Cầu Giẽ, Hà Nam đô thị vệ tinh công nghiệp–dịch vụ — chọn trục trước khi xem nhà.",
    tags: [NOXH_TAG_HN_SOUTHWEST],
    projects: [],
  },
  {
    id: "article-hn-southwest-02",
    slug: "dat-nen-nha-pho-kcn-sach-phia-nam-ha-noi-2026",
    title:
      "Thửa đất và nhà phố ven KCN sạch phía Nam: Nhu cầu nhà ở chuyên gia trong phân công vùng",
    excerpt:
      "Thửa đất và nhà phố mặt đường ven KCN sạch phía Nam: nhu cầu nhà ở chuyên gia khi FDI / nhà máy dịch chuyển. Phân tích định tính — ưu tiên sổ đỏ; không cam kết biên độ giá hay lợi nhuận cho thuê.",
    body: `## Vì sao thửa đất / nhà phố ven KCN sạch được đặt trong logic phân công vùng?

Khi FDI và nhà máy ưu tiên khu công nghiệp sạch (tiêu chuẩn môi trường, hạ tầng kỹ thuật đồng bộ), lực lượng chuyên gia và lao động kỹ thuật cần chỗ ở gần việc. Thửa đất hoặc nhà phố mặt đường quanh hành lang phía Nam trở thành kênh tích sản dài hạn — nếu pháp lý rõ và hạ tầng thực tế đủ dùng. Đây không phải lời hứa tăng giá ngắn hạn, mà là hệ quả của phân vai vệ tinh công nghiệp – dịch vụ trong cấu trúc vùng.

Bối cảnh macro: [Quy hoạch trục phía Nam – Hà Nam](/tin-tuc/kien-thuc/quy-hoach-truc-phia-nam-ha-nam-ve-tinh-2026) · Pillar: [Năm trục tăng trưởng Vùng Thủ đô](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Logic nhu cầu nhà ở chuyên gia — định tính?

| Yếu tố | Cách đọc chuyên môn |
|--------|---------------------|
| Khoảng cách tới cổng KCN | Thời gian xe máy / ô tô giờ vào ca — không chỉ km bản đồ |
| Chất lượng điện – nước – internet | Quyết định giữ chân chuyên gia thuê dài hạn |
| Trường / y tế phụ trợ | Gia đình chuyên gia ở thực, không chỉ phòng trọ |
| Pháp lý thửa / nhà | Sổ đỏ và quy hoạch rõ trước mọi kỳ vọng dòng tiền thuê |

House X không công bố phần trăm lợi nhuận cho thuê hay biên độ tăng giá thửa đất — chỉ mô tả cơ chế nhu cầu khi KCN vận hành ổn định.

${EDITORIAL_FIGURES.metroHub}

## Checklist trước khi mua thửa đất / nhà phố ven KCN?

1. Sổ đỏ khớp thửa; không tranh chấp, không kê biên.
2. Quy hoạch sử dụng đất — phân biệt đất ở và đất nông nghiệp / đất công nghiệp.
3. Hành lang kỹ thuật đường quốc lộ / cao tốc / đường gom (nếu gần cửa ngõ).
4. Hạ tầng điện – nước – thoát nước thực tế.
5. Khả năng tiếp cận mặt đường hiện hữu cho xe con và xe tải nhẹ (nếu cho thuê dịch vụ nhỏ).
6. Môi trường: khoảng cách tới nguồn thải / khu xử lý — ưu tiên KCN sạch đã công bố tiêu chuẩn.

## Có nhầm kênh KCN phía Nam với logic nút giao vành đai không?

Có. Vành đai 4 mở quỹ vệ tinh quanh nút giao liên tỉnh; trục Tây Nam gắn QL1A / Pháp Vân – Cầu Giẽ và cụm KCN phía Nam. Chọn đúng động lực trước khi so sản phẩm:

- Chủ đề Tây Nam: [${HUB_HREF}](${HUB_HREF})
- Chủ đề Vành đai 4 (nếu ưu tiên vòng ngoài): [/tin-tuc/kien-thuc/chu-de/truc-vanh-dai-4-vung-thu-do](/tin-tuc/kien-thuc/chu-de/truc-vanh-dai-4-vung-thu-do)

Lớp thẩm định: [BĐS sinh thái – đô thị dịch vụ Tây Nam](/tin-tuc/kien-thuc/bds-sinh-thai-do-thi-dich-vu-tay-nam-vung-thu-do-2026).

${NORTHERN_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.thuThiem}

*Bài không khuyến nghị mua bán thửa cụ thể; thẩm định pháp lý độc lập trước mọi quyết định.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T15:45:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-01-civic-center.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Thửa đất nhà phố ven KCN sạch phía Nam Hà Nội 2026 | HouseX",
    seoDesc:
      "Nhu cầu nhà ở chuyên gia quanh KCN sạch phía Nam: checklist sổ đỏ, pháp lý an toàn — định tính, không cam kết biên độ giá.",
    tags: [NOXH_TAG_HN_SOUTHWEST],
    projects: [],
  },
  {
    id: "article-hn-southwest-03",
    slug: "bds-sinh-thai-do-thi-dich-vu-tay-nam-vung-thu-do-2026",
    title:
      "Thẩm định bất động sản sinh thái và đô thị dịch vụ trên hành lang Tây Nam Vùng Thủ đô",
    excerpt:
      "Khung chọn dự án / khu vực tại Phủ Lý, Duy Tiên, Thường Tín, Thanh Trì: pháp lý trước giá, sinh thái và đô thị dịch vụ định tính. Không bịa phần trăm tăng giá; CTA tư vấn House X.",
    body: `## “Sinh thái” và “đô thị dịch vụ” trên hành lang Tây Nam nghĩa là gì trong quy hoạch vùng?

Trên hành lang phía Nam, hai nhóm sản phẩm thường gặp: (1) không gian gắn cây xanh / mặt nước / mật độ thấp hơn lõi; (2) đô thị dịch vụ gần việc làm, trường học và tiện ích hàng ngày. Cả hai đều cần pháp lý rõ trước mọi hình ảnh marketing. Trong phân công vùng, đây là lớp tiếp nhận nhu cầu an cư và dịch vụ của vệ tinh phía Nam — không đồng nhất với chu kỳ đại đô thị thương mại bờ Đông sông Hồng.

Bối cảnh: [Quy hoạch trục phía Nam](/tin-tuc/kien-thuc/quy-hoach-truc-phia-nam-ha-nam-ve-tinh-2026) · [Thửa đất ven KCN sạch](/tin-tuc/kien-thuc/dat-nen-nha-pho-kcn-sach-phia-nam-ha-noi-2026) · [Năm trục tăng trưởng Vùng Thủ đô](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Khung định tính theo Phủ Lý, Duy Tiên, Thường Tín, Thanh Trì?

| Khu vực | Vai trò tham chiếu trên trục | Việc cần rà |
|---------|------------------------------|-------------|
| Phủ Lý (Hà Nam) | Trung tâm tỉnh — dịch vụ, hành chính, an cư nội tỉnh | Tiến độ hạ tầng nội đô; pháp lý dự án cao tầng / nhà phố |
| Duy Tiên (Hà Nam) | Gần cửa ngõ kết nối Thủ đô; quỹ đô thị mới / KCN phụ cận | Khoảng cách thực tế lên Hà Nội; sổ đỏ / CĐT |
| Thường Tín (Hà Nội) | Cửa ngõ Nam Hà Nội trên QL1A / hành lang liên vùng | Quy hoạch chi tiết; ngập / thoát nước; hành lang đường |
| Thanh Trì (Hà Nội) | Gần lõi hơn — giao thoa đô thị hóa và quỹ nhà | Tổng vốn vs tiện ích; không nhầm với “vệ tinh giá mềm” Hà Nam |

${EDITORIAL_FIGURES.metroHub}

## Checklist chọn dự án / khu ở — pháp lý trước giá?

1. Chủ quyền và loại hình: thửa đất, nhà phố mặt đường, hay căn hộ / nhà chung cư.
2. Quy hoạch 1/500 hoặc văn bản chấp thuận đã công bố (với dự án).
3. Hạ tầng kỹ thuật đã nghiệm thu vs mới trên giấy.
4. Thời gian di chuyển thực tế tới việc làm (KCN / nội đô) giờ cao điểm.
5. Tiện ích trường – y tế – thương mại trong bán kính sinh hoạt hàng ngày.
6. Cộng đồng cư dân và phí duy trì (với khu có ban quản lý).
7. Nếu thuộc đối tượng nhà ở xã hội: tách hồ sơ NOXH khỏi sản phẩm thương mại trên cùng hành lang.

## Soft neo nội bộ — khi nào cần House X?

Khi bạn đã lọc được 1–2 khu vực (ví dụ Duy Tiên vs Thường Tín) nhưng còn phân vân pháp lý, khả năng trả góp hoặc điều kiện nhà ở xã hội — đừng quyết định chỉ vì hình ảnh “sinh thái”.

Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${EDITORIAL_FIGURES.bitexcoMetro}

## Bước tiếp theo?

1. Chốt động lực: gần KCN, gần cửa ngõ lên Hà Nội, hay ưu tiên không gian thấp mật độ.
2. Đối chiếu ba lớp đọc trên cùng hành lang Tây Nam (quy hoạch – dịch chuyển – thẩm định).
3. [Để lại thông tin tại /lien-he](/lien-he) để chuyên gia House X đồng hành với checklist thực tế.

${NORTHERN_SUPPORT_CLOSING}

*Khung khu vực mang tính định hướng biên tập; quy hoạch chi tiết và tiến độ dự án theo công bố địa phương / CĐT.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T16:45:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/hcmc-skyline-river-day.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "BĐS sinh thái & đô thị dịch vụ Tây Nam — Phủ Lý, Duy Tiên, Thường Tín, Thanh Trì | HouseX",
    seoDesc:
      "Khung chọn khu vực Tây Nam Vùng Thủ đô: pháp lý trước giá tại Phủ Lý, Duy Tiên, Thường Tín, Thanh Trì. Không bịa % tăng giá; CTA /lien-he.",
    tags: [NOXH_TAG_HN_SOUTHWEST],
    projects: [],
  },
];
