import type { ProjectDetail } from "@/lib/data/project";
import {
  DTA_HAPPY_HOME_IMAGES,
} from "@/lib/content/dta-happy-home-images";
import {
  buildDtaHappyHomeOverviewData,
  buildDtaHappyHomeLanding,
  DTA_DEVELOPER_TAX_CODE,
  DTA_HAPPY_HOME_NAME,
  DTA_HAPPY_HOME_SLUG,
  DTA_PROJECT_DESCRIPTION,
} from "@/lib/content/dta-happy-home-landing";
import { DTA_HAPPY_HOME_HANDOVER_LABEL } from "@/lib/content/dta-happy-home-inventory-a10";

export { buildDtaPreviewListings } from "@/lib/preview/dta-happy-home-listings";

const NOW = new Date("2026-03-29T00:00:00.000Z");

/** Mock DTA Happy Home — cùng nội dung seed, dùng cho `/preview` không cần Postgres. */
export function buildDtaHappyHomeMock(): ProjectDetail {
  const landing = buildDtaHappyHomeLanding();
  const overviewData = buildDtaHappyHomeOverviewData();

  return {
    id: "preview-dta-happy-home",
    developerId: "preview-dta-dev",
    slug: DTA_HAPPY_HOME_SLUG,
    name: DTA_HAPPY_HOME_NAME,
    projectType: "NHA_O_XA_HOI",
    status: "DANG_BAN",
    province: "Đồng Nai",
    district: "Nhơn Trạch",
    ward: "Phước An",
    address: "Đường Nguyễn Văn Cừ, Khu đô thị DTA City",
    lat: 10.697,
    lng: 106.934,
    totalArea: 5.143,
    density: 38,
    handoverDate: new Date("2027-12-31"),
    overviewData,
    description: DTA_PROJECT_DESCRIPTION,
    seoTitle: "DTA Happy Home Nhơn Trạch — Nhà ở xã hội từ 448 triệu",
    seoDesc:
      `Nhà ở xã hội Happy Home DTA Nhơn Trạch: 2.192 căn, mặt bằng & nhà mẫu, giá 448–700 triệu/căn. Bàn giao ${DTA_HAPPY_HOME_HANDOVER_LABEL}. Hỗ trợ vay 70%.`,
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-dta-dev",
      name: "Công ty Cổ phần Đệ Tam (DTA)",
      taxCode: DTA_DEVELOPER_TAX_CODE,
      verified: true,
      logoUrl: DTA_HAPPY_HOME_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-ut-1",
        projectId: "preview-dta-happy-home",
        name: "Căn 1 phòng ngủ (32–35 m²)",
        areaMin: 32,
        areaMax: 35,
        bedrooms: 1,
        priceFrom: 448_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ut-2",
        projectId: "preview-dta-happy-home",
        name: "Căn 2 phòng ngủ compact (32–35 m²)",
        areaMin: 32,
        areaMax: 35,
        bedrooms: 2,
        priceFrom: 520_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ut-3",
        projectId: "preview-dta-happy-home",
        name: "Căn 2 phòng ngủ (48–52 m²)",
        areaMin: 48,
        areaMax: 52,
        bedrooms: 2,
        priceFrom: 700_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-ld-1",
        projectId: "preview-dta-happy-home",
        docType: "giay_chung_nhan_dau_tu",
        status: "da_co",
        issuedDate: new Date("2007-08-06"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ld-2",
        projectId: "preview-dta-happy-home",
        docType: "quy_hoach_1_500",
        status: "da_co",
        issuedDate: new Date("2006-12-19"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ld-3",
        projectId: "preview-dta-happy-home",
        docType: "chap_thuan_noxh",
        status: "da_co",
        issuedDate: new Date("2014-10-14"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ld-4",
        projectId: "preview-dta-happy-home",
        docType: "dieu_kien_kinh_doanh_bdshtl",
        status: "da_co",
        issuedDate: new Date("2025-12-31"),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}
