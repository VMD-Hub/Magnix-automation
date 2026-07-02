#!/usr/bin/env node
/**
 * Gọi n8n webhook viết bài HouseX PR (chuẩn phong cách editorial).
 *
 * Env:
 *   MAGNIX_WEBHOOK_BASE — vd. https://n8n.example.com/webhook
 *   MAGNIX_WEBHOOK_TOKEN — Bearer token (optional nếu VPS không bật auth)
 *
 * Usage:
 *   node scripts/trigger-housex-article.mjs --topic "TOD Nhon Trach ga quy hoach" --angle tod
 *   node scripts/trigger-housex-article.mjs --topic "..." --project dta-happy-home-nhon-trach --closing gaQuyHoach
 *   node scripts/trigger-housex-article.mjs --file brief.json
 */

const args = process.argv.slice(2);

function getArg(name, fallback = '') {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  return args[i + 1] ?? fallback;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

async function main() {
  const base = (process.env.MAGNIX_WEBHOOK_BASE || '').replace(/\/$/, '');
  if (!base) {
    console.error('Thiếu MAGNIX_WEBHOOK_BASE (vd. https://n8n.example.com/webhook)');
    process.exit(1);
  }

  let payload;
  const file = getArg('file');
  if (file) {
    const fs = await import('fs');
    payload = JSON.parse(fs.readFileSync(file, 'utf8'));
  } else {
    const topic = getArg('topic');
    if (!topic) {
      console.error('Cần --topic "..." hoặc --file brief.json');
      process.exit(1);
    }
    payload = {
      topic,
      angle: getArg('angle', 'tod'),
      project_slug: getArg('project', 'dta-happy-home-nhon-trach'),
      closing_variant: getArg('closing', ''),
      segment: getArg('segment', 'noxh_income'),
      source: 'cursor-cli',
      source_refs: getArg('ref')
        ? [getArg('ref')]
        : [],
      factsheet: {},
    };
    if (!payload.closing_variant) delete payload.closing_variant;
  }

  const url = `${base}/magnix/housex-article`;
  const headers = { 'Content-Type': 'application/json' };
  const token = process.env.MAGNIX_WEBHOOK_TOKEN || '';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    console.error('HTTP', res.status, json);
    process.exit(1);
  }

  console.log(JSON.stringify(json, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
