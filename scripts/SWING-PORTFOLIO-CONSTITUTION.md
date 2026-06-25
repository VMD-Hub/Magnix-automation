# Swing — Portfolio Constitution (Phase 1 PAPER)

> Luật vận hành · enforce: `swing-log.mjs` + `swing-portfolio.mjs`  
> Chi tiết: [SWING-PORTFOLIO.md](./SWING-PORTFOLIO.md) · Execution: [SWING-EXECUTION-PLAYBOOK.md](./SWING-EXECUTION-PLAYBOOK.md) · Shadow: [SWING-THEORY-RESEARCH.md](./SWING-THEORY-RESEARCH.md)

## Tier 0 — Triết lý (bất biến)

| # | Nguyên tắc |
|---|------------|
| T0-1 | **Cash là vị thế** — không full invest vì FOMO |
| T0-2 | **Stop = thu hồi cash + slot** — chạm stop → CLOSE phiên (T4 aggressive) |
| T0-3 | **Một lệnh = một thesis** — stop/target trước OPEN |
| T0-4 | **Phase 1: spot only** — margin TCBS cấm; shadow để học |
| T0-5 | **Paper = luật REAL** — log đầy đủ, không bỏ stop |

---

## Tier 1 — HARD (script từ chối OPEN)

| # | Rule | Giá trị |
|---|------|---------|
| P1-1 | Stop trước OPEN | 100% |
| P1-2 | R:R kế hoạch | ≥ 1,2 |
| P1-3 | Max lệnh OPEN | 2 |
| P1-4 | Max notional | 60% NAV (300M / 500M) |
| P1-5 | Min cash sau OPEN | 40% NAV |
| P1-6 | **Rủi ro tới stop** | **≤ 1,25% NAV/lệnh** |
| P1-7 | Size max / lệnh | 35% (MWG 25%) |
| P1-8 | Max 1 mã / bucket | bank · cyclical · retail |
| P1-9 | Không trùng mã OPEN | — |
| P1-10 | `--exec` + contract đủ | exit 2 |
| P1-11 | STOP MONTH | net ≤ −3% → 0 OPEN mới |
| P1-12 | Universe | VN100; ngoài watchlist → `/trade` + lý do |

**DEFENSIVE** (`--regime defensive`): size max **20%** (P1-7 override).

---

## Tier 2 — MODE (theo KPI tháng)

| Mode | Điều kiện | Hành vi |
|------|-----------|---------|
| **ON TRACK** | 0 lệnh đóng tháng **hoặc** net ≥ pace | ≤2 lệnh/tuần · size chuẩn |
| **BEHIND** | ≥1 lệnh đóng **và** net < 1,5% | 1 lệnh/tuần · size −25% |
| **AT RISK** | ≥1 lệnh đóng **và** net < 3% | Cảnh báo pace |
| **STOP** | net ≤ −3% | Không OPEN mới |
| **DEFENSIVE** | VNI < MA50 + NN bán 3 phiên (user `--regime defensive`) | Size ≤20% · T2/T3 |

---

## Tier 3 — WARN (user xác nhận → vẫn OPEN nếu pass HARD)

| # | Cảnh báo |
|---|----------|
| W1 | Notional > 50% NAV |
| W2 | 2 mã OPEN cùng beta VN |
| W3 | VNI yếu (manual defensive) |
| W4 | rr_planned < 1,5 |
| W5 | Verdict CHỜ nhưng T1 |
| W6 | 2 OPEN cùng ngày |
| W7 | ATO + T1 aggressive |
| W8 | emotion fomo/revenge |

---

## Tier 4 — Nghiên cứu (không KPI)

| # | Rule |
|---|------|
| R1 | Shadow sync sau open/close — không sửa PAPER |
| R2 | Giả thuyết H-xxx ghi trước kết quả |
| R3 | Margin/phái sinh Real → sau real-gate spot |

---

## Tags `notes` (tự ghi khi OPEN)

```
exec_style:aggressive | tactic:T1 | risk_pct_nav:0.67 | regime:neutral | bucket:bank
hypothesis:H-REG-01 | shadow:spot_1x,margin_1.25x_bull
```

---

## Watchlist T2 (chưa khớp)

Tab **Watchlist**: `status=LIMIT_TREO` · `limit_treo` · `exec_du_kien` — **không** `Trades_PAPER` cho đến khi khớp.

---

## Liên kết script

```bash
node scripts/swing-log.mjs portfolio
node scripts/swing-log.mjs open ... --regime defensive
node scripts/swing-shadow.mjs sync
```
