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
const SLUG_BTR = "mo-hinh-build-to-rent-nha-o-cho-thue-dai-han-tai-cau-truc-2026";
const SLUG_LEASE =
  "hop-dong-thue-nha-dai-han-15-20-nam-lech-pha-cung-cau-2026";

/**
 * Nhóm 1 — Chính sách & vĩ mô BTR (Bài 1–3). Pillar = Bài 2.
 */
export const BTR_POLICY_SERIES_2026: ArticleDetail[] = [
  {
    id: "article-btr-01-model",
    slug: SLUG_BTR,
    title:
      "Xu hướng Build-to-Rent: Mô hình nhà ở cho thuê dài hạn sẽ tái cấu trúc thị trường bất động sản ra sao?",
    excerpt:
      "Build-to-Rent (BTR) là sản phẩm xây để cho thuê dài hạn chuyên nghiệp — khác căn hộ bán lẻ rồi cho thuê lại. Bài định nghĩa mô hình, tham chiếu vận hành quốc tế và lộ trình xuất hiện tại Việt Nam theo định hướng chính sách đến 2030.",
    body: `## Build-to-Rent khác gì với “mua căn hộ rồi cho thuê”?

Build-to-Rent (BTR) là mô hình phát triển nhà ở trong đó chủ đầu tư / quỹ vận hành thiết kế, xây dựng và giữ sản phẩm để cho thuê dài hạn theo chuẩn vận hành chuyên nghiệp — không lấy việc bán từng căn làm mục tiêu chính. Khác với chu kỳ phổ biến ở nhiều đô thị Việt Nam: xây để bán, người mua cá nhân tự cho thuê lại với hợp đồng ngắn và chất lượng dịch vụ không đồng nhất.

Ba đặc trưng thường gặp trên thị trường quốc tế:

1. Sở hữu tập trung hoặc vận hành tập trung trong thời gian dài.
2. Hợp đồng thuê ổn định hơn, chính sách điều chỉnh giá theo khung công bố.
3. Dịch vụ quản lý, bảo trì và tiện ích nội khu theo tiêu chuẩn tòa nhà, không theo từng chủ hộ.

Đối chiếu chính sách trụ cột: [Chính sách nhà ở cho thuê dài hạn đến 2030](${PILLAR_HREF}). Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Vì sao BTR được nhắc như công cụ tái cấu trúc thị trường?

Khi giá nhà để bán vượt khả năng chi trả của một bộ phận lớn lao động đô thị, hệ thống chỉ dựa vào “mua đứt” dễ lệch pha: tồn kho cao cấp / trung cấp song song với thiếu chỗ ở ổn định cho thuê. BTR tách nhu cầu an cư khỏi áp lực sở hữu ngay lập tức — tạo lớp cung có kiểm soát chất lượng và pháp lý hợp đồng rõ hơn phòng trọ phân tán.

Trên báo chí và diễn đàn chính sách 2025–2026, nhà ở cho thuê dài hạn được nêu như trụ cột bổ sung bên cạnh nhà ở để bán và nhà ở xã hội — không thay thế NOXH, mà mở rộng công cụ an cư. Soft neo: [Wiki nhà ở xã hội](/wiki-nha-o-xa-hoi) khi bạn thuộc đối tượng hỗ trợ; còn lại đọc cụm bài thuê dài hạn này.

${EDITORIAL_FIGURES.metroHub}

## Quốc tế vận hành BTR thế nào — bài học nào áp dụng được?

| Tham chiếu | Logic vận hành | Điều kiện chuyển giao |
|------------|----------------|------------------------|
| Mỹ / Anh | Quỹ / REIT nắm tòa, cho thuê theo chuẩn dịch vụ | Minh bạch phí, hợp đồng, chỉ số lấp đầy |
| Singapore | Kết hợp nhà công và thị trường thuê có kiểm soát | Thể chế đất đai và quy hoạch chặt |
| Nhật Bản | Văn hóa thuê dài hạn phổ biến ở đô thị lớn | Chất lượng vận hành + ổn định pháp lý |

Việt Nam không sao chép nguyên xi. Điểm chuyển giao hữu ích: (i) ưu tiên quỹ đất / thể chế cho sản phẩm thuê dài hạn; (ii) hợp đồng và thuế rõ; (iii) vận hành chuyên nghiệp quanh TOD / việc làm. Xem thêm: [Hợp đồng thuê 15–20 năm](/tin-tuc/kien-thuc/${SLUG_LEASE}).

${EDITORIAL_FIGURES.thuThiem}

## Lộ trình Việt Nam đang ở giai đoạn nào?

Giai đoạn hiện tại chủ yếu là định hướng chính sách và thí điểm cơ chế — chưa phải thị trường BTR trưởng thành như một số nước. Người đọc cần tách:

- Chỉ đạo / chiến lược đến 2030 trên báo chí chính thống và cơ quan nhà nước.
- Dự thảo sửa đổi Luật Nhà ở hoặc nghị định hướng dẫn — nêu rõ “dự thảo” nếu chưa hiệu lực.
- Sản phẩm thương mại “dễ cho thuê” trên thị trường bán — gần BTR về vận hành nhưng khác về sở hữu.

Bài trụ cột: [Trụ cột an cư nhà ở cho thuê dài hạn](${PILLAR_HREF}).

${BTR_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-20T08:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/hcmc-skyline-river-day.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Build-to-Rent là gì? Mô hình nhà ở cho thuê dài hạn tái cấu trúc BĐS | HouseX",
    seoDesc:
      "Định nghĩa BTR, khác mua-cho-thuê lại; tham chiếu quốc tế và lộ trình Việt Nam theo chính sách đến 2030.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
  {
    id: "article-btr-02-pillar",
    slug: BTR_PILLAR_SLUG,
    title:
      "Chính sách nhà ở cho thuê dài hạn: Trụ cột an cư quốc gia đến 2030",
    excerpt:
      "Từ chỉ đạo Chính phủ và Bộ Xây dựng: nhà ở cho thuê dài hạn được định hướng như trụ cột chiến lược bên cạnh nhà để bán — khung ưu đãi, quỹ đất và vị trí trong Luật Nhà ở / dự thảo đến 2030.",
    body: `## Vì sao nhà ở cho thuê dài hạn được đặt thành trụ cột chiến lược?

Quy hoạch quốc gia định hướng rõ: đến năm 2030, bên cạnh nhà ở để bán, nhà ở cho thuê dài hạn là một trụ cột nhằm giảm áp lực giá nhà vượt khả năng chi trả tại đô thị lớn. Đây không phải giải pháp tình thế thay cho một chu kỳ sốt đất, mà là công cụ thiết lập lại trật tự an cư — tạo lớp cung ổn định về hợp đồng, vận hành và giá thuê theo khung công bố.

House X gom kiến thức theo cụm chủ đề: mô hình BTR, hợp đồng dài hạn, tư duy an cư, TOD / vành đai, và dòng vốn – thuế. Chủ đề: [${HUB_HREF}](${HUB_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Chính phủ và Bộ Xây dựng đang nhấn mạnh những tín hiệu nào?

Trên các kênh chính thống (báo chí gắn cơ quan nhà nước, cổng chính sách), các tín hiệu thường được nêu gồm:

1. Xác định nhà ở cho thuê là chiến lược dài hạn của thị trường, không chỉ “giải cứu” ngắn hạn.
2. Ưu tiên phát triển nhà ở cho thuê giá hợp lý / dài hạn tại đô thị lớn.
3. Nghiên cứu ưu đãi về quỹ đất, thuế hoặc cơ chế thí điểm để doanh nghiệp tham gia.
4. Thí điểm cơ chế thuê dài hạn (khung 15–20 năm được truyền thông nhắc tại Hà Nội và một số đô thị).

Người đọc cần kiểm tra văn bản gốc tại thời điểm quyết định: chỉ đạo ≠ nghị định đã ban hành; dự thảo Luật Nhà ở sửa đổi ≠ luật đã có hiệu lực. Khi viện dẫn dự thảo, House X ghi rõ trạng thái dự thảo.

${EDITORIAL_FIGURES.metroHub}

## Nhà ở cho thuê dài hạn nằm ở đâu so với nhà ở xã hội?

| Công cụ | Đối tượng / logic | Vai trò |
|---------|-------------------|---------|
| Nhà ở xã hội | Đối tượng theo Luật Nhà ở; giá và điều kiện hỗ trợ | An cư có hỗ trợ nhà nước |
| Nhà ở cho thuê dài hạn / BTR | Thị trường + thể chế ưu đãi (khi có) | Ổn định thuê, giảm áp lực mua đứt |
| Nhà thương mại để bán | Thị trường tự do | Sở hữu / tích sản theo khả năng |

Hai trụ NOXH và thuê dài hạn bổ sung nhau: người đủ điều kiện NOXH vẫn ưu tiên kiểm tra [điều kiện mua nhà ở xã hội](/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat); người chưa thuộc đối tượng hoặc cần linh hoạt địa điểm làm việc có thể đọc thuê dài hạn như lựa chọn an cư chính danh.

## Hệ thống bài House X về thuê dài hạn đi theo lớp nào?

| Lớp | Câu hỏi | Bài |
|-----|---------|-----|
| Mô hình | BTR là gì? | [Build-to-Rent tái cấu trúc thị trường](/tin-tuc/kien-thuc/${SLUG_BTR}) |
| Thể chế (pillar) | Chính sách đến 2030? | Bạn đang đọc |
| Hợp đồng dài hạn | Thuê 15–20 năm? | [Hợp đồng thuê dài hạn](/tin-tuc/kien-thuc/${SLUG_LEASE}) |
| Tư duy an cư | Có nên thuê thay vì mua bằng mọi giá? | [Giá nhà vượt khả năng](/tin-tuc/kien-thuc/gia-nha-vuot-kha-nang-co-nen-thue-dai-han-2026) |
| So sánh sản phẩm | BTR vs mini / phòng trọ? | [So sánh chuyên nghiệp vs mini](/tin-tuc/kien-thuc/thue-can-ho-dai-han-vs-chung-cu-mini-phong-tro-2026) |
| TOD / vành đai | Quỹ đất quanh ga? | [TOD và thuê dài hạn](/tin-tuc/kien-thuc/tod-vanh-dai-nha-o-cho-thue-dai-han-2026) |
| Dòng vốn / thuế | Yield định tính & 68103? | [Dòng vốn](/tin-tuc/kien-thuc/dong-von-dau-tu-can-ho-cho-thue-dai-han-2026) · [Thuế cho thuê](/tin-tuc/kien-thuc/thue-cho-thue-nha-2026-ma-nganh-68103) |

${EDITORIAL_FIGURES.bitexcoMetro}

## Ưu đãi quỹ đất và thuế — đọc thế nào cho đúng?

Truyền thông thường nhắc hướng ưu đãi để doanh nghiệp làm nhà ở cho thuê. Cách đọc chuyên môn:

- Chỉ tin ưu đãi khi có văn bản / quyết định áp dụng cho dự án cụ thể.
- Không suy ra mọi căn hộ “dễ cho thuê” đều hưởng ưu đãi BTR.
- Phân biệt ưu đãi cho nhà ở xã hội với ưu đãi (nếu có) cho sản phẩm thuê dài hạn thương mại.

Khi có dự thảo Luật Nhà ở sửa đổi đề cập nhà ở cho thuê: luôn ghi “dự thảo, chưa hiệu lực” cho đến khi ban hành.

${BTR_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.thuThiem}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-21T09:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-01-civic-center.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Chính sách nhà ở cho thuê dài hạn đến 2030 — trụ cột an cư | HouseX",
    seoDesc:
      "Nhà ở cho thuê dài hạn trong chiến lược đến 2030: chỉ đạo Bộ Xây dựng, ưu đãi quỹ đất–thuế, khác NOXH — pillar SEO House X.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
  {
    id: "article-btr-03-lease",
    slug: SLUG_LEASE,
    title:
      "Hợp đồng thuê nhà 15–20 năm: Giải pháp khơi thông lệch pha cung cầu đô thị?",
    excerpt:
      "Cơ chế thuê dài hạn 15–20 năm được thảo luận như cách người dân an cư mà không chịu áp lực mua đứt — khung thí điểm / định hướng tại đô thị lớn; quyền lợi và rủi ro cần đọc trước khi ký.",
    body: `## Vì sao khung thuê 15–20 năm được đưa ra?

Lệch pha cung cầu đô thị thường biểu hiện ở chỗ: nguồn cung để bán không khớp khả năng trả của phần lớn hộ trẻ, trong khi thị trường thuê ngắn hạn thiếu ổn định về giá và thời hạn. Hợp đồng thuê dài hạn (khung 15–20 năm được truyền thông và một số địa phương nhắc như hướng thí điểm) nhằm tạo tâm thế an cư lạc nghiệp — biết trước thời gian ở và nguyên tắc điều chỉnh giá — mà không buộc mua đứt.

Bối cảnh chính sách: [Chính sách nhà ở cho thuê dài hạn đến 2030](${PILLAR_HREF}) · Mô hình: [Build-to-Rent](/tin-tuc/kien-thuc/${SLUG_BTR}).

${EDITORIAL_FIGURES.hcmSkyline}

## Thí điểm / định hướng tại Hà Nội và đô thị lớn đọc ra sao?

Báo chí chính sách đã nêu hướng thí điểm cơ chế nhà ở cho thuê tại Hà Nội và các đô thị lớn. Cách đọc đúng:

1. Thí điểm là giai đoạn thử thể chế — phạm vi, đối tượng và ưu đãi có thể hẹp hơn kỳ vọng thị trường.
2. Chưa có hợp đồng mẫu quốc gia áp dụng mọi dự án: từng sản phẩm có điều khoản riêng.
3. Phân biệt “nhà ở cho thuê dài hạn” theo chính sách với “cho thuê căn hộ thương mại 1–2 năm” thông thường.

Khi ký, ưu tiên văn bản hợp đồng, phụ lục điều chỉnh giá, và điều kiện chấm dứt — không dựa lời miệng môi giới.

${EDITORIAL_FIGURES.metroHub}

## Quyền lợi người thuê dài hạn thường cần kiểm những gì?

| Hạng mục | Câu hỏi trước khi ký |
|----------|----------------------|
| Thời hạn | Có đúng khung dài hạn công bố không? Gia hạn thế nào? |
| Giá thuê | Công thức điều chỉnh theo năm / chu kỳ? Trần tăng? |
| Phí dịch vụ | Phí quản lý, đậu xe, tiện ích — cố định hay thả nổi? |
| Bảo trì | Ai chịu sửa chữa kết cấu / thiết bị? |
| Chấm dứt sớm | Phạt / hoàn trả đặt cọc theo điều khoản nào? |
| Chuyển nhượng quyền thuê | Có được không? Điều kiện? |

${EDITORIAL_FIGURES.thuThiem}

## Thuê dài hạn có “thay” nhu cầu mua nhà không?

Không nhất thiết. Thuê dài hạn giải phóng áp lực mua bằng mọi giá trong giai đoạn thu nhập chưa ổn định hoặc địa điểm làm việc còn dịch chuyển. Nhiều hộ vẫn tích sản sau này qua NOXH (nếu đủ điều kiện) hoặc mua thương mại khi dòng tiền cho phép. Soft neo: [điều kiện NOXH](/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat).

Đọc tiếp tư duy an cư: [Giá nhà vượt khả năng — có nên thuê dài hạn?](/tin-tuc/kien-thuc/gia-nha-vuot-kha-nang-co-nen-thue-dai-han-2026).

${BTR_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-22T10:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Hợp đồng thuê nhà 15–20 năm — lệch pha cung cầu đô thị | HouseX",
    seoDesc:
      "Thuê dài hạn 15–20 năm: thí điểm / định hướng, checklist quyền lợi người thuê — không thay tư vấn pháp lý.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
];
