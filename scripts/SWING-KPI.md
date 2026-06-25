# Swing KPI — Scripts (P0)

Sheet ID: `GOOGLE_SHEET_SWING_KPI_ID` trong `n8n-workflows/.env`

**Data contract (bắt buộc):** [SWING-TRADE-CONTRACT.md](./SWING-TRADE-CONTRACT.md) — thiếu trường → script từ chối ghi; agent hỏi user bổ sung.

## Setup (1 lần)

```bash
node scripts/init-swing-kpi.mjs --sheet-id=<Google Sheet ID>
```

## Vòng lệnh paper

```bash
# 1. Phân tích (Cursor: /trade ACB)
# 2. OPEN — đủ trường + chiến thuật (--exec)
node scripts/swing-log.mjs open --symbol HPG --entry 23400 --stop 22800 --target 24800 --size 20 \
  --notes "retest ho tro 23.2" --emotion calm --rule Y --vni 1870 \
  --exec passive --limit 23200 --fill full --session continuous --exit-plan single
# Playbook: scripts/SWING-EXECUTION-PLAYBOOK.md (T1/T2/T3/T4)

# 3. CLOSE — đủ exit, notes, emotion, rule
node scripts/swing-log.mjs close --id PAPER-20260625-01 --exit 21850 \
  --notes "giữ stop đúng kế hoạch" --emotion calm --rule Y

# 4. Bổ sung lệnh cũ thiếu dữ liệu
node scripts/swing-log.mjs patch --id PAPER-20260625-01 --vni 1878 --emotion calm --rule Y \
  --notes "pullback vùng 22.4"

# 5. Quét + danh mục
node scripts/swing-log.mjs portfolio
node scripts/swing-log.mjs validate

# 6. Review
node scripts/swing-kpi-read.mjs
node scripts/swing-kpi-read.mjs --real-gate
node scripts/swing-log.mjs list
```

## Sync

Mỗi `open` / `close` / `patch` → ghi **Trades_PAPER** + **`~/Documents/swing-kpi/kpi-tracker.csv`** + **shadow auto-sync**.

## Shadow / Theory (nghiên cứu — không KPI)

```bash
node scripts/swing-shadow.mjs sync      # toàn bộ (mặc định sau swing-log)
node scripts/swing-shadow.mjs list
node scripts/swing-shadow.mjs validate
node scripts/swing-shadow.mjs compare   # spot vs shadow khi đóng lệnh
```

- Docs: [SWING-THEORY-RESEARCH.md](./SWING-THEORY-RESEARCH.md) · [SWING-SHADOW-SCHEMA.md](./SWING-SHADOW-SCHEMA.md)
- Sheet: `Trades_SHADOW` · CSV: `~/Documents/swing-kpi/shadow-tracker.csv`
- Tags paper notes: `hypothesis:` · `shadow:` · `regime:` · `bucket:`

## Cursor skills

- `/trade [MÃ]` — nhận định (+ block size/qty trước khi ghi)
- `/swing log` — agent gọi `swing-log.mjs` (đủ trường hoặc hỏi lại)
- `/swing shadow` — agent gọi `swing-shadow.mjs`
- `/swing validate` — quét lệnh thiếu dữ liệu
- `/swing` — agent gọi `swing-kpi-read.mjs`
- `/swing real` — agent gọi `swing-kpi-read.mjs --real-gate`
