# Registry tổ chức KD dịch vụ BĐS — tài sản dữ liệu nội bộ (ops only)

> **Phạm vi:** Magnix editorial + House X Ops/admin — **quản lý / biên tập nội bộ**.  
> **Không** publish nguyên bảng này lên `/tin-tuc`, Mini App, hay web khách.  
> ADR-016 · [`INFO_TRUST_LADDER_ALLOWLIST.md`](./INFO_TRUST_LADDER_ALLOWLIST.md) · **không scraper bulk** trong phase này.  
> Seed inventory: **2026-07-21**. Cập nhật tay khi có GP Sở / tin MOC / export ĐKKD.
>
> **Admin UI (Chủ quản):** [`/admin/re-service-orgs`](/admin/re-service-orgs) · seed `lib/admin/re-service-org-registry.ts` · API `GET /api/admin/re-service-orgs` (super-only). Ops role **không** thấy nav này.

## Mục đích

| Mục tiêu | Ghi chú |
|----------|---------|
| Tài sản dữ liệu nội bộ | SoR tạm thời dạng doc → sau map DB/admin nếu cần |
| Biên tập trước khi ra tin | Hub reader chỉ dùng **subset đã L2/L3** + disclaimer ngày nguồn |
| Đối chiếu môi giới / sàn | Hỗ trợ trust, sponsor CHANNEL, kiểm tra đối tác |

## Hai lớp pháp lý (bắt buộc tách)

| Lớp | Cơ quan / hệ thống | Chứng minh | Không chứng minh |
|-----|-------------------|------------|------------------|
| **L1 — Pháp nhân** | Phòng ĐKKD / Sở KH&ĐT → [dangkykinhdoanh.gov.vn](https://dangkykinhdoanh.gov.vn/) | Tồn tại DN, MST, địa chỉ, ngành nghề trên GCN | Đã thông báo / đủ điều kiện hành nghề dịch vụ BĐS |
| **L2 — Hoạt động dịch vụ** | Sở Xây dựng cấp tỉnh → [bds.moc.gov.vn](https://bds.moc.gov.vn/) (login) + chuyên mục Sở + feed MOC | Đã gửi thông tin / GP sàn theo Luật KD BĐS 2023 | Chất lượng dịch vụ, “uy tín” thương mại |

**Rule ops:** có mã ngành trên GCN (6821 môi giới / 6829 tư vấn–đấu giá; trước 15/11/2025 thường 6820) **≠** đã đăng tải hoạt động trên địa bàn.

**Bulk theo ngành từ ĐKKD:** không có dump công khai — cần **dịch vụ thông tin có phí** (`dichvuthongtin@dangkykinhdoanh.gov.vn`) hoặc NDXP (cơ quan NN). Không scrape portal.

---

## Schema hàng registry (ops)

Mỗi bản ghi tối thiểu:

| Field | Bắt buộc | Ví dụ |
|-------|----------|--------|
| `id` | có | `dn-san-dai-dong-cat` |
| `unitType` | có | `SAN` \| `MOI_GIOI` \| `TU_VAN_QL` \| `UNKNOWN` |
| `name` | có | Sàn giao dịch BĐS Đại Đồng Cát |
| `adminUnitNew` | có | `dong-nai` (slug địa giới **mới**) |
| `adminUnitLegacyLabel` | optional | `"Bình Phước"` nếu nhãn văn bản còn cũ |
| `mst` | optional | điền sau khi tra dangkykinhdoanh |
| `permitOrNoticeRef` | optional | `28/GP-SoXD` · ngày |
| `sourceKind` | có | `SXD_PAGE` \| `MOC_FEED` \| `LEGACY_PDF` \| `DKK_LOOKUP` \| `PAID_DKK_EXPORT` |
| `sourceUrl` | có | URL cụ thể |
| `observedAt` | có | `2026-07-21` |
| `confidence` | có | `HIGH` (Sở/MOC cùng khớp) · `MED` (một nguồn) · `LOW` (legacy / chưa re-verify) |
| `opsStatus` | có | `ACTIVE_CANDIDATE` \| `NEEDS_VERIFY` \| `ARCHIVE` \| `STALE` |
| `readerEligible` | mặc định `no` | Chỉ `yes` sau L2/L3 + disclaimer ngày nguồn |

---

## Địa giới hành chính mới → nguồn Sở (Miền Nam)

Khớp 8 đơn vị trong allowlist T2. Host legacy ghi `DOWN` nếu không còn phục vụ dump.

| `adminUnitNew` | Địa giới mới | Thành phần (cũ) | baseUrl Sở XD | Host status (2026-07-21) | Registry org trên Sở? |
|----------------|--------------|-----------------|---------------|--------------------------|------------------------|
| `tp-hcm` | TP. Hồ Chí Minh | HCM + Bình Dương + BR-VT | https://soxaydung.hochiminhcity.gov.vn/ | VERIFIED | Chuyên mục [Tổ chức KD dịch vụ BĐS](https://soxaydung.hochiminhcity.gov.vn/Tin-tuc/Thong-tin-nha-o-va-thi-truong-bat-%C4%91ong-san/To-chuc-kinh-doanh-dich-vu-B%C4%90S) — **hiện không dump list** (chỉ TB sát hạch) |
| `dong-nai` | Đồng Nai | Đồng Nai + Bình Phước | https://sxd.dongnai.gov.vn/ | VERIFIED | **Có** — sàn + DN môi giới (mỏng) |
| `tay-ninh` | Tây Ninh | Tây Ninh + Long An | https://sxd.tayninh.gov.vn/ | VERIFIED | Không list org (sát hạch CCHN) |
| `dong-thap` | Đồng Tháp | Đồng Tháp + Tiền Giang | https://sxd.dongthap.gov.vn/ | VERIFIED | Không list org |
| `an-giang` | An Giang | An Giang + Kiên Giang | https://sxd.angiang.gov.vn/ | VERIFIED* | Chưa thấy list |
| `vinh-long` | Vĩnh Long | Vĩnh Long + Bến Tre + Trà Vinh | https://sxd.vinhlong.gov.vn/ | VERIFIED | Không list org |
| `can-tho` | TP. Cần Thơ | Cần Thơ + Sóc Trăng + Hậu Giang | https://soxaydung.cantho.gov.vn/ | VERIFIED | Không list org |
| `ca-mau` | Cà Mau | Cà Mau + Bạc Liêu | https://soxaydung.camau.gov.vn/ | VERIFIED | Không list org |

\*Re-verify `sxd.angiang.gov.vn` theo allowlist (có biến thể host DOWN).

### Host địa giới cũ (fallback dump) — 2026-07-21

| Label cũ | Host thử | Status | Ghi chú ops |
|----------|----------|--------|-------------|
| Long An | `sxd` / `soxaydung.longan.gov.vn` | DOWN | Dùng Sở Tây Ninh mới + feed MOC |
| Bình Dương | `*.binhduong.gov.vn` | DOWN | Dùng Sở HCM mới + feed MOC |
| BR-VT | `*.baria-vungtau.gov.vn` | DOWN | Như trên |
| Bình Phước | `*.binhphuoc.gov.vn` | DOWN | Remnant: nhãn trong tin Đồng Nai (“Phúc Hưng Bình Phước”) |
| Hậu Giang / Sóc Trăng | `*.haugiang` / `*.soctrang` | DOWN | Dùng Sở Cần Thơ mới |

**Rule legacy:** văn bản / PDF công bố **trước sáp nhập** vẫn được giữ làm `ARCHIVE` + `confidence=LOW` nếu còn URL/file — **không** coi là “đang hoạt động” khi publish reader.

---

## Nguồn ưu tiên theo loại dữ liệu

| Nhu cầu | Nguồn ưu tiên | Fallback |
|---------|---------------|----------|
| GP / thông tin **sàn** mới | Feed MOC [Chuyên mục 1309](https://moc.gov.vn/vn/Pages/chuyenmuctin.aspx?ChuyenmucID=1309) + trang Sở | `bds.moc.gov.vn` (cần login — manual export) |
| DN **môi giới** đã thông báo | Chuyên mục Sở (nếu có) · Hà Nội có PDF định kỳ | Login `bds.moc.gov.vn` · paid ĐKKD không thay L2 |
| Pháp nhân / MST / ngành | `dangkykinhdoanh.gov.vn` (từng MST) | Paid dịch vụ thông tin ĐKKD |
| Hub địa bàn HCM lịch sử | PDF list sàn (trung gian, mốc ~2022–2024, ~473 dòng) | Chỉ `ARCHIVE`; re-verify từng tên trước khi dùng |

---

## Seed registry (đã quan sát 2026-07-21)

### A. Đồng Nai — `SXD_PAGE` (HIGH nếu khớp MOC)

Nguồn mục lục:

- Sàn: https://sxd.dongnai.gov.vn/vi/news/thong-tin-san-giao-dich-bat-dong-san/
- DN môi giới: https://sxd.dongnai.gov.vn/vi/news/doanh-nghiep-kinh-doanh-dich-vu-moi-gioi-bds/

| id | unitType | name | adminUnitNew | legacy label | permitOrNoticeRef | sourceKind | observedAt | confidence | opsStatus |
|----|----------|------|--------------|--------------|-------------------|------------|------------|------------|-----------|
| `dn-san-phuc-hung-bp` | SAN | Sàn giao dịch BĐS Phúc Hưng Bình Phước | `dong-nai` | Bình Phước | Đăng Sở 11/06/2026 | SXD_PAGE | 2026-07-21 | MED | ACTIVE_CANDIDATE |
| `dn-san-dai-dong-cat` | SAN | Sàn giao dịch BĐS Đại Đồng Cát | `dong-nai` | — | 28/GP-SoXD 06/12/2025 + đăng Sở 11/06/2026 | SXD_PAGE+MOC_FEED | 2026-07-21 | HIGH | ACTIVE_CANDIDATE |
| `dn-mg-dai-dien-hung` | MOI_GIOI | CTCP tư vấn và đầu tư BĐS Đại Điền Hưng | `dong-nai` | — | Đăng Sở 08/06/2026 | SXD_PAGE | 2026-07-21 | MED | NEEDS_VERIFY |

`mst`: để trống — ops điền sau tra `dangkykinhdoanh.gov.vn`.

### B. Feed MOC — Miền Nam (mẫu `MOC_FEED`, MED→HIGH khi có URL tin + số VB)

| id | unitType | name | adminUnitNew | permitOrNoticeRef | observedAt | confidence | opsStatus |
|----|----------|------|--------------|-------------------|------------|------------|-----------|
| `tn-san-alg` | SAN | Sàn giao dịch BĐS địa ốc ALG | `tay-ninh` | 1637/SXD-ĐKHĐ 09/12/2025 | 2026-07-21 | MED | ACTIVE_CANDIDATE |
| `vl-san-dinh-thai-son` | SAN | Sàn giao dịch BĐS Đỉnh Thái Sơn Real Estate | `vinh-long` | 396/BC-SXD 05/12/2025 | 2026-07-21 | MED | ACTIVE_CANDIDATE |
| `hcm-san-bell-land` | SAN | Sàn giao dịch BĐS BELL LAND | `tp-hcm` | GP Sở HCM (tin MOC ~12/01/2026) | 2026-07-21 | MED | NEEDS_VERIFY |
| `hcm-san-phu-an` | SAN | Sàn giao dịch BĐS Phú An | `tp-hcm` | 16211/SXD-ĐKHĐ 13/05/2026 | 2026-07-21 | MED | ACTIVE_CANDIDATE |
| `hcm-san-vpi` | SAN | Sàn giao dịch BĐS VPI | `tp-hcm` | 10021/SXD-ĐKHĐ 30/03/2026 | 2026-07-21 | MED | ACTIVE_CANDIDATE |

Bổ sung hàng mới: copy tin từ Chuyên mục 1309 → điền `sourceUrl` tin MOC cụ thể → nâng HIGH khi khớp trang Sở.

### C. ARCHIVE — HCM legacy list

| id | unitType | name | sourceKind | confidence | opsStatus | Ghi chú |
|----|----------|------|------------|------------|-----------|---------|
| `hcm-legacy-san-corpus-v1` | SAN | Corpus ~473 sàn đã đăng ký địa bàn TP.HCM (file trung gian) | LEGACY_PDF | LOW | ARCHIVE | Mốc ~2022–2024; **không** publish nguyên corpus; chỉ dùng để gợi ý tên → re-verify L1+L2 |

---

## Quy trình ops (intake registry)

1. **Ingest:** tin GP trên MOC 1309 **hoặc** bài mới trên chuyên mục Sở → thêm hàng `NEEDS_VERIFY`.
2. **Enrich L1:** tra MST / tình trạng / ngành trên dangkykinhdoanh (thủ công; không log PII thừa).
3. **Enrich L2:** xác nhận còn trên Sở / `bds.moc.gov.vn` (nếu có tài khoản) → `ACTIVE_CANDIDATE` + `confidence`.
4. **Editorial:** muốn ra tin người đọc → chọn **subset** + ngày nguồn + disclaimer; L2 `/devil` nếu claim pháp lý; L3 trước publish.
5. **Stale:** >12 tháng không re-verify → `STALE`; legacy PDF giữ `ARCHIVE`.

### Gate publish reader (tóm tắt)

| Được | Không được |
|------|------------|
| Bảng hub “tra cứu ở đâu” (link Sở/MOC đã chọn) | Dump toàn bộ registry ops |
| 3–15 dòng seed đã HIGH/MED + ngày cập nhật | Coi LEGACY_PDF là “đang hoạt động” |
| Checklist 2 lớp L1/L2 | Scrape / SDK không chính thức để bulk ĐKKD |

---

## Gap & backlog dữ liệu

| Gap | Ưu tiên | Hành động |
|-----|---------|-----------|
| Cần Thơ / Tây Ninh / Đồng Tháp / … không dump list trên Sở | P1 | Theo dõi MOC 1309 + xin tài khoản `bds.moc.gov.vn` (export theo địa bàn) |
| Thiếu MST trên seed | P1 | Tra từng tên trên dangkykinhdoanh; điền cột `mst` |
| HCM chuyên mục Tổ chức KD DV BĐS trống list | P1 | Theo dõi Sở; interim = MOC feed + ARCHIVE corpus |
| Bulk ngành 6821/6829 theo tỉnh | P2 | Báo giá dịch vụ thông tin ĐKKD (không scrape) |
| Map DB House X | P3 | Khi ổn định: Prisma `ReServiceOrg` + CRUD Admin (hiện Phase 1 = seed TS + UI đọc) — vẫn không public raw |

---

## Tham chiếu

- Trust ladder Sở: [`INFO_TRUST_LADDER_ALLOWLIST.md`](./INFO_TRUST_LADDER_ALLOWLIST.md)
- Sponsor / CHANNEL: [`NOXH_SPONSOR_WATCHLIST.md`](./NOXH_SPONSOR_WATCHLIST.md)
- ADR-016: `.cursor/ADR-016-interest-waitlist-nurture-lane.md`
- Luật / NĐ: Luật KD BĐS 2023 Đ.61; NĐ 96/2024 (GP sàn); NĐ 357/2025 Đ.22 (schema dữ liệu tổ chức dịch vụ BĐS)
- Cổng ĐKKD: https://dangkykinhdoanh.gov.vn/
- Hệ thống nhà ở & TT BĐS: https://bds.moc.gov.vn/ (login)
