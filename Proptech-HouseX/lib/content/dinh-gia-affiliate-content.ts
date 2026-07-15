import type { AffiliateFaq, AffiliatePartner, AffiliateService } from "@/lib/content/affiliate-verticals";

/** Đơn vị thẩm định trong mạng lưới HouseX — cập nhật theo hợp đồng vận hành. */
export const VALUATION_PARTNERS: AffiliatePartner[] = [
  {
    name: "Công ty thẩm định giá được cấp phép",
    note: "Thực hiện chứng thư theo Chuẩn mực thẩm định giá Việt Nam",
  },
];

export const DING_GIA_HUB_FAQS: AffiliateFaq[] = [
  {
    q: "Thẩm định giá bất động sản là gì?",
    a: "Là hoạt động tư vấn xác định giá trị tài sản tại một địa điểm, thời điểm, phục vụ mục đích cụ thể — do doanh nghiệp thẩm định giá được cấp phép thực hiện theo Chuẩn mực thẩm định giá Việt Nam. Kết quả thường được lập thành báo cáo và chứng thư thẩm định giá.",
  },
  {
    q: "HouseX có trực tiếp lập chứng thư định giá không?",
    a: "Chứng thư thẩm định giá do thẩm định viên được cấp phép phát hành theo chuẩn ngành. HouseX tiếp nhận yêu cầu, làm rõ mục đích thẩm định và đồng hành hoàn thiện hồ sơ — từ khảo sát hiện trạng đến bàn giao báo cáo.",
  },
  {
    q: "Khác gì giữa tra cứu giá và thẩm định chính thức?",
    a: "Tra cứu/ước lượng giá thị trường mang tính tham khảo nhanh (phù hợp chủ nhà cân nhắc bán/cho thuê). Thẩm định chính thức yêu cầu khảo sát hiện trạng, thu thập dữ liệu thị trường, áp dụng phương pháp chuẩn và phát hành chứng thư — dùng được cho ngân hàng, cơ quan nhà nước, tòa án. Hồ sơ vay thường cần chứng thư, không chỉ tra cứu.",
  },
  {
    q: "Thẩm định khách lẻ khác thẩm định cho ngân hàng?",
    a: "Mục đích và bên nhận kết quả khác nhau. Khách lẻ: bạn cần số liệu độc lập để bán, thừa kế, visa… Ngân hàng: chứng thư phục vụ phê duyệt hạn mức vay / tài sản đảm bảo theo yêu cầu từng bank. HouseX tiếp nhận cả hai; quy trình khảo sát và chứng thư vẫn theo chuẩn ngành.",
  },
  {
    q: "Quy trình thẩm định qua HouseX gồm những bước nào?",
    a: "Sáu bước: (1) tra cứu & khởi tạo đơn hàng, (2) bổ sung pháp lý / thông tin khách và tạo hợp đồng, (3) xác nhận phí & lịch khảo sát, (4) chuyên viên khảo sát hiện trạng và phê duyệt báo cáo, (5) thông báo kết quả chứng thư, (6) chuyển phát chứng thư có dấu sau khi thanh toán đủ.",
  },
  {
    q: "Thẩm định giá mất bao lâu?",
    a: "Thường 3–10 ngày làm việc tùy loại tài sản, độ phức tạp hồ sơ và mục đích. Căn hộ chung cư đủ pháp lý thường nhanh hơn quyền sử dụng đất phức tạp hoặc nhà xưởng. Tiến độ từng mốc được cập nhật trên hồ sơ.",
  },
  {
    q: "Chi phí thẩm định giá phụ thuộc vào đâu?",
    a: "Loại tài sản (căn hộ / nhà đất), diện tích và vị trí khu vực. Có thể có phụ phí (ví dụ đi lại). HouseX báo phí cụ thể trước khi xác nhận khảo sát — với hồ sơ khách hàng lẻ (không vay ngân hàng), vận hành thường thu đủ phí hồ sơ trước khi đi khảo sát.",
  },
];

export const DING_GIA_SERVICES: AffiliateService[] = [
  {
    slug: "tra-cuu-gia-chu-nha",
    title: "Tra cứu giá cho chủ nhà",
    metaDescription:
      "Chủ nhà cần biết giá BĐS trước khi bán, cho thuê — HouseX thẩm định chuyên nghiệp, báo cáo theo chuẩn thị trường.",
    h1: "Chủ nhà muốn biết giá bất động sản hiện tại?",
    intro:
      "Trước khi rao bán, cho thuê hoặc sang tên, bạn cần mức giá có căn cứ thị trường — không chỉ dựa vào tin đăng lân cận hay lời môi giới. HouseX tư vấn thẩm định giá bất động sản để lập báo cáo tham chiếu hoặc chứng thư (tùy nhu cầu).",
    body: `## Dịch vụ này dành cho ai?

Chủ căn hộ, nhà phố, đất nền, shophouse hoặc tài sản gắn liền đất muốn:
• Xác định giá hợp lý trước khi niêm yết bán/cho thuê trên HouseX hoặc kênh khác
• Tham chiếu giá trị tài sản khi đàm phán với người mua/thuê
• Cập nhật giá trị tài sản sau cải tạo, mở rộng diện tích sử dụng

## Mục đích thẩm định thường gặp

Theo thực tiễn ngành thẩm định, chủ nhà thường yêu cầu thẩm định phục vụ: chuyển nhượng tài sản, tham chiếu thị trường, chứng minh năng lực tài chính hoặc tư vấn nội bộ trước quyết định đầu tư.

## Hồ sơ nên chuẩn bị

• Giấy chứng nhận quyền sử dụng đất / quyền sở hữu nhà (sổ hồng, sổ đỏ)
• Giấy phép xây dựng (nếu có công trình trên đất)
• Bản vẽ sơ đồ, trích lục bản đồ thửa đất
• Hợp đồng mua bán, thuê trước đó (nếu liên quan nguồn gốc)
• Mô tả hiện trạng: diện tích thực tế, hướng nhà, tình trạng nội thất

## Quy trình qua HouseX (6 bước)

1. **Tra cứu & khởi tạo** — mô tả loại tài sản, địa chỉ; kiểm tra thửa đất / công trình nếu cần
2. **Yêu cầu định giá chính thức** — bổ sung pháp lý, thông tin cá nhân và tạo hợp đồng dịch vụ
3. **Xác nhận phí & lịch khảo sát** — vận hành báo phí hồ sơ và hẹn thời gian khảo sát hiện trạng
4. **Khảo sát & phê duyệt** — chuyên viên thẩm định khảo sát hiện trường; kiểm soát chất lượng duyệt báo cáo
5. **Thông báo kết quả** — nhận báo cáo / chứng thư điện tử; phản hồi đồng ý hoặc từ chối kết quả
6. **Chuyển phát chứng thư có dấu** — sau khi thanh toán phần còn lại, nhận bản cứng có dấu

## Phương pháp thẩm định

Tài sản thường được định giá theo phương pháp so sánh (đối chiếu tài sản tương đương trên thị trường), phương pháp chi phí hoặc phương pháp thu nhập — tùy đặc điểm BĐS và Chuẩn mực thẩm định giá Việt Nam.

> **Lưu ý:** Giá trị ước tính công trình (nếu có) thường tính trên đơn giá nhà thô — không bao gồm chi phí hoàn thiện và nội thất trừ khi thỏa thuận riêng.`,
    faqs: [
      {
        q: "Tra cứu giá chủ nhà khác gì so với môi giới báo giá?",
        a: "Môi giới đưa giá niêm yết/dự kiến để bán nhanh. Thẩm định viên được cấp phép lập báo cáo theo phương pháp chuẩn, có thể dùng làm căn cứ pháp lý khi cần — phù hợp khi bạn muốn số liệu độc lập, minh bạch.",
      },
      {
        q: "Có cần chứng thư hay chỉ cần báo cáo tham khảo?",
        a: "Nếu chỉ cân nhắc bán/cho thuê, báo cáo tham khảo có thể đủ. Nếu làm hồ sơ ngân hàng, công chứng, thuế hoặc tranh chấp — cần chứng thư thẩm định giá chính thức.",
      },
      {
        q: "Thẩm định giá căn hộ chung cư cần gì?",
        a: "Sổ hồng căn hộ, hợp đồng mua bán (nếu có), thông tin diện tích tim tường/thông thủy, tầng, hướng và hiện trạng nội thất. Thẩm định viên có thể khảo sát thực tế hoặc theo hồ sơ tùy mục đích.",
      },
      {
        q: "HouseX báo giá dịch vụ thẩm định không?",
        a: "Có. Phí phụ thuộc loại tài sản và mục đích thẩm định. HouseX báo giá cụ thể sau khi xem brief — minh bạch trước khi triển khai.",
      },
    ],
    ctaLabel: "Yêu cầu tra cứu giá",
    tags: ["chủ nhà", "bán nhà", "cho thuê"],
  },
  {
    slug: "tham-dinh-ngan-hang",
    title: "Thẩm định cho ngân hàng",
    metaDescription:
      "Thẩm định giá BĐS làm cơ sở ngân hàng phê duyệt và giải ngân vay mua nhà, thế chấp — HouseX đồng hành hồ sơ vay.",
    h1: "Thẩm định giá phục vụ ngân hàng giải ngân?",
    intro:
      "Khi vay mua nhà, vay thế chấp bất động sản hoặc bổ sung vốn kinh doanh có TSĐB, ngân hàng yêu cầu chứng thư thẩm định giá do công ty được cấp phép lập — làm cơ sở xét duyệt hạn mức và giá trị tài sản đảm bảo. HouseX thẩm định giá theo danh mục ngân hàng chấp nhận.",
    body: `## Khi nào ngân hàng yêu cầu thẩm định?

• Vay mua nhà ở, căn hộ, nhà phố, đất nền dự án
• Vay thế chấp tài sản hiện hữu để vay vốn kinh doanh
• Tái thẩm định khi tài sản thế chấp thay đổi giá trị hoặc gia hạn khoản vay
• Xử lý nợ, thu hồi tài sản bảo đảm (theo quy trình ngân hàng)

## Ai chọn công ty thẩm định?

Tùy chính sách từng ngân hàng: khách hàng đề xuất công ty trong danh sách được chấp nhận, hoặc ngân hàng chỉ định. HouseX hỗ trợ triển khai sớm để tránh chậm tiến độ giải ngân.

## Hồ sơ thường cần

• Giấy chứng nhận quyền sử dụng đất / quyền sở hữu công trình
• Giấy phép xây dựng, bản vẽ thiết kế (nếu có)
• Hợp đồng mua bán, đặt cọc (với giao dịch đang thực hiện)
• Thông tin khoản vay dự kiến: mục đích, ngân hàng, giá trị giao dịch

## Quy trình thẩm định (tham chiếu chuẩn ngành)

1. Tiếp nhận yêu cầu và hồ sơ pháp lý
2. Lập kế hoạch thẩm định, khảo sát hiện trạng tài sản
3. Thu thập thông tin thị trường (tài sản so sánh)
4. Phân tích, chọn phương pháp thẩm định phù hợp
5. Lập báo cáo và phát hành chứng thư giao khách hàng / ngân hàng

## Lưu ý quan trọng

Giá trị thẩm định phục vụ mục đích xét duyệt tín dụng có thể khác giá thỏa thuận mua bán. Ngân hàng thường lấy giá thấp hơn giữa giá giao dịch và giá thẩm định làm cơ sở cho vay.`,
    faqs: [
      {
        q: "Thẩm định cho ngân hàng mất bao lâu?",
        a: "Thường 5–10 ngày làm việc với căn hộ/nhà phố đủ pháp lý. Trường hợp phức tạp (đất nông nghiệp, nhà xưởng, pháp lý chưa rõ) có thể lâu hơn.",
      },
      {
        q: "Giá thẩm định thấp hơn giá mua thì sao?",
        a: "Ngân hàng thường cho vay theo tỷ lệ trên giá thẩm định hoặc giá mua (lấy giá thấp hơn). Bạn có thể bổ sung vốn tự có hoặc thương lượng lại điều kiện vay với ngân hàng.",
      },
      {
        q: "HouseX có hỗ trợ vay ngân hàng không?",
        a: "Có. HouseX tư vấn vay mua nhà, thế chấp và SXKD tại /tai-chinh — ví dụ /tai-chinh/vay-mua-nha. Thẩm định giá và hồ sơ vay được đồng bộ khi bạn cần.",
      },
      {
        q: "Chứng thư thẩm định có thời hạn không?",
        a: "Thường có hiệu lực 6–12 tháng tùy quy định ngân hàng. Hết hạn cần thẩm định lại nếu chưa giải ngân hoặc khi ngân hàng yêu cầu.",
      },
    ],
    ctaLabel: "Yêu cầu thẩm định ngân hàng",
    tags: ["ngân hàng", "vay mua nhà", "thế chấp"],
  },
  {
    slug: "chung-nhan-tham-dinh",
    title: "Chứng thư thẩm định giá",
    metaDescription:
      "Chứng thư định giá BĐS hợp pháp theo Chuẩn mực thẩm định giá VN — công ty được Bộ Tài chính cấp phép.",
    h1: "Chứng thư thẩm định giá bất động sản là gì?",
    intro:
      "Chứng thư thẩm định giá là văn bản pháp lý xác định giá trị tài sản tại một thời điểm, cho một mục đích cụ thể — do thẩm định viên và công ty thẩm định giá được cấp phép ký phát hành theo Chuẩn mực thẩm định giá Việt Nam.",
    body: `## Khái niệm

Theo thông lệ ngành thẩm định giá tại Việt Nam, thẩm định giá bất động sản là hoạt động tư vấn xác định giá trị quyền sử dụng đất, công trình xây dựng gắn liền đất, căn hộ chung cư và các quyền tài sản liên quan — phục vụ mục đích nêu trong hợp đồng dịch vụ.

Bất động sản bao gồm đất đai, nhà ở, công trình xây dựng và tài sản gắn liền với đất (Điều 107 Bộ luật Dân sự).

## Mục đích sử dụng chứng thư

• Xét duyệt tín dụng ngân hàng
• Chuyển nhượng, mua bán tài sản
• Phân chia thừa kế, tranh chấp tài sản
• Kê khai thuế, hợp nhất báo cáo tài chính
• Chứng minh năng lực tài chính (visa, định cư)
• Xử lý nợ, thi hành án

## Nội dung thường có trong chứng thư

• Thông tin tài sản thẩm định (địa chỉ, diện tích, hiện trạng)
• Cơ sở giá trị, thời điểm thẩm định, mục đích
• Phương pháp và kết quả định giá
• Giả thiết, giới hạn và điều kiện sử dụng kết quả

## Dịch vụ HouseX

HouseX triển khai thẩm định giá bất động sản theo chuẩn ngành — minh bạch phí và tiến độ. Quy trình khách hàng lẻ (không vay ngân hàng) và hồ sơ có mục đích khác đều đi qua các bước sau:

1. Tra cứu & khởi tạo đơn hàng
2. Bổ sung pháp lý / thông tin khách hàng và tạo hợp đồng
3. Xác nhận phí & lịch khảo sát hiện trạng
4. Chuyên viên khảo sát; kiểm soát chất lượng phê duyệt báo cáo
5. Thông báo kết quả chứng thư (bản điện tử) — đồng ý hoặc từ chối kết quả
6. Chuyển phát chứng thư có dấu (bản cứng) sau khi thanh toán đủ

Mọi chứng thư do thẩm định viên được cấp phép ký và đóng dấu hợp lệ.`,
    faqs: [
      {
        q: "Chứng thư định giá dùng được cho những việc gì?",
        a: "Cấp tín dụng, mua bán, thừa kế, kê khai thuế, tranh chấp tài sản, chứng minh tài sản visa và các mục đích theo quy định pháp luật — mỗi chứng thư gắn với một mục đích duy nhất trong hợp đồng.",
      },
      {
        q: "Kết quả thẩm định có thay đổi theo mục đích không?",
        a: "Có. Cùng một tài sản, giá trị thẩm định có thể khác nhau tùy mục đích (ví dụ: xét duyệt tín dụng vs. phân chia thừa kế) do cơ sở giá trị và phương pháp áp dụng.",
      },
      {
        q: "Làm sao tra cứu chứng thư thật?",
        a: "Nhiều công ty thẩm định cung cấp tra cứu mã chứng thư trên website. Bạn nên nhận bản gốc có dấu, chữ ký thẩm định viên và mã số doanh nghiệp hợp lệ.",
      },
      {
        q: "Cần bao nhiêu bản chứng thư?",
        a: "Tùy yêu cầu ngân hàng, công chứng hoặc cơ quan tiếp nhận — thường 1–3 bản gốc. HouseX tư vấn số lượng phù hợp khi làm hồ sơ.",
      },
    ],
    ctaLabel: "Yêu cầu chứng thư định giá",
    tags: ["chứng thư", "pháp lý"],
  },
  {
    slug: "phan-chia-thua-ke",
    title: "Định giá phân chia thừa kế",
    metaDescription:
      "Thẩm định BĐS phục vụ phân chia di sản thừa kế công bằng — HouseX lập chứng thư theo chuẩn pháp lý.",
    h1: "Định giá BĐS phục vụ phân chia thừa kế?",
    intro:
      "Khi di sản có bất động sản và nhiều đồng thừa kế, cần xác định giá trị từng phần tài sản để phân chia công bằng — bằng hiện vật, bán tài sản chia tiền hoặc theo phán quyết tòa. HouseX thẩm định giá và lập chứng thư phục vụ thỏa thuận gia đình, công chứng hoặc xét xử.",
    body: `## Khi nào cần định giá thừa kế?

• Nhiều người thừa kế không thống nhất giá trị tài sản
• Phân chia di sản bằng hiện vật — cần quy đổi giá trị từng phần
• Bán bất động sản thừa kế để chia tiền cho các đồng thừa kế
• Tòa án, cơ quan thi hành án yêu cầu chứng thư định giá
• Công chứng di chúc, văn bản phân chia tài sản

## Loại tài sản thường gặp

• Quyền sử dụng đất, nhà ở riêng lẻ
• Căn hộ chung cư, shophouse
• Quyền tài sản phát sinh từ hợp đồng (nếu còn hiệu lực)

## Hồ sơ pháp lý

• Giấy chứng nhận quyền sử dụng đất / sổ hồng
• Giấy tờ về thừa kế: giấy chứng nhận quyền sử dụng đất do thừa kế, văn bản thỏa thuận phân chia, bản án (nếu có)
• Giấy phép xây dựng, bản vẽ (với nhà trên đất)
• Thông tin các đồng thừa kế và tỷ lệ phân chia dự kiến

## Quy trình qua HouseX

1. Mô tả tài sản và bối cảnh phân chia (thỏa thuận / tranh chấp / tòa án)
2. Tiếp nhận hồ sơ và lên lịch khảo sát
3. Khảo sát hiện trạng, lập chứng thư với mục đích phân chia thừa kế
4. Sử dụng chứng thư tại công chứng, tòa hoặc thỏa thuận gia đình

## Lưu ý

Kết quả thẩm định gắn với mục đích và thời điểm cụ thể. Các bên nên thống nhất sử dụng một chứng thư do cùng đơn vị lập để tránh chênh lệch.`,
    faqs: [
      {
        q: "Phân chia thừa kế có bắt buộc thẩm định giá không?",
        a: "Không phải mọi trường hợp. Khi các bên tự thỏa thuận và thống nhất giá trị thì có thể không cần. Thẩm định cần thiết khi tranh chấp, yêu cầu công chứng/tòa hoặc muốn căn cứ độc lập.",
      },
      {
        q: "Một di sản nhiều BĐS — thẩm định thế nào?",
        a: "Thường lập từng chứng thư cho từng tài sản, hoặc báo cáo tổng hợp tùy thỏa thuận dịch vụ. HouseX tư vấn cấu trúc phù hợp.",
      },
      {
        q: "Giá thừa kế có tính thuế không?",
        a: "Thuế thu nhập từ chuyển nhượng BĐS thừa kế có quy định riêng. Chứng thư định giá là căn cứ xác định giá trị — chi tiết thuế nên tham vấn luật sư hoặc cơ quan thuế.",
      },
      {
        q: "Thời gian hoàn thành?",
        a: "Thường 7–15 ngày làm việc tùy số lượng tài sản và độ phức tạp pháp lý.",
      },
    ],
    ctaLabel: "Tư vấn định giá thừa kế",
    tags: ["thừa kế", "phân chia tài sản"],
  },
  {
    slug: "chung-minh-tai-san-visa",
    title: "Chứng minh tài sản visa",
    metaDescription:
      "Thẩm định BĐS phục vụ hồ sơ visa, định cư — chứng thư định giá và hướng dẫn hợp pháp hóa lãnh sự.",
    h1: "Chứng minh tài sản BĐS cho hồ sơ visa?",
    intro:
      "Một số chương trình visa du lịch, định cư hoặc đầu tư yêu cầu chứng minh tài sản (property proof) — bất động sản tại Việt Nam là bằng chứng phổ biến. HouseX thẩm định giá và hướng dẫn các bước công chứng, dịch thuật, hợp pháp hóa theo yêu cầu từng quốc gia.",
    body: `## Khi nào cần chứng minh BĐS cho visa?

• Visa du lịch / thăm thân một số nước yêu cầu sổ tiết kiệm hoặc tài sản
• Chương trình định cư, đầu tư định cư (tùy quốc gia)
• Chứng minh ràng buộc quê nhà (ties to home country)
• Hồ sơ du học, bảo lãnh tài chính bổ sung

## Tài liệu thường cần

• Sổ hồng / giấy chứng nhận quyền sử dụng đất
• Chứng thư thẩm định giá bất động sản (tiếng Việt, có thể cần dịch công chứng)
• Bản sao công chứng sổ gốc
• Hợp pháp hóa lãnh sự hoặc apostille (tùy nước đến)

## Quy trình gợi ý

1. Xác định yêu cầu cụ thể của lãnh sự / chương trình visa (giá trị tối thiểu, thời hạn hiệu lực)
2. Thẩm định giá BĐS với mục đích chứng minh tài sản / năng lực tài chính
3. Dịch thuật, công chứng chứng thư và sổ hồng
4. Hợp pháp hóa tại Bộ Ngoại giao và lãnh sự quán (nếu yêu cầu)
5. Nộp hồ sơ visa kèm bộ tài liệu đầy đủ

## Lưu ý quan trọng

• Mỗi quốc gia có quy định riêng — nên kiểm tra checklist mới nhất từ đại sứ/quán
• Chứng thư thẩm định VN thường cần dịch và hợp pháp hóa mới được lãnh sự chấp nhận
• HouseX hỗ trợ thẩm định giá; thủ tục lãnh sự do bạn hoặc đơn vị dịch vụ visa hỗ trợ`,
    faqs: [
      {
        q: "Chứng thư định giá Việt Nam lãnh sự có chấp nhận không?",
        a: "Thường cần dịch công chứng sang ngôn ngữ nước đến và hợp pháp hóa lãnh sự hoặc apostille. Một số quốc gia yêu cầu thêm giấy tờ chứng minh quyền sở hữu.",
      },
      {
        q: "Cần thẩm định giá bao nhiêu tiền mới đủ visa?",
        a: "Không có mức chung. Tùy loại visa và quốc gia — ví dụ một số chương trình yêu cầu tài sản tương đương mức thu nhập/nghĩa vụ tài chính cụ thể. Kiểm tra checklist lãnh sự trước khi thẩm định.",
      },
      {
        q: "Có thể dùng hợp đồng mua bán thay chứng thư không?",
        a: "Hầu hết lãnh sự yêu cầu giấy tờ pháp lý chính thức (sổ hồng) và/hoặc chứng thư định giá độc lập — hợp đồng đặt cọc thường không đủ.",
      },
      {
        q: "Thời hạn hiệu lực chứng thư cho visa?",
        a: "Nhiều lãnh sự yêu cầu chứng thư trong vòng 3–6 tháng gần nhất. Nên lập chứng thư sát thời điểm nộp hồ sơ.",
      },
    ],
    ctaLabel: "Tư vấn chứng minh tài sản",
    tags: ["visa", "định cư", "property proof"],
  },
];

export const DING_GIA_HUB_INTRO =
  "Thẩm định giá bất động sản xác định giá trị tài sản tại một thời điểm theo mục đích cụ thể — Chuẩn mực thẩm định giá Việt Nam. HouseX đồng hành quy trình 6 bước, từ tra cứu đến bàn giao chứng thư. Hai nhóm nhu cầu phổ biến: (1) khách lẻ — chủ nhà bán/cho thuê, thừa kế, visa; (2) hồ sơ ngân hàng — chứng thư phục vụ vay thế chấp / phê duyệt tín dụng.";

export const DING_GIA_PARTNER_INTRO =
  "HouseX triển khai thẩm định giá bất động sản theo chuẩn ngành — minh bạch phí, tiến độ và chứng thư do thẩm định viên được cấp phép.";
