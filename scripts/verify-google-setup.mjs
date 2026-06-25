#!/usr/bin/env node
/**
 * Verify Magnix Google Sheet + Drive setup (service account access).
 * Usage: node scripts/verify-google-setup.mjs
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
  if (!data.access_token) {
    throw new Error(`Token failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

const REQUIRED_HEADERS = [
  "post_id",
  "platform",
  "segment",
  "reach",
  "completion_rate",
  "keyword_comments",
  "dm_opt_in",
  "scorecard_status",
];

const OUTPUT_HEADERS = [
  "analyzed_at",
  "verdict",
  "performance_score",
  "ivi_pct",
  "next_action",
];

const PROJECT_CONFIG_HEADERS = ["url", "platform", "active"];
const PROJECT_CONFIG_OPTIONAL = ["project_id", "segment", "notes"];

async function verifySheetTab(headers, sheetId, tabName, checkFn) {
  const range = encodeURIComponent(`${tabName}!1:3`);
  const valRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
    { headers }
  );
  const val = await valRes.json();
  if (val.error) {
    checkFn.fail("sheet_read", `${tabName}: ${val.error.message}`);
    return;
  }
  const headerRow = (val.values?.[0] || []).map((h) => String(h).trim().toLowerCase());
  const hasUrl =
    headerRow.includes("url") ||
    headerRow.includes("urls") ||
    headerRow.includes("profile_url");
  if (!hasUrl) {
    checkFn.fail(
      "project_config_headers",
      `Tab "${tabName}" missing url (or urls / profile_url)`
    );
  } else {
    const missing = PROJECT_CONFIG_HEADERS.filter(
      (h) => h !== "url" && !headerRow.includes(h)
    );
    if (missing.length) {
      checkFn.warn(
        "project_config_headers",
        `Tab "${tabName}" missing recommended: ${missing.join(", ")}`
      );
    } else {
      checkFn.pass("project_config_headers", `url, platform, active`);
    }
  }
  const dataRow = val.values?.[1];
  const urlIdx = headerRow.findIndex((h) =>
    ["url", "urls", "profile_url"].includes(h)
  );
  const urlVal = urlIdx >= 0 && dataRow ? dataRow[urlIdx] : dataRow?.[0];
  if (!dataRow || !String(urlVal || "").trim()) {
    checkFn.warn(
      "project_config_data_row",
      `Tab "${tabName}" row 2 empty — add URL for Agent 1 Manual run`
    );
  } else {
    const rowObj = {};
    headerRow.forEach((h, i) => {
      rowObj[h] = dataRow[i];
    });
    checkFn.pass(
      "project_config_data_row",
      `url=${String(urlVal).slice(0, 60)}..., platform=${rowObj.platform || "tiktok"}`
    );
  }
}

async function main() {
  const env = loadEnv();
  const sheetId = env.GOOGLE_SHEET_DATABASE_ID || env.GOOGLE_SHEET_CONTENT_METRICS_ID;
  const tab = env.GOOGLE_SHEET_CONTENT_METRICS_TAB || "content_metrics";
  const projectTab = env.GOOGLE_SHEET_PROJECT_CONFIG_TAB || "project_config";
  const folderId = env.GOOGLE_DRIVE_ARCHIVE_FOLDER_ID || env.GOOGLE_DRIVE_FOLDER_ID;
  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(root, "n8n-workflows/credentials/google-service-account.json");

  const report = { ok: true, checks: [] };

  function pass(name, detail) {
    report.checks.push({ name, status: "pass", detail });
  }
  function fail(name, detail) {
    report.ok = false;
    report.checks.push({ name, status: "fail", detail });
  }
  function warn(name, detail) {
    report.checks.push({ name, status: "warn", detail });
  }

  if (!sheetId) fail("env_sheet_id", "GOOGLE_SHEET_DATABASE_ID missing");
  else pass("env_sheet_id", sheetId);

  if (!folderId) fail("env_folder_id", "GOOGLE_DRIVE_ARCHIVE_FOLDER_ID missing");
  else pass("env_folder_id", folderId);

  if (!fs.existsSync(saPath)) {
    fail("service_account_file", `Not found: ${saPath}`);
    console.log(JSON.stringify(report, null, 2));
    process.exit(1);
  }

  const sa = JSON.parse(fs.readFileSync(saPath, "utf8"));
  pass("service_account_email", sa.client_email);

  let token;
  try {
    token = await getAccessToken(sa, [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ]);
    pass("google_auth", "Service account token OK");
  } catch (e) {
    fail("google_auth", e.message);
    console.log(JSON.stringify(report, null, 2));
    process.exit(1);
  }

  const headers = { Authorization: `Bearer ${token}` };

  // Drive folder
  try {
    const driveRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${folderId}?fields=id,name,mimeType,capabilities`,
      { headers }
    );
    const drive = await driveRes.json();
    if (drive.error) {
      fail(
        "drive_folder_access",
        `${drive.error.message} — share folder with ${sa.client_email} (Editor)`
      );
    } else {
      pass("drive_folder_access", `${drive.name} (${drive.id})`);
    }
  } catch (e) {
    fail("drive_folder_access", e.message);
  }

  // Sheet metadata — tab names
  try {
    const metaRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=properties.title,sheets.properties`,
      { headers }
    );
    const meta = await metaRes.json();
    if (meta.error) {
      fail(
        "sheet_access",
        `${meta.error.message} — share Sheet with ${sa.client_email} (Editor)`
      );
    } else {
      pass("sheet_access", meta.properties?.title || sheetId);
      const tabs = (meta.sheets || []).map((s) => s.properties?.title);
      if (tabs.includes(tab)) {
        pass("sheet_tab_content_metrics", `Tab "${tab}" exists`);
      } else {
        fail(
          "sheet_tab_content_metrics",
          `Tab "${tab}" not found. Available: ${tabs.join(", ")}`
        );
      }
      if (tabs.includes(projectTab)) {
        pass("sheet_tab_project_config", `Tab "${projectTab}" exists`);
      } else {
        fail(
          "sheet_tab_project_config",
          `Tab "${projectTab}" not found — create per n8n-workflows/PROJECT_CONFIG_SETUP.md. Available: ${tabs.join(", ")}`
        );
      }
    }
  } catch (e) {
    fail("sheet_access", e.message);
  }

  // Header row
  try {
    const range = encodeURIComponent(`${tab}!1:2`);
    const valRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
      { headers }
    );
    const val = await valRes.json();
    if (val.error) {
      fail("sheet_read_content_metrics", val.error.message);
    } else {
      const headerRow = (val.values?.[0] || []).map((h) =>
        String(h).trim().toLowerCase()
      );
      const missing = REQUIRED_HEADERS.filter((h) => !headerRow.includes(h));
      if (missing.length) {
        fail("sheet_headers_required", `Missing: ${missing.join(", ")}`);
      } else {
        pass("sheet_headers_required", REQUIRED_HEADERS.join(", "));
      }

      const missingOut = OUTPUT_HEADERS.filter((h) => !headerRow.includes(h));
      if (missingOut.length) {
        warn(
          "sheet_headers_output",
          `Missing output cols (workflow Update node needs them): ${missingOut.join(", ")}`
        );
      } else {
        pass("sheet_headers_output", OUTPUT_HEADERS.join(", "));
      }

      const dataRow = val.values?.[1];
      if (!dataRow || !String(dataRow[0] || "").trim()) {
        warn("sheet_test_row", "Row 2 empty — add test row with post_id for Manual run");
      } else {
        const rowObj = {};
        headerRow.forEach((h, i) => {
          rowObj[h] = dataRow[i];
        });
        if (!rowObj.post_id || !rowObj.platform) {
          fail("sheet_test_row", "Row 2 missing post_id or platform");
        } else if (
          rowObj.scorecard_status &&
          ["done", "analyzed"].includes(String(rowObj.scorecard_status).toLowerCase())
        ) {
          warn(
            "sheet_test_row",
            `Row 2 post_id=${rowObj.post_id} already scorecard_status=${rowObj.scorecard_status} — workflow will skip`
          );
        } else {
          pass(
            "sheet_test_row",
            `post_id=${rowObj.post_id}, platform=${rowObj.platform}, status=${rowObj.scorecard_status || "pending"}`
          );
        }
      }
    }
  } catch (e) {
    fail("sheet_read_content_metrics", e.message);
  }

  // project_config tab (Agent 1)
  const metaTabs =
    report.checks.find((c) => c.name === "sheet_tab_project_config")?.status ===
    "pass";
  if (metaTabs) {
    try {
      await verifySheetTab(headers, sheetId, projectTab, { pass, fail, warn });
    } catch (e) {
      fail("sheet_read_project_config", e.message);
    }
  }

  console.log(JSON.stringify(report, null, 2));
  process.exit(report.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message }, null, 2));
  process.exit(1);
});
