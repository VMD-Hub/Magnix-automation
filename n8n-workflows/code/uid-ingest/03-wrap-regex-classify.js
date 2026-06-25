// n8n Code node: Wrap Regex Classify (branch when needs_llm === false)

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
