// Parse envelope từ HouseX EVENTS_WEBHOOK_URL: { type, payload, sentAt }
// Hỗ trợ: lead.noxh_checked · lead.created · lead.nurture · attribution.conflict · noxh_case.* · account.registered · ctv.application_submitted

const SECRET = $env.EVENTS_WEBHOOK_SECRET || '';
const headers = $input.first().json.headers || {};
const got = headers['x-events-secret'] || headers['X-Events-Secret'] || '';
if (!SECRET) {
  throw new Error('Server misconfigured: EVENTS_WEBHOOK_SECRET is required');
}
if (!got || got !== SECRET) {
  throw new Error('Unauthorized: invalid EVENTS_WEBHOOK_SECRET');
}

const raw = $input.first().json;
const body = raw.body && typeof raw.body === 'object' ? raw.body : raw;
const type = String(body.type || '').trim();
const now = body.sentAt || new Date().toISOString();

function resolveInquirySegment(payload, ctx) {
  const explicit = String(payload.segment || '').trim().toLowerCase();
  if (explicit === 'noxh' || explicit === 'cctm') return explicit;
  const projectType = String(ctx.projectType || 'THUONG_MAI').toUpperCase();
  return projectType === 'NHA_O_XA_HOI' ? 'noxh' : 'cctm';
}

function maskNormalizedPhone(normalized) {
  const digits = String(normalized || '').replace(/\D/g, '');
  if (digits.length < 7) return '***';
  return `${digits.slice(0, 4)}***${digits.slice(-3)}`;
}

if (type === 'lead.created') {
  const p = body.payload || {};
  const leadId = String(p.leadId || '').trim();
  if (!leadId) throw new Error('Validation: payload.leadId is required');

  const contact = p.contact || {};
  const ctx = p.context || {};
  const projectType = String(ctx.projectType || 'THUONG_MAI').toUpperCase();
  const segment = resolveInquirySegment(p, ctx);
  const slaDue = new Date(Date.now() + 2 * 3600000).toISOString();

  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'inquiry',
      path: 'events',
      lead_id: leadId,
      source: String(p.source || 'organic'),
      segment,
      intent_lane: segment,
      message: String(p.message || '').slice(0, 500),
      contact_name: String(contact.name || '').slice(0, 80),
      contact_phone: String(contact.phone || '').slice(0, 20),
      contact_email: String(contact.email || '').slice(0, 120),
      kind: String(ctx.kind || 'project'),
      entity_name: String(ctx.entityName || '').slice(0, 120),
      slug: String(ctx.slug || ''),
      listing_code: String(ctx.listingCode || ''),
      project_type: projectType,
      province: String(ctx.province || ''),
      public_url: String(ctx.adminUrl || ''),
      assigned_broker_id: String(p.assignedBrokerId || ''),
      ops_status: segment === 'noxh' ? 'new_inquiry_noxh' : 'new_inquiry_cctm',
      sla_due_at: slaDue,
      created_at: String(p.createdAt || now),
      dedupe_key: `inquiry:${leadId}`,
    },
  }];
}

if (type === 'lead.affiliate_contact') {
  const p = body.payload || {};
  const leadId = String(p.leadId || '').trim();
  if (!leadId) throw new Error('Validation: payload.leadId is required');

  const contact = p.contact || {};
  const vertical = String(p.vertical || 'ho-tro').trim().toLowerCase();
  const verticalConfig = {
    'tai-chinh': {
      segment: 'finance',
      label: 'Tư vấn tài chính / vay vốn',
      opsStatus: 'new_inquiry_finance',
    },
    'dinh-gia': {
      segment: 'valuation',
      label: 'Định giá & thẩm định BĐS',
      opsStatus: 'new_inquiry_valuation',
    },
    'noi-that': {
      segment: 'interior',
      label: 'Thiết kế & thi công nội thất',
      opsStatus: 'new_inquiry_interior',
    },
    'ho-tro': {
      segment: 'support',
      label: 'Hỗ trợ House X',
      opsStatus: 'new_inquiry_support',
    },
  };
  const config = verticalConfig[vertical] || {
    segment: 'service',
    label: 'Tư vấn dịch vụ',
    opsStatus: 'new_inquiry_service',
  };

  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'inquiry',
      path: 'events',
      lead_id: leadId,
      source: `affiliate:${vertical}`,
      segment: config.segment,
      intent_lane: config.segment,
      message: [p.need ? `Nhu cầu: ${p.need}` : '', p.message || '']
        .filter(Boolean)
        .join(' · ')
        .slice(0, 500),
      contact_name: String(contact.name || '').slice(0, 80),
      contact_phone: String(contact.phone || '').slice(0, 20),
      contact_email: String(contact.email || '').slice(0, 120),
      kind: 'service',
      entity_name: config.label,
      slug: vertical,
      listing_code: '',
      project_type: 'THUONG_MAI',
      province: '',
      public_url: `https://timnhaxahoi.com/${vertical}#tu-van`,
      assigned_broker_id: '',
      ops_status: config.opsStatus,
      sla_due_at: new Date(Date.now() + 2 * 3600000).toISOString(),
      created_at: String(p.createdAt || now),
      dedupe_key: `affiliate:${leadId}`,
    },
  }];
}

if (type === 'account.registered') {
  const p = body.payload || {};
  const userId = String(p.userAccountId || '').trim();
  if (!userId) throw new Error('Validation: payload.userAccountId is required');

  const role = String(p.role || 'CUSTOMER').toUpperCase();
  const supplyKind = role === 'BROKER' ? 'broker' : 'member';
  const slaHours = role === 'BROKER' ? 24 : 72;

  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'supply',
      supply_kind: supplyKind,
      path: 'events',
      record_id: userId,
      broker_id: String(p.brokerId || ''),
      customer_id: String(p.customerId || ''),
      role,
      contact_name: String(p.name || '').slice(0, 80),
      contact_phone: String(p.phone || '').slice(0, 20),
      contact_email: String(p.email || '').slice(0, 120),
      marketing_opt_in: p.marketingOptIn === true,
      detail: role === 'BROKER' ? 'Đăng ký môi giới — chờ onboarding đăng tin' : 'Đăng ký thành viên khách hàng',
      region: '',
      public_url: String(p.signupUrl || ''),
      ops_status: role === 'BROKER' ? 'new_broker' : 'new_member',
      sla_due_at: new Date(Date.now() + slaHours * 3600000).toISOString(),
      created_at: String(p.registeredAt || now),
      dedupe_key: `account:${userId}`,
    },
  }];
}

if (type === 'ctv.application_submitted') {
  const p = body.payload || {};
  const appId = String(p.applicationId || '').trim();
  if (!appId) throw new Error('Validation: payload.applicationId is required');

  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'supply',
      supply_kind: 'ctv',
      path: 'events',
      record_id: appId,
      broker_id: String(p.brokerId || ''),
      customer_id: '',
      role: 'BROKER',
      contact_name: String(p.brokerName || '').slice(0, 80),
      contact_phone: String(p.brokerPhone || '').slice(0, 20),
      contact_email: String(p.brokerEmail || '').slice(0, 120),
      marketing_opt_in: false,
      detail: [
        `CCCD ***${String(p.idNumberLast4 || '')}`,
        `Kinh nghiệm: ${String(p.experience || '').slice(0, 120)}`,
        `Lý do: ${String(p.motivation || '').slice(0, 120)}`,
      ].join(' · '),
      region: String(p.region || ''),
      public_url: String(p.adminUrl || ''),
      ops_status: 'ctv_pending',
      sla_due_at: new Date(Date.now() + 24 * 3600000).toISOString(),
      created_at: String(p.submittedAt || now),
      dedupe_key: `ctv:${appId}`,
    },
  }];
}

if (type === 'noxh_case.created') {
  const p = body.payload || {};
  const caseId = String(p.caseId || '').trim();
  if (!caseId) throw new Error('Validation: payload.caseId is required');

  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'noxh_case',
      path: 'events',
      noxh_case_event: type,
      case_id: caseId,
      case_code: String(p.caseCode || '').slice(0, 32),
      broker_id: p.brokerId != null && p.brokerId !== '' ? String(p.brokerId) : null,
      milestone: String(p.milestone || 'M1_RECEIVED'),
      customer_name: String(p.customerName || '').slice(0, 80),
      phone_masked: maskNormalizedPhone(p.normalizedPhone),
      created_at: now,
    },
  }];
}

if (type === 'noxh_case.milestone_changed') {
  const p = body.payload || {};
  const caseId = String(p.caseId || '').trim();
  if (!caseId) throw new Error('Validation: payload.caseId is required');

  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'noxh_case',
      path: 'events',
      noxh_case_event: type,
      case_id: caseId,
      case_code: String(p.caseCode || '').slice(0, 32),
      broker_id: p.brokerId != null && p.brokerId !== '' ? String(p.brokerId) : null,
      from_milestone: String(p.fromMilestone || ''),
      to_milestone: String(p.toMilestone || ''),
      milestone_sub: p.milestoneSub ? String(p.milestoneSub) : null,
      ops_note: p.opsNote ? String(p.opsNote).slice(0, 500) : null,
    },
  }];
}

if (type === 'noxh_case.ctv_nudge') {
  const p = body.payload || {};
  const caseId = String(p.caseId || '').trim();
  if (!caseId) throw new Error('Validation: payload.caseId is required');

  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'noxh_case',
      path: 'events',
      noxh_case_event: type,
      case_id: caseId,
      case_code: String(p.caseCode || '').slice(0, 32),
      broker_id: String(p.brokerId || '').trim() || null,
      doc_type: p.docType ? String(p.docType) : null,
      nudge_message: String(p.message || '').slice(0, 500),
    },
  }];
}

if (type === 'lead.nurture') {
  const p = body.payload || {};
  const leadId = String(p.leadId || '').trim();
  if (!leadId) throw new Error('Validation: payload.leadId is required');

  const contact = p.contact || {};
  const scriptId = String(p.nurtureScriptId || '').trim();
  const trigger = String(p.trigger || 'on_create').trim();
  const channel = String(p.channel || 'manual').trim();

  const channelAction =
    channel === 'zalo'
      ? 'zalo_dm'
      : channel === 'oa'
        ? 'zalo_oa_cs'
        : channel === 'telegram'
          ? 'telegram_ops'
          : 'ops_manual';

  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'nurture',
      path: 'events',
      lead_id: leadId,
      nurture_script_id: scriptId,
      script_label: String(p.scriptLabel || '').slice(0, 120),
      script_description: String(p.scriptDescription || '').slice(0, 500),
      channel,
      channel_action: channelAction,
      trigger,
      segment: String(p.segment || '').toLowerCase(),
      source: String(p.source || ''),
      contact_name: String(contact.name || '').slice(0, 80),
      contact_phone: String(contact.phone || '').slice(0, 20),
      contact_email: String(contact.email || '').slice(0, 120),
      ops_note: p.opsNote ? String(p.opsNote).slice(0, 500) : '',
      ops_status: 'nurture_auto_queued',
      created_at: now,
      dedupe_key: `nurture:${leadId}:${trigger}:${scriptId}`,
    },
  }];
}

if (type === 'attribution.conflict') {
  const p = body.payload || {};
  const conflictId = String(p.conflictId || '').trim();
  if (!conflictId) throw new Error('Validation: payload.conflictId is required');

  const phase = String(p.phase || 'opened').trim();
  const kind = String(p.kind || '').trim();
  const KIND_LABEL = {
    CTV_CLAIM_BLOCKED: 'CTV claim bị chặn',
    OPS_LEAD_CTV_LOCK: 'Lead Ops trùng CTV đang lock',
  };

  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'attribution_conflict',
      path: 'events',
      conflict_id: conflictId,
      phase,
      kind,
      kind_label: KIND_LABEL[kind] || kind,
      phone_masked: String(p.normalizedPhoneMasked || '***'),
      broker_id: String(p.brokerId || ''),
      reject_reason: p.rejectReason ? String(p.rejectReason) : '',
      reject_label: String(p.rejectLabel || ''),
      resolution: p.resolution ? String(p.resolution) : '',
      resolution_label: String(p.resolutionLabel || ''),
      platform_lead_source: p.platformLeadSource ? String(p.platformLeadSource) : '',
      noxh_case_code: p.noxhCaseCode ? String(p.noxhCaseCode) : '',
      customer_name: String(p.customerName || '').slice(0, 80),
      ops_status: phase === 'resolved' ? 'conflict_resolved' : 'conflict_open',
      created_at: now,
      dedupe_key: `conflict:${conflictId}:${phase}`,
    },
  }];
}

if (type === 'lead.noxh_loan_quick_check') {
  const p = body.payload || {};
  const leadId = String(p.leadId || '').trim();
  if (!leadId) throw new Error('Validation: payload.leadId is required');

  const rawTier = String(p.tier || 'WARM').toUpperCase();
  const tier = ['HOT', 'WARM', 'COLD'].includes(rawTier) ? rawTier : 'WARM';
  const ageStatus = String(p.ageStatus || 'NEEDS_REVIEW').toUpperCase();
  const contact = p.contact || {};
  const reasonCode =
    ageStatus === 'PROCEED'
      ? 'loan_age_proceed'
      : ageStatus === 'NOT_SUITABLE'
        ? 'loan_age_not_suitable'
        : 'loan_age_needs_review';
  const slaHours = tier === 'HOT' ? 2 : tier === 'WARM' ? 24 : 72;

  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'noxh',
      path: 'events',
      lead_id: leadId,
      tier,
      overall: ageStatus,
      credit_flag: 'NOT_CHECKED',
      reason_codes: [reasonCode],
      reason_codes_csv: reasonCode,
      recommended_action:
        tier === 'HOT'
          ? 'Gọi tư vấn phương án vay NOXH trong 2h'
          : tier === 'WARM'
            ? 'Rà soát tuổi vay và hồ sơ trong 24h'
            : 'Nurture phương án vay phù hợp',
      rules_version: 'noxh-loan-quick-check-v1',
      contact_name: String(contact.name || '').slice(0, 80),
      contact_phone: String(contact.phone || '').slice(0, 20),
      contact_email: String(contact.email || '').slice(0, 120),
      ops_status: tier === 'HOT' ? 'new_hot' : tier === 'WARM' ? 'new_warm' : 'nurture',
      assigned_to: '',
      sla_due_at: new Date(Date.now() + slaHours * 3600000).toISOString(),
      created_at: now,
      dedupe_key: `noxh-loan-quick:${leadId}`,
      has_credit_blocker: false,
      has_credit_caution: false,
    },
  }];
}

if (type === 'ops.request_created') {
  const p = body.payload || {};
  const requestId = String(p.requestId || '').trim();
  if (!requestId) throw new Error('Validation: payload.requestId is required');

  const contact = p.contact || {};
  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'ops_event',
      path: 'events',
      ops_event_type: type,
      request_id: requestId,
      ops_kind: String(p.kind || 'ops_request'),
      ops_title: String(p.title || 'Yêu cầu vận hành mới').slice(0, 160),
      ops_detail: String(p.detail || '').slice(0, 700),
      ops_priority: String(p.priority || 'high'),
      source: String(p.source || ''),
      contact_name: String(contact.name || '').slice(0, 80),
      contact_phone: String(contact.phone || '').slice(0, 20),
      contact_email: String(contact.email || '').slice(0, 120),
      public_url: String(p.adminUrl || ''),
      created_at: String(p.createdAt || now),
      dedupe_key: `ops:${p.kind || 'request'}:${requestId}`,
    },
  }];
}

if (type === 'lead.won') {
  const p = body.payload || {};
  const leadId = String(p.leadId || '').trim();
  if (!leadId) throw new Error('Validation: payload.leadId is required');
  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'ops_event',
      path: 'events',
      ops_event_type: type,
      request_id: leadId,
      ops_kind: 'lead_won',
      ops_title: `Lead ${leadId} đã WON`,
      ops_detail: `Trạng thái: ${String(p.status || 'WON')}`,
      ops_priority: 'high',
      created_at: now,
      dedupe_key: `lead-won:${leadId}`,
    },
  }];
}

if (type === 'commission.created') {
  const p = body.payload || {};
  const commissionId = String(p.commissionId || '').trim();
  if (!commissionId) throw new Error('Validation: payload.commissionId is required');
  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'ops_event',
      path: 'events',
      ops_event_type: type,
      request_id: commissionId,
      ops_kind: 'commission_created',
      ops_title: `Hoa hồng mới ${commissionId}`,
      ops_detail: `Lead ${String(p.leadId || '')} · Broker ${String(p.brokerId || '')} · Giá trị ${String(p.amount || '')}`,
      ops_priority: 'high',
      created_at: now,
      dedupe_key: `commission:${commissionId}`,
    },
  }];
}

if (type === 'promotion.spin_won') {
  const p = body.payload || {};
  const winId = String(p.winId || '').trim();
  if (!winId) throw new Error('Validation: payload.winId is required');
  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'ops_event',
      path: 'events',
      ops_event_type: type,
      request_id: winId,
      ops_kind: 'promotion_win',
      ops_title: `Trúng thưởng: ${String(p.prizeLabel || p.prizeTier || '')}`.slice(0, 160),
      ops_detail: `Chiến dịch ${String(p.campaignName || p.campaignSlug || '')} · Mã đổi quà ${String(p.redemptionCode || '')}`,
      ops_priority: 'normal',
      created_at: String(p.wonAt || now),
      dedupe_key: `promotion-win:${winId}`,
    },
  }];
}

if (type !== 'lead.noxh_checked') {
  throw new Error(`Unsupported HouseX event type: ${type || '(empty)'}`);
}

const p = body.payload || {};
const leadId = String(p.leadId || '').trim();
if (!leadId) throw new Error('Validation: payload.leadId is required');

const tier = String(p.tier || 'WARM').toUpperCase();
const contact = p.contact || {};
const reasonCodes = Array.isArray(p.reasonCodes) ? p.reasonCodes : [];

const slaHours = tier === 'HOT' ? 2 : tier === 'WARM' ? 24 : 72;
const slaDue = new Date(Date.now() + slaHours * 3600000).toISOString();

return [{
  json: {
    ok: true,
    skipped: false,
    event_path: 'noxh',
    path: 'events',
    lead_id: leadId,
    tier,
    overall: String(p.overall || ''),
    credit_flag: String(p.creditFlag || ''),
    reason_codes: reasonCodes,
    reason_codes_csv: reasonCodes.join(','),
    recommended_action: String(p.recommendedAction || ''),
    rules_version: String(p.rulesVersion || ''),
    contact_name: String(contact.name || '').slice(0, 80),
    contact_phone: String(contact.phone || '').slice(0, 20),
    contact_email: String(contact.email || '').slice(0, 120),
    ops_status: tier === 'HOT' ? 'new_hot' : tier === 'WARM' ? 'new_warm' : 'nurture',
    assigned_to: '',
    sla_due_at: slaDue,
    created_at: now,
    dedupe_key: `noxh:${leadId}`,
    has_credit_blocker: reasonCodes.includes('credit_blocker'),
    has_credit_caution: reasonCodes.includes('credit_caution'),
  },
}];
