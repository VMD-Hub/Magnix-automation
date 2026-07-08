/** Hình học vàng — port từ components/brand/ruby-surface-ornament.tsx (web). */
export function RubySurfaceOrnament({
  variant = "holder",
}: {
  variant?: "holder" | "card" | "header";
}) {
  return (
    <div
      className={`ruby-ornament ruby-ornament--${variant}`}
      aria-hidden
    >
      <svg className="ruby-geo ruby-geo--hex" viewBox="0 0 48 48" fill="none">
        <path
          d="M24 2 L42 11 V37 L24 46 L6 37 V11 Z"
          stroke="currentColor"
          strokeWidth="0.9"
        />
        <path
          d="M24 10 L34 16 V32 L24 38 L14 32 V16 Z"
          stroke="currentColor"
          strokeWidth="0.55"
          opacity="0.5"
        />
      </svg>
      <svg className="ruby-geo ruby-geo--diamond" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 2 L28 16 L16 30 L4 16 Z"
          stroke="currentColor"
          strokeWidth="0.7"
        />
      </svg>
      <span className="ruby-geo-bar" />
      <span className="ruby-geo-dot ruby-geo-dot--a" />
      <span className="ruby-geo-dot ruby-geo-dot--b" />
    </div>
  );
}
