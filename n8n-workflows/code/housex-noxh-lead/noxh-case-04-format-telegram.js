// Telegram — pipeline NOXH case (created · milestone · CTV nudge).

const item = $input.first().json;
if (item.skipped) {
  return [{ json: { ...item, telegram_skip: item.reason || 'skipped' } }];
}

const MILESTONE_LABEL = {
  M1_RECEIVED: 'M1 — Đã tiếp nhận',
  M2_DOCUMENTS: 'M2 — Hoàn thiện hồ sơ',
  M3_SUBMITTED: 'M3 — Đã nộp CĐT',
  M4_APPROVED: 'M4 — Phê duyệt',
  M5_SIGNED: 'M5 — Đã ký HĐMB',
};

const eventType = String(item.noxh_case_event || '');
const milestoneLabel = (code) =>
  MILESTONE_LABEL[code] || code || '—';

const chatId =
  $env.TELEGRAM_CHAT_ID_NOXH_CASE_OPS ||
  $env.TELEGRAM_CHAT_ID_NOXH_HOT ||
  $env.TELEGRAM_CHAT_ID_OPS ||
  $env.TELEGRAM_CHAT_ID_OWNER ||
  '';

const token = $env.TELEGRAM_BOT_TOKEN || '';
const enabled =
  String($env.TELEGRAM_NOXH_CASE_ENABLED || 'true').toLowerCase() === 'true';

let header = '📋 [HouseX NOXH Case]';
let priority = 'normal';
const lines = [];

if (eventType === 'noxh_case.created') {
  const fromCtv = !!item.broker_id;
  header = fromCtv
    ? '🤝 [HouseX NOXH Case] CTV thả lead mới'
    : '🆕 [HouseX NOXH Case] Hồ sơ Ops mới (wizard/inbound)';
  priority = fromCtv ? 'high' : 'urgent';
  lines.push(
    header,
    `Mã: ${item.case_code}`,
    `Case ID: ${item.case_id}`,
    `Khách: ${item.customer_name}`,
    `SĐT: ${item.phone_masked || '—'}`,
    `Mốc: ${milestoneLabel(item.milestone)}`,
    fromCtv ? `CTV brokerId: ${item.broker_id}` : 'Nguồn: Ops platform (chưa gán CTV)',
    `Admin: https://timnhaxahoi.com/admin/noxh-cases`,
  );
} else if (eventType === 'noxh_case.milestone_changed') {
  const to = String(item.to_milestone || '');
  header =
    to === 'M5_SIGNED'
      ? '🎉 [HouseX NOXH Case] Ký HĐMB — kiểm tra hoa hồng'
      : '📈 [HouseX NOXH Case] Đổi milestone';
  priority = to === 'M5_SIGNED' ? 'urgent' : 'high';
  lines.push(
    header,
    `Mã: ${item.case_code}`,
    `${milestoneLabel(item.from_milestone)} → ${milestoneLabel(to)}`,
    item.milestone_sub ? `Chi tiết: ${item.milestone_sub}` : null,
    item.ops_note ? `Ops: ${item.ops_note}` : null,
    item.broker_id ? `CTV: ${item.broker_id}` : 'Chưa gán CTV',
    `Admin: https://timnhaxahoi.com/admin/noxh-cases`,
  );
} else if (eventType === 'noxh_case.ctv_nudge') {
  header = '🔔 [HouseX NOXH Case] CTV nhắc khách (qua hệ thống)';
  priority = 'high';
  lines.push(
    header,
    `Mã: ${item.case_code}`,
    `CTV: ${item.broker_id || '—'}`,
    item.doc_type ? `Giấy tờ: ${item.doc_type}` : null,
    item.nudge_message ? `Nội dung: ${item.nudge_message}` : null,
    `Admin: https://timnhaxahoi.com/admin/noxh-cases`,
  );
} else {
  return [{
    json: {
      ...item,
      telegram_enabled: false,
      telegram_skip: 'UNKNOWN_NOXH_CASE_EVENT',
    },
  }];
}

const message = lines.filter(Boolean).join('\n').slice(0, 3900);

return [{
  json: {
    ...item,
    telegram_enabled: enabled && !!token && !!chatId,
    telegram_chat_id: chatId,
    telegram_message: message,
    telegram_priority: priority,
    telegram_route: 'noxh_case_ops',
  },
}];
