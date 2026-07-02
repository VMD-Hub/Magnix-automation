import { Suspense } from "react";
import ResetPasswordClient from "./reset-password-client";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-slate-500">Đang tải…</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
