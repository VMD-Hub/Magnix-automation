// n8n Code: merge outreach row

const source = $('Loop Outreach Candidates').item?.json || {};
const item = $input.first().json;

if (!item.ok || !item.outreach) {
  return [{ json: { ok: false, error: 'MERGE_SKIP', draft_sheet_row: source.sheet_row } }];
}

const o = item.outreach;
const meta = JSON.stringify({
  l0_hits: item.l0_hits || [],
  ghost_check_passed: o.ghost_check_passed,
  agent: 'agent-4',
  draft_sheet_row: source.sheet_row,
  created_at: new Date().toISOString(),
}).slice(0, 50000);

return [{
  json: {
    ok: true,
    source_normalized_key: source.source_normalized_key,
    draft_sheet_row: source.sheet_row,
    append_row: [
      String(source.source_normalized_key || ''),
      String(source.title || ''),
      String(o.segment || source.segment || ''),
      o.variant_a_cold,
      o.variant_b_after_engagement,
      o.variant_c_follow_up,
      o.ghost_check_passed ? 'true' : 'false',
      o.compliance_note,
      'draft',
      'false',
      new Date().toISOString(),
      'agent4_outreach',
      meta,
    ],
    draft_meta_patch: {
      outreach_created: true,
      outreach_status: 'draft',
      outreach_at: new Date().toISOString(),
    },
  },
}];
