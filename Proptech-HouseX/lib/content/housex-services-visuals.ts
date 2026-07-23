import type { AffiliateVertical } from "@/lib/content/affiliate-verticals";

export type ServiceVerticalId = AffiliateVertical["id"];

export const SERVICES_HUB_VISUAL = {
  heroImage: "/images/hero/hcmc-skyline-river-day.webp",
  eyebrow: "Dịch vụ HouseX",
  tagline: "Từ tìm nhà đến an cư trọn vẹn",
  highlights: [
    { label: "3 nhóm dịch vụ", value: "Tài chính · Định giá · Nội thất" },
    { label: "Đồng hành hồ sơ", value: "Tư vấn → Triển khai → Bàn giao" },
    { label: "Trên nền tảng Proptech", value: "Tìm nhà & công cụ tích hợp" },
  ],
  steps: [
    { step: "01", title: "Gửi yêu cầu", desc: "Mô tả nhu cầu qua form hoặc hotline — tư vấn viên làm rõ mục tiêu." },
    { step: "02", title: "Chuẩn bị hồ sơ", desc: "Checklist tài liệu, lịch khảo sát và báo giá minh bạch trước khi triển khai." },
    { step: "03", title: "Hoàn tất dịch vụ", desc: "Theo dõi tiến độ đến khi giải ngân, nhận chứng thư hoặc bàn giao không gian." },
  ],
};

export type VerticalVisual = {
  heroImage: string;
  heroImageWebp?: string;
  /** Tailwind gradient classes on hero overlay */
  heroGradient: string;
  accentRing: string;
  accentBg: string;
  accentText: string;
  stats: { label: string; value: string }[];
  process: { step: string; title: string; desc: string }[];
  trust: { title: string; desc: string }[];
};

export const VERTICAL_VISUALS: Record<ServiceVerticalId, VerticalVisual> = {
  "tai-chinh": {
    heroImage: "/images/tools/finance-hub.png",
    heroImageWebp: "/images/tools/finance-hub.webp",
    heroGradient: "from-amber-950/95 via-ink-900/90 to-brand-900/80",
    accentRing: "ring-amber-200/60",
    accentBg: "bg-amber-50",
    accentText: "text-amber-800",
    stats: [
      { label: "Ngân hàng", value: "10+" },
      { label: "Quy trình", value: "6 bước" },
      { label: "Gói dịch vụ", value: "4 dòng" },
    ],
    process: [
      {
        step: "01",
        title: "Làm rõ nhu cầu",
        desc: "Mục đích vay, thu nhập, tài sản đảm bảo và khả năng trả hàng tháng.",
      },
      {
        step: "02",
        title: "Sơ loại hồ sơ",
        desc: "Ước hạn mức / DTI tham khảo; chỉ ra điểm thiếu trên giấy tờ trước khi nộp bank.",
      },
      {
        step: "03",
        title: "Chọn ngân hàng & gói",
        desc: "So sánh tỷ lệ tài trợ, phí liên quan và điều kiện hiện trạng tài sản.",
      },
      {
        step: "04",
        title: "Nộp hồ sơ",
        desc: "Checklist CCCD, thu nhập, pháp lý TS — bổ sung theo yêu cầu từng ngân hàng.",
      },
      {
        step: "05",
        title: "Thẩm định & phê duyệt",
        desc: "Đồng hành khi bank thẩm định tài sản / tín dụng; theo dõi yêu cầu bổ sung.",
      },
      {
        step: "06",
        title: "Xác nhận vay & giải ngân",
        desc: "Hỗ trợ bạn hiểu điều kiện cuối trước khi đồng ý vay và nhận giải ngân.",
      },
    ],
    trust: [
      { title: "Minh bạch điều kiện", desc: "Lãi suất và phí do ngân hàng công bố tại thời điểm ký hợp đồng." },
      { title: "Công cụ miễn phí", desc: "Tính khoản vay trước khi làm hồ sơ chính thức." },
      { title: "Một đầu mối", desc: "Đồng bộ hồ sơ vay và thẩm định giá khi cần." },
    ],
  },
  "dinh-gia": {
    heroImage: "/images/hero/hcmc-skyline-river-day.webp",
    heroImageWebp: "/images/hero/hcmc-skyline-river-day.webp",
    heroGradient: "from-ink-900/95 via-slate-900/90 to-brand-900/75",
    accentRing: "ring-brand-200/60",
    accentBg: "bg-brand-50",
    accentText: "text-brand-800",
    stats: [
      { label: "Chuẩn ngành", value: "VAS" },
      { label: "Quy trình", value: "6 bước" },
      { label: "Use-case", value: "5 dịch vụ" },
    ],
    process: [
      {
        step: "01",
        title: "Tra cứu & khởi tạo",
        desc: "Định vị tài sản, kiểm tra thửa đất / công trình và tạo đơn hàng thẩm định.",
      },
      {
        step: "02",
        title: "Yêu cầu định giá chính thức",
        desc: "Bổ sung pháp lý, thông tin khách hàng và tạo hợp đồng dịch vụ.",
      },
      {
        step: "03",
        title: "Xác nhận phí & lịch khảo sát",
        desc: "Vận hành báo phí hồ sơ và hẹn thời gian khảo sát hiện trạng tại tài sản.",
      },
      {
        step: "04",
        title: "Khảo sát & phê duyệt",
        desc: "Chuyên viên thẩm định khảo sát hiện trường; kiểm soát chất lượng duyệt báo cáo.",
      },
      {
        step: "05",
        title: "Thông báo kết quả",
        desc: "Bạn nhận báo cáo / chứng thư (bản điện tử) và phản hồi đồng ý hoặc từ chối kết quả.",
      },
      {
        step: "06",
        title: "Chuyển phát chứng thư có dấu",
        desc: "Sau khi thanh toán phần còn lại, nhận chứng thư bản cứng có dấu tại tay.",
      },
    ],
    trust: [
      { title: "Đúng pháp luật", desc: "Thẩm định viên được cấp phép, chứng thư hợp lệ." },
      { title: "Đa mục đích", desc: "Từ tra cứu chủ nhà đến hồ sơ ngân hàng và visa." },
      { title: "Theo dõi tiến độ", desc: "Cập nhật trạng thái hồ sơ xuyên suốt quy trình." },
    ],
  },
  "noi-that": {
    heroImage: "/images/tools/interior-hub.png",
    heroImageWebp: "/images/tools/interior-hub.webp",
    heroGradient: "from-stone-900/95 via-ink-900/88 to-brand-900/70",
    accentRing: "ring-stone-200/60",
    accentBg: "bg-stone-50",
    accentText: "text-stone-800",
    stats: [
      { label: "Khu vực", value: "TP.HCM+" },
      { label: "Loại nhà", value: "CH · NP · VP" },
      { label: "Dịch vụ", value: "3D → TC" },
    ],
    process: [
      { step: "01", title: "Khảo sát", desc: "Diện tích, hiện trạng, phong cách và ngân sách dự kiến tại TP.HCM." },
      { step: "02", title: "Thiết kế", desc: "Concept, bản vẽ 2D và phối cảnh 3D — studio đối tác triển khai." },
      { step: "03", title: "Duyệt bản vẽ", desc: "Chỉnh sửa theo phản hồi trước khi xuống thi công." },
      { step: "04", title: "Thi công", desc: "Quản lý tiến độ, vật liệu và nghiệm thu từng hạng mục." },
      { step: "05", title: "Bàn giao & bảo hành", desc: "Nghiệm thu không gian hoàn thiện và hỗ trợ bảo hành theo hợp đồng." },
    ],
    trust: [
      { title: "Studio đối tác", desc: "House X kết nối đơn vị thi công có kinh nghiệm tại TP.HCM — một đầu mối tư vấn." },
      { title: "Báo giá sau khảo sát", desc: "Không cam kết giá cố định online — ước tính minh bạch sau khảo sát hiện trạng." },
      { title: "Hành trình Proptech", desc: "Tìm nhà, vay, thẩm định và nội thất trên cùng nền tảng House X." },
    ],
  },
};

/** Ảnh thẻ dịch vụ theo slug hoặc product line id — ưu tiên local (tránh Unsplash 404). */
export const SERVICE_CARD_IMAGES: Record<string, string> = {
  "vay-mua-bds": "/images/tools/finance-hub.png",
  "can-ho": "/images/tools/finance-hub.png",
  "vay-mua-nha": "/images/tools/finance-hub.png",
  "vay-the-chap": "/images/tools/finance-hub.png",
  "vay-sxkd": "/images/tools/business-loan.png",
  "bao-hiem-tai-san": "/images/tools/finance-hub.png",
  "tra-cuu-gia-chu-nha": "/images/hero/hcmc-skyline-river-day.webp",
  "tham-dinh-ngan-hang": "/images/tools/finance-hub.png",
  "chung-nhan-tham-dinh": "/images/tools/finance-hub.png",
  "phan-chia-thua-ke": "/images/projects/la-home/hero.jpg",
  "chung-minh-tai-san-visa": "/images/hero/housex-hero-slide-01-civic-center.webp",
  "phong-cach-hien-dai": "/images/tools/interior-hub.webp",
  "hien-dai": "/images/tools/interior-hub.webp",
  "phong-cach-scandinavian": "/images/hero/urban-skyline-golden-hour.jpg",
  scandinavian: "/images/hero/urban-skyline-golden-hour.jpg",
  "phong-cach-indochine": "/images/hero/housex-thu-thiem-civic-center-day.webp",
  indochine: "/images/hero/housex-thu-thiem-civic-center-day.webp",
  "phong-cach-toi-gian": "/images/hero/housex-hero-slide-02-metro-hub.webp",
  "toi-gian": "/images/hero/housex-hero-slide-02-metro-hub.webp",
  "can-ho-dep-y-tuong": "/images/tools/interior-hub.webp",
};

/** WebP cho thẻ dịch vụ có ảnh thương hiệu local. */
export const SERVICE_CARD_IMAGES_WEBP: Record<string, string> = {
  "vay-mua-bds": "/images/tools/finance-hub.webp",
  "can-ho": "/images/tools/finance-hub.webp",
  "vay-mua-nha": "/images/tools/finance-hub.webp",
  "vay-the-chap": "/images/tools/finance-hub.webp",
  "vay-sxkd": "/images/tools/business-loan.webp",
  "tham-dinh-ngan-hang": "/images/tools/finance-hub.webp",
  "bao-hiem-tai-san": "/images/tools/finance-hub.webp",
  "chung-nhan-tham-dinh": "/images/tools/finance-hub.webp",
  "phong-cach-hien-dai": "/images/tools/interior-hub.webp",
  "hien-dai": "/images/tools/interior-hub.webp",
  "can-ho-dep-y-tuong": "/images/tools/interior-hub.webp",
};

export const HUB_VERTICAL_CARDS: Record<
  ServiceVerticalId,
  { image: string; badge: string; cta: string }
> = {
  "tai-chinh": {
    image: "/images/tools/finance-hub.png",
    badge: "Tài chính",
    cta: "Tư vấn vay ngay",
  },
  "dinh-gia": {
    image: "/images/hero/hcmc-skyline-river-day.webp",
    badge: "Thẩm định",
    cta: "Yêu cầu định giá",
  },
  "noi-that": {
    image: "/images/tools/interior-hub.png",
    badge: "Nội thất",
    cta: "Khảo sát thiết kế",
  },
};

export function cardImageForSlug(slug: string): string {
  return (
    SERVICE_CARD_IMAGES[slug] ??
    "/images/tools/interior-hub.webp"
  );
}

export function cardWebpForSlug(slug: string): string | undefined {
  return SERVICE_CARD_IMAGES_WEBP[slug];
}
