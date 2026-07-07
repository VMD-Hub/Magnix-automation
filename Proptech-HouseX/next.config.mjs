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
    ];
  },
};

export default nextConfig;
