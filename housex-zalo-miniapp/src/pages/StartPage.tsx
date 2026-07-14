import { useNavigate } from "react-router-dom";
import { BrandLockup } from "@/components/BrandLockup";
import { LanePickCard } from "@/components/LanePickCard";
import { RubySurfaceOrnament } from "@/components/RubySurfaceOrnament";
import { CCTM_BANNERS, NOXH_BANNERS } from "@/data/home-lane-content";
import {
  laneHomePath,
  LANE_LABELS,
  setPreferredLane,
  type UserLane,
} from "@/services/lane";
import { mediaUrl } from "@/utils/media";

const LANE_CARDS: Array<{
  lane: UserLane;
  title: string;
  benefit: string;
  imageUrl?: string;
  gradient: string;
}> = [
  {
    lane: "noxh",
    title: LANE_LABELS.noxh,
    benefit: "Điều kiện · vay · hồ sơ minh bạch",
    imageUrl: NOXH_BANNERS[0]?.imageUrl,
    gradient: NOXH_BANNERS[0]?.gradient ?? "var(--hx-ruby-gradient)",
  },
  {
    lane: "cctm",
    title: LANE_LABELS.cctm,
    benefit: "Vị trí · tiện ích · lộ trình thanh toán",
    imageUrl: CCTM_BANNERS[0]?.imageUrl,
    gradient:
      CCTM_BANNERS[0]?.gradient ??
      "linear-gradient(135deg, #1a1214 0%, #3d2528 40%, #5c0b12 100%)",
  },
];

/** Màn chào — không tabbar; first impression hai lane (ảnh + 1 dòng lợi ích). */
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
        <BrandLockup size="md" showVn />
        <p className="start-prompt">Bạn đang tìm gì hôm nay?</p>
      </header>

      <div className="start-cards">
        {LANE_CARDS.map((card) => (
          <LanePickCard
            key={card.lane}
            title={card.title}
            benefit={card.benefit}
            imageUrl={mediaUrl(card.imageUrl)}
            gradient={card.gradient}
            onClick={() => pick(card.lane)}
          />
        ))}
      </div>

      <button
        type="button"
        className="start-unsure"
        onClick={() => navigate("/kham-pha")}
      >
        Tôi chưa chắc — xem tổng quan ngắn
      </button>

      <p className="start-foot muted">
        timnhaxahoi.com · Có thể đổi mục tiêu bất cứ lúc nào
      </p>
    </div>
  );
}
