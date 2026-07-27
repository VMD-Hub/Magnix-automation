import { NOXH_TAG_HN_AIRPORT } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { NORTHERN_SUPPORT_CLOSING } from "@/lib/content/articles/northern-editorial-voice";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");
const PILLAR_HREF =
  "/wiki-nha-o-xa-hoi/nam-truc-tang-truong-vung-thu-do-ha-noi-2026";
const HUB_HREF =
  "/wiki-nha-o-xa-hoi/chu-de/truc-san-bay-noi-bai-bac-song-hong";

const SLUG_MACRO =
  "quy-hoach-nhat-tan-noi-bai-dai-lo-vo-nguyen-giap-2026";
const SLUG_POTENTIAL =
  "bds-thanh-pho-san-bay-noi-bai-bac-song-hong-2026";
const SLUG_REALITY = "du-an-can-ho-dat-nen-dong-anh-me-linh-2026";

const HUD_ME_LINH_SLUG = "nha-o-xa-hoi-hud-me-linh";
const HUD_ME_LINH_NAME = "Nhà ở xã hội HUD Melinh Central";
const MINH_DUC_ME_LINH_SLUG = "nha-o-xa-hoi-minh-duc-me-linh";
const MINH_DUC_ME_LINH_NAME = "Nhà ở xã hội Minh Đức Mê Linh";

/**
 * Series Trục Nội Bài – Bắc sông Hồng — phễu Vĩ mô → Tiềm năng → Thực tế.
 * Số liệu quy hoạch / hành chính theo công bố — không bịa giá căn hộ.
 */
export const HANOI_AIRPORT_CORRIDOR_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-hn-airport-01-macro",
    slug: SLUG_MACRO,
    title:
      "Quy hoạch Nhật Tân – Nội Bài và trục Đại lộ Võ Nguyên Giáp: Biểu tượng phát triển mới của Hà Nội",
    excerpt:
      "QH chi tiết 1/500 hai bên Nhật Tân – Nội Bài (Đại lộ Võ Nguyên Giáp): ~1.810 ha / ~11,1 km qua Đông Anh – Sóc Sơn; Đông Anh đẩy tiêu chí lên quận (thanglong.chinhphu.vn).",
    body: `## Đại lộ Võ Nguyên Giáp (Nhật Tân – Nội Bài) định hình cửa ngõ Bắc sông Hồng thế nào?

Trục đường từ cầu Nhật Tân về sân bay quốc tế Nội Bài — Đại lộ Võ Nguyên Giáp — là mặt cắt đô thị cửa ngõ phía Bắc Thủ đô. Khác hành lang Đông – Đông Nam gắn cao tốc cảng biển, trục này gắn logistics hàng không, dịch vụ sân bay và đô thị Bắc sông Hồng (Đông Anh, Sóc Sơn, kéo dài ảnh hưởng tới Mê Linh).

Đối chiếu năm trục tăng trưởng: [Năm trục tăng trưởng Vùng Thủ đô Hà Nội](${PILLAR_HREF}). Hub: [${HUB_HREF}](${HUB_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Quy hoạch chi tiết 1/500 hai bên Nhật Tân – Nội Bài gồm những gì?

Theo công bố đồ án quy hoạch chi tiết xây dựng tỷ lệ 1/500 hai bên tuyến đường Nhật Tân – Nội Bài (Đại lộ Võ Nguyên Giáp), phạm vi nghiên cứu thường được nêu khoảng 1.810 ha trên chiều dài tuyến khoảng 11,1 km, chia nhiều đoạn thuộc địa bàn Đông Anh và Sóc Sơn ([BNEWS / TTXVN](https://bnews.vn/ha-noi-lap-quy-hoach-ty-le-1-500-hai-ben-tuyen-duong-nhat-tan-noi-bai/18404.html), [Cổng thông tin quy hoạch – Xây dựng](https://quyhoach.xaydung.gov.vn/vn/tin-tuc/492/202/cong-bo-quy-hoach-chi-tiet-xay-dung-hai-ben-tuyen-duong-nhat-tan---noi-bai.aspx)).

| Chỉ số | Tham chiếu công bố |
|--------|-------------------|
| Tỷ lệ đồ án | 1/500 |
| Diện tích nghiên cứu | ~1.810 ha |
| Chiều dài tuyến | ~11,1 km |
| Địa bàn chính | Đông Anh, Sóc Sơn |

Mục tiêu thường được nêu: tạo bộ mặt đô thị cửa ngõ đồng bộ hạ tầng, gắn dịch vụ – thương mại – không gian xanh dọc trục — cơ sở pháp lý để lập dự án thành phần, không phải “giấy phép mua bán từng căn hộ”.

${EDITORIAL_FIGURES.metroViaduct}

## Đông Anh đang tiến tới tiêu chí lên quận ra sao?

Huyện Đông Anh được Thành phố Hà Nội xác định là một trong các huyện ưu tiên hoàn thiện tiêu chí thành quận. Theo cập nhật trên [Cổng Thông tin điện tử Chính phủ – Hà Nội (thanglong.chinhphu.vn)](https://thanglong.chinhphu.vn/dong-anh-no-luc-hoan-thanh-cac-tieu-chi-de-len-thanh-quan-103240924134113623.htm), Đông Anh đã hoàn thành các tiêu chí xây dựng huyện thành quận theo chuẩn tối thiểu của Ủy ban Thường vụ Quốc hội; HĐND Thành phố đã thông qua chủ trương, hồ sơ đề án tiếp tục thẩm định ở cấp Trung ương.

Đọc đúng nghĩa với người tìm nhà:

- “Tiến tới quận” là tín hiệu đô thị hóa hành chính và hạ tầng xã hội dài hạn — không phải mốc giá nhà chung cư trong ngắn hạn.
- Vẫn cần tách pháp lý từng dự án / thửa đất khỏi lộ trình hành chính huyện – quận.
- Đối chiếu thêm chỉ đạo tháo gỡ tiêu chí các huyện lên quận trên [thanglong.chinhphu.vn](https://thanglong.chinhphu.vn/thao-go-kho-khan-vuong-mac-de-dua-05-huyen-thanh-quan-103240811215124013.htm).

${EDITORIAL_FIGURES.metroHub}

## Người tìm nhà Bắc sông Hồng nên đọc tiếp bài nào?

| Tầng phễu | Câu hỏi | Bài House X |
|-----------|---------|-------------|
| Vĩ mô (bài này) | QH Nhật Tân – Nội Bài & Đông Anh lên quận? | Bạn đang đọc |
| Tiềm năng | Thành phố sân bay / cho thuê Bắc sông Hồng? | [BĐS thành phố sân bay Nội Bài](/wiki-nha-o-xa-hoi/${SLUG_POTENTIAL}) |
| Thực tế | Căn hộ / thửa đất Đông Anh – Mê Linh? | [Dự án Đông Anh – Mê Linh](/wiki-nha-o-xa-hoi/${SLUG_REALITY}) |

House X hỗ trợ định hướng chọn trục trước khi so dự án — [để lại thông tin tại đây](/lien-he).

${EDITORIAL_FIGURES.bitexcoMetro}

*Diện tích, chiều dài tuyến và tiến độ đề án thành lập quận theo công bố tại thời điểm biên tập — xác minh lại trên cổng chính thức trước khi dùng cho quyết định mua bán.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-20T09:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "QH Nhật Tân – Nội Bài (Võ Nguyên Giáp) 2026 — ~1810ha / 11,1km | HouseX",
    seoDesc:
      "Đồ án 1/500 hai bên Đại lộ Võ Nguyên Giáp ~1.810 ha, ~11,1 km; Đông Anh hoàn thiện tiêu chí lên quận (thanglong.chinhphu.vn).",
    tags: [NOXH_TAG_HN_AIRPORT],
    projects: [],
  },
  {
    id: "article-hn-airport-02-potential",
    slug: SLUG_POTENTIAL,
    title:
      'Đón sóng đầu tư bất động sản "Thành phố sân bay" và xu hướng sở hữu căn hộ Bắc sông Hồng',
    excerpt:
      "Logic thành phố sân bay Nội Bài: nhu cầu ở và cho thuê định tính tại Đông Anh / Sóc Sơn phục vụ chuyên gia KCN và dịch vụ hàng không — không bịa biên độ giá hay công suất thuê.",
    body: `## “Thành phố sân bay” Bắc sông Hồng nghĩa là gì — khác “sốt đất quanh sân bay” thế nào?

Thành phố sân bay ở đây là lớp đô thị gắn việc làm logistics hàng không, dịch vụ sân bay và khu công nghiệp phía Bắc sông Hồng — Đông Anh, Sóc Sơn và vùng ảnh hưởng Mê Linh — nơi phút di chuyển tới Nội Bài và các KCN quyết định nhu cầu ở / thuê nhiều hơn “tin đồn quy hoạch”.

Khác trục Đông – Đông Nam (cao tốc cảng biển), hành lang này lấy cửa ngõ hàng không và đô thị Bắc sông Hồng làm trọng tâm. Khung năm trục: [pillar Vùng Thủ đô](${PILLAR_HREF}). Bài vĩ mô: [QH Nhật Tân – Nội Bài / Võ Nguyên Giáp](/wiki-nha-o-xa-hoi/${SLUG_MACRO}).

${EDITORIAL_FIGURES.hcmSkyline}

## Nhu cầu cho thuê quanh Đông Anh và Sóc Sơn mang tính định tính nào?

Ba nhóm nhu cầu thường được quan sát trên thực địa (không phải chỉ số công suất thuê bịa):

1. Chuyên gia / lao động kỹ thuật gắn KCN và chuỗi cung ứng phía Bắc — ưu tiên nhà chung cư gần chỗ làm, phí quản lý rõ, phút di chuyển ổn định.
2. Nhân sự dịch vụ sân bay và văn phòng hỗ trợ — nhạy với thời gian ra Nội Bài vào ca đêm / giờ cao điểm.
3. Hộ gia đình an cư Bắc sông Hồng — quan tâm trường học, y tế và cộng đồng cư dân hơn biên độ cho thuê ngắn hạn.

House X không công bố % lợi suất thuê hay giá thuê “chuẩn” theo m². Cách đọc đúng: đối chiếu pháp lý sản phẩm, chi phí sở hữu và khả năng cho thuê thực tế theo hợp đồng — sau khi đã chọn đúng trục.

${EDITORIAL_FIGURES.metroHub}

## Sở hữu căn hộ Bắc sông Hồng — tín hiệu nào đáng xem trước giá?

Checklist định tính:

- Dự án nằm trong hoặc gần hành lang đã có QH chi tiết 1/500 dọc Võ Nguyên Giáp không? (xem bài vĩ mô)
- Thời gian di chuyển giờ cao điểm tới chỗ làm / sân bay / nội đô có chấp nhận được không?
- Phân khúc rõ: thương mại hay nhà ở xã hội; điều kiện sổ đỏ / chuyển nhượng?
- Đã loại trừ nhầm với trục Đông Hưng Yên hoặc Vành đai 4 chưa?

${EDITORIAL_FIGURES.thuThiem}

## Nên đọc tiếp bài thực tế hay đối chiếu trục khác?

Tầng thực tế cùng hành lang: [Căn hộ / thửa đất Đông Anh – Mê Linh](/wiki-nha-o-xa-hoi/${SLUG_REALITY}). Đối chiếu Đông – Đông Nam: [Hub trục Đông](/wiki-nha-o-xa-hoi/chu-de/truc-dong-dong-nam-vung-thu-do).

${NORTHERN_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

*Nhu cầu thuê và việc làm sân bay / KCN là mô tả định tính — không thay thế thẩm định dòng tiền cho từng căn.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-22T10:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/hcmc-skyline-river-day.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "BĐS thành phố sân bay Nội Bài – Bắc sông Hồng 2026 | HouseX",
    seoDesc:
      "Logic ở / thuê định tính Đông Anh – Sóc Sơn gắn sân bay và KCN — không bịa lợi suất hay bảng giá căn hộ.",
    tags: [NOXH_TAG_HN_AIRPORT],
    projects: [],
  },
  {
    id: "article-hn-airport-03-reality",
    slug: SLUG_REALITY,
    title:
      "Gọi tên các dự án căn hộ, đất nền đón đầu quy hoạch đô thị thông minh Bắc Hà Nội",
    excerpt:
      "Khung chọn căn hộ / thửa đất Đông Anh – Mê Linh: checklist pháp lý, phút di chuyển, neo NOXH HUD Melinh Central và Minh Đức Mê Linh trên House X — không bịa giá mở bán.",
    body: `## Làm sao chọn căn hộ hoặc thửa đất Đông Anh – Mê Linh mà không bị “tin đô thị thông minh”?

Trên trục Nội Bài – Bắc sông Hồng, khung thực tế khoảng 40-30-30:

1. Khoảng 40% — vị trí, kết nối, không gian sống: phút di chuyển tới Nội Bài / KCN / nội đô; mật độ tiện ích; cộng đồng cư dân.
2. Khoảng 30% — giá và so sánh định tính: phân khúc, chính sách thanh toán công bố, đối chiếu cùng huyện — không bịa số tuyệt đối từng căn hay từng thửa.
3. Khoảng 30% — tài chính sở hữu + hỗ trợ hồ sơ: vốn tự có, vay, điều kiện NOXH (nếu thuộc đối tượng); [liên hệ House X](/lien-he).

Bối cảnh: [QH Nhật Tân – Nội Bài](/wiki-nha-o-xa-hoi/${SLUG_MACRO}) · [Thành phố sân bay / cho thuê](/wiki-nha-o-xa-hoi/${SLUG_POTENTIAL}) · [pillar năm trục](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Đông Anh và Mê Linh hưởng lợi khác nhau ra sao?

| Khu vực | Logic định tính | Lưu ý |
|---------|-----------------|-------|
| Đông Anh | Gần Đại lộ Võ Nguyên Giáp, QH 1/500 cửa ngõ sân bay; tiến trình tiêu chí lên quận | Pháp lý từng dự án độc lập với lộ trình hành chính |
| Sóc Sơn | Tiếp cận Nội Bài / vành đai phía Bắc; quỹ đất đa dạng | Đo phút di chuyển thực tế, không chỉ km bản đồ |
| Mê Linh | Lớp đệm phía Tây Bắc sông Hồng; có quỹ NOXH trên House X | Ưu tiên sổ đỏ / điều kiện đối tượng trước “tin quy hoạch” |

${EDITORIAL_FIGURES.metroHub}

## Checklist pháp lý trước khi đặt cọc căn hộ hoặc thửa đất?

1. Xác nhận loại hình: nhà chung cư thương mại, nhà ở xã hội, hay thửa đất / nhà phố mặt đường.
2. Đối chiếu quy hoạch phân khu, chỉ giới xây dựng và hồ sơ đủ điều kiện giao dịch theo giai đoạn.
3. Với thửa đất: ưu tiên pháp lý thửa rõ ràng (sổ đỏ, mục đích sử dụng, khả năng chuyển nhượng) — không mua theo lời “sắp lên quận”.
4. Với căn hộ: hỏi phí quản lý, chỗ để xe, tiến độ bàn giao và hướng căn (Đông Nam / Nam nếu phù hợp nhu cầu).
5. Chạy thử giờ cao điểm từ dự án đến chỗ làm và trường học.
6. Nếu NOXH: đọc điều kiện đối tượng Luật Nhà ở trước khi nộp hồ sơ.

${EDITORIAL_FIGURES.thuThiem}

## Neo nhà ở xã hội Mê Linh nào đang có trên House X?

Khi ưu tiên phân khúc an cư có khung pháp lý NOXH trên cùng vùng ảnh hưởng Bắc Hà Nội, House X đang neo:

- [${HUD_ME_LINH_NAME}](/du-an/${HUD_ME_LINH_SLUG}) — KĐT Thanh Lâm – Đại Thịnh 2, Mê Linh.
- [${MINH_DUC_ME_LINH_NAME}](/du-an/${MINH_DUC_ME_LINH_SLUG}) — xã Tiền Phong, Mê Linh.

Đây là đường dẫn dự án đã có trong hệ thống House X — dùng để đối chiếu phân khúc và điều kiện đối tượng, không thay bảng giá tại thời điểm giao dịch. Xác nhận CSBH và điều kiện mua trực tiếp với CĐT / đơn vị phân phối trước khi đặt cọc.

${EDITORIAL_FIGURES.noxhEligibility}

## Khi nào nên chọn trục Nội Bài thay vì Đông – Đông Nam?

| Nhu cầu | Hướng gợi ý |
|---------|-------------|
| Gần sân bay / KCN Bắc sông Hồng | Trục Nội Bài (series này) |
| Gần cao tốc HN–HP / hướng ven biển | [Hub Đông – Đông Nam](/wiki-nha-o-xa-hoi/chu-de/truc-dong-dong-nam-vung-thu-do) |
| Nút giao vành đai vùng | Hub Vành đai 4 trên [pillar](${PILLAR_HREF}) |

${NORTHERN_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

Hub: [${HUB_HREF}](${HUB_HREF})

*Không dùng bài này như danh mục giá căn hộ thương mại Đông Anh / Sóc Sơn. Giá và điều kiện NOXH xác nhận tại thời điểm giao dịch.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-24T11:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/urban-skyline-golden-hour.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Căn hộ & thửa đất Đông Anh – Mê Linh 2026 — checklist + NOXH | HouseX",
    seoDesc:
      "Checklist pháp lý Đông Anh / Mê Linh; neo HUD Melinh Central và Minh Đức Mê Linh — không bịa bảng giá căn hộ.",
    tags: [NOXH_TAG_HN_AIRPORT],
    projects: [
      { slug: HUD_ME_LINH_SLUG, name: HUD_ME_LINH_NAME },
      { slug: MINH_DUC_ME_LINH_SLUG, name: MINH_DUC_ME_LINH_NAME },
    ],
  },
];
