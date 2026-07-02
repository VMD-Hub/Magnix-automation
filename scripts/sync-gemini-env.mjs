#!/usr/bin/env node
/**
 * Tìm GEMINI_API_KEY từ env hệ thống / file phụ → ghi vào n8n-workflows/.env
 *
 * Usage:
 *   node scripts/sync-gemini-env.mjs
 *   node scripts/sync-gemini-env.mjs --dry-run
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GEMINI_KEY_NAMES,
  resolveGeminiApiKey,
  scanGeminiKeySources,
  upsertMagnixEnvGemini,
  parseDotEnvText,
} from './lib/gemini-env.mjs';
import { loadEnv } from './lib/magnix-env.mjs';

const dryRun = process.argv.includes('--dry-run');
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function readKeyFromFirstHit() {
  const hits = scanGeminiKeySources();
  if (!hits.length) return { hits, key: '', source: null };

  // Ưu tiên magnix .env nếu đã có, không ghi đè từ nguồn yếu hơn
  const magnix = resolveGeminiApiKey(loadEnv());
  if (magnix.key) return { hits, key: magnix.key, source: magnix.source };

  const best = hits.find((h) => h.label !== 'process.env') || hits[0];
  const fileMap = {};
  for (const file of [
    path.join(root, 'n8n-workflows/.env.local'),
    path.join(process.env.USERPROFILE || '', 'Lifestyle_SuperApp/.env'),
    path.join(root, 'n8n-workflows/.env.vps.merged'),
  ]) {
    if (fs.existsSync(file)) Object.assign(fileMap, parseDotEnvText(fs.readFileSync(file, 'utf8')));
  }
  Object.assign(fileMap, process.env);
  const resolved = resolveGeminiApiKey(fileMap);
  return { hits, key: resolved.key, source: resolved.source || best?.source };
}

async function main() {
  console.log('=== Sync Gemini env → Magnix ===\n');
  console.log('Tên biến hỗ trợ:', GEMINI_KEY_NAMES.join(', '));

  const { hits, key, source } = readKeyFromFirstHit();

  if (hits.length) {
    console.log('\nNguồn tìm thấy:');
    for (const h of hits) console.log(`  - ${h.label}: ${h.source} (${h.length} chars)`);
  } else {
    console.log('\nKhông tìm thấy key trong bất kỳ nguồn nào.');
    console.log('→ Thêm GEMINI_API_KEY=... vào n8n-workflows/.env hoặc n8n-workflows/.env.local');
    console.log('→ Lấy key: https://aistudio.google.com/apikey');
    process.exit(1);
  }

  const current = resolveGeminiApiKey(loadEnv());
  if (current.key) {
    console.log(`\nMagnix .env đã có ${current.source} (${current.key.length} chars)`);
    if (String(loadEnv().CONTENT_PAGE_COVER_ENABLED || '').toLowerCase() !== 'true') {
      if (!dryRun) {
        upsertMagnixEnvGemini(current.key, { enableCover: true });
        console.log('Đã bật CONTENT_PAGE_COVER_ENABLED=true');
      } else {
        console.log('[dry-run] Sẽ bật CONTENT_PAGE_COVER_ENABLED=true');
      }
    } else {
      console.log('CONTENT_PAGE_COVER_ENABLED đã bật — không đổi key');
    }
    process.exit(0);
  }

  if (!key) {
    console.error('Không resolve được key.');
    process.exit(1);
  }

  console.log(`\nSẽ ghi GEMINI_API_KEY từ ${source}`);
  if (dryRun) {
    console.log('[dry-run] skip write');
    process.exit(0);
  }

  upsertMagnixEnvGemini(key, { enableCover: true });
  console.log('OK — đã cập nhật n8n-workflows/.env');
  console.log('Next: node scripts/probe-gemini-image.mjs');
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
