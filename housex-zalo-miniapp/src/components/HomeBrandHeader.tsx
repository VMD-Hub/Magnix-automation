import { BrandLockup } from "@/components/BrandLockup";
import { LaneSwitcher } from "@/components/LaneSwitcher";
import { RubySurfaceOrnament } from "@/components/RubySurfaceOrnament";
import type { UserLane } from "@/services/lane";

type Props = {
  lane: UserLane;
  kicker?: string;
  /** Một dòng giá trị — gộp banner intro cũ */
  valueLine: string;
  supportLine?: string;
};

/**
 * Banner brand gộp — logo + tagline + giá trị lane.
 * Cao hơn header cũ; không trùng với vùng chào/vị trí phía trên.
 */
export function HomeBrandHeader({
  lane,
  kicker,
  valueLine,
  supportLine,
}: Props) {
  return (
    <header className="home-header home-header--brand home-header--merged">
      <RubySurfaceOrnament variant="header" />
      <div className="home-header-inner">
        <div className="home-header-top">
          <p className="home-header-kicker">{kicker ?? "PROPTECH · HOUSE X"}</p>
          <LaneSwitcher current={lane} />
        </div>
        <BrandLockup size="md" showVn={false} />
        <h2 className="home-header-value">{valueLine}</h2>
        {supportLine ? (
          <p className="home-header-support">{supportLine}</p>
        ) : null}
      </div>
      <span className="home-header-gold-line" aria-hidden />
    </header>
  );
}
