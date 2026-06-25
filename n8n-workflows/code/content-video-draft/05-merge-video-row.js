// n8n Code: merge video_drafts row + mark content_queue (Agent 6)

const source = $('Loop Video Candidates').item?.json || {};
const item = $input.first().json;

if (!item.ok || !item.video) {
  return [{ json: { ok: false, error: 'MERGE_SKIP', sheet_row: source.sheet_row } }];
}

const v = item.video;
const beatsJson = JSON.stringify(v.beats).slice(0, 45000);
const onScreen = (v.on_screen_text || []).join(' | ');
const hashtags = (v.hashtags || []).join(', ');

const meta = JSON.stringify({
  production_brief_version: v.production_brief_version || 1,
  render_engine: v.render_engine || 'creatomate_renderscript_v2',
  pattern_applied: v.pattern_applied || [],
  source_refs: v.source_refs,
  beats_count: (v.beats || []).length,
  l0_hits: item.l0_hits || [],
  agent: 'agent-6',
  layer: 'C',
  source_post_url: source.post_url,
  listen_score: Number(source.score || 0),
  created_at: new Date().toISOString(),
}).slice(0, 50000);

return [{
  json: {
    ok: true,
    source_normalized_key: source.normalized_key,
    queue_sheet_row: source.sheet_row,
    append_row: [
      String(source.normalized_key || ''),
      String(source.post_id || ''),
      v.platform,
      String(v.segment || source.segment || ''),
      v.title,
      v.hook_3s,
      v.spoken_script,
      beatsJson,
      onScreen,
      v.caption,
      hashtags,
      v.cta_keyword,
      String(v.duration_sec),
      v.aspect_ratio,
      v.source_insight,
      v.disclaimer,
      'draft',
      'L0',
      'false',
      new Date().toISOString(),
      'agent6_short_video',
      meta,
    ],
    queue_meta_patch: {
      video_draft_created: true,
      video_draft_status: 'draft',
      video_draft_title: v.title,
      video_draft_platform: v.platform,
      video_draft_at: new Date().toISOString(),
    },
  },
}];
