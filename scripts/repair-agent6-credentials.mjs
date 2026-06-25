#!/usr/bin/env node
/**
 * Gán googleApi cho mọi HTTP node Agent 6 (node mới sau push hay thiếu credential).
 * Usage: node scripts/repair-agent6-credentials.mjs
 */
import { loadEnv } from './lib/magnix-env.mjs';

const WORKFLOW_ID = process.env.N8N_AGENT6_WORKFLOW_ID || 'wgSeFGjiPX0cw83j';

async function api(baseUrl, apiKey, method, path, body) {
  const res = await fetch(`${baseUrl}/api/v1${path}`, {
    method,
    headers: { 'X-N8N-API-KEY': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${data.message || text.slice(0, 200)}`);
  return data;
}

function isGoogleHttpNode(node) {
  return (
    node.type === 'n8n-nodes-base.httpRequest' &&
    node.parameters?.authentication === 'predefinedCredentialType' &&
    node.parameters?.nodeCredentialType === 'googleApi'
  );
}

async function main() {
  const env = loadEnv();
  const baseUrl = (process.env.N8N_PUBLIC_URL || env.N8N_PUBLIC_URL || 'https://n8n.vmd.asia').replace(/\/$/, '');
  const apiKey = process.env.N8N_API_KEY || env.N8N_API_KEY;
  if (!apiKey) throw new Error('Missing N8N_API_KEY');

  const wf = await api(baseUrl, apiKey, 'GET', `/workflows/${WORKFLOW_ID}`);
  const googleRef = wf.nodes.find((n) => n.credentials?.googleApi)?.credentials?.googleApi;
  if (!googleRef?.id) throw new Error('Không tìm thấy googleApi credential trên workflow — gán tay trên Fetch content_queue trước');

  const googleCred = { googleApi: googleRef };
  let fixed = 0;

  for (const node of wf.nodes) {
    if (!isGoogleHttpNode(node)) continue;
    node.credentials = googleCred;
    node.parameters.authentication = 'predefinedCredentialType';
    node.parameters.nodeCredentialType = 'googleApi';
    fixed += 1;
    console.log('  bound:', node.name);
  }

  if (!fixed) {
    console.log('No Google HTTP nodes found.');
    return;
  }

  await api(baseUrl, apiKey, 'PUT', `/workflows/${WORKFLOW_ID}`, {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: { executionOrder: wf.settings?.executionOrder || 'v1' },
  });

  console.log(`\nRepaired ${fixed} node(s) on Agent 6 (${WORKFLOW_ID})`);
  console.log('Credential:', googleRef.name, googleRef.id);
  console.log('Chạy lại Agent 6 trên n8n UI.');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
