#!/usr/bin/env node
/**
 * Smoke test: node scripts/build-noxh-application-counseling.mjs
 * Inference: node scripts/build-noxh-application-counseling.mjs --employment_status dang_hdld --employer_type enterprise_worker --marital_status vo_chong --housing_path chua_co_nha_gcn --project_province_code tp_ho_chi_minh
 */
import { buildApplicationCounselingPack, inferArticle76Clause } from './lib/noxh-application-draft.mjs';

const args = process.argv.slice(2);
const intake = {
  project_province_code: 'dong_nai',
  project_name: 'Dự án NOXH ví dụ',
  registration_type: 'mua',
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

if (!intake.article_76_clause) {
  const inf = inferArticle76Clause(intake);
  console.error('[infer]', JSON.stringify(inf));
}

const pack = buildApplicationCounselingPack(intake);
console.log(JSON.stringify(pack, null, 2));
