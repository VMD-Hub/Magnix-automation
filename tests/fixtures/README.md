# Golden test fixtures

Payload mẫu cho calibrate classify + parse layer.

## Cấu trúc (dự kiến)

```
tests/fixtures/uid-classify/
├── input_001.json      # webhook input
├── expected_001.json   # segment, score min, interest_key pattern
└── ...
```

## Chạy (manual)

1. Code node `CLASSIFY_FAST` với input fixture
2. LLM staging với `n8n__uid-classify.md` + parse layer
3. So sánh output merge với `ARCHITECTURE_MAGNIX.md` §3.1

Mục tiêu go-live: **20 UID** — mix segment, edge empty text, JSON lỗi từ LLM.

## Fixtures có sẵn

| Input | Kỳ vọng |
|-------|---------|
| `input_001.json` | regex → `noxh_income`, score ≥80, không LLM |
| `input_002_ambiguous.json` | `needs_llm` → LLM branch |

Test: `n8n-workflows/README.md` (curl).
