// Shared: chuẩn hóa text trước ElevenLabs TTS tiếng Việt (Agent 7)

function normalizeVietnameseTtsText(raw) {
  return String(raw || '')
    .replace(/\bNOXH\b/gi, 'nhà ở xã hội')
    .replace(/\bCHECKLIST\b/gi, 'cheklist')
    .replace(/\bSĐT\b/gi, 'số điện thoại')
    .replace(/\bBĐS\b/gi, 'bất động sản')
    .replace(/\bDTI\b/gi, 'tỷ lệ trả nợ trên thu nhập')
    .replace(/\bSME\b/gi, 'doanh nghiệp vừa và nhỏ')
    .replace(/\bCTA\b/gi, 'lời kêu gọi hành động')
    .replace(/\bL3\b/gi, 'duyệt thủ công')
    .replace(/\bZalo\b/gi, 'Da-lo')
    .replace(/[—–]/g, ', ')
    .replace(/\s*→\s*/g, ', ')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function estimateMp3DurationSec(bytes) {
  const n = Number(bytes) || 0;
  if (n < 200) return 0;
  // mp3_44100_128 ≈ 16 KB/s
  return Math.max(0.3, (n - 256) / 16000);
}

/* eslint-disable no-unused-vars -- stripped when inlined to n8n */
if (typeof globalThis !== 'undefined') {
  globalThis.normalizeVietnameseTtsText = normalizeVietnameseTtsText;
  globalThis.estimateMp3DurationSec = estimateMp3DurationSec;
}
