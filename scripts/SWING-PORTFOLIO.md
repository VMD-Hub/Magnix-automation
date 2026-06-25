# Swing — Tối ưu danh mục (Portfolio)

> Phase 1 PAPER · NAV **500.000.000 VND** · vốn lệnh = paper NAV  
> Playbook: [SWING-EXECUTION-PLAYBOOK.md](./SWING-EXECUTION-PLAYBOOK.md)

Mục tiêu: **danh mục tối ưu = đủ lãi mục tiêu + kiểm soát rủi ro + dữ liệu sạch cho KPI/real-gate** — không phải “full margin mọi mã”.

**Hiến pháp (Tier 0–4):** [SWING-PORTFOLIO-CONSTITUTION.md](./SWING-PORTFOLIO-CONSTITUTION.md)

---

## Nguyên tắc Phase 1

| # | Nguyên tắc |
|---|------------|
| 1 | **Cash là vị thế** — giữ buffer để chờ setup HPG/MWG |
| 2 | **Mỗi lệnh = 1 thesis** — stop + target trước OPEN |
| 3 | **Tập trung có giới hạn** — max 2 mã OPEN, không trùng rủi ro quá mức |
| 4 | **Size theo chất lượng setup** — MWG < HPG < ACB (tin cậy/beta) |
| 5 | **Thua tháng có trần** — −3% thì dừng lệnh mới |

---

## Hạn mức cứng (HARD — agent từ chối OPEN nếu vi phạm)

| Hạn mức | Giá trị | Kiểm tra |
|---------|---------|----------|
| Size max / lệnh | **35% NAV** (175M) | `swing-log open --size` |
| Size max **MWG** | **25% NAV** (125M) | symbol = MWG |
| Lệnh **OPEN** đồng thời | **≤ 2** | `swing-log list` |
| **Tổng notional** OPEN | **≤ 60% NAV** (300M) | Σ notional_vnd / 500M |
| **Cash tối thiểu** sau OPEN mới | **≥ 40% NAV** (200M) | 500M − Σ notional |
| Stop tháng (net paper) | **≤ −3%** (−15M) | `swing-kpi-read.mjs` |
| Lệnh mới khi STOP MONTH | **0** | net_month ≤ −3% |
| Stop trước OPEN | **100%** | stop_vnd bắt buộc |
| R:R kế hoạch | **≥ 1,2** | rr_planned |
| **Rủi ro tới stop (P1-6)** | **≤ 1,25% NAV/lệnh** | `risk_pct_nav` khi OPEN |
| **DEFENSIVE** | `--regime defensive` | size max **20%** |
| **1 mã / bucket** | bank · cyclical · retail | max 1 OPEN/bucket |

**Công thức gate trước OPEN:**

```
notional_moi = qty × entry  (script tính)
tong_sau = Σ notional_OPEN + notional_moi
PASS nếu: tong_sau ≤ 300M AND so_lenh_OPEN < 2 AND (MWG → size ≤ 25%)
```

**Ví dụ hiện tại:** ACB ~123,5M (24,7% NAV) → còn room **~176,5M** notional (~35% NAV một lệnh nữa) · **1 slot OPEN** còn lại.

---

## Chế độ danh mục (PORTFOLIO MODE)

Agent đọc KPI tháng + exposure → gán mode:

| Mode | Điều kiện | Hành vi |
|------|-----------|---------|
| **ON TRACK** | net ≥ pace − 0,5% · rule 100% | Tối đa **2 lệnh/tuần** · size chuẩn |
| **BEHIND** | net < pace − 0,5% · chưa STOP | **1 lệnh/tuần** · size **−25%** · chỉ trigger SẴN SÀNG |
| **AT RISK** | 2 thua liên tiếp **hoặc** DD tuần > 2% NAV | **Nghỉ 3 phiên** · size **50%** khi quay lại |
| **STOP MONTH** | net tháng ≤ **−3%** | **Không OPEN mới** · chỉ quản lý/đóng OPEN |

---

## Cảnh báo (WARN — nêu rõ user, vẫn có thể OPEN nếu user xác nhận)

| # | Cảnh báo | Hành động đề xuất |
|---|----------|-------------------|
| W1 | Tổng notional sau OPEN **> 50%** NAV | Nhắc: buffer cash thấp; ưu tiên T2 không full size |
| W2 | **2 mã OPEN** cùng nhóm beta VN (bank + steel + retail đều cyclical) | Size lệnh 2 ≤ 30%; không thêm mã thứ 3 |
| W3 | VNI **mất MA50** + NN bán ròng **3 phiên** | Size max **20%** · ưu tiên T2/CHỜ |
| W4 | `rr_planned` **< 1,5** | Cân nhắc CHỜ hoặc widen target (phải `/trade` lại) |
| W5 | Verdict **CHỜ** nhưng user muốn T1 | Nhắc FOMO · đề xuất T2/T3 |
| W6 | Lệnh thứ 2 cùng ngày | Nhắc overtrading · tối đa 1 OPEN/ngày (khuyến nghị) |
| W7 | ATO phiên — T1 aggressive | Tránh trừ khi setup rất rõ + size giảm 25% |
| W8 | `emotion:fomo` hoặc `revenge` | Nhắc nghỉ · size −50% hoặc không OPEN |

---

## Khuyến nghị (REC — tối ưu danh mục)

| # | Khuyến nghị | Lý do |
|---|-------------|-------|
| R1 | **2–3 lệnh đóng/tháng** | Chất lượng > số lượng; đủ KPI real-gate |
| R2 | Phân bổ watchlist: **1 OPEN ngân hàng (ACB) + 1 OPEN cyclical (HPG hoặc MWG)** | Tránh 2 mã cùng kịch bản VN-Index |
| R3 | MWG luôn **size nhỏ nhất** (≤25%) + ưu tiên **T3** | Beta cao |
| R4 | HPG: **T2** @ 23,0–23,2 trước; T1 chỉ breakout | Dòng NN không đồng nghĩa vào ngay |
| R5 | Giữ **≥ 40% cash** khi chưa có 2 setup SẴN SÀNG | Linh hoạt DCA / T2 |
| R6 | Target operating **+3%/tháng** (~15M) trước stretch 5% | Pace bền vững |
| R7 | Mỗi thứ 6: `/swing` + `validate` + cập nhật Watchlist | Đồng bộ limit treo T2 |
| R8 | Ladder T4 khi target xa **> 8%** từ entry | Chốt một phần giảm give-back |

---

## Gate trước OPEN mới (checklist agent)

Chạy **trước mọi** `swing-log open`:

```bash
node scripts/swing-kpi-read.mjs          # net tháng → mode
node scripts/swing-log.mjs list          # OPEN + notional
node scripts/swing-log.mjs validate      # dữ liệu sạch
```

| # | Câu hỏi | Pass? |
|---|---------|-------|
| G1 | PORTFOLIO MODE ≠ STOP MONTH? | |
| G2 | Số OPEN < 2? | |
| G3 | Σ notional + lệnh mới ≤ 300M? | |
| G4 | Size ≤ cap mã (MWG 25%)? | |
| G5 | Stop + R:R ≥ 1,2 đã có? | |
| G6 | Trigger SẴN SÀNG (T1/T3) hoặc T2 đã khớp? | |
| G7 | Không vi phạm AT RISK (nghỉ 3 phiên)? | |

**Fail G1–G4:** agent **từ chối OPEN** — nêu hạn mức và đề xuất giảm size / chờ đóng lệnh cũ.  
**Warn W1–W8:** in cảnh báo · user xác nhận bằng lời → mới ghi.

---

## Output agent — block Danh mục (bắt buộc trước OPEN)

```markdown
## Gate danh mục · [ON TRACK | BEHIND | AT RISK | STOP]

| Chỉ số | Hiện tại | Hạn mức |
|--------|----------|---------|
| NAV paper | 500M (+ X% tháng) | |
| Notional OPEN | ...M (...%) | ≤ 300M (60%) |
| Số lệnh OPEN | ... | ≤ 2 |
| Cash buffer | ...M (...%) | ≥ 200M (40%) |

**Lệnh đề xuất:** [MÃ] size ...% → notional sau = ...M (**PASS/WARN/FAIL**)

⚠ Cảnh báo: [W1… / không]
✅ Khuyến nghị: [R1… / không]
```

---

## Phân bổ tham chiếu (500M · ON TRACK)

| Thành phần | % NAV | VND | Ghi chú |
|------------|-------|-----|---------|
| Cash buffer | 40–100% | 200–500M | Cao khi 0 OPEN |
| 1 lệnh core (ACB) | 25–35% | 125–175M | Đang ~25% ACB |
| 1 lệnh thứ 2 (HPG/MWG) | 20–30% | 100–150M | Sau ACB ổn định |
| **Tổng invested max** | **60%** | **300M** | Hard cap |

---

## Liên kết KPI tháng

| KPI yếu | Điều chỉnh danh mục |
|---------|---------------------|
| Win rate < 45% | BEHIND: 1 lệnh/tuần, size −25% |
| Avg R:R < 1,2 | Chỉ OPEN rr_planned ≥ 1,5 |
| Max DD > 5% | AT RISK 3 phiên |
| > 6 lệnh/tháng | Cảnh báo overtrading (W6) |

Chi tiết KPI: skill `reference.md` · `swing-kpi-read.mjs`.

---

## Trạng thái bootstrap (25/06/2026)

| | |
|---|---|
| OPEN | ACB ~123,5M (24,7%) |
| Slot còn lại | 1 lệnh · ~176M notional room |
| Cash | ~376,5M (~75,3%) |
| Mode | ON TRACK (0 lệnh đóng tháng — mặc định) |
| Lệnh tiếp theo ưu tiên | HPG T2 @ 23,0–23,2 **hoặc** MWG T3 (size ≤25%) |
