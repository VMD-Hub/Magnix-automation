import type { AffiliateVertical } from "@/lib/content/affiliate-verticals";

export type ServiceVerticalId = AffiliateVertical["id"];

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const SERVICES_HUB_VISUAL = {
  heroImage: u("photo-1560518883-ce09059eeffa", 1920),
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
    heroImage: u("photo-1554224155-6726b3ff858f", 1920),
    heroGradient: "from-amber-950/95 via-ink-900/90 to-brand-900/80",
    accentRing: "ring-amber-200/60",
    accentBg: "bg-amber-50",
    accentText: "text-amber-800",
    stats: [
      { label: "Ngân hàng", value: "10+" },
      { label: "Thời gian phản hồi", value: "< 24h" },
      { label: "Gói vay", value: "BĐS & SXKD" },
    ],
    process: [
      { step: "01", title: "Làm rõ nhu cầu vay", desc: "Mục đích, thu nhập, tài sản đảm bảo và ngân sách trả nợ hàng tháng." },
      { step: "02", title: "Chọn gói & chuẩn bị hồ sơ", desc: "So sánh lãi suất, hạn mức — checklist giấy tờ theo ngân hàng." },
      { step: "03", title: "Duyệt vay & giải ngân", desc: "Đồng hành thẩm định tài sản, ký hợp đồng và theo sát tiến độ." },
    ],
    trust: [
      { title: "Minh bạch điều kiện", desc: "Lãi suất và phí do ngân hàng công bố tại thời điểm ký hợp đồng." },
      { title: "Công cụ miễn phí", desc: "Tính khoản vay trước khi làm hồ sơ chính thức." },
      { title: "Một đầu mối", desc: "Đồng bộ hồ sơ vay và thẩm định giá khi cần." },
    ],
  },
  "dinh-gia": {
    heroImage: u("photo-1560518883-ce09059eeffa", 1920),
    heroGradient: "from-ink-900/95 via-slate-900/90 to-brand-900/75",
    accentRing: "ring-brand-200/60",
    accentBg: "bg-brand-50",
    accentText: "text-brand-800",
    stats: [
      { label: "Chuẩn ngành", value: "VAS" },
      { label: "Thời gian", value: "3–15 ngày" },
      { label: "Use-case", value: "5 dịch vụ" },
    ],
    process: [
      { step: "01", title: "Tiếp nhận & tư vấn", desc: "Xác định mục đích thẩm định: ngân hàng, bán nhà, thừa kế, visa…" },
      { step: "02", title: "Khảo sát hiện trạng", desc: "Thu thập hồ sơ pháp lý, đo đạc và dữ liệu thị trường so sánh." },
      { step: "03", title: "Bàn giao chứng thư", desc: "Báo cáo/chứng thư theo Chuẩn mực thẩm định giá Việt Nam." },
    ],
    trust: [
      { title: "Đúng pháp luật", desc: "Thẩm định viên được cấp phép, chứng thư hợp lệ." },
      { title: "Đa mục đích", desc: "Từ tra cứu chủ nhà đến hồ sơ ngân hàng và visa." },
      { title: "Theo dõi tiến độ", desc: "Cập nhật trạng thái hồ sơ xuyên suốt quy trình." },
    ],
  },
  "noi-that": {
    heroImage: u("photo-1616486338812-28d840397daf", 1920),
    heroGradient: "from-stone-900/95 via-ink-900/88 to-brand-900/70",
    accentRing: "ring-stone-200/60",
    accentBg: "bg-stone-50",
    accentText: "text-stone-800",
    stats: [
      { label: "Phong cách", value: "5+ ý tưởng" },
      { label: "Loại nhà", value: "CH · NP · BT" },
      { label: "Dịch vụ", value: "2D/3D → TC" },
    ],
    process: [
      { step: "01", title: "Khảo sát & brief", desc: "Diện tích, phong cách, ngân sách và hiện trạng căn nhà." },
      { step: "02", title: "Thiết kế 2D/3D", desc: "Phối cảnh, bố trí nội thất — duyệt trước khi thi công." },
      { step: "03", title: "Thi công & bàn giao", desc: "Hoàn thiện theo hạng mục, nghiệm thu và bảo hành." },
    ],
    trust: [
      { title: "Cảm hứng thực tế", desc: "Mẫu phong cách áp dụng cho khí hậu Việt Nam." },
      { title: "Báo giá rõ ràng", desc: "Khảo sát trước, báo giá theo hạng mục cụ thể." },
      { title: "Trọn gói", desc: "Từ ý tưởng đến hoàn thiện không gian sống." },
    ],
  },
};

/** Ảnh thẻ dịch vụ theo slug hoặc product line id */
export const SERVICE_CARD_IMAGES: Record<string, string> = {
  "vay-mua-bds": u("photo-1564013799919-ab600027ffc6"),
  "vay-sxkd": u("photo-1504384308090-c894fd5f602f"),
  "tra-cuu-gia-chu-nha": u("photo-1564013799919-ab600027ffc6"),
  "tham-dinh-ngan-hang": u("photo-1582405790763-cb34f71e7e3e"),
  "chung-nhan-tham-dinh": u("photo-1450101499163-c8848c66ca85"),
  "phan-chia-thua-ke": u("photo-1517045305355-de7f03210f3a"),
  "chung-minh-tai-san-visa": u("photo-1436491865332-7a61a109cc05"),
  "phong-cach-hien-dai": u("photo-1600210492486-724fe641c782"),
  "phong-cach-scandinavian": u("photo-1600607687939-ce8a6c25118c"),
  "phong-cach-indochine": u("photo-1615529328331-f8917597711f"),
  "phong-cach-toi-gian": u("photo-1600585154340-be6161a56a0c"),
  "can-ho-dep-y-tuong": u("photo-1600566753190-17f0baa2a6a3"),
};

export const HUB_VERTICAL_CARDS: Record<
  ServiceVerticalId,
  { image: string; badge: string; cta: string }
> = {
  "tai-chinh": {
    image: u("photo-1554224155-6726b3ff858f"),
    badge: "Tài chính",
    cta: "Tư vấn vay ngay",
  },
  "dinh-gia": {
    image: u("photo-1560518883-ce09059eeffa"),
    badge: "Thẩm định",
    cta: "Yêu cầu định giá",
  },
  "noi-that": {
    image: u("photo-1616486338812-28d840397daf"),
    badge: "Nội thất",
    cta: "Khảo sát thiết kế",
  },
};

export function cardImageForSlug(slug: string): string {
  return (
    SERVICE_CARD_IMAGES[slug] ??
    u("photo-1560518883-ce09059eeffa")
  );
}
