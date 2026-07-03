// Lọc lead COLD/OUT trên tab noxh_leads_ops — chưa gửi nurture email.

const BATCH = __NOXH_NURTURE_BATCH_SIZE__;
const MIN_AGE_HOURS = __NOXH_NURTURE_MIN_AGE_HOURS__;
const BASE_URL = String($env.HOUSEX_PUBLIC_URL || 'https://timnhaxahoi.com').replace(/\/$/, '');

function parseMeta(raw) {
  if (!raw) return {};
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

function parseDate(raw) {
  const t = Date.parse(String(raw || ''));
  return Number.isFinite(t) ? t : 0;
}

const res = $input.first().json;
const rows = Array.isArray(res.values) ? res.values : [];
if (rows.length < 2) {
  return [{ json: { empty: true, message: 'noxh_leads_ops trống' } }];
}

const headers = rows[0].map((x) => String(x ?? '').trim().toLowerCase());
const now = Date.now();
const minAgeMs = MIN_AGE_HOURS * 3600000;
const out = [];

for (let i = 1; i < rows.length; i++) {
  const cells = rows[i];
  if (!cells?.some((c) => String(c ?? '').trim())) continue;

  const row = { sheet_row: i + 1 };
  headers.forEach((key, j) => {
    if (key) row[key] = cells[j] ?? '';
  });

  const tier = String(row.tier || '').trim().toUpperCase();
  if (tier !== 'COLD' && tier !== 'OUT') continue;

  const email = String(row.contact_email || '').trim();
  if (!email || !email.includes('@')) continue;

  const meta = parseMeta(row.meta);
  if (meta.nurture_sent_at) continue;

  const createdAt = parseDate(row.created_at);
  if (createdAt && now - createdAt < minAgeMs) continue;

  const opsStatus = String(row.ops_status || '').trim().toLowerCase();
  if (opsStatus && !['nurture', 'new_cold', ''].includes(opsStatus)) continue;

  out.push({
    json: {
      ...row,
      tier,
      contact_email: email,
      contact_name: String(row.contact_name || 'Anh/Chị').trim(),
      reason_codes: String(row.reason_codes || ''),
      base_url: BASE_URL,
      meta_parsed: meta,
    },
  });

  if (out.length >= BATCH) break;
}

if (!out.length) {
  return [{
    json: {
      empty: true,
      message: 'Không có lead COLD/OUT chờ nurture (đã gửi hoặc chưa đủ tuổi)',
    },
  }];
}

return out;
