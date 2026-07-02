// n8n Code: parse carousel JSON (Agent 3b)

const CAROUSEL_CFG = __CAROUSEL_TEMPLATES_JSON__;

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
  const attempts = [text, text.replace(/,\s*([}\]])/g, '$1')];
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
const source = $('Loop Carousel Candidates').item?.json || {};
const raw =
  res.choices?.[0]?.message?.content
  ?? res.content?.[0]?.text
  ?? res.message?.content
  ?? res;

let parsed;
try {
  parsed = parseJsonLoose(extractJsonString(raw));
} catch (e) {
  return [{ json: { ok: false, parse_error: e.message } }];
}

const slides = Array.isArray(parsed.slides) ? parsed.slides : [];
const minSlides = Number(CAROUSEL_CFG.slide_count_min || 5);
const maxSlides = Number(CAROUSEL_CFG.slide_count_max || 8);

if (slides.length < minSlides || slides.length > maxSlides) {
  return [{
    json: {
      ok: false,
      parse_error: `SLIDE_COUNT_${slides.length}_OUT_OF_RANGE_${minSlides}_${maxSlides}`,
    },
  }];
}

const eb = source.editorial_brief_v1 || {};
const title = String(parsed.title || eb.editorial_title || slides[0]?.headline || 'Magnix carousel').slice(0, 500);
const caption = String(parsed.caption || '').slice(0, Number(CAROUSEL_CFG.caption_max_chars || 300));

const normalizedSlides = slides.map((s, i) => ({
  index: Number(s.index || i + 1),
  headline: String(s.headline || '').slice(0, Number(CAROUSEL_CFG.headline_max_chars || 60)),
  body: String(s.body || '').slice(0, Number(CAROUSEL_CFG.body_max_chars || 120)),
  visual_note: String(s.visual_note || '').slice(0, 200),
}));

for (const s of normalizedSlides) {
  if (!s.headline.trim() || !s.body.trim()) {
    return [{ json: { ok: false, parse_error: 'SLIDE_MISSING_HEADLINE_OR_BODY' } }];
  }
}

return [{
  json: {
    ok: true,
    carousel: {
      format_type: 'carousel',
      product_type: 'carousel_image',
      segment: String(source.segment || 'noxh_income'),
      title,
      caption,
      slides: normalizedSlides,
      source_refs: Array.isArray(parsed.source_refs) ? parsed.source_refs : [],
      content_format: 'carousel_image',
    },
  },
}];
