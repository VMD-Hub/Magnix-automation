// n8n Code: POST Creatomate render + poll đến succeeded/failed (Agent 7)

const item = $input.first().json;
if (!item.ok || !item.creatomate_payload) {
  return [{ json: { ...item, render_ok: false } }];
}

const apiKey = $env.CREATOMATE_API_KEY;
const baseUrl = $env.CREATOMATE_API_URL || 'https://api.creatomate.com/v2/renders';
const maxAttempts = Number($env.CREATOMATE_POLL_MAX || 24);
const delayMs = Number($env.CREATOMATE_POLL_MS || 15000);

const headers = {
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
};

let renderId = null;
let renderUrl = null;
let renderStatus = 'rendering';

try {
  const created = await this.helpers.httpRequest({
    method: 'POST',
    url: baseUrl,
    headers,
    body: item.creatomate_payload,
    json: true,
  });

  const first = Array.isArray(created) ? created[0] : created;
  renderId = first?.id || first?.render_id || null;
  renderStatus = first?.status || 'planned';

  if (!renderId) {
    return [{
      json: {
        ok: false,
        render_ok: false,
        error: 'CREATOMATE_NO_RENDER_ID',
        raw: created,
        sheet_row: item.sheet_row,
      },
    }];
  }

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const poll = await this.helpers.httpRequest({
      method: 'GET',
      url: `${baseUrl}/${renderId}`,
      headers,
      json: true,
    });

    const r = Array.isArray(poll) ? poll[0] : poll;
    renderStatus = r?.status || renderStatus;

    if (renderStatus === 'succeeded') {
      renderUrl = r?.url || r?.download_url || null;
      break;
    }
    if (renderStatus === 'failed') {
      return [{
        json: {
          ok: false,
          render_ok: false,
          error: 'CREATOMATE_RENDER_FAILED',
          render_id: renderId,
          render_status: renderStatus,
          failure: r?.error_message || r?.error || null,
          sheet_row: item.sheet_row,
          source_normalized_key: item.source_normalized_key,
        },
      }];
    }

    await new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });
  }

  if (renderStatus !== 'succeeded' || !renderUrl) {
    return [{
      json: {
        ok: false,
        render_ok: false,
        error: 'CREATOMATE_POLL_TIMEOUT',
        render_id: renderId,
        render_status: renderStatus,
        sheet_row: item.sheet_row,
      },
    }];
  }

  return [{
    json: {
      ok: true,
      render_ok: true,
      render_id: renderId,
      render_url: renderUrl,
      render_status: 'ready_for_review',
      sheet_row: item.sheet_row,
      source_normalized_key: item.source_normalized_key,
      title: item.title,
      platform: item.platform,
      background_url: item.background_url,
      existing_meta: item.existing_meta || {},
    },
  }];
} catch (e) {
  return [{
    json: {
      ok: false,
      render_ok: false,
      error: 'CREATOMATE_REQUEST_ERROR',
      message: String(e.message || e),
      render_id: renderId,
      sheet_row: item.sheet_row,
    },
  }];
}
