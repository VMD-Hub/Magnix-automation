/** Copy trang /cong-cu — ngôn ngữ người mua nhà, không jargon Proptech. */

export const TOOLS_HUB_COPY = {
  metaTitle: "Công cụ mua nhà — HouseX",
  metaDescription:
    "Tính khoản vay mua nhà, chuẩn bị hồ sơ và kết nối dịch vụ tài chính, thẩm định trên HouseX — miễn phí.",
  kicker: "HouseX · Công cụ",
  title: "Công cụ mua nhà thông minh",
  subtitle:
    "Tính khoản vay, ước lượng chi phí và chuẩn bị quyết định — ngay trên trình duyệt, không cần đăng ký.",
  calculatorsHeading: "Máy tính & tra cứu",
  calculatorsIntro: "Bắt đầu bằng công cụ phù hợp nhu cầu của bạn.",
  servicesHeading: "Cần tư vấn chuyên sâu?",
  servicesIntro:
    "Đội ngũ HouseX đồng hành vay vốn, thẩm định giá và thiết kế không gian sống sau khi bạn đã có con số sơ bộ.",
} as const;

export const LOAN_CALC_COPY = {
  metaTitle: "Tính khoản vay mua nhà — Lịch trả nợ & PDF | HouseX",
  metaDescription:
    "Tính khoản vay mua bất động sản theo dư nợ giảm dần hoặc trả góp đều: số tiền trả hàng tháng, tổng lãi, lịch trả nợ chi tiết và xuất PDF miễn phí.",
  kicker: "Máy tính vay mua nhà",
  title: "Tính khoản vay mua nhà",
  subtitle:
    "Nhập giá nhà và tỷ lệ vay — xem tiền trả hàng tháng, tổng lãi và lịch trả nợ chi tiết. Xuất PDF để lưu hoặc gửi ngân hàng.",
  primaryCta: "Bắt đầu tính",
  primaryCtaHref: "#tinh-toan",
  secondaryCta: "Nhận tư vấn vay",
  secondaryCtaHref: "/tai-chinh#tu-van",
  faqHeading: "Câu hỏi thường gặp về vay mua nhà",
} as const;

export const LOAN_AFFORDABILITY_COPY = {
  metaTitle: "Tính hạn mức vay mua nhà theo thu nhập 2026 | HouseX",
  metaDescription:
    "Ước tính hạn mức vay mua nhà theo thu nhập, DTI, chi phí sinh hoạt/đầu người, đồng vay vợ chồng và CIC — mô phỏng cách ngân hàng thẩm định. Miễn phí.",
  kicker: "Máy tính hạn mức vay",
  title: "Tính hạn mức vay mua nhà",
  subtitle:
    "Nhập thu nhập, hộ gia đình và nghĩa vụ trả nợ — xem hạn mức vay theo DTI và chi phí sinh hoạt/đầu người, như ngân hàng thẩm định.",
  primaryCta: "Bắt đầu tính",
  primaryCtaHref: "#tinh-toan",
  secondaryCta: "Nhận tư vấn vay",
  secondaryCtaHref: "/tai-chinh#tu-van",
  faqHeading: "Câu hỏi thường gặp về hạn mức vay mua nhà",
} as const;

export const NOXH_CHECK_COPY = {
  metaTitle: "Kiểm tra điều kiện mua nhà ở xã hội (NOXH) 2026 | HouseX",
  metaDescription:
    "Tự kiểm tra điều kiện mua NOXH theo Luật Nhà ở 2023 và Nghị định 100/2024 (sửa đổi bởi NĐ 136/2026): đối tượng, nhà ở, thu nhập 25/35/50 triệu và khả năng vay. Miễn phí, có kết quả ngay.",
  kicker: "HouseX · Công cụ",
  title: "Kiểm tra điều kiện mua nhà ở xã hội",
  subtitle:
    "Trả lời vài câu hỏi để biết bạn có đủ điều kiện mua NOXH không, vướng ở đâu và cần làm gì tiếp — theo quy định mới nhất năm 2026.",
  primaryCta: "Bắt đầu kiểm tra",
  primaryCtaHref: "#kiem-tra",
  secondaryCta: "Nhận tư vấn chuyên gia",
  secondaryCtaHref: "/lien-he",
  faqHeading: "Câu hỏi thường gặp về điều kiện mua NOXH",
} as const;

export const NOXH_LOAN_ASSESSMENT_HUB_COPY = {
  metaTitle: "Thẩm định vay NOXH — Bộ công cụ miễn phí | House X",
  metaDescription:
    "Tự thẩm định vay mua nhà ở xã hội: kiểm tra tuổi vay 60 giây, tính hạn mức theo thu nhập, lịch trả nợ — trước khi đặt cọc. Không thay quyết định ngân hàng.",
  kicker: "House X · Công cụ NOXH",
  title: "Thẩm định vay mua nhà ở xã hội",
  subtitle:
    "Ba bước sàng lọc sơ bộ trước khi cọc: tuổi vay → hạn mức → khoản trả hàng tháng. Kết quả mang tính tham khảo — ngân hàng mới quyết định duyệt hồ sơ.",
  toolsHeading: "Chọn công cụ phù hợp",
  toolsIntro: "Bắt đầu từ kiểm tra 60 giây nếu bạn chưa rõ tuổi vay; sau đó tính hạn mức và khoản trả.",
  articlesHeading: "Hướng dẫn & cụm bài thẩm định vay",
  articlesIntro:
    "Đọc thêm trước khi nộp hồ sơ: CIC, hồ sơ vay, sai lầm thường gặp và checklist trước cọc.",
} as const;

export const NOXH_LOAN_ASSESSMENT_HUB_TOOLS: ToolCardDef[] = [
  {
    id: "noxh-loan-quick",
    href: "/cong-cu/kiem-tra-vay-noxh",
    title: "Kiểm tra vay NOXH 60 giây",
    desc: "Xưng hô + năm sinh — ước tính tuổi cuối kỳ vay trước khi chọn kỳ hạn.",
    cta: "Kiểm tra ngay",
    ready: true,
    badge: "Bước 1",
  },
  {
    id: "affordability",
    href: "/cong-cu/tinh-han-muc-vay",
    title: "Tính hạn mức vay",
    desc: "Thu nhập, DTI và chi phí sinh hoạt — ước tính số tiền vay tối đa.",
    cta: "Tính ngay",
    ready: true,
    badge: "Bước 2",
  },
  {
    id: "loan",
    href: "/cong-cu/tinh-khoan-vay",
    title: "Tính khoản vay mua nhà",
    desc: "Lịch trả nợ chi tiết, tổng lãi — xuất PDF để đối chiếu.",
    cta: "Tính ngay",
    ready: true,
    badge: "Bước 3",
  },
];

export const NOXH_LOAN_ASSESSMENT_HUB_ARTICLES = [
  {
    href: "/tin-tuc/tham-dinh-khoan-vay-mua-nha-o-xa-hoi",
    label: "Thẩm định vay NOXH — bài trụ cột",
  },
  {
    href: "/tin-tuc/kiem-tra-kha-nang-vay-noxh-60-giay",
    label: "Hướng dẫn kiểm tra vay trong 60 giây",
  },
  {
    href: "/tin-tuc/cach-tra-cic-an-toan-truoc-khi-vay",
    label: "Tra CIC an toàn trước khi vay",
  },
  {
    href: "/tin-tuc/checklist-truoc-khi-dat-coc-noxh",
    label: "Checklist trước khi đặt cọc",
  },
] as const;

export type ToolCardDef = {
  id: string;
  href: string;
  title: string;
  desc: string;
  cta: string;
  ready: boolean;
  badge?: string;
};

export const TOOL_HUB_CARDS: ToolCardDef[] = [
  {
    id: "noxh-loan-hub",
    href: "/cong-cu/tham-dinh-vay-noxh",
    title: "Thẩm định vay NOXH",
    desc: "Bộ công cụ: kiểm tra tuổi vay 60 giây, hạn mức và khoản trả — trước khi cọc.",
    cta: "Mở bộ công cụ",
    ready: true,
    badge: "NOXH",
  },
  {
    id: "loan",
    href: "/cong-cu/tinh-khoan-vay",
    title: "Tính khoản vay mua nhà",
    desc: "Dư nợ giảm dần hoặc trả góp đều — lịch trả nợ chi tiết, xuất PDF.",
    cta: "Tính ngay",
    ready: true,
    badge: "Phổ biến",
  },
  {
    id: "affordability",
    href: "/cong-cu/tinh-han-muc-vay",
    title: "Tính hạn mức vay mua nhà",
    desc: "Ước tính số tiền vay tối đa theo thu nhập, DTI và hạn mức thẻ — như ngân hàng thẩm định.",
    cta: "Tính ngay",
    ready: true,
  },
  {
    id: "noxh-loan-quick",
    href: "/cong-cu/kiem-tra-vay-noxh",
    title: "Kiểm tra vay NOXH 60 giây",
    desc: "Xưng hô + năm sinh — ước tính tuổi vay sơ bộ trước khi cọc. Không thay thế ngân hàng.",
    cta: "Kiểm tra ngay",
    ready: true,
    badge: "NOXH",
  },
  {
    id: "noxh-check",
    href: "/cong-cu/dieu-kien-noxh",
    title: "Kiểm tra điều kiện NOXH",
    desc: "Đối tượng, nhà ở, thu nhập & khả năng vay — theo quy định mới nhất 2026.",
    cta: "Kiểm tra ngay",
    ready: true,
    badge: "Mới",
  },
];
