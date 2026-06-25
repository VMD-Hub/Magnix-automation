# Swing — Research contract (nguồn thị trường thật)

> **5 mã (ACB, HPG, MWG, FPT, TCB) KHÔNG phải giới hạn universe** — cũng **không phải chuẩn đo KPI**.  
> Đó chỉ là **ảnh chụp danh mục paper / seed Sheet** tại một thời điểm.

## Hai việc khác nhau — không được trộn

| | Chuẩn đo (đo lường) | Nghiên cứu (khám phá) |
|---|---------------------|------------------------|
| **Mục tiêu** | Bạn có **kỷ luật** như trade thật không? | Thị trường **đang cho** setup nào? |
| **Đầu vào** | Lệnh đã OPEN/CLOSE + stop/target/rule | **Giá & volume live** VNStock / TCBS |
| **Đầu ra** | Win rate, R:R, net %, real-gate | Danh sách **ứng viên tuần** (động) |
| **Cố định 5 mã?** | **Không** | **Không** |

**KPI / real-gate** đo **hành vi & chất lượng lệnh** — không đo “ACB có tăng không”.

---

## Nguồn dữ liệu bắt buộc (Satellite)

Mã **Satellite** chỉ được ghi `Universe_Scan` khi:

1. **`/trade MÃ`** chạy **DATE_LOCK** pass (năm đúng, giá phiên hiện tại)
2. Dữ liệu lấy từ **VNStock** hoặc **TCBS điện tử** (không URL lịch sử, không giá nhớ tay)
3. Ghi Sheet qua:

```bash
node scripts/swing-cro.mjs add --symbol VNM \
  --data-source tcbs --session-date 2026-06-25 \
  --verdict CHO_THEM --rr 1.5 --trigger WATCH \
  --zone "52-54" --stop "49" --target "58" \
  --notes "DATE_LOCK pass · NN mua 3 phiên"
```

`source` trên Sheet = `tcbs:2026-06-25` hoặc `vnstock:2026-06-25`.

**Cấm:** `scan_template`, `manual`, `CTCK tóm tắt` không kèm `/trade` live → **không promote**, **không OPEN**.

---

## Core = sổ tay vị thế (không phải “top pick thuật toán”)

**Watchlist** = mã bạn **đang theo dõi / đang giữ** (từ danh mục paper thật), không phải ranking VN100.

- Có thể là 3, 5, hoặc 7 mã — tùy bạn `watchlist set`
- CRO **sync-core** đồng bộ Core từ Watchlist + lệnh OPEN — không invent mã

---

## Ritual thứ 2 (đúng thứ tự)

```
1. Quét thị trường (VN100 / ngành / thanh khoản) — TCBS/VNStock
2. /trade từng ứng viên (5–10 mã) — verdict + vùng/stop/target
3. swing-cro add (chỉ mã pass bước 2)
4. swing-cro rank → promote (tối đa 2 Satellite)
5. swing-log chỉ khi gate + exec pass
```

**Ritual chưa hoàn thành** nếu tuần đó **0 Satellite** có `source` = vnstock|tcbs + session_date.

---

## Agent / AI — quy tắc trình bày

1. **Không** lặp phân tích 5 mã seed nếu user không hỏi — ưu tiên **scan tuần mới**
2. **Không** gọi cro_score là “khuyến nghị đầu tư” — chỉ xếp thứ tự sau `/trade`
3. Báo cáo phải ghi: **nguồn giá, ngày phiên, verdict**
4. Thiếu live data → nói **“chưa đủ nghiên cứu”**, không verdict

---

## Liên kết

- CRO: [SWING-CRO.md](./SWING-CRO.md)
- Execution: [SWING-EXECUTION-PLAYBOOK.md](./SWING-EXECUTION-PLAYBOOK.md)
- KPI: [SWING-KPI.md](./SWING-KPI.md) · `swing-kpi-read.mjs --real-gate`
