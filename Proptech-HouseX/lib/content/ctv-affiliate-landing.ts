/**
 * Landing công khai CTV / bán hàng liên kết — `/affiliate-bat-dong-san`.
 * Giọng nền tảng B2B + chương trình đồng hành NOXH (SoT:
 * docs/ops/AFFILIATE_NOXH_PROGRAM_OPS.md).
 * Không công bố bảng % hoa hồng trên trang này — chi tiết trong tài khoản đối tác.
 */

export const CTV_AFFILIATE_PATH = "/affiliate-bat-dong-san" as const;

export const CTV_AFFILIATE_TITLE =
  "Cộng tác viên — đồng hành nhà ở xã hội với House X" as const;

export const CTV_AFFILIATE_SEO_TITLE =
  "Cộng tác viên NOXH — chọn cấp hợp tác theo từng giao dịch | House X" as const;

/** Meta description 70–160 ký tự. */
export const CTV_AFFILIATE_SEO_DESCRIPTION =
  "Chương trình cộng tác House X: đồng hành nhà ở xã hội, chọn cấp hợp tác linh hoạt theo từng giao dịch — minh bạch, không công bố thỏa thuận ngoài luồng." as const;

export const CTV_AFFILIATE_H1 =
  "Đồng hành cùng chương trình nhà ở quốc gia" as const;

export const CTV_AFFILIATE_LEAD =
  "House X mở khung cộng tác viên để bạn giới thiệu, tư vấn hoặc đồng hành hồ sơ nhà ở xã hội — linh hoạt theo từng giao dịch. Thông điệp: An cư - Vì bạn xứng đáng. Đơn vị đồng hành: Liên Đoàn Lao Động TP. Hồ Chí Minh." as const;

export const CTV_AFFILIATE_PAIN = {
  heading: "Vì sao cần khung hợp tác rõ?",
  body: [
    "Nhiều người có tệp khách hoặc người thân cần an cư nhưng ngại đóng vai môi giới, hoặc chưa biết chọn mức đồng hành nào cho từng trường hợp.",
    "House X cho phép bạn chọn cấp độ hợp tác trên mỗi giao dịch — từ chỉ giới thiệu lead đến đồng hành sâu — trên cùng một quy trình minh bạch, không mặc cả miệng ngoài hệ thống.",
  ],
} as const;

export type CtvPersonaCard = {
  role: string;
  context: string;
  partnership: string;
};

export const CTV_AFFILIATE_PERSONAS: readonly CtvPersonaCard[] = [
  {
    role: "Nhân sự, kế toán, bảo hiểm, ngân hàng, chứng khoán",
    context:
      "Bạn đang nắm tệp khách hoặc đồng nghiệp có nhu cầu an cư nhưng e ngại thủ tục và tài chính.",
    partnership:
      "Có thể chỉ giới thiệu lead để House X tư vấn và chốt; hoặc chọn mức đồng hành sâu hơn trên từng giao dịch.",
  },
  {
    role: "Sales ô tô, xe tải — môi giới tự do",
    context:
      "Khách mua xe hoặc tìm nhà thương mại thường có nhu cầu an cư chưa khép được.",
    partnership:
      "Cross-sale sang nhà ở xã hội trên khung hợp tác rõ — chọn cấp tư vấn hoặc đồng hành hồ sơ theo deal.",
  },
  {
    role: "Cán bộ công đoàn, HR, mạng lưới KCX–KCN",
    context:
      "Bạn gắn với người lao động cần mái ấm ổn định và thông tin chính thống.",
    partnership:
      "Làm cầu nối nhân văn: giới thiệu đúng kênh; House X hỗ trợ tư vấn và hồ sơ khi bạn không muốn bán trực tiếp.",
  },
  {
    role: "Người có quan hệ rộng, không muốn bán kiểu môi giới",
    context:
      "Người quen cần mua nhà; bạn ngại hoặc chậm, chỉ muốn giới thiệu.",
    partnership:
      "Chọn cấp giới thiệu trên giao dịch đó — House X tư vấn và hoàn tất; bạn theo dõi tiến độ trên hệ thống.",
  },
  {
    role: "Môi giới chuyên nghiệp (có hoặc đang hướng tới chứng chỉ)",
    context:
      "Bạn muốn làm sâu hồ sơ hoặc độc lập A–Z trên từng sản phẩm.",
    partnership:
      "Chọn cấp đồng hành hồ sơ hoặc tổng đại lý liên kết theo giao dịch — trong khung đối soát minh bạch của House X.",
  },
  {
    role: "Người mua cho chính mình",
    context:
      "Bạn muốn giao dịch rõ ràng, đồng hành hồ sơ nhà ở xã hội trên nền tảng có quy trình.",
    partnership:
      "Đăng ký cộng tác viên và chọn mức đồng hành phù hợp trên giao dịch của bạn.",
  },
] as const;

export const CTV_AFFILIATE_WHO = {
  heading: "Đối tượng hợp tác",
  intro:
    "Chương trình không giới hạn môi giới bất động sản. Bạn chọn cách hợp tác theo từng giao dịch — không bị gắn một cấp cố định cho cả tài khoản.",
} as const;

/** Bốn chế độ — thông điệp public (không nêu %). */
export const CTV_AFFILIATE_TIERS = {
  heading: "Bốn mức hợp tác — chọn theo từng giao dịch",
  lead: "Bạn không bị khóa một mức cố định. Với mỗi khách / dự án, hãy chọn cách đồng hành phù hợp tình huống bán của bạn.",
  items: [
    {
      name: "Cộng tác viên giới thiệu (Connector)",
      desc: "Chỉ kết nối khách quan tâm. House X tư vấn và xử lý chuyên sâu.",
    },
    {
      name: "Chuyên viên tư vấn đồng hành (Consultant)",
      desc: "Tư vấn nhu cầu ban đầu; phối hợp House X hoàn thiện hồ sơ.",
    },
    {
      name: "Đối tác phát triển dự án (Developer Partner)",
      desc: "Đồng hành hoàn tất thủ tục nhà ở xã hội — có đào tạo và hỗ trợ từ House X.",
    },
    {
      name: "Tổng đại lý liên kết (Master Broker)",
      desc: "Thực hiện quy trình độc lập hơn trên giao dịch — dành cho môi giới chuyên nghiệp đủ điều kiện.",
    },
  ],
  note: "Chi tiết quyền lợi và đối soát xem trong tài khoản đối tác sau khi tham gia — không thỏa thuận miệng ngoài hệ thống.",
} as const;

export const CTV_AFFILIATE_RULES = {
  heading: "Quy trình tham gia",
  steps: [
    {
      title: "Đăng ký cộng tác viên",
      desc: "Mở tài khoản đối tác trên House X — dành cho nhiều ngành nghề và người có mạng lưới.",
    },
    {
      title: "Kích hoạt khung hợp tác",
      desc: "Hoàn tất bước xét duyệt / thỏa thuận theo hướng dẫn. Chính sách chung công khai; chi tiết đối soát trong tài khoản.",
    },
    {
      title: "Khai báo từng giao dịch",
      desc: "Với mỗi lead: chọn khách, dự án quan tâm, và mức hợp tác phù hợp. House X bố trí hỗ trợ và theo dõi theo lựa chọn đó.",
    },
  ],
  note: "Tiến độ chăm sóc và kết quả được cập nhật trên hệ thống để bạn theo dõi. Hoa hồng tính sau khi có hợp đồng mua bán — theo cấp đã chọn trên giao dịch.",
} as const;

export const CTV_AFFILIATE_BENEFITS = {
  heading: "Giá trị khi hợp tác trên nền tảng",
  forReferrers: {
    title: "Khi bạn chỉ muốn giới thiệu",
    items: [
      "Chọn cấp giới thiệu trên giao dịch — không ép bán kiểu môi giới.",
      "House X tư vấn và chốt; bạn theo dõi tiến độ trên hệ thống.",
      "Ghi nhận chính danh, đối soát rõ — không thỏa thuận miệng ngoài luồng.",
    ],
  },
  forPros: {
    title: "Khi bạn muốn đồng hành sâu hơn",
    items: [
      "Chọn cấp tư vấn hoặc đồng hành hồ sơ theo từng deal.",
      "Công cụ, đào tạo và quy trình nhà ở xã hội trên cùng nền tảng.",
      "Linh hoạt: deal này giới thiệu, deal khác làm sâu — cùng một tài khoản.",
    ],
  },
} as const;

export const CTV_AFFILIATE_COMPARE = {
  heading: "Hai cách hợp tác",
  oldModel: {
    title: "Thỏa thuận ngoài luồng",
    steps: [
      "Hoa hồng không được ghi nhận rõ trên hệ thống",
      "Áp lực giảm thù lao để chốt giao dịch",
      "Khó theo dõi tiến độ sau khi giới thiệu",
      "Uy tín nghề và niềm tin khách hàng suy giảm",
    ],
  },
  newModel: {
    title: "Cộng tác viên House X",
    steps: [
      "Đăng ký và kích hoạt khung hợp tác",
      "Mỗi giao dịch: chọn khách, dự án, cấp hợp tác",
      "Theo dõi tiến độ chăm sóc trên hệ thống",
      "Đối soát sau hợp đồng mua bán — trong tài khoản đối tác",
    ],
  },
} as const;

export const CTV_AFFILIATE_FAQS: readonly { question: string; answer: string }[] =
  [
    {
      question: "Ai có thể đăng ký cộng tác viên?",
      answer:
        "Người muốn giới thiệu, tư vấn hoặc đồng hành hồ sơ nhà ở xã hội với House X — nhân sự tài chính, sales, công đoàn, môi giới, người có mạng lưới, hoặc người mua cho mình.",
    },
    {
      question: "Tôi có bị gắn một cấp cố định không?",
      answer:
        "Không. Bạn chọn cấp độ hợp tác cho từng giao dịch — ví dụ chỉ giới thiệu lead để House X tư vấn và chốt, hoặc đồng hành sâu hồ sơ trên deal khác.",
    },
    {
      question: "Tôi có cần chứng chỉ môi giới không?",
      answer:
        "Không bắt buộc để bắt đầu ở mức giới thiệu. Các mức đồng hành sâu hơn có thể yêu cầu đào tạo hoặc điều kiện nghề — đội ngũ trao đổi khi bạn tham gia.",
    },
    {
      question: "Thưởng và hoa hồng công bố thế nào?",
      answer:
        "Chính sách chung (cấp hợp tác, quy trình) công khai trên chương trình. Mức chi tiết xem trong tài khoản đối tác sau khi tham gia — không mặc cả miệng ngoài hệ thống.",
    },
    {
      question: "Tôi chỉ muốn giới thiệu người quen thì sao?",
      answer:
        "Chọn cấp giới thiệu trên giao dịch đó: khai báo khách và dự án quan tâm; House X tư vấn và hoàn tất. Bạn theo dõi tiến độ trên hệ thống.",
    },
    {
      question: "Liên Đoàn Lao Động TP.HCM đóng vai trò gì?",
      answer:
        "Là đơn vị đồng hành của chương trình hướng tới an cư cho người lao động. House X vận hành nền tảng cộng tác và quy trình đối tác.",
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
    "Chọn cấp hợp tác linh hoạt theo từng giao dịch — minh bạch trên House X. Đăng ký cộng tác viên hoặc yêu cầu tư vấn trước khi quyết định.",
} as const;

export const CTV_AFFILIATE_CLOSING_HEADING =
  "Sẵn sàng đồng hành nhà ở xã hội với House X?" as const;

export const CTV_AFFILIATE_ARTICLES_SECTION = {
  heading: "Tài liệu chương trình",
  intro:
    "Đọc trước khi đăng ký: hiểu khung hợp tác, cách chọn cấp theo giao dịch, và các bước bắt đầu phù hợp với vai trò của bạn.",
} as const;
