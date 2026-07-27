import type { PrismaClient } from "@prisma/client";
import {
  buildIdTownOverviewData,
  ID_TOWN_DEVELOPER_TAX_CODE,
  ID_TOWN_NAME,
  ID_TOWN_PRICE_PER_SQM,
  ID_TOWN_PROJECT_DESCRIPTION,
  ID_TOWN_SLUG,
} from "@/lib/content/id-town-landing";
import { ID_TOWN_IMAGES } from "@/lib/content/id-town-images";

const ID_TOWN_SEO_TITLE =
  "ID Town Long Thành — NOXH gần sân bay từ ~22 triệu/m²";
const ID_TOWN_SEO_DESC =
  "Nhà ở xã hội ID Town Long Thành: 628 căn, 4 block 7 tầng trong iD Junction, giá từ ~22 triệu/m². CĐT Long Thành Riverside. Bàn giao Q4/2026.";

const ID_TOWN_DEVELOPER_NAME = "Công ty Cổ phần Long Thành Riverside";

/**
 * Upsert developer + project ID Town vào Postgres.
 * Nguồn sự thật landing: `lib/content/id-town-*` — dùng chung seed chính và reseed.
 */
export async function seedIdTown(prisma: PrismaClient) {
  const developer = await prisma.developer.upsert({
    where: { taxCode: ID_TOWN_DEVELOPER_TAX_CODE },
    update: {
      name: ID_TOWN_DEVELOPER_NAME,
      verified: true,
      logoUrl: ID_TOWN_IMAGES.developerLogo,
    },
    create: {
      name: ID_TOWN_DEVELOPER_NAME,
      taxCode: ID_TOWN_DEVELOPER_TAX_CODE,
      verified: true,
      logoUrl: ID_TOWN_IMAGES.developerLogo,
    },
  });

  const overviewData = buildIdTownOverviewData();

  const project = await prisma.project.upsert({
    where: { slug: ID_TOWN_SLUG },
    update: {
      developerId: developer.id,
      name: ID_TOWN_NAME,
      status: "DANG_BAN",
      projectType: "NHA_O_XA_HOI",
      overviewData: overviewData as object,
      description: ID_TOWN_PROJECT_DESCRIPTION,
      seoTitle: ID_TOWN_SEO_TITLE,
      seoDesc: ID_TOWN_SEO_DESC,
      province: "Đồng Nai",
      district: "Long Thành",
      ward: "Long Thành",
      address: "Đường Phạm Văn Đồng, khu đô thị iD Junction",
      lat: 10.789,
      lng: 106.951,
      totalArea: 2.5,
      density: 35,
      handoverDate: new Date("2026-12-31"),
    },
    create: {
      developerId: developer.id,
      slug: ID_TOWN_SLUG,
      name: ID_TOWN_NAME,
      projectType: "NHA_O_XA_HOI",
      status: "DANG_BAN",
      province: "Đồng Nai",
      district: "Long Thành",
      ward: "Long Thành",
      address: "Đường Phạm Văn Đồng, khu đô thị iD Junction",
      lat: 10.789,
      lng: 106.951,
      totalArea: 2.5,
      density: 35,
      handoverDate: new Date("2026-12-31"),
      overviewData: overviewData as object,
      description: ID_TOWN_PROJECT_DESCRIPTION,
      seoTitle: ID_TOWN_SEO_TITLE,
      seoDesc: ID_TOWN_SEO_DESC,
      unitTypes: {
        create: [
          {
            name: "Căn 2PN – 1WC (~59 m²)",
            areaMin: 48,
            areaMax: 62,
            bedrooms: 2,
            priceFrom: Math.round(59 * ID_TOWN_PRICE_PER_SQM),
          },
          {
            name: "Căn 2PN – 2WC (~70 m²)",
            areaMin: 65,
            areaMax: 77,
            bedrooms: 2,
            priceFrom: Math.round(70 * ID_TOWN_PRICE_PER_SQM),
          },
          {
            name: "Căn 3PN (~85 m²)",
            areaMin: 80,
            areaMax: 90,
            bedrooms: 3,
            priceFrom: Math.round(85 * ID_TOWN_PRICE_PER_SQM),
          },
        ],
      },
      legalDocs: {
        create: [
          {
            docType: "chap_thuan_noxh",
            status: "da_co",
            issuedDate: new Date("2025-05-19"),
          },
          {
            docType: "giay_phep_xay_dung",
            status: "da_co",
            issuedDate: new Date("2025-05-19"),
          },
        ],
      },
    },
  });

  return { developer, project };
}
