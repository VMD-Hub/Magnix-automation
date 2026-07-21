# Early Signal Review — hàng đợi duyệt tin sớm

> **Ops / L3 only.** ADR-016 · QA L0–L3 · [`NOXH_SPONSOR_WATCHLIST.md`](./NOXH_SPONSOR_WATCHLIST.md) · [`INFO_TRUST_LADDER_ALLOWLIST.md`](./INFO_TRUST_LADDER_ALLOWLIST.md).  
> SoR: Postgres `early_signal_briefs` (House X). **Không** Google Sheet.  
> **Không** auto-publish / auto-nurture từ scrape.

## Mục tiêu

Tổng hợp tín hiệu T1 (báo / brand / CHANNEL) → đóng gói bản **người đọc** → duyệt L3 **trước** khi:

- Publish bài / ghi chú dự án tin sớm
- Cho phép nurture / in-app waitlist từ tin đó

`LaunchTrigger` / CTA mở bán / voice vẫn chỉ T4 SoR — duyệt tin sớm **không** mở quyền gọi.

## Luồng trạng thái

```
CAPTURED → PACKAGED → PENDING_L3 → APPROVED | REJECTED
                APPROVED → PUBLISHED (khi biên tập publish bài / ghi chú)
```

| Status | Ý nghĩa | Ai |
|--------|---------|-----|
| `CAPTURED` | Intake ops (URL, tier, brand/channel) | Super / biên tập |
| `PACKAGED` | Đã có preview reader (title/body/disclaimer/CTA) | Biên tập |
| `PENDING_L3` | Chờ Chủ quản | Sau L0–L1 (+ L2 nếu cần) |
| `APPROVED` | Được phép publish / bật nurture sau | `ADMIN_SECRET` (super) |
| `REJECTED` | Từ chối — sửa lại hoặc hủy | Super |
| `PUBLISHED` | Đã đưa tin chính thức (article linked) | Super |

Admin UI: `/admin/early-signals`.

## Hai lớp trên màn duyệt

| Panel | Nội dung |
|-------|----------|
| **Ops dossier** | `tier`, `pressUrl`, `sxdUrl`, `groupSlug`, `channelSlug`, `roleHint`, `resolveStatus`, `projectId`, checklist |
| **Reader preview** | `readerTitle`, `readerBody`, `readerDisclaimer`, `ctaLabel`, citation đã chọn — **không** mã T1/MST/allowlist |

CHANNEL / CONTRACTOR **không** hiện như CĐT trên preview.

## Checklist L0 / L1 (trước `PENDING_L3`)

**L0 (code):**

- Tier `T1_PRESS`: `readerDisclaimer` bắt buộc (không rỗng).
- Nếu tier ≠ `T4_SOR`: cấm pattern FOMO kiểu «đang mở bán», «sắp hết suất», giá chốt chắc (regex trong `lib/leads/early-signal-gates.ts`).

**L1 (biên tập):**

- Có ít nhất một nguồn (`pressUrl` hoặc `sxdUrl`).
- `readerTitle` + `readerBody` đủ đọc.
- `roleHint=CHANNEL` → đã ghi CĐT/`groupSlug` hoặc `resolveStatus=UNLINKED` / `CHANNEL_PENDING_SPONSOR` (không bịa brand).

**L2:** `/devil` khi claim pháp lý/giá mạnh — verdict `human_review` → vẫn L3.

**L3:** Duyệt trên Admin; reject có `rejectReason`.

## Nurture

- Duyệt `APPROVED` **không** tự gửi waitlist.
- Phase sau: cờ `nurtureOnApprove` + SC-6 chỉ khi APPROVED.

## Tham chiếu code

- Prisma: `EarlySignalBrief` / `early_signal_briefs`
- Data: `lib/data/early-signal.ts`
- Gates: `lib/leads/early-signal-gates.ts`
- API: `/api/admin/early-signals`, `/api/admin/early-signals/[id]`
- UI: `components/admin/early-signal-review-board.tsx`
