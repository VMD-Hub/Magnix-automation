import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildIdTownLanding,
  buildIdTownOverviewData,
  ID_TOWN_DEVELOPER_TAX_CODE,
  ID_TOWN_NAME,
  ID_TOWN_PRICE_PER_SQM,
  ID_TOWN_PROJECT_DESCRIPTION,
  ID_TOWN_SLUG,
} from "@/lib/content/id-town-landing";
import { ID_TOWN_IMAGES } from "@/lib/content/id-town-images";

const NOW = new Date("2026-07-27T00:00:00.000Z");

export { ID_TOWN_SLUG, ID_TOWN_NAME };

export function buildIdTownMock(): ProjectDetail {
  const overviewData = buildIdTownOverviewData();

  return {
    id: "preview-id-town",
    developerId: "preview-long-thanh-riverside",
    slug: ID_TOWN_SLUG,
    name: ID_TOWN_NAME,
    projectType: "NHA_O_XA_HOI",
    status: "DANG_BAN",
    province: "TP. Đồng Nai",
    district: "Long Thành",
    ward: "Long Thành",
    address: "Đường Phạm Văn Đồng, khu đô thị iD Junction",
    lat: 10.789,
    lng: 106.951,
    totalArea: 2.5,
    density: 35,
    handoverDate: new Date("2026-12-31"),
    overviewData,
    description: ID_TOWN_PROJECT_DESCRIPTION,
    seoTitle: "ID Town Long Thành — NOXH gần sân bay từ ~22 triệu/m²",
    seoDesc:
      "Nhà ở xã hội ID Town Long Thành: 628 căn, 4 block 7 tầng trong iD Junction, giá từ ~22 triệu/m². CĐT Long Thành Riverside. Bàn giao Q4/2026.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-long-thanh-riverside",
      name: "Công ty Cổ phần Long Thành Riverside",
      taxCode: ID_TOWN_DEVELOPER_TAX_CODE,
      verified: true,
      logoUrl: ID_TOWN_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-id-town-2pn-1wc",
        projectId: "preview-id-town",
        name: "Căn 2PN – 1WC (~59 m²)",
        areaMin: 48,
        areaMax: 62,
        bedrooms: 2,
        priceFrom: Math.round(59 * ID_TOWN_PRICE_PER_SQM),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-id-town-2pn-2wc",
        projectId: "preview-id-town",
        name: "Căn 2PN – 2WC (~70 m²)",
        areaMin: 65,
        areaMax: 77,
        bedrooms: 2,
        priceFrom: Math.round(70 * ID_TOWN_PRICE_PER_SQM),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-id-town-3pn",
        projectId: "preview-id-town",
        name: "Căn 3PN (~85 m²)",
        areaMin: 80,
        areaMax: 90,
        bedrooms: 3,
        priceFrom: Math.round(85 * ID_TOWN_PRICE_PER_SQM),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-id-town-ld-1",
        projectId: "preview-id-town",
        docType: "chap_thuan_noxh",
        status: "da_co",
        issuedDate: new Date("2025-05-19"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-id-town-ld-2",
        projectId: "preview-id-town",
        docType: "giay_phep_xay_dung",
        status: "da_co",
        issuedDate: new Date("2025-05-19"),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildIdTownPreviewListings(): ProjectLandingListingCard[] {
  return [
    {
      id: "preview-id-town-l1",
      code: "MX-IDTOWN01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: Math.round(59 * ID_TOWN_PRICE_PER_SQM),
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: ID_TOWN_IMAGES.gallery[0].url }],
    },
  ];
}

/** Dùng chung cho prisma seed. */
export function buildIdTownSeedLanding() {
  return buildIdTownLanding();
}
