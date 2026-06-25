// n8n Code: parse short video script JSON (Agent 6)

const ALLOW_PLATFORMS = new Set(['tiktok', 'fb_reels', 'youtube_shorts']);

function extractJsonString(raw) {
  if (raw == null) throw new Error('EMPTY_LLM_OUTPUT');
  const s = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let t = (fenced ? fenced[1] : s).trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return t;
}

function parseJsonLoose(text) {
  const attempts = [
    text,
    text.replace(/[\u201C\u201D\u2018\u2019]/g, '"'),
    text.replace(/,\s*([}\]])/g, '$1'),
    text.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' '),
  ];
  let lastErr;
  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('JSON_PARSE_FAIL');
}

const res = $input.first().json;
const source = $('Loop Video Candidates').item?.json || {};
const raw =
  res.choices?.[0]?.message?.content ??
  res.content?.[0]?.text ??
  res.message?.content ??
  res;

function normalizeProductionBrief(parsed) {
  const eb = source.editorial_brief_v1 || {};
  const next = { ...parsed };
  if (!String(next.title || '').trim()) {
    next.title = String(
      eb.editorial_title || next.hook_3s || next.on_screen_text?.[0] || 'Magnix short'
    ).slice(0, 80);
  }
  if (!String(next.source_insight || '').trim()) {
    next.source_insight = String(
      eb.one_line_insight || next.hook_3s || next.spoken_script?.slice(0, 300) || next.title
    ).slice(0, 2000);
  }
  if (!String(next.caption || '').trim()) {
    next.caption = String(next.hook_3s || next.title || eb.one_line_insight || '').slice(0, 150);
  }
  if (!String(next.cta_keyword || '').trim()) {
    next.cta_keyword = String(eb.cta_keyword || 'CHECKLIST').slice(0, 50);
  }
  if (!String(next.disclaimer || '').trim()) {
    next.disclaimer = 'Thông tin tham khảo; quyết định theo quy định và hồ sơ thực tế.';
  }
  if (!next.aspect_ratio) next.aspect_ratio = '9:16';
  return next;
}

try {
  const parsed = normalizeProductionBrief(parseJsonLoose(extractJsonString(raw)));
  const required = [
    'title', 'platform', 'segment', 'hook_3s', 'spoken_script',
    'caption', 'cta_keyword', 'source_insight',
  ];
  for (const k of required) {
    if (!parsed[k] || !String(parsed[k]).trim()) throw new Error(`MISSING_${k.toUpperCase()}`);
  }

  const platform = String(parsed.platform).trim().toLowerCase();
  if (!ALLOW_PLATFORMS.has(platform)) throw new Error('INVALID_PLATFORM');

  const duration = Number(parsed.duration_sec || 30);
  if (!Number.isFinite(duration) || duration < 21 || duration > 60) {
    throw new Error('INVALID_DURATION');
  }

  if (!Array.isArray(parsed.beats) || parsed.beats.length < 4) {
    throw new Error('INSUFFICIENT_BEATS');
  }

  const beats = parsed.beats.slice(0, 12).map((b) => ({
    start_sec: Number(b.start_sec ?? 0),
    end_sec: Number(b.end_sec ?? 0),
    role: String(b.role || 'value'),
    spoken: String(b.spoken || ''),
    on_screen: String(b.on_screen || '').slice(0, 120),
    visual: String(b.visual || ''),
    visual_spec: b.visual_spec && typeof b.visual_spec === 'object'
      ? {
          type: String(b.visual_spec.type || 'broll'),
          stock_query: String(b.visual_spec.stock_query || '').slice(0, 80),
          fallback_color: String(b.visual_spec.fallback_color || '#0f172a').slice(0, 20),
        }
      : undefined,
    retention_intent: String(b.retention_intent || ''),
    render_scene: b.render_scene && typeof b.render_scene === 'object'
      ? { transition_in: String(b.render_scene.transition_in || 'cut').slice(0, 20) }
      : undefined,
  }));

  const productionVersion = Number(parsed.production_brief_version || 1);
  const brollBeats = beats.filter((b) => (b.visual_spec?.type || 'broll') === 'broll');
  if (productionVersion >= 3) {
    for (const b of brollBeats) {
      const sq = String(b.visual_spec?.stock_query || '').trim();
      if (!sq || sq.length < 5) {
        throw new Error('MISSING_STOCK_QUERY_V3');
      }
      if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(sq)) {
        throw new Error('STOCK_QUERY_NOT_ENGLISH');
      }
      const letters = sq.match(/[a-zA-Z]/g) || [];
      const alnum = sq.replace(/\s/g, '');
      if (!alnum.length || letters.length / alnum.length < 0.65) {
        throw new Error('STOCK_QUERY_NOT_ENGLISH');
      }
    }
    for (const b of beats) {
      const words = String(b.on_screen || '').trim().split(/\s+/).filter(Boolean);
      if (words.length > 14) throw new Error('ON_SCREEN_TOO_LONG');
    }
  }
  if (!Array.isArray(parsed.on_screen_text) || parsed.on_screen_text.length < 2) {
    parsed.on_screen_text = parsed.beats
      .map((b) => String(b.on_screen || '').trim())
      .filter(Boolean)
      .slice(0, 8);
  }
  if (parsed.on_screen_text.length < 2) throw new Error('MISSING_ON_SCREEN_TEXT');

  if (!Array.isArray(parsed.hashtags)) parsed.hashtags = [];
  if (!Array.isArray(parsed.source_refs)) parsed.source_refs = [];

  return [{
    json: {
      ok: true,
      video: {
        production_brief_version: productionVersion,
        render_engine: String(parsed.render_engine || 'creatomate_renderscript_v2'),
        title: String(parsed.title).slice(0, 500),
        platform,
        segment: String(parsed.segment),
        hook_3s: String(parsed.hook_3s).slice(0, 500),
        duration_sec: Math.round(duration),
        aspect_ratio: String(parsed.aspect_ratio || '9:16'),
        source_insight: String(parsed.source_insight).slice(0, 2000),
        pattern_applied: Array.isArray(parsed.pattern_applied)
          ? parsed.pattern_applied.map(String).slice(0, 8)
          : [],
        pain_deconstruct: parsed.pain_deconstruct && typeof parsed.pain_deconstruct === 'object'
          ? parsed.pain_deconstruct
          : undefined,
        beats,
        spoken_script: String(parsed.spoken_script).slice(0, 15000),
        on_screen_text: parsed.on_screen_text.map(String).slice(0, 8),
        caption: String(parsed.caption).slice(0, 500),
        hashtags: parsed.hashtags.map(String).slice(0, 8),
        cta_keyword: String(parsed.cta_keyword).slice(0, 50),
        disclaimer: String(parsed.disclaimer || '').slice(0, 2000),
        source_refs: parsed.source_refs.map(String).slice(0, 10),
      },
    },
  }];
} catch (e) {
  return [{ json: { ok: false, parse_error: e.message, raw_preview: String(raw).slice(0, 200) } }];
}
