import {
  DTA_HAPPY_HOME_HANDOVER_LABEL,
  DTA_HAPPY_HOME_INVENTORY_A10,
  dtaListingCode,
  type DtaHappyHomeUnitRow,
} from "@/lib/content/dta-happy-home-inventory-a10";

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

/** 30 câu mở đầu khác nhau — tránh trùng lặp SEO. */
const OPENINGS: readonly string[] = [
  "Suất bán {code} thuộc giỏ hàng chung Block A10 — lựa chọn NOXH thực tế cho công nhân KCN Nhơn Trạch cần an cư gần nơi làm việc.",
  "Căn {code} Happy Home đang mở bán với giá niêm yết chính thức từ CĐT — phù hợp hộ gia đình trẻ muốn sở hữu NOXH sớm tại DTA City.",
  "Nếu bạn đang so sánh các suất NOXH cùng block, {code} nổi bật nhờ {highlight} trong tổng thể dự án 2.192 căn Happy Home.",
  "Block A10 Happy Home giới thiệu suất {code}: diện tích {area} m², hướng {dir} — mức giá minh bạch theo bảng CĐT.",
  "Đây là tin bán suất {code} thuộc nhà ở xã hội DTA Happy Home — không qua chênh giá, đối chiếu trực tiếp bảng giá chủ đầu tư.",
  "Suất {code} hướng tới người lao động cần căn hộ compact, tiết kiệm chi phí đi lại so với thuê trọ dài hạn tại Nhơn Trạch.",
  "Căn {code} nằm tại {location} — kết nối cao tốc Biên Hòa–Vũng Tàu và hướng sân bay Long Thành thuận tiện cho người làm việc vùng Đồng Nai.",
  "Happy Home {code} là suất NOXH trong giai đoạn triển khai tiếp theo — bàn giao dự kiến {handover}, phù hợp lập kế hoạch tài chính dài hạn.",
  "Tin đăng suất {code} tập trung vào {highlight} — thông số rõ ràng để bạn tự đối chiếu trước khi đăng ký giữ chỗ.",
  "Với {code}, bạn sở hữu căn NOXH trong hệ sinh thái DTA City: chợ DTA, bệnh viện, trường học quốc tế ngay ngoại khu.",
  "Suất {code} Block A10 có {highlight} — lựa chọn cân bằng giữa diện tích sử dụng và tổng giá trị căn.",
  "Căn hộ NOXH {code} phục vụ đối tượng theo Luật Nhà ở — HouseX công bố thông tin suất bán để bạn tra cứu minh bạch.",
  "Mã căn {code} thuộc dự án Happy Home do Công ty CP Đệ Tam (DTA) làm chủ đầu tư — giá bán niêm yết công khai.",
  "Suất {code} phù hợp người mua lần đầu: {highlight}, hỗ trợ vay ngân hàng liên kết tối đa 70% (theo chính sách CĐT).",
  "Tin bán {code} — NOXH Nhơn Trạch với {highlight}; xem thêm mặt bằng và nhà mẫu trên trang dự án HouseX.",
  "Block A10 mở bán suất {code} tầng {floor}: {highlight} cho gia đình 2–3 thành viên.",
  "Căn {code} Happy Home có view {view} — {highlight} so với các suất cùng diện tích.",
  "Suất NOXH {code} tại DTA City: giá {price}/căn (chính thức CĐT), diện tích thông thủy {area} m².",
  "Đăng ký tìm hiểu suất {code} nếu bạn ưu tiên {highlight} trong dự án nhà ở xã hội Nhơn Trạch.",
  "Happy Home {code} — suất bán block A10 với hướng cửa {dir}, phù hợp thói quen sinh hoạt gia đình Việt.",
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

function fillTemplate(template: string, u: DtaHappyHomeUnitRow, index: number): string {
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
    .replaceAll("{project}", PROJECT);
}

export type DtaListingCopy = {
  title: string;
  description: string;
  seoDescription: string;
};

export function buildDtaUnitListingCopy(
  u: DtaHappyHomeUnitRow,
  index: number,
): DtaListingCopy {
  const opening = fillTemplate(OPENINGS[index % OPENINGS.length]!, u, index);
  const cta = CTAS[index % CTAS.length]!;
  const priceLabel = formatPriceShort(u.priceVnd);
  const beds = bedroomLabel(u.netAreaM2);

  const title = `Bán căn ${u.unitCode} NOXH ${PROJECT} — ${formatArea(u.netAreaM2)}m² tầng ${u.floor}, ${priceLabel}`;

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

  const seoDescription = `${u.unitCode} NOXH Happy Home Nhơn Trạch: ${formatArea(u.netAreaM2)}m², tầng ${u.floor}, ${u.doorDirection}, view ${u.view}. Giá CĐT ${priceLabel}. Bàn giao ${DTA_HAPPY_HOME_HANDOVER_LABEL}. Tính vay & tư vấn hồ sơ trên HouseX.`;

  return { title, description, seoDescription };
}

export function buildAllDtaUnitListingCopy(): Map<string, DtaListingCopy> {
  const map = new Map<string, DtaListingCopy>();
  DTA_HAPPY_HOME_INVENTORY_A10.forEach((u, i) => {
    map.set(dtaListingCode(u.unitCode), buildDtaUnitListingCopy(u, i));
  });
  return map;
}
