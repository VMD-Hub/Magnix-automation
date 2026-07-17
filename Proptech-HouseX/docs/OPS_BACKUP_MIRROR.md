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
chmod +x scripts/install-housex-backup.sh
sudo ./scripts/install-housex-backup.sh
# Điền secret chỉ trong /etc/housex/backup.env, không paste vào command/history.
```

Installer copy backup/upload/verify vào `/usr/local/libexec/housex-backup/`, wrapper
và checker vào `/usr/local/sbin/`, owner `root:root`, mode `0755`; env là `0600`.
Nếu env đã tồn tại, installer giữ nội dung và chỉ siết owner/mode. Installer chỉ
**in** cron để review, không đọc/ghi đè crontab. Runtime từ chối symlink, executable
không thuộc root, executable/parent directory group-writable hoặc world-writable,
và env không root-only. Vì vậy cron không chạy script trực tiếp trong deploy tree.

### rclone Drive + crypt (OAuth là bước thủ công)

1. Trên máy có browser, chạy `rclone config` và tạo remote backend Drive, ví dụ
   `housex-drive`. OAuth consent/login trong browser là **manual boundary**; script,
   CI và agent không được tự đăng nhập hoặc lưu token vào repo.
2. Tạo remote thứ hai loại `crypt`, ví dụ `housex-crypt`, trỏ
   `remote = housex-drive:housex-backup-encrypted`. Bật mã hóa filename và directory
   name. Hook kiểm tra cả `type = crypt` lẫn backend trực tiếp bên dưới phải là
   `type = drive`; local, SFTP và backend cùng VPS đều bị từ chối. Không dùng
   `housex-drive:...` trực tiếp cho hook.
3. Chuyển `rclone.conf` tới VPS ngoài repo, đặt owner `root:root`, mode `0600`.
   Chạy `rclone config file` dưới root để xác nhận đúng file. Không log
   `rclone config show` vì có credential đã obfuscate. Ghi absolute path vào
   `RCLONE_CONFIG`; runtime/checker cũng từ chối symlink, non-root owner hoặc
   group/other permission trên file và parent chain không an toàn.
4. Trong `/etc/housex/backup.env`, đặt
   `HOUSEX_BACKUP_RCLONE_REMOTE=housex-crypt:postgres`, URL webhook HTTPS và
   `MAGNIX_WEBHOOK_TOKEN`. Giữ `HOUSEX_BACKUP_REQUIRE_OFFSITE=true`.

Preflight chỉ đọc và in cron; không sửa crontab:

```bash
/usr/local/sbin/housex-backup-check /etc/housex/backup.env
HOUSEX_BACKUP_ENV_FILE=/etc/housex/backup.env /usr/local/sbin/housex-backup-cron
npm run go-live:print-cron
crontab -e
```

Dòng backup idempotent:

```cron
15 2 * * * HOUSEX_BACKUP_ENV_FILE=/etc/housex/backup.env /usr/local/sbin/housex-backup-cron >> /var/log/housex-backup.log 2>&1
```

Mỗi lần chạy dùng `flock` để chặn hai cron chạy chồng nhau. Dump được ghi vào
file tạm, kiểm tra `gzip`, kiểm tra stream SQL không rỗng, tạo SHA-256 rồi mới
atomic rename thành `housex-*.sql.gz`. Retention chỉ chạy sau các bước này và
luôn giữ bản backup thành công mới nhất, kể cả khi retention đặt bằng `0`.

### Off-site upload/verify và fail-closed retention

Hai hook giữ nguyên interface `<backup.sql.gz> <backup.sql.gz.sha256>`. Upload
kiểm tra checksum/gzip local rồi ghi hai object timestamp bất biến bằng
`rclone copyto --immutable`. Verify tải **cả hai** object vào `mktemp`, tự kiểm tra
trusted local checksum, yêu cầu checksum remote khớp chính xác hash/tên local,
kiểm tra SHA-256/gzip và xóa temp trên mọi exit.

Retention xác minh **từng object cũ** trước khi xóa. Thiếu checksum local hoặc object
remote cũ không download/verify được thì giữ file đó và toàn backup run exit nonzero
để monitoring thấy lỗi. Việc newest object pass không cấp quyền prune object khác.

Thiếu hook, upload lỗi, remote corruption hoặc verify lỗi đều làm backup exit
nonzero, giữ backup local và **không prune**. Cron wrapper không phát lại raw
docker/rclone output; nó ghi status bounded và POST event deterministic
`housex-backup:YYYY-MM-DD:workflow_blocked` tới `telegram-notify`. Webhook tiếp tục
dedupe theo `event_id`. Alert lỗi không thay đổi exit code backup.

HTTP 200 chưa đủ chứng minh alert. Wrapper chỉ chấp nhận
`telegram_sent:true`, hoặc duplicate response chính xác
`ok:true, duplicate:true, skipped:true, reason:"DUPLICATE_EVENT_ID"` — nghĩa là
event ID hôm đó đã được notify workflow ghi nhận trước đó. Response bị giới hạn
4 KiB, parse kín và không log.

Google Drive không có backend object lock/WORM trong cấu hình này.
`rclone --immutable` chỉ là client-side protection của lần gọi đó; credential khác
vẫn có thể sửa/xóa object. Dùng dedicated Drive account/folder với quyền tối thiểu,
không share Editor rộng, và coi quarterly downloaded restore là control bắt buộc.

### Rotation, theo dõi và restore drill

- Rotate OAuth/rclone token và `MAGNIX_WEBHOOK_TOKEN` ít nhất mỗi 90 ngày hoặc ngay
  khi nghi lộ; cập nhật file root-only bằng atomic replace, chạy preflight + backup
  tay, rồi revoke credential cũ. Không gửi token qua chat/log.
- Mỗi sáng kiểm tra có dòng `OK House X daily backup completed` trong log và không
  có `workflow_blocked` chưa xử lý. Một alert/ngày được dedupe, nhưng lỗi phải được
  xử lý ngay, không chờ alert kế tiếp.
- Telegram không thể báo lỗi xảy ra trước khi env an toàn/credential được load
  (env mất, owner/mode/parent sai, wrapper bị từ chối). Khuyến nghị thêm dead-man
  bên ngoài VPS: wrapper ping heartbeat URL chỉ sau exit `0`, dịch vụ ngoài cảnh báo
  nếu quá 26–30 giờ không có heartbeat. Heartbeat URL cũng phải nằm trong env
  root-only; đây là khuyến nghị, chưa được script triển khai.
- Hàng quý: chọn object từ **crypt remote**, download bằng rclone vào máy DR,
  kiểm checksum/gzip, chạy `db:verify-restore` với DB disposable, lưu evidence
  create-only ngoài VPS. Không dùng bản local VPS làm bằng chứng off-site.
- Test hermetic không cần network: `npm run backup:test`.

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
- [ ] OAuth Drive + rclone crypt đã cấu hình thủ công dưới root, file mode `0600`
- [ ] `/usr/local/sbin/housex-backup-check` pass và installed cron wrapper có trong `crontab -l`
- [ ] Upload + independent download/checksum/gzip từ crypt remote pass
- [ ] Alert `workflow_blocked` controlled test đã delivery/dedupe thực tế
- [ ] Quarterly DR restore từ object off-site đã pass và evidence lưu external
