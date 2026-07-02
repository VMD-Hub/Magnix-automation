import Link from "next/link";

export function RateLimitNotice() {
  return (
    <div className="mx-auto max-w-lg py-20 text-center container-px">
      <h1 className="text-2xl font-bold text-slate-900">Quá nhiều yêu cầu</h1>
      <p className="mt-3 text-slate-600">
        Hệ thống phát hiện truy cập dày đặc từ thiết bị của bạn. Vui lòng thử lại sau
        vài phút.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
