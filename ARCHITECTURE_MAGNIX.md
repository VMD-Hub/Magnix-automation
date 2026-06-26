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

1. **Trigger:** lịch (calendar), sự kiện UID mới, hoặc brief thủ công trên Sheet.
2. **Legal Gate (bắt buộc):** pipeline 8 agent — chi tiết `docs/LEGAL_GATE_PIPELINE.md`. Layer B inject `legal_retrieval_pack`; Agent 3/4/6 consume; thiếu căn cứ → `needs_human_legal_source` + Telegram.
3. **Legal retrieval:** nếu topic NOXH / vay / định giá → pack từ `legal-sources/` qua `scripts/build-legal-pack-bundle.mjs`; schema `docs/LEGAL_KB_ARCHITECTURE.md` §3.4.
4. **Prompt:** đọc từ `ai-agents-prompts/` — version trong tên file hoặc frontmatter.
5. **Generate:** n8n gọi LLM (OpenAI/Anthropic/Gemini node).
6. **Parse layer:** Code node bắt buộc sau LLM — xem `.cursor/JSON_PARSE_LAYER.md`.
7. **QA phân tầng:** L0–L3 — xem `.cursor/QA_TIERS.md` (không LLM-QA mọi output).
8. **Notify gate:** nếu cần human action → tạo notification event + gửi Telegram theo `docs/TELEGRAM_APPROVAL_NOTIFICATIONS.md`.
9. **Review gate:** trạng thái `draft` → `approved` (L3) trên Google Sheet trước khi publish.

**Definition of done:** workflow content phải tạo `product_type` và asset cụ thể theo `docs/CONTENT_PRODUCT_OUTPUTS.md` (Page post, website article, video package, carousel, lead magnet, outreach reply hoặc assembly package). Nếu cần approve / bổ sung nguồn / review render thì phải có Telegram notification event. Brief / outline / insight không được tính là sản phẩm cuối.

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

## 6. Luồng mẫu — Inbound post draft

```
Schedule (daily 6:00) hoặc Sheet row status=queued
        │
        ▼
n8n: Read brief row (topic, audience, CTA)
        │
        ▼
HTTP/File: load prompt fb__inbound-post-draft.md
        │
        ▼
LLM node → draft JSON
        │
        ▼
Code: parse_llm_json() + L0 forbidden regex
        │
        ▼
IF segment nhạy cảm → L2 /devil (n8n__content-qa.md)
        │
        ▼
Google Sheet: status=draft
        │
        ▼
(L3 Human approve) → publish branch
```

---

## 7. Checklist thêm workflow mới

- [ ] Cập nhật sơ đồ §2 hoặc thêm § luồng mới trong file này
- [ ] Export JSON → `n8n-workflows/{slug}.workflow.json`
- [ ] Ghi `WORKFLOW_REGISTRY.md` (trigger, credential, go-live date)
- [ ] Prompt (nếu có) → `ai-agents-prompts/`
- [ ] LLM node có **parse layer** Code node sau (`.cursor/JSON_PARSE_LAYER.md`)
- [ ] QA tier xác định (`.cursor/QA_TIERS.md`)
- [ ] `.env.example` cho webhook (nếu có)
- [ ] Fixture test trong `tests/fixtures/` (nếu có classify/parse)
- [ ] Test staging trước production

---

## 8. Liên hệ với dự án khác

Magnix có thể **gọi HTTP** sang pipeline BDS (vd: sync lead đã qualify) nhưng **không** share codebase. Contract chỉ qua API documented hoặc shared Sheet với schema cố định.
