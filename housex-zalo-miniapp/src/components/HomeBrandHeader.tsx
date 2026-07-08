import { HOME_TAGLINE } from "@/data/home-content";
import { RubySurfaceOrnament } from "@/components/RubySurfaceOrnament";

export function HomeBrandHeader() {
  return (
    <header className="home-header home-header--brand">
      <RubySurfaceOrnament variant="header" />
      <div className="home-header-inner">
        <p className="home-header-kicker">PROPTECH · NOXH</p>
        <div className="home-logo">
          House <span className="home-logo-x">X</span>
        </div>
        <p className="home-tagline">{HOME_TAGLINE}</p>
      </div>
      <span className="home-header-gold-line" aria-hidden />
    </header>
  );
}
