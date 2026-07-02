// n8n Code: Gemini Image API → PNG base64

const item = $input.first().json;
if (!item.ok || !item.cover_prompt) {
  return [{ json: { ...item, generate_ok: false, generate_error: 'NO_PROMPT' } }];
}

const apiKey = String(
  $env.GEMINI_API_KEY
  || $env.GOOGLE_GEMINI_API_KEY
  || $env.GOOGLE_AI_API_KEY
  || $env.GENERATIVE_LANGUAGE_API_KEY
  || ''
).trim();
const model = String(
  $env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'
).trim();

if (!apiKey) {
  return [{
    json: {
      ...item,
      generate_ok: false,
      generate_error: 'MISSING_GEMINI_API_KEY',
    },
  }];
}

const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

const body = {
  contents: [{ role: 'user', parts: [{ text: item.cover_prompt }] }],
  generationConfig: {
    responseModalities: ['IMAGE'],
    imageConfig: {
      aspectRatio: item.aspect_ratio || '1:1',
    },
  },
};

try {
  const res = await this.helpers.httpRequest({
    method: 'POST',
    url,
    headers: { 'Content-Type': 'application/json' },
    body,
    json: true,
    timeout: 120000,
  });

  const parts = res?.candidates?.[0]?.content?.parts || [];
  let inline = null;
  for (const p of parts) {
    if (p.inlineData?.data) {
      inline = p.inlineData;
      break;
    }
  }

  if (!inline?.data) {
    const block = res?.promptFeedback?.blockReason || res?.candidates?.[0]?.finishReason;
    return [{
      json: {
        ...item,
        generate_ok: false,
        generate_error: block ? `BLOCKED:${block}` : 'NO_IMAGE_IN_RESPONSE',
        gemini_model: model,
      },
    }];
  }

  const mime = String(inline.mimeType || 'image/png').trim();
  const ext = mime.includes('jpeg') ? 'jpg' : 'png';

  return [{
    json: {
      ...item,
      generate_ok: true,
      image_base64: inline.data,
      image_mime: mime,
      image_ext: ext,
      gemini_model: model,
    },
  }];
} catch (e) {
  const detail = e.response?.data || e.cause?.response?.data || e.message;
  const msg = detail?.error?.message || (typeof detail === 'string' ? detail : JSON.stringify(detail).slice(0, 400));
  return [{
    json: {
      ...item,
      generate_ok: false,
      generate_error: msg || 'GEMINI_REQUEST_FAILED',
      gemini_model: model,
    },
  }];
}
