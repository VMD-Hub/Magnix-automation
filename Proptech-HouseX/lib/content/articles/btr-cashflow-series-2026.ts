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

const UPDATED = new Date("2026-07-27T00:00:00.000Z");
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

Công thức khung: [Tính dòng tiền và đòn bẩy](/tin-tuc/kien-thuc/tinh-dong-tien-don-bay-can-ho-cho-thue-2026).

${EDITORIAL_FIGURES.metroHub}

## Quỹ đầu tư “nhắm” phân khúc này vì lý do thể chế nào?

Khi chính sách ưu tiên nhà ở cho thuê dài hạn (ưu đãi quỹ đất / thuế nếu được ban hành), rủi ro thể chế giảm và quy mô sản phẩm đủ lớn để quỹ vận hành. Nhà đầu tư cá nhân vẫn cần pháp lý minh bạch từng căn / từng dự án — ưu đãi vĩ mô không tự động áp cho mọi sản phẩm.

${EDITORIAL_FIGURES.thuThiem}

## Đọc tiếp?

- [Khung chọn dự án vận hành cho thuê](/tin-tuc/kien-thuc/du-an-can-ho-van-hanh-cho-thue-dai-han-2026)
- [Thuế cho thuê & mã 68103](/tin-tuc/kien-thuc/thue-cho-thue-nha-2026-ma-nganh-68103)
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
      "Tính dòng tiền và đòn bẩy khi đầu tư căn hộ cho thuê: Khung công thức định tính",
    excerpt:
      "Bảng khung vốn tự có, lãi vay, tiền thuê thu và chi phí vận hành — dùng để tự mô phỏng trước khi vay; liên kết /tinh-tra-gop; không bịa tỷ suất lợi nhuận.",
    body: `## Công thức dòng tiền gộp và ròng (định tính)

Nhà đầu tư cần tách hai lớp:

1. Dòng tiền gộp ≈ tiền thuê thu trong kỳ.
2. Dòng tiền ròng ≈ gộp − phí quản lý − bảo trì − thuế − (gốc + lãi vay nếu có) − dự phòng trống căn.

House X không điền số tuyệt đối cho mọi dự án. Bạn thay số từ hợp đồng thuê và lịch vay thực tế.

Xem thêm: [Thuê dài hạn đến 2030](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Bảng khung tự điền

| Hạng mục | Cách lấy số | Ghi chú |
|----------|-------------|---------|
| Giá vốn căn (A) | HĐMB / thỏa thuận | Cộng thuế phí mua |
| Vốn tự có (B) | Tiết kiệm hợp pháp | Thường 30–50% tùy ngân hàng |
| Khoản vay (A−B) | Hợp đồng tín dụng | Kỳ hạn, lãi thả nổi |
| Tiền thuê tháng (R) | Hợp đồng thuê | Không lấy giá “kỳ vọng miệng” |
| Phí quản lý / tháng (M) | Ban quản lý | Có thể tăng theo năm |
| Thuế ước tính (T) | Theo ngưỡng doanh thu | Xem bài thuế 68103 |
| Trống căn (V) | Giả định 0–2 tháng/năm | Kịch bản xấu |
| Trả góp tháng (P) | Lịch ngân hàng | Dùng [/tinh-tra-gop](/tinh-tra-gop) |

Dòng tiền ròng tháng ≈ R − M − T/12 − P − (R×V/12) — công thức minh họa, không phải tư vấn đầu tư.

${EDITORIAL_FIGURES.metroHub}

## Đòn bẩy — khi nào hợp lý?

Đòn bẩy chỉ hợp lý nếu dòng tiền ròng sau trả góp vẫn dương trong kịch bản lãi tăng và trống căn. Nếu ròng âm kéo dài, bạn đang phụ thuộc tăng giá bán — rủi ro chu kỳ trước đã chỉ ra giới hạn của cách đó.

${EDITORIAL_FIGURES.thuThiem}

## Đọc tiếp thuế và chọn dự án?

- [Thuế cho thuê nhà & mã 68103](/tin-tuc/kien-thuc/thue-cho-thue-nha-2026-ma-nganh-68103)
- [Khung chọn dự án](/tin-tuc/kien-thuc/du-an-can-ho-van-hanh-cho-thue-dai-han-2026)
- Chủ đề: [${HUB_HREF}](${HUB_HREF})

${BTR_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-26T16:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-01-civic-center.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Tính dòng tiền đòn bẩy căn hộ cho thuê — bảng khung | HouseX",
    seoDesc:
      "Bảng vốn tự có, lãi vay, tiền thuê, phí và trống căn + /tinh-tra-gop — không bịa yield %.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
  {
    id: "article-btr-12-tax",
    slug: "thue-cho-thue-nha-2026-ma-nganh-68103",
    title:
      "Thuế cho thuê nhà và mã ngành 68103: Nhà đầu tư cần lưu ý gì?",
    excerpt:
      "Khung thuế kinh doanh cho thuê nhà theo ngưỡng doanh thu và mã ngành 68103 — hướng dẫn định hướng thủ tục; xác minh nghị định / thông tư có hiệu lực tại thời điểm kê khai.",
    body: `## Vì sao bài thuế cần giọng thận trọng?

Nghĩa vụ thuế thay đổi theo văn bản hướng dẫn và ngưỡng doanh thu. House X nêu khung để nhà đầu tư biết hỏi đúng cơ quan / đại lý thuế — không thay thế tư vấn thuế chuyên nghiệp và không cam kết mức phải nộp cho từng hồ sơ.

Xem thêm: [Chính sách thuê dài hạn](${PILLAR_HREF}) · Dòng tiền: [Công thức định tính](/tin-tuc/kien-thuc/tinh-dong-tien-don-bay-can-ho-cho-thue-2026).

${EDITORIAL_FIGURES.hcmSkyline}

## Mã ngành 68103 liên quan gì đến cho thuê nhà?

Trong hệ thống mã ngành kinh tế, nhóm hoạt động kinh doanh bất động sản có mã chi tiết cho thuê / điều hành nhà ở (truyền thông thường nêu 68103). Khi doanh thu cho thuê đạt ngưỡng phải kê khai theo quy định hiện hành, hộ / cá nhân kinh doanh có thể cần đăng ký mã ngành phù hợp. Cách làm đúng:

1. Tra cứu mã trên cổng đăng ký kinh doanh / hướng dẫn thuế mới nhất.
2. Đối chiếu ngưỡng doanh thu phải nộp thuế khoán / kê khai.
3. Giữ hợp đồng thuê và chứng từ thu tiền.

${EDITORIAL_FIGURES.metroHub}

## Khung câu hỏi trước khi kê khai 2026?

| Câu hỏi | Việc cần làm |
|---------|--------------|
| Doanh thu thuê năm nay bao nhiêu? | Cộng đúng hợp đồng, không bỏ sót phụ lục |
| Đang nộp theo phương pháp nào? | Khoán / kê khai — theo hướng dẫn CQT |
| Có phải đăng ký hộ kinh doanh không? | Khi vượt ngưỡng quy định |
| Chi phí được trừ những gì? | Theo văn bản có hiệu lực — hỏi đại lý thuế |

Nguồn tham khảo công khai thường được dẫn: thư viện pháp luật / nghị định hướng dẫn thuế (ví dụ các nghị định về quản lý thuế được truyền thông gắn năm 2025–2026). Luôn mở văn bản gốc trước khi nộp.

${EDITORIAL_FIGURES.thuThiem}

## Liên hệ House X hay cơ quan thuế?

House X hỗ trợ định hướng an cư và pháp lý dự án ở mức tham khảo. Nghĩa vụ thuế: liên hệ Chi cục Thuế quản lý hoặc đơn vị tư vấn thuế có tư cách. Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${BTR_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T10:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Thuế cho thuê nhà 2026 & mã ngành 68103 | HouseX",
    seoDesc:
      "Khung thuế cho thuê nhà và mã 68103 — tham khảo thủ tục; xác minh văn bản hiệu lực trước khi kê khai.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
];
