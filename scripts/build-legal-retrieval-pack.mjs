#!/usr/bin/env node
/**
 * CLI smoke test: legal retrieval pack
 * Usage: node scripts/build-legal-retrieval-pack.mjs [--topic noxh_income] [--province tp_ho_chi_minh] [--query "..."]
 */
import { buildLegalRetrievalPack, buildPackFromQuery, detectProvinceCode } from './lib/legal-retrieval-pack.mjs';

const args = process.argv.slice(2);
function getArg(name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
}

const query = getArg('query');
const topic = getArg('topic');
const province = getArg('province');
const asOf = getArg('as-of') || '2026-06-26';

let pack;
if (query) {
  pack = buildPackFromQuery(query, { as_of: asOf, topic, province_code: province });
  console.log('detected_province:', detectProvinceCode(query));
} else {
  pack = buildLegalRetrievalPack({
    topic: topic || 'noxh_income',
    province_code: province,
    as_of: asOf,
  });
}

console.log(JSON.stringify(pack, null, 2));
