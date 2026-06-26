// n8n Code: manual test — bỏ qua webhook, inject event mẫu

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const now = Date.now();
const sheet_tab = 'content_drafts';
const sheet_row = 2;
const approval_fields = ['status=approved'];

return [{
  json: {
    event_id: `manual:test:${now}:approval_needed`,
    event_type: 'approval_needed',
    agent: 'manual-test',
    severity: 'action_required',
    product_type: 'lead_magnet',
    target_channel: 'facebook_page',
    title: 'Magnix manual test — Telegram Notify',
    segment: 'noxh_income',
    source_row_key: 'manual:test',
    sheet_tab,
    sheet_row,
    approval_fields,
    review_url: buildReviewUrl(SHEET_ID, sheet_tab, sheet_row, approval_fields),
    preview_url: '',
    due_at: new Date(Date.now() + 2 * 3600000).toISOString(),
    telegram_enabled: String($env.TELEGRAM_APPROVAL_ENABLED || '').toLowerCase() === 'true',
    bot_token_set: String($env.TELEGRAM_BOT_TOKEN || '').length > 10,
    chat_id: $env.TELEGRAM_CHAT_ID_OWNER || $env.TELEGRAM_CHAT_ID_OPS || '',
  },
}];
