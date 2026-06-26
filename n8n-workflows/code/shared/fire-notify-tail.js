// Shared tail — inlined by notify-wire.mjs into agent fire-notify scripts

async function fireNotify(body, prev) {
  const enabled = String($env.TELEGRAM_APPROVAL_ENABLED || '').toLowerCase() === 'true';
  if (!enabled) {
    return [{ json: { ...prev, notify_skipped: true, reason: 'TELEGRAM_APPROVAL_ENABLED' } }];
  }

  const token = $env.MAGNIX_WEBHOOK_TOKEN || '';
  const base = String($env.N8N_PUBLIC_URL || 'https://n8n.vmd.asia').replace(/\/$/, '');

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
    return [{ json: { ...prev, notify_fired: true, notify_event_id: body.event_id } }];
  } catch (e) {
    return [{ json: { ...prev, notify_fired: false, notify_error: e.message || 'NOTIFY_FAIL' } }];
  }
}
