// n8n Code: Sheets API values[][] → 1 item per data row (header row 1)

const res = $input.first().json;
const rows = Array.isArray(res.values) ? res.values : [];

if (!rows.length) {
  return [{ json: { empty: true, message: 'project_config tab empty' } }];
}

const headers = rows[0].map((h) => String(h ?? '').trim().toLowerCase());
const out = [];

for (let i = 1; i < rows.length; i++) {
  const cells = rows[i];
  if (!cells || !cells.some((c) => String(c ?? '').trim())) continue;

  const row = {};
  headers.forEach((key, j) => {
    if (key) row[key] = cells[j] ?? '';
  });

  if (row.profile_url && !row.url) row.url = row.profile_url;
  if (row.urls && !row.url) row.url = row.urls;

  out.push({ json: row });
}

if (!out.length) {
  return [{ json: { empty: true, message: 'No data rows in project_config' } }];
}

return out;
