# Content Pipeline — Backlog & ghi nhận chất lượng

> Các mục chưa hoàn thiện trong luồng **social listening → content publish**. Không chặn smoke test kỹ thuật (Page Publish, Sheet, Graph API).

---

## 2026-06-26 — Bài test Page Publish không đại diện chất lượng sản xuất

**Quan sát:** Dòng `test:page_publish:001` trên `content_drafts` (seed script) hiển thị nội dung markdown đơn giản — **chưa** đúng cấu trúc bài Page/SEO Magnix (Q&A H2, hook AIO, `editorial_brief_v1`, legal pack).

**Nguyên nhân:**

| Giai đoạn | Hiện trạng |
|-----------|------------|
| Seed test | Ghi thẳng `artifact_markdown` + `approved` — **bỏ qua** Listen → Classify → Layer B → Agent 3 |
| Agent 3 (`content-draft`) | Mặc định **lead magnet** (`artifact_markdown`, bảng checklist) — chưa nhánh `fb_page_post` / `website_article` đầy đủ contract |
| Layer B | Có `qa_backbone` nhưng chưa bắt buộc trước mọi bài Page |
| Kênh 1 playbook | `legal-sources/channels/aio-seo.md` + `docs/CONTENT_PRODUCT_OUTPUTS.md` §5 — **chưa** wire end-to-end |

**Mục tiêu hoàn thiện (sau go-live kỹ thuật):**

```
Social listening (pain thật)
  → Classify (segment + requires_legal_kb)
  → Layer B: editorial_brief_v1 (qa_backbone, one_line_insight)
  → + legal_retrieval_pack
  → Agent 3 mode fb_page_post HOẶC website_article
       (hook, body Q&A, disclaimer, source_refs, meta title/desc nếu web)
  → L2 /devil + L3 approve
  → content-page-publish
```

**Tiêu chí “đủ chất lượng” (draft):**

- Mỗi H2 = câu hỏi khách thật (từ `intake_v1` / listen), không generic
- `answer_angle` từ brief → thành đoạn trả lời, không copy nguyên markdown checklist
- Claim pháp lý chỉ từ `legal_retrieval_pack`; có disclaimer
- `product_type` rõ: `fb_page_post` vs `lead_magnet` vs `website_article`
- Không publish từ seed script trong vận hành thường — chỉ dùng smoke test API

**Trạng thái:** `recorded` — Page Publish E2E pass. Tiếp theo: Agent 3 `fb_page_post` + editorial calendar seed.

---

## 2026-06-26 — Page growth pack (Drive + calendar + ảnh publish)

| Hạng mục | File |
|----------|------|
| Drive pack nguồn | `legal-sources/noxh/drive-pack/` |
| Init folder | `scripts/init-magnix-drive-noxh-templates.mjs` |
| Editorial 2 tuần | `docs/EDITORIAL_CALENDAR_PAGE_2W.md` + `scripts/seed-editorial-calendar-page.mjs` |
| Prompt Page post | `ai-agents-prompts/n8n__fb-page-post-draft.md` |
| Publish ảnh + pin notify | `03-post-facebook.js`, `06-notify-pin-request.js` |

**Drive:** Folder `Magnix_NOXH_Mau_Ho_So` — upload file **thủ công** trên UI (SA không có storage quota). Link: `magnix-drive-folders.json` → `noxh_templates.public_url`.

---

## Việc liên quan (chưa làm)

- [ ] Agent 3: branch `product_type=fb_page_post` wire prompt trong n8n workflow
- [ ] Filter `content-page-publish`: ưu tiên row có `meta.editorial_brief_at` hoặc `source` ≠ `test_page_publish`
- [ ] Layer B: `recommended_formats` → auto `target_channel=facebook_page` khi format = carousel/page post
- [ ] Scorecard / human rubric: so khớp bài đăng với `qa_backbone` gốc

**Tài liệu:** `docs/NOXH_THREE_CHANNEL_ARCHITECTURE.md` · `docs/LEGAL_GATE_PIPELINE.md` · `ai-agents-prompts/n8n__editorial-brief.md`

---

## 2026-06-27 — Hoàn thiện pipeline trước Canva (ảnh/video cuối cùng)

> **Chiến lược:** Làm trọn text · brief · script · wire workflow trước; **Canva / quay / MP4** là lớp cuối (batch một lần).  
> Page Publish **không bắt buộc** `publish_image_url` — có thể đăng `link` (Drive) hoặc text; ảnh chỉ nâng reach.

### Trạng thái editorial 30 slot (Sheet)

| Hạng mục | Xong | Còn lại |
|----------|------|---------|
| Seed `content_drafts` | 30 | — |
| Layer B `editorial_brief_v1` | 5 (#01–05) | 25 (#06–30) |
| Agent 3 Page text (`run-agent3-fb-page-post.mjs`) | 1 (#05) | 9 page posts (#02,08,11,14,17,20,23,26,29) |
| `video_drafts` script/beats (reels) | 1 (#06 CT07) | 13 reels |
| Carousel slide copy (text outline) | 0 | 6 |
| `publish_image_url` / Canva | 0 | 10 page + 6 carousel |
| MP4 reel | 0 | 14 |

### Làm trước — **không cần Canva**

| # | Việc | Công cụ | Ghi chú |
|---|------|---------|---------|
| 1 | Layer B batch #06–30 | `run-editorial-layer-b-batch.mjs` (5/lần) | DeepSeek VPS OK |
| 2 | Agent 3 text 10 bài Page | `run-agent3-fb-page-post.mjs --editorial NN` | Giữ `status=draft` |
| 3 | Reels: script + beats → `video_drafts` | Mở rộng pattern `seed-editorial-ct07-video-draft.mjs` | Hybrid presenter+slide |
| 4 | Carousel: outline slide (markdown) | Agent 3 hoặc script `carousel` (backlog) | Chưa cần PNG |
| 5 | Export Canva brief (chỉ text HEADLINE) | `export-canva-brief.mjs` | Làm sẵn, export ảnh sau |
| 6 | Sửa Layer B lệch chủ đề | `topic_lock` + ưu tiên editorial trong filter | Đã có filter; cân nhắc re-brief #01–04 |
| 7 | Wire Agent 3 `fb_page_post` trên n8n | `content-draft` + prompt `n8n__fb-page-post-draft.md` | Hiện chạy local script |
| 8 | Push workflow LLM router lên VPS | `rebuild-all-workflows.mjs` + push | Classify, draft, video, Layer B |
| 9 | E2E Page Publish **link mode** (không ảnh) | 1 bài test `approved` + `publish_link` | Verify cron trước batch Canva |
| 10 | Legal pack trên `content_drafts` | Sync từ queue hoặc bundle inject | #05 thiếu pack trên draft |

### Chỉ làm **sau cùng** (cần asset thủ công)

| Format | Asset | Script patch |
|--------|-------|--------------|
| `fb_page_post_image` (10) | Canva PNG 1080² | `upload-manual-asset-to-drive.mjs --type cover` |
| `carousel_image` (6) | Canva 6–10 slide | Drive + meta (backlog wire) |
| `fb_reels` (14) | Quay + CapCut MP4 | `upload-manual-asset-to-drive.mjs --type video` |

### Thứ tự đề xuất (2 tuần editorial)

```
Tuần A — Text pipeline
  Layer B #06–15 → Agent 3 page #02,08,11,14
  Seed video_drafts #01,03,07,06,… (reels)
  Push + smoke Page Publish (link, 1 bài)

Tuần B — Text pipeline tiếp
  Layer B #16–30 → Agent 3 page còn lại
  Carousel outline 6 bài
  Re-export Canva briefs 10 bài (file sẵn)

Tuần C — Assets (bạn)
  Canva batch covers → upload → approved hàng loạt
  Reels/carousel video → upload → L3 → publish
```

**Tài liệu:** `docs/MANUAL_ASSETS_RUNBOOK.md` · `docs/LLM_PROVIDER_POLICY.md` · `scripts/run-agent3-fb-page-post.mjs`
