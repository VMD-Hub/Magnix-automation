// n8n Code: append channel_state sau mỗi lần quét URL (chỉ 1 lần / batch Apify)

if ($itemIndex > 0) {
  return [];
}

const split = $('Loop Over URLs').item?.json || {};
const wrapItems = $('Wrap Apify Response').all().length
  ? $('Wrap Apify Response').all()
  : $('Wrap FB Response').all();
const wrap = wrapItems[0]?.json || {};

const handle = split.channel_handle || '';
if (!handle) {
  return [{ json: { ok: false, skip_channel_state: true } }];
}

const last_post_id = String(wrap.post_id || '').trim();

return [{
  json: {
    ok: true,
    channel_body: {
      values: [[
        handle,
        new Date().toISOString(),
        last_post_id,
        String(split.platform || ''),
      ]],
    },
    channel_handle: handle,
  },
}];
