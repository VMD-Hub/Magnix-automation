// n8n Code: LLM HouseX website article PR

const intake = $input.first().json;
if (!intake.ok) return [{ json: intake }];

const system = `__HOUSEX_ARTICLE_SYSTEM__`;

const userPayload = JSON.stringify({
  topic: intake.topic,
  angle: intake.angle,
  project_slug: intake.project_slug,
  closing_variant: intake.closing_variant,
  segment: intake.segment,
  factsheet: intake.factsheet,
  source_refs: intake.source_refs,
  legal_retrieval_pack: intake.legal_retrieval_pack,
  editorial_brief_v1: intake.editorial_brief_v1,
});

try {
  const llm = await invokeMagnixLlm(this, 'housex_article', {
    system,
    userPayload,
    temperature: 0.4,
    maxTokens: 8192,
    jsonMode: true,
    taskId: 'housex_article',
  });
  return [{
    json: {
      ...intake,
      llm_provider: resolveProvider('housex_article'),
      llm_raw: llm,
    },
  }];
} catch (e) {
  return [{
    json: {
      ...intake,
      error: true,
      llm_error: String(e.message || e).slice(0, 500),
    },
  }];
}
