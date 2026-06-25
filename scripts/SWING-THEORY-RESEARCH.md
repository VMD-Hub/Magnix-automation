# Swing — Nghiên cứu lý thuyết & Shadow (Phase 1+)

> **PAPER spot** = KPI vận hành · **SHADOW** = kiểm chứng giả thuyết (margin, hedge, phái sinh)  
> Schema: [SWING-SHADOW-SCHEMA.md](./SWING-SHADOW-SCHEMA.md) · Code: `scripts/lib/swing-shadow-schema.mjs`

## Vì sao tách 2 track?

| Track | Mục đích | Ảnh hưởng real-gate |
|-------|----------|---------------------|
| **PAPER** (`Trades_PAPER`) | Spot 500M, execution T1–T4, hành vi | **Có** — bắt buộc |
| **SHADOW** (`Trades_SHADOW`) | What-if: leverage, hedge, margin call | **Không** |
| **THEORY** (`Theory_Log`) | Giả thuyết → kết luận tháng | **Không** (bổ trợ C1–C3) |

Phase 1 **cấm margin TCBS thật**, nhưng vẫn cần dữ liệu để trả lời: *“Nếu bull regime + 1,25× thì DD tháng bao nhiêu?”* → Shadow trả lời **định lượng gần đúng**, Real deriv (Phase 2+) **calibrate**.

---

## Luồng nghiên cứu

```
OPEN PAPER (spot) → snapshot context → ghi 1+ shadow scenario → giữ lệnh → CLOSE PAPER
       → tính shadow P&L → cập nhật Theory_Log (cuối tháng)
```

**Agent Phase 1:** mỗi OPEN paper **khuyến nghị** ≥1 dòng shadow (có thể ghi tay Sheet hoặc tag `notes` tối thiểu).

---

## Giả thuyết (Hypothesis)

Mỗi giả thuyết có mã **H-xxx** — ghi **trước** khi biết kết quả.

| Mã | Giả thuyết | Shadow liên quan |
|----|------------|------------------|
| H-REG-01 | VNI > MA50 → T1 aggressive win rate cao hơn T2 | `scenario:spot_1x` vs regime tag |
| H-BKT-01 | 1 Bank + 1 Cyclical OPEN giảm DD vs 2 cyclical | bucket exposure |
| H-LEV-01 | Bull rõ: leverage 1,25× tăng lãi tháng nhưng DD ≤2× | `margin_1.25x_bull` |
| H-HDG-01 | VN30F short overlay −20% beta giảm DD khi VNI −3% | `hedge_vn30f_20` |
| H-EXC-01 | T2 passive entry beat T1 trên HPG vùng rộng | exec_style passive |

**Kết luận tháng** (`Theory_Log`): `confirmed` | `rejected` | `inconclusive` (cần N lệnh).

---

## Shadow scenario — preset Phase 1

| scenario_id | leverage | hedge | margin_call_pct | Ghi chú |
|-------------|----------|-------|-----------------|---------|
| `spot_1x` | 1.0 | none | — | Baseline (= PAPER) |
| `margin_1.25x_bull` | 1.25 | none | −8% on position | Chỉ tag regime bull |
| `margin_1.5x_aggressive` | 1.5 | none | −6% | Stress |
| `hedge_vn30f_20` | 1.0 | vn30f_short 20% beta | — | Cần `vni_entry` |
| `hedge_vn30f_40` | 1.0 | vn30f_short 40% beta | — | Stress hedge |

Chi tiết cột & JSON: [SWING-SHADOW-SCHEMA.md](./SWING-SHADOW-SCHEMA.md).

---

## Context snapshot (mỗi OPEN/CLOSE paper)

Thu cùng phiên để Real/Shadow so sánh sau:

| Trường | Nguồn |
|--------|--------|
| `vni_entry`, `vni_exit` | `/trade` / user |
| `vni_vs_ma50` | above \| below \| at |
| `regime` | bull \| neutral \| defensive |
| `bucket` | bank \| cyclical \| retail |
| `nn_flow_3d` | buy \| sell \| flat (nếu có) |
| `risk_pct_nav` | từ `calcPositionSize` |

Ghi vào `Trades_SHADOW.context_json` hoặc tags `notes` paper (`regime:bull`).

---

## Kiểm chứng lý thuyết — không cần margin thật

| Câu hỏi | Cách Phase 1 |
|---------|--------------|
| Setup có edge? | KPI **PAPER** (win rate, R:R) |
| Regime filter đúng? | Đếm H-REG-01 theo `regime` tag |
| Margin có đáng? | So `net_pct` shadow × leverage vs DD shadow margin_call |
| Hedge có đáng? | So DD tháng spot vs shadow hedge (ước beta VNI) |
| Execution T2 vs T1? | So lệnh cùng mã `exec_style` |

**Phase 2:** Real deriv nhỏ → so shadow forecast vs `Trades_DERIV` (schema tương lai).

---

## Cadence

| Tần suất | Việc |
|----------|------|
| Mỗi OPEN paper | ≥1 shadow row (hoặc tag notes) |
| Mỗi CLOSE paper | Cập nhật shadow `exit_*`, `shadow_net_pct` |
| Thứ 6 | `/swing` + xem shadow vs spot tuần |
| Cuối tháng | `Theory_Log` — kết luận từng H-xxx |

---

## Quy tắc cứng Shadow

1. **Không** sửa `Trades_PAPER` từ shadow.
2. **Không** tính shadow vào win rate real-gate.
3. Mỗi shadow row **bắt buộc** `paper_trade_id` (FK).
4. Giả thuyết ghi **trước** CLOSE (trong `hypothesis_ids`).
5. Phase 1: `leverage` max **1.5** trong shadow (stress only).

---

## Phase 2 — Real deriv (preview)

| Gate | Điều kiện |
|------|-----------|
| Spot real-gate | Pass A–D (hiện tại) |
| Deriv pilot | Vốn ≤ **10% NAV** · log tab riêng · so với shadow cùng `hypothesis_id` |

Chi tiết deriv gate → doc riêng sau khi ≥15 lệnh paper + 5 shadow months data.

---

## Liên kết

- Vận hành spot: [SWING-EXECUTION-PLAYBOOK.md](./SWING-EXECUTION-PLAYBOOK.md)
- Danh mục: [SWING-PORTFOLIO.md](./SWING-PORTFOLIO.md)
- Contract paper: [SWING-TRADE-CONTRACT.md](./SWING-TRADE-CONTRACT.md)
- Real-gate spot: `~/.cursor/skills/swing-goal/real-gate.md`

**Script (Phase 1.5):** `swing-shadow.mjs` — sync shadow từ PAPER (tự chạy sau `swing-log` open/close)

```bash
node scripts/swing-shadow.mjs sync
node scripts/swing-shadow.mjs list
node scripts/swing-shadow.mjs validate
node scripts/swing-shadow.mjs compare
```
