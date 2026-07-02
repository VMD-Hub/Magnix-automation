/**
 * Smoke test SSR sau deploy.
 * Usage: SITE=https://timnhaxahoi.com npm run go-live:smoke
 */
import { randomBytes } from "node:crypto";
import { VINHOMES_PROJECT_SLUGS } from "../lib/seed/vinhomes-projects";
import { VINHOMES_SAIGON_PARK_NAME } from "../lib/preview/vinhomes-saigon-park-mock";
import { VINHOMES_GREEN_PARADISE_NAME } from "../lib/preview/vinhomes-green-paradise-mock";
import { VINHOMES_GRAND_PARK_NAME } from "../lib/preview/vinhomes-grand-park-mock";
import { COMMERCIAL_LANDING_SLUGS } from "../lib/seed/commercial-landings";
import { MONREI_SAIGON_NAME } from "../lib/preview/monrei-saigon-mock";
import { NOBLE_CRYSTAL_RIVERSIDE_NAME } from "../lib/preview/noble-crystal-riverside-mock";
import { GLADIA_HEIGHTS_NAME } from "../lib/preview/gladia-heights-mock";
import { VICTORIA_VILLAGE_NAME } from "../lib/preview/victoria-village-mock";

const site = (process.env.SITE ?? process.env.NEXT_PUBLIC_SITE_URL ?? "")
  .trim()
  .replace(/\/$/, "");

if (!site) {
  console.error("Thiếu SITE — ví dụ: SITE=https://timnhaxahoi.com npm run go-live:smoke");
  process.exit(1);
}

type Case = {
  name: string;
  path: string;
  expect: RegExp | ((body: string, headers: Headers) => boolean);
};

const cases: Case[] = [
  {
    name: "Home 200",
    path: "/",
    expect: /House X|timnhaxahoi/i,
  },
  {
    name: "Mua bán SSR",
    path: "/mua-ban",
    expect: /Mua bán/i,
  },
  {
    name: "Dự án SSR",
    path: "/du-an",
    expect: /Dự án/i,
  },
  {
    name: "robots.txt",
    path: "/robots.txt",
    expect: /Sitemap|User-agent/i,
  },
  {
    name: "sitemap.xml",
    path: "/sitemap.xml",
    expect: /<urlset|<sitemapindex/i,
  },
  {
    name: "Canonical HTTPS",
    path: "/",
    expect: (_body, headers) => {
      const loc = headers.get("location");
      if (loc && loc.startsWith("http://")) return false;
      return true;
    },
  },
  {
    name: "Vinhomes Saigon Park",
    path: `/du-an/${VINHOMES_PROJECT_SLUGS[0]}`,
    expect: new RegExp(VINHOMES_SAIGON_PARK_NAME, "i"),
  },
  {
    name: "Vinhomes Green Paradise",
    path: `/du-an/${VINHOMES_PROJECT_SLUGS[1]}`,
    expect: new RegExp(VINHOMES_GREEN_PARADISE_NAME.slice(0, 24), "i"),
  },
  {
    name: "Vinhomes Grand Park",
    path: `/du-an/${VINHOMES_PROJECT_SLUGS[2]}`,
    expect: new RegExp(VINHOMES_GRAND_PARK_NAME, "i"),
  },
  {
    name: "Monrei Saigon",
    path: `/du-an/${COMMERCIAL_LANDING_SLUGS[0]}`,
    expect: new RegExp(MONREI_SAIGON_NAME, "i"),
  },
  {
    name: "Noble Crystal Riverside",
    path: `/du-an/${COMMERCIAL_LANDING_SLUGS[1]}`,
    expect: new RegExp(NOBLE_CRYSTAL_RIVERSIDE_NAME.slice(0, 20), "i"),
  },
  {
    name: "Gladia Heights",
    path: `/du-an/${COMMERCIAL_LANDING_SLUGS[2]}`,
    expect: new RegExp(GLADIA_HEIGHTS_NAME, "i"),
  },
  {
    name: "Victoria Village",
    path: `/du-an/${COMMERCIAL_LANDING_SLUGS[3]}`,
    expect: new RegExp(VICTORIA_VILLAGE_NAME, "i"),
  },
];

async function main() {
  let failed = 0;

  for (const c of cases) {
    const url = `${site}${c.path}`;
    try {
      const res = await fetch(url, {
        headers: { "user-agent": `housex-smoke/${randomBytes(4).toString("hex")}` },
        redirect: "follow",
      });
      const body = await res.text();
      const ok =
        res.ok &&
        (typeof c.expect === "function"
          ? c.expect(body, res.headers)
          : c.expect.test(body));

      if (ok) {
        console.log(`✔ ${c.name} — ${res.status} ${url}`);
      } else {
        failed += 1;
        console.error(`✖ ${c.name} — ${res.status} ${url}`);
        if (typeof c.expect !== "function") {
          console.error(`  expected: ${c.expect}`);
        }
      }
    } catch (err) {
      failed += 1;
      console.error(`✖ ${c.name} — ${url}`, err);
    }
  }

  console.log("");
  if (failed) {
    console.error(`${failed} check(s) failed.`);
    process.exit(1);
  }
  console.log("Smoke test passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
