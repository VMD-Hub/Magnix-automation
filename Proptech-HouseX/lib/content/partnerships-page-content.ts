/** Trang Hợp tác & Đăng tin — song ngữ VN/EN. */

export type BilingualLine = { vi: string; en: string };

export type PartnershipProcessStep = {
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
};

export const PARTNERSHIPS_PAGE = {
  metaTitle: "Hợp tác & Đăng tin",
  metaDescription:
    "House X hỗ trợ môi giới và chủ nhà đăng tin chất lượng, tiếp cận đúng khách hàng, bảo vệ liên hệ và tăng hiệu quả hợp tác trên nền tảng bất động sản.",

  kickerVi: "Hợp tác & Đăng tin",
  kickerEn: "Partnerships & Listing Submission",

  h1Vi: "Hợp tác & Đăng tin",
  h1En: "Partnerships & Listing Submission",

  heroSubtitleVi: "Đưa bất động sản của bạn đến đúng người đang tìm kiếm",
  heroSubtitleEn: "Put your property in front of the right buyers and renters",

  heroIntroVi:
    "House X là nền tảng hợp tác dành cho môi giới và chủ nhà muốn đăng tin chất lượng, tiếp cận đúng khách hàng và xây dựng niềm tin thông qua thông tin rõ ràng, minh bạch, an toàn.",
  heroIntroEn:
    "House X is a partnership platform for brokers and property owners who want to publish quality listings, reach the right audience, and build trust through clear, transparent, and secure information.",

  heroLeadVi:
    "House X giúp môi giới và chủ nhà đăng tin chất lượng, tiếp cận đúng khách hàng và giảm nhiễu từ các tin trùng lặp, sai lệch thông tin. Với quy trình kiểm duyệt minh bạch và công nghệ bảo vệ liên hệ, chúng tôi tạo ra một môi trường đăng tin chuyên nghiệp, an toàn và hiệu quả hơn cho cả người đăng lẫn người tìm nhà.",
  heroLeadEn:
    "House X helps brokers and property owners publish high-quality listings, reach the right audience, and reduce noise from duplicate or inaccurate content. With transparent moderation and protected contact details, we create a more professional, secure, and effective listing environment for both listers and property seekers.",

  brokers: {
    headingVi: "Dành cho môi giới",
    headingEn: "For brokers",
    introVi:
      "Nếu bạn là môi giới, House X là nơi giúp bạn giới thiệu sản phẩm rõ ràng hơn và tạo niềm tin tốt hơn với khách hàng tiềm năng. Tin đăng được trình bày theo tiêu chuẩn thống nhất, giúp thông tin nổi bật hơn và dễ so sánh hơn.",
    introEn:
      "If you are a broker, House X helps you present your properties more clearly and build stronger trust with potential clients. Listings follow a consistent format, making your properties easier to compare and more visible.",
    benefitsLabelVi: "Lợi ích cho môi giới",
    benefitsLabelEn: "Benefits for brokers",
    benefits: [
      {
        vi: "Tiếp cận đúng nhóm khách hàng đang có nhu cầu thực.",
        en: "Reach the right audience with genuine demand.",
      },
      {
        vi: "Tăng độ tin cậy nhờ quy trình kiểm duyệt nội dung rõ ràng.",
        en: "Build trust through a clear content moderation process.",
      },
      {
        vi: "Giảm tình trạng tin trùng, tin nhiễu, tin thiếu thông tin.",
        en: "Reduce duplicate, noisy, or incomplete listings.",
      },
      {
        vi: "Hỗ trợ bảo vệ số điện thoại và thông tin liên hệ.",
        en: "Benefit from contact protection for phone numbers and personal details.",
      },
      {
        vi: "Có cơ hội tham gia chương trình cộng tác viên và các hoạt động hợp tác lâu dài.",
        en: "Join our collaborator program and long-term partnership opportunities.",
      },
    ] satisfies BilingualLine[],
  },

  owners: {
    headingVi: "Dành cho chủ nhà",
    headingEn: "For property owners",
    introVi:
      "Nếu bạn là chủ nhà, House X giúp bạn giới thiệu bất động sản của mình một cách rõ ràng, minh bạch và dễ tiếp cận hơn. Chúng tôi ưu tiên trải nghiệm an toàn cho người xem, đồng thời giúp bạn nhận được phản hồi từ đúng người quan tâm thật sự.",
    introEn:
      "If you are a property owner, House X helps you present your property in a clear, transparent, and accessible way. We prioritize a safe experience for viewers while helping you connect with genuinely interested prospects.",
    benefitsLabelVi: "Lợi ích cho chủ nhà",
    benefitsLabelEn: "Benefits for owners",
    benefits: [
      {
        vi: "Đăng tin dễ hiểu, dễ nhìn, dễ tiếp cận.",
        en: "Publish listings that are easy to understand, view, and access.",
      },
      {
        vi: "Hiển thị thông tin rõ ràng hơn để giảm đi xem oan.",
        en: "Show clearer information and reduce unnecessary viewings.",
      },
      {
        vi: "Hạn chế lộ số điện thoại tràn lan.",
        en: "Minimize uncontrolled exposure of your phone number.",
      },
      {
        vi: "Tăng khả năng kết nối với khách hàng nghiêm túc.",
        en: "Improve your chances of connecting with serious buyers or renters.",
      },
      {
        vi: "Có thể được hỗ trợ chuẩn hóa nội dung tin đăng theo tiêu chuẩn House X.",
        en: "Get support to standardize your listing content according to House X guidelines.",
      },
    ] satisfies BilingualLine[],
  },

  whyPartner: {
    headingVi: "Vì sao nên hợp tác với House X?",
    headingEn: "Why partner with House X?",
    introVi:
      "House X không chỉ là một nơi đăng tin, mà là một nền tảng tập trung vào chất lượng thông tin. Chúng tôi tin rằng bất động sản chỉ thực sự có giá trị khi người xem hiểu đúng sản phẩm trước khi quyết định liên hệ.",
    introEn:
      "House X is more than a listing platform — it is a platform focused on information quality. We believe real estate becomes truly valuable only when users understand the property clearly before deciding to make contact.",
    benefitsLabelVi: "Chúng tôi mang lại cho đối tác",
    benefitsLabelEn: "We provide partners with",
    benefits: [
      { vi: "Môi trường đăng tin minh bạch.", en: "A transparent listing environment." },
      { vi: "Tiêu chuẩn nội dung rõ ràng.", en: "Clear content standards." },
      { vi: "Quy trình kiểm duyệt công bằng.", en: "Fair moderation procedures." },
      {
        vi: "Công nghệ hỗ trợ phân phối tin tốt hơn.",
        en: "Technology that helps listings reach more relevant users.",
      },
      {
        vi: "Trải nghiệm liên hệ an toàn hơn cho cả hai phía.",
        en: "Safer contact experiences for both sides.",
      },
    ] satisfies BilingualLine[],
  },

  process: {
    headingVi: "Quy trình hợp tác",
    headingEn: "Partnership process",
    introVi: "Chúng tôi thiết kế quy trình hợp tác đơn giản, nhanh và dễ theo dõi.",
    introEn: "We designed the partnership process to be simple, fast, and easy to follow.",
    steps: [
      {
        titleVi: "Đăng ký thông tin",
        titleEn: "Submit your information",
        descVi: "Gửi thông tin cơ bản của bạn qua form hợp tác hoặc form đăng tin.",
        descEn: "Send your basic details through the partnership or listing form.",
      },
      {
        titleVi: "Xác minh và phân loại",
        titleEn: "Verification and classification",
        descVi:
          "House X xem xét loại hình hợp tác phù hợp: môi giới, chủ nhà, cộng tác viên hoặc đối tác nội dung.",
        descEn:
          "House X reviews the most suitable partnership type: broker, property owner, collaborator, or content partner.",
      },
      {
        titleVi: "Chuẩn hóa nội dung",
        titleEn: "Content standardization",
        descVi:
          "Nếu cần, đội ngũ House X sẽ hỗ trợ chuẩn hóa tiêu đề, mô tả, hình ảnh và thông tin hiển thị.",
        descEn:
          "If needed, our team will help standardize the title, description, images, and displayed information.",
      },
      {
        titleVi: "Đăng tin và kiểm duyệt",
        titleEn: "Listing submission and moderation",
        descVi:
          "Tin đăng được xét duyệt theo tiêu chuẩn nội dung và hiển thị trên nền tảng sau khi đạt yêu cầu.",
        descEn:
          "Listings are reviewed against our content standards and published once approved.",
      },
      {
        titleVi: "Theo dõi hiệu quả",
        titleEn: "Performance tracking",
        descVi:
          "Bạn có thể theo dõi phản hồi và điều chỉnh nội dung để cải thiện chất lượng tin.",
        descEn:
          "You can monitor responses and refine your content to improve listing performance.",
      },
    ] satisfies PartnershipProcessStep[],
  },

  standards: {
    headingVi: "Tiêu chuẩn đăng tin",
    headingEn: "Listing standards",
    introVi:
      "Để đảm bảo trải nghiệm tốt cho người dùng, House X khuyến khích các tin đăng:",
    introEn: "To ensure a better user experience, House X encourages listings that:",
    bullets: [
      { vi: "Có hình ảnh thật và rõ ràng.", en: "Include real and clear photos." },
      {
        vi: "Mô tả chính xác về vị trí, giá và đặc điểm bất động sản.",
        en: "Describe the location, price, and property features accurately.",
      },
      { vi: "Không trùng lặp nội dung.", en: "Avoid duplicate content." },
      { vi: "Không sử dụng thông tin gây hiểu nhầm.", en: "Do not use misleading information." },
      {
        vi: "Tuân thủ quy định pháp luật và chính sách của House X.",
        en: "Comply with applicable laws and House X policies.",
      },
    ] satisfies BilingualLine[],
    methodologyHref: "/gioi-thieu/phuong-phap-bien-tap",
  },

  ctv: {
    headingVi: "Chương trình cộng tác viên",
    headingEn: "Collaborator program",
    introVi:
      "Nếu bạn muốn tham gia sâu hơn vào hệ sinh thái House X, hãy xem chương trình cộng tác viên của chúng tôi. Đây là cơ hội dành cho những cá nhân hoặc tổ chức muốn giới thiệu, kết nối hoặc hỗ trợ lan tỏa sản phẩm chất lượng trong thị trường bất động sản.",
    introEn:
      "If you want to get more involved in the House X ecosystem, explore our collaborator program. It is designed for individuals or organizations that want to introduce, connect, or help promote quality properties in the real estate market.",
    suitableLabelVi: "Phù hợp với",
    suitableLabelEn: "Suitable for",
    suitableFor: [
      { vi: "Người làm bất động sản.", en: "Real estate professionals." },
      { vi: "Người có mạng lưới khách hàng phù hợp.", en: "People with a relevant client network." },
      { vi: "Đối tác truyền thông hoặc nội dung.", en: "Media or content partners." },
      {
        vi: "Cá nhân muốn tham gia giới thiệu sản phẩm đúng nhu cầu.",
        en: "Individuals interested in promoting listings to the right audience.",
      },
    ] satisfies BilingualLine[],
    href: "/moi-gioi/dang-ky-ctv",
  },

  contact: {
    headingVi: "Liên hệ hợp tác",
    headingEn: "Contact us",
    introVi:
      "Bạn có thể đăng ký hợp tác hoặc đăng tin trực tiếp qua biểu mẫu của House X. Nếu cần trao đổi thêm về nhu cầu riêng, đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ.",
    introEn:
      "You can apply for partnership or submit a listing directly through House X’s form. If you need to discuss specific needs, our team is ready to help.",
  },

  ctas: [
    { labelVi: "Đăng ký đăng tin", labelEn: "Submit a listing", href: "/dang-ky/moi-gioi" },
    { labelVi: "Đăng ký hợp tác", labelEn: "Apply for partnership", href: "/lien-he" },
    {
      labelVi: "Tìm hiểu chương trình CTV",
      labelEn: "Learn about the collaborator program",
      href: "/moi-gioi/dang-ky-ctv",
    },
  ],
} as const;
