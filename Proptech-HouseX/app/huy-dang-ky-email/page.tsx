import { Suspense } from "react";
import UnsubscribeEmailClient from "./unsubscribe-email-client";

export const metadata = {
  title: "Hủy đăng ký email | House X",
  robots: { index: false, follow: false },
};

export default function UnsubscribeEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-slate-500">Đang xử lý…</div>
      }
    >
      <UnsubscribeEmailClient />
    </Suspense>
  );
}
