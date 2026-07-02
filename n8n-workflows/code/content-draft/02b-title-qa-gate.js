// n8n Code: Title QA Gate — sau LLM, trước Parse Layer chính
// Config baked: __TITLE_RULES_JSON__ + __TITLE_WHITELIST_JSON__

const RULES = __TITLE_RULES_JSON__;
const TITLE_WHITELIST = __TITLE_WHITELIST_JSON__;
const CONTENT_TYPES = new Set(['NOXH_LEGAL', 'LOAN_FINANCE', 'VALUATION', 'GENERAL_POLICY']);
const source = $('Loop Draft Candidates').item?.json || {};
const llmJson = $input.first().json;

function extractJsonString(raw) {
  if (raw == null) throw new Error('EMPTY_LLM_OUTPUT');
  const s = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let t = (fenced ? fenced[1] : s).trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return t;
}

function segmentToType(segment) {
  const key = String(segment || '').trim().toLowerCase();
  const mapped = RULES.segment_to_content_type?.[key];
  return mapped && CONTENT_TYPES.has(mapped) ? mapped : 'GENERAL_POLICY';
}

function validateTitle(title) {
  const t = String(title || '').trim();
  const reasons = [];
  if (!t) return { pass: false, reasons: ['EMPTY_TITLE'] };
  if (/\[(TEST|DRAFT|WIP)\]/i.test(t)) {
    reasons.push('Draft tag [TEST]/[DRAFT]/[WIP] found in title');
  }
  const placeholders = [
    { re: /\{\{[^}]+\}\}/, reason: 'Unrendered template variable {{...}} in title' },
    { re: /\bX\s+tri[eệ]u\b/i, reason: 'Unfilled placeholder "X triệu" in title' },
    { re: /\[số\]/i, reason: 'Unfilled placeholder "[số]" in title' },
    { re: /_{3,}/, reason: 'Unfilled placeholder "___" in title' },
  ];
  for (const p of placeholders) {
    if (p.re.test(t)) reasons.push(p.reason);
  }
  const ctas = [
    { re: /\bcomment\b/i, reason: 'CTA content found in title field — move to cta_templates.json' },
    { re: /\btải\s+ngay\b/i, reason: 'CTA content found in title field — move to cta_templates.json' },
    { re: /\blink\s+drive\b/i, reason: 'CTA content found in title field — move to cta_templates.json' },
    { re: /\bMAU0?1\b/i, reason: 'CTA content found in title field — move to cta_templates.json' },
    { re: /\bCHECKLIST\b/i, reason: 'CTA content found in title field — move to cta_templates.json' },
    { re: /^[\s📂📥]+/u, reason: 'CTA content found in title field — move to cta_templates.json' },
  ];
  for (const p of ctas) {
    if (p.re.test(t)) reasons.push(p.reason);
  }
  if (reasons.length) return { pass: false, reasons, capitalization_error: false };

  const cap = validateTitleCapitalization(t, TITLE_WHITELIST);
  if (!cap.pass) {
    return { pass: false, reasons: cap.reasons, capitalization_error: true };
  }
  return { pass: true, reasons: [], capitalization_error: false };
}

function buildWhitelistLookup(whitelist) {
  const set = new Set();
  for (const term of whitelist || []) {
    const w = String(term || '').trim();
    if (w) set.add(w.toUpperCase());
  }
  return set;
}

function stripEdgePunctuation(word) {
  return String(word || '').replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
}

function splitTitleWords(title) {
  return String(title || '').trim().split(/\s+/).filter(Boolean);
}

function isSentenceStart(title, wordIndex) {
  if (wordIndex === 0) return true;
  const before = splitTitleWords(title).slice(0, wordIndex).join(' ');
  return /[.?!]["')\]]?\s*$/.test(before);
}

function uppercaseLetters(core) {
  return [...String(core || '')].filter((c) => /\p{Lu}/u.test(c));
}

function validateTitleCapitalization(title, whitelist) {
  const t = String(title || '').trim();
  const reasons = [];
  const lookup = buildWhitelistLookup(whitelist);
  const words = splitTitleWords(t);

  for (let i = 0; i < words.length; i++) {
    const core = stripEdgePunctuation(words[i]);
    if (!core || /^[\d\W]+$/.test(core)) continue;
    if (lookup.has(core.toUpperCase())) continue;

    const uppers = uppercaseLetters(core);
    const atStart = isSentenceStart(t, i);

    if (atStart) {
      if (uppers.length > 1) {
        reasons.push(`Word "${core}": ALL CAPS or multiple uppercase at sentence start — use sentence case`);
      } else if (uppers.length === 1 && core[0] !== uppers[0]) {
        reasons.push(`Word "${core}": invalid capitalization at sentence start`);
      }
      continue;
    }

    if (uppers.length >= 2) {
      reasons.push(`Word "${core}": English Title Case or ALL CAPS not allowed mid-sentence (use sentence case)`);
    } else if (uppers.length === 1) {
      reasons.push(`Word "${core}": unexpected capitalization mid-sentence — only sentence-start or whitelist terms may be uppercase`);
    }
  }

  return { pass: reasons.length === 0, reasons };
}

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 1);
}

function jaccard(a, b) {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (!A.size && !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;
  return inter / (A.size + B.size - inter);
}

const raw =
  llmJson?.choices?.[0]?.message?.content
  ?? llmJson?.content?.[0]?.text
  ?? llmJson?.message?.content
  ?? llmJson;

let title = '';
let content_type = null;
let segment = null;

try {
  const parsed = JSON.parse(extractJsonString(raw));
  title = String(parsed.title || '').trim();
  content_type = String(parsed.content_type || '').trim().toUpperCase() || null;
  segment = String(parsed.segment || '').trim().toLowerCase() || null;
  if (!title) throw new Error('MISSING_TITLE');
} catch (e) {
  const data = $getWorkflowStaticData('global');
  if (!data.a3_stats) data.a3_stats = {};
  data.a3_stats.title_rejected = (data.a3_stats.title_rejected || 0) + 1;
  return [{
    json: {
      ...llmJson,
      title_qa_pass: false,
      qa_status: 'title_rejected',
      title_qa_reason: e.message || 'TITLE_JSON_EXTRACT_FAIL',
      title_qa: {
        normalized_key: String(source.normalized_key || '').slice(0, 120),
        pass: false,
        reasons: [e.message || 'TITLE_JSON_EXTRACT_FAIL'],
      },
      queue_sheet_row: source.sheet_row,
    },
  }];
}

const resolvedType = CONTENT_TYPES.has(content_type)
  ? content_type
  : segmentToType(segment || source.segment);

const validation = validateTitle(title);
if (!validation.pass) {
  const data = $getWorkflowStaticData('global');
  if (!data.a3_stats) data.a3_stats = {};
  if (validation.capitalization_error) {
    data.a3_stats.title_capitalization_error = (data.a3_stats.title_capitalization_error || 0) + 1;
  } else {
    data.a3_stats.title_rejected = (data.a3_stats.title_rejected || 0) + 1;
  }
  const qaStatus = validation.capitalization_error
    ? 'title_capitalization_error'
    : 'title_rejected';
  return [{
    json: {
      ...llmJson,
      title_qa_pass: false,
      qa_status: qaStatus,
      title_qa_reason: validation.reasons.join('; '),
      title_qa: {
        normalized_key: String(source.normalized_key || '').slice(0, 120),
        title_preview: title.slice(0, 120),
        content_type: resolvedType,
        pass: false,
        reasons: validation.reasons,
        capitalization_error: Boolean(validation.capitalization_error),
      },
      queue_sheet_row: source.sheet_row,
    },
  }];
}

const data = $getWorkflowStaticData('global');
const published = data.published_titles_by_type?.[resolvedType] || [];
const threshold = Number(RULES.similarity_threshold ?? 0.7);
let duplicate_review = false;
let dupMeta = {};

let bestScore = 0;
let best = null;
for (const row of published) {
  const score = jaccard(title, row.title);
  if (score > bestScore) {
    bestScore = score;
    best = row;
  }
}

if (bestScore > threshold && best) {
  duplicate_review = true;
  dupMeta = {
    similarity: Number(bestScore.toFixed(3)),
    matched_title: best.title,
    matched_normalized_key: best.normalized_key,
    duplicate_message: `Có thể trùng chủ đề với bài "${best.title}" (similarity=${bestScore.toFixed(2)})`,
  };
  if (!data.a3_stats) data.a3_stats = {};
  data.a3_stats.title_dup_review = (data.a3_stats.title_dup_review || 0) + 1;
}

return [{
  json: {
    ...llmJson,
    title_qa_pass: true,
    title_duplicate_review: duplicate_review,
    title_qa: {
      normalized_key: String(source.normalized_key || '').slice(0, 120),
      title_preview: title.slice(0, 120),
      content_type: resolvedType,
      pass: true,
      reasons: [],
      duplicate_review,
      similarity: bestScore ? Number(bestScore.toFixed(3)) : 0,
      ...dupMeta,
    },
  },
}];
