// n8n Code: pass-through gọn sau Merge (tránh payload quá lớn làm mất field URL)

const merge = $input.first().json || {};
if (!merge.ok || !merge.append_row) {
  return [{ json: { ok: false, skip: true } }];
}

return [{
  json: {
    ok: merge.ok,
    append_row: merge.append_row,
    source_normalized_key: merge.source_normalized_key,
    queue_sheet_row: merge.queue_sheet_row,
    queue_meta_patch: merge.queue_meta_patch,
  },
}];
