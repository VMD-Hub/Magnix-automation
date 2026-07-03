import type { Metadata } from "next";
import Link from "next/link";
import { NoxhEligibilityWizard } from "@/components/tools/noxh-eligibility-wizard";
import { ToolsBreadcrumb, ToolsPageHero } from "@/components/tools/tools-page-hero";
import { NOXH_CHECK_COPY } from "@/lib/content/housex-tools-copy";
import { NOXH_CHECK_BANNER } from "@/lib/content/housex-tools-visuals";

export const metadata: Metadata = {
  title: NOXH_CHECK_COPY.metaTitle,
  description: NOXH_CHECK_COPY.metaDescription,
  alternates: { canonical: "/cong-cu/dieu-kien-noxh" },
};

const FAQ = [
  {
    q: "Ai được mua nhà ở xã hội theo quy định mới nhất?",
    a: "Theo Điều 76 Luật Nhà ở 2023 có khoảng 10 nhóm được mua/thuê mua NOXH, phổ biến là: người thu nhập thấp tại đô thị, công nhân/người lao động, cán bộ – công chức – viên chức, lực lượng vũ trang, người có công, hộ nghèo/cận nghèo, hộ bị thu hồi đất chưa được bồi thường. Một số nhóm (người có công, hộ nghèo…) được miễn điều kiện thu nhập.",
  },
  {
    q: "Trần thu nhập mua NOXH năm 2026 là bao nhiêu?",
    a: "Theo Điều 30 Nghị định 100/2024/NĐ-CP (sửa đổi bởi Nghị định 136/2026/NĐ-CP, hiệu lực 07/4/2026): người độc thân/chưa kết hôn thu nhập bình quân ≤ 25 triệu/tháng; độc thân đang nuôi con dưới tuổi thành niên ≤ 35 triệu/tháng; đã kết hôn thì tổng thu nhập hai vợ chồng ≤ 50 triệu/tháng, tính trong 12 tháng liền kề.",
  },
  {
    q: "Đang có nhà thì có được mua NOXH không?",
    a: "Vẫn có thể, nếu diện tích ở bình quân đầu người thấp hơn 15 m² sàn/người (Điều 29 NĐ 100/2024). Nếu chưa có nhà thuộc sở hữu tại tỉnh/TP nơi có dự án thì đương nhiên đủ điều kiện về nhà ở. Người đã từng mua/thuê mua NOXH hoặc đã hưởng chính sách hỗ trợ nhà ở thì không đủ điều kiện.",
  },
  {
    q: "Nợ xấu nhóm 2 có ảnh hưởng khi mua NOXH không?",
    a: "Nợ xấu không liên quan đến điều kiện MUA NOXH, nhưng ảnh hưởng lớn đến việc ĐƯỢC VAY. Nếu bạn (hoặc vợ/chồng) đang nợ xấu nhóm 2 trở lên, dư nợ cao hoặc hạn mức thẻ tín dụng lớn thì khả năng vay và hạn mức được duyệt sẽ giảm. Chuyên gia HouseX có thể tư vấn giải pháp xử lý hồ sơ trước khi nộp.",
  },
  {
    q: "Kết quả kiểm tra có giá trị pháp lý không?",
    a: "Không. Đây là công cụ sàng lọc sơ bộ giúp bạn định hướng. Điều kiện chính thức do cơ quan có thẩm quyền xác nhận (thu nhập, tình trạng nhà ở…). Hãy để chuyên gia HouseX hỗ trợ chuẩn bị và hoàn thiện hồ sơ.",
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
    <div className="proptech-section-glow mx-auto max-w-5xl py-8 container-px">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="print:hidden">
      <ToolsBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Công cụ", href: "/cong-cu" },
          { label: "Kiểm tra điều kiện NOXH" },
        ]}
      />

      <ToolsPageHero
        kicker={NOXH_CHECK_COPY.kicker}
        title={NOXH_CHECK_COPY.title}
        subtitle={NOXH_CHECK_COPY.subtitle}
        image={NOXH_CHECK_BANNER.jpg}
        imageWebp={NOXH_CHECK_BANNER.webp}
        imageAlt={NOXH_CHECK_BANNER.alt}
        objectPosition={NOXH_CHECK_BANNER.objectPosition}
        primaryCta={{
          label: NOXH_CHECK_COPY.primaryCta,
          href: NOXH_CHECK_COPY.primaryCtaHref,
        }}
        secondaryCta={{
          label: NOXH_CHECK_COPY.secondaryCta,
          href: NOXH_CHECK_COPY.secondaryCtaHref,
        }}
      />
      </div>

      <section id="kiem-tra" className="scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <h2 className="text-lg font-bold text-slate-900">
            Kiểm tra trong 5 bước
          </h2>
          <Link
            href="/cong-cu"
            className="text-sm font-medium text-slate-500 hover:text-brand-700"
          >
            ← Tất cả công cụ
          </Link>
        </div>
        <NoxhEligibilityWizard />
      </section>

      <section className="mt-14 print:hidden">
        <h2 className="text-lg font-bold text-slate-900">Công cụ liên quan</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/cong-cu/tinh-khoan-vay"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Tính khoản vay mua nhà</p>
            <p className="mt-1 text-sm text-slate-600">
              Ước tính tiền trả hàng tháng, tổng lãi và lịch trả nợ khi vay mua NOXH.
            </p>
          </Link>
          <Link
            href="/du-an?projectType=NHA_O_XA_HOI"
            className="rounded-2xl border border-silver-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="font-bold text-slate-900">Dự án nhà ở xã hội</p>
            <p className="mt-1 text-sm text-slate-600">
              Khám phá các dự án NOXH đang mở bán phù hợp điều kiện của bạn.
            </p>
          </Link>
        </div>
      </section>

      <section className="mt-14 print:hidden">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {NOXH_CHECK_COPY.faqHeading}
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
