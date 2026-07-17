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
const N8N_IMAGE = (process.env.N8N_IMAGE || '').trim();

if (N8N_IMAGE && !/^[a-zA-Z0-9][a-zA-Z0-9._/:@-]+$/.test(N8N_IMAGE)) {
  console.error('N8N_IMAGE không hợp lệ; dùng image:tag hoặc image@sha256:digest');
  process.exit(1);
}

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
  console.error('  Sau đó chạy lại script để giữ đúng image ID đang deploy; không dùng tag latest/n8nio/n8n trôi.');
  process.exit(1);
}

const imageOverride = N8N_IMAGE ? `'${N8N_IMAGE}'` : "''";
const remoteScript = [
  'set -e',
  `N8N_IMAGE_OVERRIDE=${imageOverride}`,
  'N8N_BACKUP_CONTAINER=n8n-before-deploy',
  'if docker inspect "$N8N_BACKUP_CONTAINER" >/dev/null 2>&1; then echo "ERROR: $N8N_BACKUP_CONTAINER already exists; inspect/remove it before deploy" >&2; exit 1; fi',
  'CURRENT_N8N_IMAGE_ID="$(docker inspect n8n --format \'{{.Image}}\' 2>/dev/null || true)"',
  'CURRENT_N8N_VERSION="$(docker exec n8n n8n --version 2>/dev/null || true)"',
  'N8N_IMAGE_TO_RUN="${N8N_IMAGE_OVERRIDE:-$CURRENT_N8N_IMAGE_ID}"',
  'test -n "$N8N_IMAGE_TO_RUN" || { echo "ERROR: no running n8n image; set N8N_IMAGE to an exact version/digest" >&2; exit 1; }',
  'echo "Current n8n version=${CURRENT_N8N_VERSION:-unknown} image_id=${CURRENT_N8N_IMAGE_ID:-none}"',
  'echo "Deploying pinned image=$N8N_IMAGE_TO_RUN"',
  'BACKUP_STAMP="$(date +%F_%H%M%S)"',
  'mkdir -p /root/backup/n8n',
  'cp /root/n8n.env "/root/backup/n8n/n8n.env-${BACKUP_STAMP}"',
  'chmod 600 "/root/backup/n8n/n8n.env-${BACKUP_STAMP}"',
  'docker run --rm --entrypoint sh -v n8n_data:/data:ro -v /root/backup/n8n:/backup "$N8N_IMAGE_TO_RUN" -c "tar -czf /backup/n8n-data-${BACKUP_STAMP}.tgz -C /data ."',
  'sha256sum "/root/backup/n8n/n8n-data-${BACKUP_STAMP}.tgz" > "/root/backup/n8n/n8n-data-${BACKUP_STAMP}.tgz.sha256"',
  'echo "Backup verified: /root/backup/n8n/n8n-data-${BACKUP_STAMP}.tgz"',
  'docker stop n8n',
  'docker rename n8n "$N8N_BACKUP_CONTAINER"',
  'if ! docker run -d --name n8n -p 5678:5678 --env-file /root/n8n.env -v n8n_data:/home/node/.n8n --restart unless-stopped --log-driver json-file --log-opt max-size=10m --log-opt max-file=5 "$N8N_IMAGE_TO_RUN"; then docker rm -f n8n 2>/dev/null || true; docker rename "$N8N_BACKUP_CONTAINER" n8n; docker start n8n; exit 1; fi',
  'sleep 15',
  'if ! curl -fsS http://127.0.0.1:5678/healthz >/dev/null; then docker logs --tail 100 n8n >&2 || true; docker rm -f n8n; docker rename "$N8N_BACKUP_CONTAINER" n8n; docker start n8n; echo "ERROR: n8n health check failed; rolled back" >&2; exit 1; fi',
  'docker ps --filter name=n8n --format "{{.Names}} {{.Status}}"',
  'docker exec n8n n8n --version',
  'docker rm "$N8N_BACKUP_CONTAINER"',
].join('; ');

const sshStatus = run('ssh', ['-p', PORT, '-o', 'StrictHostKeyChecking=no', `${USER}@${HOST}`, remoteScript]);
if (sshStatus !== 0) process.exit(sshStatus);

console.log('\nDone. Kiểm tra env: node scripts/probe-n8n-vps-env.mjs');
