// n8n Code: route a deduplicated legal_source_needed event after metadata persists.

const item = $('Merge Legal Block Meta').item?.json || {};
const previous = $input.first().json || {};
if (previous.error) {
  return [{
    json: {
      ok: false,
      legal_blocked: true,
      notify_skipped: true,
      reason: 'BLOCKED_META_PERSIST_FAILED',
      error: previous.error,
    },
  }];
}
const eventId = `layer-b:content_queue:${item.normalized_key || `row_${item.sheet_row}`}:legal_source_needed`;
const body = {
  event_id: eventId,
  event_type: 'legal_source_needed',
  agent: 'layer_b',
  severity: 'action_required',
  title: item.title || 'Legal source needed',
  segment: item.segment,
  product_type: 'editorial_brief',
  target_channel: 'content_pipeline',
  sheet_tab: '__CONTENT_QUEUE_TAB__',
  sheet_row: item.sheet_row,
  source_row_key: item.normalized_key || `row_${item.sheet_row}`,
  approval_fields: ['bổ sung Legal KB', 'meta.legal_gate_retry_requested=true'],
  due_at: new Date(Date.now() + 3600000).toISOString(),
};

return fireNotify(body, {
  ...previous,
  ok: previous.error == null,
  legal_blocked: true,
  legal_gate: item.legal_gate,
  sheet_row: item.sheet_row,
  normalized_key: item.normalized_key,
});
