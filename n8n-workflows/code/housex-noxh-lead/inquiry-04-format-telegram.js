// Telegram realtime — route theo intent lane (NOXH, thương mại, finance, dịch vụ).

const sheetResult = $input.first().json || {};
const source = $('Dedupe Inquiry').item?.json || {};
const item = {
  ...source,
  sheet_logged: !sheetResult.error,
  sheet_error: sheetResult.error?.message || sheetResult.message || null,
};
if (item.skipped || item.duplicate) {
  return [{ json: { ...item, telegram_skip: item.reason || 'skipped' } }];
}

const segment =
  item.segment ||
  (item.project_type === 'NHA_O_XA_HOI' ? 'noxh' : 'cctm');
const isNoxh = segment === 'noxh';
const laneConfig = {
  noxh: {
    channel: 'NOXH',
    header: '📞 [HouseX NOXH] Gọi khách trong 2h',
    type: 'Nhà ở xã hội',
    route: 'noxh_inquiry',
  },
  cctm: {
    channel: 'CCTM',
    header: '🏢 [HouseX CCTM] Tư vấn thương mại — 2h',
    type: 'Căn hộ thương mại',
    route: 'cctm_inquiry',
  },
  finance: {
    channel: 'FINANCE',
    header: '💳 [HouseX Finance] Tư vấn tài chính — 2h',
    type: 'Tài chính / vay vốn',
    route: 'finance_inquiry',
  },
  valuation: {
    channel: 'VALUATION',
    header: '📐 [HouseX Định giá] Tiếp nhận yêu cầu — 2h',
    type: 'Định giá & thẩm định BĐS',
    route: 'valuation_inquiry',
  },
  interior: {
    channel: 'INTERIOR',
    header: '🛋️ [HouseX Nội thất] Tiếp nhận yêu cầu — 2h',
    type: 'Thiết kế & thi công nội thất',
    route: 'interior_inquiry',
  },
  support: {
    channel: 'SUPPORT',
    header: '🛟 [HouseX Hỗ trợ] Yêu cầu mới — 2h',
    type: 'Hỗ trợ',
    route: 'support_inquiry',
  },
};
const lane = laneConfig[segment] || {
  channel: 'SERVICE',
  header: '📨 [HouseX Dịch vụ] Yêu cầu mới — 2h',
  type: 'Tư vấn dịch vụ',
  route: 'service_inquiry',
};

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

const miniAppHint = item.source === 'zalo_miniapp' ? ' · Mini App' : '';
const header = `${lane.header}${miniAppHint}`;

const kindLabel =
  item.kind === 'listing'
    ? `Tin đăng ${item.listing_code || item.entity_name}`
    : item.kind === 'service'
      ? `Dịch vụ: ${item.entity_name}`
      : `Dự án ${item.entity_name}`;

const lines = [
  header,
  `Lead: ${item.lead_id}`,
  `Lane: ${lane.channel}`,
  `${kindLabel}`,
  `Loại: ${lane.type}`,
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
      telegram_route: lane.route,
    },
  },
];
