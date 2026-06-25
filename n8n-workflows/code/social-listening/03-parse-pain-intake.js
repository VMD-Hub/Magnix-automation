// n8n Code: parse Pain Intake JSON (Layer A — Agent 1)

const VERDICTS = new Set(['qualified', 'maybe', 'reject']);
const SEGMENTS = new Set([
  'noxh_income', 'valuation', 'sme_credit', 'general_inbound', 'unclassified',
]);
const STAGES = new Set(['awareness', 'consideration', 'decision']);
const HEAT = new Set(['low', 'medium', 'high']);

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

function getLlmText(input) {
  const j = input.json || input;
  return j.content?.[0]?.text || j.message?.content || j.text || j.output || j;
}

function upstreamPost() {
  return (
    $('Filter New Posts').item?.json ||
    $('Wrap Apify Response').item?.json ||
    $('Wrap FB Response').item?.json ||
    {}
  );
}

const upstream = upstreamPost();
const raw = getLlmText($input.first());

try {
  const parsed = JSON.parse(extractJsonString(raw));
  const verdict = String(parsed.verdict || 'reject').toLowerCase();
  if (!VERDICTS.has(verdict)) throw new Error('INVALID_VERDICT');

  const score = Number(parsed.score ?? 0);
  if (!Number.isFinite(score) || score < 0 || score > 100) throw new Error('INVALID_SCORE');

  const conv = parsed.conversation || {};
  const signals = parsed.content_signals || {};
  const segmentHint = String(signals.segment_hint || 'unclassified').toLowerCase();

  const intake_v1 = {
    intake_version: Number(parsed.intake_version || 1),
    verdict,
    score,
    reject_reason: parsed.reject_reason ? String(parsed.reject_reason).slice(0, 1000) : null,
    summary: String(parsed.summary || '').slice(0, 2000),
    conversation: {
      surface_topic: String(conv.surface_topic || '').slice(0, 500),
      explicit_questions: Array.isArray(conv.explicit_questions)
        ? conv.explicit_questions.map((q) => String(q).slice(0, 300)).slice(0, 8)
        : [],
      implicit_fears: Array.isArray(conv.implicit_fears)
        ? conv.implicit_fears.map((x) => String(x).slice(0, 200)).slice(0, 6)
        : [],
      misconceptions: Array.isArray(conv.misconceptions)
        ? conv.misconceptions.map((x) => String(x).slice(0, 200)).slice(0, 6)
        : [],
      journey_stage: STAGES.has(String(conv.journey_stage || '').toLowerCase())
        ? String(conv.journey_stage).toLowerCase()
        : 'consideration',
      audience_voice: String(conv.audience_voice || '').slice(0, 300),
    },
    content_signals: {
      pain_intensity: Math.min(100, Math.max(0, Number(signals.pain_intensity || score) || 0)),
      discussion_heat: HEAT.has(String(signals.discussion_heat || '').toLowerCase())
        ? String(signals.discussion_heat).toLowerCase()
        : 'medium',
      inbound_potential: String(signals.inbound_potential || 'low').slice(0, 40),
      segment_hint: SEGMENTS.has(segmentHint) ? segmentHint : 'unclassified',
      evidence_quotes: Array.isArray(signals.evidence_quotes)
        ? signals.evidence_quotes.map((q) => String(q).slice(0, 120)).slice(0, 3)
        : [],
      single_insight_clip: signals.single_insight_clip !== false,
      hook_candidate: String(signals.hook_candidate || '').slice(0, 120),
      cta_keyword_hint: String(signals.cta_keyword_hint || 'CHECKLIST').slice(0, 40),
    },
    compliance_flags: Array.isArray(parsed.compliance_flags)
      ? parsed.compliance_flags.map(String).slice(0, 8)
      : [],
  };

  return [{
    json: {
      ok: true,
      ...upstream,
      intake_v1,
      claude: {
        verdict,
        score,
        summary: intake_v1.summary,
        reject_reason: intake_v1.reject_reason,
        intake_v1,
      },
    },
  }];
} catch (e) {
  return [{
    json: {
      ok: false,
      parse_error: e.message,
      ...upstream,
      claude: {
        verdict: 'reject',
        score: 0,
        summary: '',
        reject_reason: 'parse_failed',
        intake_v1: null,
      },
    },
  }];
}
