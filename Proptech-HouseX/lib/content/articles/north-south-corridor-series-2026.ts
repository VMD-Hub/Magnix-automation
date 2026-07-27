import { NOXH_TAG_NORTH_SOUTH } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");
const TTGH_SLUG = "thu-thiem-green-house-thu-duc";
const TTGH_NAME = "Thủ Thiêm Green House";
const TTGH_HREF = `/du-an/${TTGH_SLUG}`;
const PILLAR_HREF =
  "/wiki-nha-o-xa-hoi/bon-cuc-tang-truong-do-thi-tp-hcm-2026";

/**
 * Series hành lang Bắc–Nam dọc sông Sài Gòn — phễu Vĩ mô → Tiềm năng → Thực tế.
 * Số liệu quy hoạch / cảng: tổng hợp công bố chính thức & báo chí — admin xác minh trước L3.
 */
export const NORTH_SOUTH_CORRIDOR_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-north-south-01",
    slug: "truc-doc-song-sai-gon-hanh-lang-kinh-te-ty-do-2026",
    title:
      "Đột phá quy hoạch trục dọc sông Sài Gòn: Khi dòng sông trở thành hành lang kinh tế tỷ đô",
    excerpt:
      "Quyết định 1125/QĐ-TTg (11/6/2025) định hình hành lang dọc sông Sài Gòn là mặt tiền đô thị; trục ven sông – Huỳnh Tấn Phát trong nhóm 4 trục Bắc–Nam; tuyến đường ven sông tham chiếu >78 km và đề án kè sông / kinh tế dịch vụ ven sông.",
    body: `## Vì sao trục dọc sông Sài Gòn được gọi là hành lang kinh tế tỷ đô?

Sông Sài Gòn không còn chỉ là ranh giới hành chính hay tuyến giao thông thủy. Trong Đồ án điều chỉnh quy hoạch chung TP.HCM đến năm 2040, tầm nhìn đến 2060 — được Thủ tướng phê duyệt tại [Quyết định 1125/QĐ-TTg ngày 11/6/2025](https://thuvienphapluat.vn/) — hành lang dọc sông được định vị như mặt tiền đô thị: nơi quy tụ dịch vụ, du lịch, không gian công cộng và giao thông đa phương thức từ phía Bắc về Nhà Bè – Cần Giờ.

Với người tìm chỗ ở lâu dài, câu chuyện không phải “mua view sông cho đẹp”, mà là sống trên một hành lang đang được thiết kế lại thành xương sống kinh tế – cảnh quan của siêu đô thị đa trung tâm. Đối chiếu khung 6 trục tăng trưởng: [Sáu trục tăng trưởng đô thị TP.HCM](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Quyết định 1125/QĐ-TTg nói gì về quy hoạch chung TP.HCM đến 2040?

Quyết định 1125/QĐ-TTg ngày 11 tháng 6 năm 2025 phê duyệt Đồ án điều chỉnh quy hoạch chung Thành phố Hồ Chí Minh đến năm 2040, tầm nhìn đến năm 2060. Đây là lớp khung pháp lý vĩ mô để các đồ án phân khu, đề án kè sông và dự án giao thông ven sông bám theo — thay vì phát triển manh mún theo từng đoạn sông.

Báo chí chính thống đã khái quát hướng “sông trong lòng đô thị”: phát triển kinh tế dịch vụ, du lịch và giao thông thủy gắn với không gian công cộng hai bên bờ ([Nhân Dân](https://nhandan.vn/), [HTV](https://www.htv.vn/)). Khi cần tra cứu chỉ tiêu sử dụng đất và lộ trình từng giai đoạn, đối chiếu văn bản gốc trên cổng pháp luật.

| Lớp | Nội dung tham chiếu |
|-----|---------------------|
| Khung pháp lý | QD 1125/QĐ-TTg (11/6/2025) — QHC TP.HCM đến 2040, tầm nhìn 2060 |
| Vai trò sông | Hành lang mặt tiền đô thị, không chỉ là ranh giới hành chính |
| Hướng phát triển | Dịch vụ – du lịch – giao thông thủy – không gian công cộng ven sông |

## Bốn trục Bắc–Nam trong quy hoạch gồm những gì — trục ven sông nằm ở đâu?

Trong nhóm trục Bắc–Nam của đồ án điều chỉnh, trục ven sông Sài Gòn – Huỳnh Tấn Phát được nhắc như một trong các xương sống liên kết lõi trung tâm với phía Nam thành phố. Khác Quốc lộ 13 (Đông Bắc) hay hành lang sân bay Long Thành, trục này lấy sông làm trục cảnh quan và kinh tế dịch vụ — ưu tiên mặt tiền nước, kè sông và tuyến đường ven sông đồng bộ.

Người mua nhà nên phân biệt rõ: sống trên hành lang Bắc–Nam sông Sài Gòn là logic “ven sông – hướng biển”, không cùng một thị trường với căn hộ dọc QL13 Lái Thiêu hay đô thị vệ tinh Nhơn Trạch. Hub chủ đề: [/wiki-nha-o-xa-hoi/chu-de/hanh-lang-bac-nam-song-sai-gon](/wiki-nha-o-xa-hoi/chu-de/hanh-lang-bac-nam-song-sai-gon).

${EDITORIAL_FIGURES.metroHub}

## Tuyến đường ven sông dài hơn 78 km thay đổi gì cho mặt tiền đô thị?

Tham chiếu công bố và tổng hợp báo chí về đề án phát triển dọc sông, tuyến đường ven sông Sài Gòn được nhắc với chiều dài tham chiếu trên 78 km — đủ dài để nối các đoạn cảnh quan, nút giao và quỹ đất dịch vụ thành một hành lang liên tục thay vì các “điểm nóng” rời rạc. Khi tuyến và kè sông đồng bộ, giá trị mặt tiền nước và khả năng tiếp cận không gian công cộng tăng theo lớp hạ tầng, không chỉ theo “tin đồn dự án”.

Lưu ý biên tập: số liệu chiều dài, phân đoạn GPMB và tiến độ từng gói thầu có thể thay đổi theo phê duyệt chi tiết — luôn kiểm tra công bố mới nhất của UBND TP.HCM và cơ quan chuyên môn trước khi đưa vào quyết định mua bán.

## Đề án kè sông và kinh tế dịch vụ ven sông mang lại lợi ích gì cho cư dân?

Ba lớp giá trị thường được nhắc cùng lúc:

1. Cảnh quan và chống sạt lở: kè sông tạo mặt cắt đô thị ổn định, mở lối đi bộ / xe đạp ven nước.
2. Kinh tế dịch vụ: chuỗi F&B, du lịch trong ngày, bến thủy nội đô — tăng mật độ việc làm gần chỗ ở.
3. Kết nối thủy – bộ: giảm phụ thuộc một trục đường bộ duy nhất khi các nút cầu và đường ven sông hoàn thiện.

Neo nhẹ trên House X ở phía Đông hành lang sông: [Thủ Thiêm Green House](${TTGH_HREF}) — NOXH mặt tiền Võ Chí Công, chân cầu Phú Mỹ, phường Thạnh Mỹ Lợi, TP. Thủ Đức. Đây là điểm neo pháp lý / giá tham chiếu CĐT trong cùng vùng ảnh hưởng sông – cầu Phú Mỹ, không phải “biệt thự ven sông hạng sang”.

${EDITORIAL_FIGURES.thuThiem}

## Người tìm nhà nên đọc tiếp bài nào trên cùng hành lang?

| Tầng phễu | Câu hỏi | Bài House X |
|-----------|---------|-------------|
| Vĩ mô (bài này) | Quy hoạch sông và trục Bắc–Nam? | Bạn đang đọc |
| Tiềm năng | Vì sao dòng tiền đổ Nam Sài Gòn – Cần Giờ? | [Ly tâm BĐS Nam Sài Gòn – Cần Giờ](/wiki-nha-o-xa-hoi/ly-tam-bds-nam-sai-gon-can-gio-dong-tien-2026) |
| Thực tế | Đánh giá dự án ven sông thế nào? | [Top căn hộ / biệt thự ven sông Nam Sài Gòn](/wiki-nha-o-xa-hoi/top-du-an-can-ho-biet-thu-ven-song-nam-sai-gon-2026) |

House X tư vấn hồ sơ nhà ở xã hội và định hướng chọn trục trước khi so dự án — [đăng ký ngay](/lien-he).

${EDITORIAL_FIGURES.bitexcoMetro}

Khung đối chiếu: [Sáu trục tăng trưởng đô thị TP.HCM](${PILLAR_HREF}) · Hub: [/wiki-nha-o-xa-hoi/chu-de/hanh-lang-bac-nam-song-sai-gon](/wiki-nha-o-xa-hoi/chu-de/hanh-lang-bac-nam-song-sai-gon)

*Chỉ tiêu quy hoạch, chiều dài tuyến ven sông và tiến độ kè sông theo công bố cơ quan nhà nước — có thể điều chỉnh theo đồ án chi tiết.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-20T09:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/hcmc-skyline-river-day.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Trục dọc sông Sài Gòn 2026 — hành lang kinh tế tỷ đô, QD 1125 | HouseX",
    seoDesc:
      "QD 1125/QĐ-TTg 11/6/2025: hành lang ven sông mặt tiền đô thị; trục sông Sài Gòn – Huỳnh Tấn Phát; đường ven sông >78 km và đề án kè sông / dịch vụ ven sông.",
    tags: [NOXH_TAG_NORTH_SOUTH],
    projects: [{ slug: TTGH_SLUG, name: TTGH_NAME }],
  },
  {
    id: "article-north-south-02",
    slug: "ly-tam-bds-nam-sai-gon-can-gio-dong-tien-2026",
    title:
      "Xu hướng ly tâm bất động sản: Vì sao dòng tiền thông minh đang đổ về Nam Sài Gòn và Cần Giờ?",
    excerpt:
      "Siêu cảng trung chuyển quốc tế Cần Giờ (QD 148/QĐ-TTg 16/1/2025; NĐT liên danh VIMC – Cảng Sài Gòn – TIL/MSC, ~128.873 tỷ, ~571 ha) kéo logic ly tâm về Q7 – Nhà Bè – Cần Giờ — khác cửa ngõ QL13 và hành lang sân bay.",
    body: `## Ly tâm Nam Sài Gòn nghĩa là gì — khác “sốt đất” ven vành đai thế nào?

Ly tâm ở đây là dịch chuyển nhu cầu ở và làm việc theo hành lang hạ tầng dài hạn về phía Nam thành phố: Quận 7, Nhà Bè, hướng Cần Giờ — nơi sông, cảng và đô thị dịch vụ gặp nhau. Không phải mọi “tin hạ tầng” đều tạo cùng một dòng tiền: hành lang Bắc–Nam sông Sài Gòn gắn logistics biển / cảng trung chuyển; QL13 gắn cửa ngõ Đông Bắc và chuyên gia KCN; sân bay Long Thành gắn đô thị sân bay.

Chọn đúng trục trước khi so sánh dự án — khung tổng quan: [Sáu trục tăng trưởng đô thị TP.HCM](${PILLAR_HREF}). Bài vĩ mô sông: [Trục dọc sông Sài Gòn — hành lang kinh tế tỷ đô](/wiki-nha-o-xa-hoi/truc-doc-song-sai-gon-hanh-lang-kinh-te-ty-do-2026).

${EDITORIAL_FIGURES.hcmSkyline}

## Cảng trung chuyển quốc tế Cần Giờ được phê duyệt chủ trương như thế nào?

Ngày 16/1/2025, Thủ tướng ban hành [Quyết định 148/QĐ-TTg](https://chinhphu.vn/) về chủ trương đầu tư dự án cảng trung chuyển quốc tế Cần Giờ — lớp pháp lý mở đường cho hồ sơ nhà đầu tư và các bước chấp thuận tiếp theo. Đây là dự án logistics biển quy mô lớn, định vị trung chuyển container quốc tế gắn vùng TP.HCM – Đông Nam Bộ, không phải “khu đô thị nghỉ dưỡng ven biển” thuần túy.

Truyền thông chuyên ngành logistics và báo chí kinh tế đã theo dõi tiến độ chủ trương và năng lực thiết kế ([logistics.gov.vn](https://logistics.gov.vn/), [Báo Đầu tư](https://baodautu.vn/), [Thanh Niên](https://thanhnien.vn/)). Người mua nhà nên đọc cảng như động lực việc làm – logistics dài hạn, không quy đổi thẳng thành “% tăng giá căn hộ” trong ngắn hạn.

## Ai là nhà đầu tư liên danh — tổng mức và quy mô đất tham chiếu?

Theo công bố liên quan chấp thuận của UBND TP.HCM ngày 29/4/2026, nhà đầu tư liên danh được nhắc gồm VIMC, Cảng Sài Gòn và đối tác TIL/MSC. Các chỉ số quy mô thường được truyền thông tổng hợp:

| Chỉ số | Tham chiếu công bố / báo chí |
|--------|------------------------------|
| Tổng mức đầu tư | Khoảng 128.873 tỷ đồng |
| Quy mô đất | Khoảng 571 ha |
| Công suất giai đoạn | Khoảng 4,8 triệu TEU năm 2030 |
| Công suất tầm nhìn | Khoảng 16,9 triệu TEU năm 2047 |

Nguồn đối chiếu: [Chính phủ](https://chinhphu.vn/), [Thanh Niên](https://thanhnien.vn/), [logistics.gov.vn](https://logistics.gov.vn/), [Báo Đầu tư](https://baodautu.vn/). Số liệu có thể được điều chỉnh theo hồ sơ kỹ thuật và phê duyệt giai đoạn — không dùng làm cam kết lợi nhuận BĐS.

${EDITORIAL_FIGURES.bitexcoMetro}

## Quận 7, Nhà Bè và Cần Giờ hưởng lợi khác nhau ra sao?

Ba lớp địa lý trên cùng hành lang Nam:

1. Quận 7 / khu vực đô thị hóa cao (gồm vùng ảnh hưởng Phú Mỹ Hưng): thị trường căn hộ và thương mại đã chín — thanh khoản và tiện ích dày; biên độ “tin mới” thường gắn cải thiện kết nối hơn là “vùng trũng giá”.
2. Nhà Bè: lớp đệm giữa lõi Nam và hướng biển / cảng — nhạy với đường ven sông, cầu và quỹ đất thấp tầng / hỗn hợp theo quy hoạch chi tiết.
3. Cần Giờ: động lực logistics và sinh thái dài hạn — chu kỳ đầu tư gắn tiến độ cảng và hạ tầng tiếp cận, không nên đánh đồng với căn hộ trung tâm Q7.

Không có chỉ số giá “chuẩn” duy nhất cho cả ba lớp trong bài này — House X tránh bịa chỉ số tăng giá %. Thay vào đó, hỏi: chỗ làm / trường học nằm lớp nào; thời gian đi thực tế giờ cao điểm; và pháp lý dự án thuộc phân khúc nào (NOXH, thương mại, thấp tầng).

## Dòng tiền “thông minh” nhìn vào tín hiệu nào trước khi xuống tiền?

Checklist định tính (không phải công thức lợi nhuận):

- Tiến độ pháp lý cảng và các gói hạ tầng tiếp cận có công bố rõ giai đoạn không?
- Dự án nhà ở có pháp lý độc lập, không “ăn theo” tin cảng một cách mơ hồ không?
- Có neo sản phẩm thật trên cùng hành lang để đối chiếu giá / điều kiện không — ví dụ NOXH [Thủ Thiêm Green House](${TTGH_HREF}) (Võ Chí Công, chân cầu Phú Mỹ) nếu bạn quan tâm phân khúc an cư có khung giá CĐT?
- Đã loại trừ nhầm với hành lang Đông–Tây Võ Văn Kiệt – Mai Chí Thọ hay sân bay Long Thành chưa?

${EDITORIAL_FIGURES.metroHub}

## Nên đọc tiếp bài thực tế hay đối chiếu trục khác?

Tầng thực tế cùng hành lang: [Top dự án căn hộ / biệt thự ven sông Nam Sài Gòn](/wiki-nha-o-xa-hoi/top-du-an-can-ho-biet-thu-ven-song-nam-sai-gon-2026). Đối chiếu Đông–Tây: [Trục Võ Văn Kiệt – Mai Chí Thọ](/wiki-nha-o-xa-hoi/truc-dong-tay-tphcm-vo-van-kiet-mai-chi-tho-2026).

House X hỗ trợ định hướng chọn trục và hồ sơ NOXH — [đăng ký ngay](/lien-he).

${EDITORIAL_FIGURES.thuThiem}

*Tổng mức đầu tư, diện tích và công suất TEU là tham chiếu công bố / báo chí tại thời điểm biên tập — xác minh lại trước khi dùng cho quyết định đầu tư.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-22T10:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Ly tâm BĐS Nam Sài Gòn – Cần Giờ 2026 — cảng trung chuyển | HouseX",
    seoDesc:
      "QD 148/QĐ-TTg; liên danh VIMC – Cảng Sài Gòn – TIL/MSC; ~128.873 tỷ, ~571 ha, ~4,8 triệu TEU (2030) — logic ly tâm Q7 / Nhà Bè / Cần Giờ.",
    tags: [NOXH_TAG_NORTH_SOUTH],
    projects: [],
  },
  {
    id: "article-north-south-03",
    slug: "top-du-an-can-ho-biet-thu-ven-song-nam-sai-gon-2026",
    title:
      "Top dự án căn hộ và biệt thự ven sông Nam Sài Gòn đáng đầu tư nhất hiện nay",
    excerpt:
      "Khung đánh giá dự án ven sông Nam Sài Gòn: pháp lý, kết nối, chủ đầu tư; spotlight NOXH Thủ Thiêm Green House (1,5–2,5 tỷ/căn tham chiếu CĐT); Phú Mỹ Hưng như chuẩn đô thị chín — không bịa bảng giá thương mại ngoài House X.",
    body: `## Làm sao đánh giá dự án căn hộ / biệt thự ven sông Nam Sài Gòn mà không bị “tin view sông”?

View sông là yếu tố cảm xúc — chưa đủ để quyết định. Trên hành lang Bắc–Nam, khung đánh giá thực tế nên gồm năm trụ:

1. Pháp lý và phân khúc: NOXH (đối tượng Luật Nhà ở) khác căn hộ thương mại và khác biệt thự / nhà phố.
2. Kết nối thật: thời gian đến chỗ làm / trường vào giờ cao điểm — không chỉ khoảng cách km trên bản đồ.
3. Chủ đầu tư và tiến độ: bàn giao, hạ tầng nội khu, tiện ích vận hành.
4. Rủi ro ngập / kè / cao độ: hỏi hồ sơ kỹ thuật và quy hoạch kè sông khu vực.
5. Thanh khoản và chi phí sở hữu: phí quản lý, chỗ đậu xe, khả năng chuyển nhượng theo loại hình.

Bối cảnh vĩ mô: [Trục dọc sông Sài Gòn](/wiki-nha-o-xa-hoi/truc-doc-song-sai-gon-hanh-lang-kinh-te-ty-do-2026). Dòng tiền / cảng: [Ly tâm Nam Sài Gòn – Cần Giờ](/wiki-nha-o-xa-hoi/ly-tam-bds-nam-sai-gon-can-gio-dong-tien-2026). Khung 6 trục: [Sáu trục tăng trưởng đô thị TP.HCM](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Phú Mỹ Hưng đóng vai trò gì — vì sao không liệt kê “top giá ảo”?

Khu đô thị Phú Mỹ Hưng (Quận 7) là tham chiếu chín về quy hoạch, tiện ích và thanh khoản phía Nam — nơi nhiều gia đình đối chiếu chuẩn sống đô thị ven sông / kênh. House X không bịa danh sách biệt thự / căn hộ thương mại ngoài hệ thống với giá chính xác từng căn: thị trường thứ cấp biến động theo từng tòa và thời điểm.

Cách dùng đúng: lấy Phú Mỹ Hưng làm chuẩn trải nghiệm (trường, y tế, thương mại, không gian công cộng), rồi so các dự án mới hoặc phân khúc khác về pháp lý – tổng vốn – thời gian di chuyển. Nếu cần tư vấn theo nhu cầu cụ thể, [liên hệ House X](/lien-he).

## Thủ Thiêm Green House — neo NOXH nào trên cùng vùng ảnh hưởng sông – cầu Phú Mỹ?

Trên House X, neo thực tế rõ pháp lý và giá tham chiếu CĐT là [Thủ Thiêm Green House](${TTGH_HREF}):

| Hạng mục | Tham chiếu CĐT / mock House X |
|----------|-------------------------------|
| Vị trí | Mặt tiền Võ Chí Công, chân cầu Phú Mỹ, Thạnh Mỹ Lợi, TP. Thủ Đức |
| Quy mô | ~20.875 m²; 3 block 8 tầng; 1.040 căn |
| Diện tích | 1–2PN khoảng 25–68 m² |
| Giá | Khoảng 1,5 – 2,5 tỷ/căn (tham chiếu CĐT) |
| Phân khúc | Nhà ở xã hội — điều kiện đối tượng theo Luật Nhà ở |

Đây không phải “biệt thự ven sông hạng sang”, nhưng là sản phẩm an cư có khung giá công bố trên hành lang kết nối Thủ Đức – Quận 7 – trung tâm qua cầu Phú Mỹ và các trục liên quan. Phù hợp người đủ điều kiện NOXH muốn neo gần mặt nước / cầu lớn mà không so giá với biệt thự thương mại.

${EDITORIAL_FIGURES.thuThiem}

## Checklist nhanh trước khi đặt cọc dự án “ven sông”?

1. Xác nhận phân khúc trên hợp đồng / CSBH: NOXH hay thương mại.
2. Chạy thử giờ cao điểm từ dự án đến chỗ làm và trường học.
3. Đối chiếu tiện ích bán kính hợp lý (siêu thị, y tế, trường) — đừng chỉ nhìn phối cảnh sông.
4. Hỏi rõ phí quản lý, chỗ để xe, tiến độ bàn giao và điều kiện vay.
5. Nếu NOXH: đọc [điều kiện mua nhà ở xã hội](/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat) trước khi nộp hồ sơ.

${EDITORIAL_FIGURES.metroHub}

## Khi nào nên chọn Nam Sài Gòn thay vì Đông–Tây hoặc QL13?

| Nhu cầu | Hướng gợi ý |
|---------|-------------|
| Ven sông / hướng biển – cảng Cần Giờ | Bắc–Nam sông Sài Gòn (series này) |
| Đi lại Đông–Tây, gần Võ Văn Kiệt – Mai Chí Thọ | [Trục Đông–Tây](/wiki-nha-o-xa-hoi/truc-dong-tay-tphcm-vo-van-kiet-mai-chi-tho-2026) |
| Cửa ngõ QL13 / Lái Thiêu / chuyên gia KCN | Series QL13 trên pillar [6 trục](${PILLAR_HREF}) |

House X đồng hành chọn trục và rà hồ sơ NOXH — [đăng ký ngay](/lien-he).

${EDITORIAL_FIGURES.bitexcoMetro}

Landing: [${TTGH_NAME}](${TTGH_HREF}) · Hub: [/wiki-nha-o-xa-hoi/chu-de/hanh-lang-bac-nam-song-sai-gon](/wiki-nha-o-xa-hoi/chu-de/hanh-lang-bac-nam-song-sai-gon)

*Giá NOXH là tham chiếu CĐT tại thời điểm biên tập — xác nhận bảng giá và điều kiện đối tượng trước khi đặt cọc. Không dùng bài này như danh mục giá thương mại Phú Mỹ Hưng.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-24T11:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/hcmc-skyline-river-day.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Căn hộ & biệt thự ven sông Nam Sài Gòn 2026 — khung chọn + TTGH | HouseX",
    seoDesc:
      "Checklist đánh giá dự án ven sông; spotlight Thủ Thiêm Green House 1,5–2,5 tỷ/căn; Phú Mỹ Hưng như chuẩn đô thị chín — không bịa giá thương mại.",
    tags: [NOXH_TAG_NORTH_SOUTH],
    projects: [{ slug: TTGH_SLUG, name: TTGH_NAME }],
  },
];
