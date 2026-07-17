// n8n Code: Webhook response — Postgres primary (ADR-013)

const item = $input.first().json;
const row =
  item.data && typeof item.data === 'object' && !Array.isArray(item.data)
    ? item.data
    : item;
const succeeded =
  item.ok === true ||
  (typeof row.id === 'string' && typeof row.normalized_key === 'string');

return [{
  json: {
    ok: succeeded,
    storage: item.storage || (succeeded ? 'postgres_housex' : undefined),
    action: item.action,
    id: row.id,
    normalized_key: row.normalized_key,
    status: row.status,
    record: item.record,
    error: succeeded ? undefined : item.error,
    message: succeeded ? undefined : item.message,
    http_status: item.http_status,
  },
}];
