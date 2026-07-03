// Telegram — đăng ký supply side (thành viên / môi giới / CTV).

const item = $input.first().json;
if (item.skipped || item.duplicate) {
  return [{ json: { ...item, telegram_skip: item.reason || 'skipped' } }];
}

const kind = String(item.supply_kind || 'member');
let header = '👤 [HouseX — Thành viên mới]';
let priority = 'normal';

if (kind === 'broker') {
  header = '🏢 [HouseX — Môi giới mới đăng tin] Onboarding trong 24h';
  priority = 'high';
} else if (kind === 'ctv') {
  header = '🤝 [HouseX — Đơn CTV chờ duyệt] Xử lý trong 24h';
  priority = 'high';
}

const lines = [
  header,
  `ID: ${item.record_id}`,
  kind === 'ctv' ? `Broker: ${item.broker_id}` : null,
  `Họ tên: ${item.contact_name}`,
  `SĐT: ${item.contact_phone}`,
  `Email: ${item.contact_email || '—'}`,
  item.region ? `Khu vực: ${item.region}` : null,
  item.detail ? `Chi tiết: ${item.detail}` : null,
  item.public_url ? `Link: ${item.public_url}` : null,
  `Hạn SLA: ${item.sla_due_at}`,
].filter(Boolean);

const message = lines.join('\n').slice(0, 3900);
const token = $env.TELEGRAM_BOT_TOKEN || '';
const chat_id =
  kind === 'ctv'
    ? ($env.TELEGRAM_CHAT_ID_CTV_OPS || $env.TELEGRAM_CHAT_ID_OPS || $env.TELEGRAM_CHAT_ID_OWNER || '')
    : ($env.TELEGRAM_CHAT_ID_SUPPLY_OPS || $env.TELEGRAM_CHAT_ID_OPS || $env.TELEGRAM_CHAT_ID_OWNER || '');

const enabled = String($env.TELEGRAM_SUPPLY_ENABLED || 'true').toLowerCase() === 'true';

return [{
  json: {
    ...item,
    telegram_enabled: enabled && !!token && !!chat_id,
    telegram_chat_id: chat_id,
    telegram_message: message,
    telegram_priority: priority,
  },
}];
