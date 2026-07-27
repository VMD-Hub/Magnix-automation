import { NOXH_TAG_EAST_WEST } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");
const TTGH_SLUG = "thu-thiem-green-house-thu-duc";
const TTGH_NAME = "Thủ Thiêm Green House";
const TTGH_HREF = `/du-an/${TTGH_SLUG}`;
const PILLAR_HREF =
  "/tin-tuc/kien-thuc/bon-cuc-tang-truong-do-thi-tp-hcm-2026";

/**
 * Series hành lang Đông–Tây Võ Văn Kiệt – Mai Chí Thọ — phễu Vĩ mô → Tiềm năng → Thực tế.
 * Số liệu quy hoạch: bám QD 1125/QĐ-TTg và tổng hợp báo chí — admin xác minh trước L3.
 */
export const EAST_WEST_CORRIDOR_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-east-west-01",
    slug: "truc-dong-tay-tphcm-vo-van-kiet-mai-chi-tho-2026",
    title:
      "Trục Đông - Tây TP.HCM: Xương sống liên kết vùng kết nối các thủ phủ công nghiệp",
    excerpt:
      "Trong QD 1125/QĐ-TTg (11/6/2025), nhóm trục Đông–Tây định hình liên kết Long An – lõi trung tâm – Đồng Nai / Thủ Đức; Võ Văn Kiệt – Mai Chí Thọ là xương sống giao thương liền mạch hai cửa ngõ công nghiệp.",
    body: `## Vì sao Võ Văn Kiệt – Mai Chí Thọ được gọi là xương sống Đông–Tây của TP.HCM?

Đại lộ Võ Văn Kiệt và Mai Chí Thọ tạo thành hành lang xuyên tâm theo hướng Đông–Tây: một phía tiếp cận cửa ngõ Long An / phía Tây thành phố, phía kia kéo vào lõi trung tâm rồi vươn Thủ Đức – Đồng Nai. Khác hành lang Bắc–Nam dọc sông Sài Gòn (ven sông – hướng biển) và khác QL13 Đông Bắc, trục này tối ưu thời gian di chuyển liên vùng và logistics công nghiệp hai đầu.

Người tìm nhà theo logic “gần đại lộ xuyên tâm” — không phải “view sông” hay “sân bay city”. Khung đối chiếu 6 trục: [Sáu trục tăng trưởng đô thị TP.HCM](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Quyết định 1125/QĐ-TTg định hình mấy trục Đông–Tây?

Đồ án điều chỉnh quy hoạch chung TP.HCM đến năm 2040, tầm nhìn đến 2060 — phê duyệt tại [Quyết định 1125/QĐ-TTg ngày 11/6/2025](https://thuvienphapluat.vn/) — nêu nhóm trục Đông–Tây (tham chiếu 5 trục trong đồ án) để tổ chức không gian đô thị đa trung tâm và liên kết vùng. Trong đó, cặp Võ Văn Kiệt – Mai Chí Thọ thường được truyền thông và thực tiễn giao thông xem là xương sống vận hành hàng ngày: mật độ phương tiện cao, nút giao phức tạp, nhưng cũng là lợi thế tiếp cận lõi nhanh nhất theo hướng ngang.

Tra cứu văn bản gốc trên thư viện pháp luật khi cần chỉ tiêu chi tiết; bài này chỉ khái quát vai trò macro để người mua nhà chọn đúng hành lang trước khi so dự án.

| Thành phần | Vai trò tham chiếu |
|------------|-------------------|
| Võ Văn Kiệt | Cửa ngõ Tây – xuyên lõi, gắn vùng Long An / phía Tây TP |
| Mai Chí Thọ | Kéo Đông qua Thủ Thiêm / Thủ Đức hướng Đồng Nai |
| Nhóm trục Đ–T (QD 1125) | Khung 5 trục Đông–Tây trong QHC đến 2040 |

## Long An – lõi – Đồng Nai kết nối thế nào trên thực tế di chuyển?

Ba đoạn cảm nhận của cư dân và doanh nghiệp:

1. Cửa ngõ Tây (hướng Long An / Bình Chánh – các nút vào Võ Văn Kiệt): quỹ đất và chi phí thường “mềm” hơn lõi; đổi lại phụ thuộc ùn tắc đoạn vào trung tâm.
2. Lõi trung tâm: lợi thế việc làm, dịch vụ, y tế — giá nhà và phí sở hữu cao hơn; căn hộ trên / gần hành lang hưởng lợi thời gian “vào việc” ngắn theo hướng Đông–Tây.
3. Phía Đông (Mai Chí Thọ – Thủ Thiêm – Thủ Đức): đô thị mới, cầu và nút giao mật; gần hành lang sông / khu Thủ Thiêm nhưng logic chính vẫn là xuyên tâm Đông–Tây, không đồng nhất với ly tâm Nam Sài Gòn – Cần Giờ.

${EDITORIAL_FIGURES.metroHub}

## Hạ tầng macro nào cần theo dõi song song với đại lộ?

- Cầu và nút giao trên hành lang: quyết định thời gian thực tế giờ cao điểm hơn là “tên đường đẹp”.
- Kết nối metro / TOD lõi: bổ sung lớp vận tải công cộng — đối chiếu bài TOD khung trên House X khi cần.
- Vành đai 3–4 và hành lang sân bay: cắt ngang hoặc bổ trợ Đông–Tây — đừng gộp thành một thị trường.

Đối chiếu Bắc–Nam sông: [Trục dọc sông Sài Gòn](/tin-tuc/kien-thuc/truc-doc-song-sai-gon-hanh-lang-kinh-te-ty-do-2026). Chủ đề Đông–Tây: [/tin-tuc/kien-thuc/chu-de/hanh-lang-dong-tay-vvk-mct](/tin-tuc/kien-thuc/chu-de/hanh-lang-dong-tay-vvk-mct).

${EDITORIAL_FIGURES.bitexcoMetro}

## Nên đi tiếp tầng tiềm năng hay thực tế?

| Tầng | Bài |
|------|-----|
| Vĩ mô (bài này) | Toàn cảnh VVK–MCT |
| Tiềm năng | [Biên độ giá cửa ngõ Đông–Tây](/tin-tuc/kien-thuc/bds-truc-dong-tay-bien-do-gia-cua-ngo-2026) |
| Thực tế | [Căn hộ Võ Văn Kiệt – Mai Chí Thọ](/tin-tuc/kien-thuc/can-ho-vo-van-kiet-mai-chi-tho-an-cu-dau-tu-2026) |

House X hỗ trợ chọn trục trước khi xem dự án — [đăng ký ngay](/lien-he).

${EDITORIAL_FIGURES.thuThiem}

*Phân nhóm trục Đông–Tây theo đồ án QHC — tiến độ nút giao và metro theo công bố cơ quan nhà nước.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-21T09:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Trục Đông–Tây TP.HCM 2026 — Võ Văn Kiệt & Mai Chí Thọ | HouseX",
    seoDesc:
      "QD 1125: nhóm 5 trục Đông–Tây; VVK–MCT xương sống Long An – lõi – Đồng Nai / Thủ Đức — macro hạ tầng cho người chọn nhà theo hành lang.",
    tags: [NOXH_TAG_EAST_WEST],
    projects: [],
  },
  {
    id: "article-east-west-02",
    slug: "bds-truc-dong-tay-bien-do-gia-cua-ngo-2026",
    title:
      "Bất động sản trục Đông - Tây: Điểm sáng đầu tư nhờ hạ tầng giao thương liền mạch",
    excerpt:
      "Cửa ngõ Tây (hướng Long An) và cửa ngõ Đông (Mai Chí Thọ / Thủ Thiêm) có biên độ và rủi ro khác nhau — phân tích định tính, không bịa % tăng giá; đối chiếu Bắc–Nam sông và hành lang sân bay.",
    body: `## Biên độ giá trên trục Đông–Tây nên đọc thế nào cho đúng?

“Biên độ” ở đây là khoảng chênh lệch cảm nhận giữa cửa ngõ, đoạn xuyên lõi và phía Đông mới — về tổng vốn, thanh khoản và độ nhạy tin hạ tầng — không phải một con số % tăng giá thống nhất cho cả đại lộ. House X không công bố chỉ số appreciation bịa đặt; thay vào đó so sánh logic rủi ro / cơ hội theo vị trí trên hành lang.

Bối cảnh macro: [Trục Đông–Tây Võ Văn Kiệt – Mai Chí Thọ](/tin-tuc/kien-thuc/truc-dong-tay-tphcm-vo-van-kiet-mai-chi-tho-2026). Khung 6 trục: [Sáu trục tăng trưởng đô thị TP.HCM](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Cửa ngõ Tây (hướng Long An) có đặc điểm dòng tiền ra sao?

Phía Tây hành lang thường được nhìn như vùng đệm công nghiệp – đô thị hóa mở rộng: quỹ đất đa dạng hơn, kỳ vọng “đón hạ tầng” cao hơn, nhưng cũng phụ thuộc mạnh vào ùn tắc đoạn vào lõi và tiến độ nút giao. Người mua nên ưu tiên:

- Thời gian thực tế vào chỗ làm trung tâm (chạy thử 7–8h và 17–18h).
- Pháp lý dự án độc lập — không chỉ “gần Võ Văn Kiệt” trên brochure.
- Chi phí sở hữu dài hạn (phí quản lý, để xe, kết nối tiện ích).

Biên độ tiềm năng gắn với cải thiện thông xe và mật độ việc làm vùng — chu kỳ có thể dài; không đồng nhất với thanh khoản lõi đã chín.

## Cửa ngõ Đông (Mai Chí Thọ / Thủ Thiêm) khác cửa ngõ Tây chỗ nào?

Phía Đông — Mai Chí Thọ kéo vào Thủ Thiêm / Thủ Đức — thường gắn đô thị mới, cầu và mặt bằng giá phản ánh kỳ vọng trung tâm mở rộng. Thanh khoản và tiện ích có thể dày hơn cửa ngõ Tây ở một số phân khúc; đổi lại tổng vốn vào cao hơn và cạnh tranh với nhiều câu chuyện hạ tầng khác (sông, metro, sân bay).

Định tính nhanh:

| Cửa ngõ | Điểm mạnh cảm nhận | Rủi ro cần soi |
|---------|-------------------|----------------|
| Tây (Long An / vào VVK) | Quỹ đa dạng, kỳ vọng đón hạ tầng | Ùn tắc vào lõi, pháp lý manh mún |
| Đông (MCT / Thủ Thiêm) | Gần đô thị mới, kết nối Đông | Tổng vốn cao, nhiều narrative chồng |

${EDITORIAL_FIGURES.bitexcoMetro}

## Vì sao phải đối chiếu Bắc–Nam sông và hành lang sân bay?

Cùng một căn hộ “gần trung tâm” có thể thuộc narrative khác nhau:

- Bắc–Nam sông Sài Gòn: ven sông, hướng Nhà Bè – Cần Giờ, động lực cảng / dịch vụ thủy — xem [Ly tâm Nam Sài Gòn – Cần Giờ](/tin-tuc/kien-thuc/ly-tam-bds-nam-sai-gon-can-gio-dong-tien-2026).
- Đông–Tây VVK–MCT: xuyên tâm công nghiệp hai đầu — bài bạn đang đọc.
- Sân bay Long Thành: đô thị sân bay / đường sắt liên cảng — khác chu kỳ và nhóm khách thuê.

Nhầm narrative dẫn tới so giá sai phân khúc. Chọn trục trên pillar trước, rồi mới so dự án trong cùng hành lang.

${EDITORIAL_FIGURES.metroHub}

## Nhà đầu tư và người ở thực nên hỏi câu nào trước khi xuống tiền?

1. Chỗ làm chính nằm cửa ngõ Tây, lõi, hay phía Đông?
2. Chấp nhận tổng vốn cao hơn để giảm thời gian đi — hay ngược lại?
3. Có cần sản phẩm NOXH / tổng vốn thấp hơn trên vùng ảnh hưởng Đông (ví dụ neo [Thủ Thiêm Green House](${TTGH_HREF})) thay vì săn “% tăng giá” cửa ngõ không?
4. Đã loại trừ kỳ vọng bịa từ tin đồn vành đai / sân bay chưa?

Tầng thực tế: [Căn hộ Võ Văn Kiệt – Mai Chí Thọ](/tin-tuc/kien-thuc/can-ho-vo-van-kiet-mai-chi-tho-an-cu-dau-tu-2026).

House X tư vấn chọn trục và hồ sơ an cư — [đăng ký ngay](/lien-he).

${EDITORIAL_FIGURES.thuThiem}

*Phân tích biên độ mang tính định tính theo vị trí hành lang — không phải cam kết lợi nhuận hay chỉ số tăng giá.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-23T10:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/hcmc-skyline-river-day.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "BĐS trục Đông–Tây 2026 — biên độ cửa ngõ Tây vs Đông | HouseX",
    seoDesc:
      "Cửa ngõ Long An vs Mai Chí Thọ / Thủ Thiêm: biên độ định tính, không % ảo; đối chiếu hành lang sông và sân bay trước khi xuống tiền.",
    tags: [NOXH_TAG_EAST_WEST],
    projects: [],
  },
  {
    id: "article-east-west-03",
    slug: "can-ho-vo-van-kiet-mai-chi-tho-an-cu-dau-tu-2026",
    title:
      "Căn hộ đại lộ Võ Văn Kiệt - Mai Chí Thọ: Lựa chọn an cư và đầu tư hộ khẩu TP.HCM lý tưởng",
    excerpt:
      "Checklist chọn căn hộ trên trục Đông–Tây: pháp lý, thời gian vào trung tâm (lợi thế định tính của hành lang), tiện ích; soft neo Thủ Thiêm Green House phía Đông; CTA tư vấn House X.",
    body: `## Căn hộ trên Võ Văn Kiệt – Mai Chí Thọ phù hợp ai?

Hai nhóm nhu cầu gặp nhau trên cùng hành lang nhưng tiêu chí khác nhau:

- An cư: ưu tiên thời gian đến chỗ làm / trường, tiện ích bán kính sống, pháp lý rõ, phí vận hành chịu được dài hạn.
- Đầu tư giữ chỗ / cho thuê: ưu tiên thanh khoản, nhóm khách thuê (nhân sự văn phòng lõi, chuyên gia hai đầu công nghiệp), và tổng vốn – đòn bẩy hợp lý.

Lợi thế chung của hành lang là khả năng tiếp cận lõi theo hướng Đông–Tây ngắn hơn nhiều tuyến vành đai — đây là lợi ích định tính của xương sống xuyên tâm, không phải cam kết “luôn về trung tâm trong 15 phút” mọi khung giờ. Ùn tắc vẫn xảy ra; hãy chạy thử giờ cao điểm trước khi ký.

Bối cảnh: [Macro VVK–MCT](/tin-tuc/kien-thuc/truc-dong-tay-tphcm-vo-van-kiet-mai-chi-tho-2026) · [Biên độ cửa ngõ](/tin-tuc/kien-thuc/bds-truc-dong-tay-bien-do-gia-cua-ngo-2026) · [6 trục tăng trưởng](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Checklist chọn căn trên trục — 7 mục trước khi đặt cọc?

1. Phân khúc và pháp lý: thương mại hay NOXH; sổ / HĐMS / điều kiện chuyển nhượng.
2. Thời gian thực tế vào chỗ làm (2 khung giờ cao điểm) — không chỉ khoảng cách km.
3. Tiếng ồn và mặt cắt đường lớn: căn mặt tiền đại lộ khác căn sâu trong khu.
4. Chỗ để xe, phí quản lý, tiện ích nội khu vận hành thật.
5. Ngập cục bộ / cao độ — hỏi cư dân và hồ sơ kỹ thuật khu vực.
6. Trường – y tế – siêu thị trong bán kính đi lại hàng ngày.
7. Kế hoạch giữ dài hạn hay cho thuê: ảnh hưởng tới chọn diện tích và tầng.

House X không liệt kê giả bảng giá căn hộ thương mại ngoài hệ thống. Nếu bạn cần rà đúng dự án đang mở bán / điều kiện vay, [đăng ký tư vấn](/lien-he).

${EDITORIAL_FIGURES.metroHub}

## Soft neo phía Đông: Thủ Thiêm Green House phù hợp khi nào?

Nếu ưu tiên tổng vốn thấp hơn phân khúc thương mại lõi, đủ điều kiện nhà ở xã hội, và chấp nhận vị trí phía Đông hành lang (gần cầu Phú Mỹ / Võ Chí Công hơn là mặt tiền Võ Văn Kiệt thuần túy), có thể đối chiếu [Thủ Thiêm Green House](${TTGH_HREF}):

| Hạng mục | Tham chiếu |
|----------|------------|
| Vị trí | Võ Chí Công, chân cầu Phú Mỹ, Thạnh Mỹ Lợi, Thủ Đức |
| Quy mô | 1.040 căn NOXH; 1–2PN ~25–68 m² |
| Giá CĐT | Khoảng 1,5 – 2,5 tỷ/căn |
| Vai trò trong bài | Neo an cư phía Đông — không thay thế checklist cho mọi căn trên VVK |

Đây là soft neo: cùng vùng ảnh hưởng kết nối Đông – trung tâm – Quận 7, nhưng phân khúc NOXH có điều kiện đối tượng riêng. Đọc thêm: [điều kiện mua NOXH](/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat).

${EDITORIAL_FIGURES.thuThiem}

## An cư hộ khẩu TP.HCM và đầu tư — phân nhánh quyết định?

| Mục tiêu | Ưu tiên |
|----------|---------|
| Ở thật + ổn định lâu dài | Pháp lý, tiện ích, tiếng ồn, trường học |
| Cho thuê nhân sự văn phòng | Gần nút vào lõi, diện tích dễ hấp thụ, nội thất |
| Tổng vốn thấp / đúng đối tượng NOXH | Hồ sơ đối tượng + dự án như TTGH |
| Đón cửa ngõ Tây | Chấp nhận chu kỳ hạ tầng dài hơn; soi pháp lý kỹ |

Không dùng một công thức lợi nhuận cho cả đại lộ. Đối chiếu thêm hành lang sông nếu bạn thiên về nam / ven nước: [Top dự án ven sông Nam Sài Gòn](/tin-tuc/kien-thuc/top-du-an-can-ho-biet-thu-ven-song-nam-sai-gon-2026).

${EDITORIAL_FIGURES.bitexcoMetro}

## Bước tiếp theo trên House X?

1. Chốt đúng trục trên [pillar 6 trục](${PILLAR_HREF}).
2. Chạy checklist 7 mục với căn / dự án cụ thể.
3. Nếu NOXH: chuẩn bị hồ sơ và đối chiếu [${TTGH_NAME}](${TTGH_HREF}).
4. [Liên hệ House X](/lien-he) để được hỗ trợ định hướng — không chèo kéo đặt cọc.

Chủ đề: [/tin-tuc/kien-thuc/chu-de/hanh-lang-dong-tay-vvk-mct](/tin-tuc/kien-thuc/chu-de/hanh-lang-dong-tay-vvk-mct)

*Thời gian di chuyển vào trung tâm là lợi thế định tính của hành lang — không phải cam kết phút cụ thể mọi thời điểm. Giá NOXH theo CĐT tại thời điểm biên tập.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-25T11:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/hcmc-bitexco-metro-day.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Căn hộ Võ Văn Kiệt – Mai Chí Thọ 2026 — checklist an cư | HouseX",
    seoDesc:
      "Checklist 7 mục chọn căn trên trục Đông–Tây; soft neo Thủ Thiêm Green House 1,5–2,5 tỷ; tư vấn House X — không cam kết phút vào trung tâm.",
    tags: [NOXH_TAG_EAST_WEST],
    projects: [{ slug: TTGH_SLUG, name: TTGH_NAME }],
  },
];
