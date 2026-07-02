import type { Metadata } from "next";
import Link from "next/link";
import {
  BRAND_TAGLINE_FOOTER,
  SEO_DESCRIPTION_DEFAULT,
} from "@/lib/content/messaging/brand";
import {
  RADA_ABOUT_BULLETS,
  RADA_ABOUT_LEAD,
  RADA_PROGRAM_NAME,
  RADA_TAGLINE,
} from "@/lib/content/messaging/rada";
import { getBrandName } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: SEO_DESCRIPTION_DEFAULT,
};

export default function GioiThieuPage() {
  const brand = getBrandName();

  return (
    <StaticPage title={`Giới thiệu ${brand}`}>
      <p>
        {brand} là sàn bất động sản với cam kết{" "}
        <strong>Thông tin chuẩn · Sản phẩm thật</strong> — kiểm duyệt tin đăng,
        xác minh theo quy trình và xử lý báo cáo sai lệch cho người mua lẫn môi
        giới.
      </p>

      <h2>Chúng tôi làm gì?</h2>
      <ul>
        <li>Kiểm duyệt chất lượng tin đăng (ảnh, mô tả, vị trí, giá niêm yết).</li>
        <li>Chống tin trùng và gom tin cùng một bất động sản.</li>
        <li>Bảo vệ số điện thoại môi giới — chỉ khách đã xác nhận email mới xem được.</li>
        <li>Tiếp nhận báo cáo tin sai — cơ chế xử lý và phạt minh bạch.</li>
        <li>Công cụ tài chính hỗ trợ quyết định mua nhà (tính vay, định giá).</li>
      </ul>

      <h2>{RADA_PROGRAM_NAME}</h2>
      <p className="text-sm font-medium text-slate-600">{RADA_TAGLINE}</p>
      <p>{RADA_ABOUT_LEAD}</p>
      <ul>
        {RADA_ABOUT_BULLETS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p className="text-sm text-slate-600">{BRAND_TAGLINE_FOOTER}</p>

      <p>
        Bạn là môi giới?{" "}
        <Link href="/dang-ky/moi-gioi" className="font-semibold text-brand-700 underline">
          Đăng ký đăng tin
        </Link>
        . Muốn tham gia chương trình cộng tác viên? Xem{" "}
        <Link href="/moi-gioi/dang-ky-ctv" className="font-semibold text-brand-700 underline">
          đăng ký CTV
        </Link>
        .
      </p>
    </StaticPage>
  );
}

function StaticPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-2xl py-10 container-px prose prose-slate prose-headings:font-bold prose-a:text-brand-700">
      <h1>{title}</h1>
      {children}
    </article>
  );
}

export { StaticPage };
