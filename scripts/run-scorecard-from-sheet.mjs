#!/usr/bin/env node
/**
 * Dry-run Mạch 5: đọc Sheet pending rows → score.mjs → in kết quả.
 * Usage: node scripts/run-scorecard-from-sheet.mjs
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scorePostPublish } from "../tools/content-scorecard/lib/score-core.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, "n8n-workflows/.env");
  const map = {};
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
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
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
  if (!data.access_token) throw new Error(JSON.stringify(data));
  return data.access_token;
}

const PLATFORM_ALIASES = {
  tiktok: "tiktok",
  tt: "tiktok",
  fb_reels: "fb_reels",
  reels: "fb_reels",
  fb_page: "fb_page",
  page: "fb_page",
  youtube_shorts: "youtube_shorts",
  shorts: "youtube_shorts",
};

function num(v) {
  if (v == null || v === "") return null;
  const n = Number(String(v).replace(/,/g, "").replace("%", ""));
  if (Number.isNaN(n)) return null;
  if (String(v).includes("%") && n > 1) return n / 100;
  return n;
}

function rowToInput(headers, row) {
  const obj = {};
  headers.forEach((h, i) => {
    obj[h] = row[i];
  });
  const platform =
    PLATFORM_ALIASES[String(obj.platform || "").trim().toLowerCase()] ||
    String(obj.platform || "").trim();
  const metrics = {};
  for (const key of [
    "reach",
    "views",
    "completion_rate",
    "rewatch_rate",
    "save_rate",
    "share_rate",
    "early_swipe_away_3s",
    "keyword_comments",
    "dm_opt_in",
    "form_submit",
    "warm_lead_rate",
  ]) {
    const val = num(obj[key]);
    if (val != null) metrics[key] = val;
  }
  if (metrics.views && !metrics.reach) metrics.reach = metrics.views;
  return {
    post_id: String(obj.post_id || "").trim(),
    platform,
    segment: String(obj.segment || "general_inbound").trim(),
    metrics,
    scorecard_status: String(obj.scorecard_status || "").trim(),
  };
}

async function main() {
  const env = loadEnv();
  const sheetId = env.GOOGLE_SHEET_CONTENT_METRICS_ID;
  const tab = env.GOOGLE_SHEET_CONTENT_METRICS_TAB || "content_metrics";
  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(root, "n8n-workflows/credentials/google-service-account.json");
  const sa = JSON.parse(fs.readFileSync(saPath, "utf8"));
  const token = await getAccessToken(sa);
  const signals = JSON.parse(
    fs.readFileSync(
      path.join(root, "tools/content-scorecard/platform-signals.json"),
      "utf8"
    )
  );

  const range = encodeURIComponent(`${tab}!A1:Z100`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  const headers = (data.values?.[0] || []).map((h) =>
    String(h).trim().toLowerCase()
  );
  const rows = (data.values || []).slice(1);
  const skip = new Set(["done", "analyzed", "skip"]);
  const results = [];

  for (const row of rows) {
    const input = rowToInput(headers, row);
    if (!input.post_id || !input.platform) continue;
    if (skip.has(input.scorecard_status.toLowerCase())) continue;

    const scorecard = scorePostPublish(input, input.platform, signals);
    results.push({ input, scorecard });
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        mode: "dry_run_mach5",
        pending_scored: results.length,
        results: results.map((r) => ({
          post_id: r.input.post_id,
          platform: r.input.platform,
          verdict: r.scorecard.verdict,
          performance_score: r.scorecard.performance_score,
          ivi_pct: r.scorecard.ivi_pct,
          next_action:
            r.scorecard.verdict === "hub_candidate"
              ? "repurpose_hub"
              : r.scorecard.verdict,
          recommendations: r.scorecard.recommendations.slice(0, 2),
        })),
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message }, null, 2));
  process.exit(1);
});
