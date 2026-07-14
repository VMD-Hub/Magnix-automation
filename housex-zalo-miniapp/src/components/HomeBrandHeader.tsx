import { BrandLockup } from "@/components/BrandLockup";
import { LaneSwitcher } from "@/components/LaneSwitcher";
import { RubySurfaceOrnament } from "@/components/RubySurfaceOrnament";
import type { UserLane } from "@/services/lane";

type Props = {
  lane: UserLane;
  kicker?: string;
};

export function HomeBrandHeader({ lane, kicker }: Props) {
  return (
    <header className="home-header home-header--brand">
      <RubySurfaceOrnament variant="header" />
      <div className="home-header-inner">
        <div className="home-header-top">
          <p className="home-header-kicker">{kicker ?? "PROPTECH · HOUSE X"}</p>
          <LaneSwitcher current={lane} />
        </div>
        <BrandLockup size="sm" showVn={false} />
      </div>
      <span className="home-header-gold-line" aria-hidden />
    </header>
  );
}
