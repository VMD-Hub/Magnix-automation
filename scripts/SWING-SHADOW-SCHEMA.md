# Swing Shadow — Schema

> Machine-readable: `scripts/lib/swing-shadow-schema.mjs`  
> Framework: [SWING-THEORY-RESEARCH.md](./SWING-THEORY-RESEARCH.md)

## Tab Google Sheet

| Tab | Mục đích |
|-----|----------|
| `Trades_PAPER` | Spot KPI (store of record) |
| `Trades_SHADOW` | What-if gắn `paper_trade_id` |
| `Theory_Log` | Registry giả thuyết + kết luận tháng |

`init-swing-kpi.mjs` — thêm tab khi chạy lại setup (hoặc tạo tay theo header dưới).

---

## `Trades_SHADOW` — cột

| Cột | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `shadow_id` | string | ✅ | `SHAD-{paper_trade_id}-{scenario}` vd. `SHAD-PAPER-20260625-01-spot_1x` |
| `paper_trade_id` | string | ✅ | FK → `Trades_PAPER.trade_id` |
| `month` | YYYY-MM | ✅ | |
| `symbol` | string | ✅ | Copy từ paper |
| `scenario_id` | enum | ✅ | `spot_1x`, `margin_1.25x_bull`, … |
| `hypothesis_ids` | string | khuyến nghị | `H-REG-01,H-LEV-01` |
| `leverage` | number | ✅ | 1.0 – 1.5 Phase 1 |
| `hedge_type` | enum | ✅ | `none` \| `vn30f_short` \| `vn30f_long` |
| `hedge_ratio` | number | nếu hedge | 0–1 (beta hedge ratio) |
| `margin_call_pct` | number | nếu lev>1 | % lỗ trên position → force exit shadow |
| `entry_vnd` | number | ✅ | = paper (hoặc VWAP probe) |
| `exit_vnd` | number | khi đóng | = paper exit |
| `stop_vnd` | number | ✅ | = paper |
| `target_vnd` | number | ✅ | = paper |
| `size_pct` | number | ✅ | = paper size × leverage (notional exposure) |
| `notional_vnd` | number | ✅ | paper notional × leverage |
| `gross_pct` | number | auto | spot gross × leverage (xấp xỉ) |
| `fees_pct` | number | auto | spot fees × leverage (xấp xỉ) |
| `shadow_net_pct` | number | auto | net spot × leverage + hedge adj |
| `shadow_nav_impact_pct` | number | auto | shadow_net × size_pct / 100 |
| `margin_called` | Y/N | auto | Y nếu intrade loss ≥ margin_call_pct |
| `regime` | enum | khuyến nghị | bull \| neutral \| defensive |
| `bucket` | enum | khuyến nghị | bank \| cyclical \| retail \| other |
| `vni_entry` | number | khuyến nghị | |
| `vni_exit` | number | khi đóng | |
| `context_json` | JSON string | khuyến nghị | Snapshot mở rộng |
| `status` | enum | ✅ | `open` \| `closed` \| `margin_called` |
| `notes` | string | | |

### `context_json` — object

```json
{
  "vni_vs_ma50": "above",
  "nn_flow_3d": "buy",
  "risk_pct_nav": 0.67,
  "exec_style": "aggressive",
  "exit_plan": "single",
  "paper_mode": "PAPER"
}
```

---

## `Theory_Log` — cột

| Cột | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `hypothesis_id` | string | ✅ | `H-REG-01` |
| `month` | YYYY-MM | ✅ | Tháng review |
| `statement` | string | ✅ | Câu giả thuyết (≥20 ký tự) |
| `scenario_ids` | string | | Preset shadow liên quan |
| `sample_min` | number | ✅ | N lệnh tối thiểu (vd. 5) |
| `sample_n` | number | auto | Đếm từ shadow/paper |
| `metric` | string | ✅ | vd. `win_rate`, `max_dd_pct`, `nav_impact` |
| `threshold` | string | ✅ | vd. `>=55%`, `DD<=2x spot` |
| `result_value` | string | | Kết quả đo |
| `verdict` | enum | ✅ | `confirmed` \| `rejected` \| `inconclusive` \| `pending` |
| `lesson` | string | | 1 dòng bài học |
| `rule_next` | string | | Rule tháng sau nếu confirmed |
| `updated_at` | ISO date | | |

---

## Preset `scenario_id`

| id | leverage | hedge_type | hedge_ratio | margin_call_pct |
|----|----------|------------|-------------|-----------------|
| `spot_1x` | 1.0 | none | 0 | |
| `margin_1.25x_bull` | 1.25 | none | 0 | −8 |
| `margin_1.5x_aggressive` | 1.5 | none | 0 | −6 |
| `hedge_vn30f_20` | 1.0 | vn30f_short | 0.2 | |
| `hedge_vn30f_40` | 1.0 | vn30f_short | 0.4 | |

Phase 1 max leverage shadow: **1.5**.

---

## Công thức shadow P&L (xấp xỉ Phase 1)

```
gross_pct_shadow = gross_pct_paper × leverage
fees_pct_shadow  = fees_pct_paper × leverage   # xấp xỉ
net_pct_shadow   = gross_pct_shadow − fees_pct_shadow + hedge_adj_pct

hedge_adj_pct ≈ −hedge_ratio × (vni_move_pct) × beta_portfolio
  # Phase 1: beta_portfolio mặc định 1.0 nếu thiếu data

shadow_nav_impact_pct = net_pct_shadow × (size_pct_paper × leverage) / 100
```

**Margin call (shadow):** nếu unrealized loss trên position ≥ `|margin_call_pct|` trước khi chạm stop paper → `status=margin_called`, `exit_vnd` = giá call ước, `margin_called=Y`.

---

## Tags `notes` paper (Phase 1 tối thiểu — trước tab Shadow)

Ghi trên `Trades_PAPER.notes` nếu chưa có row Shadow:

```
hypothesis:H-REG-01,H-BKT-01
shadow:spot_1x
regime:bull
bucket:bank
```

Agent parse → tạo `Trades_SHADOW` sau (Phase 1.5 script).

---

## Validation

| Rule | Mức |
|------|-----|
| `paper_trade_id` tồn tại trong PAPER | HARD |
| `scenario_id` ∈ preset | HARD |
| `leverage` ≤ 1.5 Phase 1 | HARD |
| `hypothesis_ids` non-empty | WARN |
| Shadow không duplicate `(paper_trade_id, scenario_id)` | HARD |

Exit code script tương lai: `swing-shadow validate` → 2 nếu HARD fail.

---

## Ví dụ row — ACB bootstrap

**Paper:** `PAPER-20260625-01` · ACB · entry 22450 · size 25%

| shadow_id | paper_trade_id | scenario_id | leverage | hypothesis_ids | regime | bucket |
|-----------|----------------|-------------|----------|----------------|--------|--------|
| SHAD-PAPER-20260625-01-spot_1x | PAPER-20260625-01 | spot_1x | 1.0 | H-REG-01 | neutral | bank |
| SHAD-PAPER-20260625-01-margin_1.25x_bull | PAPER-20260625-01 | margin_1.25x_bull | 1.25 | H-LEV-01 | neutral | bank |

*(regime cập nhật khi có VNI vs MA50 rõ hơn)*

---

## Phase 2 — `Trades_DERIV` (preview)

| Cột | Mô tả |
|-----|-------|
| `deriv_id` | |
| `paper_trade_id` | Optional link thesis |
| `shadow_id` | Shadow đã dự báo |
| `instrument` | VN30F, CW, … |
| `side`, `qty`, `entry`, `exit` | |
| `real_pnl_vnd` | |

Deriv **không** merge vào KPI spot.

---

## Liên kết code

```javascript
import {
  SHADOW_HEADERS,
  THEORY_LOG_HEADERS,
  SHADOW_SCENARIOS,
  buildShadowId,
  calcShadowMetrics,
  validateShadowRow,
  validateTheoryRow,
} from './lib/swing-shadow-schema.mjs';
```
