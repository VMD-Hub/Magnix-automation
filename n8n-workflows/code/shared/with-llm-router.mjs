/**
 * Prepend llm-router-n8n.js vào n8n Code node (build-time).
 */
import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function withLlmRouter(code, providers = {}) {
  const router = fs
    .readFileSync(path.join(__dirname, 'llm-router-n8n.js'), 'utf8')
    .replace(/^\/\*\*[\s\S]*?\*\/\s*/m, '')
    .replace('__LLM_TASK_PROVIDERS_JSON__', JSON.stringify(providers))
    .trim();
  return `${router}\n\n${code}`;
}
