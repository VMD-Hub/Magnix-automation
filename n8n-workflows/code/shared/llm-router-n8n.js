/** Magnix LLM router — DeepSeek ưu tiên cho task structured/L0–L1; Anthropic cho draft pháp lý L2 */

const MAGNIX_LLM_DEFAULTS = __LLM_TASK_PROVIDERS_JSON__;

function hasLlmKey(raw) {
  return String(raw || '').trim().length > 12;
}

function envProvider(taskId) {
  const key = `MAGNIX_LLM_${String(taskId || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')}_PROVIDER`;
  const v = String($env[key] || '').trim().toLowerCase();
  if (v === 'deepseek' || v === 'anthropic') return v;
  return null;
}

function resolveProvider(taskId) {
  return envProvider(taskId) || MAGNIX_LLM_DEFAULTS[taskId] || 'deepseek';
}

function hasProvider(provider) {
  if (provider === 'anthropic') return hasLlmKey($env.ANTHROPIC_API_KEY);
  return hasLlmKey($env.DEEPSEEK_API_KEY);
}

function anthropicModelForTask(taskId) {
  if (taskId === 'classify') {
    return $env.ANTHROPIC_CLASSIFY_MODEL || 'claude-haiku-4-5-20251001';
  }
  if (taskId === 'video_draft') {
    return $env.ANTHROPIC_VIDEO_MODEL || $env.ANTHROPIC_DRAFT_MODEL || 'claude-sonnet-4-6';
  }
  return $env.ANTHROPIC_DRAFT_MODEL || $env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
}

async function callDeepSeekLlm(ctx, opts) {
  const {
    system,
    userPayload,
    temperature = 0.35,
    maxTokens = 4096,
    jsonMode = true,
  } = opts;
  return ctx.helpers.httpRequest({
    method: 'POST',
    url: $env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions',
    headers: {
      Authorization: `Bearer ${$env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: {
      model: $env.DEEPSEEK_MODEL || 'deepseek-chat',
      temperature,
      max_tokens: maxTokens,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userPayload },
      ],
    },
    json: true,
  });
}

async function callAnthropicLlm(ctx, opts) {
  const {
    system,
    userPayload,
    temperature = 0.35,
    maxTokens = 4096,
    taskId = 'content_draft',
  } = opts;
  return ctx.helpers.httpRequest({
    method: 'POST',
    url: 'https://api.anthropic.com/v1/messages',
    headers: {
      'x-api-key': $env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: {
      model: anthropicModelForTask(taskId),
      max_tokens: maxTokens,
      temperature,
      system,
      messages: [{ role: 'user', content: userPayload }],
    },
    json: true,
  });
}

async function invokeMagnixLlm(ctx, taskId, opts) {
  const primary = resolveProvider(taskId);
  const fallback = primary === 'deepseek' ? 'anthropic' : 'deepseek';
  const errors = [];

  for (const provider of [primary, fallback]) {
    if (!hasProvider(provider)) continue;
    try {
      if (provider === 'deepseek') {
        return await callDeepSeekLlm(ctx, opts);
      }
      return await callAnthropicLlm(ctx, { ...opts, taskId });
    } catch (e) {
      errors.push(`${provider}: ${e.message}`);
    }
  }

  if (!hasProvider('deepseek') && !hasProvider('anthropic')) {
    throw new Error('Thiếu DEEPSEEK_API_KEY hoặc ANTHROPIC_API_KEY trên n8n env');
  }
  throw new Error(errors.join(' | ') || 'LLM providers failed');
}
