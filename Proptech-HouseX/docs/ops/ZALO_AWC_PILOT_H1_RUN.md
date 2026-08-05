# Pilot run — Zalo AWC v1 (H1 Checklist NOXH)

> Cohort + đo 14 ngày. Chi tiết playbook: `ZALO_UID_AWC_HOOK_PLAYBOOK.md`.

## Tham số vòng này

| Field | Value |
|-------|-------|
| `cohort_id` | `zalo-awc-20260730-v1` |
| Hook | **H1** — Checklist hồ sơ / rủi ro NOXH |
| Artifact | Đã có web: `/vu-nguyen/checklist-noxh` (source `lib/personal-brand/vu-nguyen/checklist-noxh-content.ts`) |
| N | 300 |
| Đo | D0 → D14 |
| KEYWORD Warm | `CHECKLIST` |
| CTA Contact | Form `/lien-he` hoặc “Để SĐT — gửi bản điền / giải thích checklist” |

## Copy OA / Page (draft — L0 pass, L2/L3 trước publish)

**Hook line (≤125 ký tự ưu tiên):**  
Thu nhập / hồ sơ NOXH — 10 điểm nên tick trước khi đặt cọc?

**Thân (Value-First):**  
Không phải checklist bán hàng. Là khung tự rà: pháp lý dự án, sổ–HĐ, đối tượng NOXH, dòng tiền.  
Link: `timnhaxahoi.com/vu-nguyen/checklist-noxh`

**CTA Warm:**  
Inbox / comment **CHECKLIST** nếu muốn bản dùng tick tay + ghi chú lề.

**CTA Contact (cuối hoặc follow-up D3–7):**  
Muốn mình gửi bản điền theo hồ sơ bạn — để lại SĐT (không gọi chào bán dự án).

**Cấm:** cam kết duyệt, lãi %, “chắc chắn vay được”, urgency giả.

## Vận hành D0–D14

1. `npm run cohort:zalo-awc -- --size 300 --apply`
2. Publish post OA/Page (L3) — gắn UTM/`cohort_id` trong note
3. Mỗi ngày cập nhật `scripts/_tmp-zalo-awc-kpi.json` → A / W / C
4. Warm → `ops_status=reviewing` trên `/admin/inbound-leads` (khi nhận diện được)
5. Contact + SĐT → promote Ops Lead
6. D14: so ngưỡng A≥8% · W≥2% · C≥0.5% → quyết định scale dump

## Owner checklist

- [ ] Cut cohort `--apply`
- [ ] L3 approve copy
- [ ] Publish + ghi D0
- [ ] Sheet/KPI file cập nhật
- [ ] D14 review
