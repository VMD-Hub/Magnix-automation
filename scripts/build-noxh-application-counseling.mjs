#!/usr/bin/env node
/**
 * Smoke test: node scripts/build-noxh-application-counseling.mjs
 * Hoặc: node scripts/build-noxh-application-counseling.mjs --province dong_nai --housing co_nha_xa_noi_lam_viec
 */
import { buildApplicationCounselingPack } from './lib/noxh-application-draft.mjs';

const args = process.argv.slice(2);
const intake = {
  project_province_code: 'dong_nai',
  project_name: 'Dự án NOXH ví dụ',
  registration_type: 'mua',
  article_76_clause: 'k5_hdld',
  marital_status: 'vo_chong',
  housing_path: 'co_nha_xa_noi_lam_viec',
  has_other_noxh_registration: false,
  employer_confirmation_available: true,
  distance_workplace_km: 22,
  income_declaration_monthly: 45,
};

for (let i = 0; i < args.length; i += 2) {
  const key = args[i]?.replace(/^--/, '');
  const val = args[i + 1];
  if (!key) continue;
  if (val === 'true') intake[key] = true;
  else if (val === 'false') intake[key] = false;
  else if (val && !Number.isNaN(Number(val))) intake[key] = Number(val);
  else if (val) intake[key] = val;
}

const pack = buildApplicationCounselingPack(intake);
console.log(JSON.stringify(pack, null, 2));
