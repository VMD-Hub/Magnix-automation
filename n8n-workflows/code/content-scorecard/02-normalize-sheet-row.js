// n8n Code: map Google Sheet columns → score.mjs post input

const PLATFORM_ALIASES = {
  tiktok: 'tiktok',
  tt: 'tiktok',
  'fb reels': 'fb_reels',
  fb_reels: 'fb_reels',
  reels: 'fb_reels',
  'fb page': 'fb_page',
  fb_page: 'fb_page',
  page: 'fb_page',
  facebook: 'fb_page',
  youtube_shorts: 'youtube_shorts',
  shorts: 'youtube_shorts',
  yt_shorts: 'youtube_shorts',
};

function num(v) {
  if (v == null || v === '') return null;
  const n = Number(String(v).replace(/,/g, '').replace('%', ''));
  if (Number.isNaN(n)) return null;
  if (String(v).includes('%') && n > 1) return n / 100;
  return n;
}

function int(v) {
  const n = num(v);
  return n == null ? null : Math.round(n);
}

function normalizePlatform(raw) {
  const key = String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  return PLATFORM_ALIASES[key] || key;
}

const METRIC_KEYS = [
  'reach',
  'views',
  'completion_rate',
  'rewatch_rate',
  'save_rate',
  'share_rate',
  'early_swipe_away_3s',
  'retention_3s',
  'retention_50pct',
  'loop_factor',
  'viewed_not_swiped',
  'apv',
  'swipe_away_3s',
  'video_avg_watch_pct',
  'comment_rate',
  'keyword_comments',
  'dm_opt_in',
  'form_submit',
  'warm_lead_rate',
  'ivi',
];

const results = [];

for (const item of $input.all()) {
  const row = item.json;
  if (row.empty === true) {
    results.push({ json: row });
    continue;
  }

  const platform = normalizePlatform(row.platform);
  const postId = String(row.post_id || '').trim();

  if (!postId || !platform) {
    results.push({
      json: {
        ok: false,
        error: 'MISSING_POST_OR_PLATFORM',
        post_id: postId,
        platform,
        _sheet_row_number: row._sheet_row_number,
      },
    });
    continue;
  }

  const metrics = {};
  for (const key of METRIC_KEYS) {
    const val = num(row[key]);
    if (val != null) metrics[key] = val;
  }

  if (metrics.views && !metrics.reach) metrics.reach = metrics.views;

  results.push({
    json: {
      ok: true,
      post_id: postId,
      platform,
      segment: String(row.segment || 'general_inbound').trim(),
      metrics,
      _sheet_row_number: row._sheet_row_number,
      content_summary: String(row.content_summary || '').slice(0, 500),
    },
  });
}

return results;
