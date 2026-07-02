# Outbound Phase 0 — Runbook vận hành

> **Phạm vi:** Agent 4 sinh script → L3 duyệt → **gửi Zalo thủ công** → ghi tracking trên Sheet.  
> **Chưa có:** gửi tự động, match `uid_leads` (Phase 1).  
> **Cập nhật:** 2026-06-28

---

## 1. Mục tiêu Phase 0

| Mục tiêu | Cách đo |
|----------|---------|
| Agent 4 chạy ổn định trên VPS | Cron 09:30 · ≥1 execution OK/ngày có draft |
| Quy trình gửi tay rõ ràng | Runbook này + không gửi khi `l3_approved≠true` |
| Baseline reply rate | ≥10 tin gửi · ghi `sent_at` + `replied` trên Sheet |
| Context động | `warmth` trên `outreach_queue` ≠ luôn `cold` khi draft warm |

---

## 2. Luồng hàng ngày

```
09:00  Agent 3 → content_drafts (lead magnet / page post)
09:30  Agent 4 → outreach_queue (3 variant + warmth)
       └─ Telegram: approval_needed + deep link cột l3_approved
10:00  Human L3: đọc variant → sửa nếu cần → l3_approved=true
11:00  Gửi Zalo thủ công (ưu tiên warm trước)
       └─ Ghi variant_used, sent_at, replied, opt_in
```

**Magnix không tự gửi Zalo** — Agent chỉ sản xuất copy đã QA L0–L1.

---

## 3. Sheet tabs liên quan

### `content_drafts` (input Agent 4)

Agent 4 lấy row khi:

- `status` = `draft` hoặc `approved`
- `title` + `hook_line` không trống
- `meta.outreach_created` ≠ `true`

**Đặt warmth trước khi chạy Agent 4** — thêm vào cột `meta` (JSON):

```json
{
  "outreach_warmth": "commented",
  "outreach_context": "sau_comment"
}
```

| `outreach_warmth` | LLM context | Variant ưu tiên khi gửi |
|-------------------|-------------|------------------------|
| `cold` (mặc định) | `cold` | `variant_a_cold` |
| `commented` | `sau_comment` | `variant_b_after_engagement` |
| `dm_inbound` | `sau_comment` | `variant_b_after_engagement` |
| `ads_optin` | `sau_comment` | `variant_b_after_engagement` |
| `partner` | `cold` | `variant_a_cold` (có consent partner) |
| `follow_up` | `follow_up` | `variant_c_follow_up` |

Override trực tiếp: `outreach_context` = `cold` | `sau_comment` | `follow_up`.

### `outreach_queue` (output Agent 4)

Header (18 cột):

```
source_normalized_key | draft_title | segment | warmth | variant_a_cold |
variant_b_after_engagement | variant_c_follow_up | ghost_check_passed |
compliance_note | status | l3_approved | variant_used | sent_at | replied |
opt_in | created_at | source | meta
```

| Cột | Ai ghi | Ghi chú |
|-----|--------|---------|
| `warmth` | Agent 4 | Từ `content_drafts.meta` |
| `l3_approved` | Human | `true` trước khi gửi |
| `variant_used` | Human | `a` / `b` / `c` hoặc tên đầy đủ |
| `sent_at` | Human | ISO hoặc `2026-06-28 11:05` |
| `replied` | Human | `true` / `false` |
| `opt_in` | Human | Khách nhận file / hẹn gọi = `true` |

Cập nhật header tab (nếu thiếu cột mới):

```powershell
node scripts/init-magnix-sheet.mjs
```

---

## 4. Chọn variant khi gửi

| Tình huống | Dùng | Cột Sheet |
|------------|------|-----------|
| Chưa từng nhắn, list lạnh có consent | **A** — cold | `variant_a_cold` |
| Đã comment/DM/opt-in trên Page | **B** — warm | `variant_b_after_engagement` |
| Đã gửi A/B, chưa reply ≥3 ngày | **C** — follow-up | `variant_c_follow_up` |

Đọc `meta.primary_variant` trên row (Agent 4 ghi sẵn) nếu không chắc.

**Segment pháp lý** (`noxh_income`, `valuation`, `sme_credit`):

- Không cam kết duyệt vay / lãi suất cố định
- Giữ disclaimer ngắn nếu claim số liệu
- Nghi ngờ → sửa tay trên Sheet trước L3

---

## 5. Quy trình L3 (10 phút)

1. Mở Telegram link hoặc tab `outreach_queue`
2. Đọc cả 3 variant — so `compliance_note`
3. Sửa text trực tiếp trên Sheet nếu cần (giữ ≤3 dòng cho A)
4. Set `l3_approved` = `true`
5. Copy variant đã chọn → Zalo
6. Ghi `variant_used`, `sent_at`
7. Khi khách reply: `replied=true`; nếu nhận checklist/Drive: `opt_in=true`

**Không gửi khi:** `ghost_check_passed=false`, `status≠draft`, hoặc chưa L3.

---

## 6. Flywheel tay (trước Phase 1)

Chưa có pipeline `uid_leads` → outreach tự động. Phase 0 test bằng tay:

1. Chọn 1–3 row `uid_leads` cùng `segment` với draft
2. Trên `content_drafts` tương ứng, set `meta.outreach_warmth`:
   - Partner lead → `partner`
   - Khách comment bài Page → `commented`
3. Chạy Agent 4 (manual hoặc đợi cron)
4. L3 → gửi variant B/A phù hợp
5. Ghi tracking → tính reply rate sau 2 tuần

**Cap khuyến nghị Phase 0:** ≤10 tin/ngày · warm trước cold.

---

## 7. Lệnh diagnostic & deploy

```powershell
# Draft nào chờ Agent 4?
node scripts/diagnose-agent4-candidates.mjs

# Queue outreach: chờ L3 / đã gửi / chưa reply
node scripts/diagnose-outreach-queue.mjs

# Rebuild + push workflow sau sửa code
node n8n-workflows/build-outreach-queue.mjs
node scripts/rebuild-all-workflows.mjs   # hoặc chỉ build agent 4
node scripts/push-n8n-workflows.mjs

# Test resolver context
node tests/resolve-outreach-context.test.mjs
```

**Trigger thủ công trên n8n:** workflow `Magnix Agent 4 — Outreach Queue` → Execute.

---

## 8. KPI baseline (2 tuần)

Ghi tay hoặc pivot Sheet:

| Metric | Công thức | Mục tiêu Phase 0 |
|--------|-----------|------------------|
| Reply rate | `replied=true` / đã `sent_at` | ≥15% (warm), ≥5% (cold) |
| Opt-in rate | `opt_in=true` / sent | ≥8% |
| Warm ratio | warm sent / total sent | ≥50% |
| L3 turnaround | sent_at − created_at | <24h |

---

## 9. Troubleshooting

| Triệu chứng | Nguyên nhân | Fix |
|-------------|-------------|-----|
| Agent 4 empty | Hết draft hoặc đã `outreach_created` | `diagnose-agent4-candidates.mjs` |
| `warmth` luôn `cold` | Thiếu meta trên draft | Set `outreach_warmth` trước cron |
| L0/L1 fail | Từ cấm hoặc cold >3 dòng | Sửa prompt / re-run row |
| Append Sheet lỗi | Header tab cũ 13 cột | `init-magnix-sheet.mjs` |
| Telegram không báo | Notify workflow / chat_id | `docs/TELEGRAM_APPROVAL_NOTIFICATIONS.md` |

---

## 10. Việc tiếp theo (Phase 1)

- Tab `prospect_queue` — qualify `uid_leads`
- Match draft theo segment tự động
- Outreach cá nhân hóa theo `uid` + `text` lead

Xem kế hoạch tổng trong chat planning · `ARCHITECTURE_MAGNIX.md` §3.2.
