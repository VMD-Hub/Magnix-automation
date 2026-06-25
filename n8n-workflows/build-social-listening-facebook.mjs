#!/usr/bin/env node
/**
 * Build Agent 1 — Social Listening Facebook pages/groups (weekly Wed 07:00 VN)
 * Run: node n8n-workflows/build-social-listening-facebook.mjs
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
  startUrls: [{ url: String($json.post_url || '').trim() }],
  resultsLimit: ${PUBLIC.apify_max_items},
}) }}`;

const workflow = buildListeningWorkflow(PUBLIC, {
  idPrefix: 'fb',
  workflowName: 'Magnix Agent 1 — Social Listening Facebook (weekly)',
  workflowSlug: 'social-listening-facebook',
  scheduleName: 'Schedule Weekly Facebook',
  scheduleCron: PUBLIC.schedule_cron_facebook || '0 7 * * 3',
  platforms: ['fb_page', 'fb_group'],
  wrapApifyFile: '02-wrap-apify-fb-response.js',
  wrapNodeName: 'Wrap FB Response',
  apifyRunUrlEnv: 'APIFY_FB_RUN_URL',
  apifyDefaultUrl: PUBLIC.apify_facebook_run_url,
  apifyBody,
  stickyNote:
    '## Agent 1 Facebook — 1×/tuần\n- **Thứ 4 07:00 VN** (tách khỏi TikTok thứ 2)\n- `platform=fb_page` hoặc `fb_group` trong project_config\n- Apify: `apify/facebook-posts-scraper`\n- Dedupe + channel_state giống TikTok workflow',
  tags: [
    { name: 'magnix' },
    { name: 'agent-1' },
    { name: 'social-listening' },
    { name: 'facebook' },
  ],
});

const out = path.join(__dirname, 'social-listening-facebook.workflow.json');
fs.writeFileSync(out, JSON.stringify(workflow, null, 2));
console.log('Written', out, '—', workflow.nodes.length, 'nodes');
