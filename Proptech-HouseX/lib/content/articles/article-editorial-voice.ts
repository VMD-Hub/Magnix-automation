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
];

/** Đoạn kết PR — nhúng tự nhiên cuối bài, không làm H2. */
export const DTA_PR_CLOSINGS = {
  quyHoachVen:
    "Ở tầm vùng ven, Nhơn Trạch và Long Thành đang được quy hoạch gắn hành lang giao thông liên vùng — từ Vành đai 3 đến các ga đường sắt dự kiến. Trong bối cảnh đó, [DTA Happy Home Nhơn Trạch](/du-an/dta-happy-home-nhon-trach) tại Khu đô thị DTA City nằm cách vùng ga Nhơn Trạch quy hoạch khoảng 5 km (tham khảo bản đồ quy hoạch, chưa vận hành), thuộc vùng phát triển theo hướng đô thị TOD — xu hướng nhiều gia đình trẻ chọn làm chốn ở lâu dài thay vì thuê trọ dài hạn tại TP.HCM.",

  todAnCu:
    "Với lao động trẻ và công nhân KCN, mô hình TOD không chỉ là khái niệm quy hoạch mà là lựa chọn sống gần điểm kết nối giao thông tương lai. [DTA Happy Home](/du-an/dta-happy-home-nhon-trach) trong DTA City — giá CĐT từ 448 triệu/căn, quỹ Block A10 đang mở — là một phương án an cư NOXH nằm trên hành lang ga quy hoạch tuyến Thủ Thiêm – Long Thành, phù hợp người làm việc tại Nhơn Trạch và vùng sân bay Long Thành.",

  todNoiThanhVsVen:
    "Metro số 2 phục vụ ngân sách cao và cạnh tranh gay gắt; phía vùng ven, Nhơn Trạch đang hình thành lớp TOD thứ hai trên tuyến liên vùng. [DTA Happy Home Nhơn Trạch](/du-an/dta-happy-home-nhon-trach) (448–700 triệu/căn) thuộc DTA City — khu vực Tuổi Trẻ mô tả đang chuyển vai trò nhờ hạ tầng cầu, cao tốc và ga đường sắt quy hoạch.",

  gaQuyHoach:
    "Theo phương án ga quy hoạch, vùng Phước An – Phú Hội thuộc hành lang TOD tuyến Thủ Thiêm – Long Thành. DTA Happy Home tại [DTA City Nhơn Trạch](/du-an/dta-happy-home-nhon-trach) cách vùng ga Nhơn Trạch quy hoạch khoảng 5 km (đường thẳng, tham khảo bản đồ); di chuyển tới sân bay Long Thành khoảng 20 phút theo thông tin CĐT hiện tại — khi hạ tầng ga hoàn thiện, thời gian tới điểm kết nối có thể rút ngắn hơn. Đây là mảnh ghép đô thị kiểu mẫu TOD mà nhiều gia đình trẻ đang cân nhắc trước khi quỹ NOXH vùng ven thắt chặt.",

  nhonTrachTod:
    "Từ góc nhìn người ở thực tế, DTA Happy Home Nhơn Trạch — dự án NOXH trong [DTA City](/du-an/dta-happy-home-nhon-trach) — nằm trong tam giác hạ tầng: cao tốc Biên Hòa – Vũng Tàu khoảng 10 phút, trục 25C hướng sân bay Long Thành khoảng 20 phút (theo CĐT), và vùng ga Nhơn Trạch quy hoạch trong bán kính khoảng 5 km. Đó là mô hình đô thị TOD vệ tinh sân bay — xu hướng định cư của gia đình trẻ làm việc tại KCN Nhơn Trạch, thay vì chịu chi phí thuê trọ và di chuyển dài ngày từ TP.HCM.",
} as const;

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
