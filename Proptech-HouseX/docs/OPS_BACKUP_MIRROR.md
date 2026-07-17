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

Mỗi lần chạy dùng `flock` để chặn hai cron chạy chồng nhau. Dump được ghi vào
file tạm, kiểm tra `gzip`, kiểm tra stream SQL không rỗng, tạo SHA-256 rồi mới
atomic rename thành `housex-*.sql.gz`. Retention chỉ chạy sau các bước này và
luôn giữ bản backup thành công mới nhất, kể cả khi retention đặt bằng `0`.

### Off-site hook (bắt buộc trước khi tự động prune)

Khi có nơi lưu off-VPS, cấu hình **cả hai** executable:

```bash
export HOUSEX_BACKUP_OFFSITE_HOOK=/opt/housex/bin/upload-backup
export HOUSEX_BACKUP_OFFSITE_VERIFY_HOOK=/opt/housex/bin/verify-backup
```

Mỗi hook nhận hai argument: đường dẫn `.sql.gz` và `.sql.gz.sha256`. Upload
chạy trước; verify phải kiểm tra object remote/checksum và exit `0`. Nếu một
hook lỗi, thiếu hoặc không executable, backup local vẫn được giữ nhưng script
exit lỗi và **không prune**. Nếu chưa cấu hình hook, script vẫn tạo backup mới
nhưng mặc định bỏ qua retention để không xóa khi chưa có bản off-site đã verify.

Chỉ khi chủ động chấp nhận lưu local-only mới bật:

```bash
export HOUSEX_BACKUP_ALLOW_LOCAL_ONLY_RETENTION=true
```

### Xác minh restore an toàn (local)

Không restore thẳng vào DB `housex`. Script xác minh chỉ chấp nhận PostgreSQL trên
`localhost`, chỉ tạo một DB **chưa tồn tại** có prefix
`housex_restore_verify_`, và yêu cầu confirmation trùng chính xác tên DB.

Yêu cầu local: `psql` có trong `PATH`, PostgreSQL đang chạy và admin user có quyền
`CREATE DATABASE`, `DROP DATABASE`, `pg_terminate_backend`.

```bash
cd Proptech-HouseX
npm run db:verify-restore -- \
  --backup /path/to/housex-YYYY-MM-DD_HHMMSS.sql.gz \
  --admin-url postgresql://housex:REDACTED@127.0.0.1:5432/postgres \
  --target-db housex_restore_verify_20260717 \
  --confirm-disposable housex_restore_verify_20260717 \
  --evidence ./reports/restore-verify-20260717.json
```

Có thể đặt admin URL trong `HOUSEX_RESTORE_VERIFY_ADMIN_URL` để tránh URL xuất hiện
trong shell history. Không ghi credential vào evidence hoặc source control.
`--checksum` mặc định là `<backup>.sha256`; `--psql` hoặc
`HOUSEX_RESTORE_VERIFY_PSQL` dùng khi executable không nằm trong `PATH`.

Script thực hiện theo thứ tự:

1. kiểm tra file không rỗng, SHA-256, gzip và header `pg_dump` trước khi kết nối;
2. từ chối DB target đã tồn tại, sau đó mới tạo DB disposable;
3. restore với `ON_ERROR_STOP` trong một transaction;
4. kiểm tra các bảng khóa `customers`, `leads`, `outbox_events`,
   `inbound_uid_leads`, khả năng đọc/count, primary key, unique key quan trọng và
   constraint đã validate;
5. cleanup bằng ba lần gọi `psql` riêng: terminate connection, `DROP DATABASE`
   ngoài transaction, rồi query `pg_database` để xác minh DB đã bị xóa; các bước
   drop/verify vẫn được thử nếu terminate thất bại.

Evidence JSON create-only có schema `housex.restore-verification.v1`, hash/size file,
kết quả từng check, row count không chứa PII, trạng thái cleanup và mã lỗi bounded.
Evidence không ghi raw stdout/stderr từ `psql`; lỗi chỉ có `code` và summary cố định
đã sanitize. Chỉ khi query hậu-cleanup xác nhận DB không còn thì
`cleanup.deletion_verified` và `cleanup.database_dropped` mới là `true`. Exit code
khác `0` hoặc `cleanup.database_dropped=false` là verification thất bại.
Không dùng evidence của lần thất bại làm bằng chứng DR.

### Rollback / khi verification lỗi

- Script không thay đổi DB nguồn hay DB `housex`; rollback bình thường là cleanup
  tự drop DB disposable.
- Nếu cleanup thất bại, dừng automation, kiểm tra process/permission local rồi drop
  **đúng tên đã ghi trong evidence** bằng admin account. Không dùng wildcard.
- Không retry bằng cách đổi target thành DB đang tồn tại hoặc bỏ confirmation.
- Evidence là create-only; mỗi lần retry dùng tên DB và đường dẫn evidence mới.

> **Giới hạn bằng chứng:** chạy local chỉ chứng minh artifact có thể restore trong
> môi trường local. Việc backup đã được upload off-VPS, checksum object remote, tải
> ngược từ off-site, và restore trên môi trường VPS/disaster-recovery thực tế là
> bằng chứng vận hành **external**, phải được operator thực hiện và lưu riêng. Script
> này cố ý không truy cập remote/VPS và không chứng minh các bước đó.

---

## 2. Audit media listing local (read-only)

Đối chiếu file trong `public/uploads/listings/` với URL local trong
`listing_media`:

```bash
npm run media:audit-orphans
npm run media:audit-orphans -- --format json --output ./reports/media-orphans.json
```

Report liệt kê:

- file orphan trên disk (không có URL tương ứng trong Postgres);
- URL local trong Postgres nhưng thiếu file trên disk;
- tổng URL external/CDN không thuộc thư mục local.

Script chỉ đọc filesystem và Postgres, không có chế độ delete/quarantine.
`--output` dùng create-only và sẽ từ chối ghi đè report cũ. Có thể dùng
`--uploads-dir` để audit một mount/restore copy khác.

---

## 3. Google Sheet mirror

### Chuẩn bị Sheet

1. Dùng Sheet Magnix hiện có **hoặc** tạo Sheet mới `HouseX_ops_mirror`
2. Tạo tab tên **`ops_mirror`** (đúng chữ, hoặc đổi `GOOGLE_SHEET_MIRROR_TAB`)
3. Copy **Sheet ID** từ URL → `GOOGLE_SHEET_MIRROR_ID`
4. Service Account JSON — **Editor** trên Sheet

### Upload service account lên VPS (không dùng nano paste JSON)

Paste trực tiếp JSON vào `nano` thường **làm hỏng** trường `private_key` → `không parse được` / file rỗng.

**QUY TẮC:** lệnh `PowerShell` / đường dẫn `C:\Users\...` chỉ chạy trên **Windows**.  
Lệnh `bash` / `/opt/housex/...` chỉ chạy trên **VPS Linux** (console iNET).

#### Cách A — `scp` trực tiếp (khuyến nghị nếu SSH cổng 24700 mở)

**Windows PowerShell:**

```powershell
scp -P 24700 "C:\Users\nguye\Magnix-automation\n8n-workflows\credentials\google-service-account.json" root@103.72.99.131:/opt/housex/secrets/google-sa.json
ssh -p 24700 root@103.72.99.131 "chmod 600 /opt/housex/secrets/google-sa.json && python3 -m json.tool /opt/housex/secrets/google-sa.json >/dev/null && echo JSON_OK"
```

#### Cách B — base64 qua console (khi không dùng được scp)

#### Bước W1 — Windows PowerShell (máy bạn)

```powershell
cd C:\Users\nguye\Magnix-automation\Proptech-HouseX
.\scripts\export-google-sa-base64.ps1
notepad C:\Users\nguye\Magnix-automation\n8n-workflows\credentials\google-sa.b64.txt
```

Trong Notepad: `Ctrl+A` → `Ctrl+C` (copy **một dòng** base64).

#### Bước L1 — VPS Linux (console iNET / SSH)

```bash
nano /tmp/sa.b64
```

Paste **một dòng** (chuột phải hoặc Shift+Insert) → `Ctrl+O` → Enter → `Ctrl+X`

Kiểm tra file base64 **không rỗng**:

```bash
wc -c /tmp/sa.b64
# kỳ vọng: ~3100–3300 (không được 0)
head -c 20 /tmp/sa.b64
# kỳ vọng: bắt đầu bằng eyJ (base64 của "{")
```

#### Bước L2 — Decode trên VPS

```bash
cd /opt/housex/Proptech-HouseX
chmod +x scripts/decode-google-sa.sh
rm -f /opt/housex/secrets/google-sa.json
./scripts/decode-google-sa.sh /tmp/sa.b64
rm -f /tmp/sa.b64
```

Kỳ vọng:

```text
OK → /opt/housex/secrets/google-sa.json
"client_email": "bds-pipeline@gpl-automation.iam.gserviceaccount.com"
```

Xác nhận JSON (~2364 bytes):

```bash
wc -c /opt/housex/secrets/google-sa.json
python3 -m json.tool /opt/housex/secrets/google-sa.json >/dev/null && echo JSON_OK
```

#### Bước L3 — Share Sheet + tab

1. Mở Google Sheet ID `GOOGLE_SHEET_MIRROR_ID`
2. **Share → Editor** cho `bds-pipeline@gpl-automation.iam.gserviceaccount.com`
3. Tạo tab tên **`ops_mirror`** (đúng chữ thường)

#### Bước L4 — Test mirror

```bash
cd /opt/housex/Proptech-HouseX
npm run go-live:check-sheet-mirror
pm2 restart housex --update-env
SITE=https://timnhaxahoi.com npm run go-live:smoke-sheet-mirror
```

Kỳ vọng smoke: `OK — tab=ops_mirror inbound=... noxh=...`

#### Lỗi thường gặp

| Triệu chứng | Nguyên nhân | Sửa |
|-------------|-------------|-----|
| `Expecting value: line 1 column 1` | File JSON **rỗng** | Làm lại W1→L2; `wc -c` phải > 2000 |
| `Unexpected end of JSON input` | Base64 cắt ngắn / thiếu ký tự | Copy lại **cả dòng** từ `.b64.txt` |
| `Unexpected token 'y', "y…"` | Paste **JSON thô** vào `.b64` hoặc decode hỏng | Xóa file, dùng **Cách A scp** hoặc copy đúng `.b64.txt` |
| `syntax error` với `[IO.File]` | Chạy PowerShell **trên VPS** | Chỉ chạy W1 trên Windows |
| HTTP 500 smoke | SA hỏng hoặc Sheet chưa share | JSON_OK trước; share Editor + tab |

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

## 4. Checklist go-live Phase 3B

- [x] `backup-postgres-vps.sh` chạy tay OK (production VPS, 2026-07-17)
- [x] `.sql.gz` pass `gzip -t` và `.sha256` pass `sha256sum -c`
- [x] Local disposable restore pass; evidence JSON có `result=passed` và `cleanup.database_dropped=true` (`reports/restore-verify-20260717.json`)
- [ ] `npm run media:audit-orphans` đã review orphan/missing media
- [ ] Cron backup + mirror trong `crontab -l`
- [ ] `go-live:check-sheet-mirror` pass
- [ ] `go-live:smoke-sheet-mirror` OK (không SKIP)
- [ ] Tab `ops_mirror` có dữ liệu sau smoke
- [ ] 1 file backup đã copy off-VPS (Drive)
- [ ] Off-VPS upload/download/checksum và VPS/DR restore proof đã lưu external
