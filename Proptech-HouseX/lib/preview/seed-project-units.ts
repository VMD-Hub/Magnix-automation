import type { PrismaClient, ProjectUnitStatus } from "@prisma/client";

type UnitSeed = {
  code: string;
  block: string;
  floor: number;
  direction: string;
  view: string;
  area: number;
  bedrooms: number;
  price: number;
  status: ProjectUnitStatus;
  unitTypeName: string;
  activeBookings?: number;
};

const RIVERSIDE_UNITS: UnitSeed[] = [
  {
    code: "A-05-01",
    block: "A",
    floor: 5,
    direction: "Đông",
    view: "Sông",
    area: 48,
    bedrooms: 1,
    price: 2_650_000_000,
    status: "AVAILABLE",
    unitTypeName: "1PN",
    activeBookings: 2,
  },
  {
    code: "A-05-02",
    block: "A",
    floor: 5,
    direction: "Đông Nam",
    view: "Sông",
    area: 50,
    bedrooms: 1,
    price: 2_720_000_000,
    status: "AVAILABLE",
    unitTypeName: "1PN",
    activeBookings: 1,
  },
  {
    code: "A-12-08",
    block: "A",
    floor: 12,
    direction: "Tây Nam",
    view: "Thành phố",
    area: 72,
    bedrooms: 2,
    price: 3_950_000_000,
    status: "AVAILABLE",
    unitTypeName: "2PN",
    activeBookings: 0,
  },
  {
    code: "B-08-03",
    block: "B",
    floor: 8,
    direction: "Nam",
    view: "Công viên",
    area: 76,
    bedrooms: 2,
    price: 4_100_000_000,
    status: "AVAILABLE",
    unitTypeName: "2PN",
    activeBookings: 3,
  },
  {
    code: "B-18-01",
    block: "B",
    floor: 18,
    direction: "Đông",
    view: "Sông",
    area: 102,
    bedrooms: 3,
    price: 5_850_000_000,
    status: "AVAILABLE",
    unitTypeName: "3PN",
  },
  {
    code: "C-03-05",
    block: "C",
    floor: 3,
    direction: "Bắc",
    view: "Nội khu",
    area: 68,
    bedrooms: 2,
    price: 3_720_000_000,
    status: "DEPOSITED",
    unitTypeName: "2PN",
  },
  {
    code: "C-15-02",
    block: "C",
    floor: 15,
    direction: "Tây",
    view: "Sông",
    area: 108,
    bedrooms: 3,
    price: 6_200_000_000,
    status: "SOLD",
    unitTypeName: "3PN",
  },
];

/** Nạp giỏ hàng mẫu cho HouseX Riverside (Phase A demo bảng hàng). */
export async function seedHousexRiversideUnits(
  db: PrismaClient,
  projectId: string,
) {
  const unitTypes = await db.projectUnitType.findMany({
    where: { projectId },
    select: { id: true, name: true },
  });
  if (unitTypes.length === 0) return;

  const typeByName = new Map(unitTypes.map((t) => [t.name, t.id]));

  for (const u of RIVERSIDE_UNITS) {
    const unitTypeId = typeByName.get(u.unitTypeName);
    if (!unitTypeId) continue;

    await db.projectUnit.upsert({
      where: {
        projectId_code: { projectId, code: u.code },
      },
      update: {
        unitTypeId,
        block: u.block,
        floor: u.floor,
        direction: u.direction,
        view: u.view,
        area: u.area,
        bedrooms: u.bedrooms,
        price: u.price,
        status: u.status,
        deletedAt: null,
      },
      create: {
        projectId,
        unitTypeId,
        code: u.code,
        block: u.block,
        floor: u.floor,
        direction: u.direction,
        view: u.view,
        area: u.area,
        bedrooms: u.bedrooms,
        price: u.price,
        status: u.status,
      },
    });
  }
}
