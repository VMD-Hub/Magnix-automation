import { redirect } from "next/navigation";

/** Trang index chuyên gia → đội ngũ & biên tập (hồ sơ từng chuyên gia vẫn ở /chuyen-gia/[slug]). */
export default function ChuyenGiaIndexPage() {
  redirect("/doi-ngu");
}
