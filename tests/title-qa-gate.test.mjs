#!/usr/bin/env node
/**
 * Title QA Gate — real bad titles + duplication
 * Run: node tests/title-qa-gate.test.mjs
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateTitle,
  validateTitleCapitalization,
  runTitleQaGate,
  jaccardSimilarity,
  getTitleFormulaInstruction,
} from '../n8n-workflows/code/shared/title-qa-gate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rulesCfg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../n8n-workflows/title_rules.json'), 'utf8'),
);
const whitelist = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../.cursor/title_whitelist.json'), 'utf8'),
);

function llmPayload(title, content_type = 'NOXH_LEGAL', segment = 'noxh_income') {
  return {
    choices: [{
      message: {
        content: JSON.stringify({
          title,
          hook_line: 'Hook mẫu',
          segment,
          content_type,
          artifact_markdown: '## Body\n\nNội dung.',
          cta_opt_in: '',
          disclaimer: '',
        }),
      },
    }],
  };
}

const badTitles = [
  {
    title: '[TEST] Điều kiện thu nhập mua NOXH — ai được hưởng?',
    expect: /Draft tag/,
  },
  {
    title: 'Lương X triệu có đủ điều kiện mua NOXH không?',
    expect: /X triệu/,
  },
  {
    title: '📂 Kho mẫu NOXH cập nhật: Comment MAU01 nhận link Drive folder',
    expect: /CTA content found/,
  },
];

for (const c of badTitles) {
  const v = validateTitle(c.title, { whitelist });
  assert.equal(v.pass, false, `should reject: ${c.title.slice(0, 40)}`);
  assert.ok(v.reasons.some((r) => c.expect.test(r)), `reason match: ${c.title.slice(0, 40)}`);

  const gate = runTitleQaGate({
    llmJson: llmPayload(c.title),
    normalized_key: 'test:bad',
    rulesCfg,
    whitelist,
  });
  assert.equal(gate.title_qa_pass, false);
  assert.equal(gate.qa_status, 'title_rejected');
  assert.ok(gate.title_qa_reason);
}

const goodTitle = 'Thu nhập 15 triệu có đủ điều kiện mua NOXH tại TP.HCM không?';
const good = runTitleQaGate({
  llmJson: llmPayload(goodTitle),
  normalized_key: 'test:good',
  publishedByType: {},
  rulesCfg,
  whitelist,
});
assert.equal(good.title_qa_pass, true);
assert.equal(good.title_duplicate_review, false);

const published = {
  NOXH_LEGAL: [{
    title: 'Thu nhập 15 triệu đủ điều kiện mua NOXH TP.HCM không?',
    normalized_key: 'old:001',
  }],
};
const dup = runTitleQaGate({
  llmJson: llmPayload(goodTitle),
  normalized_key: 'test:dup',
  publishedByType: published,
  rulesCfg,
  whitelist,
});
assert.equal(dup.title_qa_pass, true, 'duplicate is soft gate — still passes title QA');
assert.equal(dup.title_duplicate_review, true);
assert.ok(dup.title_qa.duplicate_message.includes('trùng chủ đề'));

const score = jaccardSimilarity(goodTitle, published.NOXH_LEGAL[0].title);
assert.ok(score > 0.7, `jaccard should exceed threshold: ${score}`);

assert.ok(getTitleFormulaInstruction('NOXH_LEGAL', rulesCfg).includes('câu hỏi'));
assert.ok(getTitleFormulaInstruction('LOAN_FINANCE', rulesCfg).includes('DTI'));

const capPass = [
  'Lương 8 triệu/tháng có đủ điều kiện mua NOXH không?',
  'DTI là gì và vì sao quyết định bạn vay được bao nhiêu',
  '5 câu hỏi nên hỏi CĐT trước khi nộp hồ sơ NOXH',
  'Kho mẫu NOXH cập nhật mới nhất',
];

for (const title of capPass) {
  const cap = validateTitleCapitalization(title, whitelist);
  assert.equal(cap.pass, true, `cap PASS: ${title}`);
  const v = validateTitle(title, { whitelist });
  assert.equal(v.pass, true, `full PASS: ${title}`);
}

const capFail = [
  {
    title: 'ĐIỀU KIỆN THU NHẬP MUA NOXH — CẦN XÉT ĐỦ TIÊU CHÍ',
    expectStatus: 'title_capitalization_error',
  },
  {
    title: 'Kho Mẫu NOXH Cập Nhật Mới Nhất',
    expectStatus: 'title_capitalization_error',
  },
];

for (const c of capFail) {
  const cap = validateTitleCapitalization(c.title, whitelist);
  assert.equal(cap.pass, false, `cap FAIL: ${c.title}`);
  const gate = runTitleQaGate({
    llmJson: llmPayload(c.title),
    normalized_key: 'test:cap',
    rulesCfg,
    whitelist,
  });
  assert.equal(gate.title_qa_pass, false);
  assert.equal(gate.qa_status, c.expectStatus);
  assert.ok(gate.title_qa.capitalization_error);
}

console.log('title-qa-gate.test.mjs — all passed');
