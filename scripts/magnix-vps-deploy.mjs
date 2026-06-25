#!/usr/bin/env node
/**
 * Deploy Magnix lên VPS — rebuild + env + restart + push workflows (tùy chọn).
 *
 * Usage:
 *   node scripts/magnix-vps-deploy.mjs                    # env + restart container
 *   node scripts/magnix-vps-deploy.mjs --with-workflows   # + rebuild + push n8n API
 *   node scripts/magnix-vps-deploy.mjs --workflows-only   # chỉ rebuild + push
 *
 * Env SSH: MAGNIX_VPS_HOST, MAGNIX_VPS_PORT (24700), MAGNIX_VPS_USER (root)
 * Env n8n: N8N_API_KEY (cho --with-workflows)
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/magnix-env.mjs';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const node = process.execPath;

function run(script, extraArgs = []) {
  const r = spawnSync(node, [path.join(scriptsDir, script), ...extraArgs], {
    stdio: 'inherit',
    cwd: path.join(scriptsDir, '..'),
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const { flags } = parseArgs();
const workflowsOnly = flags.has('workflows-only');
const withWorkflows = flags.has('with-workflows') || workflowsOnly;

if (withWorkflows) {
  run('rebuild-all-workflows.mjs');
  run('push-n8n-workflows.mjs');
}

if (!workflowsOnly) {
  run('generate-n8n-vps-env.mjs');
  run('deploy-vps-n8n.mjs');
  run('probe-n8n-vps-env.mjs');
}

console.log('\nMagnix VPS deploy hoàn tất.');
if (!withWorkflows) {
  console.log('Tip: thêm --with-workflows để push workflow JSON qua n8n API.');
}
