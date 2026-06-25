/**
 * Shared env + config loader for Magnix scripts.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.join(__dirname, '..', '..');

export function loadEnv() {
  const envPath = path.join(REPO_ROOT, 'n8n-workflows/.env');
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

export function loadPublicConfig() {
  const p = path.join(REPO_ROOT, 'n8n-workflows/magnix-public-config.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export function loadServiceAccount(env = loadEnv()) {
  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(REPO_ROOT, 'n8n-workflows/credentials/google-service-account.json');
  if (!fs.existsSync(saPath)) {
    throw new Error(`Missing Service Account JSON: ${saPath}`);
  }
  return JSON.parse(fs.readFileSync(saPath, 'utf8'));
}

export function sheetId(env = loadEnv(), cfg = loadPublicConfig()) {
  return env.GOOGLE_SHEET_CONTENT_METRICS_ID || cfg.google_sheet_id;
}

export function parseMeta(raw) {
  if (!raw) return {};
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

export function parseArgs(argv = process.argv.slice(2)) {
  const flags = new Set();
  const opts = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const body = a.slice(2);
    const eq = body.indexOf('=');
    if (eq >= 0) {
      opts[body.slice(0, eq)] = body.slice(eq + 1);
      continue;
    }
    const key = body;
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      opts[key] = next;
      i += 1;
    } else {
      flags.add(key);
    }
  }
  return { flags, opts };
}

export function hasFlag(flags, name) {
  return flags.has(name);
}
