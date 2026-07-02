import type { Metadata } from "next";
import Link from "next/link";
import { CtvApplicationForm } from "@/components/auth/ctv-application-form";

export const metadata: Metadata = {
  title: "Đăng ký cộng tác viên (CTV)",
  robots: { index: false },
};

export default function CtvRegisterPage() {
  return (
    <div className="bg-slate-50 py-12 container-px sm:py-16">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-bold text-slate-900">Đăng ký CTV bán hàng liên kết</h1>
        <p className="mt-2 text-sm text-slate-600">
          Yêu cầu: đã có{" "}
          <Link href="/dang-ky/moi-gioi" className="font-semibold text-brand-700">
            tài khoản môi giới đăng tin
          </Link>
          . Sau khi nộp hồ sơ, bạn tham gia <strong>khóa đào tạo hội nhập</strong> (nguyên
          tắc vận hành, cách đăng tin). Admin chỉ duyệt và cấp mã{" "}
          <strong>HX-CTV-xxxxxx</strong> khi hoàn thành đào tạo.
        </p>
      </div>
      <div className="mt-8">
        <CtvApplicationForm />
      </div>
    </div>
  );
}
