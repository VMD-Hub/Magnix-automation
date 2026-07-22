import { permanentRedirect } from "next/navigation";

/** /dang-tin → form môi giới (308 cứng cũng có trong middleware). */
export default function DangTinPage() {
  permanentRedirect("/moi-gioi/dang-tin");
}
