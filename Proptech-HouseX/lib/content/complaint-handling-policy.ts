import type { BilingualLine, BilingualSubsection } from "@/lib/content/legal-appendix-types";

export type ComplaintPillar = {
  step: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
};

export const COMPLAINT_HANDLING_POLICY = {
  metaTitle: "Chính sách xử lý khiếu nại — House X | Complaint Handling Policy",
  metaDescription:
    "House X tiếp nhận khiếu nại minh bạch: xác nhận 24 giờ làm việc, xử lý thông thường trong 3 ngày — tin đăng, tài khoản, dịch vụ trả phí (VN/EN).",
  effectiveDate: "4 tháng 7, 2026",
  effectiveDateEn: "July 4, 2026",
  version: "1.0",
  titleVi: "Chính sách xử lý khiếu nại",
  titleEn: "Complaint Handling Policy",
  leadVi:
    "House X cam kết tiếp nhận và xử lý khiếu nại nhanh chóng, công bằng và minh bạch — phù hợp tinh thần Luật Bảo vệ quyền lợi người tiêu dùng 2023 về tiếp nhận, giải quyết và thông báo tiến độ.",
  leadEn:
    "House X is committed to receiving and handling complaints promptly, fairly, and transparently — consistent with Vietnam’s 2023 Consumer Rights Protection Law on intake, resolution, and progress notification.",

  disclaimer: {
    vi: "Thời hạn xử lý có thể thay đổi tùy theo tính chất vụ việc và quy định pháp luật hiện hành.",
    en: "Handling timelines may vary depending on the nature of the case and applicable law.",
  } satisfies BilingualLine,

  /** Tóm tắt public — 4 ý: tiếp nhận · SLA · xử lý · phản hồi */
  pillars: [
    {
      step: "1",
      titleVi: "Tiếp nhận",
      titleEn: "Intake",
      descVi:
        "Gửi qua nút “Báo cáo tin”, form Liên hệ, email hỗ trợ hoặc kênh chính thức khác được House X công bố.",
      descEn:
        "Submit via “Report listing”, the contact form, support email, or other official channels published by House X.",
    },
    {
      step: "2",
      titleVi: "SLA",
      titleEn: "SLA",
      descVi:
        "Xác nhận trong 24 giờ làm việc; khiếu nại thông thường được phân loại và xử lý trong 3 ngày làm việc.",
      descEn:
        "Acknowledgment within 24 business hours; standard complaints classified and handled within 3 business days.",
    },
    {
      step: "3",
      titleVi: "Xử lý",
      titleEn: "Handling",
      descVi:
        "Rà soát trung thực, công bằng, bảo mật — có thể chỉnh sửa, gắn nhãn, ẩn hoặc gỡ tin; hạn chế tài khoản vi phạm khi cần.",
      descEn:
        "Review with honesty, fairness, and confidentiality — may edit, label, hide, or remove listings; restrict violating accounts when needed.",
    },
    {
      step: "4",
      titleVi: "Phản hồi",
      titleEn: "Response",
      descVi:
        "Thông báo kết quả qua kênh liên hệ bạn đã cung cấp, trong phạm vi pháp luật và chính sách bảo mật cho phép.",
      descEn:
        "Notify outcomes via your provided contact channel, to the extent permitted by law and our privacy policy.",
    },
  ] satisfies ComplaintPillar[],

  sections: [
    {
      id: "1",
      headingVi: "Mục đích",
      headingEn: "Purpose",
      paragraphs: [
        {
          vi: "House X cam kết tiếp nhận và xử lý khiếu nại của người dùng một cách nhanh chóng, công bằng và minh bạch. Chính sách này áp dụng cho các khiếu nại liên quan đến tin đăng, nội dung, tài khoản, dịch vụ trả phí, quyền riêng tư và các vấn đề phát sinh khi sử dụng nền tảng.",
          en: "House X is committed to receiving and handling user complaints promptly, fairly, and transparently. This policy applies to complaints related to listings, content, accounts, paid services, privacy, and any issues arising from the use of the Platform.",
        },
      ],
    },
    {
      id: "2",
      headingVi: "Kênh tiếp nhận",
      headingEn: "Reporting channels",
      paragraphs: [
        {
          vi: "Người dùng có thể gửi khiếu nại qua các kênh sau:",
          en: "Users may submit complaints through the following channels:",
        },
      ],
      bullets: [
        {
          vi: "Nút “Báo cáo tin” trên trang chi tiết tin đăng.",
          en: "The “Report listing” button on the listing detail page.",
        },
        {
          vi: "Biểu mẫu tại trang Liên hệ.",
          en: "The contact form on the Contact page.",
        },
        {
          vi: "Email hỗ trợ chính thức của House X.",
          en: "House X official support email.",
        },
        {
          vi: "Các kênh khác được House X công bố tại từng thời điểm.",
          en: "Any other channels published by House X from time to time.",
        },
      ],
    },
    {
      id: "3",
      headingVi: "Thời gian xác nhận và xử lý",
      headingEn: "Acknowledgment and handling time",
      paragraphs: [
        {
          vi: "House X sẽ xác nhận đã tiếp nhận khiếu nại trong vòng 24 giờ làm việc kể từ khi nhận được yêu cầu hợp lệ.",
          en: "House X will acknowledge receipt of a valid complaint within 24 business hours of receiving it.",
        },
        {
          vi: "Các khiếu nại thông thường sẽ được phân loại và xử lý trong vòng 03 ngày làm việc.",
          en: "Standard complaints will be classified and handled within 03 business days.",
        },
        {
          vi: "Trường hợp cần xác minh thêm với chủ tin, đối tác, nhà cung cấp dịch vụ hoặc bên thứ ba liên quan, thời gian xử lý có thể kéo dài hơn; trong trường hợp này, House X sẽ thông báo rõ lý do và thời hạn dự kiến cập nhật kết quả cho người khiếu nại.",
          en: "If further verification is required with the listing owner, partner, service provider, or other relevant third parties, the handling time may be extended; in such cases, House X will clearly notify the reason and the expected update timeline to the complainant.",
        },
      ],
    },
    {
      id: "4",
      headingVi: "Nguyên tắc xử lý",
      headingEn: "Handling principles",
      paragraphs: [
        {
          vi: "House X xử lý khiếu nại dựa trên nguyên tắc trung thực, công bằng, bảo mật và bảo vệ quyền lợi hợp pháp của người dùng.",
          en: "House X handles complaints based on honesty, fairness, confidentiality, and the protection of users’ legitimate rights and interests.",
        },
        {
          vi: "Trong quá trình xử lý, House X có thể yêu cầu người khiếu nại cung cấp thêm thông tin, bằng chứng hoặc tài liệu hỗ trợ để xác minh vụ việc.",
          en: "During the handling process, House X may request additional information, evidence, or supporting documents from the complainant to verify the matter.",
        },
      ],
    },
    {
      id: "5",
      headingVi: "Kết quả xử lý",
      headingEn: "Possible outcomes",
      paragraphs: [
        {
          vi: "Tùy theo tính chất vụ việc, House X có thể áp dụng một hoặc nhiều biện pháp sau:",
          en: "Depending on the nature of the case, House X may take one or more of the following actions:",
        },
      ],
      bullets: [
        { vi: "Chỉnh sửa nội dung.", en: "Edit the content." },
        {
          vi: "Gắn nhãn cảnh báo hoặc trạng thái “đang kiểm tra”.",
          en: "Add a warning label or “under review” status.",
        },
        { vi: "Ẩn tạm thời hoặc gỡ bỏ tin đăng.", en: "Temporarily hide or remove the listing." },
        {
          vi: "Khóa hoặc hạn chế tài khoản vi phạm.",
          en: "Suspend or restrict a violating account.",
        },
        {
          vi: "Chuyển vụ việc sang bộ phận pháp lý hoặc cơ quan có thẩm quyền nếu cần.",
          en: "Escalate the matter to the legal team or competent authorities if necessary.",
        },
      ],
    },
    {
      id: "6",
      headingVi: "Phản hồi kết quả",
      headingEn: "Outcome notification",
      paragraphs: [
        {
          vi: "Sau khi hoàn tất xử lý, House X sẽ thông báo kết quả cho người khiếu nại qua kênh liên hệ đã cung cấp, trong phạm vi được pháp luật và chính sách bảo mật cho phép.",
          en: "Once the handling process is completed, House X will notify the complainant of the outcome through the contact channel provided, to the extent permitted by law and privacy policy.",
        },
      ],
    },
    {
      id: "7",
      headingVi: "Lạm dụng cơ chế khiếu nại",
      headingEn: "Abuse of complaint system",
      paragraphs: [
        {
          vi: "House X có quyền từ chối xử lý hoặc tạm dừng tiếp nhận các khiếu nại có dấu hiệu spam, lạm dụng, cạnh tranh không lành mạnh hoặc cung cấp thông tin sai lệch.",
          en: "House X reserves the right to reject or pause handling complaints that appear to be spam, abusive, unfairly competitive, or based on false information.",
        },
      ],
    },
    {
      id: "8",
      headingVi: "Liên hệ",
      headingEn: "Contact",
      paragraphs: [
        {
          vi: "Mọi khiếu nại hoặc yêu cầu hỗ trợ vui lòng gửi về kênh liên hệ chính thức của House X được công bố trên website.",
          en: "All complaints or support requests should be submitted through House X’s official contact channels published on the website.",
        },
      ],
    },
  ] satisfies readonly BilingualSubsection[],

  relatedLinks: [
    {
      labelVi: "Phụ lục A — SLA xử lý báo cáo chi tiết",
      labelEn: "Appendix A — Detailed report SLA",
      href: "/dieu-khoan/phu-luc-a",
    },
    {
      labelVi: "Phụ lục B — Chính sách hoàn tiền",
      labelEn: "Appendix B — Refund policy",
      href: "/dieu-khoan/phu-luc-b",
    },
    {
      labelVi: "Điều khoản sử dụng",
      labelEn: "Terms of Use",
      href: "/dieu-khoan",
    },
  ],
} as const;
