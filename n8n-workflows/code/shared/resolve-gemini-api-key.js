// Shared: resolve Gemini API key từ nhiều tên env (inline vào n8n Code nodes lúc build)

function resolveGeminiApiKey(env) {
  const names = [
    'GEMINI_API_KEY',
    'GOOGLE_GEMINI_API_KEY',
    'GOOGLE_AI_API_KEY',
    'GENERATIVE_LANGUAGE_API_KEY',
  ];
  for (const name of names) {
    const value = String(env?.[name] || '').trim();
    if (value) return { key: value, source: name };
  }
  return { key: '', source: null };
}
