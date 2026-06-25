#!/usr/bin/env node
/**
 * Đóng gói webhooks/video-tts để upload thủ công lên VPS (không cần SSH key từ Windows)
 * Usage: node scripts/pack-video-tts-vps.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const svcDir = path.join(root, 'webhooks', 'video-tts');
const outDir = path.join(root, 'out', 'video-tts-vps-pack');
const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const zipName = `magnix-video-tts-${stamp}.zip`;
const zipPath = path.join(root, 'out', zipName);

const files = ['package.json', 'tsconfig.json', 'Dockerfile'];
const dirs = ['src'];

function toLf(text) {
  return String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function writeLf(dest, content) {
  fs.writeFileSync(dest, toLf(content), 'utf8');
}

function copyLf(src, dest) {
  writeLf(dest, fs.readFileSync(src, 'utf8'));
}

function copyRecursiveLf(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) copyRecursiveLf(s, d);
    else copyLf(s, d);
  }
}

if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const f of files) {
  const src = path.join(svcDir, f);
  if (!fs.existsSync(src)) throw new Error(`Missing ${src}`);
  copyLf(src, path.join(outDir, f));
}
for (const d of dirs) {
  copyRecursiveLf(path.join(svcDir, d), path.join(outDir, d));
}

copyLf(
  path.join(root, 'scripts', 'vps', 'install-video-tts-pack.sh'),
  path.join(outDir, 'install.sh')
);

fs.mkdirSync(path.join(root, 'out'), { recursive: true });
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

const ps = spawnSync(
  'powershell',
  [
    '-NoProfile',
    '-Command',
    `Compress-Archive -Path '${outDir.replace(/'/g, "''")}\\*' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force`,
  ],
  { stdio: 'inherit' }
);
if (ps.status !== 0) process.exit(ps.status ?? 1);

console.log('\n=== PACK OK ===');
console.log('Zip:', zipPath);
console.log('\nUpload (scp):');
console.log(`  scp -P 24700 "${zipPath}" root@103.57.221.93:/root/`);
console.log('\nTren VPS:');
console.log(`  cd /root && unzip -o ${zipName} -d /tmp/magnix-tts-pack`);
console.log("  sed -i 's/\\r$//' /tmp/magnix-tts-pack/install.sh");
console.log('  bash /tmp/magnix-tts-pack/install.sh');
