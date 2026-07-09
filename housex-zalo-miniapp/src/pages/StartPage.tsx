import { useNavigate } from "react-router-dom";
import { RubySurfaceOrnament } from "@/components/RubySurfaceOrnament";
import { HOME_TAGLINE } from "@/data/home-content";
import {
  laneHomePath,
  LANE_LABELS,
  setPreferredLane,
  type UserLane,
} from "@/services/lane";

const LANE_CARDS: Array<{
  lane: UserLane;
  emoji: string;
  title: string;
  bullets: string[];
  tone: string;
}> = [
  {
    lane: "noxh",
    emoji: "🏡",
    title: LANE_LABELS.noxh,
    bullets: ["Điều kiện & đối tượng", "Vay NOXH · hồ sơ", "Dự án đã chọn lọc"],
    tone: "var(--hx-ruby-gradient)",
  },
  {
    lane: "cctm",
    emoji: "🏙",
    title: LANE_LABELS.cctm,
    bullets: ["Vị trí & tiện ích", "Lộ trình thanh toán", "Căn hộ đô thị"],
    tone: "linear-gradient(135deg, #1a1214 0%, #3d2528 40%, #5c0b12 100%)",
  },
];

/** Màn chào — không tabbar; first impression hai lane. */
export function StartPage() {
  const navigate = useNavigate();

  function pick(lane: UserLane) {
    setPreferredLane(lane);
    navigate(laneHomePath(lane), { replace: true });
  }

  return (
    <div className="start-page">
      <RubySurfaceOrnament variant="header" />
      <header className="start-hero">
        <p className="start-kicker">HOUSE X · PROPTECH</p>
        <h1 className="start-title">
          House <span className="home-logo-x">X</span>
        </h1>
        <p className="start-tagline">{HOME_TAGLINE}</p>
        <p className="start-prompt">Bạn đang tìm gì hôm nay?</p>
      </header>

      <div className="start-cards">
        {LANE_CARDS.map((card) => (
          <button
            key={card.lane}
            type="button"
            className="start-card"
            style={{ background: card.tone }}
            onClick={() => pick(card.lane)}
          >
            <span className="start-card-emoji" aria-hidden>
              {card.emoji}
            </span>
            <span className="start-card-title">{card.title}</span>
            <ul className="start-card-bullets">
              {card.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <span className="start-card-cta">Bắt đầu →</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="start-unsure"
        onClick={() => navigate("/kham-pha")}
      >
        Tôi chưa chắc — xem tổng quan ngắn
      </button>

      <p className="start-foot muted">timnhaxahoi.com · Có thể đổi mục tiêu bất cứ lúc nào</p>
    </div>
  );
}
