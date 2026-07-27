import { NOXH_TAG_BTR } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import {
  BTR_LEGAL_DISCLAIMER,
  BTR_SUPPORT_CLOSING,
} from "@/lib/content/articles/long-term-rental-editorial-voice";
import { BTR_PILLAR_SLUG } from "@/lib/content/long-term-rental-btr";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");
const PILLAR_HREF = `/tin-tuc/kien-thuc/${BTR_PILLAR_SLUG}`;
const HUB_HREF = "/tin-tuc/kien-thuc/chu-de/nha-o-cho-thue-dai-han";

/**
 * Nhóm 2 — Tâm lý & văn hóa an cư (Bài 4–6). Empathetic Expert.
 */
export const BTR_MINDSET_SERIES_2026: ArticleDetail[] = [
  {
    id: "article-btr-04-affordability",
    slug: "gia-nha-vuot-kha-nang-co-nen-thue-dai-han-2026",
    title:
      "Giá nhà vượt khả năng chi trả: Có nên chọn thuê dài hạn thay vì mua bằng mọi giá?",
    excerpt:
      "Khi giá căn hộ nội đô vượt xa thu nhập khả dụng, thế hệ trẻ đối diện hai lựa chọn: gánh nợ dài hạn để mua đứt, hoặc thuê dài hạn có tiện nghi để bảo toàn dòng tiền — bài phân tích empathic, không sỉ nhục nhu cầu sở hữu.",
    body: `## Khủng hoảng khả năng chi trả đang đặt thế hệ trẻ trước lựa chọn nào?

Giá nhà nội đô tăng nhanh hơn thu nhập của nhiều hộ trẻ tạo áp lực tâm lý “phải sở hữu bằng mọi giá”. Áp lực đó dễ dẫn đến vay vượt khả năng trả, trì hoãn hôn nhân / sinh con, hoặc chấp nhận không gian sống kém an toàn để “có chỗ đứng tên”.

Hai lựa chọn cần được nhìn ngang hàng — không phải lệnh cấm mua nhà:

1. Tiếp tục lộ trình mua (thương mại hoặc NOXH nếu đủ điều tượng) với kế hoạch trả góp trung thực.
2. Chọn thuê dài hạn chuyên nghiệp để ổn định chất lượng sống và bảo toàn dòng vốn trong giai đoạn thu nhập còn biến động.

Bài trụ cột: [Nhà ở cho thuê dài hạn đến 2030](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Thuê dài hạn giải phóng tư tưởng sở hữu thế nào — và giới hạn của nó?

Thuê dài hạn (đặc biệt khung hợp đồng ổn định) giúp:

- Biết trước chi phí ở trong nhiều năm, giảm sợ tăng giá đột ngột từng năm.
- Ở gần việc làm / trường học mà không cần vốn lớn ban đầu.
- Giữ dư địa tiết kiệm / đầu tư kỹ năng thay vì dồn hết vào khoản vay.

Giới hạn cần nói thẳng: thuê không tạo sổ hồng; tích sản dài hạn bằng sở hữu vẫn là mục tiêu hợp lý với nhiều hộ. Soft neo nếu thuộc đối tượng: [điều kiện mua NOXH](/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat).

${EDITORIAL_FIGURES.metroHub}

## Làm sao tự kiểm khả năng chi trả trước khi quyết định?

| Chỉ số | Gợi ý đọc |
|--------|-----------|
| Tỷ lệ trả góp / thuê trên thu nhập khả dụng | Để dư địa cho y tế, giáo dục, dự phòng |
| Vốn tự có | Đủ cho mua (cọc + thuế phí) hay chỉ đủ thuê dài hạn chất lượng? |
| Ổn định việc làm / địa điểm | Dịch chuyển nhiều → thuê linh hoạt hơn |
| Pháp lý sản phẩm | Hợp đồng thuê dài hạn rõ vs lời hứa miệng |

Công cụ mô phỏng: [/tinh-tra-gop](/tinh-tra-gop) — chỉ tham khảo.

${EDITORIAL_FIGURES.thuThiem}

## Đọc thêm

- So sánh sản phẩm: [Thuê dài hạn vs chung cư mini / phòng trọ](/tin-tuc/kien-thuc/thue-can-ho-dai-han-vs-chung-cu-mini-phong-tro-2026)
- Quyền lợi người thuê: [Nhà ở cho thuê thế hệ mới](/tin-tuc/kien-thuc/quyen-loi-nguoi-thue-nha-o-cho-thue-the-he-moi-2026)
- Xem thêm chủ đề [nhà ở cho thuê dài hạn](${HUB_HREF})

${BTR_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-23T09:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/urban-skyline-golden-hour.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Giá nhà vượt khả năng — có nên thuê dài hạn? | HouseX",
    seoDesc:
      "Khi giá nhà nội đô vượt thu nhập khả dụng: cân nhắc thuê dài hạn thay vì mua bằng mọi giá — khung tự đối chiếu trước khi quyết định.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
  {
    id: "article-btr-05-compare",
    slug: "thue-can-ho-dai-han-vs-chung-cu-mini-phong-tro-2026",
    title:
      "Căn hộ cho thuê dài hạn chuyên nghiệp so với chung cư mini và phòng trọ truyền thống",
    excerpt:
      "Bảng đối chiếu PCCC, vận hành, tiện ích và ổn định giá thuê giữa tổ hợp cho thuê dài hạn chuyên nghiệp với chung cư mini và phòng trọ — giúp người thuê chọn đúng rủi ro chấp nhận được.",
    body: `## Vì sao cần so sánh trước khi ký thuê?

Nhiều người trẻ chọn chung cư mini hoặc phòng trọ vì giá thuê khởi điểm thấp, nhưng đánh đổi an toàn PCCC, không gian sống và rủi ro tăng giá / đuổi nhà ngắn hạn. Tổ hợp căn hộ cho thuê dài hạn chuyên nghiệp thường đắt hơn theo tháng — đổi lại vận hành và hợp đồng rõ hơn. Bảng dưới là khung định tính, không phải bảng giá thị trường.

Xem thêm: [Chính sách thuê dài hạn](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Bảng so sánh khung tiêu chí

| Tiêu chí | Thuê dài hạn chuyên nghiệp / BTR | Chung cư mini | Phòng trọ truyền thống |
|----------|----------------------------------|---------------|------------------------|
| PCCC & thoát hiểm | Thường theo tiêu chuẩn tòa / nghiệm thu | Rủi ro cao nếu cải tạo trái phép | Phụ thuộc chủ nhà / khu |
| Đơn vị vận hành | Ban quản lý / CĐT chuyên nghiệp | Thường phân tán theo hộ | Chủ nhà cá nhân |
| Hợp đồng | Hướng dài hạn, điều chỉnh giá theo khung | Thường 6–12 tháng | Ngắn, dễ thay đổi miệng |
| Tiện ích | Thang máy, vệ sinh chung, xanh nội khu (tùy dự án) | Hạn chế | Thường tối giản |
| Ổn định giá thuê | Minh bạch hơn nếu có phụ lục | Dễ tăng khi hết hạn | Dễ tăng đột ngột |
| Riêng tư / mật độ | Căn hộ độc lập hơn | Mật độ cao, hành lang hẹp | Phụ thuộc |

${EDITORIAL_FIGURES.metroHub}

## Chung cư mini — điểm nghẽn nào người thuê cần hỏi?

1. Giấy phép / nghiệm thu PCCC và lối thoát hiểm thực tế (không chỉ lời chủ nhà).
2. Số căn trên mỗi tầng / mật độ người — ảnh hưởng an toàn và sinh hoạt.
3. Hợp đồng có ghi rõ thời hạn và điều kiện tăng giá không?
4. Ai chịu trách nhiệm sửa chữa điện nước khi sự cố?

Nếu câu trả lời mơ hồ, rủi ro vận hành thường cao hơn phần tiền thuê tiết kiệm được hàng tháng.

${EDITORIAL_FIGURES.thuThiem}

## Khi nào phòng trọ vẫn hợp lý?

Phòng trọ phù hợp giai đoạn thử việc ngắn, ngân sách rất hạn chế, hoặc ở gần chỗ làm tạm. Không nên mặc định “rẻ là tối ưu” nếu bạn cần ổn định 3–5 năm trở lên cho gia đình nhỏ. Đọc thêm: [Quyền lợi người thuê thế hệ mới](/tin-tuc/kien-thuc/quyen-loi-nguoi-thue-nha-o-cho-thue-the-he-moi-2026).

${BTR_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-24T09:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Thuê căn hộ dài hạn vs chung cư mini / phòng trọ — bảng so sánh | HouseX",
    seoDesc:
      "So sánh PCCC, vận hành, hợp đồng và ổn định giá thuê giữa tổ hợp cho thuê dài hạn chuyên nghiệp, chung cư mini và phòng trọ.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
  {
    id: "article-btr-06-tenant-rights",
    slug: "quyen-loi-nguoi-thue-nha-o-cho-thue-the-he-moi-2026",
    title:
      "Người thuê kỳ vọng gì ở nhà ở cho thuê thế hệ mới: giá ổn định và quyền lợi dài hạn?",
    excerpt:
      "Nỗi đau kinh điển của người thuê — tăng giá đột ngột, hợp đồng ngắn, sửa chữa đùn đẩy — và cách tổ hợp cho thuê dài hạn chuyên nghiệp đáp ứng kỳ vọng bằng khung hợp đồng và vận hành minh bạch.",
    body: `## Nỗi đau nào đang định hình kỳ vọng “thuê thế hệ mới”?

Khảo sát truyền thông và phản ánh thực địa thường lặp lại cùng các điểm:

1. Sợ chủ nhà tăng giá đột ngột khi hết hạn 6–12 tháng.
2. Sợ bị yêu cầu chuyển đi với thời gian báo trước ngắn.
3. Sửa chữa chậm hoặc chi phí đẩy sang người thuê không rõ ràng.
4. Thiếu không gian xanh / chỗ để xe / an ninh đêm.

Nhà ở cho thuê thế hệ mới (tổ hợp chuyên nghiệp / xây để cho thuê dài hạn) được kỳ vọng giải quyết các điểm trên bằng hợp đồng dài hơn, phụ lục điều chỉnh giá, và ban quản lý có trách nhiệm. Xem thêm: [Chính sách đến 2030](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Giá thuê ổn định nghĩa là gì — không phải “không bao giờ tăng”?

Ổn định là biết trước quy tắc tăng: theo năm, theo chỉ số công bố, hoặc trần trong phụ lục — chứ không phải giá đóng băng vĩnh viễn. Người thuê nên yêu cầu:

- Mức thuê năm đầu và lịch điều chỉnh.
- Các khoản phí ngoài tiền thuê (quản lý, gửi xe, điện nước).
- Điều kiện đặt cọc / hoàn trả.

${EDITORIAL_FIGURES.metroHub}

## Quyền lợi tối thiểu nên có trong hợp đồng dài hạn?

| Quyền / điều khoản | Vì sao quan trọng |
|--------------------|-------------------|
| Thời hạn và gia hạn | Tâm thế an cư lạc nghiệp |
| Điều chỉnh giá có trần / công thức | Tránh tăng đột ngột |
| Bảo trì kết cấu | Phân định trách nhiệm |
| Thông báo chấm dứt | Thời gian tìm chỗ mới |
| Biên bản bàn giao | Tránh tranh chấp cọc |

So sánh sản phẩm: [Bảng BTR vs mini / phòng trọ](/tin-tuc/kien-thuc/thue-can-ho-dai-han-vs-chung-cu-mini-phong-tro-2026). Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${EDITORIAL_FIGURES.thuThiem}

## Nhà đầu tư đọc bài này thế nào?

Nếu bạn cho thuê lại căn mua: chuẩn vận hành và hợp đồng rõ cũng là cách bảo toàn dòng vốn và giảm trống căn. Khung dòng tiền: [Tính dòng tiền – đòn bẩy](/tin-tuc/kien-thuc/tinh-dong-tien-don-bay-can-ho-cho-thue-2026).

${BTR_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-25T09:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-01-civic-center.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Quyền lợi người thuê nhà ở cho thuê thế hệ mới | HouseX",
    seoDesc:
      "Giá thuê ổn định, hợp đồng dài hạn, bảo trì — kỳ vọng người thuê và checklist điều khoản trước khi ký.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
];
