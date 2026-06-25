#!/usr/bin/env node
/**
 * Go-live VPS — Phase 1 checklist (GO_LIVE_PHASE1.md)
 *
 * Usage:
 *   node scripts/go-live-vps.mjs              # env generate + probe + push workflows
 *   node scripts/go-live-vps.mjs --deploy-env # + scp/restart n8n container (cần SSH)
 *   node scripts/go-live-vps.mjs --skip-push
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv, parseArgs } from './lib/magnix-env.mjs';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(scriptsDir, '..');
const node = process.execPath;

function run(script, args = []) {
  console.log(`\n>> ${path.basename(script)} ${args.join(' ')}`.trim());
  const r = spawnSync(node, [path.join(scriptsDir, script), ...args], {
    cwd: root,
    stdio: 'inherit',
  });
  return r.status ?? 1;
}

async function main() {
  const { flags } = parseArgs();
  const deployEnv = flags.has('deploy-env');
  const skipPush = flags.has('skip-push');

  console.log('=== Magnix Go-live VPS (Phase 1) ===\n');

  const env = loadEnv();
  const missing = [];
  if (!env.N8N_API_KEY) missing.push('N8N_API_KEY');
  if (!env.ANTHROPIC_API_KEY && !env.DEEPSEEK_API_KEY) {
    missing.push('ANTHROPIC_API_KEY hoặc DEEPSEEK_API_KEY');
  }
  if (!env.GOOGLE_SHEET_CONTENT_METRICS_ID && !env.GOOGLE_SHEET_DATABASE_ID) {
    missing.push('GOOGLE_SHEET_CONTENT_METRICS_ID');
  }
  if (missing.length) {
    console.warn('⚠ Thiếu trong n8n-workflows/.env:', missing.join(', '));
  }

  if (run('generate-n8n-vps-env.mjs') !== 0) process.exit(1);

  if (deployEnv) {
    if (run('deploy-vps-n8n.mjs') !== 0) {
      console.warn('\nDeploy env qua SSH thất bại — xem lệnh scp/ssh ở trên và chạy tay.');
    }
  } else {
    console.log('\n(Bỏ qua deploy env — thêm --deploy-env để scp + restart container n8n trên VPS)');
  }

  if (!skipPush) {
    if (run('rebuild-all-workflows.mjs') !== 0) process.exit(1);
    const pushStatus = run('push-n8n-workflows.mjs');
    if (pushStatus !== 0) {
      console.warn('\nPush workflow có lỗi — thường do thiếu googleApi trên node Drive Backup (Agent 1).');
      console.warn('→ n8n UI: gán credential → Activate lại workflow bị tắt.');
    }
  }

  const probeStatus = run('probe-n8n-vps-env.mjs');

  console.log('\n=== Checklist GO_LIVE_PHASE1 ===');
  console.log(`[${deployEnv ? '?' : '~'}] 1A — Env trên container n8n (${deployEnv ? 'đã thử deploy' : 'chạy: node scripts/go-live-vps.mjs --deploy-env'})`);
  console.log(`[${skipPush ? '~' : '✓'}] 1B — Push workflow JSON qua n8n API`);
  console.log('[ ] 1C — Credential googleApi + Creatomate Header Auth trên n8n UI (1 lần)');
  console.log('[ ] 1D — Manual run từng agent trên n8n → Sheet cập nhật');
  console.log('[ ] 1E — Telegram (chưa implement trong workflow — bỏ qua Phase 1)');

  console.log('\nManual run trên https://n8n.vmd.asia (Execute workflow):');
  console.log('  1. Agent 2 Classify → content_queue có status=classified');
  console.log('  2. Layer B Editorial Brief → meta.editorial_brief_v1');
  console.log('  3. Agent 6 Video Script → video_drafts');
  console.log('  4. Agent 7 Render (row approved + l3) → meta.render_url');
  console.log('  5. Agent 5 Scorecard → cần row content_metrics hợp lệ');

  console.log('\nDEEPSEEK_API_KEY:', env.DEEPSEEK_API_KEY ? 'set' : 'trống — OK nếu Agent 2 dùng Anthropic');
  console.log('MAGNIX_VIDEO_TTS_URL:', env.MAGNIX_VIDEO_TTS_URL || 'MISSING');
  console.log('MAGNIX_WEBHOOK_TOKEN:', env.MAGNIX_WEBHOOK_TOKEN ? 'set' : 'MISSING');

  process.exit(probeStatus === 0 ? 0 : 2);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
