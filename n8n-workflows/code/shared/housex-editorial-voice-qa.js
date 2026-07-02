/**
 * L0 HouseX editorial voice — sync với housex_editorial_voice.json + article-editorial-voice.ts
 * @param {string} body
 * @returns {{ pass: boolean, hits: string[] }}
 */
function housexEditorialVoiceQa(body) {
  const text = String(body || '');
  const hits = [];

  if (/\*\*/.test(text)) {
    hits.push('RAW_MARKDOWN_BOLD');
  }

  const banned = __HOUSEX_BANNED_PATTERNS_JSON__;
  for (const phrase of banned) {
    if (text.toLowerCase().includes(String(phrase).toLowerCase())) {
      hits.push(`BANNED_PHRASE:${phrase}`);
    }
  }

  if (/→\s*\[/.test(text)) {
    hits.push('ARROW_CTA');
  }

  return { pass: hits.length === 0, hits };
}

module.exports = { housexEditorialVoiceQa };
