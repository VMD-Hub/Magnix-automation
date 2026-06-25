/**
 * Load system prompt + JSON schema hint from ai-agents-prompts/*.md
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

export function loadPromptMd(relativePath) {
  const full = path.join(repoRoot, relativePath);
  const raw = fs.readFileSync(full, 'utf8');
  const body = raw.replace(/^---[\s\S]*?---\n?/, '');
  return { raw, body };
}

export function extractSection(body, heading) {
  const re = new RegExp(`# ${heading}\\s*\\n([\\s\\S]*?)(?=\\n# |$)`);
  const m = body.match(re);
  return m ? m[1].trim() : '';
}

export function extractSystemPrompt(relativePath) {
  const { body } = loadPromptMd(relativePath);
  const system = extractSection(body, 'System');
  if (!system) throw new Error(`Missing # System in ${relativePath}`);
  return system;
}

export function extractUserTemplate(relativePath) {
  const { body } = loadPromptMd(relativePath);
  return extractSection(body, 'User template');
}
