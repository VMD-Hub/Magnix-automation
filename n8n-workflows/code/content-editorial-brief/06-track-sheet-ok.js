// n8n Code: track stats sau ghi brief (Layer B)

const item = $('Merge Meta Brief').item?.json || $input.first().json || {};
const data = $getWorkflowStaticData('global');
if (!data.eb_stats) data.eb_stats = { brief_ok: 0, brief_fail: 0, sheet_fail: 0 };

if (item.ok && item.normalized_key) {
  data.eb_stats.brief_ok = (data.eb_stats.brief_ok || 0) + 1;
} else {
  data.eb_stats.sheet_fail = (data.eb_stats.sheet_fail || 0) + 1;
}

return [{
  json: {
    ok: true,
    sheet_row: item.sheet_row,
    normalized_key: item.normalized_key,
  },
}];
