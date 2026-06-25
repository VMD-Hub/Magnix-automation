// n8n Code: normalize → Magnix content_queue record
// Quyết định: segment=unclassified (dữ liệu Apify thô; classify segment ở Mạch 1 / sau)

function safeKey(platform, postId) {
  const p = String(platform || 'unknown').replace(/[^a-z0-9_]/gi, '_');
  const id = String(postId || 'unknown').replace(/[^a-zA-Z0-9._-]/g, '_');
  return `apify:${p}:${id}`;
}

const item = $input.first().json;
if (!item.ok) {
  return [{ json: { ok: false, error: 'SKIP_NORMALIZE', message: item.parse_error || 'upstream_fail' } }];
}

const platform = String(item.platform || 'unknown').trim().toLowerCase();
const post_id = String(item.post_id || '').trim();
if (!post_id) {
  return [{ json: { ok: false, error: 'MISSING_POST_ID' } }];
}

const verdict = item.claude?.verdict || 'reject';
const score = Number(item.claude?.score ?? item.intake_v1?.score ?? 0);
const captured_at = new Date().toISOString();
const intake = item.intake_v1 || item.claude?.intake_v1 || null;

const status =
  verdict === 'qualified' ? 'qualified' : verdict === 'maybe' ? 'raw' : 'rejected';

const segmentHint = intake?.content_signals?.segment_hint;
const tags = ['unclassified', platform];
if (segmentHint && segmentHint !== 'unclassified') tags.push(segmentHint);

const record = {
  normalized_key: safeKey(platform, post_id),
  post_id,
  platform,
  post_url: String(item.post_url || ''),
  author_id: String(item.author_id || ''),
  text: String(item.text || '').slice(0, 50000),
  segment: 'unclassified',
  score,
  claude_verdict: verdict,
  interest_key: intake?.content_signals?.cta_keyword_hint
    ? String(intake.content_signals.cta_keyword_hint).toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 80)
    : 'unknown',
  status,
  captured_at,
  source: 'apify_social_listen',
  tags,
  meta: {
    intake_v1: intake,
    intake_at: intake ? captured_at : null,
    claude: item.claude,
    apify_preview: {
      post_id,
      post_url: item.post_url,
      text_len: (item.text || '').length,
      engagement: item.engagement || null,
    },
    config_notes: item.config_notes || '',
  },
};

return [{ json: { ok: true, record } }];
