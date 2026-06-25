#!/usr/bin/env node
/**
 * Full audit of project_config tab for Agent 1 social listening.
 * Usage: node scripts/verify-project-config-listening.mjs
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, "n8n-workflows/.env");
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

async function getAccessToken(sa, scopes) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: scopes.join(" "),
      aud: sa.token_uri,
      iat: now,
      exp: now + 3600,
    })
  );
  const unsigned = `${header}.${claim}`;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsigned);
  const signature = base64url(sign.sign(sa.private_key));
  const jwt = `${unsigned}.${signature}`;

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

function parseRows(values) {
  if (!values?.length) return [];
  const headers = values[0].map((h) => String(h ?? "").trim().toLowerCase());
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const cells = values[i];
    if (!cells || !cells.some((c) => String(c ?? "").trim())) continue;
    const row = {};
    headers.forEach((key, j) => {
      if (key) row[key] = cells[j] ?? "";
    });
    if (row.profile_url && !row.url) row.url = row.profile_url;
    if (row.urls && !row.url) row.url = row.urls;
    row._sheetRow = i + 1;
    out.push(row);
  }
  return out;
}

function isActive(row) {
  const active = String(row.active ?? "true").trim().toLowerCase();
  return !(active === "false" || active === "0" || active === "no");
}

function splitUrls(row) {
  const urlField = row.url || row.urls || row.profile_url || "";
  return String(urlField)
    .split(/[\n,;]+/)
    .map((u) => u.trim())
    .filter(Boolean);
}

function validateUrl(u) {
  const issues = [];
  if (!u) issues.push("empty");
  if (u.includes("/video/") || u.includes("/photo/")) issues.push("use profile URL not video/photo");
  if (u.includes("?_r=") || u.includes("&_r=")) issues.push("strip query ?_r=1");
  if (!/^https?:\/\//i.test(u) && u.startsWith("@")) {
    issues.push("missing https:// — use full profile URL");
  }
  if (!/tiktok\.com\/@/i.test(u) && rowPlatformIsTiktok(u)) {
    issues.push("expected tiktok.com/@handle");
  }
  return issues;
}

function rowPlatformIsTiktok() {
  return true;
}

function expandSplitItems(rows) {
  const items = [];
  for (const row of rows) {
    if (!isActive(row)) continue;
    const platform = String(row.platform || "tiktok").trim().toLowerCase();
    for (const post_url of splitUrls(row)) {
      items.push({
        project_id: row.project_id || `(row ${row._sheetRow})`,
        post_url,
        platform,
        segment: String(row.segment || "").trim(),
        notes: String(row.notes || "").slice(0, 80),
        sheetRow: row._sheetRow,
      });
    }
  }
  return items;
}

async function main() {
  const env = loadEnv();
  const sheetId = env.GOOGLE_SHEET_CONTENT_METRICS_ID;
  const tab = env.GOOGLE_SHEET_PROJECT_CONFIG_TAB || "project_config";
  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(root, "n8n-workflows/credentials/google-service-account.json");

  if (!sheetId) {
    console.error("GOOGLE_SHEET_CONTENT_METRICS_ID missing in n8n-workflows/.env");
    process.exit(1);
  }

  const sa = JSON.parse(fs.readFileSync(saPath, "utf8"));
  const token = await getAccessToken(sa, [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ]);
  const headers = { Authorization: `Bearer ${token}` };
  const range = encodeURIComponent(`${tab}!A:F`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
    { headers }
  );
  const data = await res.json();
  if (data.error) {
    console.error(JSON.stringify({ ok: false, error: data.error }, null, 2));
    process.exit(1);
  }

  const rows = parseRows(data.values);
  const activeRows = rows.filter(isActive);
  const inactiveRows = rows.filter((r) => !isActive(r));
  const splitItems = expandSplitItems(rows);

  const rowIssues = [];
  for (const row of rows) {
    const urls = splitUrls(row);
    if (isActive(row) && !urls.length) {
      rowIssues.push({
        sheetRow: row._sheetRow,
        project_id: row.project_id,
        issue: "active=true but url empty",
      });
    }
    for (const u of urls) {
      const urlIssues = validateUrl(u);
      if (urlIssues.length) {
        rowIssues.push({
          sheetRow: row._sheetRow,
          project_id: row.project_id,
          url: u,
          issues: urlIssues,
        });
      }
    }
  }

  const report = {
    ok: rowIssues.length === 0 && splitItems.length > 0,
    sheet: sheetId,
    tab,
    summary: {
      totalDataRows: rows.length,
      activeRows: activeRows.length,
      inactiveRows: inactiveRows.length,
      splitUrlItems: splitItems.length,
    },
    activeChannels: activeRows.map((r) => ({
      sheetRow: r._sheetRow,
      project_id: r.project_id,
      platform: r.platform || "tiktok",
      segment: r.segment,
      urlCount: splitUrls(r).length,
      urls: splitUrls(r),
    })),
    inactiveChannels: inactiveRows.map((r) => ({
      sheetRow: r._sheetRow,
      project_id: r.project_id,
      urls: splitUrls(r),
    })),
    splitPreview: splitItems,
    issues: rowIssues,
    n8nExpectation: `Manual run → Split URLs from Config should output ${splitItems.length} item(s)`,
  };

  console.log(JSON.stringify(report, null, 2));
  process.exit(report.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message }, null, 2));
  process.exit(1);
});
