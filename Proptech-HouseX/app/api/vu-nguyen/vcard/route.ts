import { buildVuNguyenVcard } from "@/lib/personal-brand/vu-nguyen/vcard";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inline = searchParams.get("inline") !== "0";

  const body = buildVuNguyenVcard();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `${
        inline ? "inline" : "attachment"
      }; filename="vu-nguyen-housex.vcf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
