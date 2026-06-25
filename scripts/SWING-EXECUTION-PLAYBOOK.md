# Swing — Quy trình thực chiến (Execution Playbook)

> Phase 1 PAPER · vốn 500M · REAL khóa đến `real-gate.md`  
> Contract: [SWING-TRADE-CONTRACT.md](./SWING-TRADE-CONTRACT.md)  
> Danh mục: [SWING-PORTFOLIO.md](./SWING-PORTFOLIO.md)

## Luồng chuẩn (6 bước)

```
/trade → Verdict → CHỌN ENTRY (T1/T2/T3) + EXIT (T4) → Gate danh mục → Đặt lệnh TCBS → swing-log OPEN → CLOSE
```

| Bước | Ai làm | Output bắt buộc |
|------|--------|-----------------|
| 1. Nhận định | `/trade` | Verdict + vùng/stop/target + R:R |
| 2. Entry | User + agent | **T1 / T2 / T3** + **T4** exit-plan (single/ladder) |
| 3. Gate danh mục | Agent | Pass [SWING-PORTFOLIO.md](./SWING-PORTFOLIO.md) — exposure, cảnh báo |
| 4. Đặt lệnh | User (TCBS) | Limit, qty, stop trên app |
| 5. Ghi OPEN | `swing-log open` | Contract + `--exec` |
| 6. Thoát | `swing-log close` | exit single hoặc VWAP ladder |

**Phân tách:** **T1–T3 = vào lệnh · T4 = thoát** (khai báo T4 lúc OPEN, thực hiện lúc CLOSE).

**Cấm:** OPEN trước gate danh mục; OPEN T2 khi limit chưa khớp; đổi `exec_style` retroactive trên entry (chỉ patch forward).

---

## Trigger SẴN SÀNG (bắt buộc trước T1/T3)

Cả 3 điều kiện (cập nhật theo `/trade`):

1. Giá **trong vùng** ưu tiên watchlist / `/trade`
2. **Giữ hỗ trợ** ≥ 2 phiên (hoặc breakout + volume xác nhận)
3. **Volume** ≥ TB10 (hoặc breakout có volume)

Chưa đủ → **T2 treo limit** trên Watchlist, **không** `Trades_PAPER`.

---

## Bộ chiến thuật ENTRY (T1–T3)

### T1 — AGGRESSIVE (khớp ngay)

**Khi dùng:** Verdict **VÀO ĐƯỢC** + trigger SẴN SÀNG + tin cậy **Cao/TB cao**; setup hết hạn nếu chờ.

| | |
|---|---|
| Limit mua | ≥ ask / sát giá live TCBS |
| Khớp paper | **100% qty @ limit** |
| Size | Theo [SWING-PORTFOLIO.md](./SWING-PORTFOLIO.md) (max 35%; MWG 25%) |

**Bootstrap:** ACB `PAPER-20260625-01` = **T1** @ 22.450 · 5.500 CP.

```bash
node scripts/swing-log.mjs open --symbol ACB --entry 22450 --stop 21850 --target 23600 --size 25 \
  --notes "pullback vung 22.4" --emotion calm --rule Y --vni 1870 \
  --exec aggressive --limit 22450 --fill full --session continuous --exit-plan single
```

---

### T2 — PASSIVE (chờ giá tốt)

**Khi dùng:** Verdict **CHỜ THÊM** hoặc **VÀO** nhưng vùng rộng; tin cậy TB; còn 1–3 phiên chờ.

| | |
|---|---|
| Limit mua | **Dưới** giá live — đáy vùng `/trade` |
| Ghi OPEN | **Chỉ sau khi khớp** (user xác nhận) |
| `entry_vnd` | Giá khớp thực |

#### T2 chưa khớp — ghi Watchlist, không OPEN

Cập nhật tab **Watchlist** (Google Sheet):

| Cột | Ví dụ HPG |
|-----|-----------|
| symbol | HPG |
| status | LIMIT_TREO |
| limit_treo | 23.200 |
| vung | 23.0–23.5 |
| stop_ke_hoach | 22.300 |
| target | 25.500 |
| exec_du_kien | T2 passive |
| ghi_chu | Chờ retest hỗ trợ |

**Không** tạo dòng `Trades_PAPER` cho đến khi khớp → lúc đó `swing-log open --exec passive`.

```bash
node scripts/swing-log.mjs open --symbol HPG --entry 23200 --stop 22800 --target 25500 --size 30 \
  --notes "retest ho tro 23.2" --emotion calm --rule Y --vni 1870 \
  --exec passive --limit 23200 --fill full --session continuous --exit-plan single
```

---

### T3 — PROBE + SCALE

**Khi dùng:** Setup đúng, tin cậy **TB**, muốn giảm rủi ro ban đầu (MWG ưu tiên T3).

| Leg | Size kế hoạch | Kiểu |
|-----|---------------|------|
| Leg 1 | 30–40% | T1 aggressive @ trigger |
| Leg 2 | 60–70% | T2 passive trong vùng |

**Quy trình leg 2 (Phase 1):**

1. OPEN leg 1 với `--size` = 30–40% size đích · note `probe_leg2:pending@<limit>`
2. Leg 2 khớp → **`patch`** cùng `trade_id`:
   - Cập nhật `--entry` = **VWAP** = `(qty1×entry1 + qty2×entry2) / (qty1+qty2)`
   - Cập nhật `--size` = size % tổng sau gộp
   - Script tự tính lại `qty`, `notional_vnd`, `rr_planned`
3. **Không** mở `trade_id` mới cho cùng symbol leg 2

```bash
# Leg 1 (MWG 10% NAV ≈ 40% của kế hoạch 25%):
node scripts/swing-log.mjs open --symbol MWG --entry 76500 --stop 74500 --target 82000 --size 10 \
  --exec probe --limit 76500 --fill full --exit-plan single \
  --notes "probe leg1 MWG beta cao | probe_leg2:pending@75500"

# Leg 2 khớp @ 75500, thêm ~15% NAV:
node scripts/swing-log.mjs patch --id PAPER-... --entry 75833 --size 25 --limit 75500 \
  --notes "probe leg2 filled VWAP"
```

---

## EXIT (T4)

| Kiểu | Khi khai báo | Ghi sổ |
|------|--------------|--------|
| **single** | `--exit-plan single` | `--exit` = giá khớp |
| **ladder** | `--exit-plan ladder --ladder "..."` | `--exit` = **VWAP** legs |

```bash
--exit-plan ladder --ladder "50%@23300,50%@23600"
# CLOSE: exit = 23450 (VWAP)
```

- **Stop:** luôn T1 aggressive (bán sát bid) — ghi notes `exit_exec:aggressive`
- **Phase 1:** exit-plan **cố định lúc OPEN** — không trail / đổi ladder giữa chừng (trừ patch có lý do ghi notes)

---

## Trong lệnh (OPEN → CLOSE)

| Sự kiện | Hành động |
|---------|-----------|
| Chạm **stop** | CLOSE **ngay phiên** @ stop (T4 aggressive) |
| Chạm **target** / ladder leg | CLOSE hoặc leg theo plan T4 |
| **> 10 phiên** chưa hit | `/swing` review — đóng hoặc gia hạn + lý do notes |
| Đổi stop/target | **Cấm** retroactive — chỉ patch forward + ghi lý do |
| `--fill partial` | `qty` = phần khớp; leg còn lại → patch khi full |

**Exposure:** max **2 OPEN** · tổng notional ≤ **60% NAV** — chi tiết [SWING-PORTFOLIO.md](./SWING-PORTFOLIO.md).

---

## Ma trận chọn chiến thuật

```
ENTRY:
  VÀO + trigger SẴN SÀNG + tin cậy Cao        → T1
  VÀO + vùng rộng / tin cậy TB                  → T2 (Watchlist trước) hoặc T3
  CHỜ, chưa trigger                             → T2 limit treo — Watchlist only

EXIT (khai báo lúc OPEN):
  Một mức target/stop                           → T4 single
  Chốt từng phần                                → T4 ladder
```

---

## Watchlist — bias chiến thuật (P1)

| Mã | Vùng | Stop | Target | Chiến thuật mặc định | Size cap |
|----|------|------|--------|----------------------|----------|
| **ACB** | 22,3–22,6 | < 21,8 | 24–25 | T1 khi trigger (đang OPEN T1) | 25–35% |
| **HPG** | 23,0–23,5 | < 22,3 | 25,5–26,5 | **T2 passive** @ đáy vùng; T1 nếu breakout+volume | 30–35% |
| **MWG** | 76–77,5 | < 74,5 | 82–85 | **T2** hoặc **T3 probe** (beta cao) | **≤25%** |

Mã ngoài watchlist → `/trade` + lý do trong notes + gate danh mục stricter (size ≤25%).

---

## Trường CLI execution

| Flag | Giá trị | Mặc định |
|------|---------|----------|
| `--exec` | aggressive \| passive \| probe | **bắt buộc** |
| `--limit` | Giá limit TCBS | = `--entry` |
| `--fill` | full \| partial | full |
| `--session` | ATO \| ATC \| continuous | continuous |
| `--exit-plan` | single \| ladder | single (khuyến nghị mạnh) |
| `--ladder` | `50%@23300,50%@23600` | nếu ladder |

`validate`: `exec_style` bắt buộc; `exit_plan` khuyến nghị.

---

## Checklist agent (mỗi lệnh)

- [ ] `/trade` DATE_LOCK pass
- [ ] Trigger SẴN SÀNG (T1/T3) hoặc T2 Watchlist
- [ ] Chọn T1/T2/T3 + T4 exit-plan — **nêu user**
- [ ] **Gate danh mục** pass ([SWING-PORTFOLIO.md](./SWING-PORTFOLIO.md))
- [ ] `swing-log list` — exposure hiện tại
- [ ] `swing-log open` + `validate`
- [ ] CLOSE: exit đúng T4; stop = aggressive

---

## Lệnh bootstrap (ACB #001)

| Field | Value |
|-------|-------|
| Chiến thuật | T1 aggressive · T4 single |
| trade_id | PAPER-20260625-01 |
| entry / limit | 22.450 · 5.500 CP · ~24,7% NAV |

Lệnh #2+ **bắt buộc** `--exec` + gate danh mục.
