#!/usr/bin/env node
/**
 * Upload /root/n8n.env + restart n8n container trên VPS
 * Usage: node scripts/deploy-vps-n8n.mjs
 *
 * Env: MAGNIX_VPS_HOST, MAGNIX_VPS_PORT (default 24700), MAGNIX_VPS_USER (default root)
 *
 * Giữ N8N_ENCRYPTION_KEY và các biến không có trong file generated (merge với /root/n8n.env cũ).
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const HOST = process.env.MAGNIX_VPS_HOST || '103.57.221.93';
const PORT = process.env.MAGNIX_VPS_PORT || '24700';
const USER = process.env.MAGNIX_VPS_USER || 'root';
const ENV_FILE = path.join(root, 'n8n-workflows/.env.vps.generated');
const MERGED_FILE = path.join(root, 'n8n-workflows/.env.vps.merged');

const PRESERVE_KEYS = new Set([
  'N8N_ENCRYPTION_KEY',
  'N8N_HOST',
  'N8N_PORT',
  'N8N_PROTOCOL',
  'WEBHOOK_URL',
  'N8N_API_KEY',
  'GEMINI_API_KEY',
  'GOOGLE_GEMINI_API_KEY',
  'GOOGLE_AI_API_KEY',
  'GENERATIVE_LANGUAGE_API_KEY',
]);

function parseEnv(text) {
  const map = {};
  for (const line of String(text || '').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i > 0) map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return map;
}

function serializeEnv(map, header) {
  const lines = [header, ''];
  for (const [k, v] of Object.entries(map)) {
    if (v === undefined || v === null) continue;
    lines.push(`${k}=${v}`);
  }
  return `${lines.join('\n')}\n`;
}

function run(cmd, args, opts = {}) {
  console.log('>', cmd, ...args);
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: false, ...opts });
  return r.status ?? 1;
}

function sshBatch(args, input) {
  const r = spawnSync(
    'ssh',
    ['-p', PORT, '-o', 'StrictHostKeyChecking=no', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=12', `${USER}@${HOST}`, ...args],
    { encoding: 'utf8', input, stdio: ['pipe', 'pipe', 'pipe'] }
  );
  return r;
}

if (!fs.existsSync(ENV_FILE)) {
  console.error('Missing', ENV_FILE, '— run: node scripts/generate-n8n-vps-env.mjs');
  process.exit(1);
}

const generated = parseEnv(fs.readFileSync(ENV_FILE, 'utf8'));
let merged = { ...generated };

const remoteEnv = sshBatch(['cat /root/n8n.env 2>/dev/null || true']);
if (remoteEnv.status === 0 && remoteEnv.stdout?.trim()) {
  const existing = parseEnv(remoteEnv.stdout);
  for (const [k, v] of Object.entries(existing)) {
    if (!v) continue;
    if (PRESERVE_KEYS.has(k)) {
      merged[k] = v;
      continue;
    }
    if (!(k in generated)) {
      merged[k] = v;
      continue;
    }
    // Giữ key trên VPS nếu file generated để trống (vd. GEMINI_API_KEY chỉ có trên server)
    if (!String(generated[k] || '').trim()) merged[k] = v;
  }
  for (const k of PRESERVE_KEYS) {
    if (existing[k] && !generated[k]) merged[k] = existing[k];
  }
  console.log('Merged with remote /root/n8n.env (preserved encryption key + extras)');
} else if (remoteEnv.stderr?.includes('Permission denied') || remoteEnv.status !== 0) {
  console.warn('SSH batch không khả dụng — dùng file generated thuần (chạy scp thủ công nếu cần giữ N8N_ENCRYPTION_KEY)');
}

fs.writeFileSync(
  MERGED_FILE,
  serializeEnv(merged, '# Magnix n8n VPS — merged (generated + preserved keys)')
);
console.log('Written', MERGED_FILE);

const scpStatus = run('scp', ['-P', PORT, '-o', 'StrictHostKeyChecking=no', MERGED_FILE, `${USER}@${HOST}:/root/n8n.env`]);
if (scpStatus !== 0) {
  console.error('\nSSH/SCP thất bại — chạy thủ công trong PowerShell (nhập password VPS):');
  console.error(`  scp -P ${PORT} "${MERGED_FILE}" ${USER}@${HOST}:/root/n8n.env`);
  console.error(`  ssh -p ${PORT} ${USER}@${HOST} "docker rm -f n8n; docker run -d --name n8n -p 5678:5678 --env-file /root/n8n.env -v n8n_data:/home/node/.n8n --restart unless-stopped n8nio/n8n"`);
  process.exit(1);
}

const remoteScript = [
  'docker rm -f n8n 2>/dev/null || true',
  'docker run -d --name n8n -p 5678:5678 --env-file /root/n8n.env -v n8n_data:/home/node/.n8n --restart unless-stopped n8nio/n8n',
  'sleep 2',
  'docker ps --filter name=n8n --format "{{.Names}} {{.Status}}"',
].join('; ');

const sshStatus = run('ssh', ['-p', PORT, '-o', 'StrictHostKeyChecking=no', `${USER}@${HOST}`, remoteScript]);
if (sshStatus !== 0) process.exit(sshStatus);

console.log('\nDone. Kiểm tra env: node scripts/probe-n8n-vps-env.mjs');
