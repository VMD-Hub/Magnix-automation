import { useNavigate } from "react-router-dom";
import { PromoWheelArt } from "@/components/PromoWheelArt";
import { RubySurfaceOrnament } from "@/components/RubySurfaceOrnament";
import { getHxBuildId } from "@/utils/build-id";

/** Teaser vòng quay — copy trái, ảnh vòng quay phải (CTA trực quan). */
export function PromoTeaser() {
  const navigate = useNavigate();
  const buildId = getHxBuildId();

  return (
    <button
      type="button"
      className="promo-teaser promo-teaser--hero"
      onClick={() => navigate("/mo?p=%2Fkhuyen-mai")}
      aria-label="Vào vòng quay may mắn House X"
      data-hx-build={buildId}
    >
      <RubySurfaceOrnament variant="card" />
      <div className="promo-teaser-body">
        <p className="promo-teaser-kicker">
          KHUYẾN MÃI NOXH · {buildId}
        </p>
        <h2 className="promo-teaser-title">Vòng quay may mắn</h2>
        <p className="promo-teaser-desc">
          Quay là có quà — Mua nhà nhận “lộc” từ House X.
        </p>
      </div>
      <span className="promo-teaser-wheel" aria-hidden>
        <PromoWheelArt />
      </span>
    </button>
  );
}
