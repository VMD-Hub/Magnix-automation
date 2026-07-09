import { useNavigate } from "react-router-dom";
import { RubySurfaceOrnament } from "@/components/RubySurfaceOrnament";

/** Teaser nổi bật — vòng quay khuyến mãi NOXH. */
export function PromoTeaser() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="promo-teaser"
      onClick={() => navigate("/mo?p=%2Fkhuyen-mai")}
    >
      <RubySurfaceOrnament variant="card" />
      <div className="promo-teaser-body">
        <p className="promo-teaser-kicker">KHUYẾN MÃI NOXH</p>
        <h2 className="promo-teaser-title">Vòng quay may mắn</h2>
        <p className="promo-teaser-desc">
          Quay thử — nhận quà khi hoàn tất hồ sơ mua NOXH trên House X.
        </p>
      </div>
      <span className="promo-teaser-cta" aria-hidden>
        Quay ngay →
      </span>
    </button>
  );
}
