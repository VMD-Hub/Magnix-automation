// n8n Code: attach legal_retrieval_pack before Layer B LLM (Legal Gate)

const row = $('Loop Brief Candidates').item?.json || $input.first().json;
const segment = String(row.segment || '').trim().toLowerCase();
const text = String(row.text || '');

if (!segmentRequiresLegalKb(segment)) {
  return [{
    json: {
      ...row,
      legal_gate: { required: false, pass: true },
      legal_retrieval_pack: null,
    },
  }];
}

let pack = resolvePackFromBundle(segment, text);
const gate = assessLegalGate(segment, pack);

if (!pack && !gate.pass) {
  pack = buildMinimalBlockedPack(segment, gate.block_reason);
}

return [{
  json: {
    ...row,
    legal_retrieval_pack: pack,
    legal_gate: gate,
    legal_topic: segmentToLegalTopic(segment),
  },
}];
