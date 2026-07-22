import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["@"] = __dirname;
    return config;
  },
  async redirects() {
    return [
      {
        source: "/noi-that/phong-cach-hien-dai",
        destination: "/noi-that/phong-cach/hien-dai",
        permanent: true,
      },
      {
        source: "/noi-that/phong-cach-scandinavian",
        destination: "/noi-that/phong-cach/scandinavian",
        permanent: true,
      },
      {
        source: "/noi-that/phong-cach-indochine",
        destination: "/noi-that/phong-cach/indochine",
        permanent: true,
      },
      {
        source: "/noi-that/phong-cach-toi-gian",
        destination: "/noi-that/phong-cach/toi-gian",
        permanent: true,
      },
      {
        source: "/noi-that/can-ho-dep-y-tuong",
        destination: "/noi-that/nha-dep",
        permanent: true,
      },
      {
        source: "/noi-that/thiet-ke-noi-that",
        destination: "/noi-that/phong-cach/hien-dai",
        permanent: true,
      },
      {
        source: "/noi-that/thi-cong-noi-that",
        destination: "/noi-that/nha-dep",
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
        source: "/tin-tuc/cam-nang-noxh/chu-de/noxh",
        destination: "/tin-tuc/cam-nang-noxh",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/goc-chuyen-gia",
        destination: "/tin-tuc/cam-nang-noxh",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/phap-ly",
        destination: "/tin-tuc/cam-nang-noxh/chu-de/chinh-sach-ho-so-noxh",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/tien-do-du-an",
        destination: "/tin-tuc/cam-nang-noxh/chu-de/du-an-gia-tien-do-noxh",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/dau-tu",
        destination: "/tin-tuc/cam-nang-noxh/chu-de/du-an-gia-tien-do-noxh",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/ha-tang-giao-thong",
        destination: "/tin-tuc/cam-nang-noxh/chu-de/ha-tang-ket-noi-vung",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/do-thi-ve-tinh-tod",
        destination: "/tin-tuc/cam-nang-noxh/chu-de/ha-tang-ket-noi-vung",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/nha-o-xa-hoi-ly-thuong-kiet",
        destination: "/tin-tuc/cam-nang-noxh",
        permanent: true,
      },
      {
        source: "/tin-tuc/cam-nang-noxh/chu-de/dta-happy-home-nhon-trach",
        destination: "/tin-tuc/cam-nang-noxh",
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
      // Ahrefs legacy 404 → live IA (P0 go-live web)
      {
        source: "/phap-ly/dieu-kien-noxh-tong-quan",
        destination:
          "/tin-tuc/cam-nang-noxh/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
        permanent: true,
      },
      {
        source: "/phap-ly/thu-tuc-ho-so-co-ban",
        destination: "/tin-tuc/cam-nang-noxh/quy-trinh-mua-thue-mua-noxh-2026",
        permanent: true,
      },
      {
        source: "/phap-ly",
        destination: "/tin-tuc/cam-nang-noxh/chu-de/chinh-sach-ho-so-noxh",
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
    ];
  },
};

export default nextConfig;
