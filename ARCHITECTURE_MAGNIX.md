# Kiến trúc Magnix Automation

> Trung tâm Growth Hacking — tự động hóa n8n, UID ngoại vi, sản xuất nội dung Inbound.

---

## 1. Phạm vi & ranh giới

| Trong Magnix | Ngoài Magnix (tham chiếu, không import) |
|--------------|----------------------------------------|
| Workflow n8n growth / UID / content | Lifestyle_SuperApp BDS pipeline |
| Prompt sản xuất nội dung Inbound | Persona/KB dự án GT001, DA001 |
| Webhook nhận UID / event ngoại vi | Meta Page Messenger Brain (workflow-bds) |

Magnix **orchestrate** qua n8n; logic nặng có thể gọi HTTP sang service trong `webhooks/` hoặc LLM qua n8n.

---

## 2. Sơ đồ luồng tổng quát

```
[Nguồn UID ngoại vi]          [Kênh Inbound / Social]
  Ads export, scrape API,         Form, comment, DM,
  partner CSV, manual Sheet       webhook đối tác
           │                              │
           └──────────┬───────────────────┘
                      ▼
              n8n Webhook / Schedule
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
   Normalize UID   Enrich      Dedupe / Score
   (mapping)       (optional)   (growth rules)
         │            │            │
         └────────────┴────────────┘
                      ▼
        [Kho dữ liệu off-VPS]
        Google Sheet (store/ops) + Drive JSONL (archive)
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
  Segment / Tag              Trigger content
  (audience bucket)          pipeline Inbound
         │                         │
         └────────────┬────────────┘
                      ▼
              ai-agents-prompts/
              (draft → review → publish)
                      │
                      ▼
         [Đích: Page, Zalo OA, email, CRM...]
```

---

## 3. Thành phần trong repo

```
magnix-automation/
├── .cursor/                 # Rule & hướng dẫn Subagent riêng Magnix
├── ai-agents-prompts/       # Prompt thô — không chứa secret
├── n8n-workflows/           # Export JSON workflow
├── webhooks/                # Mini HTTP server (validate, transform, proxy)
├── tests/fixtures/          # Golden test UID (calibrate classify/parse)
├── .cursorrules             # Quy tắc cốt lõi
└── ARCHITECTURE_MAGNIX.md   # File này
```

### 3.1 UID ngoại vi (Peripheral UID)

**Định nghĩa:** Định danh người dùng/lead từ nguồn **không** nằm trong CRM chính BDS — cần chuẩn hóa trước khi dùng cho retargeting hoặc content.

#### Schema thống nhất — bản ghi lead (store of record)

Mọi sink (Google Sheet / Drive archive) dùng **cùng contract** này. Chi tiết lựa chọn sink: `.cursor/STORAGE_OPTIONS.md`.

**Mặc định Magnix:** Google Sheet = store of record + ops queue/review · Google Drive JSONL = archive · VPS = n8n only.

| Trường | Nguồn | Mô tả |
|--------|-------|-------|
| `uid` | Webhook | ID gốc từ nguồn |
| `uid_source` | Webhook | `fb_ads`, `partner_csv`, `scrape_api`, ... |
| `normalized_key` | **Code enrich** | `{uid_source}:{uid}` — khóa dedupe |
| `captured_at` | **Code enrich** | ISO8601 |
| `text` | Webhook | Comment/post/message (optional) |
| `segment` | Regex hoặc LLM | `noxh_income` \| `valuation` \| `sme_credit` \| `general_inbound` \| `unclassified` |
| `score` | Regex hoặc LLM | 0–100 |
| `interest_key` | Regex hoặc LLM | Intent ngắn snake_case |
| `tags` | **Code enrich** | Thường `[segment]` |
| `meta` | Webhook | JSON mở rộng (campaign, post_id, geo) |
| `classify_method` | **Code enrich** | `regex` \| `llm` |
| `consent_basis` | Webhook (optional) | `organic` \| `partner` \| `ads` |
| `status` | **Code enrich** | `raw` \| `classified` \| `review` \| `failed` |

**Output LLM riêng** (chỉ 3 field — xem `ai-agents-prompts/n8n__uid-classify.md`):

```json
{ "segment": "noxh_income", "score": 82, "interest_key": "thu_nhap_vay_noxh" }
```

**Bản ghi đầy đủ mẫu** (sau merge Code node, trước Google Sheet upsert):

```json
{
  "uid": "123456",
  "uid_source": "fb_ads",
  "normalized_key": "fb_ads:123456",
  "captured_at": "2026-06-22T08:00:00+07:00",
  "text": "Thu nhập 15tr có vay NOXH được không?",
  "segment": "noxh_income",
  "score": 82,
  "interest_key": "thu_nhap_vay_noxh",
  "tags": ["noxh_income"],
  "meta": { "campaign": "summer_ads" },
  "classify_method": "llm",
  "consent_basis": "ads",
  "status": "classified"
}
```

Luồng n8n: **Webhook → normalize/enrich skeleton → classify (regex | LLM) → parse JSON → merge full record → Google Sheet upsert/dedupe → Drive JSONL archive**.

### 3.2 Inbound content production

**Sơ đồ đầy đủ (cập nhật):** `.cursor/PIPELINE_MAP.md` · Agent registry: `n8n-workflows/MAGNIX_AGENTS_REGISTRY.md`

```
Listen / archive import → content_queue
        │
        ▼
Agent 2 classify (regex → LLM score 40–59)
        │
        ├─ Context Enrichment (PHASE 1) ─ archive cluster → context_summaries.json
        │     rule-classify content_type · ≥8 post/cluster · waiting_for_context nếu thiếu
        │
        ▼
Layer B → meta.editorial_brief_v1 (+ legal_retrieval_pack)
        │
        ├─ Agent 3  text_post (fb_page_post_image, …) → content_drafts
        ├─ Agent 3b carousel_image → content_drafts (meta.carousel_slides)
        ├─ Agent 6  video_script (fb_reels, …) → video_drafts
        └─ Agent 4  outreach → outreach_queue
        │
        ▼
Title QA · Hook Gate (text) · Content Type Router · L0–L2 · L3 approve
        │
        ▼
Page Publish (cron) · Reels/carousel = manual asset + đăng tay
```

1. **Trigger:** lịch (calendar), sự kiện UID mới, hoặc brief thủ công trên Sheet. Editorial calendar: **queue → Layer B → Agent** — không seed placeholder hook thẳng `content_drafts` (`seed-editorial-calendar-page.mjs` deprecated).
2. **Context Enrichment (trước LLM generate):** `scripts/run-context-enrichment.mjs` → `context_summaries.json` (inject Layer B + Agent 3). Chi tiết: `.cursor/CONTEXT_ENRICHMENT.md` · config: `content_type_rules.json`.
3. **Legal Gate (bắt buộc):** pipeline agent — chi tiết `docs/LEGAL_GATE_PIPELINE.md`. Layer B inject `legal_retrieval_pack`; Agent 3/3b/4/6 consume; thiếu căn cứ → `needs_human_legal_source` + Telegram.
4. **Format routing:** `n8n-workflows/format_routing.json` — Agent 3 chỉ `text_post`; Agent 6 chỉ video; Agent 3b chỉ `carousel_image`.
5. **Legal retrieval:** nếu topic NOXH / vay / định giá → pack từ `legal-sources/` qua `scripts/build-legal-pack-bundle.mjs`; schema `docs/LEGAL_KB_ARCHITECTURE.md` §3.4.
6. **Prompt:** đọc từ `ai-agents-prompts/` — version trong tên file hoặc frontmatter.
7. **Generate:** n8n gọi LLM theo **provider policy** — xem §8 và `docs/LLM_PROVIDER_POLICY.md`.
8. **Parse layer:** Code node bắt buộc sau LLM — xem `.cursor/JSON_PARSE_LAYER.md`.
9. **QA phân tầng:** L0–L3 — xem `.cursor/QA_TIERS.md`. Text post: Title QA Gate + Hook Completion Gate (`.cursor/HOOK_RULES.md`, `cta_templates.json`) trước/sau LLM tùy gate.
10. **Notify gate:** nếu cần human action → tạo notification event + gửi Telegram theo `docs/TELEGRAM_APPROVAL_NOTIFICATIONS.md`.
11. **Review gate:** trạng thái `draft` → `approved` (L3) trên Google Sheet trước khi publish tự động (Page post).

**Enum `content_type` (thống nhất):** `NOXH_LEGAL` | `LOAN_FINANCE` | `VALUATION` | `GENERAL_POLICY` — dùng bởi Context Enrichment, Disclaimer Selector, CTA Router, Title formulas.

**Definition of done:** workflow content phải tạo `product_type` và asset cụ thể theo `docs/CONTENT_PRODUCT_OUTPUTS.md` (Page post, website article, video package, carousel, lead magnet, outreach reply hoặc assembly package). Nếu cần approve / bổ sung nguồn / review render thì phải có Telegram notification event. Brief / outline / insight không được tính là sản phẩm cuối. Reels/carousel: LLM sinh script/slide copy; **Canva/CapCut + L3** là manual (owner).

### 3.3 Webhooks (`webhooks/`)

Dùng khi n8n cần logic TypeScript phức tạp (validate chữ ký, batch transform, rate limit).

Mỗi service:

```
webhooks/{name}/
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    └── server.ts
```

n8n gọi: `POST https://{host}/magnix/{name}/{route}` với header auth token.

---

## 4. Hạ tầng n8n (tham chiếu)

| Môi trường | URL (cấu hình thực tế trong VPS) |
|------------|----------------------------------|
| Production | `https://n8n.vmd.asia` (hoặc instance Magnix riêng) |
| Webhook path | `/webhook/magnix/{workflow-slug}` |

**Quy ước:** Một workflow = một file JSON trong `n8n-workflows/` + một dòng registry.

---

## 5. Luồng mẫu — UID ingest (Mạch 1)

```
Partner POST /webhook/magnix/uid-ingest
        │
        ▼
n8n: Verify token → Parse body
        │
        ▼
Code: skeleton enrich (normalized_key, captured_at, status=raw)
        │
        ▼
Code: CLASSIFY_FAST (regex) → score + segment
        │
        ▼
IF score 40–59 OR unclassified
        → LLM (n8n__uid-classify.md) → Code: parse_llm_json()
ELSE classify_method=regex
        │
        ▼
Code: mergeUidRecord() → bản ghi đầy đủ §3.1
        │
        ├─ Google Sheet upsert (dedupe normalized_key)
        └─ Drive JSONL backup (fire-and-forget)
        │
        ▼
Respond webhook JSON
```

---

## 6. Luồng mẫu — Editorial content (calendar)

```
seed-editorial-queue-layer-b.mjs → content_queue
        │
        ▼
Layer B (content-editorial-brief) → editorial_brief_v1
        │
        ▼
sync-editorial-brief-to-drafts.mjs → content_drafts.meta
        │
        ├─ Agent 3 local/n8n (fb_page_post_image)
        ├─ seed-editorial-reels.mjs / Agent 6 (fb_reels) → video_drafts
        └─ run-agent3b-carousel.mjs / Agent 3b → content_drafts
        │
        ▼
(Manual: Canva cover · CapCut · carousel slides)
        │
        ▼
L3 status=approved → Page Publish cron (page post only)
```

Script orchestration: `run-editorial-full-pipeline.mjs`, `run-editorial-reels-carousel.mjs`.

---

## 7. Checklist thêm workflow mới

- [ ] Cập nhật sơ đồ §2 hoặc thêm § luồng mới trong file này
- [ ] Export JSON → `n8n-workflows/{slug}.workflow.json`
- [ ] Ghi `WORKFLOW_REGISTRY.md` (trigger, credential, go-live date)
- [ ] Prompt (nếu có) → `ai-agents-prompts/`
- [ ] LLM provider theo `docs/LLM_PROVIDER_POLICY.md` + parse layer Code node sau (`.cursor/JSON_PARSE_LAYER.md`)
- [ ] QA tier xác định (`.cursor/QA_TIERS.md`)
- [ ] `.env.example` cho webhook (nếu có)
- [ ] Fixture test trong `tests/fixtures/` (nếu có classify/parse)
- [ ] Test staging trước production

---

## 8. Chiến lược LLM (providers)

> Chi tiết đầy đủ: **`docs/LLM_PROVIDER_POLICY.md`**

Magnix dùng **two-tier LLM** + **execution không LLM**. Config: `n8n-workflows/magnix-public-config.json` → `llm_task_providers` · Router: `n8n-workflows/code/shared/llm-router-n8n.js`.

### 8.1 Phân tầng

| Tầng | Công cụ | Vai trò |
|------|---------|---------|
| **L0** | Regex, Legal Pack inject | Không LLM — classify nhanh, cấm từ, căn cứ pháp lý |
| **L1** | **DeepSeek** (~80% token) | Classify edge · Layer B brief · outreach · video beats · draft general |
| **L2** | **Anthropic** (premium, có budget) | Agent 3 NOXH / vay / định giá · fallback khi DeepSeek fail |
| **L3** | Human trên Sheet | Approve trước publish |
| **Exec** | Creatomate · Meta API · Canva | Render / publish — **0 token LLM** |

### 8.2 Routing mặc định

| Task | Provider |
|------|----------|
| Agent 2 classify | DeepSeek |
| Layer B editorial brief | DeepSeek |
| Agent 4 outreach | DeepSeek |
| Agent 6 video script | DeepSeek |
| Agent 3b carousel draft | DeepSeek |
| Agent 3 — segment pháp lý | Anthropic |
| Agent 3 — `general_inbound` | DeepSeek |
| Content QA (L2 `/devil`) | Anthropic |

Override VPS: `MAGNIX_LLM_<TASK>_PROVIDER=deepseek|anthropic` (xem policy doc).

### 8.3 Bộ nhớ & Gemini

- **Bộ nhớ nội dung:** Google Sheet (`content_queue`, `content_drafts`, `video_drafts`, `meta.*`) — không dùng LLM long context làm store.
- **Context archive:** `context_summaries.json` (cluster từ `content_queue` archive, baked vào workflow build) — refresh: `run-context-enrichment.mjs`.
- **Gemini:** Page cover image (`content-page-cover`); không phải backbone text LLM.

### 8.4 Env bắt buộc trên VPS

- `DEEPSEEK_API_KEY` — pipeline analysis + brief (đã chạy Layer B editorial 01–05).
- `ANTHROPIC_API_KEY` — Agent 3 legal (nạp credit theo nhu cầu).
- Deploy: `scripts/generate-n8n-vps-env.mjs` → `/root/n8n.env` trên VPS.

---

## 9. Liên hệ với dự án khác

Magnix có thể **gọi HTTP** sang pipeline BDS (vd: sync lead đã qualify) nhưng **không** share codebase. Contract chỉ qua API documented hoặc shared Sheet với schema cố định.
