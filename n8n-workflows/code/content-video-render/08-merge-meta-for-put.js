// n8n Code: merge meta sau HTTP GET (Agent 7)

const prep = $('Prepare Sheet Update').item?.json || $input.first().json || {};

if (!prep.ok || !prep.render_meta_patch) {
  return [{ json: { ok: false, skip: true } }];
}

// Không merge meta render cũ từ Sheet GET — tránh giữ JPG/url cũ sau reset row
const meta = JSON.stringify({
  ...(prep.existing_meta || {}),
  ...prep.render_meta_patch,
}).slice(0, 50000);

return [{
  json: {
    ok: true,
    put_meta_url: prep.put_meta_url,
    put_status_url: prep.put_status_url,
    meta_body: { values: [[meta]] },
    status_body: { values: [['ready_for_review']] },
    sheet_row: prep.sheet_row,
    render_url: prep.render_url,
    source_normalized_key: prep.source_normalized_key,
  },
}];
