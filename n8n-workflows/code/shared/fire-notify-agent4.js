// n8n Code: fire approval_needed after Agent 4 outreach append

const prev = $input.first().json || {};
if (!prev.ok) return [{ json: prev }];

const merge = $('Merge Outreach Row').item?.json || {};
const append = $('Sheet Append outreach_queue').item?.json || {};
const row = merge.append_row || [];
const title = String(row[1] || 'Outreach draft').slice(0, 120);
const segment = String(row[2] || '').slice(0, 40);
const source_key = String(merge.source_normalized_key || 'unknown');
const sheet_row = Number(append.outreach_sheet_row || 0);

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const sheet_tab = '__OUTREACH_QUEUE_TAB__';
const approval_fields = ['l3_approved=true'];

const body = {
  event_id: `agent4:outreach_queue:${source_key}:approval_needed`,
  event_type: 'approval_needed',
  agent: 'agent4',
  severity: 'action_required',
  product_type: 'outreach_reply',
  target_channel: 'zalo_dm',
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
