import { MEDIA_LIMITS } from "@/lib/media/quality";

/** Tiêu chuẩn ảnh dùng chung cho landing dự án (khớp layout công khai). */
export const PROJECT_LANDING_IMAGE = {
  /** Gallery hiển thị `aspect-video` → 16:9 */
  galleryAspect: "16:9" as const,
  galleryWidth: 1920,
  galleryHeight: 1080,
  galleryMinWidth: 1600,
  galleryMinHeight: 900,
  /** Ảnh bản đồ vị trí — layout 2 cột với text (4:3) */
  locationMapAspect: "4:3" as const,
  locationMapWidth: 1200,
  locationMapHeight: 900,
  locationMapMinWidth: 960,
  locationMapMinHeight: 720,
  /** Banner hero — full-width phía sau tiêu đề */
  heroBannerWidth: 1920,
  heroBannerHeight: 720,
  heroBannerAspect: "21:9" as const,
  heroBannerMinWidth: 1600,
  heroBannerMinHeight: 600,
  /** Cùng ngưỡng tin đăng — cạnh ngắn tối thiểu */
  minShortEdgePx: MEDIA_LIMITS.minImagePx,
  maxFileSizeKb: 800,
  formats: ["JPG", "WebP"] as const,
  galleryCountMin: 3,
  galleryCountMax: 12,
  /** Logo CĐT dùng cho Open Graph khi share link */
  developerLogoSize: 400,
  developerLogoMin: 200,
} as const;

export type ProjectLandingGuideId =
  | "basic"
  | "seo"
  | "stats"
  | "highlights"
  | "amenities"
  | "location"
  | "faqs"
  | "gallery"
  | "cta";

export type ImageSpec = {
  aspect: string;
  recommended: string;
  minimum: string;
  formats: string;
  maxSize: string;
  count?: string;
};

export type SectionGuide = {
  id: ProjectLandingGuideId;
  title: string;
  summary: string;
  tips: string[];
  imageSpec?: ImageSpec;
  limits?: { label: string; value: string }[];
};

const img = PROJECT_LANDING_IMAGE;

export const PROJECT_LANDING_GUIDES: Record<
  ProjectLandingGuideId,
  SectionGuide
> = {
  basic: {
    id: "basic",
    title: "Thông tin cơ bản",
    summary:
      "Địa chỉ text hiển thị dưới H1. Block “Vị trí & kết nội” (ảnh + text) là mục riêng bên dưới — không nhúng Google Maps.",
    tips: [
      "Slug: chỉ chữ thường, số và dấu gạch ngang — không đổi sau publish.",
      "Địa chỉ (tỉnh/quận/phường/đường): dòng địa chỉ dưới tiêu đề dự án.",
      "Lat / Lng (tuỳ chọn): chỉ dùng nội bộ JSON-LD SEO — không hiển thị bản đồ trên trang.",
      "Logo CĐT: vuông ≥ 200×200 px — ảnh share Open Graph.",
    ],
    imageSpec: {
      aspect: "1:1",
      recommended: `${img.developerLogoSize}×${img.developerLogoSize} px`,
      minimum: `${img.developerLogoMin}×${img.developerLogoMin} px`,
      formats: "PNG (nền trong suốt) hoặc JPG",
      maxSize: "≤ 200 KB",
    },
    limits: [
      { label: "Slug", value: "≤ 160 ký tự, unique" },
      { label: "Lat", value: "-90 … 90 (WGS84)" },
      { label: "Lng", value: "-180 … 180 (WGS84)" },
    ],
  },
  seo: {
    id: "seo",
    title: "SEO & mô tả",
    summary:
      "Title và description xuất hiện trên Google / AI search. Hero subtitle hiển thị ngay dưới H1.",
    tips: [
      "SEO title: `[Tên dự án] [Quận] — [Loại hình]` — có từ khóa địa phương.",
      "SEO description: 1–2 câu có số liệu (số căn, giá từ, bàn giao) — không nhồi từ khóa.",
      "Mô tả tổng quan: 300–800 ký tự, xuống dòng theo đoạn; tránh SĐT trực tiếp (dùng CTA).",
      "Hero subtitle: tóm tắt USP trong 1 câu, ≤ 160 ký tự.",
      "Hero banner: 1 ảnh phối cảnh / ngoại cảnh full-width — quyết định ấn tượng đầu tiên. Thiếu banner → trang nhìn trống.",
      "Banner khuyến nghị 1920×720 px (21:9), JPG/WebP ≤ 800 KB, host CDN.",
    ],
    imageSpec: {
      aspect: img.heroBannerAspect,
      recommended: `${img.heroBannerWidth}×${img.heroBannerHeight} px`,
      minimum: `${img.heroBannerMinWidth}×${img.heroBannerMinHeight} px`,
      formats: img.formats.join(", "),
      maxSize: `≤ ${img.maxFileSizeKb} KB`,
      count: "1 ảnh banner / dự án",
    },
    limits: [
      { label: "SEO title", value: "50–60 ký tự (tối đa ~70)" },
      { label: "SEO description", value: "140–160 ký tự" },
      { label: "Hero subtitle", value: "≤ 160 ký tự" },
      { label: "Mô tả tổng quan", value: "300–1.200 ký tự khuyến nghị" },
    ],
  },
  stats: {
    id: "stats",
    title: "Thông số dự án",
    summary:
      "Số liệu hiển thị dạng thẻ thống kê và đưa vào JSON-LD (`numberOfAccommodationUnits`).",
    tips: [
      "Số căn / block: số nguyên dương, khớp hồ sơ bán hàng CĐT.",
      "Diện tích (ha): 1 chữ số thập phân (vd. 12.5).",
      "Mật độ (%): 0–100, không vượt quy hoạch.",
      "Ngày bàn giao: tháng/năm dự kiến — cập nhật khi CĐT thay đổi tiến độ.",
    ],
    limits: [
      { label: "Số căn", value: "Số nguyên > 0" },
      { label: "Block", value: "Số nguyên > 0" },
    ],
  },
  highlights: {
    id: "highlights",
    title: "Điểm nổi bật",
    summary:
      "Mỗi ô = một thẻ H3 trên trang công khai. Nên 3–6 mục, tập trung vị trí / pháp lý / tiện ích.",
    tips: [
      "Tiêu đề H3: ngắn, có thể dạng câu hỏi hoặc cụm danh từ (vd. “Vị trí kết nối thuận lợi?”).",
      "Nội dung: 2–4 câu, có số liệu cụ thể (phút, km, tên tiện ích).",
      "Không copy nguyên brochure PDF — viết lại cho web và SEO.",
      "Mục này không có ảnh riêng; dùng Gallery cho hình minh họa.",
    ],
    limits: [
      { label: "Số mục", value: "3–6 khuyến nghị" },
      { label: "Tiêu đề", value: "≤ 60 ký tự" },
      { label: "Nội dung", value: "80–250 ký tự / mục" },
    ],
  },
  amenities: {
    id: "amenities",
    title: "Tiện ích nội khu",
    summary: "Hiển thị dạng tag — liệt kê tiện ích thực tế đã/ sẽ bàn giao.",
    tips: [
      "Mỗi tag 1 tiện ích (vd. “Hồ bơi vô cực”, “Công viên nội khu”).",
      "5–12 tag; ưu tiên tiện ích khác biệt so với dự án cạnh tranh.",
      "Không ghi tiện ích chưa có trong hồ sơ CĐT.",
    ],
    limits: [
      { label: "Số tag", value: "5–12 khuyến nghị" },
      { label: "Mỗi tag", value: "≤ 30 ký tự" },
    ],
  },
  location: {
    id: "location",
    title: "Vị trí & kết nối (1 ảnh + text)",
    summary:
      "Trang công khai: ảnh bản đồ minh hoạ bên trái, nội dung chi tiết bên phải (desktop). Mobile: ảnh trên, text dưới. Không dùng Google Maps embed.",
    tips: [
      "Ảnh: thiết kế bản đồ hoặc infographic — từ dự án tới trường, bệnh viện, TTTM, metro… trong bán kính X km.",
      "Ghi rõ trên ảnh hoặc caption: bán kính (vd. 3 km, 5 km) và thời gian di chuyển (phút / xe).",
      "Text bên phải: mở rộng chi tiết từng hướng kết nối — tên đường, landmark, phút di chuyển (tối ưu SEO local).",
      "Cả ảnh và text đều nên có — thiếu ảnh thì chỉ hiện text; thiếu text thì chỉ hiện ảnh (không khuyến nghị).",
      "Alt text bắt buộc: mô tả bản đồ cho Google và người khiếm thị (vd. “Bản đồ khoảng cách HouseX Riverside tới Phú Mỹ Hưng 5 phút”).",
    ],
    imageSpec: {
      aspect: img.locationMapAspect,
      recommended: `${img.locationMapWidth}×${img.locationMapHeight} px`,
      minimum: `${img.locationMapMinWidth}×${img.locationMapMinHeight} px (cạnh ngắn ≥ ${img.minShortEdgePx} px)`,
      formats: img.formats.join(", "),
      maxSize: `≤ ${img.maxFileSizeKb} KB`,
      count: "Đúng 1 ảnh / dự án",
    },
    limits: [
      { label: "Nội dung text", value: "200–800 ký tự khuyến nghị" },
      { label: "Alt ảnh", value: "≤ 120 ký tự, có tên dự án" },
      { label: "Caption", value: "≤ 80 ký tự (tuỳ chọn)" },
    ],
  },
  faqs: {
    id: "faqs",
    title: "FAQ (Q&A SEO)",
    summary:
      "Câu hỏi dạng H3 + trả lời; đồng thời sinh JSON-LD FAQPage cho Google / AI.",
    tips: [
      "Câu hỏi kết thúc bằng “?” và chứa tên dự án (vd. “… có pháp lý đầy đủ chưa?”).",
      "Trả lời: 2–4 câu, thông tin thực tế — pháp lý, giá, tiến độ, loại hình.",
      "3–8 câu; ưu tiên câu khách hay hỏi trên hotline / Zalo.",
      "Không cam kết lãi suất / giá nếu chưa được CĐT duyệt.",
    ],
    limits: [
      { label: "Số FAQ", value: "3–8 khuyến nghị" },
      { label: "Câu hỏi", value: "≤ 120 ký tự" },
      { label: "Trả lời", value: "80–400 ký tự" },
    ],
  },
  gallery: {
    id: "gallery",
    title: "Gallery ảnh",
    summary:
      "Ảnh hiển thị lưới 16:9 trên trang công khai. Chất lượng ảnh ảnh hưởng trust và tốc độ tải trang.",
    tips: [
      `Khuyến nghị ${img.galleryCountMin}–${img.galleryCountMax} ảnh: phối cảnh, tiện ích, mẫu căn, view thực tế.`,
      "Ảnh 1 nên là phối cảnh tổng thể — dùng làm ảnh đại diện khi share (nếu bổ sung OG sau).",
      "Không đặt ảnh bản đồ vị trí ở đây — dùng mục “Vị trí & kết nối”.",
      "URL phải HTTPS, host CDN ổn định (không link Drive hết hạn).",
      "Chú thích: mô tả ngắn nội dung ảnh (hỗ trợ alt text / accessibility).",
      "Không dùng ảnh stock không liên quan; không watermark che mặt bằng.",
    ],
    imageSpec: {
      aspect: img.galleryAspect,
      recommended: `${img.galleryWidth}×${img.galleryHeight} px`,
      minimum: `${img.galleryMinWidth}×${img.galleryMinHeight} px (cạnh ngắn ≥ ${img.minShortEdgePx} px)`,
      formats: img.formats.join(", "),
      maxSize: `≤ ${img.maxFileSizeKb} KB / ảnh`,
      count: `${img.galleryCountMin}–${img.galleryCountMax} ảnh`,
    },
  },
  cta: {
    id: "cta",
    title: "CTA cuối trang",
    summary: "Nút kêu gọi hành động — dẫn về form liên hệ hoặc trang nội bộ HouseX.",
    tips: [
      "Dự án đang bán: nhãn CTA kiểu «Liên hệ tư vấn».",
      "Dự án sắp mở bán / tin sớm: «Đăng ký nhận thông tin dự án» — kèm ý «Không gọi điện chỉ vì đăng ký nhận cập nhật» (ADR-016).",
      "Link: đường dẫn nội bộ bắt đầu bằng `/` (vd. `#project-lead-form` hoặc `/lien-he`).",
      "Không dùng disclaimer kiểu “thông tin tham khảo / không phải CĐT”. Waitlist: mời cập nhật tiến độ qua Mini App; đang bán: mời tư vấn chi tiết.",
    ],
    limits: [
      { label: "Dòng mời tư vấn", value: "≤ 120 ký tự" },
      { label: "Nhãn CTA", value: "≤ 40 ký tự" },
      { label: "Link", value: "Đường dẫn nội bộ, vd. /lien-he" },
    ],
  },
};

export const PROJECT_LANDING_QUICK_REFERENCE = [
  "Hero banner: 1920×720 px — ảnh phối cảnh full-width phía sau H1.",
  "Vị trí: 1 ảnh bản đồ 4:3 (1200×900) + text chi tiết — không Google Maps embed.",
  `Gallery phối cảnh: ${img.galleryAspect}, ${img.galleryWidth}×${img.galleryHeight} px.`,
  "SEO description: 140–160 ký tự.",
  "FAQ: 3–8 câu hỏi có tên dự án — sinh JSON-LD tự động.",
] as const;
