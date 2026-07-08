/**
 * Smoke test Magnix inbound ingest API.
 * Usage:
 *   SITE=http://127.0.0.1:3000 MAGNIX_INGEST_SECRET=xxx npm run go-live:smoke-magnix-ingest
 */
const site = (process.env.SITE ?? process.env.NEXT_PUBLIC_SITE_URL ?? "")
  .trim()
  .replace(/\/$/, "");
const secret = (process.env.MAGNIX_INGEST_SECRET ?? "").trim();

if (!site) {
  console.error("Thiếu SITE — ví dụ: SITE=http://127.0.0.1:3000 npm run go-live:smoke-magnix-ingest");
  process.exit(1);
}

if (!secret) {
  console.error("Thiếu MAGNIX_INGEST_SECRET trong env");
  process.exit(1);
}

const nk = `smoke:${Date.now()}`;
const payload = {
  uid: String(Date.now()),
  uid_source: "smoke_test",
  normalized_key: nk,
  captured_at: new Date().toISOString(),
  text: "Smoke test Magnix ingest",
  segment: "noxh_income",
  score: 70,
  status: "classified",
};

const url = `${site}/api/ingest/magnix-lead`;

const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-magnix-ingest-secret": secret,
  },
  body: JSON.stringify(payload),
});

const contentType = res.headers.get("content-type") ?? "";
const body = await res.text();

if (!contentType.includes("application/json")) {
  console.error("FAIL — response không phải JSON (có thể route chưa build hoặc URL sai)");
  console.error(`HTTP ${res.status} ${contentType}`);
  console.error(body.slice(0, 400));
  process.exit(1);
}

let json: { data?: { normalized_key?: string }; error?: { code?: string; message?: string } };
try {
  json = JSON.parse(body) as typeof json;
} catch {
  console.error("FAIL — JSON parse error");
  console.error(body.slice(0, 400));
  process.exit(1);
}

if (!res.ok) {
  console.error(`FAIL — HTTP ${res.status}`, json.error?.code, json.error?.message);
  process.exit(1);
}

if (json.data?.normalized_key !== nk) {
  console.error("FAIL — normalized_key mismatch", json);
  process.exit(1);
}

console.log(`OK — ingest ${nk} → id ${json.data?.normalized_key}`);
