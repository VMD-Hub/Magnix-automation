import { NOXH_TAG_DU_AN_GIA } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { NOXH_SUPPORT_CLOSING } from "@/lib/content/articles/article-editorial-voice";
import {
  LTK_PROJECT_NAME,
  LTK_PROJECT_SLUG,
} from "@/lib/preview/phu-tho-dmc-mock";
import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";
import {
  EMERALD_68_SLUG,
  EMERALD_68_NAME,
} from "@/lib/preview/ql13-commercial-mocks";
import { HGX_PROJECT_SLUG } from "@/lib/preview/ho-guom-xanh-mock";

const UPDATED = new Date("2026-08-06T00:00:00.000Z");
const LANDING = `/du-an/${LTK_PROJECT_SLUG}`;
const SLUG_GIA = "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026";
const SLUG_HOSO = "ho-so-mua-noxh-ly-thuong-kiet-doi-tuong-checklist-2026";
const SLUG_SOT = "vi-sao-noxh-ly-thuong-kiet-sot-so-sanh-gia-quan-10-2026";
const SLUG_CANHBAO =
  "canh-bao-lua-dao-suat-noi-bo-noxh-ly-thuong-kiet-2026";
const SLUG_TAMLY =
  "giai-ma-4-don-thao-tung-tam-ly-suat-noi-bo-noxh-ly-thuong-kiet-2026";
const SLUG_VEBUA =
  "mua-noxh-ly-thuong-kiet-co-kho-khong-canh-giac-ve-bua-thu-tuc-2026";

const TAG = NOXH_TAG_DU_AN_GIA;
const PROJECT = { slug: LTK_PROJECT_SLUG, name: LTK_PROJECT_NAME };

/**
 * Phễu SEO NOXH Lý Thường Kiệt — tone chuyên gia sòng phẳng (miền Nam).
 * Vận hành + lớp tâm lý trust; số liệu giá theo công bố CĐT & Sở XD.
 */
export const LTK_FUNNEL_SERIES_2026: ArticleDetail[] = [
  {
    id: "article-ltk-funnel-01-gia",
    slug: SLUG_GIA,
    title:
      'Bóc tách giá bán 23,2 triệu/m² của NOXH Lý Thường Kiệt: Giấc mơ có thật giữa lòng Quận 10?',
    excerpt:
      "Công bố chính thức 23.251.398 đồng/m² (đã VAT): 755 căn bán, 270 căn thuê, diện tích 34,5–77 m², bàn giao dự kiến tháng 8/2026 — tách rõ phí bảo trì và hệ số vị trí trước khi tính tổng vốn.",
    body: `## Thông tin chính thức từ chủ đầu tư: mức giá 23.251.398 đồng/m² nghĩa là gì?

Cuối tháng 6/2026, Sở Xây dựng TP.HCM và Công ty Cổ phần Đức Mạnh công bố phương án giá bán Nhà ở xã hội Lý Thường Kiệt (tên thương mại Phú Thọ DMC) tại 324 Lý Thường Kiệt, phường Diên Hồng, Quận 10.

Mức giá: 23.251.398 đồng/m² — đã gồm VAT. Chưa gồm:

- Phí bảo trì 2%.
- Hệ số điều chỉnh theo vị trí căn / tầng (căn góc, tầng cao…).

Cách tính sòng phẳng: lấy diện tích thông thủy × đơn giá, cộng phí bảo trì và hệ số (nếu áp), rồi đối chiếu lịch thanh toán trên hợp đồng. Tham khảo [Đức Mạnh Group — công khai giá](https://ducmanhgroup.com/cong-khai-gia-ban-nha-o-xa-hoi-cua-du-an-nha-o-xa-hoi-ly-thuong-kiet), [Thư viện Pháp luật](https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/bat-dong-san/115922/chinh-thuc-co-gia-ban-nha-o-xa-hoi-ly-thuong-kiet-phu-tho-dmc), [Tuổi Trẻ](https://tuoitre.vn/cong-khai-gia-ban-du-an-nha-o-xa-hoi-324-ly-thuong-kiet-100260628111711462.htm).

${EDITORIAL_FIGURES.ltkPhoiCanh}

Với khung 34,5–77 m², giá căn tham chiếu khoảng 800 triệu – 1,8 tỷ trước khi cộng đầy đủ phí và hệ số. Đây là mức thấp hơn nhiều so với căn hộ thương mại cùng khu vực (thường được truyền thông nêu khoảng 80–100 triệu/m²) — nhưng chỉ dành cho đúng đối tượng NOXH đã được duyệt.

## Quy mô giỏ hàng: 755 căn bán và 270 căn thuê

Toàn bộ quỹ NOXH tại dự án được chia rõ:

| Loại | Số căn | Ý nghĩa với người mua |
|------|--------|------------------------|
| Bán | 755 | Có lộ trình sở hữu theo quy định NOXH |
| Cho thuê | 270 | Không phải quỹ bán — không “hóa giá sổ” theo lời môi giới |

Diện tích linh hoạt Studio–2PN khoảng 34,5–77 m². Tra cứu mặt bằng và gallery: [${LANDING}](${LANDING}).

Áp lực hồ sơ thực tế: các đợt rà soát trước ghi nhận hàng chục nghìn hồ sơ cho vài trăm suất bán — đủ điều kiện vẫn phải chờ xét duyệt / bốc thăm theo thông báo chính thức.

## Tiến độ bàn giao: hướng nghiệm thu khoảng tháng 8/2026

Công trình đang ở giai đoạn hoàn thiện cuối. Chủ đầu tư và báo chí nêu hướng nghiệm thu, bàn giao khoảng tháng 8/2026. Mốc này có thể lệch vài tuần theo biên bản nghiệm thu — theo dõi thông báo tại văn phòng CĐT và Sở Xây dựng, không theo tin nhóm Facebook.

## Đọc tiếp trong chuỗi Lý Thường Kiệt?

| Bài | Câu hỏi |
|-----|---------|
| Hồ sơ / đối tượng | [11 nhóm Điều 76 & checklist hồ sơ](/wiki-nha-o-xa-hoi/${SLUG_HOSO}) |
| Vì sao sốt | [Vị trí & chênh giá Quận 10](/wiki-nha-o-xa-hoi/${SLUG_SOT}) |
| An toàn tiền | [Cảnh báo suất nội bộ & quy trình thanh toán](/wiki-nha-o-xa-hoi/${SLUG_CANHBAO}) |
| Tâm lý | [Vì sao dễ sập bẫy — 4 đòn thao túng](/wiki-nha-o-xa-hoi/${SLUG_TAMLY}) |
| Thủ tục | [NOXH có khó? Cảnh giác vẽ bùa thu phí](/wiki-nha-o-xa-hoi/${SLUG_VEBUA}) |

${NOXH_SUPPORT_CLOSING}

*Tổng hợp từ công bố CĐT / Sở XD và báo chí — giá căn cụ thể theo hợp đồng tại thời điểm giao dịch.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-06-28T00:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/articles/phu-tho-dmc-phoi-canh.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Giá NOXH Lý Thường Kiệt 23,2 triệu/m² — 755 căn bán, bàn giao 8/2026 | HouseX",
    seoDesc:
      "Giá chính thức 23.251.398 đ/m² (VAT), chưa bảo trì + hệ số; 755 bán / 270 thuê; tiến độ bàn giao ~08/2026 tại 324 Lý Thường Kiệt Q10.",
    tags: [TAG],
    projects: [PROJECT],
  },
  {
    id: "article-ltk-funnel-02-hoso",
    slug: SLUG_HOSO,
    title:
      "Đối tượng được mua Nhà ở xã hội Lý Thường Kiệt là gì? Chiếu chuẩn 11 nhóm theo Luật Nhà ở",
    excerpt:
      "11 nhóm đối tượng theo Điều 76 Luật Nhà ở 2023, bộ ba nhà ở – thu nhập – chủ thể, và checklist hồ sơ tự làm khi nộp NOXH Lý Thường Kiệt — không cọc suất ngoài luồng.",
    body: `> Dưới góc độ pháp lý chuẩn mực, tư duy đúng bắt đầu từ việc xác định chính xác: cá nhân, hộ gia đình thuộc nhóm đối tượng nào mới đủ điều kiện pháp lý để đăng ký mua, thuê mua hoặc thuê nhà ở xã hội? Bài viết phân tích 11 nhóm đối tượng tại Điều 76 Luật Nhà ở 2023, kết hợp bộ điều kiện định danh để người mua dự án Lý Thường Kiệt (Phú Thọ DMC, Quận 10) tự đối chiếu và lập hồ sơ đúng luật.

## 1. Định danh 11 nhóm đối tượng được quyền tiếp cận nhà ở xã hội (Điều 76 Luật Nhà ở 2023)

Để khẳng định tính hợp pháp của bộ hồ sơ, bước đầu tiên là xác định tư cách chủ thể. Căn cứ Điều 76 Luật Nhà ở 2023, pháp luật công nhận 11 nhóm đối tượng đủ điều kiện hưởng chính sách nhà ở xã hội:

1. Người có công với cách mạng, thân nhân liệt sĩ thuộc trường hợp được hỗ trợ cải thiện nhà ở theo quy định về ưu đãi người có công với cách mạng.
2. Hộ gia đình nghèo và cận nghèo tại khu vực đô thị.
3. Người có thu nhập thấp tại khu vực đô thị.
4. Cán bộ, công chức, viên chức theo quy định của pháp luật về cán bộ, công chức, viên chức.
5. Sĩ quan, quân nhân chuyên nghiệp, hạ sĩ quan thuộc lực lượng vũ trang nhân dân, công nhân công an, công chức, công nhân và viên chức quốc phòng đang phục vụ tại ngũ; người làm công tác cơ yếu, người làm công tác khác trong tổ chức cơ yếu hưởng lương từ ngân sách nhà nước đang công tác.
6. Học sinh, sinh viên đại học, học viện, trường cao đẳng, trung cấp, dạy nghề, trường chuyên biệt; học sinh trường dân tộc nội trú công lập được sử dụng nhà ở trong thời gian học tập (chỉ áp dụng hình thức thuê).
7. Hộ gia đình, cá nhân thuộc trường hợp bị thu hồi đất và phải giải tỏa, phá dỡ nhà ở theo quy định mà chưa được Nhà nước bồi thường bằng nhà ở hoặc đất ở.
8. Doanh nghiệp, hợp tác xã, liên hiệp hợp tác xã trong khu công nghiệp (đối với hình thức nhà lưu trú công nhân).
9. Công nhân, người lao động đang làm việc tại doanh nghiệp, hợp tác xã, liên hiệp hợp tác xã trong và ngoài khu công nghiệp.
10. Đối tượng đã trả lại nhà ở công vụ theo quy định tại khoản 4 Điều 125 Luật Nhà ở 2023, trừ trường hợp bị thu hồi nhà ở công vụ do vi phạm pháp luật.
11. Hộ gia đình, cá nhân thuộc diện tái định cư hoặc thuộc trường hợp Nhà nước thu hồi đất nhưng chưa được bố trí tái định cư theo quy định tại khoản 1 Điều 67 Luật Nhà ở 2023 (nếu có nhu cầu và đáp ứng điều kiện).

> Việc thuộc một trong 11 nhóm trên mới chỉ là điều kiện cần về chủ thể. Với dự án sức hút lớn tại trung tâm như Lý Thường Kiệt, số hồ sơ thường vượt nguồn cung. Hội đồng xét duyệt chấm điểm, phân loại theo hệ số ưu tiên pháp lý (thời gian cư trú, chính sách xã hội, tình trạng nhà ở hiện hữu). Tự chiếu đúng nhóm của mình là nền tảng để tránh bẫy “chạy suất ngoại giao” phi pháp.

${EDITORIAL_FIGURES.noxhEligibility}

Giá và quỹ căn: [Bóc tách giá 23,2 triệu/m²](/wiki-nha-o-xa-hoi/${SLUG_GIA}) · Trang dự án: [${LANDING}](${LANDING}).

## 2. Bộ ba điều kiện định danh: bộ lọc pháp lý bắt buộc

Thuộc nhóm đối tượng theo Điều 76 chưa đủ để ký hợp đồng mua bán. Người đứng tên nộp hồ sơ phải thỏa mãn đồng thời ba trụ cột điều kiện pháp lý theo Luật Nhà ở và văn bản hướng dẫn:

| Trụ cột pháp lý | Tiêu chuẩn định danh theo luật |
| --- | --- |
| 1. Chủ thể đối tượng | Được xác thực thuộc đúng một trong 11 nhóm tại Điều 76 Luật Nhà ở 2023. |
| 2. Điều kiện về nhà ở (Điều 77) | Tại thời điểm nộp hồ sơ, người đứng tên và thành viên hộ chưa có nhà ở thuộc sở hữu tại tỉnh, thành phố nơi có dự án (tại TP.HCM), hoặc có nhà ở nhưng diện tích bình quân đầu người thấp hơn mức tối thiểu do Nhà nước quy định. |
| 3. Điều kiện về thu nhập | Đáp ứng tiêu chí thu nhập theo quy định (thuộc diện không phải thường xuyên nộp thuế thu nhập cá nhân từ tiền lương, tiền công, hoặc giới hạn trần thu nhập áp dụng tại thời điểm mở bán). |

Mọi hình thức nhận tiền đặt cọc “giữ chỗ” hoặc cam kết “bao đậu hồ sơ” từ môi giới khi chưa qua bộ lọc này đều tiềm ẩn rủi ro pháp lý và nguy cơ mất tài sản.

Khung điều kiện chung: [Ai được mua NOXH 2026?](/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat).

## 3. Cấu trúc hồ sơ pháp lý chuẩn: tự thực hiện, minh bạch, đúng luật

Một bộ hồ sơ đăng ký mua nhà ở xã hội hợp lệ gồm các thành phần theo pháp luật hành chính công — hoàn toàn nằm trong khả năng tự chuẩn bị:

1. Đơn đăng ký mua (hoặc thuê, thuê mua) nhà ở xã hội: theo biểu mẫu ban hành kèm thông báo mở bán chính thức của Chủ đầu tư và Sở Xây dựng.
2. Giấy tờ tùy thân: bản sao có chứng thực Căn cước công dân gắn chip của các thành viên hộ có tên trong đơn đăng ký.
3. Giấy xác nhận về thực trạng nhà ở và điều kiện nhà ở: do cơ quan, tổ chức có thẩm quyền (UBND cấp xã/phường hoặc đơn vị công tác) kiểm tra, xác thực.
4. Giấy tờ chứng minh điều kiện thu nhập: văn bản xác nhận thu nhập hoặc giấy tờ chứng minh không thuộc diện chịu thuế thu nhập cá nhân thường xuyên (với nhóm phải kiểm trần thu nhập).
5. Giấy tờ chứng minh tư cách đối tượng: quyết định tuyển dụng, hợp đồng lao động, xác nhận đóng bảo hiểm xã hội, giấy xác nhận công nhân khu công nghiệp, hoặc giấy tờ người có công / chính sách xã hội.
6. Bản cam kết và tờ khai tự chịu trách nhiệm pháp lý: kê khai trung thực thông tin hồ sơ theo yêu cầu cơ quan quản lý nhà nước.

Khuyến cáo: hồ sơ chỉ có giá trị khi nộp trực tiếp tại địa điểm tiếp nhận chính thức của Chủ đầu tư hoặc qua cổng dịch vụ công do cơ quan nhà nước chỉ định. Tuyệt đối không chuyển tiền cọc hoặc phí dịch vụ qua tài khoản cá nhân môi giới. Chi tiết: [cảnh báo lừa đảo suất nội bộ](/wiki-nha-o-xa-hoi/${SLUG_CANHBAO}).

## Kiểm tra nhanh

Bạn đang phân vân mình có đủ điều kiện mua nhà ở xã hội không?
[Kiểm tra miễn phí bạn có thuộc đối tượng đủ điều kiện mua NƠXH không](/cong-cu/dieu-kien-noxh)

${NOXH_SUPPORT_CLOSING}

*Bài viết nhằm bảo vệ người mua trước rủi ro hệ thống và chiêu trò trục lợi hồ sơ NOXH. Căn cứ pháp lý quy chiếu Luật Nhà ở 2023 và thông báo chính thức của cơ quan quản lý nhà nước — đối chiếu thêm thông báo đợt mở bán của Sở Xây dựng / Chủ đầu tư.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-20T08:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/articles/phu-tho-dmc-phoi-canh.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "11 nhóm đối tượng mua NOXH Lý Thường Kiệt — Điều 76 & checklist hồ sơ | HouseX",
    seoDesc:
      "Chiếu chuẩn 11 nhóm Điều 76 Luật Nhà ở 2023, bộ ba nhà ở – thu nhập – chủ thể, checklist hồ sơ tự làm cho NOXH 324 Lý Thường Kiệt Quận 10.",
    tags: [TAG],
    projects: [PROJECT],
  },
  {
    id: "article-ltk-funnel-03-sot",
    slug: SLUG_SOT,
    title:
      "Tại sao NOXH Lý Thường Kiệt tạo nên cơn sốt tại thị trường TP.HCM?",
    excerpt:
      "Vị trí đối diện sân vận động Phú Thọ, bao quanh bệnh viện – đại học – tiện ích trung tâm, cộng chênh giá định tính ~23,2 triệu/m² so với căn hộ thương mại cùng khu khoảng 80–100 triệu/m² — đọc sốt bằng số liệu, không theo đám đông.",
    body: `## Tọa độ hiếm trong lõi Quận 10

Dự án tại 324 Lý Thường Kiệt, phường Diên Hồng — đối diện Nhà thi đấu / sân vận động Phú Thọ, gần Bệnh viện Trưng Vương, Bệnh viện Chợ Rẫy, ĐH Y Dược, ĐH Bách Khoa và mạng lưới trường – chợ – thương mại nội thành. Với người Sài Gòn ở thực, điểm cộng là đường cao ráo, con cái đi học và khám chữa bệnh không phải chạy xa tỉnh.

Landing và mặt bằng: [${LANDING}](${LANDING}).

${EDITORIAL_FIGURES.ltkPhoiCanh}

## Bài toán chênh lệch giá — định tính, không khẩu hiệu

| Phân khúc | Đơn giá tham chiếu (truyền thông / công bố) | Ghi chú |
|-----------|---------------------------------------------|---------|
| NOXH Lý Thường Kiệt | 23.251.398 đ/m² (VAT, chưa bảo trì + hệ số) | Chỉ đúng đối tượng được duyệt |
| Căn hộ thương mại cùng khu (vd. Xi Grand Court, Kingdom 101) | Thường được nêu khoảng 80–100 triệu/m² | Giá giao dịch thay đổi theo tầng / đợt — không lấy làm cam kết |

Chênh lệch đơn giá lớn giải thích sức hút tìm kiếm — nhưng “hời” chỉ hiện hữu nếu hồ sơ hợp lệ và không mua suất chênh ngoài luồng. Xem [giá & quỹ căn](/wiki-nha-o-xa-hoi/${SLUG_GIA}) · [hồ sơ đúng luật](/wiki-nha-o-xa-hoi/${SLUG_HOSO}).

## Ngập, kẹt xe, phí quản lý — hỏi thẳng trước khi nộp

- Ngập / thoát nước: đoạn Lý Thường Kiệt khu vực dự án được mô tả cao ráo hơn nhiều tuyến vùng trũng; vẫn nên khảo sát thực địa giờ mưa lớn.
- Kẹt xe: cửa ngõ Quận 10 – 5 – 3 đông vào cao điểm; bù lại gần chỗ làm / trường nội thành.
- Phí quản lý: xác nhận mức dự kiến với ban quản lý / CĐT khi nhận nhà — không lấy số đoán từ hội nhóm.

${EDITORIAL_FIGURES.metroHub}

## Đọc tiếp: tỉnh táo tiền bạc

Trước khi chuyển bất kỳ khoản nào ngoài hợp đồng chính thức: [Cảnh báo suất nội bộ & thanh toán an toàn](/wiki-nha-o-xa-hoi/${SLUG_CANHBAO}).

${NOXH_SUPPORT_CLOSING}

*So sánh thương mại mang tính định hướng thị trường — giá cụ thể từng dự án thương mại xác minh tại điểm bán.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-22T09:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/articles/phu-tho-dmc-phoi-canh.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Vì sao NOXH Lý Thường Kiệt sốt — vị trí Quận 10 & chênh giá | HouseX",
    seoDesc:
      "Vị trí Phú Thọ / bệnh viện / đại học và so sánh định tính 23,2 vs ~80–100 triệu/m² thương mại cùng khu — đọc sốt bằng số liệu.",
    tags: [TAG],
    projects: [PROJECT],
  },
  {
    id: "article-ltk-funnel-04-canhbao",
    slug: SLUG_CANHBAO,
    title:
      "Tỉnh táo trước bẫy suất nội bộ chênh tiền và chiêu thu phí hồ sơ tại NOXH Lý Thường Kiệt",
    excerpt:
      "Ba bẫy phổ biến trên Facebook, chiêu thuê quỹ 270 căn rồi hứa hóa giá sổ, quy tắc 3 không – 3 có và lịch thanh toán không vượt quá 95% trước bàn giao sổ — bảo vệ tiền trước khi săn suất Quận 10.",
    body: `## Vì sao LTK bị lợi dụng để giăng bẫy?

Giá công bố khoảng 23,2 triệu/m² tại lõi Quận 10 khiến cầu tìm kiếm tăng mạnh. Lợi dụng tâm lý muốn thử vận may, nhiều hội nhóm và tin nhắn rác rao “suất nội bộ”, “bao đậu hồ sơ”, “giữ chỗ bốc thăm”. Thực tế xét duyệt NOXH đi qua CĐT và Sở Xây dựng — không mua bằng tiền chênh ngoài luồng.

Bối cảnh giá: [Bóc tách giá chính thức](/wiki-nha-o-xa-hoi/${SLUG_GIA}) · Hồ sơ: [Checklist đối tượng](/wiki-nha-o-xa-hoi/${SLUG_HOSO}).

${EDITORIAL_FIGURES.ltkPhoiCanh}

## Ba bẫy phổ biến trên hội nhóm Facebook

### Bẫy 1 — Rao suất ngoại giao / suất nội bộ bù chênh 150–200 triệu

Môi giới tự phát cam kết “quen CĐT / sở”, yêu cầu ký giấy đặt cọc hứa mua hoặc hợp đồng tư vấn và nộp tiền chênh. Sự thật: không có suất nội bộ hợp pháp để mua bằng tiền lẻ bên ngoài. Khi hồ sơ loại hoặc trượt bốc thăm, bên kia kéo dài thời gian hoặc biến mất.

### Bẫy 2 — Nhận làm hồ sơ “bao đậu” phí vài triệu

Chào mời chứng minh thu nhập / hộ khẩu khống. Sự thật: kê khai gian dối có thể bị thu hồi nhà, cấm tham gia NOXH sau này và chịu chế tài. Hồ sơ mẫu có thể tự làm miễn phí theo checklist — không cần trả phí “bao đậu”.

### Bẫy 3 — Spam yêu cầu chuyển khoản giữ chỗ / lấy CCCD

Tự xưng ban quản lý dự án, đòi 10–20 triệu “mã bốc thăm ưu tiên”. Sự thật: Đức Mạnh Group đã nêu công khai hướng tiếp nhận hồ sơ tại kênh chính thức; không ủy quyền cá nhân / sàn lạ thu tiền giữ chỗ vào tài khoản riêng. Chỉ nộp đúng nơi và đúng thông báo đợt.

## Cảnh báo: đừng sập bẫy hợp đồng thuê mang danh mua bán

Quỹ căn: 755 bán + 270 thuê. Một số đối tượng dụ “mua” căn thuộc quỹ thuê bằng hợp đồng thuê dài hạn, thu một cục 70–80% giá trị, hứa miệng sau vài năm sẽ hóa giá cấp sổ.

Hệ quả: về pháp lý bạn là người thuê, không phải chủ sở hữu. Quỹ NOXH cho thuê không chuyển thành mua bán theo lời hứa môi giới. Rủi ro mất trắng tiền nếu bên đứng tên / dự án có sự cố.

## Quy trình 3 không – 3 có

- Không tin suất nội bộ / ngoại giao / bao đậu trên mạng.
- Không chuyển khoản phí giữ chỗ / tư vấn vào tài khoản cá nhân.
- Không ký giấy hứa mua, ủy quyền, thuê mang danh mua để né luật.
- Có cập nhật tại kênh chính thức Đức Mạnh Group và Sở Xây dựng TP.HCM.
- Có tự rà đối tượng – nhà ở – thu nhập theo luật.
- Có phương án dự phòng nếu không trúng suất.

## Quy tắc tài chính: không thu vượt quá 95% trước bàn giao sổ

Theo khung nhà ở xã hội / hợp đồng mua bán thông dụng, chủ đầu tư không được thu vượt tỷ lệ quy định (thường nêu không quá 95% giá trị hợp đồng) khi chưa bàn giao nhà / sổ theo tiến độ hợp đồng. Đọc lịch đóng tiền trên hợp đồng gốc; mọi khoản ngoài lịch là tín hiệu đỏ.

## Nếu không trúng suất Lý Thường Kiệt — phương án thay thế trên House X

| Hướng | Gợi ý |
|-------|--------|
| NOXH vùng ven tổng vốn thấp hơn | [DTA Happy Home Nhơn Trạch](/du-an/${DTA_HAPPY_HOME_SLUG}) |
| An cư cửa ngõ QL13 / Bình Dương | [${EMERALD_68_NAME}](/du-an/${EMERALD_68_SLUG}) · [NOXH Hồ Gươm Xanh](/du-an/${HGX_PROJECT_SLUG}) |
| Chủ đề hành lang QL13 | [/tin-tuc/kien-thuc/chu-de/truc-quoc-lo-13-dong-bac](/tin-tuc/kien-thuc/chu-de/truc-quoc-lo-13-dong-bac) |

Vị trí & chênh giá LTK: [Vì sao dự án sốt?](/wiki-nha-o-xa-hoi/${SLUG_SOT}).

Đọc thêm: [Vì sao dễ sập bẫy suất nội bộ — 4 đòn thao túng](/wiki-nha-o-xa-hoi/${SLUG_TAMLY}) · [NOXH có khó? Cảnh giác vẽ bùa thủ tục](/wiki-nha-o-xa-hoi/${SLUG_VEBUA}).

${NOXH_SUPPORT_CLOSING}

*Bài mang tính cảnh báo phòng chống lừa đảo — vụ việc cụ thể báo cáo cơ quan chức năng; mọi giao dịch tiền chỉ qua hợp đồng và tài khoản chính thức của CĐT.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-24T10:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/articles/phu-tho-dmc-phoi-canh.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Cảnh báo lừa đảo suất nội bộ NOXH Lý Thường Kiệt — thanh toán an toàn | HouseX",
    seoDesc:
      "Ba bẫy Facebook, bẫy thuê quỹ 270 căn, 3 không–3 có, lịch ≤95% trước sổ — bảo vệ tiền khi săn suất Quận 10.",
    tags: [TAG],
    projects: [PROJECT],
  },
  {
    id: "article-ltk-funnel-05-tamly",
    slug: SLUG_TAMLY,
    title:
      'Vì sao dễ sập bẫy "suất nội bộ"? Giải mã 4 đòn thao túng tâm lý quanh NOXH Lý Thường Kiệt',
    excerpt:
      "Khi cơ hội mua nhà giá công bố ~23,2 triệu/m² tại Quận 10 đụng lời cảnh báo của người thân — bốn chiêu đánh tráo khái niệm, đặc quyền giả, bình thường hóa rủi ro và phản kháng tâm lý khiến nạn nhân tự nguyện phản bác gia đình.",
    body: `## Giằng xé giữa giá rẻ Quận 10 và lời khuyên người thân

Giá NOXH Lý Thường Kiệt được công bố khoảng 23.251.398 đồng/m² (đã VAT) khiến nhiều hộ Sài Gòn vừa hy vọng vừa sợ mất cơ hội. Cùng lúc, người thân thường cảnh báo: “đừng mua suất ngoài luồng”. Căng thẳng thật. Bài này không thay [cảnh báo bẫy cụ thể](/wiki-nha-o-xa-hoi/${SLUG_CANHBAO}) — mà giải thích vì sao nạn nhân vẫn tự nguyện bỏ qua lời khuyên đúng.

Số liệu giá và quỹ căn: [Bóc tách giá & 755 bán / 270 thuê](/wiki-nha-o-xa-hoi/${SLUG_GIA}) · Trang dự án: [${LANDING}](${LANDING}).

${EDITORIAL_FIGURES.ltkPhoiCanh}

Bốn đòn dưới đây thường đi cùng nhau. Nhận ra một đòn đã đủ để dừng tay trước khi chuyển khoản. Cùng chủ đề “thân lừa ưa nặng”: [Mua NOXH Lý Thường Kiệt có khó không?](/wiki-nha-o-xa-hoi/${SLUG_VEBUA}).

## 1. Bẫy ngữ nghĩa nghịch lý — đánh tráo khái niệm pháp lý

Kẻ gian làm mờ ranh giới giữa hai thứ luật tách bạch, rồi khoác tên “thương mại” để nạn nhân thấy việc xuống tiền nghe chuyên nghiệp.

Cách vận dụng quanh LTK:

- Biến hợp đồng thuê nhà ở xã hội thành “hợp đồng mua trả góp dài hạn” hoặc “giữ chỗ hóa sổ sau vài năm” — đặc biệt nguy hiểm với quỹ 270 căn thuê.
- Gọi tiền chênh / tiền “chạy suất” thành “phí tư vấn hồ sơ”, “quỹ cam kết bảo đảm”, “phí giữ chỗ ưu tiên”.

Tên gọi mỹ miều làm mất cảnh giác tối thiểu. Câu tự kiểm trước khi ký: tên giấy tờ trên mặt trước có khớp đúng loại giao dịch CĐT / Sở XD công bố không? Nếu chỉ có giấy tay / hợp đồng tư vấn cá nhân mà đã đòi tiền lớn — dừng.

## 2. Hiệu ứng đặc quyền giả tạo — khi “bạn là người đặc biệt”

Nhiều người dễ tin mình may mắn và đặc biệt hơn người khác — đúng lúc cò mồi khoác cho bạn tấm áo “suất riêng”.

Kịch bản hay gặp:

- “Bên em chỉ chọn đúng vài khách hoàn cảnh khó để hỗ trợ suất này.”
- “Vì quý tính cách anh/chị nên em để lại suất ngoại giao người nhà.”

Cảm giác thuộc nhóm đặc quyền làm tê liệt lý trí rà soát. Thực tế xét duyệt NOXH đi theo thông báo đợt, đối tượng và quy trình chính thức — không có “suất ngoại giao hợp pháp bằng tiền chênh”. Câu tự kiểm: nếu suất thật sự đặc biệt đến vậy, vì sao phải giữ bí mật với gia đình và chuyển khoản ngoài hợp đồng CĐT?

## 3. Lý thuyết triển vọng và bẫy chấp nhận rủi ro để “đổi đời”

Lòng tham và nỗi sợ mất cơ hội làm méo đánh giá rủi ro; đã bỏ tiền thì càng khó dừng.

Cách cò mồi vận dụng: lấy mức giá công bố ~23,2 triệu/m² của dự án (con số CĐT / Sở XD công khai), rồi vẽ sang tay ngay khi có sổ lên khoảng 80 triệu/m² như căn thương mại cùng khu. Lời dẫn thường là “làm giàu phải mạo hiểm”, “cơ hội trung tâm không liều thì bao giờ”.

Lưu ý sòng phẳng: công bố giá bán NOXH không đồng nghĩa khuyến khích chạy suất hay đầu cơ sang tay. NOXH còn ràng buộc đối tượng, thời gian chuyển nhượng và điều kiện pháp lý — “lãi gấp ba” trên lời môi giới không phải cam kết của CĐT.

Khi viễn cảnh lãi cực lớn được kích, não tự bình thường hóa rủi ro; có người giấu gia đình, vay nóng, cắm xe để bù chênh, rồi biện minh là “hy sinh vì con”. Câu tự kiểm: nếu trừ phần “lãi trên miệng”, rủi ro mất trắng tiền chênh còn chấp nhận được không — và đã đọc [quy tắc 3 không – 3 có](/wiki-nha-o-xa-hoi/${SLUG_CANHBAO}) chưa?

## 4. Hội chứng phản kháng tâm lý — vì sao nạn nhân chống lại gia đình?

Khi cảm thấy bị kiểm soát, nhiều người phản ứng bằng cách chống lại lời khuyên đúng; bề ngoài lịch lãm và từ ngữ “chuyên môn” càng làm lời ngoài dễ tin hơn lời người thân.

Cách vận dụng:

- Xây hình ảnh bóng bẩy (xe, ăn mặc, đạo lý, thuật ngữ pháp lý nửa vời) để tạo uy tín giả.
- Gieo chia rẽ: “Anh/chị giữ bí mật; người nhà không hiểu sẽ bàn ra làm mất cơ hội.”

Khi gia đình khuyên ngăn, nạn nhân kích hoạt phản kháng — cho rằng người thân “thiếu tầm nhìn”, “nhát gan” — rồi chọn tin lời hứa người ngoài. Đây là dấu hiệu đỏ, không phải bằng chứng bạn “có tầm”. Câu tự kiểm: nếu giao dịch sạch và đúng luật, vì sao lại cần giấu người thân và né kênh chính thức của CĐT?

${EDITORIAL_FIGURES.metroHub}

## Lời kết: tỉnh thức trước khi ký — và chia sẻ cho người thân

Ba việc làm ngay nếu đang bị “vuốt ve” suất nội bộ:

1. So giấy tờ với loại giao dịch thật (mua / thuê) và quỹ căn 755 bán vs 270 thuê.
2. Chỉ nộp tiền theo lịch trên hợp đồng gốc với tài khoản CĐT — đối chiếu [cảnh báo thanh toán ≤95%](/wiki-nha-o-xa-hoi/${SLUG_CANHBAO}).
3. Gửi bài này (hoặc checklist) cho vợ/chồng, anh chị em trước khi quyết — chống lại đúng đòn “giữ bí mật”.

Cùng chủ đề “bỏ tiền mua sự sợ hãi thủ tục”: [Mua NOXH Lý Thường Kiệt có khó không?](/wiki-nha-o-xa-hoi/${SLUG_VEBUA}).

Nếu không trúng suất Lý Thường Kiệt, vẫn có phương án an cư đúng luật thay vì mua chênh ngoài luồng:

| Hướng | Gợi ý trên House X |
|-------|---------------------|
| NOXH vùng ven tổng vốn thấp hơn | [DTA Happy Home Nhơn Trạch](/du-an/${DTA_HAPPY_HOME_SLUG}) |
| Cửa ngõ QL13 / Bình Dương | [${EMERALD_68_NAME}](/du-an/${EMERALD_68_SLUG}) · [NOXH Hồ Gươm Xanh](/du-an/${HGX_PROJECT_SLUG}) |
| Chủ đề hành lang QL13 | [/tin-tuc/kien-thuc/chu-de/truc-quoc-lo-13-dong-bac](/tin-tuc/kien-thuc/chu-de/truc-quoc-lo-13-dong-bac) |

${NOXH_SUPPORT_CLOSING}

*Bài mang tính giáo dục phòng chống thao túng tâm lý trong giao dịch NOXH — vụ việc cụ thể báo cáo cơ quan chức năng; mọi giao dịch tiền chỉ qua hợp đồng và tài khoản chính thức của CĐT.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T14:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/articles/phu-tho-dmc-phoi-canh.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "4 đòn thao túng tâm lý suất nội bộ NOXH Lý Thường Kiệt | HouseX",
    seoDesc:
      "Giải mã bẫy ngữ nghĩa, đặc quyền giả, lý thuyết triển vọng và phản kháng tâm lý — vì sao nạn nhân phản bác lời khuyên gia đình quanh NOXH Quận 10.",
    tags: [TAG],
    projects: [PROJECT],
  },
  {
    id: "article-ltk-funnel-06-vebua",
    slug: SLUG_VEBUA,
    title:
      "Mua Nhà ở xã hội Lý Thường Kiệt có thực sự khó? Cảnh giác chiêu hù dọa thủ tục để trục lợi hồ sơ",
    excerpt:
      "Được hướng dẫn tự làm hồ sơ thì nghi lừa; nghe hù dọa thủ tục và hét phí thì lại tin — chiêu vẽ bùa quanh NOXH Lý Thường Kiệt Quận 10.",
    body: `> Việc sở hữu một căn nhà ở xã hội giữa trung tâm Quận 10 như dự án Lý Thường Kiệt (Phú Thọ DMC) là niềm mơ ước lớn của nhiều gia đình lao động. Tuy nhiên, chính sự quan tâm lớn này lại biến người mua thành mục tiêu của các chiêu trò thao túng tâm lý. Bài viết này bóc trần những cạm bẫy “hù dọa thủ tục” để bạn tự tin bảo vệ quyền lợi và túi tiền của chính mình.

## 1. Nghịch lý tâm lý: Khi tư vấn đúng luật thì nghi ngờ, nghe hù dọa lại thấy an tâm

Nhiều hộ gia đình khi tìm hiểu về dự án Nhà ở xã hội (NOXH) Lý Thường Kiệt thường rơi vào một vòng xoáy tâm lý rất đáng tiếc:

- Khi được hướng dẫn tự làm hồ sơ theo đúng mẫu công khai, miễn phí, họ lại hoài nghi: “Sao dễ thế, liệu có lừa đảo không?”.
- Ngược lại, khi nghe môi giới phao tin rằng “hồ sơ gắt lắm, 1 chọi cả trăm, tự nộp chắc chắn rớt từ vòng gửi xe”, kèm theo câu cửa miệng “đồng tiền đi trước là đồng tiền khôn”, họ lại sẵn sàng chi ra vài triệu cho đến vài trăm triệu đồng tiền phí dịch vụ vì cảm thấy an tâm hơn.

Sự kỳ vọng về một chốn an cư giá tốt (~23,2 triệu/m² cho căn trung tâm) đôi khi khiến chúng ta dễ bị rào cản tâm lý đánh lừa, cho rằng quy trình chính thống phải thật phức tạp và tốn kém mới là “hàng độc quyền”.

${EDITORIAL_FIGURES.ltkPhoiCanh}

## 2. Kịch bản “vẽ bùa”: Biến việc có thể tự làm thành bất khả thi

Để dễ hình dung, hãy nhìn vào một kịch bản quen thuộc mà nhiều người mua nhà thường gặp phải:

> Minh họa thực tế: Anh H. hoàn toàn đủ điều kiện và đã tự chuẩn bị sẵn mẫu xác nhận thu nhập. Khi tham gia các hội nhóm, anh nhận được tin nhắn: “Dự án Lý Thường Kiệt siết chặt lắm, tự nộp chỉ có loại. Bên em có suất ngoại giao, hỗ trợ làm đẹp hồ sơ, phí 5 triệu đồng và cọc trước giữ chỗ”. Vì quá lo lắng mất cơ hội tại Quận 10, anh chuyển khoản. Vài tuần sau, anh nhận được câu trả lời “đợt này Sở siết, hồ sơ chưa qua” và khoản tiền phí bị ngâm lại hoặc yêu cầu đóng thêm tiền chênh lệch để đổi sang suất khác. Trong khi đó, nếu tự nộp theo đúng cổng thông tin công khai, bộ hồ sơ của anh hoàn toàn hợp lệ mà không mất khoản phí trôi nổi nào.

### Ba bước thao túng quen thuộc của cò mồi

| Bước | Thủ thuật của môi giới | Mục đích thực tế |
| --- | --- | --- |
| 1. Phóng đại khó khăn | Tạo cảm giác hoảng sợ với các từ ngữ như “hồ sơ gắt”, “1 chọi 100”, “tự nộp chắc chắn rớt”. | Lợi dụng tâm lý lo âu của người mua. |
| 2. Đóng vai cứu thế | Tự nhận có “đường dây riêng”, “ban quản lý hỗ trợ”, dịch vụ “làm đẹp hồ sơ”. | Chào mời các lối tắt dịch vụ tốn phí. |
| 3. Thu phí & kéo dài | Thu phí vài triệu đồng/bộ, yêu cầu cọc giữ chỗ, hoặc đẩy lên mức chênh lệch suất nội bộ. | Trục lợi tài chính dù hồ sơ đậu hay rớt. |

Sự thật minh bạch: phần lớn các đối tượng môi giới không chính thống chỉ cầm bộ giấy tờ hợp pháp của chính bạn đi nộp như bao người khác. Nếu bạn đậu, họ nhận vơ là do “có đường dây”. Nếu bạn rớt, họ đổ lỗi cho cơ quan chức năng rồi quỵt tiền. Cho đến nay, Chủ đầu tư Đức Mạnh và Sở Xây dựng không ủy quyền cho bất kỳ cá nhân môi giới nào đứng ra bán “suất qua tay”.

Xem chi tiết bảng giá chính thức tại [bài công bố giá](/wiki-nha-o-xa-hoi/${SLUG_GIA}).

## 3. Sự thật sòng phẳng: Khó ở cạnh tranh, không phải ở thủ tục phức tạp

Chúng ta cần rạch ròi giữa hai khái niệm hoàn toàn khác nhau:

- Khó vì tính cạnh tranh cao: Với hàng nghìn hồ sơ đổ về nhưng số lượng căn hộ có hạn (755 căn mở bán tại Lý Thường Kiệt), tỷ lệ chọi là áp lực thực tế mà bất kỳ ai mua NOXH cũng phải đối mặt.
- Khó vì giấy tờ “bí truyền”: Đây hầu hết là lời đồn thổi. Toàn bộ biểu mẫu, giấy xác nhận thực trạng nhà ở, thu nhập theo từng đợt đều được cơ quan chức năng và Chủ đầu tư hướng dẫn chi tiết, công khai.

Nếu bạn thuộc đúng nhóm đối tượng chính sách, đáp ứng trọn vẹn ba tiêu chuẩn cốt lõi về nhà ở – thu nhập – diện ưu tiên, bạn hoàn toàn có thể tự hoàn thiện hồ sơ mà không cần tốn một đồng “phí bôi trơn” nào.

- Bạn chưa rõ mình thuộc đối tượng nào? Hãy đối chiếu ngay [checklist hồ sơ LTK](/wiki-nha-o-xa-hoi/${SLUG_HOSO}) và bài viết [Ai được mua NOXH 2026?](/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat).
- House X không nhận làm dịch vụ bao đậu hồ sơ; chúng tôi chỉ đồng hành hướng dẫn bạn tự làm đúng luật qua trang [Liên hệ](/lien-he).

## 4. Cái giá đắt khi lựa chọn lối tắt qua môi giới bất chính

- Thiệt hại tài chính trực tiếp: Mất các khoản phí dịch vụ, tiền cọc giữ chỗ vào tài khoản cá nhân không có hóa đơn chứng từ pháp lý.
- Rủi ro pháp lý lâu dài: Bị dụ dỗ làm giả giấy tờ, khai khống thu nhập hoặc điều kiện nhà ở. Khi cơ quan chức năng hậu kiểm phát hiện, bạn có thể đối mặt với quyết định thu hồi nhà và tước quyền mua NOXH trong tương lai.
- Sa vào bẫy “suất nội bộ giả mạo”: Đọc thêm bài phân tích [Cảnh báo suất nội bộ & quỹ 270 căn hộ thuê](/wiki-nha-o-xa-hoi/${SLUG_CANHBAO}) để tránh những chiêu trò tinh vi hơn.

${EDITORIAL_FIGURES.noxhEligibility}

## Lời kết: Đặt trọn niềm tin vào quy trình công khai, nói không với hù dọa

Ba việc bạn cần làm ngay hôm nay để bảo vệ chính mình:

1. Chủ động tra cứu: Luôn tải và in biểu mẫu trực tiếp từ thông báo mở bán chính thức của Chủ đầu tư/Sở Xây dựng để đối chiếu, không nghe theo các loại giấy tờ “ngoài luồng” do môi giới cung cấp.
2. Tuyệt đối không chuyển tiền cọc/phí hồ sơ vào tài khoản cá nhân. Mọi khoản thanh toán mua nhà chỉ thực hiện trực tiếp theo đúng hợp đồng với Chủ đầu tư khi hồ sơ đã được duyệt chính thức.
3. Lan tỏa thông tin: Chia sẻ bài viết này đến người thân, bạn bè đang có nhu cầu mua nhà để cùng nhau tỉnh táo trước các chiêu trò trục lợi tâm lý.

Nếu bạn cảm thấy quá áp lực với quy trình xét duyệt NOXH và muốn tìm kiếm các phương án an cư thương mại hoặc NOXH vùng ven với pháp lý minh bạch, hãy tham khảo các gợi ý dưới đây:

| Hướng phát triển | Gợi ý dự án tại House X |
| --- | --- |
| Khu vực vùng ven | [DTA Happy Home Nhơn Trạch](/du-an/${DTA_HAPPY_HOME_SLUG}) |
| Trục Quốc lộ 13 / Bình Dương | [${EMERALD_68_NAME}](/du-an/${EMERALD_68_SLUG}) · [NOXH Hồ Gươm Xanh](/du-an/${HGX_PROJECT_SLUG}) |
| Chuyên đề tuyến QL13 | [/tin-tuc/kien-thuc/chu-de/truc-quoc-lo-13-dong-bac](/tin-tuc/kien-thuc/chu-de/truc-quoc-lo-13-dong-bac) |

${NOXH_SUPPORT_CLOSING}

*Bài viết mang tính chất giáo dục, phòng chống trục lợi hồ sơ NOXH. Mọi hành vi lừa đảo, thu phí trái phép xin vui lòng phản ánh trực tiếp đến cơ quan chức năng. Các giao dịch tài chính hợp pháp chỉ thực hiện qua tài khoản chính thức của Chủ đầu tư.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T16:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/articles/phu-tho-dmc-phoi-canh.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Mua NOXH Lý Thường Kiệt có khó? Cảnh giác vẽ bùa thủ tục | HouseX",
    seoDesc:
      "Vì sao dễ tin lời hù dọa thủ tục và trả phí hồ sơ vô căn cứ quanh NOXH Lý Thường Kiệt Quận 10 — nhận diện kịch bản vẽ bùa và cách tự làm đúng luật.",
    tags: [TAG],
    projects: [PROJECT],
  },
];
