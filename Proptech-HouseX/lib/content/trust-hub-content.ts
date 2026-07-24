/**
 * Nội dung trang tin cậy / corporate — About mở rộng, FAQ hub, hợp tác, pháp lý.
 * Giọng văn: cụ thể, trung thực với giai đoạn sản phẩm hiện tại.
 */

import type { RichFaqItem } from "@/lib/content/faq-content";

export const BRAND_STORY = {
  metaTitle: "Câu chuyện House X — cổng Proptech",
  metaDescription:
    "Từ một buổi chiều mưa ở Sài Gòn đến House X: cổng Proptech đặt người mua làm trung tâm — thông tin chuẩn, sản phẩm thật, kiểm duyệt minh bạch.",
  title: "Câu chuyện thương hiệu",
  subtitle: "Hành trình hình thành House X",
  pullQuote: {
    text: "Chỉ cần một nơi nào đó mà mọi thứ rõ ràng—ảnh thật, giá thật, và khi chúng tôi gọi thì là người bán thật.",
    attribution: "Một cặp vợ chồng trẻ, Sài Gòn",
  },
  /** Toàn bộ narrative — render tuần tự trên trang Câu chuyện. */
  narrative: [
    "Có một lần, trong một buổi chiều mưa ở Sài Gòn, tôi theo một cặp vợ chồng trẻ đi xem ba căn hộ trong một khu vực. Họ đã dành cả buổi cuối tuần để chạy khắp nơi, nhưng cuối cùng vẫn bối rối: ảnh đăng khác với thực tế, giá ghi mập mờ, số điện thoại thì khiến họ bị làm phiền liên tục bởi các cuộc gọi không mong muốn. Họ nói với tôi: “Chỉ cần một nơi nào đó mà mọi thứ rõ ràng—ảnh thật, giá thật, và khi chúng tôi gọi thì là người bán thật.” Câu nói ấy ám ảnh tôi.",
    "Trên thị trường, người mua lạc lối trong rừng tin rác; môi giới chân chính bị chìm giữa hàng loạt tin trùng và lead kém chất lượng; chủ nhà chân thật thì lo lắng khi số điện thoại bị rò rỉ khắp nơi. Thị trường Proptech đã có nhiều công cụ, nhưng thiếu một nơi thực sự đặt quyền lợi người mua làm trung tâm — một nền tảng vừa dùng công nghệ để lọc, vừa dùng con người để kiểm duyệt và minh bạch hóa thông tin.",
    "House X ra đời từ chính những bất tiện ấy. Chúng tôi không chỉ muốn tạo ra một trang đăng tin nữa. Mục tiêu là xây dựng một cổng tin bất động sản nơi người mua cảm thấy an tâm ngay từ lần đầu truy cập: biết chắc ảnh có thật, vị trí chính xác, giá niêm yết rõ ràng, và chỉ khi họ sẵn sàng mới để lộ thông tin liên hệ. Chúng tôi kết hợp công nghệ đối chiếu địa chỉ — giá — hình ảnh với quy trình biên tập có trách nhiệm, và mở cửa cho cộng đồng cùng tham gia giữ chất lượng.",
    "Hành trình ấy không bằng phẳng. Chúng tôi thử nghiệm nhiều cách gom tin trùng, điều chỉnh thuật toán phát hiện ảnh không phù hợp, và thiết kế cơ chế bảo vệ liên hệ sao cho thuận tiện nhưng vẫn an toàn. Mỗi lần một người dùng báo một tin sai, mỗi lần một môi giới phản hồi để cải thiện mô tả, nền tảng lại tiến một bước — thực tế hơn, đáng tin hơn.",
    "House X là lời cam kết: thông tin chuẩn — sản phẩm thật. Chúng tôi tin rằng khi thông tin trở nên minh bạch, quyết định của con người sáng suốt hơn, thị trường vận hành hiệu quả hơn, và những giao dịch bất động sản sẽ bớt rủi ro, bớt tổn thương.",
  ],
  closingTagline: "Nền tảng số tìm nhà Việt Nam",
} as const;

export const FOUNDER_NOTE = {
  title: "Lời phát biểu của Founder",
  greeting: "Kính chào bạn — tôi là Leo Duong, người sáng lập House X.",
  paragraphs: [
    "Tôi thành lập House X vì một lý do giản dị nhưng sâu sắc: tôi nhìn thấy con người mệt mỏi vì phải tin vào những tin đăng không minh bạch, vì thời gian và cảm xúc bị lãng phí trong những cuộc hẹn vô nghĩa, vì người mua, chủ nhà và môi giới chân chính đều bị ảnh hưởng bởi một hệ thống thông tin thiếu chuẩn mực.",
    "Sứ mệnh của chúng tôi không phải là trở thành trang bất động sản lớn nhất về số lượng tin, mà là trang đáng tin cậy nhất về chất lượng tin. Chúng tôi đặt người mua ở trung tâm — mọi tính năng, từ tìm kiếm, so sánh đến cách hiển thị liên hệ, đều được thiết kế để phục vụ quyền lợi của người dùng. Chúng tôi kết hợp công nghệ với con người: máy móc giúp xử lý khối lượng, con người kiểm duyệt chất lượng, và cộng đồng cùng giữ chuẩn mực.",
    "Tôi biết hành trình này cần thời gian và nỗ lực liên tục. House X sẽ không hoàn hảo ngay từ đầu, nhưng chúng tôi cam kết minh bạch trong cách làm, sẵn sàng lắng nghe phản hồi và chịu trách nhiệm trong từng bước phát triển. Nếu bạn gặp tin không đúng, hãy báo cho chúng tôi; nếu bạn là môi giới nghiêm túc, hãy hợp tác để nâng cao chất lượng tin. Chúng tôi cùng xây một thị trường bất động sản công bằng, hiệu quả và ít rủi ro hơn.",
  ],
  signOff:
    "Cảm ơn bạn đã tin tưởng. Hãy cùng House X tìm ngôi nhà phù hợp — theo cách thông minh và an toàn hơn.",
  name: "Leo Duong",
  role: "Người sáng lập, House X",
} as const;

export { PARTNERSHIPS_PAGE } from "@/lib/content/partnerships-page-content";

/** FAQ cấp nền tảng — dùng trang /cau-hoi-thuong-gap và JSON-LD. */
export const PLATFORM_FAQ: RichFaqItem[] = [
  {
    q: "Tin trên House X có đáng tin không?",
    blocks: [
      {
        type: "p",
        text: "House X kiểm tra tin trước hiển thị: đối chiếu địa chỉ, gom tin trùng và rà soát ảnh — mô tả theo tiêu chuẩn sàn. Chúng tôi không đảm bảo giao dịch thay các bên; bạn vẫn nên xem nhà thực tế và kiểm tra pháp lý trước khi ký.",
      },
      {
        type: "p",
        text: "Chi tiết quy trình: xem trang Phương pháp biên tập.",
      },
    ],
  },
  {
    q: "Bảo mật số điện thoại trên tin đăng House X xử lý thế nào?",
    blocks: [
      {
        type: "p",
        text: "Số môi giới được che trên giao diện công khai. Chỉ người đã đăng ký tài khoản khách hàng và xác nhận email mới được xem số liên hệ đầy đủ.",
      },
      {
        type: "ul",
        items: [
          "Khách hàng: đăng ký tài khoản khách hàng trên website và xác nhận email.",
          "Môi giới: số của bạn không hiển thị công khai cho đến khi khách đủ điều kiện.",
        ],
      },
    ],
  },
  {
    q: "Làm sao đăng tin trên House X?",
    blocks: [
      {
        type: "p",
        text: "Môi giới và chủ nhà đăng ký tại trang Đăng ký môi giới, rồi đăng tin tại /moi-gioi/dang-tin (hoặc /dang-tin sẽ chuyển tới đó) với ảnh thật, giá niêm yết và mô tả chính xác. Tin vi phạm hoặc thiếu thông tin có thể bị từ chối hoặc gỡ.",
      },
    ],
  },
  {
    q: "House X kiếm tiền bằng cách nào?",
    blocks: [
      {
        type: "p",
        text: "House X có thể nhận phí từ dịch vụ đăng tin, hợp tác giới thiệu dịch vụ vay — thẩm định — thiết kế–thi công (khi khách chủ động yêu cầu tư vấn), và các gói hợp tác với môi giới. Chúng tôi không bán dữ liệu cá nhân.",
      },
    ],
  },
  {
    q: "House X hoạt động như thế nào trong giao dịch BĐS?",
    blocks: [
      {
        type: "p",
        text: "House X vận hành cổng tin, danh mục dự án (kể cả nhà ở xã hội), tổng hợp thông tin và công cụ hỗ trợ quyết định. Giao dịch cụ thể diễn ra giữa người mua và môi giới hoặc chủ nhà theo từng tin/dự án — bạn vẫn nên xem nhà thực tế và kiểm tra pháp lý trước khi ký.",
      },
    ],
  },
  {
    q: "Nội dung nhà ở xã hội trên House X lấy từ đâu?",
    blocks: [
      {
        type: "p",
        text: "Nội dung trong Wiki nhà ở xã hội do ban biên tập House X rà soát, đối chiếu văn bản tại Cổng Thông tin Chính phủ và thông báo cơ quan nhà nước. Chúng tôi phân tách rõ bài tổng hợp và công bố chính thức của Sở Xây dựng hoặc chủ đầu tư.",
      },
    ],
  },
  {
    q: "Tôi thấy thông tin sai — báo ở đâu?",
    blocks: [
      {
        type: "p",
        text: "Dùng nút “Báo cáo tin” trên listing, form Liên hệ hoặc email biên tập — ghi rõ mã tin hoặc URL. House X xác nhận trong 24 giờ làm việc và xử lý khiếu nại thông thường trong 3 ngày làm việc.",
      },
      {
        type: "p",
        text: "Chi tiết quy trình và SLA: xem trang Chính sách xử lý khiếu nại.",
      },
    ],
  },
  {
    q: "Cộng tác viên (CTV) tham gia thế nào?",
    blocks: [
      {
        type: "p",
        text: "CTV đăng ký qua form riêng, hoàn thành khóa hội nhập và được đội ngũ House X duyệt trước khi cấp mã.",
      },
    ],
  },
];

export const FAQ_HUB = {
  metaTitle: "Câu hỏi thường gặp",
  metaDescription:
    "Giải đáp về độ tin cậy tin đăng, bảo vệ số điện thoại, đăng tin môi giới, mô hình kinh doanh và nội dung NOXH trên House X — đọc trước khi liên hệ.",
  title: "Câu hỏi thường gặp",
  lead: "Tổng hợp câu hỏi về cách House X vận hành — từ kiểm tra tin đến bảo mật liên hệ. Không thấy câu trả lời? Liên hệ trực tiếp.",
} as const;

export const EXPERTS_INDEX = {
  metaTitle: "Đội ngũ & chuyên gia rà soát",
  metaDescription:
    "Ban biên tập và chuyên gia rà soát nội dung House X — đặc biệt nhà ở xã hội, pháp lý liên quan và quy trình kiểm duyệt tin công khai.",
  title: "Đội ngũ & biên tập",
  lead:
    "House X công khai người rà soát nội dung nhạy cảm — đặc biệt nhà ở xã hội và các chủ đề pháp lý liên quan.",
} as const;

export const CONTACT_PAGE = {
  metaTitle: "Liên hệ House X (timnhaxahoi.com)",
  metaDescription:
    "Liên hệ House X tại /lien-he: tư vấn dịch vụ vay, định giá, thiết kế–thi công; báo tin sai; hỗ trợ tài khoản khách hàng và môi giới trong giờ hành chính.",
  title: "Liên hệ & hỗ trợ House X",
  lead: "Chọn đúng kênh — chúng tôi phản hồi trong giờ hành chính (T2–T6, 8:30–17:30). Trang chính thức: /lien-he.",
  routes: [
    {
      title: "Tư vấn dịch vụ",
      desc: "Vay mua nhà, thẩm định giá, thiết kế nội thất — để lại form bên dưới.",
      href: "/lien-he",
    },
    {
      title: "Báo tin sai / góp ý nội dung",
      desc: "Ghi mã tin hoặc URL trang. Ưu tiên xử lý trong 1–2 ngày làm việc.",
      href: "/lien-he?dich-vu=ho-tro",
    },
    {
      title: "Xem số môi giới trên tin đăng",
      desc: "Đăng ký khách hàng và xác nhận email trước.",
      href: "/dang-ky/khach-hang",
    },
    {
      title: "Đăng tin BĐS",
      desc: "Dành cho môi giới và chủ nhà.",
      href: "/dang-ky/moi-gioi",
    },
  ],
} as const;

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  subsections?: {
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
  }[];
};

export const PRIVACY_CONTENT = {
  metaTitle: "Chính sách bảo mật",
  metaDescription:
    "House X cam kết bảo vệ dữ liệu cá nhân và bảo mật liên hệ; tìm hiểu cách chúng tôi thu, dùng và bảo vệ thông tin của bạn.",
  updated: "Tháng 7/2026",
  title: "Chính sách bảo mật",
  intro:
    "House X cam kết bảo vệ thông tin cá nhân của bạn và minh bạch cách chúng tôi thu, lưu và sử dụng dữ liệu.",
  sections: [
    {
      heading: "Những thông tin chúng tôi thu",
      subsections: [
        {
          heading: "Thông tin bạn cung cấp trực tiếp",
          bullets: [
            "Họ tên, email, số điện thoại khi đăng ký tài khoản.",
            "Thông tin tin đăng (đối với môi giới và chủ nhà): mô tả, ảnh, giá, vị trí.",
          ],
        },
        {
          heading: "Dữ liệu hành vi",
          bullets: [
            "Lịch sử tìm kiếm, lượt xem tin, tương tác trên trang (phục vụ cải thiện sản phẩm).",
          ],
        },
        {
          heading: "Cookies và công nghệ theo dõi",
          bullets: [
            "Cookie phiên (session): duy trì đăng nhập và bảo mật.",
            "Cookie hiệu năng: đo tốc độ tải trang, lỗi kỹ thuật.",
            "Cookie chức năng: ghi nhớ tuỳ chọn hiển thị (nếu bạn bật).",
            "Cookie quảng cáo / phân tích: chỉ khi bạn đồng ý (nếu triển khai).",
          ],
        },
      ],
    },
    {
      heading: "Mục đích sử dụng dữ liệu",
      bullets: [
        "Cung cấp dịch vụ: hiển thị tin, bảo vệ liên hệ, gửi thông báo dịch vụ.",
        "Cải thiện sản phẩm: phân tích hành vi để tối ưu tìm kiếm và đề xuất.",
        "Bảo mật & phòng chống lừa đảo: xác minh người dùng, phát hiện hành vi bất thường.",
        "Marketing: gửi thông tin khuyến mãi chỉ khi bạn đồng ý rõ ràng.",
      ],
    },
    {
      heading: "Bảo vệ số điện thoại & liên hệ an toàn",
      bullets: [
        "Số điện thoại môi giới được mã hóa lưu trữ và không hiển thị công khai.",
        "Chỉ hiển thị sau khi bạn đăng ký tài khoản khách hàng và xác nhận email.",
        "Số không xuất hiện dạng plain text trong HTML công khai — reveal qua cơ chế nội bộ sau xác thực.",
        "Bạn có thể yêu cầu ẩn hoặc xóa thông tin liên quan qua email hỗ trợ.",
      ],
    },
    {
      heading: "Chia sẻ dữ liệu với bên thứ ba",
      paragraphs: [
        "Chúng tôi chỉ chia sẻ dữ liệu cần thiết với các bên hỗ trợ vận hành dịch vụ, kèm cam kết bảo mật.",
      ],
      bullets: [
        "Nhà cung cấp hạ tầng (hosting, cơ sở dữ liệu).",
        "Nhà cung cấp email giao dịch (xác nhận tài khoản, reset mật khẩu).",
        "Đối tác xử lý yêu cầu tư vấn khi bạn gửi form trên website — chỉ dữ liệu cần thiết để phản hồi.",
        "Đối tác quảng cáo — chỉ khi có cơ sở pháp lý và bạn đồng ý (nếu áp dụng).",
        "Cam kết: không bán dữ liệu cá nhân.",
      ],
    },
    {
      heading: "Quyền của bạn",
      bullets: [
        "Truy cập: yêu cầu bản sao dữ liệu cá nhân.",
        "Sửa đổi: chỉnh dữ liệu không chính xác trong tài khoản hoặc qua email hỗ trợ.",
        "Xóa: yêu cầu xóa tài khoản và dữ liệu (tùy nghĩa vụ pháp lý còn lại).",
        "Rút consent: rút quyền tiếp thị bất cứ lúc nào.",
      ],
      paragraphs: [
        "Gửi yêu cầu qua email hỗ trợ hoặc form Liên hệ — chúng tôi phản hồi trong giờ hành chính.",
      ],
    },
    {
      heading: "Bảo mật và lưu trữ",
      bullets: [
        "Mã hóa truyền tải (TLS/HTTPS) và mã hóa mật khẩu khi lưu trữ.",
        "Kiểm soát truy cập theo vai trò; ghi nhận hoạt động truy cập để bảo vệ dữ liệu.",
        "Thời gian lưu: trong suốt thời gian bạn sử dụng dịch vụ và theo yêu cầu pháp lý; log kỹ thuật lưu ngắn hạn.",
      ],
    },
    {
      heading: "Cookies & tracking",
      bullets: [
        "Cookie cần thiết: bắt buộc cho đăng nhập và bảo mật — không thể tắt trên sàn.",
        "Cookie hiệu năng & phân tích: có thể tắt qua cài đặt trình duyệt.",
        "Hướng dẫn tắt cookie: vào Cài đặt → Quyền riêng tư của trình duyệt bạn dùng (Chrome, Safari, Edge…).",
      ],
    },
    {
      heading: "Thay đổi chính sách",
      paragraphs: [
        "Mọi thay đổi quan trọng sẽ được đăng trên trang này kèm ngày cập nhật. Người dùng đã đăng ký có thể nhận email thông báo khi thay đổi ảnh hưởng quyền riêng tư.",
      ],
    },
    {
      heading: "Liên hệ về bảo mật dữ liệu",
      paragraphs: [
        "Mọi câu hỏi về quyền riêng tư và yêu cầu xử lý dữ liệu — liên hệ qua email hỗ trợ hiển thị cuối trang.",
      ],
    },
  ] satisfies LegalSection[],
} as const;
