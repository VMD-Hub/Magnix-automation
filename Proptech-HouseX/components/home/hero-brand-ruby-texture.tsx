/**
 * Texture ruby facet (low-poly) — nền đỏ đậm có chiều sâu như ảnh tham chiếu.
 */
export function HeroBrandRubyTexture() {
  return (
    <svg
      className="hero-brand-facet"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <pattern
          id="housex-ruby-facet"
          width="96"
          height="84"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(1.1) rotate(-8)"
        >
          <path
            d="M0 0 L48 24 L0 48 Z"
            fill="rgba(0, 0, 0, 0.14)"
          />
          <path
            d="M48 24 L96 0 L96 48 Z"
            fill="rgba(255, 255, 255, 0.035)"
          />
          <path
            d="M0 48 L48 72 L96 48 L48 24 Z"
            fill="rgba(0, 0, 0, 0.08)"
          />
          <path
            d="M48 72 L0 84 L96 84 L48 72 Z"
            fill="rgba(122, 14, 24, 0.12)"
          />
        </pattern>
        <radialGradient id="housex-ruby-vignette" cx="55%" cy="45%" r="75%">
          <stop offset="0%" stopColor="rgba(61, 7, 12, 0)" />
          <stop offset="72%" stopColor="rgba(26, 4, 8, 0.45)" />
          <stop offset="100%" stopColor="rgba(8, 2, 4, 0.72)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#housex-ruby-facet)" />
      <rect width="100%" height="100%" fill="url(#housex-ruby-vignette)" />
    </svg>
  );
}
