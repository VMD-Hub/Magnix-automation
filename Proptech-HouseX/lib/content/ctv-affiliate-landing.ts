/**
 * Landing công khai CTV / bán hàng liên kết — `/affiliate-bat-dong-san`.
 * Copy người đọc: không lộ thuật ngữ vận hành (mã, claim, hội nhập, duyệt…).
 */

export const CTV_AFFILIATE_PATH = "/affiliate-bat-dong-san" as const;

export const CTV_AFFILIATE_TITLE =
  "Cộng tác viên bất động sản — hợp tác minh bạch với House X" as const;

export const CTV_AFFILIATE_SEO_TITLE =
  "Cộng tác viên BĐS minh bạch — tránh cắt máu hoa hồng | House X" as const;

/** Meta description 70–160 ký tự. */
export const CTV_AFFILIATE_SEO_DESCRIPTION =
  "Đăng ký cộng tác viên House X: giới thiệu khách, bán hàng liên kết hoặc mua cho mình — hợp tác minh bạch, không đua cắt máu hoa hồng." as const;

export const CTV_AFFILIATE_H1 =
  "Kiếm tiền và hợp tác minh bạch từ bất động sản — cộng tác viên House X" as const;

export const CTV_AFFILIATE_LEAD =
  "Cuộc đua cắt hoa hồng (“cắt máu”) không giúp ai giàu bền vững: môi giới mất giá trị nghề, khách tưởng hời rồi mất hậu mãi. House X mở đường cộng tác viên — giới thiệu, bán hoặc mua trên luật chơi rõ ràng, không đua cắt máu ngoài luồng." as const;

export const CTV_AFFILIATE_PAIN = {
  heading: "Vòng xoáy cắt máu: khi nghề tự thắt nút quanh cổ mình",
  body: [
    "Để chốt deal, nhiều người chấp nhận trả lại phần lớn hoa hồng cá nhân cho khách. Khách nghĩ mình được “hời”; người bán nghĩ mình “linh hoạt”. Thực tế cả hai thường lỗ về niềm tin.",
    "Ai đã cắt máu thường bù lại bằng cách bỏ rơi sau ký, thu phí dịch vụ mập mờ, hoặc không đồng hành pháp lý. Khách chịu rủi ro; người làm nghề mang danh rẻ rúng. Đua xuống đáy không phải chiến lược — đó là vòng xoáy.",
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
      "Bạn giới thiệu đúng chỗ; House X tư vấn sản phẩm. Bạn vẫn là người khách tin tưởng.",
  },
  {
    role: "Môi giới bất động sản tự do",
    pain: "Bị kéo vào đua cắt máu; mất giá trị tư vấn và hậu mãi.",
    onHouseX:
      "Cạnh tranh bằng chuyên môn và đồng hành pháp lý — không bằng ai cắt hoa hồng nhiều hơn.",
  },
  {
    role: "Người có mạng lưới nhưng ngại bán",
    pain: "Người thân muốn mua; bạn ngại ra mặt tư vấn và sợ bị kéo vào mặc cả hoa hồng.",
    onHouseX:
      "Bạn chỉ cần giới thiệu; House X hỗ trợ tư vấn và chốt. Không buộc phải đóng vai môi giới.",
  },
  {
    role: "Người mua cho chính mình",
    pain: "Không muốn ép môi giới cắt máu; cũng không tin “bớt lộc” thiếu minh bạch.",
    onHouseX:
      "Mua qua chương trình cộng tác viên — rõ ràng, không thỏa thuận miệng ngoài luồng.",
  },
  {
    role: "Truyền thông, HR, công đoàn, mạng lưới KCN",
    pain: "Có người quan tâm nhà ở nhưng thiếu kênh sản phẩm đáng tin.",
    onHouseX:
      "Giới thiệu có kiểm chứng; đồng hành nội dung hoặc dự án khi phù hợp.",
  },
] as const;

export const CTV_AFFILIATE_WHO = {
  heading: "Ai có thể tham gia?",
  intro:
    "Không chỉ môi giới bất động sản. Đối chiếu chân dung dưới đây — rồi đăng ký tham gia.",
} as const;

export const CTV_AFFILIATE_RULES = {
  heading: "Bắt đầu như thế nào?",
  steps: [
    {
      title: "Đăng ký tham gia",
      desc: "Mở cho nhiều ngành nghề — ngân hàng, bảo hiểm, chứng khoán, môi giới tự do, người có mạng lưới hoặc tự mua.",
    },
    {
      title: "House X đồng hành hướng dẫn",
      desc: "Đội ngũ liên hệ, giải thích cách giới thiệu hoặc mua, và cách nhận hỗ trợ tư vấn khi cần.",
    },
    {
      title: "Giới thiệu, bán hoặc mua",
      desc: "Bạn chọn mức tham gia phù hợp: chỉ giới thiệu, bán hàng liên kết, hoặc mua cho mình — minh bạch, không đua cắt máu.",
    },
  ],
  note: "Chi tiết hợp tác được trao đổi trực tiếp khi bạn tham gia — rõ ràng với từng người, không dựa vào thỏa thuận miệng ngoài luồng.",
} as const;

export const CTV_AFFILIATE_BENEFITS = {
  heading: "Lợi ích khi đi đường minh bạch",
  forReferrers: {
    title: "Người giới thiệu / cộng tác viên",
    items: [
      "Được ghi nhận đóng góp một cách chính danh — không kỳ kèo “bớt lộc” ngoài luồng.",
      "Có thể chỉ giới thiệu: House X hỗ trợ tư vấn và chốt.",
      "Mua cho chính mình cũng đi cùng luật chơi rõ ràng, không ép ai cắt máu.",
    ],
  },
  forPros: {
    title: "Người làm chuyên sâu",
    items: [
      "Giữ giá trị tư vấn và đồng hành pháp lý — không mang danh “cò cắt máu”.",
      "Tập trung chuyên môn; mạng lưới giới thiệu được House X ghi nhận.",
      "Làm việc trên cùng nền tảng dự án và nhà ở xã hội.",
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
      "Bỏ rơi / phí dịch vụ mập mờ sau ký",
      "Cả hai mất niềm tin",
    ],
  },
  newModel: {
    title: "Cộng tác viên House X",
    steps: [
      "Đăng ký tham gia chương trình",
      "Hợp tác minh bạch với House X",
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
        "Ai có nhu cầu giới thiệu, bán hàng liên kết hoặc mua qua House X — nhân viên ngân hàng, bảo hiểm, chứng khoán, môi giới tự do, người có mạng lưới, hoặc người mua cho mình.",
    },
    {
      question: "Tôi có cần chứng chỉ môi giới không?",
      answer:
        "Không bắt buộc ngay từ đầu. Cách đồng hành có thể khác nhau tùy bạn tự tư vấn hay nhờ House X hỗ trợ — đội ngũ sẽ trao đổi khi bạn tham gia.",
    },
    {
      question: "Thưởng được thỏa thuận thế nào?",
      answer:
        "Theo thỏa thuận hợp tác rõ ràng với House X — không mặc cả “bớt lộc” miệng ngoài luồng. Chi tiết phù hợp từng trường hợp khi bạn tham gia.",
    },
    {
      question: "Khác gì với chỉ đăng tin môi giới?",
      answer:
        "Đăng tin đưa sản phẩm lên sàn. Cộng tác viên là chương trình giới thiệu và bán hàng liên kết với House X — có thể làm cả hai nếu phù hợp.",
    },
    {
      question: "Tôi chỉ muốn giới thiệu người thân thì sao?",
      answer:
        "Được. Bạn giới thiệu đúng kênh; House X hỗ trợ tư vấn và chốt nếu bạn không muốn đóng vai bán hàng.",
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
    "Thị trường đang thanh lọc chiêu chụp giật và đua cắt máu. Minh bạch và chia sẻ đúng việc, đúng người mới đi được đường dài. Đăng ký hôm nay để tham gia mạng lưới cộng tác viên House X.",
} as const;

export const CTV_AFFILIATE_CLOSING_HEADING = "Sẵn sàng đi đường minh bạch?" as const;

export const CTV_AFFILIATE_ARTICLES_SECTION = {
  heading: "Đọc thêm về cộng tác viên",
  intro:
    "Bốn bài: hiểu cắt máu, mô hình cộng tác viên, chân dung đối tác và cách bắt đầu — chọn đúng góc trước khi đăng ký.",
} as const;
