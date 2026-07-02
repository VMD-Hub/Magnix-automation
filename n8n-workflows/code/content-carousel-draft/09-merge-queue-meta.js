// n8n Code: merge meta queue sau HTTP GET (Agent 3b)

const prep = $('Prepare Queue Mark').item?.json || {};
const getRes = $input.first().json || {};

if (!prep.ok || !prep.queue_meta_patch) {
  return [{ json: { ok: false, skip: true } }];
}

let existing = {};
try {
  const cell = getRes.values?.[0]?.[0];
  if (cell) existing = JSON.parse(cell);
} catch {
  existing = {};
}

const meta = JSON.stringify({ ...existing, ...prep.queue_meta_patch }).slice(0, 50000);

return [{
  json: {
    ok: true,
    put_url: prep.put_url,
    put_body: { values: [[meta]] },
    queue_row_updated: prep.queue_sheet_row,
    normalized_key: prep.normalized_key,
  },
}];
