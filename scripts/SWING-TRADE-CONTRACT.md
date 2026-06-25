# Swing trade — Data contract (PAPER)

> Mọi lệnh phải **đủ trường** để tính P&L, KPI, real-gate, phân tích sau. **Thiếu → không ghi; hỏi user bổ sung.**  
> **Quy trình thực chiến:** [SWING-EXECUTION-PLAYBOOK.md](./SWING-EXECUTION-PLAYBOOK.md)  
> **Danh mục:** [SWING-PORTFOLIO.md](./SWING-PORTFOLIO.md)

## OPEN — bắt buộc (CLI)

| Trường | Flag | Mục đích |
|--------|------|----------|
| Mã | `--symbol` | Nhận diện |
| Giá vào | `--entry` | P&L, R:R |
| Stop | `--stop` | R:R, rủi ro VND |
| Target | `--target` | R:R kế hoạch |
| Size % NAV | `--size` | Khối lượng, P&L tháng |
| Setup | `--notes` (≥8 ký tự) | Bối cảnh / trigger |
| Cảm xúc | `--emotion` calm\|fomo\|fear\|revenge | real-gate A4 |
| Tuân rule | `--rule` Y\|N | real-gate A4 |
| Chiến thuật | `--exec` aggressive\|passive\|probe | T1/T2/T3 playbook |

**Execution (bắt buộc kèm `--exec`):**

| Trường | Flag | Mặc định |
|--------|------|----------|
| Giá limit TCBS | `--limit` | = `--entry` |
| Khớp giả định | `--fill` full\|partial | full |
| T2 đã khớp | `--filled true` | chỉ khi `--exec passive\|probe` và Watchlist từng `LIMIT_TREO` |
| Phiên | `--session` continuous\|ATO\|ATC | continuous |
| Thoát kế hoạch | `--exit-plan` single\|ladder | single (khuyến nghị mạnh — validate chỉ warn nếu thiếu) |
| Rải chốt lời | `--ladder` | nếu ladder, vd. `50%@23300,50%@23600` |

**Tự tính khi ghi:** `qty`, `notional_vnd`, `rr_planned`, `month`, `trade_id`, tags trong `notes`

## OPEN — khuyến nghị

| Trường | Flag |
|--------|------|
| VN-Index | `--vni` |

## CLOSE — bắt buộc

| Trường | Flag |
|--------|------|
| Giá thoát | `--exit` |
| Bài học | `--notes` (≥8 ký tự) |
| Cảm xúc | `--emotion` (nếu OPEN chưa có) |
| Tuân rule | `--rule` (nếu OPEN chưa có) |

**Tự tính:** `gross_pct`, `fees_pct`, `net_pct`, `rr_achieved`, `result`  
**Ladder exit:** `--exit` = VWAP các leg đã khớp

## Agent rules

1. **Không ghi Sheet** nếu `swing-log.mjs` exit code 2 (validation fail)
2. **Chọn T1/T2/T3 + T4** theo playbook · **gate danh mục** pass ([SWING-PORTFOLIO.md](./SWING-PORTFOLIO.md))
3. **Liệt kê trường thiếu** và hỏi user từng mục
4. Sau OPEN/CLOSE chạy `swing-log.mjs validate` nếu nghi ngờ thiếu
5. **`patch`** để sửa lệnh cũ: `--exec`, `--limit`, `--vni`, `--emotion`, `--rule`, `--notes`

## Lệnh

```bash
node scripts/swing-log.mjs portfolio
node scripts/swing-log.mjs validate
node scripts/swing-log.mjs patch --id PAPER-... --exec aggressive --limit 22450
```

## Phase 2 (schema) — khi lên REAL

Tab `Fills`: leg khớp spot · Tab `Trades_DERIV`: phái sinh Real (preview [SWING-SHADOW-SCHEMA.md](./SWING-SHADOW-SCHEMA.md))

## Shadow / Theory (Phase 1+ — không ảnh hưởng KPI)

- Framework: [SWING-THEORY-RESEARCH.md](./SWING-THEORY-RESEARCH.md)
- Schema: [SWING-SHADOW-SCHEMA.md](./SWING-SHADOW-SCHEMA.md)
- Tags tối thiểu trên `notes` paper: `hypothesis:H-REG-01` · `shadow:spot_1x` · `regime:` · `bucket:`
