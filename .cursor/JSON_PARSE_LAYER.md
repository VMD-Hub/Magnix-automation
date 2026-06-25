# JSON Parse Layer — Bắt buộc sau mọi LLM node

> `/silent` trong prompt **không đủ**. Mọi workflow n8n có LLM node phải có **Code node parse** ngay sau.
> Schema UID đầy đủ: `ARCHITECTURE_MAGNIX.md` §3.1.

---

## 1. Vị trí trong pipeline

```
LLM node → Code: parse_llm_json() → IF ok → merge/enrich → Google Sheet
                              └→ IF fail → dead-letter (status=failed)
```

---

## 2. Hàm parse (n8n Code node)

```javascript
const SEGMENTS = new Set([
  'noxh_income', 'valuation', 'sme_credit', 'general_inbound', 'unclassified',
]);

function extractJsonString(raw) {
  if (raw == null) throw new Error('EMPTY_LLM_OUTPUT');
  const s = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : s).trim();
  return candidate;
}

function parseLlmJson(raw) {
  const candidate = extractJsonString(raw);
  const parsed = JSON.parse(candidate);
  if (parsed == null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('JSON_NOT_OBJECT');
  }
  return parsed;
}

function validateClassify(obj) {
  if (!SEGMENTS.has(obj.segment)) throw new Error('INVALID_SEGMENT');
  const score = Number(obj.score);
  if (!Number.isFinite(score) || score < 0 || score > 100) throw new Error('INVALID_SCORE');
  if (typeof obj.interest_key !== 'string' || !obj.interest_key) {
    throw new Error('INVALID_INTEREST_KEY');
  }
  return { segment: obj.segment, score, interest_key: obj.interest_key };
}

// --- n8n entry ---
const raw = $input.first().json.message?.content
  ?? $input.first().json.text
  ?? $input.first().json.output
  ?? $input.first().json;

try {
  const parsed = parseLlmJson(raw);
  const classify = validateClassify(parsed);
  return [{ json: { ok: true, classify, parse_error: null } }];
} catch (e) {
  return [{
    json: {
      ok: false,
      classify: null,
      parse_error: e.message,
      raw_preview: String(raw).slice(0, 200),
    },
  }];
}
```

---

## 3. Merge enrich (sau classify)

Code node riêng — **LLM không tạo** các field hệ thống:

```javascript
function mergeUidRecord(input, classify, method) {
  const uid = input.uid;
  const uid_source = input.uid_source;
  const normalized_key = `${uid_source}:${uid}`;
  return {
    uid,
    uid_source,
    normalized_key,
    captured_at: input.captured_at ?? new Date().toISOString(),
    text: input.text ?? '',
    segment: classify.segment,
    score: classify.score,
    interest_key: classify.interest_key,
    tags: [classify.segment],
    meta: input.meta ?? {},
    classify_method: method, // 'regex' | 'llm'
    status: classify.score >= 60 ? 'classified' : 'review',
  };
}
```

---

## 4. Error contract (dead-letter)

Khi `ok: false`:

```json
{
  "ok": false,
  "error": "PARSE_JSON|INVALID_SEGMENT|INVALID_SCORE",
  "message": "human readable",
  "retryable": false,
  "normalized_key": "fb_ads:123",
  "status": "failed"
}
```

- **Không retry** LLM parse fail vô hạn — max 1 retry; sau đó ghi dead-letter/status trên Google Sheet.
- Log `parse_error` + `raw_preview` (200 ký tự) — **không** log full PII text.

---

## 5. API JSON mode (khuyến nghị)

Ưu tiên bật structured output trên LLM node (giảm parse fail):

| Provider | Gợi ý |
|----------|--------|
| Gemini | `responseMimeType: application/json` + schema |
| OpenAI | `response_format: json_schema` |
| DeepSeek | JSON mode nếu có |

Parse layer vẫn **bắt buộc** — mode API không thay thế validate.

---

## 6. Checklist workflow mới

- [ ] LLM node → Code parse ngay sau
- [ ] Validate schema theo prompt file
- [ ] IF `ok:false` → error branch (dead-letter)
- [ ] Enrich merge trước Google Sheet write
- [ ] Test fixture trong `tests/fixtures/`
- [ ] Workflow tham chiếu: `n8n-workflows/uid-ingest.workflow.json` (Mạch 1)
