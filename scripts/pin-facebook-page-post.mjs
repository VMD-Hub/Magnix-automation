#!/usr/bin/env node
/**
 * Hướng dẫn ghim bài Facebook Page (API hạn chế).
 * Usage: node scripts/pin-facebook-page-post.mjs --post-id 1031319423401254_xxx
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, 'n8n-workflows/.env');

function loadEnv() {
  const env = {};
  if (!existsSync(envPath)) return env;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i > 0) env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

const postId = process.argv.find((a, i) => process.argv[i - 1] === '--post-id') || process.argv[2];
if (!postId || postId.startsWith('--')) {
  console.error('Usage: node scripts/pin-facebook-page-post.mjs --post-id PAGE_POST_ID');
  process.exit(1);
}

const env = loadEnv();
const token = env.META_PAGE_ACCESS_TOKEN || '';
const version = env.META_GRAPH_API_VERSION || 'v21.0';

console.log(JSON.stringify({
  post_id: postId,
  permalink: `https://www.facebook.com/${postId}`,
  manual_steps: [
    'Meta Business Suite → Content → Posts → chọn bài → Pin to top of Page',
    'Hoặc Facebook Page (quyền admin) → Ghim bài viết',
  ],
  api_note: 'Graph API không hỗ trợ ghim đầy đủ cho mọi Page token — dùng UI hoặc Telegram notify từ workflow.',
}, null, 2));

if (!token) {
  console.log('\n(Không có META_PAGE_ACCESS_TOKEN — chỉ in hướng dẫn manual)');
  process.exit(0);
}

const res = await fetch(
  `https://graph.facebook.com/${version}/${postId}?fields=id,is_published,permalink_url&access_token=${encodeURIComponent(token)}`
);
const data = await res.json();
console.log('\nPost check:', JSON.stringify(data, null, 2));
