#!/usr/bin/env node
/**
 * Sửa credential Agent 7 trên n8n — Fetch node hay bị nodeCredentialType sai (googleOAuth2Api vs googleApi).
 * Usage: node scripts/repair-agent7-credentials.mjs
 */
import { loadEnv } from './lib/magnix-env.mjs';

const env = loadEnv();
const baseUrl = (process.env.N8N_PUBLIC_URL || env.N8N_PUBLIC_URL || 'https://n8n.vmd.asia').replace(/\/$/, '');
const apiKey = process.env.N8N_API_KEY || env.N8N_API_KEY;
const workflowId = process.env.N8N_AGENT7_WORKFLOW_ID || 'fLOl48TY0PjMLqGZ';

const GOOGLE_CRED_ID = process.env.N8N_CRED_GOOGLE_API || 'DJGoF43jTObBnJaV';
const GOOGLE_CRED_NAME = process.env.N8N_CRED_GOOGLE_API_NAME || 'Google Service Account account';
const CREATOMATE_CRED_ID = process.env.N8N_CRED_CREATOMATE || 'M6PJZFqlYq6DdyFA';
const CREATOMATE_CRED_NAME = process.env.N8N_CRED_CREATOMATE_NAME || 'Creatomate API';

const GOOGLE = { googleApi: { id: GOOGLE_CRED_ID, name: GOOGLE_CRED_NAME } };
const CREATOMATE = { httpHeaderAuth: { id: CREATOMATE_CRED_ID, name: CREATOMATE_CRED_NAME } };

const GOOGLE_NODES = new Set(['Fetch video_drafts', 'HTTP GET meta', 'HTTP PUT meta', 'HTTP PUT status']);
const CREATOMATE_NODES = new Set(['HTTP POST Creatomate', 'HTTP GET Creatomate Status']);

async function api(method, path, body) {
  const res = await fetch(`${baseUrl}/api/v1${path}`, {
    method,
    headers: { 'X-N8N-API-KEY': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 200)}`);
  }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${data.message || text.slice(0, 200)}`);
  return data;
}

async function main() {
  if (!apiKey) {
    console.error('Missing N8N_API_KEY in n8n-workflows/.env');
    process.exit(1);
  }

  const wf = await api('GET', `/workflows/${workflowId}`);
  let fixed = 0;

  const existingGoogle = wf.nodes.find((n) => n.credentials?.googleApi)?.credentials?.googleApi;
  const existingCreatomate = wf.nodes.find((n) => n.credentials?.httpHeaderAuth)?.credentials?.httpHeaderAuth;
  const googleCred = existingGoogle?.id
    ? { googleApi: existingGoogle }
    : GOOGLE;
  const creatomateCred = existingCreatomate?.id
    ? { httpHeaderAuth: existingCreatomate }
    : CREATOMATE;

  for (const node of wf.nodes) {
    if (GOOGLE_NODES.has(node.name)) {
      node.credentials = googleCred;
      node.parameters.authentication = 'predefinedCredentialType';
      node.parameters.nodeCredentialType = 'googleApi';
      fixed += 1;
    }
    if (CREATOMATE_NODES.has(node.name)) {
      node.credentials = creatomateCred;
      node.parameters.authentication = 'genericCredentialType';
      node.parameters.genericAuthType = 'httpHeaderAuth';
      fixed += 1;
    }
  }

  await api('PUT', `/workflows/${workflowId}`, {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: { executionOrder: wf.settings?.executionOrder || 'v1' },
  });

  const check = await api('GET', `/workflows/${workflowId}`);
  const fetchNode = check.nodes.find((n) => n.name === 'Fetch video_drafts');
  console.log(`Repaired ${fixed} nodes on workflow ${workflowId}`);
  console.log('Fetch:', fetchNode?.parameters?.nodeCredentialType, fetchNode?.credentials?.googleApi?.id);
  console.log('Creatomate POST:', check.nodes.find((n) => n.name === 'HTTP POST Creatomate')?.credentials?.httpHeaderAuth?.id);
  console.log('\nChạy lại Agent 7 manual trên n8n.');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
