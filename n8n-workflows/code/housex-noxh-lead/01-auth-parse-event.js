// Parse envelope từ HouseX EVENTS_WEBHOOK_URL: { type, payload, sentAt }
// Hỗ trợ: lead.noxh_checked · lead.created · account.registered · ctv.application_submitted

const SECRET = $env.EVENTS_WEBHOOK_SECRET || '';
const headers = $input.first().json.headers || {};
const got = headers['x-events-secret'] || headers['X-Events-Secret'] || '';
if (SECRET && got !== SECRET) {
  throw new Error('Unauthorized: invalid EVENTS_WEBHOOK_SECRET');
}

const raw = $input.first().json;
const body = raw.body && typeof raw.body === 'object' ? raw.body : raw;
const type = String(body.type || '').trim();
const now = body.sentAt || new Date().toISOString();

if (type === 'lead.created') {
  const p = body.payload || {};
  const leadId = String(p.leadId || '').trim();
  if (!leadId) throw new Error('Validation: payload.leadId is required');

  const contact = p.contact || {};
  const ctx = p.context || {};
  const projectType = String(ctx.projectType || 'THUONG_MAI').toUpperCase();
  const slaDue = new Date(Date.now() + 2 * 3600000).toISOString();

  return [{
    json: {
      ok: true,
      skipped: false,
      event_path: 'inquiry',
      path: 'events',
      lead_id: leadId,
      source: String(p.source || 'organic'),
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
      ops_status: 'new_inquiry',
      sla_due_at: slaDue,
      created_at: String(p.createdAt || now),
      dedupe_key: `inquiry:${leadId}`,
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

if (type !== 'lead.noxh_checked') {
  return [{ json: { ok: true, skipped: true, event_path: 'none', path: 'events', reason: 'UNSUPPORTED_EVENT', type } }];
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
