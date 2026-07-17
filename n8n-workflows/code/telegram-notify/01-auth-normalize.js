// n8n Code: auth webhook + normalize notification event

const raw = $input.first()?.json;
const safeRaw = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
let body = safeRaw.body;
if (typeof body === 'string') {
  try {
    const parsed = JSON.parse(body);
    body = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    body = {};
  }
}
if (!body || typeof body !== 'object' || Array.isArray(body)) body = safeRaw;

const agent = String(body.agent || body.source_workflow || 'unknown');
const expected = agent === 'House X Backup'
  ? String($env.HOUSEX_BACKUP_ALERT_TOKEN || '')
  : String($env.MAGNIX_WEBHOOK_TOKEN || '');
const headers =
  safeRaw.headers && typeof safeRaw.headers === 'object' && !Array.isArray(safeRaw.headers)
    ? safeRaw.headers
    : {};
const supplied = typeof headers.authorization === 'string'
  ? headers.authorization
  : typeof headers.Authorization === 'string'
    ? headers.Authorization
    : '';
if (!expected || supplied !== `Bearer ${expected}`) {
  throw new Error('Unauthorized');
}

const event_id = String(body.event_id || '').trim();
if (!event_id) throw new Error('Validation: event_id is required');

const event_type = String(body.event_type || 'approval_needed').trim();
const title = String(body.title || '(no title)').slice(0, 120);
const segment = String(body.segment || '').slice(0, 40);
const sheet_tab = String(body.sheet_tab || body.target_tab || '').trim();
const sheet_row = Number(body.sheet_row || 0);
const product_type = String(body.product_type || '').slice(0, 60);
const target_channel = String(body.target_channel || '').slice(0, 40);
const preview_url = String(body.preview_url || '').slice(0, 500);
const source_row_key = String(body.source_row_key || body.source_key || '').slice(0, 120);
const approval_fields = Array.isArray(body.approval_fields) ? body.approval_fields : [];

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const review_url = sheet_tab
  ? buildReviewUrl(SHEET_ID, sheet_tab, sheet_row, approval_fields)
  : String(body.review_url || '').slice(0, 500);

const due_at = body.due_at || new Date(Date.now() + 2 * 3600000).toISOString();
const chat_id = $env.TELEGRAM_CHAT_ID_OWNER || $env.TELEGRAM_CHAT_ID_OPS || '';

return [{
  json: {
    event_id,
    event_type,
    agent,
    severity: String(body.severity || 'action_required'),
    title,
    segment,
    product_type,
    target_channel,
    sheet_tab,
    sheet_row,
    source_row_key,
    review_url,
    preview_url,
    approval_fields,
    due_at,
    telegram_enabled: String($env.TELEGRAM_APPROVAL_ENABLED || '').toLowerCase() === 'true',
    bot_token_set: String($env.TELEGRAM_BOT_TOKEN || '').length > 10,
    chat_id,
  },
}];
