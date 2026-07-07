import {
  NOXH_TAG_CHINH_SACH,
  NOXH_TAG_DU_AN_GIA,
} from "@/lib/content/articles/noxh-handbook-tags";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { NOXH_SUPPORT_CLOSING } from "@/lib/content/articles/article-editorial-voice";
import type { ArticleDetail } from "@/lib/data/article-types";
import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";
import {
  HAU_NGHIA_SLUG,
  LA_HOME_SLUG,
  MY_HANH_SLUG,
  ORI_SLUG,
  PHU_AN_SLUG,
  PVT_SLUG,
} from "@/lib/preview/noxh-long-an-projects";

const PUBLISHED = new Date("2026-07-03T00:00:00.000Z");
const UPDATED = new Date("2026-07-04T00:00:00.000Z");

const PHUC_LOC_THO_SLUG = "chung-cu-phuc-loc-tho-noxh";
const PHUC_LOC_THO_NAME = "Chung cư Phúc Lộc Thọ (Block C NOXH)";

/**
 * Cluster kiến thức NOXH — bổ sung pillar pháp lý, vay, quy trình, vùng/dự án.
 * Cấu trúc AIO: H2 dạng câu hỏi, trích Điều luật, bảng/bullet, nội link hub.
 */
export const NOXH_KNOWLEDGE_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-noxh-knowledge-01",
    slug: "quy-trinh-mua-thue-mua-noxh-2026",
    title:
      "Quy trình mua nhà ở xã hội 2026 — từ đăng ký đến ký hợp đồng và nhận căn",
    excerpt:
      "7 bước thực tế: rà soát đối tượng Đ.76, chuẩn bị hồ sơ, nộp đợt mở bán, xét duyệt, bốc thăm/chọn căn, ký HĐ mua/thuê mua, vay NHCSXH — căn cứ Luật Nhà ở và NĐ 100/2024.",
    body: `## Mua NOXH khác gì mua căn hộ thương mại?

Mua nhà ở xã hội (NOXH) là giao dịch có điều kiện: người mua phải thuộc nhóm đối tượng tại Điều 76 [Luật Nhà ở 2023](https://vanban.chinhphu.vn/?docid=209627&pageid=27160), đáp ứng điều kiện nhà ở và thu nhập tại Điều 78, rồi trải qua vòng rà soát của Sở Xây dựng/UBND và chủ đầu tư — không phải “chốt căn” ngay như thương mại.

Trước khi nộp hồ sơ, nên tự kiểm tra ba trụ cột pháp lý: [đối tượng, nhà ở, thu nhập](/tin-tuc/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat) hoặc dùng [công cụ kiểm tra NOXH](/cong-cu/dieu-kien-noxh).

## Các bước trong một đợt mở bán NOXH (thực tế 2025–2026)

| Bước | Việc cần làm | Cơ quan / bên liên quan |
| --- | --- | --- |
| 1 | Theo dõi thông báo mở đăng ký (giá, quỹ căn, thời hạn) | Sở Xây dựng, CĐT, báo chí |
| 2 | Xác định nhóm đối tượng Đ.76 và đối chiếu điều kiện nhà ở Đ.77/Đ.78 | Tự rà soát + công cụ HouseX |
| 3 | Xin giấy xác nhận thu nhập & đối tượng (12 tháng lương, HĐLĐ…) | Đơn vị công tác / Công an cấp xã |
| 4 | Nộp hồ sơ + phí (nếu có) đúng hạn — mỗi hộ một dự án tại một thời điểm | CĐT / điểm tiếp nhận đợt mở bán |
| 5 | Rà soát hồ sơ: đối tượng, thu nhập, nhà ở, cư trú/làm việc | Sở XĐ, UBND, CĐT |
| 6 | Công bố danh sách đủ điều kiện; bốc thăm / xếp hạng ưu tiên nếu vượt quỹ căn | Theo thông báo đợt |
| 7 | Ký hợp đồng mua/thuê mua, đóng tiền theo tiến độ, làm thủ tục vay (nếu có) | CĐT, ngân hàng liên kết / NHCSXH |

## Thuê mua và mua trực tiếp — khác nhau thế nào?

Theo Điều 78 và hướng dẫn tại [Nghị định 100/2024/NĐ-CP](https://vanban.chinhphu.vn/?docid=210760&pageid=27160), đối tượng khoản 1, 4, 5, 6, 7, 8, 9 và 10 Điều 76 có thể được mua hoặc thuê mua NOXH khi đủ điều kiện. Hình thức cụ thể (mua hay thuê mua, tỷ lệ trả trước, thời hạn chuyển quyền) do thông báo từng đợt và hợp đồng mẫu của CĐT quy định.

Điểm cần nhớ:

- Thuê mua thường giảm áp lực vốn ban đầu nhưng ràng buộc thời gian ở và điều kiện chuyển sở hữu.
- Mua trực tiếp yêu cầu vốn tự có hoặc vay lớn hơn ngay từ đầu — cần [ước tính khoản vay](/cong-cu/tinh-khoan-vay) trước khi cam kết.

## Ai được ưu tiên khi nhiều hồ sơ cùng đạt điều kiện?

Điều 79 Luật Nhà ở 2023 quy định nguyên tắc ưu tiên khi cùng tiêu chuẩn: người có công, người khuyết tật, hộ tái định cư, nữ giới… và thứ tự bố trí căn theo từng nhóm. Thực tế, dự án nội thành như [Lý Thường Kiệt](/du-an/nha-o-xa-hoi-ly-thuong-kiet) từng ghi nhận hơn 12.000 hồ sơ cho 755 suất — đủ điều kiện pháp lý chưa đồng nghĩa được chọn mua.

## Năm lỗi thường gặp ở bước nộp hồ sơ

- Đăng ký đồng thời hai dự án NOXH.
- Dùng mức thu nhập cũ (20/30/40 triệu) trong khi đợt áp dụng [NĐ 136/2026](https://vanban.chinhphu.vn/?classid=1&docid=217605&pageid=27160) (25/35/50 triệu từ 07/04/2026).
- Vợ/chồng đứng tên nhà ở nhưng kê khai “không sở hữu” — xem [điều kiện nhà ở Điều 78](/tin-tuc/dieu-kien-nha-o-mua-noxh-dieu-77-2026).
- Thiếu giấy xác nhận đơn vị hoặc nộp sau hạn.
- Không đọc phạm vi “không sở hữu nhà tại tỉnh có dự án” của từng đợt mở bán.

Bài liên quan: [Gói vay 120.000 tỷ NHCSXH](/tin-tuc/vay-noxh-goi-120000-ty-nhcsxh-2026) · [Lãi suất dưới 35 tuổi](/tin-tuc/lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026)

${NOXH_SUPPORT_CLOSING}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: UPDATED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "Quy trình mua NOXH 2026 — 7 bước từ đăng ký đến nhận căn | HouseX",
    seoDesc:
      "Hướng dẫn quy trình mua/thuê mua nhà ở xã hội: hồ sơ, rà soát, bốc thăm, ký HĐ. Căn cứ Luật Nhà ở 2023 và NĐ 100/2024.",
    tags: [NOXH_TAG_CHINH_SACH],
    projects: [],
  },
  {
    id: "article-noxh-knowledge-02",
    slug: "vay-noxh-goi-120000-ty-nhcsxh-2026",
    title:
      "Vay mua NOXH qua gói 120.000 tỷ NHCSXH — điều kiện, tỷ lệ 70% và ngân hàng",
    excerpt:
      "Ai được vay, hồ sơ cần có, tỷ lệ vay tối đa ~70% giá căn, lãi ưu đãi và khác biệt với vay thương mại — kèm link công cụ tính khoản vay HouseX.",
    body: `## Gói tín dụng 120.000 tỷ dành cho ai?

Chương trình tín dụng ưu đãi 120.000 tỷ đồng (thường gọi gói NHCSXH) hỗ trợ đối tượng nhà ở xã hội vay vốn mua, thuê mua NOXH hoặc tự xây/sửa nhà — căn cứ Điều 77 và Điều 78 [Luật Nhà ở 2023](https://vanban.chinhphu.vn/?docid=209627&pageid=27160) và hướng dẫn tại [Nghị định 100/2024/NĐ-CP](https://vanban.chinhphu.vn/?docid=210760&pageid=27160).

Đối tượng được xét vay gồm các nhóm khoản 1, 2, 3, 4, 5, 6, 7 và 8 Điều 76 — sau khi đã có hợp đồng mua/thuê mua NOXH và đáp ứng điều kiện vay theo quy định tổ chức tín dụng.

${EDITORIAL_FIGURES.dtaPhoiCanh}

## Vay được tối đa bao nhiêu phần trăm giá căn?

Thông lệ thị trường và chính sách CĐT nhiều dự án NOXH miền Nam (ví dụ [DTA Happy Home](/du-an/dta-happy-home-nhon-trach)) công bố hỗ trợ vay ngân hàng liên kết tới khoảng 70% giá trị căn, thời hạn tối đa 20 năm — tỷ lệ cụ thể phụ thuộc hồ sơ tín dụng và ngân hàng thẩm định.

| Hạng mục | Tham chiếu thực tế | Ghi chú |
| --- | --- | --- |
| Tỷ lệ vay | Thường 50–70% giá căn | Tùy ngân hàng, thu nhập, CIC |
| Vốn tự có | 30–50% + phí bảo trì, làm sổ | Cần dự trù trước khi ký HĐ |
| Thời hạn | 15–20 năm phổ biến | NOXH thường ưu đãi hơn TM |
| Lãi suất | Gói ưu đãi + thả nổi sau giai đoạn đầu | Xem [lãi suất dưới 35 tuổi](/tin-tuc/lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026) |

Dùng [công cụ tính khoản vay](/cong-cu/tinh-khoan-vay) trên HouseX để ước lượng tiền trả hàng tháng theo giá căn và tỷ lệ vay bạn dự kiến.

## Điều kiện vay khác gì điều kiện mua NOXH?

Hai lớp điều kiện tách biệt:

- Mua NOXH: đối tượng Đ.76, nhà ở, thu nhập (hoặc miễn trần) — không xét CIC.
- Vay vốn: lịch sử tín dụng (CIC), khả năng trả nợ, hợp đồng mua NOXH hợp lệ, chứng minh thu nhập cho ngân hàng.

Nợ xấu nhóm 2, DTI cao, hạn mức thẻ tín dụng lớn có thể khiến hồ sơ vay bị từ chối dù bạn đủ điều kiện mua — nên rà soát tín dụng song song với [kiểm tra điều kiện NOXH](/cong-cu/dieu-kien-noxh).

## Hồ sơ vay NOXH thường gồm những gì?

- Hợp đồng mua/thuê mua NOXH đã ký với CĐT.
- Giấy xác nhận đối tượng và thu nhập (đơn vị / UBND).
- CMND/CCCD, giấy tờ hôn nhân, hộ khẩu/cư trú theo yêu cầu ngân hàng.
- Cam kết tình trạng nhà ở theo mẫu đợt mở bán.
- Bảng kê tài sản, sao kê lương 3–6 tháng (tùy ngân hàng).

Ngân hàng thương mại liên kết từng dự án có thể bổ sung biểu mẫu riêng — tra cứu mục vay trên trang dự án (vd. DTA Happy Home).

## Gói 120.000 tỷ và lãi suất người trẻ dưới 35 tuổi

Từ 01/7/2026, NHNN thông báo khung lãi suất cho vay mua NOXH đối với người dưới 35 tuổi (Công văn 5340/NHNN-CSTT) — chi tiết tại bài [lãi suất vay NOXH dưới 35 tuổi](/tin-tuc/lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026). Đây là lớp ưu đãi bổ sung, không thay thế điều kiện đối tượng mua nhà.

${NOXH_SUPPORT_CLOSING}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: UPDATED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "Vay NOXH gói 120.000 tỷ NHCSXH — 70% giá căn, điều kiện & hồ sơ | HouseX",
    seoDesc:
      "Hướng dẫn vay mua nhà ở xã hội qua NHCSXH: tỷ lệ 70%, hồ sơ, khác biệt với điều kiện mua. Công cụ tính vay HouseX.",
    tags: [NOXH_TAG_CHINH_SACH],
    projects: [{ slug: DTA_HAPPY_HOME_SLUG, name: "DTA Happy Home Nhơn Trạch" }],
  },
  {
    id: "article-noxh-knowledge-03",
    slug: "dieu-kien-nha-o-mua-noxh-dieu-77-2026",
    title:
      "Điều kiện nhà ở khi mua NOXH — Điều 78 Luật Nhà ở và 15 m²/người là gì?",
    excerpt:
      "Giải thích khi nào được mua dù đang có nhà, ngưỡng 15 m² sàn/người (NĐ 100), trường hợp vợ chồng đứng tên sổ và lỗi hồ sơ hay bị loại nhất.",
    body: `## Vì sao nhiều hồ sơ NOXH bị loại ở khâu “nhà ở”?

Sau khi qua cửa đối tượng (Điều 76), bước rà soát kế tiếp là tình trạng nhà ở — đây là lý do phổ biến khiến hộ đủ thu nhập vẫn không được chọn mua. Khung pháp lý nằm tại điểm a khoản 1 Điều 78 [Luật Nhà ở 2023](https://vanban.chinhphu.vn/?docid=209627&pageid=27160), chi tiết hóa tại Điều 29 [Nghị định 100/2024/NĐ-CP](https://vanban.chinhphu.vn/?docid=210760&pageid=27160).

${EDITORIAL_FIGURES.noxhEligibility}

## Ba tình huống được coi là đủ điều kiện nhà ở

Theo Điều 78 khoản 1 điểm a, đối tượng mua/thuê mua NOXH (khoản 1, 4, 5, 6, 7, 8, 9, 10 Điều 76) phải thuộc một trong các trường hợp:

1. Chưa có nhà ở thuộc sở hữu của mình tại tỉnh, thành phố trực thuộc Trung ương nơi có dự án NOXH đó.
2. Chưa được mua hoặc thuê mua NOXH (trừ thuê).
3. Chưa được hưởng chính sách hỗ trợ nhà ở dưới mọi hình thức tại tỉnh/TP nơi có dự án.
4. Hoặc đã có nhà nhưng diện tích nhà ở bình quân đầu người thấp hơn mức tối thiểu do Chính phủ quy định.

## Mức 15 m² sàn/người áp dụng thế nào?

Nghị định 100/2024 (sửa bởi NĐ 136/2026) quy định diện tích nhà ở bình quân tối thiểu 15 m² sàn/người. Cách kiểm tra thực tế:

- Lấy tổng diện tích sàn nhà ở đang ở (theo sổ, hợp đồng hoặc cam kết) chia cho số người trong hộ tại thời điểm nộp hồ sơ.
- Ví dụ: nhà 60 m² sàn, hộ 5 người → 12 m²/người → có thể đủ điều kiện nếu các điều kiện khác thỏa.
- Ví dụ: nhà 80 m², hộ 4 người → 20 m²/người → thường không đủ điều kiện “nhà ở tối thiểu”.

## Vợ chồng đứng tên sổ — ai bị ảnh hưởng?

Thực hành rà soát đợt mở bán: tình trạng nhà ở xét theo hộ gia đình, không chỉ người đứng tên nộp đơn. Nếu vợ hoặc chồng sở hữu nhà ở tại tỉnh có dự án NOXH, hộ thường bị loại dù người nộp đơn không đứng tên sổ đỏ.

Nên tra cứu sổ đỏ, quyền sử dụng đất và cam kết của cả hộ trước khi đóng phí hồ sơ — chi phí làm hồ sơ và cơ hội đợt mở bán không lặp lại ngay.

## Mỗi người được mua mấy căn NOXH?

Điều 78 khoản 6 Luật Nhà ở 2023: mỗi đối tượng (khoản 1, 4, 5, 6, 8, 9, 10 Điều 76) chỉ được mua hoặc thuê mua 01 căn NOXH. Đối tượng khoản 7 (lực lượng vũ trang) chỉ được 01 căn NOXH hoặc 01 căn nhà ở cho lực lượng vũ trang.

Đã từng mua/thuê mua NOXH hoặc đã hưởng hỗ trợ nhà ở tại cùng tỉnh/TP → không đủ điều kiện cho đợt mới tại địa phương đó.

## Liên kết rà soát trước khi nộp

- Pillar tổng hợp: [điều kiện mua NOXH 2026](/tin-tuc/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat)
- Công cụ 5 bước: [/cong-cu/dieu-kien-noxh](/cong-cu/dieu-kien-noxh)
- Quy trình sau khi đủ điều kiện: [quy trình mua/thuê mua](/tin-tuc/quy-trinh-mua-thue-mua-noxh-2026)

${NOXH_SUPPORT_CLOSING}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: UPDATED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "Điều kiện nhà ở mua NOXH — Điều 78, 15 m²/người, lỗi hồ sơ | HouseX",
    seoDesc:
      "Giải thích điều kiện nhà ở khi mua NOXH: chưa có nhà, 15 m²/người, một căn/hộ. Điều 78 Luật Nhà ở 2023.",
    tags: [NOXH_TAG_CHINH_SACH],
    projects: [],
  },
  {
    id: "article-noxh-knowledge-04",
    slug: "phuc-loc-tho-block-c-noxh-gia-ho-so-2026",
    title:
      "NOXH Phúc Lộc Thọ Block C — giá ~35,3 triệu/m², 140 căn và điều kiện hồ sơ",
    excerpt:
      "Cùng đợt công bố với Lý Thường Kiệt: chung cư 35 Lê Văn Chí Thủ Đức, 140 căn NOXH, giá bình quân ~35,35 triệu/m² — phân tích đối tượng và chuẩn bị hồ sơ.",
    body: `## Phúc Lộc Thọ nằm trong đợt công bố NOXH nội thành nào?

Cùng với [Lý Thường Kiệt (Phú Thọ DMC)](/tin-tuc/tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc), TP.HCM đã công bố giá bán cho chung cư Phúc Lộc Thọ tại 35 Lê Văn Chí, phường Linh Xuân, TP. Thủ Đức — tham khảo [VnExpress](https://vnexpress.net/hai-du-an-nha-xa-hoi-noi-thanh-tp-hcm-co-gia-tu-23-trieu-va-35-trieu-mot-m2-5090748.html).

UBND TP.HCM phê duyệt chuyển một phần quỹ căn Block C sang nhà ở xã hội: 140 căn, diện tích 40–75 m².

## Giá và tổng vốn tham chiếu

| Chỉ tiêu | Số liệu công bố |
| --- | --- |
| Giá bình quân | ~35.349.299 đồng/m² (đã VAT) |
| Phí bảo trì | Chưa gồm 2% phí bảo trì |
| Hệ số vị trí | Có điều chỉnh theo căn (Ki) |
| Quy mô NOXH | 140 căn Block C |
| Giá căn tham chiếu | Khoảng 1,4 – 2,65 tỷ tùy diện tích |

Mức giá cao hơn đáng kể so với [Lý Thường Kiệt ~23,25 triệu/m²](/du-an/nha-o-xa-hoi-ly-thuong-kiet) nhưng vẫn dưới nhiều so với căn hộ thương mại cùng khu Thủ Đức. So sánh chiến lược: [LTK vs DTA Happy Home](/tin-tuc/so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026).

## Ai nên cân nhắc Phúc Lộc Thọ Block C?

- Người thuộc nhóm đối tượng Điều 76 (thu nhập thấp, công nhân, CBCCVC…) và đủ [điều kiện nhà ở](/tin-tuc/dieu-kien-nha-o-mua-noxh-dieu-77-2026).
- Hộ cần ở gần ngã tư Thủ Đức, kết nối Xa lộ Hà Nội, KCN Linh Trung — ưu tiên vị trí hơn mức giá tuyệt đối thấp nhất.
- Người đã rà soát thu nhập theo trần 25/35/50 triệu ([NĐ 136/2026](/tin-tuc/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat)) và dự trù vay ~70% qua [gói NHCSXH](/tin-tuc/vay-noxh-goi-120000-ty-nhcsxh-2026).

## Chuẩn bị hồ sơ trước đợt mở bán

1. Xác nhận đối tượng và thu nhập tại đơn vị (12 tháng lương).
2. Cam kết tình trạng nhà ở cả hộ.
3. Theo dõi thông báo Sở Xây dựng TP.HCM về thời hạn nộp — tương tự quy trình [7 bước mua NOXH](/tin-tuc/quy-trinh-mua-thue-mua-noxh-2026).
4. Ước tính dòng tiền: [công cụ tính vay](/cong-cu/tinh-khoan-vay).

Tra cứu mặt bằng, vị trí và gallery: [/du-an/chung-cu-phuc-loc-tho-noxh](/du-an/chung-cu-phuc-loc-tho-noxh).

*HouseX tổng hợp từ VnExpress và thông tin công bố — giá và tiến độ có thể thay đổi theo đợt.*`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: UPDATED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "NOXH Phúc Lộc Thọ Block C — giá ~35,3 tr/m², 140 căn | HouseX",
    seoDesc:
      "Phân tích NOXH Phúc Lộc Thọ 35 Lê Văn Chí: giá ~35,3 triệu/m², 140 căn Block C, điều kiện và hồ sơ 2026.",
    tags: [NOXH_TAG_DU_AN_GIA],
    projects: [{ slug: PHUC_LOC_THO_SLUG, name: PHUC_LOC_THO_NAME }],
  },
  {
    id: "article-noxh-knowledge-05",
    slug: "noxh-long-an-6-du-an-mien-nam-2026",
    title:
      "6 dự án NOXH Long An 2026 — LA Home, Mỹ Hạnh, The Ori và bảng giá tham chiếu",
    excerpt:
      "Danh mục NOXH vùng ven TP.HCM: 6 dự án tại Bến Lức, Đức Hòa, Cần Giuộc — giá từ ~14 triệu/m², phù hợp công nhân và hộ trẻ chưa trúng suất nội thành.",
    body: `## Vì sao Long An là “vùng đệm” NOXH của TP.HCM?

Khi NOXH nội thành như [Lý Thường Kiệt](/du-an/nha-o-xa-hoi-ly-thuong-kiet) ghi nhận áp lực hồ sơ vượt quỹ căn hàng chục lần, nhiều hộ chuyển sang vùng ven Long An — giá/m² thấp hơn, quỹ căn mở rộng dần, phù hợp công nhân KCN và người lao động làm việc dọc Quốc lộ 1A, QL22.

Điều kiện mua vẫn theo Luật Nhà ở 2023 toàn quốc: [đối tượng Đ.76](/tin-tuc/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat), [nhà ở](/tin-tuc/dieu-kien-nha-o-mua-noxh-dieu-77-2026), thu nhập 25/35/50 triệu (khoản 5, 6, 8).

## Bảng 6 dự án NOXH Long An trên HouseX

| Dự án | Khu vực | Quy mô / điểm nổi | Giá tham chiếu |
| --- | --- | --- | --- |
| [LA Home](/du-an/${LA_HOME_SLUG}) | Bến Lức, Lương Hòa | KĐT sinh thái, đối diện KCN Prodezi | ~14–17 triệu/m², căn từ ~385 triệu |
| [Mỹ Hạnh (Bee Home)](/du-an/${MY_HANH_SLUG}) | Đức Hòa | 166 căn 1PN 31–34 m², 12 tầng | ~31,38 triệu/m² |
| [The Ori Phương Mai](/du-an/${ORI_SLUG}) | Mỹ Hạnh, Gò Hưu | 1.269 căn NOXH, 3 tháp 27 tầng | ~20 triệu/m² |
| [Hậu Nghĩa](/du-an/${HAU_NGHIA_SLUG}) | Đức Hòa | KĐT Hậu Nghĩa | Theo CĐT từng đợt |
| [Phước Vĩnh Tây](/du-an/${PVT_SLUG}) | Cần Giuộc | KĐT ven sông | Theo CĐT từng đợt |
| [Phú An](/du-an/${PHU_AN_SLUG}) | Thạnh Bình, Bến Lức | NOXH thấp tầng | Theo CĐT từng đợt |

Giá trên là tham chiếu công bố Sở Xây dựng/CĐT tại thời điểm biên tập — mức chính thức từng đợt mở bán có thể điều chỉnh.

## Long An phù hợp nhóm đối tượng nào?

- Công nhân, người lao động (khoản 6 Điều 76) tại KCN Prodezi, KCN Long Hậu, vùng giáp ranh TP.HCM.
- Người thu nhập thấp tại đô thị (khoản 5) đã rà soát thu nhập nhưng chưa trúng suất nội thành.
- Hộ trẻ cần tổng vốn thấp hơn [DTA Happy Home Nhơn Trạch](/du-an/dta-happy-home-nhon-trach) hoặc [Lý Thường Kiệt](/du-an/nha-o-xa-hoi-ly-thuong-kiet) — so sánh: [bài phân tích giá](/tin-tuc/so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026).

## Chuẩn bị gì trước đợt mở bán Long An?

1. [Kiểm tra điều kiện NOXH](/cong-cu/dieu-kien-noxh) — đặc biệt nhà ở tại Long An/TP.HCM.
2. Xin giấy xác nhận thu nhập tại đơn vị (công nhân KCN: HĐLĐ + bảng lương 12 tháng).
3. Theo dõi Sở Xây dựng Long An và từng CĐT — mỗi dự án mở đợt riêng.
4. Lập kế hoạch vay: [gói 120.000 tỷ](/tin-tuc/vay-noxh-goi-120000-ty-nhcsxh-2026) + [tính khoản vay](/cong-cu/tinh-khoan-vay).

Danh mục đầy đủ: [/du-an/nha-o-xa-hoi](/du-an/nha-o-xa-hoi)

${NOXH_SUPPORT_CLOSING}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: UPDATED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "NOXH Long An 2026 — 6 dự án, giá tham chiếu & điều kiện | HouseX",
    seoDesc:
      "Danh mục 6 dự án nhà ở xã hội Long An: LA Home, Mỹ Hạnh, The Ori… Giá từ ~14 triệu/m², hướng dẫn đối tượng và hồ sơ.",
    tags: [NOXH_TAG_DU_AN_GIA],
    projects: [
      { slug: LA_HOME_SLUG, name: "Nhà ở xã hội LA Home" },
      { slug: MY_HANH_SLUG, name: "Nhà ở xã hội Mỹ Hạnh" },
      { slug: ORI_SLUG, name: "The Ori Phương Mai" },
    ],
  },
];
