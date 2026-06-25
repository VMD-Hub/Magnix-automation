// n8n Code: aggregate execution summary (no PII in logs)

const items = $input.all().map((i) => i.json);

const empty = items.find((i) => i.empty === true);
if (empty && items.length === 1) {
  return [{
    json: {
      ok: true,
      storage: 'sheet_content_scorecard',
      processed: 0,
      scaled: 0,
      fix: 0,
      kill: 0,
      hub_candidate: 0,
      failed: 0,
      message: empty.message,
    },
  }];
}

let processed = 0;
let scaled = 0;
let fix = 0;
let kill = 0;
let hub = 0;
let failed = 0;
const highlights = [];

for (const item of items) {
  if (item.ok === false && item.error) {
    failed += 1;
    continue;
  }
  if (!item.verdict && item.scorecard?.verdict) {
    item.verdict = item.scorecard.verdict;
  }
  if (!item.post_id) continue;

  processed += 1;
  const v = item.verdict || item.scorecard?.verdict;
  if (v === 'scale') scaled += 1;
  else if (v === 'fix') fix += 1;
  else if (v === 'kill') kill += 1;
  else if (v === 'hub_candidate') hub += 1;

  if (v === 'hub_candidate' || v === 'scale') {
    highlights.push({
      post_id: item.post_id,
      verdict: v,
      performance_score: item.performance_score ?? item.scorecard?.performance_score,
      ivi_pct: item.ivi_pct ?? item.scorecard?.ivi_pct,
    });
  }
}

return [{
  json: {
    ok: true,
    storage: 'sheet_content_scorecard',
    processed,
    scaled,
    fix,
    kill,
    hub_candidate: hub,
    failed,
    highlights: highlights.slice(0, 10),
    analyzed_at: new Date().toISOString(),
  },
}];
