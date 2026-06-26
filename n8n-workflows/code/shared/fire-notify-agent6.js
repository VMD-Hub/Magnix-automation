// n8n Code: fire approval_needed after Agent 6 video_drafts append

const prev = $input.first().json || {};
if (!prev.ok) return [{ json: prev }];

const merge = $('Merge Video Row').item?.json || {};
const put = $('Resolve Video Put Row').item?.json || {};
const row = merge.append_row || [];
const title = String(row[4] || merge.queue_meta_patch?.video_draft_title || 'Video script draft').slice(0, 120);
const segment = String(row[3] || '').slice(0, 40);
const platform = String(row[2] || 'tiktok').slice(0, 40);
const source_key = String(merge.source_normalized_key || prev.source_normalized_key || 'unknown');
const sheet_row = Number(put.target_row || prev.target_row || 0);

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const sheet_tab = '__VIDEO_DRAFTS_TAB__';
const approval_fields = ['status=approved', 'l3_approved=true'];

const body = {
  event_id: `agent6:video_drafts:row_${sheet_row || source_key}:approval_needed`,
  event_type: 'approval_needed',
  agent: 'agent6',
  severity: 'action_required',
  product_type: 'short_video_package',
  target_channel: platform,
  title,
  segment,
  source_row_key: source_key,
  sheet_tab,
  sheet_row,
  approval_fields,
  review_url: buildReviewUrl(SHEET_ID, sheet_tab, sheet_row, approval_fields),
  due_at: new Date(Date.now() + 2 * 3600000).toISOString(),
};

return fireNotify(body, prev);
