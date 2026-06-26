#!/usr/bin/env node
/**
 * Build compact legal pack bundle for n8n Code nodes (no filesystem on VPS).
 * Run: node scripts/build-legal-pack-bundle.mjs
 * Output: n8n-workflows/legal-pack-bundle.json
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLegalRetrievalPack, buildPackFromQuery } from './lib/legal-retrieval-pack.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'n8n-workflows', 'legal-pack-bundle.json');

const SEGMENT_TO_TOPIC = {
  noxh_income: 'noxh_income',
  valuation: 'valuation_certificate',
  sme_credit: 'loan_dti',
};

const TOPICS = [
  'noxh_eligibility',
  'noxh_income',
  'noxh_documents',
  'loan_dti',
  'valuation_certificate',
  'noxh_online_submission',
  'noxh_transfer_restrictions',
];

const asOf = '2026-06-26';

const packs_by_topic = {};
for (const topic of TOPICS) {
  packs_by_topic[topic] = buildLegalRetrievalPack({ topic, as_of: asOf, max_facts: 7 });
}

// Province-enriched samples for common segments
const provinceSamples = ['tp_ho_chi_minh', 'dong_nai'];
for (const topic of ['noxh_income', 'local_policy']) {
  for (const province_code of provinceSamples) {
    const key = `${topic}__${province_code}`;
    packs_by_topic[key] = buildLegalRetrievalPack({
      topic: topic === 'local_policy' ? 'local_policy' : topic,
      province_code,
      as_of: asOf,
      max_facts: 7,
    });
  }
}

const packs_by_segment = {};
for (const [segment, topic] of Object.entries(SEGMENT_TO_TOPIC)) {
  packs_by_segment[segment] = packs_by_topic[topic];
}

const bundle = {
  version: 1,
  generated_at: new Date().toISOString(),
  as_of: asOf,
  packs_by_topic,
  packs_by_segment,
  query_resolver_note: 'Use buildPackFromQuery locally; n8n uses segment/topic keys',
};

writeFileSync(OUT, JSON.stringify(bundle));
const kb = (JSON.stringify(bundle).length / 1024).toFixed(1);
console.log(`Written ${OUT} (${kb} KB, ${Object.keys(packs_by_topic).length} topic packs)`);
