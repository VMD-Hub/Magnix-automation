import { test } from "node:test";
import assert from "node:assert/strict";
import { buildProjectUnitListWhere } from "../lib/data/project-unit";

const projectId = "00000000-0000-4000-8000-000000000001";

test("buildProjectUnitListWhere: mặc định lọc project + chưa xoá", () => {
  const where = buildProjectUnitListWhere(projectId, {
    page: 1,
    pageSize: 50,
  });
  assert.equal(where.projectId, projectId);
  assert.equal(where.deletedAt, null);
  assert.equal(where.status, undefined);
});

test("buildProjectUnitListWhere: lọc status, block, giá, tầng", () => {
  const where = buildProjectUnitListWhere(projectId, {
    status: "AVAILABLE",
    block: "A",
    minPrice: 2_000_000_000,
    maxPrice: 4_000_000_000,
    minFloor: 5,
    maxFloor: 10,
    unitTypeId: "00000000-0000-4000-8000-000000000099",
    page: 1,
    pageSize: 20,
  });

  assert.equal(where.status, "AVAILABLE");
  assert.equal(where.block, "A");
  assert.deepEqual(where.floor, { gte: 5, lte: 10 });
  assert.deepEqual(where.price, {
    gte: 2_000_000_000,
    lte: 4_000_000_000,
  });
  assert.equal(where.unitTypeId, "00000000-0000-4000-8000-000000000099");
});
