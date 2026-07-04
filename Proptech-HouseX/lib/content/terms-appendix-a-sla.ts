import type { LegalAppendixDoc } from "@/lib/content/legal-appendix-types";

export const APPENDIX_A_SLA: LegalAppendixDoc = {
  metaTitle: "Phụ lục A — Quy trình SLA xử lý báo cáo | House X",
  metaDescription:
    "Quy trình tiếp nhận, phân loại và xử lý báo cáo tin sai trên House X — SLA 24–72 giờ, minh bạch (VN/EN).",
  effectiveDate: "4 tháng 7, 2026",
  effectiveDateEn: "July 4, 2026",
  version: "1.0",
  titleVi: "Phụ lục A — Quy trình SLA xử lý báo cáo",
  titleEn: "Appendix A — Report Handling SLA",
  parentLabelVi: "Điều khoản sử dụng",
  parentLabelEn: "Terms of Use",
  parentHref: "/dieu-khoan",
  subsections: [
    {
      id: "A.1",
      headingVi: "Mục đích",
      headingEn: "Purpose",
      paragraphs: [
        {
          vi: "Phụ lục này quy định cách House X tiếp nhận, phân loại, xử lý và phản hồi các báo cáo liên quan đến tin đăng, nội dung, tài khoản hoặc hành vi vi phạm trên nền tảng. Mục tiêu là đảm bảo phản hồi nhanh, minh bạch và nhất quán, đồng thời bảo vệ quyền lợi của người dùng.",
          en: "This appendix explains how House X receives, classifies, reviews, and responds to reports related to listings, content, accounts, or platform conduct. The goal is to ensure fast, transparent, and consistent handling while protecting user interests.",
        },
      ],
    },
    {
      id: "A.2",
      headingVi: "Phạm vi áp dụng",
      headingEn: "Scope",
      paragraphs: [
        {
          vi: "Quy trình này áp dụng cho tất cả báo cáo do người dùng, đối tác, môi giới, chủ nhà hoặc bên thứ ba gửi tới House X. Báo cáo có thể bao gồm: tin sai sự thật, ảnh không đúng, giá không đúng, trùng lặp, nội dung vi phạm, nghi ngờ lừa đảo, xâm phạm quyền riêng tư, hoặc lỗi kỹ thuật ảnh hưởng đến trải nghiệm người dùng.",
          en: "This process applies to all reports submitted by users, partners, brokers, owners, or third parties. Reports may include false information, incorrect images, wrong prices, duplicate listings, policy violations, suspected fraud, privacy concerns, or technical issues affecting the user experience.",
        },
      ],
    },
    {
      id: "A.3",
      headingVi: "Kênh tiếp nhận",
      headingEn: "Reporting channels",
      paragraphs: [
        {
          vi: "Người dùng có thể gửi báo cáo qua các kênh sau:",
          en: "Users may submit reports via:",
        },
      ],
      bullets: [
        {
          vi: "Nút “Báo cáo tin” trên từng listing.",
          en: "The “Report listing” button on each listing.",
        },
        {
          vi: "Email hỗ trợ / biên tập.",
          en: "Support / editorial email.",
        },
        {
          vi: "Form liên hệ hoặc trung tâm trợ giúp.",
          en: "Contact form or help center.",
        },
        {
          vi: "Kênh nội bộ dành cho đối tác đã được xác thực.",
          en: "Verified partner channels.",
        },
      ],
      trailingParagraphs: [
        {
          vi: "House X có thể thay đổi hoặc bổ sung kênh tiếp nhận theo từng giai đoạn vận hành, nhưng phải bảo đảm người dùng luôn có ít nhất một kênh báo cáo dễ tiếp cận.",
          en: "House X may update reporting channels over time, but will keep at least one easy-to-access reporting method available.",
        },
      ],
    },
    {
      id: "A.4",
      headingVi: "Mức độ ưu tiên",
      headingEn: "Priority levels",
      paragraphs: [
        {
          vi: "House X phân loại báo cáo theo mức độ ưu tiên như sau:",
          en: "House X classifies reports as follows:",
        },
      ],
      bullets: [
        {
          vi: "Mức 1 — Khẩn cấp: nghi ngờ lừa đảo, giả mạo danh tính, lộ dữ liệu cá nhân, nội dung có dấu hiệu vi phạm pháp luật, hoặc nguy cơ gây thiệt hại ngay lập tức.",
          en: "Priority 1 — Urgent: suspected fraud, identity misuse, personal data leakage, illegal content, or immediate risk of harm.",
        },
        {
          vi: "Mức 2 — Cao: tin sai giá, sai vị trí, sai ảnh, mô tả gây hiểu nhầm nghiêm trọng, trùng lặp gây nhiễu lớn.",
          en: "Priority 2 — High: incorrect prices, locations, photos, misleading descriptions, or major duplicate noise.",
        },
        {
          vi: "Mức 3 — Thông thường: lỗi trình bày, thiếu thông tin, đề nghị cập nhật nội dung, phản hồi chất lượng.",
          en: "Priority 3 — Standard: formatting issues, missing details, content update requests, quality feedback.",
        },
      ],
    },
    {
      id: "A.5",
      headingVi: "Thời gian SLA",
      headingEn: "SLA timelines",
      paragraphs: [
        {
          vi: "House X đặt SLA phản hồi và xử lý như sau:",
          en: "House X applies the following SLA targets:",
        },
      ],
      bullets: [
        {
          vi: "Xác nhận đã nhận báo cáo: trong vòng 24 giờ làm việc.",
          en: "Report acknowledgment: within 24 business hours.",
        },
        {
          vi: "Đánh giá ban đầu và phân loại: trong vòng 48 giờ làm việc.",
          en: "Initial review and classification: within 48 business hours.",
        },
        {
          vi: "Xử lý báo cáo mức 1: trong vòng 24 giờ làm việc kể từ khi xác định là báo cáo khẩn cấp.",
          en: "Priority 1 handling: within 24 business hours after urgent classification.",
        },
        {
          vi: "Xử lý báo cáo mức 2: trong vòng 72 giờ làm việc.",
          en: "Priority 2 handling: within 72 business hours.",
        },
        {
          vi: "Xử lý báo cáo mức 3: trong vòng 5 ngày làm việc.",
          en: "Priority 3 handling: within 5 business days.",
        },
      ],
      trailingParagraphs: [
        {
          vi: "Nếu báo cáo cần xác minh thêm với chủ tin, đối tác hoặc bên thứ ba, House X có thể kéo dài thời gian xử lý nhưng sẽ thông báo lý do và thời hạn dự kiến cập nhật cho người gửi.",
          en: "If a report requires further verification with the listing owner, partner, or third parties, House X may extend the timeline and will notify the reporter of the reason and the expected update time.",
        },
      ],
    },
    {
      id: "A.6",
      headingVi: "Các bước xử lý",
      headingEn: "Handling steps",
      paragraphs: [
        {
          vi: "Quy trình xử lý chuẩn của House X gồm 5 bước:",
          en: "The standard process includes:",
        },
      ],
      numbered: [
        { vi: "Tiếp nhận báo cáo.", en: "Receive the report." },
        { vi: "Xác nhận tính hợp lệ và phân loại mức độ.", en: "Confirm validity and assign priority." },
        {
          vi: "Rà soát dữ liệu, đối chiếu nội dung và lịch sử chỉnh sửa.",
          en: "Review data, compare content, and check edit history.",
        },
        {
          vi: "Quyết định: giữ nguyên, sửa nội dung, gắn nhãn cảnh báo, ẩn tạm thời hoặc gỡ bỏ.",
          en: "Decide whether to keep, edit, label, temporarily hide, or remove the listing.",
        },
        {
          vi: "Phản hồi người báo cáo và lưu hồ sơ xử lý.",
          en: "Respond to the reporter and record the outcome.",
        },
      ],
    },
    {
      id: "A.7",
      headingVi: "Kết quả xử lý có thể áp dụng",
      headingEn: "Possible outcomes",
      paragraphs: [
        { vi: "Tùy tính chất báo cáo, House X có thể:", en: "Depending on the report, House X may:" },
      ],
      bullets: [
        { vi: "Chỉnh sửa nội dung cho chính xác hơn.", en: "Edit content for accuracy." },
        {
          vi: "Gắn nhãn “đã xác minh”, “đang kiểm tra” hoặc “cần bổ sung thông tin”.",
          en: "Add labels such as “verified,” “under review,” or “needs more information.”",
        },
        { vi: "Ẩn tạm thời tin đăng.", en: "Temporarily hide a listing." },
        { vi: "Gỡ bỏ tin đăng.", en: "Remove a listing." },
        {
          vi: "Khóa tài khoản hoặc tạm ngưng quyền đăng tin.",
          en: "Suspend or restrict an account.",
        },
        {
          vi: "Chuyển vụ việc sang bộ phận pháp lý hoặc cơ quan có thẩm quyền nếu cần.",
          en: "Escalate the matter to legal or competent authorities when appropriate.",
        },
      ],
    },
    {
      id: "A.8",
      headingVi: "Nguyên tắc minh bạch",
      headingEn: "Transparency principles",
      paragraphs: [
        {
          vi: "House X ghi nhận lịch sử báo cáo, thời gian xử lý và kết quả xử lý để phục vụ đối soát nội bộ. Trong phạm vi cho phép, House X có thể cung cấp tóm tắt kết quả xử lý cho người gửi báo cáo, nhưng vẫn bảo vệ dữ liệu cá nhân và thông tin nhạy cảm của các bên liên quan.",
          en: "House X keeps records of reports, handling times, and outcomes for internal audit purposes. Where permitted, House X may share a summary of the result with the reporter while protecting personal data and sensitive information of all parties.",
        },
      ],
    },
    {
      id: "A.9",
      headingVi: "Trách nhiệm của người báo cáo",
      headingEn: "Reporter obligations",
      paragraphs: [
        {
          vi: "Người báo cáo cam kết cung cấp thông tin trung thực, rõ ràng và không lạm dụng cơ chế báo cáo để quấy rối, cạnh tranh không lành mạnh hoặc gây thiệt hại cho người khác. House X có quyền từ chối xử lý các báo cáo có dấu hiệu lạm dụng, spam hoặc thiếu cơ sở.",
          en: "Reporters must provide truthful and sufficiently detailed information and must not abuse the reporting system for harassment, unfair competition, or harm to others. House X may reject reports that appear abusive, spam-like, or unsupported.",
        },
      ],
    },
    {
      id: "A.10",
      headingVi: "Liên hệ",
      headingEn: "Contact",
      paragraphs: [
        {
          vi: "Mọi báo cáo khẩn cấp hoặc yêu cầu pháp lý có thể được gửi tới địa chỉ hỗ trợ chính thức của House X theo thông tin công bố trên website.",
          en: "Urgent reports or legal requests should be sent to House X’s official support contact listed on the website.",
        },
      ],
    },
  ],
} as const;
