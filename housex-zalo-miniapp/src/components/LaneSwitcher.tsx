import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPreferredLane,
  laneHomePath,
  LANE_LABELS,
  LANE_SHORT_LABELS,
  setPreferredLane,
  type UserLane,
} from "@/services/lane";

type Props = {
  current: UserLane;
};

/** Chip header + bottom sheet đổi lane. */
export function LaneSwitcher({ current }: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function switchTo(lane: UserLane) {
    setPreferredLane(lane);
    setOpen(false);
    navigate(laneHomePath(lane));
  }

  function reopenStart() {
    setOpen(false);
    navigate("/start");
  }

  return (
    <>
      <button
        type="button"
        className="lane-chip"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {LANE_SHORT_LABELS[current]}
        <span className="lane-chip-caret" aria-hidden>
          ▾
        </span>
      </button>

      {open ? (
        <div
          className="lane-sheet-backdrop"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="lane-sheet"
            role="dialog"
            aria-label="Chọn mục tiêu mua nhà"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="lane-sheet-title">Mục tiêu mua nhà</p>
            {(["noxh", "cctm"] as const).map((lane) => (
              <button
                key={lane}
                type="button"
                className={`lane-sheet-option${lane === current ? " is-active" : ""}`}
                onClick={() => switchTo(lane)}
              >
                <span className="lane-sheet-option-label">{LANE_LABELS[lane]}</span>
                {lane === current ? (
                  <span className="lane-sheet-badge">Đang xem</span>
                ) : (
                  <span className="lane-sheet-go">Chuyển →</span>
                )}
              </button>
            ))}
            <button type="button" className="lane-sheet-muted" onClick={reopenStart}>
              Chọn lại từ màn chào
            </button>
            <button
              type="button"
              className="lane-sheet-close"
              onClick={() => setOpen(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Tab Tìm nhà — link tới lane đang nhớ. */
export function useHomeTabPath(): string {
  return laneHomePath(getPreferredLane() ?? "noxh");
}
