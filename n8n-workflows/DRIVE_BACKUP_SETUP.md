# Google Drive — Backup JSON

Backup **fire-and-forget**: mỗi lead = 1 file `{normalized_key}.json` trong folder cố định.

## Bước 1 — Folder

1. Google Drive → tạo folder `Magnix_Automation/leads`  
2. Copy **Folder ID** từ URL → `GOOGLE_DRIVE_ARCHIVE_FOLDER_ID` trên n8n

## Bước 2 — Credential n8n

1. n8n → Credentials → **Google Drive OAuth2**  
2. Connect tài khoản Google (nên xác minh SĐT để có ~15 GB)  
3. Gán credential cho node **Drive Backup Upload** trong workflow

**Tái dùng Lifestyle:** nếu `n8n.vmd.asia` đã có Google OAuth cho BDS/Sheet → chọn lại credential đó. Service account BDS: `bds-pipeline@gpl-automation.iam.gserviceaccount.com` — share folder backup cho email này nếu chuyển sang SA sau (xem `CREDENTIALS_FROM_LIFESTYLE.md`).

## Bước 3 — Env

```bash
GOOGLE_DRIVE_ARCHIVE_FOLDER_ID=your_folder_id
MAGNIX_DRIVE_BACKUP=true   # false = tắt nhánh backup
```

## Hành vi

- Upload **song song** với Google Sheet — lỗi Drive **không** fail webhook nếu Sheet write đã thành công
- File trùng tên → Drive node ghi đè (update) — idempotent theo `normalized_key`  
- Khôi phục khi mất VPS: lead/content vẫn trên Google Sheet + file JSON trên Drive

## Dung lượng

~15 GB free ≈ hàng trăm nghìn file JSON lead text. Giám sát tại [one.google.com/storage](https://one.google.com/storage).
