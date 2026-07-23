/**
 * Dịch vụ HouseX — config routing, SEO, sitemap.
 * Copy công khai: HouseX là chủ dịch vụ; backend vẫn dùng affiliate lead source nội bộ.
 */

export type AffiliateFaq = { q: string; a: string };

export type AffiliatePartner = {
  name: string;
  note?: string;
};

export type AffiliateProductLine = {
  id: string;
  title: string;
  desc: string;
};

/** Landing dịch vụ chi tiết (nhóm định giá) hoặc bài SEO quảng bá (nhóm nội thất). */
export type AffiliateService = {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  body?: string;
  faqs: AffiliateFaq[];
  ctaLabel?: string;
  tags?: string[];
};

export type AffiliateVertical = {
  id: "tai-chinh" | "dinh-gia" | "noi-that";
  path: `/${string}`;
  layout: "promo-hub" | "service-cluster";
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  disclaimer: string;
  /** Ngân hàng / đơn vị triển khai — liệt kê trên trang hub (nếu có). */
  partners?: AffiliatePartner[];
  partnerIntro?: string;
  /** Tóm tắt sản phẩm (tài chính) — section trên hub, không tách URL. */
  productLines?: AffiliateProductLine[];
  hubFaqs?: AffiliateFaq[];
  toolLinks?: { label: string; href: string }[];
  /** Bài SEO quảng bá (nội thất: phong cách, nhà đẹp). */
  showcases?: AffiliateService[];
  /** Landing use-case (định giá). */
  services: AffiliateService[];
};

import {
  DING_GIA_HUB_FAQS,
  DING_GIA_HUB_INTRO,
  DING_GIA_SERVICES,
} from "@/lib/content/dinh-gia-affiliate-content";
import {
  TAI_CHINH_HUB_FAQS,
  TAI_CHINH_HUB_INTRO,
  TAI_CHINH_SERVICES,
} from "@/lib/content/tai-chinh-affiliate-content";
import { INTERIOR_CASE_STUDIES } from "@/lib/content/noi-that-content";
import { HOUSEX_SERVICE_NOTE } from "@/lib/content/housex-services-copy";

export { HOUSEX_SERVICE_NOTE as AFFILIATE_DISCLAIMER };

/** Ngân hàng hỗ trợ vay — cập nhật theo chương trình tín dụng. */
export const BANK_PARTNERS: AffiliatePartner[] = [
  { name: "Vietcombank", note: "Vay mua nhà, SXKD" },
  { name: "BIDV", note: "Vay mua BĐS dự án" },
  { name: "VietinBank", note: "Vay tiêu dùng & BĐS" },
  { name: "Agribank", note: "Vay nông thôn & đô thị" },
  { name: "Techcombank", note: "Vay mua căn hộ" },
  { name: "MB Bank", note: "Vay mua nhà, thế chấp" },
  { name: "VPBank", note: "Vay SME & cá nhân" },
  { name: "ACB", note: "Vay mua BĐS" },
  { name: "Sacombank", note: "Vay tiêu dùng có TSĐB" },
  { name: "HDBank", note: "Vay mua nhà ở" },
];

export const INTERIOR_PARTNERS: AffiliatePartner[] = [];

export const AFFILIATE_VERTICALS: AffiliateVertical[] = [
  {
    id: "tai-chinh",
    path: "/vay-mua-nha",
    layout: "service-cluster",
    title: "Vay mua nhà trên House X — hồ sơ, ngân hàng hỗ trợ, tính trả góp",
    metaDescription:
      "Vay mua nhà trên House X: hỗ trợ hồ sơ, danh sách ngân hàng, thế chấp, vay SXKD và bảo hiểm tài sản — đồng hành đến giải ngân hoặc nhận GCN.",
    h1: "Vay mua nhà & hỗ trợ hồ sơ ngân hàng",
    intro: TAI_CHINH_HUB_INTRO,
    disclaimer: HOUSEX_SERVICE_NOTE,
    partners: BANK_PARTNERS,
    partnerIntro:
      "House X hợp tác liên kết với các ngân hàng dưới đây để hỗ trợ hồ sơ và kết nối giao dịch vay mua nhà / thế chấp — mô hình phổ biến trên các sàn và nền tảng Proptech.",
    hubFaqs: TAI_CHINH_HUB_FAQS,
    toolLinks: [
      { label: "Tính trả góp hàng tháng", href: "/tinh-tra-gop" },
      { label: "Bảo hiểm nhà, kho & xe", href: "/vay-mua-nha/bao-hiem-tai-san" },
      { label: "Thẩm định cho ngân hàng", href: "/dinh-gia/tham-dinh-ngan-hang" },
    ],
    services: TAI_CHINH_SERVICES,
  },
  {
    id: "dinh-gia",
    path: "/dinh-gia",
    layout: "service-cluster",
    title: "Định giá & thẩm định bất động sản",
    metaDescription:
      "Dịch vụ thẩm định giá bất động sản HouseX: tra cứu giá chủ nhà, thẩm định ngân hàng, phân chia thừa kế, chứng minh tài sản visa, chứng thư định giá.",
    h1: "Định giá & thẩm định bất động sản",
    intro: DING_GIA_HUB_INTRO,
    disclaimer: HOUSEX_SERVICE_NOTE,
    hubFaqs: DING_GIA_HUB_FAQS,
    toolLinks: [
      { label: "Tính khoản vay mua nhà", href: "/tinh-tra-gop" },
      { label: "Dịch vụ tài chính HouseX", href: "/vay-mua-nha" },
    ],
    services: DING_GIA_SERVICES,
  },
  {
    id: "noi-that",
    path: "/thiet-ke-thi-cong-noi-that",
    layout: "promo-hub",
    title:
      "Thiết kế & thi công nội thất House X — kết nối studio đối tác chiến lược",
    metaDescription:
      "House X kết nối studio đối tác chiến lược thiết kế & thi công nội thất tại TP.HCM. Căn hộ, nhà phố, văn phòng — khảo sát, phối cảnh 3D, báo giá sau khảo sát.",
    h1: "Thiết kế & thi công nội thất — studio đối tác chiến lược",
    intro:
      "House X kết nối bạn với studio đối tác chiến lược — từ thiết kế concept, phối cảnh 3D đến thi công hoàn thiện căn hộ, nhà phố và văn phòng. Cam kết minh bạch quy trình; báo giá chi tiết sau khảo sát hiện trạng.",
    disclaimer:
      "House X là đầu mối tư vấn và kết nối studio đối tác chiến lược tại TP.HCM & vùng lân cận. Chi phí tham khảo trên website mang tính ước lượng — báo giá chính thức sau khảo sát.",
    partnerIntro:
      "House X làm việc với các studio đối tác chiến lược thiết kế & thi công tại TP.HCM — phù hợp từng loại hình và ngân sách.",
    hubFaqs: [
      {
        q: "House X kết nối studio đối tác chiến lược như thế nào?",
        a: "House X không vận hành xưởng thi công nội thất riêng. Mô hình là kết nối studio đối tác chiến lược: bạn có một đầu mối tư vấn trên House X (/thiet-ke-thi-cong-noi-that); thiết kế và thi công do studio triển khai với quy trình và báo giá minh bạch trước khi ký hợp đồng.",
      },
      {
        q: "House X thi công trực tiếp hay qua đối tác?",
        a: "Qua studio đối tác chiến lược của House X — không thi công trực tiếp như nhà thầu nội thất độc lập. House X đồng hành brief, khảo sát và bàn giao đầu mối studio phù hợp.",
      },
      {
        q: "House X hỗ trợ những loại nhà nào?",
        a: "Căn hộ chung cư, nhà phố, biệt thự, shophouse và văn phòng tại TP.HCM và vùng lân cận — từ thiết kế 2D/3D đến thi công hoàn thiện qua studio đối tác chiến lược.",
      },
      {
        q: "Làm sao nhận báo giá?",
        a: "Gửi form liên hệ kèm diện tích, quận/huyện, phong cách và ngân sách dự kiến. House X sắp lịch khảo sát và chuyển báo giá chi tiết từ studio — không cam kết giá cố định trên website.",
      },
      {
        q: "Thi công căn hộ có cần đăng ký ban quản lý?",
        a: "Thường cần đăng ký thi công với ban quản lý chung cư. Studio đối tác chiến lược hỗ trợ checklist giấy tờ khi triển khai.",
      },
      {
        q: "Chi phí thi công nội thất ước tính thế nào?",
        a: "Phụ thuộc diện tích, hạng mục và vật liệu. House X cung cấp ước lượng sơ bộ sau khảo sát — mức giá công khai trên web chỉ mang tính tham khảo chung.",
      },
    ],
    showcases: [
      {
        slug: "hien-dai",
        title: "Nội thất hiện đại",
        tags: ["Căn hộ", "Nhà phố"],
        metaDescription:
          "Phong cách nội thất hiện đại cho căn hộ và nhà phố: tối giản đường nét, ánh sáng tự nhiên, vật liệu cao cấp. Ý tưởng thiết kế từ HouseX.",
        h1: "Phong cách nội thất hiện đại — Gọn gàng, sang trọng",
        intro:
          "Nội thất hiện đại ưu tiên không gian mở, màu trung tính, nội thất built-in và ánh sáng layer. Phù hợp căn hộ chung cư diện tích vừa và nhà phố 3–5 tầng tại TP.HCM.",
        body:
          "Điểm nhấn thường gặp: bếp liền phòng khách, kính cường lực đón sáng, sàn gỗ hoặc gạch lớn format, hệ tủ âm tường. HouseX khảo sát hiện trạng và dựng phối cảnh 3D trước khi thi công.",
        faqs: [
          {
            q: "Nội thất hiện đại có đắt không?",
            a: "Chi phí phụ thuộc diện tích, vật liệu và hạng mục thi công. Gửi form để nhận báo giá sơ bộ — minh bạch trước khi triển khai.",
          },
          {
            q: "Căn bao nhiêu m² phù hợp phong cách này?",
            a: "Từ khoảng 55 m² trở lên đều áp dụng được; căn nhỏ cần tối ưu storage và bố cục thông minh.",
          },
        ],
        ctaLabel: "Tư vấn thiết kế hiện đại",
      },
      {
        slug: "scandinavian",
        title: "Scandinavian — Bắc Âu ấm áp",
        tags: ["Căn hộ", "Tone sáng"],
        metaDescription:
          "Nội thất Scandinavian: trắng–be, gỗ sáng, textile ấm — ý tưởng decor căn hộ và nhà phố tại Việt Nam từ studio đối tác House X.",
        h1: "Phong cách Scandinavian cho nhà ở Việt Nam",
        intro:
          "Scandi kết hợp nền trắng, gỗ oak/ash, đèn pendant và cây xanh. Tạo cảm giác ấm áp dù palette sáng — rất phổ biến với căn hộ trẻ tại TP.HCM.",
        body:
          "Lưu ý khí hậu nhiệt đới: ưu tiên thông gió, rèm blackout, vật liệu chống ẩm cho khu bếp và WC. HouseX điều chỉnh palette cho phù hợp ánh sáng mặt trời mạnh.",
        faqs: [
          {
            q: "Scandinavian có hợp nhà phố không?",
            a: "Có, đặc biệt mặt tiền hẹp cần ánh sáng tối đa. Cần phối màu và vật liệu chống bám bụi phù hợp.",
          },
        ],
        ctaLabel: "Nhận tư vấn phong cách Scandi",
      },
      {
        slug: "indochine",
        title: "Indochine — Đông Dương đương đại",
        tags: ["Biệt thự", "Nhà phố cổ"],
        metaDescription:
          "Nội thất Indochine: gạch hoa, gỗ tối màu, đèn lồng pha hiện đại — cảm hứng nhà đẹp biệt thự và nhà phố từ studio đối tác House X.",
        h1: "Phong cách Indochine trong nhà ở hiện đại",
        intro:
          "Indochine gợi nhớ Sài Gòn xưa: gạch bông, lam gỗ, tủ chè, ghế mây pha chrome. Phù hợp biệt thự, nhà phố cải tạo giữ nét cổ.",
        faqs: [
          {
            q: "Indochine có bị nặng nề?",
            a: "Có thể cân bằng bằng tường trắng, ánh sáng indirect và tỷ lệ 70/30 giữa nền sáng và điểm nhấn gỗ.",
          },
        ],
        ctaLabel: "Tư vấn thiết kế Indochine",
      },
      {
        slug: "toi-gian",
        title: "Tối giản (Minimal)",
        tags: ["Căn hộ", "Tiết kiệm"],
        metaDescription:
          "Nội thất tối giản: ít đồ, nhiều không gian trống, chất liệu bền — ý tưởng decor căn hộ nhỏ và nhà phố trên House X Proptech.",
        h1: "Nội thất tối giản — Less is more",
        intro:
          "Minimalism loại bỏ chi tiết thừa, giữ đồ dùng chất lượng và bố trí âm tường. Lý tưởng cho người bận rộn và căn hộ cần cảm giác rộng.",
        faqs: [
          {
            q: "Tối giản có thiếu ấm cúng?",
            a: "Bù bằng texture (vải linen, gỗ mộc), ánh sáng vàng ấm và vài điểm nhấn nghệ thuật.",
          },
        ],
        ctaLabel: "Thiết kế nội thất tối giản",
      },
    ],
    services: [],
  },
];

export function getVertical(id: AffiliateVertical["id"]): AffiliateVertical {
  const v = AFFILIATE_VERTICALS.find((x) => x.id === id);
  if (!v) throw new Error(`Unknown vertical: ${id}`);
  return v;
}

export function getService(verticalId: AffiliateVertical["id"], slug: string) {
  const v = getVertical(verticalId);
  return v.services.find((s) => s.slug === slug);
}

export function getShowcase(verticalId: "noi-that", slug: string) {
  const v = getVertical(verticalId);
  return v.showcases?.find((s) => s.slug === slug);
}

/** URL trang phong cách (nested). */
export function showcasePagePath(verticalPath: string, slug: string) {
  return `${verticalPath}/phong-cach/${slug}`;
}

export function affiliateSitemapEntries(baseUrl: string) {
  const entries: { url: string; priority: number }[] = [
    { url: `${baseUrl}/dich-vu`, priority: 0.85 },
    { url: `${baseUrl}/lien-he`, priority: 0.6 },
  ];
  for (const v of AFFILIATE_VERTICALS) {
    entries.push({ url: `${baseUrl}${v.path}`, priority: 0.85 });
    if (v.layout === "service-cluster") {
      for (const s of v.services) {
        entries.push({ url: `${baseUrl}${v.path}/${s.slug}`, priority: 0.75 });
      }
    }
    if (v.id === "noi-that") {
      entries.push({ url: `${baseUrl}/thiet-ke-thi-cong-noi-that/nha-dep`, priority: 0.78 });
      if (v.showcases) {
        for (const s of v.showcases) {
          entries.push({
            url: `${baseUrl}${showcasePagePath(v.path, s.slug)}`,
            priority: 0.72,
          });
        }
      }
      // Case studies
      for (const c of INTERIOR_CASE_STUDIES) {
        entries.push({
          url: `${baseUrl}/thiet-ke-thi-cong-noi-that/cong-trinh/${c.slug}`,
          priority: 0.7,
        });
      }
    } else if (v.showcases) {
      for (const s of v.showcases) {
        entries.push({ url: `${baseUrl}${v.path}/${s.slug}`, priority: 0.72 });
      }
    }
  }
  return entries;
}
