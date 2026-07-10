// Telegram Ops — nurture auto queue (script + channel action).

const item = $input.first().json;
if (item.skipped || item.duplicate) {
  return [{ json: { ...item, telegram_skip: item.reason || 'skipped' } }];
}

const segment = item.segment === 'noxh' ? 'noxh' : item.segment === 'cctm' ? 'cctm' : 'general';
const isNoxh = segment === 'noxh';

const chatNoxh =
  $env.TELEGRAM_CHAT_ID_NOXH_HOT ||
  $env.TELEGRAM_CHAT_ID_LEAD_NOXH ||
  $env.TELEGRAM_CHAT_ID_OPS ||
  '';
const chatCommercial =
  $env.TELEGRAM_CHAT_ID_LEAD_COMMERCIAL ||
  $env.TELEGRAM_CHAT_ID_OPS ||
  $env.TELEGRAM_CHAT_ID_OWNER ||
  '';

const triggerLabel =
  item.trigger === 'status_contacted' ? 'Sau CONTACTED' : 'Khi tạo lead';

const channelHint =
  item.channel === 'zalo'
    ? '→ Gửi Zalo DM khách (checklist/script)'
    : item.channel === 'oa'
      ? '→ Gửi Zalo OA CS (nếu khách follow OA)'
      : item.channel === 'telegram'
        ? '→ Phản hồi qua Telegram Ops'
        : '→ Ops xử lý thủ công';

const lines = [
  `📬 [HouseX Nurture] ${triggerLabel}`,
  `Lead: ${item.lead_id}`,
  `Script: ${item.script_label || item.nurture_script_id}`,
  `Kênh: ${item.channel} · ${channelHint}`,
  segment !== 'general' ? `Lane: ${segment.toUpperCase()}` : null,
  item.source ? `Nguồn: ${item.source}` : null,
  `Khách: ${item.contact_name}`,
  `SĐT: ${item.contact_phone}`,
  item.contact_email ? `Email: ${item.contact_email}` : null,
  item.script_description ? `Mô tả: ${item.script_description}` : null,
  item.ops_note ? `Ghi chú Ops: ${item.ops_note}` : null,
  'Admin: /admin/ops-leads',
].filter(Boolean);

const message = lines.join('\n').slice(0, 3900);
const token = $env.TELEGRAM_BOT_TOKEN || '';
const chat_id = isNoxh ? chatNoxh : chatCommercial || chatNoxh;
const enabled =
  String($env.TELEGRAM_LEAD_NURTURE_ENABLED || 'true').toLowerCase() === 'true';

return [{
  json: {
    ...item,
    segment,
    telegram_enabled: enabled && !!token && !!chat_id,
    telegram_chat_id: chat_id,
    telegram_message: message,
    telegram_priority: 'normal',
    telegram_route: isNoxh ? 'noxh_nurture' : 'cctm_nurture',
  },
}];
