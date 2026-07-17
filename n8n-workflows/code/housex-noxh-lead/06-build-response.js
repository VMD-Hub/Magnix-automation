let parsed = {};
try {
  parsed = $('Parse HouseX Event').item?.json || {};
} catch {
  // Manual/detail branches may not execute Parse HouseX Event.
}
const item = { ...parsed, ...$input.first().json };
const sheetFailed = item.sheet_logged === false || !!item.sheet_error;
const telegramFailed = !!item.telegram_error;
const requiredDeliveryFailed =
  item.delivery_required === true && item.telegram_sent !== true;
const deliveryOk =
  item.ok !== false &&
  !sheetFailed &&
  !telegramFailed &&
  !requiredDeliveryFailed;
return [{
  json: {
    ok: deliveryOk,
    workflow: 'housex-noxh-lead-route',
    path: item.path || 'events',
    lead_id: item.lead_id || null,
    event_path: item.event_path || null,
    tier: item.tier || null,
    supply_kind: item.supply_kind || null,
    case_id: item.case_id || null,
    case_code: item.case_code || null,
    noxh_case_event: item.noxh_case_event || null,
    nurture_script_id: item.nurture_script_id || null,
    nurture_trigger: item.trigger || null,
    nurture_channel: item.channel || null,
    conflict_id: item.conflict_id || null,
    conflict_phase: item.phase || null,
    conflict_kind: item.kind || null,
    duplicate: item.duplicate === true,
    skipped: item.skipped === true,
    sheet_logged: item.sheet_logged !== false,
    sheet_error: item.sheet_error || null,
    telegram_sent: item.telegram_sent === true,
    telegram_error: item.telegram_error || null,
    reason:
      item.reason ||
      item.sheet_error ||
      item.telegram_error ||
      (requiredDeliveryFailed ? item.telegram_skip || 'REQUIRED_DELIVERY_FAILED' : null) ||
      item.telegram_skip ||
      null,
    finished_at: new Date().toISOString(),
  },
}];
