// Parse NOXH_DETAIL_WEBHOOK_URL — type lead.noxh_checked.detail (PII tài chính → Sheet).

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

if (type !== 'lead.noxh_checked.detail') {
  return [{ json: { ok: true, skipped: true, path: 'detail', reason: 'NOT_DETAIL_EVENT', type } }];
}

const p = body.payload || {};
const leadId = String(p.leadId || '').trim();
if (!leadId) throw new Error('Validation: payload.leadId is required');

const s = p.situation || {};
const c = p.contact || {};
const now = body.sentAt || new Date().toISOString();

return [{
  json: {
    ok: true,
    skipped: false,
    path: 'detail',
    lead_id: leadId,
    tier: String(p.tier || ''),
    object_group: String(s.objectGroup || ''),
    marital_status: String(s.maritalStatus || ''),
    applicant_income: Number(s.applicantMonthlyIncome) || 0,
    spouse_income: Number(s.spouseMonthlyIncome) || 0,
    owns_home: s.ownsHomeInProvince === true,
    area_per_person: s.areaPerPersonSqm,
    intend_to_borrow: s.intendToBorrow === true,
    existing_debt: Number(s.existingMonthlyDebtPayment) || 0,
    card_limit: Number(s.creditCardLimitTotal) || 0,
    bad_debt: String(s.badDebtSelfOrSpouse || ''),
    timeframe: String(s.timeframe || ''),
    dti: s.dti != null ? Number(s.dti) : null,
    contact_name: String(c.name || '').slice(0, 80),
    contact_phone: String(c.phone || '').slice(0, 20),
    contact_email: String(c.email || '').slice(0, 120),
    evaluation_reasons: JSON.stringify(p.evaluationReasons || []).slice(0, 8000),
    credit_reasons: JSON.stringify(p.creditReasons || []).slice(0, 8000),
    next_steps: JSON.stringify(p.nextSteps || []).slice(0, 8000),
    rules_version: String(p.rulesVersion || ''),
    created_at: now,
  },
}];
