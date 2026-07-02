import { redirect } from "next/navigation";

/** Giai đoạn này không có landing từng sản phẩm NH — gom về hub. */
export default function TaiChinhLegacySlugPage() {
  redirect("/tai-chinh");
}
