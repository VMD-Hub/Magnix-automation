import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/auth-context";
import {
  getInterestArea,
  guessAreaFromCoords,
  INTEREST_AREAS,
  requestBrowserLocation,
  setInterestArea,
  type InterestArea,
} from "@/services/interest-area";
import { mediaUrl } from "@/utils/media";

const CONTEXT_BG = "/images/hero/housex-thu-thiem-civic-center-night.webp";

function greetLabel(name: string | null | undefined): string {
  const raw = name?.trim();
  if (!raw) return "Chào bạn";
  const parts = raw.split(/\s+/);
  const short = parts.length > 1 ? parts[parts.length - 1] : raw;
  return `Chào ${short}`;
}

type Props = {
  /** Gợi ý chọn khu vực lần đầu — có thể bỏ qua */
  softPrompt?: boolean;
};

/**
 * Đầu home — ảnh đô thị + chào + khu vực quan tâm.
 * Không logo/tagline (brand nằm ở banner ruby bên dưới).
 */
export function HomeContextHeader({ softPrompt = true }: Props) {
  const { user } = useAuth();
  const [area, setArea] = useState<InterestArea | null>(() => getInterestArea());
  const [open, setOpen] = useState(false);
  const [busyGps, setBusyGps] = useState(false);
  const [gpsErr, setGpsErr] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const bg = mediaUrl(CONTEXT_BG);

  useEffect(() => {
    if (!softPrompt || area) return;
    try {
      if (localStorage.getItem("hx_miniapp_area_hint_dismissed") === "1") return;
    } catch {
      /* ignore */
    }
    setShowHint(true);
  }, [softPrompt, area]);

  const pick = useCallback((next: InterestArea | null) => {
    setInterestArea(next);
    setArea(next);
    setOpen(false);
    setShowHint(false);
    setGpsErr(null);
  }, []);

  const dismissHint = useCallback(() => {
    setShowHint(false);
    try {
      localStorage.setItem("hx_miniapp_area_hint_dismissed", "1");
    } catch {
      /* ignore */
    }
  }, []);

  async function useGps() {
    setBusyGps(true);
    setGpsErr(null);
    try {
      const { lat, lng } = await requestBrowserLocation();
      const guessed = guessAreaFromCoords(lat, lng);
      pick(guessed);
    } catch (e) {
      setGpsErr(e instanceof Error ? e.message : "Không lấy được vị trí");
    } finally {
      setBusyGps(false);
    }
  }

  return (
    <>
      <header
        className="home-context"
        style={
          bg
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(26,18,20,0.55) 0%, rgba(26,18,20,0.78) 100%), url(${bg})`,
              }
            : undefined
        }
      >
        <div className="home-context-inner">
          <p className="home-context-greet">{greetLabel(user?.name)}</p>
          <button
            type="button"
            className="home-context-area"
            onClick={() => setOpen(true)}
          >
            <span className="home-context-pin" aria-hidden>
              ⌖
            </span>
            <span className="home-context-area-text">
              {area ? area.label : "Chọn khu vực quan tâm"}
            </span>
            <span className="home-context-caret" aria-hidden>
              ▾
            </span>
          </button>
          {showHint && !area ? (
            <div className="home-context-hint">
              <p>Chọn khu vực để gợi ý dự án phù hợp — có thể bỏ qua.</p>
              <button type="button" className="home-context-hint-skip" onClick={dismissHint}>
                Bỏ qua
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {open ? (
        <div
          className="lane-sheet-backdrop"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="lane-sheet"
            role="dialog"
            aria-label="Khu vực quan tâm"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="lane-sheet-title">Khu vực bạn quan tâm</p>
            <p className="muted" style={{ margin: "0 0 12px", fontSize: 12 }}>
              Giúp tư vấn đúng địa bàn — không bắt buộc bật GPS.
            </p>
            <button
              type="button"
              className="lane-sheet-option"
              onClick={() => void useGps()}
              disabled={busyGps}
            >
              <span>{busyGps ? "Đang lấy vị trí…" : "Dùng vị trí hiện tại"}</span>
              <span className="lane-sheet-go">GPS</span>
            </button>
            {gpsErr ? <p className="err">{gpsErr}</p> : null}
            {INTEREST_AREAS.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`lane-sheet-option${area?.id === a.id ? " is-active" : ""}`}
                onClick={() => pick(a)}
              >
                <span>{a.label}</span>
                {area?.id === a.id ? (
                  <span className="lane-sheet-badge">Đang chọn</span>
                ) : (
                  <span className="lane-sheet-go">Chọn</span>
                )}
              </button>
            ))}
            {area ? (
              <button
                type="button"
                className="lane-sheet-close"
                onClick={() => pick(null)}
              >
                Xóa khu vực đã chọn
              </button>
            ) : null}
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
