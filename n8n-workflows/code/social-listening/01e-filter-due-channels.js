// n8n Code: bỏ kênh đã scrape trong interval (schedule). Manual run = luôn quét.

const INTERVAL_DAYS = __CHANNEL_SCRAPE_INTERVAL_DAYS__;

function handleFromUrl(url, platform) {
  const u = String(url || '').trim();
  if (platform === 'tiktok') {
    const m = u.match(/@([^/?#]+)/);
    return (m?.[1] || u).toLowerCase();
  }
  if (platform === 'fb_page' || platform === 'fb_group') {
    try {
      const path = new URL(u).pathname.replace(/^\//, '').split('/')[0];
      return path.toLowerCase();
    } catch {
      return u.toLowerCase();
    }
  }
  return u.toLowerCase();
}

const isManual = $execution?.mode === 'manual';
const data = $getWorkflowStaticData('global');
const state = data.channel_state || {};
const now = Date.now();
const ms = INTERVAL_DAYS * 24 * 60 * 60 * 1000;

const out = [];
let skipped = 0;

for (const item of $input.all()) {
  if (item.json.empty) return [item];

  const platform = String(item.json.platform || 'tiktok');
  const handle = handleFromUrl(item.json.post_url, platform);
  const prev = state[handle];

  if (!isManual && prev?.last_scraped_at) {
    const t = Date.parse(prev.last_scraped_at);
    if (Number.isFinite(t) && now - t < ms) {
      skipped += 1;
      continue;
    }
  }

  out.push({
    json: {
      ...item.json,
      channel_handle: handle,
    },
  });
}

if (!out.length) {
  return [{
    json: {
      empty: true,
      message: `All channels skipped (scraped within ${INTERVAL_DAYS} days). Manual run bypasses this.`,
      skipped,
    },
  }];
}

return out;
