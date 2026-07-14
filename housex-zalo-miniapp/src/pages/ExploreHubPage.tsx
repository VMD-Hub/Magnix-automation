import { useNavigate } from "react-router-dom";
import { LanePickCard } from "@/components/LanePickCard";
import { PageBrandHeader } from "@/components/PageBrandHeader";
import { CCTM_BANNERS, NOXH_BANNERS } from "@/data/home-lane-content";
import {
  laneHomePath,
  LANE_LABELS,
  setPreferredLane,
  type UserLane,
} from "@/services/lane";
import { mediaUrl } from "@/utils/media";

const PICKS: Array<{
  lane: UserLane;
  benefit: string;
  imageUrl?: string;
  gradient: string;
}> = [
  {
    lane: "noxh",
    benefit: "Phù hợp nếu bạn quan tâm điều kiện NOXH, vay ưu đãi và hồ sơ pháp lý.",
    imageUrl: NOXH_BANNERS[0]?.imageUrl,
    gradient: NOXH_BANNERS[0]?.gradient ?? "var(--hx-ruby-gradient)",
  },
  {
    lane: "cctm",
    benefit:
      "Phù hợp nếu bạn tìm căn hộ thương mại — vị trí, thanh toán, tiện ích đô thị.",
    imageUrl: CCTM_BANNERS[0]?.imageUrl,
    gradient:
      CCTM_BANNERS[0]?.gradient ??
      "linear-gradient(135deg, #1a1214 0%, #2a1a1c 35%, #5c0b12 100%)",
  },
];

/** Hub nhẹ khi user "chưa chắc" — không ép chọn ngay. */
export function ExploreHubPage() {
  const navigate = useNavigate();

  function enter(lane: UserLane) {
    setPreferredLane(lane);
    navigate(laneHomePath(lane));
  }

  return (
    <div className="explore-hub">
      <PageBrandHeader
        kicker="KHÁM PHÁ"
        title="Hai hành trình House X"
        lead="Chọn hướng gần với bạn nhất — có thể đổi sau bất cứ lúc nào."
        backTo="/start"
        backLabel="← Quay lại màn chào"
      />

      <div className="explore-hub-cards">
        {PICKS.map((p) => (
          <LanePickCard
            key={p.lane}
            title={LANE_LABELS[p.lane]}
            benefit={p.benefit}
            imageUrl={mediaUrl(p.imageUrl)}
            gradient={p.gradient}
            cta="Vào khu vực này →"
            onClick={() => enter(p.lane)}
          />
        ))}
      </div>
    </div>
  );
}
