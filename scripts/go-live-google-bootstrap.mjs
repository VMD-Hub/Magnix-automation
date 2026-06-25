#!/usr/bin/env node
/**
 * Bootstrap Google-only go-live tasks from n8n-workflows/.env.
 *
 * Usage:
 *   node scripts/go-live-google-bootstrap.mjs
 *   node scripts/go-live-google-bootstrap.mjs --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dryRun = process.argv.includes('--dry-run');
const ignoreStorageMode = process.argv.includes('--ignore-storage-mode');

function loadEnv() {
  const envPath = path.join(root, 'n8n-workflows/.env');
  const map = {};
  if (!fs.existsSync(envPath)) {
    throw new Error('Missing n8n-workflows/.env');
  }
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i > 0) map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return map;
}

function requireEnv(env, keys) {
  const missing = keys.filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(`Missing required env: ${missing.join(', ')}`);
  }
}

function requireAnyEnv(env, keys, label) {
  if (!keys.some((key) => env[key])) {
    throw new Error(`Missing required env: ${label || keys.join(' or ')}`);
  }
}

function run(label, args) {
  console.log(`\n== ${label} ==`);
  const res = spawnSync(process.execPath, args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
  if (res.status !== 0) {
    throw new Error(`${label} failed with exit code ${res.status}`);
  }
}

const env = loadEnv();

if (!ignoreStorageMode && env.MAGNIX_STORAGE_MODE !== 'google_sheet_primary_drive_archive') {
  throw new Error(
    `MAGNIX_STORAGE_MODE must be google_sheet_primary_drive_archive, got ${env.MAGNIX_STORAGE_MODE || '(empty)'}`
  );
}

if (ignoreStorageMode && env.MAGNIX_STORAGE_MODE !== 'google_sheet_primary_drive_archive') {
  console.warn(
    `Warning: ignoring MAGNIX_STORAGE_MODE=${env.MAGNIX_STORAGE_MODE || '(empty)'} for local bootstrap. Fix .env before deploy.`
  );
}

requireAnyEnv(env, ['GOOGLE_SHEET_DATABASE_ID', 'GOOGLE_SHEET_CONTENT_METRICS_ID'], 'GOOGLE_SHEET_DATABASE_ID');
requireAnyEnv(env, ['GOOGLE_DRIVE_ARCHIVE_FOLDER_ID', 'GOOGLE_DRIVE_FOLDER_ID'], 'GOOGLE_DRIVE_ARCHIVE_FOLDER_ID');
requireEnv(env, ['GOOGLE_SERVICE_ACCOUNT_JSON']);

console.log('Magnix Google bootstrap');
console.log(`Mode: ${dryRun ? 'dry-run' : 'apply'}`);
console.log('Secrets are loaded from n8n-workflows/.env and are not printed.');

run('Initialize Google Sheet tabs', [
  'scripts/init-magnix-sheet.mjs',
  ...(dryRun ? ['--dry-run'] : []),
]);

run('Initialize Drive folders', [
  'scripts/init-magnix-drive-folders.mjs',
  ...(dryRun ? ['--dry-run'] : []),
]);

if (!dryRun) {
  run('Verify Google setup', ['scripts/verify-google-setup.mjs']);
}

run('Rebuild n8n workflows', ['scripts/rebuild-all-workflows.mjs']);

console.log('\nOK: Google bootstrap complete.');
