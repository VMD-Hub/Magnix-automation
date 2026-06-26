// n8n Code: auth webhook + normalize notification event

const EXPECTED = $env.MAGNIX_WEBHOOK_TOKEN || '';
const headers = $input.first().json.headers || {};
const auth = headers.authorization || headers.Authorization || '';
if (EXPECTED && auth !== `Bearer ${EXPECTED}`) {
  throw new Error('Unauthorized: invalid MAGNIX_WEBHOOK_TOKEN');
}

const raw = $input.first().json;
const body = raw.body && typeof raw.body === 'object' ? raw.body : raw;

const event_id = String(body.event_id || '').trim();
if (!event_id) throw new Error('Validation: event_id is required');

const event_type = String(body.event_type || 'approval_needed').trim();
const agent = String(body.agent || body.source_workflow || 'unknown').trim();
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
