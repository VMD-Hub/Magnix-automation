/**
 * One-off audit: meta description lengths (SHORT if < 120).
 * Run: npx tsx scripts/audit-meta-descriptions.ts
 */
import { SEO_DESCRIPTION_DEFAULT } from "../lib/content/messaging/brand";
import { NEWS_HUB_SEO_DESCRIPTION } from "../lib/content/article-routes";
import {
  NOXH_HANDBOOK_SEO_DESCRIPTION,
  NOXH_CATALOG_SEO_DESCRIPTION,
} from "../lib/content/messaging/noxh-public";
import { PHONG_THUY_HUB_SEO_DESCRIPTION } from "../lib/content/messaging/phong-thuy-public";
import * as housexTools from "../lib/content/housex-tools-copy";
import { AFFILIATE_VERTICALS } from "../lib/content/affiliate-verticals";
import * as utilitiesTools from "../lib/content/utilities-tools-copy";
import { BAT_TRACH_COPY } from "../lib/content/bat-trach-copy";
import { TEAM_EDITORIAL_PAGE } from "../lib/content/team-editorial-content";
import { PARTNERSHIPS_PAGE } from "../lib/content/partnerships-page-content";
import {
  BRAND_STORY,
  FAQ_HUB,
  EXPERTS_INDEX,
  CONTACT_PAGE,
  PRIVACY_CONTENT,
} from "../lib/content/trust-hub-content";
import { LISTINGS_BROWSE_COPY } from "../lib/content/listings-browse-copy";
import { normalizeSeoDescription } from "../lib/seo/meta-text";

const THRESHOLD = 120;

type Row = { key: string; text: string };

function cpLen(s: string): number {
  return [...s].length;
}

function first90(s: string): string {
  return [...s].slice(0, 90).join("");
}

function add(rows: Row[], key: string, text: unknown) {
  if (typeof text !== "string" || !text.trim()) return;
  rows.push({ key, text: text.trim() });
}

function collectCopyModule(
  mod: Record<string, unknown>,
  prefix: string,
  rows: Row[],
) {
  for (const [name, val] of Object.entries(mod)) {
    if (!name.endsWith("COPY")) continue;
    if (val && typeof val === "object" && "metaDescription" in val) {
      add(rows, `${prefix}${name}.metaDescription`, (val as { metaDescription: string }).metaDescription);
    }
  }
}

const rows: Row[] = [];

add(rows, "SEO_DESCRIPTION_DEFAULT", SEO_DESCRIPTION_DEFAULT);
add(rows, "NEWS_HUB_SEO_DESCRIPTION", NEWS_HUB_SEO_DESCRIPTION);
add(rows, "NOXH_HANDBOOK_SEO_DESCRIPTION", NOXH_HANDBOOK_SEO_DESCRIPTION);
add(rows, "NOXH_CATALOG_SEO_DESCRIPTION", NOXH_CATALOG_SEO_DESCRIPTION);
add(rows, "PHONG_THUY_HUB_SEO_DESCRIPTION", PHONG_THUY_HUB_SEO_DESCRIPTION);

collectCopyModule(housexTools as Record<string, unknown>, "housex-tools.", rows);
collectCopyModule(utilitiesTools as Record<string, unknown>, "utilities-tools.", rows);

add(rows, "BAT_TRACH_COPY.metaDescription", BAT_TRACH_COPY.metaDescription);
add(rows, "TEAM_EDITORIAL_PAGE.metaDescription", TEAM_EDITORIAL_PAGE.metaDescription);
add(rows, "PARTNERSHIPS_PAGE.metaDescription", PARTNERSHIPS_PAGE.metaDescription);

for (const page of [
  ["BRAND_STORY", BRAND_STORY],
  ["FAQ_HUB", FAQ_HUB],
  ["EXPERTS_INDEX", EXPERTS_INDEX],
  ["CONTACT_PAGE", CONTACT_PAGE],
  ["PRIVACY_CONTENT", PRIVACY_CONTENT],
] as const) {
  add(rows, `${page[0]}.metaDescription`, page[1].metaDescription);
}

for (const v of AFFILIATE_VERTICALS) {
  add(rows, `AFFILIATE_VERTICALS.${v.id}.metaDescription`, v.metaDescription);
  for (const s of v.services) {
    add(
      rows,
      `AFFILIATE_VERTICALS.${v.id}.services.${s.slug}.metaDescription`,
      s.metaDescription,
    );
  }
  for (const s of v.showcases ?? []) {
    add(
      rows,
      `AFFILIATE_VERTICALS.${v.id}.showcases.${s.slug}.metaDescription`,
      s.metaDescription,
    );
  }
}

function printRow(row: Row) {
  const len = cpLen(row.text);
  const flag = len < THRESHOLD ? "SHORT" : "ok";
  console.log(`${len} | ${flag} | ${row.key} | ${first90(row.text)}`);
}

const short = rows.filter((r) => cpLen(r.text) < THRESHOLD);
const ok = rows.filter((r) => cpLen(r.text) >= THRESHOLD);

console.log("=== SHORT (< 120) ===");
for (const r of short) printRow(r);

console.log("\n=== OK (>= 120) ===");
for (const r of ok) printRow(r);

console.log("\n=== LISTINGS seoDescriptionSuffix ===");
for (const mode of ["sale", "rent"] as const) {
  const suffix = LISTINGS_BROWSE_COPY[mode].seoDescriptionSuffix;
  const len = cpLen(suffix);
  const flag = len < THRESHOLD ? "SHORT" : "ok";
  console.log(`${len} | ${flag} | LISTINGS_BROWSE_COPY.${mode}.seoDescriptionSuffix | ${first90(suffix)}`);
}

const saleSampleRaw = `Tìm mua nhà đất tại TP.HCM và các tỉnh lân cận. ${LISTINGS_BROWSE_COPY.sale.seoDescriptionSuffix}`;
const saleSample = normalizeSeoDescription(saleSampleRaw);
const saleLen = cpLen(saleSample);
console.log("\n=== SALE HUB sample full description (default browse, no filters) ===");
console.log(`LEN=${saleLen} | FLAG=${saleLen < THRESHOLD ? "SHORT" : "ok"}`);
console.log(saleSample);

console.log(`\n=== SUMMARY: ${short.length} SHORT, ${ok.length} ok (total ${rows.length}) ===`);
