/**
 * Gemini API key resolution — nhiều tên env, không log secret.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './magnix-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

export const GEMINI_KEY_NAMES = [
  'GEMINI_API_KEY',
  'GOOGLE_GEMINI_API_KEY',
  'GOOGLE_AI_API_KEY',
  'GENERATIVE_LANGUAGE_API_KEY',
];

export const GEMINI_IMAGE_MODELS = [
  'gemini-2.5-flash-image',
  'gemini-2.0-flash-preview-image-generation',
  'gemini-3.1-flash-image-preview',
];

export function parseDotEnvText(text) {
  const map = {};
  for (const line of String(text || '').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i > 0) map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return map;
}

export function resolveGeminiApiKey(map = {}) {
  for (const name of GEMINI_KEY_NAMES) {
    const value = String(map[name] || '').trim();
    if (value) return { key: value, source: name };
  }
  return { key: '', source: null };
}

export function scanGeminiKeySources() {
  const hits = [];
  const add = (label, map) => {
    const hit = resolveGeminiApiKey(map);
    if (hit.key) hits.push({ label, source: hit.source, length: hit.key.length });
  };

  add('magnix .env', loadEnv());
  add('process.env', process.env);

  const files = [
    path.join(root, 'n8n-workflows/.env.local'),
    path.join(process.env.USERPROFILE || '', 'Lifestyle_SuperApp/.env'),
    path.join(process.env.USERPROFILE || '', 'Lifestyle_SuperApp/.env.docker'),
    path.join(process.env.USERPROFILE || '', 'Lifestyle_SuperApp/tools/workflow-bds-pipeline/.env'),
    path.join(process.env.USERPROFILE || '', 'Lifestyle_SuperApp/infrastructure/.env.production'),
    path.join(process.env.USERPROFILE || '', 'Lifestyle_SuperApp/services/main-api/.env'),
    path.join(root, 'n8n-workflows/.env.vps.merged'),
    path.join(root, 'n8n-workflows/.env.vps.generated'),
  ];

  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    add(path.basename(file), parseDotEnvText(fs.readFileSync(file, 'utf8')));
  }

  return hits;
}

export function upsertMagnixEnvGemini(key, { enableCover = true } = {}) {
  const envPath = path.join(root, 'n8n-workflows/.env');
  let text = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const setLine = (name, value) => {
    const re = new RegExp(`^${name}=.*$`, 'm');
    const line = `${name}=${value}`;
    text = re.test(text) ? text.replace(re, line) : `${text.replace(/\s*$/, '')}\n${line}\n`;
  };
  setLine('GEMINI_API_KEY', key);
  if (enableCover) setLine('CONTENT_PAGE_COVER_ENABLED', 'true');
  fs.writeFileSync(envPath, text.endsWith('\n') ? text : `${text}\n`);
}
