// n8n Code: parse L2 /devil JSON (parse layer bắt buộc)

const VERDICTS = new Set(['pass', 'fail', 'human_review']);
const SEVERITIES = new Set(['critical', 'major', 'minor']);

function extractJsonString(raw) {
  if (raw == null) throw new Error('EMPTY_LLM_OUTPUT');
  const s = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let t = (fenced ? fenced[1] : s).trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return t;
}

const upstream = $input.first().json;
const res = upstream.l2_llm || $input.first().json;
const raw =
  res.choices?.[0]?.message?.content ??
  res.content?.[0]?.text ??
  res.message?.content ??
  res.text ??
  res;

try {
  const parsed = JSON.parse(extractJsonString(raw));
  const verdict = String(parsed.verdict || 'fail').toLowerCase();
  if (!VERDICTS.has(verdict)) throw new Error('INVALID_VERDICT');

  let score = Number(parsed.score ?? 0);
  if (!Number.isFinite(score)) score = 0;

  const issues = Array.isArray(parsed.issues)
    ? parsed.issues.slice(0, 12).map((x) => ({
        severity: SEVERITIES.has(String(x.severity || '').toLowerCase())
          ? String(x.severity).toLowerCase()
          : 'major',
        location: String(x.location || '').slice(0, 200),
        fix_suggestion: String(x.fix_suggestion || '').slice(0, 500),
      }))
    : [];

  const findings = Array.isArray(parsed.devil_findings)
    ? parsed.devil_findings.map(String).slice(0, 12)
    : [];

  let finalVerdict = verdict;
  if (score < 75 && verdict === 'pass') finalVerdict = 'fail';

  return [{
    json: {
      ...upstream,
      l2_ok: true,
      l2_qa: {
        verdict: finalVerdict,
        score,
        devil_findings: findings,
        issues,
      },
    },
  }];
} catch (e) {
  return [{
    json: {
      ...upstream,
      l2_ok: false,
      l2_parse_error: e.message,
      raw_preview: String(raw).slice(0, 200),
    },
  }];
}
