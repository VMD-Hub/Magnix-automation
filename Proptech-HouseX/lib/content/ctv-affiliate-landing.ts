/**
 * Landing công khai CTV / bán hàng liên kết — `/affiliate-bat-dong-san`.
 * Giọng nền tảng B2B: rõ vai trò và cách hợp tác — không khung workshop marketing.
 */

export const CTV_AFFILIATE_PATH = "/affiliate-bat-dong-san" as const;

export const CTV_AFFILIATE_TITLE =
  "Cộng tác viên bất động sản — hợp tác minh bạch với House X" as const;

export const CTV_AFFILIATE_SEO_TITLE =
  "Cộng tác viên BĐS minh bạch — tránh cắt máu hoa hồng | House X" as const;

/** Meta description 70–160 ký tự. */
export const CTV_AFFILIATE_SEO_DESCRIPTION =
  "Chương trình cộng tác viên House X: giới thiệu khách, bán hàng liên kết hoặc mua cho mình — hợp tác minh bạch, không đua cắt máu hoa hồng." as const;

export const CTV_AFFILIATE_H1 =
  "Chương trình cộng tác viên bất động sản House X" as const;

export const CTV_AFFILIATE_LEAD =
  "House X kết nối đối tác giới thiệu, bán hàng liên kết và người mua trên cùng một khung hợp tác rõ ràng — thay cho thỏa thuận hoa hồng ngoài luồng dễ làm mất uy tín nghề và niềm tin khách hàng." as const;

export const CTV_AFFILIATE_PAIN = {
  heading: "Vì sao cần khung hợp tác minh bạch?",
  body: [
    "Khi hoa hồng cá nhân bị mặc cả ngoài quy trình, biên lợi nhuận của người tư vấn mỏng đi và trách nhiệm sau giao dịch thường bị cắt theo. Khách có thể tưởng mình được ưu đãi, nhưng thiếu đồng hành pháp lý và hậu mãi.",
    "House X xây chương trình cộng tác viên để ghi nhận giới thiệu / bán hàng liên kết một cách chính danh — cạnh tranh bằng chuyên môn và dịch vụ, không bằng cuộc đua giảm hoa hồng ngoài luồng.",
  ],
} as const;

export type CtvPersonaCard = {
  role: string;
  context: string;
  partnership: string;
};

export const CTV_AFFILIATE_PERSONAS: readonly CtvPersonaCard[] = [
  {
    role: "Nhân viên ngân hàng, bảo hiểm, chứng khoán",
    context:
      "Khách hàng tin tưởng bạn về tài chính và thường hỏi thêm về nhà ở xã hội hoặc dự án bất động sản.",
    partnership:
      "Bạn giới thiệu đúng kênh; House X đảm nhiệm tư vấn sản phẩm. Bạn giữ vai trò người cố vấn đáng tin cậy.",
  },
  {
    role: "Môi giới bất động sản độc lập",
    context:
      "Bạn muốn giữ chuẩn tư vấn và đồng hành sau giao dịch, thay vì cạnh tranh chỉ bằng giảm hoa hồng.",
    partnership:
      "Hợp tác trên nền tảng có quy trình rõ — tập trung chuyên môn pháp lý và lựa chọn căn phù hợp.",
  },
  {
    role: "Người có mạng lưới, không muốn bán trực tiếp",
    context:
      "Người thân hoặc đồng nghiệp cần mua nhà; bạn muốn hỗ trợ giới thiệu mà không đóng vai môi giới.",
    partnership:
      "Bạn thực hiện giới thiệu; House X hỗ trợ tư vấn và hoàn tất giao dịch khi cần.",
  },
  {
    role: "Người mua cho chính mình",
    context:
      "Bạn ưu tiên giao dịch minh bạch, không dựa trên thỏa thuận hoa hồng miệng ngoài quy trình.",
    partnership:
      "Tham gia chương trình cộng tác viên để mua trên cùng khung hợp tác rõ ràng với House X.",
  },
  {
    role: "Truyền thông, HR, công đoàn, mạng lưới khu công nghiệp",
    context:
      "Bạn tiếp cận nhóm quan tâm nhà ở nhưng cần kênh sản phẩm và quy trình đáng tin cậy.",
    partnership:
      "Giới thiệu có kiểm chứng; đồng hành nội dung hoặc dự án khi hai bên phù hợp.",
  },
] as const;

export const CTV_AFFILIATE_WHO = {
  heading: "Đối tượng hợp tác",
  intro:
    "Chương trình không giới hạn môi giới bất động sản. Dưới đây là các nhóm đối tác thường gặp và cách hợp tác với House X.",
} as const;

export const CTV_AFFILIATE_RULES = {
  heading: "Quy trình tham gia",
  steps: [
    {
      title: "Đăng ký chương trình",
      desc: "Dành cho nhiều ngành nghề: tài chính, bảo hiểm, chứng khoán, môi giới độc lập, người có mạng lưới hoặc người mua.",
    },
    {
      title: "Định hướng hợp tác",
      desc: "Đội ngũ House X trao đổi cách giới thiệu hoặc mua phù hợp với vai trò của bạn, kèm hỗ trợ tư vấn khi cần.",
    },
    {
      title: "Bắt đầu giới thiệu, bán hoặc mua",
      desc: "Bạn chọn mức tham gia: chỉ giới thiệu, bán hàng liên kết, hoặc mua cho mình — trên khung hợp tác minh bạch.",
    },
  ],
  note: "Điều khoản hợp tác được trao đổi trực tiếp khi bạn tham gia — phù hợp từng trường hợp, không dựa trên thỏa thuận miệng ngoài quy trình.",
} as const;

export const CTV_AFFILIATE_BENEFITS = {
  heading: "Giá trị khi hợp tác trên nền tảng",
  forReferrers: {
    title: "Đối tác giới thiệu / cộng tác viên",
    items: [
      "Đóng góp được ghi nhận chính danh trên khung hợp tác rõ ràng.",
      "Có thể chỉ giới thiệu: House X hỗ trợ tư vấn và hoàn tất giao dịch.",
      "Người mua cũng tham gia cùng một chuẩn minh bạch — không ép giảm hoa hồng ngoài luồng.",
    ],
  },
  forPros: {
    title: "Chuyên gia tư vấn sâu",
    items: [
      "Giữ chuẩn tư vấn và đồng hành pháp lý — cạnh tranh bằng chuyên môn.",
      "Mạng lưới giới thiệu được House X ghi nhận có hệ thống.",
      "Làm việc trên cùng nền tảng dự án và nhà ở xã hội.",
    ],
  },
} as const;

export const CTV_AFFILIATE_COMPARE = {
  heading: "Hai cách hợp tác",
  oldModel: {
    title: "Thỏa thuận hoa hồng ngoài luồng",
    steps: [
      "Hoa hồng không được công bố rõ",
      "Áp lực giảm thù lao để chốt giao dịch",
      "Hỗ trợ sau giao dịch dễ bị cắt giảm",
      "Uy tín nghề và niềm tin khách hàng suy giảm",
    ],
  },
  newModel: {
    title: "Cộng tác viên House X",
    steps: [
      "Đăng ký tham gia chương trình",
      "Hợp tác theo khung minh bạch với House X",
      "Giới thiệu hoặc mua đúng kênh",
      "Tư vấn và pháp lý theo năng lực từng bên",
    ],
  },
} as const;

export const CTV_AFFILIATE_FAQS: readonly { question: string; answer: string }[] =
  [
    {
      question: "Ai có thể đăng ký cộng tác viên?",
      answer:
        "Người có nhu cầu giới thiệu, bán hàng liên kết hoặc mua qua House X — nhân viên ngân hàng, bảo hiểm, chứng khoán, môi giới độc lập, người có mạng lưới, hoặc người mua cho mình.",
    },
    {
      question: "Tôi có cần chứng chỉ môi giới không?",
      answer:
        "Không bắt buộc ngay từ đầu. Mức đồng hành có thể khác nhau tùy bạn tự tư vấn hay nhờ House X hỗ trợ — đội ngũ sẽ trao đổi khi bạn tham gia.",
    },
    {
      question: "Thưởng được thỏa thuận thế nào?",
      answer:
        "Theo thỏa thuận hợp tác rõ ràng với House X — không mặc cả miệng ngoài quy trình. Chi tiết phù hợp từng trường hợp khi bạn tham gia.",
    },
    {
      question: "Khác gì với chỉ đăng tin môi giới?",
      answer:
        "Đăng tin đưa sản phẩm lên sàn. Cộng tác viên là chương trình giới thiệu và bán hàng liên kết với House X — có thể làm cả hai nếu phù hợp.",
    },
    {
      question: "Tôi chỉ muốn giới thiệu người thân thì sao?",
      answer:
        "Được. Bạn giới thiệu đúng kênh; House X hỗ trợ tư vấn và hoàn tất giao dịch nếu bạn không muốn bán trực tiếp.",
    },
  ];

export const CTV_AFFILIATE_CTAS = {
  primary: {
    label: "Đăng ký cộng tác viên",
    href: "/dang-ky/moi-gioi?next=/moi-gioi/dang-ky-ctv",
  },
  secondary: {
    label: "Đã có tài khoản — tiếp tục đăng ký",
    href: "/moi-gioi/dang-ky-ctv",
  },
  tertiary: {
    label: "Tư vấn thêm",
    href: "/lien-he?goi=tu-van-cong-tac-vien#tu-van",
  },
  closing:
    "Chọn khung hợp tác minh bạch giúp nghề và khách hàng đi đường dài. Đăng ký để tham gia mạng lưới cộng tác viên House X, hoặc yêu cầu tư vấn thêm trước khi quyết định.",
} as const;

export const CTV_AFFILIATE_CLOSING_HEADING =
  "Sẵn sàng hợp tác với House X?" as const;

export const CTV_AFFILIATE_ARTICLES_SECTION = {
  heading: "Tài liệu chương trình",
  intro:
    "Bốn bài: bối cảnh thị trường hoa hồng, mô hình cộng tác viên, đối tượng hợp tác và hướng dẫn bắt đầu.",
} as const;
