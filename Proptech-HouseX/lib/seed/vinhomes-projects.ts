import type { PrismaClient } from "@prisma/client";
import { buildOverviewData } from "@/lib/content/project-landing";
import { VINHOMES_SAIGON_PARK_IMAGES } from "@/lib/content/vinhomes-saigon-park-images";
import { VINHOMES_GREEN_PARADISE_IMAGES } from "@/lib/content/vinhomes-green-paradise-images";
import { VINHOMES_GRAND_PARK_IMAGES } from "@/lib/content/vinhomes-grand-park-images";
import {
  buildVinhomesSaigonParkSeedLanding,
  VINHOMES_SAIGON_PARK_SLUG,
} from "@/lib/preview/vinhomes-saigon-park-mock";
import {
  buildVinhomesGreenParadiseSeedLanding,
  VINHOMES_GREEN_PARADISE_SLUG,
} from "@/lib/preview/vinhomes-green-paradise-mock";
import {
  buildVinhomesGrandParkSeedLanding,
  VINHOMES_GRAND_PARK_SLUG,
} from "@/lib/preview/vinhomes-grand-park-mock";

/** Slug production — dùng smoke test, sitemap, deploy checklist. */
export const VINHOMES_PROJECT_SLUGS = [
  VINHOMES_SAIGON_PARK_SLUG,
  VINHOMES_GREEN_PARADISE_SLUG,
  VINHOMES_GRAND_PARK_SLUG,
] as const;

export type VinhomesProjectSlug = (typeof VINHOMES_PROJECT_SLUGS)[number];

/**
 * Upsert 3 landing Vinhomes vào Postgres — idempotent, an toàn chạy lại trên prod.
 * Preview `/preview/du-an/*` giữ nguyên (noindex); URL công khai: `/du-an/[slug]`.
 */
export async function seedVinhomesProjects(
  prisma: PrismaClient,
): Promise<VinhomesProjectSlug[]> {
  const vinhomesDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0102110108" },
    update: {
      name: "Công ty Cổ phần Vinhomes",
      verified: true,
      logoUrl: VINHOMES_SAIGON_PARK_IMAGES.developerLogo,
    },
    create: {
      name: "Công ty Cổ phần Vinhomes",
      taxCode: "0102110108",
      verified: true,
      logoUrl: VINHOMES_SAIGON_PARK_IMAGES.developerLogo,
    },
  });

  const vspLanding = buildVinhomesSaigonParkSeedLanding();
  const vspOverview = buildOverviewData(null, {
    blocks: 5,
    landing: vspLanding,
  });

  await prisma.project.upsert({
    where: { slug: VINHOMES_SAIGON_PARK_SLUG },
    update: {
      overviewData: vspOverview as object,
      description:
        "Vinhomes Saigon Park là đại đô thị tri thức 1.080 ha tại xã Xuân Thới Sơn, TP.HCM. Nhà phố 1 trệt 3 lầu từ ~5 tỷ, bàn giao dự kiến 12/2027.",
      seoTitle: "Vinhomes Saigon Park Hóc Môn — Nhà phố từ 5 tỷ, HTLS 60 tháng",
      seoDesc:
        "Nhà phố Vinhomes Saigon Park Tây Bắc TP.HCM: 1.080 ha, 5 phân khu, vốn 30%, ưu đãi tới 23%, bàn giao 12/2027.",
      lat: 10.884,
      lng: 106.595,
    },
    create: {
      developerId: vinhomesDeveloper.id,
      slug: VINHOMES_SAIGON_PARK_SLUG,
      name: "Vinhomes Saigon Park",
      projectType: "THUONG_MAI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "Hóc Môn",
      ward: "Xuân Thới Sơn",
      address: "Xã Xuân Thới Sơn, cửa ngõ Tây Bắc TP.HCM",
      lat: 10.884,
      lng: 106.595,
      totalArea: 1080,
      density: 25,
      handoverDate: new Date("2027-12-31"),
      overviewData: vspOverview as object,
      description:
        "Vinhomes Saigon Park là đại đô thị tri thức quy mô 1.080 ha do Công ty Cổ phần Vinhomes (Vingroup) phát triển tại xã Xuân Thới Sơn, TP.HCM. Dự án gồm 5 phân khu chủ đề quốc tế với hệ sinh thái tiện ích all-in-one: Vincom Mega Mall, Vinmec, Vinschool, VinWonders, sân golf 36 hố và quần thể giáo dục 150 ha. Sản phẩm giai đoạn đầu: nhà phố 1 trệt 3 lầu diện tích đất 50–80 m², giá từ ~5 tỷ/căn. Vốn ban đầu 30%, HTLS tới 60 tháng. Bàn giao dự kiến 12/2027.",
      seoTitle: "Vinhomes Saigon Park Hóc Môn — Nhà phố từ 5 tỷ, HTLS 60 tháng",
      seoDesc:
        "Nhà phố Vinhomes Saigon Park Tây Bắc TP.HCM: 1.080 ha đô thị tri thức, 5 phân khu, vốn 30%, ưu đãi tới 23%, bàn giao 12/2027.",
      unitTypes: {
        create: [
          {
            name: "Nhà phố giãn xây (50–80 m² đất)",
            areaMin: 50,
            areaMax: 80,
            bedrooms: 4,
            priceFrom: 5_000_000_000,
          },
          {
            name: "Thô tự hoàn thiện (50–80 m² đất)",
            areaMin: 50,
            areaMax: 80,
            bedrooms: 4,
            priceFrom: 5_000_000_000,
          },
          {
            name: "Hoàn thiện CĐT (50–80 m² đất)",
            areaMin: 50,
            areaMax: 80,
            bedrooms: 4,
            priceFrom: 5_000_000_000,
          },
          {
            name: "Biệt thự song lập / đơn lập",
            areaMin: 112,
            areaMax: 200,
            bedrooms: 5,
            priceFrom: 8_000_000_000,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "giay_chung_nhan_dau_tu", status: "da_co" },
          { docType: "quy_hoach_1_500", status: "da_co" },
        ],
      },
    },
  });

  await prisma.developer.update({
    where: { taxCode: "0102110108" },
    data: { logoUrl: VINHOMES_GREEN_PARADISE_IMAGES.developerLogo },
  });

  const vgpLanding = buildVinhomesGreenParadiseSeedLanding();
  const vgpOverview = buildOverviewData(null, {
    totalUnits: 63790,
    blocks: 5,
    landing: vgpLanding,
  });

  await prisma.project.upsert({
    where: { slug: VINHOMES_GREEN_PARADISE_SLUG },
    update: {
      overviewData: vgpOverview as object,
      description:
        "Vinhomes Green Paradise Cần Giờ: siêu đô thị biển ESG++ 2.870 ha, tháp 108 tầng, biển hồ 433 ha, nhà phố từ 12,9 tỷ.",
      seoTitle: "Vinhomes Green Paradise Cần Giờ — Siêu đô thị biển ESG++ 2.870 ha",
      seoDesc:
        "Vinhomes Green Paradise Cần Giờ: 2.870 ha lấn biển, tháp 108 tầng, biển hồ 433 ha, nhà phố từ 12,9 tỷ.",
      lat: 10.411,
      lng: 106.955,
    },
    create: {
      developerId: vinhomesDeveloper.id,
      slug: VINHOMES_GREEN_PARADISE_SLUG,
      name: "Vinhomes Green Paradise Cần Giờ",
      projectType: "THUONG_MAI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "Cần Giờ",
      ward: "Long Hòa",
      address: "Xã Long Hòa & thị trấn Cần Thạnh, mặt tiền biển Cần Giờ",
      lat: 10.411,
      lng: 106.955,
      totalArea: 2870,
      density: 20,
      handoverDate: null,
      overviewData: vgpOverview as object,
      description:
        "Vinhomes Green Paradise Cần Giờ là siêu đô thị biển ESG++ quy mô 2.870 ha do Tập đoàn Vingroup phát triển tại huyện Cần Giờ, TP.HCM. Dự án ôm trọn 23 km bờ biển, liền kề rừng ngập mặn UNESCO 75.000 ha, vốn đầu tư 11 tỷ USD. Nổi bật với tháp 108 tầng, biển hồ Paradise Lagoon ~433 ha, Nhà hát Sóng Xanh, 2 sân golf, Vinpearl Safari 122 ha. Sản phẩm: nhà phố, biệt thự, shophouse, căn hộ, officetel — giá tham chiếu từ 12,9 tỷ/căn (The Haven Bay).",
      seoTitle: "Vinhomes Green Paradise Cần Giờ — Siêu đô thị biển ESG++ 2.870 ha",
      seoDesc:
        "Vinhomes Green Paradise Cần Giờ: 2.870 ha lấn biển, tháp 108 tầng, biển hồ 433 ha, nhà phố từ 12,9 tỷ. Hạ tầng Cầu Cần Giờ & metro cao tốc.",
      unitTypes: {
        create: [
          {
            name: "Nhà phố phủ xanh (The Haven Bay)",
            areaMin: 90,
            areaMax: 150,
            bedrooms: 4,
            priceFrom: 12_900_000_000,
          },
          {
            name: "Biệt thự nghỉ dưỡng",
            areaMin: 200,
            areaMax: 500,
            bedrooms: 5,
            priceFrom: 25_000_000_000,
          },
          {
            name: "Shophouse thương mại",
            areaMin: 120,
            areaMax: 250,
            bedrooms: 0,
            priceFrom: 15_000_000_000,
          },
          {
            name: "Căn hộ cao tầng (tới 39 tầng)",
            areaMin: 55,
            areaMax: 120,
            bedrooms: 3,
            priceFrom: 8_000_000_000,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "quy_hoach_1_500", status: "da_co" },
          { docType: "giay_chung_nhan_dau_tu", status: "da_co" },
        ],
      },
    },
  });

  const vgpkLanding = buildVinhomesGrandParkSeedLanding();
  const vgpkOverview = buildOverviewData(null, {
    blocks: 71,
    landing: vgpkLanding,
  });

  await prisma.project.upsert({
    where: { slug: VINHOMES_GRAND_PARK_SLUG },
    update: {
      overviewData: vgpkOverview as object,
      description:
        "Vinhomes Grand Park: đại đô thị thông minh 271,8 ha Quận 9, công viên 36 ha, 71 tòa căn hộ, căn từ ~900 triệu.",
      seoTitle: "Vinhomes Grand Park Quận 9 — Căn hộ thông minh từ 900 triệu",
      seoDesc:
        "Vinhomes Grand Park TP. Thủ Đức: 271,8 ha, công viên 36 ha, Vincom Mega Mall. Căn hộ từ ~900 triệu, sổ đỏ lâu dài.",
      lat: 10.835,
      lng: 106.83,
    },
    create: {
      developerId: vinhomesDeveloper.id,
      slug: VINHOMES_GRAND_PARK_SLUG,
      name: "Vinhomes Grand Park",
      projectType: "THUONG_MAI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "TP. Thủ Đức",
      ward: "Long Thạnh Mỹ",
      address: "Đường Nguyễn Xiển, Vinhomes Grand Park",
      lat: 10.835,
      lng: 106.83,
      totalArea: 271.8,
      density: 22.53,
      handoverDate: new Date("2020-06-30"),
      overviewData: vgpkOverview as object,
      description:
        "Vinhomes Grand Park là đại đô thị thông minh đẳng cấp quốc tế đầu tiên tại TP.HCM do Vinhomes phát triển, quy mô 271,8 ha tại Long Thạnh Mỹ, Quận 9. Dự án ôm trọn sông Đồng Nai và sông Tắc với đại công viên ven sông 36 ha (15 công viên chủ đề), 71 tòa căn hộ và ~1.600 căn thấp tầng. Hệ sinh thái smart city 4 trụ cột; tiện ích Vincom Mega Mall 48.000 m², Vinmec, Vinschool. Giá tham chiếu từ ~900 triệu/căn (The Rainbow). Sổ đỏ lâu dài.",
      seoTitle: "Vinhomes Grand Park Quận 9 — Căn hộ thông minh từ 900 triệu",
      seoDesc:
        "Vinhomes Grand Park TP. Thủ Đức: 271,8 ha, công viên 36 ha, 71 tòa căn hộ, Vincom Mega Mall. Căn hộ từ ~900 triệu, sổ đỏ lâu dài.",
      unitTypes: {
        create: [
          {
            name: "The Rainbow (28–76 m²)",
            areaMin: 28,
            areaMax: 76,
            bedrooms: 2,
            priceFrom: 900_000_000,
          },
          {
            name: "The Origami (27–108 m²)",
            areaMin: 27,
            areaMax: 108,
            bedrooms: 3,
            priceFrom: 1_500_000_000,
          },
          {
            name: "The Beverly (28–120 m²)",
            areaMin: 28,
            areaMax: 120,
            bedrooms: 3,
            priceFrom: 2_500_000_000,
          },
          {
            name: "Masteri Centre Point (47–91 m²)",
            areaMin: 47,
            areaMax: 91,
            bedrooms: 3,
            priceFrom: 3_000_000_000,
          },
          {
            name: "The Manhattan — shophouse / biệt thự",
            areaMin: 120,
            areaMax: 300,
            bedrooms: 4,
            priceFrom: 8_000_000_000,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "giay_chung_nhan_dau_tu", status: "da_co" },
          { docType: "quy_hoach_1_500", status: "da_co" },
          { docType: "giay_phep_xay_dung", status: "da_co" },
        ],
      },
    },
  });

  return [...VINHOMES_PROJECT_SLUGS];
}
