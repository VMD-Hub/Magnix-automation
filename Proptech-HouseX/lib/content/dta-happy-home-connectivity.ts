import { haversineKm } from "@/lib/geo/haversine";

/** Toạ độ tham chiếu DTA Happy Home / DTA City (preview mock & seed). */
export const DTA_HAPPY_HOME_GEO = {
  lat: 10.697,
  lng: 106.934,
  address: "Đường Nguyễn Văn Cừ, Khu đô thị DTA City, Phước An, Nhơn Trạch, Đồng Nai",
} as const;

export type ConnectivityStatus = "operational" | "planned";

export type DtaConnectivityNode = {
  id: string;
  name: string;
  keywords: readonly string[];
  lat: number;
  lng: number;
  status: ConnectivityStatus;
  /** Thời gian di chuyển theo thông tin CĐT / landing — ưu tiên trong copy. */
  travelMinutesCdT?: number;
  /** Chỉ in khoảng cách thẳng km khi ≤ ngưỡng này (tránh cam kết sai đường bộ). */
  maxKmForDistanceClaim?: number;
};

/** Mốc hạ tầng quanh DTA — toạ độ tham chiếu map, khoảng cách great-circle. */
export const DTA_CONNECTIVITY_NODES: readonly DtaConnectivityNode[] = [
  {
    id: "cao-toc-bien-hoa-vung-tau",
    name: "Cao tốc Biên Hòa – Vũng Tàu",
    keywords: ["cao tốc", "Biên Hòa", "Vũng Tàu"],
    lat: 10.715,
    lng: 106.948,
    status: "operational",
    travelMinutesCdT: 10,
    maxKmForDistanceClaim: 5,
  },
  {
    id: "cao-toc-hcm-long-thanh",
    name: "Cao tốc TP.HCM – Long Thành – Dầu Giày",
    keywords: ["cao tốc", "Long Thành", "Dầu Giày"],
    lat: 10.718,
    lng: 106.928,
    status: "operational",
    travelMinutesCdT: 10,
    maxKmForDistanceClaim: 5,
  },
  {
    id: "quoc-lo-51",
    name: "Quốc lộ 51",
    keywords: ["Quốc lộ 51", "QL51"],
    lat: 10.704,
    lng: 106.958,
    status: "operational",
    travelMinutesCdT: 15,
    maxKmForDistanceClaim: 5,
  },
  {
    id: "vanh-dai-3-cau-nhon-trach",
    name: "Vành đai 3 (cầu Nhơn Trạch)",
    keywords: ["Vành đai 3", "cầu Nhơn Trạch"],
    lat: 10.748,
    lng: 106.902,
    status: "operational",
  },
  {
    id: "duong-25b",
    name: "Đường 25B (Tôn Đức Thắng)",
    keywords: ["25B", "Tôn Đức Thắng"],
    lat: 10.692,
    lng: 106.941,
    status: "operational",
    maxKmForDistanceClaim: 5,
  },
  {
    id: "duong-25c",
    name: "Đường 25C (Nguyễn Ái Quốc)",
    keywords: ["25C", "Nguyễn Ái Quốc"],
    lat: 10.688,
    lng: 106.952,
    status: "operational",
    travelMinutesCdT: 20,
    maxKmForDistanceClaim: 5,
  },
  {
    id: "san-bay-long-thanh",
    name: "Sân bay quốc tế Long Thành",
    keywords: ["sân bay Long Thành", "Long Thành"],
    lat: 10.955,
    lng: 107.045,
    status: "operational",
    travelMinutesCdT: 20,
  },
  {
    id: "metro-thu-thiem-long-thanh",
    name: "Metro / đường sắt Thủ Thiêm – Long Thành",
    keywords: ["metro", "đường sắt", "ga S12", "ga S13", "hành lang ga"],
    lat: 10.712,
    lng: 106.918,
    status: "planned",
  },
] as const;

export type ResolvedConnectivity = DtaConnectivityNode & {
  distanceKm: number;
  /** Một dòng SEO: ưu tiên phút CĐT, kèm km nếu trong ngưỡng. */
  seoLine: string;
};

function formatKm(km: number): string {
  if (km < 1) return `<1 km`;
  if (km < 10) return `~${km.toFixed(1).replace(".0", "")} km`;
  return `~${Math.round(km)} km`;
}

export function resolveDtaConnectivity(
  geo: { lat: number; lng: number } = DTA_HAPPY_HOME_GEO,
): ResolvedConnectivity[] {
  return DTA_CONNECTIVITY_NODES.map((node) => {
    const distanceKm = haversineKm(geo.lat, geo.lng, node.lat, node.lng);
    const parts: string[] = [node.name];
    if (node.travelMinutesCdT != null) {
      parts.push(`khoảng ${node.travelMinutesCdT} phút (theo thông tin CĐT)`);
    }
    if (
      node.maxKmForDistanceClaim != null &&
      distanceKm <= node.maxKmForDistanceClaim
    ) {
      parts.push(`${formatKm(distanceKm)} đường thẳng — tham khảo bản đồ`);
    }
    if (node.status === "planned") {
      parts.push("(quy hoạch — chưa vận hành)");
    }
    return { ...node, distanceKm, seoLine: parts.join(" · ") };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}

export function dtaConnectivityWithinKm(
  maxKm: number,
  geo: { lat: number; lng: number } = DTA_HAPPY_HOME_GEO,
): ResolvedConnectivity[] {
  return resolveDtaConnectivity(geo).filter((n) => n.distanceKm <= maxKm);
}

/** 8 mẫu tiêu đề hạ tầng — xoay vòng cùng block tin đăng. */
export const CONNECTIVITY_TITLE_HOOKS: readonly string[] = [
  "Cao tốc Biên Hòa–Vũng Tàu ~10 phút — NOXH {code} Happy Home {price}",
  "Gần Vành đai 3 & cầu Nhơn Trạch — sở hữu {code} NOXH {price}",
  "Kết nối Quốc lộ 51 thuận tiện — an cư NOXH {code} Nhơn Trạch, {area}m²",
  "Hạ tầng cao tốc liên vùng — {code} NOXH DTA City từ {price}",
  "Sân bay Long Thành ~20 phút — NOXH {code} Happy Home {price}",
  "Vành đai 3 & cao tốc HCM–Long Thành — {code} NOXH {area}m² · {price}",
  "Trục 25B–25C kết nối sân bay — căn {code} NOXH Nhơn Trạch {price}",
  "Cao tốc ~10 phút, NOXH từ {price} — Happy Home {code} Nhơn Trạch",
];

/** Câu mở đầu body nhấn hạ tầng — placeholder {connectivityLead}. */
export const CONNECTIVITY_OPENINGS: readonly string[] = [
  "Suất {code} tại DTA City hưởng lợi {connectivityLead} — lợi thế di chuyển cho công nhân KCN và gia đình trẻ tại Nhơn Trạch.",
  "Nếu bạn ưu tiên kết nối giao thông, {code} nằm gần {connectivityLead}; giá NOXH minh bạch theo bảng CĐT.",
  "Happy Home {code}: {connectivityLead} — kết hợp {highlight} và giá CĐT {price}.",
  "Căn NOXH {code} trong vùng hạ tầng đang bứt phá: {connectivityLead}.",
  "Block A10 mở suất {code} — {connectivityLead}, phù hợp người làm việc vùng Đồng Nai cần đi lại thuận tiện.",
];

export function pickConnectivityLead(index: number): string {
  const within5 = dtaConnectivityWithinKm(5);
  const picks = [
    within5.find((n) => n.id === "cao-toc-bien-hoa-vung-tau"),
    within5.find((n) => n.id === "cao-toc-hcm-long-thanh"),
    within5.find((n) => n.id === "quoc-lo-51"),
    resolveDtaConnectivity().find((n) => n.id === "vanh-dai-3-cau-nhon-trach"),
    resolveDtaConnectivity().find((n) => n.id === "san-bay-long-thanh"),
    within5.find((n) => n.id === "duong-25c"),
    within5.find((n) => n.id === "duong-25b"),
    resolveDtaConnectivity().find((n) => n.id === "metro-thu-thiem-long-thanh"),
  ].filter(Boolean) as ResolvedConnectivity[];
  const node = picks[index % picks.length] ?? within5[0]!;
  if (node.travelMinutesCdT != null) {
    return `${node.name} (khoảng ${node.travelMinutesCdT} phút theo CĐT)`;
  }
  if (node.maxKmForDistanceClaim != null && node.distanceKm <= node.maxKmForDistanceClaim) {
    return `${node.name} (${formatKm(node.distanceKm)} tham khảo)`;
  }
  return node.name;
}

export function buildDtaConnectivityMarkdown(): string {
  const lines = resolveDtaConnectivity().map((n) => `- ${n.seoLine}`);
  const within5 = dtaConnectivityWithinKm(5);
  const within5Names = within5
    .filter((n) => n.status === "operational")
    .map((n) => n.name)
    .slice(0, 4)
    .join(", ");

  return [
    "## Kết nối giao thông (tham khảo)",
    `Vị trí dự án: ${DTA_HAPPY_HOME_GEO.address}.`,
    within5Names
      ? `Trong bán kính ~5 km (đường thẳng, tham khảo bản đồ): ${within5Names}.`
      : "",
    ...lines,
    "",
    "*Thời gian di chuyển thực tế phụ thuộc tuyến đường và khung giờ — số liệu phút theo thông tin CĐT công bố trên trang dự án.*",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Khung biên tập hạ tầng — dùng cho admin / dự án khác. */
export const LISTING_CONNECTIVITY_FRAMEWORK = {
  formula:
    "[Lợi thế hạ tầng trending] — [NOXH + mã căn + giá/diện tích + địa danh]",
  keywords: [
    "Vành đai 3",
    "cao tốc Biên Hòa – Vũng Tàu",
    "cao tốc HCM – Long Thành – Dầu Giày",
    "Quốc lộ 51",
    "25B",
    "25C",
    "sân bay Long Thành",
    "cầu Nhơn Trạch",
  ],
  rules: [
    "Ưu tiên thời gian phút từ CĐT; bổ sung km chỉ khi great-circle ≤ 5 km và ghi «tham khảo bản đồ»",
    "Tuyến quy hoạch (metro, Vành đai mở rộng) gắn nhãn (quy hoạch)",
    "Không cam kết «chắc chắn tăng giá» hay «X phút mọi khung giờ»",
  ],
} as const;
