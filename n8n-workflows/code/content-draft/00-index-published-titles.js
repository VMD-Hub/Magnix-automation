// n8n Code: index title đã publish/approved theo content_type — cho Title QA Gate

const res = $input.first().json;
const rows = Array.isArray(res.values) ? res.values : [];
const data = $getWorkflowStaticData('global');

const RULES = __TITLE_RULES_JSON__;
const CONTENT_TYPES = new Set(['NOXH_LEGAL', 'LOAN_FINANCE', 'VALUATION', 'GENERAL_POLICY']);

function segmentToType(segment) {
  const key = String(segment || '').trim().toLowerCase();
  const mapped = RULES.segment_to_content_type?.[key];
  return mapped && CONTENT_TYPES.has(mapped) ? mapped : 'GENERAL_POLICY';
}

const byType = {
  NOXH_LEGAL: [],
  LOAN_FINANCE: [],
  VALUATION: [],
  GENERAL_POLICY: [],
};

if (rows.length >= 2) {
  const headers = rows[0].map((x) => String(x ?? '').trim().toLowerCase());
  const idx = {
    title: headers.indexOf('title'),
    status: headers.indexOf('status'),
    meta: headers.indexOf('meta'),
    key: headers.indexOf('source_normalized_key'),
    segment: headers.indexOf('segment'),
  };
  const publishedStatuses = new Set(
    (RULES.published_statuses || ['approved', 'published']).map((s) => s.toLowerCase()),
  );

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    if (!cells?.some((c) => String(c ?? '').trim())) continue;
    const status = String(cells[idx.status] ?? '').trim().toLowerCase();
    if (!publishedStatuses.has(status)) continue;
    const title = String(cells[idx.title] ?? '').trim();
    if (!title) continue;

    let content_type = null;
    try {
      const metaRaw = cells[idx.meta];
      const meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw;
      content_type = meta?.content_type || meta?.content_type_router?.content_type || null;
    } catch {
      content_type = null;
    }
    if (!CONTENT_TYPES.has(content_type)) {
      content_type = segmentToType(cells[idx.segment]);
    }

    byType[content_type].push({
      title,
      normalized_key: String(cells[idx.key] ?? '').slice(0, 120),
    });
  }
}

data.published_titles_by_type = byType;
data.published_title_count = Object.values(byType).reduce((n, arr) => n + arr.length, 0);

function isCommentKeywordCta(text) {
  const t = String(text || '').trim();
  if (!t) return false;
  return /^comment\s+["']?[A-Z0-9_]+["']?/i.test(t)
    || /\bcomment\s+["']?[A-Z0-9_]+["']?\s+(?:để|de)\s/i.test(t);
}

const commentUnlockIndex = [];
const smStatuses = new Set(
  ['draft', 'review', 'approved', 'published'].map((s) => s.toLowerCase()),
);

if (rows.length >= 2) {
  const headers2 = rows[0].map((x) => String(x ?? '').trim().toLowerCase());
  const idx2 = {
    cta: headers2.indexOf('cta_opt_in'),
    status: headers2.indexOf('status'),
    created: headers2.indexOf('created_at'),
    key: headers2.indexOf('source_normalized_key'),
  };

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    if (!cells?.some((c) => String(c ?? '').trim())) continue;
    const status = String(cells[idx2.status] ?? '').trim().toLowerCase();
    if (!smStatuses.has(status)) continue;
    const cta = String(cells[idx2.cta] ?? '').trim();
    if (!isCommentKeywordCta(cta)) continue;
    commentUnlockIndex.push({
      normalized_key: String(cells[idx2.key] ?? '').slice(0, 120),
      created_at: String(cells[idx2.created] ?? '').trim() || null,
      status,
    });
  }
}

data.comment_unlock_index = commentUnlockIndex;

const coverageByTopic = {};
const coverageRecent = [];
const activeStatuses = new Set(['draft', 'review', 'approved', 'published']);
const topicPatterns = [
  { id: 'dti', re: /\\b(dti|dòng\\s+tiền|room\\s+vay)\\b/i },
  { id: 'noxh_income', re: /\\b(lương|thu\\s+nhập|triệu|đủ\\s+điều\\s+kiện)\\b/i },
  { id: 'noxh_profile', re: /\\b(hồ\\s+sơ|mẫu\\s*01|photo)\\b/i },
];

if (rows.length >= 2) {
  const h3 = rows[0].map((x) => String(x ?? '').trim().toLowerCase());
  const i3 = { title: h3.indexOf('title'), status: h3.indexOf('status'), meta: h3.indexOf('meta'), created: h3.indexOf('created_at'), segment: h3.indexOf('segment') };
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    if (!cells?.some((c) => String(c ?? '').trim())) continue;
    const status = String(cells[i3.status] ?? '').trim().toLowerCase();
    if (!activeStatuses.has(status)) continue;
    const title = String(cells[i3.title] ?? '').trim();
    if (!title) continue;
    const entry = { title, segment: String(cells[i3.segment] ?? ''), created_at: String(cells[i3.created] ?? '') };
    coverageRecent.push(entry);
    for (const p of topicPatterns) {
      if (p.re.test(title)) {
        if (!coverageByTopic[p.id]) coverageByTopic[p.id] = [];
        coverageByTopic[p.id].push(entry);
      }
    }
  }
}

data.content_coverage = { byTopic: coverageByTopic, recentTitles: coverageRecent.slice(0, 30) };

return [{
  json: {
    ok: true,
    published_title_count: data.published_title_count,
    comment_unlock_index_count: commentUnlockIndex.length,
    content_coverage_topics: Object.keys(coverageByTopic).length,
    by_type_counts: Object.fromEntries(
      Object.entries(byType).map(([k, v]) => [k, v.length]),
    ),
  },
}];
