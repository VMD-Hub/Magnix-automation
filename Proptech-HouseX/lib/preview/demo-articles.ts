import type { ArticleCardData, ArticleDetail, ArticleTagSummary } from "@/lib/data/article-types";
import { applyEditorialMedia, EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { NOXH_SUPPORT_CLOSING } from "@/lib/content/articles/article-editorial-voice";
import { NOXH_TREND_ARTICLES_2026 } from "@/lib/content/articles/noxh-trend-series-2026";
import { TOD_NHON_TRACH_ARTICLES_2026 } from "@/lib/content/articles/tod-nhon-trach-series-2026";
import { LTK_PROJECT_SLUG } from "@/lib/preview/phu-tho-dmc-mock";
import { CS_PROJECT_SLUG } from "@/lib/preview/kdc-chang-song-mock";

const NOW = new Date("2026-06-29T00:00:00.000Z");

export const DEMO_ARTICLE_TAGS: ArticleTagSummary[] = [
  {
    slug: "noxh",
    name: "Nhà ở xã hội",
    description: "Chính sách, quy trình và cập nhật dự án NOXH.",
    articleCount: 3,
  },
  {
    slug: "phap-ly",
    name: "Pháp lý & chính sách",
    description: "Luật Nhà ở, điều kiện đối tượng và hồ sơ mua NOXH.",
    articleCount: 2,
  },
  {
    slug: "tien-do-du-an",
    name: "Tiến độ dự án",
    description: "Cập nhật giá bán, khởi công, bàn giao và mở hồ sơ.",
    articleCount: 2,
  },
  {
    slug: "dau-tu",
    name: "Kiến thức đầu tư",
    description: "Phân tích NOXH vs thương mại, dòng tiền và an cư.",
    articleCount: 1,
  },
  {
    slug: "goc-chuyen-gia",
    name: "Góc chuyên gia",
    description: "Nhận định thị trường và xu hướng nhà ở.",
    articleCount: 1,
  },
  {
    slug: "nha-o-xa-hoi-ly-thuong-kiet",
    name: "NOXH Lý Thường Kiệt",
    description: "Phú Thọ DMC — giá, tiến độ và hồ sơ đăng ký.",
    articleCount: 0,
  },
  {
    slug: "dta-happy-home-nhon-trach",
    name: "DTA Happy Home",
    description: "NOXH Nhơn Trạch — giá căn, vay và Block A10.",
    articleCount: 0,
  },
  {
    slug: "ha-tang-giao-thong",
    name: "Hạ tầng & giao thông",
    description: "Metro, đường sắt, cao tốc và kết nối vùng ven.",
    articleCount: 0,
  },
  {
    slug: "do-thi-ve-tinh-tod",
    name: "Đô thị vệ tinh & TOD",
    description: "Phát triển đô thị định hướng giao thông công cộng.",
    articleCount: 0,
  },
];

const DEMO_ARTICLES_RAW: ArticleDetail[] = [
  {
    id: "demo-article-ltk-gia",
    slug: "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026",
    title: "Giá nhà ở xã hội Lý Thường Kiệt công bố chính thức cuối 6/2026",
    excerpt:
      "Sở Xây dựng TP.HCM và CĐT công bố mức 23,25 triệu/m² — căn tham chiếu từ ~800 triệu đến ~1,8 tỷ tùy diện tích.",
    body: `## Giá NOXH Lý Thường Kiệt được công bố chính thức

Cuối tháng 6/2026, Sở Xây dựng TP.HCM và Công ty Cổ phần Đức Mạnh công bố phương án giá bán cho dự án Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) tại 324 Lý Thường Kiệt, Quận 10 — chi tiết trên [VnExpress](https://vnexpress.net/hai-du-an-nha-xa-hoi-noi-thanh-tp-hcm-co-gia-tu-23-trieu-va-35-trieu-mot-m2-5090748.html).

${EDITORIAL_FIGURES.ltkPhoiCanh}

Mức giá chính thức: 23.251.398 đồng/m² (đã VAT), chưa gồm 2% phí bảo trì và hệ số điều chỉnh theo vị trí căn. Với diện tích 34,5–77 m², giá căn tham chiếu khoảng 800 triệu – 1,8 tỷ.

## Quy mô bán và áp lực hồ sơ

Dự án mở bán 755 căn NOXH; hơn 12.000 hồ sơ đăng ký từ các đợt rà soát trước. Công trình đang hoàn thiện cuối, dự kiến bàn giao khoảng tháng 8/2026.

Tra cứu mặt bằng và gallery trên trang dự án [/du-an/nha-o-xa-hoi-ly-thuong-kiet](/du-an/nha-o-xa-hoi-ly-thuong-kiet). Cùng chủ đề: [công bố giá hai dự án NOXH nội thành](/tin-tuc/tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc) và [so sánh với phương án vùng ven](/tin-tuc/so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026).

*HouseX tổng hợp từ VnExpress và thông tin CĐT — không phải công bố chính thức của cơ quan nhà nước.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-06-28T00:00:00.000Z"),
    updatedAt: NOW,
    coverImageUrl:
      "https://odt.vn/storage/03-2026/phu-tho-dmc-phoi-canh-1.jpg",
    authorName: "HouseX Biên tập",
    seoTitle: "Giá NOXH Lý Thường Kiệt 6/2026 — ~23,25 triệu/m²",
    seoDesc:
      "Công bố giá Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC): 23,25 tr/m², 755 căn bán, bàn giao 08/2026.",
    tags: [
      { slug: "noxh", name: "Nhà ở xã hội" },
      { slug: "tien-do-du-an", name: "Tiến độ dự án" },
      { slug: "nha-o-xa-hoi-ly-thuong-kiet", name: "NOXH Lý Thường Kiệt" },
    ],
    projects: [
      { slug: LTK_PROJECT_SLUG, name: "Nhà ở xã hội Lý Thường Kiệt" },
    ],
  },
  {
    id: "demo-article-cs-tiendo",
    slug: "tien-do-noxh-kdc-chang-song-phuoc-tan-2026",
    title: "Tiến độ NOXH KDC Chàng Sông Phước Tân — hạ tầng và móng",
    excerpt:
      "CĐT Hùng Cường đang san lấp, hoàn thiện HTKT nội khu; phối hợp địa phương rà soát đối tượng trước đợt đóng tiền 1.",
    body: `## Tiến độ NOXH KDC Chàng Sông đang ở giai đoạn hạ tầng

Dự án Nhà ở xã hội thuộc KDC Chàng Sông tại phường Phước Tân, TP. Biên Hòa do Công ty Cổ phần Hợp tác Quốc tế Hùng Cường phát triển đang ở giai đoạn đầu.

Theo cập nhật tháng 6/2026: công tác san lấp, hoàn thiện hạ tầng kỹ thuật nội khu và xây dựng phần móng đang được triển khai. Chủ đầu tư phối hợp với địa phương lập danh sách rà soát đối tượng ưu tiên trước khi công bố đóng tiền đợt 1.

## Pháp lý và lộ trình công bố giá

Dự án đã có quyết định phê duyệt báo cáo ĐTM và phê duyệt thiết kế kỹ thuật thi công. Giá bán và quy mô căn cụ thể sẽ được công bố khi mở đăng ký chính thức.

Khu vực Phước Tân thuộc vùng công nghiệp phía Nam Biên Hòa — phù hợp công nhân và người lao động an cư gần nơi làm việc.

*HouseX tổng hợp từ thông tin công bố CĐT và báo chí địa phương — giá và tiến độ có thể thay đổi.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-06-25T00:00:00.000Z"),
    updatedAt: NOW,
    coverImageUrl:
      "https://khome.asia/wp-content/uploads/2025/12/nxh2-1.webp",
    authorName: "HouseX Biên tập",
    seoTitle: "Tiến độ NOXH KDC Chàng Sông Phước Tân 2026",
    seoDesc:
      "Cập nhật NOXH KDC Chàng Sông: san lấp, hạ tầng, móng. CĐT Hùng Cường — chưa công bố giá.",
    tags: [
      { slug: "noxh", name: "Nhà ở xã hội" },
      { slug: "tien-do-du-an", name: "Tiến độ dự án" },
    ],
    projects: [
      { slug: CS_PROJECT_SLUG, name: "Nhà ở xã hội KDC Chàng Sông" },
    ],
  },
  {
    id: "demo-article-noxh-dk",
    slug: "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
    title:
      "Ai được mua nhà ở xã hội 2026? — Hướng dẫn rà soát đối tượng, thu nhập và hồ sơ",
    excerpt:
      "Ba trụ cột pháp lý (Điều 76–77 + Điều 30 NĐ 100/2024), mức trần thu nhập 25/35/50 triệu theo NĐ 136/2026, checklist hồ sơ và lỗi thường bị loại — kèm link văn bản Chính phủ.",
    body: `## Làm sao biết mình đủ điều kiện mua NOXH trước khi nộp hồ sơ?

Nhiều người chỉ đọc tin “mở bán NOXH” rồi nộp hồ sơ — đến bước rà soát mới biết bị loại vì thu nhập vượt trần, còn sổ nhà ở tên khác, hoặc không thuộc nhóm đối tượng. Để tránh mất thời gian và cơ hội đợt mở bán, cần tự kiểm tra theo ba trụ cột pháp lý song song (thiếu một trụ là không đủ):

1. Đối tượng — thuộc một trong các nhóm tại Điều 76 [Luật Nhà ở 27/2023/QH15](https://vanban.chinhphu.vn/?docid=209627&pageid=27160).
2. Nhà ở — đáp ứng Điều 77 cùng Luật (chưa mua NOXH, không sở hữu nhà ở vi phạm hoặc diện tích bình quân dưới mức tối thiểu).
3. Thu nhập — **chỉ** công nhân KCN, CBCCVC, người thu nhập thấp (k5, k6, k8 Đ.76) phải không vượt trần Điều 30; người có công, hộ nghèo, LLVT, hộ giải tỏa có cơ chế riêng hoặc được miễn trần.

${EDITORIAL_FIGURES.noxhEligibility}

Đáp ứng đủ ba trụ cột là điều kiện cần để hồ sơ được xét — trúng suất còn phụ thuộc thu nhập của toàn bộ người đăng ký cùng đợt và quy mô quỹ căn mở bán. Phần dưới giúp bạn tự rà soát trước khi nộp, bám sát văn bản gốc trên Cổng Thông tin Chính phủ.

## Văn bản gốc cần đối chiếu (Cổng Thông tin điện tử Chính phủ)

| Văn bản | Nội dung liên quan | Link |
| --- | --- | --- |
| Luật 27/2023/QH15 | Điều 76 (đối tượng), Điều 77 (nhà ở), Điều 78 (thuê mua) | [vanban.chinhphu.vn](https://vanban.chinhphu.vn/?docid=209627&pageid=27160) |
| NĐ 100/2024/NĐ-CP | Điều 30 thu nhập, thủ tục xác nhận, mẫu đơn | [vanban.chinhphu.vn](https://vanban.chinhphu.vn/?docid=210760&pageid=27160) |
| NĐ 261/2025/NĐ-CP | Sửa mức thu nhập (20/30/40 triệu, 10/10/2025–06/04/2026) | [vanban.chinhphu.vn](https://vanban.chinhphu.vn/?docid=215594&pageid=27160) |
| NĐ 136/2026/NĐ-CP | Nâng trần thu nhập lên 25/35/50 triệu, hiệu lực 07/04/2026 | [vanban.chinhphu.vn](https://vanban.chinhphu.vn/?classid=1&docid=217605&pageid=27160) |

Tóm tắt chính sách mới: [Chính phủ nâng mức trần thu nhập NOXH từ 7/4/2026](https://xaydungchinhsach.chinhphu.vn/tu-7-4-2026-nang-muc-tran-thu-nhap-duoc-mua-nha-o-xa-hoi-119260409081729263.htm) · [Bộ Xây dựng](https://moc.gov.vn/vn/tin-tuc/1196/93280/chinh-phu-quy-dinh-nang-muc-tran-thu-nhap-moi-voi-ca-nhan-mua-nha-o-xa-hoi.aspx).

## Bạn thuộc nhóm đối tượng nào? (Điều 76)

Điều 76 Luật Nhà ở 2023 liệt kê 12 nhóm. Trong thực tế đăng ký mua căn NOXH thương mại, bốn nhóm hay gặp nhất:

Công nhân, lao động tại KCN (**khoản 6**) — phù hợp dự án vùng ven như [DTA Happy Home Nhơn Trạch](/du-an/dta-happy-home-nhon-trach). Cần xác nhận đang làm việc tại KCN trên địa bàn (hợp đồng lao động, bảng lương).

Cán bộ, công chức, viên chức (**khoản 8**) — áp dụng mức trần thu nhập Điều 30; thu nhập xác nhận qua cơ quan, đơn vị công tác.

Người thu nhập thấp tại đô thị (**khoản 5**) — thường cạnh tranh cao tại NOXH nội thành như [Lý Thường Kiệt](/du-an/nha-o-xa-hoi-ly-thuong-kiet) (>12.000 hồ sơ / 755 suất).

Hộ nghèo, cận nghèo (**khoản 2, 3, 4**) — không dùng bảng 25/35/50 triệu mà phải thuộc hộ nghèo, cận nghèo theo chuẩn Chính phủ (xác nhận qua UBND).

Các nhóm **miễn trần thu nhập Điều 30 k1** (khoản 1, 2, 3, 4, 9, 11 Điều 76): người có công, hộ nghèo/cận nghèo, người đã trả nhà công vụ, học sinh/sinh viên (thuê). Hộ **bị thu hồi đất** (khoản 10) không cần Mẫu xác nhận thu nhập dân sự — dùng Quyết định thu hồi đất.

Quân nhân, công an đương nhiệm (**khoản 7** Điều 76) áp dụng **Điều 67** NĐ 100/2024 (mức tham chiếu lương Đại tá, mẫu BQP/BCA) — **không** phải bảng 25/35/50 triệu như công nhân hay CBCCVC.

## Mức trần thu nhập hiện hành — không còn 20/30/40 triệu

Từ 07/04/2026, [NĐ 136/2026/NĐ-CP](https://vanban.chinhphu.vn/?classid=1&docid=217605&pageid=27160) sửa khoản 1 Điều 30 NĐ 100/2024. Đối với đối tượng khoản 5, 6, 8 Điều 76 (CBCCVC, công nhân KCN, người thu nhập thấp…):

| Tình trạng | Mức trần thu nhập bình quân/tháng (thực nhận) | Giai đoạn trước (NĐ 261/2025) |
| --- | --- | --- |
| Độc thân, chưa kết hôn | Không quá 25 triệu đồng | 20 triệu (10/10/2025 – 06/04/2026) |
| Độc thân, nuôi con dưới tuổi thành niên | Không quá 35 triệu đồng | 30 triệu |
| Đã kết hôn (tổng vợ chồng) | Không quá 50 triệu đồng | 40 triệu |

Cách tính thực tế: lấy tổng thu nhập thực nhận 12 tháng liền kề, chia 12 — tính từ thời điểm cơ quan có thẩm quyền xác nhận (theo Điều 30 NĐ 100/2024). Chỉ tính tiền lương, tiền công theo Bảng lương do đơn vị xác nhận; thưởng một lần, thu nhập ngoài có thể không được cộng tùy hướng dẫn đợt rà soát.

Ví dụ: Công nhân KCN lương 22 triệu/tháng ổn định 12 tháng thì đủ trần 25 triệu (độc thân). Vợ chồng cùng KCN, tổng 48 triệu/tháng thì đủ trần 50 triệu. Nếu một tháng có thu nhập phát sinh làm bình quân vượt trần thì có thể không đạt.

Lưu ý địa phương: UBND cấp tỉnh được quyết định hệ số điều chỉnh mức thu nhập (không vượt quá tỷ lệ thu nhập bình quân đầu người địa phương so với cả nước). Trước khi nộp, tra thông báo Sở Xây dựng tỉnh/TP nơi dự án tọa lạc — mức áp dụng có thể khác biệt nhẹ.

## Ai ký xác nhận thu nhập và đối tượng?

| Tình huống | Cơ quan xác nhận | Giấy tờ cốt lõi |
| --- | --- | --- |
| Làm việc theo HĐLĐ tại doanh nghiệp, cơ quan | Đơn vị, doanh nghiệp nơi làm việc | Bảng lương 12 tháng, HĐLĐ, giấy xác nhận đối tượng |
| Lao động tự do, không HĐLĐ | Công an cấp xã nơi thường trú/tạm trú | Kê khai thu nhập + cam kết; xác nhận trong 7 ngày (NĐ 261/2025) |
| Hộ nghèo, cận nghèo | UBND cấp xã | Giấy xác nhận hộ nghèo/cận nghèo theo chuẩn |
| Quân nhân, công an (khoản 7 Đ.76) | Cơ quan, đơn vị quản lý | Theo Điều 67 NĐ 100/2024 (mức tham chiếu cấp bậc) |

## Điều kiện nhà ở — phần nhiều hồ sơ vướng nhất

Theo Điều 77 Luật Nhà ở 2023, người mua NOXH cần:

- Chưa được mua, thuê mua nhà ở xã hội (trừ thuê).
- Không sở hữu nhà ở, đất ở tại nơi có dự án hoặc tại đô thị trung ương — tùy phạm vi từng đợt mở bán.
- Hoặc đã có nhà nhưng diện tích sử dụng bình quân đầu người dưới mức tối thiểu (Nghị định 100/2024 quy định chi tiết theo từng loại đô thị).

Thực hành: Nếu vợ/chồng đứng tên sổ nhà ở nơi khác, hộ thường bị loại dù người nộp đơn không đứng tên. Nên tra cứu sổ đỏ, tình trạng tài sản cả hộ trước khi đóng phí hồ sơ. Một số dự án vùng ven (Đồng Nai, Long An…) yêu cầu không sở hữu nhà trên địa bàn tỉnh — đọc kỹ thông báo CĐT.

## Checklist chuẩn bị hồ sơ (8 bước)

1. Xác định nhóm đối tượng (KCN / CBCCVC / thu nhập thấp / hộ nghèo) và đối chiếu Điều 76.
2. Tính thu nhập bình quân 12 tháng — so với trần 25 / 35 / 50 triệu (sau 07/04/2026).
3. Kiểm tra sổ nhà ở, đất ở của cả hộ theo Điều 77.
4. Xin giấy xác nhận thu nhập và đối tượng tại đơn vị (hoặc Công an cấp xã nếu tự do).
5. Chuẩn bị CCCD, giấy tờ hôn nhân, khai sinh con (nếu nuôi con).
6. Lập cam kết điều kiện nhà ở theo mẫu đợt mở bán.
7. Chọn một dự án NOXH — mỗi hộ/cá nhân chỉ đăng ký một dự án tại một thời điểm.
8. Nộp đúng hạn; giữ bản sao và biên nhận.

## Năm lỗi thường khiến hồ sơ bị loại

- Dùng mức thu nhập cũ (20/30/40 triệu) trong khi đợt rà soát áp dụng NĐ 136/2026.
- Cộng thu nhập ngoài lương không được đơn vị xác nhận, làm vượt trần khi cơ quan đối chiếu bảng lương.
- Vợ/chồng hoặc cha/mẹ đứng tên nhà ở nhưng kê khai “không sở hữu nhà”.
- Đăng ký đồng thời hai dự án NOXH.
- Nộp hồ sơ khi chưa đủ thời gian cư trú/làm việc tại địa phương theo tiêu chí ưu tiên của dự án.

## Điều kiện cần và điều kiện đủ — phân biệt rõ trước khi nộp hồ sơ

Hồ sơ hợp lệ phải qua cửa điều kiện cần: đúng đối tượng (Đ.76), đúng tình trạng nhà ở (Đ.77), và đúng cơ chế thu nhập (Đ.30 — chỉ k5/k6/k8 dùng trần 25/35/50; k7 dùng Đ.67; k1/k10 miễn Mẫu thu nhập dân sự). Thiếu một trong các trụ, hồ sơ bị loại ngay tại bước rà soát.

Điều kiện đủ để được chọn mua là chuyện khác: cùng đợt mở bán, hàng nghìn hồ sơ có thể cùng đạt ba trụ cột nhưng quỹ căn chỉ vài trăm suất — như [Lý Thường Kiệt](/du-an/nha-o-xa-hoi-ly-thuong-kiet) từng ghi nhận hơn 12.000 hồ sơ cho 755 căn. Vì vậy, chuẩn bị hồ sơ sớm và chọn dự án có tỷ lệ cạnh tranh phù hợp thu nhập của bạn quan trọng không kém việc đủ điều kiện pháp lý.

## Sau khi đủ điều kiện — chọn dự án và lịch trình tiếp theo

Khi ba trụ cột đã vững, bước tiếp theo là chọn dự án và dự trù tài chính cho đúng mức cạnh tranh từng đợt. NOXH nội thành thường đông hồ sơ; vùng ven như [DTA Happy Home Nhơn Trạch](/du-an/dta-happy-home-nhon-trach) thường có quỹ căn mở rộng hơn và tổng vốn thấp hơn — phù hợp công nhân KCN đã rà soát xong điều kiện cần.

- So sánh chiến lược an cư: [Lý Thường Kiệt vs DTA Happy Home](/tin-tuc/so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026).
- Ước lượng trả góp: [công cụ tính khoản vay](/cong-cu/tinh-khoan-vay) và lãi suất [NHCSXH 120.000 tỷ](/tin-tuc/lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026).
- Theo dõi lịch mở hồ sơ: [công bố giá NOXH nội thành](/tin-tuc/tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc).

${NOXH_SUPPORT_CLOSING}

*Trích dẫn pháp lý: [vanban.chinhphu.vn](https://vanban.chinhphu.vn/?classid=1&docid=217605&pageid=27160) (NĐ 136/2026/NĐ-CP, hiệu lực 07/04/2026).*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-06-20T00:00:00.000Z"),
    updatedAt: NOW,
    coverImageUrl: null,
    authorName: "HouseX Biên tập",
    seoTitle:
      "Điều kiện mua NOXH 2026 — Thu nhập 25/35/50 triệu, hồ sơ & văn bản CP | HouseX",
    seoDesc:
      "Hướng dẫn rà soát 3 trụ cột NOXH: đối tượng Đ.76, nhà ở Đ.77, thu nhập NĐ 136/2026. Checklist hồ sơ, lỗi thường gặp — link vanban.chinhphu.vn.",
    tags: [
      { slug: "noxh", name: "Nhà ở xã hội" },
      { slug: "phap-ly", name: "Pháp lý & chính sách" },
      { slug: "goc-chuyen-gia", name: "Góc chuyên gia" },
    ],
    projects: [],
  },
  ...NOXH_TREND_ARTICLES_2026,
  ...TOD_NHON_TRACH_ARTICLES_2026,
];

const DEMO_ARTICLES: ArticleDetail[] = DEMO_ARTICLES_RAW.map(applyEditorialMedia);

function toCard(a: ArticleDetail): ArticleCardData {
  const { body: _b, seoTitle: _st, seoDesc: _sd, status: _s, ...card } = a;
  return card;
}

export function listDemoArticleCards(params: {
  page?: number;
  pageSize?: number;
  tagSlug?: string;
  projectSlug?: string;
} = {}): { items: ArticleCardData[]; total: number } {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 12;
  let filtered = DEMO_ARTICLES.filter((a) => a.status === "PUBLISHED");

  if (params.tagSlug) {
    filtered = filtered.filter((a) =>
      a.tags.some((t) => t.slug === params.tagSlug),
    );
  }
  if (params.projectSlug) {
    filtered = filtered.filter((a) =>
      a.projects.some((p) => p.slug === params.projectSlug),
    );
  }

  filtered.sort(
    (a, b) =>
      (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0),
  );

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize).map(toCard),
    total,
  };
}

export function getDemoArticleBySlug(slug: string): ArticleDetail | null {
  const a = DEMO_ARTICLES.find(
    (x) => x.slug === slug && x.status === "PUBLISHED",
  );
  return a ?? null;
}

export function getDemoArticlesForProject(
  projectSlug: string,
  limit = 6,
): ArticleCardData[] {
  return listDemoArticleCards({ projectSlug, pageSize: limit }).items;
}

export function getDemoTagBySlug(slug: string): ArticleTagSummary | null {
  const tag = DEMO_ARTICLE_TAGS.find((t) => t.slug === slug);
  if (!tag) return null;
  const count = DEMO_ARTICLES.filter(
    (a) =>
      a.status === "PUBLISHED" && a.tags.some((t) => t.slug === slug),
  ).length;
  return { ...tag, articleCount: count };
}

export function listDemoTags(): ArticleTagSummary[] {
  return DEMO_ARTICLE_TAGS.map((t) => {
    const count = DEMO_ARTICLES.filter(
      (a) =>
        a.status === "PUBLISHED" && a.tags.some((x) => x.slug === t.slug),
    ).length;
    return { ...t, articleCount: count };
  }).filter((t) => t.articleCount > 0);
}

/** Slugs dùng khi seed DB — đồng bộ với demo. */
export const SEED_ARTICLE_TAG_SLUGS = DEMO_ARTICLE_TAGS.map((t) => t.slug);
