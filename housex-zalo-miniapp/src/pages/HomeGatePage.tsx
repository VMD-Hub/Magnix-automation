import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  getPreferredLane,
  laneHomePath,
  parseLaneParam,
  setPreferredLane,
} from "@/services/lane";

/** `/` — CTV → Agent hub; khách → lane / start. */
export function HomeGatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { canAgent, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    /** Deep link lane vẫn ưu tiên (chiến dịch khách). */
    const fromUrl = parseLaneParam(searchParams.get("lane"));
    if (fromUrl) {
      setPreferredLane(fromUrl);
      navigate(laneHomePath(fromUrl), { replace: true });
      return;
    }

    if (canAgent) {
      navigate("/agent", { replace: true });
      return;
    }

    const saved = getPreferredLane();
    if (saved) {
      navigate(laneHomePath(saved), { replace: true });
      return;
    }

    navigate("/start", { replace: true });
  }, [navigate, searchParams, canAgent, loading]);

  return (
    <div className="home-gate">
      <p className="muted">Đang mở House X…</p>
    </div>
  );
}
