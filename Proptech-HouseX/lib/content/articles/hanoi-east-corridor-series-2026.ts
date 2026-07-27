import { NOXH_TAG_HN_EAST } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { NORTHERN_SUPPORT_CLOSING } from "@/lib/content/articles/northern-editorial-voice";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");
const PILLAR_HREF =
  "/tin-tuc/kien-thuc/nam-truc-tang-truong-vung-thu-do-ha-noi-2026";
const HUB_HREF =
  "/tin-tuc/kien-thuc/chu-de/truc-dong-dong-nam-vung-thu-do";

const SLUG_POTENTIAL = "di-dan-quan-phia-dong-hung-yen-dong-tien-2026";
const SLUG_MACRO =
  "cao-toc-5b-hanh-lang-kinh-te-ven-bien-dong-nam-vung-thu-do-2026";
const SLUG_REALITY =
  "du-an-dai-do-thi-chung-cu-truc-phia-dong-ha-noi-2026";

/**
 * Series Trục Đông – Đông Nam Vùng Thủ đô — ba lớp: quy hoạch–thể chế → dịch chuyển không gian → thẩm định dự án.
 * Số liệu hạ tầng / quy hoạch theo công bố chính thức và báo chí — không bịa giá căn hộ.
 */
export const HANOI_EAST_CORRIDOR_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-hn-east-02-potential",
    slug: SLUG_POTENTIAL,
    title:
      "Dịch chuyển không gian bờ Đông sông Hồng: Hưng Yên trong cấu trúc đô thị vệ tinh Vùng Thủ đô",
    excerpt:
      "Trong khung Quyết định 1569/QĐ-TTg và mô hình chùm đô thị hướng tâm, Hưng Yên được đọc như cửa ngõ phía Đông sông Hồng — nơi quỹ đất và đô thị mới tiếp nhận nhu cầu ly tâm từ Long Biên – Gia Lâm, theo logic phân kỳ đầu tư định tính, không bịa biên độ giá.",
    body: `## Hưng Yên được định vị thế nào trong đồ án quy hoạch Vùng Thủ đô?

Trong khung quy hoạch thời kỳ 2021–2030, tầm nhìn đến 2050 (Thủ tướng phê duyệt tại Quyết định 1569/QĐ-TTg ngày 12/12/2024), Thủ đô được tổ chức theo mô hình đa cực – đa trung tâm: hạt nhân chính trị – hành chính tại lõi Hà Nội, các đô thị vệ tinh và đô thị đối trọng tại các tỉnh liên kết vùng. Hưng Yên nằm trên hướng Đông sông Hồng — cửa ngõ nối lõi Thủ đô với hành lang kinh tế ven biển Hà Nội – Hải Phòng – Quảng Ninh.

Trong truyền thông thị trường, địa danh này thường được gọi như lớp “quận phía Đông” mở rộng. Cách đọc chuyên môn chính xác hơn: Hưng Yên là đô thị vệ tinh / đối trọng trên trục Đông – Đông Nam, nơi quỹ đất và nhà chung cư mới tiếp nhận một phần áp lực dân số và nhu cầu an cư từ Long Biên – Gia Lâm, đồng thời hưởng lợi từ luồng logistics hướng cảng biển. Đối chiếu khung năm trục: [Năm trục tăng trưởng Vùng Thủ đô Hà Nội](${PILLAR_HREF}). Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Ly tâm bờ Đông sông Hồng khác ly tâm vành đai thế nào?

Ly tâm ở đây là dịch chuyển dần sang phía Đông sông Hồng — Gia Lâm, Long Biên và tiếp nối Hưng Yên — nơi quỹ nhà chung cư / đô thị mới và việc làm logistics – công nghiệp gặp nhau. Khác với logic “nút giao vành đai” thuần đường bộ, hành lang Đông – Đông Nam gắn thêm cửa ngõ cảng biển Hải Phòng và vùng di sản – dịch vụ Quảng Ninh.

Ba lớp địa lý thường gặp trên cùng hướng Đông:

1. Lớp cận lõi (Long Biên / Gia Lâm): mật độ đô thị và tiện ích xã hội dày hơn; phút di chuyển vào nội đô ngắn hơn vào giờ thấp điểm, nhưng vẫn phụ thuộc nút cầu và giờ cao điểm.
2. Lớp đệm Hưng Yên (cửa ngõ cao tốc / đường tỉnh): nhạy với tiến độ kết nối Hà Nội – Hải Phòng và các nút giao địa phương — phù hợp người chấp nhận đi xa hơn để đổi không gian sống.
3. Lớp hành lang ven biển (Hải Phòng – Quảng Ninh): động lực logistics và dịch vụ dài hạn — không nên đánh đồng chu kỳ với nhà chung cư gần sông Hồng.

Không có chỉ số “% tăng giá chuẩn” cho cả ba lớp trong bài này. Thay vào đó, hỏi: chỗ làm / trường học nằm lớp nào; thời gian đi thực tế giờ cao điểm; và pháp lý dự án (sổ đỏ / phân khúc NOXH hay thương mại) đã rõ chưa.

${EDITORIAL_FIGURES.metroHub}

## Quyết định 1569/QĐ-TTg ảnh hưởng đến phân kỳ đầu tư trục Đông thế nào?

Đồ án quy hoạch phê duyệt tại QĐ 1569/QĐ-TTg định hướng cấu trúc chùm đô thị hướng tâm: Hà Nội là hạt nhân, các đô thị tỉnh xung quanh được phân vai chức năng để chia sẻ áp lực dân số và hạ tầng nội đô lịch sử. Trên trục Đông – Đông Nam, phân vai này gắn với:

- Hành lang công nghiệp – logistics hướng cảng biển (Hải Phòng, Quảng Ninh).
- Đô thị vệ tinh tiếp nhận nhu cầu an cư ly tâm (Hưng Yên, một phần Gia Lâm).
- Kết nối liên vùng qua cao tốc CT.04 (QL5B) đã vận hành — chi tiết hạ tầng: [Cao tốc 5B và hành lang kinh tế ven biển](/tin-tuc/kien-thuc/${SLUG_MACRO}).

Phân kỳ đầu tư trên trục này không đồng nhất: ô đất ven cao tốc, nhà chung cư trong đại đô thị và thửa đất nông nghiệp chờ quy hoạch có chu kỳ pháp lý và rủi ro khác nhau. Người theo dõi quy hoạch cần tách bạch lớp thể chế (văn bản phê duyệt) và lớp vật chất (hạ tầng đã / đang thi công) trước khi thẩm định từng sản phẩm.

${EDITORIAL_FIGURES.thuThiem}

## Khu vực Ocean City trên trục Đông — nên đọc như thế nào?

Trên trục phía Đông, cụm đại đô thị quanh khu vực thường được truyền thông gọi là Ocean City / Ocean Park (các giai đoạn 1–2–3) là tham chiếu không gian sống quy mô lớn: nhà chung cư, tiện ích nội khu và mật độ cư dân đồng bộ theo từng phân khu. House X dùng tên vùng này như mốc địa lý định tính — không công bố bảng giá căn hộ, không suy ra biên độ tăng giá từ tin hạ tầng.

Cách đọc đúng:

- Phân biệt phân khu đã bàn giao / đang vận hành với phân khu mới mở bán.
- Đo phút di chuyển từ thửa đất hoặc nhà chung cư đến chỗ làm, trường học và nút cao tốc — không chỉ khoảng cách km trên bản đồ.
- Đối chiếu pháp lý độc lập của từng sản phẩm, không “ăn theo” tên thương mại khu vực.

Bài thẩm định cùng hành lang sẽ đi sâu checklist pháp lý và cộng đồng cư dân: [Đánh giá đại đô thị / nhà chung cư trục phía Đông](/tin-tuc/kien-thuc/${SLUG_REALITY}).

## Dịch chuyển không gian trên trục Đông — tín hiệu nào đáng theo dõi trước khi thẩm định dự án?

Checklist định tính (không phải công thức lợi nhuận):

- Tiến độ cao tốc / đường nối và các nút giao có công bố rõ giai đoạn không? Bài quy hoạch – thể chế: [Cao tốc 5B và hành lang kinh tế ven biển](/tin-tuc/kien-thuc/${SLUG_MACRO}).
- Dự án nhà ở có pháp lý độc lập (quy hoạch, giấy phép, điều kiện chuyển nhượng) không?
- Thời gian di chuyển giờ cao điểm từ ô đất / nhà chung cư đến chỗ làm có chấp nhận được không?
- Đã loại trừ nhầm với trục Nội Bài – Bắc sông Hồng hoặc Vành đai 4 chưa? Khung năm trục: [pillar Vùng Thủ đô](${PILLAR_HREF}).

${EDITORIAL_FIGURES.bitexcoMetro}

## Nên đọc tiếp bài nào trên cùng trục Đông – Đông Nam?

| Lớp đọc | Câu hỏi chuyên môn | Bài House X |
|---------|--------------------|-------------|
| Dịch chuyển không gian (bài này) | Hưng Yên và bờ Đông trong cấu trúc vệ tinh? | Bạn đang đọc |
| Quy hoạch – thể chế | Cao tốc 5B và hành lang ven biển? | [Cao tốc 5B – hành lang ven biển Đông Nam](/tin-tuc/kien-thuc/${SLUG_MACRO}) |
| Thẩm định dự án | Đánh giá đại đô thị / nhà chung cư thế nào? | [Dự án đại đô thị trục phía Đông](/tin-tuc/kien-thuc/${SLUG_REALITY}) |

${NORTHERN_SUPPORT_CLOSING}

Khung đối chiếu: [Năm trục tăng trưởng Vùng Thủ đô](${PILLAR_HREF}) · Chủ đề: [${HUB_HREF}](${HUB_HREF})

*Logic ly tâm và tên vùng Ocean City / Ocean Park là tham chiếu địa lý định tính — không thay thế bảng giá CĐT hay thẩm định độc lập.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-22T10:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Dịch chuyển không gian bờ Đông sông Hồng — Hưng Yên vệ tinh Vùng Thủ đô | HouseX",
    seoDesc:
      "Hưng Yên trong khung QĐ 1569/QĐ-TTg và chùm đô thị hướng tâm; ly tâm sông Hồng; vùng Ocean City định tính — không bịa biên độ giá căn hộ.",
    tags: [NOXH_TAG_HN_EAST],
    projects: [],
  },
  {
    id: "article-hn-east-01-macro",
    slug: SLUG_MACRO,
    title:
      "Cao tốc CT.04 (QL5B) và hành lang kinh tế ven biển: Khung hạ tầng trục Đông Nam Vùng Thủ đô",
    excerpt:
      "CT.04 / QL5B Hà Nội – Hải Phòng ~105,5 km thông xe 2015; kết nối tiếp cao tốc Hải Phòng – Quảng Ninh; đường nối cao tốc với đường bộ ven biển tại Hải Phòng hướng khởi công khoảng 12/2026 (Báo Đầu tư / địa phương).",
    body: `## Cao tốc 5B đóng vai trò gì trong cấu trúc hạ tầng trục Đông – Đông Nam?

Đường cao tốc Hà Nội – Hải Phòng (ký hiệu toàn tuyến [CT.04](https://vi.wikipedia.org/wiki/%C4%90%C6%B0%E1%BB%9Dng_cao_t%E1%BB%91c_H%C3%A0_N%E1%BB%99i_%E2%80%93_H%E1%BA%A3i_Ph%C3%B2ng), còn gọi Quốc lộ 5B) là xương sống đường bộ nối lõi Thủ đô với cụm cảng Hải Phòng. Trong khung Quyết định 1569/QĐ-TTg, hành lang Đông – Đông Nam được định hướng như trục liên kết Thủ đô – công nghiệp – cảng biển; CT.04 là lớp hạ tầng đã vận hành — khác các tuyến còn trên giấy — giúp đọc phút di chuyển vùng thay vì chỉ nhìn bán kính nội đô.

Với người theo dõi quy hoạch, cao tốc này không phải “tin hạ tầng” rời rạc mà là công cụ thực thi cấu trúc chùm đô thị hướng tâm: kết nối hạt nhân Hà Nội với đô thị vệ tinh Hưng Yên, cụm cảng Hải Phòng và không gian dịch vụ – di sản Quảng Ninh. Đối chiếu khung năm trục: [Năm trục tăng trưởng Vùng Thủ đô Hà Nội](${PILLAR_HREF}). Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## CT.04 / QL5B dài bao nhiêu — thông xe khi nào?

Theo công bố và tổng hợp chính thống, tuyến cao tốc Hà Nội – Hải Phòng dài khoảng 105,5 km, đi qua Hà Nội, Hưng Yên, Hải Dương và Hải Phòng; thông xe toàn tuyến ngày 5/12/2015 ([Vidifi / Bộ GTVT thời điểm công bố](http://www.vidifi.vn/tin-tuc/tin-cao-toc-hn-hp/3433-thong-xe-toan-tuyen-du-an-duong-o-to-cao-toc-ha-noi-hai-phong.html), [Wikipedia tổng hợp](https://vi.wikipedia.org/wiki/%C4%90%C6%B0%E1%BB%9Dng_cao_t%E1%BB%91c_H%C3%A0_N%E1%BB%99i_%E2%80%93_H%E1%BA%A3i_Ph%C3%B2ng)).

| Chỉ số | Tham chiếu |
|--------|------------|
| Ký hiệu | CT.04 (QL5B) |
| Chiều dài | ~105,5 km |
| Thông xe toàn tuyến | 5/12/2015 |
| Vai trò vùng | Lõi Hà Nội ↔ cửa ngõ cảng Hải Phòng |

Khi tuyến đã khai thác ổn định, giá trị với cư dân chủ yếu nằm ở rút ngắn thời gian vùng và giảm tải Quốc lộ 5 — không tự động quy đổi thành “mọi thửa đất ven cao tốc đều tăng giá”.

${EDITORIAL_FIGURES.metroViaduct}

## Quốc lộ 5 và cao tốc CT.04 — hai lớp kết nối cần phân biệt thế nào?

Trên cùng hành lang Đông – Đông Nam, Quốc lộ 5 (QL5) và cao tốc CT.04 (QL5B) phục vụ hai nhóm nhu cầu khác nhau:

| Tuyến | Vai trò tham chiếu |
|-------|-------------------|
| Quốc lộ 5 | Trục truyền thống, mật độ dân cư và dịch vụ ven đường dày; phụ thuộc nút giao và giờ cao điểm |
| Cao tốc CT.04 (QL5B) | Liên vùng tốc độ cao, rút ngắn thời gian Hà Nội – Hải Phòng; giảm áp lực QL5 |

Người thẩm định nhà ở cần đo phút di chuyển thực tế từ ô đất / nhà chung cư đến nút lên cao tốc và đến chỗ làm — không chỉ khoảng cách km trên bản đồ. Hai tuyến song hành nhưng không đồng nhất về mật độ đô thị ven đường và chu kỳ phát triển dự án.

${EDITORIAL_FIGURES.metroHub}

## Kết nối Hải Phòng – Quảng Ninh và hành lang ven biển nghĩa là gì?

Tại đầu Hải Phòng, cao tốc Hà Nội – Hải Phòng nối tiếp hệ thống cao tốc hướng Hạ Long / Quảng Ninh (thường được nhắc như mắt xích CT.06 / hành lang Hà Nội – Hải Phòng – Quảng Ninh). Nhờ đó, trục Đông Nam không dừng ở cảng Đình Vũ mà mở sang vùng dịch vụ – du lịch – logistics ven biển Đông Bắc Bộ.

Người theo dõi quy hoạch nên tách hai lớp:

1. Lớp đường bộ cao tốc đã thông: lợi ích tiếp cận việc làm logistics / cảng và dịch chuyển vùng đã đo được bằng phút di chuyển.
2. Lớp đường bộ ven biển và các đoạn nối mới: động lực dài hạn, phụ thuộc tiến độ GPMB và khởi công từng gói — đọc theo công bố địa phương, không theo tin đồn.

${EDITORIAL_FIGURES.bitexcoMetro}

## Đường nối cao tốc Hà Nội – Hải Phòng với đường bộ ven biển tại Hải Phòng đang ở đâu?

Theo báo chí kinh tế và cập nhật địa phương, UBND TP Hải Phòng đã phê duyệt chủ trương tuyến đường nối từ cao tốc Hà Nội – Hải Phòng đến nút giao đường bộ ven biển (gắn đoạn CT.08 Ninh Bình – Hải Phòng trên địa bàn), chiều dài khoảng 7,5–7,55 km, tổng mức đầu tư khoảng hơn 4.300 tỷ đồng, giai đoạn thực hiện 2026–2028; hướng khởi công khoảng tháng 12/2026 ([Báo Đầu tư](https://baodautu.vn/hai-phong-dau-tu-hon-6368-ty-dong-xay-tuyen-duong-noi-cao-toc-voi-duong-ven-bien-va-cau-van-uc-2-d493065.html), [Dân trí](https://dantri.com.vn/thoi-su/hai-phong-dau-tu-hon-4300-ty-dong-lam-duong-noi-cao-toc-voi-ven-bien-20260129165805747.htm)).

Đây là mắt xích hoàn thiện hành lang ven biển phía Nam Hải Phòng — tín hiệu hạ tầng vùng, không phải tín hiệu giá nhà chung cư từng tòa ở Hưng Yên. Khi cần tra cứu tiến độ, ưu tiên công bố Ban QLDA giao thông Hải Phòng và cổng thông tin địa phương.

## Người theo dõi quy hoạch trên trục Đông Nam nên đọc tiếp bài nào?

| Lớp đọc | Câu hỏi chuyên môn | Bài House X |
|---------|--------------------|-------------|
| Quy hoạch – thể chế (bài này) | Cao tốc 5B và ven biển? | Bạn đang đọc |
| Dịch chuyển không gian | Hưng Yên và bờ Đông trong cấu trúc vệ tinh? | [Di dân “quận phía Đông” Hưng Yên](/tin-tuc/kien-thuc/${SLUG_POTENTIAL}) |
| Thẩm định dự án | Đánh giá đại đô thị / nhà chung cư? | [Dự án đại đô thị trục phía Đông](/tin-tuc/kien-thuc/${SLUG_REALITY}) |

${NORTHERN_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.noxhEligibility}

*Chiều dài tuyến, tổng mức và mốc khởi công theo công bố / báo chí tại thời điểm biên tập — có thể điều chỉnh theo quyết định mới của cơ quan nhà nước.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-20T09:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/concept-b-metro-viaduct-day.png",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Cao tốc 5B (CT.04) & hành lang ven biển Đông Nam Vùng Thủ đô 2026 | HouseX",
    seoDesc:
      "QL5B HN–HP ~105,5 km thông 2015; nối HP–QN; đường nối cao tốc–ven biển HP hướng khởi công ~12/2026 (Báo Đầu tư).",
    tags: [NOXH_TAG_HN_EAST],
    projects: [],
  },
  {
    id: "article-hn-east-03-reality",
    slug: SLUG_REALITY,
    title:
      "Thẩm định đại đô thị và nhà chung cư trục phía Đông: Khung pháp lý và không gian sống",
    excerpt:
      "Khung 40-30-30: kết nối–không gian sống–pháp lý; so sánh định tính quanh Ocean Park 1/2/3; checklist sổ đỏ và cộng đồng cư dân — không bịa bảng giá căn hộ.",
    body: `## Làm sao thẩm định nhà chung cư / đại đô thị trục phía Đông mà không bị “tin khu đô thị”?

Trên hành lang Đông – Đông Nam, khung thẩm định House X ưu tiên tỷ lệ khoảng 40-30-30:

1. Khoảng 40% — kết nối và không gian sống: phút di chuyển giờ cao điểm; mật độ tiện ích nội khu; hướng căn / cộng đồng cư dân.
2. Khoảng 30% — pháp lý và so sánh định tính: phân khúc (thương mại / NOXH), chính sách thanh toán công bố, đối chiếu cùng khu vực — không bịa số tuyệt đối từng căn.
3. Khoảng 30% — tài chính sở hữu và hỗ trợ: vốn tự có, vay, phí quản lý, điều kiện chuyển nhượng.

Đây là lớp thẩm định dự án trong chuỗi ba lớp đọc: sau quy hoạch – thể chế ([Cao tốc 5B – hành lang ven biển](/tin-tuc/kien-thuc/${SLUG_MACRO})) và dịch chuyển không gian ([Hưng Yên / bờ Đông sông Hồng](/tin-tuc/kien-thuc/${SLUG_POTENTIAL})). Khung năm trục: [pillar Vùng Thủ đô](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Ocean Park 1 / 2 / 3 — dùng làm tham chiếu vùng thế nào?

Cụm Ocean Park (các giai đoạn thường được gọi Ocean Park 1, 2, 3 trong vùng ảnh hưởng Ocean City phía Đông) là điểm neo địa lý quen thuộc trên trục Gia Lâm – Hưng Yên: nhà chung cư cao tầng, tiện ích nội khu và mật độ dân cư đã hình thành theo từng phân khu. House X chỉ dùng tên vùng này để định vị không gian sống — không liệt kê giá mở bán, không suy ra biên độ tăng giá từ báo chí thứ cấp.

Cách dùng đúng:

- Lấy phân khu đã có cư dân làm chuẩn trải nghiệm (đi bộ nội khu, trường, y tế, thương mại gần nhà).
- So các sản phẩm mới về pháp lý, tiến độ bàn giao và thời gian ra nút cao tốc / cầu — không so “tin đồn giá”.
- Nếu thuộc đối tượng nhà ở xã hội, đọc riêng điều kiện Luật Nhà ở; đừng lẫn với căn hộ thương mại cùng địa bàn.

${EDITORIAL_FIGURES.metroHub}

## Checklist pháp lý trước khi đặt cọc trên trục phía Đông?

1. Xác nhận phân khúc trên hợp đồng / CSBH: nhà chung cư thương mại hay nhà ở xã hội.
2. Đối chiếu quy hoạch phân khu / chỉ giới xây dựng và giấy tờ đủ điều kiện mua bán theo giai đoạn (không dựa lời giới thiệu miệng).
3. Hỏi rõ sổ đỏ / hình thức sở hữu, thời hạn và điều kiện chuyển nhượng.
4. Chạy thử giờ cao điểm từ dự án đến chỗ làm và trường học — ghi phút di chuyển thực tế.
5. Rà phí quản lý, chỗ để xe, tiến độ hạ tầng nội khu và bàn giao.
6. Nếu quan tâm thửa đất / nhà phố mặt đường phụ cận đại đô thị: ưu tiên pháp lý thửa đất rõ ràng hơn “ăn theo” tên khu đô thị.

${EDITORIAL_FIGURES.thuThiem}

## Cộng đồng cư dân và không gian sống — vì sao quan trọng hơn phối cảnh?

Đại đô thị chỉ bền khi mật độ cư dân và vận hành tiện ích theo kịp bàn giao. Ba tín hiệu định tính đáng xem:

- Tỷ lệ căn đã ở thật so với căn còn trống / giữ chỗ.
- Chất lượng vận hành: an ninh, vệ sinh, thang máy, không gian chung.
- Sự ổn định của nhóm cư dân (gia đình an cư so với dòng đầu cơ ngắn hạn) — quan sát qua thực tế nội khu, không qua lời quảng cáo.

House X không xếp hạng dự án bằng bảng giá bịa. Thay vào đó, neo đúng trục, đúng phút di chuyển, rồi mới so sản phẩm. Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${EDITORIAL_FIGURES.bitexcoMetro}

## Khi nào nên chọn trục Đông thay vì Nội Bài hoặc Vành đai 4?

| Nhu cầu | Hướng gợi ý |
|---------|-------------|
| Gần hành lang cao tốc HN–HP / hướng cảng – ven biển | Trục Đông – Đông Nam (series này) |
| Gần sân bay Nội Bài / Bắc sông Hồng | [Chủ đề Nội Bài – Bắc sông Hồng](/tin-tuc/kien-thuc/chu-de/truc-san-bay-noi-bai-bac-song-hong) |
| Nút giao vành đai vùng | Chủ đề Vành đai 4 trên [pillar năm trục](${PILLAR_HREF}) |

## Nên đọc tiếp bài nào trên cùng trục Đông – Đông Nam?

| Lớp đọc | Câu hỏi chuyên môn | Bài House X |
|---------|--------------------|-------------|
| Thẩm định dự án (bài này) | Pháp lý và không gian sống? | Bạn đang đọc |
| Quy hoạch – thể chế | Cao tốc 5B và ven biển? | [Cao tốc 5B – hành lang ven biển Đông Nam](/tin-tuc/kien-thuc/${SLUG_MACRO}) |
| Dịch chuyển không gian | Hưng Yên và bờ Đông trong cấu trúc vệ tinh? | [Di dân “quận phía Đông” Hưng Yên](/tin-tuc/kien-thuc/${SLUG_POTENTIAL}) |

${NORTHERN_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.noxhEligibility}

*Không dùng bài này như danh mục giá căn hộ Ocean Park / Ocean City. Mọi quyết định mua bán cần đối chiếu CSBH và pháp lý tại thời điểm giao dịch.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-24T11:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/urban-skyline-golden-hour.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Đại đô thị & nhà chung cư trục Đông Hà Nội 2026 — checklist pháp lý | HouseX",
    seoDesc:
      "Khung 40-30-30; Ocean Park 1/2/3 làm tham chiếu vùng; checklist sổ đỏ / phút di chuyển — không bịa bảng giá căn hộ.",
    tags: [NOXH_TAG_HN_EAST],
    projects: [],
  },
];
