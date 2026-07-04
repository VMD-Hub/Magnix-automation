import type { LegalAppendixDoc } from "@/lib/content/legal-appendix-types";

export const APPENDIX_B_REFUND: LegalAppendixDoc = {
  metaTitle: "Phụ lục B — Chính sách hoàn tiền dịch vụ trả phí | House X",
  metaDescription:
    "Điều kiện hoàn tiền, thời hạn xử lý và trường hợp không hoàn tiền cho gói trả phí House X (VN/EN).",
  effectiveDate: "4 tháng 7, 2026",
  effectiveDateEn: "July 4, 2026",
  version: "1.0",
  titleVi: "Phụ lục B — Chính sách hoàn tiền cho dịch vụ trả phí",
  titleEn: "Appendix B — Refund Policy for Paid Services",
  parentLabelVi: "Điều khoản sử dụng",
  parentLabelEn: "Terms of Use",
  parentHref: "/dieu-khoan",
  subsections: [
    {
      id: "B.1",
      headingVi: "Mục đích",
      headingEn: "Purpose",
      paragraphs: [
        {
          vi: "Phụ lục này áp dụng cho các dịch vụ có thu phí của House X, bao gồm nhưng không giới hạn: gói đăng tin, gói nổi bật, gói hỗ trợ quảng bá, gói CTV, dịch vụ bổ sung hoặc các sản phẩm số khác. Mục tiêu là quy định rõ điều kiện hoàn tiền, thời hạn xử lý và các trường hợp không hoàn tiền, phù hợp với nguyên tắc minh bạch trong giao dịch trực tuyến.",
          en: "This appendix applies to House X’s paid services, including featured listings, promotional packages, collaborator packages, add-on services, and other digital products. It sets out the refund eligibility, timelines, and non-refundable cases in a transparent way consistent with online transaction standards.",
        },
      ],
    },
    {
      id: "B.2",
      headingVi: "Nguyên tắc chung",
      headingEn: "General principle",
      paragraphs: [
        { vi: "Các khoản phí chỉ được hoàn khi:", en: "Fees are refundable only when:" },
      ],
      bullets: [
        {
          vi: "House X không thể cung cấp dịch vụ do lỗi hệ thống thuộc phía House X.",
          en: "House X is unable to deliver the service due to a fault on House X’s side.",
        },
        {
          vi: "Dịch vụ bị hủy trước khi kích hoạt hoặc chưa bắt đầu theo mô tả gói.",
          en: "The service is canceled before activation or before its scheduled start.",
        },
        {
          vi: "Có yêu cầu hoàn tiền được chấp thuận theo chính sách riêng của từng gói.",
          en: "The relevant package’s own refund terms allow it.",
        },
        {
          vi: "Pháp luật bắt buộc phải hoàn tiền.",
          en: "Refunds are legally required.",
        },
      ],
      trailingParagraphs: [
        {
          vi: "Nếu không thuộc các trường hợp trên, khoản phí đã thanh toán có thể không được hoàn lại.",
          en: "Otherwise, fees may be non-refundable.",
        },
      ],
    },
    {
      id: "B.3",
      headingVi: "Các trường hợp đủ điều kiện hoàn tiền",
      headingEn: "Eligible refund cases",
      paragraphs: [
        {
          vi: "Người dùng có thể được xem xét hoàn tiền trong các trường hợp sau:",
          en: "Refunds may be considered for:",
        },
      ],
      bullets: [
        {
          vi: "Thanh toán trùng lặp do lỗi kỹ thuật.",
          en: "Duplicate payment caused by technical error.",
        },
        {
          vi: "Dịch vụ đã thanh toán nhưng không được kích hoạt vì lỗi từ House X.",
          en: "Service paid for but not activated due to House X’s fault.",
        },
        {
          vi: "House X đơn phương hủy dịch vụ trước thời điểm bắt đầu.",
          en: "House X unilaterally cancels the service before it begins.",
        },
        {
          vi: "Nội dung dịch vụ sai khác đáng kể so với mô tả và không thể khắc phục hợp lý.",
          en: "Significant mismatch between the service and its description that cannot be reasonably remedied.",
        },
        {
          vi: "Các trường hợp khác do House X xét duyệt riêng hoặc theo yêu cầu pháp luật.",
          en: "Other cases approved by House X or required by law.",
        },
      ],
    },
    {
      id: "B.4",
      headingVi: "Các trường hợp không hoàn tiền",
      headingEn: "Non-refundable cases",
      paragraphs: [
        { vi: "House X không hoàn tiền trong các trường hợp sau:", en: "No refund will be issued if:" },
      ],
      bullets: [
        {
          vi: "Người dùng đã sử dụng hoặc đã tiêu thụ phần lớn giá trị dịch vụ.",
          en: "The user has already used or consumed most of the service value.",
        },
        {
          vi: "Người dùng cung cấp thông tin sai, khiến việc kích hoạt hoặc triển khai dịch vụ bị chậm.",
          en: "Incorrect information from the user delayed activation or delivery.",
        },
        {
          vi: "Người dùng vi phạm Điều khoản sử dụng hoặc chính sách nội dung.",
          en: "The user breached the Terms of Use or content policy.",
        },
        {
          vi: "Dịch vụ đã hoàn tất đúng mô tả.",
          en: "The service has been delivered as described.",
        },
        {
          vi: "Các dịch vụ tùy chỉnh, ưu tiên riêng, hoặc đã tiêu hao nguồn lực vận hành đáng kể, trừ khi có cam kết khác bằng văn bản.",
          en: "Customized, priority, or resource-intensive services have already consumed operational resources, unless otherwise stated in writing.",
        },
      ],
    },
    {
      id: "B.5",
      headingVi: "Thời hạn yêu cầu hoàn tiền",
      headingEn: "Refund request deadline",
      paragraphs: [
        {
          vi: "Người dùng phải gửi yêu cầu hoàn tiền trong thời hạn:",
          en: "Refund requests must be submitted within:",
        },
      ],
      bullets: [
        {
          vi: "Trong vòng 7 ngày kể từ ngày thanh toán đối với dịch vụ số chưa triển khai.",
          en: "7 days from payment for digital services that have not been deployed.",
        },
        {
          vi: "Trong vòng 3 ngày kể từ khi phát hiện giao dịch lỗi hoặc dịch vụ không thể kích hoạt.",
          en: "3 days from discovery of a payment error or service activation failure.",
        },
        {
          vi: "Theo thời hạn riêng của từng gói nếu có quy định khác.",
          en: "Any different time limit stated in the specific package terms.",
        },
      ],
      trailingParagraphs: [
        {
          vi: "Yêu cầu gửi sau thời hạn trên có thể không được chấp nhận, trừ khi pháp luật yêu cầu hoặc House X chấp thuận ngoại lệ.",
          en: "Late requests may be rejected unless required by law or approved as an exception.",
        },
      ],
    },
    {
      id: "B.6",
      headingVi: "Quy trình hoàn tiền",
      headingEn: "Refund procedure",
      numbered: [
        { vi: "Gửi yêu cầu hoàn tiền qua kênh chính thức.", en: "Submit the refund request through the official channel." },
        {
          vi: "Cung cấp mã giao dịch, thời gian thanh toán và lý do.",
          en: "Provide transaction ID, payment date, and reason.",
        },
        {
          vi: "House X xác minh trạng thái dịch vụ và đối chiếu hồ sơ giao dịch.",
          en: "House X verifies the service status and transaction records.",
        },
        {
          vi: "House X thông báo chấp thuận hoặc từ chối trong thời hạn quy định.",
          en: "House X notifies approval or rejection within the stated timeline.",
        },
        {
          vi: "Nếu được chấp thuận, tiền sẽ được hoàn theo phương thức phù hợp.",
          en: "If approved, the refund is processed through the appropriate method.",
        },
      ],
    },
    {
      id: "B.7",
      headingVi: "Thời gian xử lý hoàn tiền",
      headingEn: "Refund timeline",
      bullets: [
        {
          vi: "Xác nhận tiếp nhận: trong vòng 24 giờ làm việc.",
          en: "Receipt acknowledgment: within 24 business hours.",
        },
        {
          vi: "Xác minh và phản hồi kết quả: trong vòng 5 ngày làm việc.",
          en: "Verification and final response: within 5 business days.",
        },
        {
          vi: "Hoàn tiền thực tế: trong vòng 7–15 ngày làm việc tùy phương thức thanh toán và bên trung gian thanh toán.",
          en: "Actual refund execution: within 7–15 business days depending on the payment method and payment processor.",
        },
      ],
    },
    {
      id: "B.8",
      headingVi: "Phương thức hoàn tiền",
      headingEn: "Refund method",
      paragraphs: [
        {
          vi: "Tiền hoàn, nếu có, sẽ được trả về phương thức thanh toán gốc khi khả thi. Nếu không khả thi, House X có thể hoàn theo phương thức thay thế hợp lý, phù hợp quy định nội bộ và yêu cầu pháp luật.",
          en: "Where possible, refunds are issued to the original payment method. If not possible, House X may use a reasonable alternative method in accordance with internal policy and applicable law.",
        },
      ],
    },
    {
      id: "B.9",
      headingVi: "Phí khấu trừ",
      headingEn: "Deductions",
      paragraphs: [
        {
          vi: "Nếu dịch vụ đã bắt đầu hoặc đã tiêu thụ một phần, House X có thể khấu trừ phần giá trị tương ứng với dịch vụ đã cung cấp, chi phí xử lý thanh toán, hoặc chi phí phát sinh hợp lý khác, miễn là việc khấu trừ này được công bố rõ ràng trước khi thanh toán hoặc trong mô tả gói.",
          en: "If the service has started or partial value has been delivered, House X may deduct the value already provided, payment processing costs, or other reasonable expenses, provided such deductions were clearly disclosed before payment or in the package description.",
        },
      ],
    },
    {
      id: "B.10",
      headingVi: "Khiếu nại",
      headingEn: "Complaint review",
      paragraphs: [
        {
          vi: "Nếu người dùng không đồng ý với kết quả hoàn tiền, có thể gửi khiếu nại bổ sung trong vòng 7 ngày kể từ khi nhận phản hồi. House X sẽ xem xét lại trên cơ sở hồ sơ giao dịch và các điều khoản áp dụng.",
          en: "If the user disagrees with the refund decision, they may submit a follow-up complaint within 7 days after receiving the response. House X will reconsider the case based on transaction records and applicable terms.",
        },
      ],
    },
  ],
} as const;
