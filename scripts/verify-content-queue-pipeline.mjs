#!/usr/bin/env node
/**
 * Test ghi tab content_queue + Apify clockworks 1 profile.
 * Usage: node scripts/verify-content-queue-pipeline.mjs
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, "n8n-workflows/.env");
const saPath = path.join(root, "n8n-workflows/credentials/google-service-account.json");
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(root, "n8n-workflows/magnix-public-config.json"), "utf8")
);

function loadEnv() {
  const map = {};
  if (!fs.existsSync(envPath)) return map;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i > 0) map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return map;
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: sa.token_uri,
      iat: now,
      exp: now + 3600,
    })
  );
  const unsigned = `${header}.${claim}`;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsigned);
  const jwt = `${unsigned}.${base64url(sign.sign(sa.private_key))}`;
  const res = await fetch(sa.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function main() {
  const env = loadEnv();
  const report = { ok: true, checks: [] };
  const pass = (n, d) => report.checks.push({ name: n, status: "pass", detail: d });
  const fail = (n, d) => {
    report.ok = false;
    report.checks.push({ name: n, status: "fail", detail: d });
  };

  const sheetId = PUBLIC.google_sheet_id;
  const tab = PUBLIC.content_queue_tab;
  const sa = JSON.parse(fs.readFileSync(saPath, "utf8"));
  const token = await getAccessToken(sa);

  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties.title`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const meta = await metaRes.json();
  const tabs = meta.sheets?.map((s) => s.properties?.title) || [];
  if (tabs.includes(tab)) pass("content_queue_tab", tab);
  else fail("content_queue_tab", `Missing tab "${tab}". Tabs: ${tabs.join(", ")}`);

  const readRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`${tab}!A1:O3`)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const read = await readRes.json();
  const rows = read.values || [];
  pass("content_queue_rows", `header + ${Math.max(0, rows.length - 1)} data row(s)`);

  // Apify clockworks
  const apifyToken = env.APIFY_TOKEN;
  const runUrl =
    env.APIFY_RUN_URL ||
    "https://api.apify.com/v2/acts/clockworks~tiktok-scraper/run-sync-get-dataset-items";
  if (!apifyToken) fail("apify_token", "missing");
  else {
    const apRes = await fetch(`${runUrl}?token=${encodeURIComponent(apifyToken)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profiles: ["kimoanhland"],
        resultsPerPage: 2,
        shouldDownloadVideos: false,
      }),
    });
    const posts = await apRes.json();
    const arr = Array.isArray(posts) ? posts : [posts];
    const good = arr.filter((p) => p?.text && !p?.error && !p?.noResults);
    if (good.length) pass("apify_clockworks", `${good.length} post(s), text="${good[0].text.slice(0, 50)}..."`);
    else fail("apify_clockworks", JSON.stringify(arr[0] || arr).slice(0, 200));
  }

  // Test append (then user can delete diag row)
  const nk = `apify:tiktok:verify_${Date.now()}`;
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`${tab}!A:O`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        values: [
          [
            nk,
            "verify_post",
            "tiktok",
            "https://www.tiktok.com/@kimoanhland",
            "",
            "VERIFY ROW — xóa sau khi test",
            "unclassified",
            99,
            "qualified",
            "unknown",
            "qualified",
            new Date().toISOString(),
            "verify_script",
            "test",
            "{}",
          ],
        ],
      }),
    }
  );
  const append = await appendRes.json();
  if (appendRes.ok) pass("sheet_append_test", `Wrote row ${nk} — refresh Sheet`);
  else fail("sheet_append_test", JSON.stringify(append).slice(0, 300));

  console.log(JSON.stringify(report, null, 2));
  process.exit(report.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message }, null, 2));
  process.exit(1);
});
