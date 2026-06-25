// n8n Code: bump stats sau ghi Sheet OK (Agent 7)

const item = $('Merge Meta for PUT').item?.json || $input.first().json || {};
const putMeta = $('HTTP PUT meta').item?.json || {};
const putStatus = $('HTTP PUT status').item?.json || {};
const data = $getWorkflowStaticData('global');
if (!data.a7_stats) data.a7_stats = { render_ok: 0, render_fail: 0, payload_fail: 0 };

const metaWritten = Number(putMeta.updatedCells || 0) >= 1;
const statusWritten = Number(putStatus.updatedCells || 0) >= 1;
const sheetOk = item.ok && item.render_url && metaWritten && statusWritten;

if (sheetOk) {
  data.a7_stats.render_ok = (data.a7_stats.render_ok || 0) + 1;
} else {
  data.a7_stats.sheet_fail = (data.a7_stats.sheet_fail || 0) + 1;
  data.a7_stats.last_error = !metaWritten || !statusWritten
    ? 'HTTP PUT Sheet không ghi cell — kiểm tra googleApi credential'
    : 'Merge/PUT thiếu render_url';
}

return [{
  json: {
    ok: sheetOk,
    sheet_ok: sheetOk,
    sheet_row: item.sheet_row,
    render_url: item.render_url,
    source_normalized_key: item.source_normalized_key,
    meta_updated_cells: putMeta.updatedCells || 0,
    status_updated_cells: putStatus.updatedCells || 0,
  },
}];
