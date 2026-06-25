#!/usr/bin/env node
/**
 * Build Agent 1 — Social Listening TikTok (weekly Mon 07:00 VN)
 * Run: node n8n-workflows/build-social-listening.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildListeningWorkflow } from './build-listening-core.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'magnix-public-config.json'), 'utf8')
);

const apifyBody = `={{ JSON.stringify({
  profiles: [
    String($json.post_url || '').match(/@([^/?#]+)/)?.[1]
      || String($json.post_url || '').replace(/^@/, '').split('/')[0],
  ],
  resultsPerPage: ${PUBLIC.apify_max_items},
  shouldDownloadVideos: false,
}) }}`;

const workflow = buildListeningWorkflow(PUBLIC, {
  idPrefix: 'sl',
  workflowName: 'Magnix Agent 1 — Social Listening TikTok (weekly)',
  workflowSlug: 'social-listening-tiktok',
  scheduleName: 'Schedule Weekly TikTok',
  scheduleCron: PUBLIC.schedule_cron_tiktok || '0 7 * * 1',
  platforms: ['tiktok'],
  wrapApifyFile: '02-wrap-apify-response.js',
  wrapNodeName: 'Wrap Apify Response',
  apifyRunUrlEnv: 'APIFY_RUN_URL',
  apifyDefaultUrl: PUBLIC.apify_tiktok_run_url,
  apifyBody,
  stickyNote:
    '## Agent 1 TikTok — 1×/tuần\n- **Thứ 2 07:00 VN** (`TZ=Asia/Ho_Chi_Minh`)\n- `platform=tiktok` trong project_config\n- Dedupe: scrape_index + channel_state (7 ngày)\n- **googleApi**: Fetch, Sheet Upsert, scrape_index, channel_state\n- **Drive SA**: backup raw',
  tags: [
    { name: 'magnix' },
    { name: 'agent-1' },
    { name: 'social-listening' },
    { name: 'tiktok' },
  ],
});

const out = path.join(__dirname, 'social-listening.workflow.json');
fs.writeFileSync(out, JSON.stringify(workflow, null, 2));
console.log('Written', out, '—', workflow.nodes.length, 'nodes');
