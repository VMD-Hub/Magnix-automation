/**
 * Inline legal-pack-bundle.json into n8n Code node placeholders.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUNDLE_PATH = join(__dirname, '..', '..', 'legal-pack-bundle.json');

export function readLegalGateInline() {
  const config = readFileSync(join(__dirname, 'legal-gate-config.js'), 'utf8');
  const runtime = readFileSync(join(__dirname, 'legal-gate-n8n.js'), 'utf8');
  return `${config}\n${runtime}`;
}

export function injectLegalBundle(code) {
  let bundleJson = '{}';
  if (existsSync(BUNDLE_PATH)) {
    bundleJson = readFileSync(BUNDLE_PATH, 'utf8');
  } else {
    console.warn('legal-pack-bundle.json missing — run: node scripts/build-legal-pack-bundle.mjs');
  }
  return code
    .replaceAll('__LEGAL_PACK_BUNDLE_JSON__', bundleJson)
    .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*/gm, '')
    .trim();
}

export function buildLegalGateNodeCode(agentSnippetFile) {
  const snippet = readFileSync(agentSnippetFile, 'utf8');
  return injectLegalBundle(`${readLegalGateInline()}\n${snippet}`);
}
