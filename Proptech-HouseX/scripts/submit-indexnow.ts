/**
 * Submit URLs to IndexNow (Bing + peers).
 *
 * Usage:
 *   npm run seo:indexnow                         # dry-run preset priority
 *   npm run seo:indexnow -- --apply              # POST api.indexnow.org
 *   npm run seo:indexnow -- --apply --preset hubs
 *   npm run seo:indexnow -- --apply --url=/du-an/nha-o-xa-hoi/tp-ho-chi-minh
 *
 * Env: INDEXNOW_KEY (optional), INDEXNOW_ENABLED=false to skip, NEXT_PUBLIC_SITE_URL
 */
import {
  buildIndexNowPayload,
  indexNowPriorityUrls,
  submitIndexNowUrls,
} from "../lib/seo/indexnow.ts";
import {
  listNoxhProvinceHubsEnabled,
  noxhProvinceHubPath,
} from "../lib/content/noxh-province-registry.ts";
import { getSiteUrl } from "../lib/site-config.ts";

function argValues(flag: string): string[] {
  return process.argv
    .filter((a) => a.startsWith(`${flag}=`))
    .map((a) => a.slice(flag.length + 1));
}

function collectUrls(): string[] {
  const preset = process.argv.find((a) => a.startsWith("--preset="))?.slice(
    "--preset=".length,
  );
  const explicit = [
    ...argValues("--url"),
    ...process.argv.filter((a) => a.startsWith("http")).map((a) => a),
  ];

  if (explicit.length > 0) return explicit;

  const base = getSiteUrl().replace(/\/$/, "");
  if (preset === "hubs") {
    return listNoxhProvinceHubsEnabled().map(
      (h) => `${base}${noxhProvinceHubPath(h.slug)}`,
    );
  }
  return indexNowPriorityUrls(base);
}

async function main() {
  const apply = process.argv.includes("--apply");
  const urls = collectUrls();
  const payload = buildIndexNowPayload(urls);

  console.log(
    [
      `mode=${apply ? "APPLY" : "DRY-RUN"}`,
      `site=${getSiteUrl()}`,
      `urls=${payload?.urlList.length ?? 0}`,
      `keyLocation=${payload?.keyLocation ?? "—"}`,
    ].join(" · "),
  );

  if (payload) {
    for (const u of payload.urlList) console.log(`  ${u}`);
  }

  if (!apply) {
    console.log("\nDry-run only. Thêm --apply để POST IndexNow.");
    console.log("Trước đó: curl -sI keyLocation phải 200 + body = key.");
    return;
  }

  const result = await submitIndexNowUrls(urls);
  if (result.skipped) {
    console.log("Skipped (INDEXNOW_ENABLED=false).");
    return;
  }
  console.log(
    `\nstatus=${result.status} ok=${result.ok} submitted=${result.submitted}`,
  );
  if (result.body) console.log(result.body);
  if (!result.ok) {
    console.error(result.error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
