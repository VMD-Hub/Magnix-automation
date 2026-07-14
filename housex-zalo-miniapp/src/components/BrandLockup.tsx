import {
  BRAND_TAGLINE_EN,
  BRAND_TAGLINE_VN,
  HOUSEX_LOGO_SRC,
} from "@/data/brand-content";
import { mediaUrl } from "@/utils/media";

type Props = {
  size?: "sm" | "md";
  showVn?: boolean;
  showEn?: boolean;
};

export function BrandLockup({
  size = "md",
  showVn = true,
  showEn = true,
}: Props) {
  const logoSrc = mediaUrl(HOUSEX_LOGO_SRC);

  return (
    <div className={`brand-lockup brand-lockup--${size}`}>
      {logoSrc ? (
        <img src={logoSrc} alt="House X" className="brand-lockup-logo" width={200} height={61} />
      ) : (
        <div className="home-logo">
          House <span className="home-logo-x">X</span>
        </div>
      )}
      {showEn ? (
        <p className="brand-lockup-tagline-en">{BRAND_TAGLINE_EN}</p>
      ) : null}
      {showVn ? (
        <p className="brand-lockup-tagline-vn">{BRAND_TAGLINE_VN}</p>
      ) : null}
    </div>
  );
}
