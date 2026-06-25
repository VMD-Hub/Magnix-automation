# Google Sheet — tab `project_config` (Agent 1)

Thay **Airtable Project Config** bằng tab trong cùng file Sheet Magnix.

**Sheet:** [Database_Magnix_Lead](https://docs.google.com/spreadsheets/d/1fYB4h_BTiKXa9O3lBah-tQonWpQOQMG2aSkSfPs6yU4/edit)  
**Tab mới:** `project_config` (đặt tên **đúng chữ**, lowercase)

**Apify actor:** `clockworks/tiktok-scraper` — `profiles: [@handle]`, `resultsPerPage: 3`. Không dùng `apidojo/tiktok-scraper` (thường trả `noResults: true`).

---

## 1. Tạo tab (2 phút)

1. Mở Sheet → **+** thêm sheet → đổi tên **`project_config`**
2. Dòng **1** — dán header (copy dòng dưới):

```
project_id	url	platform	active	segment	notes
```

3. Dòng **2** — ví dụ test (sửa URL thật của bạn):

```
noxh-listen-01	https://www.tiktok.com/@ten_kenh	tiktok	true		Quét khung giờ vàng NOXH
```

4. **Share** Sheet cho email **Service Account** (vd. `magnix-sheets@....iam.gserviceaccount.com`) — Editor

---

## 2. Cột — map từ Airtable

| Cột Sheet | Bắt buộc | Airtable (thường gặp) | Workflow dùng |
|-----------|----------|------------------------|---------------|
| `project_id` | Khuyến nghị | Project ID / Name | Nhận diện dự án (meta, không bắt buộc code) |
| `url` | **Có** | URL / Profile URL / Link | Apify `startUrls` — có thể nhiều URL trong 1 ô, cách nhau `,` hoặc xuống dòng |
| `platform` | Khuyến nghị | Platform | `tiktok`, `fb_page`, `fb_group` — mặc định `tiktok` nếu trống |
| `active` | Khuyến nghị | Active / Enabled | `true` / `false` — chỉ `true` mới scrape |
| `segment` | Không | Niche / Segment | Ghi chú config (`config_segment_hint`) — pipeline vẫn `unclassified` |
| `notes` | Không | Notes | Ghi vào `meta` bản ghi content_queue |

**Alias cột URL** (code hỗ trợ): `url`, `urls`, `profile_url` — ưu tiên header tên `url`.

---

## 2b. Social listening — không cần kênh sở hữu

Agent 1 **theo dõi kênh công khai** (creator/ môi giới / tư vấn NOXH-BĐS) để:

- Bắt pain point, hook, format đang chạy trong ngách
- Claude lọc nội dung **qualified** → Sheet tab **`content_queue`** (tham khảo inbound, không spam)

**Không** yêu cầu bạn sở hữu kênh TikTok Magnix. Khi có kênh Hub/Spoke riêng → thêm dòng riêng trong `project_config` (hoặc Mạch 5 metrics).

| Cột `segment` | Ý nghĩa trên Sheet | Ghi vào content_queue |
|---------------|-------------------|--------------|
| `noxh_income` | Gợi ý ngách NOXH / vay mua nhà | Vẫn `unclassified` (classify sau Mạch 1) |
| `valuation` | Gợi ý ngách thẩm định / định giá | idem |
| `sme_credit` | Gợi ý ngách vay DN / room tín dụng | idem |
| `general_inbound` | BĐS chung, review dự án | idem |

Mỗi **dòng = một kênh** (một `@`). `active=false` = tạm tắt, không xóa.

**Mẫu đa kênh:** [`templates/project_config.listening-starter.csv`](./templates/project_config.listening-starter.csv)

**Tìm kênh NOXH trên TikTok:** search `#noxh`, `#nhaoxahoi`, `mua nhà ở xã hội`, `vay NOXH` → mở profile creator → copy URL → dán dòng `listen-noxh-02`, set `active=true`.

---

## 3. Env n8n

Cùng Sheet ID với `content_metrics`:

```env
GOOGLE_SHEET_CONTENT_METRICS_ID=1fYB4h_BTiKXa9O3lBah-tQonWpQOQMG2aSkSfPs6yU4
GOOGLE_SHEET_PROJECT_CONFIG_TAB=project_config
```

Workflow đọc Sheet qua node **Load Magnix Config** (Code) — không dùng `$env` trực tiếp trong Google Sheets node.

---

## 3b. Lỗi `access to env vars denied` (n8n 2.12+)

**Triệu chứng:** node báo `ExpressionError: access to env vars denied` — kể cả node **Load Magnix Config** (Code).

**Nguyên nhân:** n8n 2.12 mặc định **chặn toàn bộ** `$env` trong Code node lẫn biểu thức node (`N8N_BLOCK_ENV_ACCESS_IN_NODE` mặc định = block).

**Cách xử lý:**

| Bước | Việc cần làm |
|------|----------------|
| 1 | Thêm vào env container n8n VPS: `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` |
| 2 | **Restart hoàn toàn** container (`docker compose down` rồi `up -d`) |
| 3 | Re-import `social-listening.workflow.json` (**17 nodes**, không còn Load Magnix Config) |
| 4 | Sheet ID / tab `project_config` đã **hardcode** trong workflow — node **Read Project Config** chạy được ngay cả khi chưa bật bước 1 |
| 5 | Apify / Claude vẫn cần `$env` → **bắt buộc bước 1–2** |

File mẫu VPS: [`n8n-workflows/.env.vps.example`](./.env.vps.example)

---

## 3c. Lỗi `Node does not have any credentials set`

**Triệu chứng:** node Google Sheets / HTTP báo credential không set dù UI đã chọn.

**Nguyên nhân:** Import workflow kèm stub credential (chỉ `name`, không có `id` UUID thật) — n8n không bind được lúc Execute.

**Workflow mới (Agent 1):** không dùng Google Sheets node cho config — dùng **Fetch project_config** (HTTP Request) + **Parse project_config rows** (Code).

**Cách sửa sau import:**

1. Mở node **Fetch project_config**
2. **Authentication** → `Predefined Credential Type`
3. **Credential Type** → `Google Service Account API`
4. **Credential** → chọn SA của bạn (tên bất kỳ)
5. Trong credential SA trên n8n: bật **Set up for use in HTTP Request node** + scope Sheets/Drive
6. **Save workflow** (Ctrl+S)
7. Kiểm tra: Export workflow → tìm `"googleApi"` phải có `"id": "xxxxxxxx-xxxx-..."`

**Nếu vẫn lỗi:** xóa node Fetch → thêm HTTP Request mới từ palette → cấu hình lại → Save.

---

## 3d. Lỗi `401 Authorization failed` trên Fetch project_config

**Triệu chứng:** HTTP Request báo `UNAUTHENTICATED` / `Expected OAuth 2 access token`. UI cảnh báo vàng: *specify the scope(s) for the Service Account*.

**Nguyên nhân:** Credential bật **Set up for use in HTTP Request node** nhưng field **Scope(s)** để trống — n8n không xin quyền Sheets → Google từ chối.

**Cách sửa (copy-paste vào credential):**

1. **Credentials** → mở **Google Service Account account 2**
2. **Set up for use in HTTP Request node** → ON
3. Field **Scope(s)** — dán **3 dòng** sau (mỗi dòng một scope):

```
https://www.googleapis.com/auth/spreadsheets
https://www.googleapis.com/auth/drive.file
https://www.googleapis.com/auth/drive.metadata
```

4. **Save** credential
5. Workflow → node **Fetch project_config** → Save workflow → Execute lại

**Cách dễ hơn (không cần scope thủ công):** tắt **Set up for use in HTTP Request node** trên credential → dùng node **Google Sheets** (Authentication: Service Account) thay HTTP Request — scope tự thêm.

**Kiểm tra Sheet ID** trên node Fetch phải đúng:

`1fYB4h_BTiKXa9O3lBah-tQonWpQOQMG2aSkSfPs6yU4`

(chữ `l` vs `I`, `O` vs `0` — copy từ URL Sheet, không gõ tay)

---

## 4. Lịch chạy (schedule n8n)

Chi tiết đầy đủ: [`SCHEDULE_LISTENING.md`](./SCHEDULE_LISTENING.md)

Cần `TZ=Asia/Ho_Chi_Minh` trong `/root/n8n.env` để giờ dưới đây là **giờ Việt Nam**.

| Workflow | Giờ | Ghi chú |
|----------|-----|---------|
| **Agent 1 TikTok** | **Thứ 2, 07:00** | `platform=tiktok` — 1×/tuần |
| **Agent 1 Facebook** | **Thứ 4, 07:00** | `platform=fb_page` / `fb_group` — tách khỏi TikTok |
| **Mạch 5 Content Scorecard** | **10:00** hàng ngày | Buffer sau listening |
| **uid-ingest** | Webhook | Không schedule |

### Platform (`project_config`)

| Giá trị | Workflow nhận |
|---------|----------------|
| `tiktok`, `tt` | TikTok weekly |
| `fb_page`, `page`, `facebook` | Facebook weekly |
| `fb_group`, `group` | Facebook weekly |

Tạo thêm tab **`scrape_index`** và **`channel_state`** trên cùng Sheet — xem `SCHEDULE_LISTENING.md`.

Rebuild:

```powershell
node n8n-workflows/build-social-listening.mjs
node n8n-workflows/build-social-listening-facebook.mjs
```

---

## 5. Kiểm tra

```powershell
node scripts/verify-google-setup.mjs
```

Phải thấy: `sheet_tab_project_config` → **pass**

---

## 6. Import CSV mẫu (tuỳ chọn)

File mẫu: [`templates/project_config.example.csv`](./templates/project_config.example.csv)

Sheet → File → Import → Upload → **Insert new sheet(s)** → đổi tên tab thành `project_config` → xóa tab import thừa nếu cần.

---

## 7. Migrate từ Airtable

1. Export Airtable base → CSV  
2. Đổi tên cột cho khớp bảng §2  
3. Paste vào tab `project_config` (giữ header dòng 1)  
4. Manual run workflow mới → node **Split URLs from Config** phải > 0 item
