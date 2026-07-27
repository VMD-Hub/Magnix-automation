/**
 * Landing công khai CTV / bán hàng liên kết — `/affiliate-bat-dong-san`.
 * Không công bố bảng hoa hồng theo cấp (admin / sau hồ sơ).
 */

export const CTV_AFFILIATE_PATH = "/affiliate-bat-dong-san" as const;

export const CTV_AFFILIATE_TITLE =
  "Cộng tác viên bất động sản — hợp tác minh bạch với House X" as const;

export const CTV_AFFILIATE_SEO_TITLE =
  "Cộng tác viên BĐS minh bạch — tránh cắt máu hoa hồng | House X" as const;

/** Meta description 70–160 ký tự. */
export const CTV_AFFILIATE_SEO_DESCRIPTION =
  "Đăng ký cộng tác viên House X: giới thiệu khách, bán hàng liên kết hoặc mua cho mình — cơ chế hoa hồng sau khi hoàn tất hồ sơ, không đua cắt máu." as const;

export const CTV_AFFILIATE_H1 =
  "Kiếm tiền và hợp tác minh bạch từ bất động sản — cộng tác viên House X" as const;

export const CTV_AFFILIATE_LEAD =
  "Cuộc đua cắt hoa hồng (“cắt máu”) không giúp ai giàu bền vững: môi giới mất giá trị nghề, khách tưởng hời rồi mất hậu mãi. House X mở đường cộng tác viên / bán hàng liên kết — đăng ký, hoàn tất hồ sơ, rồi mới được xem cơ chế thưởng rõ ràng." as const;

export const CTV_AFFILIATE_PAIN = {
  heading: "Vòng xoáy cắt máu: khi nghề tự thắt nút quanh cổ mình",
  body: [
    "Để chốt deal, nhiều người chấp nhận trả lại phần lớn hoa hồng cá nhân cho khách. Khách nghĩ mình được “hời”; người bán nghĩ mình “linh hoạt”. Thực tế cả hai thường lỗ về niềm tin.",
    "Ai đã cắt máu thường bù lại bằng cách bỏ rơi sau ký, mập mờ phí hồ sơ, hoặc không đồng hành pháp lý. Khách chịu rủi ro; người làm nghề mang danh rẻ rúng. Đua xuống đáy không phải chiến lược — đó là vòng xoáy.",
  ],
} as const;

export type CtvPersonaCard = {
  role: string;
  pain: string;
  onHouseX: string;
};

export const CTV_AFFILIATE_PERSONAS: readonly CtvPersonaCard[] = [
  {
    role: "Nhân viên ngân hàng, bảo hiểm, chứng khoán",
    pain: "Khách tin bạn về tài chính nhưng hỏi nhà / NOXH — bạn không muốn đóng vai “cò cắt máu”.",
    onHouseX:
      "Giới thiệu đúng kênh sau khi có mã; House X hỗ trợ tư vấn sản phẩm tùy mức sau duyệt. Bạn giữ vai trò người tin cậy.",
  },
  {
    role: "Môi giới bất động sản tự do",
    pain: "Bị kéo vào đua cắt máu; mất giá trị tư vấn và hậu mãi.",
    onHouseX:
      "Bán trên nền tảng có quy trình claim; cạnh tranh bằng chuyên môn pháp lý — không bằng ai cắt nhiều hơn.",
  },
  {
    role: "Người có mạng lưới nhưng ngại bán",
    pain: "Người thân muốn mua; bạn ngại ra mặt tư vấn và sợ bị kéo vào mặc cả hoa hồng.",
    onHouseX:
      "Chỉ giới thiệu; House X hỗ trợ tư vấn và chốt theo quy trình sau duyệt.",
  },
  {
    role: "Người mua cho chính mình",
    pain: "Không muốn ép môi giới cắt máu; cũng không tin “bớt lộc” thiếu minh bạch.",
    onHouseX:
      "Đi cùng luật chơi CTV — thưởng / ưu đãi (nếu có) theo hồ sơ sau duyệt, không thỏa thuận miệng ngoài luồng.",
  },
  {
    role: "Truyền thông, HR, công đoàn, mạng lưới KCN",
    pain: "Có đối tượng quan tâm nhà ở nhưng thiếu kênh sản phẩm và quy trình sạch.",
    onHouseX:
      "Giới thiệu có kiểm chứng; gắn mã sau duyệt; đồng hành nội dung / dự án khi phù hợp.",
  },
] as const;

export const CTV_AFFILIATE_WHO = {
  heading: "Ai có thể tham gia? Chân dung đối tác",
  intro:
    "Không chỉ môi giới bất động sản. Đối chiếu chân dung dưới đây — rồi đăng ký và hoàn tất hồ sơ.",
} as const;

export const CTV_AFFILIATE_RULES = {
  heading: "Luật chơi: đăng ký trước — cơ chế thưởng sau hồ sơ",
  steps: [
    {
      title: "Tạo tài khoản cộng tác viên",
      desc: "Đăng ký tài khoản bán hàng liên kết trên House X (không cần tự nhận là “cò” để được tham gia).",
    },
    {
      title: "Nộp và hoàn tất hồ sơ CTV",
      desc: "Khai báo vùng làm việc, kinh nghiệm, động lực; tham gia khóa hội nhập khi được yêu cầu.",
    },
    {
      title: "Được duyệt và nhận mã",
      desc: "Admin duyệt hồ sơ đủ điều kiện, cấp mã cộng tác viên — lúc này mới mở cơ chế hoa hồng chi tiết.",
    },
    {
      title: "Giới thiệu, bán hoặc mua qua hệ thống",
      desc: "Lead gắn mã của bạn; mức thưởng và mức hỗ trợ từ House X phụ thuộc năng lực và chứng chỉ — xem trong tài khoản sau duyệt, không công bố bảng công khai.",
    },
  ],
  note: "House X không công bố bảng hoa hồng trên trang này. Cơ chế đầy đủ chỉ chia sẻ sau khi hồ sơ được duyệt.",
} as const;

export const CTV_AFFILIATE_BENEFITS = {
  heading: "Lợi ích khi đi đường minh bạch",
  forReferrers: {
    title: "Người giới thiệu / cộng tác viên",
    items: [
      "Thưởng theo quy trình có hồ sơ — không kỳ kèo “bớt lộc” ngoài luồng.",
      "Có thể chỉ giới thiệu: House X hỗ trợ tư vấn và chốt tùy mức bạn chọn sau duyệt.",
      "Mua cho chính mình cũng đi cùng một luật chơi rõ ràng, không ép ai cắt máu.",
    ],
  },
  forPros: {
    title: "Người làm chuyên sâu",
    items: [
      "Giữ giá trị tư vấn và hồ sơ pháp lý — không phải danh “cò cắt máu”.",
      "Tập trung chuyên môn; mạng lưới giới thiệu được hệ thống ghi nhận.",
      "Làm việc trên cùng nền tảng dự án, NOXH và quy trình claim rõ ràng.",
    ],
  },
} as const;

export const CTV_AFFILIATE_COMPARE = {
  heading: "Hai mô hình — hai kết cục",
  oldModel: {
    title: "Cắt máu ngoài luồng",
    steps: [
      "Giấu hoặc mập mờ về hoa hồng",
      "Khách ép cắt — môi giới đua giảm",
      "Bỏ rơi / phí hồ sơ mập mờ sau ký",
      "Cả hai mất niềm tin",
    ],
  },
  newModel: {
    title: "Cộng tác viên House X",
    steps: [
      "Đăng ký và hoàn tất hồ sơ",
      "Cơ chế thưởng trong hệ thống (sau duyệt)",
      "Giới thiệu hoặc mua đúng kênh",
      "Tư vấn / pháp lý theo năng lực — win-win",
    ],
  },
} as const;

export const CTV_AFFILIATE_FAQS: readonly { question: string; answer: string }[] =
  [
    {
      question: "Ai được đăng ký cộng tác viên?",
      answer:
        "Bất kỳ ai có nhu cầu giới thiệu, bán hàng liên kết hoặc mua qua House X — nhân viên ngân hàng, bảo hiểm, chứng khoán, môi giới tự do, người có mạng lưới, hoặc người mua cho mình. Điều kiện chi tiết và duyệt hồ sơ do House X xác nhận sau khi bạn nộp đơn.",
    },
    {
      question: "Tôi có cần chứng chỉ môi giới không?",
      answer:
        "Không bắt buộc ngay từ đầu để đăng ký quan tâm. Mức hỗ trợ và cơ chế thưởng sau duyệt có thể khác nhau tùy bạn tự tư vấn/chốt hay nhờ House X hỗ trợ, và tùy chứng chỉ — chi tiết chỉ mở trong tài khoản sau khi hồ sơ được duyệt.",
    },
    {
      question: "Khi nào tôi biết mức hoa hồng?",
      answer:
        "Sau khi hoàn tất hồ sơ đăng ký và được admin duyệt. Trang công khai không đăng bảng số hay cấp thưởng — tránh hiểu nhầm và giữ đúng quy trình nội bộ.",
    },
    {
      question: "Khác gì với chỉ đăng tin môi giới?",
      answer:
        "Đăng tin giúp bạn đưa sản phẩm lên sàn. Chương trình cộng tác viên gắn mã giới thiệu, claim lead/dự án và hoa hồng theo quy trình House X. Bạn có thể làm cả hai sau khi đủ điều kiện tài khoản.",
    },
    {
      question: "Tôi chỉ muốn giới thiệu người thân thì sao?",
      answer:
        "Được. Đăng ký cộng tác viên, hoàn tất hồ sơ; sau duyệt bạn giới thiệu đúng kênh và để House X hỗ trợ tư vấn/chốt nếu bạn không muốn đóng vai bán hàng.",
    },
  ];

export const CTV_AFFILIATE_CTAS = {
  primary: {
    label: "Đăng ký tài khoản cộng tác viên",
    href: "/dang-ky/moi-gioi?next=/moi-gioi/dang-ky-ctv",
  },
  secondary: {
    label: "Đã có tài khoản — nộp hồ sơ CTV",
    href: "/moi-gioi/dang-ky-ctv",
  },
  tertiary: {
    label: "Liên hệ hỏi chương trình",
    href: "/lien-he",
  },
  closing:
    "Thị trường đang thanh lọc chiêu chụp giật và đua cắt máu. Minh bạch và chia sẻ đúng việc, đúng người — qua hồ sơ và hệ thống — mới đi được đường dài. Đăng ký hôm nay; bảng cơ chế chi tiết sẽ mở sau khi hồ sơ của bạn được duyệt.",
} as const;

export const CTV_AFFILIATE_CLOSING_HEADING = "Sẵn sàng đi đường minh bạch?" as const;

export const CTV_AFFILIATE_ARTICLES_SECTION = {
  heading: "Bài viết chuyên mục cộng tác viên",
  intro:
    "Bốn bài: hiểu cắt máu, mô hình CTV, chân dung đối tác và hướng dẫn đăng ký — đọc đúng nhu cầu trước khi nộp hồ sơ.",
} as const;
