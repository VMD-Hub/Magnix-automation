/**
 * Registry tổ chức KD dịch vụ BĐS — seed nội bộ (ops / Chủ quản).
 * Nguồn: docs/RE_SERVICE_ORG_REGISTRY_OPS.md · không publish raw cho reader.
 */

export type ReServiceUnitType = "SAN" | "MOI_GIOI" | "TU_VAN_QL" | "UNKNOWN";

export type ReServiceSourceKind =
  | "SXD_PAGE"
  | "MOC_FEED"
  | "LEGACY_PDF"
  | "DKK_LOOKUP"
  | "PAID_DKK_EXPORT";

export type ReServiceConfidence = "HIGH" | "MED" | "LOW";

export type ReServiceOpsStatus =
  | "ACTIVE_CANDIDATE"
  | "NEEDS_VERIFY"
  | "ARCHIVE"
  | "STALE";

export type ReServiceAdminUnit =
  | "tp-hcm"
  | "dong-nai"
  | "tay-ninh"
  | "dong-thap"
  | "an-giang"
  | "vinh-long"
  | "can-tho"
  | "ca-mau";

export type ReServiceOrgRecord = {
  id: string;
  unitType: ReServiceUnitType;
  name: string;
  adminUnitNew: ReServiceAdminUnit;
  adminUnitLegacyLabel: string | null;
  mst: string | null;
  permitOrNoticeRef: string | null;
  sourceKind: ReServiceSourceKind;
  sourceUrl: string;
  observedAt: string;
  confidence: ReServiceConfidence;
  opsStatus: ReServiceOpsStatus;
  /** Mặc định false — chỉ true sau L2/L3. */
  readerEligible: boolean;
  notes: string | null;
};

export type ReServiceAdminUnitMeta = {
  slug: ReServiceAdminUnit;
  label: string;
  legacyParts: string;
  sxdBaseUrl: string;
  hostStatus: "VERIFIED" | "DOWN" | "VERIFY";
  orgListOnSxd: "YES" | "THIN" | "NO" | "EMPTY_CATEGORY";
  orgListNote: string;
};

export const RE_SERVICE_ADMIN_UNITS: ReServiceAdminUnitMeta[] = [
  {
    slug: "tp-hcm",
    label: "TP. Hồ Chí Minh",
    legacyParts: "HCM + Bình Dương + BR-VT",
    sxdBaseUrl: "https://soxaydung.hochiminhcity.gov.vn/",
    hostStatus: "VERIFIED",
    orgListOnSxd: "EMPTY_CATEGORY",
    orgListNote: "Chuyên mục Tổ chức KD dịch vụ BĐS — chưa dump list (TB sát hạch).",
  },
  {
    slug: "dong-nai",
    label: "Đồng Nai",
    legacyParts: "Đồng Nai + Bình Phước",
    sxdBaseUrl: "https://sxd.dongnai.gov.vn/",
    hostStatus: "VERIFIED",
    orgListOnSxd: "THIN",
    orgListNote: "Có mục sàn + DN môi giới (mỏng, 6/2026).",
  },
  {
    slug: "tay-ninh",
    label: "Tây Ninh",
    legacyParts: "Tây Ninh + Long An",
    sxdBaseUrl: "https://sxd.tayninh.gov.vn/",
    hostStatus: "VERIFIED",
    orgListOnSxd: "NO",
    orgListNote: "Chủ yếu sát hạch CCHN; GP sàn qua feed MOC.",
  },
  {
    slug: "dong-thap",
    label: "Đồng Tháp",
    legacyParts: "Đồng Tháp + Tiền Giang",
    sxdBaseUrl: "https://sxd.dongthap.gov.vn/",
    hostStatus: "VERIFIED",
    orgListOnSxd: "NO",
    orgListNote: "Chưa thấy list org.",
  },
  {
    slug: "an-giang",
    label: "An Giang",
    legacyParts: "An Giang + Kiên Giang",
    sxdBaseUrl: "https://sxd.angiang.gov.vn/",
    hostStatus: "VERIFY",
    orgListOnSxd: "NO",
    orgListNote: "Re-verify host theo allowlist T2.",
  },
  {
    slug: "vinh-long",
    label: "Vĩnh Long",
    legacyParts: "Vĩnh Long + Bến Tre + Trà Vinh",
    sxdBaseUrl: "https://sxd.vinhlong.gov.vn/",
    hostStatus: "VERIFIED",
    orgListOnSxd: "NO",
    orgListNote: "Có GP trên feed MOC.",
  },
  {
    slug: "can-tho",
    label: "TP. Cần Thơ",
    legacyParts: "Cần Thơ + Sóc Trăng + Hậu Giang",
    sxdBaseUrl: "https://soxaydung.cantho.gov.vn/",
    hostStatus: "VERIFIED",
    orgListOnSxd: "NO",
    orgListNote: "Chưa thấy list org.",
  },
  {
    slug: "ca-mau",
    label: "Cà Mau",
    legacyParts: "Cà Mau + Bạc Liêu",
    sxdBaseUrl: "https://soxaydung.camau.gov.vn/",
    hostStatus: "VERIFIED",
    orgListOnSxd: "NO",
    orgListNote: "Chưa thấy list org.",
  },
];

/** Seed quan sát 2026-07-21 — cập nhật tay khi có GP/Sở mới. */
export const RE_SERVICE_ORG_SEED: ReServiceOrgRecord[] = [
  {
    id: "dn-san-phuc-hung-bp",
    unitType: "SAN",
    name: "Sàn giao dịch BĐS Phúc Hưng Bình Phước",
    adminUnitNew: "dong-nai",
    adminUnitLegacyLabel: "Bình Phước",
    mst: null,
    permitOrNoticeRef: "Đăng Sở 11/06/2026",
    sourceKind: "SXD_PAGE",
    sourceUrl:
      "https://sxd.dongnai.gov.vn/vi/news/thong-tin-san-giao-dich-bat-dong-san/",
    observedAt: "2026-07-21",
    confidence: "MED",
    opsStatus: "ACTIVE_CANDIDATE",
    readerEligible: false,
    notes: "Nhãn còn địa giới cũ Bình Phước.",
  },
  {
    id: "dn-san-dai-dong-cat",
    unitType: "SAN",
    name: "Sàn giao dịch BĐS Đại Đồng Cát",
    adminUnitNew: "dong-nai",
    adminUnitLegacyLabel: null,
    mst: null,
    permitOrNoticeRef: "28/GP-SoXD 06/12/2025 + đăng Sở 11/06/2026",
    sourceKind: "SXD_PAGE",
    sourceUrl:
      "https://sxd.dongnai.gov.vn/vi/news/thong-tin-san-giao-dich-bat-dong-san/",
    observedAt: "2026-07-21",
    confidence: "HIGH",
    opsStatus: "ACTIVE_CANDIDATE",
    readerEligible: false,
    notes: "Khớp feed MOC Chuyên mục 1309.",
  },
  {
    id: "dn-mg-dai-dien-hung",
    unitType: "MOI_GIOI",
    name: "CTCP tư vấn và đầu tư BĐS Đại Điền Hưng",
    adminUnitNew: "dong-nai",
    adminUnitLegacyLabel: null,
    mst: null,
    permitOrNoticeRef: "Đăng Sở 08/06/2026",
    sourceKind: "SXD_PAGE",
    sourceUrl:
      "https://sxd.dongnai.gov.vn/vi/news/doanh-nghiep-kinh-doanh-dich-vu-moi-gioi-bds/",
    observedAt: "2026-07-21",
    confidence: "MED",
    opsStatus: "NEEDS_VERIFY",
    readerEligible: false,
    notes: "Tra MST trên dangkykinhdoanh.gov.vn.",
  },
  {
    id: "tn-san-alg",
    unitType: "SAN",
    name: "Sàn giao dịch BĐS địa ốc ALG",
    adminUnitNew: "tay-ninh",
    adminUnitLegacyLabel: null,
    mst: null,
    permitOrNoticeRef: "1637/SXD-ĐKHĐ 09/12/2025",
    sourceKind: "MOC_FEED",
    sourceUrl:
      "https://moc.gov.vn/vn/Pages/chuyenmuctin.aspx?ChuyenmucID=1309",
    observedAt: "2026-07-21",
    confidence: "MED",
    opsStatus: "ACTIVE_CANDIDATE",
    readerEligible: false,
    notes: null,
  },
  {
    id: "vl-san-dinh-thai-son",
    unitType: "SAN",
    name: "Sàn giao dịch BĐS Đỉnh Thái Sơn Real Estate",
    adminUnitNew: "vinh-long",
    adminUnitLegacyLabel: null,
    mst: null,
    permitOrNoticeRef: "396/BC-SXD 05/12/2025",
    sourceKind: "MOC_FEED",
    sourceUrl:
      "https://moc.gov.vn/vn/Pages/chuyenmuctin.aspx?ChuyenmucID=1309",
    observedAt: "2026-07-21",
    confidence: "MED",
    opsStatus: "ACTIVE_CANDIDATE",
    readerEligible: false,
    notes: null,
  },
  {
    id: "hcm-san-bell-land",
    unitType: "SAN",
    name: "Sàn giao dịch BĐS BELL LAND",
    adminUnitNew: "tp-hcm",
    adminUnitLegacyLabel: null,
    mst: null,
    permitOrNoticeRef: "GP Sở HCM (tin MOC ~12/01/2026)",
    sourceKind: "MOC_FEED",
    sourceUrl:
      "https://moc.gov.vn/vn/Pages/chuyenmuctin.aspx?ChuyenmucID=1309",
    observedAt: "2026-07-21",
    confidence: "MED",
    opsStatus: "NEEDS_VERIFY",
    readerEligible: false,
    notes: "Bổ sung URL tin MOC cụ thể khi re-verify.",
  },
  {
    id: "hcm-san-phu-an",
    unitType: "SAN",
    name: "Sàn giao dịch BĐS Phú An",
    adminUnitNew: "tp-hcm",
    adminUnitLegacyLabel: null,
    mst: null,
    permitOrNoticeRef: "16211/SXD-ĐKHĐ 13/05/2026",
    sourceKind: "MOC_FEED",
    sourceUrl:
      "https://moc.gov.vn/vn/Pages/chuyenmuctin.aspx?ChuyenmucID=1309",
    observedAt: "2026-07-21",
    confidence: "MED",
    opsStatus: "ACTIVE_CANDIDATE",
    readerEligible: false,
    notes: null,
  },
  {
    id: "hcm-san-vpi",
    unitType: "SAN",
    name: "Sàn giao dịch BĐS VPI",
    adminUnitNew: "tp-hcm",
    adminUnitLegacyLabel: null,
    mst: null,
    permitOrNoticeRef: "10021/SXD-ĐKHĐ 30/03/2026",
    sourceKind: "MOC_FEED",
    sourceUrl:
      "https://moc.gov.vn/vn/Pages/chuyenmuctin.aspx?ChuyenmucID=1309",
    observedAt: "2026-07-21",
    confidence: "MED",
    opsStatus: "ACTIVE_CANDIDATE",
    readerEligible: false,
    notes: null,
  },
  {
    id: "hcm-legacy-san-corpus-v1",
    unitType: "SAN",
    name: "Corpus ~473 sàn đã đăng ký địa bàn TP.HCM (legacy PDF)",
    adminUnitNew: "tp-hcm",
    adminUnitLegacyLabel: "TP.HCM trước sáp nhập",
    mst: null,
    permitOrNoticeRef: "PDF trung gian mốc ~2022–2024",
    sourceKind: "LEGACY_PDF",
    sourceUrl:
      "https://fs.vieapps.net/downloads/125566B19751411188002F3B2FA097BF/1/Tp_HCM_2832024.pdf",
    observedAt: "2026-07-21",
    confidence: "LOW",
    opsStatus: "ARCHIVE",
    readerEligible: false,
    notes:
      "Không publish nguyên corpus. Dùng gợi ý tên → re-verify L1+L2 từng đơn vị.",
  },
];

export const UNIT_TYPE_LABEL: Record<ReServiceUnitType, string> = {
  SAN: "Sàn giao dịch",
  MOI_GIOI: "DN môi giới",
  TU_VAN_QL: "Tư vấn / quản lý",
  UNKNOWN: "Chưa phân loại",
};

export const OPS_STATUS_LABEL: Record<ReServiceOpsStatus, string> = {
  ACTIVE_CANDIDATE: "Ứng viên hoạt động",
  NEEDS_VERIFY: "Cần xác minh",
  ARCHIVE: "Lưu trữ",
  STALE: "Hết hạn xác minh",
};

export const SOURCE_KIND_LABEL: Record<ReServiceSourceKind, string> = {
  SXD_PAGE: "Trang Sở XD",
  MOC_FEED: "Feed MOC",
  LEGACY_PDF: "PDF legacy",
  DKK_LOOKUP: "Tra ĐKKD",
  PAID_DKK_EXPORT: "Export ĐKKD (phí)",
};

export type ReServiceOrgListQuery = {
  adminUnit?: ReServiceAdminUnit | "ALL";
  unitType?: ReServiceUnitType | "ALL";
  opsStatus?: ReServiceOpsStatus | "ALL";
  q?: string;
};

export function listReServiceOrgs(query: ReServiceOrgListQuery = {}) {
  const adminUnit = query.adminUnit ?? "ALL";
  const unitType = query.unitType ?? "ALL";
  const opsStatus = query.opsStatus ?? "ALL";
  const q = (query.q ?? "").trim().toLowerCase();

  const items = RE_SERVICE_ORG_SEED.filter((row) => {
    if (adminUnit !== "ALL" && row.adminUnitNew !== adminUnit) return false;
    if (unitType !== "ALL" && row.unitType !== unitType) return false;
    if (opsStatus !== "ALL" && row.opsStatus !== opsStatus) return false;
    if (q) {
      const hay = [
        row.name,
        row.id,
        row.mst ?? "",
        row.permitOrNoticeRef ?? "",
        row.adminUnitLegacyLabel ?? "",
        row.notes ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const counts = {
    total: RE_SERVICE_ORG_SEED.length,
    activeCandidate: RE_SERVICE_ORG_SEED.filter(
      (r) => r.opsStatus === "ACTIVE_CANDIDATE",
    ).length,
    needsVerify: RE_SERVICE_ORG_SEED.filter(
      (r) => r.opsStatus === "NEEDS_VERIFY",
    ).length,
    archive: RE_SERVICE_ORG_SEED.filter((r) => r.opsStatus === "ARCHIVE")
      .length,
    readerEligible: RE_SERVICE_ORG_SEED.filter((r) => r.readerEligible).length,
    filtered: items.length,
  };

  return { items, counts, units: RE_SERVICE_ADMIN_UNITS };
}

export function getReServiceOrgById(id: string) {
  return RE_SERVICE_ORG_SEED.find((r) => r.id === id) ?? null;
}

export function adminUnitLabel(slug: ReServiceAdminUnit): string {
  return RE_SERVICE_ADMIN_UNITS.find((u) => u.slug === slug)?.label ?? slug;
}
