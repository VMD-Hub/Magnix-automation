/**
 * Intake stub từ dòng content_queue đã classify (archive / Agent 2)
 * — đồng bộ với scripts/lib/pipeline-intake-stub.mjs
 * Dùng khi meta thiếu intake_v1 từ Agent 1 pain intake.
 */

function extractQuestion(text) {
  const t = String(text || '').trim();
  if (!t) return [];
  const parts = t.split(/[?？]/).map((s) => s.trim()).filter(Boolean);
  if (parts.length > 1) {
    return parts.slice(0, -1).map((p) => `${p}?`.slice(0, 300)).slice(0, 3);
  }
  if (/[?？]/.test(t)) return [t.slice(0, 300)];
  return [];
}

function buildIntakeStubFromRow(row) {
  const text = String(row.text || '').trim();
  const segment = String(row.segment || 'general_inbound').trim().toLowerCase();
  const score = Number(row.score || 0);
  const platform = String(row.platform || 'tiktok').trim().toLowerCase();
  const questions = extractQuestion(text);
  const summary = text.slice(0, 500);

  return {
    intake_version: 1,
    verdict: score >= 70 ? 'qualified' : score >= 40 ? 'maybe' : 'reject',
    score,
    reject_reason: null,
    summary,
    conversation: {
      surface_topic: summary.slice(0, 200),
      explicit_questions: questions.length ? questions : [summary.slice(0, 120)],
      implicit_fears: [],
      misconceptions: [],
      journey_stage: 'consideration',
      audience_voice: text.slice(0, 300),
    },
    content_signals: {
      pain_intensity: Math.min(100, Math.max(0, score)),
      discussion_heat: score >= 75 ? 'high' : 'medium',
      inbound_potential: score >= 70 ? 'medium' : 'low',
      segment_hint: segment,
      evidence_quotes: text ? [text.slice(0, 120)] : [],
      single_insight_clip: true,
      hook_candidate: text.slice(0, 80),
      cta_keyword_hint: segment === 'noxh_income' ? 'NOXH' : 'CHECKLIST',
    },
    compliance_flags: [],
    _stub: true,
    _stub_source: String(row.intake_stub_source || row.source || 'classified_row'),
    _stub_platform: platform,
    _stub_normalized_key: String(row.normalized_key || ''),
  };
}

function ensureIntakeV1(row, meta) {
  if (meta?.intake_v1 && typeof meta.intake_v1 === 'object') {
    return { meta, intake_v1: meta.intake_v1, stubbed: false };
  }
  const intake_v1 = buildIntakeStubFromRow(row);
  const next = { ...meta, intake_v1, intake_stub_at: new Date().toISOString() };
  return { meta: next, intake_v1, stubbed: true };
}
