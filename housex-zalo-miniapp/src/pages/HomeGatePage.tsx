import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getPreferredLane,
  laneHomePath,
  parseLaneParam,
  setPreferredLane,
} from "@/services/lane";

/** `/` — redirect theo deep link, remember lane, hoặc /start. */
export function HomeGatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fromUrl = parseLaneParam(searchParams.get("lane"));
    if (fromUrl) {
      setPreferredLane(fromUrl);
      navigate(laneHomePath(fromUrl), { replace: true });
      return;
    }

    const saved = getPreferredLane();
    if (saved) {
      navigate(laneHomePath(saved), { replace: true });
      return;
    }

    navigate("/start", { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="home-gate">
      <p className="muted">Đang mở House X…</p>
    </div>
  );
}
