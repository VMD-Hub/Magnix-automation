#!/usr/bin/env node
/** Liệt kê element names trong Creatomate template */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = {};
for (const line of fs.readFileSync(path.join(root, 'n8n-workflows/.env'), 'utf8').split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i > 0) env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}

const cfg = JSON.parse(fs.readFileSync(path.join(root, 'n8n-workflows/magnix-public-config.json'), 'utf8'));
const tpl = env.CREATOMATE_TEMPLATE_ID || cfg.creatomate_template_id;
const key = env.CREATOMATE_API_KEY;

const res = await fetch(`https://api.creatomate.com/v1/templates/${tpl}`, {
  headers: { Authorization: `Bearer ${key}` },
});
const j = await res.json();
if (!res.ok) {
  console.error('API error', j);
  process.exit(1);
}

console.log('Template:', j.name, '| id:', tpl);
const src = typeof j.source === 'string' ? j.source : JSON.stringify(j.source || {});
const names = [...src.matchAll(/"name"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
const unique = [...new Set(names)];
console.log('\nElement names trong template (' + unique.length + '):');
for (const n of unique) console.log('  -', n);

const mod = cfg.creatomate_modifications || {};
console.log('\nMagnix config đang map tới:');
for (const [k, v] of Object.entries(mod)) {
  const ok = unique.includes(v) ? '✓' : '✗ KHÔNG KHỚP';
  console.log(`  ${k} → "${v}" ${ok}`);
}
