import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NOXH_TAG_CHINH_SACH,
  NOXH_TAG_THAM_DINH_VAY,
  resolveArticleTagDisplayName,
  resolveCanonicalArticleTag,
} from "@/lib/content/articles/noxh-handbook-tags";

describe("canonical article tag display names", () => {
  it("maps journey slugs to Vietnamese labels with diacritics", () => {
    assert.equal(
      resolveArticleTagDisplayName("chinh-sach-ho-so-noxh"),
      NOXH_TAG_CHINH_SACH.name,
    );
    assert.equal(
      resolveArticleTagDisplayName("tham-dinh-vay-noxh"),
      NOXH_TAG_THAM_DINH_VAY.name,
    );
    assert.notEqual(
      resolveArticleTagDisplayName("chinh-sach-ho-so-noxh"),
      "Chinh Sach Ho So Noxh",
    );
  });

  it("resolves short aliases to canonical slugs", () => {
    assert.deepEqual(resolveCanonicalArticleTag("phap-ly"), {
      slug: NOXH_TAG_CHINH_SACH.slug,
      name: NOXH_TAG_CHINH_SACH.name,
    });
    assert.deepEqual(resolveCanonicalArticleTag("tham-dinh-vay"), {
      slug: NOXH_TAG_THAM_DINH_VAY.slug,
      name: NOXH_TAG_THAM_DINH_VAY.name,
    });
  });
});
