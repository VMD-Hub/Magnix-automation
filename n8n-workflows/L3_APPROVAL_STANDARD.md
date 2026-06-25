# Magnix — Quy trình duyệt L3 (thống nhất)

Áp dụng cho tab **`video_drafts`**, **`content_drafts`**, **`outreach_queue`**.

Mọi dòng cần L3 approve phải tạo Telegram notification theo `docs/TELEGRAM_APPROVAL_NOTIFICATIONS.md`. Không mặc định người vận hành tự mở Sheet để kiểm tra.

---

## Giá trị chuẩn (dropdown — không gõ tay)

| Cột | Chọn từ list | Agent đọc |
|-----|--------------|-----------|
| `status` | `draft` · `approved` · `rejected` | **chữ thường** (Agent 7: phải là `approved`) |
| `l3_approved` | **Checkbox** ☑ = duyệt (TRUE) · ☐ = chưa (FALSE) | Boolean hoặc `true`/`TRUE`/`yes` |

**Không dùng:** `Approved`, `Đã duyệt`, `TRUE` viết sai cột, dấu cách thừa.

Cài dropdown trên Sheet:

```powershell
node scripts/apply-sheet-l3-validation.mjs
```

---

## Luồng theo loại nội dung

### A. Kịch bản video (`video_drafts`) — Agent 6 → 7

| Bước | Ai | Hành động trên Sheet |
|------|-----|----------------------|
| 1 | Agent 6 | Tạo dòng: `status=draft`, `l3_approved=false` |
| 2 | **Bạn (L3)** | Đọc/sửa `hook_3s`, `spoken_script`, `caption` |
| 3 | **Bạn** | Duyệt: `status=approved` + **tick checkbox** cột `l3_approved` |
| 4 | Agent 7 | Render MP4 → `status=ready_for_review`, `meta.drive_view_url` |
| 5 | **Bạn (L3 lần 2)** | Xem MP4 trên Drive → đăng TikTok/Reels |
| 6 | **Bạn** | (Tuỳ chọn) `status=published` sau khi đăng |

**Từ chối:** `status=rejected` — Agent 7 **bỏ qua**, không render.

### B. Lead magnet bài viết (`content_drafts`) — Agent 3

| Bước | Hành động |
|------|-----------|
| 1 | Agent 3 tạo `status=draft` |
| 2 | **Bạn** sửa `artifact_markdown`, `hook_line` |
| 3 | **Bạn** `status=approved` → dùng publish / Agent 4 |

(Không có cột `l3_approved` — chỉ cần `status`.)

### C. Tin Zalo outreach (`outreach_queue`) — Agent 4

| Bước | Hành động |
|------|-----------|
| 1 | Agent 4 tạo `status=draft`, `l3_approved=false` |
| 2 | **Bạn** đọc `variant_a_cold` … |
| 3 | **Bạn** `l3_approved=true` → **gửi Zalo thủ công** |

---

## Checklist duyệt 1 dòng video (60 giây)

- [ ] Hook ≤15 từ, không mở đầu "Xin chào mọi người"
- [ ] Không cam kết lãi suất % cụ thể / duyệt vay 100%
- [ ] CTA soft (COMMENT + keyword NOXH/CHECKLIST)
- [ ] Disclaimer có "thông tin tham khảo"
- [ ] → `status=approved` + `l3_approved=true`

---

## Filter view gợi ý (Google Sheet)

**video_drafts — Chờ duyệt kịch bản:**  
`status = draft` AND `l3_approved = false`

**video_drafts — Sẵn render (Agent 7):**  
`status = approved` AND `l3_approved = true`

**video_drafts — Chờ xem MP4:**  
`status = ready_for_review`

---

## Agent không tự duyệt

Magnix **không** tự set `approved` / `l3_approved=true` — mọi publish/render đều qua human gate L3.

## Telegram approval

Khi Agent tạo dòng cần duyệt:

1. Ghi `status=draft` hoặc `queued_review`.
2. Tạo `notification_events.event_type=approval_needed`.
3. Gửi Telegram tới owner/ops với link review.
4. Reminder tự chạy nếu quá SLA chưa `approved` / `rejected`.
5. Khi duyệt hoặc từ chối, notification được mark `resolved`.
