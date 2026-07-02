#!/usr/bin/env node
/**
 * Video Script Schema + QA Gate tests
 * Run: node tests/video-script-qa-gate.test.mjs
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runVideoScriptQaGate } from '../n8n-workflows/code/shared/video-script-qa-gate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sample = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'fixtures/video-script-noxh-legal-sample.json'),
    'utf8',
  ),
);

const good = runVideoScriptQaGate({
  script: sample,
  content_type: 'NOXH_LEGAL',
});
assert.equal(good.video_script_qa_pass, true);
assert.equal(good.video_script_qa_blocked, false);
assert.equal(good.video_script.format_type, 'video_script');
assert.ok(good.video_script_needs_review);

const bad = runVideoScriptQaGate({
  script: {
    format_type: 'video_script',
    visual_hook: 'Một cảm giác lo lắng',
    verbal_hook: 'Xin chào các bạn hôm nay mình sẽ nói về NOXH',
    body_beats: [{ timestamp: '0-5s', spoken_line: 'test' }],
    target_length_seconds: 30,
  },
  content_type: 'NOXH_LEGAL',
});
assert.equal(bad.video_script_qa_blocked, true);

console.log('video-script-qa-gate.test.mjs — all passed');
