#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(
  path.join(root, 'n8n-workflows/code/shared/resolve-outreach-context.js'),
  'utf8',
);

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const { resolveOutreachContext, primaryVariantForContext } = sandbox;

function assertContext(row, expected) {
  const got = resolveOutreachContext(row);
  assert.equal(got.warmth, expected.warmth);
  assert.equal(got.context, expected.context);
}

assertContext({ meta: '{}' }, { warmth: 'cold', context: 'cold' });
assertContext({ meta: { outreach_warmth: 'commented' } }, {
  warmth: 'commented',
  context: 'sau_comment',
});
assertContext({ meta: { warmth: 'partner' } }, { warmth: 'partner', context: 'cold' });
assertContext(
  { meta: { outreach_warmth: 'cold', outreach_context: 'follow_up' } },
  { warmth: 'cold', context: 'follow_up' },
);
assert.equal(primaryVariantForContext('sau_comment'), 'variant_b_after_engagement');
assert.equal(primaryVariantForContext('cold'), 'variant_a_cold');

console.log('resolve-outreach-context.test.mjs — OK');
