#!/usr/bin/env node
/**
 * Diagnostic Agent 1 — project_config kênh due scrape + channel_state
 * Usage: node scripts/diagnose-agent1-listening.mjs [--platform=tiktok|fb_page]
 */
import { loadEnv, loadPublicConfig, parseArgs } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';
import { printDiagnostic } from './lib/diagnose-print.mjs';

const INTERVAL_DAYS = loadPublicConfig().channel_scrape_interval_days ?? 7;

function isActive(row) {
  const active = String(row.active ?? 'true').trim().toLowerCase();
  return !(active === 'false' || active === '0' || active === 'no');
}

function splitUrls(row) {
  const urlField = row.url || row.urls || row.profile_url || '';
  return String(urlField)
    .split(/[\n,;]+/)
    .map((u) => u.trim())
    .filter(Boolean);
}

function handleFromUrl(url, platform) {
  const u = String(url || '').trim();
  if (platform === 'tiktok' || platform === 'tt') {
    const m = u.match(/@([^/?#]+)/);
    return (m?.[1] || u).toLowerCase();
  }
  if (platform === 'fb_page' || platform === 'fb_group' || platform === 'fb') {
    try {
      return new URL(u).pathname.replace(/^\//, '').split('/')[0].toLowerCase();
    } catch {
      return u.toLowerCase();
    }
  }
  return u.toLowerCase();
}

async function main() {
  const { opts } = parseArgs();
  const platformFilter = opts.platform ? String(opts.platform).toLowerCase() : null;
  const env = loadEnv();
  const cfg = loadPublicConfig();
  const ms = INTERVAL_DAYS * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const configRows = rowsToObjects(await fetchTab(cfg.project_config_tab || 'project_config', 'A:H')).rows;
  const stateRows = rowsToObjects(await fetchTab(cfg.channel_state_tab || 'channel_state', 'A:D')).rows;
  const stateMap = {};
  for (const s of stateRows) {
    const h = String(s.handle || '').trim().toLowerCase();
    if (h) stateMap[h] = s;
  }

  const reasons = {
    total: 0,
    inactive: 0,
    empty_url: 0,
    wrong_platform: 0,
    scraped_recently: 0,
    eligible: 0,
  };
  const platformCounts = {};
  const samples = [];

  for (const row of configRows) {
    if (!isActive(row)) {
      reasons.inactive += 1;
      continue;
    }
    const platform = String(row.platform || 'tiktok').trim().toLowerCase();
    if (platformFilter && platform !== platformFilter && !(platformFilter === 'tiktok' && platform === 'tt')) {
      reasons.wrong_platform += 1;
      continue;
    }
    for (const url of splitUrls(row)) {
      reasons.total += 1;
      platformCounts[platform] = (platformCounts[platform] || 0) + 1;
      const handle = handleFromUrl(url, platform);
      const prev = stateMap[handle];
      const last = prev?.last_scraped_at ? Date.parse(prev.last_scraped_at) : NaN;
      if (Number.isFinite(last) && now - last < ms) {
        reasons.scraped_recently += 1;
        continue;
      }
      reasons.eligible += 1;
      if (samples.length < 5) {
        samples.push({ project_id: row.project_id, platform, url: url.slice(0, 60), handle });
      }
    }
    if (!splitUrls(row).length) reasons.empty_url += 1;
  }

  console.log('=== Agent 1 — Social Listening diagnostic ===');
  console.log(`Interval: ${INTERVAL_DAYS} ngày · Cron TikTok T2 07:00 · FB T4 07:00`);
  printDiagnostic('Kênh due scrape (schedule run)', reasons, { 'Top platform': platformCounts });
  console.log('\n--- Env VPS cần có ---');
  console.log(`  APIFY_TOKEN: ${env.APIFY_TOKEN ? '(set)' : 'MISSING'}`);
  console.log(`  ANTHROPIC_API_KEY: ${env.ANTHROPIC_API_KEY ? '(set)' : 'MISSING'}`);
  if (samples.length) {
    console.log('\n--- Sample due channels ---');
    for (const s of samples) console.log(JSON.stringify(s));
  } else {
    console.log('\nKhông có kênh due — Manual run vẫn scrape tất cả active channels.');
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
