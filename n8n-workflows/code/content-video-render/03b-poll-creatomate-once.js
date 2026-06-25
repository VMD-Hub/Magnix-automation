// n8n Code: poll Creatomate 1 lần + quyết định tiếp tục (Agent 7)

const item = $input.first().json || {};
const renderId = item.render_id;
if (!renderId) {
  return [{ json: { ...item, render_ok: false, error: 'NO_RENDER_ID' } }];
}

const apiKey = $env.CREATOMATE_API_KEY;
if (!apiKey) {
  return [{
    json: {
      ...item,
      render_ok: false,
      error: 'MISSING_CREATOMATE_API_KEY',
      hint: 'Deploy /root/n8n.env + restart n8n container',
    },
  }];
}

const baseUrl = $env.CREATOMATE_API_URL || 'https://api.creatomate.com/v2/renders';
const maxAttempts = item.poll_max || Number($env.CREATOMATE_POLL_MAX || 24);
const delayMs = item.poll_ms || Number($env.CREATOMATE_POLL_MS || 15000);
const attempt = (item.poll_attempt || 0) + 1;

try {
  const poll = await this.helpers.httpRequest({
    method: 'GET',
    url: `${baseUrl}/${renderId}`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    json: true,
  });

  const r = Array.isArray(poll) ? poll[0] : poll;
  const renderStatus = r?.status || item.render_status || 'rendering';
  const renderUrl = r?.url || r?.download_url || item.render_url_early || null;

  if (renderStatus === 'succeeded' && renderUrl) {
    return [{
      json: {
        ok: true,
        render_ok: true,
        done_polling: true,
        render_id: renderId,
        render_url: renderUrl,
        render_status: 'ready_for_review',
        sheet_row: item.sheet_row,
        source_normalized_key: item.source_normalized_key,
        title: item.title,
        platform: item.platform,
        background_url: item.background_url,
        existing_meta: item.existing_meta || {},
        poll_attempt: attempt,
      },
    }];
  }

  if (renderStatus === 'failed') {
    return [{
      json: {
        ok: false,
        render_ok: false,
        done_polling: true,
        error: 'CREATOMATE_RENDER_FAILED',
        render_id: renderId,
        render_status: renderStatus,
        failure: r?.error_message || r?.error || null,
        sheet_row: item.sheet_row,
        source_normalized_key: item.source_normalized_key,
        poll_attempt: attempt,
      },
    }];
  }

  if (attempt >= maxAttempts) {
    return [{
      json: {
        ok: false,
        render_ok: false,
        done_polling: true,
        error: 'CREATOMATE_POLL_TIMEOUT',
        render_id: renderId,
        render_status: renderStatus,
        sheet_row: item.sheet_row,
        poll_attempt: attempt,
      },
    }];
  }

  await new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });

  return [{
    json: {
      ...item,
      render_ok: false,
      done_polling: false,
      render_status: renderStatus,
      render_url_early: renderUrl,
      poll_attempt: attempt,
      poll_max: maxAttempts,
      poll_ms: delayMs,
    },
  }];
} catch (e) {
  return [{
    json: {
      ok: false,
      render_ok: false,
      done_polling: true,
      error: 'CREATOMATE_POLL_ERROR',
      message: String(e.message || e),
      render_id: renderId,
      sheet_row: item.sheet_row,
      poll_attempt: attempt,
    },
  }];
}
