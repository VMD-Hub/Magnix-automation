import { articlePath } from "@/lib/content/article-routes";
import { NOXH_TAG_CHINH_SACH } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";

const PUBLISHED = new Date("2026-07-16T00:00:00.000Z");
const TAG = NOXH_TAG_CHINH_SACH;

/** Chèn đầu mỗi bài hồ sơ — đồng bộ NOXH_FORM_TAXONOMY.md */
export const NOXH_FORM_SCOPE_DISCLAIMER = `> Phạm vi mẫu biểu: Chỉ mẫu NOXH theo NĐ 100/2024/NĐ-CP và Thông tư 05/2024/TT-BXD (Phụ lục I). Không nhầm với mẫu bản vẽ địa chính hay Mẫu 06 TT-BXD (vay tự xây/sửa nhà). Danh mục chi tiết — đối chiếu thông báo tiếp nhận của từng chủ đầu tư.`;

export type HandbookJourneyClusterId =
  | "c0-eligibility"
  | "c1-forms"
  | "c2-timeline"
  | "c3-process"
  | "c4-audit"
  | "c5-finance"
  | "c6-grievance";

export const NOXH_HANDBOOK_JOURNEY_CLUSTERS: ReadonlyArray<{
  id: HandbookJourneyClusterId;
  label: string;
  description: string;
}> = [
  {
    id: "c0-eligibility",
    label: "C0 — Đủ cửa vào chưa?",
    description: "Điều kiện nhà ở, đối tượng Đ.76 trước khi chuẩn bị bộ hồ sơ.",
  },
  {
    id: "c1-forms",
    label: "C1 — Đơn & mẫu TT-BXD",
    description: "Mẫu 01 NĐ 100, Mẫu 02–05 TT 05, BQP/BCA cho k7.",
  },
  {
    id: "c2-timeline",
    label: "C2 — Thời hạn giấy tờ",
    description: "Hiệu lực 12 tháng và mốc xét thu nhập.",
  },
  {
    id: "c3-process",
    label: "C3 — Quy trình CĐT",
    description: "Nộp hồ sơ, bốc thăm, ký HĐ — xem bài quy trình chung.",
  },
  {
    id: "c4-audit",
    label: "C4 — Hậu kiểm",
    description: "Đối chiếu thuế, BHXH, dữ liệu sau duyệt.",
  },
  {
    id: "c5-finance",
    label: "C5 — Vốn tự có & room",
    description: "30% vốn tự có, room giải ngân — bổ sung cụm vay.",
  },
  {
    id: "c6-grievance",
    label: "C6 — Khi có sự cố",
    description: "Bị loại, dữ liệu lệch — kênh pháp lý chung.",
  },
] as const;

const JOURNEY_READ_ORDER: readonly string[] = [
  "dieu-kien-nha-o-noxh-3-tinh-huong-hay-bi-tra-ho-so",
  "mau-01-don-dang-ky-noxh-cach-dien-tranh-loi",
  "mau-04-mau-05-xac-nhan-thu-nhap-noxh-2026",
  "mau-02-mau-03-dieu-kien-nha-o-noxh",
  "bao-nhieu-bo-ho-so-photo-noxh",
  "llvt-k7-ho-so-noxh-mau-bqp-bca",
  "thoi-han-12-thang-giay-xac-nhan-noxh",
  "hau-kiem-noxh-doi-chieu-bhxh-thue-2026",
  "bai-hoc-thanh-tra-noxh-dong-nai-2026",
  "room-tin-dung-noxh-va-30-von-tu-co",
  "bi-loai-ho-so-noxh-lam-gi-tiep-theo",
];

/** Footer tối giản — không thay phần trả lời trong thân bài. */
function journeyClosing(slug: string): string {
  const idx = JOURNEY_READ_ORDER.indexOf(slug);
  if (idx < 0) return "";
  const prev = idx > 0 ? JOURNEY_READ_ORDER[idx - 1] : null;
  const next =
    idx < JOURNEY_READ_ORDER.length - 1 ? JOURNEY_READ_ORDER[idx + 1] : null;
  const crumbs: string[] = [];
  if (prev) crumbs.push(`Trước: [lộ trình hồ sơ](${articlePath(prev)})`);
  if (next) crumbs.push(`Sau: [lộ trình hồ sơ](${articlePath(next)})`);
  if (crumbs.length === 0) return "";
  return `\n\n---\n\n${crumbs.join(" · ")}`;
}

/**
 * Cluster hành trình hồ sơ NOXH (C0–C6) — bổ sung pillar pháp lý thực chiến.
 * Nguồn biên tập: legal-sources/noxh/ · NOXH_HANDBOOK_JOURNEY_MAP.md
 */
export const NOXH_HANDBOOK_JOURNEY_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-noxh-journey-c0-01",
    slug: "dieu-kien-nha-o-noxh-3-tinh-huong-hay-bi-tra-ho-so",
    title:
      "Điều kiện nhà ở NOXH: Ba tình huống hay bị trả hồ sơ nhất",
    excerpt:
      "Chưa có nhà trên GCN, nhà diện tích thấp, hay có nhà xa nơi làm việc — ba trường hợp điều kiện nhà ở theo Điều 29 NĐ 100 với Mẫu 02/03 TT-BXD và lỗi khai sai tỉnh/thành phố nơi có dự án.",
    body: `${NOXH_FORM_SCOPE_DISCLAIMER}

## Vì sao bị trả hồ sơ dù đã thỏa điều kiện về thu nhập?

Nguyên nhân thường nằm ở Điều 29 [Nghị định 100/2024/NĐ-CP](https://vanban.chinhphu.vn/?docid=210760&pageid=27160), không nằm ở mức lương hay giấy xác nhận thu nhập. Cơ quan xét điều kiện về nhà ở theo tỉnh, thành phố trực thuộc trung ương nơi có dự án NOXH, đối chiếu cả người đứng đơn và vợ/chồng nếu đã kết hôn. Chỉ cần chọn sai trường hợp điều kiện nhà ở (điểm a khoản 1 Điều 78 Luật Nhà ở / Điều 29 NĐ 100), toàn bộ bộ hồ sơ có thể bị trả dù giấy thu nhập vẫn hợp lệ và đã thỏa điều kiện về thu nhập.

## Ba trường hợp điều kiện nhà ở thường gặp

| Trường hợp | Bản chất pháp lý | Mẫu dùng | Cơ quan xác nhận | Hệ quả nếu chọn sai |
| --- | --- | --- | --- | --- |
| Chưa có nhà ở | Không có nhà thuộc sở hữu, hoặc GCN không có thông tin nhà ở tại tỉnh/thành phố nơi có dự án | Mẫu 02 | VPĐK đất đai / cơ quan cấp GCN trong 07 ngày | Bị trả hồ sơ vì khai thiếu tài sản nhà ở |
| Nhà diện tích thấp | Có nhà nhưng bình quân dưới 15 m² sàn/người | Mẫu 03 | UBND cấp xã trong 07 ngày | Bị loại vì không chứng minh đủ số người cư trú tại căn |
| Có nhà xa nơi làm việc | Chỉ áp dụng khi tỉnh có quyết định riêng về khoảng cách | Mẫu 02 hoặc 03 + giấy đơn vị | Theo quyết định tỉnh | Bị bác nếu chỉ tự khai khoảng cách mà không có căn cứ tỉnh |

NĐ 54 mở rộng trường hợp “chưa có nhà” cho khi GCN không thể hiện thông tin nhà ở. Điểm này quan trọng với người có đất nhưng chưa có nhà trên giấy chứng nhận.

## Ba lỗi thực tế khiến Mẫu 02 hoặc 03 mất giá trị

1. Khai theo nơi đang thuê trọ thay vì tỉnh, thành phố nơi có dự án. Ví dụ làm việc ở TP.HCM nhưng mua dự án tại Đồng Nai thì phải xét tình trạng nhà ở tại Đồng Nai.
2. Chỉ rà tên người đứng đơn mà quên rà vợ/chồng. Hồ sơ NOXH xét cả hộ gia đình liên quan, không phải chỉ một cá nhân.
3. Tự chọn trường hợp “nhà xa nơi làm việc” nhưng không có quyết định tỉnh và không có xác nhận đơn vị sử dụng lao động.

## Cách chốt đúng trường hợp điều kiện nhà ở trong 4 bước

1. Xác định đúng tỉnh, thành phố nơi có dự án NOXH bạn nộp.
2. Liệt kê toàn bộ nhà/đất đứng tên bạn và vợ/chồng tại địa phương đó.
3. Nếu có nhà, tính diện tích bình quân: tổng diện tích sàn chia cho số người thường trú thực tế tại căn.
4. Đối chiếu với thông báo tiếp nhận dự án để xem địa phương đó có cơ chế “nhà xa nơi làm việc” hay không.

## Hồ sơ nền nên cầm sẵn trước khi xin xác nhận

- CCCD của hai vợ chồng nếu đã kết hôn
- Thông tin GCN hoặc địa chỉ căn nhà hiện có
- Xác nhận cư trú/CT07 nếu số người ở thực tế là dữ liệu cần chứng minh
- Thông báo mở bán hoặc hướng dẫn tiếp nhận hồ sơ của đúng dự án

## Làm sai sẽ bị gì?

- Sai trường hợp điều kiện nhà ở ngay từ đầu: CĐT trả hồ sơ, bạn mất lượt nộp đợt đầu.
- Giấy xác nhận không khớp thực tế: bị đối chiếu lại ở giai đoạn hậu kiểm.
- Kê khai thiếu tài sản nhà ở của vợ/chồng: có thể bị hủy kết quả xét duyệt sau khi công khai danh sách.

## Tự rà ba trụ cột trước khi chuẩn bị hồ sơ

| Trụ cột | Câu hỏi tự kiểm | Đạt khi nào | Không đạt thì làm gì |
| --- | --- | --- | --- |
| Đối tượng | Bạn thuộc khoản nào Điều 76? | Tick đúng nhóm trên Mẫu 01 và có giấy chứng minh tương ứng | Đổi nhóm đối tượng trước khi xin giấy |
| Nhà ở | Tại tỉnh/thành phố nơi có dự án, bạn chưa có nhà, có nhà chật, hay có nhà xa nơi làm việc? | Chọn đúng một trường hợp điều kiện nhà ở và có Mẫu 02 hoặc 03 khớp | Làm lại phần nhà ở trên đơn và xin lại giấy |
| Thu nhập | Bình quân 12 tháng có trong trần 25/35/50 không? | Tổng thu nhập thực nhận 12 tháng chia 12 không vượt trần | Không nộp nếu vượt trần; hoặc chờ thay đổi thu nhập thật |

Công thức nhanh thu nhập: (Tổng tiền lương, tiền công thực nhận 12 tháng liền kề) ÷ 12 ≤ trần áp dụng. Đã kết hôn thì cộng thu nhập vợ chồng trước khi chia 12.

## Ví dụ chọn trường hợp điều kiện nhà ở (làm mẫu)

Tình huống: Làm việc tại TP.HCM, đăng ký dự án NOXH tại Đồng Nai, thuê trọ tại Bình Dương.

- Sai: Lấy tình trạng “đang thuê trọ Bình Dương” để khai nhà ở.
- Đúng: Tra GCN tại Đồng Nai cho bạn và vợ/chồng. Nếu không có nhà trên GCN tại Đồng Nai → trường hợp chưa có nhà → Mẫu 02 tại VPĐK Đồng Nai.

Tình huống: Có căn 40 m² tại tỉnh/thành phố nơi có dự án, 5 người thường trú.

- Tính: 40 ÷ 5 = 8 m²/người < 15 → Mẫu 03 tại UBND xã nơi có căn.

## Checklist 10 điểm trước khi chuẩn bị hồ sơ nhà ở

- [ ] Đã xác định đúng tỉnh/thành phố nơi có dự án
- [ ] Đã tra GCN cả vợ chồng tại tỉnh đó
- [ ] Đã chọn đúng Mẫu 02 hoặc 03 (không nhầm)
- [ ] Phần nhà ở trên Mẫu 01 khớp giấy xác nhận
- [ ] Giấy xác nhận còn hiệu lực 12 tháng
- [ ] Thu nhập đã tính ÷ 12 và trong trần
- [ ] Đơn Mẫu 01 tick đúng khoản Đ.76 và mục 11
- [ ] Đã khai vợ/chồng nếu kết hôn
- [ ] Chỉ đăng ký một dự án
- [ ] Có biên nhận hoặc xác nhận nộp khi CĐT yêu cầu

${journeyClosing("dieu-kien-nha-o-noxh-3-tinh-huong-hay-bi-tra-ho-so")}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "Điều kiện nhà ở NOXH — 3 tình huống hay bị trả hồ sơ | HouseX",
    seoDesc:
      "Chưa có nhà, nhà diện tích thấp, nhà xa nơi làm việc: Mẫu 02/03 TT-BXD và lỗi khai theo Điều 29 NĐ 100.",
    tags: [TAG],
    projects: [],
  },
  {
    id: "article-noxh-journey-c1-01",
    slug: "mau-01-don-dang-ky-noxh-cach-dien-tranh-loi",
    title:
      "Điền đơn Mẫu 01 NOXH thế nào để tránh bị trả hồ sơ?",
    excerpt:
      "Đơn đăng ký NĐ 100 Phụ lục II: tick đối tượng Đ.76, khai vợ/chồng, nhà ở tại tỉnh/thành phố nơi có dự án, cam kết một dự án — năm lỗi hay gặp khi viết tay.",
    body: `${NOXH_FORM_SCOPE_DISCLAIMER}

## Mẫu 01 NĐ 100 là giấy gì và sai ở đâu nhiều nhất?

Đây là đơn chính để đăng ký mua hoặc thuê mua NOXH theo Phụ lục II NĐ 100. Sai ở đơn này thường không phải lỗi câu chữ mà là sai dữ liệu nền: tick nhầm đối tượng Điều 76, khai thiếu vợ/chồng, ghi sai tình trạng nhà ở, hoặc chọn nhầm mục 11 về thu nhập. CĐT thường soi đơn trước rồi mới nhận các giấy kèm theo.

Phân biệt ngay từ đầu:

- Mẫu 01 NĐ 100: đơn đăng ký nộp cho chủ đầu tư.
- Mẫu 01 TT 05: giấy chứng minh đối tượng ở Phụ lục I Thông tư 05.

## Bảng tick đối tượng Điều 76 — chọn trước khi viết mục 11

| Bạn là ai | Tick khoản | Mục 11 trên đơn | Giấy thu nhập kèm theo |
| --- | --- | --- | --- |
| Công nhân KCN, lao động phổ thông | k6 | 11.1 | Mẫu 04 (có HĐLĐ) hoặc Mẫu 05 (không HĐLĐ) |
| Người thu nhập thấp đô thị | k5 | 11.1 | Mẫu 04 hoặc 05 |
| CBCCVC, viên chức | k8 | 11.1 | Mẫu 04 |
| Quân nhân, CA tại ngũ | k7 | 11.2 | Mẫu BQP/BCA — không dùng 25/35/50 |
| Hộ nghèo, người có công | k1–k4, k9–k11 | Không tick 11.1 dân sự | Giấy đối tượng riêng, không Mẫu 04/05 |

Tick sai một dòng = sai cả bộ giấy kèm theo.

## Thứ tự điền đơn Mẫu 01 (15–20 phút, làm một lần)

Trước khi viết: mở song song thẻ CCCD còn hiệu lực và ứng dụng VNeID tài khoản định danh điện tử mức 2. Theo khoản 8 Điều 13 Nghị định 59/2022/NĐ-CP, dùng tài khoản mức 2 trong giao dịch điện tử có giá trị tương đương xuất trình giấy tờ đã tích hợp — Bộ Công an khuyến khích dùng VNeID khi giải quyết thủ tục hành chính. Thông tin cư trú trên VNeID thường đồng bộ CSDL quốc gia sớm hơn thẻ vật lý (nhiều người đã chuyển trú nhưng chưa đổi thẻ).

| Loại thông tin trên đơn | Nguồn ưu tiên khi khai | Nếu lệch giữa CCCD và VNeID |
| --- | --- | --- |
| Số CCCD / định danh, họ tên, ngày sinh | Thẻ CCCD còn hiệu lực (khớp CSDL dân cư) | Đồng bộ tại Công an trước khi nộp — không chọn bừa |
| Ngày cấp, nơi cấp | Mặt sau thẻ CCCD | Ghi theo dòng in trên thẻ (xem mục viết tắt bên dưới) |
| Nơi thường trú / tạm trú | VNeID / CSDL cư trú quốc gia (CA đối chiếu theo NĐ 54) | Đã chuyển trú: khai theo VNeID mới; CCCD còn địa chỉ cũ → kèm giải thích / đổi thẻ khi được. CCCD mới đúng mà VNeID chưa cập nhật → yêu cầu CA đồng bộ VNeID trước, không khai theo VNeID cũ |
| Tình trạng hôn nhân | Thực tế pháp lý (giấy kết hôn) | Không khai độc thân chỉ vì CCCD chưa cập nhật |

Thứ tự điền:

1. Thông tin định danh — số CCCD, họ tên, ngày sinh theo thẻ; địa chỉ thường trú/tạm trú theo VNeID mức 2 (không copy máy móc địa chỉ cũ trên thẻ nếu hệ thống đã đổi).
2. Nơi cấp CCCD — ghi theo mặt sau thẻ. Ô ngắn: được viết gọn nhận diện được cơ quan, ví dụ thẻ chip từ 10/10/2018 thường ghi đầy đủ “Cục Cảnh sát quản lý hành chính về trật tự xã hội” → thực hành phổ biến ghi “Cục CS QLHC về TTXH” (QLHC = quản lý hành chính; TTXH = trật tự xã hội). Không ghi “Công an xã/phường” (đó là nơi làm thủ tục đổi thẻ, không phải nơi cấp thẻ). Không thêm chữ “Cục trưởng”. Thẻ theo Luật Căn cước 2023 ghi “Bộ Công an” thì ghi đúng dòng trên thẻ.
3. Tick nhóm Điều 76 — dùng bảng trên.
4. Tình trạng hôn nhân — nếu đã kết hôn, điền đủ vợ/chồng ngay; kèm giấy kết hôn nếu CĐT yêu cầu.
5. Phần nhà ở — ghi theo tỉnh/thành phố nơi có dự án, khớp Mẫu 02 hoặc 03 sẽ xin sau.
6. Mục 11 — k7 ghi 11.2; k5/k6/k8 ghi 11.1 và mức thu nhập bình quân tháng.
7. Cam kết cuối đơn — chỉ ký khi xác nhận chỉ đăng ký một dự án trong thời điểm tiếp nhận và toàn bộ dòng trên đơn khớp một bộ dữ liệu (đơn + CCCD + VNeID + giấy kèm).

## Năm lỗi và cách sửa ngay trên bàn

| Lỗi | Sửa được trên đơn cũ? | Cách xử lý |
| --- | --- | --- |
| Sai một chữ, một số điện thoại | Có | Gạch một nét, viết đúng bên cạnh |
| Sai tick k6 thành k8 | Không | Làm đơn mới + đổi giấy Mẫu 04 |
| Quên khai vợ/chồng | Không | Làm đơn mới + bổ sung giấy thu nhập/nhà ở cả hộ |
| Mục 11.1 trong khi là k7 | Không | Làm đơn mới + giấy BQP/BCA |
| Khai địa chỉ CCCD cũ trong khi VNeID đã chuyển trú | Không nên giữ | Làm đơn mới theo VNeID; đồng bộ/đổi thẻ nếu CĐT yêu cầu |
| Tẩy xóa nhiều chỗ | Không nên | Làm đơn mới — CĐT có thể nghi ngờ chỉnh sửa |

## Checklist chốt đơn trước khi chuẩn bị bộ hồ sơ

- [ ] Đã đối chiếu VNeID mức 2 với thẻ CCCD trước khi viết
- [ ] Địa chỉ thường trú/tạm trú khớp VNeID / CSDL cư trú
- [ ] Nơi cấp CCCD đúng cơ quan trên thẻ (hoặc viết gọn QLHC/TTXH nếu ô ngắn)
- [ ] Nhóm Điều 76 đã khớp giấy chứng minh đối tượng
- [ ] Trạng thái hôn nhân khớp giấy tờ thực tế (không theo CCCD lỗi thời)
- [ ] Phần nhà ở khớp Mẫu 02 hoặc Mẫu 03
- [ ] Mục 11 đúng nhánh 11.1 hay 11.2
- [ ] Chỉ nộp một dự án trong cùng thời điểm tiếp nhận
- [ ] Tất cả giấy kèm còn hiệu lực 12 tháng kể từ ngày xác nhận

${journeyClosing("mau-01-don-dang-ky-noxh-cach-dien-tranh-loi")}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle: "Cách điền Mẫu 01 đăng ký NOXH — tránh lỗi hay gặp | HouseX",
    seoDesc:
      "Hướng dẫn đơn Mẫu 01 NĐ 100: đối chiếu VNeID mức 2, nơi cấp QLHC/TTXH, tick Đ.76, vợ/chồng, mục 11.",
    tags: [TAG],
    projects: [],
  },
  {
    id: "article-noxh-journey-c1-02",
    slug: "mau-04-mau-05-xac-nhan-thu-nhap-noxh-2026",
    title:
      "Mẫu 04 và Mẫu 05 (TT-BXD): Khai thu nhập mua NOXH đúng thế nào?",
    excerpt:
      "Mẫu 04 cho người có HĐLĐ; Mẫu 05 cho k5 không HĐLĐ (Công an cấp xã từ NĐ 54). Trần bình quân tháng (NĐ 136): độc thân 25 triệu; độc thân nuôi con dưới 18 tuổi 35 triệu; đã kết hôn tổng vợ chồng 50 triệu. Tránh cộng nhầm phụ cấp miễn thuế vào thu nhập xét.",
    body: `${NOXH_FORM_SCOPE_DISCLAIMER}

## Mẫu 04 hay Mẫu 05 — chọn ngay trong 30 giây

| Tình huống của bạn | Mẫu dùng | Ai ký | Thời hạn xử lý tham chiếu |
| --- | --- | --- | --- |
| Đang có HĐLĐ hoặc làm việc tại DN, cơ quan, trường, bệnh viện | Mẫu 04 TT 05 | Thủ trưởng đơn vị nơi làm việc | Theo quy trình nội bộ đơn vị |
| Lao động tự do, shipper, freelancer không HĐLĐ (k5) | Mẫu 05 TT 05 | Công an cấp xã từ 09/02/2026 | Thường trong 07 ngày sau khi nộp đủ hồ sơ |
| Quân nhân, công an tại ngũ (k7) | Không dùng Mẫu 04/05 dân sự | Mẫu BQP/BCA + mục 11.2 trên đơn NĐ 100 | Theo đơn vị quản lý |

Chọn sai mẫu = hồ sơ bị trả ngay dù số thu nhập đúng.

## Công thức tính thu nhập — làm trước khi đi xin ký

Bước 1: Lấy tổng tiền lương, tiền công thực nhận trong 12 tháng liền kề đến ngày xin xác nhận.

Bước 2: Chia 12 để ra bình quân tháng.

Bước 3: So với trần (từ 07/04/2026, NĐ 136):

| Tình huống | Trần bình quân tháng |
| --- | --- |
| Độc thân | 25 triệu |
| Độc thân nuôi con dưới 18 tuổi | 35 triệu |
| Đã kết hôn | 50 triệu (tổng vợ chồng) |

Ví dụ số:
- Lương 22 triệu/tháng ổn định 12 tháng → 22 ≤ 25 → đủ (độc thân).
- Vợ 24 triệu + chồng 22 triệu = 46 triệu/tháng → 46 ≤ 50 → đủ (đã kết hôn).
- Một tháng nhận thưởng lớn làm bình quân 12 tháng lên 26,5 triệu → không đủ trần 25 triệu dù 11 tháng còn lại thấp.

Một số tỉnh có hệ số điều chỉnh — tra thông báo Sở Xây dựng tỉnh/thành phố nơi có dự án trước khi chốt.

## Mẫu 04: quy trình xin và đối chiếu tại DN

1. In Mẫu 04 TT 05 Phụ lục I Thông tư 05/2024/TT-BXD.
2. Kèm bảng lương hoặc sao kê lương 12 tháng, HĐLĐ còn hiệu lực.
3. Yêu cầu kế toán ghi đúng khoảng 12 tháng liền kề, không lấy năm dương lịch cho tiện.
4. Trước khi ký, tự so 3 nguồn: bảng lương ↔ dữ liệu BHXH tại DN ↔ số trên Mẫu 04.
5. Nhận giấy, kiểm tra ngày xác nhận — giấy có hiệu lực 12 tháng kể từ ngày đó (NĐ 54 Điều 38).

Khoản thường bị cộng nhầm (dễ làm vượt trần trên giấy):
- Phụ cấp ăn ca, trang phục, điện thoại nếu đơn vị coi là miễn thuế.
- Thưởng một lần không ổn định.
- Phụ cấp không phải tiền lương, tiền công thực nhận.

Khoản nên hỏi kế toán tách riêng trước khi ký:
- Lương cơ bản, phụ cấp chức vụ, phụ cấp lương tính vào Bảng tiền công.
- Tiền công làm thêm nếu đơn vị xác nhận là thu nhập thường xuyên.

## Mẫu 05: quy trình tại Công an cấp xã (k5 không HĐLĐ)

1. Mang CCCD, sổ hộ khẩu hoặc xác nhận cư trú, Mẫu 05 đã kê khai.
2. Kê khai nguồn thu nhập: ship, bán hàng online, thợ tự do… kèm hợp đồng, sao kê nếu có.
3. Ký cam kết thu nhập trung thực — địa phương có thể hậu kiểm sau.
4. Nhận giấy xác nhận trong thời hạn quy định; ghi ngày để canh 12 tháng.

Sau 09/02/2026, không còn xin Mẫu 05 qua UBND xã cho lao động tự do — phải qua Công an cấp xã.

## Năm lỗi làm hỏng giấy thu nhập

| Lỗi | Hệ quả | Cách sửa |
| --- | --- | --- |
| Chỉ xin xác nhận của một người khi đã kết hôn | Vượt trần 50 triệu trên thực tế | Cộng đủ thu nhập vợ chồng, xin lại giấy |
| DN ký nhưng không có BHXH tại DN đó | Bị phát hiện ở hậu kiểm (case Đồng Nai 2026) | Chỉ xin tại đơn vị đang đóng BHXH/thuế thật |
| Giấy quá 12 tháng khi CĐT xét | Trả hồ sơ dù số thu nhập vẫn đúng | Xin lại giấy trước mốc ký HĐ |
| Ghi “ước tính”, “khoảng” trên giấy | Không dùng được để xét chính thức | Yêu cầu ghi số cụ thể theo 12 tháng |
| Dùng Mẫu 05 cho người đang có HĐLĐ | Sai thẩm quyền | Chuyển sang Mẫu 04 |

## Checklist chốt giấy trước khi ghép vào bộ hồ sơ

- [ ] Đúng Mẫu 04 hoặc 05 (không nhầm Mẫu 03 — Mẫu 03 là nhà ở)
- [ ] Bình quân 12 tháng ≤ trần đúng nhóm: 25 (độc thân) / 35 (độc thân nuôi con dưới 18) / 50 (đã kết hôn, tổng vợ chồng) — hoặc trần có hệ số tỉnh
- [ ] Đã cộng thu nhập vợ/chồng nếu kết hôn
- [ ] Khớp BHXH và bảng lương (nếu Mẫu 04)
- [ ] Còn hiệu lực 12 tháng tính từ ngày xác nhận
- [ ] Khớp mục 11.1 trên đơn Mẫu 01 NĐ 100

${journeyClosing("mau-04-mau-05-xac-nhan-thu-nhap-noxh-2026")}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "Mẫu 04 Mẫu 05 xác nhận thu nhập NOXH 2026 — TT-BXD | HouseX",
    seoDesc:
      "Mẫu 04 (có HĐLĐ) vs Mẫu 05 (k5 không HĐLĐ, CA cấp xã). Trần NĐ 136: độc thân 25 triệu, nuôi con dưới 18 tuổi 35 triệu, vợ chồng 50 triệu. Lỗi cộng phụ cấp miễn thuế.",
    tags: [TAG],
    projects: [],
  },
  {
    id: "article-noxh-journey-c1-03",
    slug: "mau-02-mau-03-dieu-kien-nha-o-noxh",
    title:
      "Mẫu 02 và Mẫu 03: Chứng minh điều kiện nhà ở NOXH ra sao?",
    excerpt:
      "Mẫu 02 TT-BXD khi chưa có nhà trên GCN tại tỉnh/thành phố nơi có dự án; Mẫu 03 khi có nhà dưới 15 m²/người. VPĐK đất đai và UBND xã xác nhận trong 07 ngày.",
    body: `${NOXH_FORM_SCOPE_DISCLAIMER}

## Khi nào dùng Mẫu 02, khi nào dùng Mẫu 03?

Trả lời ngắn gọn:

- Mẫu 02 dùng khi bạn chưa có nhà ở hợp lệ tại tỉnh, thành phố trực thuộc trung ương nơi có dự án, hoặc GCN không có thông tin nhà ở.
- Mẫu 03 dùng khi bạn có nhà nhưng diện tích bình quân dưới 15 m² sàn/người.

Sai giữa hai mẫu này là lỗi rất nặng vì nó làm lệch bản chất điều kiện nhà ở trên toàn bộ hồ sơ.

## Bản chất pháp lý của từng mẫu

| Mẫu | Bản chất | Dữ liệu cần chứng minh | Cơ quan xác nhận |
| --- | --- | --- | --- |
| Mẫu 02 | Chưa có nhà ở tại tỉnh/thành phố nơi có dự án | Tình trạng sở hữu và thông tin trên GCN | VPĐK đất đai / cơ quan cấp GCN |
| Mẫu 03 | Có nhà nhưng chật | Diện tích sàn và số người cư trú liên quan | UBND cấp xã |

Đã kết hôn thì tình trạng nhà ở của vợ/chồng cũng bị xét cùng, không có chuyện “nhà đứng tên vợ nên chồng vẫn được xem như chưa có nhà”.

## Lỗi sai thực tế hay gặp

1. Có đất ở nhưng trên GCN chưa thể hiện nhà ở, người dân tự kết luận mình “có nhà” và đi xin Mẫu 03 trong khi thực chất có thể đi theo Mẫu 02.
2. Có nhà diện tích nhỏ nhưng không chứng minh được số người cùng ở, khiến bình quân đầu người bị tính sai.
3. Lấy xác nhận ở địa phương cư trú hiện tại thay vì nơi có căn nhà cần xác nhận.

## Cách làm đúng Mẫu 02 trong 3 bước

1. Chuẩn bị thông tin GCN hoặc kết quả tra cứu nhà đất tại tỉnh/thành phố nơi có dự án.
2. Nộp đơn đề nghị xác nhận tại VPĐK đất đai hoặc cơ quan cấp GCN.
3. Sau khi có Mẫu 02, đối chiếu lại nội dung trên đơn Mẫu 01: phần nhà ở phải cùng một trường hợp điều kiện nhà ở.

## Cách làm đúng Mẫu 03 trong 4 bước

1. Xác định chính xác diện tích sàn căn nhà đang có.
2. Chốt danh sách người cùng cư trú để tính bình quân m²/người.
3. Xin xác nhận tại UBND cấp xã nơi có căn nhà.
4. Kèm thêm giấy cư trú hoặc tài liệu chứng minh số người ở thực tế nếu CĐT yêu cầu.

## Công thức chọn trường hợp điều kiện nhà ở — làm trước khi xin Mẫu 02 hoặc 03

Bước 1: Xác định tỉnh, thành phố nơi có dự án NOXH (không phải tỉnh đang thuê trọ).

Bước 2: Tra GCN của bạn và vợ/chồng tại địa phương đó.

Bước 3: Áp quy tắc:

| Kết quả tra cứu | Trường hợp điều kiện nhà ở | Mẫu |
| --- | --- | --- |
| Không có GCN nhà ở, hoặc GCN không ghi thông tin nhà ở | Chưa có nhà | Mẫu 02 |
| Có nhà, diện tích sàn ÷ số người cư trú ≥ 15 m² | Không đủ điều kiện nhà diện tích thấp | Không nộp theo trường hợp nhà chật |
| Có nhà, diện tích sàn ÷ số người cư trú < 15 m² | Nhà diện tích thấp | Mẫu 03 |
| Có nhà + QĐ tỉnh cho phép + xa nơi làm việc đủ km | Theo QĐ tỉnh | Mẫu 02/03 + giấy đơn vị |

Công thức Mẫu 03: Diện tích bình quân = Tổng diện tích sàn (m²) ÷ Số người thường trú thực tế tại căn.

Ví dụ: Căn 36 m², 4 người cùng ở → 36 ÷ 4 = 9 m²/người < 15 → đủ điều kiện nhà diện tích thấp (Mẫu 03). Căn 60 m², 3 người → 20 m²/người → không đủ điều kiện nhà chật.

## Quy trình xin Mẫu 02 hoặc 03 (từng bước)

Mẫu 02 — chưa có nhà:
1. Chuẩn bị CCCD, thông tin GCN hoặc đơn đề nghị tra cứu tại VPĐK đất đai tỉnh/thành phố nơi có dự án.
2. Nộp đơn xin xác nhận — thời hạn tham chiếu 07 ngày.
3. Nhận giấy, đối chiếu với phần nhà ở trên đơn Mẫu 01: tick “chưa có nhà”.

Mẫu 03 — nhà chật:
1. Đo hoặc lấy diện tích sàn trên GCN/hồ sơ nhà.
2. Lập danh sách người thường trú tại căn (có giấy cư trú nếu CĐT yêu cầu).
3. Nộp tại UBND cấp xã nơi có căn nhà — thời hạn tham chiếu 07 ngày.
4. Tick “đã có nhà, diện tích thấp” trên đơn Mẫu 01.

## Lỗi làm mất giá trị giấy nhà ở

| Lỗi | Hệ quả | Sửa |
| --- | --- | --- |
| Xin Mẫu 02 tại tỉnh đang ở thay vì tỉnh/thành phố nơi có dự án | Giấy không dùng được | Xin lại đúng tỉnh/thành phố nơi có dự án |
| Quên rà vợ/chồng | Bị phát hiện có nhà sau công khai danh sách | Rà cả hộ trước khi nộp |
| Mẫu 03 không kèm danh sách người ở | UBND hoặc CĐT tính lại bình quân sai | Bổ sung giấy cư trú |

${journeyClosing("mau-02-mau-03-dieu-kien-nha-o-noxh")}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle: "Mẫu 02 Mẫu 03 điều kiện nhà ở NOXH — TT-BXD | HouseX",
    seoDesc:
      "Hướng dẫn Mẫu 02 (chưa có nhà) và Mẫu 03 (nhà diện tích thấp) theo Thông tư 05/2024 TT-BXD.",
    tags: [TAG],
    projects: [],
  },
  {
    id: "article-noxh-journey-c1-04",
    slug: "bao-nhieu-bo-ho-so-photo-noxh",
    title: "Nộp hồ sơ NOXH cần chuẩn bị mấy bộ?",
    excerpt:
      "Thường 4 bộ theo thông báo CĐT; có vay thì ngân hàng cần thêm 1 bộ. Mẫu biểu viết tay và ký sống từng bản — không photocopy đơn đã điền.",
    body: `${NOXH_FORM_SCOPE_DISCLAIMER}

## Nộp hồ sơ NOXH cần chuẩn bị mấy bộ?

Pháp luật (NĐ 100/54) quy định loại giấy tờ, không ấn định một số bộ cố định toàn quốc. Số bộ do chủ đầu tư ghi trong thông báo tiếp nhận từng dự án — bắt buộc đọc thông báo đúng dự án trước khi chuẩn bị.

Tham chiếu thực tế thị trường (chỉ dùng sau khi đã đối chiếu thông báo CĐT):

| Tình huống | Số bộ tham chiếu | Phân bổ thường gặp |
| --- | --- | --- |
| Mua / thuê mua — không vay | Thường 4 bộ | CĐT / xét duyệt / lưu dự phòng theo quy chế dự án |
| Mua / thuê mua — có vay | Thường 4 bộ như trên + thêm 1 bộ cho ngân hàng | Bộ ngân hàng dùng thẩm định vay / giải ngân (NHCSXH hoặc NH liên kết) |
| Nộp online | Theo cổng CĐT (thường 1 bộ điện tử) | Scan/PDF đủ danh mục — vẫn phải hỏi CĐT có bắt bản giấy song song không |

Không khẳng định mọi dự án đều đúng 4 bộ. CĐT có thể yêu cầu 2, 3, 4 hoặc 5 bộ. Con số chốt = dòng trong thông báo tiếp nhận hoặc trả lời bằng văn bản của CĐT.

## “Một bộ” nghĩa là gì?

Một bộ = một chồng hồ sơ đầy đủ toàn bộ danh mục giấy của đợt đó, sắp cùng thứ tự, để một đầu mối xét độc lập. Thiếu một giấy trong một bộ thì bộ đó chưa hoàn chỉnh — không phải “mỗi bộ một vài tờ đại diện”.

## Viết tay, ký sống — không nhầm với photocopy đơn đã điền

Hai nhóm giấy khác nhau:

| Nhóm | Cách làm đúng | Không được |
| --- | --- | --- |
| Mẫu biểu khai (Mẫu 01 và các mẫu phải do người đăng ký kê khai, ký) | In mẫu trống → viết tay từng bản → ký tay (chữ ký sống) trên từng bộ | Viết một bản rồi photocopy nhân bản; đánh máy cả đơn rồi in hàng loạt nếu CĐT bắt viết tay; ký photo hoặc cắt dán chữ ký |
| Giấy tờ kèm đã có sẵn (CCCD, giấy xác nhận đơn vị/UBND/CA đã ký đóng dấu…) | Bản sao / bản photo theo yêu cầu CĐT (có chứng thực nếu thông báo bắt buộc) | Thiếu mặt sau CCCD; mỗi bộ thiếu loại giấy khác nhau |

Một câu nhớ: số bộ tăng là tăng số chồng hồ sơ đầy đủ — với mẫu biểu, mỗi bộ là một bản viết tay và ký riêng, không phải “viết xong photo ra”.

Nếu thông báo dự án cho phép điền PDF rồi in ký: làm đúng thông báo đó; không tự suy ra áp cho mọi dự án.

## Phân bổ 4 bộ + bộ ngân hàng khi có vay

| Bộ | Thường dành cho | Ghi chú |
| --- | --- | --- |
| Bộ 1–4 | Chủ đầu tư / xét duyệt / lưu theo quy chế dự án | Đúng 4 bộ chỉ khi thông báo CĐT ghi vậy |
| Bộ thêm (có vay) | Ngân hàng liên kết / NHCSXH | Chuẩn bị thêm 1 bộ đầy đủ khi bạn vay — trừ khi thông báo đã gộp bộ NH vào tổng số bộ đã nêu |

Hỏi CĐT một câu chốt: “Tổng số bộ nộp tại điểm tiếp nhận là mấy? Trong đó đã gồm bộ ngân hàng chưa, hay nộp thêm riêng cho NH?”

## Danh mục mỗi bộ — sắp cùng một thứ tự

1. Đơn Mẫu 01 NĐ 100 — viết tay, đủ trang, đã ký sống
2. CCCD người đứng đơn (mặt trước + sau) — bản sao theo yêu cầu CĐT
3. CCCD vợ/chồng nếu đã kết hôn
4. Giấy xác nhận thu nhập (Mẫu 04, 05, hoặc BQP/BCA)
5. Giấy xác nhận nhà ở (Mẫu 02 hoặc 03 nếu thuộc diện)
6. CT07 / xác nhận cư trú nếu CĐT yêu cầu
7. Giấy tờ đối tượng đặc thù / hồ sơ vay nếu thông báo yêu cầu

Ghi ngoài bìa mỗi bộ: Họ tên · SĐT · Dự án · Bộ mấy / tổng số bộ.

## Việc cần làm trước khi nhân bản giấy kèm

1. Đọc thông báo tiếp nhận — chốt số bộ và có/không vay.
2. In đủ số tờ mẫu trống Mẫu 01 (và mẫu khác phải viết tay) = đúng số bộ.
3. Viết tay và ký sống hết từng bản mẫu biểu trước.
4. Chỉ sau đó mới photo/sao y các giấy tờ kèm (CCCD, giấy xác nhận cơ quan…) đủ số bộ.
5. So từng bộ với bộ đầu — không để bộ này thừa bộ kia thiếu.

## Mẫu tin nhắn hỏi CĐT

“Em chuẩn bị nộp hồ sơ dự án [tên]. Nhờ anh/chị xác nhận bằng tin nhắn hoặc thông báo: (1) tổng số bộ hồ sơ bản giấy cần nộp; (2) nếu vay NH liên kết/NHCSXH thì đã gồm trong số đó hay phải thêm bộ cho ngân hàng; (3) Mẫu 01 bắt buộc viết tay từng bản hay được điền PDF in ký; (4) bản sao CCCD/giấy xác nhận có cần chứng thực không; (5) nộp trực tiếp hay online.”

Lưu lại trả lời — tránh tranh chấp “bên em không nói vậy”.

## Lỗi hay gặp và hệ quả

| Lỗi | Hệ quả | Cách tránh |
| --- | --- | --- |
| Viết một Mẫu 01 rồi photocopy ra nhiều bộ | CĐT trả vì không có chữ ký sống / không chấp nhận bản photo đơn | Viết tay + ký từng bản theo số bộ |
| Chỉ chuẩn bị 3 bộ trong khi thông báo ghi 4, hoặc quên bộ ngân hàng khi có vay | Không nhận đủ hồ sơ / chậm giải ngân | Chốt số bộ + câu “đã gồm bộ NH chưa?” |
| Mỗi bộ thiếu giấy khác nhau | Cả đợt bị trả | Checklist danh mục trên từng bộ |
| Photo CCCD thiếu mặt sau | Bổ sung, mất tiến độ | Kiểm mặt trước + sau trước khi ghim |

${journeyClosing("bao-nhieu-bo-ho-so-photo-noxh")}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle: "Hồ sơ NOXH cần mấy bộ? Viết tay từng bản | HouseX",
    seoDesc:
      "Thường 4 bộ theo thông báo CĐT; có vay thêm bộ ngân hàng. Mẫu biểu viết tay ký sống — không photocopy đơn đã điền.",
    tags: [TAG],
    projects: [],
  },
  {
    id: "article-noxh-journey-c1-05",
    slug: "llvt-k7-ho-so-noxh-mau-bqp-bca",
    title:
      "Quân nhân, công an (k7) nộp hồ sơ NOXH dùng mẫu gì?",
    excerpt:
      "k7 không dùng trần 25/35/50 triệu — mục 11.2 Mẫu 01 NĐ 100 và giấy BQP/BCA. Không nhầm Mẫu 06 TT 05 (vay tự xây/sửa).",
    body: `${NOXH_FORM_SCOPE_DISCLAIMER}

## k7 và k8 khác nhau ở đâu?

Khác ngay ở bản chất đối tượng:

- k7 là lực lượng vũ trang nhân dân đang phục vụ.
- k8 là cán bộ, công chức, viên chức.

Nhầm hai nhóm này sẽ kéo theo sai cả mục 11 trên đơn và sai bộ giấy chứng minh thu nhập.

## Hồ sơ k7 phải đi theo nhánh nào?

| Nội dung | k7 | k8 |
| --- | --- | --- |
| Mục trên Mẫu 01 NĐ 100 | 11.2 | 11.1 |
| Căn cứ thu nhập | Điều 67, ngưỡng tham chiếu Đại tá | Trần 25/35/50 triệu theo NĐ 136 |
| Giấy chứng minh | Mẫu đơn vị BQP/BCA | Mẫu 04 TT 05 |

## Lỗi thực tế hay gặp với hồ sơ lực lượng vũ trang

1. Người tư vấn thấy làm trong cơ quan nhà nước là mặc định xếp vào k8.
2. Dùng Mẫu 04 dân sự cho k7 vì nghĩ “đều là người lao động có lương”.
3. Nhầm Mẫu 06 TT 05 là mẫu cho quân nhân, trong khi Mẫu 06 chỉ dùng cho vay tự xây hoặc sửa nhà qua NHCSXH.

## Cách xác định đúng trong 2 câu hỏi

1. Tại thời điểm nộp hồ sơ, anh/chị đang phục vụ tại ngũ trong quân đội, công an, cơ yếu hay không?
2. Đơn vị hiện tại quản lý theo hệ thống BQP/BCA hay theo cơ quan hành chính, trường học, bệnh viện?

Nếu câu trả lời là đang tại ngũ thuộc hệ thống BQP/BCA thì xử lý theo k7. Nếu đã xuất ngũ và đang làm trong cơ quan dân sự thì thường phải quay về nhánh tương ứng tại thời điểm nộp.

## Hồ sơ k7 — danh mục và quy trình nộp

| Thứ tự | Giấy tờ | Ghi chú |
| --- | --- | --- |
| 1 | Đơn Mẫu 01 NĐ 100 — tick k7, mục 11.2 | Không ghi 11.1 |
| 2 | Giấy xác nhận công tác + thu nhập theo mẫu BQP hoặc BCA | Do đơn vị quản lý ký |
| 3 | Giấy xác nhận nhà ở Mẫu 02/03 (nếu áp dụng) | Theo tỉnh/thành phố nơi có dự án |
| 4 | CCCD, giấy tờ cư trú theo yêu cầu CĐT | Đồng bộ VNeID |

Quy trình:
1. Xác nhận với đơn vị: đang tại ngũ, thuộc biên chế BQP/BCA.
2. Xin giấy đơn vị theo TT 94-BQP hoặc TT 56-BCA — không xin Mẫu 04 dân sự.
3. Điền Mẫu 01: tick k7, mục 11.2, không ghi trần 25/35/50.
4. Đối chiếu thu nhập theo Điều 67 NĐ 100 (tham chiếu mức Đại tá) — do đơn vị xác nhận, không tự quy đổi.
5. Photo bộ hồ sơ theo số bộ CĐT yêu cầu.

## Phân biệt k7 và k8 — quyết định trong 1 phút

| Câu hỏi | k7 | k8 |
| --- | --- | --- |
| Đang phục vụ tại ngũ? | Có | Không (đã chuyển sang cơ quan dân sự) |
| Đơn vị quản lý | Quân đội, CA, cơ yếu | Trường, bệnh viện, UBND, DN nhà nước |
| Mục 11 đơn | 11.2 | 11.1 |
| Trần thu nhập | Điều 67 | 25/35/50 triệu |

Hưu quân nhân, công an đã rời ngũ làm việc tại cơ quan dân sự → thường xét theo k8 và Mẫu 04, không còn k7 tại thời điểm nộp.

## Ba lỗi và hệ quả

| Lỗi | Hệ quả | Sửa |
| --- | --- | --- |
| Dùng Mẫu 04 cho k7 | Trả hồ sơ | Xin giấy BQP/BCA |
| Ghi 11.1 + trần 25 triệu cho k7 | Sai căn cứ xét | Làm lại đơn, mục 11.2 |
| Nhầm Mẫu 06 TT 05 (vay tự xây) | Sai loại hồ sơ hoàn toàn | Bỏ Mẫu 06 — không dùng cho mua căn dự án |

## Checklist k7 trước khi nộp

- [ ] Tick k7 Điều 76, không tick k8
- [ ] Mục 11.2 đã điền, không ghi 11.1
- [ ] Có giấy đơn vị BQP/BCA, không có Mẫu 04 dân sự
- [ ] Nhà ở khớp Mẫu 02/03 tại tỉnh/thành phố nơi có dự án
- [ ] Không nhầm Mẫu 06 TT 05

${journeyClosing("llvt-k7-ho-so-noxh-mau-bqp-bca")}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle: "Hồ sơ NOXH quân nhân công an k7 — mẫu BQP/BCA | HouseX",
    seoDesc:
      "k7 LLVT: mục 11.2, thu nhập Điều 67, mẫu BQP/BCA. Phân biệt k7 và k8, không nhầm Mẫu 06 TT-BXD.",
    tags: [TAG],
    projects: [],
  },
  {
    id: "article-noxh-journey-c2-01",
    slug: "thoi-han-12-thang-giay-xac-nhan-noxh",
    title: "Giấy xác nhận NOXH có hiệu lực bao lâu?",
    excerpt:
      "Giấy chứng minh đối tượng và điều kiện có giá trị 12 tháng kể từ ngày xác nhận (NĐ 54 Điều 38). Mốc xét thu nhập và rủi ro hết hạn giữa chừng.",
    body: `${NOXH_FORM_SCOPE_DISCLAIMER}

## Giấy xác nhận NOXH có hiệu lực bao lâu?

12 tháng kể từ ngày xác nhận. Đây là mốc được NĐ 54 sửa Điều 38 NĐ 100 áp cho giấy tờ chứng minh đối tượng và điều kiện, gồm giấy xác nhận thu nhập, giấy xác nhận nhà ở, và các giấy nền nằm trong bộ hồ sơ xét duyệt.

## Bản chất của mốc 12 tháng là gì?

Đó là cơ chế để dữ liệu hồ sơ còn phản ánh đúng tình trạng hiện tại của người mua. Thu nhập, tình trạng nhà ở, nơi cư trú và tình trạng công tác đều có thể thay đổi theo thời gian. Vì vậy giấy đúng mẫu nhưng quá 12 tháng vẫn có thể mất giá trị xét duyệt.

## Mốc tính thu nhập phải hiểu ra sao?

Từ 07/04/2026, với nhóm k5, k6, k8, thu nhập được xét theo 12 tháng liền kề đến thời điểm cơ quan có thẩm quyền xác nhận. Nói đơn giản: xin giấy ngày nào thì cơ quan sẽ nhìn về 12 tháng trước ngày đó, không phải tự chọn “năm vừa đẹp số”.

## Ba tình huống dễ bị hết hạn nhất

1. Nộp hồ sơ sớm nhưng dự án kéo dài thời gian xét duyệt hoặc bốc thăm.
2. Xin đủ bộ giấy từ quá sớm trong khi đợt mở bán còn chưa chốt.
3. Có hồ sơ vay song song nên thời điểm ký HĐMB và giải ngân bị lùi xa.

## Cách canh thời điểm xin giấy để giảm rủi ro

1. Chốt lịch tiếp nhận hồ sơ thật của dự án rồi mới xin giấy.
2. Ưu tiên xin các giấy có thời gian xử lý nhanh ở giai đoạn gần ngày nộp.
3. Ghi riêng ngày xác nhận của từng giấy để theo dõi, không nhớ bằng cảm tính.
4. Nếu đợt xét duyệt kéo dài, chủ động hỏi CĐT khi nào cần bổ sung lại giấy cũ.

## Cách canh lịch 12 tháng — bảng theo dõi

Tạo bảng tay hoặc file ghi 4 cột:

| Giấy | Ngày xác nhận | Hết hạn ( +12 tháng) | Mốc CĐT cần giấy còn hạn |
| --- | --- | --- | --- |
| Mẫu 04 thu nhập | vd 01/03/2026 | 01/03/2027 | Trước ngày ký HĐ dự kiến |
| Mẫu 02 nhà ở | | | |
| Mẫu 03 nhà ở | | | |

Ví dụ: Xin Mẫu 04 ngày 01/03/2026 → hết hạn 01/03/2027. Nếu dự án công bố ký HĐ tháng 02/2027 mà bạn chưa xin lại giấy → rủi ro bị yêu cầu bổ sung hoặc trả hồ sơ.

## Thu nhập 12 tháng và ngày xin giấy — hai mốc khác nhau

- Mốc 1 (hiệu lực giấy): 12 tháng kể từ ngày ký xác nhận trên giấy.
- Mốc 2 (tính thu nhập): 12 tháng lương liền kề trước ngày xin xác nhận (NĐ 136).

Xin giấy ngày 15/06/2026 → thu nhập xét từ khoảng 15/06/2025 đến 14/06/2026, không phải cả năm 2025 nếu không trùng.

## Khi nào phải xin lại giấy?

| Tình huống | Việc làm |
| --- | --- |
| Còn > 2 tháng trước mốc ký HĐ, giấy sắp hết | Xin lại trước khi hết hạn |
| Đợt xét kéo > 6 tháng | Hỏi CĐT mốc chấp nhận giấy cũ hay bắt buộc mới |
| Thu nhập 12 tháng mới đã thay đổi (tăng lương, thưởng) | Tính lại ÷ 12 — có thể từ đủ thành không đủ trước khi xin lại |

## Lỗi thời hạn và hệ quả

| Lỗi | Hệ quả |
| --- | --- |
| Photo hồ sơ khi giấy còn 11 tháng, ký HĐ tháng thứ 13 | Giấy hết hạn — phải xin lại, chậm tiến độ |
| Xin giấy quá sớm (trước khi có lịch nộp) | Hết hạn giữa chừng đợt xét |
| Chỉ xin lại Mẫu 04 mà quên Mẫu 02 cũng hết hạn | Bộ hồ sơ vẫn không đủ |

${journeyClosing("thoi-han-12-thang-giay-xac-nhan-noxh")}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle: "Giấy xác nhận NOXH hiệu lực 12 tháng — NĐ 54 | HouseX",
    seoDesc:
      "Thời hạn 12 tháng giấy xác nhận NOXH, mốc tính thu nhập NĐ 136 và rủi ro hết hạn giữa chừng.",
    tags: [TAG],
    projects: [],
  },
  {
    id: "article-noxh-journey-c4-01",
    slug: "hau-kiem-noxh-doi-chieu-bhxh-thue-2026",
    title:
      "Hậu kiểm hồ sơ NOXH: Dữ liệu thuế và BHXH được đối chiếu thế nào?",
    excerpt:
      "Sau duyệt hồ sơ, cơ quan có thể đối chiếu giấy xác nhận DN với BHXH và Thuế. Không quét ngay từ đầu — thường qua đợt thanh tra hoặc hậu kiểm chuyên đề.",
    body: `${NOXH_FORM_SCOPE_DISCLAIMER}

## Hậu kiểm NOXH kiểm gì và khi nào?

Hậu kiểm là bước đối chiếu giấy bạn đã nộp với dữ liệu gốc tại Thuế, BHXH, cư trú, đất đai. Không phải mọi hồ sơ đều bị soi sâu ngay khi nộp — thường xảy ra khi công khai danh sách, thanh tra chuyên đề, hoặc có nghi vấn.

Timeline tham chiếu:
1. Nộp hồ sơ → CĐT rà danh mục và hình thức.
2. Công khai danh sách đủ/không đủ → Sở Xây dựng đối chiếu đã hưởng chính sách (10 ngày sau khi CĐT gửi danh sách).
3. Hậu kiểm sâu → đối chiếu BHXH, thuế, GCN, cư trú (thường ở đợt thanh tra hoặc khi có dấu hiệu bất thường).

## Ma trận đối chiếu — tự kiểm trước khi nộp

| Giấy trong hồ sơ | Mở file/data nào | Khớp khi nào | Lệch thì xử lý ngay |
| --- | --- | --- | --- |
| Mẫu 04 (DN ký) | Bảng lương 12 tháng + BHXH tại cùng DN + tờ khai thuế TNCN (nếu có) | Cùng mức lương, cùng đơn vị, cùng khoảng 12 tháng | Xin lại giấy tại đúng DN hoặc sửa dữ liệu BHXH/thuế trước |
| Mẫu 05 (CA xã) | Sao kê, hợp đồng, biên lai thu nhập tự do | Số kê khai khớp nguồn thu thực tế | Bổ sung chứng từ hoặc điều chỉnh kê khai |
| Mẫu 02 (chưa có nhà) | Tra cứu GCN tại tỉnh/thành phố nơi có dự án (bạn + vợ/chồng) | Không có nhà hoặc GCN không ghi thông tin nhà ở | Không khai “chưa có nhà” nếu sổ có nhà |
| Mẫu 03 (nhà chật) | Sổ nhà + danh sách người cư trú | Diện tích sàn ÷ số người < 15 m² | Bổ sung giấy cư trú chứng minh số người ở |
| CT07 / cư trú | VNeID hoặc xác nhận cư trú | Địa chỉ, hôn nhân, nhân khẩu khớp đơn Mẫu 01 | Sửa cư trú tại Công an trước khi nộp |

## Quy trình tự hậu kiểm 15 phút (làm tại nhà)

1. In hoặc mở PDF toàn bộ hồ sơ đã chuẩn bị.
2. Với Mẫu 04: mở app BHXH hoặc phiếu lương — gạch từng tháng so với số trên giấy.
3. Với nhà ở: tra GCN tại tỉnh/thành phố nơi có dự án cho cả hai vợ chồng — ghi rõ có/không có nhà.
4. Với cư trú: so địa chỉ trên đơn, CT07, VNeID — một dòng sai cũng cần sửa.
5. Chụp lại bằng chứng đối chiếu (ảnh màn hình BHXH, GCN) và lưu cùng hồ sơ — phòng tranh chấp sau này.

## Case Đồng Nai 2026 — bài học cụ thể (không suy diễn hình sự)

Kết luận thanh tra 09/KL-TT (19/6/2026), báo chí tóm tắt 09/07/2026: tại một dự án có hơn 76 trường hợp giấy xác nhận thu nhập do DN ký nhưng người mua không có BHXH tại DN đó. Đây là lỗi có thể tự phát hiện trước khi nộp bằng bước so BHXH ở trên.

Các phát hiện khác trong case: không bốc thăm khi vượt quỹ căn; thu cọc vượt 5% giá bán. Người mua nên hỏi bằng văn bản: nếu hồ sơ vượt số căn thì quy trình chọn là gì; mức cọc tối đa là bao nhiêu phần trăm.

## Nếu phát hiện lệch — xử lý theo mức độ

| Mức độ | Dấu hiệu | Việc làm ngay |
| --- | --- | --- |
| Nhẹ | Sai địa chỉ, thiếu trang photo, giấy sắp hết 12 tháng | Sửa và photo lại trước ngày nộp |
| Trung bình | Lương trên giấy khác bảng lương/BHXH | Xin lại Mẫu 04 tại đơn vị đúng |
| Nặng | Khai chưa có nhà nhưng GCN có nhà; nhờ DN ký khi không làm việc tại đó | Không nộp hồ sơ cho đến khi dữ liệu thật khớp — nộp tiếp = rủi ro bị loại hoặc hậu kiểm |

## Hệ quả nếu bỏ qua tự hậu kiểm

- Trước ký HĐ: trả hồ sơ, mất lượt đợt mở bán.
- Sau khi vào danh sách: bị loại khi đối chiếu, có thể mất cọc tùy hợp đồng.
- Sau ký HĐ: rủi ro hủy kết quả xét duyệt theo cam kết trung thực trong hồ sơ.

${journeyClosing("hau-kiem-noxh-doi-chieu-bhxh-thue-2026")}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle: "Hậu kiểm hồ sơ NOXH — đối chiếu thuế BHXH | HouseX",
    seoDesc:
      "Cơ chế hậu kiểm NOXH: đối chiếu giấy xác nhận thu nhập với BHXH, Thuế và CSDL cư trú.",
    tags: [TAG],
    projects: [],
  },
  {
    id: "article-noxh-journey-c4-02",
    slug: "bai-hoc-thanh-tra-noxh-dong-nai-2026",
    title:
      "Bài học từ thanh tra NOXH Đồng Nai 2026: Checklist an toàn cho người mua",
    excerpt:
      "Kết luận thanh tra 09/KL-TT (19/6/2026): lệch giấy xác nhận thu nhập với BHXH/thuế, thiếu bốc thăm, cọc vượt 5%. Góc nhìn phòng rủi ro — không kết luận hình sự cá nhân.",
    body: `${NOXH_FORM_SCOPE_DISCLAIMER}

## Case Đồng Nai 2026 cho người mua thấy điều gì?

Điểm cốt lõi không phải “một địa phương có sai phạm”, mà là cách hồ sơ NOXH có thể bị soi ngược từ giấy xác nhận ra dữ liệu gốc. Theo [Báo Thanh tra ngày 09/07/2026](https://thanhtra.com.vn/ket-luan-thanh-tra-E17BD7A25/thanh-tra-tp-dong-nai-phat-hien-nhieu-bat-thuong-ho-so-mua-nha-o-xa-hoi-818acf2ed.html), Thanh tra TP Đồng Nai ban hành Kết luận số 09/KL-TT ngày 19/6/2026 đối với chương trình NOXH trên địa bàn.

## Báo chí công khai những phát hiện nào?

| Nhóm vấn đề | Dữ kiện được nêu |
| --- | --- |
| Giấy xác nhận thu nhập | Có trường hợp đơn vị ký xác nhận nhưng dữ liệu BHXH không khớp; tại một dự án báo chí nêu hơn 76 trường hợp liên quan |
| Quy trình xét chọn | Hồ sơ vượt số căn nhưng không tổ chức bốc thăm theo quy định |
| Tiền cọc | Có dự án bị nêu thu cọc vượt 5% giá bán |
| Trình tự gửi danh sách | Có việc gửi danh sách nhiều lần, không đúng quy trình |

Phạm vi kiểm tra theo bài báo gồm ba dự án: Long Thành Riverside, KDC Thái Thành - Thuận Lợi, Chương Dương Homeland Long Hưng.

## Người mua nên rút bài học gì ngay từ bộ hồ sơ của mình?

1. Chỉ xin xác nhận thu nhập ở nơi bạn thực sự có quan hệ lao động hoặc công tác.
2. Trước khi cọc, hỏi rõ nếu số hồ sơ vượt số căn thì dự án xử lý bằng bốc thăm hay cách nào khác.
3. Kiểm tra điều khoản cọc và tiến độ thu tiền trước HĐMB.
4. Giữ lại bản chụp toàn bộ hồ sơ đã nộp và mọi biên nhận làm việc.

## Bản chất rủi ro của ba lỗi lớn trong case này

| Lỗi | Bản chất | Hệ quả với người mua |
| --- | --- | --- |
| Giấy thu nhập lệch BHXH/thuế | Dữ liệu giấy không khớp dữ liệu nguồn | Bị rà soát lại điều kiện, có thể mất quyền mua |
| Không bốc thăm khi vượt quỹ căn | Sai trình tự xét chọn | Kết quả xét duyệt có thể bị xem xét lại |
| Thu cọc vượt khung | Sai cơ chế huy động tiền trước HĐ | Người mua chịu rủi ro tài chính nếu dự án bị thanh tra |

## Cách tự bảo vệ mình trước khi nộp hồ sơ

1. So lại giấy thu nhập với dữ liệu đóng BHXH, bảng lương, sao kê.
2. Đọc kỹ thông báo mở bán để biết quy trình xét chọn và lịch công khai danh sách.
3. Không chuyển cọc chỉ dựa trên tư vấn miệng.
4. Nếu thông tin dự án thay đổi liên tục, yêu cầu văn bản hoặc thông báo chính thức.

## Checklist 12 điểm trước khi cọc hoặc nộp hồ sơ (rút từ case Đồng Nai)

- [ ] Mẫu 04 chỉ do DN bạn đang đóng BHXH ký — đã mở app BHXH đối chiếu
- [ ] Bảng lương 12 tháng khớp số trên giấy xác nhận
- [ ] GCN tại tỉnh/thành phố nơi có dự án đã tra cho cả vợ chồng
- [ ] Đơn Mẫu 01 khớp toàn bộ giấy kèm
- [ ] Đã hỏi bằng văn bản: nếu hồ sơ > số căn thì có bốc thăm không
- [ ] Đã đọc điều khoản cọc — không vượt 5% trước HĐMB (tham chiếu thông báo dự án)
- [ ] Có biên nhận nộp hồ sơ hoặc email xác nhận
- [ ] Giấy xác nhận còn trong 12 tháng tại mốc ký HĐ dự kiến
- [ ] Không nhờ DN “ký giúp” khi không làm việc tại đó
- [ ] Đã chụp lưu toàn bộ bộ hồ sơ đã nộp
- [ ] Đã hỏi CĐT số bộ hồ sơ và danh mục chính xác (thường 4 bộ; vay thì +1 bộ ngân hàng)
- [ ] Không chuyển cọc chỉ qua tin nhắn cá nhân không có căn cứ dự án

## Mẫu câu hỏi CĐT trước khi cọc

“Dự án [tên] đợt này có [X] căn, hiện tiếp nhận [Y] hồ sơ. Nếu Y > X, quy trình chọn căn là bốc thăm hay xét theo thứ tự? Mức cọc tối đa trước HĐMB là bao nhiêu % giá bán? Vui lòng trả lời qua thông báo hoặc email để em lưu căn cứ.”

## Ba rủi ro từ case và cách tự phòng

| Phát hiện thanh tra (báo chí) | Bạn tự kiểm bằng gì | Nếu không đạt |
| --- | --- | --- |
| Giấy thu nhập lệch BHXH | App BHXH — cùng DN với giấy Mẫu 04 | Không nộp / xin lại giấy đúng DN |
| Không bốc thăm khi vượt quỹ căn | Hỏi văn bản quy trình chọn | Không cọc nếu không rõ |
| Cọc > 5% | Đọc thông báo + HĐ mẫu | Không chuyển tiền vượt khung |

## Giới hạn khi đọc case này

Nội dung tổng hợp từ báo chí công khai (KL 09/KL-TT, 19/6/2026). Không kết luận hình sự cá nhân; không khẳng định mọi dự án Đồng Nai có cùng lỗi. Dùng checklist để rà hồ sơ của bạn, không dùng để kết tội bên thứ ba.

${journeyClosing("bai-hoc-thanh-tra-noxh-dong-nai-2026")}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "Thanh tra NOXH Đồng Nai 2026 — bài học cho người mua | HouseX",
    seoDesc:
      "Tóm tắt KL 09/KL-TT: lệch BHXH/thuế, bốc thăm, cọc. Checklist phòng rủi ro hồ sơ NOXH.",
    tags: [TAG],
    projects: [],
  },
  {
    id: "article-noxh-journey-c5-01",
    slug: "room-tin-dung-noxh-va-30-von-tu-co",
    title:
      "Mua NOXH cần chuẩn bị bao nhiêu vốn tự có? Room tín dụng là gì?",
    excerpt:
      "Thực tế ~30% vốn tự có trước giải ngân; tỷ lệ vay thường ~70% không phải 80%. Room giải ngân dự án có thể chặn khế ước dù hồ sơ vay đã duyệt.",
    body: `${NOXH_FORM_SCOPE_DISCLAIMER}

## Mua NOXH cần chuẩn bị bao nhiêu vốn tự có?

Thực tế thị trường thường phải chuẩn bị khoảng 20% đến 30% giá trị căn trước khi dòng tiền vay vào nhịp ổn định. Mức 80% là khung vay tối đa trong chính sách, không phải tỷ lệ bạn mặc nhiên được giải ngân ngay ở mọi dự án.

## Dòng tiền thực tế thường đi theo ba chặng

| Chặng | Tỷ lệ hay gặp | Bản chất |
| --- | --- | --- |
| Đặt cọc | Khoảng 5% đến 10% | Tiền giữ chỗ hoặc cọc trước bước ký HĐ |
| Ký HĐMB hoặc xác lập giao dịch | Lũy kế khoảng 20% đến 30% | Phần vốn tự có người mua phải xoay được |
| Giải ngân vay | Phần còn lại theo tiến độ | Phụ thuộc hồ sơ vay và room dự án |

Con số cụ thể phải lấy từ thông báo mở bán, tiến độ thanh toán và phương án vay của dự án bạn tham gia.

## Room tín dụng là gì?

Room tín dụng là hạn mức cho vay ngân hàng bố trí cho dự án hoặc chương trình giải ngân tại thời điểm đó. Có room thì hồ sơ đủ điều kiện mới ra được khế ước và giải ngân đúng tiến độ. Hết room thì hồ sơ cá nhân dù đẹp vẫn có thể bị treo.

## Lỗi thực tế người mua hay mắc

1. Nghĩ được duyệt vay là chắc chắn giải ngân đúng ngày.
2. Dồn toàn bộ tiền mặt vào cọc rồi mới bắt đầu hỏi ngân hàng.
3. Không hỏi dự án đang liên kết ngân hàng nào và ngân hàng đó còn room hay không.

## Cách chuẩn bị dòng tiền ít rủi ro nhất

1. Tính trước mức vốn tự có tối thiểu phải cầm: cọc + phần phải đóng đến lúc ngân hàng giải ngân.
2. Kiểm tra hồ sơ vay song song với hồ sơ mua, không chờ đến lúc ký HĐ mới đi hỏi ngân hàng.
3. Hỏi thẳng ngân hàng liên kết về tiến độ thẩm định và room dự án ở thời điểm hiện tại.
4. Chừa quỹ dự phòng vài tuần đến vài tháng nếu giải ngân trễ hơn dự kiến.

## Làm sai sẽ bị gì?

- Không đủ tiền ở mốc ký HĐ: mất cơ hội nhận căn hoặc vi phạm tiến độ thanh toán.
- Phụ thuộc hoàn toàn vào room: hồ sơ bị treo dù cá nhân vẫn đủ khả năng vay.
- Cọc sớm nhưng vay chậm: bị căng dòng tiền, phải vay nóng ngoài hệ thống.

## Ví dụ tính vốn tự có nhanh

Căn giá 700 triệu, tiến độ thường gặp:
- Cọc 10% = 70 triệu (tự có ngay).
- Ký HĐMB thêm 20% = 140 triệu → lũy kế 210 triệu (~30%) trước khi trông chờ giải ngân.
- Phần còn ~490 triệu (70%) qua vay — chỉ giải ngân khi hồ sơ vay đạt và còn room dự án.

## Hai lớp tiền: điều kiện mua vs khả năng trả góp

- Lớp 1 — Đủ mua NOXH: trần thu nhập 25/35/50 (hoặc hệ số tỉnh) — xét trên hồ sơ Mẫu 04/05.
- Lớp 2 — Đủ trả hàng tháng: ngân hàng xét DTI — tổng trả nợ (nợ cũ + nợ nhà mới) ÷ thu nhập thường không vượt ~40–50% tùy ngân hàng.

Ví dụ: Thu nhập 24 triệu/tháng, đủ trần mua (độc thân). Nợ xe 7 triệu/tháng. Vay nhà thêm ~9 triệu/tháng → tổng 16 triệu ≈ 67% thu nhập → ngân hàng có thể từ chối dù hồ sơ NOXH đạt điều kiện mua.

## Bảng dòng tiền mẫu (căn 700 triệu)

| Mốc thời gian | Việc phải có tiền | Số tiền tích lũy (tham chiếu) | Nguồn |
| --- | --- | --- | --- |
| Đặt cọc | 10% | 70 triệu | Tự có |
| Ký HĐMB (~2 tuần sau duyệt) | thêm 20% | 210 triệu | Tự có |
| Giải ngân vay | ~70% còn lại | 490 triệu | NH — nếu còn room |

Tự có tối thiểu cần cầm: 210 triệu (30%), không chỉ 70 triệu cọc.

## Hỏi ngân hàng liên kết — 5 câu trước khi cọc

1. Dự án này còn room giải ngân không?
2. Thời gian thẩm định hồ sơ vay trung bình bao lâu?
3. Tỷ lệ vay tối đa thực tế cho dự án này (70% hay 80%)?
4. Điều kiện DTI / thu nhập tối thiểu để duyệt?
5. Nếu room hết giữa chừng, có phương án chờ hay chuyển NH khác không?

## Room hết — xử lý thực tế

| Tình huống | Việc làm |
| --- | --- |
| Hồ sơ vay đạt nhưng chưa giải ngân, room hết | Hỏi NH thời gian mở room tiếp; chuẩn bị trả thêm bằng tự có tạm thời |
| Sắp ký HĐ mà chưa có pre-approve vay | Hoãn ký đến khi có xác nhận NH hoặc tăng tỷ lệ tự có |
| Chỉ có đủ tiền cọc | Không cọc nếu chưa tính được 30% tích lũy |

## Lỗi dòng tiền và hệ quả

| Lỗi | Hệ quả |
| --- | --- |
| Cọc hết tiền, chưa hỏi NH | Không đủ 210 triệu lúc ký HĐ → vi phạm HĐ |
| Tin “chắc chắn vay được” từ môi giới | Room hết → treo giải ngân |
| Không chừa quỹ 2–3 tháng trả nợ khi chờ giải ngân | Phải vay nóng, chi phí cao |

${journeyClosing("room-tin-dung-noxh-va-30-von-tu-co")}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle: "Vốn tự có mua NOXH 30% và room tín dụng | HouseX",
    seoDesc:
      "Chuẩn bị vốn tự có mua NOXH, tỷ lệ vay ~70% thực tế và rủi ro room giải ngân dự án.",
    tags: [TAG],
    projects: [],
  },
  {
    id: "article-noxh-journey-c6-01",
    slug: "bi-loai-ho-so-noxh-lam-gi-tiep-theo",
    title: "Bị loại hoặc không được ký HĐ NOXH — làm gì tiếp theo?",
    excerpt:
      "Chưa có quy trình giải trình NOXH tập trung. Kênh: yêu cầu lý do bằng văn bản, bổ sung hồ sơ, sửa dữ liệu tại nguồn, khiếu nại nếu có QĐ hành chính.",
    body: `${NOXH_FORM_SCOPE_DISCLAIMER}

## Bị loại hồ sơ NOXH — làm gì trong 48 giờ đầu?

Bước 1: Xin lý do bằng văn bản hoặc email có đầu mối CĐT — không chỉ nghe miệng.

Mẫu yêu cầu (chỉnh tên dự án/CĐT):
“Tôi là [họ tên], CCCD [số], đã nộp hồ sơ đăng ký mua NOXH dự án [tên dự án] ngày [ngày]. Đề nghị quý CĐT thông báo bằng văn bản lý do hồ sơ chưa đủ điều kiện, mục nào chưa đạt, và hướng dẫn bổ sung (nếu được phép).”

Bước 2: Phân loại lý do vào một trong ba nhóm dưới đây — mỗi nhóm có cách xử lý khác nhau, không dùng chung một hướng.

## Ba nhóm lý do và cách xử lý cụ thể

| Nhóm | Ví dụ lý do | Việc làm trong 7 ngày | Có nộp lại được không |
| --- | --- | --- | --- |
| Lỗi kỹ thuật | Thiếu trang đơn, sai mẫu, giấy hết 12 tháng, photo mờ | Bổ sung đúng giấy theo hướng dẫn CĐT | Có, nếu còn đợt tiếp nhận |
| Không đủ điều kiện thật | Vượt trần thu nhập, có nhà tại tỉnh/thành phố nơi có dự án, sai đối tượng Đ.76 | Không photo lại cùng dữ liệu — phải thay đổi tình trạng thật hoặc dừng | Không, cho đến khi đủ điều kiện |
| Nghi vấn gian dối | Giấy DN không khớp BHXH, khai sai nhà ở cố ý | Sửa dữ liệu nguồn, làm lại toàn bộ giấy trung thực | Chỉ khi CĐT cho phép và dữ liệu đã khớp |

## Luồng hành chính sau khi bị loại (NĐ 54 Điều 38)

- CĐT công khai danh sách đủ và không đủ điều kiện.
- Hồ sơ không đủ được trả trong 15 ngày kể từ ngày công khai.
- Sở Xây dựng đối chiếu việc đã/chưa hưởng hỗ trợ nhà ở (trả lời trong 10 ngày sau khi CĐT gửi danh sách).

Nếu chỉ nghe “bị loại” mà không có văn bản, yêu cầu lại — đây là quyền cần thiết để biết sửa đúng chỗ.

## Sửa dữ liệu nguồn trước khi làm giấy mới

| Dữ liệu lệch | Nơi sửa | Giấy cần làm lại sau khi sửa |
| --- | --- | --- |
| Cư trú, hôn nhân trên VNeID | Công an cấp xã / cổng dịch vụ công | CT07, có thể ảnh hưởng Mẫu 05 |
| GCN, thông tin nhà ở | VPĐK đất đai | Mẫu 02 hoặc 03 |
| Thuế TNCN, quyết toán | Chi cục Thuế | Mẫu 04 |
| BHXH sai đơn vị | BHXH VN / đơn vị sử dụng lao động | Mẫu 04 |
| CIC sai | 1800585891 | Hồ sơ vay (nếu có) |

Không có cổng “giải trình NOXH tập trung” cho lệch dữ liệu thuế — phải sửa tại cơ quan nguồn.

## Khi nào bổ sung, khi nào khiếu nại?

Bổ sung giấy khi: thiếu giấy, sai biểu mẫu, hết hạn 12 tháng, photo không đạt — và CĐT xác nhận còn nhận bổ sung.

Khiếu nại (Luật Khiếu nại 2011, thường 90 ngày kể từ khi biết quyết định) khi: có quyết định hành chính bất lợi ảnh hưởng trực tiếp quyền lợi — không phải khi chỉ bị “trả hồ sơ” không kèm quyết định.

Tố cáo (Luật Tố cáo 2018) khi: nghi cán bộ hoặc CĐT vi phạm trong xét duyệt — cần bằng chứng cụ thể, không chỉ bất mãn kết quả.

## Bốn kịch bản thường gặp — xử lý từng bước

Kịch bản A — “Thu nhập vượt trần”:
1. Tự tính lại 12 tháng: tổng ÷ 12 so với 25/35/50.
2. Nếu đúng vượt trần → không nộp lại cùng dữ liệu.
3. Nếu tính sai do kế toán cộng nhầm → xin lại Mẫu 04 đúng số, nộp lại nếu còn đợt.

Kịch bản B — “Không đủ điều kiện nhà ở”:
1. Tra GCN tại tỉnh/thành phố nơi có dự án cả vợ chồng.
2. Nếu có nhà → không khai “chưa có nhà”; chuyển sang trường hợp Mẫu 03 nếu đủ điều kiện nhà diện tích thấp.
3. Làm lại Mẫu 02/03 và phần nhà ở trên đơn Mẫu 01.

Kịch bản C — “Giấy hết hiệu lực”:
1. Kiểm tra ngày xác nhận trên từng giấy.
2. Xin lại giấy còn hạn trước mốc CĐT yêu cầu.
3. Nếu thu nhập 12 tháng mới đã thay đổi → tính lại trước khi xin ký.

Kịch bản D — “Không rõ lý do”:
1. Gửi văn bản yêu cầu theo mẫu ở đầu bài.
2. Lưu biên nhận, email, tin nhắn có timestamp.
3. Nếu quá 15 ngày không trả lời sau công khai danh sách → ghi nhận để khiếu nại nếu có quyết định hành chính.

## Hệ quả nếu xử lý sai hướng

- Bổ sung sai giấy (vẫn lệch BHXH): bị loại lại ở hậu kiểm.
- Khiếu nại khi chỉ thiếu một tờ photo: mất thời gian, trễ đợt tiếp nhận.
- Nộp lại khi vượt trần thật: lãng phí phí hồ sơ và cơ hội đợt khác.

${journeyClosing("bi-loai-ho-so-noxh-lam-gi-tiep-theo")}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle: "Bị loại hồ sơ NOXH — làm gì tiếp? | HouseX",
    seoDesc:
      "Bị trả hồ sơ NOXH: bổ sung giấy tờ, sửa dữ liệu thuế BHXH, khiếu nại khi có QĐ hành chính.",
    tags: [TAG],
    projects: [],
  },
];

/** Hub markdown — chèn vào trang chủ đề chinh-sach-ho-so-noxh hoặc pillar */
export function noxhHandbookJourneyHubSection(): string {
  const rows = JOURNEY_READ_ORDER.map(
    (slug, i) =>
      `${i + 1}. [${NOXH_HANDBOOK_JOURNEY_ARTICLES_2026.find((a) => a.slug === slug)?.title ?? slug}](${articlePath(slug)})`,
  );
  return `## Lộ trình hồ sơ NOXH (đọc theo thứ tự gợi ý)

Từ điều kiện nhà ở → đơn & mẫu TT-BXD → hậu kiểm → khi có sự cố.

${rows.join("\n")}

[Công cụ tự kiểm tra điều kiện](/cong-cu/dieu-kien-noxh)`;
}

export const NOXH_HANDBOOK_JOURNEY_SLUGS = new Set(
  NOXH_HANDBOOK_JOURNEY_ARTICLES_2026.map((a) => a.slug),
);
