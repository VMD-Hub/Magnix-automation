import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Đăng tin",
  description: "Đăng ký tài khoản môi giới HouseX để đăng tin bất động sản.",
};

/** Alias /dang-tin → onboarding môi giới. */
export default function DangTinPage() {
  redirect("/dang-ky/moi-gioi");
}
