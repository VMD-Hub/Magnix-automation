/**
 * Prepend pipeline-intake-stub.js vào n8n Code node (build-time).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STUB = fs
  .readFileSync(path.join(__dirname, 'pipeline-intake-stub.js'), 'utf8')
  .replace(/^\/\*\*[\s\S]*?\*\/\s*/m, '')
  .trim();

export function withPipelineStub(code) {
  return `${STUB}\n\n${code}`;
}
