/**
 * Content coverage map — tránh trùng chủ đề DTI/thu nhập/NOXH giữa các bài.
 */

const TOPIC_PATTERNS = [
  { id: 'dti', re: /\b(dti|dòng\s+tiền|room\s+vay|tỷ\s+lệ\s+trả\s+nợ)\b/i },
  { id: 'noxh_income', re: /\b(lương|thu\s+nhập|triệu|đủ\s+điều\s+kiện)\b/i },
  { id: 'noxh_profile', re: /\b(hồ\s+sơ|mẫu\s*01|photo|giấy\s+tờ)\b/i },
  { id: 'cic', re: /\b(cic|nợ\s+xấu|tín\s+dụng)\b/i },
  { id: 'geo', re: /\b(tp\.?hcm|bình\s+dương|tỉnh\s+dự\s+án)\b/i },
];

/** @param {string} text */
export function detectTopicIds(text) {
  const t = String(text || '');
  const ids = [];
  for (const p of TOPIC_PATTERNS) {
    if (p.re.test(t)) ids.push(p.id);
  }
  return ids;
}

/**
 * @param {string[][]} rows — content_drafts sheet
 */
export function indexContentCoverage(rows) {
  const byTopic = {};
  const recentTitles = [];

  if (!Array.isArray(rows) || rows.length < 2) {
    return { byTopic, recentTitles };
  }

  const headers = rows[0].map((x) => String(x ?? '').trim().toLowerCase());
  const idx = {
    title: headers.indexOf('title'),
    status: headers.indexOf('status'),
    segment: headers.indexOf('segment'),
    meta: headers.indexOf('meta'),
    created: headers.indexOf('created_at'),
  };

  const activeStatuses = new Set(['draft', 'review', 'approved', 'published']);

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    if (!cells?.some((c) => String(c ?? '').trim())) continue;

    const status = String(cells[idx.status] ?? '').trim().toLowerCase();
    if (!activeStatuses.has(status)) continue;

    const title = String(cells[idx.title] ?? '').trim();
    if (!title) continue;

    let pillar = null;
    let content_type = null;
    try {
      const meta = JSON.parse(String(cells[idx.meta] ?? ''));
      pillar = meta?.content_pillar || meta?.editorial_brief_v1?.content_pillar || null;
      content_type = meta?.content_type || null;
    } catch {
      pillar = null;
    }

    const topics = detectTopicIds(title);
    const entry = {
      title,
      segment: String(cells[idx.segment] ?? '').trim(),
      pillar,
      content_type,
      created_at: String(cells[idx.created] ?? '').trim() || null,
    };

    recentTitles.push(entry);
    for (const topic of topics) {
      if (!byTopic[topic]) byTopic[topic] = [];
      byTopic[topic].push(entry);
    }
  }

  recentTitles.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
  return { byTopic, recentTitles: recentTitles.slice(0, 30) };
}

/**
 * @param {{ title?: string, segment?: string, editorial_brief_v1?: object }} candidate
 * @param {{ byTopic?: object, recentTitles?: object[] }} coverage
 */
export function findCoverageOverlap(candidate, coverage = {}) {
  const title = String(
    candidate.title
    || candidate.editorial_brief_v1?.editorial_title
    || candidate.text
    || '',
  ).slice(0, 500);

  const topics = detectTopicIds(title);
  const overlaps = [];

  for (const topic of topics) {
    const existing = coverage.byTopic?.[topic] || [];
    if (existing.length >= 2) {
      overlaps.push({
        topic,
        count: existing.length,
        recent_titles: existing.slice(0, 3).map((e) => e.title),
      });
    }
  }

  return {
    topics,
    overlap: overlaps.length > 0,
    overlaps,
    avoid_angles: overlaps.flatMap((o) => o.recent_titles).slice(0, 5),
  };
}

/** Editorial / publish priority — sớm hơn trước */
export function editorialPriorityScore(row, meta = {}) {
  const scheduled = meta.scheduled_publish_at
    || meta.editorial_brief_v1?.scheduled_publish_at
    || meta.publish_at
    || null;
  if (scheduled) {
    const t = new Date(scheduled).getTime();
    if (!Number.isNaN(t)) return t;
  }
  const calId = String(meta.editorial_calendar_id || '').trim();
  if (calId) {
    const num = Number(calId.split(':').pop());
    if (Number.isFinite(num)) return num;
  }
  const pageKey = String(meta.editorial_page_key || '').trim();
  if (pageKey) {
    const num = Number(pageKey.split(':').pop());
    if (Number.isFinite(num)) return num;
  }
  return 999999;
}
