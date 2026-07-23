/**
 * Submit URLs to IndexNow (Bing + peers).
 *
 * Usage:
 *   npm run seo:indexnow                         # dry-run preset priority
 *   npm run seo:indexnow -- --apply              # POST api.indexnow.org
 *   npm run seo:indexnow -- --apply --preset=hubs
 *   npm run seo:indexnow -- --apply --site=https://timnhaxahoi.com
 *
 * Luôn dùng host production (không POST localhost dù .env có NEXT_PUBLIC_SITE_URL=localhost).
 * Env: INDEXNOW_KEY, INDEXNOW_SITE_URL, INDEXNOW_ENABLED=false
 */
import {
  buildIndexNowPayload,
  indexNowPriorityUrls,
  isLocalSiteUrl,
  resolveIndexNowSiteUrl,
  submitIndexNowUrls,
} from "../lib/seo/indexnow.ts";
import {
  listNoxhProvinceHubsEnabled,
  noxhProvinceHubPath,
} from "../lib/content/noxh-province-registry.ts";

function argValue(flag: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`${flag}=`));
  return hit?.slice(flag.length + 1);
}

function argValues(flag: string): string[] {
  return process.argv
    .filter((a) => a.startsWith(`${flag}=`))
    .map((a) => a.slice(flag.length + 1));
}

function collectUrls(siteUrl: string): string[] {
  const preset = argValue("--preset");
  const explicit = [
    ...argValues("--url"),
    ...process.argv.filter((a) => a.startsWith("http")).map((a) => a),
  ];

  if (explicit.length > 0) return explicit;

  const base = siteUrl.replace(/\/$/, "");
  if (preset === "hubs") {
    return listNoxhProvinceHubsEnabled().map(
      (h) => `${base}${noxhProvinceHubPath(h.slug)}`,
    );
  }
  return indexNowPriorityUrls(base);
}

async function main() {
  const apply = process.argv.includes("--apply");
  const siteUrl = resolveIndexNowSiteUrl(argValue("--site"));
  const urls = collectUrls(siteUrl);
  const payload = buildIndexNowPayload(urls, { siteUrl });

  console.log(
    [
      `mode=${apply ? "APPLY" : "DRY-RUN"}`,
      `site=${siteUrl}`,
      `urls=${payload?.urlList.length ?? 0}`,
      `keyLocation=${payload?.keyLocation ?? "—"}`,
    ].join(" · "),
  );

  if (isLocalSiteUrl(siteUrl)) {
    console.error(
      "Refuse: site vẫn là localhost. Dùng --site=https://timnhaxahoi.com hoặc INDEXNOW_SITE_URL.",
    );
    process.exit(1);
  }

  if (payload) {
    for (const u of payload.urlList) console.log(`  ${u}`);
  }

  if (!apply) {
    console.log("\nDry-run only. Thêm --apply để POST IndexNow.");
    console.log(
      `Trước đó: curl -s ${payload?.keyLocation ?? "keyLocation"} phải in đúng key (không 502).`,
    );
    return;
  }

  const result = await submitIndexNowUrls(urls, { siteUrl });
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
