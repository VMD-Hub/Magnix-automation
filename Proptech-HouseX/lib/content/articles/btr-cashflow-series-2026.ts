import { NOXH_TAG_BTR } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import {
  BTR_LEGAL_DISCLAIMER,
  BTR_SUPPORT_CLOSING,
} from "@/lib/content/articles/long-term-rental-editorial-voice";
import { BTR_PILLAR_SLUG } from "@/lib/content/long-term-rental-btr";
import { ID_TOWN_SLUG, ID_TOWN_NAME } from "@/lib/content/id-town-landing";
import {
  EMERALD_68_SLUG,
  EMERALD_BOULEVARD_SLUG,
} from "@/lib/preview/ql13-commercial-mocks";
import { HGX_PROJECT_SLUG } from "@/lib/preview/ho-guom-xanh-mock";

const UPDATED = new Date("2026-07-29T08:00:00.000Z");
const PILLAR_HREF = `/tin-tuc/kien-thuc/${BTR_PILLAR_SLUG}`;
const HUB_HREF = "/tin-tuc/kien-thuc/chu-de/nha-o-cho-thue-dai-han";

const EMERALD_68_NAME = "The Emerald 68 Thuận An";
const EMERALD_BLVD_NAME = "The Emerald Boulevard Thuận An";
const HGX_NAME = "NOXH Hồ Gươm Xanh Thuận An";

/**
 * Nhóm 4 — Dòng vốn, dự án, công thức, thuế (Bài 9–12).
 */
export const BTR_CASHFLOW_SERIES_2026: ArticleDetail[] = [
  {
    id: "article-btr-09-capital",
    slug: "dong-von-dau-tu-can-ho-cho-thue-dai-han-2026",
    title:
      "Dòng vốn dài hạn vào căn hộ cho thuê: Vì sao quỹ đầu tư quan tâm phân khúc này?",
    excerpt:
      "Logic kinh doanh bền vững: dòng tiền thuê đều và bảo toàn dòng vốn thay vì lướt sóng ngắn hạn — phân tích định tính cho nhà đầu tư cá nhân và quỹ; không cam kết lợi nhuận.",
    body: `## Vì sao dòng vốn dài hạn nhìn vào thuê thay vì chỉ mua–bán?

Chu kỳ trước nhiều nhà đầu tư cá nhân ưu tiên lướt sóng đất / căn hộ. Khi thanh khoản chậm và lãi vay cao hơn kỳ vọng, câu hỏi chuyển sang: tài sản có tạo dòng tiền vận hành ổn định không? Căn hộ (hoặc tòa) cho thuê dài hạn hấp dẫn quỹ và nhà đầu tư kiên nhẫn vì:

1. Dòng thu theo tháng / quý gắn hợp đồng.
2. Giá trị thực gắn vị trí việc làm và chuẩn vận hành.
3. Ít phụ thuộc tin đồn hạ tầng ngắn hạn hơn đất nền phân lô.

Bài trụ cột: [Thuê dài hạn đến 2030](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Yield định tính — đọc thế nào cho đúng?

Tỷ suất cho thuê gộp thường được mô tả là tiền thuê năm / giá vốn căn. House X không công bố “yield chuẩn” hay cam kết số %. Cách đọc chuyên môn:

- Trừ phí quản lý, trống căn, bảo trì, thuế.
- So với lãi vay nếu dùng đòn bẩy.
- Kiểm hợp đồng thuê thực tế, không lấy giá chào trên mạng.

Công thức khung: [Tiền thuê về có đủ trả góp không?](/tin-tuc/kien-thuc/tinh-dong-tien-don-bay-can-ho-cho-thue-2026).

${EDITORIAL_FIGURES.metroHub}

## Quỹ đầu tư “nhắm” phân khúc này vì lý do thể chế nào?

Khi chính sách ưu tiên nhà ở cho thuê dài hạn (ưu đãi quỹ đất / thuế nếu được ban hành), rủi ro thể chế giảm và quy mô sản phẩm đủ lớn để quỹ vận hành. Nhà đầu tư cá nhân vẫn cần pháp lý minh bạch từng căn / từng dự án — ưu đãi vĩ mô không tự động áp cho mọi sản phẩm.

${EDITORIAL_FIGURES.thuThiem}

## Đọc tiếp?

- [Khung chọn dự án vận hành cho thuê](/tin-tuc/kien-thuc/du-an-can-ho-van-hanh-cho-thue-dai-han-2026)
- [Cho thuê nhà phải đóng thuế thế nào?](/tin-tuc/kien-thuc/thue-cho-thue-nha-2026-ma-nganh-68103)
- Chủ đề: [${HUB_HREF}](${HUB_HREF})

${BTR_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-26T12:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/hcmc-skyline-river-day.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Dòng vốn dài hạn vào căn hộ cho thuê — logic quỹ đầu tư | HouseX",
    seoDesc:
      "Vì sao quỹ và NĐT quan tâm thuê dài hạn: dòng tiền đều, bảo toàn dòng vốn — không cam kết lợi nhuận.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
  {
    id: "article-btr-10-projects",
    slug: "du-an-can-ho-van-hanh-cho-thue-dai-han-2026",
    title:
      "Khung chọn dự án căn hộ phù hợp vận hành cho thuê dài hạn",
    excerpt:
      "Checklist thiết kế, bàn giao nội thất, phí quản lý và vị trí việc làm — đối chiếu ID Town, Emerald 68 / Boulevard, Hồ Gươm Xanh trên House X; không liệt kê bảng giá bịa.",
    body: `## “Đáp ứng vận hành cho thuê dài hạn” nghĩa là gì?

Không phải mọi căn hộ bán trên thị trường đều phù hợp BTR / cho thuê dài hạn. Khung chọn định tính:

1. Vị trí gắn việc làm hoặc TOD (phút di chuyển thực tế).
2. Diện tích và bố trí dễ cho thuê (1–2 PN, căn vuông, đủ ánh sáng).
3. Nội thất / thiết bị bàn giao rõ — giảm chi phí fit-out.
4. Phí quản lý và ban vận hành minh bạch.
5. Pháp lý đủ điều kiện giao dịch / cho thuê theo quy định.

Xem thêm: [Chính sách thuê dài hạn](${PILLAR_HREF}) · Dòng vốn: [Quỹ và yield định tính](/tin-tuc/kien-thuc/dong-von-dau-tu-can-ho-cho-thue-dai-han-2026).

${EDITORIAL_FIGURES.hcmSkyline}

## Soft neo dự án trên House X (tham chiếu vận hành / vị trí)

| Dự án | Vì sao nhắc | Link |
|-------|-------------|------|
| ${ID_TOWN_NAME} | NOXH cửa ngõ Long Thành — gần việc làm / hạ tầng sân bay | [/du-an/${ID_TOWN_SLUG}](/du-an/${ID_TOWN_SLUG}) |
| ${EMERALD_68_NAME} | Cao tầng QL13 / Thuận An — gần KCN & dịch vụ | [/du-an/${EMERALD_68_SLUG}](/du-an/${EMERALD_68_SLUG}) |
| ${EMERALD_BLVD_NAME} | Phân khu thương mại cùng hành lang | [/du-an/${EMERALD_BOULEVARD_SLUG}](/du-an/${EMERALD_BOULEVARD_SLUG}) |
| ${HGX_NAME} | NOXH trong KĐT TBS — chuẩn vận hành khu đô thị | [/du-an/${HGX_PROJECT_SLUG}](/du-an/${HGX_PROJECT_SLUG}) |

Giá, tiến độ và điều kiện cho thuê xác nhận tại thời điểm giao dịch với CĐT / đơn vị phân phối — bài không thay bảng giá.

${EDITORIAL_FIGURES.metroHub}

## Checklist trước khi mua để cho thuê dài hạn?

1. Quy hoạch và pháp lý đủ điều kiện mua / cho thuê.
2. Ước phí quản lý + thuế (xem bài thuế).
3. Kịch bản trống căn 1–2 tháng / năm.
4. So sánh với nhu cầu chuyên gia trên [QL13 / vành đai](/tin-tuc/kien-thuc/can-ho-cho-thue-chuyen-gia-truc-ql13-vanh-dai-4-2026).

${EDITORIAL_FIGURES.thuThiem}

${BTR_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-26T14:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/urban-skyline-golden-hour.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Chọn dự án căn hộ vận hành cho thuê dài hạn — checklist | HouseX",
    seoDesc:
      "Checklist thiết kế–vận hành; đối chiếu ID Town, Emerald, HGX — không bịa bảng giá.",
    tags: [NOXH_TAG_BTR],
    projects: [
      { slug: ID_TOWN_SLUG, name: ID_TOWN_NAME },
      { slug: EMERALD_68_SLUG, name: EMERALD_68_NAME },
      { slug: EMERALD_BOULEVARD_SLUG, name: EMERALD_BLVD_NAME },
      { slug: HGX_PROJECT_SLUG, name: HGX_NAME },
    ],
  },
  {
    id: "article-btr-11-cashflow",
    slug: "tinh-dong-tien-don-bay-can-ho-cho-thue-2026",
    title:
      "Tiền thuê về có đủ trả góp không? Cách tính dòng tiền căn hộ cho thuê",
    excerpt:
      "Tách tiền thuê thu về, phí, thuế ước tính và trả góp vay — rồi nhìn số còn lại mỗi tháng. Tự điền số của bạn; không có «yield chuẩn» chung cho mọi căn.",
    body: `## Tiền thuê về và tiền còn lại khác nhau thế nào?

Nhiều chủ nhà nhìn số thuê niêm yết rồi kết luận «đủ sống». Thực tế nên tách hai lớp:

1. Tiền thuê thu về trong tháng (theo hợp đồng, không theo giá miệng).
2. Tiền còn lại sau phí quản lý, bảo trì, thuế ước tính, trả góp (nếu vay) và dự phòng tháng trống.

Số còn lại mới trả lời được câu: giữ căn có đỡ gánh vay không, hay đang trông vào bán lại sau này.

Bạn có thể tự điền nhanh trên [công cụ dòng tiền cho thuê](/cong-cu/dong-tien-cho-thue).

## Bảng tự điền (một căn)

| Hạng mục | Lấy số ở đâu | Gợi ý |
|----------|--------------|--------|
| Giá vốn căn | Hợp đồng mua / thỏa thuận | Cộng thuế phí mua |
| Vốn tự có | Tiết kiệm hợp pháp | Ngân hàng thường yêu cầu một phần |
| Khoản vay | Hợp đồng tín dụng | Kỳ hạn, lãi thả nổi |
| Tiền thuê tháng | Hợp đồng thuê | Không lấy giá «kỳ vọng» |
| Phí quản lý / tháng | Ban quản lý | Có thể tăng theo năm |
| Thuế ước tính | Ngưỡng doanh thu năm | Xem [bài thuế & mã 68103](/tin-tuc/kien-thuc/thue-cho-thue-nha-2026-ma-nganh-68103) |
| Tháng trống | 0–2 tháng/năm | Kịch bản xấu |
| Trả góp tháng | Lịch ngân hàng | Có thể dùng [/tinh-tra-gop](/tinh-tra-gop) |

Cách nhớ nhanh: tiền còn lại ≈ tiền thuê − phí − thuế/12 − trả góp − dự phòng trống. Đây là khung tự kiểm, không phải tư vấn đầu tư.

## Khi nào vay thêm còn hợp lý?

Vay thêm chỉ nên cân nhắc nếu tiền còn lại sau trả góp vẫn dương khi lãi tăng và có tháng trống. Nếu âm kéo dài, bạn đang phụ thuộc giá bán sau này — rủi ro quen thuộc khi thị trường chậm.

## Đọc thêm

- [Thuê dài hạn đến 2030](${PILLAR_HREF})
- [Cho thuê nhà phải đóng thuế thế nào?](/tin-tuc/kien-thuc/thue-cho-thue-nha-2026-ma-nganh-68103)
- [Chọn dự án phù hợp cho thuê](/tin-tuc/kien-thuc/du-an-can-ho-van-hanh-cho-thue-dai-han-2026)
- Chủ đề [nhà ở cho thuê dài hạn](${HUB_HREF})

${BTR_SUPPORT_CLOSING}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-26T16:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-01-civic-center.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Tính dòng tiền căn hộ cho thuê — tiền còn lại sau phí & vay | HouseX",
    seoDesc:
      "Tách tiền thuê, phí, thuế ước tính và trả góp; tự điền số trên công cụ dòng tiền — không có yield chuẩn chung.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
  {
    id: "article-btr-12-tax",
    slug: "thue-cho-thue-nha-2026-ma-nganh-68103",
    title:
      "Cá nhân cho thuê nhà có phải nộp thuế không? Ngưỡng doanh thu, cách kê khai và mã đăng ký kinh doanh",
    excerpt:
      "Dưới 100 triệu đồng/năm: miễn thuế. Từ 100 triệu trở lên: nộp 5% GTGT + 5% TNCN theo Thông tư 40/2021/TT-BTC. Mã ngành 68103 là mã đăng ký kinh doanh — không phải mã kê khai thuế.",
    body: `## Cá nhân cho thuê nhà có phải nộp thuế không?

Có — nếu tổng doanh thu cho thuê trong năm vượt ngưỡng miễn thuế.

Ngưỡng hiện hành theo Thông tư 40/2021/TT-BTC:

| Tổng doanh thu thuê trong năm | Thuế GTGT | Thuế TNCN |
|-------------------------------|-----------|-----------|
| Từ 100 triệu đồng trở xuống | Không phải nộp | Không phải nộp |
| Trên 100 triệu đồng | 5% trên doanh thu tính thuế | 5% trên doanh thu tính thuế |

Từ ngày 1/1/2026, ngưỡng miễn thuế tăng lên 200 triệu đồng/năm theo Luật Thuế GTGT 2024. Nếu bạn đang kê khai, cần theo dõi thời điểm áp dụng chính thức.

## Doanh thu tính thuế là gì — và đừng bỏ sót phụ lục

Cơ quan thuế tính doanh thu dựa trên toàn bộ tiền thuê theo hợp đồng, không phải tiền thực về tài khoản. Bao gồm:

- Tiền thuê theo hợp đồng gốc.
- Tiền thuê theo từng phụ lục điều chỉnh (nếu ký sau).
- Các khoản tiền nhận thêm ngoài hợp đồng nếu có.

Sai sót hay gặp: chủ nhà chỉ cộng tiền thu hàng tháng, bỏ qua phụ lục hoặc khoản nhận trước theo mùa. Khi thanh tra, cơ quan thuế đối chiếu hợp đồng — không đối chiếu sao kê tài khoản.

## Hồ sơ kê khai thuế cho thuê nhà gồm những gì?

Theo Điều 14 Thông tư 40/2021/TT-BTC, cá nhân trực tiếp khai thuế với cơ quan thuế cần:

1. Tờ khai theo mẫu 01/TTS — khai theo kỳ thanh toán hoặc theo năm dương lịch.
2. Phụ lục bảng kê 01-1/BK-TTS nếu là lần khai đầu tiên của hợp đồng hoặc phụ lục hợp đồng.
3. Bản sao hợp đồng thuê và phụ lục (lần khai đầu tiên).
4. Bản sao giấy ủy quyền nếu nhờ người khai thay.

Nơi nộp: Chi cục Thuế quản lý trực tiếp nơi có bất động sản cho thuê — không phải nơi bạn đăng ký hộ khẩu.

## Mã ngành 68103 là gì — và tại sao không phải mã kê khai thuế?

Đây là điểm hay bị nhầm lẫn nghiêm trọng khi tra cứu trên mạng.

68103 là mã ngành đăng ký kinh doanh, thuộc Hệ thống ngành kinh tế Việt Nam (VSIC) ban hành theo Quyết định 36/2025/QĐ-TTg, có hiệu lực từ 15/11/2025. Tên chính thức: "Cho thuê và vận hành nhà ở và đất ở".

Mã này được dùng khi:
- Đăng ký ngành nghề kinh doanh trên Giấy phép đăng ký kinh doanh.
- Phân loại hoạt động kinh tế cho mục đích thống kê và cấp phép nhà nước.

Mã 68103 không dùng khi kê khai thuế. Tờ khai thuế cho thuê nhà của cá nhân dùng mẫu 01/TTS theo Thông tư 40/2021/TT-BTC — mã ngành đăng ký kinh doanh không xuất hiện trong tờ khai đó.

## Hai phương pháp kê khai — chọn một và nhất quán

Cá nhân cho thuê nhà được chọn một trong hai cách khai thuế:

- Khai theo từng lần phát sinh kỳ thanh toán: nộp chậm nhất ngày thứ 10 kể từ ngày bắt đầu kỳ thuê.
- Khai theo năm dương lịch: nộp chậm nhất ngày cuối cùng của tháng đầu tiên năm tiếp theo.

Từ 1/1/2026, cơ chế thuế khoán bị bãi bỏ, áp dụng tự khai, tự nộp theo hướng dẫn sửa đổi Luật Quản lý thuế. Nếu bạn đang nộp khoán, cần điều chỉnh phương pháp kê khai theo quy định mới.

## Lỗi hay gặp khiến hồ sơ bị trả lại

- Bỏ sót phụ lục hợp đồng khi cộng doanh thu năm.
- Nộp hồ sơ tại chi cục thuế nơi cư trú thay vì nơi có bất động sản.
- Dùng mẫu khai cũ (mẫu trước Thông tư 40/2021/TT-BTC đã hết hiệu lực).
- Hiểu nhầm mã ngành đăng ký kinh doanh 68103 là mã số thuế rồi điền vào tờ khai.

Để ước tính tác động dòng tiền sau thuế, dùng [công cụ tính dòng tiền cho thuê](/cong-cu/dong-tien-cho-thue). Để xác định nghĩa vụ cụ thể, liên hệ Chi cục Thuế quản lý hoặc kế toán có chứng chỉ hành nghề.

Bài trụ cột về chính sách cho thuê dài hạn: [Thuê dài hạn đến 2030](${PILLAR_HREF}).

${BTR_SUPPORT_CLOSING}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T10:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Cá nhân cho thuê nhà có phải nộp thuế không? Ngưỡng, cách kê khai | HouseX",
    seoDesc:
      "Dưới 100 triệu/năm miễn thuế. Trên ngưỡng: 5% GTGT + 5% TNCN. Kê khai theo mẫu 01/TTS tại Chi cục Thuế nơi có bất động sản. Mã 68103 là mã đăng ký kinh doanh — không phải mã kê khai thuế.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
];
