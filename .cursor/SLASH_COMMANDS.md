# Magnix Slash Commands — Bản đồ tích hợp

> Lệnh `/command` là **mode vận hành** gắn vào System Prompt (Cursor agent hoặc n8n LLM node).
> MCF: `.cursor/AGENT_COGNITION.md` · Parse: `.cursor/JSON_PARSE_LAYER.md` · QA: `.cursor/QA_TIERS.md`

---

## 1. Bảng tích hợp theo nhóm

| Nhóm | Lệnh | Vai trò | QA tier |
|------|------|---------|---------|
| **Xử lý dữ liệu thô** | `/focus` `/silent` `/ooda` | JSON classify sạch → merge enrich → Google Sheet | L0 + parse |
| **Sản xuất Lead Magnet** | `/matrix` `/artifacts` `/deconstruct` | Bảng so sánh, Markdown export, deconstruct cấu trúc tài liệu | L0–L2 + L3 |
| **Outreach & Copy** | `/ghost` `/brief` | Tin tự nhiên; cold ≤3 dòng | L0 + L1 + L3 |
| **Kiểm định QA** | `/devil` (+ `/roast` Cursor only) | L2 pháp lý — **không** chạy mọi output | L2 |
| **HouseX tin tức** | `/write-article` | Webhook n8n PR — **không** draft body trong chat | L0 + L3 |

---

## 2. Định nghĩa từng lệnh

### Nhóm Data (`/silent` `/focus` `/ooda`)

| Lệnh | Hành vi |
|------|---------|
| **`/focus`** | Chỉ làm task trong prompt |
| **`/silent`** | Chỉ JSON classify 3 field — **Code node parse bắt buộc sau** |
| **`/ooda`** | Observe → Orient → Decide → Act (nội bộ) |

**LLM output (partial):** `{ segment, score, interest_key }`  
**Sheet record (full):** merge Code — xem `ARCHITECTURE_MAGNIX.md` §3.1

### Nhóm Lead Magnet (`/matrix` `/artifacts` `/deconstruct`)

| Lệnh | Hành vi |
|------|---------|
| **`/matrix`** | Bảng so sánh bắt buộc |
| **`/artifacts`** | Markdown/bảng → PDF/Excel |
| **`/deconstruct`** | Phân tích **cấu trúc** tài liệu brief; không copy nguyên văn; `source_refs[]` |

### Nhóm Outreach (`/ghost` `/brief`)

| Lệnh | Hành vi |
|------|---------|
| **`/ghost`** | Loại từ mùi AI |
| **`/brief`** | Cold ≤3 dòng; warm ≤4 câu + ngữ cảnh |

### Nhóm QA

| Lệnh | Hành vi | Nơi dùng |
|------|---------|----------|
| **`/devil`** | Luật sư nghiêm — L2 | n8n content nhạy cảm |
| **`/roast`** | Khách khó tính — A/B copy | **Cursor only**, không n8n mặc định |

### Nhóm HouseX Editorial (`/write-article`)

| Lệnh | Hành vi |
|------|---------|
| **`/write-article`** | Gọi `POST /webhook/magnix/housex-article` — prompt `housex__website-article-pr.md` · L0 voice gate · Sheet `housex_articles` · **L3 trước publish** |

**Cursor:** `node scripts/trigger-housex-article.mjs --topic "..." --angle tod`  
**Không** viết full body PR trực tiếp trong chat khi user dùng lệnh này.

---

## 3. Bốn mạch vận hành

```
Mạch 1  UID → classify → PARSE → merge → Google Sheet
Mạch 2  Segment → [/matrix+/artifacts] → L0–L2 → draft
Mạch 3  Lead → [/ghost+/brief] → L0–L1 → L3 approve → gửi
Mạch 4  (L2)  → [/devil] → pass | human_review
Mạch 5  HouseX → [/write-article] → n8n PR → Sheet → L3 → HouseX /tin-tuc
```

| Mạch | Prompt | Parse layer | QA |
|------|--------|-------------|-----|
| 1 | `n8n__uid-classify.md` | ✅ bắt buộc | L0 |
| 2 | `n8n__lead-magnet-draft.md` | ✅ | L0–L2 |
| 3 | `zalo__outreach-script.md` | ✅ | L0–L1, L3 gửi |
| 4 | `n8n__content-qa.md` | ✅ | L2 |

---

## 4. Luồng Mạch 1 (cập nhật)

```
Webhook → enrich skeleton → CLASSIFY_FAST
  → IF mơ hồ → LLM [/ooda] → parse_llm_json()
  → mergeUidRecord() → dedupe → Google Sheet
  → IF parse fail → status=failed (dead-letter)
```

Chi tiết code: `.cursor/JSON_PARSE_LAYER.md`

---

## 5. QA phân tầng (tóm tắt)

| Tầng | Cơ chế |
|------|--------|
| L0 | Regex cấm + parse JSON |
| L1 | Schema + `/brief` length |
| L2 | `/devil` LLM — segment nhạy cảm |
| L3 | Human `approved` trước publish |

Chi tiết: `.cursor/QA_TIERS.md`

---

## 6. Go-live checklist

- [ ] Hạ tầng n8n + env keys + Google Sheet/Drive
- [ ] Mọi LLM node có Code parse sau
- [ ] Schema §3.1 ARCHITECTURE trên Google Sheet
- [ ] QA tier ghi trong WORKFLOW_REGISTRY
- [ ] Test 20 UID + fixtures `tests/fixtures/`

---

## 7. Mở rộng

Thêm lệnh → bảng §1 + prompt file + QA tier nếu có.
