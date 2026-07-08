# Ops — Sheet mirror + Postgres backup (ADR-013 Phase 3B)

Postgres = store of record. Hai lớp an toàn bổ sung:

| Lớp | Mục đích | Tần suất |
|-----|----------|----------|
| **pg_dump** | Khôi phục DB khi VPS hỏng | Hàng ngày 02:15 |
| **Sheet `ops_mirror`** | Ops đọc nhanh (UID/SĐT mask) | Mỗi 6 giờ |

---

## 1. Postgres backup (VPS)

### Thiết lập một lần

```bash
cd /opt/housex/Proptech-HouseX
chmod +x scripts/backup-postgres-vps.sh
mkdir -p ~/backup/housex
./scripts/backup-postgres-vps.sh
ls -lh ~/backup/housex/
```

### Cron

```bash
npm run go-live:print-cron   # copy dòng backup + sheet-mirror
crontab -e
```

Dòng mẫu:

```cron
15 2 * * * /opt/housex/Proptech-HouseX/scripts/backup-postgres-vps.sh >> /var/log/housex-backup.log 2>&1
```

### Biến tùy chọn

```bash
export HOUSEX_BACKUP_DIR=/root/backup/housex
export HOUSEX_BACKUP_RETENTION_DAYS=14
export HOUSEX_PG_CONTAINER=housex-postgres
```

### Khôi phục (khi cần)

```bash
gunzip -c ~/backup/housex/housex-YYYY-MM-DD_HHMM.sql.gz | \
  docker exec -i housex-postgres psql -U housex -d housex
```

> **Khuyến nghị:** copy file `.sql.gz` sang Google Drive / máy khác — không để bản backup duy nhất trên cùng VPS.

---

## 2. Google Sheet mirror

### Chuẩn bị Sheet

1. Dùng Sheet Magnix hiện có **hoặc** tạo Sheet mới `HouseX_ops_mirror`
2. Tạo tab tên **`ops_mirror`** (đúng chữ, hoặc đổi `GOOGLE_SHEET_MIRROR_TAB`)
3. Copy **Sheet ID** từ URL → `GOOGLE_SHEET_MIRROR_ID`
4. Service Account JSON (cùng SA Magnix nếu có) — **Editor** trên Sheet

### Env House X (`.env` trên VPS)

```env
MAGNIX_SHEET_MIRROR_ENABLED=true
GOOGLE_SHEET_MIRROR_ID=1fYB4h_BTiKXa9O3lBah-tQonWpQOQMG2aSkSfPs6yU4
GOOGLE_SHEET_MIRROR_TAB=ops_mirror
GOOGLE_SERVICE_ACCOUNT_JSON=/opt/housex/secrets/google-sa.json
```

> `GOOGLE_SERVICE_ACCOUNT_JSON` có thể là đường dẫn file **hoặc** JSON inline (không khuyến nghị trên VPS).

```bash
pm2 restart housex --update-env
npm run go-live:check-sheet-mirror
SITE=https://timnhaxahoi.com npm run go-live:smoke-sheet-mirror
```

Kỳ vọng smoke: `OK — tab=ops_mirror inbound=N noxh=M rows=...`

### Cron mirror

Đã có trong `npm run go-live:print-cron` — mỗi 6 giờ gọi `POST /api/cron/sheet-mirror`.

### Nội dung tab

- `# inbound_uid_leads` — UID mask, segment, score, ops_status, `noxh_case_code`
- `# noxh_cases_active` — pipeline NOXH đang ACTIVE (SĐT mask)

**1 chiều:** Postgres → Sheet. Không sửa Sheet để ghi ngược DB.

---

## 3. Checklist go-live Phase 3B

- [ ] `backup-postgres-vps.sh` chạy tay OK
- [ ] Cron backup + mirror trong `crontab -l`
- [ ] `go-live:check-sheet-mirror` pass
- [ ] `go-live:smoke-sheet-mirror` OK (không SKIP)
- [ ] Tab `ops_mirror` có dữ liệu sau smoke
- [ ] 1 file backup đã copy off-VPS (Drive)
