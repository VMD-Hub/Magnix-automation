// n8n Code: bỏ post đã có trong scrape_index (tiết kiệm Claude)

function safeKey(platform, postId) {
  const p = String(platform || 'unknown').replace(/[^a-z0-9_]/gi, '_');
  const id = String(postId || 'unknown').replace(/[^a-zA-Z0-9._-]/g, '_');
  return `apify:${p}:${id}`;
}

const data = $getWorkflowStaticData('global');
const keys = data.dedupe_keys || {};

const out = [];
let skipped = 0;

for (const item of $input.all()) {
  const j = item.json;
  if (j.error === 'APIFY_EMPTY') {
    out.push(item);
    continue;
  }
  const pid = String(j.post_id || '').trim();
  if (!pid) continue;

  const nk = safeKey(j.platform, pid);
  if (keys[nk] || keys[pid]) {
    skipped += 1;
    continue;
  }
  out.push({ json: { ...j, normalized_key_preview: nk } });
}

if (!out.length) {
  return [{
    json: {
      ok: false,
      error: 'APIFY_ALL_DUPLICATE',
      skipped,
      message: 'Tất cả post đã có trong scrape_index — bỏ qua Claude',
    },
  }];
}

return out;
