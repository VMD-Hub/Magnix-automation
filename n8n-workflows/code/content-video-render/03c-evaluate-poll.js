// n8n Code: đánh giá status sau HTTP GET Creatomate (Agent 7) — không gọi API
// Không self-ref $('Evaluate Poll Status') — gây Invalid expression trên n8n loop.

const create = $('Parse Creatomate Create').item?.json || {};
const getRes = $input.first().json || {};
const first = Array.isArray(getRes) ? getRes[0] : getRes;

const data = $getWorkflowStaticData('global');
if (!data.a7_poll) data.a7_poll = {};

const renderId = create.render_id || first?.id || first?.render_id || 'unknown';
const prevAttempt = Number(data.a7_poll[renderId] || create.poll_attempt || 0);
const attempt = prevAttempt + 1;
data.a7_poll[renderId] = attempt;

const maxAttempts = Number(create.poll_max || 24);

const renderStatus = first?.status || create.render_status || 'rendering';
const outputFormat = String(first?.output_format || 'mp4').toLowerCase();
let renderUrl = first?.url || first?.download_url || create.render_url_early || null;

function isMp4Url(url) {
  return Boolean(url) && String(url).toLowerCase().includes('.mp4');
}

const renderDone = renderStatus === 'succeeded'
  && outputFormat === 'mp4'
  && isMp4Url(renderUrl);

if (renderDone) {
  delete data.a7_poll[renderId];
  return [{
    json: {
      ok: true,
      render_ok: true,
      done_polling: true,
      render_id: renderId,
      render_url: renderUrl,
      render_status: 'ready_for_review',
      sheet_row: create.sheet_row,
      source_normalized_key: create.source_normalized_key,
      title: create.title,
      platform: create.platform,
      background_url: create.background_url,
      existing_meta: create.existing_meta || {},
      beats_count: create.beats_count,
      render_engine: create.render_engine,
      tts_provider: create.tts?.provider || null,
      poll_attempt: attempt,
    },
  }];
}

if (renderStatus === 'failed') {
  delete data.a7_poll[renderId];
  return [{
    json: {
      ok: false,
      render_ok: false,
      done_polling: true,
      error: 'CREATOMATE_RENDER_FAILED',
      render_id: renderId,
      render_status: renderStatus,
      failure: first?.error_message || first?.error || null,
      sheet_row: create.sheet_row,
      source_normalized_key: create.source_normalized_key,
      poll_attempt: attempt,
    },
  }];
}

if (attempt >= maxAttempts) {
  delete data.a7_poll[renderId];
  return [{
    json: {
      ok: false,
      render_ok: false,
      done_polling: true,
      error: 'CREATOMATE_POLL_TIMEOUT',
      render_id: renderId,
      render_status: renderStatus,
      sheet_row: create.sheet_row,
      poll_attempt: attempt,
    },
  }];
}

return [{
  json: {
    ok: true,
    render_ok: false,
    done_polling: false,
    render_id: renderId,
    render_status: renderStatus,
    render_url_early: renderUrl,
    sheet_row: create.sheet_row,
    source_normalized_key: create.source_normalized_key,
    title: create.title,
    platform: create.platform,
    background_url: create.background_url,
    existing_meta: create.existing_meta || {},
    poll_attempt: attempt,
  },
}];
