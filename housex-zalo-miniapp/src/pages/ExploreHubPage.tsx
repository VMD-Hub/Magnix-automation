import { useNavigate } from "react-router-dom";
import { RubySurfaceOrnament } from "@/components/RubySurfaceOrnament";
import {
  laneHomePath,
  LANE_LABELS,
  setPreferredLane,
  type UserLane,
} from "@/services/lane";

const PICKS: Array<{ lane: UserLane; desc: string }> = [
  {
    lane: "noxh",
    desc: "Phù hợp nếu bạn quan tâm điều kiện NOXH, vay ưu đãi và hồ sơ pháp lý.",
  },
  {
    lane: "cctm",
    desc: "Phù hợp nếu bạn tìm căn hộ thương mại — vị trí, thanh toán, tiện ích đô thị.",
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
      <RubySurfaceOrnament variant="header" />
      <p className="muted">KHÁM PHÁ</p>
      <h1 className="brand" style={{ fontSize: 22, marginBottom: 8 }}>
        Hai hành trình House X
      </h1>
      <p className="lead" style={{ marginBottom: 16 }}>
        Chọn hướng gần với bạn nhất — có thể đổi sau từ header.
      </p>

      <div className="explore-hub-cards">
        {PICKS.map((p) => (
          <button
            key={p.lane}
            type="button"
            className="card explore-hub-card"
            onClick={() => enter(p.lane)}
          >
            <strong>{LANE_LABELS[p.lane]}</strong>
            <p className="muted" style={{ margin: "8px 0 12px", fontSize: 13 }}>
              {p.desc}
            </p>
            <span className="explore-hub-cta">Vào khu vực này →</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn secondary"
        style={{ marginTop: 16, width: "100%" }}
        onClick={() => navigate("/start")}
      >
        Quay lại màn chào
      </button>
    </div>
  );
}
