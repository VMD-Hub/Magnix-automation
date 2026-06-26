// n8n Code: fire render_review_needed after Agent 7 render OK

const prev = $input.first().json || {};
if (!prev.ok || !prev.sheet_ok) return [{ json: prev }];

const prep = $('Prepare Sheet Update').item?.json || {};
const title = String($('Loop Render Candidates').item?.json?.title || 'Video render').slice(0, 120);
const segment = String($('Loop Render Candidates').item?.json?.segment || '').slice(0, 40);
const sheet_row = Number(prev.sheet_row || prep.sheet_row || 0);
const source_key = String(prev.source_normalized_key || 'unknown');
const preview_url = String(prev.render_url || prep.render_url || prep.render_meta_patch?.drive_view_url || '').slice(0, 500);

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const sheet_tab = '__VIDEO_DRAFTS_TAB__';
const approval_fields = ['xem MP4', 'status=published hoặc rejected'];

const body = {
  event_id: `agent7:video_drafts:row_${sheet_row}:render_review_needed`,
  event_type: 'render_review_needed',
  agent: 'agent7',
  severity: 'action_required',
  product_type: 'short_video_package',
  target_channel: String(prep.render_meta_patch?.render_platform || 'tiktok'),
  title,
  segment,
  source_row_key: source_key,
  sheet_tab,
  sheet_row,
  preview_url,
  approval_fields,
  review_url: buildReviewUrl(SHEET_ID, sheet_tab, sheet_row, ['status=published']),
  due_at: new Date(Date.now() + 2 * 3600000).toISOString(),
};

return fireNotify(body, prev);
