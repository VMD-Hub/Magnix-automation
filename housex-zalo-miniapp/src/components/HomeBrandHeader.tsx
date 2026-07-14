import { BrandLockup } from "@/components/BrandLockup";
import { RubySurfaceOrnament } from "@/components/RubySurfaceOrnament";

type Props = {
  /** Dòng giá trị / thông điệp — ưu tiên trên banner */
  valueLine: string;
  supportLine?: string;
};

/**
 * Banner ruby: thông điệp lane trước, logo nhỏ góc trái (không kicker / không chip NOXH).
 * Đổi mục tiêu: Tài khoản hoặc teaser cross-lane phía dưới.
 */
export function HomeBrandHeader({ valueLine, supportLine }: Props) {
  return (
    <header className="home-header home-header--brand home-header--merged">
      <RubySurfaceOrnament variant="header" />
      <div className="home-header-inner home-header-inner--msg">
        <div className="home-header-brand-row">
          <BrandLockup size="sm" showVn={false} showEn={false} />
        </div>
        <h2 className="home-header-value">{valueLine}</h2>
        {supportLine ? (
          <p className="home-header-support">{supportLine}</p>
        ) : null}
      </div>
      <span className="home-header-gold-line" aria-hidden />
    </header>
  );
}
