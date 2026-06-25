# Magnix Cognitive Functions (MCF)

> Bộ **hàm tư duy** chuẩn hoá cách agent Magnix suy luận, kiểm chứng và giao output.
> Không giới hạn ở danh sách dưới — thêm hàm mới khi phát sinh pattern lặp lại ≥ 3 lần.

---

## 1. Vì sao cần MCF?

Rules (`.cursorrules`, `.mdc`) trả lời **"làm gì"** và **"tuân thủ gì"**.
MCF trả lời **"suy nghĩ theo thứ tự nào"** để tận dụng điểm mạnh của LLM:

| Khả năng AI vượt trội | Hàm MCF tương ứng |
|----------------------|-------------------|
| Phân rã bài toán phức tạp | `DECOMPOSE`, `PLAN` |
| Mô phỏng trước khi code/viết | `SIMULATE`, `DRY_RUN` |
| Tự chấm điểm theo rubric | `SCORE`, `CRITIQUE` |
| Kiểm chứng có cấu trúc | `VERIFY`, `COMPLIANCE_GATE` |
| Output parse được (n8n/JSON) | `PACKAGE`, schema bắt buộc |
| Chuyên môn sâu | `ROUTE` → subagent |
| Sửa một vòng trước khi giao | `REFINE` (max 1 vòng) |

**Nguyên tắc:** Suy luận nội bộ có thể dài; output giao user **ngắn, có cấu trúc, sẵn sàng dùng**.

---

## 2. Vòng lặp nhận thức chuẩn (Core Loop)

```
INTAKE → ORIENT → ROUTE → PLAN → SIMULATE → EXECUTE → SCORE → VERIFY → [REFINE] → PACKAGE
```

| Hàm | Input | Output nội bộ | Khi bỏ qua |
|-----|-------|---------------|------------|
| `INTAKE(brief)` | User message | `{ goal, constraints, segment?, channel?, urgency }` | Hiểu sai yêu cầu |
| `ORIENT()` | Task type | Đã đọc ARCHITECTURE + .cursorrules + rule theo glob | Vi phạm kiến trúc |
| `ROUTE()` | Task type | `self` \| `magnix-growth-architect` \| `magnix-inbound-copywriter` | Làm sai chuyên môn |
| `PLAN()` | Goal | 3–7 bước + tiêu chí done | Output thiếu mảnh |
| `SIMULATE()` | Plan | Edge cases, failure modes | Bug production |
| `EXECUTE()` | Plan | Artifact thô | — |
| `SCORE(rubric)` | Artifact | Điểm 0–100 theo rubric domain | Chất lượng thấp |
| `VERIFY()` | Artifact | pass \| fail + lý do | Compliance / schema lỗi |
| `REFINE()` | fail reasons | Artifact v2 (tối đa 1 lần) | — |
| `PACKAGE()` | Artifact pass | Deliverable chuẩn §4 | Parent agent không parse được |

---

## 3. Hàm định tuyến — `ROUTE()`

```
IF task ∈ { n8n, webhook, Google Sheet, Drive, UID, JSON payload, classify, 24/7 ops }
  → magnix-growth-architect

ELSE IF task ∈ { copy, lead magnet, outreach, Q&A outline, TikTok 60s, prompt inbound }
  → magnix-inbound-copywriter

ELSE IF task spans both (vd: workflow + prompt LLM)
  → growth-architect trước (contract JSON) → copywriter sau (prompt fill schema)

ELSE → self + ORIENT()
```

---

## 4. Rubric chấm điểm — `SCORE()`

Ngưỡng tối thiểu trước `PACKAGE()`: **≥ 75/100**. Dưới ngưỡng → `REFINE()` một lần.

### 4.1 Rubric Growth (growth-architect)

| Tiêu chí | Trọng số |
|----------|----------|
| JSON contract đủ field + `normalized_key` | 25 |
| Idempotent + error branch + retry đúng | 25 |
| Không secret/PII inline | 20 |
| Khớp ARCHITECTURE + registry cập nhật nếu cần | 15 |
| Có test curl / sample payload | 15 |

### 4.2 Rubric Copy (inbound-copywriter)

| Tiêu chí | Trọng số |
|----------|----------|
| Value-First Hook (trao giá trị trước, không spam) | 25 |
| Khớp segment + pain trong brief | 20 |
| Compliance (không hứa lãi/giá, không PII) | 25 |
| Format đúng template (1 trong 4 loại) | 15 |
| CTA nhẹ, opt-in tự nhiên | 15 |

---

## 5. Hàm kiểm chứng cứng — `VERIFY()`

Gate **bắt buộc pass** (fail = không PACKAGE). QA chi tiết: **`.cursor/QA_TIERS.md`**.

**Chung**
- [ ] Không hardcode API key / PAT / webhook secret
- [ ] Không UID/PII thật trong output mẫu
- [ ] Sau LLM node n8n: **parse layer** pass (`.cursor/JSON_PARSE_LAYER.md`)

**Growth**
- [ ] Bản ghi Google Sheet đủ schema §3.1 ARCHITECTURE (`normalized_key`, `classify_method`, `status`)
- [ ] LLM classify chỉ 3 field; enrich do Code node
- [ ] Workflow mới → `WORKFLOW_REGISTRY.md`

**Copy**
- [ ] L0 forbidden regex pass
- [ ] L1 format pass (outreach length, schema)
- [ ] L2 `/devil` khi segment nhạy cảm (NOXH, vay, định giá)
- [ ] L3 human approve trước publish

---

## 6. Hàm mở rộng (domain)

### Growth-only

| Hàm | Mục đích |
|-----|----------|
| `PAYLOAD_DESIGN()` | Thiết kế contract trước code — input/output/error |
| `CLASSIFY_FAST()` | Rule engine regex trước LLM; ngưỡng score 40/60/80 |
| `DEGRADE_GRACEFULLY()` | LLM down → fallback rule-only + queue review |
| `CHUNK_BATCH(n)` | Chia batch ≤100, timeout HTTP ≤30s |
| `IDEMPOTENCY_CHECK()` | Dedupe `normalized_key` \| `event_id` |

### Copy-only

| Hàm | Mục đích |
|-----|----------|
| `PAIN_SEGMENT_MAP()` | Map pain → segment → lead magnet phù hợp |
| `VALUE_FIRST_TEST()` | Hook có asset cụ thể trong 2 câu đầu? |
| `HOOK_VARIANTS(n≥2)` | ≥2 hook A/B trước khi chốt body |
| `COMPLIANCE_GATE()` | Quét cam kết lãi/giá/duyệt chắc chắn |
| `AIO_QA_SHAPE()` | H2/H3 = câu hỏi thật; snippet 40–60 từ |

### Prompt n8n (LLM node)

| Hàm | Mục đích |
|-----|----------|
| `CHAIN_OF_VERIFICATION()` | Sau draft: liệt kê 3 claim → verify từng claim → sửa nếu không có trong brief |
| `STRUCTURED_OUTPUT()` | JSON schema cuối prompt; **+ parse layer Code node** |
| `PARSE_JSON_LAYER()` | validate + merge sau LLM — không tin `/silent` alone |

---

## 7. Công thức prompt n8n (áp dụng trong `ai-agents-prompts/`)

Mọi prompt production nên có block **Suy luận ẩn + Xuất có cấu trúc**:

```markdown
# Quy trình (thực hiện nội bộ, không in ra)

1. ORIENT: đọc brief, xác định segment và ràng buộc compliance.
2. PLAN: chọn góc tiếp cận và 3 điểm giá trị.
3. EXECUTE: viết bản nháp.
4. SCORE: tự chấm Value-First (0–10) và Compliance (0–10).
5. REFINE: nếu bất kỳ điểm < 8 → sửa một lần.
6. PACKAGE: chỉ xuất JSON đúng schema bên dưới — không markdown thừa.
```

---

## 8. Deliverable chuẩn — `PACKAGE()`

### Growth-architect

1. Luồng (3–5 bước text)
2. JSON contract mẫu
3. Code / file path
4. Test (curl hoặc payload)
5. Go-live checklist còn thiếu

### Inbound-copywriter

1. Brief recap (1 đoạn)
2. Deliverable đầy đủ theo template
3. ≥2 hook variants
4. Compliance note
5. (Optional) tên file prompt n8n

---

## 9. Anti-patterns (tránh)

| Anti-pattern | Thay bằng |
|--------------|-----------|
| Viết dài lý thuyết trước artifact | `EXECUTE` trước, giải thích ngắn sau |
| Hỏi lại user câu đã có trong brief | `INTAKE` — assume hợp lý, ghi assumption |
| LLM classify mọi UID | `CLASSIFY_FAST()` trước |
| Output tự do không schema | `STRUCTURED_OUTPUT()` + `PARSE_JSON_LAYER()` |
| LLM QA mọi output | QA tiers L0–L3 — `/devil` chỉ L2 |
| Tin `/silent` = JSON chắc chắn | Code parse bắt buộc |
| Refine vòng lặp vô hạn | Max 1 `REFINE` |

---

## 10. Slash Commands (tích hợp PDF)

Bản đồ đầy đủ: **`.cursor/SLASH_COMMANDS.md`**.

| Mạch | Lệnh | Prompt n8n |
|------|------|------------|
| 1 Tinh luyện UID | `/focus` `/silent` `/ooda` | `n8n__uid-classify.md` |
| 2 Lead Magnet | `/matrix` `/artifacts` `/deconstruct` | `n8n__lead-magnet-draft.md` |
| 3 Outreach | `/ghost` `/brief` | `zalo__outreach-script.md` |
| 4 QA (L2) | `/devil` | `n8n__content-qa.md` |

**Map MCF ↔ Slash:** `VERIFY` = QA tiers L0–L3; `PARSE_JSON_LAYER` sau mọi LLM n8n; `PACKAGE` (data) = merge full schema §3.1.

**Tài liệu kỹ thuật:** `.cursor/JSON_PARSE_LAYER.md` · `.cursor/QA_TIERS.md`

---

## 11. Mở rộng framework

Khi thêm hàm mới, ghi vào §6 với: **tên**, **input/output**, **agent owner**, **ví dụ 1 dòng**.
