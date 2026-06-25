#!/usr/bin/env node
/** Unit test: Pexels stock_query EN validation (Agent 7) */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const code = fs.readFileSync(
  path.join(root, 'n8n-workflows/code/shared/pexels-stock-query.js'),
  'utf8'
);
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const {
  validateBeatsRenderSpec,
  resolvePexelsStockQuery,
  isEnglishStockQuery,
} = sandbox;

const legacyBeats = [
  { spoken: 'test', visual: 'Cận mặt người trẻ đang nhìn điện thoại' },
  { spoken: 'test', visual: 'Montage nhà NOXH' },
  { spoken: 'test', visual: 'Text animation' },
  { spoken: 'test', visual: 'CTA phone' },
];

const v3Beats = [
  {
    role: 'hook',
    visual_spec: { type: 'broll', stock_query: 'Vietnamese couple phone apartment keys' },
  },
  {
    role: 'value',
    visual_spec: { type: 'broll', stock_query: 'Vietnam apartment living room interior' },
  },
  {
    role: 'proof',
    visual_spec: { type: 'broll', stock_query: 'mortgage documents calculator desk no people' },
  },
  {
    role: 'cta',
    visual_spec: { type: 'broll', stock_query: 'Hanoi skyline sunset apartment' },
  },
];

let failed = 0;

const legacy = validateBeatsRenderSpec(legacyBeats);
if (legacy.ok) {
  console.error('FAIL: legacy beats should be rejected');
  failed += 1;
} else {
  console.log('OK: legacy rejected', legacy.errors[0]?.code);
}

const v3 = validateBeatsRenderSpec(v3Beats);
if (!v3.ok) {
  console.error('FAIL: v3 beats should pass', v3.errors);
  failed += 1;
} else {
  console.log('OK: v3 beats accepted');
}

const vnQuery = isEnglishStockQuery('Cận mặt người trẻ phone');
if (vnQuery) {
  console.error('FAIL: Vietnamese query should fail isEnglishStockQuery');
  failed += 1;
} else {
  console.log('OK: Vietnamese query rejected');
}

const resolved = resolvePexelsStockQuery(v3Beats[0], 'noxh_income');
if (!resolved || !resolved.toLowerCase().includes('vietnamese')) {
  console.error('FAIL: resolve should prefix Vietnamese for noxh hook', resolved);
  failed += 1;
} else {
  console.log('OK: resolve query', resolved);
}

if (failed) process.exit(1);
console.log('\nAll pexels-stock-query tests passed');
