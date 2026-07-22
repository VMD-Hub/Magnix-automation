/** Redirect 301 → /dinh-gia (next.config.mjs). */
import { permanentRedirect } from "next/navigation";

export default function CongCuDinhGiaRedirect() {
  permanentRedirect("/dinh-gia");
}
