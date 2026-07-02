// n8n Code: Video Script QA Gate — format_type=video_script (Agent 6)
// Chạy sau Parse, trước L0. Không dùng Title/Hook Gate text post.

const PLACEHOLDER_RE = /chờ\s+biên\s+tập|placeholder|\{\{|\[TODO\]|lorem ipsum/i;
const ABSTRACT_VISUAL_RE = /^(một|cảm\s+giác|sự|nền\s+tảng|tinh\s+thần|concept)/i;
const GREETING_RE = /^(xin\s+chào|chào\s+(mọi|các)\s+(bạn|anh|chị)|hello|hi\b)/i;
const LEGAL_TYPES = new Set(['NOXH_LEGAL', 'LOAN_FINANCE', 'VALUATION']);
const LEGAL_STAT = [/\bđiều\s+\d+/i, /\bnghị\s+định\s+\d+/i, /\b\d+([.,]\d+)?\s*%/, /\b\d+\s*triệu\b/i];

function wordCount(v) {
  return String(v || '').trim().split(/\s+/).filter(Boolean).length;
}

const item = $input.first().json;
const source = $('Loop Video Candidates').item?.json || {};

if (!item.ok || !item.video) {
  return [{ json: { ...item, video_script_qa_pass: false } }];
}

const v = item.video;

if (v.format_type !== 'video_script' && !v.visual_hook) {
  return [{ json: { ...item, video_script_qa_pass: true, video_script_qa_skipped: true } }];
}

const reasons = [];
const flags = [];
let blocked = false;

const visual = String(v.visual_hook || '').trim();
const verbal = String(v.verbal_hook || '').trim();

if (!visual || PLACEHOLDER_RE.test(visual)) {
  blocked = true;
  reasons.push('visual_hook empty or placeholder');
} else if (ABSTRACT_VISUAL_RE.test(visual) && visual.length < 25) {
  blocked = true;
  reasons.push('visual_hook too abstract');
}

if (!verbal || PLACEHOLDER_RE.test(verbal)) {
  blocked = true;
  reasons.push('verbal_hook empty or placeholder');
} else if (wordCount(verbal) > 12) {
  blocked = true;
  reasons.push(`verbal_hook > 12 words (${wordCount(verbal)})`);
} else if (GREETING_RE.test(verbal)) {
  blocked = true;
  reasons.push('verbal_hook starts with greeting');
}

const ost = String(v.on_screen_text || '').trim();
if (ost && wordCount(ost) > 8) {
  flags.push('on_screen_text_long');
  reasons.push(`on_screen_text > 8 words`);
}

const beats = v.body_beats || [];
if (!Array.isArray(beats) || beats.length < 2) {
  blocked = true;
  reasons.push('body_beats need >= 2 segments with timestamp');
} else {
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i];
    if (!String(b.timestamp || '').trim() && b.start_sec == null) {
      blocked = true;
      reasons.push(`body_beats[${i}] missing timestamp`);
    }
    if (!String(b.spoken_line || b.spoken || '').trim()) {
      blocked = true;
      reasons.push(`body_beats[${i}] missing spoken_line`);
    }
  }
}

const dur = Number(v.target_length_seconds || v.duration_sec || 30);
if (dur < 15 || dur > 60) {
  blocked = true;
  reasons.push('target_length_seconds must be 15–60');
}

if (!String(v.verbal_cta || '').trim()) {
  flags.push('missing_verbal_cta');
  reasons.push('verbal_cta missing');
}
if (!String(v.caption_cta || '').trim()) {
  flags.push('missing_caption_cta');
  reasons.push('caption_cta missing');
}
if (
  v.verbal_cta && v.caption_cta
  && String(v.verbal_cta).trim().toLowerCase() === String(v.caption_cta).trim().toLowerCase()
) {
  flags.push('cta_duplicate');
  reasons.push('verbal_cta and caption_cta must differ');
}

const contentType = v.content_type || 'GENERAL_POLICY';
const spokenAll = [
  verbal,
  ...beats.map((b) => b.spoken_line || b.spoken),
  v.verbal_cta,
].join('\n');
let needsLegal = false;
if (LEGAL_TYPES.has(contentType)) {
  for (const re of LEGAL_STAT) {
    if (re.test(spokenAll)) {
      needsLegal = true;
      flags.push('video_legal_spoken_citation');
      reasons.push('legal/stat content in spoken lines — route L2/L3');
      break;
    }
  }
}

if (blocked) {
  const data = $getWorkflowStaticData('global');
  if (!data.a6_stats) data.a6_stats = {};
  data.a6_stats.video_script_rejected = (data.a6_stats.video_script_rejected || 0) + 1;
  return [{
    json: {
      ok: false,
      video_script_qa_pass: false,
      video_script_qa_blocked: true,
      qa_status: 'video_script_rejected',
      video_script_qa_reason: reasons.join('; '),
      video_script_qa: { pass: false, blocked: true, reasons, flags },
    },
  }];
}

const needsReview = needsLegal || flags.length > 0;
if (needsReview) {
  const data = $getWorkflowStaticData('global');
  if (!data.a6_stats) data.a6_stats = {};
  data.a6_stats.video_script_review = (data.a6_stats.video_script_review || 0) + 1;
}

return [{
  json: {
    ...item,
    ok: true,
    video_script_qa_pass: true,
    video_script_needs_review: needsReview,
    video_script_qa: {
      pass: true,
      format_type: 'video_script',
      content_type: contentType,
      flags,
      reasons,
      needs_legal_review: needsLegal,
      target_length_seconds: dur,
      normalized_key: String(source.normalized_key || '').slice(0, 120),
    },
    ...(needsReview ? { qa_status: 'video_script_review', sheet_status_override: 'review' } : {}),
  },
}];
