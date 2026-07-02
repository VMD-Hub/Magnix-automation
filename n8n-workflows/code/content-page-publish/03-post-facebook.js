// n8n Code: POST Graph API — Page feed hoặc photo (ảnh minh họa)

const item = $input.first().json;
if (!item.ok || !item.message) {
  return [{ json: { ...item, publish_ok: false } }];
}

const version = String($env.META_GRAPH_API_VERSION || 'v21.0').trim();
const pageId = String(item.page_id || $env.META_PAGE_ID || '').trim();
const token = String($env.META_PAGE_ACCESS_TOKEN || '').trim();

if (!pageId || !token) {
  return [{
    json: {
      ...item,
      publish_ok: false,
      publish_error: 'MISSING_META_CREDENTIALS',
    },
  }];
}

const imageUrl = String(item.publish_image_url || '').trim();
const link = String(item.link || '').trim();

const body = {
  message: item.message,
  access_token: token,
};

let endpoint = `/${pageId}/feed`;
if (imageUrl) {
  body.url = imageUrl;
  endpoint = `/${pageId}/photos`;
} else if (link) {
  body.link = link;
}

function toFormUrlEncoded(data) {
  return Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}

try {
  const res = await this.helpers.httpRequest({
    method: 'POST',
    url: `https://graph.facebook.com/${version}${endpoint}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: toFormUrlEncoded(body),
    json: true,
    timeout: 30000,
  });

  const postId = res.id || res.post_id || null;
  if (!postId) {
    return [{
      json: {
        ...item,
        publish_ok: false,
        publish_error: 'NO_POST_ID_IN_RESPONSE',
        graph_response: res,
        publish_mode: imageUrl ? 'photo' : link ? 'link' : 'text',
      },
    }];
  }

  return [{
    json: {
      ...item,
      publish_ok: true,
      fb_post_id: postId,
      fb_permalink: `https://www.facebook.com/${postId}`,
      published_at: new Date().toISOString(),
      graph_response: { id: postId },
      publish_mode: imageUrl ? 'photo' : link ? 'link' : 'text',
    },
  }];
} catch (e) {
  const graph = e.response?.data || e.cause?.response?.data || e.description || e.message;
  const fbMsg = graph?.error?.message || (typeof graph === 'string' ? graph : null);
  return [{
    json: {
      ...item,
      publish_ok: false,
      publish_error: fbMsg || JSON.stringify(graph).slice(0, 500),
      publish_error_code: graph?.error?.code || null,
      publish_mode: imageUrl ? 'photo' : link ? 'link' : 'text',
    },
  }];
}
