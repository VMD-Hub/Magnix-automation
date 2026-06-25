#!/usr/bin/env node
/** Dry-run: beats → Creatomate RenderScript (Agent 7 v2) */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharedPath = path.join(root, 'n8n-workflows/code/shared/beats-to-creatomate-source.js');
const code = fs.readFileSync(sharedPath, 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const { buildCreatomateSourceFromBeats } = sandbox;

const sampleBeats = [
  {
    start_sec: 0,
    end_sec: 3,
    role: 'hook',
    spoken: 'Thu nhập 15 triệu có vay NOXH được không?',
    on_screen: '15 triệu vay NOXH?',
    visual_spec: { type: 'broll', stock_query: 'vietnam apartment couple phone', fallback_color: '#0f172a' },
    retention_intent: 'pattern_interrupt',
  },
  {
    start_sec: 3,
    end_sec: 12,
    role: 'value',
    spoken: 'Ngân hàng tính DTI tối đa khoảng 40 đến 50 phần trăm thu nhập.',
    on_screen: 'DTI tối đa ~40-50% thu nhập',
    visual_spec: { type: 'broll', stock_query: 'bank calculator finance', fallback_color: '#1e293b' },
    retention_intent: 'reframe',
  },
  {
    start_sec: 12,
    end_sec: 22,
    role: 'proof',
    spoken: 'Ví dụ thu nhập 15 triệu, khoản vay an toàn thường quanh 600 đến 700 triệu.',
    on_screen: '15tr → vay ~600-700 triệu',
    visual_spec: { type: 'broll', stock_query: 'money savings vietnam', fallback_color: '#1e293b' },
    retention_intent: 'checklist_tease',
  },
  {
    start_sec: 22,
    end_sec: 30,
    role: 'cta',
    spoken: 'Comment CHECKLIST để nhận file tính dòng tiền mẫu.',
    on_screen: 'COMMENT: CHECKLIST',
    visual_spec: { type: 'broll', stock_query: 'hanoi skyline sunset', fallback_color: '#0f172a' },
    retention_intent: 'cta_soft',
  },
];

const source = buildCreatomateSourceFromBeats({
  beats: sampleBeats,
  duration_sec: 30,
  segment: 'noxh_income',
  title: 'Thu nhập 15 triệu vay NOXH',
  cta_keyword: 'CHECKLIST',
  sceneMedia: sampleBeats.map((_, i) => ({
    videoUrl: i % 2 === 0 ? 'https://example.com/stock.mp4' : null,
  })),
  useCreatomateVoice: false,
});

const compositions = source.elements.filter((e) => e.type === 'composition');
console.log(JSON.stringify({
  ok: compositions.length === 4,
  scenes: compositions.length,
  duration: source.duration,
  size: `${source.width}x${source.height}`,
}, null, 2));

if (compositions.length !== 4) process.exit(1);
