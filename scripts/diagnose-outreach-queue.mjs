#!/usr/bin/env node
/**
 * Diagnostic outreach_queue — L3 pending, sent, reply tracking (Phase 0)
 * Usage: node scripts/diagnose-outreach-queue.mjs
 */
import { loadPublicConfig, parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';

async function main() {
  const tab = loadPublicConfig().outreach_queue_tab || 'outreach_queue';
  const { rows } = rowsToObjects(await fetchTab(tab, 'A:R'));

  const stats = {
    total: rows.length,
    pending_l3: 0,
    ready_to_send: 0,
    sent: 0,
    replied: 0,
    opt_in: 0,
    by_warmth: {},
    by_segment: {},
  };

  const pending = [];
  const ready = [];
  const sentNoReply = [];

  for (const row of rows) {
    const warmth = String(row.warmth || 'cold').toLowerCase() || 'cold';
    const segment = String(row.segment || 'unknown').toLowerCase();
    stats.by_warmth[warmth] = (stats.by_warmth[warmth] || 0) + 1;
    stats.by_segment[segment] = (stats.by_segment[segment] || 0) + 1;

    const l3 = String(row.l3_approved || '').trim().toLowerCase() === 'true';
    const sentAt = String(row.sent_at || '').trim();
    const replied = String(row.replied || '').trim().toLowerCase() === 'true';
    const optIn = String(row.opt_in || '').trim().toLowerCase() === 'true';

    if (!l3) {
      stats.pending_l3 += 1;
      if (pending.length < 5) {
        pending.push({
          row: row.sheet_row,
          title: String(row.draft_title || '').slice(0, 50),
          warmth,
          segment,
        });
      }
      continue;
    }

    if (!sentAt) {
      stats.ready_to_send += 1;
      if (ready.length < 5) {
        const meta = parseMeta(row.meta);
        ready.push({
          row: row.sheet_row,
          title: String(row.draft_title || '').slice(0, 50),
          warmth,
          primary_variant: meta.primary_variant || '(xem meta)',
        });
      }
      continue;
    }

    stats.sent += 1;
    if (replied) stats.replied += 1;
    if (optIn) stats.opt_in += 1;

    if (!replied && sentNoReply.length < 5) {
      sentNoReply.push({
        row: row.sheet_row,
        title: String(row.draft_title || '').slice(0, 50),
        sent_at: sentAt,
        warmth,
      });
    }
  }

  const replyRate = stats.sent ? ((stats.replied / stats.sent) * 100).toFixed(1) : '—';
  const optInRate = stats.sent ? ((stats.opt_in / stats.sent) * 100).toFixed(1) : '—';

  console.log('=== Outreach Queue — Phase 0 diagnostic ===');
  console.log(`Tab: ${tab} · Runbook: docs/OUTBOUND_RUNBOOK.md`);
  console.log(JSON.stringify(stats, null, 2));
  console.log(`\nReply rate: ${replyRate}% · Opt-in rate: ${optInRate}%`);

  if (pending.length) {
    console.log('\n--- Chờ L3 (sample) ---');
    for (const s of pending) console.log(JSON.stringify(s));
  }
  if (ready.length) {
    console.log('\n--- L3 OK, chưa gửi (sample) ---');
    for (const s of ready) console.log(JSON.stringify(s));
  }
  if (sentNoReply.length) {
    console.log('\n--- Đã gửi, chưa reply (sample — cân nhắc variant C) ---');
    for (const s of sentNoReply) console.log(JSON.stringify(s));
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
