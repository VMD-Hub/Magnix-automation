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

const TAG = NOXH_TAG_DU_AN_GIA;
const PROJECT = { slug: LTK_PROJECT_SLUG, name: LTK_PROJECT_NAME };

/**
 * Phễu SEO 4 bài NOXH Lý Thường Kiệt — tone chuyên gia sòng phẳng (miền Nam).
 * Số liệu giá / quỹ căn theo công bố CĐT & Sở XD; không bịa bảng giá thương mại.
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

Giá và quỹ căn: [Bóc tách giá 23,2 triệu/m²](/wiki-nha-o-xa-hoi/${SLUG_GIA}) · Landing: [${LANDING}](${LANDING}).

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
| Hub hành lang QL13 | [/wiki-nha-o-xa-hoi/chu-de/truc-quoc-lo-13-dong-bac](/wiki-nha-o-xa-hoi/chu-de/truc-quoc-lo-13-dong-bac) |

Vị trí & chênh giá LTK: [Vì sao dự án sốt?](/wiki-nha-o-xa-hoi/${SLUG_SOT}).

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
];
