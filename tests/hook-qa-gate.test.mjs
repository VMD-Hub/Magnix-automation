#!/usr/bin/env node
/**
 * Hook Completion Gate + Social Mechanics tests
 * Run: node tests/hook-qa-gate.test.mjs
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runHookCompletionGate } from '../n8n-workflows/code/shared/hook-qa-gate.mjs';
import {
  detectPureCommentBait,
  checkFacebookTruncation,
  buildHashtags,
} from '../n8n-workflows/code/shared/social-mechanics.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ctaCfg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../n8n-workflows/cta_templates.json'), 'utf8'),
);

// --- Pure comment bait ---
{
  const pure = detectPureCommentBait({
    hook_line: 'Cập nhật mới trong tuần này.',
    artifact_markdown: 'Theo tin tức, nhiều người đang tìm hiểu thêm.',
    cta_opt_in: 'Comment "NOXH" để mình gửi Checklist hồ sơ NOXH qua tin nhắn.',
  }, ctaCfg);
  assert.equal(pure.risk_comment_bait_pure, true);
}

{
  const ok = detectPureCommentBait({
    hook_line: 'Lương 8 triệu có đủ điều kiện mua NOXH không?',
    artifact_markdown: 'Checklist hồ sơ giúp bạn tự rà trước khi nộp.',
    cta_opt_in: 'Comment "NOXH" để mình gửi Checklist hồ sơ NOXH qua tin nhắn.',
  }, ctaCfg);
  assert.equal(ok.risk_comment_bait_pure, false);
}

// --- FB truncation ---
{
  const filler = 'A'.repeat(130);
  const longWeak = checkFacebookTruncation(
    `${filler} — phần quan trọng chỉ xuất hiện ở cuối câu rất dài sau điểm cắt mobile feed.`,
    ctaCfg,
  );
  assert.equal(longWeak.hook_truncation_risk, true);
}

{
  const longStrong = checkFacebookTruncation(
    'Lương 8 triệu/tháng có đủ điều kiện mua NOXH không? Nhiều người tưởng mình không đủ nhưng thực tế còn phụ thuộc vào khu vực và diện tích căn hộ đăng ký mua.',
    ctaCfg,
  );
  assert.equal(longStrong.hook_truncation_risk, false);
}

// --- Hashtags ---
{
  const tags = buildHashtags('NOXH_LEGAL', ctaCfg);
  assert.ok(tags.hashtags.length >= 2);
  assert.ok(tags.hashtags.every((t) => t.startsWith('#')));
  assert.ok(!tags.hashtags.some((t) => t.toLowerCase().includes('viral')));
}

// --- Full gate ---
{
  const out = runHookCompletionGate({
    draft: {
      hook_line: 'chờ biên tập từ listening/brief.',
      artifact_markdown: 'Body',
      cta_opt_in: '',
      content_type: 'NOXH_LEGAL',
    },
    channel: 'facebook',
    ctaCfg,
    commentUnlockIndex: [],
  });
  assert.equal(out.hook_qa_blocked, true);
}

{
  const out = runHookCompletionGate({
    draft: {
      hook_line: 'Lương 8 triệu có đủ điều kiện mua NOXH không?',
      artifact_markdown: '## Chi tiết\n\nChecklist giúp rà hồ sơ trước khi nộp.',
      cta_opt_in: 'Comment "NOXH" để mình gửi Checklist hồ sơ NOXH qua tin nhắn.',
      content_type: 'NOXH_LEGAL',
    },
    channel: 'facebook',
    ctaCfg,
    commentUnlockIndex: [
      { created_at: new Date().toISOString() },
      { created_at: new Date(Date.now() - 86400000).toISOString() },
      { created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    ],
  });
  assert.equal(out.hook_qa_pass, true);
  assert.equal(out.hook_needs_review, true);
  assert.ok(out.hook_qa.flags.includes('risk_comment_unlock_frequency'));
}

console.log('hook-qa-gate.test.mjs — all passed');
