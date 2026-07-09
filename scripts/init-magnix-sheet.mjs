#!/usr/bin/env node
/**
 * Khôi phục cấu trúc tab Database_Magnix_Lead (headers + seed project_config).
 *
 * Usage:
 *   node scripts/init-magnix-sheet.mjs              # tạo tab thiếu, giữ tab lạ
 *   node scripts/init-magnix-sheet.mjs --dry-run    # chỉ liệt kê, không ghi
 *   node scripts/init-magnix-sheet.mjs --rename-stray # đổi tên tab không thuộc schema → _archive_*
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const MAGNIX_TABS = {
  uid_leads: {
    headers: [
      'uid',
      'uid_source',
      'normalized_key',
      'captured_at',
      'text',
      'segment',
      'score',
      'interest_key',
      'tags',
      'meta',
      'classify_method',
      'consent_basis',
      'status',
    ],
  },
  project_config: {
    headers: ['project_id', 'url', 'platform', 'active', 'segment', 'notes'],
    seedCsv: path.join(root, 'n8n-workflows/templates/project_config.listening-starter.csv'),
  },
  content_queue: {
    headers: [
      'normalized_key',
      'post_id',
      'platform',
      'post_url',
      'author_id',
      'text',
      'segment',
      'score',
      'claude_verdict',
      'interest_key',
      'status',
      'captured_at',
      'source',
      'tags',
      'meta',
    ],
  },
  scrape_index: {
    headers: ['normalized_key', 'post_id', 'platform', 'source', 'first_seen_at', 'meta'],
  },
  channel_state: {
    headers: ['handle', 'last_scraped_at', 'last_post_id', 'platform'],
  },
  content_drafts: {
    headers: [
      'source_normalized_key',
      'post_id',
      'segment',
      'title',
      'hook_line',
      'artifact_markdown',
      'cta_opt_in',
      'disclaimer',
      'export_hint',
      'status',
      'qa_tier',
      'created_at',
      'source',
      'meta',
    ],
  },
  housex_articles: {
    headers: [
      'request_id',
      'slug',
      'title',
      'excerpt',
      'body',
      'seo_title',
      'seo_desc',
      'tags_json',
      'project_slugs_json',
      'status',
      'qa_tier',
      'created_at',
      'source',
      'meta',
    ],
  },
  noxh_leads_ops: {
    headers: [
      'lead_id',
      'tier',
      'overall',
      'credit_flag',
      'reason_codes',
      'recommended_action',
      'rules_version',
      'contact_name',
      'contact_phone',
      'contact_email',
      'ops_status',
      'assigned_to',
      'sla_due_at',
      'created_at',
      'meta',
    ],
  },
  noxh_leads_detail: {
    headers: [
      'lead_id',
      'tier',
      'object_group',
      'marital_status',
      'applicant_income',
      'spouse_income',
      'owns_home',
      'area_per_person',
      'intend_to_borrow',
      'existing_debt',
      'card_limit',
      'bad_debt',
      'timeframe',
      'dti',
      'evaluation_reasons',
      'credit_reasons',
      'next_steps',
      'rules_version',
      'contact_name',
      'contact_phone',
      'contact_email',
      'created_at',
    ],
  },
  housex_leads_inquiry: {
    headers: [
      'lead_id',
      'kind',
      'project_type',
      'segment',
      'entity_name',
      'slug_or_code',
      'province',
      'contact_name',
      'contact_phone',
      'contact_email',
      'message',
      'source',
      'public_url',
      'assigned_broker_id',
      'ops_status',
      'sla_due_at',
      'created_at',
      'meta',
    ],
  },
  housex_supply_ops: {
    headers: [
      'record_id',
      'supply_kind',
      'role',
      'contact_name',
      'contact_phone',
      'contact_email',
      'broker_id',
      'customer_id',
      'region',
      'detail',
      'public_url',
      'ops_status',
      'sla_due_at',
      'created_at',
      'meta',
    ],
  },
  outreach_queue: {
    headers: [
      'source_normalized_key',
      'draft_title',
      'segment',
      'warmth',
      'variant_a_cold',
      'variant_b_after_engagement',
      'variant_c_follow_up',
      'ghost_check_passed',
      'compliance_note',
      'status',
      'l3_approved',
      'variant_used',
      'sent_at',
      'replied',
      'opt_in',
      'created_at',
      'source',
      'meta',
    ],
  },
  video_drafts: {
    headers: [
      'source_normalized_key',
      'post_id',
      'platform',
      'segment',
      'title',
      'hook_3s',
      'spoken_script',
      'beats_json',
      'on_screen_text',
      'caption',
      'hashtags',
      'cta_keyword',
      'duration_sec',
      'aspect_ratio',
      'source_insight',
      'disclaimer',
      'status',
      'qa_tier',
      'l3_approved',
      'created_at',
      'source',
      'meta',
    ],
  },
  content_metrics: {
    headers: [
      'post_id',
      'platform',
      'segment',
      'reach',
      'views',
      'completion_rate',
      'save_rate',
      'share_rate',
      'keyword_comments',
      'dm_opt_in',
      'warm_lead_rate',
      'rewatch_rate',
      'early_swipe_away_3s',
      'retention_3s',
      'retention_50pct',
      'loop_factor',
      'video_avg_watch_pct',
      'comment_rate',
      'viewed_not_swiped',
      'apv',
      'swipe_away_3s',
      'scorecard_status',
      'analyzed_at',
      'verdict',
      'performance_score',
      'ivi_pct',
      'next_action',
    ],
  },
  content_scorecard: {
    headers: [
      'post_id',
      'platform',
      'segment',
      'performance_score',
      'ivi_pct',
      'verdict',
      'primary_retention_metric',
      'primary_retention_tier',
      'ivi_tier',
      'next_action',
      'recommendations',
      'scorecard_json',
      'analyzed_at',
      'status',
    ],
  },
  notification_events: {
    headers: [
      'event_id',
      'event_type',
      'source_workflow',
      'source_row_key',
      'target_tab',
      'status',
      'message',
      'telegram_chat_id',
      'telegram_message_id',
      'created_at',
      'resolved_at',
      'meta',
    ],
  },
};

function loadEnv() {
  const envPath = path.join(root, 'n8n-workflows/.env');
  const map = {};
  if (!fs.existsSync(envPath)) return map;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i > 0) map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return map;
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken(sa, scopes) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: scopes.join(' '),
      aud: sa.token_uri,
      iat: now,
      exp: now + 3600,
    })
  );
  const unsigned = `${header}.${claim}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsigned);
  const signature = base64url(sign.sign(sa.private_key));
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

function parseCsvRows(csvPath) {
  if (!fs.existsSync(csvPath)) return [];
  const lines = fs.readFileSync(csvPath, 'utf8').split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = [];
    let cur = '';
    let inQ = false;
    for (const ch of lines[i]) {
      if (ch === '"') {
        inQ = !inQ;
        continue;
      }
      if (ch === ',' && !inQ) {
        cells.push(cur.trim());
        cur = '';
        continue;
      }
      cur += ch;
    }
    cells.push(cur.trim());
    const row = headers.map((_, j) => cells[j] ?? '');
    rows.push(row);
  }
  return rows;
}

async function sheetsApi(token, method, urlPath, body) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${urlPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const renameStray = process.argv.includes('--rename-stray');

  const env = loadEnv();
  const sheetId =
    env.GOOGLE_SHEET_DATABASE_ID ||
    env.GOOGLE_SHEET_CONTENT_METRICS_ID ||
    JSON.parse(
      fs.readFileSync(path.join(root, 'n8n-workflows/magnix-public-config.json'), 'utf8')
    ).google_sheet_id;

  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(root, 'n8n-workflows/credentials/google-service-account.json');

  if (!fs.existsSync(saPath)) {
    console.error('Service account not found:', saPath);
    process.exit(1);
  }

  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  const token = await getAccessToken(sa, ['https://www.googleapis.com/auth/spreadsheets']);

  const meta = await sheetsApi(token, 'GET', `${sheetId}?fields=properties.title,sheets.properties`);
  const title = meta.properties?.title || sheetId;
  const sheets = (meta.sheets || []).map((s) => ({
    sheetId: s.properties.sheetId,
    title: s.properties.title,
  }));
  const existing = new Set(sheets.map((s) => s.title));

  console.log(`Sheet: ${title} (${sheetId})`);
  console.log('Tabs hiện có:', [...existing].join(', ') || '(trống)');

  const expected = new Set(Object.keys(MAGNIX_TABS));
  const stray = sheets.filter((s) => !expected.has(s.title) && !s.title.startsWith('_archive_'));

  if (stray.length) {
    console.log('\nTab không thuộc schema Magnix (giữ nguyên, không xóa):');
    for (const s of stray) console.log(`  - "${s.title}" (sheetId=${s.sheetId})`);
    if (renameStray && !dryRun) {
      const requests = stray.map((s, i) => ({
        updateSheetProperties: {
          properties: { sheetId: s.sheetId, title: `_archive_${s.title}`.slice(0, 100) },
          fields: 'title',
        },
      }));
      await sheetsApi(token, 'POST', `${sheetId}:batchUpdate`, { requests });
      console.log('Đã đổi tên tab lạ → _archive_*');
    }
  }

  const created = [];
  const seeded = [];
  const skipped = [];

  for (const [tabName, spec] of Object.entries(MAGNIX_TABS)) {
    if (!existing.has(tabName)) {
      if (dryRun) {
        console.log(`[dry-run] Sẽ tạo tab: ${tabName}`);
        continue;
      }
      await sheetsApi(token, 'POST', `${sheetId}:batchUpdate`, {
        requests: [{ addSheet: { properties: { title: tabName } } }],
      });
      created.push(tabName);
      console.log(`✓ Tạo tab: ${tabName}`);
    }

    const range = encodeURIComponent(`${tabName}!A1`);
    let currentHeader = [];
    try {
      const val = await sheetsApi(
        token,
        'GET',
        `${sheetId}/values/${encodeURIComponent(`${tabName}!1:1`)}`
      );
      currentHeader = (val.values?.[0] || []).map((h) => String(h).trim());
    } catch {
      /* tab mới */
    }

    const headerOk =
      currentHeader.length >= spec.headers.length &&
      spec.headers.every((h, i) => String(currentHeader[i] || '').toLowerCase() === h.toLowerCase());

    if (!headerOk) {
      if (dryRun) {
        console.log(`[dry-run] Sẽ ghi header tab: ${tabName}`);
      } else {
        await sheetsApi(
          token,
          'PUT',
          `${sheetId}/values/${range}?valueInputOption=USER_ENTERED`,
          { values: [spec.headers] }
        );
        console.log(`✓ Header tab: ${tabName} (${spec.headers.length} cột)`);
      }
    } else {
      skipped.push(tabName);
    }

    if (tabName === 'project_config' && spec.seedCsv) {
      const val = dryRun
        ? { values: [] }
        : await sheetsApi(
            token,
            'GET',
            `${sheetId}/values/${encodeURIComponent(`${tabName}!A2:F`)}`
          );
      const hasData = (val.values || []).some((row) => row.some((c) => String(c || '').trim()));
      if (!hasData) {
        const rows = parseCsvRows(spec.seedCsv);
        if (rows.length) {
          if (dryRun) {
            console.log(`[dry-run] Sẽ seed project_config: ${rows.length} dòng từ CSV`);
          } else {
            await sheetsApi(
              token,
              'POST',
              `${sheetId}/values/${encodeURIComponent(`${tabName}!A2`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
              { values: rows }
            );
            seeded.push(`${rows.length} dòng project_config`);
            console.log(`✓ Seed project_config: ${rows.length} dòng (TikTok starter)`);
          }
        }
      } else {
        console.log(`· project_config đã có dữ liệu — không ghi đè`);
      }
    }
  }

  console.log('\n--- Kết quả ---');
  if (dryRun) {
    console.log('Chế độ dry-run — không thay đổi Sheet.');
    console.log('Chạy lại không có --dry-run để áp dụng.');
  } else {
    console.log('Tạo mới:', created.length ? created.join(', ') : '(không)');
    console.log('Seed:', seeded.length ? seeded.join(', ') : '(không)');
    console.log('Header OK (giữ nguyên):', skipped.join(', ') || '(không)');
  }

  console.log('\nLưu ý: Dữ liệu content_queue / scrape_index cũ không khôi phục được từ Sheet.');
  console.log('Nếu còn backup Drive (Magnix_Automation/apify_raw/) hoặc tab FB scrape, có thể import lại sau.');
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
