/**
 * Skyline HCMC — chỉ công trình biểu tượng: Đức Bà, Bitexco, Landmark 81.
 * Nền ruby + line-art neon amber, không chi tiết phụ (đĩa bay, cầu, tòa generic).
 */
export function HeroBrandLineArt() {
  return (
    <svg
      className="hero-brand-line-art"
      viewBox="0 0 640 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="hero-neon-core" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fff4cc" />
          <stop offset="45%" stopColor="#ffb84d" />
          <stop offset="100%" stopColor="#ff9a2e" />
        </linearGradient>
        <filter id="hero-neon-outer" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b1" />
          <feGaussianBlur stdDeviation="2" result="b2" />
          <feMerge>
            <feMergeNode in="b1" />
            <feMergeNode in="b2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Mặt đất */}
      <g className="hero-brand-stroke hero-brand-stroke--base">
        <path d="M48 340 H600" />
      </g>

      {/* Nhà thờ Đức Bà — 2 tháp đối xứng + vòm */}
      <g className="hero-brand-stroke hero-brand-stroke--landmark">
        <path d="M108 340 V252" />
        <path d="M96 252 L108 222 L120 252 Z" />
        <path d="M148 340 V252" />
        <path d="M136 252 L148 222 L160 252 Z" />
        <path d="M88 340 H168" />
        <path d="M96 310 Q128 288 160 310" />
        <path d="M112 310 V340" />
        <path d="M144 310 V340" />
      </g>

      {/* Bitexco — tháp thon + đài sen (không đĩa bay) */}
      <g className="hero-brand-stroke hero-brand-stroke--landmark">
        <path d="M248 340 L268 156 L288 340 Z" />
        <path d="M258 168 L268 148 L278 168" />
        <path d="M262 156 L268 138 L274 156" />
        <path d="M252 188 L268 176 L284 188" />
      </g>

      {/* Landmark 81 */}
      <g className="hero-brand-stroke hero-brand-stroke--landmark hero-brand-stroke--tall">
        <path d="M360 340 V68" />
        <path d="M346 68 H374" />
        <path d="M354 68 V52" />
        <path d="M366 68 V52" />
        <path d="M350 108 H370" />
        <path d="M350 148 H370" />
        <path d="M350 188 H370" />
      </g>
    </svg>
  );
}
