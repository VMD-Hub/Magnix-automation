"use client";

import Link from "next/link";
import { LeadContactForm } from "@/components/leads/lead-contact-form";
import { ButtonLink } from "@/components/ui/button";
import { RE_KNOWLEDGE_PATH } from "@/lib/content/article-routes";
import { BTR_HUB_PATH } from "@/lib/content/long-term-rental-btr";
import { RENTAL_NEED_PM_NO_PROMISE } from "@/lib/content/messaging/rental-waitlist-copy";

const TAX_HREF = `${RE_KNOWLEDGE_PATH}/thue-cho-thue-nha-2026-ma-nganh-68103`;
const CASHFLOW_HREF = `${RE_KNOWLEDGE_PATH}/tinh-dong-tien-don-bay-can-ho-cho-thue-2026`;

/** ADR-018 Wave 0–2 — CTA chủ nhà + thuế + waitlist NEED_PM trên hub /cho-thue. */
export function RentalHubLandlordPanel() {
  return (
    <>
      <section className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
            Chủ nhà / đối tác
          </p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">
            Cần tìm khách thuê — để lại liên hệ
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            House X kết nối tin và hỗ trợ tìm khách (hoa hồng theo thỏa thuận Minh An
            Land). Chưa phải dịch vụ quản lý căn — không thu tiền / bảo trì hộ bạn ở
            giai đoạn này.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href="/moi-gioi/dang-tin" variant="primary" size="md">
              Đăng tin cho thuê
            </ButtonLink>
            <ButtonLink href="/cong-cu/dong-tien-cho-thue" variant="brand" size="md">
              Tính dòng tiền / thuế
            </ButtonLink>
            <ButtonLink href="/dang-ky/moi-gioi" variant="outline" size="md">
              Đăng ký môi giới
            </ButtonLink>
          </div>
          <div className="mt-6">
            <LeadContactForm
              rentalIntent="landlord"
              defaultOpen
              title="Tôi là chủ nhà — cần tìm khách"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Thuế · kế toán · pháp lý HĐ
          </p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">
            Cần kế toán / pháp lý hợp đồng thuê?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Minh An tiếp nhận nhu cầu thuế / HĐ thuê và (khi bạn đồng ý) giới thiệu
            đối tác kế toán hoặc pháp lý — không tư vấn thuế thay luật sư/KTV.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href={TAX_HREF}
                className="font-semibold text-brand-700 underline decoration-brand-200 underline-offset-4 hover:text-brand-800"
              >
                Thuế khi cho thuê nhà (mã 68103)
              </Link>
            </li>
            <li>
              <Link
                href={CASHFLOW_HREF}
                className="font-semibold text-brand-700 underline decoration-brand-200 underline-offset-4 hover:text-brand-800"
              >
                Tính dòng tiền & đòn bẩy căn hộ cho thuê
              </Link>
            </li>
            <li>
              <Link
                href={BTR_HUB_PATH}
                className="font-semibold text-brand-700 underline decoration-brand-200 underline-offset-4 hover:text-brand-800"
              >
                Chủ đề nhà ở cho thuê dài hạn
              </Link>
            </li>
          </ul>
          <div className="mt-6">
            <LeadContactForm
              rentalIntent="tax_help"
              compact
              title="Cần kế toán / pháp lý HĐ thuê"
              placeholderMessage="Số căn, khu vực, thuế hay soạn HĐ…"
            />
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Danh sách chờ — không bán ngay
        </p>
        <h2 className="mt-2 text-lg font-bold text-slate-900">
          Quan tâm quản lý vận hành sau?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          {RENTAL_NEED_PM_NO_PROMISE} Ghi danh để nhận cập nhật khi có gói phù hợp —
          ưu tiên tìm khách (hoa hồng) và hiểu thuế / dòng tiền trước.
        </p>
        <div className="mt-6 max-w-xl">
          <LeadContactForm
            rentalIntent="need_pm"
            compact
            defaultOpen
            title="Ghi danh sách chờ QL sau"
          />
        </div>
      </section>
    </>
  );
}
