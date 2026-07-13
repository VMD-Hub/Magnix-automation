/**
 * Điều khoản sử dụng song ngữ (VN + EN) — House X.
 * Liên hệ động: lib/content/legal-contact.ts
 * Pháp nhân: lib/content/legal-entity.ts
 */
import { LEGAL_ENTITY_TERMS_CLAUSE } from "@/lib/content/legal-entity";

export type BilingualClause = {
  id: string;
  vi: string;
  en: string;
};

export type BilingualSection = {
  number: number;
  headingVi: string;
  headingEn: string;
  clauses: readonly BilingualClause[];
};

export type TermsChangeLogEntry = {
  date: string;
  noteVi: string;
  noteEn: string;
};

export const TERMS_OF_USE = {
  metaTitle: "Điều khoản sử dụng — House X | Terms of Use",
  metaDescription:
    "Quy định sử dụng nền tảng House X (VN/EN): tài khoản, đăng tin, bảo vệ liên hệ, trách nhiệm pháp lý và giải quyết tranh chấp.",
  effectiveDate: "4 tháng 7, 2026",
  effectiveDateEn: "July 4, 2026",
  version: "1.0",
  titleVi: "Điều khoản sử dụng — House X",
  titleEn: "Terms of Use — House X",

  plainSummary: {
    headingVi: "Tóm tắt dễ hiểu",
    headingEn: "Plain-language summary",
    paragraphs: [
      {
        vi: "House X là nền tảng kết nối người mua, người thuê với môi giới và chủ nhà — chúng tôi kiểm duyệt tin theo quy trình công khai nhưng không tham gia trực tiếp giao dịch giữa các bên.",
        en: "House X connects buyers and renters with brokers and owners — we moderate listings per published processes but are not a direct party to transactions.",
      },
      {
        vi: "Khi đăng ký hoặc đăng tin, bạn cam kết thông tin trung thực; số liên hệ được bảo vệ và chỉ hiển thị khi đủ điều kiện. Dữ liệu cá nhân tuân theo Chính sách Bảo mật.",
        en: "When registering or posting, you commit to accurate information; contact numbers are protected and revealed only when conditions are met. Personal data is handled per our Privacy Policy.",
      },
      {
        vi: "Bản chi tiết bên dưới có hiệu lực pháp lý. Tiếp tục sử dụng dịch vụ đồng nghĩa bạn đồng ý với các điều khoản này.",
        en: "The detailed terms below are legally binding. Continued use of the services constitutes acceptance.",
      },
    ],
  },

  changeLog: [
    {
      date: "2026-07-04",
      noteVi: "Phiên bản 1.0 — phát hành bản song ngữ đầy đủ (16 mục) + Phụ lục A (SLA báo cáo) và Phụ lục B (hoàn tiền).",
      noteEn: "Version 1.0 — initial full bilingual release (16 sections) plus Appendix A (report SLA) and Appendix B (refunds).",
    },
  ] satisfies TermsChangeLogEntry[],

  appendices: [
    {
      labelVi: "Chính sách xử lý khiếu nại",
      labelEn: "Complaint Handling Policy",
      href: "/chinh-sach-khieu-nai",
    },
    {
      labelVi: "Phụ lục A — Quy trình SLA xử lý báo cáo",
      labelEn: "Appendix A — Report Handling SLA",
      href: "/dieu-khoan/phu-luc-a",
    },
    {
      labelVi: "Phụ lục B — Chính sách hoàn tiền dịch vụ trả phí",
      labelEn: "Appendix B — Refund Policy for Paid Services",
      href: "/dieu-khoan/phu-luc-b",
    },
    {
      labelVi: "Phương pháp biên tập & xác minh tin",
      labelEn: "Editorial methodology & listing verification",
      href: "/gioi-thieu/phuong-phap-bien-tap",
    },
    {
      labelVi: "Chính sách bảo mật",
      labelEn: "Privacy Policy",
      href: "/bao-mat",
    },
    {
      labelVi: "Hợp tác & chương trình CTV",
      labelEn: "Partnerships & CTV program",
      href: "/hop-tac",
    },
  ],

  sections: [
    {
      number: 1,
      headingVi: "Giới thiệu",
      headingEn: "Introduction",
      clauses: [
        {
          id: "1.1",
          vi: "Những điều khoản này (sau đây gọi là “Điều khoản”) quy định quyền, nghĩa vụ và trách nhiệm giữa bạn (người dùng) và House X (sau đây gọi là “House X”, “chúng tôi”, “nền tảng”) khi bạn truy cập, sử dụng website và dịch vụ do House X cung cấp.",
          en: "These terms (the “Terms”) govern the rights, obligations and responsibilities between you (the user) and House X (referred to as “House X”, “we”, or “the Platform”) when you access and use the website and services provided by House X.",
        },
        {
          id: "1.2",
          vi: "Bằng cách truy cập hoặc sử dụng dịch vụ của House X, bạn đồng ý tuân thủ và bị ràng buộc bởi các Điều khoản này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ.",
          en: "By accessing or using House X’s services, you agree to be bound by these Terms. If you do not agree, do not use the services.",
        },
        {
          id: LEGAL_ENTITY_TERMS_CLAUSE.id,
          vi: LEGAL_ENTITY_TERMS_CLAUSE.vi,
          en: LEGAL_ENTITY_TERMS_CLAUSE.en,
        },
      ],
    },
    {
      number: 2,
      headingVi: "Đối tượng áp dụng",
      headingEn: "Scope",
      clauses: [
        {
          id: "2.1",
          vi: "Điều khoản áp dụng với mọi cá nhân, tổ chức sử dụng nền tảng House X, bao gồm nhưng không giới hạn: người mua, người thuê, môi giới, chủ nhà, cộng tác viên (CTV) và đối tác.",
          en: "These Terms apply to all individuals and entities using the House X platform, including but not limited to buyers, renters, brokers, property owners, collaborators (CTV) and partners.",
        },
        {
          id: "2.2",
          vi: "House X có thể bổ sung, sửa đổi hoặc cập nhật Điều khoản; mọi thay đổi sẽ được thông báo trên trang web hoặc theo quy định pháp luật. Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa bạn chấp nhận các thay đổi đó.",
          en: "House X may amend, modify or update the Terms; any changes will be posted on the website or as required by law. Continued use after changes constitutes acceptance of the updated Terms.",
        },
      ],
    },
    {
      number: 3,
      headingVi: "Quyền truy cập và sử dụng",
      headingEn: "Access and Use",
      clauses: [
        {
          id: "3.1",
          vi: "Quyền truy cập: House X cấp cho bạn quyền sử dụng dịch vụ cho mục đích cá nhân hoặc chuyên nghiệp phù hợp với Điều khoản này. Quyền này không phải là quyền sở hữu, không cho phép bạn sao chép, sửa đổi, phân phối hay tạo sản phẩm dẫn xuất từ nội dung của House X khi chưa có phép.",
          en: "Access rights: House X grants you a right to use the services for personal or professional purposes in accordance with these Terms. This is not an ownership right and does not permit copying, modifying, distributing or creating derivative works from House X content without permission.",
        },
        {
          id: "3.2",
          vi: "Tài khoản người dùng: để sử dụng một số tính năng (ví dụ: hiển thị số liên hệ, đăng tin, lưu tin), bạn cần đăng ký tài khoản và cung cấp thông tin chính xác. Bạn chịu trách nhiệm bảo mật tên đăng nhập và mật khẩu; House X không chịu trách nhiệm cho mọi hoạt động phát sinh từ tài khoản của bạn nếu do bạn tiết lộ thông tin đăng nhập.",
          en: "User accounts: To use certain features (e.g., reveal contact numbers, post listings, save listings), you must register an account and provide accurate information. You are responsible for safeguarding your username and password; House X is not liable for activities arising from your account if due to your disclosure of login details.",
        },
        {
          id: "3.3",
          vi: "Hạn chế sử dụng: bạn không được sử dụng dịch vụ để thực hiện hành vi trái pháp luật, lừa đảo, gửi spam, thu thập dữ liệu trái phép, hoặc gây hại cho hệ thống của House X.",
          en: "Use restrictions: You may not use the services for illegal activities, fraud, spamming, unauthorized data harvesting, or actions that harm House X systems.",
        },
      ],
    },
    {
      number: 4,
      headingVi: "Quy định về nội dung đăng tải",
      headingEn: "Content Rules",
      clauses: [
        {
          id: "4.1",
          vi: "Quyền sở hữu nội dung: người đăng tin chịu trách nhiệm về tính chính xác, tính pháp lý và nguồn gốc của nội dung họ đăng (hình ảnh, mô tả, giấy tờ). Việc đăng tin không làm mất quyền sở hữu tài sản gốc của người đăng.",
          en: "Ownership of content: Poster of a listing is responsible for the accuracy, legality and provenance of the content they upload (photos, descriptions, documents). Posting does not transfer ownership of original property.",
        },
        {
          id: "4.2",
          vi: "Tiêu chuẩn nội dung: House X yêu cầu mô tả trung thực, ảnh thật, vị trí chính xác và giá niêm yết rõ ràng. House X có quyền từ chối, chỉnh sửa (theo thỏa thuận) hoặc gỡ bỏ các tin vi phạm tiêu chuẩn, lừa đảo hoặc thiếu thông tin căn bản.",
          en: "Content standards: House X requires truthful descriptions, real photos, accurate location and clear listing prices. House X may reject, edit (by agreement), or remove listings that violate standards, are fraudulent or lack basic information.",
        },
        {
          id: "4.3",
          vi: "Nội dung bị cấm: tuyệt đối cấm nội dung vi phạm pháp luật, kích động thù hận, giả mạo giấy tờ, ảnh không liên quan, hoặc nội dung xúc phạm. Mọi vi phạm sẽ dẫn tới gỡ tin, khóa tài khoản và có thể bị báo cơ quan chức năng.",
          en: "Prohibited content: Content that violates laws, incites hatred, forges documents, uses unrelated/stock photos, or is defamatory is prohibited. Violations may result in removal, account suspension, and reporting to authorities.",
        },
        {
          id: "4.4",
          vi: "Trách nhiệm sau khi đăng: người đăng chịu trách nhiệm giải quyết tranh chấp pháp lý liên quan đến giao dịch; House X chỉ cung cấp nền tảng kết nối và biên tập thông tin theo quy trình đã công bố.",
          en: "Post-publishing responsibility: Posters are responsible for resolving legal disputes related to transactions; House X provides a connection platform and editorial moderation as published.",
        },
      ],
    },
    {
      number: 5,
      headingVi: "Dịch vụ trả phí và thanh toán",
      headingEn: "Paid Services & Payment",
      clauses: [
        {
          id: "5.1",
          vi: "Các dịch vụ trả phí (nổi bật tin, mua gói, dịch vụ hỗ trợ) sẽ có điều khoản thanh toán riêng kèm theo mô tả dịch vụ.",
          en: "Paid services (featured listings, packages, premium support) will have separate payment terms and service descriptions.",
        },
        {
          id: "5.2",
          vi: "Thanh toán: người dùng thanh toán bằng phương thức mà House X chấp nhận; mọi khoản phí đã thanh toán theo cam kết sẽ không được hoàn lại trừ khi có thoả thuận hoặc quy định khác.",
          en: "Payment: Users pay via methods accepted by House X; fees paid are non-refundable unless otherwise agreed or required by law.",
        },
        {
          id: "5.3",
          vi: "Hủy / hoàn tiền: chính sách hủy và hoàn tiền được quy định rõ trong điều khoản dịch vụ trả phí; House X giữ quyền từ chối hoàn tiền khi người dùng vi phạm Điều khoản.",
          en: "Cancellation/refund: Cancellation and refund policies are detailed in the paid service terms; House X may deny refunds if users breach the Terms.",
        },
      ],
    },
    {
      number: 6,
      headingVi: "Bảo vệ liên hệ & Quyền riêng tư",
      headingEn: "Contact Protection & Privacy",
      clauses: [
        {
          id: "6.1",
          vi: "Bảo vệ liên hệ: House X áp dụng cơ chế để bảo vệ số điện thoại và thông tin liên hệ; các cơ chế hiển thị số chỉ diễn ra khi người dùng đáp ứng điều kiện (ví dụ: đăng ký và xác thực email).",
          en: "Contact protection: House X implements mechanisms to protect phone numbers and contact details; contact info is revealed only when conditions are met (e.g., account registration and email verification).",
        },
        {
          id: "6.2",
          vi: "Thông tin cá nhân: việc thu, lưu, xử lý dữ liệu cá nhân tuân theo Chính sách Bảo mật của House X. Khi sử dụng dịch vụ, bạn đồng ý với việc House X thu thập và xử lý dữ liệu theo chính sách đó.",
          en: "Personal data: Collection, storage and processing of personal data follow House X’s Privacy Policy. By using the services, you consent to such processing.",
        },
      ],
    },
    {
      number: 7,
      headingVi: "Trách nhiệm và giới hạn trách nhiệm",
      headingEn: "Liability and Limitation",
      clauses: [
        {
          id: "7.1",
          vi: "Trách nhiệm người dùng: người dùng chịu trách nhiệm về tính chính xác của nội dung đăng, tuân thủ pháp luật và trả lời các khiếu nại phát sinh từ giao dịch.",
          en: "User responsibilities: Users are liable for the accuracy of their posted content, compliance with laws, and addressing complaints arising from transactions.",
        },
        {
          id: "7.2",
          vi: "Trách nhiệm House X: House X cam kết tối đa hoá nỗ lực để kiểm duyệt, xác minh tin đăng theo phương pháp biên tập công bố. Tuy nhiên, House X không chịu trách nhiệm trực tiếp cho thiệt hại phát sinh từ giao dịch giữa người mua và người bán do thông tin sai sót mà người đăng chịu trách nhiệm.",
          en: "House X liability: House X commits to using best efforts to moderate and verify listings per published methodology. However, House X is not directly liable for losses from transactions between buyers and sellers arising from inaccurate information attributable to the poster.",
        },
        {
          id: "7.3",
          vi: "Giới hạn bồi thường: trong mọi trường hợp, trách nhiệm pháp lý của House X đối với người dùng bị giới hạn ở mức tối đa do luật pháp cho phép; House X không chịu trách nhiệm bồi thường cho thiệt hại gián tiếp, mất lợi nhuận, mất doanh thu hoặc thiệt hại tương tự.",
          en: "Limitation of liability: To the fullest extent permitted by law, House X’s liability is limited; House X shall not be liable for indirect losses, lost profits, revenue loss, or similar damages.",
        },
      ],
    },
    {
      number: 8,
      headingVi: "Báo cáo, khiếu nại và cơ chế xử lý",
      headingEn: "Reports, Complaints & Handling",
      clauses: [
        {
          id: "8.1",
          vi: "Báo cáo tin sai và khiếu nại: người dùng có thể sử dụng nút “Báo cáo tin”, form Liên hệ hoặc email hỗ trợ. Quy trình, SLA và phản hồi kết quả được quy định tại Chính sách xử lý khiếu nại và Phụ lục A (liên kết ở cuối trang).",
          en: "Reporting incorrect listings and complaints: Users may use “Report listing”, the contact form, or support email. Process, SLA, and outcome notification are set out in the Complaint Handling Policy and Appendix A (linked at the bottom of this page).",
        },
        {
          id: "8.2",
          vi: "Khiếu nại pháp lý hoặc tranh chấp giao dịch: xử lý theo Chính sách xử lý khiếu nại; House X có thể yêu cầu bằng chứng bổ sung. Khiếu nại dịch vụ trả phí tham chiếu thêm Phụ lục B.",
          en: "Legal complaints or transaction disputes: handled per the Complaint Handling Policy; House X may request supporting evidence. Paid-service complaints also refer to Appendix B.",
        },
      ],
    },
    {
      number: 9,
      headingVi: "Quyền sở hữu trí tuệ",
      headingEn: "Intellectual Property",
      clauses: [
        {
          id: "9.1",
          vi: "Nội dung thuộc về House X: logo, giao diện, mã nguồn, văn bản, biểu tượng và các tài sản sáng tạo trên nền tảng là sở hữu của House X hoặc được cấp phép.",
          en: "Platform IP: Logo, UI, source code, text, icons and creative assets on the platform are owned by House X or licensed to it.",
        },
        {
          id: "9.2",
          vi: "Quyền người dùng: người dùng vẫn giữ quyền sở hữu nội dung họ đăng; nhưng bằng việc đăng, người dùng cấp cho House X quyền không độc quyền, miễn phí, toàn cầu để sử dụng, sao chép, trưng bày, lưu trữ và phân phối nội dung nhằm vận hành dịch vụ. Nếu bạn muốn rút quyền sử dụng, vui lòng liên hệ theo hướng dẫn xoá nội dung.",
          en: "User rights: Users retain ownership of content they post; by posting, users grant House X a non-exclusive, royalty-free, worldwide license to use, copy, display, store and distribute the content to operate the service. To revoke this license, contact House X per content removal procedures.",
        },
      ],
    },
    {
      number: 10,
      headingVi: "Hủy tài khoản và chấm dứt dịch vụ",
      headingEn: "Account Termination & Suspension",
      clauses: [
        {
          id: "10.1",
          vi: "Người dùng có thể yêu cầu hủy tài khoản theo hướng dẫn trên trang hoặc email. House X có thể hủy hoặc tạm khoá tài khoản khi người dùng vi phạm Điều khoản, có hành vi lừa đảo, hoặc theo yêu cầu pháp luật.",
          en: "Account cancellation: Users may request account deletion per instructions on the site or via email. House X may suspend or terminate accounts for Terms violations, fraudulent activity, or legal obligations.",
        },
        {
          id: "10.2",
          vi: "Hậu quả khi chấm dứt: việc hủy tài khoản không tự động xóa toàn bộ nội dung đã đăng; chính sách xóa nội dung được quy định riêng và tuân thủ pháp luật.",
          en: "Consequences of termination: Account deletion does not automatically remove all posted content; content removal policies are governed separately and comply with law.",
        },
      ],
    },
    {
      number: 11,
      headingVi: "Liên kết tới trang thứ ba và quảng cáo",
      headingEn: "Third-Party Links & Advertising",
      clauses: [
        {
          id: "11.1",
          vi: "Nền tảng có thể chứa liên kết tới trang web, dịch vụ bên thứ ba. House X không chịu trách nhiệm về nội dung, chính sách bảo mật hay hành vi của các trang bên thứ ba đó.",
          en: "The Platform may contain links to third-party websites and services. House X is not responsible for the content, privacy policies or conduct of such third parties.",
        },
        {
          id: "11.2",
          vi: "Quảng cáo: House X có thể hiển thị quảng cáo; các quảng cáo tuân theo chính sách quảng cáo và cam kết không phát tán nội dung lừa đảo.",
          en: "Advertising: House X may display advertisements; ads comply with advertising policies and House X’s commitment not to disseminate fraudulent content.",
        },
      ],
    },
    {
      number: 12,
      headingVi: "Thay đổi dịch vụ và điều khoản",
      headingEn: "Changes to Services & Terms",
      clauses: [
        {
          id: "12.1",
          vi: "House X có quyền sửa đổi, tạm ngưng hoặc chấm dứt một phần hoặc toàn bộ dịch vụ. House X sẽ thông báo theo quy định trước khi thay đổi quan trọng tác động tới người dùng.",
          en: "House X may modify, suspend or discontinue all or part of the services. House X will provide notice as required prior to material changes affecting users.",
        },
        {
          id: "12.2",
          vi: "Việc bạn tiếp tục sử dụng sau khi có thông báo về thay đổi được coi là chấp nhận các điều chỉnh.",
          en: "Continued use following notice of changes constitutes acceptance.",
        },
      ],
    },
    {
      number: 13,
      headingVi: "Luật áp dụng và giải quyết tranh chấp",
      headingEn: "Governing Law & Dispute Resolution",
      clauses: [
        {
          id: "13.1",
          vi: "Điều khoản này được điều chỉnh và giải thích theo pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam.",
          en: "These Terms are governed by the laws of the Socialist Republic of Vietnam.",
        },
        {
          id: "13.2",
          vi: "Mọi tranh chấp phát sinh sẽ được ưu tiên hoà giải. Nếu không giải quyết được, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền theo quy định pháp luật.",
          en: "Disputes will first be subject to amicable resolution. If unresolved, disputes shall be brought before competent courts as provided by law.",
        },
      ],
    },
    {
      number: 14,
      headingVi: "Thông tin liên hệ",
      headingEn: "Contact Information",
      clauses: [
        {
          id: "14.1",
          vi: "Nếu bạn có câu hỏi, khiếu nại hoặc yêu cầu liên quan đến Điều khoản sử dụng, vui lòng liên hệ qua thông tin bên dưới.",
          en: "If you have questions, complaints or requests related to these Terms, please contact us using the details below.",
        },
      ],
    },
    {
      number: 15,
      headingVi: "Điều khoản bổ sung (nếu có)",
      headingEn: "Additional Provisions (if any)",
      clauses: [
        {
          id: "15.1",
          vi: "Các phụ lục chi tiết về SLA xử lý báo cáo (Phụ lục A), chính sách hoàn tiền dịch vụ trả phí (Phụ lục B), cùng các điều khoản riêng về API hoặc chương trình CTV (nếu có) được liên kết tại mục Phụ lục cuối trang này.",
          en: "Detailed appendices on report-handling SLA (Appendix A), paid-service refunds (Appendix B), and any separate API or CTV program terms are linked in the Appendices section at the bottom of this page.",
        },
      ],
    },
    {
      number: 16,
      headingVi: "Xác nhận và chấp thuận",
      headingEn: "Acknowledgement & Acceptance",
      clauses: [
        {
          id: "16.1",
          vi: "Bằng việc tiếp tục sử dụng dịch vụ của House X, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các điều khoản nêu trên.",
          en: "By continuing to use House X’s services, you acknowledge that you have read, understood and agree to be bound by these Terms.",
        },
      ],
    },
  ] satisfies BilingualSection[],

  disclaimerVi:
    "Nếu có thắc mắc về Điều khoản sử dụng, vui lòng liên hệ qua thông tin ở mục Liên hệ hoặc trang Chính sách xử lý khiếu nại.",
  disclaimerEn:
    "If you have questions about these Terms, please contact us using the details in the Contact section or the Complaint Handling Policy page.",
} as const;
