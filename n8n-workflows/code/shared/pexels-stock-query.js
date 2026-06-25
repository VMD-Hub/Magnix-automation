// Shared: Pexels stock_query EN-only + Agent 6 v3 validation (Agent 7)

const VI_DIACRITIC = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

const ROLE_STOCK_QUERY = {
  hook: 'Vietnamese young couple phone apartment surprised',
  tension: 'worried person mortgage paperwork desk close up',
  value: 'Vietnam apartment living room interior family',
  proof: 'calculator bank documents desk flat lay no people',
  checklist: 'checklist document pen phone desk no people',
  cta: 'Vietnam city skyline apartment sunset portrait',
  brand_outro: 'Vietnam warm sunset apartment keys handover portrait',
};

function looksVietnamese(text) {
  return VI_DIACRITIC.test(String(text || ''));
}

function sanitizeEnglishStockQuery(raw) {
  return String(raw || '')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

function isEnglishStockQuery(raw) {
  const rawStr = String(raw || '').trim();
  if (rawStr.length < 5) return false;
  if (looksVietnamese(rawStr)) return false;

  const q = sanitizeEnglishStockQuery(rawStr);
  if (q.length < 5) return false;
  if (q.length < rawStr.length * 0.85) return false;

  const letters = q.match(/[a-zA-Z]/g) || [];
  const alnum = q.replace(/\s/g, '');
  if (!alnum.length) return false;
  return letters.length / alnum.length >= 0.65;
}

function parseBeatsJson(raw) {
  if (!raw) return [];
  try {
    const beats = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(beats) ? beats : [];
  } catch {
    return [];
  }
}

function validateBeatsRenderSpec(beats) {
  const errors = [];
  if (!Array.isArray(beats) || beats.length < 4) {
    return {
      ok: false,
      errors: [{ code: 'INSUFFICIENT_BEATS', hint: 'Cần ≥4 beats — re-run Agent 6 v3' }],
      production_brief_version: null,
    };
  }

  let versionHint = null;
  for (let i = 0; i < beats.length; i += 1) {
    const b = beats[i] || {};
    const spec = b.visual_spec && typeof b.visual_spec === 'object' ? b.visual_spec : null;
    const type = String(spec?.type || 'broll').toLowerCase();

    if (!spec) {
      errors.push({
        beat_index: i,
        role: b.role || null,
        code: 'MISSING_VISUAL_SPEC',
        hint: 'Beat thiếu visual_spec — Agent 6 phải production_brief_version: 3',
      });
      versionHint = versionHint || 'legacy';
      continue;
    }

    if (type !== 'broll') continue;

    const sq = String(spec.stock_query || '').trim();
    if (!sq || sq.length < 5) {
      errors.push({
        beat_index: i,
        role: b.role || null,
        code: 'MISSING_STOCK_QUERY',
        hint: 'visual_spec.stock_query bắt buộc (English, ≤80 chars)',
      });
      continue;
    }
    if (!isEnglishStockQuery(sq)) {
      errors.push({
        beat_index: i,
        role: b.role || null,
        code: 'STOCK_QUERY_NOT_ENGLISH',
        stock_query_preview: sq.slice(0, 60),
        hint: 'stock_query phải tiếng Anh — không dùng mô tả visual tiếng Việt',
      });
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    beat_count: beats.length,
    production_brief_version: versionHint === 'legacy' ? '<3' : errors.length ? 'invalid' : '3',
  };
}

function roleFallbackQuery(beat, segment) {
  const role = String(beat?.role || 'value').toLowerCase();
  const base = ROLE_STOCK_QUERY[role] || ROLE_STOCK_QUERY.value;
  const segKey = String(segment || '').toLowerCase();
  if (role === 'hook' && segKey === 'noxh_income') {
    return 'Vietnam social housing young family apartment keys'.slice(0, 80);
  }
  if (role === 'hook' && segKey === 'sme_credit') {
    return 'Vietnamese small business owner bank office'.slice(0, 80);
  }
  return base.slice(0, 80);
}

function resolvePexelsStockQuery(beat, segment) {
  const spec = beat?.visual_spec || {};
  const type = String(spec.type || 'broll').toLowerCase();
  if (type !== 'broll') return null;

  const sq = sanitizeEnglishStockQuery(spec.stock_query);
  if (!isEnglishStockQuery(sq)) return null;

  const lower = sq.toLowerCase();
  const hasVn = lower.includes('vietnam') || lower.includes('vietnamese') || lower.includes('southeast asian');
  const segKey = String(segment || '').toLowerCase();
  const preferVn = segKey === 'noxh_income' || segKey === 'valuation' || segKey === 'sme_credit';
  const noPeople = lower.includes('no people') || lower.includes('no person');

  if (preferVn && !hasVn && !noPeople) {
    return `Vietnamese ${sq}`.slice(0, 80);
  }
  return sq;
}

/* eslint-disable no-unused-vars -- stripped when inlined to n8n */
if (typeof globalThis !== 'undefined') {
  globalThis.parseBeatsJson = parseBeatsJson;
  globalThis.validateBeatsRenderSpec = validateBeatsRenderSpec;
  globalThis.resolvePexelsStockQuery = resolvePexelsStockQuery;
  globalThis.isEnglishStockQuery = isEnglishStockQuery;
  globalThis.roleFallbackQuery = roleFallbackQuery;
}
