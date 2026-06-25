// n8n Code: sau HTTP append — bump stats hoặc sheet_fail (Agent 6)

const res = $input.first().json || {};
const put = $('Resolve Video Put Row').item?.json || {};
const merge = $('Merge Video Row').item?.json || {};
const data = $getWorkflowStaticData('global');
if (!data.a6_stats) {
  data.a6_stats = { video_ok: 0, sheet_fail: 0, l0_fail: 0, parse_fail: 0, llm_fail: 0 };
}

const failed = Boolean(res.error || res.errorMessage || (res.message && !res.updatedCells && !res.updatedRange));
if (failed) {
  data.a6_stats.sheet_fail = (data.a6_stats.sheet_fail || 0) + 1;
  data.a6_stats.last_sheet_error = res.error?.message || res.message || 'PUT_FAIL';
  return [{ json: { ok: false, sheet_error: true, detail: data.a6_stats.last_sheet_error } }];
}

data.a6_stats.video_ok = (data.a6_stats.video_ok || 0) + 1;

return [{
  json: {
    ok: true,
    storage: 'video_drafts',
    target_row: put.target_row,
    source_normalized_key: merge.source_normalized_key || put.source_normalized_key,
    queue_sheet_row: put.queue_sheet_row,
    queue_meta_patch: put.queue_meta_patch,
  },
}];
