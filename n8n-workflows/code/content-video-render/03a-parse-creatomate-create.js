// n8n Code: parse response POST Creatomate (Agent 7)

const prev = $('Build Creatomate Payload').item?.json || {};
const res = $input.first().json || {};

if (res?.error || res?.message?.includes?.('Authorization')) {
  return [{
    json: {
      ok: false,
      render_ok: false,
      done_polling: true,
      error: 'CREATOMATE_POST_FAILED',
      detail: String(res.error?.message || res.message || res.error || '').slice(0, 300),
      sheet_row: prev.sheet_row,
      source_normalized_key: prev.source_normalized_key,
    },
  }];
}

const first = Array.isArray(res) ? res[0] : res;
const renderId = first?.id || first?.render_id || null;
const renderStatus = first?.status || 'planned';
const renderUrl = first?.url || first?.download_url || null;

if (!renderId) {
  return [{
    json: {
      ok: false,
      render_ok: false,
      done_polling: true,
      error: 'CREATOMATE_NO_RENDER_ID',
      raw: res,
      sheet_row: prev.sheet_row,
      source_normalized_key: prev.source_normalized_key,
    },
  }];
}

return [{
  json: {
    ok: true,
    render_id: renderId,
    render_status: renderStatus,
    render_url_early: renderUrl,
    sheet_row: prev.sheet_row,
    source_normalized_key: prev.source_normalized_key,
    title: prev.title,
    platform: prev.platform,
    background_url: prev.background_url,
    existing_meta: prev.existing_meta || {},
    beats_count: prev.beats_count,
    render_engine: prev.render_engine,
    tts: prev.tts,
    poll_attempt: 0,
    poll_max: Number($env.CREATOMATE_POLL_MAX || 24),
    poll_ms: Number($env.CREATOMATE_POLL_MS || 15000),
  },
}];
