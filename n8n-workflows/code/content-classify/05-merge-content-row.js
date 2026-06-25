// n8n Code: merge classify → cập nhật fields content_queue

const source = $('Loop Pending Rows').item?.json || $input.first().json;
const wrap = $input.first().json;

if (!wrap.ok || !wrap.classify) {
  return [{
    json: {
      ok: false,
      error: 'MERGE_SKIP',
      sheet_row: source.sheet_row,
      parse_error: wrap.parse_error,
    },
  }];
}

const { segment, score, interest_key } = wrap.classify;
const method = wrap.classify_method || 'llm';

let status = 'classified';
let claude_verdict = 'qualified';

if (segment === 'unclassified' || score < 40) {
  status = 'raw';
  claude_verdict = 'reject';
} else if (score < 60) {
  status = 'review';
  claude_verdict = 'maybe';
} else if (score < 70) {
  claude_verdict = 'maybe';
}

let metaBase = {};
try {
  if (source.meta) metaBase = typeof source.meta === 'string' ? JSON.parse(source.meta) : source.meta;
} catch {
  metaBase = {};
}

const intakeRow = {
  text: source.text,
  segment,
  score,
  platform: source.platform,
  normalized_key: source.normalized_key,
  source: source.source,
  intake_stub_source: 'agent2_classify',
};
const ensured = ensureIntakeV1(intakeRow, metaBase);
metaBase = ensured.meta;
if (ensured.stubbed) metaBase.intake_v1_from = 'stub_agent2';
else if (!metaBase.intake_v1_from) metaBase.intake_v1_from = 'agent1_or_prior';

const meta = JSON.stringify({
  ...metaBase,
  classify_method: method,
  classified_at: new Date().toISOString(),
  needs_llm: false,
  agent: 'agent-2',
}).slice(0, 50000);

return [{
  json: {
    ok: true,
    sheet_row: source.sheet_row,
    normalized_key: source.normalized_key,
    captured_at: source.captured_at,
    source: source.source,
    classify_method: method,
    update: {
      segment,
      score,
      interest_key,
      status,
      claude_verdict,
      tags: segment !== 'unclassified' ? segment : 'unclassified',
      meta,
    },
  },
}];
