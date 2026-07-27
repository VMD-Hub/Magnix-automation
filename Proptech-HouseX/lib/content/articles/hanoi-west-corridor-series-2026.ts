import { NOXH_TAG_HN_WEST } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { NORTHERN_SUPPORT_CLOSING } from "@/lib/content/articles/northern-editorial-voice";
import { HANOI_GROWTH_CORRIDORS_PILLAR_SLUG } from "@/lib/content/growth-corridors-hanoi";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");
const PILLAR_HREF = `/tin-tuc/kien-thuc/${HANOI_GROWTH_CORRIDORS_PILLAR_SLUG}`;
const HUB_HREF =
  "/tin-tuc/kien-thuc/chu-de/truc-dai-lo-thang-long-hoa-lac";

/**
 * Trục Đại lộ Thăng Long / Hòa Lạc — ba lớp: quy hoạch–thể chế → dịch chuyển không gian → thẩm định.
 * Giọng chuyên gia; không bịa bảng giá Masterise/Vinhomes; không cam kết biên độ giá.
 */
export const HANOI_WEST_CORRIDOR_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-hn-west-01",
    slug: "quy-hoach-truc-phia-tay-dai-lo-thang-long-hoa-lac-2026",
    title:
      "Quy hoạch cực phía Tây Thủ đô: Đại lộ Thăng Long, Hòa Lạc và hành lang khoa học – giáo dục",
    excerpt:
      "Trong khung QĐ 1569/QĐ-TTg: Đại lộ Thăng Long nối lõi phía Tây với Hòa Lạc — cực công nghệ, giáo dục bậc cao. Metro số 5 (Văn Cao – Hòa Lạc) theo công bố / báo chí; tiến độ tách khỏi kỳ vọng giá căn hộ.",
    body: `## Cực phía Tây Thủ đô được tổ chức quanh những lớp không gian nào?

Trong Quyết định 1569/QĐ-TTg, phát triển khoa học công nghệ và đổi mới sáng tạo là một trong các khâu đột phá của Thủ đô. Phía Tây hiện thực hóa lớp đó quanh Đại lộ Thăng Long: từ Nam Từ Liêm / Mỹ Đình kéo dài hướng Hòa Lạc — nơi quy hoạch và truyền thông chuyên ngành gắn cụm đại học, viện nghiên cứu và khu chức năng hỗ trợ. Khác Vành đai 4 (vòng ngoài liên tỉnh) và khác Nội Bài (logistics hàng không), động lực dài hạn ở đây là việc làm tri thức và mật độ tiện ích xã hội đã hình thành ở lõi phía Tây — không phải một tin metro đơn lẻ.

Đọc trong khung năm hành lang: [Năm trục tăng trưởng Vùng Thủ đô Hà Nội](${PILLAR_HREF}). Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Hòa Lạc đóng vai trò gì trong đô thị chùm phía Tây?

Hòa Lạc thường được định vị như cực công nghệ – giáo dục bậc cao phía Tây Thủ đô: quỹ đất rộng hơn lõi lịch sử, gắn kết với đại học / viện nghiên cứu và khu chức năng hỗ trợ. Cách đọc chuyên môn: phân kỳ đầu tư hạ tầng (đại lộ, metro theo công bố) và mật độ tiện ích xã hội ở lõi Nam Từ Liêm – Mỹ Đình quyết định thanh khoản ở thực nhiều hơn tên thương mại dự án.

| Lớp | Vai trò tham chiếu |
|-----|-------------------|
| Đại lộ Thăng Long | Xương sống đường bộ Đông–Tây phía Tây |
| Hòa Lạc | Trung tâm công nghệ / giáo dục và đô thị chức năng |
| Nam Từ Liêm – Mỹ Đình | Lõi an cư – tiện ích gần trung tâm hành chính / thể thao |

## Metro dọc Đại lộ Thăng Long đang được báo chí mô tả thế nào?

Báo chí ghi nhận tuyến đường sắt đô thị số 5 (Văn Cao – Hòa Lạc) với phương án tuyến dài gần 40 km, nhiều nhà ga, đoạn mặt đất / trên cao men theo Đại lộ Thăng Long tới Hòa Lạc sau khi thoát đoạn ngầm khu trung tâm. Đây là lớp giao thông công cộng bổ sung cho đại lộ — tiến độ GPMB, thi công và mốc vận hành phải theo công bố Ban quản lý đường sắt đô thị / UBND TP Hà Nội; House X không biến tin metro thành cam kết tăng giá căn hộ.

Tham chiếu định tính: [Tiền Phong — phương án tuyến metro số 5](https://tienphong.vn/phe-duyet-phuong-an-tuyen-metro-so-5-van-cao-hoa-lac-dai-gan-40km-post1775582.tpo), [VTC News — GPMB / triển khai](https://vtcnews.vn/tuyen-metro-so-5-van-cao-hoa-lac-65-000-ty-dong-gap-rut-giai-phong-mat-bang-ar1004677.html).

${EDITORIAL_FIGURES.metroHub}

## Người tìm nhà nên theo dõi những lớp hạ tầng nào song song?

1. Thời gian ô tô trên Đại lộ Thăng Long giờ cao điểm (thực tế hàng ngày).
2. Tiến độ metro số 5 theo công bố chính thức — tách khỏi tin đồn “đã xong”.
3. Kết nối ngang sang Vành đai 4 / các nút liên vùng khi đoạn gần hoàn thiện.
4. Tiện ích xã hội (trường, y tế, thương mại) tại Nam Từ Liêm / Mỹ Đình — quyết định thanh khoản ở thực nhiều hơn “tên đại lộ”.

| Lớp đọc | Bài trên cùng hành lang |
|---------|-------------------------|
| Quy hoạch – thể chế (bài này) | Quy hoạch Thăng Long – Hòa Lạc |
| Dịch chuyển không gian | [An cư Nam Từ Liêm – Mỹ Đình](/tin-tuc/kien-thuc/an-cu-phia-tay-nam-tu-liem-my-dinh-2026) |
| Thẩm định dự án | [Căn hộ cao cấp đang mở bán](/tin-tuc/kien-thuc/can-ho-cao-cap-dai-lo-thang-long-dang-mo-ban-2026) |

${NORTHERN_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

*Quy hoạch và tiến độ metro cập nhật theo quyết định / Ban quản lý dự án — có thể điều chỉnh sau thời điểm bài viết.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T14:30:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Quy hoạch trục phía Tây — Đại lộ Thăng Long & Hòa Lạc 2026 | HouseX",
    seoDesc:
      "Hòa Lạc hub công nghệ–giáo dục; Đại lộ Thăng Long xương sống phía Tây; metro số 5 theo báo chí — định hướng macro trước khi so căn hộ.",
    tags: [NOXH_TAG_HN_WEST],
    projects: [],
  },
  {
    id: "article-hn-west-02",
    slug: "an-cu-phia-tay-nam-tu-liem-my-dinh-2026",
    title:
      "Nhu cầu an cư lõi phía Tây: Thanh khoản cao tầng Nam Từ Liêm – Mỹ Đình trong cấu trúc đô thị",
    excerpt:
      "Thanh khoản Mỹ Đình, Tây Mỗ, Đại Mỗ gắn mật độ tiện ích xã hội và khả năng trả góp của hộ thu nhập ổn định. Phân tích định tính — không bịa phần trăm tăng giá căn hộ.",
    body: `## Vì sao Mỹ Đình – Tây Mỗ – Đại Mỗ giữ thanh khoản cao tầng?

Lõi phía Tây gần Mỹ Đình hưởng lợi từ cụm thể thao – hội nghị, mật độ dịch vụ và kết nối vào trung tâm hành chính. Tây Mỗ và Đại Mỗ mở thêm quỹ căn hộ cao tầng với không gian sống rộng hơn một số khu lõi lịch sử, đồng thời vẫn bám Đại lộ Thăng Long. Trên thực địa Hà Nội, thanh khoản “ở thực” thường gắn cộng đồng cư dân ổn định, căn vuông vức và hướng ban công Đông Nam / Nam khi có lựa chọn — hơn là khẩu hiệu ngắn hạn gắn tên đại lộ.

Bối cảnh: [Quy hoạch Thăng Long – Hòa Lạc](/tin-tuc/kien-thuc/quy-hoach-truc-phia-tay-dai-lo-thang-long-hoa-lac-2026) · Xem thêm: [Năm trục tăng trưởng Vùng Thủ đô](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Thanh khoản “ở thực” đọc thế nào cho đúng?

| Khu vực | Logic thanh khoản định tính | Điểm cần cân |
|---------|----------------------------|--------------|
| Mỹ Đình | Gần tiện ích lớn, dễ cho thuê chuyên gia / gia đình nhỏ | Tổng vốn và phí quản lý cao hơn vệ tinh |
| Tây Mỗ | Cân bằng khoảng cách việc làm – không gian sống | Thời gian vào lõi giờ cao điểm |
| Đại Mỗ | Quỹ căn mới hơn, gắn hành lang Thăng Long | Tiến độ nội khu và pháp lý từng dự án |

House X không công bố chỉ số tăng giá chung cho cả quận — thanh khoản phụ thuộc pháp lý, tiến độ bàn giao và khả năng trả góp của từng hộ.

${EDITORIAL_FIGURES.metroHub}

## Khung trả góp cho công chức / thu nhập ổn định — đọc thế nào?

Với hộ có thu nhập đều (công chức, viên chức, chuyên viên), khung tài chính cần kiểm trước khi đặt cọc thường gồm:

1. Ước tổng vốn thật: giá căn + thuế phí + nội thất nội thất tối thiểu (không chỉ nhìn “giá chào”).
2. Đối chiếu khoản trả hàng tháng với thu nhập khả dụng sau chi tiêu thiết yếu — để dư địa cho biến động lãi suất.
3. Kiểm tra lịch thanh toán CĐT (ví dụ khung 40–30–30 hoặc các đợt tương đương) có khớp dòng tiền lương / thưởng không.
4. Tách rõ: vay ngân hàng theo hợp đồng vs cam kết truyền miệng của môi giới.
5. Nếu thuộc đối tượng nhà ở xã hội: điều kiện hồ sơ khác hẳn căn hộ thương mại cao cấp trên cùng hành lang.

Công cụ mô phỏng: [/tinh-tra-gop](/tinh-tra-gop) — chỉ để mô phỏng, không thay thế tư vấn tín dụng chính thức.

## Có nên lấy tiến độ metro làm lý do duy nhất mua ngay?

Không nên. Metro số 5 là lớp dài hạn theo phân kỳ đầu tư công; nhu cầu ở thực tại Mỹ Đình / Tây Mỗ / Đại Mỗ đã tồn tại nhờ tiện ích và việc làm. Hãy dùng tiến độ metro như yếu tố bổ sung trong thẩm định kết nối, không phải lý do duy nhất đặt cọc.

Lớp thẩm định: [Căn hộ cao cấp dọc Đại lộ Thăng Long](/tin-tuc/kien-thuc/can-ho-cao-cap-dai-lo-thang-long-dang-mo-ban-2026). Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${NORTHERN_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.thuThiem}

*Bài mang tính khung tài chính định tính; lãi suất và điều kiện vay theo ngân hàng tại thời điểm ký.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T15:30:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-01-civic-center.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "An cư phía Tây — Mỹ Đình, Tây Mỗ, Đại Mỗ và bài toán trả góp | HouseX",
    seoDesc:
      "Thanh khoản cao tầng Nam Từ Liêm: tiện ích đồng bộ, logic trả góp cho công chức — định tính, không bịa % tăng giá.",
    tags: [NOXH_TAG_HN_WEST],
    projects: [],
  },
  {
    id: "article-hn-west-03",
    slug: "can-ho-cao-cap-dai-lo-thang-long-dang-mo-ban-2026",
    title:
      "Thẩm định căn hộ cao cấp đang mở bán dọc Đại lộ Thăng Long: Pháp lý và lịch thanh toán",
    excerpt:
      "Khung so sánh định tính chính sách thanh toán kiểu 40–30–30 và checklist pháp lý khi căn hộ cao cấp dọc Đại lộ Thăng Long đang mở bán. Không neo bảng giá theo thương hiệu; CTA tư vấn House X.",
    body: `## Quỹ căn “đang mở bán” trên Đại lộ Thăng Long nên đọc theo lớp nào?

Thị trường cao tầng phía Tây luôn có quỹ căn chào bán theo từng đợt. House X không liệt kê bảng giá gắn tên thương hiệu lớn, cũng không cam kết biên độ tăng giá. Thay vào đó, bài này đưa khung thẩm định chính sách tài chính và pháp lý — đối chiếu đúng dự án đang mở với công bố chủ đầu tư tại thời điểm xem nhà.

Bối cảnh: [Quy hoạch Thăng Long – Hòa Lạc](/tin-tuc/kien-thuc/quy-hoach-truc-phia-tay-dai-lo-thang-long-hoa-lac-2026) · [An cư Mỹ Đình – Tây Mỗ – Đại Mỗ](/tin-tuc/kien-thuc/an-cu-phia-tay-nam-tu-liem-my-dinh-2026) · [Năm trục tăng trưởng Vùng Thủ đô](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Khung chính sách thanh toán 40–30–30 nghĩa là gì?

Nhiều chủ đầu tư chia lịch thanh toán thành các đợt lớn — ví dụ tỷ lệ tham chiếu 40% – 30% – 30% theo tiến độ xây dựng / bàn giao (tỷ lệ thực tế từng dự án có thể khác). Cách đọc chuyên môn:

| Câu hỏi | Việc cần làm |
|---------|--------------|
| 40% đầu có khớp vốn tự có không? | Kiểm quỹ tiết kiệm + nguồn hợp pháp |
| 30% giữa kỳ có trùng lúc lãi vay tăng không? | Chạy kịch bản trả góp xấu hơn kỳ vọng |
| 30% cuối / bàn giao | Đối chiếu phí quản lý, nội thất, thuế phí phát sinh |
| Ân hạn / hỗ trợ lãi | Đọc hợp đồng, không tin tờ rơi miệng |

House X không khẳng định mọi dự án trên đại lộ đều dùng đúng 40–30–30 — đó chỉ là khung đối chiếu khi bạn ngồi với phòng kinh doanh.

${EDITORIAL_FIGURES.metroHub}

## Checklist chính sách + pháp lý trước khi đặt cọc?

1. Giấy phép / chấp thuận dự án, quy hoạch 1/500 (hoặc tương đương đã công bố).
2. Điều kiện huy động vốn và hình thức hợp đồng (đặt cọc, HĐMB, thỏa thuận khác).
3. Lịch thanh toán chi tiết từng đợt — khớp dòng tiền hộ gia đình.
4. Ngân hàng bảo lãnh / chính sách vay (nếu có) theo văn bản, không theo lời miệng.
5. Tiến độ xây dựng thực tế so với cam kết bàn giao trên hợp đồng.
6. Nội quy cộng đồng cư dân, phí quản lý dự kiến, hướng căn và diện tích thông thủy.
7. Nếu cân nhắc nhà ở xã hội trên cùng hành lang: điều kiện đối tượng và giá khác hẳn phân khúc cao cấp.

## Vì sao không nêu giá theo từng chủ đầu tư lớn?

Bảng giá thay đổi theo đợt, tầng, hướng và chính sách chiết khấu. Neo số giả tạo rủi ro pháp lý và sai lệch quyết định. Khi bạn cần đối chiếu đúng dự án đang mở bán / điều kiện vay, hãy dùng kênh tư vấn có trách nhiệm.

Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${EDITORIAL_FIGURES.bitexcoMetro}

## Bước tiếp theo nên là gì?

1. Chốt nhu cầu: ở thực dài hạn hay giữ chỗ linh hoạt.
2. Lọc 2–3 dự án trên cùng hành lang Thăng Long — so pháp lý trước giá chào.
3. Chạy thử [/tinh-tra-gop](/tinh-tra-gop) với lịch 40–30–30 (hoặc lịch thật từ CĐT).
4. [Liên hệ House X](/lien-he) để được hỗ trợ định hướng — không chèo kéo đặt cọc.

${NORTHERN_SUPPORT_CLOSING}

*Bài không thay thế công bố giá / tiến độ của chủ đầu tư; mọi số liệu thương mại cần xác minh tại điểm bán chính thức.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T16:30:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/hcmc-skyline-river-day.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Căn hộ cao cấp Đại lộ Thăng Long đang mở bán — checklist 40–30–30 | HouseX",
    seoDesc:
      "Khung chính sách thanh toán 40–30–30 và checklist pháp lý căn hộ cao cấp dọc Thăng Long. Không neo bảng giá giả; CTA /lien-he.",
    tags: [NOXH_TAG_HN_WEST],
    projects: [],
  },
];
