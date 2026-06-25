// n8n Code: Wrap regex classify → ok payload cho merge

const j = $input.first().json;
return [{
  json: {
    ok: true,
    classify: {
      segment: j.segment,
      score: j.score,
      interest_key: j.interest_key || j.segment,
    },
    classify_method: 'regex',
  },
}];
