// Format tin Telegram theo tier. HOT = realtime chuyên gia; WARM = gỡ hồ sơ; COLD/OUT = không ping.

const item = $input.first().json;
if (item.skipped || item.duplicate) {
  return [{ json: { ...item, telegram_skip: item.reason || 'skipped' } }];
}

const tier = item.tier;
if (tier === 'COLD' || tier === 'OUT') {
  return [{
    json: {
      ...item,
      telegram_enabled: false,
      telegram_skip: 'NURTURE_ONLY',
      nurture_note: tier === 'OUT'
        ? 'Chuyển nurture dài / gợi ý nhà thương mại — không gọi slot chuyên gia NOXH.'
        : 'Nurture dài hạn — gửi nội dung + hẹn lại khi sẵn sàng.',
    },
  }];
}

const chatHot = $env.TELEGRAM_CHAT_ID_NOXH_HOT || $env.TELEGRAM_CHAT_ID_OPS || $env.TELEGRAM_CHAT_ID_OWNER || '';
const chatWarm = $env.TELEGRAM_CHAT_ID_NOXH_WARM || $env.TELEGRAM_CHAT_ID_OPS || $env.TELEGRAM_CHAT_ID_OWNER || '';

let header = '[HouseX NOXH]';
let chat_id = chatWarm;
let priority = 'normal';

if (tier === 'HOT') {
  header = '🔥 [HouseX NOXH — HOT] Gọi khách trong 2h';
  chat_id = chatHot;
  priority = 'urgent';
} else if (item.has_credit_blocker) {
  header = '⚠️ [HouseX NOXH — WARM] Gỡ hồ sơ vay / nợ xấu';
} else if (item.has_credit_caution) {
  header = '🟡 [HouseX NOXH — WARM] Cần tư vấn tín dụng';
} else {
  header = '🟡 [HouseX NOXH — WARM] Gỡ điều kiện / checklist';
}

const lines = [
  header,
  `Lead: ${item.lead_id}`,
  `Kết luận: ${item.overall} · Tín dụng: ${item.credit_flag}`,
  `Lý do: ${item.reason_codes_csv || '—'}`,
  `Khách: ${item.contact_name}`,
  `SĐT: ${item.contact_phone}`,
  `Email: ${item.contact_email}`,
  `Hạn SLA: ${item.sla_due_at}`,
  '',
  item.recommended_action || 'Để chuyên gia HouseX tư vấn và giải thích rõ hồ sơ.',
];

const message = lines.join('\n').slice(0, 3900);
const token = $env.TELEGRAM_BOT_TOKEN || '';
const enabled = String($env.TELEGRAM_NOXH_ENABLED || 'true').toLowerCase() === 'true';

return [{
  json: {
    ...item,
    telegram_enabled: enabled && !!token && !!chat_id,
    telegram_chat_id: chat_id,
    telegram_message: message,
    telegram_priority: priority,
  },
}];
