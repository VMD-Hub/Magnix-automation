import { NOXH_TAG_HN_RING4 } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { TOD_CONCEPT_EDITORIAL } from "@/lib/content/articles/article-editorial-voice";
import { NORTHERN_SUPPORT_CLOSING } from "@/lib/content/articles/northern-editorial-voice";
import { HANOI_GROWTH_CORRIDORS_PILLAR_SLUG } from "@/lib/content/growth-corridors-hanoi";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");
const PILLAR_HREF = `/wiki-nha-o-xa-hoi/${HANOI_GROWTH_CORRIDORS_PILLAR_SLUG}`;
const HUB_HREF =
  "/wiki-nha-o-xa-hoi/chu-de/truc-vanh-dai-4-vung-thu-do";

/**
 * Trục Vành đai 4 Vùng Thủ đô — phễu Vĩ mô → Tiềm năng → Thực tế.
 * Giọng miền Bắc: điềm tĩnh, số liệu có nguồn, không cam kết biên độ giá.
 */
export const HANOI_RING4_CORRIDOR_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-hn-ring4-01",
    slug: "tien-do-vanh-dai-4-vung-thu-do-2026",
    title:
      "Bản đồ tiến độ Vành đai 4 – Vùng Thủ đô: Chặng nước rút khơi thông mọi điểm nghẽn giao thông",
    excerpt:
      "VD4 ~113,52 km qua Hà Nội – Hưng Yên – Bắc Ninh; tổng mức đầu tư khoảng 85–86 nghìn tỷ. GPMB cơ bản ~100%; đường song hành Hà Nội ~85%, Hưng Yên khoảng 70–82%, Bắc Ninh thấp hơn. Hướng cơ bản hoàn thành 2026, khai thác 2027; thông xe kỹ thuật các cầu có thể sớm hơn trước giữa năm 2027.",
    body: `## Vành đai 4 Vùng Thủ đô đang ở giai đoạn nào?

Đường Vành đai 4 – Vùng Thủ đô là vòng ngoài liên tỉnh, giúp giảm tải nội đô lịch sử và mở thêm quỹ đất đô thị vệ tinh quanh nút giao. Toàn tuyến dài khoảng 113,52 km, đi qua Hà Nội, Hưng Yên và Bắc Ninh; tổng mức đầu tư các dự án thành phần thường được báo chí và cơ quan nhà nước nêu quanh 85–86 nghìn tỷ đồng (các bản cập nhật ghi khoảng 85.563–85.813 tỷ tùy thời điểm tổng hợp).

Đọc trong khung 5 trục: [Năm trục tăng trưởng Vùng Thủ đô Hà Nội](${PILLAR_HREF}). Hub: [${HUB_HREF}](${HUB_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Chiều dài, vốn và mốc hoàn thành – khai thác?

| Hạng mục | Tham chiếu công bố / báo chí |
|----------|------------------------------|
| Chiều dài | ~113,52 km (Hà Nội – Hưng Yên – Bắc Ninh) |
| Tổng mức đầu tư | Khoảng 85–86 nghìn tỷ đồng |
| GPMB | Cơ bản đạt ~100% kế hoạch diện tích (còn xử lý hạng mục kỹ thuật / điểm nhỏ) |
| Hướng tiến độ | Cơ bản hoàn thành năm 2026; đưa vào khai thác từ năm 2027 |

Nguồn tổng hợp: [Báo Xây dựng](https://baoxaydung.vn/ha-noi-lui-tien-do-gpmb-vanh-dai-4-den-het-quy-ii-2026-192260302184645965.htm), [VOV](https://vov.vn/xa-hoi/duong-vanh-dai-4-vung-thu-do-co-the-ve-dich-truoc-ke-hoach-nua-nam-post1296991.vov), [Lao Động](https://laodong.vn/xa-hoi/tien-do-duong-song-hanh-vanh-dai-4-qua-ha-noi-hung-yen-va-bac-ninh-1635107.ldo).

## Đường song hành ba địa phương tiến độ khác nhau thế nào?

Đường song hành (dự án thành phần xây lắp hai bên tuyến) là lớp người dân cảm nhận sớm nhất khi đi lại hàng ngày — tiến độ không đồng đều giữa ba tỉnh, thành:

| Địa phương | Mức độ thường được nêu trên báo chí (2026) |
|------------|--------------------------------------------|
| Hà Nội | Khoảng ~85% giá trị hợp đồng / sản lượng song hành |
| Hưng Yên | Khoảng ~70–82% (tùy mốc cập nhật: khối lượng hoặc giá trị) |
| Bắc Ninh | Thấp hơn hai địa phương trên (thường quanh nửa giá trị xây lắp) |

Số liệu trên là ảnh chụp theo từng đợt tổng hợp báo chí — có thể lệch vài điểm phần trăm giữa [Lao Động](https://laodong.vn/xa-hoi/tien-do-duong-song-hanh-vanh-dai-4-qua-ha-noi-hung-yen-va-bac-ninh-1635107.ldo) và [VOV](https://vov.vn/xa-hoi/duong-vanh-dai-4-vung-thu-do-co-the-ve-dich-truoc-ke-hoach-nua-nam-post1296991.vov). Người tìm nhà nên theo dõi thông xe từng đoạn thay vì chờ một “ngày D” toàn tuyến.

${EDITORIAL_FIGURES.metroHub}

## Ba cầu vượt sông nào là hạng mục then chốt?

Trên tuyến cao tốc / kết cấu vượt sông, báo chí và Ban quản lý dự án thường nhắc ba công trình trọng điểm:

1. Cầu Hồng Hà (vượt sông Hồng)
2. Cầu Mễ Sở (vượt sông Hồng)
3. Cầu Hoài Thượng (vượt sông Đuống)

Hướng phấn đấu được nêu công khai: thông xe kỹ thuật các cầu vượt sông trước các sự kiện lớn năm 2027 (trong đó có khung APEC 2027) — tức có thể sớm hơn mốc giữa năm 2027 nếu điều kiện thi công và mặt bằng cho phép. Toàn tuyến vẫn hướng cơ bản xong 2026 và khai thác đồng bộ hơn trong 2027.

## Người mua nhà quanh Vành đai 4 nên đọc tiến độ ra sao?

- Tách lợi ích đường bộ vành đai (rút ngắn thời gian liên vùng) khỏi lõi TOD quanh ga metro / đường sắt (bán kính đi bộ khoảng 1–1,5 km).
- Ưu tiên đoạn song hành và nút giao gần nơi ở hơn là tin đồn “toàn tuyến thông xe”.
- Đối chiếu pháp lý thửa đất / nhà phố trước khi đặt cọc — xem bài thực tế trong cùng trục.

| Tầng | Bài trong phễu |
|------|----------------|
| Vĩ mô (bài này) | Tiến độ VD4 |
| Tiềm năng | [TOD dọc Vành đai 4](/wiki-nha-o-xa-hoi/tod-doc-vanh-dai-4-vung-thu-do-2026) |
| Thực tế | [Thửa đất, nhà phố Bắc Ninh – Hưng Yên – Mê Linh](/wiki-nha-o-xa-hoi/dat-nen-nha-pho-don-dau-vanh-dai-4-bac-ninh-hung-yen-2026) |

${NORTHERN_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.bitexcoMetro}

*Sản lượng %, GPMB và mốc thông xe cập nhật theo Ban quản lý dự án / UBND địa phương và báo chí — có thể thay đổi sau thời điểm bài viết.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T14:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Tiến độ Vành đai 4 Vùng Thủ đô 2026 — 113,52 km, song hành HN–HY–BN | HouseX",
    seoDesc:
      "VD4 ~113,52 km, vốn ~85–86 nghìn tỷ; GPMB ~100%; song hành HN ~85%, HY ~70–82%, BN thấp hơn. Cơ bản 2026, khai thác 2027; cầu Hồng Hà, Mễ Sở, Hoài Thượng.",
    tags: [NOXH_TAG_HN_RING4],
    projects: [],
  },
  {
    id: "article-hn-ring4-02",
    slug: "tod-doc-vanh-dai-4-vung-thu-do-2026",
    title:
      "Mô hình đô thị TOD dọc tuyến Vành đai 4: Bản đồ kho báu mới cho các nhà đầu tư bất động sản",
    excerpt:
      "Tiềm năng quanh nút giao Vành đai 4 mang tính định tính: chỉ quỹ đất gắn điểm giao thông công cộng trong bán kính đi bộ mới gần TOD đúng nghĩa. Phân biệt nút vành đai đường bộ và lõi ga metro / đường sắt — không cam kết biên độ giá.",
    body: `## TOD dọc Vành đai 4 nghĩa là gì — mọi nút giao có phải TOD?

Không. TOD (Transit-Oriented Development) lấy nhà ga hoặc điểm giao thông công cộng làm trung tâm, tập trung nhà ở – thương mại trong bán kính đi bộ (thường tối đa khoảng 1–1,5 km). Nút giao Vành đai 4 chủ yếu là điểm kết nối đường bộ cao tốc / quốc lộ — lợi thế tiếp cận vùng, nhưng chưa tự động thành TOD nếu thiếu ga metro / BRT / đường sắt và quy hoạch mật độ hỗn hợp quanh điểm đó.

${TOD_CONCEPT_EDITORIAL}

${EDITORIAL_FIGURES.metroHub}

## Đâu là tiềm năng định tính quanh vành đai — không phải biên độ giá?

| Loại vị trí | Logic tiềm năng (định tính) | Rủi ro thường gặp |
|-------------|----------------------------|-------------------|
| Cận ga metro / đường sắt + gần vành đai | Gần TOD đúng nghĩa nếu trong bán kính đi bộ | Cạnh tranh cao; tiến độ tuyến |
| Nút giao vành đai, xa ga | Đô thị vệ tinh đường bộ — rút ngắn thời gian vùng | Phụ thuộc xe cá nhân; quy hoạch chi tiết |
| Vệ tinh KCN / logistics gần vành đai | Nhà ở phục vụ lao động, thuê dài hạn | Không đồng nghĩa tăng giá thửa đất ngắn hạn |

House X không công bố phần trăm tăng giá quanh nút giao — chỉ mô tả cơ chế hưởng lợi hạ tầng khi tuyến thông xe từng đoạn. Tiến độ macro: [Tiến độ Vành đai 4](/wiki-nha-o-xa-hoi/tien-do-vanh-dai-4-vung-thu-do-2026) · Khung 5 trục: [Năm trục tăng trưởng Vùng Thủ đô](${PILLAR_HREF}).

${EDITORIAL_FIGURES.bitexcoMetro}

## Vì sao cần tách TOD vành đai khỏi các trục khác của Vùng Thủ đô?

- Đông – Đông Nam: cao tốc 5B / cửa ngõ Hưng Yên — logic cảng và ly tâm bờ Đông sông Hồng.
- Nội Bài – Bắc sông Hồng: logistics hàng không, Đông Anh / Mê Linh.
- Thăng Long – Hòa Lạc: công nghệ – giáo dục và an cư cao tầng phía Tây.
- Tây Nam: QL1A / Pháp Vân – Cầu Giẽ và vệ tinh Hà Nam.

Hub trục này: [${HUB_HREF}](${HUB_HREF}).

## Nhà đầu tư cá nhân nên hỏi gì trước khi “săn TOD vành đai”?

1. Có ga / điểm công cộng nào đã có trong quy hoạch chi tiết trong bán kính đi bộ không?
2. Lợi thế chính là thời gian ô tô khi thông xe đoạn gần nhà — hay là sống gần ga?
3. Pháp lý thửa đất / dự án có sổ đỏ, quy hoạch rõ, không vướng hành lang kỹ thuật tuyến không?

Tầng thực tế: [Thửa đất, nhà phố đón Vành đai 4](/wiki-nha-o-xa-hoi/dat-nen-nha-pho-don-dau-vanh-dai-4-bac-ninh-hung-yen-2026).

${NORTHERN_SUPPORT_CLOSING}

${EDITORIAL_FIGURES.thuThiem}

*Bài mang tính khung khái niệm; ranh TOD và tiến độ ga / vành đai theo phê duyệt chính thức.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T15:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-01-civic-center.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "TOD dọc Vành đai 4 Vùng Thủ đô — phân biệt nút giao và đô thị vệ tinh | HouseX",
    seoDesc:
      "Tiềm năng định tính quanh nút giao VD4: chỉ vị trí gắn ga/điểm công cộng trong bán kính đi bộ mới gần TOD đúng nghĩa. Không cam kết biên độ giá.",
    tags: [NOXH_TAG_HN_RING4],
    projects: [],
  },
  {
    id: "article-hn-ring4-03",
    slug: "dat-nen-nha-pho-don-dau-vanh-dai-4-bac-ninh-hung-yen-2026",
    title:
      "Sắp thông xe Vành đai 4: Thửa đất, nhà phố khu vực nào tại Bắc Ninh, Hưng Yên, Mê Linh đáng rà soát?",
    excerpt:
      "Checklist pháp lý thửa đất và nhà phố mặt đường quanh hành lang VD4 tại Bắc Ninh, Hưng Yên, Mê Linh. So sánh định tính — không nêu phần trăm tăng giá; ưu tiên sổ đỏ và pháp lý an toàn trước khi đặt cọc.",
    body: `## Đón thông xe Vành đai 4 bằng thửa đất / nhà phố — cơ hội thật hay khẩu hiệu?

Thông xe từng đoạn giúp rút ngắn thời gian liên vùng và mở thêm lựa chọn an cư vệ tinh — nhưng không đồng nghĩa mọi thửa đất gần đường đều “tăng giá chắc chắn”. House X chỉ mô tả lợi ích định tính theo khu vực; không công bố phần trăm tăng giá và không neo bảng giá giả.

Đọc tiến độ trước: [Tiến độ Vành đai 4](/wiki-nha-o-xa-hoi/tien-do-vanh-dai-4-vung-thu-do-2026) · Khung TOD: [TOD dọc Vành đai 4](/wiki-nha-o-xa-hoi/tod-doc-vanh-dai-4-vung-thu-do-2026) · Pillar: [Năm trục tăng trưởng Vùng Thủ đô](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## Checklist định tính theo khu vực hưởng lợi đường bộ?

| Khu vực | Lợi ích định tính khi đoạn gần thông xe | Việc cần kiểm |
|---------|------------------------------------------|---------------|
| Bắc Ninh | Gần nút giao liên tỉnh, KCN và đô thị vệ tinh phía Đông Bắc | Sổ đỏ khớp thửa; quy hoạch chi tiết; hạ tầng điện – nước thực tế |
| Hưng Yên | Cửa ngõ Đông – Đông Nam, kết nối vành đai với hành lang 5B | Phân biệt đất nông nghiệp vs đất ở; tiến độ song hành địa phương |
| Mê Linh (Hà Nội) | Gần trục Mê Linh / nút giao VD4 phía Bắc sông Hồng | Hành lang kỹ thuật tuyến; pháp lý tách thửa; ngập / thoát nước |

${EDITORIAL_FIGURES.metroViaduct}

## Checklist pháp lý tối thiểu trước khi đặt cọc?

1. Sổ đỏ / giấy tờ chủ quyền khớp thửa; không tranh chấp, không kê biên.
2. Quy hoạch sử dụng đất và hành lang kỹ thuật đường cao tốc / đường song hành / đường gom.
3. Hạ tầng điện – nước – thoát nước thực tế (không chỉ “sắp có”).
4. Nếu mua trong dự án: chủ đầu tư, giấy phép, tiến độ hạ tầng nội khu đã nghiệm thu.
5. Khả năng tiếp cận mặt đường hiện hữu — không phụ thuộc lời hứa “mở đường sau”.

Thiếu một trong các mục trên thì “đón đầu thông xe” dễ thành rủi ro thanh khoản, không phải chiến lược dài hạn.

## Có nhầm thửa đất vành đai với căn hộ nội đô / trục Tây không?

Có. Logic thửa đất – nhà phố vệ tinh quanh VD4 khác căn hộ cao tầng Mỹ Đình / Đại lộ Thăng Long (trục phía Tây) và khác hành lang Nội Bài. Chọn đúng trục trước khi so sản phẩm:

- Hub VD4: [${HUB_HREF}](${HUB_HREF})
- Trục Tây (nếu ưu tiên cao tầng): [/wiki-nha-o-xa-hoi/chu-de/truc-dai-lo-thang-long-hoa-lac](/wiki-nha-o-xa-hoi/chu-de/truc-dai-lo-thang-long-hoa-lac)

${EDITORIAL_FIGURES.bitexcoMetro}

## Khi nào nên nhờ tư vấn thay vì tự “săn tin thông xe”?

Khi bạn cần tách đúng trục (vành đai vs Nội Bài vs Đông Nam vs Tây), kiểm điều kiện an cư / nhà ở xã hội, hoặc muốn checklist pháp lý trước khi đặt cọc.

${NORTHERN_SUPPORT_CLOSING}

*Bài không phải khuyến nghị mua bán thửa đất cụ thể; mọi quyết định cần thẩm định pháp lý độc lập và công bố chính thức về tiến độ / quy hoạch.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T16:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/hcmc-skyline-river-day.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Thửa đất nhà phố đón Vành đai 4 — checklist Bắc Ninh, Hưng Yên, Mê Linh | HouseX",
    seoDesc:
      "Checklist sổ đỏ và pháp lý an toàn quanh VD4 tại Bắc Ninh, Hưng Yên, Mê Linh. So sánh định tính — không nêu % tăng giá.",
    tags: [NOXH_TAG_HN_RING4],
    projects: [],
  },
];
