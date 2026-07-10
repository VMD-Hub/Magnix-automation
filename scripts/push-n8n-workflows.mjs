#!/usr/bin/env node
/**
 * Push workflow JSON lên n8n VPS qua REST API (không cần import thủ công).
 *
 * Usage:
 *   node scripts/push-n8n-workflows.mjs --dry-run
 *   node scripts/push-n8n-workflows.mjs
 *   node scripts/push-n8n-workflows.mjs --only content-video-render.workflow.json
 *
 * Env:
 *   N8N_PUBLIC_URL=https://n8n.vmd.asia
 *   N8N_API_KEY=...   (n8n Settings → API)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv, parseArgs } from './lib/magnix-env.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const wfDir = path.join(root, 'n8n-workflows');

const WORKFLOW_FILES = [
  'uid-ingest.workflow.json',
  'social-listening.workflow.json',
  'social-listening-facebook.workflow.json',
  'content-classify.workflow.json',
  'content-editorial-brief.workflow.json',
  'content-draft.workflow.json',
  'content-carousel-draft.workflow.json',
  'content-video-draft.workflow.json',
  'content-video-render.workflow.json',
  'content-page-publish.workflow.json',
  'content-page-cover.workflow.json',
  'outreach-queue.workflow.json',
  'content-scorecard.workflow.json',
  'telegram-notify.workflow.json',
  'telegram-reminder.workflow.json',
  'telegram-resolver.workflow.json',
  'housex-noxh-lead-route.workflow.json',
];

/** Tên workflow cũ trên n8n — push cập nhật in-place thay vì tạo bản trùng */
const LEGACY_WORKFLOW_NAMES = {
  'content-video-render.workflow.json': [
    'Magnix Agent 7 — Creatomate Video Render (video_drafts → MP4)',
  ],
  'content-scorecard.workflow.json': [
    'Magnix Mạch 5 — Content Scorecard (Sheet → score → Lark)',
  ],
};

function findExisting(byName, wf, file) {
  const direct = byName.get(wf.name);
  if (direct) return direct;
  for (const legacy of LEGACY_WORKFLOW_NAMES[file] || []) {
    const hit = byName.get(legacy);
    if (hit) return hit;
  }
  return null;
}

function preparePayload(wf) {
  return {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: { executionOrder: wf.settings?.executionOrder || 'v1' },
  };
}

function mergeNodeCredentials(nodes, prevNodes) {
  const credByNode = new Map(
    (prevNodes || [])
      .filter((n) => n.credentials)
      .map((n) => [n.name, n.credentials])
  );
  const googleTemplate = [...(prevNodes || []), ...(nodes || [])].find(
    (n) => n.credentials?.googleApi?.id
  )?.credentials?.googleApi;
  const headerTemplate = [...(prevNodes || []), ...(nodes || [])].find(
    (n) => n.credentials?.httpHeaderAuth?.id
  )?.credentials?.httpHeaderAuth;

  if (!credByNode.size && !googleTemplate && !headerTemplate) return nodes;

  return nodes.map((n) => {
    let credentials = n.credentials || credByNode.get(n.name);
    if (
      !credentials?.googleApi &&
      googleTemplate &&
      n.type === 'n8n-nodes-base.code' &&
      String(n.parameters?.jsCode || '').includes("httpRequestWithAuthentication.call(this, 'googleApi'")
    ) {
      credentials = { ...(credentials || {}), googleApi: googleTemplate };
    }
    if (!credentials?.googleApi && n.parameters?.nodeCredentialType === 'googleApi' && googleTemplate) {
      credentials = { ...(credentials || {}), googleApi: googleTemplate };
    }
    if (
      !credentials?.httpHeaderAuth &&
      (n.parameters?.genericAuthType === 'httpHeaderAuth' ||
        n.parameters?.nodeCredentialType === 'httpHeaderAuth') &&
      headerTemplate
    ) {
      credentials = { ...(credentials || {}), httpHeaderAuth: headerTemplate };
    }
    return {
      ...n,
      credentials: credentials || undefined,
    };
  });
}

async function n8nFetch(baseUrl, apiKey, method, pathSuffix, body) {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/v1${pathSuffix}`, {
    method,
    headers: {
      'X-N8N-API-KEY': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`${method} ${pathSuffix} → ${res.status}: ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const err = new Error(`${method} ${pathSuffix} → ${res.status}: ${data.message || text.slice(0, 200)}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function listWorkflows(baseUrl, apiKey) {
  const data = await n8nFetch(baseUrl, apiKey, 'GET', '/workflows?limit=250');
  return data.data || data;
}

async function setActive(baseUrl, apiKey, id, active) {
  await n8nFetch(baseUrl, apiKey, 'POST', `/workflows/${id}/${active ? 'activate' : 'deactivate'}`);
}

async function upsertWorkflow(baseUrl, apiKey, { prev, prevFull, payload, wf, activate }) {
  const body = {
    ...payload,
    nodes: mergeNodeCredentials(payload.nodes, prevFull?.nodes),
    settings: {
      executionOrder: prevFull?.settings?.executionOrder || payload.settings?.executionOrder || 'v1',
    },
  };

  const wasActive = Boolean(prevFull?.active ?? prev?.active);
  let deactivatedForPush = false;

  const tryPut = () => n8nFetch(baseUrl, apiKey, 'PUT', `/workflows/${prev.id}`, body);

  try {
    await tryPut();
  } catch (e) {
    const credentialBlock =
      e.status === 400 &&
      String(e.message).includes('configuration issues') &&
      wasActive;
    if (!credentialBlock) throw e;
    console.warn(`  ⚠ Deactivate tạm (thiếu credential trên node) → push → bật lại nếu --activate`);
    await setActive(baseUrl, apiKey, prev.id, false);
    deactivatedForPush = true;
    await tryPut();
  }

  console.log('UPDATED:', wf.name, prev.name !== wf.name ? `(was: ${prev.name})` : '');

  if (activate && (wasActive || deactivatedForPush)) {
    try {
      await setActive(baseUrl, apiKey, prev.id, true);
      console.log('  → re-activated');
    } catch (e) {
      console.warn(`  ⚠ Không activate lại — gán credential trên n8n UI rồi bật tay: ${e.message}`);
    }
  } else if (deactivatedForPush) {
    console.warn('  → vẫn inactive — gán googleApi (Drive Backup Upload) trên n8n UI rồi Activate');
  }
}

async function main() {
  const env = loadEnv();
  const { flags, opts } = parseArgs();
  const dryRun = flags.has('dry-run');
  const activate = flags.has('activate');
  const onlyFile = opts.only || null;

  const filesToPush = onlyFile
    ? WORKFLOW_FILES.filter((f) => f === onlyFile || f.includes(onlyFile))
    : WORKFLOW_FILES;
  if (onlyFile && !filesToPush.length) {
    console.error('Unknown --only file:', onlyFile);
    process.exit(1);
  }

  const baseUrl = process.env.N8N_PUBLIC_URL || env.N8N_PUBLIC_URL || 'https://n8n.vmd.asia';
  const apiKey = process.env.N8N_API_KEY || env.N8N_API_KEY;
  if (!apiKey) {
    console.error('Missing N8N_API_KEY — tạo trong n8n Settings → API');
    process.exit(1);
  }

  console.log(`=== Push workflows → ${baseUrl} ===`);
  if (onlyFile) console.log(`(only: ${onlyFile})`);
  if (dryRun) console.log('(dry-run — không ghi n8n)\n');

  const existing = await listWorkflows(baseUrl, apiKey);
  const byName = new Map(existing.map((w) => [w.name, w]));

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const file of filesToPush) {
    const fp = path.join(wfDir, file);
    if (!fs.existsSync(fp)) {
      console.warn('SKIP missing', file);
      continue;
    }
    const wf = JSON.parse(fs.readFileSync(fp, 'utf8'));
    const payload = preparePayload(wf);
    const prev = findExisting(byName, wf, file);

    if (dryRun) {
      const tag = prev ? `UPDATE (id=${prev.id})` : 'CREATE';
      console.log(`${tag}: ${wf.name}`);
      continue;
    }

    try {
      if (prev?.id) {
        let prevFull = null;
        try {
          prevFull = await n8nFetch(baseUrl, apiKey, 'GET', `/workflows/${prev.id}`);
        } catch {
          /* optional */
        }
        await upsertWorkflow(baseUrl, apiKey, { prev, prevFull, payload, wf, activate });
        updated += 1;
        byName.set(wf.name, { ...prev, name: wf.name });
      } else {
        const createdWf = await n8nFetch(baseUrl, apiKey, 'POST', '/workflows', payload);
        created += 1;
        console.log('CREATED:', wf.name, `(id=${createdWf.id})`);
        byName.set(wf.name, createdWf);
        if (activate && createdWf.id) {
          await setActive(baseUrl, apiKey, createdWf.id, true);
          console.log('  → activated');
        }
      }
    } catch (e) {
      failed += 1;
      console.error('FAIL:', wf.name, '—', e.message);
    }
  }

  console.log(`\nDone: created=${created} updated=${updated} failed=${failed}`);
  if (failed) {
    console.log('Một số workflow cần gán credential trên n8n UI (googleApi / Header Auth Creatomate).');
    process.exit(1);
  }
  console.log('Lưu ý: Credential googleApi / Header Auth Creatomate gán 1 lần trên n8n UI.');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
