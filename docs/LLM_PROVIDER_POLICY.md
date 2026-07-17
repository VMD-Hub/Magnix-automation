# Magnix — Chiến lược LLM (Provider Policy)

> **Bản chuẩn** cho team và Cursor agent. Cập nhật: 2026-06-27.
>
> Triết lý: **two-tier LLM** (rẻ phân tích → premium publish pháp lý) ·
> **Sheet = editorial workspace** · **Execution không qua LLM**.

Tóm tắt kiến trúc: `ARCHITECTURE_MAGNIX.md` §8 · Router code: `n8n-workflows/code/shared/llm-router-n8n.js` · Config: `n8n-workflows/magnix-public-config.json` → `llm_task_providers`.

---

## 1. Nguyên tắc cốt lõi

| # | Nguyên tắc | Không làm |
|---|------------|-----------|
| 1 | **Rule engine trước LLM** — regex classify, L0 forbidden | Gọi LLM mọi dòng scrape |
| 2 | **DeepSeek = tier phân tích / structured JSON** (volume cao) | Dùng Anthropic cho classify hàng loạt |
| 3 | **Anthropic = tier publish pháp lý L2** (NOXH / vay / định giá) | Dùng DeepSeek cho claim pháp lý cuối không qua Legal Pack |
| 4 | **Legal Gate trước Agent 3 & 6** — `legal_retrieval_pack` inject ở Layer B | LLM tự bịa căn cứ pháp lý |
| 5 | **Google Sheet = editorial workspace** — insight, brief, draft, approve; không lưu authoritative lead/sales state | Gemini/LLM context 1M token làm “nhớ 1 năm” |
| 6 | **Execution deterministic** — Creatomate, Meta API, Canva manual | Claude sinh prompt → API ảnh/video mỗi lần |
| 7 | **Parse layer + QA L0–L3** sau mọi LLM output | Publish thẳng từ raw LLM |

Chi tiết Legal Gate: `docs/LEGAL_GATE_PIPELINE.md` · QA: `.cursor/QA_TIERS.md` · Parse: `.cursor/JSON_PARSE_LAYER.md`.

---

## 2. Ba giai đoạn (map sang pipeline Magnix)

### Giai đoạn A — Input & Analysis (DeepSeek ưu tiên)

**Mục tiêu:** Lọc signal từ noise; sinh 3–5 góc editorial / batch.

| Thành phần | Workflow | LLM | Ghi chú |
|------------|----------|-----|---------|
| Social ingest | Agent 1 `social-listening` | Không | Apify → `content_queue` |
| Classify | Agent 2 `content-classify` | **DeepSeek** → fallback Anthropic Haiku | Regex trước; LLM khi score 40–59 |
| Editorial brief | Layer B `content-editorial-brief` | **DeepSeek** | Batch 5; output `editorial_brief_v1` + legal pack |
| Scorecard | Agent 5 `content-scorecard` | Rule + optional LLM audit | Không bulk LLM |

**Input thực tế:** ~8k dòng `content_queue` + editorial calendar — **không** quét PDF báo cáo thị trường (backlog riêng nếu cần).

**Bộ nhớ editorial:** `meta.*` trên Sheet (`intake_v1`,
`editorial_brief_v1`, …) — không nhét lịch sử vào context window. Postgres House X
là store of record cho lead/ops theo ADR-013; hai phạm vi không dùng Sheet làm
integration contract.

### Giai đoạn B — Content Generation (DeepSeek + Anthropic có chọn lọc)

**Luồng:** Layer B brief → Agent 3 (lead magnet / page post) hoặc Agent 6 (video script).

| Task | Provider mặc định | Model env | QA |
|------|-------------------|-----------|-----|
| Outreach (Agent 4) | **DeepSeek** | `DEEPSEEK_MODEL` | L0–L1 |
| Video script (Agent 6) | **DeepSeek** | `DEEPSEEK_MODEL` | L0 + Legal consume |
| Lead magnet — `general_inbound` | **DeepSeek** | `DEEPSEEK_MODEL` | L0–L1 |
| Lead magnet — `noxh_income` / `valuation` / `sme_credit` | **Anthropic** | `ANTHROPIC_DRAFT_MODEL` | L0–L2 + L3 |
| Fallback khi primary fail | Provider còn lại | auto | — |

Config baked: `magnix-public-config.json` → `llm_task_providers`.

### Giai đoạn C — Execution (không LLM)

| Output | Công cụ | LLM |
|--------|---------|-----|
| Video MP4 | Agent 7 Creatomate + Pexels + TTS webhook | Không |
| Page cover | Canva manual → Drive → Sheet URL | Không (Gemini cover tắt — quota) |
| FB Page publish | Agent P Meta Graph API | Không |
| Pin notify | Telegram webhook | Không |

Agent 6 sinh **render spec JSON**; Agent 7 **thực thi** spec — không phải LLM điều khiển API render.

---

## 3. Bảng routing (source of truth)

```json
{
  "classify": "deepseek",
  "editorial_brief": "deepseek",
  "outreach": "deepseek",
  "video_draft": "deepseek",
  "content_draft": "anthropic",
  "content_draft_general": "deepseek"
}
```

**Override trên VPS** (env `n8n-workflows/.env` → deploy `/root/n8n.env`):

```bash
MAGNIX_LLM_CLASSIFY_PROVIDER=deepseek
MAGNIX_LLM_EDITORIAL_BRIEF_PROVIDER=deepseek
MAGNIX_LLM_CONTENT_DRAFT_PROVIDER=anthropic
# deepseek | anthropic
```

Router: `invokeMagnixLlm()` trong `llm-router-n8n.js` — primary → fallback nếu fail hoặc thiếu key.

---

## 4. Provider cụ thể

### DeepSeek (tier chính — ~80% token)

| Env | Mô tả |
|-----|--------|
| `DEEPSEEK_API_KEY` | **Bắt buộc** trên VPS cho Layer B + classify |
| `DEEPSEEK_API_URL` | `https://api.deepseek.com/chat/completions` |
| `DEEPSEEK_MODEL` | `deepseek-chat` (hoặc model flash trên dashboard) |

Probe local: `node scripts/probe-deepseek.mjs`

### Anthropic (tier premium — segment pháp lý + fallback)

| Env | Mô tả |
|-----|--------|
| `ANTHROPIC_API_KEY` | Cần credit cho Agent 3 legal |
| `ANTHROPIC_DRAFT_MODEL` | `claude-sonnet-4-6` |
| `ANTHROPIC_CLASSIFY_MODEL` | `claude-haiku-4-5-20251001` (fallback classify) |
| `ANTHROPIC_VIDEO_MODEL` | Fallback video script |

**Ngân sách gợi ý:** nạp tối thiểu cho ~5–10 bài legal/tuần; pipeline chạy được chỉ DeepSeek khi Anthropic hết credit.

### Gemini (không phải backbone)

| Use case | Trạng thái |
|----------|------------|
| LLM fallback tier 3 | **Backlog** — chưa wire vào router |
| Image cover (`content-page-cover`) | **Tắt** — free tier quota = 0 |
| Long context “nhớ 1 năm” | **Không dùng** — dùng editorial data có audit trên Sheet |

Khi bật billing Gemini: thêm vào `llm-router-n8n.js` sau DeepSeek/Anthropic — không thay Sheet.

---

## 5. Sơ đồ chi phí & luồng

```
[Scrape / Calendar] → L0 regex
        ↓
   DeepSeek: classify · Layer B · outreach · video beats · general draft
        ↓ legal pack (Layer K, không LLM)
   Anthropic: Agent 3 NOXH/vay/định giá (khi có credit)
        ↓ L0–L2 QA
   L3 human approve (Sheet)
        ↓
   Execution: Creatomate · Canva · Meta API (0 token LLM)
```

---

## 6. Anti-patterns (tránh)

1. **Claude sinh prompt ảnh/video mỗi lần publish** — không reproducible, khó QA.
2. **Gemini 1M context thay editorial workspace** — mất audit, tốn token, khó kiểm soát phiên bản.
3. **Một model cho mọi agent** — classify 200 dòng/ngày không nên Sonnet.
4. **Bỏ Legal Gate để “tiết kiệm bước”** — vi phạm `LEGAL_GATE_PIPELINE.md`.
5. **Publish không L3** — vi phạm `.cursor/QA_TIERS.md`.

---

## 7. Vận hành

### Deploy env lên VPS

```powershell
node scripts/generate-n8n-vps-env.mjs
# scp n8n-workflows/.env.vps.merged → root@103.57.221.93:/root/n8n.env
# restart container n8n
```

### Rebuild workflow sau đổi router

```powershell
node scripts/rebuild-all-workflows.mjs
node scripts/push-n8n-workflows.mjs
```

### Kiểm tra

```powershell
node scripts/probe-deepseek.mjs
node scripts/probe-n8n-vps-env.mjs
```

---

## 8. Backlog (chưa làm)

- [ ] Gemini fallback trong `llm-router-n8n.js`
- [ ] Pipeline đọc báo cáo thị trường PDF → insight Sheet (tách khỏi social queue)
- [x] L2 `/devil` automated trên n8n cho Agent 3 legal output — `content-draft` workflow
- [ ] Agent 3 nhánh `fb_page_post` full wire

---

## 9. Tham chiếu

| Doc | Nội dung |
|-----|----------|
| `ARCHITECTURE_MAGNIX.md` §8 | Tóm tắt LLM trong kiến trúc |
| `n8n-workflows/MAGNIX_AGENTS_REGISTRY.md` | Cron + agent map |
| `docs/LEGAL_GATE_PIPELINE.md` | Legal pack inject/consume |
| `docs/CONTENT_PRODUCT_OUTPUTS.md` | Output cuối mỗi agent |
| `.cursor/QA_TIERS.md` | L0–L3 |
