// Telegram realtime — branch theo segment (noxh|cctm), fallback project_type.

const item = $input.first().json;
if (item.skipped || item.duplicate) {
  return [{ json: { ...item, telegram_skip: item.reason || 'skipped' } }];
}

const segment =
  item.segment ||
  (item.project_type === 'NHA_O_XA_HOI' ? 'noxh' : 'cctm');
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

const channelLabel = isNoxh ? 'NOXH' : 'CCTM';
const miniAppHint = item.source === 'zalo_miniapp' ? ' · Mini App' : '';

const header = isNoxh
  ? `📞 [HouseX ${channelLabel}${miniAppHint}] Gọi khách trong 2h`
  : `🏢 [HouseX ${channelLabel}${miniAppHint}] Tư vấn thương mại — 2h`;

const kindLabel =
  item.kind === 'listing'
    ? `Tin đăng ${item.listing_code || item.entity_name}`
    : `Dự án ${item.entity_name}`;

const lines = [
  header,
  `Lead: ${item.lead_id}`,
  `Lane: ${segment.toUpperCase()}`,
  `${kindLabel}`,
  `Loại: ${isNoxh ? 'Nhà ở xã hội' : 'Căn hộ thương mại'}`,
  item.province ? `Khu vực: ${item.province}` : null,
  `Khách: ${item.contact_name}`,
  `SĐT: ${item.contact_phone}`,
  `Email: ${item.contact_email || '—'}`,
  item.message ? `Ghi chú: ${item.message}` : null,
  item.public_url ? `Link: ${item.public_url}` : null,
  item.assigned_broker_id ? `Broker gán: ${item.assigned_broker_id}` : null,
  `Hạn SLA: ${item.sla_due_at}`,
].filter(Boolean);

const message = lines.join('\n').slice(0, 3900);
const token = $env.TELEGRAM_BOT_TOKEN || '';
const chat_id = isNoxh ? chatNoxh : chatCommercial;
const enabled =
  String($env.TELEGRAM_LEAD_INQUIRY_ENABLED || 'true').toLowerCase() === 'true';

return [
  {
    json: {
      ...item,
      segment,
      telegram_enabled: enabled && !!token && !!chat_id,
      telegram_chat_id: chat_id,
      telegram_message: message,
      telegram_priority: 'urgent',
      telegram_route: isNoxh ? 'noxh_inquiry' : 'cctm_inquiry',
    },
  },
];
