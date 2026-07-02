// n8n Code: cập nhật cpp_stats sau ghi Sheet

const prep = $('Prepare Sheet Update').item.json;

const data = $getWorkflowStaticData('global');
if (!data.cpp_stats) data.cpp_stats = { publish_ok: 0, publish_fail: 0, l0_fail: 0 };

if (prep.publish_ok) data.cpp_stats.publish_ok += 1;
else data.cpp_stats.publish_fail += 1;

let metricsAppended = false;
if (prep.need_metrics_append === true) {
  const m = $input.first().json || {};
  metricsAppended = Boolean(m.updates || m.spreadsheetId || m.updatedRange);
}

return [{
  json: {
    ok: prep.publish_ok === true,
    sheet_row: prep.sheet_row,
    normalized_key: prep.normalized_key,
    fb_post_id: prep.fb_post_id || null,
    fb_permalink: prep.fb_permalink || null,
    metrics_appended: metricsAppended,
    publish_error: prep.publish_error || null,
  },
}];
