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
    path: "/tai-chinh",
    layout: "promo-hub",
    title: "Tài chính & vay vốn mua nhà — HouseX",
    metaDescription:
      "Dịch vụ tư vấn vay mua bất động sản và vay kinh doanh trên HouseX. Hỗ trợ làm hồ sơ, so sánh gói vay và theo sát tiến độ duyệt.",
    h1: "Tài chính & vay vốn",
    intro:
      "HouseX hỗ trợ bạn chọn gói vay phù hợp — mua nhà, căn hộ, đất nền hoặc bổ sung vốn kinh doanh. Đội ngũ tư vấn làm rõ nhu cầu, chuẩn bị hồ sơ và đồng hành đến khi ngân hàng phê duyệt.",
    disclaimer: HOUSEX_SERVICE_NOTE,
    partners: BANK_PARTNERS,
    partnerIntro:
      "HouseX hỗ trợ làm hồ sơ vay tại các ngân hàng thương mại phổ biến. Lãi suất và điều kiện cụ thể được ngân hàng công bố tại thời điểm ký hợp đồng tín dụng.",
    productLines: [
      {
        id: "vay-mua-bds",
        title: "Vay mua bất động sản",
        desc: "Nhà ở, căn hộ chung cư, nhà phố, shophouse, đất nền — thế chấp tài sản, chứng minh thu nhập. Phù hợp người mua nhà lần đầu hoặc đầu tư.",
      },
      {
        id: "vay-sxkd",
        title: "Vay sản xuất kinh doanh",
        desc: "Vốn lưu động, mua máy móc, mở rộng xưởng — dành cho hộ kinh doanh và SME. Hồ sơ và TSĐB theo quy định từng ngân hàng.",
      },
    ],
    hubFaqs: [
      {
        q: "Quy trình vay qua HouseX diễn ra thế nào?",
        a: "Bạn gửi yêu cầu → tư vấn viên HouseX làm rõ mục đích vay, thu nhập và tài sản đảm bảo → hướng dẫn chuẩn bị hồ sơ → đồng hành đến khi ngân hàng phê duyệt và giải ngân.",
      },
      {
        q: "Sau khi gửi form thì ai liên hệ?",
        a: "Tư vấn viên HouseX hoặc trợ lý AI sẽ gọi lại trong giờ làm việc để làm rõ nhu cầu và hướng dẫn bước tiếp theo.",
      },
      {
        q: "Có cần chọn ngân hàng trước không?",
        a: "Không bắt buộc. Bạn mô tả nhu cầu; chúng tôi gợi ý gói vay và ngân hàng phù hợp nhất với hồ sơ của bạn.",
      },
      {
        q: "Công cụ tính khoản vay dùng thế nào?",
        a: "Dùng công cụ miễn phí trên HouseX để ước lượng tiền trả hàng tháng trước khi làm hồ sơ chính thức. Kết quả mang tính tham khảo.",
      },
    ],
    toolLinks: [
      { label: "Tính khoản vay mua nhà", href: "/cong-cu/tinh-khoan-vay" },
    ],
    services: [],
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
      { label: "Tính khoản vay mua nhà", href: "/cong-cu/tinh-khoan-vay" },
      { label: "Dịch vụ tài chính HouseX", href: "/tai-chinh" },
    ],
    services: DING_GIA_SERVICES,
  },
  {
    id: "noi-that",
    path: "/noi-that",
    layout: "promo-hub",
    title: "Thiết kế nội thất — HouseX",
    metaDescription:
      "Dịch vụ thiết kế và thi công nội thất trên HouseX. Cảm hứng phong cách, khảo sát hiện trạng và báo giá trọn gói.",
    h1: "Thiết kế nội thất & không gian sống",
    intro:
      "HouseX cung cấp dịch vụ thiết kế và thi công nội thất — từ cảm hứng phong cách, phối cảnh 3D đến hoàn thiện căn hộ, nhà phố, biệt thự. Gửi yêu cầu để được khảo sát và nhận báo giá chi tiết.",
    disclaimer: HOUSEX_SERVICE_NOTE,
    hubFaqs: [
      {
        q: "HouseX thiết kế nội thất những loại nhà nào?",
        a: "Căn hộ chung cư, nhà phố, biệt thự và shophouse tại TP.HCM và vùng lân cận — từ thiết kế 2D/3D đến thi công hoàn thiện.",
      },
      {
        q: "Làm sao nhận báo giá thiết kế?",
        a: "Gửi form liên hệ kèm diện tích, khu vực, phong cách và ngân sách dự kiến. Đội ngũ HouseX sẽ liên hệ khảo sát và báo giá cụ thể.",
      },
      {
        q: "Thi công có cần xin phép ban quản lý không?",
        a: "Căn hộ chung cư thường cần đăng ký thi công với ban quản lý. HouseX hỗ trợ checklist giấy tờ khi triển khai.",
      },
    ],
    showcases: [
      {
        slug: "phong-cach-hien-dai",
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
        slug: "phong-cach-scandinavian",
        title: "Scandinavian — Bắc Âu ấm áp",
        tags: ["Căn hộ", "Tone sáng"],
        metaDescription:
          "Nội thất Scandinavian: trắng–be, gỗ sáng, textile ấm. Ý tưởng decor nhà ở Việt Nam từ HouseX.",
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
        slug: "phong-cach-indochine",
        title: "Indochine — Đông Dương đương đại",
        tags: ["Biệt thự", "Nhà phố cổ"],
        metaDescription:
          "Nội thất Indochine: gạch hoa, gỗ tối màu, đèn lồng, pha hiện đại. Cảm hứng nhà đẹp từ HouseX.",
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
        slug: "phong-cach-toi-gian",
        title: "Tối giản (Minimal)",
        tags: ["Căn hộ", "Tiết kiệm"],
        metaDescription:
          "Nội thất tối giản: ít đồ, nhiều không gian trống, chất liệu bền. Ý tưởng decor căn hộ nhỏ.",
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
      {
        slug: "can-ho-dep-y-tuong",
        title: "Căn hộ đẹp — Gợi ý bố trí",
        tags: ["SEO", "Căn hộ"],
        metaDescription:
          "Ý tưởng căn hộ đẹp TP.HCM: phòng khách, bếp, phòng ngủ master. Dịch vụ thiết kế nội thất HouseX.",
        h1: "Căn hộ đẹp — Bố trí thông minh từng phòng",
        intro:
          "Gợi ý zoning: sảnh–phòng khách–bếp liên thông; phòng ngủ master có walk-in nhỏ; phòng phụ dual-purpose làm workspace. HouseX triển khai 2D/3D theo hiện trạng thực tế.",
        faqs: [
          {
            q: "Thiết kế căn hộ chung cư cần xin phép không?",
            a: "Thi công hoàn thiện thường cần đăng ký với ban quản lý. HouseX hỗ trợ checklist giấy tờ khi triển khai.",
          },
        ],
        ctaLabel: "Báo giá thiết kế căn hộ",
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
    if (v.showcases) {
      for (const s of v.showcases) {
        entries.push({ url: `${baseUrl}${v.path}/${s.slug}`, priority: 0.72 });
      }
    }
  }
  return entries;
}
