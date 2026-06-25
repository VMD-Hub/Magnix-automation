// n8n Code: wrap Apify dataset item + config context for Claude

const config = $('Loop Over URLs').item?.json || $('Split URLs from Config').item?.json || {};
const apifyRaw = $input.first().json;

const items = Array.isArray(apifyRaw) ? apifyRaw : [apifyRaw];
const results = [];

for (const post of items) {
  if (!post || typeof post !== 'object') continue;
  if (post.noResults === true) continue;
  if (post.error || post.errorCode) continue;
  if (post.error && !post.id && !post.postId && !post.videoId) continue;

  const post_id =
    post.id ||
    post.postId ||
    post.videoId ||
    post.shortCode ||
    post.aweme_id ||
    String(post.url || config.post_url || '').split('/').filter(Boolean).pop() ||
    '';

  const channel = post.channel || post.authorMeta || post.author || {};
  const username = channel.username || channel.name || '';
  const post_url =
    post.url ||
    post.webVideoUrl ||
    post.link ||
    (username && post_id
      ? `https://www.tiktok.com/@${username}/video/${post_id}`
      : '') ||
    config.post_url ||
    '';

  const text =
    post.text ||
    post.desc ||
    post.description ||
    post.caption ||
    post.title ||
    '';

  results.push({
    json: {
      post_id: String(post_id),
      post_url: String(post_url),
      platform: config.platform || post.platform || 'tiktok',
      author_id: String(
        post.authorId || channel.id || post.author?.id || post.ownerId || ''
      ),
      text: String(text).slice(0, 50000),
      engagement: {
        play: Number(post.playCount ?? 0),
        likes: Number(post.diggCount ?? 0),
        comments: Number(post.commentCount ?? 0),
        shares: Number(post.shareCount ?? 0),
      },
      apify_item: post,
      config_notes: config.notes || '',
    },
  });
}

if (!results.length) {
  return [{
    json: {
      ok: false,
      error: 'APIFY_EMPTY',
      post_url: config.post_url,
      hint: 'Apify quota hoặc URL không có post — kiểm tra output node Apify Scrape',
    },
  }];
}

return results;
