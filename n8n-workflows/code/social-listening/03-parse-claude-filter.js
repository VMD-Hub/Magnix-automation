// n8n Code: parse Claude filter JSON — parse layer bắt buộc
// Schema: { verdict, score, summary, reject_reason } — KHÔNG segment (giữ unclassified)

const VERDICTS = new Set(['qualified', 'maybe', 'reject']);

function extractJsonString(raw) {
  if (raw == null) throw new Error('EMPTY_LLM_OUTPUT');
  const s = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : s).trim();
}

function getLlmText(input) {
  const j = input.json || input;
  return (
    j.content?.[0]?.text ||
    j.message?.content ||
    j.text ||
    j.output ||
    j
  );
}

const upstream = $('Wrap Apify Response').item?.json || {};
const raw = getLlmText($input.first());

try {
  const parsed = JSON.parse(extractJsonString(raw));
  const verdict = String(parsed.verdict || 'reject').toLowerCase();
  if (!VERDICTS.has(verdict)) throw new Error('INVALID_VERDICT');

  const score = Number(parsed.score ?? 0);
  if (!Number.isFinite(score) || score < 0 || score > 100) throw new Error('INVALID_SCORE');

  return [{
    json: {
      ok: true,
      ...upstream,
      claude: {
        verdict,
        score,
        summary: String(parsed.summary || '').slice(0, 2000),
        reject_reason: parsed.reject_reason ? String(parsed.reject_reason).slice(0, 1000) : null,
      },
    },
  }];
} catch (e) {
  return [{
    json: {
      ok: false,
      parse_error: e.message,
      ...upstream,
      claude: { verdict: 'reject', score: 0, summary: '', reject_reason: 'parse_failed' },
    },
  }];
}
