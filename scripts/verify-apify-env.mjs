#!/usr/bin/env node
/**
 * Verify APIFY_TOKEN + APIFY_RUN_URL in n8n-workflows/.env (masked output only).
 * Usage: node scripts/verify-apify-env.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", "n8n-workflows", ".env");

function loadEnv(filePath) {
  const map = {};
  if (!fs.existsSync(filePath)) return map;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    let v = t.slice(eq + 1).trim();
    const hash = v.indexOf("#");
    if (hash >= 0) v = v.slice(0, hash).trim();
    map[t.slice(0, eq).trim()] = v;
  }
  return map;
}

function maskSecret(value) {
  if (!value) return "(empty)";
  if (value.length <= 16) return "***";
  return `${value.slice(0, 12)}...${value.slice(-4)}`;
}

async function main() {
  const env = loadEnv(envPath);
  const token = env.APIFY_TOKEN || "";
  const runUrl = env.APIFY_RUN_URL || "";
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

  if (!token) fail("apify_token_set", "APIFY_TOKEN missing in n8n-workflows/.env");
  else pass("apify_token_set", maskSecret(token));

  if (!runUrl) fail("apify_run_url_set", "APIFY_RUN_URL missing");
  else if (runUrl.includes("token=")) {
    fail(
      "apify_run_url_token",
      "Bỏ ?token= khỏi APIFY_RUN_URL — n8n gửi token qua $env.APIFY_TOKEN riêng"
    );
  } else if (runUrl.includes("/runs") && !runUrl.includes("run-sync-get-dataset-items")) {
    fail(
      "apify_run_url_format",
      "Sai endpoint — cần run-sync-get-dataset-items, không phải /runs"
    );
  } else if (!runUrl.includes("run-sync-get-dataset-items")) {
    warn("apify_run_url_format", "URL should end with run-sync-get-dataset-items");
    pass("apify_run_url_set", runUrl);
  } else pass("apify_run_url_set", runUrl);

  if (token) {
    try {
      const meRes = await fetch(
        `https://api.apify.com/v2/users/me?token=${encodeURIComponent(token)}`
      );
      const me = await meRes.json();
      if (meRes.ok && me.data?.username) {
        pass(
          "apify_token_valid",
          `username=${me.data.username}, plan=${me.data.plan?.id || me.data.plan || "unknown"}`
        );
      } else {
        fail("apify_token_valid", me.error?.message || "Invalid token");
      }
    } catch (e) {
      fail("apify_token_valid", e.message);
    }
  }

  if (token && runUrl) {
    const actorId = runUrl.split("/acts/")[1]?.split("/")[0];
    if (actorId) {
      try {
        const actRes = await fetch(
          `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}?token=${encodeURIComponent(token)}`
        );
        const act = await actRes.json();
        if (actRes.ok && act.data?.name) {
          pass("apify_actor", `${actorId} → ${act.data.name} (${act.data.username}/${act.data.name})`);
        } else {
          warn("apify_actor", act.error?.message || `Actor ${actorId} not found`);
        }
      } catch (e) {
        warn("apify_actor", e.message);
      }
    }
  }

  if (!env.ANTHROPIC_API_KEY) {
    warn("anthropic_api_key", "ANTHROPIC_API_KEY chưa có — node Claude sẽ fail trên n8n");
  }

  console.log(JSON.stringify(report, null, 2));
  process.exit(report.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message }, null, 2));
  process.exit(1);
});
