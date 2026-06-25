#!/usr/bin/env node
/**
 * Deploy webhooks/video-tts lên VPS (Docker)
 * Usage: node scripts/deploy-video-tts-vps.mjs
 *
 * Env: MAGNIX_VPS_HOST, MAGNIX_VPS_PORT, MAGNIX_VPS_USER
 * Local: webhooks/video-tts/.env (copy from .env.example)
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const svcDir = path.join(root, 'webhooks/video-tts');
const envFile = path.join(svcDir, '.env');

const HOST = process.env.MAGNIX_VPS_HOST || '103.57.221.93';
const PORT = process.env.MAGNIX_VPS_PORT || '24700';
const USER = process.env.MAGNIX_VPS_USER || 'root';
const REMOTE_DIR = '/opt/magnix-video-tts';

const SSH_BASE = ['-p', PORT, '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15'];
const SCP_BASE = ['-P', PORT, '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15'];

function run(cmd, args) {
  console.log('>', cmd, ...args);
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: false });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function sshPreflight() {
  const r = spawnSync(
    'ssh',
    [...SSH_BASE, '-o', 'BatchMode=yes', `${USER}@${HOST}`, 'echo OK'],
    { encoding: 'utf8' }
  );
  if (r.status !== 0) {
    console.error('\nSSH failed — chạy lệnh này trên máy có SSH key:');
    console.error(`  ssh -p ${PORT} ${USER}@${HOST}`);
    console.error('Hoặc trên VPS (đã SSH vào):');
    console.error('  cd /opt/magnix-automation && bash scripts/vps/deploy-video-tts-on-server.sh');
    process.exit(1);
  }
}

if (!fs.existsSync(envFile)) {
  console.error('Missing', envFile, '— copy from webhooks/video-tts/.env.example');
  process.exit(1);
}

sshPreflight();

run('ssh', [...SSH_BASE, `${USER}@${HOST}`, `mkdir -p ${REMOTE_DIR}`]);

run('scp', [
  ...SCP_BASE, '-r',
  path.join(svcDir, 'package.json'),
  path.join(svcDir, 'tsconfig.json'),
  path.join(svcDir, 'src'),
  path.join(svcDir, 'Dockerfile'),
  envFile,
  `${USER}@${HOST}:${REMOTE_DIR}/`,
]);

const remoteScript = [
  `cd ${REMOTE_DIR}`,
  'docker rm -f magnix-video-tts 2>/dev/null || true',
  'docker build -t magnix-video-tts:latest .',
  'docker run -d --name magnix-video-tts --restart unless-stopped -p 8765:8765 --env-file .env -v magnix_tts_data:/app/data magnix-video-tts:latest',
  'command -v ufw >/dev/null && ufw allow 8765/tcp comment magnix-video-tts 2>/dev/null || true',
  'sleep 2',
  'curl -sf http://127.0.0.1:8765/health',
  'docker ps --filter name=magnix-video-tts --format "{{.Names}} {{.Status}}"',
].join(' && ');

run('ssh', [...SSH_BASE, `${USER}@${HOST}`, remoteScript]);

console.log(`\nDone. Test: curl http://${HOST}:8765/health`);
console.log('Next: node scripts/generate-n8n-vps-env.mjs && node scripts/deploy-vps-n8n.mjs');
