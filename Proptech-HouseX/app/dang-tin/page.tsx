import { redirect } from "next/navigation";

/** /dang-tin → luồng đăng tin môi giới (form khi đã login). */
export default function DangTinPage() {
  redirect("/moi-gioi/dang-tin");
}
