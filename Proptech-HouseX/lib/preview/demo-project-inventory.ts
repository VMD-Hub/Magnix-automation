import { Prisma, type ProjectUnitStatus } from "@prisma/client";
import type { ProjectInventoryPageData } from "@/lib/data/project-unit";
import type { ProjectInventoryPageFilters } from "@/lib/validation/project-unit";

type DemoUnit = {
  id: string;
  code: string;
  block: string;
  floor: number;
  direction: string;
  view: string;
  area: number;
  bedrooms: number;
  price: number;
  status: ProjectUnitStatus;
  activeBookings?: number;
  unitType: {
    id: string;
    name: string;
    bedrooms: number;
    areaMin: number;
    areaMax: number;
  };
};

const RIVERSIDE_DEMO_UNITS: DemoUnit[] = [
  {
    id: "demo-unit-a-05-01",
    code: "A-05-01",
    block: "A",
    floor: 5,
    direction: "Đông",
    view: "Sông",
    area: 48,
    bedrooms: 1,
    price: 2_650_000_000,
    status: "AVAILABLE",
    activeBookings: 2,
    unitType: { id: "demo-ut-1pn", name: "1PN", bedrooms: 1, areaMin: 45, areaMax: 52 },
  },
  {
    id: "demo-unit-a-05-02",
    code: "A-05-02",
    block: "A",
    floor: 5,
    direction: "Đông Nam",
    view: "Sông",
    area: 50,
    bedrooms: 1,
    price: 2_720_000_000,
    status: "AVAILABLE",
    activeBookings: 1,
    unitType: { id: "demo-ut-1pn", name: "1PN", bedrooms: 1, areaMin: 45, areaMax: 52 },
  },
  {
    id: "demo-unit-a-12-08",
    code: "A-12-08",
    block: "A",
    floor: 12,
    direction: "Tây Nam",
    view: "Thành phố",
    area: 72,
    bedrooms: 2,
    price: 3_950_000_000,
    status: "AVAILABLE",
    unitType: { id: "demo-ut-2pn", name: "2PN", bedrooms: 2, areaMin: 65, areaMax: 78 },
  },
  {
    id: "demo-unit-b-08-03",
    code: "B-08-03",
    block: "B",
    floor: 8,
    direction: "Nam",
    view: "Công viên",
    area: 76,
    bedrooms: 2,
    price: 4_100_000_000,
    status: "AVAILABLE",
    activeBookings: 3,
    unitType: { id: "demo-ut-2pn", name: "2PN", bedrooms: 2, areaMin: 65, areaMax: 78 },
  },
  {
    id: "demo-unit-b-18-01",
    code: "B-18-01",
    block: "B",
    floor: 18,
    direction: "Đông",
    view: "Sông",
    area: 102,
    bedrooms: 3,
    price: 5_850_000_000,
    status: "AVAILABLE",
    unitType: { id: "demo-ut-3pn", name: "3PN", bedrooms: 3, areaMin: 95, areaMax: 110 },
  },
  {
    id: "demo-unit-c-03-05",
    code: "C-03-05",
    block: "C",
    floor: 3,
    direction: "Bắc",
    view: "Nội khu",
    area: 68,
    bedrooms: 2,
    price: 3_720_000_000,
    status: "DEPOSITED",
    unitType: { id: "demo-ut-2pn", name: "2PN", bedrooms: 2, areaMin: 65, areaMax: 78 },
  },
  {
    id: "demo-unit-c-15-02",
    code: "C-15-02",
    block: "C",
    floor: 15,
    direction: "Tây",
    view: "Sông",
    area: 108,
    bedrooms: 3,
    price: 6_200_000_000,
    status: "SOLD",
    unitType: { id: "demo-ut-3pn", name: "3PN", bedrooms: 3, areaMin: 95, areaMax: 110 },
  },
];

function buildSummary(units: DemoUnit[]) {
  const byStatus: Record<ProjectUnitStatus, number> = {
    AVAILABLE: 0,
    HELD: 0,
    BOOKED: 0,
    DEPOSITED: 0,
    SOLD: 0,
    HANDED_OVER: 0,
    LIQUIDATED: 0,
  };
  for (const u of units) {
    byStatus[u.status] += 1;
  }
  return { byStatus, total: units.length };
}

/** Giỏ hàng demo cho preview catalog (không cần Postgres). */
export function getDemoProjectInventory(
  slug: string,
  filters: ProjectInventoryPageFilters = {},
): ProjectInventoryPageData | null {
  if (slug !== "housex-riverside") return null;

  const summary = buildSummary(RIVERSIDE_DEMO_UNITS);
  const filtered = RIVERSIDE_DEMO_UNITS.filter((u) => {
    if (filters.status && u.status !== filters.status) return false;
    if (filters.block && u.block !== filters.block) return false;
    return true;
  });

  return {
    project: {
      id: "demo-project-riverside",
      slug: "housex-riverside",
      name: "HouseX Riverside",
      status: "DANG_BAN",
    },
    items: filtered.map((u) => ({
      id: u.id,
      code: u.code,
      block: u.block,
      floor: u.floor,
      direction: u.direction,
      view: u.view,
      area: u.area,
      bedrooms: u.bedrooms,
      price: new Prisma.Decimal(u.price),
      status: u.status,
      projectId: "demo-project-riverside",
      unitTypeId: u.unitType.id,
      depositBookingId: null,
      depositLockedAt: null,
      deletedAt: null,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
      unitType: u.unitType,
      _count: { bookings: u.activeBookings ?? 0 },
    })),
    summary,
    pagination: {
      page: 1,
      pageSize: 200,
      total: filtered.length,
      totalPages: filtered.length > 0 ? 1 : 0,
    },
    blocks: ["A", "B", "C"],
  };
}
