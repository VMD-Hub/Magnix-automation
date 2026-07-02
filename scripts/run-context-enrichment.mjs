#!/usr/bin/env node
/**
 * PHASE 1 — Context Enrichment batch
 * Rule-classify archive → cluster by content_type → LLM summary (≥8/cluster)
 *
 * Usage:
 *   node scripts/run-context-enrichment.mjs --dry-run
 *   node scripts/run-context-enrichment.mjs
 *   node scripts/run-context-enrichment.mjs --skip-llm
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv, parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';
import { extractSystemPrompt } from '../n8n-workflows/code/shared/extract-prompt.mjs';
import {
  isArchiveRow,
  ruleClassifyContentType,
  clusterByContentType,
  clusterEnrichmentStatus,
  normalizeContextSummary,
  assembleContextStore,
  isContextSummaryUsable,
} from '../n8n-workflows/code/shared/context-enrichment.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const RULES_PATH = path.join(root, 'n8n-workflows/content_type_rules.json');
const STORE_PATH = path.join(root, 'n8n-workflows/context_summaries.json');

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes('--dry-run'),
    skipLlm: args.includes('--skip-llm'),
    minSize: Number(args.find((_, i, a) => a[i - 1] === '--min-size') || 8),
  };
}

function extractJson(text) {
  const s = String(text || '');
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let t = (fenced ? fenced[1] : s).trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  const attempts = [
    t,
    t.replace(/[\u201C\u201D\u2018\u2019]/g, '"'),
    t.replace(/,\s*([}\]])/g, '$1'),
    t.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' '),
  ];
  let lastErr;
  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('JSON_PARSE_FAIL');
}

async function callDeepSeek(env, system, userPayload) {
  const key = env.DEEPSEEK_API_KEY;
  if (!key || key.length < 12) throw new Error('Thiếu DEEPSEEK_API_KEY');
  const res = await fetch(env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: env.DEEPSEEK_MODEL || 'deepseek-chat',
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: JSON.stringify(userPayload) },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || res.statusText);
  return data.choices?.[0]?.message?.content;
}

async function llmContentType(env, system, row, rules) {
  const userPayload = {
    text: String(row.text || '').slice(0, 2000),
    segment: row.segment,
    segment_score: row.score,
    keyword_scores: row.keyword_scores,
    candidates: Object.keys(rules.segment_default || {}).map((s) => ({
      segment: s,
      content_type: rules.segment_default[s],
    })),
  };
  const raw = await callDeepSeek(
    env,
    `${system}\nChỉ trả JSON: {"content_type":"NOXH_LEGAL|LOAN_FINANCE|VALUATION|GENERAL_POLICY"}`,
    userPayload,
  );
  const parsed = extractJson(raw);
  const t = String(parsed.content_type || '').toUpperCase();
  const allowed = new Set(['NOXH_LEGAL', 'LOAN_FINANCE', 'VALUATION', 'GENERAL_POLICY']);
  return allowed.has(t) ? t : null;
}

async function llmClusterSummary(env, system, contentType, posts) {
  const sample = posts.slice(0, 25).map((p, i) => ({
    i: i + 1,
    post_id: p.post_id || p.normalized_key,
    text: String(p.text || '').slice(0, 500),
  }));
  const baseSystem = `${system}

Bắt buộc: top_questions ≥3 mục, pains ≥3 mục, audience_voice ≥1 câu đầy đủ. Không trả mảng rỗng.`;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const raw = await callDeepSeek(env, baseSystem, {
      content_type: contentType,
      post_count: posts.length,
      sample_posts: sample,
      retry_hint: attempt ? 'Lần trước output rỗng — bắt buộc điền đủ field.' : null,
    });
    const summary = normalizeContextSummary(extractJson(raw));
    if (isContextSummaryUsable(summary)) return summary;
  }
  throw new Error('EMPTY_CONTEXT_SUMMARY');
}

async function main() {
  const { dryRun, skipLlm, minSize } = parseArgs();
  const env = loadEnv();
  const rules = JSON.parse(fs.readFileSync(RULES_PATH, 'utf8'));
  const minCluster = minSize || rules.min_cluster_size || 8;
  const systemSummary = extractSystemPrompt('ai-agents-prompts/n8n__context-summary.md');
  const systemClassify = 'Magnix — phân loại content_type từ post archive. Chỉ dùng enum NOXH_LEGAL, LOAN_FINANCE, VALUATION, GENERAL_POLICY.';

  const { rows } = rowsToObjects(await fetchTab('content_queue', 'A:O'));
  const archive = [];

  for (const r of rows) {
    const meta = parseMeta(r.meta);
    const row = {
      normalized_key: r.normalized_key,
      post_id: r.post_id,
      text: r.text,
      segment: String(r.segment || 'unclassified').toLowerCase(),
      score: Number(r.score || 0),
      source: r.source || meta.source,
      status: r.status,
    };
    if (!isArchiveRow(row, rules)) continue;
    if (String(row.text || '').trim().length < 15) continue;
    if (row.status && row.status !== 'classified' && r.claude_verdict !== 'qualified') continue;

    const classified = ruleClassifyContentType({
      text: row.text,
      segment: row.segment,
      score: row.score,
      rules,
    });

    let content_type = classified.content_type;
    if (classified.needs_llm_content_type && !skipLlm && !dryRun) {
      const llmType = await llmContentType(env, systemClassify, { ...row, ...classified }, rules);
      if (llmType) {
        content_type = llmType;
        classified.classify_method = 'llm_score_band';
      }
    }

    archive.push({ ...row, content_type, classify_method: classified.classify_method });
  }

  const clusters = clusterByContentType(archive);
  /** @type {Record<string, object>} */
  const clusterRecords = {};

  console.log(`Archive rows: ${archive.length} · min_cluster_size: ${minCluster}\n`);

  for (const [type, posts] of Object.entries(clusters)) {
    const status = clusterEnrichmentStatus(posts.length, minCluster);
    const methodStats = {};
    for (const p of posts) {
      const m = p.classify_method || 'unknown';
      methodStats[m] = (methodStats[m] || 0) + 1;
    }

    let context_summary = null;
    if (status === 'ready' && !skipLlm && !dryRun) {
      console.log(`LLM summary → ${type} (${posts.length} posts)...`);
      try {
        context_summary = await llmClusterSummary(env, systemSummary, type, posts);
      } catch (e) {
        console.warn(`  ⚠ ${type} summary fail: ${e.message}`);
      }
    }

    const finalStatus = context_summary
      ? 'ready'
      : (status === 'ready' && !skipLlm && !dryRun ? 'waiting_for_context' : status);

    clusterRecords[type] = {
      status: finalStatus,
      post_count: posts.length,
      sample_post_ids: posts.slice(0, 20).map((p) => p.post_id || p.normalized_key),
      context_summary,
      classify_method_stats: methodStats,
    };

    console.log(
      `  ${type}: ${posts.length} posts → ${finalStatus}${context_summary ? ' (summary OK)' : ''}`,
    );
  }

  if (dryRun) {
    console.log('\ndry-run — không ghi context_summaries.json');
    return;
  }

  const existing = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  const store = assembleContextStore(existing, clusterRecords, minCluster);
  fs.writeFileSync(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`);
  console.log(`\n✓ Wrote ${STORE_PATH}`);
  console.log('  Rebuild workflows: node scripts/rebuild-all-workflows.mjs');
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
