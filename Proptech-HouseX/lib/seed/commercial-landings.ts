import type { PrismaClient } from "@prisma/client";
import { buildOverviewData } from "@/lib/content/project-landing";
import { MONREI_SAIGON_IMAGES } from "@/lib/content/monrei-saigon-images";
import { NOBLE_CRYSTAL_RIVERSIDE_IMAGES } from "@/lib/content/noble-crystal-riverside-images";
import { GLADIA_HEIGHTS_IMAGES } from "@/lib/content/gladia-heights-images";
import { VICTORIA_VILLAGE_IMAGES } from "@/lib/content/victoria-village-images";
import {
  buildMonreiSaigonSeedLanding,
  MONREI_SAIGON_SLUG,
} from "@/lib/preview/monrei-saigon-mock";
import {
  buildNobleCrystalRiversideSeedLanding,
  NOBLE_CRYSTAL_RIVERSIDE_SLUG,
} from "@/lib/preview/noble-crystal-riverside-mock";
import {
  buildGladiaHeightsSeedLanding,
  GLADIA_HEIGHTS_SLUG,
} from "@/lib/preview/gladia-heights-mock";
import {
  buildVictoriaVillageSeedLanding,
  VICTORIA_VILLAGE_SLUG,
} from "@/lib/preview/victoria-village-mock";
import { seedSolenaGreenTown } from "./solena-green-town";
import { SOLENA_GREEN_TOWN_SLUG } from "@/lib/content/solena-green-town-slug";

export const COMMERCIAL_LANDING_SLUGS = [
  MONREI_SAIGON_SLUG,
  NOBLE_CRYSTAL_RIVERSIDE_SLUG,
  GLADIA_HEIGHTS_SLUG,
  VICTORIA_VILLAGE_SLUG,
] as const;

export type CommercialLandingSlug = (typeof COMMERCIAL_LANDING_SLUGS)[number];

/**
 * Upsert landing thương mại (Monrei, Noble Crystal, Gladia Heights, Victoria Village) — idempotent.
 * Preview `/preview/du-an/*` (noindex); URL công khai: `/du-an/[slug]`.
 */
export async function seedCommercialLandings(
  prisma: PrismaClient,
): Promise<CommercialLandingSlug[]> {
  const monreiDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0301450897" },
    update: {
      name: "Monrei Saigon — Mitsubishi · Tokyu Land · Phát Đạt",
      verified: true,
      logoUrl: MONREI_SAIGON_IMAGES.developerLogo,
    },
    create: {
      name: "Monrei Saigon — Mitsubishi · Tokyu Land · Phát Đạt",
      taxCode: "0301450897",
      verified: true,
      logoUrl: MONREI_SAIGON_IMAGES.developerLogo,
    },
  });

  const monreiLanding = buildMonreiSaigonSeedLanding();
  const monreiOverview = buildOverviewData(null, {
    totalUnits: 2717,
    blocks: 3,
    landing: monreiLanding,
  });

  await prisma.project.upsert({
    where: { slug: MONREI_SAIGON_SLUG },
    update: {
      overviewData: monreiOverview as object,
      description:
        "Monrei Saigon là dự án căn hộ cao cấp concept thành phố nước — thủy liệu đầu tiên tại Việt Nam tại Thuận Giao, TP.HCM. Studio từ ~1,58 tỷ, vốn 15%, bàn giao Q1/2028.",
      seoTitle: "Monrei Saigon Thuận Giao — Căn hộ thủy liệu từ 1,58 tỷ",
      seoDesc:
        "Monrei Saigon: Mitsubishi · Tokyu · Phát Đạt, 4,6 ha, studio từ 1,58 tỷ, vốn 15%, sổ hồng lâu dài, bàn giao Q1/2028.",
      lat: 10.9725,
      lng: 106.6923,
    },
    create: {
      developerId: monreiDeveloper.id,
      slug: MONREI_SAIGON_SLUG,
      name: "Monrei Saigon",
      projectType: "THUONG_MAI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "Thuận Giao",
      ward: "Thuận Giao",
      address: "Nguyễn Thị Minh Khai, Thuận Giao, TP.HCM",
      lat: 10.9725,
      lng: 106.6923,
      totalArea: 4.6,
      density: 30,
      handoverDate: new Date("2028-03-31"),
      overviewData: monreiOverview as object,
      description:
        "Monrei Saigon là dự án căn hộ cao cấp concept thành phố nước — thủy liệu đầu tiên tại Việt Nam, do liên doanh Mitsubishi Corporation, Tokyu Land và Phát Đạt phát triển tại Thuận Giao, TP.HCM. Quy mô 4,6 ha, 3 tòa tháp, 2.717 căn hộ. Giá đợt 1 từ ~1,58 tỷ (studio); vốn 15%, HTLS đến nhận nhà. Bàn giao dự kiến Q1/2028.",
      seoTitle: "Monrei Saigon Thuận Giao — Căn hộ thủy liệu từ 1,58 tỷ",
      seoDesc:
        "Monrei Saigon TP.HCM: Mitsubishi · Tokyu · Phát Đạt, thành phố nước 4,6 ha, studio từ 1,58 tỷ, vốn 15%, sổ hồng lâu dài, bàn giao Q1/2028.",
      unitTypes: {
        create: [
          {
            name: "Studio (34–38 m²)",
            areaMin: 34,
            areaMax: 38,
            bedrooms: 0,
            priceFrom: 1_580_000_000,
          },
          {
            name: "2PN + 1WC (51–55 m²)",
            areaMin: 51,
            areaMax: 55,
            bedrooms: 2,
            priceFrom: 1_980_000_000,
          },
          {
            name: "2PN + 2WC (64–66 m²)",
            areaMin: 64,
            areaMax: 66,
            bedrooms: 2,
            priceFrom: 2_520_000_000,
          },
          {
            name: "3PN (88 m²)",
            areaMin: 88,
            areaMax: 88,
            bedrooms: 3,
            priceFrom: 3_950_000_000,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "giay_phep_ban_hang", status: "da_co" },
          { docType: "giay_phep_xay_dung", status: "da_co" },
          { docType: "bao_lanh_ngan_hang", status: "da_co" },
        ],
      },
    },
  });

  const sunshineDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0315133728" },
    update: {
      name: "Tập đoàn Sunshine (Sunshine Group)",
      verified: true,
      logoUrl: NOBLE_CRYSTAL_RIVERSIDE_IMAGES.developerLogo,
    },
    create: {
      name: "Tập đoàn Sunshine (Sunshine Group)",
      taxCode: "0315133728",
      verified: true,
      logoUrl: NOBLE_CRYSTAL_RIVERSIDE_IMAGES.developerLogo,
    },
  });

  const ncrLanding = buildNobleCrystalRiversideSeedLanding();
  const ncrOverview = buildOverviewData(null, {
    blocks: 12,
    landing: ncrLanding,
  });

  await prisma.project.upsert({
    where: { slug: NOBLE_CRYSTAL_RIVERSIDE_SLUG },
    update: {
      overviewData: ncrOverview as object,
      description:
        "Noble Crystal Riverside: compound ven sông 422 Đào Trí Q7, Sunshine Group, 12 tháp, full nội thất cao cấp, resort 4.0.",
      seoTitle: "Noble Crystal Riverside Q7 — Compound ven sông Sunshine Group",
      seoDesc:
        "Căn hộ Noble Crystal Riverside 422 Đào Trí Q7: 12 tháp, 3 mặt sông, full nội thất, VPBank, sổ hồng lâu dài.",
      lat: 10.7294,
      lng: 106.7412,
    },
    create: {
      developerId: sunshineDeveloper.id,
      slug: NOBLE_CRYSTAL_RIVERSIDE_SLUG,
      name: "Noble Crystal Riverside",
      projectType: "THUONG_MAI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "Quận 7",
      ward: "Phú Thuận",
      address: "422 Đào Trí, Phú Thuận, Quận 7, TP.HCM",
      lat: 10.7294,
      lng: 106.7412,
      totalArea: 11.26,
      density: 23.6,
      handoverDate: null,
      overviewData: ncrOverview as object,
      description:
        "Noble Crystal Riverside là khu căn hộ compound ven sông cao cấp do Sunshine Group phát triển tại 422 Đào Trí, Quận 7, TP.HCM. Quy mô 112.585 m², 12 tháp 38–40 tầng, 3 mặt giáp sông. Sản phẩm 2–4PN, Duplex, Sky Villas; bàn giao full nội thất cao cấp. Hơn 100 tiện ích resort 4.0; bảo lãnh VPBank; sổ hồng lâu dài.",
      seoTitle: "Noble Crystal Riverside Q7 — Compound ven sông Sunshine Group",
      seoDesc:
        "Căn hộ Noble Crystal Riverside 422 Đào Trí Q7: 12 tháp, 3 mặt sông, full nội thất cao cấp, resort 4.0, VPBank, sổ hồng lâu dài.",
      unitTypes: {
        create: [
          {
            name: "2PN (92,6–123 m²)",
            areaMin: 93,
            areaMax: 123,
            bedrooms: 2,
            priceFrom: null,
          },
          {
            name: "3PN (~143 m²)",
            areaMin: 143,
            areaMax: 155,
            bedrooms: 3,
            priceFrom: null,
          },
          {
            name: "4PN đa thế hệ",
            areaMin: 160,
            areaMax: 220,
            bedrooms: 4,
            priceFrom: null,
          },
          {
            name: "Duplex / Sky Villa / Sky Garden",
            areaMin: 200,
            areaMax: 400,
            bedrooms: 4,
            priceFrom: null,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "giay_phep_ban_hang", status: "da_co" },
          { docType: "bao_lanh_ngan_hang", status: "da_co" },
        ],
      },
    },
  });

  const khangDienDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0301450877" },
    update: {
      name: "Khang Điền · Keppel Land",
      verified: true,
      logoUrl: GLADIA_HEIGHTS_IMAGES.developerLogo,
    },
    create: {
      name: "Khang Điền · Keppel Land",
      taxCode: "0301450877",
      verified: true,
      logoUrl: GLADIA_HEIGHTS_IMAGES.developerLogo,
    },
  });

  const ghLanding = buildGladiaHeightsSeedLanding();
  const ghOverview = buildOverviewData(null, {
    totalUnits: 639,
    blocks: 3,
    landing: ghLanding,
  });

  await prisma.project.upsert({
    where: { slug: GLADIA_HEIGHTS_SLUG },
    update: {
      overviewData: ghOverview as object,
      description:
        "Gladia Heights: 3 tháp 639 căn Khang Điền · Keppel Land, Savills, Green Mark Gold, bàn giao 12/2027.",
      seoTitle: "Gladia Heights Khang Điền — Căn hộ Future-First ven sông",
      seoDesc:
        "Gladia Heights TP. Thủ Đức: 3 tháp 639 căn, Savills, vốn 30%, chiết khấu 12%, bàn giao 12/2027.",
      lat: 10.803,
      lng: 106.762,
    },
    create: {
      developerId: khangDienDeveloper.id,
      slug: GLADIA_HEIGHTS_SLUG,
      name: "Gladia Heights",
      projectType: "THUONG_MAI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "Thủ Đức",
      ward: "Bình Trưng Đông",
      address: "Võ Chí Công, Bình Trưng Đông, TP. Thủ Đức",
      lat: 10.803,
      lng: 106.762,
      totalArea: 11.8,
      density: 23.3,
      handoverDate: new Date("2027-12-31"),
      overviewData: ghOverview as object,
      description:
        "Gladia Heights là dự án căn hộ cao cấp do liên minh Khang Điền và Keppel Land phát triển tại Võ Chí Công, Bình Trưng Đông, TP. Thủ Đức. 3 tháp, 639 căn 1–4PN; Savills; BCA Green Mark Gold. Vốn 30% đến nhận nhà. Bàn giao 12/2027.",
      seoTitle: "Gladia Heights Khang Điền — Căn hộ Future-First ven sông",
      seoDesc:
        "Gladia Heights TP. Thủ Đức: 3 tháp 639 căn, Savills, Green Mark Gold, vốn 30%, chiết khấu 12%, bàn giao 12/2027.",
      unitTypes: {
        create: [
          {
            name: "Căn 1 phòng ngủ",
            areaMin: 45,
            areaMax: 55,
            bedrooms: 1,
            priceFrom: null,
          },
          {
            name: "Căn 2 phòng ngủ",
            areaMin: 55,
            areaMax: 75,
            bedrooms: 2,
            priceFrom: null,
          },
          {
            name: "Căn 3 phòng ngủ",
            areaMin: 80,
            areaMax: 110,
            bedrooms: 3,
            priceFrom: null,
          },
          {
            name: "Căn 4PN Duplex",
            areaMin: 120,
            areaMax: 160,
            bedrooms: 4,
            priceFrom: null,
          },
        ],
      },
      legalDocs: {
        create: [{ docType: "quy_hoach_1_500", status: "da_co" }],
      },
    },
  });

  const novalandDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0301430819" },
    update: {
      name: "Tập đoàn Novaland",
      verified: true,
      logoUrl: VICTORIA_VILLAGE_IMAGES.developerLogo,
    },
    create: {
      name: "Tập đoàn Novaland",
      taxCode: "0301430819",
      verified: true,
      logoUrl: VICTORIA_VILLAGE_IMAGES.developerLogo,
    },
  });

  const vvLanding = buildVictoriaVillageSeedLanding();
  const vvOverview = buildOverviewData(null, {
    totalUnits: 1136,
    blocks: 4,
    landing: vvLanding,
  });

  await prisma.project.upsert({
    where: { slug: VICTORIA_VILLAGE_SLUG },
    update: {
      overviewData: vvOverview as object,
      description:
        "Victoria Village Novaland Thạnh Mỹ Lợi: 4 tháp 1.044 căn, công viên 5.000 m², bàn giao 6/2026.",
      seoTitle: "Victoria Village Thạnh Mỹ Lợi — Căn hộ Novaland từ 5,3 tỷ",
      seoDesc:
        "Victoria Village TP. Thủ Đức: 4 tháp, công viên 5.000 m², hồ bơi 750 m², bàn giao 6/2026.",
      lat: 10.776,
      lng: 106.765,
    },
    create: {
      developerId: novalandDeveloper.id,
      slug: VICTORIA_VILLAGE_SLUG,
      name: "Victoria Village",
      projectType: "THUONG_MAI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "Thủ Đức",
      ward: "Thạnh Mỹ Lợi",
      address: "Đồng Văn Cống, Thạnh Mỹ Lợi, TP. Thủ Đức",
      lat: 10.776,
      lng: 106.765,
      totalArea: 4.27,
      density: 35,
      handoverDate: new Date("2026-06-30"),
      overviewData: vvOverview as object,
      description:
        "Victoria Village là khu đô thị cao cấp do Novaland phát triển tại Đồng Văn Cống, Thạnh Mỹ Lợi. 4,27 ha, 4 tháp 1.044 căn, 92 thấp tầng. Giá chuyển nhượng từ ~5,3 tỷ. Bàn giao 5–6/2026.",
      seoTitle: "Victoria Village Thạnh Mỹ Lợi — Căn hộ Novaland từ 5,3 tỷ",
      seoDesc:
        "Victoria Village TP. Thủ Đức: 4 tháp 1.044 căn, công viên 5.000 m², hồ bơi 750 m², bàn giao 6/2026.",
      unitTypes: {
        create: [
          {
            name: "Căn 1+1 (~47,5 m²)",
            areaMin: 48,
            areaMax: 53,
            bedrooms: 1,
            priceFrom: 5_300_000_000,
          },
          {
            name: "Căn 2PN (67–73 m²)",
            areaMin: 64,
            areaMax: 73,
            bedrooms: 2,
            priceFrom: 6_600_000_000,
          },
          {
            name: "Căn 3PN (88–95 m²)",
            areaMin: 79,
            areaMax: 95,
            bedrooms: 3,
            priceFrom: 8_450_000_000,
          },
          {
            name: "Nhà phố liền kề (107–110 m² đất)",
            areaMin: 107,
            areaMax: 110,
            bedrooms: 4,
            priceFrom: 19_500_000_000,
          },
        ],
      },
      legalDocs: {
        create: [{ docType: "giay_phep_xay_dung", status: "da_co" }],
      },
    },
  });

  await seedSolenaGreenTown(prisma);

  return [...COMMERCIAL_LANDING_SLUGS, SOLENA_GREEN_TOWN_SLUG];
}
