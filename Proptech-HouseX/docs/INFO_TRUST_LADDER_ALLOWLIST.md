# Information trust ladder — allowlist vận hành (ops only)

> **Phạm vi:** tài liệu **hệ thống vận hành** (Magnix editorial, House X Ops/admin).
> **Không** publish trang này cho người đọc; **không** dump bảng URL lên Mini App / web khách.
>
> ADR-016 amendment (2026-07-21). **Không** scraper trong phase này.
> Thang tin: **T1 báo → T2 Sở → T3 hồ sơ → T4 SoR**. Sở = upgrade, không discovery gate.

| Lớp | File / surface | Nội dung |
|-----|----------------|----------|
| **Vận hành** | Doc này + ADR-016 + playbook §4b-5 (cột ops) + `NOXH_SPONSOR_WATCHLIST.md` | Mã tầng, baseUrl Sở, `VERIFIED/DOWN`, metadata `tier`/`pressUrl`/`sxdUrl`, SponsorGroup alias |
| **Người đọc** | Bài / landing / notify / trust panel đã biên tập | Disclaimer tiếng Việt + citation đã chọn + chip brand (nhãn khách) — map ADR-016 |

Mỗi item tin sớm **nội bộ** nên ghi: `tier` + `pressUrl?` + `sxdUrl?` + `projectId?`.
Khi publish: map `tier` → copy reader (không render mã tier).

---

## T1 — Media discovery (radar trước) — ops

Nguồn tham chiếu code (citation public đã chọn sẵn, không phải full allowlist ops):
`lib/content/editorial-trust.ts` → `NOXH_MEDIA_SOURCES`.

| id | Nguồn | URL | Vai trò | Ghi chú |
|----|-------|-----|---------|---------|
| `vnexpress-noxh` | VnExpress BĐS / NOXH | https://vnexpress.net/bat-dong-san/nha-o-xa-hoi | Discovery T1 | Có thể hiện 1 link bài cụ thể cho reader |
| `moc-gov` | Bộ Xây dựng | https://moc.gov.vn/ | Chính sách / tín hiệu ngành | Không thay SoR mở bán |
| `vanban-chinhphu` | Cổng VB Chính phủ | https://vanban.chinhphu.vn/ | Pháp lý quốc gia (song song ladder) | Điều kiện NOXH — lớp A, không phải tin dự án |

**Rule T1 (ops → reader):** publish/nurture phải có disclaimer người đọc
*«Theo báo chí / chưa thấy công bố Sở…»*. Không auto-notify từ scrape thô — editorial L2/L3 trước.

**Thiếu nguồn báo cụ thể:** không bịa URL; giữ draft nội bộ hoặc chỉ nói khu vực/chính sách chung.

### T1b — Keyword thương hiệu / CĐT (song song media)

Khách hay search theo tập đoàn (“NOXH Vingroup”, “Nam Long”…). Seed alias + quy tắc JV/UNLINKED:
[`NOXH_SPONSOR_WATCHLIST.md`](./NOXH_SPONSOR_WATCHLIST.md) (**ops only**).

- Query: `("nhà ở xã hội" OR NOXH) AND ({alias})` theo từng SponsorGroup.
- Tag lọc khách = `brand:{groupSlug}` — **không** theo MST pháp nhân dự án.
- CONTRACTOR (vd. Viettel Construction) = tín hiệu tiến độ, không chip CĐT.

---

## T2 — Sở Xây dựng (8 đơn vị Miền Nam sau sáp nhập) — upgrade only / ops

Đã kiểm tra live 2026-07-21 (HTTP 200 + title/email `@*.gov.vn`).  
`role=upgrade` — **không** block pipeline T1 nếu host `DOWN` / `MISSING`.

**Người đọc:** chỉ nhận link **văn bản/chuyên mục** khi biên tập nâng T2 — không nhận bảng 8 Sở.

| Đơn vị (sau sáp nhập) | baseUrl | status | Ghi chú verify |
|------------------------|---------|--------|----------------|
| TP. Hồ Chí Minh (HCM + Bình Dương + BR-VT) | https://soxaydung.hochiminhcity.gov.vn/ | VERIFIED | email `sxd@tphcm.gov.vn` |
| Đồng Nai (Đồng Nai + Bình Phước) | https://sxd.dongnai.gov.vn/ | VERIFIED | email `sxd@dongnai.gov.vn` |
| Tây Ninh (Tây Ninh + Long An) | https://sxd.tayninh.gov.vn/ | VERIFIED | email `soxaydung@tayninh.gov.vn` |
| Đồng Tháp (Đồng Tháp + Tiền Giang) | https://sxd.dongthap.gov.vn/ | VERIFIED | email `sxd@dongthap.gov.vn` |
| An Giang (An Giang + Kiên Giang) | https://sxd.angiang.gov.vn/ | VERIFIED | email `sxd@angiang.gov.vn` |
| Vĩnh Long (Vĩnh Long + Bến Tre + Trà Vinh) | https://sxd.vinhlong.gov.vn/ | VERIFIED | email `sxaydung@vinhlong.gov.vn` |
| TP. Cần Thơ (Cần Thơ + Sóc Trăng + Hậu Giang) | https://soxaydung.cantho.gov.vn/ | VERIFIED | email `soxd@cantho.gov.vn` |
| Cà Mau (Cà Mau + Bạc Liêu) | https://soxaydung.camau.gov.vn/ | VERIFIED | email `soxaydung@camau.gov.vn`; header HTTP lệch — dùng curl |

### Host thử và không dùng làm primary (ops)

| Host | status | Ghi chú |
|------|--------|---------|
| `soxaydung.tayninh.gov.vn` | DOWN | Không kết nối (2026-07-21) |
| `soxaydung.angiang.gov.vn` | DOWN | DNS không resolve |
| `sxd.camau.gov.vn` | MISSING | DNS không resolve |

**Citation T2:** ưu tiên URL **văn bản / chuyên mục** cụ thể trên Sở, không chỉ homepage.
Thiếu Sở → giữ T1 + disclaimer reader; fallback UBND `*.gov.vn` chỉ khi có văn bản attributable.

---

## T3 / T4 (không phải URL allowlist)

| Tier (ops) | Nguồn sự thật | Reader thấy |
|------------|---------------|-------------|
| T3 DossierReady | Editorial + legal docs dự án (House X admin) | FAQ / thủ tục — chưa = đang bán |
| T4 SoRSell | Postgres project status / LaunchTrigger | “Đang mở bán” / CTA tư vấn — chỉ khi SoR cho phép |

---

## Health-check (thưa) — ops only

- T1 media: khi biên tập tin sớm — mở URL citation, không cần cron.
- T2 Sở: re-verify khi sáp nhập/domain đổi hoặc khi nâng tier item lên T2; **không** suy đoán subdomain mới.
- Đổi status allowlist: `VERIFIED` → `DOWN` / `LEGACY` / `MISSING`; không xóa hàng sử dụng lịch sử citation.
- Không surface trạng thái host lên UI khách.

---

## Tham chiếu

- ADR: `.cursor/ADR-016-interest-waitlist-nurture-lane.md` (Information trust ladder + hai lớp bề mặt)
- Sponsor / CĐT keyword watchlist: `docs/NOXH_SPONSOR_WATCHLIST.md`
- Ops claim: `docs/OPS_PLAYBOOK.md` §4b-5
- Code media refs (public citation subset): `lib/content/editorial-trust.ts`
