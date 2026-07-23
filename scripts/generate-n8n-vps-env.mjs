#!/usr/bin/env node
/**
 * Tạo file env cho VPS từ n8n-workflows/.env + template
 * Usage: node scripts/generate-n8n-vps-env.mjs
 * Output: n8n-workflows/.env.vps.generated (gitignored — không commit)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadEnv(filePath) {
  const map = {};
  if (!fs.existsSync(filePath)) return map;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i > 0) map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return map;
}

const local = loadEnv(path.join(root, 'n8n-workflows/.env'));
const out = path.join(root, 'n8n-workflows/.env.vps.generated');

let driveFolders = {};
let noxhTemplates = {};
let pageCovers = {};
const dfPath = path.join(root, 'n8n-workflows/magnix-drive-folders.json');
if (fs.existsSync(dfPath)) {
  try {
    const df = JSON.parse(fs.readFileSync(dfPath, 'utf8'));
    driveFolders = df.folders || {};
    noxhTemplates = df.noxh_templates || {};
    pageCovers = df.page_covers || {};
  } catch {
    driveFolders = {};
    noxhTemplates = {};
    pageCovers = {};
  }
}

const lines = [
  '# Magnix n8n VPS — generated, do not commit',
  `MAGNIX_STORAGE_MODE=${local.MAGNIX_STORAGE_MODE || 'postgres_primary_drive_archive'}`,
  `MAGNIX_DRIVE_BACKUP=${local.MAGNIX_DRIVE_BACKUP || 'true'}`,
  '',
  '# House X — UID ingest store of record (ADR-013; secret khớp Proptech-HouseX .env)',
  `HOUSEX_PUBLIC_URL=${local.HOUSEX_PUBLIC_URL || 'https://timnhaxahoi.com'}`,
  `MAGNIX_INGEST_SECRET=${local.MAGNIX_INGEST_SECRET || ''}`,
  '',
  'N8N_BLOCK_ENV_ACCESS_IN_NODE=false',
  'GENERIC_TIMEZONE=Asia/Ho_Chi_Minh',
  'TZ=Asia/Ho_Chi_Minh',
  '',
  '# n8n execution retention (compatible with current 1.x/2.x releases)',
  `EXECUTIONS_DATA_PRUNE=${local.EXECUTIONS_DATA_PRUNE || 'true'}`,
  `EXECUTIONS_DATA_MAX_AGE=${local.EXECUTIONS_DATA_MAX_AGE || '336'}`,
  `EXECUTIONS_DATA_PRUNE_MAX_COUNT=${local.EXECUTIONS_DATA_PRUNE_MAX_COUNT || '10000'}`,
  `EXECUTIONS_DATA_SAVE_ON_ERROR=${local.EXECUTIONS_DATA_SAVE_ON_ERROR || 'all'}`,
  `EXECUTIONS_DATA_SAVE_ON_SUCCESS=${local.EXECUTIONS_DATA_SAVE_ON_SUCCESS || 'all'}`,
  '',
  `GOOGLE_SHEET_CONTENT_METRICS_ID=${local.GOOGLE_SHEET_CONTENT_METRICS_ID || '1fYB4h_BTiKXa9O3lBah-tQonWpQOQMG2aSkSfPs6yU4'}`,
  `GOOGLE_SHEET_CONTENT_METRICS_TAB=${local.GOOGLE_SHEET_CONTENT_METRICS_TAB || 'content_metrics'}`,
  `GOOGLE_SHEET_PROJECT_CONFIG_TAB=${local.GOOGLE_SHEET_PROJECT_CONFIG_TAB || 'project_config'}`,
  `GOOGLE_DRIVE_ARCHIVE_FOLDER_ID=${local.GOOGLE_DRIVE_ARCHIVE_FOLDER_ID || local.GOOGLE_DRIVE_FOLDER_ID || '1iBjsrXLYmHfOHMQaAfLmZGug2kN0314D'}`,
  '',
  `N8N_PUBLIC_URL=${local.N8N_PUBLIC_URL || 'https://n8n.vmd.asia'}`,
  '',
  `APIFY_TOKEN=${local.APIFY_TOKEN || ''}`,
  `APIFY_RUN_URL=${local.APIFY_RUN_URL || 'https://api.apify.com/v2/acts/clockworks~tiktok-scraper/run-sync-get-dataset-items'}`,
  `APIFY_FB_RUN_URL=${local.APIFY_FB_RUN_URL || 'https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items'}`,
  '',
  `ANTHROPIC_API_KEY=${local.ANTHROPIC_API_KEY || ''}`,
  'ANTHROPIC_CLASSIFY_MODEL=claude-haiku-4-5-20251001',
  'ANTHROPIC_DRAFT_MODEL=claude-sonnet-4-6',
  '',
  `DEEPSEEK_API_KEY=${local.DEEPSEEK_API_KEY || ''}`,
  `DEEPSEEK_API_URL=${local.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions'}`,
  `DEEPSEEK_MODEL=${local.DEEPSEEK_MODEL || 'deepseek-chat'}`,
  '',
  `CREATOMATE_API_KEY=${local.CREATOMATE_API_KEY || ''}`,
  `CREATOMATE_TEMPLATE_ID=${local.CREATOMATE_TEMPLATE_ID || ''}`,
  'CREATOMATE_API_URL=https://api.creatomate.com/v2/renders',
  'CREATOMATE_POLL_MAX=24',
  'CREATOMATE_POLL_MS=15000',
  `MAGNIX_VIDEO_TTS_URL=${local.MAGNIX_VIDEO_TTS_URL || ''}`,
  `MAGNIX_WEBHOOK_TOKEN=${local.MAGNIX_WEBHOOK_TOKEN || ''}`,
  `HOUSEX_BACKUP_ALERT_TOKEN=${local.HOUSEX_BACKUP_ALERT_TOKEN || ''}`,
  `PEXELS_API_KEY=${local.PEXELS_API_KEY || ''}`,
  `CREATOMATE_VOICE_PROVIDER=${local.CREATOMATE_VOICE_PROVIDER || 'google'}`,
  `CREATOMATE_DISABLE_VOICE=${local.CREATOMATE_DISABLE_VOICE || 'false'}`,
  '',
  `# ElevenLabs direct TTS fallback (tiếng Việt — eleven_flash_v2_5)`,
  `ELEVENLABS_API_KEY=${local.ELEVENLABS_API_KEY || loadEnv(path.join(root, 'webhooks/video-tts/.env')).ELEVENLABS_API_KEY || ''}`,
  `ELEVENLABS_VOICE_ID=${local.ELEVENLABS_VOICE_ID || loadEnv(path.join(root, 'webhooks/video-tts/.env')).ELEVENLABS_VOICE_ID || ''}`,
  `ELEVENLABS_MODEL_ID=${local.ELEVENLABS_MODEL_ID || 'eleven_flash_v2_5'}`,
  '',
  `DRIVE_VIDEO_FOLDER_READY=${local.DRIVE_VIDEO_FOLDER_READY || driveFolders.ready_for_review?.id || ''}`,
  `DRIVE_VIDEO_FOLDER_APPROVED=${local.DRIVE_VIDEO_FOLDER_APPROVED || driveFolders.approved?.id || ''}`,
  `DRIVE_VIDEO_FOLDER_PUBLISHED=${local.DRIVE_VIDEO_FOLDER_PUBLISHED || driveFolders.published?.id || ''}`,
  'VIDEO_DRIVE_RETENTION_DAYS_READY=30',
  '',
  `# Telegram approval`,
  `TELEGRAM_BOT_TOKEN=${local.TELEGRAM_BOT_TOKEN || ''}`,
  `TELEGRAM_CHAT_ID_OWNER=${local.TELEGRAM_CHAT_ID_OWNER || local.TELEGRAM_CHAT_ID || ''}`,
  `TELEGRAM_CHAT_ID_OPS=${local.TELEGRAM_CHAT_ID_OPS || ''}`,
  `TELEGRAM_APPROVAL_ENABLED=${local.TELEGRAM_APPROVAL_ENABLED || 'false'}`,
  `TELEGRAM_REMINDER_ENABLED=${local.TELEGRAM_REMINDER_ENABLED || 'false'}`,
  `GOOGLE_SHEET_NOTIFICATION_EVENTS_TAB=${local.GOOGLE_SHEET_NOTIFICATION_EVENTS_TAB || 'notification_events'}`,
  '',
  `# Facebook Page publish + House X cron`,
  `CONTENT_PAGE_PUBLISH_ENABLED=${local.CONTENT_PAGE_PUBLISH_ENABLED || 'false'}`,
  `CRON_SECRET=${local.CRON_SECRET || ''}`,
  `META_PAGE_ID=${local.META_PAGE_ID || ''}`,
  `META_PAGE_ACCESS_TOKEN=${local.META_PAGE_ACCESS_TOKEN || ''}`,
  `META_GRAPH_API_VERSION=${local.META_GRAPH_API_VERSION || 'v21.0'}`,
  `DRIVE_NOXH_TEMPLATES_FOLDER_ID=${local.DRIVE_NOXH_TEMPLATES_FOLDER_ID || noxhTemplates.folder_id || ''}`,
  `DRIVE_NOXH_TEMPLATES_PUBLIC_URL=${local.DRIVE_NOXH_TEMPLATES_PUBLIC_URL || noxhTemplates.public_url || ''}`,
  `CONTENT_SHEET_WRITEBACK_ENABLED=${local.CONTENT_SHEET_WRITEBACK_ENABLED || 'true'}`,
  `CONTENT_METRICS_SHEET_WRITE_ENABLED=${local.CONTENT_METRICS_SHEET_WRITE_ENABLED || ''}`,
  `CONTENT_SCORECARD_SHEET_WRITE_ENABLED=${local.CONTENT_SCORECARD_SHEET_WRITE_ENABLED || ''}`,
  '',
  `# Facebook Page cover (Gemini)`,
  `CONTENT_PAGE_COVER_ENABLED=${local.CONTENT_PAGE_COVER_ENABLED || 'false'}`,
  `GEMINI_API_KEY=${local.GEMINI_API_KEY || ''}`,
  `GEMINI_IMAGE_MODEL=${local.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'}`,
  `PAGE_COVER_ASPECT_RATIO=${local.PAGE_COVER_ASPECT_RATIO || '1:1'}`,
  `DRIVE_PAGE_COVERS_FOLDER_ID=${local.DRIVE_PAGE_COVERS_FOLDER_ID || pageCovers.folder_id || ''}`,
  '',
];

fs.writeFileSync(out, lines.join('\n'));
console.log('Written', out);
console.log('Next: node scripts/deploy-vps-n8n.mjs');
