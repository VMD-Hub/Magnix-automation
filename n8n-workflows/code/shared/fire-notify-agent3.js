// n8n Code: fire approval_needed after Agent 3 draft (post Mark Queue Drafted)

const prev = $input.first().json || {};
if (!prev.ok) return [{ json: prev }];

const merge = $('Merge Draft Row').item?.json || {};
const append = $('Sheet Append content_drafts').item?.json || {};
const row = merge.append_row || [];
const title = String(row[3] || merge.queue_meta_patch?.draft_title || 'Lead magnet draft').slice(0, 120);
const segment = String(row[2] || '').slice(0, 40);
const source_key = String(merge.source_normalized_key || 'unknown');
const sheet_row = Number(append.draft_sheet_row || 0);

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const sheet_tab = '__CONTENT_DRAFTS_TAB__';
const approval_fields = ['status=approved'];

const body = {
  event_id: `agent3:content_drafts:${source_key}:approval_needed`,
  event_type: 'approval_needed',
  agent: 'agent3',
  severity: 'action_required',
  product_type: 'lead_magnet',
  target_channel: 'facebook_page',
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
