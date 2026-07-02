#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isAgent3Candidate, isAgent6Candidate } from '../n8n-workflows/code/shared/format-routing.mjs';
import { findCoverageOverlap } from '../n8n-workflows/code/shared/content-coverage-map.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, '../n8n-workflows/format_routing.json'), 'utf8'));

assert.equal(isAgent3Candidate('fb_page_post_image', cfg), true);
assert.equal(isAgent3Candidate('fb_reels', cfg), false);
assert.equal(isAgent6Candidate('fb_reels', cfg), true);

const overlap = findCoverageOverlap(
  { title: 'DTI và room vay trước khi nộp hồ sơ' },
  {
    byTopic: {
      dti: [{ title: 'A' }, { title: 'B' }],
    },
  },
);
assert.equal(overlap.overlap, true);
assert.ok(overlap.overlaps.some((o) => o.topic === 'dti'));

console.log('remediation-audit.test.mjs — all passed');
