# Swing CRO — Bộ não quân sư (Chief Risk Officer)

> **Không thay `/trade`** (phân tích mã) · **bổ sung** chiến lược danh mục + không bỏ lỡ VN100  
> Gate: [SWING-PORTFOLIO.md](./SWING-PORTFOLIO.md) · Execution: [SWING-EXECUTION-PLAYBOOK.md](./SWING-EXECUTION-PLAYBOOK.md)

## Hai tầng universe

```
┌─────────────────────────────────────────────────────────┐
│  Tầng A — CORE (3 mã)     ACB · HPG · MWG               │
│  80% quyết định · bias T1/T2/T3 sẵn · tab Watchlist     │
├─────────────────────────────────────────────────────────┤
│  Tầng B — SATELLITE       VN100 (quét hàng tuần)        │
│  tab Universe_Scan · promote → Watchlist CHỜ (max 2)    │
├─────────────────────────────────────────────────────────┤
│  Tầng C — CASH            40–75% NAV · vị thế chủ động  │
└─────────────────────────────────────────────────────────┘
```

**Luật:** Mã Satellite **không bị cấm** — cần `/trade` + `cro_score` + promote + size ≤25% lần đầu.

---

## Tab Universe_Scan (Google Sheet)

| Cột | Ý nghĩa |
|-----|---------|
| rank | Thứ tự CRO sau `rank` |
| symbol | Mã CP |
| tier | CORE \| SATELLITE |
| bucket | bank · cyclical · retail · other |
| verdict | VAO_DUOC · CHO_THEM · PASS (từ `/trade`) |
| cro_score | 0–100 heuristic (mode BEHIND −8) |
| rr_planned | R:R kế hoạch |
| trigger_status | NOT_READY · WATCH · SAN_SANG |
| action | HOLD · PROMOTE · TREO · PASS · CORE |
| scan_week | ISO tuần (2026-W26) |
| last_scan | Ngày quét |
| entry_zone / stop / target | Từ `/trade` |
| notes | Thesis 1 dòng |
| source | /trade · CTCK · manual |

Setup lần đầu:

```bash
node scripts/swing-cro.mjs init-tab
```

---

## Ritual scan hàng tuần (thứ 2)

```bash
node scripts/swing-cro.mjs ritual    # briefing: mode, core, satellite, mệnh lệnh
```

| Bước | Việc | Lệnh |
|------|------|------|
| 1 | Đọc mode danh mục | `swing-log portfolio` |
| 2 | Scan 5–10 mã VN100 (CTCK + chart) | `/trade MÃ` từng ứng viên |
| 3 | Ghi Satellite mới | `swing-cro add --symbol FPT --verdict CHO_THEM --rr 1.4 --trigger WATCH --notes "..."` |
| 4 | Xếp hạng lại | `swing-cro rank` |
| 5 | Promote tối đa **2** Satellite | `swing-cro promote --symbol FPT` |
| 6 | Loại mã yếu | `swing-cro pass --symbol TCB` |
| 7 | Đồng bộ Watchlist | `swing-watchlist review` |
| 8 | Kiểm tra sổ | `swing-log validate` |

**Thứ 6:** `ritual` ngắn + `swing-kpi-read.mjs` — không bắt buộc scan đầy đủ.

---

## cro_score (heuristic)

| Thành phần | Điểm |
|------------|------|
| Verdict VÀO / CHỜ | +38 / +22 |
| R:R ≥ 1.5 | +22 |
| Trigger SAN_SANG | +24 |
| Bucket chưa có OPEN | +8 |
| Mode BEHIND | −8 |

**action tự đề xuất:**

| Score | Trigger | Action |
|-------|---------|--------|
| CORE | — | CORE (Watchlist cố định) |
| ≥70 + SAN_SANG | Satellite | TREO |
| ≥55 | Satellite | PROMOTE |
| <35 hoặc PASS | Satellite | PASS |

---

## Promote Satellite → Watchlist

```bash
node scripts/swing-cro.mjs promote --symbol FPT
```

- Tối đa **2 mã Satellite** trên Watchlist (ngoài ACB/HPG/MWG)
- Status = **CHỜ** · exec mặc định T2 passive
- Trước OPEN: `/trade` DATE_LOCK · gate danh mục · size ≤25%

---

## Mệnh lệnh theo PORTFOLIO MODE

| Mode | CRO |
|------|-----|
| **ON TRACK** | Core ưu tiên · tối đa 2 OPEN/tuần · Satellite chỉ khi score ≥55 |
| **BEHIND** | 1 OPEN/tuần · size −25% · không promote Satellite trừ score ≥70 |
| **STOP** | Không OPEN · chỉ ritual theo dõi |

---

## Ví dụ tuần hiện tại (template)

| Mã | Tier | CRO action |
|----|------|------------|
| ACB | CORE | Giữ OPEN |
| HPG | CORE | LIMIT_TREO 23.200 |
| MWG | CORE | CHỜ T3 |
| FPT | SATELLITE | HOLD → promote nếu /trade tốt |
| TCB | SATELLITE | PASS (trùng bucket bank) |

---

## Scripts

| Lệnh | Script |
|------|--------|
| Ritual tuần | `swing-cro.mjs ritual` |
| Thêm ứng viên | `swing-cro.mjs add` |
| Xếp hạng | `swing-cro.mjs rank` |
| Đưa vào Watchlist | `swing-cro.mjs promote` |
| Core + T2 | `swing-watchlist.mjs` |
| OPEN/CLOSE | `swing-log.mjs` |

**Cursor:** agent chạy `ritual` đầu tuần khi user hỏi chiến lược / chọn mã.
