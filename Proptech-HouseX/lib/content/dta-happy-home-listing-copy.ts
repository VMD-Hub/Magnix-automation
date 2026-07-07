import {
  DTA_HAPPY_HOME_HANDOVER_LABEL,
  DTA_HAPPY_HOME_INVENTORY_A10,
  dtaListingCode,
  type DtaHappyHomeUnitRow,
} from "@/lib/content/dta-happy-home-inventory-a10";
import {
  buildDtaConnectivityMarkdown,
  CONNECTIVITY_OPENINGS,
  CONNECTIVITY_TITLE_HOOKS,
  pickConnectivityLead,
} from "@/lib/content/dta-happy-home-connectivity";

const PROJECT = "DTA Happy Home Nhơn Trạch";
const LOCATION = "Khu đô thị DTA City, Nguyễn Văn Cừ, Phước An, Nhơn Trạch, Đồng Nai";

const CTAS = [
  {
    label: "Tính khoản vay mua NOXH",
    href: "/cong-cu/tinh-khoan-vay",
    line: "Dùng công cụ tính lãi suất & trả góp trên HouseX để ước lượng vốn tự có và dòng tiền hàng tháng trước khi giữ suất.",
  },
  {
    label: "Đăng ký tư vấn hồ sơ NOXH miễn phí",
    href: "/lien-he",
    line: "HouseX hỗ trợ rà soát điều kiện mua nhà ở xã hội và checklist hồ sơ — miễn phí, không thay vai trò CĐT.",
  },
  {
    label: "Xem dự án & chính sách thanh toán",
    href: "/du-an/dta-happy-home-nhon-trach",
    line: "Tra cứu mặt bằng, nhà mẫu, 3 phương thức thanh toán và FAQ vay ngân hàng liên kết trên trang dự án.",
  },
] as const;

/**
 * Khung tiêu đề tin đăng (tham khảo Batdongsan, Chợ Tốt BDS, Nhatot):
 * [Hook cảm xúc / câu hỏi ngầm] — [Neo SEO: NOXH + mã căn + diện tích/giá + Nhơn Trạch]
 *
 * Hook phổ biến: so sánh thuê trọ · mua bằng lương · an cư KCN · giá CĐT · TOD · Vành đai 3/cao tốc.
 */
const TITLE_HOOKS: readonly string[] = [
  "Mua nhà NOXH bằng lương — {code} {area}m², chỉ {price}",
  "Trả góp như thuê trọ, nhưng sở hữu căn {code} — NOXH Nhơn Trạch {price}",
  "Hết cảnh \"đốt\" tiền thuê trọ — Happy Home {code}, giá CĐT {price}",
  "Công nhân KCN Nhơn Trạch: an cư gần nơi làm việc — {code} {area}m² NOXH",
  "Sở hữu nhà đầu tiên từ {price} — NOXH DTA Happy Home {code}",
  "Chi phí hàng tháng như thuê trọ, có sổ hồng — {code} NOXH Happy Home {price}",
  CONNECTIVITY_TITLE_HOOKS[0]!,
  "Không chênh giá — giá CĐT căn {code} NOXH Nhơn Trạch, {price}",
  "Gia đình trẻ cũng sở hữu được nhà — {code} Happy Home NOXH, {area}m²",
  "Cơ hội có hạn — giữ chỗ {code} NOXH Happy Home từ {price}",
  "Mua nhà bằng lương công nhân — {code} NOXH {area}m², vay tới 70%",
  "Thuê trọ mãi hay sở hữu? Căn {code} NOXH chỉ {price}",
  "Hành lang ga quy hoạch S12/S13 — đô thị vệ tinh Nhơn Trạch: {code} NOXH {price}",
  "Đừng bỏ lỡ suất {code} — NOXH Happy Home {price}, view {view}",
  "Từ {price} sở hữu nhà riêng — {code} NOXH Nhơn Trạch, {area}m²",
  "Lương công nhân cũng mua được nhà — {code} NOXH Nhơn Trạch, {price}",
  "Trả góp như thuê trọ — nhưng là nhà của bạn: {code} NOXH",
  "Metro Thủ Thiêm – Long Thành (quy hoạch): NOXH {code} vùng ga S12/S13, {price}",
  "Tiết kiệm nhiều hơn thuê trọ dài hạn — Happy Home {code}, {area}m²",
  "Căn {code}: {highlight} — NOXH giá CĐT {price}",
  "NOXH minh bạch giá CĐT — {code} {area}m², {price} · Happy Home",
  CONNECTIVITY_TITLE_HOOKS[1]!,
  "Hai vợ chồng cùng lương, sở hữu {code} — NOXH {price}",
  "Bạn xứng đáng có nhà riêng — {code} NOXH Nhơn Trạch, {price}",
  "Cơ hội mở bán Block A10 — {code} NOXH {area}m², giá {price}",
  CONNECTIVITY_TITLE_HOOKS[2]!,
  "Đô thị vệ tinh hưởng lợi giao thông công cộng — {code} NOXH Nhơn Trạch, {area}m² · {price}",
  CONNECTIVITY_TITLE_HOOKS[3]!,
  CONNECTIVITY_TITLE_HOOKS[4]!,
  CONNECTIVITY_TITLE_HOOKS[5]!,
];

/** 30 câu mở đầu khác nhau — tránh trùng lặp SEO. */
const OPENINGS: readonly string[] = [
  "Suất bán {code} thuộc giỏ hàng chung Block A10 — lựa chọn NOXH thực tế cho công nhân KCN Nhơn Trạch cần an cư gần nơi làm việc.",
  CONNECTIVITY_OPENINGS[0]!,
  "Nếu bạn đang so sánh các suất NOXH cùng block, {code} nổi bật nhờ {highlight} trong tổng thể dự án 2.192 căn Happy Home.",
  "Block A10 Happy Home giới thiệu suất {code}: diện tích {area} m², hướng {dir} — mức giá minh bạch theo bảng CĐT.",
  "Đây là tin bán suất {code} thuộc nhà ở xã hội DTA Happy Home — không qua chênh giá, đối chiếu trực tiếp bảng giá chủ đầu tư.",
  CONNECTIVITY_OPENINGS[1]!,
  "Căn {code} nằm tại {location} — kết nối cao tốc Biên Hòa–Vũng Tàu và hướng sân bay Long Thành thuận tiện cho người làm việc vùng Đồng Nai.",
  "Happy Home {code} là suất NOXH trong giai đoạn triển khai tiếp theo — bàn giao dự kiến {handover}, phù hợp lập kế hoạch tài chính dài hạn.",
  "Tin đăng suất {code} tập trung vào {highlight} — thông số rõ ràng để bạn tự đối chiếu trước khi đăng ký giữ chỗ.",
  CONNECTIVITY_OPENINGS[2]!,
  "Suất {code} Block A10 có {highlight} — lựa chọn cân bằng giữa diện tích sử dụng và tổng giá trị căn.",
  "Căn hộ NOXH {code} phục vụ đối tượng theo Luật Nhà ở — HouseX công bố thông tin suất bán để bạn tra cứu minh bạch.",
  "Mã căn {code} thuộc dự án Happy Home do Công ty CP Đệ Tam (DTA) làm chủ đầu tư — giá bán niêm yết công khai.",
  "Suất {code} phù hợp người mua lần đầu: {highlight}, hỗ trợ vay ngân hàng liên kết tối đa 70% (theo chính sách CĐT).",
  "Tin bán {code} — NOXH Nhơn Trạch với {highlight}; xem thêm mặt bằng và nhà mẫu trên trang dự án HouseX.",
  CONNECTIVITY_OPENINGS[3]!,
  "Căn {code} Happy Home có view {view} — {highlight} so với các suất cùng diện tích.",
  "Suất NOXH {code} tại DTA City: giá {price}/căn (chính thức CĐT), diện tích thông thủy {area} m².",
  "Đăng ký tìm hiểu suất {code} nếu bạn ưu tiên {highlight} trong dự án nhà ở xã hội Nhơn Trạch.",
  CONNECTIVITY_OPENINGS[4]!,
  "Căn {code} là lựa chọn NOXH tầng {floor} tại Happy Home: {highlight}.",
  "Suất {code} thuộc quỹ căn giỏ hàng chung — số lượng có hạn theo từng đợt mở bán của CĐT.",
  "Tin đăng NOXH {code}: {highlight}; dự án 16 block cao 5 tầng, tiện ích nội khu đầy đủ.",
  "Mã {code} — căn NOXH DTA Happy Home, {highlight}, bàn giao dự kiến {handover}.",
  "Suất bán {code} hướng {dir}, view {view}: {highlight} cho người mua NOXH tại Đồng Nai.",
  "Căn {code} Block A10 Happy Home: {highlight} — tra cứu pháp lý NOXH trên trang dự án.",
  "NOXH {code} tại {location}: {highlight}, giá niêm yết {price}.",
  "Suất {code} — một trong 30 căn giỏ hàng chung Block A10 đang mở bán trên HouseX.",
  "Happy Home mở suất {code}: {highlight}; liên hệ tư vấn khi bạn cần hỗ trợ hồ sơ vay.",
  "Căn NOXH {code} DTA City — {highlight}, phù hợp an cư lâu dài cho người lao động miền Nam.",
];

function formatPriceShort(vnd: number): string {
  if (vnd >= 1_000_000_000) {
    return `${(vnd / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "")} tỷ`;
  }
  return `${Math.round(vnd / 1_000_000).toLocaleString("vi-VN")} triệu`;
}

function formatArea(area: number): string {
  return area.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
}

function bedroomLabel(area: number): string {
  if (area >= 48) return "2 phòng ngủ (rộng)";
  if (area >= 35) return "1–2 phòng ngủ";
  return "1 phòng ngủ / 2PN compact";
}

function unitHighlight(u: DtaHappyHomeUnitRow): string {
  if (u.netAreaM2 >= 50) {
    return `diện tích rộng ${formatArea(u.netAreaM2)} m² — suất lớn nhất block A10`;
  }
  if (u.view === "Công viên") {
    return `view công viên nội khu, hướng ${u.doorDirection}`;
  }
  if (u.floor === 2) {
    return `tầng thấp thuận tiện di chuyển, view ${u.view.toLowerCase()}`;
  }
  if (u.floor === 5) {
    return `tầng cao thoáng mát, view ${u.view.toLowerCase()}`;
  }
  if (u.floor === 4) {
    return `tầng 4 cân bằng view và chi phí, nhìn ${u.view.toLowerCase()}`;
  }
  return `tầng ${u.floor}, hướng ${u.doorDirection}, view ${u.view.toLowerCase()}`;
}

function floorNote(floor: number): string {
  if (floor === 2) {
    return "Tầng 2 phù hợp hộ có người cao tuổi hoặc gia đình có trẻ nhỏ — ít phụ thuộc thang máy.";
  }
  if (floor === 3) {
    return "Tầng 3 cân bằng độ cao và mức giá — lựa chọn phổ biến trong block cao 5 tầng.";
  }
  if (floor === 4) {
    return "Tầng 4 mang lại tầm nhìn thoáng hơn so với tầng 2–3, vẫn trong mức giá hợp lý.";
  }
  return "Tầng 5 — tầng cao nhất block A10, không gian thoáng, phù hợp gia đình trẻ.";
}

function viewNote(view: DtaHappyHomeUnitRow["view"]): string {
  if (view === "Công viên") {
    return "Hướng nhìn ra công viên nội khu — không gian xanh, phù hợp sinh hoạt cuối tuần.";
  }
  return "View nội khu — nhìn vào khu sinh hoạt chung, an ninh đồng bộ block A10.";
}

function pricePerM2(u: DtaHappyHomeUnitRow): string {
  const ppm = Math.round(u.priceVnd / u.netAreaM2 / 1_000_000);
  return `~${ppm.toLocaleString("vi-VN")} triệu/m²`;
}

function fillTemplate(
  template: string,
  u: DtaHappyHomeUnitRow,
  index: number,
): string {
  return template
    .replaceAll("{code}", u.unitCode)
    .replaceAll("{area}", formatArea(u.netAreaM2))
    .replaceAll("{dir}", u.doorDirection)
    .replaceAll("{view}", u.view)
    .replaceAll("{floor}", String(u.floor))
    .replaceAll("{price}", formatPriceShort(u.priceVnd))
    .replaceAll("{highlight}", unitHighlight(u))
    .replaceAll("{location}", LOCATION)
    .replaceAll("{handover}", DTA_HAPPY_HOME_HANDOVER_LABEL)
    .replaceAll("{project}", PROJECT)
    .replaceAll("{connectivityLead}", pickConnectivityLead(index));
}

export type DtaListingCopy = {
  title: string;
  description: string;
  seoDescription: string;
};

/** Gợi ý khung tiêu đề cho biên tập / admin — dùng khi tạo tin NOXH mới. */
export const LISTING_TITLE_FRAMEWORK = {
  formula:
    "[Hook cảm xúc hoặc so sánh] — [NOXH + dự án/vị trí + mã căn + giá hoặc diện tích]",
  hooks: [
    "Mua nhà bằng lương / lương công nhân cũng mua được nhà",
    "Trả góp như thuê trọ / chi phí hàng tháng như thuê trọ",
    "Hết cảnh đốt tiền thuê trọ / thuê trọ mãi hay sở hữu",
    "An cư gần KCN / đi làm gần nơi ở",
    "Sở hữu nhà đầu tiên / giấc mơ an cư",
    "Giá CĐT minh bạch / không chênh giá",
    "Cơ hội có hạn / giữ chỗ suất",
    "Đô thị vệ tinh hưởng lợi giao thông công cộng / metro ngầm quy hoạch / hành lang ga S12/S13",
    "Hạ tầng trending / Vành đai 3 / cao tốc / Quốc lộ 51 / 25B–25C / sân bay Long Thành",
  ],
  seoAnchors: [
    "NOXH",
    "Happy Home",
    "Nhơn Trạch",
    "TOD",
    "metro",
    "Vành đai 3",
    "cao tốc",
    "Quốc lộ 51",
    "quy hoạch",
    "mã căn",
    "giá CĐT",
    "m²",
  ],
  todGuidelines: [
    "Phân biệt: TOD đúng nghĩa = bán kính đi bộ ~1–1,5 km quanh ga; DTA Happy Home (~3–5 km tới ga quy hoạch) = đô thị vệ tinh hưởng lợi giao thông công cộng",
    "Dùng từ khóa: đô thị vệ tinh, hành lang ga, metro ngầm (quy hoạch), hạ tầng liên vùng, ga S12/S13",
    "Luôn gắn nhãn (quy hoạch) hoặc ngôn ngữ tương lai — không gọi DTA Happy Home là «TOD» hay «sống gần ga đi bộ»",
    "Kết hợp cảm xúc + SEO: ví dụ «Hành lang ga quy hoạch — an cư NOXH …» thay vì «Đón đầu TOD»",
  ],
  connectivityGuidelines: [
    "Tra toạ độ dự án → haversine với mốc cao tốc/Vành đai; chỉ ghi km khi ≤ 5 km và kèm «tham khảo bản đồ»",
    "Ưu tiên phút di chuyển từ CĐT (vd. cao tốc ~10 phút, Long Thành ~20 phút) — khớp trang dự án",
    "Từ khóa trending: Vành đai 3, cầu Nhơn Trạch, cao tốc HCM–Long Thành, QL51, 25B, 25C",
  ],
  avoid: [
    "Chỉ liệt kê: Bán căn X — Y m², Z triệu (khô, không click)",
    "Viết HOA toàn bộ hoặc spam từ khóa",
    "Cam kết lãi suất / trả góp cụ thể nếu chưa xác nhận ngân hàng",
    "Cam kết «cách metro 5 phút» / «TOD» / «sống gần ga đi bộ» / «tăng giá chắc chắn» khi tuyến chưa vận hành hoặc cách ga >1,5 km",
    "Ghi km đường bộ giả mà không có nguồn CĐT hoặc toạ độ tham chiếu",
  ],
} as const;

export function buildDtaUnitListingCopy(
  u: DtaHappyHomeUnitRow,
  index: number,
): DtaListingCopy {
  const opening = fillTemplate(OPENINGS[index % OPENINGS.length]!, u, index);
  const cta = CTAS[index % CTAS.length]!;
  const priceLabel = formatPriceShort(u.priceVnd);
  const beds = bedroomLabel(u.netAreaM2);

  const title = fillTemplate(TITLE_HOOKS[index % TITLE_HOOKS.length]!, u, index);

  const description = [
    opening,
    "",
    `## Thông tin suất ${u.unitCode}`,
    `- Mã căn: ${u.unitCode} (Block A10)`,
    `- Diện tích thông thủy: ${formatArea(u.netAreaM2)} m²`,
    `- Loại hình tham khảo: ${beds}`,
    `- Tầng: ${u.floor}/5`,
    `- Hướng cửa sổ, ban công: ${u.doorDirection}`,
    `- Hướng nhìn: ${u.view}`,
    `- Tổng giá bán: ${u.priceVnd.toLocaleString("vi-VN")} VNĐ (${priceLabel}) — giá chính thức từ CĐT Công ty CP Đệ Tam (DTA)`,
    `- Đơn giá tham khảo: ${pricePerM2(u)}`,
    `- Bàn giao dự kiến: ${DTA_HAPPY_HOME_HANDOVER_LABEL}`,
    "",
    `## ${u.unitCode} phù hợp ai?`,
    floorNote(u.floor),
    viewNote(u.view),
    `Dự án ${PROJECT} thuộc nhà ở xã hội tại ${LOCATION}. Quy mô 2.192 căn, 16 block cao 5 tầng; hỗ trợ vay ngân hàng liên kết tối đa 70% theo chính sách CĐT công bố.`,
    "",
    buildDtaConnectivityMarkdown(),
    "",
    "## Giá và pháp lý",
    "Giá niêm yết trên tin đăng là giá bán chính thức từ chủ đầu tư (bảng thống kê giỏ hàng chung). HouseX không chênh giá — thông tin mang tính tra cứu và kết nối tư vấn.",
    "",
    "## Bước tiếp theo",
    cta.line,
    `→ ${cta.label}: ${cta.href}`,
    "",
    index % 3 === 0
      ? "Bạn cũng có thể dùng công cụ tính khoản vay tại /cong-cu/tinh-khoan-vay với mức giá suất này."
      : index % 3 === 1
        ? "Cần rà soát điều kiện NOXH? Đăng ký tư vấn miễn phí tại /lien-he."
        : "Xem mặt bằng, nhà mẫu và chính sách thanh toán: /du-an/dta-happy-home-nhon-trach.",
  ].join("\n");

  const connectivitySeo = pickConnectivityLead(index).replace(/\s*\(.*\)/, "");
  const seoDescription = `${u.unitCode} NOXH Happy Home Nhơn Trạch: ${formatArea(u.netAreaM2)}m², tầng ${u.floor}. ${connectivitySeo}. Giá CĐT ${priceLabel}. Bàn giao ${DTA_HAPPY_HOME_HANDOVER_LABEL}. Tính vay trên HouseX.`;

  return { title, description, seoDescription };
}

export function buildAllDtaUnitListingCopy(): Map<string, DtaListingCopy> {
  const map = new Map<string, DtaListingCopy>();
  DTA_HAPPY_HOME_INVENTORY_A10.forEach((u, i) => {
    map.set(dtaListingCode(u.unitCode), buildDtaUnitListingCopy(u, i));
  });
  return map;
}
