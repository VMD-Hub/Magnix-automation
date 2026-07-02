import { Suspense } from "react";
import VerifyEmailClient from "./verify-email-client";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-slate-500">Đang xác nhận…</div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
