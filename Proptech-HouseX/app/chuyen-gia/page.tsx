/** Redirect 301 → /doi-ngu (next.config.mjs). Giữ file để tránh 404 khi config chưa reload. */
import { permanentRedirect } from "next/navigation";

export default function ChuyenGiaIndexPage() {
  permanentRedirect("/doi-ngu");
}
