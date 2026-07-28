import { articlePath } from "@/lib/content/article-routes";
import { NOXH_SUPPORT_CLOSING } from "@/lib/content/articles/article-editorial-voice";
import { NOXH_TAG_CHINH_SACH } from "@/lib/content/articles/noxh-handbook-tags";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import type { ArticleDetail } from "@/lib/data/article-types";
import { NOXH_CATALOG_PATH } from "@/lib/content/project-catalog-paths";

const PUBLISHED = new Date("2026-07-28T00:00:00.000Z");
const UPDATED = new Date("2026-07-28T00:00:00.000Z");
const TAG = NOXH_TAG_CHINH_SACH;

/**
 * P0 intent hubs (Google Trends): “nhà ở xã hội là gì” + “đăng ký nhà ở xã hội”.
 * Gom link nội bộ đã có — không đổi kiến trúc wiki/tool.
 */
export const NOXH_INTENT_HUB_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-noxh-intent-la-gi-2026",
    slug: "nha-o-xa-hoi-la-gi",
    title: "Nhà ở xã hội là gì? — Định nghĩa, ai được mua và khác căn thương mại thế nào",
    excerpt:
      "Nhà ở xã hội (NOXH) là nhà ở có sự hỗ trợ của Nhà nước cho đối tượng đủ điều kiện theo Luật Nhà ở — khác căn thương mại về đối tượng, giá, thủ tục và hạn chế chuyển nhượng.",
    body: `## Nhà ở xã hội là gì?

Nhà ở xã hội (thường gọi tắt NOXH) là nhà ở được đầu tư xây dựng hoặc chuyển đổi theo chính sách của Nhà nước, bán, cho thuê hoặc thuê mua với mức giá và điều kiện phù hợp đối tượng được hỗ trợ. Căn cứ khung Luật Nhà ở số 27/2023/QH15 và các nghị định hướng dẫn (NĐ 100/2024 và các nghị định sửa đổi).

Điểm khác căn hộ thương mại: không phải ai cũng được mua. Người mua phải thuộc nhóm đối tượng, đáp ứng điều kiện nhà ở và (với nhiều nhóm) không vượt trần thu nhập — rồi mới tham gia đợt mở bán do chủ đầu tư / cơ quan có thẩm quyền công bố.

${EDITORIAL_FIGURES.noxhEligibility}

## Nhà ở xã hội khác căn hộ thương mại thế nào?

| Tiêu chí | Nhà ở xã hội | Căn hộ thương mại |
| --- | --- | --- |
| Ai được mua | Phải thuộc đối tượng và đủ điều kiện theo Luật | Ai đủ tiền / vay đều có thể mua |
| Giá | Có khung kiểm soát, thường thấp hơn thương mại cùng khu | Theo thị trường |
| Thủ tục | Nộp hồ sơ → rà soát → công khai / bốc thăm nếu vượt quỹ căn | Giữ chỗ, cọc, ký hợp đồng theo tiến độ chủ đầu tư |
| Chuyển nhượng | Hạn chế trong thời gian luật quy định | Linh hoạt hơn theo hợp đồng và pháp luật chung |

Giá thấp hơn không đồng nghĩa dễ mua: quỹ căn có hạn, hồ sơ thường đông — đặc biệt dự án nội thành.

## Ai được mua nhà ở xã hội?

Luật Nhà ở liệt kê các nhóm đối tượng (Điều 76). Thực tế đăng ký mua thường gặp: công nhân khu công nghiệp, cán bộ công chức viên chức, người thu nhập thấp tại đô thị, hộ nghèo / cận nghèo, lực lượng vũ trang, hộ bị thu hồi đất, người có công…

Ba trụ cần đạt cùng lúc (thiếu một trụ là chưa đủ để xét mua):

1. Đúng nhóm đối tượng.
2. Đúng điều kiện nhà ở (chưa hưởng hỗ trợ / chưa có nhà đủ diện tích theo quy định tại nơi xét).
3. Đúng cơ chế thu nhập (nhóm chịu trần dùng mức đang hiệu lực; một số nhóm có cơ chế riêng hoặc miễn trần dân sự).

Chi tiết tự rà soát: [Ai được mua nhà ở xã hội 2026?](${articlePath("dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat")}) · Công cụ: [/cong-cu/dieu-kien-noxh](/cong-cu/dieu-kien-noxh).

## Mua, thuê mua và thuê nhà ở xã hội khác nhau thế nào?

Ba hình thức không thay thế nhau:

- Mua: hợp đồng mua bán; xét điều kiện ngay từ đợt mở bán.
- Thuê mua: hợp đồng thuê mua; thời hạn thanh toán theo luật và hợp đồng; xét điều kiện từ đầu.
- Thuê: hợp đồng thuê; muốn mua lại sau này là giao dịch mới theo khung ưu tiên / điều kiện tại thời điểm đề nghị mua.

Bảng so sánh và lỗi hay gặp: [Quy trình mua / thuê mua nhà ở xã hội](${articlePath("quy-trinh-mua-thue-mua-noxh-2026")}).

## Làm sao bắt đầu nếu đang tìm nhà ở xã hội?

1. Tự kiểm tra ba trụ điều kiện (bài tổng quan hoặc công cụ điều kiện).
2. Chuẩn bị hồ sơ / đơn theo mẫu đợt mở bán — xem hub [Đăng ký nhà ở xã hội](${articlePath("dang-ky-nha-o-xa-hoi")}).
3. Chọn dự án phù hợp túi tiền và mức cạnh tranh: [Danh mục dự án nhà ở xã hội](${NOXH_CATALOG_PATH}) — ưu tiên đọc thông báo chính thức từng đợt.
4. Ước lượng trả góp nếu cần vay: [/tinh-tra-gop](/tinh-tra-gop) · [/cong-cu/kiem-tra-vay-noxh](/cong-cu/kiem-tra-vay-noxh).

${NOXH_SUPPORT_CLOSING}

*Nguồn pháp lý tham chiếu: [Luật Nhà ở 27/2023/QH15](https://vanban.chinhphu.vn/?docid=209627&pageid=27160) · [NĐ 100/2024/NĐ-CP](https://vanban.chinhphu.vn/?docid=210760&pageid=27160).*`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: UPDATED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle: "Nhà ở xã hội là gì? Định nghĩa, đối tượng & khác thương mại | House X",
    seoDesc:
      "Nhà ở xã hội (NOXH) là gì? Ai được mua, khác căn thương mại thế nào, mua–thuê–thuê mua ra sao — tóm tắt có căn cứ Luật Nhà ở, dẫn điều kiện và đăng ký hồ sơ.",
    tags: [{ slug: TAG.slug, name: TAG.name }],
    projects: [],
  },
  {
    id: "article-noxh-intent-dang-ky-2026",
    slug: "dang-ky-nha-o-xa-hoi",
    title: "Đăng ký nhà ở xã hội — Hồ sơ, đơn mẫu và thứ tự việc cần làm",
    excerpt:
      "Đăng ký mua nhà ở xã hội theo đợt mở bán: kiểm tra điều kiện, chuẩn bị đơn–mẫu xác nhận, nộp đúng hạn, theo dõi rà soát — gom đường dẫn House X để tự làm đúng luật.",
    body: `## Đăng ký nhà ở xã hội bắt đầu từ đâu?

Đăng ký nhà ở xã hội không phải “giữ chỗ” như căn thương mại. Bạn theo dõi thông báo mở đăng ký của từng dự án, tự xác nhận đủ điều kiện, hoàn thiện bộ hồ sơ theo mẫu, rồi nộp đúng nơi và đúng hạn công bố. Đủ điều kiện pháp lý là điều kiện cần; được chọn căn còn phụ thuộc quỹ suất và kết quả rà soát / bốc thăm của đợt đó.

Thứ tự gọn trước khi xin giấy:

1. Đọc định nghĩa và khác biệt hình thức mua / thuê / thuê mua: [Nhà ở xã hội là gì?](${articlePath("nha-o-xa-hoi-la-gi")}).
2. Rà ba trụ đối tượng – nhà ở – thu nhập: [Điều kiện mua 2026](${articlePath("dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat")}) · [/cong-cu/dieu-kien-noxh](/cong-cu/dieu-kien-noxh).
3. Chọn một dự án đang / sắp mở bán — mỗi hộ một dự án tại một thời điểm: [Danh mục dự án nhà ở xã hội](${NOXH_CATALOG_PATH}).
4. Chuẩn bị đơn và giấy xác nhận đúng mẫu (phần dưới).
5. Nộp theo thông báo CĐT / điểm tiếp nhận; giữ biên nhận.

## Cần những giấy tờ gì khi đăng ký?

Bộ hồ sơ cụ thể theo từng đợt, nhưng khung thường gặp gồm:

| Nhóm | Việc cần có |
| --- | --- |
| Nhân thân | CCCD; giấy tờ hôn nhân; giấy khai sinh con (nếu nuôi con dưới tuổi thành niên) |
| Đơn đăng ký | Mẫu đơn theo thông báo đợt (thường bám Mẫu 01 / hướng dẫn NĐ 100) |
| Đối tượng & thu nhập | Giấy xác nhận từ đơn vị hoặc cơ quan có thẩm quyền (lao động tự do theo hướng dẫn địa phương) |
| Điều kiện nhà ở | Cam kết / xác nhận tình trạng nhà ở theo mẫu đợt |
| Ưu tiên (nếu có) | Giấy tờ chứng minh tiêu chí ưu tiên trong thông báo |

Lỗi hay gặp: sai mẫu, giấy hết hiệu lực 12 tháng, kê khai nhà ở cả hộ chưa đủ, nộp hai dự án cùng lúc.

## Đơn và mẫu xác nhận — đọc bài nào?

House X đã có cụm hướng dẫn điền mẫu (hành trình hồ sơ). Dùng theo thứ tự:

| Việc | Bài hướng dẫn |
| --- | --- |
| Điền đơn đăng ký, tránh lỗi | [Mẫu 01 — cách điền đơn đăng ký](${articlePath("mau-01-don-dang-ky-noxh-cach-dien-tranh-loi")}) |
| Xác nhận điều kiện nhà ở | [Mẫu 02 / 03](${articlePath("mau-02-mau-03-dieu-kien-nha-o-noxh")}) |
| Xác nhận thu nhập | [Mẫu 04 / 05](${articlePath("mau-04-mau-05-xac-nhan-thu-nhap-noxh-2026")}) |
| Số bộ hồ sơ photo | [Bao nhiêu bộ hồ sơ photo?](${articlePath("bao-nhieu-bo-ho-so-photo-noxh")}) |
| Lực lượng vũ trang (k7) | [Hồ sơ mẫu BQP / BCA](${articlePath("llvt-k7-ho-so-noxh-mau-bqp-bca")}) |
| Hiệu lực giấy 12 tháng | [Thời hạn giấy xác nhận](${articlePath("thoi-han-12-thang-giay-xac-nhan-noxh")}) |

Checklist in / rà soát nhanh: [/vu-nguyen/checklist-noxh](/vu-nguyen/checklist-noxh).

## Sau khi nộp hồ sơ thì sao?

Quy trình điển hình của một đợt: tiếp nhận → rà soát đối tượng / nhà ở / thu nhập → công khai danh sách → bốc thăm hoặc xét ưu tiên nếu vượt quỹ căn → ký hợp đồng với chủ đầu tư. Chi tiết từng bước: [Quy trình 7 bước đến nhận căn](${articlePath("quy-trinh-mua-thue-mua-noxh-2026")}).

Nếu bị trả hoặc loại: [Bị loại hồ sơ — làm gì tiếp theo](${articlePath("bi-loai-ho-so-noxh-lam-gi-tiep-theo")}) · [Hậu kiểm BHXH / thuế](${articlePath("hau-kiem-noxh-doi-chieu-bhxh-thue-2026")}).

## Đăng ký tư vấn hồ sơ trên House X

Khi cần hỗ trợ đối chiếu checklist trước hạn nộp, [đăng ký tư vấn nhà ở xã hội](/lien-he?goi=tu-van-nha-o-xa-hoi#tu-van). Có thể kèm [ước lượng vay nhà ở xã hội](/cong-cu/tham-dinh-vay-noxh).

${NOXH_SUPPORT_CLOSING}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: UPDATED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle: "Đăng ký nhà ở xã hội — Hồ sơ, đơn mẫu & thứ tự nộp | House X",
    seoDesc:
      "Hướng dẫn đăng ký nhà ở xã hội: kiểm tra điều kiện, đơn–mẫu xác nhận, nộp hồ sơ đúng hạn và đường dẫn tới checklist, công cụ và form tư vấn trên House X.",
    tags: [{ slug: TAG.slug, name: TAG.name }],
    projects: [],
  },
];
