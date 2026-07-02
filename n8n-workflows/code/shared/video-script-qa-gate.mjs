/**
 * Video Script QA Gate — format_type=video_script (TikTok/Reels).
 * Không dùng hook_line/title text post.
 */

export const FORMAT_TYPES = new Set(['text_post', 'video_script']);
export const LEGAL_CONTENT_TYPES = new Set(['NOXH_LEGAL', 'LOAN_FINANCE', 'VALUATION']);

const PLACEHOLDER_RE = /chờ\s+biên\s+tập|placeholder|\{\{|\[TODO\]|lorem ipsum/i;
const ABSTRACT_VISUAL_RE = /^(một|cảm\s+giác|sự|nền\s+tảng|tinh\s+thần|concept)/i;
const GREETING_RE = /^(xin\s+chào|chào\s+(mọi|các)\s+(bạn|anh|chị)|hello|hi\b)/i;

const LEGAL_STAT_PATTERNS = [
  /\bđiều\s+\d+/i,
  /\bnghị\s+định\s+\d+/i,
  /\bluật\s+(nhà|đất|đầu\s+tư)/i,
  /\b\d+([.,]\d+)?\s*%/,
  /\b\d+\s*triệu\b/i,
  /\btheo\s+quy\s+định\b/i,
];

/** @param {unknown} v */
export function wordCount(v) {
  return String(v || '').trim().split(/\s+/).filter(Boolean).length;
}

/** @param {object} script */
export function normalizeVideoScript(script) {
  const s = { ...script };
  s.format_type = 'video_script';
  s.target_length_seconds = Number(
    s.target_length_seconds ?? s.duration_sec ?? 30,
  );
  if (!Number.isFinite(s.target_length_seconds)) s.target_length_seconds = 30;
  s.target_length_seconds = Math.min(60, Math.max(15, Math.round(s.target_length_seconds)));

  if (!s.body_beats?.length && Array.isArray(s.beats)) {
    s.body_beats = s.beats.map((b) => ({
      timestamp: `${Number(b.start_sec ?? 0)}-${Number(b.end_sec ?? 0)}s`,
      spoken_line: String(b.spoken || b.spoken_line || ''),
      on_screen_text: String(b.on_screen || b.on_screen_text || ''),
      visual_note: String(b.visual || b.visual_note || ''),
    }));
  }

  if (!s.verbal_hook && s.hook_3s) s.verbal_hook = s.hook_3s;
  if (!s.on_screen_text && Array.isArray(s.on_screen_text_array)) {
    s.on_screen_text = s.on_screen_text_array[0];
  }
  if (Array.isArray(s.on_screen_text) && s.on_screen_text.length) {
    s.on_screen_text = String(s.on_screen_text[0] || '');
  }
  if (typeof s.on_screen_text !== 'string') {
    s.on_screen_text = String(s.on_screen_text || '');
  }

  return s;
}

/** @param {object} script */
export function validateVideoScriptStructure(script) {
  const reasons = [];
  const flags = [];
  let blocked = false;

  const visual = String(script.visual_hook || '').trim();
  const verbal = String(script.verbal_hook || '').trim();

  if (!visual || PLACEHOLDER_RE.test(visual)) {
    blocked = true;
    reasons.push('visual_hook empty or placeholder — must describe concrete on-screen action');
  } else if (ABSTRACT_VISUAL_RE.test(visual) && visual.length < 25) {
    blocked = true;
    reasons.push('visual_hook too abstract — describe specific image (e.g. close-up of red-marked form)');
  }

  if (!verbal || PLACEHOLDER_RE.test(verbal)) {
    blocked = true;
    reasons.push('verbal_hook empty or placeholder');
  } else if (wordCount(verbal) > 12) {
    blocked = true;
    reasons.push(`verbal_hook too long (${wordCount(verbal)} words > 12)`);
  } else if (GREETING_RE.test(verbal)) {
    blocked = true;
    reasons.push('verbal_hook starts with greeting — lead with problem/curiosity');
  }

  const ost = String(script.on_screen_text || '').trim();
  if (ost && wordCount(ost) > 8) {
    flags.push('on_screen_text_long');
    reasons.push(`on_screen_text > 8 words (${wordCount(ost)})`);
  }

  const beats = script.body_beats;
  if (!Array.isArray(beats) || beats.length < 2) {
    blocked = true;
    reasons.push('body_beats must have at least 2 timestamped segments');
  } else {
    for (let i = 0; i < beats.length; i++) {
      const b = beats[i];
      const ts = String(
        b.timestamp ?? (b.start_sec != null ? `${b.start_sec}s` : ''),
      ).trim();
      if (!ts) {
        blocked = true;
        reasons.push(`body_beats[${i}] missing timestamp`);
      }
      if (!String(b.spoken_line || b.spoken || '').trim()) {
        blocked = true;
        reasons.push(`body_beats[${i}] missing spoken_line`);
      }
    }

    const firstSpoken = String(beats[0]?.spoken_line || beats[0]?.spoken || '').toLowerCase();
    const verbalLower = verbal.toLowerCase();
    const hookTokens = verbalLower.split(/\s+/).filter((w) => w.length > 3);
    const overlap = hookTokens.filter((t) => firstSpoken.includes(t)).length;
    if (verbal && firstSpoken && overlap === 0 && !firstSpoken.includes(verbalLower.slice(0, 12))) {
      blocked = true;
      reasons.push('body_beats[0] does not connect to verbal_hook theme');
    }
  }

  const dur = Number(script.target_length_seconds ?? 30);
  if (dur < 15 || dur > 60) {
    blocked = true;
    reasons.push('target_length_seconds must be 15–60');
  }

  if (!String(script.verbal_cta || '').trim()) {
    flags.push('missing_verbal_cta');
    reasons.push('verbal_cta missing — add short spoken CTA at end');
  }
  if (!String(script.caption_cta || '').trim()) {
    flags.push('missing_caption_cta');
    reasons.push('caption_cta missing — add caption CTA (different from verbal_cta)');
  }
  if (
    script.verbal_cta
    && script.caption_cta
    && String(script.verbal_cta).trim().toLowerCase() === String(script.caption_cta).trim().toLowerCase()
  ) {
    flags.push('cta_duplicate');
    reasons.push('verbal_cta and caption_cta must not be identical');
  }

  return { blocked, reasons, flags };
}

/** @param {object} script @param {string} contentType */
export function flagLegalSpokenContent(script, contentType) {
  if (!LEGAL_CONTENT_TYPES.has(contentType)) {
    return { needs_legal_review: false, flags: [] };
  }

  const spokenParts = [
    script.verbal_hook,
    ...(script.body_beats || []).map((b) => b.spoken_line || b.spoken),
    script.verbal_cta,
  ].join('\n');

  const hits = LEGAL_STAT_PATTERNS.filter((re) => re.test(spokenParts));
  if (!hits.length) return { needs_legal_review: false, flags: [] };

  return {
    needs_legal_review: true,
    flags: ['video_legal_spoken_citation'],
    reasons: ['spoken_line contains legal/stat references — route L2/L3'],
  };
}

/**
 * @param {object} params
 */
export function runVideoScriptQaGate({
  script,
  content_type = 'GENERAL_POLICY',
  segment = '',
}) {
  const normalized = normalizeVideoScript(script || {});
  const structure = validateVideoScriptStructure(normalized);
  const resolvedType = content_type || normalized.content_type || 'GENERAL_POLICY';
  const legal = flagLegalSpokenContent(normalized, resolvedType);

  const allReasons = [...structure.reasons, ...(legal.reasons || [])];
  const flags = [...structure.flags, ...(legal.flags || [])];

  if (structure.blocked) {
    return {
      video_script_qa_pass: false,
      video_script_qa_blocked: true,
      qa_status: 'video_script_rejected',
      video_script_qa_reason: allReasons.join('; '),
      video_script_qa: {
        pass: false,
        blocked: true,
        format_type: 'video_script',
        reasons: allReasons,
        flags,
      },
    };
  }

  const needsReview = legal.needs_legal_review || flags.length > 0;

  return {
    video_script_qa_pass: true,
    video_script_qa_blocked: false,
    video_script_needs_review: needsReview,
    video_script_qa: {
      pass: true,
      blocked: false,
      format_type: 'video_script',
      content_type: resolvedType,
      segment,
      reasons: allReasons,
      flags,
      needs_legal_review: legal.needs_legal_review,
      target_length_seconds: normalized.target_length_seconds,
    },
    video_script: normalized,
    ...(needsReview ? { qa_status: 'video_script_review', sheet_status_override: 'review' } : {}),
  };
}
