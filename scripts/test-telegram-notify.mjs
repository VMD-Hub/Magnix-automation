#!/usr/bin/env node
/**
 * Smoke test POST telegram-notify webhook (local or VPS).
 * Usage: node scripts/test-telegram-notify.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPublicConfig } from './lib/magnix-env.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadEnvFile() {
  const envPath = path.join(root, 'n8n-workflows', '.env');
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

async function main() {
  const env = loadEnvFile();
  const cfg = loadPublicConfig();
  const base = String(env.N8N_PUBLIC_URL || 'https://n8n.vmd.asia').replace(/\/$/, '');
  const token = env.MAGNIX_WEBHOOK_TOKEN || '';

  const gids = cfg.sheet_tab_gids || {};
  const sheet_tab = cfg.content_drafts_tab || 'content_drafts';
  const sheet_row = 2;
  const approval_fields = ['status=approved'];
  const gid = gids[sheet_tab];
  const review_url = gid
    ? `https://docs.google.com/spreadsheets/d/${cfg.google_sheet_id}/edit#gid=${gid}&range=K${sheet_row}`
    : `https://docs.google.com/spreadsheets/d/${cfg.google_sheet_id}/edit#range=K${sheet_row}`;

  const event_id = `test:notification_events:smoke_${Date.now()}:approval_needed`;
  const body = {
    event_id,
    event_type: 'approval_needed',
    agent: 'test',
    severity: 'action_required',
    product_type: 'lead_magnet',
    target_channel: 'facebook_page',
    title: 'Magnix Telegram smoke test',
    segment: 'noxh_income',
    source_row_key: 'test:smoke',
    sheet_tab,
    sheet_row,
    approval_fields,
    review_url,
  };

  console.log('POST', `${base}/webhook/magnix/telegram-notify`);
  const res = await fetch(`${base}/webhook/magnix/telegram-notify`, {
    method: 'POST',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  console.log('Status:', res.status);
  let parsed;
  try {
    parsed = JSON.parse(text);
    console.log('Response:', JSON.stringify(parsed, null, 2));
    if (parsed.telegram_sent) console.log('✓ Telegram sent');
    else if (parsed.duplicate) console.log('~ Duplicate event — skipped Telegram');
    else console.log('⚠ Telegram NOT sent — reason:', parsed.reason || 'unknown');
  } catch {
    console.log('Body (raw):', text.slice(0, 500));
  }

  if (!res.ok) process.exit(1);
  if (parsed && parsed.telegram_sent !== true && !parsed.duplicate) process.exit(2);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
