// n8n Code: merge draft row + mark queue

const source = $('Loop Draft Candidates').item?.json || {};
const item = $input.first().json;

if (!item.ok || !item.draft) {
  return [{ json: { ok: false, error: 'MERGE_SKIP', sheet_row: source.sheet_row } }];
}

const d = item.draft;
const meta = JSON.stringify({
  source_refs: d.source_refs,
  l0_hits: item.l0_hits || [],
  agent: 'agent-3',
  source_post_url: source.post_url,
  created_at: new Date().toISOString(),
}).slice(0, 50000);

return [{
  json: {
    ok: true,
    source_normalized_key: source.normalized_key,
    queue_sheet_row: source.sheet_row,
    append_row: [
      String(source.normalized_key || ''),
      String(source.post_id || ''),
      String(d.segment || source.segment || ''),
      d.title,
      d.hook_line,
      d.artifact_markdown,
      d.cta_opt_in,
      d.disclaimer,
      d.export_hint,
      'draft',
      'L0',
      new Date().toISOString(),
      'agent3_lead_magnet',
      meta,
    ],
    queue_meta_patch: {
      draft_created: true,
      draft_status: 'draft',
      draft_title: d.title,
      draft_at: new Date().toISOString(),
    },
  },
}];
