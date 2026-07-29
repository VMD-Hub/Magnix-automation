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

Công thức khung: [Bản chất dòng tiền căn hộ cho thuê](/tin-tuc/kien-thuc/tinh-dong-tien-don-bay-can-ho-cho-thue-2026).

${EDITORIAL_FIGURES.metroHub}

## Quỹ đầu tư “nhắm” phân khúc này vì lý do thể chế nào?

Khi chính sách ưu tiên nhà ở cho thuê dài hạn (ưu đãi quỹ đất / thuế nếu được ban hành), rủi ro thể chế giảm và quy mô sản phẩm đủ lớn để quỹ vận hành. Nhà đầu tư cá nhân vẫn cần pháp lý minh bạch từng căn / từng dự án — ưu đãi vĩ mô không tự động áp cho mọi sản phẩm.

${EDITORIAL_FIGURES.thuThiem}

## Đọc tiếp?

- [Khung chọn dự án vận hành cho thuê](/tin-tuc/kien-thuc/du-an-can-ho-van-hanh-cho-thue-dai-han-2026)
- [Cho thuê nhà: mã ngành 68103 và cách kê khai](/tin-tuc/kien-thuc/thue-cho-thue-nha-2026-ma-nganh-68103)
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
      "Bản chất dòng tiền thực tế của căn hộ cho thuê: tiền thuê về và tiền còn lại",
    excerpt:
      "Sai lầm phổ biến: nhìn tiền thuê trên hợp đồng rồi tưởng đó là lợi nhuận. Bài này tách doanh thu gộp, phí, thuế, trả góp và dự phòng tháng trống — rồi xem vay thêm còn hợp lý không.",
    body: `## Bản chất dòng tiền thực tế của căn hộ cho thuê

Trong đầu tư bất động sản cho thuê, sai lầm lớn nhất là nhầm tiền thuê thu về với tiền còn lại trong túi. Tiền trên hợp đồng thuê chỉ là doanh thu gộp. Tiền còn lại mới phản ánh hiệu quả sau phí vận hành, nghĩa vụ thuế, trả góp vốn vay và dự phòng tháng trống.

Chỉ khi tách rõ các lớp này, bạn mới trả lời được: căn này tự nuôi nợ được không, hay đang trông vào bán lại sau này.

## Tiền thuê về và tiền còn lại khác nhau thế nào?

Để quản trị dòng tiền, cần phân biệt hai khái niệm:

- Tiền thuê về (doanh thu gộp): toàn bộ tiền thu theo hợp đồng thuê — chưa trừ phí, thuế hay trả góp.
- Tiền còn lại (dòng tiền ròng thực tế): số còn sau khi trừ phí quản lý, bảo trì, nghĩa vụ thuế ước tính, trả gốc và lãi vay (nếu có), cùng khoản dự phòng cho tháng không có khách.

Nhiều chủ nhà chỉ nhìn số thuê niêm yết rồi kết luận «đủ sống». Số còn lại mới cho biết căn có đỡ gánh vay hay không.

Bạn có thể bóc tách nhanh trên [công cụ dòng tiền cho thuê](/cong-cu/dong-tien-cho-thue).

## Bảng thông số tài chính và pháp lý cho một căn

| Hạng mục | Căn cứ từ hợp đồng / thực tế | Cơ sở pháp lý và quản trị |
|----------|------------------------------|---------------------------|
| Giá trị căn hộ | Hợp đồng mua / thỏa thuận | Cộng thuế phí mua; đối chiếu chứng thư định giá nếu cần |
| Vốn tự có | Tiết kiệm hợp pháp | Ngân hàng thường yêu cầu một phần vốn tự có |
| Khoản vay | Hợp đồng tín dụng | Lãi suất, kỳ hạn, điều kiện thế chấp |
| Tiền thuê tháng | Hợp đồng thuê (+ phụ lục) | Nghĩa vụ kê khai thuế theo doanh thu năm — xem [bài thuế & mã ngành 68103](/tin-tuc/kien-thuc/thue-cho-thue-nha-2026-ma-nganh-68103) |
| Phí quản lý / hạ tầng | Ban quản trị / đơn vị vận hành | Có thể tăng theo năm; thuộc chi phí vận hành chung |
| Thuế ước tính | Ngưỡng doanh thu năm | Luật thuế GTGT và TNCN; cá nhân thường khai mẫu 01/TTS |
| Tháng trống | Ước 1–3 tháng/năm (kịch bản xấu) | Hệ số an toàn khi dòng tiền đứt đoạn |
| Trả góp tháng | Lịch ngân hàng | Có thể mô phỏng tại [/tinh-tra-gop](/tinh-tra-gop) |

Cách nhớ nhanh: tiền còn lại ≈ tiền thuê − phí − thuế/12 − trả góp − dự phòng trống.

## Khi nào đòn bẩy vay vốn còn hợp lý?

Vay mua để cho thuê là con dao hai lưỡi. Chỉ nên cân nhắc khi dòng tiền ròng sau thuế, phí và dự phòng trống vẫn đủ trả gốc–lãi theo lịch ngân hàng — kể cả khi lãi tăng hoặc căn trống vài tháng.

Nếu biên lợi nhuận thấp hơn chi phí lãi vay thực tế, tiền thuê không đủ bù nghĩa vụ nợ. Lúc đó bạn đang phụ thuộc giá bán sau này: thị trường chậm hoặc căn trống lâu sẽ tạo áp lực tài chính nặng.

## Trước khi ký mua hoặc cho thuê, nên làm gì?

1. Tính dòng tiền thực tế sau thuế, phí và trả góp — đừng chỉ nhìn giá thuê niêm yết.
2. Lập khoản dự phòng cho tháng không có khách (thường 1–3 tháng/năm tùy khu vực và loại căn).
3. Cập nhật nghĩa vụ thuế và mã ngành khi mở hộ kinh doanh / doanh nghiệp — xem [hướng dẫn thuế cho thuê nhà](/tin-tuc/kien-thuc/thue-cho-thue-nha-2026-ma-nganh-68103).

Công cụ hỗ trợ: [tính dòng tiền cho thuê](/cong-cu/dong-tien-cho-thue). Cần người đồng hành thủ tục: [Liên hệ](/lien-he) hoặc form trên [hub cho thuê](/cho-thue).

Đọc thêm: [Thuê dài hạn đến 2030](${PILLAR_HREF}) · [Chọn dự án phù hợp cho thuê](/tin-tuc/kien-thuc/du-an-can-ho-van-hanh-cho-thue-dai-han-2026) · chủ đề [nhà ở cho thuê dài hạn](${HUB_HREF}).`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-26T16:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-01-civic-center.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Dòng tiền căn hộ cho thuê: tiền thuê về vs tiền còn lại | HouseX",
    seoDesc:
      "Tách doanh thu gộp, phí, thuế, trả góp và dự phòng tháng trống. Khi nào vay thêm còn hợp lý — kèm công cụ tự tính.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
  {
    id: "article-btr-12-tax",
    slug: "thue-cho-thue-nha-2026-ma-nganh-68103",
    title:
      "Cho thuê nhà: mã ngành 68103, ngưỡng thuế và cách kê khai theo quy định mới",
    excerpt:
      "Mã ngành hộ kinh doanh / doanh nghiệp cho thuê nhà ở dài hạn là 68103. Cá nhân khai thuế trực tiếp dùng mẫu 01/TTS. Từ 1/1/2026 bỏ thuế khoán — chuyển tự khai, tự nộp.",
    body: `## Cá nhân cho thuê nhà có phải nộp thuế không?

Có — nếu tổng doanh thu cho thuê trong năm vượt ngưỡng miễn thuế.

Ngưỡng hiện hành theo Thông tư 40/2021/TT-BTC:

| Tổng doanh thu thuê trong năm | Thuế GTGT | Thuế TNCN |
|-------------------------------|-----------|-----------|
| Từ 100 triệu đồng trở xuống | Không phải nộp | Không phải nộp |
| Trên 100 triệu đồng | 5% trên doanh thu tính thuế | 5% trên doanh thu tính thuế |

Từ ngày 1/1/2026, ngưỡng miễn thuế tăng lên 200 triệu đồng/năm theo Luật Thuế GTGT 2024.

## Mã ngành cho thuê nhà là gì?

Khi đăng ký thành lập doanh nghiệp hoặc hộ kinh doanh có hoạt động cho thuê nhà ở dài hạn, việc ghi đúng mã ngành kinh tế quốc gia là bước pháp lý cần có trên hồ sơ đăng ký — gắn với hợp đồng và quy trình xuất hóa đơn sau này.

- Mã ngành chính thức: 68103
- Tên ngành theo Hệ thống ngành kinh tế Việt Nam: Cho thuê và vận hành nhà ở và đất ở (Quyết định 36/2025/QĐ-TTg, hiệu lực từ 15/11/2025)
- Phạm vi: hộ kinh doanh cá thể hoặc doanh nghiệp đầu tư, vận hành và cho thuê bất động sản nhà ở dài hạn

Cá nhân cho thuê nhà độc lập, không thành lập hộ kinh doanh / doanh nghiệp, khai nộp thuế trực tiếp với cơ quan thuế thì dùng mẫu 01/TTS theo Thông tư 40/2021/TT-BTC. Mã ngành 68103 dùng khi bạn đăng ký hộ hoặc doanh nghiệp để kinh doanh cho thuê nhà.

## Hồ sơ kê khai thuế cho thuê nhà gồm những gì?

Theo Điều 14 Thông tư 40/2021/TT-BTC, cá nhân trực tiếp khai thuế với cơ quan thuế cần:

1. Tờ khai theo mẫu 01/TTS — khai theo kỳ thanh toán hoặc theo năm dương lịch.
2. Phụ lục bảng kê 01-1/BK-TTS nếu là lần khai đầu tiên của hợp đồng hoặc phụ lục hợp đồng.
3. Bản sao hợp đồng thuê và phụ lục (lần khai đầu tiên).
4. Bản sao giấy ủy quyền nếu nhờ người khai thay.

Nơi nộp: Chi cục Thuế quản lý trực tiếp nơi có bất động sản cho thuê — không phải nơi bạn đăng ký hộ khẩu.

Doanh thu tính thuế lấy theo toàn bộ tiền thuê trên hợp đồng (kể cả phụ lục), không chỉ theo số tiền thực về tài khoản.

## Hai phương pháp kê khai thuế — chọn một và giữ nhất quán

Cá nhân cho thuê nhà được chọn một trong hai phương thức và nên giữ nhất quán trong kỳ tính thuế:

### Khai theo từng lần phát sinh kỳ thanh toán

Thời hạn nộp hồ sơ: chậm nhất ngày thứ 10 kể từ ngày bắt đầu kỳ thanh toán thuê. Phù hợp hợp đồng có chu kỳ thanh toán linh hoạt (tháng, quý hoặc nửa năm).

### Khai theo năm dương lịch

Thời hạn nộp hồ sơ: chậm nhất ngày cuối cùng của tháng đầu tiên năm dương lịch tiếp theo. Phù hợp hợp đồng thuê dài hạn, ổn định theo năm — giảm số lần khai trong năm.

## Từ 1/1/2026: bỏ thuế khoán, chuyển tự khai tự nộp

Từ ngày 1/1/2026, cơ chế thuế khoán đối với hoạt động cho thuê tài sản bị bãi bỏ, chuyển sang tự khai, tự nộp theo hướng dẫn sửa đổi Luật Quản lý thuế.

Nếu bạn đang nộp khoán, cần:

1. Rà soát phương pháp nộp thuế hiện tại.
2. Chuyển sang kê khai theo kỳ thanh toán hoặc theo năm.
3. Giữ đủ hợp đồng thuê, phụ lục và chứng từ thanh toán — cơ quan thuế yêu cầu minh bạch chứng từ hơn trong giai đoạn mới.

## Lỗi hay gặp khiến hồ sơ bị trả lại

- Bỏ sót phụ lục hợp đồng khi cộng doanh thu năm.
- Nộp hồ sơ tại chi cục thuế nơi cư trú thay vì nơi có bất động sản.
- Dùng mẫu khai cũ (trước Thông tư 40/2021/TT-BTC).
- Đăng ký hộ / doanh nghiệp cho thuê nhà ở nhưng ghi sai mã ngành (đúng là 68103).

Ước tính dòng tiền sau thuế: [công cụ tính dòng tiền cho thuê](/cong-cu/dong-tien-cho-thue). Cần hỗ trợ thủ tục: [Liên hệ](/lien-he) hoặc form trên [hub cho thuê](/cho-thue).

Bài trụ cột chính sách: [Thuê dài hạn đến 2030](${PILLAR_HREF}).`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T10:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Cho thuê nhà: mã ngành 68103, ngưỡng thuế và cách kê khai | HouseX",
    seoDesc:
      "Mã ngành hộ KD / DN cho thuê nhà ở dài hạn là 68103. Cá nhân khai thuế dùng mẫu 01/TTS. Từ 1/1/2026 bỏ thuế khoán — chuyển tự khai, tự nộp.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
];
