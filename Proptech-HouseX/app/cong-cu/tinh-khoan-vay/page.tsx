import type { Metadata } from "next";
import Link from "next/link";
import { LoanCalculator } from "@/components/tools/loan-calculator";

export const metadata: Metadata = {
  title: "Công cụ tính lãi vay mua nhà — Lịch trả nợ chi tiết",
  description:
    "Tính khoản vay mua bất động sản theo dư nợ giảm dần hoặc trả góp đều: số tiền trả hàng tháng, tổng lãi, lịch trả nợ chi tiết và xuất PDF miễn phí.",
  alternates: { canonical: "/cong-cu/tinh-khoan-vay" },
};

const FAQ = [
  {
    q: "Tính lãi vay mua nhà theo phương pháp nào?",
    a: "Có 2 cách phổ biến: (1) Dư nợ giảm dần — gốc trả đều mỗi tháng, lãi tính trên dư nợ còn lại nên tiền trả giảm dần và tổng lãi thấp hơn; (2) Trả góp đều (annuity) — tổng tiền trả hằng tháng cố định, dễ lập kế hoạch. Đa số ngân hàng Việt Nam áp dụng dư nợ giảm dần.",
  },
  {
    q: "Công thức tính số tiền trả hàng tháng là gì?",
    a: "Trả góp đều: M = P × r × (1+r)^n / ((1+r)^n − 1), với P là tiền vay, r là lãi suất tháng (lãi năm chia 12), n là tổng số tháng. Dư nợ giảm dần: gốc hàng tháng = P/n, lãi tháng k = dư nợ còn lại × r.",
  },
  {
    q: "Nên vay tối đa bao nhiêu phần trăm giá trị nhà?",
    a: "Ngân hàng thường cho vay 70–85% giá trị tài sản thế chấp. Nên cân đối để tổng nghĩa vụ trả nợ hàng tháng không vượt 40–50% thu nhập để an toàn tài chính.",
  },
  {
    q: "Lãi suất ưu đãi và ân hạn gốc ảnh hưởng thế nào?",
    a: "Lãi ưu đãi áp dụng trong N tháng đầu (thường 5–7%/năm) rồi thả nổi 8–12%/năm. Ân hạn gốc cho phép chỉ trả lãi trong giai đoạn đầu, giảm áp lực dòng tiền nhưng làm tăng tổng lãi.",
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
    <div className="mx-auto max-w-7xl py-10 container-px">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <nav className="text-sm text-slate-500 print:hidden">
        <Link href="/" className="hover:text-brand-700">
          Trang chủ
        </Link>{" "}
        / <Link href="/dich-vu" className="hover:text-brand-700">Dịch vụ</Link> /{" "}
        <Link href="/tai-chinh" className="hover:text-brand-700">Tài chính</Link> /{" "}
        <Link href="/cong-cu" className="hover:text-brand-700">Công cụ</Link> /{" "}
        <span className="text-slate-700">Tính khoản vay</span>
      </nav>

      <header className="mt-4 max-w-2xl print:hidden">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Công cụ tính lãi vay mua nhà
        </h1>
        <p className="mt-2 text-slate-600">
          Ước tính số tiền trả hàng tháng, tổng lãi và xem lịch trả nợ chi tiết
          theo dư nợ giảm dần hoặc trả góp đều. Xuất PDF để lưu hoặc gửi tư vấn.
        </p>
      </header>

      <section className="mt-8">
        <LoanCalculator />
      </section>

      {/* SEO Q&A */}
      <section className="mt-16 max-w-3xl print:hidden">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Câu hỏi thường gặp về vay mua nhà
        </h2>
        <div className="mt-6 space-y-5">
          {FAQ.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <h3 className="font-semibold text-slate-900">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
