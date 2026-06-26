// n8n Code: merge editorial brief vào meta (Layer B)

const prep = $('Prepare Meta Update').item?.json || $input.first().json || {};
const getRes = $input.first().json || {};

if (!prep.ok || !prep.editorial_brief_v1) {
  return [{ json: { ok: false, skip: true } }];
}

let fromSheet = {};
try {
  const cell = getRes.values?.[0]?.[0];
  if (cell) fromSheet = JSON.parse(cell);
} catch {
  fromSheet = {};
}

const prepMeta = prep.existing_meta || {};
const existing = { ...fromSheet, ...prepMeta };

const meta = {
  ...existing,
  editorial_brief_v1: prep.editorial_brief_v1,
  editorial_brief_at: new Date().toISOString(),
};
if (prep.legal_retrieval_pack) {
  meta.legal_retrieval_pack = prep.legal_retrieval_pack;
  meta.legal_retrieval_pack_at = new Date().toISOString();
}
if (prep.legal_gate) {
  meta.legal_gate = prep.legal_gate;
}
if (prepMeta.intake_v1 && !fromSheet.intake_v1) {
  meta.intake_v1_from = meta.intake_v1_from || 'stub_layer_b';
}

const metaStr = JSON.stringify(meta).slice(0, 50000);

return [{
  json: {
    ok: true,
    put_meta_url: prep.put_meta_url,
    put_interest_url: prep.put_interest_url,
    meta_body: { values: [[metaStr]] },
    interest_body: { values: [[prep.interest_key || 'unknown']] },
    sheet_row: prep.sheet_row,
    normalized_key: prep.normalized_key,
  },
}];
