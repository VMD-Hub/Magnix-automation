// n8n Code: read unresolved notification_events for reminder SLA

const SHEET_ID = '__GOOGLE_SHEET_ID__';
const TAB = '__NOTIFICATION_EVENTS_TAB__';

const enabled = String($env.TELEGRAM_REMINDER_ENABLED || '').toLowerCase() === 'true';
if (!enabled) {
  return [{ json: { ok: true, empty: true, reason: 'TELEGRAM_REMINDER_ENABLED' } }];
}

const token = $env.TELEGRAM_BOT_TOKEN || '';
const chatId = $env.TELEGRAM_CHAT_ID_OWNER || $env.TELEGRAM_CHAT_ID_OPS || '';
if (!token || !chatId) {
  return [{ json: { ok: true, empty: true, reason: 'MISSING_TELEGRAM_CONFIG' } }];
}

const SLA_HOURS = {
  approval_needed: [2, 8, 24],
  render_review_needed: [2, 8, 24],
  legal_source_needed: [1, 4, 12],
  qa_failed: [4, 24, 168],
  metrics_needed: [24, 72, 168],
  workflow_blocked: [0, 2, 8],
};

let rows = [];
try {
  const res = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'GET',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:L`)}`,
    json: true,
  });
  rows = res.values || [];
} catch (e) {
  return [{ json: { ok: false, error: 'SHEET_READ_FAIL', message: e.message } }];
}

if (rows.length < 2) {
  return [{ json: { ok: true, empty: true, reason: 'NO_EVENTS' } }];
}

const now = Date.now();
const due = [];

for (let i = 1; i < rows.length; i += 1) {
  const r = rows[i];
  const event_id = String(r[0] || '').trim();
  const event_type = String(r[1] || '').trim();
  const status = String(r[5] || '').trim().toLowerCase();
  const message = String(r[6] || '');
  const created_at = String(r[9] || '');
  const resolved_at = String(r[10] || '').trim();
  const metaRaw = String(r[11] || '{}');

  if (!event_id || resolved_at) continue;
  if (!['sent', 'reminded', 'pending'].includes(status)) continue;

  let meta = {};
  try {
    meta = JSON.parse(metaRaw);
  } catch {
    meta = {};
  }

  const reminder_count = Number(meta.reminder_count || 0);
  const sla = SLA_HOURS[event_type] || SLA_HOURS.approval_needed;
  const thresholdHours = sla[Math.min(reminder_count, sla.length - 1)];
  const createdMs = Date.parse(created_at);
  if (!Number.isFinite(createdMs)) continue;

  const ageHours = (now - createdMs) / 3600000;
  const lastRemindedMs = meta.last_reminded_at ? Date.parse(meta.last_reminded_at) : 0;
  const sinceLastHours = lastRemindedMs ? (now - lastRemindedMs) / 3600000 : ageHours;

  if (ageHours < thresholdHours) continue;
  if (reminder_count > 0 && sinceLastHours < thresholdHours) continue;

  const sheet_row = i + 1;
  const ageRounded = Math.round(ageHours);

  const reminderText = [
    '[Magnix Reminder] Chưa xử lý approval',
    `Đã chờ: ${ageRounded}h`,
    `Agent: ${String(r[2] || meta.agent || '')}`,
    `Dòng: ${String(r[4] || '')} · ${event_id}`,
    meta.review_url ? `Mở review: ${meta.review_url}` : '',
    'Cần làm: approve / reject / request_revision',
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 3900);

  due.push({
    json: {
      ok: true,
      event_id,
      event_type,
      sheet_row,
      reminder_count: reminder_count + 1,
      message: reminderText,
      chat_id: chatId,
      meta,
      original_message: message,
    },
  });
}

if (!due.length) {
  return [{ json: { ok: true, empty: true, reason: 'NO_DUE_REMINDERS' } }];
}

return due;
