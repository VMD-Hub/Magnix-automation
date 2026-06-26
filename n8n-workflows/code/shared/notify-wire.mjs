/**
 * Inject "Fire Telegram Notify" Code node into agent build scripts.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TAIL = fs.readFileSync(path.join(__dirname, 'fire-notify-tail.js'), 'utf8');

export function loadFireNotifyCode(agentFile, replacements = {}) {
  const publicCfg = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../magnix-public-config.json'), 'utf8')
  );
  const gidsJson = JSON.stringify(publicCfg.sheet_tab_gids || {});
  const buildUrl = fs
    .readFileSync(path.join(__dirname, 'build-review-url.js'), 'utf8')
    .replaceAll('__SHEET_TAB_GIDS__', gidsJson);

  let code = fs.readFileSync(path.join(__dirname, agentFile), 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    code = code.replaceAll(key, value);
  }
  return `${buildUrl}\n${code}\n${TAIL}`;
}

/**
 * Insert notify node between insertAfter and resumeTo in connections.
 */
export function wireNotifyAfter(nodes, connections, {
  idPrefix,
  nodeName = 'Fire Telegram Notify',
  fireCode,
  insertAfter,
  resumeTo,
  position,
}) {
  const nodeId = `${idPrefix}notify`;
  nodes.push({
    parameters: { jsCode: fireCode },
    id: nodeId,
    name: nodeName,
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position,
    onError: 'continueRegularOutput',
  });

  const downstream = connections[insertAfter]?.main?.[0] || [
    { node: resumeTo, type: 'main', index: 0 },
  ];
  connections[insertAfter] = { main: [[{ node: nodeName, type: 'main', index: 0 }]] };
  connections[nodeName] = { main: [downstream] };
}
