#!/usr/bin/env node
/**
 * Diagnostic Agent 4 — content_drafts → outreach candidates
 * Usage: node scripts/diagnose-agent4-candidates.mjs
 */
import { loadPublicConfig, parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';
import { printDiagnostic } from './lib/diagnose-print.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const resolveSrc = fs.readFileSync(
  path.join(root, 'n8n-workflows/code/shared/resolve-outreach-context.js'),
  'utf8',
);
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(resolveSrc, sandbox);
const { resolveOutreachContext } = sandbox;

const BATCH = loadPublicConfig().outreach_batch_size ?? 10;

async function main() {
  const { rows } = rowsToObjects(await fetchTab('content_drafts', 'A:N'));
  const reasons = {
    total: rows.length,
    already_outreach: 0,
    bad_status: 0,
    missing_title_hook: 0,
    eligible: 0,
  };
  const statusCounts = {};
  const samples = [];

  for (const row of rows) {
    const status = String(row.status || '').trim().toLowerCase() || '(blank)';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    const meta = parseMeta(row.meta);

    if (meta.outreach_created === true) {
      reasons.already_outreach += 1;
      continue;
    }
    if (status !== 'draft' && status !== 'approved') {
      reasons.bad_status += 1;
      continue;
    }
    const title = String(row.title || '').trim();
    const hook = String(row.hook_line || '').trim();
    if (!title || !hook) {
      reasons.missing_title_hook += 1;
      continue;
    }
    reasons.eligible += 1;
    if (samples.length < 5) {
      const { warmth, context } = resolveOutreachContext(row);
      samples.push({
        row: row.sheet_row,
        status,
        title: title.slice(0, 50),
        segment: row.segment,
        warmth,
        context,
      });
    }
  }

  console.log('=== Agent 4 — Outreach Queue diagnostic ===');
  console.log(`Batch: ${BATCH} · Cron 09:30 VN · L3 bắt buộc trước gửi Zalo`);
  console.log('Runbook: docs/OUTBOUND_RUNBOOK.md · Patch warmth: scripts/patch-draft-outreach-warmth.mjs');
  printDiagnostic('Outreach candidates', reasons, { 'Top status': statusCounts });
  if (samples.length) {
    console.log('\n--- Sample eligible ---');
    for (const s of samples) console.log(JSON.stringify(s));
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
