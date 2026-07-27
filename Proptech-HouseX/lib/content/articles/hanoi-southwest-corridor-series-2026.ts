import { NOXH_TAG_HN_SOUTHWEST } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { NORTHERN_SUPPORT_CLOSING } from "@/lib/content/articles/northern-editorial-voice";
import { HANOI_GROWTH_CORRIDORS_PILLAR_SLUG } from "@/lib/content/growth-corridors-hanoi";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");
const PILLAR_HREF = `/wiki-nha-o-xa-hoi/${HANOI_GROWTH_CORRIDORS_PILLAR_SLUG}`;
const HUB_HREF =
  "/wiki-nha-o-xa-hoi/chu-de/truc-tay-nam-ha-nam-ninh-binh";

/**
 * Trục Tây Nam (Hà Nội – Hà Nam – Ninh Bình) — phễu Vĩ mô → Tiềm năng → Thực tế.
 * Giọng miền Bắc: điềm tĩnh; thửa đất / sổ đỏ; không cam kết biên độ giá.
 */
export const HANOI_SOUTHWEST_CORRIDOR_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-hn-southwest-01",
    slug: "quy-hoach-truc-phia-nam-ha-nam-ve-tinh-2026",
    title:
      "Quy hoạch trục kinh tế phía Nam: Khi Hà Nam trở thành đô thị vệ tinh công nghiệp và dịch vụ lớn của Thủ đô",
    excerpt:
      "QL1A và cao tốc Pháp Vân – Cầu Giẽ tạo hành lang Nam Vùng Thủ đô; Hà Nam được đọc như đô thị vệ tinh công nghiệp – dịch vụ. Macro hạ tầng trước khi so thửa đất hay căn hộ — không gộp với sóng Vành đai 4 hay Thăng Long.",
    body: `## Vì sao trục phía Nam gắn với Hà Nam và cửa ngõ Pháp Vân – Cầu Giẽ?

Phía Nam Vùng Thủ đô nối lõi Hà Nội với Hà Nam (và xa hơn hướng Ninh Bình) qua Quốc lộ 1A và cao tốc Pháp Vân – Cầu Giẽ. Đây là hành lang trung chuyển hàng hóa – lao động và dần hình thành đô thị vệ tinh: người làm việc tại KCN / dịch vụ phía Nam tìm chỗ ở gần việc, trong khi vẫn giữ khả năng lên Hà Nội khi cần.

Đọc trong khung 5 trục: [Năm trục tăng trưởng Vùng Thủ đô Hà Nội](${PILLAR_HREF}). Hub: [${HUB_HREF}](${HUB_HREF}).

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

| Tầng | Bài trong phễu |
|------|----------------|
| Vĩ mô (bài này) | Quy hoạch trục phía Nam – Hà Nam |
| Tiềm năng | [Thửa đất, nhà phố ven KCN sạch](/wiki-nha-o-xa-hoi/dat-nen-nha-pho-kcn-sach-phia-nam-ha-noi-2026) |
| Thực tế | [BĐS sinh thái – đô thị dịch vụ](/wiki-nha-o-xa-hoi/bds-sinh-thai-do-thi-dich-vu-tay-nam-vung-thu-do-2026) |

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
      "Đất nền, nhà phố ven các khu công nghiệp sạch phía Nam Hà Nội: Kênh trú ẩn dòng tiền bền vững",
    excerpt:
      "Thửa đất và nhà phố mặt đường ven KCN sạch phía Nam: nhu cầu nhà ở chuyên gia khi FDI / nhà máy dịch chuyển. Phân tích định tính — ưu tiên sổ đỏ; không cam kết biên độ giá hay lợi nhuận cho thuê.",
    body: `## Vì sao thửa đất / nhà phố ven KCN sạch được quan tâm?

Khi FDI và nhà máy ưu tiên khu công nghiệp sạch (tiêu chuẩn môi trường, hạ tầng kỹ thuật đồng bộ), lực lượng chuyên gia và lao động kỹ thuật cần chỗ ở gần việc. Thửa đất hoặc nhà phố mặt đường quanh hành lang phía Nam trở thành kênh tích sản dài hạn với người mua miền Bắc — nếu pháp lý rõ và hạ tầng thực tế đủ dùng. Đây không phải lời hứa tăng giá ngắn hạn.

Bối cảnh macro: [Quy hoạch trục phía Nam – Hà Nam](/wiki-nha-o-xa-hoi/quy-hoach-truc-phia-nam-ha-nam-ve-tinh-2026) · Pillar: [Năm trục tăng trưởng Vùng Thủ đô](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Logic nhu cầu nhà ở chuyên gia — định tính?

| Yếu tố | Cách đọc trung thực |
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

## Có nhầm kênh KCN với săn đất “theo sóng vành đai”?

Có. Vành đai 4 mở quỹ vệ tinh quanh nút giao liên tỉnh; trục Tây Nam gắn QL1A / Pháp Vân – Cầu Giẽ và cụm KCN phía Nam. Chọn đúng động lực trước khi so sản phẩm:

- Hub Tây Nam: [${HUB_HREF}](${HUB_HREF})
- Hub Vành đai 4 (nếu ưu tiên vòng ngoài): [/wiki-nha-o-xa-hoi/chu-de/truc-vanh-dai-4-vung-thu-do](/wiki-nha-o-xa-hoi/chu-de/truc-vanh-dai-4-vung-thu-do)

Tầng thực tế: [BĐS sinh thái – đô thị dịch vụ Tây Nam](/wiki-nha-o-xa-hoi/bds-sinh-thai-do-thi-dich-vu-tay-nam-vung-thu-do-2026).

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
      "Săn tìm bất động sản sinh thái, đô thị dịch vụ đón sóng quy hoạch trục Tây Nam Vùng Thủ đô",
    excerpt:
      "Khung chọn dự án / khu vực tại Phủ Lý, Duy Tiên, Thường Tín, Thanh Trì: pháp lý trước giá, sinh thái và đô thị dịch vụ định tính. Không bịa phần trăm tăng giá; CTA tư vấn House X.",
    body: `## “Sinh thái” và “đô thị dịch vụ” trên trục Tây Nam nghĩa là gì?

Trên hành lang phía Nam, người mua thường gặp hai nhóm sản phẩm: (1) không gian gắn cây xanh / mặt nước / mật độ thấp hơn lõi; (2) đô thị dịch vụ gần việc làm, trường học và tiện ích hàng ngày. Cả hai đều cần pháp lý rõ trước mọi hình ảnh marketing. House X đưa khung chọn khu vực — không liệt kê bảng giá giả và không cam kết biên độ tăng giá.

Bối cảnh: [Quy hoạch trục phía Nam](/wiki-nha-o-xa-hoi/quy-hoach-truc-phia-nam-ha-nam-ve-tinh-2026) · [Thửa đất ven KCN sạch](/wiki-nha-o-xa-hoi/dat-nen-nha-pho-kcn-sach-phia-nam-ha-noi-2026) · [Năm trục tăng trưởng Vùng Thủ đô](${PILLAR_HREF}).

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

Hub: [${HUB_HREF}](${HUB_HREF}).

${EDITORIAL_FIGURES.bitexcoMetro}

## Bước tiếp theo?

1. Chốt động lực: gần KCN, gần cửa ngõ lên Hà Nội, hay ưu tiên không gian thấp mật độ.
2. Đối chiếu macro → tiềm năng → thực tế trong cùng trục (ba bài phễu Tây Nam).
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
