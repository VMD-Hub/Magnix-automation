import QRCode from "qrcode";
import { getHouseXZaloOaPublicUrl } from "@/lib/site-config";

const BRAND_RUBY = "#3d070c";

/**
 * QR PNG Zalo OA House X — dùng header PDF/print công cụ.
 * GET /api/brand/zalo-oa-qr
 */
export async function GET() {
  try {
    const url = getHouseXZaloOaPublicUrl();
    if (!url) {
      return new Response("Zalo OA URL missing", { status: 404 });
    }

    const png = await QRCode.toBuffer(url, {
      type: "png",
      margin: 1,
      width: 256,
      color: {
        dark: BRAND_RUBY,
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    });

    return new Response(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new Response("QR generation failed", { status: 500 });
  }
}
