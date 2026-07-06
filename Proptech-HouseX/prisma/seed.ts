import { PrismaClient } from "@prisma/client";
import { computeFingerprint } from "../lib/content/fingerprint";
import { recomputeListingRanking } from "../lib/data/ranking";
import { hashPassword } from "../lib/auth/password";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "../lib/content/project-landing";
import { seedDtaHappyHome } from "../lib/seed/dta-happy-home";
import {
  HOUSEX_RIVERSIDE_DEMO_IMAGES,
} from "../lib/content/project-landing-demo-images";
import { seedSolenaGreenTown } from "../lib/seed/solena-green-town";
import { buildIkiSeedLanding } from "../lib/preview/iki-village-mock";
import { IKI_VILLAGE_PUBLISHED_IMAGES } from "../lib/content/iki-village-images";
import { buildEcoSeedLanding } from "../lib/preview/eco-residence-mock";
import { ECO_RESIDENCE_PUBLISHED_IMAGES } from "../lib/content/eco-residence-images";
import { buildPhucLocThoSeedLanding } from "../lib/preview/phuc-loc-tho-mock";
import { PHUC_LOC_THO_PUBLISHED_IMAGES } from "../lib/content/phuc-loc-tho-images";
import { buildDragonEHomeSeedLanding } from "../lib/preview/dragon-e-home-mock";
import { DRAGON_E_HOME_PUBLISHED_IMAGES } from "../lib/content/dragon-e-home-images";
import { buildThuThiemGreenHouseSeedLanding } from "../lib/preview/thu-thiem-green-house-mock";
import { THU_THIEM_GREEN_HOUSE_IMAGES } from "../lib/content/thu-thiem-green-house-images";
import { buildPhuThoDmcSeedLanding, LTK_PROJECT_NAME, LTK_PROJECT_SLUG } from "../lib/preview/phu-tho-dmc-mock";
import { PHU_THO_DMC_IMAGES } from "../lib/content/phu-tho-dmc-images";
import {
  buildKdcChangSongSeedLanding,
  CS_PROJECT_NAME,
  CS_PROJECT_SLUG,
} from "../lib/preview/kdc-chang-song-mock";
import { KDC_CHANG_SONG_IMAGES } from "../lib/content/kdc-chang-song-images";
import {
  buildThePriveSeedLanding,
  THE_PRIVE_PROJECT_SLUG,
} from "../lib/preview/the-prive-mock";
import { THE_PRIVE_IMAGES } from "../lib/content/the-prive-images";
import { seedVinhomesProjects } from "../lib/seed/vinhomes-projects";
import { seedCommercialLandings } from "../lib/seed/commercial-landings";
import {
  buildNamLong2SeedLanding,
  NL2_PROJECT_NAME,
  NL2_PROJECT_SLUG,
} from "../lib/preview/nam-long-2-can-tho-mock";
import { NAM_LONG_2_CT_IMAGES } from "../lib/content/nam-long-2-can-tho-images";
import {
  buildNamLongHongPhatSeedLanding,
  NLHP_PROJECT_NAME,
  NLHP_PROJECT_SLUG,
} from "../lib/preview/nam-long-hong-phat-mock";
import { NAM_LONG_HP_IMAGES } from "../lib/content/nam-long-hong-phat-images";
import { seedNoxhLongAnProjects } from "../lib/preview/seed-noxh-long-an";
import { allNoxhLongAnSlugs } from "../lib/preview/noxh-long-an-projects";
import { seedHousexRiversideUnits } from "../lib/preview/seed-project-units";
import { seedHousexRiversideUnitBookings } from "../lib/preview/seed-unit-bookings";
import { hideInternalDemoContent } from "../lib/seed/hide-internal-demo-content";

const prisma = new PrismaClient();

async function ensureFingerprint(code: string) {
  const l = await prisma.listing.findUnique({ where: { code } });
  if (!l) return;
  const fp = computeFingerprint({
    brokerId: l.brokerId,
    propertyType: l.propertyType,
    province: l.province,
    district: l.district,
    ward: l.ward,
    price: Number(l.price.toString()),
    area: l.area,
    projectId: l.projectId,
    unitTypeId: l.unitTypeId,
    description: l.description,
  });
  const canonical = await prisma.canonicalProperty.upsert({
    where: { clusterKey: fp.canonicalKey },
    create: {
      clusterKey: fp.canonicalKey,
      projectId: l.projectId,
      unitTypeId: l.unitTypeId,
      propertyType: l.propertyType,
      province: l.province,
      district: l.district,
      offerCount: 1,
    },
    update: {},
  });
  await prisma.listingFingerprint.upsert({
    where: { listingId: l.id },
    create: {
      listingId: l.id,
      dupeKey: fp.dupeKey,
      contentHash: fp.contentHash,
      canonicalId: canonical.id,
    },
    update: {
      dupeKey: fp.dupeKey,
      contentHash: fp.contentHash,
      canonicalId: canonical.id,
    },
  });
}

async function main() {
  const seedDevFixtures = process.env.SEED_DEV_FIXTURES === "1";

  if (seedDevFixtures) {
  const developer = await prisma.developer.upsert({
    where: { taxCode: "0312345678" },
    update: {},
    create: {
      name: "Tập đoàn HouseX",
      taxCode: "0312345678",
      verified: true,
      logoUrl: "https://placehold.co/200x200?text=HouseX",
    },
  });

  // Dự án thương mại — đang bán.
  const riversideLanding = defaultProjectLanding("HouseX Riverside");
  riversideLanding.heroSubtitle =
    "Khu căn hộ ven sông cao cấp Quận 7 — 1.200 căn, 4 block, bàn giao dự kiến 2027";
  riversideLanding.heroImage = { ...HOUSEX_RIVERSIDE_DEMO_IMAGES.hero };
  riversideLanding.locationNotes =
    "HouseX Riverside nằm trên đường Nguyễn Lương Bằng, Phú Mỹ, Quận 7 — cửa ngõ khu Nam Sài Gòn.\n\n• Kết nối Phú Mỹ Hưng và Crescent Mall khoảng 5 phút xe.\n• Tới trung tâm Quận 1 qua Nguyễn Hữu Thọ / Nguyễn Văn Linh khoảng 20 phút.\n• Tiện ích y tế, giáo dục và thương mại trong bán kính 3–5 km.";
  riversideLanding.locationMapImage = {
    ...HOUSEX_RIVERSIDE_DEMO_IMAGES.locationMap,
  };
  riversideLanding.highlights = [
    {
      title: "Vị trí ven sông Phú Mỹ Hưng",
      text: "View sông, không gian sống xanh, gần khu đô thị Phú Mỹ Hưng và các tuyến đường huyết mạch.",
    },
    {
      title: "Pháp lý minh bạch",
      text: "Đã có giấy phép xây dựng và quy hoạch 1/500 — cập nhật chi tiết trên trang dự án.",
    },
    {
      title: "Tiện ích resort nội khu",
      text: "Hồ bơi vô cực, công viên ven sông, gym, shophouse và an ninh 24/7.",
    },
  ];
  riversideLanding.faqs = [
    {
      q: "HouseX Riverside có pháp lý đầy đủ chưa?",
      a: "Dự án đã có giấy phép xây dựng và quy hoạch 1/500. Chi tiết hồ sơ pháp lý được công bố trên trang dự án HouseX.",
    },
    {
      q: "Giá bán và tiến độ bàn giao HouseX Riverside?",
      a: "Giá từ 2,5 tỷ/căn 1PN; bàn giao dự kiến Q2/2027. Liên hệ tư vấn để nhận bảng giá và chính sách thanh toán mới nhất.",
    },
    {
      q: "HouseX Riverside có những loại hình nào?",
      a: "Căn hộ 1PN, 2PN, 3PN với diện tích từ 45–110 m² — xem bảng loại hình trên trang dự án.",
    },
  ];
  riversideLanding.gallery = [...HOUSEX_RIVERSIDE_DEMO_IMAGES.gallery];
  const riversideOverview = buildOverviewData(null, {
    totalUnits: 1200,
    blocks: 4,
    landing: riversideLanding,
  });

  const riverside = await prisma.project.upsert({
    where: { slug: "housex-riverside" },
    update: { overviewData: riversideOverview as object },
    create: {
      developerId: developer.id,
      slug: "housex-riverside",
      name: "HouseX Riverside",
      projectType: "THUONG_MAI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "Quận 7",
      ward: "Phú Mỹ",
      address: "Đường Nguyễn Lương Bằng",
      lat: 10.7295,
      lng: 106.7218,
      totalArea: 12.5,
      density: 38,
      handoverDate: new Date("2027-06-30"),
      overviewData: riversideOverview as object,
      description:
        "Khu căn hộ cao cấp ven sông với tiện ích nội khu đầy đủ, kết nối trung tâm Quận 1 trong 20 phút.",
      seoTitle: "HouseX Riverside Quận 7 — Căn hộ ven sông cao cấp",
      seoDesc:
        "Dự án HouseX Riverside Quận 7: 1200 căn hộ ven sông, bàn giao 2027, pháp lý minh bạch.",
      unitTypes: {
        create: [
          { name: "1PN", areaMin: 45, areaMax: 52, bedrooms: 1, priceFrom: 2_500_000_000 },
          { name: "2PN", areaMin: 65, areaMax: 78, bedrooms: 2, priceFrom: 3_800_000_000 },
          { name: "3PN", areaMin: 95, areaMax: 110, bedrooms: 3, priceFrom: 5_600_000_000 },
        ],
      },
      legalDocs: {
        create: [
          { docType: "giay_phep_xay_dung", status: "da_co", issuedDate: new Date("2024-03-15") },
          { docType: "1_50", status: "da_co" },
        ],
      },
    },
  });

  await seedHousexRiversideUnits(prisma, riverside.id);
  await seedHousexRiversideUnitBookings(prisma, riverside.id);

  // Dự án NOXH demo nội bộ (giữ làm mẫu tối giản).
  await prisma.project.upsert({
    where: { slug: "housex-an-cu" },
    update: {},
    create: {
      developerId: developer.id,
      slug: "housex-an-cu",
      name: "HouseX An Cư (NOXH)",
      projectType: "NHA_O_XA_HOI",
      status: "DANG_BAN",
      province: "Bình Dương",
      district: "Dĩ An",
      ward: "Tân Đông Hiệp",
      totalArea: 3.2,
      density: 45,
      overviewData: { totalUnits: 640 },
      description:
        "Nhà ở xã hội dành cho người thu nhập thấp, hỗ trợ vay gói ưu đãi theo chính sách nhà nước.",
      unitTypes: {
        create: [
          { name: "Căn 1PN", areaMin: 38, areaMax: 45, bedrooms: 1, priceFrom: 720_000_000 },
          { name: "Căn 2PN", areaMin: 55, areaMax: 62, bedrooms: 2, priceFrom: 1_050_000_000 },
        ],
      },
      legalDocs: {
        create: [
          { docType: "giay_phep_xay_dung", status: "da_co", issuedDate: new Date("2025-01-10") },
        ],
      },
    },
  });
  }

  // CĐT thực — mẫu landing NOXH tiêu biểu. Landing/ảnh là code-authored
  // (lib/content/dta-happy-home-*), dùng chung với scripts/seed-dta-happy-home.ts.
  await seedDtaHappyHome(prisma);

  // NOXH — Eco Residence / Nhà ở xã hội Long Bình Tân (tham khảo hpdgroup.vn/eco-residence).
  const cdhDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0317000001" },
    update: {
      name: "Công ty Cổ phần Chương Dương Homeland",
      verified: true,
      logoUrl: ECO_RESIDENCE_PUBLISHED_IMAGES.developerLogo,
    },
    create: {
      name: "Công ty Cổ phần Chương Dương Homeland",
      taxCode: "0317000001",
      verified: true,
      logoUrl: ECO_RESIDENCE_PUBLISHED_IMAGES.developerLogo,
    },
  });

  const ecoLanding = buildEcoSeedLanding();
  const ecoOverview = buildOverviewData(null, {
    totalUnits: 1098,
    blocks: 3,
    landing: ecoLanding,
  });

  await prisma.project.upsert({
    where: { slug: "eco-residence-long-binh-tan" },
    update: {
      overviewData: ecoOverview as object,
      description:
        "Eco Residence là tên thương mại của dự án Nhà ở xã hội Long Bình Tân do Chương Dương Homeland phát triển tại Biên Hòa, Đồng Nai. 1.098 căn, giá 24–25 triệu/m², bàn giao Q4/2026.",
      seoTitle: "Eco Residence — NOXH Long Bình Tân từ 24 triệu/m²",
      seoDesc:
        "Nhà ở xã hội Eco Residence Biên Hòa: 1.098 căn, 3 block 20 tầng, EDGE xanh, giá 24–25 triệu/m².",
      lat: 10.927,
      lng: 106.879,
    },
    create: {
      developerId: cdhDeveloper.id,
      slug: "eco-residence-long-binh-tan",
      name: "Eco Residence — Nhà Ở Xã Hội Long Bình Tân",
      projectType: "NHA_O_XA_HOI",
      status: "DANG_BAN",
      province: "Đồng Nai",
      district: "Biên Hòa",
      ward: "Long Hưng",
      address: "52 Nguyễn Văn Tỏ, phường Long Hưng",
      lat: 10.927,
      lng: 106.879,
      totalArea: 1.4,
      density: null,
      handoverDate: new Date("2026-12-31"),
      overviewData: ecoOverview as object,
      description:
        "Eco Residence là tên thương mại của dự án Nhà ở xã hội Long Bình Tân do Công ty Cổ phần Chương Dương Homeland phát triển tại 52 Nguyễn Văn Tỏ, phường Long Hưng, TP. Biên Hòa, Đồng Nai. Quy mô 1,4 ha, 3 block 20 tầng, 1.098 căn; tiêu chuẩn EDGE xanh; giá 24–25 triệu/m²; hỗ trợ vay 70% qua MB Bank, CSXH Đồng Nai, BIDV. Bàn giao dự kiến Q4/2026.",
      seoTitle: "Eco Residence — NOXH Long Bình Tân từ 24 triệu/m²",
      seoDesc:
        "Nhà ở xã hội Eco Residence Biên Hòa: 1.098 căn, 3 block 20 tầng, EDGE xanh, giá 24–25 triệu/m². Vay 70%, bàn giao Q4/2026.",
      unitTypes: {
        create: [
          {
            name: "Căn 2PN (~45 m²)",
            areaMin: 43,
            areaMax: 47,
            bedrooms: 2,
            priceFrom: 1_080_000_000,
          },
          {
            name: "Căn 2PN (~55 m²)",
            areaMin: 52,
            areaMax: 58,
            bedrooms: 2,
            priceFrom: 1_320_000_000,
          },
          {
            name: "Căn 3PN (~65 m²)",
            areaMin: 62,
            areaMax: 68,
            bedrooms: 3,
            priceFrom: 1_560_000_000,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "chap_thuan_noxh", status: "da_co", issuedDate: new Date("2024-05-01") },
          { docType: "giay_phep_xay_dung", status: "da_co", issuedDate: new Date("2024-05-01") },
        ],
      },
    },
  });

  // NOXH — Chung cư Phúc Lộc Thọ Block C (tham khảo VnExpress, UBND TP.HCM).
  const pltDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0318000001" },
    update: {
      name: "Công ty TNHH Phúc Lộc Thọ",
      verified: true,
      logoUrl: PHUC_LOC_THO_PUBLISHED_IMAGES.developerLogo,
    },
    create: {
      name: "Công ty TNHH Phúc Lộc Thọ",
      taxCode: "0318000001",
      verified: true,
      logoUrl: PHUC_LOC_THO_PUBLISHED_IMAGES.developerLogo,
    },
  });

  const pltLanding = buildPhucLocThoSeedLanding();
  const pltOverview = buildOverviewData(null, {
    totalUnits: 140,
    blocks: 1,
    landing: pltLanding,
  });

  await prisma.project.upsert({
    where: { slug: "chung-cu-phuc-loc-tho-noxh" },
    update: {
      overviewData: pltOverview as object,
      description:
        "NOXH Block C tại Chung cư Phúc Lộc Thọ, 35 Lê Văn Chí, Linh Xuân, Thủ Đức. 140 căn, giá ~35,3 triệu/m², 40–75 m².",
      seoTitle: "Chung cư Phúc Lộc Thọ NOXH — Block C từ ~1,4 tỷ",
      seoDesc:
        "NOXH Phúc Lộc Thọ Block C: 140 căn, 35 Lê Văn Chí Thủ Đức, giá ~35,3 triệu/m².",
      lat: 10.8628,
      lng: 106.7625,
    },
    create: {
      developerId: pltDeveloper.id,
      slug: "chung-cu-phuc-loc-tho-noxh",
      name: "Chung cư Phúc Lộc Thọ — NOXH Block C",
      projectType: "NHA_O_XA_HOI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "Thủ Đức",
      ward: "Linh Xuân",
      address: "35 Lê Văn Chí, phường Linh Xuân",
      lat: 10.8628,
      lng: 106.7625,
      totalArea: 0.8637,
      density: 39,
      handoverDate: null,
      overviewData: pltOverview as object,
      description:
        "Chung cư Phúc Lộc Thọ tại 35 Lê Văn Chí, phường Linh Xuân, TP. Thủ Đức do Công ty TNHH Phúc Lộc Thọ làm chủ đầu tư. UBND TP.HCM phê duyệt 140 căn nhà ở xã hội tại Block C; giá bình quân ~35,3 triệu/m² (đã VAT); diện tích 40–75 m²; giá căn ~1,4–2,65 tỷ.",
      seoTitle: "Chung cư Phúc Lộc Thọ NOXH — Block C từ ~1,4 tỷ",
      seoDesc:
        "NOXH Phúc Lộc Thọ Block C, 35 Lê Văn Chí Thủ Đức: 140 căn, giá ~35,3 triệu/m², 40–75m². CĐT Phúc Lộc Thọ.",
      unitTypes: {
        create: [
          {
            name: "NOXH ~40 m²",
            areaMin: 40,
            areaMax: 45,
            bedrooms: 1,
            priceFrom: 1_413_971_960,
          },
          {
            name: "NOXH ~55 m²",
            areaMin: 50,
            areaMax: 58,
            bedrooms: 2,
            priceFrom: 1_944_211_445,
          },
          {
            name: "NOXH ~75 m²",
            areaMin: 68,
            areaMax: 75,
            bedrooms: 2,
            priceFrom: 2_651_197_425,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "chap_thuan_noxh", status: "da_co", issuedDate: new Date("2024-01-01") },
          { docType: "giay_phep_xay_dung", status: "da_co", issuedDate: new Date("2010-01-01") },
        ],
      },
    },
  });

  // NOXH — Dragon E-Home (tham khảo phulong.com, Tuổi Trẻ 22/06/2026).
  const phuLongDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0319000001" },
    update: {
      name: "Công ty Cổ phần Địa ốc Phú Long",
      verified: true,
      logoUrl: DRAGON_E_HOME_PUBLISHED_IMAGES.developerLogo,
    },
    create: {
      name: "Công ty Cổ phần Địa ốc Phú Long",
      taxCode: "0319000001",
      verified: true,
      logoUrl: DRAGON_E_HOME_PUBLISHED_IMAGES.developerLogo,
    },
  });

  const dragonLanding = buildDragonEHomeSeedLanding();
  const dragonOverview = buildOverviewData(null, {
    totalUnits: 764,
    blocks: 6,
    landing: dragonLanding,
  });

  await prisma.project.upsert({
    where: { slug: "dragon-e-home-phu-huu" },
    update: {
      overviewData: dragonOverview as object,
      description:
        "Dragon E-Home — NOXH thế hệ mới Phú Long tại Dragon Village, Nguyễn Thị Tư, Long Trường. 764 căn, 6 tòa 8 tầng, 25–69 m².",
      seoTitle: "Dragon E-Home — NOXH thế hệ mới Dragon Village, Thủ Đức",
      seoDesc:
        "Nhà ở xã hội Dragon E-Home: 764 căn, studio–69m², Nguyễn Thị Tư Long Trường. CĐT Phú Long.",
      lat: 10.803,
      lng: 106.789,
    },
    create: {
      developerId: phuLongDeveloper.id,
      slug: "dragon-e-home-phu-huu",
      name: "Dragon E-Home",
      projectType: "NHA_O_XA_HOI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "Thủ Đức",
      ward: "Long Trường",
      address: "Nguyễn Thị Tư (đường 990), KĐT Dragon Village",
      lat: 10.803,
      lng: 106.789,
      totalArea: 1.892,
      density: 40,
      handoverDate: new Date("2027-03-31"),
      overviewData: dragonOverview as object,
      description:
        "Dragon E-Home là khu nhà ở xã hội thế hệ mới do Công ty Cổ phần Địa ốc Phú Long phát triển tại Nguyễn Thị Tư, phường Long Trường, TP. Thủ Đức, trong Khu đô thị Dragon Village 21 ha. Quy mô 18.920,99 m², 6 tòa 8 tầng, 764 căn hộ (25–69 m²) và 34 căn TMDV. Thiết kế Surbana Jurong, Ong & Ong. Khởi công 06/2026.",
      seoTitle: "Dragon E-Home — NOXH thế hệ mới Dragon Village, Thủ Đức",
      seoDesc:
        "Nhà ở xã hội Dragon E-Home Phú Long: 764 căn, studio–69m², Nguyễn Thị Tư Long Trường. NOXH thế hệ mới khu Đông TP.HCM.",
      unitTypes: {
        create: [
          {
            name: "Studio",
            areaMin: 25,
            areaMax: 25,
            bedrooms: 0,
            priceFrom: 750_000_000,
          },
          {
            name: "1 phòng ngủ",
            areaMin: 41,
            areaMax: 47,
            bedrooms: 1,
            priceFrom: 1_230_000_000,
          },
          {
            name: "2 phòng ngủ / Dual Key",
            areaMin: 69,
            areaMax: 69,
            bedrooms: 2,
            priceFrom: 2_070_000_000,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "chap_thuan_noxh", status: "da_co", issuedDate: new Date("2025-01-01") },
          { docType: "giay_phep_xay_dung", status: "da_co", issuedDate: new Date("2026-06-22") },
        ],
      },
    },
  });

  // NOXH — Thủ Thiêm Green House (tham khảo thuthiemgreenhouses.vn).
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

  await prisma.project.upsert({
    where: { slug: "thu-thiem-green-house-thu-duc" },
    update: {
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
      slug: "thu-thiem-green-house-thu-duc",
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

  // NOXH — Nhà ở xã hội Lý Thường Kiệt / Phú Thọ DMC (tham khảo công bố SXD TP.HCM 6/2026).
  const ducManhDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0321000001" },
    update: {
      name: "Công ty Cổ phần Đức Mạnh (Đức Mạnh Group)",
      verified: true,
      logoUrl: PHU_THO_DMC_IMAGES.developerLogo,
    },
    create: {
      name: "Công ty Cổ phần Đức Mạnh (Đức Mạnh Group)",
      taxCode: "0321000001",
      verified: true,
      logoUrl: PHU_THO_DMC_IMAGES.developerLogo,
    },
  });

  const ptdmcLanding = buildPhuThoDmcSeedLanding();
  const ptdmcOverview = buildOverviewData(null, {
    totalUnits: 1254,
    blocks: 4,
    landing: ptdmcLanding,
  });

  await prisma.project.upsert({
    where: { slug: LTK_PROJECT_SLUG },
    update: {
      name: LTK_PROJECT_NAME,
      overviewData: ptdmcOverview as object,
      description:
        "Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) — NOXH 324 Lý Thường Kiệt Q10. 755 căn bán, ~23,25 tr/m², bàn giao 08/2026.",
      seoTitle:
        "Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) Q10 — giá ~23,25 tr/m²",
      seoDesc:
        "Nhà ở xã hội Lý Thường Kiệt Quận 10 (Phú Thọ DMC): 755 căn bán, ~23,25 tr/m², Studio–2PN 34,5–77m².",
      lat: 10.7751,
      lng: 106.6593,
    },
    create: {
      developerId: ducManhDeveloper.id,
      slug: LTK_PROJECT_SLUG,
      name: LTK_PROJECT_NAME,
      projectType: "NHA_O_XA_HOI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "Quận 10",
      ward: "Diên Hồng",
      address: "324 Lý Thường Kiệt",
      lat: 10.7751,
      lng: 106.6593,
      totalArea: 1.47033,
      density: 36,
      handoverDate: new Date("2026-08-31"),
      overviewData: ptdmcOverview as object,
      description:
        "Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) — NOXH 324 Lý Thường Kiệt, Quận 10 do Đức Mạnh Group phát triển. 4 block 25 tầng, 1.254 căn; giá ~23,25 tr/m²; Studio–2PN 34,5–77 m².",
      seoTitle:
        "Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) Q10 — giá ~23,25 tr/m²",
      seoDesc:
        "Nhà ở xã hội Lý Thường Kiệt Quận 10 (Phú Thọ DMC): 755 căn bán, ~23,25 tr/m², Studio–2PN 34,5–77m². 324 Lý Thường Kiệt, bàn giao 08/2026.",
      unitTypes: {
        create: [
          {
            name: "Studio",
            areaMin: 34.5,
            areaMax: 40,
            bedrooms: 0,
            priceFrom: 802_173_231,
          },
          {
            name: "Căn 1 phòng ngủ",
            areaMin: 40,
            areaMax: 55,
            bedrooms: 1,
            priceFrom: 1_046_312_910,
          },
          {
            name: "Căn 2 phòng ngủ",
            areaMin: 55,
            areaMax: 77,
            bedrooms: 2,
            priceFrom: 1_790_357_646,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "chap_thuan_noxh", status: "da_co", issuedDate: new Date("2024-01-01") },
          { docType: "giay_phep_xay_dung", status: "da_co", issuedDate: new Date("2024-06-01") },
        ],
      },
    },
  });

  // NOXH — KDC Chàng Sông, Phước Tân (CĐT Hùng Cường — đang triển khai hạ tầng).
  const hungCuongDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0322000001" },
    update: {
      name: "Công ty Cổ phần Hợp tác Quốc tế Hùng Cường",
      verified: true,
      logoUrl: KDC_CHANG_SONG_IMAGES.developerLogo,
    },
    create: {
      name: "Công ty Cổ phần Hợp tác Quốc tế Hùng Cường",
      taxCode: "0322000001",
      verified: true,
      logoUrl: KDC_CHANG_SONG_IMAGES.developerLogo,
    },
  });

  const csLanding = buildKdcChangSongSeedLanding();
  const csOverview = buildOverviewData(null, { landing: csLanding });

  await prisma.project.upsert({
    where: { slug: CS_PROJECT_SLUG },
    update: {
      name: CS_PROJECT_NAME,
      overviewData: csOverview as object,
      description:
        "NOXH KDC Chàng Sông Phước Tân, Biên Hòa — Hùng Cường Group. Đang triển khai hạ tầng, chưa công bố giá.",
      seoTitle: "Nhà ở xã hội KDC Chàng Sông — NOXH Phước Tân Biên Hòa",
      seoDesc:
        "NOXH KDC Chàng Sông Phước Tân: thấp tầng & cao tầng, vùng KCN phía Nam Biên Hòa. Liên hệ tư vấn.",
      lat: 10.9285,
      lng: 106.915,
    },
    create: {
      developerId: hungCuongDeveloper.id,
      slug: CS_PROJECT_SLUG,
      name: CS_PROJECT_NAME,
      projectType: "NHA_O_XA_HOI",
      status: "SAP_MO_BAN",
      province: "Đồng Nai",
      district: "Biên Hòa",
      ward: "Phước Tân",
      address: "KDC Chàng Sông, phường Phước Tân",
      lat: 10.9285,
      lng: 106.915,
      overviewData: csOverview as object,
      description:
        "Nhà ở xã hội KDC Chàng Sông — NOXH thấp tầng & cao tầng tại Phước Tân, Biên Hòa do Công ty CP Hợp tác Quốc tế Hùng Cường phát triển. Đang triển khai hạ tầng và móng; chưa công bố giá.",
      seoTitle: "Nhà ở xã hội KDC Chàng Sông — NOXH Phước Tân Biên Hòa",
      seoDesc:
        "NOXH KDC Chàng Sông Phước Tân, Biên Hòa: thấp tầng & cao tầng, vùng KCN phía Nam. CĐT Hùng Cường — đang triển khai, liên hệ tư vấn.",
      unitTypes: {
        create: [
          { name: "Căn hộ NOXH cao tầng" },
          { name: "Nhà ở NOXH thấp tầng" },
        ],
      },
      legalDocs: {
        create: [
          { docType: "chap_thuan_noxh", status: "da_co", issuedDate: new Date("2025-01-01") },
          { docType: "quy_hoach_1_500", status: "da_co", issuedDate: new Date("2024-06-01") },
          {
            docType: "danh_gia_tac_dong_moi_truong",
            status: "da_co",
            issuedDate: new Date("2025-06-01"),
          },
          {
            docType: "pheduyet_thiet_ke_ky_thuat",
            status: "da_co",
            issuedDate: new Date("2025-09-01"),
          },
          { docType: "giay_phep_xay_dung", status: "dang_lam" },
        ],
      },
    },
  });

  // NOXH — Nam Long 2 Cần Thơ (nội dung tham khảo namlongcantho.com.vn).
  const namLongDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0301237890" },
    update: {
      name: "Nam Long Group",
      verified: true,
      logoUrl: NAM_LONG_2_CT_IMAGES.developerLogo,
    },
    create: {
      name: "Nam Long Group",
      taxCode: "0301237890",
      verified: true,
      logoUrl: NAM_LONG_2_CT_IMAGES.developerLogo,
    },
  });

  const nl2Landing = buildNamLong2SeedLanding();
  const nl2Overview = buildOverviewData(null, {
    totalUnits: 1601,
    blocks: 10,
    landing: nl2Landing,
  });

  await prisma.project.upsert({
    where: { slug: NL2_PROJECT_SLUG },
    update: {
      name: NL2_PROJECT_NAME,
      overviewData: nl2Overview as object,
      description:
        "NOXH Nam Long 2 Cần Thơ — Nam Long Group, Trần Hoàng Na Cái Răng. Giá 15,8 tr/m², căn từ ~640 triệu. Giai đoạn 2 bàn giao 2027.",
      seoTitle: "Nhà ở xã hội Nam Long 2 Cần Thơ — Giá từ 640 triệu/căn",
      seoDesc:
        "NOXH Nam Long 2: 15,8 tr/m², 38–57 m², từ ~640 triệu. Nam Long II Central Lake, Cái Răng. Bàn giao giai đoạn 2 năm 2027.",
      lat: 10.0078,
      lng: 105.7525,
    },
    create: {
      developerId: namLongDeveloper.id,
      slug: NL2_PROJECT_SLUG,
      name: NL2_PROJECT_NAME,
      projectType: "NHA_O_XA_HOI",
      status: "DANG_BAN",
      province: "Cần Thơ",
      district: "Cái Răng",
      ward: "Hưng Thạnh",
      address: "Mặt tiền Trần Hoàng Na, KDC Nam Long 2 (lô 9A)",
      lat: 10.0078,
      lng: 105.7525,
      totalArea: 3.8,
      handoverDate: new Date("2027-12-31"),
      overviewData: nl2Overview as object,
      description:
        "Nhà ở xã hội Nam Long 2 Cần Thơ (Nam Long II Central Lake) do Nam Long Group phát triển tại Trần Hoàng Na, Cái Răng. Quy mô 1.601 căn trên 3,8+ ha; giá 15,8 triệu/m², căn 38–57 m² từ ~640 triệu. Giai đoạn 2 (block A–D) dự kiến bàn giao 2027.",
      seoTitle: "Nhà ở xã hội Nam Long 2 Cần Thơ — Giá từ 640 triệu/căn",
      seoDesc:
        "NOXH Nam Long 2 Cái Răng: 15,8 tr/m², 38–57 m², từ ~640 triệu. Nam Long Group, KDC Nam Long II Central Lake. Giai đoạn 2 bàn giao 2027.",
      unitTypes: {
        create: [
          {
            name: "1PN — 38 m² (1WC)",
            areaMin: 38,
            areaMax: 38,
            bedrooms: 1,
            priceFrom: 640_000_000,
          },
          {
            name: "2PN — 44 m² (1WC)",
            areaMin: 44,
            areaMax: 44,
            bedrooms: 2,
            priceFrom: 743_000_000,
          },
          {
            name: "2PN — 57 m² (2WC)",
            areaMin: 57,
            areaMax: 57,
            bedrooms: 2,
            priceFrom: 963_000_000,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "chap_thuan_noxh", status: "da_co", issuedDate: new Date("2023-06-01") },
          { docType: "quy_hoach_1_500", status: "da_co" },
          { docType: "giay_phep_xay_dung", status: "da_co", issuedDate: new Date("2023-12-01") },
        ],
      },
    },
  });

  // NOXH — Nam Long – Hồng Phát Cần Thơ (GPXD 50/GPXD — Báo Cần Thơ; ảnh tham khảo namphuoc.net).
  const namLongHpDeveloper = await prisma.developer.upsert({
    where: { taxCode: "1801234567" },
    update: {
      name: "Công ty Cổ phần Nam Long – Hồng Phát",
      verified: true,
      logoUrl: NAM_LONG_HP_IMAGES.developerLogo,
    },
    create: {
      name: "Công ty Cổ phần Nam Long – Hồng Phát",
      taxCode: "1801234567",
      verified: true,
      logoUrl: NAM_LONG_HP_IMAGES.developerLogo,
    },
  });

  const nlhpLanding = buildNamLongHongPhatSeedLanding();
  const nlhpOverview = buildOverviewData(null, {
    totalUnits: 187,
    blocks: 1,
    landing: nlhpLanding,
  });

  await prisma.project.upsert({
    where: { slug: NLHP_PROJECT_SLUG },
    update: {
      name: NLHP_PROJECT_NAME,
      overviewData: nlhpOverview as object,
      description:
        "NOXH Nam Long – Hồng Phát Cái Răng: 187 căn, 7 tầng, bàn giao 2020. Chuyển nhượng ~800 tr – 1,2 tỷ.",
      seoTitle: "Nhà ở xã hội Nam Long – Hồng Phát Cần Thơ — Giá ~800 tr – 1,2 tỷ",
      seoDesc:
        "NOXH Nam Long – Hồng Phát: 187 căn, 35–70 m², bàn giao 2020. Chuyển nhượng ~800 tr – 1,2 tỷ tại Cái Răng.",
      lat: 10.0345,
      lng: 105.7842,
    },
    create: {
      developerId: namLongHpDeveloper.id,
      slug: NLHP_PROJECT_SLUG,
      name: NLHP_PROJECT_NAME,
      projectType: "NHA_O_XA_HOI",
      status: "DA_BAN_GIAO",
      province: "Cần Thơ",
      district: "Cái Răng",
      ward: "Hưng Thạnh",
      address: "Đường số 2 & 4, KDC Nam Long lô 8C",
      lat: 10.0345,
      lng: 105.7842,
      totalArea: 3.8,
      handoverDate: new Date("2020-12-31"),
      overviewData: nlhpOverview as object,
      description:
        "Nhà ở xã hội Nam Long – Hồng Phát (Chung cư Nam Long – Hồng Phát) do Công ty CP Nam Long – Hồng Phát phát triển tại KDC lô 8C, Cái Răng, Cần Thơ. Quy mô 187 căn, 7 tầng, diện tích 35–70 m², dòng Ehome. Bàn giao 2020; giá chuyển nhượng tham chiếu 800 triệu – 1,2 tỷ.",
      seoTitle: "Nhà ở xã hội Nam Long – Hồng Phát Cần Thơ — Giá ~800 tr – 1,2 tỷ",
      seoDesc:
        "NOXH Nam Long – Hồng Phát Cái Răng: 187 căn, 7 tầng, 35–70 m², bàn giao 2020. Chuyển nhượng ~800 tr – 1,2 tỷ. Ehome Nam Long Cần Thơ.",
      unitTypes: {
        create: [
          {
            name: "Căn tiêu chuẩn (~39–41 m²)",
            areaMin: 39,
            areaMax: 41,
            bedrooms: 1,
            priceFrom: 800_000_000,
          },
          {
            name: "Căn 2PN (~44–57 m²)",
            areaMin: 44,
            areaMax: 57,
            bedrooms: 2,
            priceFrom: 950_000_000,
          },
          {
            name: "Căn góc (~68–70 m²)",
            areaMin: 68,
            areaMax: 70,
            bedrooms: 2,
            priceFrom: 1_200_000_000,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "chap_thuan_noxh", status: "da_co", issuedDate: new Date("2019-01-01") },
          { docType: "giay_phep_xay_dung", status: "da_co", issuedDate: new Date("2019-09-12") },
          { docType: "quy_hoach_1_500", status: "da_co" },
        ],
      },
    },
  });

  // NOXH Long An — LA Home, Mỹ Hạnh, The Ori, Hậu Nghĩa, Phước Vĩnh Tây, Phú An Thạnh.
  await seedNoxhLongAnProjects(prisma);

  // Căn hộ thương mại — Solena Green Town (nội dung tham khảo solena.com.vn).
  await seedSolenaGreenTown(prisma);

  // Căn hộ thương mại — The Privé Nam Rạch Chiếc (nội dung tham khảo the-prive.vn).
  const bluemarqDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0301445678" },
    update: {
      name: "Bluemarq Group",
      verified: true,
      logoUrl: THE_PRIVE_IMAGES.developerLogo,
    },
    create: {
      name: "Bluemarq Group",
      taxCode: "0301445678",
      verified: true,
      logoUrl: THE_PRIVE_IMAGES.developerLogo,
    },
  });

  const thePriveLanding = buildThePriveSeedLanding();
  const thePriveOverview = buildOverviewData(null, {
    totalUnits: 3175,
    blocks: 12,
    landing: thePriveLanding,
  });

  await prisma.project.upsert({
    where: { slug: THE_PRIVE_PROJECT_SLUG },
    update: {
      overviewData: thePriveOverview as object,
      description:
        "The Privé là dự án căn hộ cao cấp ven sông do Bluemarq Group phát triển tại Nam Rạch Chiếc, An Phú, TP. Thủ Đức. 6,7 ha, 3.175 căn, bàn giao Q4/2027.",
      seoTitle: "The Privé Nam Rạch Chiếc — Căn hộ cao cấp ven sông Quận 2",
      seoDesc:
        "Căn hộ The Privé: 6,7 ha Nam Rạch Chiếc, 1–3PN & penthouse, công viên mặt nước, chiết khấu tới 21,5%. Bàn giao Q4/2027.",
      lat: 10.7978,
      lng: 106.7492,
    },
    create: {
      developerId: bluemarqDeveloper.id,
      slug: THE_PRIVE_PROJECT_SLUG,
      name: "The Privé Nam Rạch Chiếc",
      projectType: "THUONG_MAI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "TP. Thủ Đức",
      ward: "An Phú",
      address: "Khu đô thị Nam Rạch Chiếc",
      lat: 10.7978,
      lng: 106.7492,
      totalArea: 6.7,
      density: 25,
      handoverDate: new Date("2027-12-31"),
      overviewData: thePriveOverview as object,
      description:
        "The Privé là dự án căn hộ cao cấp ven sông do Bluemarq Group phát triển tại Nam Rạch Chiếc, An Phú, TP. Thủ Đức. Quy mô 6,7 ha với công viên mặt nước nội khu, 12 tháp 32–35 tầng, 3.175 sản phẩm. Thiết kế CPG Consultants, thi công Hòa Bình. Sản phẩm studio–penthouse 49–151 m², 45+ tiện ích resort. Dự kiến bàn giao Q4/2027.",
      seoTitle: "The Privé Nam Rạch Chiếc — Căn hộ cao cấp ven sông Quận 2",
      seoDesc:
        "Căn hộ The Privé Bluemarq Group: 6,7 ha Nam Rạch Chiếc, 3.175 căn, 1–3PN & penthouse, công viên mặt nước, chiết khấu tới 21,5%. Bàn giao Q4/2027.",
      unitTypes: {
        create: [
          {
            name: "1PN / Studio (~49 m²)",
            areaMin: 49.14,
            areaMax: 49.14,
            bedrooms: 1,
            priceFrom: 5_896_800_000,
          },
          {
            name: "2PN (71–85 m²)",
            areaMin: 71,
            areaMax: 85.06,
            bedrooms: 2,
            priceFrom: 8_520_000_000,
          },
          {
            name: "3PN (~95 m²)",
            areaMin: 94.93,
            areaMax: 95.01,
            bedrooms: 3,
            priceFrom: 11_391_600_000,
          },
          {
            name: "Penthouse / Duplex (108–151 m²)",
            areaMin: 107.78,
            areaMax: 151.19,
            bedrooms: 3,
            priceFrom: 12_933_600_000,
          },
        ],
      },
      legalDocs: {
        create: [
          { docType: "quy_hoach_1_500", status: "da_co" },
          { docType: "giay_phep_xay_dung", status: "da_co" },
          { docType: "giay_chung_nhan_dau_tu", status: "da_co" },
        ],
      },
    },
  });

  await seedVinhomesProjects(prisma);
  await seedCommercialLandings(prisma);

  // Căn hộ thương mại — IKI Village (nội dung tham khảo ikivillage.net).
  const akhDeveloper = await prisma.developer.upsert({
    where: { taxCode: "0316000002" },
    update: {
      name: "Công ty Cổ phần Đầu tư An Khải Hưng",
      verified: true,
      logoUrl: IKI_VILLAGE_PUBLISHED_IMAGES.developerLogo,
    },
    create: {
      name: "Công ty Cổ phần Đầu tư An Khải Hưng",
      taxCode: "0316000002",
      verified: true,
      logoUrl: IKI_VILLAGE_PUBLISHED_IMAGES.developerLogo,
    },
  });

  const ikiLanding = buildIkiSeedLanding();
  const ikiOverview = buildOverviewData(null, {
    blocks: 2,
    landing: ikiLanding,
  });

  await prisma.project.upsert({
    where: { slug: "iki-village" },
    update: {
      overviewData: ikiOverview as object,
      description:
        "IKI Village là dự án căn hộ cao cấp định hướng wellness do Công ty Cổ phần Đầu tư An Khải Hưng phát triển tại mặt tiền Vành đai 3 — Lò Lu nối dài, TP.HCM. Quy mô 5,1 ha, mật độ xây dựng 40%.",
      seoTitle: "IKI Village — Căn hộ wellness sân vườn riêng, Vành đai 3",
      seoDesc:
        "Căn hộ IKI Village TP.HCM: 100% sân vườn riêng, view sông, Sky Garden đến Penthouse 126–349m².",
      lat: 10.765,
      lng: 106.545,
    },
    create: {
      developerId: akhDeveloper.id,
      slug: "iki-village",
      name: "IKI Village",
      projectType: "THUONG_MAI",
      status: "DANG_BAN",
      province: "TP. Hồ Chí Minh",
      district: "TP. Hồ Chí Minh",
      ward: null,
      address: "Mặt tiền Vành đai 3 — Lò Lu nối dài",
      lat: 10.765,
      lng: 106.545,
      totalArea: 5.1,
      density: 40,
      handoverDate: null,
      overviewData: ikiOverview as object,
      description:
        "IKI Village là dự án căn hộ cao cấp định hướng wellness do Công ty Cổ phần Đầu tư An Khải Hưng phát triển tại mặt tiền Vành đai 3 — Lò Lu nối dài, TP.HCM. Quy mô 5,1 ha, mật độ xây dựng 40%. 100% căn hộ có sân vườn riêng; sản phẩm Sky Garden, Duplex Garden, Sky Villa và Penthouse (126–349 m²). Lấy cảm hứng triết lý IKIGAI, tích hợp công viên ven sông 1ha và hệ sinh thái tiện ích wellness.",
      seoTitle: "IKI Village — Căn hộ wellness sân vườn riêng, Vành đai 3",
      seoDesc:
        "Căn hộ IKI Village TP.HCM: 100% sân vườn riêng, view sông, Sky Garden đến Penthouse 126–349m². Wellness living tại Vành đai 3.",
      unitTypes: {
        create: [
          {
            name: "Sky Garden",
            areaMin: 126,
            areaMax: 163,
            bedrooms: 2,
            priceFrom: null,
          },
          {
            name: "Duplex Garden",
            areaMin: 223,
            areaMax: 227,
            bedrooms: 3,
            priceFrom: null,
          },
          {
            name: "Sky Villa Residences",
            areaMin: 281,
            areaMax: 288,
            bedrooms: 4,
            priceFrom: null,
          },
          {
            name: "Penthouse",
            areaMin: 288,
            areaMax: 349,
            bedrooms: 4,
            priceFrom: null,
          },
        ],
      },
    },
  });

  if (seedDevFixtures) {
  // --- Phase 2: Brokers (tài khoản môi giới) ---
  const brokerFreeAccount = await prisma.userAccount.upsert({
    where: { normalizedPhone: "+84900000001" },
    update: {},
    create: {
      role: "BROKER",
      name: "Nguyễn Văn Free",
      phone: "0900000001",
      normalizedPhone: "+84900000001",
      email: "broker.free@housex.local",
      emailVerified: true,
      passwordHash: hashPassword("demo1234"),
    },
  });

  const brokerFreeUnverified = await prisma.broker.upsert({
    where: { userAccountId: brokerFreeAccount.id },
    update: {},
    create: {
      userAccountId: brokerFreeAccount.id,
      fullName: "Nguyễn Văn Free",
      phone: "0900000001",
      brokerType: "FREE",
      licenseVerified: false,
    },
  });

  await prisma.ctvApplication.upsert({
    where: { brokerId: brokerFreeUnverified.id },
    update: {},
    create: {
      brokerId: brokerFreeUnverified.id,
      idNumber: "079123456789",
      experience:
        "2 năm môi giới căn hộ tại Quận 7 và Nhà Bè. Quen quy trình ký gửi dự án thương mại.",
      region: "TP.HCM — Quận 7, Nhà Bè",
      motivation:
        "Muốn tham gia chương trình CTV để giới thiệu dự án NOXH và nhận hoa hồng minh bạch.",
      status: "PENDING",
    },
  });

  const brokerCtvAccount = await prisma.userAccount.upsert({
    where: { normalizedPhone: "+84900000002" },
    update: {},
    create: {
      role: "BROKER",
      name: "Trần Thị CTV",
      phone: "0900000002",
      normalizedPhone: "+84900000002",
      email: "broker.ctv@housex.local",
      emailVerified: true,
      passwordHash: hashPassword("demo1234"),
    },
  });

  const brokerCtvVerified = await prisma.broker.upsert({
    where: { userAccountId: brokerCtvAccount.id },
    update: {},
    create: {
      userAccountId: brokerCtvAccount.id,
      fullName: "Trần Thị CTV",
      phone: "0900000002",
      brokerType: "CTV",
      ctvCode: "HX-CTV-000001",
      licenseNo: "CCHN-12345",
      licenseVerified: true,
      tier: "VIP",
    },
  });

  // --- Phase 2: Listings ---
  const riverside = await prisma.project.findUniqueOrThrow({
    where: { slug: "housex-riverside" },
  });
  const riversideUnit = await prisma.projectUnitType.findFirst({
    where: { projectId: riverside.id },
    orderBy: { priceFrom: "asc" },
  });

  // Tin gắn dự án (ký gửi) — broker CTV verified, tier VIP (qua license gate).
  await prisma.listing.upsert({
    where: { code: "MX-SEED0001" },
    update: {},
    create: {
      code: "MX-SEED0001",
      brokerId: brokerCtvVerified.id,
      projectId: riverside.id,
      unitTypeId: riversideUnit?.id,
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 3_900_000_000,
      area: 68,
      province: riverside.province,
      district: riverside.district,
      ward: riverside.ward,
      description: "Căn 2PN view sông, full nội thất, sổ hồng lâu dài.",
      status: "ACTIVE",
      tier: "VIP",
      verified: true,
      verifiedAt: new Date(),
      expireAt: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      media: {
        create: [
          {
            url: "https://placehold.co/1600x900?text=Can+ho+2PN",
            type: "image",
            status: "READY",
            width: 1600,
            height: 900,
            position: 0,
          },
          {
            url: "https://cdn.example/stub/seed-video/playlist.m3u8",
            type: "video",
            provider: "stub",
            playbackId: "stub_seed_video",
            status: "READY",
            width: 1080,
            height: 1920,
            durationSec: 30,
            position: 1,
          },
        ],
      },
    },
  });

  // Tin nhà đất lẻ (không gắn dự án) — broker FREE, tier FREE.
  await prisma.listing.upsert({
    where: { code: "MX-SEED0002" },
    update: {},
    create: {
      code: "MX-SEED0002",
      brokerId: brokerFreeUnverified.id,
      transactionType: "SALE",
      propertyType: "nha_pho",
      price: 6_200_000_000,
      area: 80,
      province: "TP. Hồ Chí Minh",
      district: "Gò Vấp",
      ward: "Phường 5",
      address: "Hẻm xe hơi đường Quang Trung",
      description: "Nhà phố 1 trệt 2 lầu, hẻm xe hơi, gần chợ.",
      status: "ACTIVE",
      tier: "FREE",
      expireAt: new Date(Date.now() + 30 * 24 * 3600 * 1000),
    },
  });

  // Tin đã hết hạn (demo cron rule #5: ACTIVE + expireAt < now → EXPIRED).
  await prisma.listing.upsert({
    where: { code: "MX-SEED0003" },
    update: {},
    create: {
      code: "MX-SEED0003",
      brokerId: brokerFreeUnverified.id,
      transactionType: "RENT",
      propertyType: "can_ho",
      price: 12_000_000,
      area: 50,
      province: "TP. Hồ Chí Minh",
      district: "Quận 7",
      status: "ACTIVE",
      tier: "FREE",
      expireAt: new Date(Date.now() - 24 * 3600 * 1000),
    },
  });

  // --- P1: Fingerprint + Canonical cho các listing seed ---
  for (const code of ["MX-SEED0001", "MX-SEED0002", "MX-SEED0003"]) {
    await ensureFingerprint(code);
  }

  // --- P2: precompute quality + rank cho các listing seed ---
  const seedListings = await prisma.listing.findMany({
    where: { code: { in: ["MX-SEED0001", "MX-SEED0002", "MX-SEED0003"] } },
    select: { id: true },
  });
  for (const l of seedListings) {
    await recomputeListingRanking(l.id, prisma);
  }

  // --- Phase 3: Referral + Lead (WON) + Commission ---
  const referral = await prisma.referral.upsert({
    where: { code: "RF-SEED0001" },
    update: {},
    create: {
      code: "RF-SEED0001",
      brokerId: brokerCtvVerified.id,
      type: "CTV_PROJECT",
      projectId: riverside.id,
      clickCount: 5,
      expiresAt: new Date(Date.now() + 90 * 24 * 3600 * 1000),
    },
  });

  // Idempotent: chỉ tạo lead/commission demo nếu referral này chưa có hoa hồng.
  const existingCommission = await prisma.commission.findFirst({
    where: { referralId: referral.id },
    select: { id: true },
  });

  if (!existingCommission) {
    const customer = await prisma.customer.upsert({
      where: { normalizedPhone: "+84911111111" },
      update: {},
      create: {
        name: "Lê Văn Khách",
        phone: "0911111111",
        normalizedPhone: "+84911111111",
        email: "khach@example.com",
      },
    });

    const lead = await prisma.lead.create({
      data: {
        customerId: customer.id,
        projectId: riverside.id,
        referralId: referral.id,
        assignedBrokerId: brokerCtvVerified.id,
        source: "referral",
        message: "Quan tâm căn 2PN view sông.",
        status: "WON",
      },
    });

    await prisma.commission.create({
      data: {
        leadId: lead.id,
        referralId: referral.id,
        brokerId: brokerCtvVerified.id,
        amount: 39_000_000,
        rate: 0.01,
        status: "PENDING",
      },
    });
  }
  }

  if (!seedDevFixtures) {
    const hidden = await hideInternalDemoContent(prisma);
    if (hidden.projectsHidden > 0 || hidden.listingsHidden > 0) {
      console.log(
        `  Đã ẩn demo nội bộ: ${hidden.projectsHidden} dự án, ${hidden.listingsHidden} tin.`,
      );
    }
  }

  // --- Tin tức / blog (tags + bài mẫu) ---
  const tagDefs = [
    { slug: "noxh", name: "Nhà ở xã hội", description: "Chính sách và dự án NOXH." },
    { slug: "phap-ly", name: "Pháp lý & chính sách", description: "Luật Nhà ở, hồ sơ mua NOXH." },
    { slug: "tien-do-du-an", name: "Tiến độ dự án", description: "Cập nhật giá, khởi công, bàn giao." },
    { slug: "dau-tu", name: "Kiến thức đầu tư", description: "Phân tích NOXH vs thương mại." },
    { slug: "goc-chuyen-gia", name: "Góc chuyên gia", description: "Nhận định thị trường." },
    { slug: "phong-thuy", name: "Phong thủy nhà ở", description: "Hướng nhà, tuổi xây, màu sơn." },
  ];
  for (const t of tagDefs) {
    await prisma.articleTag.upsert({
      where: { slug: t.slug },
      update: { name: t.name, description: t.description },
      create: t,
    });
  }

  const ltkProject = await prisma.project.findUnique({
    where: { slug: LTK_PROJECT_SLUG },
  });
  const csProject = await prisma.project.findUnique({
    where: { slug: CS_PROJECT_SLUG },
  });

  const articleSeeds = [
    {
      slug: "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026",
      title: "Giá nhà ở xã hội Lý Thường Kiệt công bố chính thức cuối 6/2026",
      excerpt:
        "Mức 23,25 triệu/m² — căn tham chiếu từ ~800 triệu đến ~1,8 tỷ.",
      body: `Cuối tháng 6/2026, Sở Xây dựng TP.HCM và Công ty Cổ phần Đức Mạnh đã công bố phương án giá bán cho dự án Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) tại 324 Lý Thường Kiệt, Quận 10.

Mức giá chính thức: 23.251.398 đồng/m² (đã VAT, chưa gồm 2% phí bảo trì và hệ số vị trí). Giá căn tham chiếu khoảng 800 triệu – 1,8 tỷ tùy diện tích 34,5–77 m².`,
      tagSlugs: ["noxh", "tien-do-du-an"],
      projectId: ltkProject?.id,
      coverImageUrl: PHU_THO_DMC_IMAGES.hero.url,
    },
    {
      slug: "tien-do-noxh-kdc-chang-song-phuoc-tan-2026",
      title: "Tiến độ NOXH KDC Chàng Sông Phước Tân — hạ tầng và móng",
      excerpt: "CĐT Hùng Cường đang san lấp, hoàn thiện HTKT nội khu.",
      body: `Dự án Nhà ở xã hội KDC Chàng Sông tại phường Phước Tân do Công ty CP Hợp tác Quốc tế Hùng Cường phát triển đang giai đoạn san lấp, hạ tầng và thi công móng. Chưa công bố giá đợt 1.`,
      tagSlugs: ["noxh", "tien-do-du-an"],
      projectId: csProject?.id,
      coverImageUrl: KDC_CHANG_SONG_IMAGES.hero.url,
    },
    {
      slug: "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
      title: "Ai được mua nhà ở xã hội năm 2026? — Tóm tắt điều kiện",
      excerpt: "Đối tượng thu nhập thấp, công nhân, CBCCVC theo Luật Nhà ở.",
      body: `Người mua NOXH phải thuộc nhóm đối tượng quy định và đáp ứng điều kiện thu nhập, nhà ở, cư trú. Hồ sơ gồm đơn đăng ký, giấy tờ chứng minh đối tượng và cam kết theo quy định.`,
      tagSlugs: ["noxh", "phap-ly", "goc-chuyen-gia"],
      projectId: undefined as string | undefined,
      coverImageUrl: null as string | null,
    },
    {
      slug: "huong-nha-hop-tuoi-bat-trach-tom-tat",
      title: "Hướng nhà hợp tuổi theo Bát trạch — tóm tắt cho người mua nhà",
      excerpt:
        "Cung mệnh, Đông/Tây tứ mệnh và 4 hướng cát — cách tra cứu nhanh trước khi chọn căn.",
      body: `Bát trạch xác định cung mệnh từ năm sinh âm lịch và giới tính, suy ra 4 hướng tốt và 4 hướng xấu. Dùng công cụ xem hướng nhà trên House X để tra cứu tức thì.`,
      tagSlugs: ["phong-thuy", "goc-chuyen-gia"],
      projectId: undefined as string | undefined,
      coverImageUrl: null as string | null,
    },
    {
      slug: "kim-lau-hoang-oc-tam-tai-xay-nha-giai-thich",
      title: "Kim Lâu, Hoang Ốc, Tam Tai khi xây nhà — giải thích ngắn gọn",
      excerpt: "Tuổi mụ, cách tính phạm và gợi ý chọn năm động thổ.",
      body: `Tuổi mụ = năm xây − năm sinh + 1. Kim Lâu (chia 9), Hoang Ốc (chia 6), Tam Tai theo tam hợp địa chi — tham khảo trước động thổ.`,
      tagSlugs: ["phong-thuy", "goc-chuyen-gia"],
      projectId: undefined as string | undefined,
      coverImageUrl: null as string | null,
    },
  ];

  for (const a of articleSeeds) {
    const tags = await prisma.articleTag.findMany({
      where: { slug: { in: a.tagSlugs } },
    });
    const art = await prisma.article.upsert({
      where: { slug: a.slug },
      update: {
        title: a.title,
        excerpt: a.excerpt,
        body: a.body,
        status: "PUBLISHED",
        publishedAt: new Date("2026-06-28"),
        coverImageUrl: a.coverImageUrl,
        authorName: "Ban biên tập House X",
      },
      create: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        body: a.body,
        status: "PUBLISHED",
        publishedAt: new Date("2026-06-28"),
        coverImageUrl: a.coverImageUrl,
        authorName: "Ban biên tập House X",
      },
    });
    await prisma.articleTagLink.deleteMany({ where: { articleId: art.id } });
    await prisma.articleTagLink.createMany({
      data: tags.map((t) => ({ articleId: art.id, tagId: t.id })),
    });
    await prisma.articleProject.deleteMany({ where: { articleId: art.id } });
    if (a.projectId) {
      await prisma.articleProject.create({
        data: { articleId: art.id, projectId: a.projectId },
      });
    }
  }

  console.log("Seed completed.");
  console.log("  NOXH mẫu: /du-an/dta-happy-home-nhon-trach");
  console.log("  NOXH mẫu: /du-an/eco-residence-long-binh-tan");
  console.log("  NOXH mẫu: /du-an/chung-cu-phuc-loc-tho-noxh");
  console.log("  NOXH mẫu: /du-an/dragon-e-home-phu-huu");
  console.log("  NOXH mẫu: /du-an/thu-thiem-green-house-thu-duc");
  console.log("  NOXH mẫu: /du-an/nha-o-xa-hoi-ly-thuong-kiet");
  console.log("  NOXH mẫu: /du-an/noxh-kdc-chang-song-phuoc-tan");
  console.log(`  NOXH mẫu: /du-an/${NL2_PROJECT_SLUG}`);
  console.log(`  NOXH mẫu: /du-an/${NLHP_PROJECT_SLUG}`);
  for (const slug of allNoxhLongAnSlugs()) {
    console.log(`  NOXH Long An: /du-an/${slug}`);
  }
  console.log("  Thương mại: /du-an/solena-green-town-binh-tan");
  console.log(`  Thương mại: /du-an/${THE_PRIVE_PROJECT_SLUG}`);
  console.log("  Thương mại: /du-an/iki-village");
  if (seedDevFixtures) {
    console.log("  Dev fixtures: /du-an/housex-riverside, /du-an/housex-an-cu");
    console.log("  Giỏ hàng mẫu: GET /api/projects/housex-riverside/units");
  }
  console.log("  Tin tức: /tin-tuc");
  console.log("  Admin tin tức: /admin/articles");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
