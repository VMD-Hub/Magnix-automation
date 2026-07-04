"use client";

import { useState } from "react";
import Link from "next/link";
import type { AgeScreenStatus, Salutation } from "@/lib/finance/noxh-loan-age-screen";
import {
  NoxhLoanAdvisoryForm,
  NoxhLoanQuickCheck,
  NoxhLoanQuickChecklist,
} from "@/components/tools/noxh-loan-quick-check";
import { NOXH_LOAN_QUICK_ARTICLE_LINKS } from "@/lib/content/noxh-loan-quick-check-copy";

export function NoxhLoanQuickCheckSection() {
  const [screen, setScreen] = useState<{
    birthYear: number;
    salutation: Salutation;
    status: AgeScreenStatus;
  } | null>(null);

  return (
    <>
      <NoxhLoanQuickCheck onScreenComplete={setScreen} />

      {screen ? (
        <section className="mt-10" id="dong-hanh">
          <NoxhLoanAdvisoryForm
            birthYear={screen.birthYear}
            salutation={screen.salutation}
            ageStatus={screen.status}
          />
        </section>
      ) : (
        <p className="mt-6 text-center text-sm text-slate-500">
          Hoàn thành kiểm tra tuổi sơ bộ ở trên để mở form nhờ chuyên gia đồng hành.
        </p>
      )}

      <section className="mt-14">
        <h2 className="text-lg font-bold text-slate-900">Đọc thêm — kiến thức thẩm định vay NOXH</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {NOXH_LOAN_QUICK_ARTICLE_LINKS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:border-brand-200 hover:bg-brand-50/50"
            >
              {a.label} →
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-lg font-bold text-slate-900">Checklist chuẩn bị tiếp theo</h2>
        <p className="mt-1 text-sm text-slate-600">
          Các tiêu chí hay bị bỏ qua trước khi đặt cọc — thu nhập, CIC, hôn nhân, nghĩa vụ nợ, giấy
          tờ NOXH.
        </p>
        <div className="mt-4">
          <NoxhLoanQuickChecklist />
        </div>
      </section>
    </>
  );
}
