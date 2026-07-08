// n8n Code: Webhook response — Postgres primary (ADR-013)

const item = $input.first().json;

return [{
  json: {
    ok: item.ok === true,
    storage: item.storage || (item.ok ? 'postgres_housex' : undefined),
    action: item.action,
    id: item.id,
    normalized_key: item.normalized_key,
    status: item.status,
    record: item.record,
    error: item.ok ? undefined : item.error,
    message: item.ok ? undefined : item.message,
    http_status: item.http_status,
  },
}];
