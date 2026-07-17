// n8n Code: Google Sheets values[] → object per content_metrics row

const values = $input.first().json.values || [];
if (!Array.isArray(values) || values.length === 0) {
  return [{ json: {} }];
}

const headers = values[0].map((value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
);

const items = [];
for (let index = 1; index < values.length; index += 1) {
  const row = Array.isArray(values[index]) ? values[index] : [];
  if (!row.some((value) => String(value ?? '').trim())) continue;

  const record = { row_number: index + 1 };
  for (let column = 0; column < headers.length; column += 1) {
    const header = headers[column];
    if (header) record[header] = row[column] ?? '';
  }
  items.push({ json: record });
}

return items.length ? items : [{ json: {} }];
