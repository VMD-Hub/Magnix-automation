import type { PrismaClient } from "@prisma/client";
import { buildOverviewData } from "@/lib/content/project-landing";
import { THU_THIEM_GREEN_HOUSE_IMAGES } from "@/lib/content/thu-thiem-green-house-images";
import { buildThuThiemGreenHouseSeedLanding } from "@/lib/preview/thu-thiem-green-house-mock";

export const THU_THIEM_GREEN_HOUSE_SLUG = "thu-thiem-green-house-thu-duc";

/** Upsert Thủ Thiêm Green House — idempotent, dùng chung seed & VPS priority. */
export async function seedThuThiemGreenHouse(prisma: PrismaClient) {
  const thuThiemDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0320000001" },
    update: {
      name: "Công ty Cổ phần Thủ Thiêm (Thủ Thiêm Group)",
      verified: true,
      logoUrl: THU_THIEM_GREEN_HOUSE_IMAGES.developerLogo,
    },
    create: {
      name: "Công ty Cổ phần Thủ Thiêm (Thủ Thiêm Group)",
      taxCode: "0320000001",
      verified: true,
      logoUrl: THU_THIEM_GREEN_HOUSE_IMAGES.developerLogo,
    },
  });

  const ttghLanding = buildThuThiemGreenHouseSeedLanding();
  const ttghOverview = buildOverviewData(null, {
    totalUnits: 1040,
    blocks: 3,
    landing: ttghLanding,
  });

  return prisma.project.upsert({
    where: { slug: THU_THIEM_GREEN_HOUSE_SLUG },
    update: {
      status: "DANG_BAN",
      projectType: "NHA_O_XA_HOI",
      overviewData: ttghOverview as object,
      description:
        "Thủ Thiêm Green House — NOXH Võ Chí Công, Thạnh Mỹ Lợi. 1.040 căn, giá 1,5 – 2,5 tỷ/căn.",
      seoTitle: "Thủ Thiêm Green House — NOXH Võ Chí Công từ 1,5 tỷ",
      seoDesc:
        "NOXH Thủ Thiêm Green House: 1.040 căn, 1–2PN 25–68m², giá 1,5–2,5 tỷ/căn.",
      lat: 10.757,
      lng: 106.751,
    },
    create: {
      developerId: thuThiemDeveloper.id,
      slug: THU_THIEM_GREEN_HOUSE_SLUG,
      name: "Thủ Thiêm Green House",
      projectType: "NHA_O_XA_HOI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "Thủ Đức",
      ward: "Thạnh Mỹ Lợi",
      address: "Mặt tiền Võ Chí Công, chân cầu Phú Mỹ",
      lat: 10.757,
      lng: 106.751,
      totalArea: 2.0875,
      density: 60,
      handoverDate: new Date("2024-12-31"),
      overviewData: ttghOverview as object,
      description:
        "Thủ Thiêm Green House là dự án nhà ở xã hội do Công ty Cổ phần Thủ Thiêm phát triển tại mặt tiền Võ Chí Công, phường Thạnh Mỹ Lợi, TP. Thủ Đức. Quy mô 20.875 m², 3 block 8 tầng, 1.040 căn; diện tích 25–68 m²; giá 1,5 – 2,5 tỷ/căn.",
      seoTitle: "Thủ Thiêm Green House — NOXH Võ Chí Công từ 1,5 tỷ",
      seoDesc:
        "NOXH Thủ Thiêm Green House Thủ Đức: 1.040 căn, 1–2PN 25–68m², giá 1,5–2,5 tỷ/căn. Võ Chí Công chân cầu Phú Mỹ.",
      unitTypes: {
        create: [
          {
            name: "Căn 1PN",
            areaMin: 25,
            areaMax: 36.42,
            bedrooms: 1,
            priceFrom: 1_500_000_000,
          },
          {
            name: "Căn 1PN+",
            areaMin: 50.67,
            areaMax: 60.3,
            bedrooms: 1,
            priceFrom: 2_000_000_000,
          },
          {
            name: "Căn 2PN",
            areaMin: 51.55,
            areaMax: 68.21,
            bedrooms: 2,
            priceFrom: 2_500_000_000,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "chap_thuan_noxh", status: "da_co", issuedDate: new Date("2021-01-01") },
          { docType: "giay_phep_xay_dung", status: "da_co", issuedDate: new Date("2021-10-01") },
        ],
      },
    },
  });
}
