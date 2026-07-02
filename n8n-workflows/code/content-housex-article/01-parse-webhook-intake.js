// n8n Code: parse webhook intake — HouseX article PR

const BANNED = __HOUSEX_BANNED_PATTERNS_JSON__;
const DEFAULT_CLOSING = __HOUSEX_DEFAULT_CLOSING_JSON__;

function slugify(input) {
  return String(input || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const raw = $input.first().json;
const body = raw.body && typeof raw.body === 'object' ? raw.body : raw;

const topic = String(body.topic || body.title_hint || '').trim();
if (!topic) {
  return [{ json: { ok: false, error: 'MISSING_TOPIC', message: 'Cần topic hoặc title_hint' } }];
}

const angle = String(body.angle || 'tod').trim().toLowerCase();
const projectSlug = String(body.project_slug || 'dta-happy-home-nhon-trach').trim();
const segment = String(body.segment || 'noxh_income').trim().toLowerCase();
const closingVariant =
  String(body.closing_variant || DEFAULT_CLOSING[angle] || 'gaQuyHoach').trim();

const requestId =
  String(body.request_id || `housex-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

return [{
  json: {
    ok: true,
    request_id: requestId,
    topic,
    angle,
    project_slug: projectSlug,
    closing_variant: closingVariant,
    segment,
    slug_hint: slugify(body.slug_hint || topic),
    source_refs: Array.isArray(body.source_refs) ? body.source_refs.slice(0, 12) : [],
    factsheet: body.factsheet && typeof body.factsheet === 'object' ? body.factsheet : {},
    editorial_brief_v1: body.editorial_brief_v1 || null,
    legal_retrieval_pack: body.legal_retrieval_pack || null,
    run_devil: body.run_devil !== false,
    triggered_at: new Date().toISOString(),
    source: String(body.source || raw.source || 'webhook'),
  },
}];
