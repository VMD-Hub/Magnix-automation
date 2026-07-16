/**
 * Giọng biên tập bài PR — tránh prompt/meta heading lộ trong body.
 * Pipeline n8n: docs/HOUSEX_ARTICLE_N8N.md · prompt housex__website-article-pr.md
 * Dùng cho editorial series và QA tự động trước publish.
 */

/** Cụm heading/meta không xuất hiện trong body bài đăng. */
export const EDITORIAL_BANNED_BODY_PATTERNS: readonly RegExp[] = [
  /Liên hệ với/i,
  /Góc nhìn thực tế:/i,
  /Góc nhìn người mua nhà:/i,
  /Gợi ý tra cứu/i,
  /Hành động tiếp theo trên HouseX/i,
  /Bước tiếp theo trên HouseX/i,
  /Kết luận góc nhìn HouseX/i,
  /buyer-first/i,
  /→\s*\[/,
  /không thay tư vấn pháp lý/i,
  /không thay quyết định/i,
  /không thay thế vai trò/i,
];

/**
 * Giọng chuyên gia: kết bài bằng trích dẫn nguồn + điều hướng đồng hành HouseX.
 * Tránh disclaimer phủ định — thay bằng giá trị (rà soát, tư vấn miễn phí) và link /lien-he.
 */
export const EDITORIAL_CLOSING_GUIDANCE =
  "Kết: 1 đoạn điều hướng chuyên gia HouseX (rà soát, đồng hành, miễn phí) + link [/lien-he](/lien-he); có thể thêm 1 dòng trích dẫn nguồn pháp lý/báo chí.";

/** Kết bài kiến thức NOXH — điều hướng hỗ trợ, thu thập lead qua /lien-he. */
export const NOXH_SUPPORT_CLOSING = `## Chuyên gia HouseX hỗ trợ rà soát hồ sơ miễn phí

Tự đối chiếu ba trụ cột pháp lý là bước nên làm — nhưng hồ sơ NOXH còn nhiều chi tiết theo từng đợt mở bán: hệ số thu nhập địa phương, giấy xác nhận đơn vị, cam kết nhà ở cả hộ. Đội ngũ HouseX hỗ trợ miễn phí rà soát điều kiện đối tượng, gợi ý dự án phù hợp mức vay và nhắc lịch mở bán — bạn [để lại thông tin tại đây](/lien-he), chuyên gia sẽ đồng hành từ checklist hồ sơ đến khi chọn được phương án an cư phù hợp.`;

/**
 * Chuẩn biên tập journey NOXH — mỗi H2 phải trả lời xong tại chỗ.
 * Không dùng "xem thêm / đọc bài khác" thay cho quy trình, công thức, hoặc checklist.
 */
export const NOXH_JOURNEY_EDITORIAL_RULES = [
  "Mỗi H2: bản chất + lỗi thực tế + bước làm + hệ quả — trong cùng bài.",
  "Công thức, mẫu câu, bảng quyết định nằm trong thân bài, không defer sang slug khác.",
  "Link chỉ ở footer tối giản (prev/next) hoặc nguồn pháp lý — không thay phần trả lời.",
  "Không dùng **bold** trong body; không block CTA đầu bài.",
] as const;

/**
 * Khung khái niệm TOD — dùng trong bài hạ tầng để phân biệt TOD đúng nghĩa
 * với đô thị vệ tinh hưởng lợi giao thông công cộng (DTA Happy Home ~3–5 km tới ga quy hoạch).
 */
export const TOD_CONCEPT_EDITORIAL = `## Lõi TOD đúng nghĩa — và ranh giới với đô thị vệ tinh

Theo các mô hình quốc tế (ITDP, Peter Calthorpe), TOD (Transit-Oriented Development) tập trung phát triển trong bán kính đi bộ quanh ga — lõi thường 400–800 m, tối đa khoảng 1–1,5 km — tức khoảng cách người dân chấp nhận đi bộ tới điểm kết nối. Lõi TOD có mật độ cao, hỗn hợp chức năng và thiết kế ưu tiên đi bộ, nhằm giảm phụ thuộc phương tiện cá nhân.

Khu vực cách ga 3–5 km trở lên không phải TOD đúng nghĩa, mà thuộc nhóm đô thị vệ tinh được hưởng lợi từ giao thông công cộng — vẫn kết nối tuyến đường sắt/metro qua phương tiện kết nối (xe buýt, xe máy, ô tô), phù hợp công nhân làm việc gần nhưng không đáp ứng tiêu chí «sống gần ga, đi bộ tới ga».`;

/** Đoạn kết PR — nhúng tự nhiên cuối bài, không làm H2. */
export const DTA_PR_CLOSINGS = {
  quyHoachVen:
    "Ở tầm vùng ven, Nhơn Trạch và Long Thành đang được quy hoạch gắn hành lang giao thông liên vùng — từ Vành đai 3 đến các ga đường sắt dự kiến. Trong bối cảnh đó, [DTA Happy Home Nhơn Trạch](/du-an/dta-happy-home-nhon-trach) tại Khu đô thị DTA City cách vùng ga Nhơn Trạch quy hoạch khoảng 3–5 km (tham khảo bản đồ quy hoạch, chưa vận hành) — thuộc nhóm đô thị vệ tinh hưởng lợi giao thông công cộng, không phải lõi TOD đúng nghĩa (bán kính đi bộ ~1–1,5 km quanh ga). Nhiều gia đình trẻ làm việc tại KCN chọn đây làm chốn ở lâu dài thay vì thuê trọ dài hạn tại TP.HCM.",

  todAnCu:
    "TOD đúng nghĩa là sống trong bán kính đi bộ quanh ga (thường tối đa ~1–1,5 km), mật độ cao và ít phụ thuộc xe cá nhân. [DTA Happy Home](/du-an/dta-happy-home-nhon-trach) trong DTA City — giá CĐT từ 448 triệu/căn, quỹ Block A10 đang mở — nằm trên hành lang ga quy hoạch tuyến Thủ Thiêm – Long Thành nhưng cách ga dự kiến khoảng 3–5 km: đây là phương án NOXH tại đô thị vệ tinh hưởng lợi giao thông công cộng, phù hợp người làm việc tại Nhơn Trạch và vùng sân bay Long Thành.",

  todNoiThanhVsVen:
    "5 khu TOD metro số 2 phục vụ ngân sách cao và cạnh tranh gay gắt — đúng mô hình lõi TOD quanh ga. Phía vùng ven, Nhơn Trạch đang hình thành đô thị vệ tinh trên hành lang ga tuyến liên vùng, không phải TOD đúng nghĩa. [DTA Happy Home Nhơn Trạch](/du-an/dta-happy-home-nhon-trach) (448–700 triệu/căn) thuộc DTA City — khu vực Tuổi Trẻ mô tả đang chuyển vai trò nhờ hạ tầng cầu, cao tốc và ga đường sắt quy hoạch.",

  gaQuyHoach:
    "Theo phương án ga quy hoạch, các ga S12/S13 tại Phú Hội là trung tâm phát triển TOD đúng nghĩa (bán kính đi bộ ~1–1,5 km). DTA Happy Home tại [DTA City Nhơn Trạch](/du-an/dta-happy-home-nhon-trach) — xã Phước An — cách vùng ga quy hoạch khoảng 3–5 km (đường thẳng, tham khảo bản đồ); di chuyển tới sân bay Long Thành khoảng 20 phút theo thông tin CĐT hiện tại. Dự án thuộc nhóm đô thị vệ tinh hưởng lợi giao thông công cộng — nhiều gia đình trẻ làm việc tại KCN đang cân nhắc trước khi quỹ NOXH vùng ven thắt chặt.",

  nhonTrachTod:
    "Từ góc nhìn người ở thực tế, DTA Happy Home Nhơn Trạch — dự án NOXH trong [DTA City](/du-an/dta-happy-home-nhon-trach) — nằm trong tam giác hạ tầng: cao tốc Biên Hòa – Vũng Tàu khoảng 10 phút, trục 25C hướng sân bay Long Thành khoảng 20 phút (theo CĐT), và vùng ga Nhơn Trạch quy hoạch cách khoảng 3–5 km. Đây là đô thị vệ tinh sân bay hưởng lợi giao thông công cộng — không phải lõi TOD (đi bộ tới ga trong ~1–1,5 km) — phù hợp gia đình trẻ làm việc tại KCN Nhơn Trạch, thay vì chịu chi phí thuê trọ và di chuyển dài ngày từ TP.HCM.",
} as const;

export function getEditorialBodyIssues(body: string): string[] {
  const text = String(body || "");
  const issues: string[] = [];
  if (/\*\*/.test(text)) issues.push("RAW_MARKDOWN_BOLD");
  for (const pattern of EDITORIAL_BANNED_BODY_PATTERNS) {
    if (pattern.test(text)) issues.push(`BANNED:${pattern.source}`);
  }
  if (/→\s*\[/.test(text)) issues.push("ARROW_CTA");
  return issues;
}

export function assertEditorialBodyQuality(body: string, slug: string): void {
  if (/\*\*/.test(body)) {
    throw new Error(`${slug}: body contains raw markdown bold **`);
  }
  for (const pattern of EDITORIAL_BANNED_BODY_PATTERNS) {
    if (pattern.test(body)) {
      throw new Error(`${slug}: body matches banned editorial pattern ${pattern}`);
    }
  }
}
