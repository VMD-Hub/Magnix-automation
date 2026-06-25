// n8n Code: kiểm tra env trước render v2 (Agent 7)

const data = $getWorkflowStaticData('global');
if (!data.a7_stats) data.a7_stats = {};

const blockEnv = String($env.N8N_BLOCK_ENV_ACCESS_IN_NODE ?? '');
const pexels = $env.PEXELS_API_KEY || '';

data.a7_env = {
  render_engine: 'creatomate_renderscript_v2',
  has_pexels_key: pexels.length > 8,
  has_tts_url: String($env.MAGNIX_VIDEO_TTS_URL || '').length > 8,
  has_webhook_token: String($env.MAGNIX_WEBHOOK_TOKEN || '').length > 8,
  block_env_access: blockEnv,
  env_blocked: blockEnv === 'true',
  auth_note: 'Creatomate API key qua Header Auth credential trên HTTP POST',
};

if (!data.a7_env.has_tts_url || !data.a7_env.has_webhook_token) {
  data.a7_stats.last_warning = 'Thiếu MAGNIX_VIDEO_TTS_URL hoặc MAGNIX_WEBHOOK_TOKEN — fallback Creatomate voice';
}

return $input.all();
