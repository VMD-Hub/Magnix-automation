import type { Metadata } from "next";
import Link from "next/link";
import {
  ABOUT_GOALS,
  ABOUT_INTRO,
  ABOUT_MISSION,
  ABOUT_VALUES,
  ABOUT_VISION,
  TRUST_TECH,
} from "@/lib/content/messaging/about-public";
import {
  BRAND_TAGLINE_FOOTER,
  SEO_DESCRIPTION_DEFAULT,
} from "@/lib/content/messaging/brand";
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
        <strong>{brand}</strong> {ABOUT_INTRO.lead}{" "}
        Cam kết của chúng tôi:{" "}
        <strong>{ABOUT_INTRO.promise}</strong>.
      </p>

      <h2>{ABOUT_VISION.title}</h2>
      <p>{ABOUT_VISION.body}</p>

      <h2>{ABOUT_MISSION.title}</h2>
      <p>{ABOUT_MISSION.body}</p>

      <h2>{ABOUT_GOALS.title}</h2>
      <ul>
        {ABOUT_GOALS.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{ABOUT_VALUES.title}</h2>
      <p>{ABOUT_VALUES.intro}</p>
      <ul>
        {ABOUT_VALUES.items.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong> — {item.desc}
          </li>
        ))}
      </ul>

      <h2>{TRUST_TECH.title}</h2>
      <p className="text-sm font-medium text-slate-600">{TRUST_TECH.tagline}</p>
      <p>{TRUST_TECH.lead}</p>
      <ul>
        {TRUST_TECH.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p className="text-sm text-slate-600">{BRAND_TAGLINE_FOOTER}</p>

      <p>
        Cách House X đối chiếu nguồn và cập nhật nội dung:{" "}
        <Link
          href="/gioi-thieu/phuong-phap-bien-tap"
          className="font-semibold text-brand-700 underline"
        >
          Phương pháp biên tập
        </Link>
        . Chủ đề NOXH do{" "}
        <Link
          href="/chuyen-gia/noxh-policy"
          className="font-semibold text-brand-700 underline"
        >
          Nguyễn Vũ
        </Link>{" "}
        — Biên tập viên / Luật sư / Chuyên gia Nhà Ở Xã Hội — rà soát.
      </p>

      <p>
        Bạn là môi giới hoặc chủ nhà?{" "}
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

