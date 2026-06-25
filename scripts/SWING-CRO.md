# Swing CRO — Bộ não quân sư (Chief Risk Officer)

> **Đọc trước:** [SWING-RESEARCH-CONTRACT.md](./SWING-RESEARCH-CONTRACT.md)  
> **5 mã trên Sheet không phải giới hạn universe** — cũng **không phải chuẩn đo KPI**.  
> Satellite chỉ tồn tại sau **/trade + giá live VNStock/TCBS**.

Gate: [SWING-PORTFOLIO.md](./SWING-PORTFOLIO.md) · Execution: [SWING-EXECUTION-PLAYBOOK.md](./SWING-EXECUTION-PLAYBOOK.md)

## Hai việc tách bạch

| | Chuẩn đo (KPI / real-gate) | CRO (nghiên cứu tuần) |
|---|---------------------------|------------------------|
| Hỏi | Bạn trade có kỷ luật không? | Thị trường đang cho setup nào? |
| Dữ liệu | Lệnh OPEN/CLOSE đã ghi | **VNStock / TCBS phiên hiện tại** |
| Cố định 5 mã? | **Không** | **Không** |

**Watchlist** = sổ tay vị thế paper (ảnh chụp danh mục bạn theo dõi).  
**Universe_Scan** = kết quả **khám phá** tuần — động, có `source=tcbs:yyyy-mm-dd`.

---

## Ba tầng vận hành

```
CORE (Watchlist)     — mã đang theo dõi / đang giữ (từ portfolio paper)
SATELLITE (Scan)     — ứng viên tuần, chỉ sau /trade + vnstock|tcbs
CASH                 — buffer 40%+ NAV
```

`cro_score` **không phải** khuyến nghị đầu tư — chỉ xếp thứ tự **sau** phân tích live.

---

## Tab Universe_Scan

| Cột | Ý nghĩa |
|-----|---------|
| source | `portfolio_snapshot` (Core) · **`vnstock:date` / `tcbs:date`** (Satellite) |
| action | CORE · HOLD · PROMOTE · NEED_RESEARCH · PASS |

Setup:

```bash
node scripts/swing-cro.mjs init-tab
node scripts/swing-cro.mjs research-reset   # Core từ Watchlist · xóa Satellite giả
```

---

## Ritual thứ 2 — thị trường trước, mã sau

```bash
node scripts/swing-cro.mjs ritual
```

1. Quét **VN100 / ngành** trên TCBS hoặc VNStock  
2. `/trade MÃ` — DATE_LOCK, giá phiên thật  
3. `swing-cro add --data-source tcbs --session-date 2026-06-25 ...`  
4. `rank` → `promote` (max 2 Satellite)  
5. `swing-log` chỉ khi gate pass  

**Ritual chưa đủ** nếu tuần đó **0 Satellite** có `vnstock:|tcbs:`.

---

## Lệnh Satellite (bắt buộc nguồn live)

```bash
node scripts/swing-cro.mjs add --symbol VNM \
  --data-source tcbs --session-date 2026-06-25 \
  --verdict CHO_THEM --rr 1.5 --trigger WATCH \
  --zone "52-54" --stop "49" --target "58" \
  --notes "/trade DATE_LOCK 2026-06-25"
```

Promote từ chối nếu thiếu `tcbs:|vnstock:`.

---

## Agent — không được

- Lặp phân tích 5 mã seed khi user hỏi chiến lược tuần  
- Báo cáo verdict không có ngày phiên + nguồn giá  
- Gọi template FPT/TCB là “đề xuất thuật toán”  

---

## Scripts

| Lệnh | Script |
|------|--------|
| Ritual | `swing-cro.mjs ritual` |
| Reset nghiên cứu | `swing-cro.mjs research-reset` |
| Thêm ứng viên live | `swing-cro.mjs add --data-source ...` |
| Watchlist / OPEN | `swing-watchlist` · `swing-log` |
