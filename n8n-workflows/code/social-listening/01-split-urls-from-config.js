// n8n Code: expand project_config rows → 1 item per URL (active only)

const results = [];

for (const item of $input.all()) {
  const row = item.json;
  const active = String(row.active ?? 'true').trim().toLowerCase();
  if (active === 'false' || active === '0' || active === 'no') continue;

  const platform = String(row.platform || 'tiktok').trim().toLowerCase();
  const urlField = row.url || row.urls || row.profile_url || '';
  const urls = String(urlField)
    .split(/[\n,;]+/)
    .map((u) => u.trim())
    .filter(Boolean);

  for (const post_url of urls) {
    results.push({
      json: {
        post_url,
        platform,
        config_segment_hint: String(row.segment || '').trim(),
        notes: String(row.notes || '').slice(0, 500),
      },
    });
  }
}

if (!results.length) {
  return [{ json: { empty: true, message: 'No active URLs in project_config' } }];
}

return results;
