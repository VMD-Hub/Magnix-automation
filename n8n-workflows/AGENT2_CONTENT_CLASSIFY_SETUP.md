# Agent 2 — Content Classify

Phân loại `content_queue`: **regex trước → LLM nếu mơ hồ** → cập nhật Sheet.

## Luồng

```
Schedule 08:00 VN / Manual
  → Fetch content_queue (A:O)
  → Lọc pending (unclassified / review / needs_llm), max 200 dòng
  → Loop từng dòng
      → Classify Fast (regex)
      → IF needs_llm → DeepSeek hoặc Anthropic → Parse JSON
      → ELSE → Wrap regex
      → Merge → Sheet Update Row (G:O)
  → Build Summary (stats)
```

## Pending — ai được xử lý?

| Điều kiện | Xử lý |
|-----------|--------|
| `segment` trống / `unclassified` | Có |
| `status=review` | Có |
| `meta.needs_llm=true` | Có |
| `meta.classify_method=llm` | Bỏ qua (đã xong) |
| `status=classified` + segment rõ | Bỏ qua |

## Rebuild

```powershell
node n8n-workflows/build-content-classify.mjs
```

Import `content-classify.workflow.json` lên n8n.

## Credential & env

| Node | Credential |
|------|------------|
| Fetch content_queue | googleApi |
| Sheet Update Row | googleApi (Code node — gán SA) |

```env
N8N_BLOCK_ENV_ACCESS_IN_NODE=false
TZ=Asia/Ho_Chi_Minh

# Ưu tiên rẻ:
DEEPSEEK_API_KEY=
DEEPSEEK_API_URL=https://api.deepseek.com/chat/completions
DEEPSEEK_MODEL=deepseek-chat

# Hoặc fallback:
ANTHROPIC_API_KEY=
ANTHROPIC_CLASSIFY_MODEL=claude-haiku-4-5-20251001
```

## Lịch

| Workflow | Giờ VN |
|----------|--------|
| Agent 1 TikTok | Thứ 2 07:00 |
| Agent 1 Facebook | Thứ 4 07:00 |
| **Agent 2 Classify** | **Hàng ngày 08:00** (200 dòng/lần) |
| Mạch 5 Scorecard | 10:00 |

~5.9k pending → ~30 ngày ở 200/d ngày (hoặc Manual run thêm).

## Batch script (local, không cần n8n)

```powershell
node scripts/batch-regex-classify-content-queue.mjs
node scripts/batch-llm-classify-content-queue.mjs --pool unclassified --limit 200
```

## Output Sheet

Cập nhật cột: `segment`, `score`, `claude_verdict`, `interest_key`, `status`, `tags`, `meta`.

Filter view gợi ý: `segment=noxh_income AND score>=70 AND status=classified`
