import type { PrismaClient } from "@prisma/client";
import {
  buildDtaHappyHomeOverviewData,
  DTA_DEVELOPER_TAX_CODE,
  DTA_HAPPY_HOME_SLUG,
  DTA_PROJECT_DESCRIPTION,
} from "@/lib/content/dta-happy-home-landing";
import { DTA_HAPPY_HOME_IMAGES } from "@/lib/content/dta-happy-home-images";

/** MST stub cũ trong seed trước đây — migrate sang MST thật khi reseed. */
const DTA_DEVELOPER_TAX_CODE_LEGACY = "0314567890";

const DTA_SEO_TITLE = "DTA Happy Home Nhơn Trạch — Nhà ở xã hội từ 448 triệu";
const DTA_SEO_DESC =
  "Nhà ở xã hội Happy Home DTA Nhơn Trạch: 2.192 căn, 16 block 5 tầng, giá 448–700 triệu/căn. Nguyễn Văn Cừ, Phước An. Hỗ trợ vay 70%.";

const DTA_DEVELOPER_NAME = "Công ty Cổ phần Đệ Tam (DTA)";

async function upsertDtaDeveloper(prisma: PrismaClient) {
  const logoUrl = DTA_HAPPY_HOME_IMAGES.developerLogo;
  const legacy = await prisma.developer.findUnique({
    where: { taxCode: DTA_DEVELOPER_TAX_CODE_LEGACY },
  });
  const correct = await prisma.developer.findUnique({
    where: { taxCode: DTA_DEVELOPER_TAX_CODE },
  });

  if (legacy && !correct) {
    return prisma.developer.update({
      where: { id: legacy.id },
      data: {
        taxCode: DTA_DEVELOPER_TAX_CODE,
        name: DTA_DEVELOPER_NAME,
        verified: true,
        logoUrl,
      },
    });
  }

  if (legacy && correct && legacy.id !== correct.id) {
    await prisma.project.updateMany({
      where: { developerId: legacy.id },
      data: { developerId: correct.id },
    });
    await prisma.developer.delete({ where: { id: legacy.id } });
    return prisma.developer.update({
      where: { id: correct.id },
      data: {
        name: DTA_DEVELOPER_NAME,
        verified: true,
        logoUrl,
      },
    });
  }

  return prisma.developer.upsert({
    where: { taxCode: DTA_DEVELOPER_TAX_CODE },
    update: {
      name: DTA_DEVELOPER_NAME,
      verified: true,
      logoUrl,
    },
    create: {
      name: DTA_DEVELOPER_NAME,
      taxCode: DTA_DEVELOPER_TAX_CODE,
      verified: true,
      logoUrl,
    },
  });
}

/**
 * Upsert developer + project DTA Happy Home vào Postgres.
 *
 * Nguồn sự thật DUY NHẤT cho landing DTA là code (`lib/content/dta-happy-home-*`).
 * Hàm này được dùng chung bởi `prisma/seed.ts` VÀ `scripts/seed-dta-happy-home.ts`
 * để hai nơi không bao giờ lệch nhau — nhánh `update` LUÔN ghi đè landing/ảnh mới nhất
 * lên bản ghi DB (kể cả khi DB bị khôi phục từ backup cũ).
 */
export async function seedDtaHappyHome(prisma: PrismaClient) {
  const dtaDeveloper = await upsertDtaDeveloper(prisma);

  const dtaOverview = buildDtaHappyHomeOverviewData();

  const project = await prisma.project.upsert({
    where: { slug: DTA_HAPPY_HOME_SLUG },
    update: {
      developerId: dtaDeveloper.id,
      status: "DANG_BAN",
      projectType: "NHA_O_XA_HOI",
      overviewData: dtaOverview as object,
      description: DTA_PROJECT_DESCRIPTION,
      seoTitle: DTA_SEO_TITLE,
      seoDesc: DTA_SEO_DESC,
      lat: 10.697,
      lng: 106.934,
    },
    create: {
      developerId: dtaDeveloper.id,
      slug: DTA_HAPPY_HOME_SLUG,
      name: "DTA Happy Home Nhơn Trạch",
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
      handoverDate: new Date("2026-03-31"),
      overviewData: dtaOverview as object,
      description:
        "DTA Happy Home là dự án nhà ở xã hội do Công ty Cổ phần Đệ Tam triển khai tại Khu đô thị DTA City Nhơn Trạch, mặt tiền đường Nguyễn Văn Cừ, xã Phước An. 16 block cao 5 tầng, 2.192 căn, 30–52 m². Giá 448–700 triệu/căn; 3 phương thức thanh toán; hỗ trợ vay tới 70%.",
      seoTitle: DTA_SEO_TITLE,
      seoDesc: DTA_SEO_DESC,
      unitTypes: {
        create: [
          {
            name: "Căn 1 phòng ngủ",
            areaMin: 30,
            areaMax: 35,
            bedrooms: 1,
            priceFrom: 448_000_000,
          },
          {
            name: "Căn 2 phòng ngủ (compact)",
            areaMin: 32,
            areaMax: 35,
            bedrooms: 2,
            priceFrom: 520_000_000,
          },
          {
            name: "Căn 2 phòng ngủ",
            areaMin: 48,
            areaMax: 52,
            bedrooms: 2,
            priceFrom: 700_000_000,
          },
        ],
      },
      legalDocs: {
        create: [
          {
            docType: "giay_chung_nhan_dau_tu",
            status: "da_co",
            issuedDate: new Date("2007-08-06"),
          },
          {
            docType: "quy_hoach_1_500",
            status: "da_co",
            issuedDate: new Date("2006-12-19"),
          },
          {
            docType: "chap_thuan_noxh",
            status: "da_co",
            issuedDate: new Date("2014-10-14"),
          },
          {
            docType: "dieu_kien_kinh_doanh_bdshtl",
            status: "da_co",
            issuedDate: new Date("2025-12-31"),
          },
        ],
      },
    },
  });

  return { developer: dtaDeveloper, project };
}
