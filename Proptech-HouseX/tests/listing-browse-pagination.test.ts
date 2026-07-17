import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ListingCardData } from "@/components/listings/listing-card";
import { buildListingBrowsePage } from "@/lib/data/listing-browse";

function card(code: string): ListingCardData {
  return {
    code,
    propertyType: "APARTMENT",
    transactionType: "SALE",
    price: 1_000_000_000,
    province: "Đồng Nai",
    district: "Nhơn Trạch",
  };
}

describe("listing browse pagination", () => {
  it("fills the last partial DB page with the catalog suffix", () => {
    const result = buildListingBrowsePage(
      ["DB-21", "DB-22", "DB-23", "DB-24", "DB-25"].map(card),
      25,
      Array.from({ length: 20 }, (_, index) => card(`CAT-${index + 1}`)),
      2,
      20,
    );

    assert.deepEqual(
      result.items.map((item) => item.code),
      [
        "DB-21",
        "DB-22",
        "DB-23",
        "DB-24",
        "DB-25",
        ...Array.from({ length: 15 }, (_, index) => `CAT-${index + 1}`),
      ],
    );
    assert.deepEqual(result.pagination, {
      page: 2,
      pageSize: 20,
      total: 45,
      totalPages: 3,
    });
  });

  it("continues at the correct catalog offset after DB rows", () => {
    const result = buildListingBrowsePage(
      [],
      25,
      Array.from({ length: 30 }, (_, index) => card(`CAT-${index + 1}`)),
      3,
      20,
    );

    assert.deepEqual(
      result.items.map((item) => item.code),
      Array.from({ length: 15 }, (_, index) => `CAT-${index + 16}`),
    );
    assert.equal(result.pagination.total, 55);
    assert.equal(result.pagination.totalPages, 3);
  });

  it("keeps empty-result pagination at one page", () => {
    const result = buildListingBrowsePage([], 0, [], 4, 20);

    assert.deepEqual(result.items, []);
    assert.deepEqual(result.pagination, {
      page: 4,
      pageSize: 20,
      total: 0,
      totalPages: 1,
    });
    assert.equal(result.isCatalog, undefined);
  });
});
