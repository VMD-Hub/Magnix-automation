import type { AffiliateFaq, AffiliateService } from "@/lib/content/affiliate-verticals";

/** Hub FAQ — nội dung khách (không lộ hoa hồng / Point Agent). */
export const TAI_CHINH_HUB_FAQS: AffiliateFaq[] = [
  {
    q: "Vay mua nhà qua HouseX khác gì đến thẳng ngân hàng?",
    a: "Bạn vẫn ký hợp đồng tín dụng với ngân hàng. HouseX giúp làm rõ nhu cầu, sơ loại khả năng vay, chuẩn bị hồ sơ, so sánh gói và đồng hành đến khi giải ngân — một đầu mối, tránh tự chạy nhiều nơi.",
  },
  {
    q: "Quy trình vay mua BĐS gồm những bước nào?",
    a: "Sáu bước gọn: (1) làm rõ nhu cầu & tài sản, (2) sơ loại hạn mức / DTI, (3) chọn ngân hàng & gói vay, (4) nộp hồ sơ và bổ sung giấy tờ, (5) ngân hàng thẩm định tài sản / phê duyệt, (6) xác nhận vay và giải ngân.",
  },
  {
    q: "Cần chuẩn bị giấy tờ gì?",
    a: "Nhóm thường gặp: CCCD, hôn nhân/độc thân, cư trú; chứng minh thu nhập (HĐLĐ, lương/sao kê); pháp lý tài sản (sổ hồng/đỏ, HĐMB nếu mua). Checklist chi tiết tùy ngân hàng và mục đích vay.",
  },
  {
    q: "Có cần chọn ngân hàng trước không?",
    a: "Không bắt buộc. Bạn mô tả nhu cầu; HouseX gợi ý ngân hàng và gói phù hợp hồ sơ. Có thể nộp thêm ngân hàng khác nếu cần so sánh ưu đãi (theo quy trình hỗ trợ).",
  },
  {
    q: "Công cụ tính khoản vay trên web dùng thế nào?",
    a: "Dùng /cong-cu/tinh-khoan-vay để ước lượng tiền trả hàng tháng trước khi làm hồ sơ. Kết quả tham khảo — ngân hàng thẩm định mới ra hạn mức và lãi chính thức.",
  },
  {
    q: "Sau khi gửi form thì ai liên hệ?",
    a: "Tư vấn viên HouseX liên hệ trong giờ làm việc để làm rõ mục đích vay, thu nhập và tài sản đảm bảo — rồi hướng dẫn bước tiếp theo.",
  },
];

export const TAI_CHINH_SERVICES: AffiliateService[] = [
  {
    slug: "vay-mua-nha",
    title: "Vay mua nhà & căn hộ",
    metaDescription:
      "Tư vấn vay mua nhà, căn hộ, nhà phố trên HouseX: sơ loại hồ sơ, so sánh gói ngân hàng, đồng hành đến giải ngân.",
    h1: "Vay mua nhà — Đồng hành từ sơ loại đến giải ngân?",
    intro:
      "Bạn đang tìm căn nhà / căn hộ và cần vay một phần giá trị? HouseX giúp làm rõ khả năng vay, chuẩn bị hồ sơ và kết nối ngân hàng phù hợp — không thay ngân hàng phê duyệt, nhưng giúp bạn đi đúng thứ tự trước khi đặt cọc.",
    body: `## Dịch vụ này dành cho ai?

• Người mua nhà lần đầu cần ước lượng hạn mức và lịch trả nợ
• Đổi căn / nâng cấp chỗ ở, cần vốn đối ứng và vay phần còn lại
• Mua căn hộ dự án hoặc nhà phố, đất nền có nhu cầu thế chấp tài sản mua / tài sản khác

## HouseX hỗ trợ những gì?

1. **Làm rõ nhu cầu** — mục đích mua, số tiền cần vay, khả năng trả hàng tháng
2. **Sơ loại hồ sơ** — thu nhập, nghĩa vụ nợ, tài sản đảm bảo; gợi ý DTI / LTV tham khảo
3. **So sánh gói** — tỷ lệ tài trợ, phí liên quan, điều kiện hiện trạng tài sản theo từng ngân hàng
4. **Thu thập & nộp hồ sơ** — checklist CCCD, thu nhập, pháp lý tài sản
5. **Đồng hành phê duyệt** — theo dõi yêu cầu bổ sung giấy tờ, lịch thẩm định tài sản
6. **Xác nhận vay & giải ngân** — hỗ trợ bạn hiểu điều kiện cuối trước khi đồng ý vay

## Hồ sơ thường cần

• **Khách hàng:** CCCD gắn chip, giấy đăng ký kết hôn hoặc xác nhận độc thân, giấy tờ cư trú
• **Thu nhập:** Hợp đồng lao động, xác nhận lương (thường ≤ 6 tháng), sao kê / phiếu lương gần nhất
• **Tài sản:** Sổ hồng/đỏ hoặc HĐMB (nếu đang mua); thông tin thửa đất / căn hộ khớp pháp lý

## Công cụ miễn phí trước khi gửi form

Dùng [Tính khoản vay mua nhà](/cong-cu/tinh-khoan-vay) để có con số sơ bộ. Kết quả không thay thế thẩm định ngân hàng.

## Liên quan thẩm định giá

Khi ngân hàng yêu cầu chứng thư định giá tài sản đảm bảo, HouseX đồng bộ với dịch vụ [thẩm định cho ngân hàng](/dinh-gia/tham-dinh-ngan-hang) trên cùng nền tảng.`,
    faqs: [
      {
        q: "Mua NOXH có vay được không?",
        a: "Thường có nếu đủ điều kiện mua và hồ sơ vay đạt. Xem thêm công cụ / cụm bài thẩm định vay NOXH trên HouseX — khác với vay mua nhà thương mại thông thường.",
      },
      {
        q: "Tôi chỉ biết tầm tiền — chưa chốt căn?",
        a: "Vẫn gửi được yêu cầu. Tư vấn viên giúp ước hạn mức trước; khi có căn cụ thể sẽ rà pháp lý và gói vay chi tiết hơn.",
      },
      {
        q: "Lãi suất trên web có phải lãi ký HĐ không?",
        a: "Không. Lãi suất và phí do ngân hàng công bố tại thời điểm phê duyệt / ký HĐ tín dụng. HouseX không cam kết lãi cố định trên website.",
      },
      {
        q: "Bao lâu thì có phản hồi sau form?",
        a: "Thường trong giờ làm việc, trong vòng một ngày làm việc. Hồ sơ phức tạp có thể cần thêm thời gian thu thập giấy tờ.",
      },
    ],
    ctaLabel: "Tư vấn vay mua nhà",
    tags: ["vay mua nhà", "căn hộ", "nhà phố"],
  },
  {
    slug: "vay-the-chap",
    title: "Vay thế chấp & tái tài trợ",
    metaDescription:
      "Vay thế chấp BĐS sẵn có hoặc chuyển khoản vay sang ngân hàng mới — HouseX hỗ trợ hồ sơ và đồng hành giải ngân.",
    h1: "Vay thế chấp nhà đất — Bổ sung vốn hoặc tối ưu lãi?",
    intro:
      "Bạn đã có bất động sản và cần vốn (sửa nhà, kinh doanh, tất toán nợ) hoặc muốn chuyển khoản vay sang ngân hàng có điều kiện tốt hơn? HouseX hỗ trợ tư vấn mục đích vay, sơ loại hồ sơ và theo sát đến giải ngân.",
    body: `## Khi nào nên cân nhắc vay thế chấp?

• Cần vốn sửa chữa / hoàn thiện nhà sau khi mua
• Cần rút vốn từ BĐS đã sở hữu để tái đầu tư hoặc chi tiêu lớn (đúng mục đích ngân hàng chấp nhận)
• Đang vay ngân hàng khác, hết ưu đãi lãi — muốn **tái tài trợ / chuyển khoản vay**
• Bị ép giá khi bán tài sản nhưng cần vốn mua căn mới — cân nhắc giữ nhà cũ, vay thế chấp (cần tính toán lãi vs kế hoạch)

## Quy trình gợi ý với HouseX

1. Mô tả mục đích vay và tài sản thế chấp (địa chỉ, pháp lý sơ bộ)
2. Sơ loại hạn mức tham khảo theo loại tài sản và hồ sơ thu nhập
3. Chọn ngân hàng / gói phù hợp; xác nhận hiện trạng tài sản theo yêu cầu bank
4. Bổ sung giấy tờ khách + pháp lý TS; nộp hồ sơ
5. Ngân hàng thẩm định tài sản tại hiện trường khi cần; phê duyệt hạn mức
6. Bạn xác nhận đồng ý vay → giải ngân theo tiến độ ngân hàng

## Giấy tờ thường gặp

• Pháp lý tài sản thế chấp (sổ, bản vẽ nếu có)
• CCCD, hôn nhân/cư trú của người vay / đồng vay
• Chứng minh thu nhập và nghĩa vụ nợ hiện tại
• Nếu tái tài trợ: thông tin khoản vay cũ (dư nợ, lãi, ngân hàng)

## Lưu ý quan trọng

• Kê khai đúng mục đích và hiện trạng tài sản — sai lệch có thể khiến hồ sơ bị từ chối
• HouseX không cam kết duyệt vay; quyết định cuối thuộc ngân hàng
• Cần thẩm định giá chính thức: xem [thẩm định cho ngân hàng](/dinh-gia/tham-dinh-ngan-hang)`,
    faqs: [
      {
        q: "Tái tài trợ khác vay mới thế nào?",
        a: "Tái tài trợ chuyển dư nợ / tái cấu trúc sang ngân hàng mới, thường để tối ưu lãi hoặc kỳ hạn. Vẫn cần thẩm định hồ sơ và thường cả tài sản đảm bảo.",
      },
      {
        q: "Nhà đang thế chấp bank A — vay thêm được không?",
        a: "Tùy hạn mức còn lại và chính sách từng ngân hàng. Cần rà dư nợ, giá trị tài sản và mục đích vay — tư vấn viên HouseX làm rõ trước khi nộp.",
      },
      {
        q: "Có bắt buộc bảo hiểm nhà khi vay không?",
        a: "Một số gói ngân hàng yêu cầu bảo hiểm tài sản. HouseX tư vấn khi gói vay có điều kiện này; chi tiết theo từng hợp đồng.",
      },
    ],
    ctaLabel: "Tư vấn vay thế chấp",
    tags: ["thế chấp", "tái tài trợ", "bổ sung vốn"],
  },
  {
    slug: "vay-sxkd",
    title: "Vay sản xuất kinh doanh",
    metaDescription:
      "Vay SXKD có tài sản đảm bảo BĐS trên HouseX: vốn lưu động, máy móc, mở rộng — đồng hành hồ sơ ngân hàng.",
    h1: "Vay SXKD có thế chấp BĐS — Phù hợp hộ kinh doanh & SME?",
    intro:
      "Hộ kinh doanh và doanh nghiệp nhỏ cần vốn lưu động hoặc đầu tư máy móc, đồng thời có bất động sản làm tài sản đảm bảo? HouseX hỗ trợ làm rõ nhu cầu, chuẩn bị hồ sơ và đồng hành với ngân hàng đối tác.",
    body: `## Đối tượng phù hợp

• Hộ kinh doanh, SME cần vốn lưu động hoặc mua sắm thiết bị
• Có (hoặc sẽ có) BĐS đủ điều kiện làm tài sản đảm bảo theo ngân hàng
• Cần tư vấn cấu trúc kỳ hạn / ân hạn phù hợp dòng tiền kinh doanh

## HouseX đồng hành thế nào?

1. Làm rõ mục đích SXKD, doanh thu / dòng tiền sơ bộ và TSĐB
2. Gợi ý hướng sản phẩm vay phù hợp ngân hàng đối tác (điều kiện cụ thể do bank công bố)
3. Checklist hồ sơ pháp nhân / hộ KD + pháp lý tài sản
4. Nộp hồ sơ, bổ sung giấy tờ theo yêu cầu tín dụng
5. Theo dõi phê duyệt và giải ngân

## Hồ sơ gợi ý

• Giấy tờ pháp nhân / hộ kinh doanh (tùy hình thức)
• Báo cáo doanh thu / sổ sách theo yêu cầu từng ngân hàng
• CCCD người đại diện / người vay
• Pháp lý BĐS thế chấp

## Lưu ý tuân thủ

Mục đích vay phải khớp thực tế và quy định ngân hàng. HouseX không hỗ trợ kê khai sai mục đích để kéo dài kỳ hạn.`,
    faqs: [
      {
        q: "Không có BĐS — vay SXKD được không?",
        a: "Một số gói không TSĐB hoặc TSĐB khác tồn tại, nhưng điều kiện chặt. HouseX ưu tiên hỗ trợ phương án có BĐS thế chấp rõ ràng; trường hợp khác sẽ tư vấn hướng phù hợp hoặc giới hạn.",
      },
      {
        q: "Khác gì vay mua nhà?",
        a: "Mục đích, cách chứng minh dòng tiền và thường kỳ hạn / ân hạn khác. Cùng nền tảng HouseX nhưng checklist và ngân hàng gợi ý có thể khác.",
      },
      {
        q: "Thời gian duyệt mất bao lâu?",
        a: "Thường vài ngày đến vài tuần tùy hồ sơ và ngân hàng. Thiếu giấy tờ hoặc pháp lý TS phức tạp sẽ kéo dài.",
      },
    ],
    ctaLabel: "Tư vấn vay SXKD",
    tags: ["SXKD", "SME", "vốn lưu động"],
  },
];

export const TAI_CHINH_HUB_INTRO =
  "HouseX đồng hành vay mua nhà, vay thế chấp và vay SXKD có tài sản đảm bảo: làm rõ nhu cầu, sơ loại hồ sơ, so sánh gói ngân hàng và theo sát đến giải ngân. Lãi suất và phê duyệt do ngân hàng quyết định — HouseX giúp bạn chuẩn bị đúng và đi đúng quy trình.";
