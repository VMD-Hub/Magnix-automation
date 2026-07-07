/**
 * Motif facet tái sử dụng — 3 cụm kích thước khác nhau (gần / giữa / xa).
 */
function FacetCluster({ depth }: { depth: "near" | "mid" | "far" }) {
  return (
    <div className={`footer-geo-cluster footer-geo-cluster--facet footer-geo-cluster--facet-${depth}`}>
      <svg className="footer-geo footer-facet-ring" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="30" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
        <path
          d="M36 6 A30 30 0 0 1 66 36 A30 30 0 0 1 36 66"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.65"
        />
        <circle
          cx="36"
          cy="36"
          r="20"
          stroke="currentColor"
          strokeWidth="0.55"
          strokeDasharray="3 5"
          opacity="0.35"
        />
      </svg>

      <svg className="footer-geo footer-facet-hex-main" viewBox="0 0 80 80" fill="none">
        <path d="M40 4 L72 22 V58 L40 76 L8 58 V22 Z" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M40 16 L58 26 V54 L40 64 L22 54 V26 Z"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.55"
        />
      </svg>

      <svg className="footer-geo footer-facet-hex-tr" viewBox="0 0 48 48" fill="none">
        <path d="M24 2 L42 11 V37 L24 46 L6 37 V11 Z" fill="currentColor" opacity="0.07" />
        <path d="M24 2 L42 11 V37 L24 46 L6 37 V11 Z" stroke="currentColor" strokeWidth="0.95" />
      </svg>

      <svg className="footer-geo footer-facet-hex-bl" viewBox="0 0 44 44" fill="none">
        <path d="M22 2 L38 10 V34 L22 42 L6 34 V10 Z" stroke="currentColor" strokeWidth="0.85" />
      </svg>

      <svg className="footer-geo footer-facet-hex-br" viewBox="0 0 32 32" fill="none">
        <path d="M16 2 L28 9 V23 L16 30 L4 23 V9 Z" stroke="currentColor" strokeWidth="0.7" />
      </svg>

      <svg className="footer-geo footer-facet-diamond" viewBox="0 0 56 56" fill="none">
        <rect
          x="14"
          y="14"
          width="28"
          height="28"
          rx="1"
          stroke="currentColor"
          strokeWidth="0.95"
          transform="rotate(45 28 28)"
        />
        <path d="M28 8 L44 28 L28 48 L12 28 Z" fill="currentColor" opacity="0.06" />
      </svg>

      <svg className="footer-geo footer-facet-tri" viewBox="0 0 40 34" fill="none">
        <path d="M20 3 L37 31 H3 Z" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" />
      </svg>

      <span className="footer-geo-bar footer-facet-bar-a" />
      <span className="footer-geo-bar footer-facet-bar-b" />
      <span className="footer-geo-bar footer-facet-bar-c" />

      <span className="footer-geo-dot footer-facet-dot-a" />
      <span className="footer-geo-dot footer-facet-dot-b" />
      <span className="footer-geo-dot footer-facet-dot-c" />
      <span className="footer-geo-dot footer-facet-dot-d" />
    </div>
  );
}

/** Motif hình học gom cụm — depth gần/xa qua kích thước + opacity + blur. */
export function FooterBrandOrnament() {
  return (
    <div className="footer-brand-ornament" aria-hidden>
      <FacetCluster depth="near" />
      <FacetCluster depth="mid" />
      <FacetCluster depth="far" />

      <div className="footer-geo-cluster footer-geo-cluster--stamp">
        <svg className="footer-geo footer-geo--stamp-bracket" viewBox="0 0 56 56" fill="none">
          <path d="M4 24 V4 H24" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
          <path d="M52 32 V52 H32" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
        </svg>
        <svg className="footer-geo footer-geo--stamp-hex" viewBox="0 0 40 40" fill="none">
          <path d="M20 2 L35 10 V30 L20 38 L5 30 V10 Z" stroke="currentColor" strokeWidth="1" />
          <path
            d="M20 10 L29 15 V25 L20 30 L11 25 V15 Z"
            stroke="currentColor"
            strokeWidth="0.55"
            opacity="0.5"
          />
        </svg>
        <svg className="footer-geo footer-geo--stamp-diamond" viewBox="0 0 28 28" fill="none">
          <path d="M14 2 L26 14 L14 26 L2 14 Z" stroke="currentColor" strokeWidth="0.75" />
        </svg>
        <span className="footer-geo-dot footer-geo--stamp-dot" />
      </div>

      <div className="footer-geo-cluster footer-geo-cluster--honey">
        <svg className="footer-geo footer-geo--honey-a" viewBox="0 0 36 36" fill="none">
          <path d="M18 2 L32 10 V26 L18 34 L4 26 V10 Z" stroke="currentColor" strokeWidth="0.75" />
        </svg>
        <svg className="footer-geo footer-geo--honey-b" viewBox="0 0 36 36" fill="none">
          <path d="M18 2 L32 10 V26 L18 34 L4 26 V10 Z" fill="currentColor" opacity="0.06" />
          <path d="M18 2 L32 10 V26 L18 34 L4 26 V10 Z" stroke="currentColor" strokeWidth="0.7" />
        </svg>
        <svg className="footer-geo footer-geo--honey-c" viewBox="0 0 28 28" fill="none">
          <path d="M14 2 L25 8 V20 L14 26 L3 20 V8 Z" stroke="currentColor" strokeWidth="0.65" />
        </svg>
        <span className="footer-geo-bar footer-geo--honey-bar" />
      </div>
    </div>
  );
}
