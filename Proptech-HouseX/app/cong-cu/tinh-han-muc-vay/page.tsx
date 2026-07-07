import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { LoanAffordabilityCalculator } from "@/components/tools/loan-affordability-calculator";
import { ToolsBreadcrumb, ToolsPageHero } from "@/components/tools/tools-page-hero";
import { LOAN_AFFORDABILITY_COPY } from "@/lib/content/housex-tools-copy";
import {
  LOAN_AFFORDABILITY_BANNER,
  LOAN_CALC_TRUST_STATS,
} from "@/lib/content/housex-tools-visuals";

export const metadata: Metadata = {
  title: LOAN_AFFORDABILITY_COPY.metaTitle,
  description: LOAN_AFFORDABILITY_COPY.metaDescription,
  alternates: { canonical: "/cong-cu/tinh-han-muc-vay" },
};

const FAQ = [
  {
    q: "Ngân hàng tính hạn mức vay mua nhà theo thu nhập như thế nào?",
    a: "Ngân hàng thường áp dụng đồng thời hai lớp: (1) DTI — tổng nghĩa vụ trả nợ/thu nhập ≤ ~50% (Thông tư 39/2016/NHNN); (2) Dòng tiền ròng — thu nhập trừ chi phí sinh hoạt tối thiểu theo số thành viên hộ, trừ nợ hiện tại, rồi xem còn bao nhiêu để trả vay mới. Hạn mức thực tế thường là mức thấp hơn trong hai cách tính này.",
  },
  {
    q: "Chi phí sinh hoạt tối thiểu/đầu người có được ngân hàng trừ vào không?",
    a: "Có — nhiều ngân hàng dự phòng chi phí sinh hoạt cho từng thành viên hộ (người vay, vợ/chồng, con phụ thuộc, cha mẹ không thu nhập) trước khi xét khả năng trả nợ. Mức cụ thể không có một con số quốc gia cố định; mỗi ngân hàng và từng hồ sơ có thể khác nhau. Công cụ HouseX dùng mức tham chiếu phổ biến (3,5–4,5 triệu đ/người/tháng) để ước lượng.",
  },
  {
    q: "Vợ/chồng đồng vay và CIC ảnh hưởng thế nào?",
    a: "Khi vợ/chồng đồng vay, thu nhập và nghĩa vụ nợ của cả hai được cộng vào hồ sơ. Dù không đồng vay, ngân hàng thường vẫn tra CIC vợ/chồng đã kết hôn — nợ xấu nhóm 2 trở lên của một bên có thể khiến hồ sơ bị từ chối hoặc giảm hạn mức.",
  },
  {
    q: "Hạn mức thẻ tín dụng ảnh hưởng hạn mức vay thế nào?",
    a: "Dù chưa dùng hết hạn mức thẻ, ngân hàng thường quy đổi khoảng 5% tổng hạn mức thẻ thành nghĩa vụ trả nợ tiềm tàng mỗi tháng — áp dụng cho cả vợ/chồng nếu có thẻ.",
  },
  {
    q: "DTI an toàn là bao nhiêu phần trăm?",
    a: "Dưới 40%: an toàn. 40–50%: mức tiêu chuẩn ngân hàng thường duyệt. 50–65%: cần hồ sơ tốt. Trên 65–70%: rủi ro cao. Lưu ý: DTI thấp vẫn có thể bị giới hạn nếu hộ nhiều người phụ thuộc khiến chi phí sinh hoạt dự phòng cao.",
  },
  {
    q: "Kết quả công cụ có thay thế quyết định ngân hàng không?",
    a: "Không. Đây là ước lượng sơ bộ mô phỏng hai phương pháp thẩm định phổ biến. Từng ngân hàng có ma trận riêng về thu nhập chấp nhận, CIC, loại BĐS và LTV.",
  },
];

export default function Page() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="proptech-section-glow mx-auto min-w-0 max-w-7xl py-8 container-px">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <ToolsBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Công cụ", href: "/cong-cu" },
          { label: "Tính hạn mức vay" },
        ]}
      />

      <ToolsPageHero
        kicker={LOAN_AFFORDABILITY_COPY.kicker}
        title={LOAN_AFFORDABILITY_COPY.title}
        subtitle={LOAN_AFFORDABILITY_COPY.subtitle}
        image={LOAN_AFFORDABILITY_BANNER.jpg}
        imageWebp={LOAN_AFFORDABILITY_BANNER.webp}
        imageAlt={LOAN_AFFORDABILITY_BANNER.alt}
        objectPosition={LOAN_AFFORDABILITY_BANNER.objectPosition}
        primaryCta={{
          label: LOAN_AFFORDABILITY_COPY.primaryCta,
          href: LOAN_AFFORDABILITY_COPY.primaryCtaHref,
        }}
        secondaryCta={{
          label: LOAN_AFFORDABILITY_COPY.secondaryCta,
          href: LOAN_AFFORDABILITY_COPY.secondaryCtaHref,
        }}
      />

      <div className="mb-8 flex gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0 print:hidden">
        {LOAN_CALC_TRUST_STATS.map((s) => (
          <div
            key={s.label}
            className="min-w-[8.5rem] shrink-0 proptech-ruby-soft-panel rounded-xl px-3 py-3 text-center sm:min-w-0 sm:shrink sm:px-4 sm:py-4"
          >
            <p className="text-lg font-extrabold text-brand-700 sm:text-xl">{s.value}</p>
            <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <section id="tinh-toan" className="min-w-0 scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <h2 className="text-lg font-bold text-slate-900">Bảng tính hạn mức</h2>
          <Link
            href="/cong-cu"
            className="text-sm font-medium text-slate-500 hover:text-brand-700"
          >
            ← Tất cả công cụ
          </Link>
        </div>
        <div className="min-w-0 rounded-2xl border border-silver-200 bg-white/80 p-2 shadow-sm backdrop-blur-sm sm:p-3">
          <LoanAffordabilityCalculator />
        </div>
      </section>

      <section className="mt-14 print:hidden">
        <h2 className="text-lg font-bold text-slate-900">Công cụ liên quan</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/cong-cu/tinh-khoan-vay"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Tính khoản vay mua nhà</p>
            <p className="mt-1 text-sm text-slate-600">
              Đã biết hạn mức? Xem tiền trả hàng tháng, tổng lãi và lịch trả nợ chi tiết.
            </p>
          </Link>
          <Link
            href="/cong-cu/kiem-tra-vay-noxh"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Kiểm tra vay NOXH 60 giây</p>
            <p className="mt-1 text-sm text-slate-600">
              Sàng lọc tuổi vay sơ bộ trước khi cọc — chỉ cần năm sinh.
            </p>
          </Link>
          <Link
            href="/cong-cu/dieu-kien-noxh"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Kiểm tra điều kiện NOXH</p>
            <p className="mt-1 text-sm text-slate-600">
              NOXH giới hạn vay 70% — kiểm tra đối tượng, thu nhập và khả năng vay.
            </p>
          </Link>
        </div>
      </section>

      <section className="mt-14 max-w-3xl print:hidden">
        <div className="proptech-ruby-soft-panel p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Cần hỗ trợ làm hồ sơ vay?</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sau khi biết hạn mức sơ bộ, đội ngũ HouseX giúp so sánh gói vay giữa các ngân hàng, tối
            ưu hồ sơ và đồng hành thẩm định tài sản.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/tai-chinh#tu-van" variant="primary" size="md">
              Nhận tư vấn vay
            </ButtonLink>
            <ButtonLink href="/dich-vu" variant="brand" size="md">
              Xem dịch vụ HouseX
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mt-16 max-w-3xl print:hidden">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {LOAN_AFFORDABILITY_COPY.faqHeading}
        </h2>
        <div className="mt-6 space-y-4">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-silver-200 bg-white open:border-brand-200 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  {f.q}
                  <span className="mt-0.5 text-brand-600 transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="border-t border-silver-100 px-5 pb-4 pt-2 text-sm leading-relaxed text-slate-600">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
