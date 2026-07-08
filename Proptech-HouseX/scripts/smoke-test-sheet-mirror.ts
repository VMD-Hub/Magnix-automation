/**
 * Smoke test cron sheet mirror.
 * Usage:
 *   SITE=https://timnhaxahoi.com npm run go-live:smoke-sheet-mirror
 */
async function main() {
  const site = (process.env.SITE ?? process.env.NEXT_PUBLIC_SITE_URL ?? "")
    .trim()
    .replace(/\/$/, "");
  const secret = process.env.CRON_SECRET?.trim() ?? "";

  if (!site) {
    console.error("Thiếu SITE — ví dụ: SITE=https://timnhaxahoi.com");
    process.exit(1);
  }
  if (!secret) {
    console.error("Thiếu CRON_SECRET trong env");
    process.exit(1);
  }

  const url = `${site}/api/cron/sheet-mirror`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}` },
  });

  const body = await res.text();
  let json: {
    data?: {
      skipped?: boolean;
      reason?: string;
      tab?: string;
      inboundRows?: number;
      noxhRows?: number;
      totalRows?: number;
    };
    error?: { code?: string; message?: string };
  };

  try {
    json = JSON.parse(body) as typeof json;
  } catch {
    console.error("FAIL — response không phải JSON");
    console.error(body.slice(0, 400));
    process.exit(1);
  }

  if (!res.ok) {
    console.error(
      `FAIL — HTTP ${res.status}`,
      json.error?.code,
      json.error?.message,
    );
    process.exit(1);
  }

  const data = json.data;
  if (data?.skipped) {
    console.log(`SKIP — ${data.reason ?? "mirror disabled"}`);
    console.log(
      "Bật MAGNIX_SHEET_MIRROR_ENABLED=true + GOOGLE_SHEET_MIRROR_ID rồi chạy lại.",
    );
    process.exit(2);
  }

  console.log(
    `OK — tab=${data?.tab} inbound=${data?.inboundRows} noxh=${data?.noxhRows} rows=${data?.totalRows}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
