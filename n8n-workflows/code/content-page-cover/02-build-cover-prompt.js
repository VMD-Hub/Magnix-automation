// n8n Code: ghép prompt ảnh cover Facebook Page (brand Magnix)

const row = $('Loop Cover Candidates').item?.json || $input.first().json;
const meta = row.meta_parsed || {};

const title = String(row.title || '').trim();
const hook = String(row.hook_line || '').trim();
const basePrompt = String(
  meta.publish_image_prompt
  || meta.cover_image_prompt
  || title
  || hook
).trim();

const headline = hook || title || 'Magnix NOXH';
const pillar = String(meta.content_pillar || 'B').trim();

const brandRules = [
  'Professional Vietnamese social media cover for Facebook Page.',
  'Style: trustworthy financial/legal advisory, clean modern layout.',
  'Colors: deep teal #0D7377 and white, subtle checklist or folder icon.',
  'NO stock photo watermarks. NO fake government logos.',
  'Readable Vietnamese headline text on image (large, high contrast).',
  'Square 1:1 composition, safe margins for mobile crop.',
  'Small subtle "Magnix" wordmark bottom-right.',
].join(' ');

const pillarHint = {
  A: 'Focus: income eligibility, salary documents.',
  B: 'Focus: application forms, checklist, folder templates.',
  C: 'Focus: community trust, Q&A helpful tone.',
}[pillar] || '';

const userPrompt = [
  basePrompt,
  pillarHint,
  `Headline text on image (Vietnamese): "${headline.slice(0, 80)}"`,
  'Avoid: guarantees, approval promises, specific interest rates.',
].filter(Boolean).join('\n');

const fullPrompt = `${brandRules}\n\n${userPrompt}`.slice(0, 4000);

const aspect = String($env.PAGE_COVER_ASPECT_RATIO || '1:1').trim();

return [{
  json: {
    ok: true,
    sheet_row: row.sheet_row,
    normalized_key: row.source_normalized_key,
    segment: row.segment,
    title,
    hook_line: hook,
    cover_prompt: fullPrompt,
    aspect_ratio: aspect,
    meta_parsed: meta,
  },
}];
