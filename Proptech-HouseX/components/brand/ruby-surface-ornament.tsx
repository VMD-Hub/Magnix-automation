/** Hình học vàng nhỏ — trang trí holder / CTA / trang catalog. */
export function RubySurfaceOrnament({
  variant = "holder",
}: {
  variant?: "holder" | "card" | "page";
}) {
  return (
    <div className={`ruby-surface-ornament ruby-surface-ornament--${variant}`} aria-hidden>
      <svg className="ruby-surface-geo ruby-surface-geo--hex" viewBox="0 0 48 48" fill="none">
        <path d="M24 2 L42 11 V37 L24 46 L6 37 V11 Z" stroke="currentColor" strokeWidth="0.9" />
        <path
          d="M24 10 L34 16 V32 L24 38 L14 32 V16 Z"
          stroke="currentColor"
          strokeWidth="0.55"
          opacity="0.5"
        />
      </svg>
      <svg className="ruby-surface-geo ruby-surface-geo--diamond" viewBox="0 0 32 32" fill="none">
        <path d="M16 2 L28 16 L16 30 L4 16 Z" stroke="currentColor" strokeWidth="0.7" />
      </svg>
      <span className="ruby-surface-bar" />
      <span className="ruby-surface-dot ruby-surface-dot--a" />
      <span className="ruby-surface-dot ruby-surface-dot--b" />
    </div>
  );
}
