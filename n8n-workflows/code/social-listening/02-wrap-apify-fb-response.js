// n8n Code: wrap Apify facebook-posts-scraper → format chung cho Claude

const config = $('Loop Over URLs').item?.json || $('Split URLs from Config').item?.json || {};
const apifyRaw = $input.first().json;
const items = Array.isArray(apifyRaw) ? apifyRaw : [apifyRaw];
const results = [];

for (const post of items) {
  if (!post || typeof post !== 'object') continue;
  if (post.error) continue;

  const post_id = String(post.postId || post.post_id || post.id || '').trim();
  const text = String(
    post.text || post.message || post.caption || post.content || ''
  ).slice(0, 50000);

  const post_url = String(
    post.url || post.facebookUrl || post.link || config.post_url || ''
  );

  if (!post_id && !text) continue;

  results.push({
    json: {
      post_id: post_id || post_url.split('/').filter(Boolean).pop() || 'unknown',
      post_url,
      platform: config.platform || 'fb_page',
      author_id: String(post.pageName || post.user?.name || post.author || ''),
      text,
      apify_item: post,
      config_notes: config.notes || '',
      engagement: {
        likes: Number(post.likes ?? post.likesCount ?? 0),
        comments: Number(post.comments ?? post.commentsCount ?? 0),
        shares: Number(post.shares ?? post.sharesCount ?? 0),
      },
    },
  });
}

if (!results.length) {
  return [{
    json: {
      ok: false,
      error: 'APIFY_EMPTY',
      post_url: config.post_url,
      hint: 'Facebook page/group trống hoặc Apify lỗi',
    },
  }];
}

return results;
