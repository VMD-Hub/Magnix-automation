import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { DTA_PR_CLOSINGS } from "@/lib/content/articles/article-editorial-voice";
import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";
import {
  LTK_PROJECT_NAME,
  LTK_PROJECT_SLUG,
} from "@/lib/preview/phu-tho-dmc-mock";

const PUBLISHED = new Date("2026-07-02T00:00:00.000Z");
const UPDATED = new Date("2026-07-02T00:00:00.000Z");

/** Tuyến 3 bài bắt trend NOXH TP.HCM + NHNN + dẫn dắt DTA Happy Home. */
export const NOXH_TREND_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-noxh-trend-01",
    slug: "tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc",
    title:
      "TP.HCM công bố giá 2 dự án NOXH nội thành: Lý Thường Kiệt (Phú Thọ DMC) ghi nhận hơn 12.000 hồ sơ",
    excerpt:
      "VnExpress và Sở Xây dựng xác nhận giá ~23,25 và ~35,3 triệu/m². Phú Thọ DMC là NOXH được quan tâm nhất — cập nhật giá, quy mô và lịch bàn giao.",
    body: `## TP.HCM vừa chốt giá bán hai dự án nhà ở xã hội nội thành

Theo [VnExpress](https://vnexpress.net/hai-du-an-nha-xa-hoi-noi-thanh-tp-hcm-co-gia-tu-23-trieu-va-35-trieu-mot-m2-5090748.html), sau khi hoàn tất thẩm tra phương án xác định giá, hai dự án NOXH tại phường Diên Hồng và phường Linh Xuân đã công bố mức giá bán chính thức — lần lượt từ hơn 23 triệu và 35 triệu đồng một m².

${EDITORIAL_FIGURES.ltkPhoiCanh}

Điểm nóng dư luận là Nhà ở xã hội Lý Thường Kiệt (tên thương mại Phú Thọ DMC) tại 324 Lý Thường Kiệt, do Công ty Cổ phần Đức Mạnh làm chủ đầu tư. Mức giá: 23.251.398 đồng/m² (đã VAT), chưa gồm 2% phí bảo trì và hệ số điều chỉnh theo vị trí căn (Ki) — tham khảo [Thư viện Pháp luật](https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/bat-dong-san/115922/chinh-thuc-co-gia-ban-nha-o-xa-hoi-ly-thuong-kiet-phu-tho-dmc).

## Vì sao Phú Thọ DMC “hot” nhất TP.HCM?

Vị trí đối diện Nhà thi đấu Phú Thọ, cạnh Bệnh viện Trưng Vương — trung tâm Quận 10. VnExpress ghi nhận dự án từng có hơn 12.000 hồ sơ đăng ký, gấp khoảng 17 lần số căn mở bán (755 căn NOXH bán). Đây là mức cạnh tranh hiếm thấy trong phân khúc NOXH.

Dự án còn lại trong đợt công bố là chung cư 35 Lê Văn Chí (Phúc Lộc Thọ), giá bình quân ~35,3 triệu/m² — cao hơn đáng kể so với Lý Thường Kiệt. Chi tiết: [/du-an/chung-cu-phuc-loc-tho-noxh](/du-an/chung-cu-phuc-loc-tho-noxh).

## Giá Lý Thường Kiệt so với dự kiến đầu năm

Đầu năm 2026, [VnExpress](https://vnexpress.net/gia-nha-o-xa-hoi-tren-duong-ly-thuong-kiet-du-kien-hon-21-trieu-dong-moi-m2-5014383.html) dẫn thông tin Sở Xây dựng về mức giá dự kiến ~21,6 triệu/m² trước khi công bố chính thức. Mức 23,25 triệu/m² cuối cùng cao hơn dự báo ban đầu nhưng vẫn thấp hơn nhiều so với căn hộ thương mại cùng khu (Xi Grand Court, Hà Đô Centrosa…).

CĐT dự kiến hoàn tất, nghiệm thu bàn giao khoảng tháng 8/2026. Tra cứu mặt bằng, gallery và FAQ: [/du-an/nha-o-xa-hoi-ly-thuong-kiet](/du-an/nha-o-xa-hoi-ly-thuong-kiet).

Người quan tâm NOXH nội thành nhưng chưa chắc trúng suất có thể đọc thêm [so sánh giá với phương án vùng ven](/tin-tuc/so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026) — phân tích dành cho lao động cần tổng vốn thấp hơn và quỹ căn minh bạch hơn.

*Nguồn tham khảo: VnExpress, Thư viện Pháp luật, Sở Xây dựng TP.HCM. HouseX tổng hợp phục vụ tra cứu — không phải công bố chính thức của cơ quan nhà nước.*`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: UPDATED,
    coverImageUrl:
      "https://odt.vn/storage/03-2026/phu-tho-dmc-phoi-canh-1.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "TP.HCM công bố giá NOXH Lý Thường Kiệt Phú Thọ DMC — 23,25 tr/m² | HouseX",
    seoDesc:
      "Tổng hợp VnExpress: giá NOXH Lý Thường Kiệt 23,25 tr/m², 12.000+ hồ sơ, bàn giao 08/2026. Phân tích & liên kết dự án trên HouseX.",
    tags: [
      { slug: "noxh", name: "Nhà ở xã hội" },
      { slug: "tien-do-du-an", name: "Tiến độ dự án" },
      { slug: "nha-o-xa-hoi-ly-thuong-kiet", name: "NOXH Lý Thường Kiệt" },
    ],
    projects: [{ slug: LTK_PROJECT_SLUG, name: LTK_PROJECT_NAME }],
  },
  {
    id: "article-noxh-trend-02",
    slug: "so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026",
    title:
      "So sánh giá NOXH: Lý Thường Kiệt 23,25 tr/m² — DTA Happy Home từ 448 triệu/căn, ai nên chọn?",
    excerpt:
      "Phân tích giá/m², tổng giá căn, cạnh tranh hồ sơ và vị trí. Lộ trình an cư cho công nhân & người trẻ chưa trúng suất nội thành.",
    body: `## Bối cảnh: NOXH nội thành “khan hiếm suất”, vùng ven có quỹ căn mở

Sau [công bố giá hai dự án NOXH nội thành](/tin-tuc/tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc), câu hỏi nhiều người trẻ đặt ra: nếu không trúng suất Lý Thường Kiệt, nên làm gì?

Bài phân tích dưới đây so sánh ba điểm dữ liệu công khai — không khuyến nghị đầu tư, chỉ hỗ trợ ra quyết định an cư.

## Bảng so sánh nhanh (số liệu công bố)

| Dự án | Giá tham chiếu | Quy mô bán | Áp lực hồ sơ | Định vị |
|-------|----------------|------------|--------------|---------|
| Lý Thường Kiệt (Phú Thọ DMC) | ~23,25 tr/m² (đã VAT) | 755 căn NOXH | >12.000 hồ sơ (VnExpress) | Trung tâm Q10 |
| Phúc Lộc Thọ — 35 Lê Văn Chí | ~35,3 tr/m² | Theo CĐT | Cao | Thủ Đức |
| DTA Happy Home Nhơn Trạch | 448–700 triệu/căn (32–52 m²) | Giỏ hàng Block A10 đang mở | Quỹ căn công bố rõ | KCN Nhơn Trạch |

${EDITORIAL_FIGURES.ltkMatBang}

${EDITORIAL_FIGURES.dtaPhoiCanh}

## Lý Thường Kiệt: lợi thế vị trí, thách thức cạnh tranh

Lợi thế rõ: đất vàng nội thành; tiện ích y tế — giáo dục — thương mại dày; bàn giao sớm (~08/2026).

Thách thức thực tế: tỷ lệ trúng suất thấp khi hồ sơ gấp nhiều chục lần quỹ bán. Giá tổng căn 34,5–77 m² có thể từ ~800 triệu đến ~1,8 tỷ (chưa phí bảo trì, chưa hệ số vị trí) — không nhẹ với công nhân thu nhập trung bình.

Xem chi tiết dự án: [/du-an/nha-o-xa-hoi-ly-thuong-kiet](/du-an/nha-o-xa-hoi-ly-thuong-kiet).

## DTA Happy Home: dòng tiền thực tế cho người lao động

DTA Happy Home tại DTA City Nhơn Trạch (Đồng Nai) có giá bán chính thức từ CĐT khoảng 448–700 triệu/căn, diện tích 32–52 m² — tương đương ~13–16 triệu/m², thấp hơn nhiều so với NOXH nội thành.

Quỹ căn Block A10 (30 suất) đang được công bố giá cụ thể — minh bạch từng mã căn (ví dụ [/tin-dang/DTA-HH-A10511](/tin-dang/DTA-HH-A10511) từ ~535 triệu). Phù hợp công nhân KCN Nhơn Trạch – Long Thành: an cư gần nơi làm việc, giảm chi phí đi lại so với thuê trọ TP.HCM. Bàn giao dự kiến Quý IV/2027 — cần lập kế hoạch tài chính sớm, nhưng ít áp lực “trúng suất” hơn Lý Thường Kiệt.

Trang dự án đầy đủ mặt bằng, nhà mẫu, 3 phương thức thanh toán: [/du-an/dta-happy-home-nhon-trach](/du-an/dta-happy-home-nhon-trach).

## Chọn phương án nào?

Người ưu tiên sống nội thành, đủ điều kiện và chấp nhận rủi ro trúng suất nên theo dõi sát [Phú Thọ DMC](/du-an/nha-o-xa-hoi-ly-thuong-kiet). Người cần sở hữu NOXH với tổng vốn dưới 700 triệu, làm việc gần KCN Nhơn Trạch có thể cân nhắc phương án vùng ven — nơi hạ tầng TOD và ga quy hoạch đang hình thành.

${DTA_PR_CLOSINGS.gaQuyHoach}

Đọc thêm: [Lãi suất vay NOXH người dưới 35 tuổi từ 1/7/2026](/tin-tuc/lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026) — ảnh hưởng trực tiếp tới dòng tiền mua NOXH.`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-01T00:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl:
      "https://dtanhontrach.com/wp-content/uploads/2018/01/header-bg-1.jpg.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "So sánh giá NOXH Lý Thường Kiệt vs DTA Happy Home 2026 | HouseX",
    seoDesc:
      "Phân tích 23,25 tr/m² Phú Thọ DMC vs DTA Happy Home 448–700 triệu/căn. An cư cho công nhân & người trẻ NOXH.",
    tags: [
      { slug: "noxh", name: "Nhà ở xã hội" },
      { slug: "dau-tu", name: "Kiến thức đầu tư" },
      { slug: "nha-o-xa-hoi-ly-thuong-kiet", name: "NOXH Lý Thường Kiệt" },
      { slug: "dta-happy-home-nhon-trach", name: "DTA Happy Home" },
    ],
    projects: [
      { slug: LTK_PROJECT_SLUG, name: LTK_PROJECT_NAME },
      { slug: DTA_HAPPY_HOME_SLUG, name: "DTA Happy Home Nhơn Trạch" },
    ],
  },
  {
    id: "article-noxh-trend-03",
    slug: "lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026",
    title:
      "Lãi suất vay NOXH người dưới 35 tuổi từ 1/7/2026: 6,5%/năm — DTA Happy Home hưởng thêm ưu đãi CĐT",
    excerpt:
      "NHNN Công văn 5340/NHNN-CSTT: 6,5% 5 năm đầu, 7,5% 10 năm tiếp. So sánh mức cũ 5,9% và gói 5,5% 6 tháng đầu tại DTA Happy Home.",
    body: `## NHNN chốt lãi suất ưu đãi NOXH cho người trẻ dưới 35 tuổi

Từ 01/7/2026 đến 31/12/2026, Ngân hàng Nhà nước thông báo mức lãi suất cho vay mua nhà ở xã hội đối với người dưới 35 tuổi (Công văn [5340/NHNN-CSTT](https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/bat-dong-san/115789/toan-van-cong-van-5340-nhnn-cstt-ve-lai-suat-mua-nha-o-xa-hoi-nguoi-tre-duoi-35-tuoi)) — tham khảo thêm [VietnamNet](https://vietnamnet.vn/tu-1-7-nguoi-duoi-35-tuoi-vay-mua-nha-o-xa-hoi-huong-lai-suat-6-5-nam-2529764.html) và [VietnamPlus](https://www.vietnamplus.vn/tu-17-ap-dung-lai-suat-vay-mua-nha-o-xa-hoi-voi-nguoi-tre-65-post1120731.vnp).

Mức áp dụng:

- 5 năm đầu (kể từ ngày giải ngân đầu tiên): 6,5%/năm — thấp hơn 2 điểm % so với lãi suất cho vay trung dài hạn bình quân 4 NHNN (Agribank, BIDV, Vietcombank, VietinBank).
- 10 năm tiếp theo: 7,5%/năm — thấp hơn 1 điểm % so với cùng cơ sở tính.

## So với giai đoạn trước (01/7/2025 – 31/12/2025)

Theo các nguồn báo chí tổng hợp chính sách NHNN, giai đoạn trước người dưới 35 tuổi vay mua NOXH được áp dụng 5,9%/năm trong 5 năm đầu. Mức 6,5% từ 01/7/2026 cao hơn so với 5,9% — phản ánh biến động lãi suất cơ sở 4 NHNN, nhưng vẫn thấp hơn đáng kể so với vay mua nhà thương mại thông thường (thường từ 9–11%/năm trở lên tùy thời điểm).

${EDITORIAL_FIGURES.dtaMatBang}

Dù mức ưu đãi NHNN có điều chỉnh theo kỳ, kênh vay NOXH vẫn là lựa chọn tối ưu về chi phí vốn so với thị trường tự do — miễn là người mua đủ điều kiện đối tượng và dự án đủ điều kiện cho vay.

## DTA Happy Home: ưu đãi từ CĐT và ngân hàng liên kết

Ngoài khung NHNN, DTA Happy Home Nhơn Trạch (CĐT Công ty CP Đệ Tam) công bố trên website chính thức:

- Vốn tự có từ 30%, vay tối đa 70% giá trị căn, thời hạn tối đa 20 năm.
- Lãi suất ưu đãi 5,5%/năm trong 6 tháng đầu (theo chính sách ngân hàng liên kết — tham khảo [dtanhontrach.com](https://dtanhontrach.com)).
- 3 phương thức thanh toán linh hoạt theo block.

Khi kết hợp giá căn từ 448 triệu (giá CĐT công bố Block A10) với gói vay 70%, số tiền vay gốc ban đầu có thể từ ~300 triệu — mức trả góp hàng tháng có thể mô phỏng trên [công cụ tính khoản vay HouseX](/cong-cu/tinh-khoan-vay).

## Ví dụ dòng tiền (minh hoạ, không phải cam kết ngân hàng)

Căn A10-511 — giá CĐT 535.236.000 VNĐ (xem [/tin-dang/DTA-HH-A10511](/tin-dang/DTA-HH-A10511)):

- Vốn tự có 30%: ~160,6 triệu
- Vay 70%: ~374,7 triệu
- Nếu áp dụng 6 tháng đầu 5,5% (CĐT) rồi chuyển sang khung NHNN 6,5% (đối tượng <35 tuổi, đủ điều kiện) — cần xác nhận trực tiếp với ngân hàng giải ngân tại thời điểm ký hợp đồng.

Người trẻ đang theo dõi [giá NOXH Lý Thường Kiệt](/tin-tuc/tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc) nhưng e ngại áp lực hồ sơ có thể song song chuẩn bị tài chính cho phương án vùng ven — nơi quỹ căn rõ ràng và tổng vốn thấp hơn nhiều.

${DTA_PR_CLOSINGS.todAnCu}

*HouseX tổng hợp từ văn bản NHNN và thông tin công bố CĐT — không phải tư vấn tín dụng. Lãi suất thực tế phụ thuộc hồ sơ, ngân hàng và thời điểm giải ngân.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-06-30T00:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl:
      "https://dtanhontrach.com/wp-content/webp-express/webp-images/themes/template/img/pt2.jpg.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Lãi suất vay NOXH dưới 35 tuổi 6,5%/năm & ưu đãi DTA Happy Home | HouseX",
    seoDesc:
      "Phân tích Công văn 5340 NHNN: 6,5%/năm 5 năm đầu. So sánh 5,9% trước đây và gói 5,5% CĐT DTA Happy Home Nhơn Trạch.",
    tags: [
      { slug: "noxh", name: "Nhà ở xã hội" },
      { slug: "phap-ly", name: "Pháp lý & chính sách" },
      { slug: "goc-chuyen-gia", name: "Góc chuyên gia" },
      { slug: "dta-happy-home-nhon-trach", name: "DTA Happy Home" },
    ],
    projects: [{ slug: DTA_HAPPY_HOME_SLUG, name: "DTA Happy Home Nhơn Trạch" }],
  },
];
