#!/usr/bin/env node
/**
 * Data validation dropdown cho cột status / l3_approved trên Sheet Magnix.
 * Usage: node scripts/apply-sheet-l3-validation.mjs
 *        node scripts/apply-sheet-l3-validation.mjs --dry-run
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const STATUS_VALUES = ['draft', 'approved', 'rejected'];
const VIDEO_STATUS_EXTRA = ['ready_for_review', 'published'];
const L3_VALUES = ['TRUE', 'FALSE']; // legacy list — prefer booleanCheckboxRule

function loadEnv() {
  const map = {};
  const p = path.join(root, 'n8n-workflows/.env');
  if (!fs.existsSync(p)) return map;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i > 0) map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return map;
}

function b64u(s) {
  return Buffer.from(s).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function token(sa) {
  const now = Math.floor(Date.now() / 1000);
  const h = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const c = b64u(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: sa.token_uri,
      iat: now,
      exp: now + 3600,
    })
  );
  const u = `${h}.${c}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(u);
  const jwt = `${u}.${b64u(sign.sign(sa.private_key))}`;
  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const d = await res.json();
  if (!d.access_token) throw new Error(JSON.stringify(d));
  return d.access_token;
}

function listRule(values) {
  return {
    condition: {
      type: 'ONE_OF_LIST',
      values: values.map((v) => ({ userEnteredValue: v })),
    },
    showCustomUi: true,
    strict: true,
  };
}

/** Checkbox TRUE/FALSE — tránh lỗi string "true" vs boolean TRUE trên Google Sheets */
function booleanCheckboxRule() {
  return {
    condition: { type: 'BOOLEAN' },
    showCustomUi: true,
    strict: false,
  };
}

function colRange(sheetId, startCol, endCol, startRow = 1, endRow = 2000) {
  return {
    sheetId,
    startRowIndex: startRow,
    endRowIndex: endRow,
    startColumnIndex: startCol,
    endColumnIndex: endCol,
  };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const env = loadEnv();
  const cfg = JSON.parse(fs.readFileSync(path.join(root, 'n8n-workflows/magnix-public-config.json'), 'utf8'));
  const spreadsheetId = env.GOOGLE_SHEET_CONTENT_METRICS_ID || cfg.google_sheet_id;
  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(root, 'n8n-workflows/credentials/google-service-account.json');
  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  const tok = await token(sa);

  const meta = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties(sheetId,title)`,
    { headers: { Authorization: `Bearer ${tok}` } }
  ).then((r) => r.json());

  const tabIndex = {};
  for (const s of meta.sheets || []) {
    tabIndex[s.properties.title] = s.properties.sheetId;
  }

  const plans = [
    {
      tab: 'video_drafts',
      rules: [
        { col: 16, label: 'status (Q)', values: [...STATUS_VALUES, ...VIDEO_STATUS_EXTRA] },
        { col: 18, label: 'l3_approved (S) — checkbox', boolean: true },
      ],
    },
    {
      tab: 'content_drafts',
      rules: [{ col: 10, label: 'status (K)', values: STATUS_VALUES }],
    },
    {
      tab: 'outreach_queue',
      rules: [
        { col: 8, label: 'status (I)', values: STATUS_VALUES },
        { col: 9, label: 'l3_approved (J) — checkbox', boolean: true },
      ],
    },
  ];

  const requests = [];
  for (const plan of plans) {
    const sheetId = tabIndex[plan.tab];
    if (sheetId == null) {
      console.warn(`Skip tab không tồn tại: ${plan.tab}`);
      continue;
    }
    for (const r of plan.rules) {
      const label = r.label || r.col;
      if (r.boolean) {
        console.log(`${plan.tab} → ${label}: [checkbox TRUE/FALSE]`);
        requests.push({
          setDataValidation: {
            range: colRange(sheetId, r.col, r.col + 1),
            rule: booleanCheckboxRule(),
          },
        });
        continue;
      }
      console.log(`${plan.tab} → ${label}: [${r.values.join(', ')}]`);
      requests.push({
        setDataValidation: {
          range: colRange(sheetId, r.col, r.col + 1),
          rule: listRule(r.values),
        },
      });
    }
  }

  if (!requests.length) {
    console.log('Không có tab để cập nhật.');
    return;
  }

  if (dryRun) {
    console.log(`\n[dry-run] Sẽ gửi ${requests.length} validation rule(s).`);
    return;
  }

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tok}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  console.log(`\n✓ Đã áp dropdown L3 trên ${requests.length} cột.`);
  console.log('Chi tiết: n8n-workflows/L3_APPROVAL_STANDARD.md');
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
