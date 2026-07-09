import type { PrismaClient } from "@prisma/client";
import { buildOverviewData } from "@/lib/content/project-landing";
import { SOLENA_GREEN_TOWN_SLUG } from "@/lib/content/solena-green-town-slug";
import { SOLENA_PUBLISHED_IMAGES } from "@/lib/content/solena-images";
import { buildSolenaSeedLanding } from "@/lib/preview/solena-green-town-mock";

/** Upsert Solena Green Town — idempotent, gọi từ db:seed và db:seed:commercial. */
export async function seedSolenaGreenTown(
  prisma: PrismaClient,
): Promise<typeof SOLENA_GREEN_TOWN_SLUG> {
  const ideDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0315000001" },
    update: {
      name: "Tập đoàn IDE Việt Nam",
      verified: true,
      logoUrl: SOLENA_PUBLISHED_IMAGES.developerLogo,
    },
    create: {
      name: "Tập đoàn IDE Việt Nam",
      taxCode: "0315000001",
      verified: true,
      logoUrl: SOLENA_PUBLISHED_IMAGES.developerLogo,
    },
  });

  const solenaLanding = buildSolenaSeedLanding();
  const solenaOverview = buildOverviewData(null, {
    totalUnits: 252,
    blocks: 1,
    landing: solenaLanding,
  });

  await prisma.project.upsert({
    where: { slug: SOLENA_GREEN_TOWN_SLUG },
    update: {
      status: "DANG_BAN",
      projectType: "THUONG_MAI",
      overviewData: solenaOverview as object,
      description:
        "Solena là phân khu Block B2 thuộc Green Town Bình Tân do Tập đoàn IDE Việt Nam phát triển tại KDC Vĩnh Lộc, Quận Bình Tân. 252 căn, 16 tầng, giá tham chiếu 53,9 triệu/m².",
      seoTitle: "Solena Green Town Bình Tân — Căn hộ từ 53,9 triệu/m²",
      seoDesc:
        "Solena Block B2: 252 căn, 2–3PN 49–92m², giá 53,9 triệu/m². KDC Vĩnh Lộc Bình Tân. Bàn giao Q4/2026.",
      lat: 10.8235,
      lng: 106.5892,
    },
    create: {
      developerId: ideDeveloper.id,
      slug: SOLENA_GREEN_TOWN_SLUG,
      name: "Solena Green Town Bình Tân",
      projectType: "THUONG_MAI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "Bình Tân",
      ward: "Bình Hưng Hòa B",
      address: "Lô 5, Khu dân cư đô thị Vĩnh Lộc (110ha)",
      lat: 10.8235,
      lng: 106.5892,
      totalArea: 3.3,
      density: 27.5,
      handoverDate: new Date("2026-12-31"),
      overviewData: solenaOverview as object,
      description:
        "Solena là phân khu Block B2 thuộc dự án Green Town Bình Tân do Tập đoàn IDE Việt Nam phát triển tại KDC Vĩnh Lộc, Quận Bình Tân. Quy mô 252 căn hộ cao 16 tầng trên 3,3ha, mật độ xây dựng 27,5%. Sản phẩm 2–3 phòng ngủ (49–92 m²), đơn giá tham chiếu 53,9 triệu/m², bàn giao nội thất cơ bản cao cấp. Bàn giao dự kiến Q4/2026.",
      seoTitle: "Solena Green Town Bình Tân — Căn hộ từ 53,9 triệu/m²",
      seoDesc:
        "Solena Block B2 Green Town Bình Tân: 252 căn, 16 tầng, 2–3PN 49–92m², giá 53,9 triệu/m². KDC Vĩnh Lộc, IDE Việt Nam. Bàn giao Q4/2026.",
      unitTypes: {
        create: [
          {
            name: "2PN — 1 WC (49m²)",
            areaMin: 49,
            areaMax: 52.7,
            bedrooms: 2,
            priceFrom: 2_640_000_000,
          },
          {
            name: "2PN — 2 WC (63–71,89m²)",
            areaMin: 63,
            areaMax: 71.89,
            bedrooms: 2,
            priceFrom: 3_390_000_000,
          },
          {
            name: "3PN — 2 WC (91,74m²)",
            areaMin: 91.74,
            areaMax: 92,
            bedrooms: 3,
            priceFrom: 4_940_000_000,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "quy_hoach_1_500", status: "da_co" },
          { docType: "giay_phep_xay_dung", status: "da_co" },
        ],
      },
    },
  });

  return SOLENA_GREEN_TOWN_SLUG;
}
