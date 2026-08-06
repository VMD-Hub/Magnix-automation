import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["@"] = __dirname;
    return config;
  },
  async rewrites() {
    return [
      // Canonical mới → filesystem app/ cũ (chưa migrate folder)
      {
        source: "/wiki-nha-o-xa-hoi",
        destination: "/tin-tuc/cam-nang-noxh",
      },
      {
        source: "/wiki-nha-o-xa-hoi/:path*",
        destination: "/tin-tuc/cam-nang-noxh/:path*",
      },
      {
        source: "/vay-mua-nha",
        destination: "/tai-chinh",
      },
      {
        source: "/vay-mua-nha/:path*",
        destination: "/tai-chinh/:path*",
      },
      {
        source: "/thiet-ke-thi-cong-noi-that",
        destination: "/noi-that",
      },
      {
        source: "/thiet-ke-thi-cong-noi-that/:path*",
        destination: "/noi-that/:path*",
      },
      {
        source: "/tinh-tra-gop",
        destination: "/cong-cu/tinh-khoan-vay",
      },
    ];
  },
  async redirects() {
    return [
      // Case DTI: personal-brand URL → Wiki NOXH (Super Admin SoR)
      {
        source: "/vu-nguyen/case/cai-bay-dti",
        destination: "/wiki-nha-o-xa-hoi/cai-bay-dti",
        permanent: true,
      },
      // A3 slug: timeline (EN) → tien-trinh-giao-dich
      {
        source:
          "/wiki-nha-o-xa-hoi/chi-phi-an-khi-mua-nha-lan-dau-va-timeline-tu-ky-den-so-huu",
        destination:
          "/wiki-nha-o-xa-hoi/chi-phi-an-khi-mua-nha-lan-dau-va-tien-trinh-giao-dich",
        permanent: true,
      },
      {
        source:
          "/tin-tuc/cam-nang-noxh/chi-phi-an-khi-mua-nha-lan-dau-va-timeline-tu-ky-den-so-huu",
        destination:
          "/wiki-nha-o-xa-hoi/chi-phi-an-khi-mua-nha-lan-dau-va-tien-trinh-giao-dich",
        permanent: true,
      },
      // --- Interior legacy flat → canonical mới ---
      {
        source: "/noi-that/phong-cach-hien-dai",
        destination: "/thiet-ke-thi-cong-noi-that/phong-cach/hien-dai",
        permanent: true,
      },
      {
        source: "/noi-that/phong-cach-scandinavian",
        destination: "/thiet-ke-thi-cong-noi-that/phong-cach/scandinavian",
        permanent: true,
      },
      {
        source: "/noi-that/phong-cach-indochine",
        destination: "/thiet-ke-thi-cong-noi-that/phong-cach/indochine",
        permanent: true,
      },
      {
        source: "/noi-that/phong-cach-toi-gian",
        destination: "/thiet-ke-thi-cong-noi-that/phong-cach/toi-gian",
        permanent: true,
      },
      {
        source: "/noi-that/can-ho-dep-y-tuong",
        destination: "/thiet-ke-thi-cong-noi-that/nha-dep",
        permanent: true,
      },
      {
        source: "/noi-that/thiet-ke-noi-that",
        destination: "/thiet-ke-thi-cong-noi-that/phong-cach/hien-dai",
        permanent: true,
      },
      {
        source: "/noi-that/thi-cong-noi-that",
        destination: "/thiet-ke-thi-cong-noi-that/nha-dep",
        permanent: true,
      },
      {
        source: "/cong-cu/kha-nang-vay",
        destination: "/cong-cu/tinh-han-muc-vay",
        permanent: true,
      },
      {
        source: "/tin-tuc/chu-de/phong-thuy",
        destination: "/phong-thuy",
        permanent: true,
      },
      {
        source: "/tin-tuc/chu-de/phong-thuy/:path*",
        destination: "/phong-thuy",
        permanent: true,
      },
      // Wiki topic aliases (cũ + filesystem path) → canonical wiki
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/phong-thuy",
        destination: "/phong-thuy",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/phong-thuy/:path*",
        destination: "/phong-thuy",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/phong-thuy",
        destination: "/phong-thuy",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/phong-thuy/:path*",
        destination: "/phong-thuy",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/noxh",
        destination: "/wiki-nha-o-xa-hoi",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/goc-chuyen-gia",
        destination: "/wiki-nha-o-xa-hoi",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/phap-ly",
        destination: "/wiki-nha-o-xa-hoi/chu-de/chinh-sach-ho-so-noxh",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/tien-do-du-an",
        destination: "/wiki-nha-o-xa-hoi/chu-de/du-an-gia-tien-do-noxh",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/dau-tu",
        destination: "/wiki-nha-o-xa-hoi/chu-de/du-an-gia-tien-do-noxh",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/ha-tang-giao-thong",
        destination: "/tin-tuc/kien-thuc/chu-de/ha-tang-ket-noi-vung",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/do-thi-ve-tinh-tod",
        destination: "/tin-tuc/kien-thuc/chu-de/hanh-lang-san-bay-long-thanh",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/nha-o-xa-hoi-ly-thuong-kiet",
        destination: "/wiki-nha-o-xa-hoi",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/dta-happy-home-nhon-trach",
        destination: "/tin-tuc/kien-thuc/chu-de/hanh-lang-kinh-te-bien-phia-dong",
        permanent: true,
      },
      // Dual silo: topic Kiến thức BĐS còn dính URL wiki → 308 cứng (trước rewrite)
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/nha-o-cho-thue-dai-han",
        destination: "/tin-tuc/kien-thuc/chu-de/nha-o-cho-thue-dai-han",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/ha-tang-ket-noi-vung",
        destination: "/tin-tuc/kien-thuc/chu-de/ha-tang-ket-noi-vung",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/hanh-lang-bac-nam-song-sai-gon",
        destination: "/tin-tuc/kien-thuc/chu-de/hanh-lang-bac-nam-song-sai-gon",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/hanh-lang-dong-tay-vvk-mct",
        destination: "/tin-tuc/kien-thuc/chu-de/hanh-lang-dong-tay-vvk-mct",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/hanh-lang-kinh-te-bien-phia-dong",
        destination: "/tin-tuc/kien-thuc/chu-de/hanh-lang-kinh-te-bien-phia-dong",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/hanh-lang-vanh-dai-3-4",
        destination: "/tin-tuc/kien-thuc/chu-de/hanh-lang-vanh-dai-3-4",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/hanh-lang-san-bay-long-thanh",
        destination: "/tin-tuc/kien-thuc/chu-de/hanh-lang-san-bay-long-thanh",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/truc-quoc-lo-13-dong-bac",
        destination: "/tin-tuc/kien-thuc/chu-de/truc-quoc-lo-13-dong-bac",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/truc-dong-dong-nam-vung-thu-do",
        destination: "/tin-tuc/kien-thuc/chu-de/truc-dong-dong-nam-vung-thu-do",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/truc-san-bay-noi-bai-bac-song-hong",
        destination: "/tin-tuc/kien-thuc/chu-de/truc-san-bay-noi-bai-bac-song-hong",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/truc-vanh-dai-4-vung-thu-do",
        destination: "/tin-tuc/kien-thuc/chu-de/truc-vanh-dai-4-vung-thu-do",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/truc-dai-lo-thang-long-hoa-lac",
        destination: "/tin-tuc/kien-thuc/chu-de/truc-dai-lo-thang-long-hoa-lac",
        permanent: true,
      },
      {
        source: "/wiki-nha-o-xa-hoi/chu-de/truc-tay-nam-ha-nam-ninh-binh",
        destination: "/tin-tuc/kien-thuc/chu-de/truc-tay-nam-ha-nam-ninh-binh",
        permanent: true,
      },
      {
        source: "/du-an",
        has: [{ type: "query", key: "projectType", value: "NHA_O_XA_HOI" }],
        destination: "/du-an/nha-o-xa-hoi",
        permanent: true,
      },
      {
        source: "/du-an",
        has: [{ type: "query", key: "projectType", value: "THUONG_MAI" }],
        destination: "/du-an/thuong-mai",
        permanent: true,
      },
      // Ahrefs legacy 404 → live IA
      {
        source: "/phap-ly/dieu-kien-noxh-tong-quan",
        destination:
          "/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
        permanent: true,
      },
      {
        source: "/phap-ly/thu-tuc-ho-so-co-ban",
        destination: "/wiki-nha-o-xa-hoi/quy-trinh-mua-thue-mua-noxh-2026",
        permanent: true,
      },
      {
        source: "/phap-ly",
        destination: "/wiki-nha-o-xa-hoi/chu-de/chinh-sach-ho-so-noxh",
        permanent: true,
      },
      {
        source: "/bang-tinh",
        destination: "/cong-cu",
        permanent: true,
      },
      {
        source: "/timnhatro/dang-ky",
        destination: "/dang-ky",
        permanent: true,
      },
      {
        source: "/timnhatro/dang-nhap",
        destination: "/dang-nhap",
        permanent: true,
      },
      {
        source: "/timnhatro",
        destination: "/",
        permanent: true,
      },
      {
        source: "/mien-tru-trach-nhiem",
        destination: "/dieu-khoan",
        permanent: true,
      },
      // Slug dịch vụ đổi: vay-mua-nha → can-ho (tránh đụng hub /vay-mua-nha)
      {
        source: "/tai-chinh/vay-mua-nha",
        destination: "/vay-mua-nha/can-ho",
        permanent: true,
      },
      {
        source: "/vay-mua-nha/vay-mua-nha",
        destination: "/vay-mua-nha/can-ho",
        permanent: true,
      },
      // Unify: URL cũ → canonical mới
      {
        source: "/cam-nang-noxh",
        destination: "/wiki-nha-o-xa-hoi",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh",
        destination: "/wiki-nha-o-xa-hoi",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/:path*",
        destination: "/wiki-nha-o-xa-hoi/:path*",
        permanent: true,
      },
      {
        source: "/tai-chinh",
        destination: "/vay-mua-nha",
        permanent: true,
      },
      {
        source: "/tai-chinh/:path*",
        destination: "/vay-mua-nha/:path*",
        permanent: true,
      },
      {
        source: "/noi-that",
        destination: "/thiet-ke-thi-cong-noi-that",
        permanent: true,
      },
      {
        source: "/noi-that/:path*",
        destination: "/thiet-ke-thi-cong-noi-that/:path*",
        permanent: true,
      },
      {
        source: "/cong-cu/tinh-khoan-vay",
        destination: "/tinh-tra-gop",
        permanent: true,
      },
      // Hub redirects
      {
        source: "/chuyen-gia",
        destination: "/doi-ngu",
        permanent: true,
      },
      {
        source: "/cong-cu/dinh-gia",
        destination: "/dinh-gia",
        permanent: true,
      },
      {
        source: "/tin-tuc/:slug((?!cam-nang-noxh|kien-thuc|chu-de)[^/]+)",
        destination: "/wiki-nha-o-xa-hoi/:slug",
        permanent: true,
      },
      {
        source: "/tin-tuc/chu-de/:tag",
        destination: "/wiki-nha-o-xa-hoi/chu-de/:tag",
        permanent: true,
      },
      {
        source: "/dang-tin",
        destination: "/moi-gioi/dang-tin",
        permanent: true,
      },
      {
        source: "/chu-de/:tag",
        destination: "/wiki-nha-o-xa-hoi/chu-de/:tag",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
