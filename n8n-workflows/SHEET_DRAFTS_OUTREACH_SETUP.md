# Sheet tabs — `content_drafts` & `outreach_queue` (Agent 3 + 4)

**Sheet:** [Database_Magnix_Lead](https://docs.google.com/spreadsheets/d/1fYB4h_BTiKXa9O3lBah-tQonWpQOQMG2aSkSfPs6yU4/edit)

Tạo tự động: `node scripts/init-magnix-sheet.mjs`

---

## Tab `content_drafts` (Agent 3 output)

Header dòng 1:

```
source_normalized_key	post_id	segment	title	hook_line	artifact_markdown	cta_opt_in	disclaimer	export_hint	status	qa_tier	created_at	source	meta
```

| Cột | Ghi chú |
|-----|---------|
| `source_normalized_key` | Link về `content_queue.normalized_key` |
| `title` | Tiêu đề lead magnet |
| `hook_line` | ≤25 từ |
| `artifact_markdown` | Bảng/checklist Markdown |
| `status` | `draft` → human `approved` |
| `qa_tier` | `L0` sau forbidden check |

**Input Agent 3:** `content_queue` — `status=classified`, `score≥70`, chưa có `meta.draft_created`.

---

## Tab `outreach_queue` (Agent 4 output)

Header dòng 1 (Phase 0 — 18 cột):

```
source_normalized_key	draft_title	segment	warmth	variant_a_cold	variant_b_after_engagement	variant_c_follow_up	ghost_check_passed	compliance_note	status	l3_approved	variant_used	sent_at	replied	opt_in	created_at	source	meta
```

| Cột | Ghi chú |
|-----|---------|
| `warmth` | `cold` \| `commented` \| `partner` \| … — từ `content_drafts.meta.outreach_warmth` |
| `variant_a_cold` | ≤3 dòng Zalo cold |
| `l3_approved` | `false` — **bắt buộc true trước khi gửi** |
| `variant_used` | Human: `a` / `b` / `c` sau khi gửi |
| `sent_at` / `replied` / `opt_in` | Tracking Phase 0 (thủ công) |
| `status` | `draft` |

**Input Agent 4:** `content_drafts` — `status=draft|approved`, chưa `meta.outreach_created`.

**Warmth trước cron:** `node scripts/patch-draft-outreach-warmth.mjs --row N --warmth commented`

**SOP gửi tay:** `docs/OUTBOUND_RUNBOOK.md`

---

## Rebuild workflows

```powershell
node n8n-workflows/build-content-draft.mjs
node n8n-workflows/build-outreach-queue.mjs
```

Deploy: xem `VPS_DEPLOY_ALL_AGENTS.md`
