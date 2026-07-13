import QRCode from "qrcode";
import {
  resolveVuNguyenQrUrl,
  type VuNguyenQrTarget,
} from "@/lib/personal-brand/vu-nguyen/channel-links";

const VALID_TARGETS = new Set<VuNguyenQrTarget>([
  "profile",
  "profile-nfc",
  "web",
  "miniapp",
]);

const BRAND_RUBY = "#3d070c";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = searchParams.get("target") ?? "profile";
    const target: VuNguyenQrTarget = VALID_TARGETS.has(raw as VuNguyenQrTarget)
      ? (raw as VuNguyenQrTarget)
      : "profile";

    const url = resolveVuNguyenQrUrl(target);
    const png = await QRCode.toBuffer(url, {
      type: "png",
      margin: 2,
      width: 512,
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
