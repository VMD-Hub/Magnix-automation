// Telegram Ops — attribution conflict opened / resolved.

const sheetResult = $input.first().json || {};
const source = $('Dedupe Conflict').item?.json || {};
const item = {
  ...source,
  sheet_logged: !sheetResult.error,
  sheet_error: sheetResult.error?.message || sheetResult.message || null,
};
if (item.skipped || item.duplicate) {
  return [{ json: { ...item, telegram_skip: item.reason || 'skipped' } }];
}

const isResolved = item.phase === 'resolved';
const header = isResolved
  ? '✅ [HouseX Conflict] Đã xử lý'
  : '⚠️ [HouseX Conflict] Cần duyệt';

const lines = [
  header,
  `ID: ${item.conflict_id}`,
  `Loại: ${item.kind_label || item.kind}`,
  `SĐT: ${item.phone_masked}`,
  item.customer_name ? `Khách: ${item.customer_name}` : null,
  item.noxh_case_code ? `Hồ sơ: ${item.noxh_case_code}` : null,
  item.platform_lead_source ? `Nguồn lead Ops: ${item.platform_lead_source}` : null,
  item.broker_id ? `CTV brokerId: ${item.broker_id}` : null,
  !isResolved && item.reject_label ? `Lý do chặn: ${item.reject_label}` : null,
  isResolved && item.resolution_label ? `Quyết định: ${item.resolution_label}` : null,
  'Admin: /admin/conflicts',
].filter(Boolean);

const message = lines.join('\n').slice(0, 3900);
const token = $env.TELEGRAM_BOT_TOKEN || '';
const chat_id =
  $env.TELEGRAM_CHAT_ID_NOXH_CASE_OPS ||
  $env.TELEGRAM_CHAT_ID_OPS ||
  $env.TELEGRAM_CHAT_ID_OWNER ||
  '';
const enabled =
  String($env.TELEGRAM_ATTRIBUTION_CONFLICT_ENABLED || 'true').toLowerCase() === 'true';

return [{
  json: {
    ...item,
    telegram_enabled: enabled && !!token && !!chat_id,
    telegram_chat_id: chat_id,
    telegram_message: message,
    telegram_priority: isResolved ? 'normal' : 'high',
    telegram_route: 'attribution_conflict_ops',
  },
}];
