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

const UPDATED = new Date("2026-07-27T00:00:00.000Z");
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
| Hồ sơ / đối tượng | [Ai có suất mua? Checklist hồ sơ](/wiki-nha-o-xa-hoi/${SLUG_HOSO}) |
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
      "Ai có suất mua Nhà ở xã hội 324 Lý Thường Kiệt? Hướng dẫn chuẩn bị hồ sơ đúng luật",
    excerpt:
      "Đối tượng theo Luật Nhà ở, ba điều kiện nhà ở – thu nhập – đối tượng, và checklist hồ sơ thực tế khi nộp vào NOXH Lý Thường Kiệt — tránh mất phí “bao đậu” trên mạng.",
    body: `## Vì sao hồ sơ Lý Thường Kiệt dễ bị loại dù “đủ cảm giác”?

NOXH nội thành cạnh tranh cực cao. Nhiều hồ sơ bị loại vì sai nhóm đối tượng, vượt trần thu nhập, còn nhà ở tên hộ, hoặc giấy xác nhận không đúng mẫu. Bài này neo theo Luật Nhà ở và nghị định hướng dẫn — chi tiết khung chung: [Ai được mua NOXH 2026?](/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat).

Giá và quỹ căn: [Bóc tách giá 23,2 triệu/m²](/wiki-nha-o-xa-hoi/${SLUG_GIA}) · Trang dự án: [${LANDING}](${LANDING}).

${EDITORIAL_FIGURES.noxhEligibility}

## Các nhóm đối tượng được xét duyệt (Điều 76 Luật Nhà ở)

Luật Nhà ở 2023 liệt kê các nhóm đối tượng mua / thuê NOXH (thường được truyền thông gọi khoảng 10–12 nhóm tùy cách gom). Nhóm hay gặp khi nộp nội thành:

- Người thu nhập thấp tại đô thị.
- Công chức, viên chức, cán bộ.
- Công nhân / lao động KCN (ít gặp hơn với LTK nội thành nhưng vẫn thuộc khung luật nếu đủ điều kiện địa bàn).
- Hộ nghèo, cận nghèo; người có công; một số nhóm ưu tiên khác theo điều khoản.

Lưu ý thực tế: nhóm gia đình có từ hai con trở lên có thể gắn với chính sách dân số / ưu tiên theo văn bản áp dụng tại thời điểm mở bán — luôn đối chiếu thông báo đợt của Sở Xây dựng và CĐT, không theo lời môi giới.

## Bộ ba điều kiện bắt buộc

| Trụ | Nội dung sòng phẳng |
|-----|---------------------|
| Đối tượng | Thuộc một nhóm tại Điều 76 |
| Nhà ở | Chưa sở hữu nhà ở tại TP.HCM theo quy định, hoặc diện tích bình quân đầu người dưới mức tối thiểu (Điều 77) |
| Thu nhập | Với nhóm phải kiểm trần: thuộc diện không nộp thuế TNCN thường xuyên / không vượt mức nghị định hiện hành |

Thiếu một trụ là hồ sơ không đủ điều kiện xét — dù đã “cọc suất” ngoài luồng.

## Checklist hồ sơ thực tế (tự làm, không trả phí bao đậu)

1. Đơn đăng ký mua / thuê theo mẫu đợt mở bán.
2. Giấy tờ nhân thân (CCCD) của các thành viên hộ theo yêu cầu.
3. Giấy xác nhận thực trạng nhà ở (đúng cơ quan có thẩm quyền).
4. Xác nhận thu nhập / không thuộc diện nộp thuế TNCN thường xuyên (nếu thuộc nhóm phải chứng minh).
5. Giấy tờ chứng minh đối tượng (công chức, người có công…).
6. Cam kết / tờ khai theo mẫu CĐT – Sở Xây dựng.

Nộp đúng nơi công bố (văn phòng CĐT / cổng tiếp nhận chính thức). Không chuyển khoản “giữ chỗ” cho tài khoản cá nhân — xem [cảnh báo lừa đảo suất nội bộ](/wiki-nha-o-xa-hoi/${SLUG_CANHBAO}).

${NOXH_SUPPORT_CLOSING}

*Đối chiếu văn bản gốc trên Cổng Thông tin Chính phủ và thông báo đợt mở bán của Sở Xây dựng / CĐT.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-20T08:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/articles/phu-tho-dmc-phoi-canh.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Hồ sơ mua NOXH Lý Thường Kiệt — đối tượng & checklist | HouseX",
    seoDesc:
      "Ai được mua NOXH 324 Lý Thường Kiệt: đối tượng Luật Nhà ở, ba điều kiện, checklist hồ sơ — tránh phí bao đậu trên mạng.",
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
      "Nghịch lý thân lừa ưa nặng: hồ sơ minh bạch tự nộp thì nghi ngờ, còn khi bị hù dọa thủ tục và hét phí vài triệu đến chục triệu thì lại tin là đúng quy trình — vì sao dễ bỏ tiền mua sự sợ hãi quanh NOXH Quận 10.",
    body: `## Khi lời khuyên đúng luật nghe “quá dễ”, còn lời hù dọa lại nghe “đúng gu”

Nhiều hộ quanh NOXH Lý Thường Kiệt gặp đúng nghịch lý này: được hướng dẫn tự làm hồ sơ theo mẫu công khai thì nghi “lẻ tẻ quá, chắc lừa”; ngược lại, nghe môi giới dọa “1 chọi trăm, tự nộp chắc rớt từ vòng gửi xe”, rồi hét phí dịch vụ vài triệu hoặc cọc giữ chỗ chục triệu — lại gật đầu vì nghĩ “phải gian nan thế mới thật”.

Dân gian gọi là thân lừa ưa nặng: sẵn sàng bỏ tiền mua sự sợ hãi. Phần dưới giải thích vì sao dễ tin lời hù dọa, rồi chỉ rõ kịch bản “vẽ bùa thủ tục” quanh dự án Quận 10 — và cách tự làm hồ sơ đúng luật thay vì trả phí vô căn cứ.

Đối chiếu hồ sơ: [Checklist đối tượng LTK](/wiki-nha-o-xa-hoi/${SLUG_HOSO}). Cảnh giác suất nội bộ: [4 đòn thao túng tâm lý](/wiki-nha-o-xa-hoi/${SLUG_TAMLY}). Trang dự án: [${LANDING}](${LANDING}).

${EDITORIAL_FIGURES.ltkPhoiCanh}

## 1. Định kiến về sự phức tạp: vì sao người mua tự giăng bẫy?

Bộ não dễ tin phần thưởng lớn (căn trung tâm giá công bố ~23,2 triệu/m²) buộc phải đi kèm quy trình cực kỳ phức tạp. Việc đúng luật mà nghe thẳng thắn — mẫu đơn công khai, nộp đúng nơi, chờ xét duyệt — lại kích hoạt nghi ngờ: “dễ thế sao được?”.

Cộng thêm ám ảnh rào cản: nhiều người đã từng mệt với giấy tờ hành chính, mặc định “không quan hệ, không tiền lót tay thì không chạm NOXH”. Định kiến này là nguyên liệu sẵn. Cò mồi chỉ cần xác nhận nỗi sợ đó, không cần chứng minh đường dây thật.

Câu tự kiểm: bạn đang trả tiền cho kết quả xét duyệt — thứ không ai ngoài cơ quan có thẩm quyền bán được — hay đang trả tiền để được nghe đúng câu chuyện mà bạn sợ từ trước?

## 2. Kịch bản “vẽ bùa”: biến việc có thể tự làm thành bất khả thi

Minh họa tổng hợp (không phải hồ sơ cá nhân nào công khai): anh H. đủ điều kiện đối tượng, đã in sẵn mẫu xác nhận nhà ở / thu nhập. Trên hội nhóm, được inbox: “LTK siết chặt lắm, tự nộp chắc chắn loại; bên em có người hỗ trợ làm đẹp hồ sơ, phí 5 triệu — muốn chắc suất thì cọc thêm”. Anh chuyển khoản vì sợ mất cơ hội Quận 10. Vài tuần sau: “đợt này Sở siết, hồ sơ anh chưa qua” — tiền phí không hoàn, hoặc bị kéo sang “suất ưu tiên” đòi thêm chênh. Bộ hồ sơ lẽ ra anh tự nộp miễn phí vẫn nằm đúng chỗ công khai.

Ba bước tinh vi:

| Bước | Việc cò làm | Mục đích |
|------|-------------|----------|
| 1. Phóng đại khó khăn | “Hồ sơ gắt”, “1 chọi 100”, “tự nộp rớt từ vòng gửi xe” | Tạo hoảng sợ |
| 2. Đóng vai cứu thế | “Đường dây riêng”, “ban quản lý hỗ trợ”, “làm đẹp hồ sơ” | Bán lối tắt |
| 3. Thu phí / kéo dài | Phí vài triệu/bộ; hoặc cọc chục triệu “giữ chỗ bốc thăm”; nặng hơn là chênh suất | Ăn tiền dù đậu hay rớt |

Sự thật trần trụi: phần lớn trường hợp, bên kia chỉ cầm bộ giấy hợp pháp của bạn đi nộp như mọi người. Bạn đậu — họ nhận công “có đường dây”. Bạn rớt — họ đổ “đợt siết” rồi quỵt hoặc níu thêm phí. Không có bằng chứng công khai nào cho thấy CĐT Đức Mạnh hay Sở Xây dựng bán “suất qua môi giới cá nhân”. Giá và kênh chính thức xem [bài công bố giá](/wiki-nha-o-xa-hoi/${SLUG_GIA}) và thông báo đợt mở bán.

## 3. Sự thật sòng phẳng: khó ở cạnh tranh, không phải ở “bùa thủ tục”

Hai việc dễ lẫn:

- Khó vì cạnh tranh: vài trăm suất bán (755 căn bán tại LTK) trước hàng nghìn / chục nghìn hồ sơ — tỷ lệ chọi cao là thật.
- Khó vì giấy tờ “bí truyền”: thường là lời vẽ. Mẫu đơn, xác nhận thực trạng nhà ở, thu nhập theo đợt đều có form và hướng dẫn công khai khi Sở / CĐT mở cổng tiếp nhận.

Bạn thuộc đúng đối tượng, đủ ba trụ nhà ở – thu nhập – nhóm ưu tiên thì hoàn toàn có thể tự hoàn thiện checklist — không cần trả phí “bôi trơn hồ sơ”. Điểm nào chưa rõ: đối chiếu [checklist LTK](/wiki-nha-o-xa-hoi/${SLUG_HOSO}) và bài điều kiện chung [Ai được mua NOXH 2026?](/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat). House X không nhận làm dịch vụ bao đậu; hỗ trợ hướng dẫn tự làm đúng luật qua [/lien-he](/lien-he).

## 4. Cái giá khi chọn lối tắt qua môi giới bất chính

- Mất phí dịch vụ / cọc giữ chỗ vào tài khoản cá nhân — khó đòi khi “hồ sơ rớt”.
- Bị dụ làm khống giấy tờ: rủi ro hậu kiểm, thu hồi nhà, chế tài tham gia NOXH sau này — nặng hơn vài triệu phí.
- Lẫn sang bẫy suất nội bộ / thuê mang danh mua: xem [cảnh báo suất nội bộ & quỹ 270 thuê](/wiki-nha-o-xa-hoi/${SLUG_CANHBAO}).

Tự lấy dây buộc mình xảy ra khi bạn trả tiền để được sợ đúng cách cò muốn bạn sợ — rồi tin rằng nỗi sợ đó là bằng chứng quy trình “chuyên nghiệp”.

${EDITORIAL_FIGURES.noxhEligibility}

## Lời kết: tin quy trình công khai, không tin lời hù dọa vô căn cứ

Ba việc làm ngay nếu đang bị dọa thủ tục:

1. In / tải mẫu theo thông báo đợt chính thức — so với lời môi giới xem họ có bịa thêm giấy “đặc biệt” không.
2. Không chuyển phí hồ sơ / giữ chỗ vào tài khoản cá nhân; chỉ nộp tiền theo hợp đồng CĐT khi đã được duyệt đúng luật.
3. Gửi bài này cho người thân trước khi “cọc cho chắc” — chống đúng tâm lý thân lừa ưa nặng.

Nếu mệt với vòng xét duyệt NOXH và muốn phương án ký hợp đồng mua bán thương mại / NOXH vùng ven đúng kênh:

| Hướng | Gợi ý trên House X |
|-------|---------------------|
| NOXH vùng ven | [DTA Happy Home Nhơn Trạch](/du-an/${DTA_HAPPY_HOME_SLUG}) |
| QL13 / Bình Dương | [${EMERALD_68_NAME}](/du-an/${EMERALD_68_SLUG}) · [NOXH Hồ Gươm Xanh](/du-an/${HGX_PROJECT_SLUG}) |
| Chủ đề QL13 | [/tin-tuc/kien-thuc/chu-de/truc-quoc-lo-13-dong-bac](/tin-tuc/kien-thuc/chu-de/truc-quoc-lo-13-dong-bac) |

${NOXH_SUPPORT_CLOSING}

*Bài giáo dục phòng chống trục lợi hồ sơ NOXH — vụ việc cụ thể báo cáo cơ quan chức năng; mọi giao dịch tiền chỉ qua hợp đồng và tài khoản chính thức của CĐT.*`,
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
