/** Magnix brand outro — khích lệ + tagline cố định cuối mọi video */

export const MAGNIX_BRAND_TAGLINE =
  'Hiện thực hóa ước mơ an cư — Vì ai cũng xứng đáng có một nơi để trở về.';

/** Tiếng chuông ngắn — volume thấp, phát 1 lần đầu outro */
export const MAGNIX_BELL_SFX_URL =
  'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';

export const MAGNIX_MOTIVATE_VARIANTS = [
  {
    id: 1,
    short:
      'Mọi hành trình vạn dặm đều bắt đầu từ một bước chân. Đừng ngại bắt đầu ngay hôm nay.',
    full: 'Mọi hành trình vạn dặm đều bắt đầu từ một bước chân. Đừng ngại bắt đầu ngay hôm nay — dù chỉ với một câu hỏi nhỏ với ngân hàng.',
  },
  {
    id: 2,
    short: 'Ước mơ an cư không xa nếu bạn dám bắt đầu từ hôm nay. Hãy hành động ngay bây giờ.',
    full: 'Ước mơ an cư không xa nếu bạn dám bắt đầu từ hôm nay. Hãy hành động ngay — một bước nhỏ hôm nay cũng đáng giá hơn chờ đợi.',
  },
  {
    id: 3,
    short:
      'Chưa ai về đích nếu chưa dám bước đi. Hãy bắt đầu hành trình về nhà của bạn ngay bây giờ.',
    full: 'Chưa ai về đích nếu chưa dám bước đi. Hãy bắt đầu hành trình về nhà của bạn ngay bây giờ — vì bạn xứng đáng có một nơi để gọi là nhà.',
  },
];

export function pickBrandVariantIndex(seed) {
  const n = Number(seed);
  if (!Number.isFinite(n)) return 1;
  return (Math.abs(Math.floor(n)) % MAGNIX_MOTIVATE_VARIANTS.length) + 1;
}

function getMotivateVariant(variantId) {
  return MAGNIX_MOTIVATE_VARIANTS.find((v) => v.id === variantId) || MAGNIX_MOTIVATE_VARIANTS[0];
}

export function buildBrandOutroBeat(opts = {}) {
  const variantId = opts.variant || pickBrandVariantIndex(opts.seed || 1);
  const format = String(opts.format || 'short').toLowerCase() === 'full' ? 'full' : 'short';
  const variant = getMotivateVariant(variantId);
  const motivate = format === 'full' ? variant.full : variant.short;
  const startSec = Number(opts.start_sec);
  const dur = format === 'full' ? 12 : 8;
  const start = Number.isFinite(startSec) ? startSec : null;

  return {
    role: 'brand_outro',
    brand_variant: variantId,
    retention_intent: 'brand_close',
    start_sec: start ?? undefined,
    end_sec: start != null ? start + dur : undefined,
    on_screen: '🔔 Theo dõi để không bỏ lỡ',
    on_screen_tagline: 'Hiện thực hóa ước mơ an cư',
    spoken_motivate: motivate,
    spoken_tagline: MAGNIX_BRAND_TAGLINE,
    spoken: `${motivate} ${MAGNIX_BRAND_TAGLINE}`,
    visual: 'Hoàng hôn ấm — chìa khóa căn nhà mới',
    visual_spec: {
      type: 'broll',
      stock_query: 'Vietnam warm sunset apartment keys handover portrait',
      fallback_color: '#1e293b',
      bell_sfx_url: MAGNIX_BELL_SFX_URL,
    },
  };
}

export function hasBrandOutroBeat(beats) {
  return (beats || []).some((b) => String(b?.role || '').toLowerCase() === 'brand_outro');
}

export function appendBrandOutroToBeats(beats, opts = {}) {
  const list = Array.isArray(beats) ? [...beats] : [];
  if (hasBrandOutroBeat(list)) return list;

  const last = list[list.length - 1] || {};
  const start = Number(last.end_sec) || list.length * 5;
  const format = String(opts.format || 'short').toLowerCase() === 'full' ? 'full' : 'short';
  const dur = format === 'full' ? 12 : 8;

  list.push(
    buildBrandOutroBeat({
      ...opts,
      format,
      start_sec: start,
      end_sec: start + dur,
    })
  );
  return list;
}

export function estimateDurationWithBrandOutro(durationSec, opts = {}) {
  const base = Number(durationSec) || 30;
  const format = String(opts.format || 'short').toLowerCase() === 'full' ? 'full' : 'short';
  return base + (format === 'full' ? 12 : 8);
}
