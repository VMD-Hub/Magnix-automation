// n8n Code: lọc project_config theo platform (tiktok | fb_page | fb_group)
// PLATFORMS injected at build: __LISTEN_PLATFORMS__

const ALLOW = new Set('__LISTEN_PLATFORMS__'.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean));

const ALIASES = {
  facebook: 'fb_page',
  fb: 'fb_page',
  page: 'fb_page',
  group: 'fb_group',
  fb_group: 'fb_group',
  fb_page: 'fb_page',
  tiktok: 'tiktok',
  tt: 'tiktok',
};

function normPlatform(raw) {
  const key = String(raw || 'tiktok').trim().toLowerCase();
  return ALIASES[key] || key;
}

const out = [];
for (const item of $input.all()) {
  if (item.json.empty) {
    return [{ json: item.json }];
  }
  const platform = normPlatform(item.json.platform);
  if (!ALLOW.has(platform)) continue;
  out.push({
    json: {
      ...item.json,
      platform,
    },
  });
}

if (!out.length) {
  return [{
    json: {
      empty: true,
      message: `No active URLs for platforms: ${[...ALLOW].join(', ')}`,
    },
  }];
}

return out;
