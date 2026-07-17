// Telegram Ops — booking, listing moderation, commissions and promotion wins.

const item = $input.first().json;
const token = $env.TELEGRAM_BOT_TOKEN || '';
const chatId =
  $env.TELEGRAM_CHAT_ID_OPS ||
  $env.TELEGRAM_CHAT_ID_OWNER ||
  '';

const iconByKind = {
  unit_booking: '🏠',
  listing_review: '📝',
  listing_report: '🚨',
  lead_won: '✅',
  commission_created: '💰',
  promotion_win: '🎁',
};
const icon = iconByKind[item.ops_kind] || '📨';

const message = [
  `${icon} [HouseX Ops] ${item.ops_title || 'Yêu cầu mới'}`,
  item.request_id ? `ID: ${item.request_id}` : null,
  item.ops_detail || null,
  item.contact_name ? `Khách: ${item.contact_name}` : null,
  item.contact_phone ? `SĐT: ${item.contact_phone}` : null,
  item.contact_email ? `Email: ${item.contact_email}` : null,
  item.source ? `Nguồn: ${item.source}` : null,
  item.public_url ? `Xử lý: ${item.public_url}` : null,
].filter(Boolean).join('\n').slice(0, 3900);

return [{
  json: {
    ...item,
    delivery_required: true,
    telegram_enabled: !!token && !!chatId,
    telegram_chat_id: chatId,
    telegram_message: message,
    telegram_priority: item.ops_priority || 'high',
    telegram_route: `ops_${item.ops_kind || 'request'}`,
  },
}];
