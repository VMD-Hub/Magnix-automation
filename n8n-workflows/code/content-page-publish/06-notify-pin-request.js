// n8n Code: Telegram nhắc L3 ghim bài (Meta API ghim hạn chế)

const prep = $('Prepare Sheet Update').item?.json || $('POST Facebook Page Feed').item?.json || {};

if (!prep.publish_ok || !prep.pin_after_publish || !prep.fb_post_id) {
  return [{ json: { pin_notify_skipped: true, reason: 'NO_PIN_REQUEST' } }];
}

const enabled = String($env.TELEGRAM_APPROVAL_ENABLED || '').toLowerCase() === 'true';
if (!enabled) {
  return [{
    json: {
      pin_notify_skipped: true,
      reason: 'TELEGRAM_APPROVAL_ENABLED',
      fb_post_id: prep.fb_post_id,
      fb_permalink: prep.fb_permalink,
    },
  }];
}

const token = $env.MAGNIX_WEBHOOK_TOKEN || '';
const base = String($env.N8N_PUBLIC_URL || 'https://n8n.vmd.asia').replace(/\/$/, '');
const eventId = `pin:${prep.fb_post_id}:${Date.now()}`;

const body = {
  event_id: eventId,
  event_type: 'pin_page_post_requested',
  title: prep.title || 'Facebook Page post',
  message: [
    '📌 **Ghim bài trên Page** (Meta API không hỗ trợ ghim đầy đủ — thao tác tay)',
    '',
    `Post: ${prep.fb_permalink || prep.fb_post_id}`,
    `Sheet row: ${prep.sheet_row || '—'}`,
    '',
    'Meta Business Suite → Page → Posts → Ghim',
  ].join('\n'),
  sheet_row: prep.sheet_row,
  meta: {
    fb_post_id: prep.fb_post_id,
    fb_permalink: prep.fb_permalink,
    pin_after_publish: true,
  },
};

try {
  await this.helpers.httpRequest({
    method: 'POST',
    url: `${base}/webhook/magnix/telegram-notify`,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body,
    json: true,
    timeout: 15000,
  });
  return [{ json: { pin_notify_fired: true, event_id: eventId, fb_post_id: prep.fb_post_id } }];
} catch (e) {
  return [{ json: { pin_notify_fired: false, pin_notify_error: e.message || 'NOTIFY_FAIL', fb_post_id: prep.fb_post_id } }];
}
