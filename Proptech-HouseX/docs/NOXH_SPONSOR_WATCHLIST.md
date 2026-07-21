# NOXH Sponsor Watchlist — tập đoàn / CĐT / keyword T1 (ops only)

> **Phạm vi:** vận hành Magnix editorial + House X Ops/admin.  
> **Không** publish bảng này cho người đọc; **không** tạo tag khách theo từng MST/JV.  
> ADR-016 · trust ladder T1 (báo) · [`INFO_TRUST_LADDER_ALLOWLIST.md`](./INFO_TRUST_LADDER_ALLOWLIST.md).  
> Seed ngày: 2026-07-21. Phạm vi: **8 tỉnh/thành Miền Nam + brand quốc gia có pipeline NOXH vào Nam**.

Khách tìm dự án theo **thương hiệu trên báo** (“NOXH Vingroup”, “Nam Long”, “Phúc Đạt”…).  
Pháp nhân CĐT thường là **công ty con / JV mới** từng dự án → seed MST sẽ luôn thiếu.  
Watchlist này seed theo **SponsorGroup**; pháp nhân mới nuốt bằng quy trình UNLINKED (bên dưới).

---

## Hai lớp bề mặt

| Lớp | Nội dung | Surface |
|-----|----------|---------|
| **Vận hành** | `groupSlug`, alias[], role, MST/LegalEntity, UNLINKED inbox, query templates | Doc này, editorial queue |
| **Người đọc** | Chip/filter `brand:{groupSlug}` → nhãn “Vingroup”, “Nam Long”… | Web / Mini App filter; không hiện CONTRACTOR/CHANNEL như CĐT; không lộ MST trừ trang pháp lý dự án |

---

## Mô hình ba lớp (docs → map DB sau)

| Lớp | Ý nghĩa | Ví dụ | Map House X hiện tại |
|-----|---------|-------|----------------------|
| **SponsorGroup** | Tập đoàn / thương hiệu khách nhớ | Vingroup–Vinhomes, Nam Long | Tag lọc `brand:*` |
| **BrandLine** (optional) | Dòng sản phẩm NOXH | Happy Home, Ehome/EhomeS | Keyword phụ + copy |
| **LegalEntity** | Pháp nhân CĐT trên giấy (MST) | CP Phát triển Thành Phố Xanh | `Developer` (`name` + `taxCode`) — ghi `parentGroupSlug` ops đến khi có quan hệ DB |

### Vai trò (bắt buộc)

| role | Ý nghĩa | Tag khách? |
|------|---------|------------|
| `SPONSOR` | Tập đoàn / CĐT thương hiệu | Có — `brand:{groupSlug}` |
| `JV_SUBSIDIARY` | Pháp nhân con / liên doanh đứng tên dự án | Không tag riêng; kế thừa tag group mẹ |
| `CONTRACTOR` | Nhà thầu thi công | **Không** tag CĐT; chỉ radar tiến độ |
| `CHANNEL` | Đơn vị triển khai bán hàng / truyền thông / phân phối F1 (CĐT & thi công có thể khác) | **Không** tag như CĐT; radar discovery → extract CĐT thật |

**Lưu ý Kim Oanh / CHANNEL:** trên báo thường hiện tên đơn vị bán hàng trước. Ops **bắt buộc** tách: CĐT (LegalEntity/SponsorGroup) ≠ CHANNEL ≠ CONTRACTOR theo từng dự án. Chỉ gán `brand:kim-oanh` khi xác nhận Kim Oanh (hoặc CT thành viên) **đúng là CĐT** (vd. một số dự án K-Home).

---

## Seed SponsorGroup (ưu tiên) + tag khách

Tag người đọc = `brand:{groupSlug}` (ổn định khi JV đổi).

| groupSlug | Nhãn khách | role | Alias / keyword báo (T1) | BrandLine / ghi chú Miền Nam |
|-----------|------------|------|--------------------------|------------------------------|
| `vingroup` | Vingroup / Vinhomes / Happy Home | SPONSOR | Vingroup, Vinhomes, Happy Home, NƠXH Happy Home, Thành Phố Xanh | Happy Home; pipeline HCM + Tây Ninh; pháp nhân dự án thường CT con |
| `nam-long` | Nam Long | SPONSOR | Nam Long, NLG, Ehome, EhomeS, Izumi, Nam Long 2 | Ehome / EhomeS; Cần Thơ + HCM/Đồng Nai |
| `becamex` | Becamex | SPONSOR | Becamex, BCM, Định Hòa, Việt Sing, Becamex IJC | NOXH quy mô lớn khu Bình Dương (sau sáp nhập HCM) |
| `phuc-dat` | Phúc Đạt | SPONSOR | Phúc Đạt, Phuc Dat | Đông HCM / Tân Uyên — keyword khách hay search |
| `duc-manh` | Đức Mạnh | SPONSOR | Đức Mạnh, Lý Thường Kiệt NOXH | Landing Phú Thọ DMC |
| `phuc-loc-tho` | Phúc Lộc Thọ | SPONSOR | Phúc Lộc Thọ, Lê Văn Chí | Thủ Đức / Linh Xuân |
| `dta` | Đệ Tam / DTA | SPONSOR | DTA, Đệ Tam, DTA Happy Home, Nhơn Trạch | Landing DTA Happy Home |
| `le-thanh` | Lê Thành | SPONSOR | Lê Thành, NOXH Lê Thành | CĐT NOXH HCM quen thuộc |
| `xuan-mai` | Xuân Mai | SPONSOR | Xuân Mai, Xuân Mai Sài Gòn | Danh mục NOXH đô thị |
| `hoang-nam` | Hoàng Nam | SPONSOR | Hoàng Nam, Lê Cơ | Seed riêng đến khi xác nhận link Nam Long; có thể gộp alias sau |

### Watch phụ — CONTRACTOR (không tag CĐT)

| slug | role | Alias / keyword | Ghi chú |
|------|------|-----------------|---------|
| `viettel-construction` | CONTRACTOR | Viettel Construction, Viettel xây dựng, CTR | Thi công (vd. tín hiệu tiến độ Việt Sing); **không** chip “CĐT Viettel” trừ khi có bằng chứng là CĐT |

### Watch phụ — CHANNEL (triển khai bán hàng / truyền thông — không bỏ sót dự án)

Đơn vị hay xuất hiện trên báo/landing trước CĐT pháp lý. Dùng để **phát hiện dự án sớm**, rồi gắn về SponsorGroup/LegalEntity thật.

| slug | role | Alias / keyword | Ghi chú Miền Nam |
|------|------|-----------------|-----------------|
| `kim-oanh` | CHANNEL (+ SPONSOR khi đủ bằng chứng) | Kim Oanh, Kim Oanh Group, KOG, Kim Oanh Land, Kim Oanh Realty, Kim Oanh Real, K-Home | Thường: truyền thông + bán hàng; CĐT/thi công **có thể khác theo dự án**. Một số dự án K-Home / Kim Oanh Land có thể là CĐT — resolve từng dự án, không mặc định `brand:kim-oanh` |
| `ann-home` | CHANNEL | Ann Home, Nhà Ann Home, annhome.vn | Phân phối F1 / tư vấn NOXH (vd. Happy Home, Thủ Thiêm Green House) — CĐT thường Vingroup hoặc CĐT khác |
| `alo-can-ho` | CHANNEL | Alo Căn Hộ, alocanhosg | Landing/list NOXH HCM dạng sàn — luôn extract CĐT từ bài |

**Pattern CHANNEL (mở rộng, không giới hạn seed):** trong hit báo nếu thấy
«phân phối chính thức» · «đơn vị triển khai» · «F1» · «sàn giao dịch» · «đại lý độc quyền»
kèm tên công ty → `roleHint=CHANNEL` + **bắt buộc** tìm câu «chủ đầu tư» / tên Công ty CĐT trong cùng bài (hoặc UNLINKED CĐT).

### Emerging (không giới hạn seed)

Mọi hit báo có tín hiệu NOXH + tên công ty **không** khớp alias → tạo `LegalEntity` status `UNLINKED` (hoặc group tạm `emerging:{slug}`) → queue editorial:

- Gắn vào SponsorGroup có sẵn, **hoặc**
- Tạo SponsorGroup mới + nhãn khách + alias, **hoặc**
- Giữ UNLINKED (vẫn T1 + disclaimer; không bịa brand).

---

## Phương pháp bao phủ pháp nhân JV / công ty mới

```
Press T1 (keyword) → extract brandHint + legalEntityName + mst? + roleHint
  → roleHint = CHANNEL?
      YES → ghi channelSlug; extract CĐT riêng → resolve SponsorGroup / UNLINKED
           (không gán brand tag = channel trừ khi chứng minh CHANNEL cũng là SPONSOR)
  → alias match SponsorGroup (SPONSOR)?
      YES → link LegalEntity dưới group
      NO  → UNLINKED inbox → human link / new group / discard
  → CONTRACTOR match → radar tiến độ only
  → optional T2 khi có sxdUrl
  → Reader: brand:{groupSlug CĐT} (+ tỉnh); không chip CHANNEL như CĐT
```

### 1) Query templates (T1 media) — ops

Chạy khi biên tập / định kỳ thủ công (chưa scraper phase này):

```text
("nhà ở xã hội" OR "nhà ở công nhân" OR NOXH OR NƠXH) AND ({alias})

("chủ đầu tư" OR "CĐT" OR "Công ty") AND ("nhà ở xã hội") AND ({tỉnh|thành})

("nhà ở xã hội" OR NOXH) AND ("phân phối" OR "đơn vị triển khai" OR "F1" OR "đại lý") AND ({channelAlias})
```

`{alias}` lấy từ cột alias từng group. `{tỉnh|thành}` ưu tiên 8 đơn vị sau sáp nhập (HCM, Đồng Nai, Tây Ninh, Đồng Tháp, An Giang, Vĩnh Long, Cần Thơ, Cà Mau).

### 2) Extract tối thiểu mỗi hit

`pressUrl` · ngày · `brandHint` · `legalEntityName` · `mst?` · `projectNameHint` · `provinceHint` · `roleHint` (`SPONSOR` \| `JV_SUBSIDIARY` \| `CONTRACTOR` \| `CHANNEL`) · `channelSlug?` · `tier=T1`

### 3) Resolve

| Điều kiện | Hành động |
|-----------|-----------|
| `brandHint` / tên CT khớp alias SPONSOR group | Gắn `parentGroupSlug`; tạo/cập nhật LegalEntity; tag khách = group |
| Khớp CHANNEL slug (Kim Oanh, Ann Home, …) | Ghi `channelSlug`; **extract CĐT** trong bài → resolve group/UNLINKED; **không** tự gán `brand:kim-oanh` trừ khi CĐT = Kim Oanh/K-Home đủ bằng chứng |
| Khớp CONTRACTOR slug | Radar tiến độ only; không gán tag brand CĐT |
| Không khớp | `UNLINKED` — vẫn được nurture T1 sau editorial + disclaimer |
| Có citation Sở | Nâng T2; gắn `sxdUrl` (ADR-016) |

### 4) Backfill Sở (T2)

Định kỳ danh mục dự án NOXH trên 8 portal Sở ([`INFO_TRUST_LADDER_ALLOWLIST.md`](./INFO_TRUST_LADDER_ALLOWLIST.md)) → bổ sung LegalEntity/MST thiếu, link group nếu nhận diện được thương hiệu.

### 5) Tag khách — quy tắc cứng

- Chỉ expose **`brand:{groupSlug}`** của **CĐT / SponsorGroup** (+ tỉnh nếu có filter khu vực).
- **Không** tạo tag mới cho mỗi JV/MST.
- **Không** expose `viettel-construction` như CĐT trên filter chính.
- **Không** expose CHANNEL (`kim-oanh`, `ann-home`, …) như chip CĐT; có thể hiện dòng phụ “Đơn vị tư vấn/phân phối: …” trên landing nếu biên tập chọn — không thay filter brand.
- Chip UI dùng **nhãn khách** (cột “Nhãn khách”), không hiện `groupSlug` thô nếu có thể tránh.

---

## Metadata item tin sớm nội bộ (bổ sung)

Ngoài `tier` + `pressUrl?` + `sxdUrl?` + `projectId?` (trust ladder):

`groupSlug?` · `legalEntityName?` · `mst?` · `roleHint?` · `channelSlug?` · `resolveStatus` (`LINKED` \| `UNLINKED` \| `CONTRACTOR_ONLY` \| `CHANNEL_PENDING_SPONSOR`)

---

## Không làm trong phase doc này

- Prisma `SponsorGroup` / quan hệ `Developer.parentGroupId`
- Scraper Google/News tự động
- UI filter product (triển khai sau khi doc ổn)

`Developer` hiện tại tiếp tục dùng cho pháp nhân dự án; ops ghi `parentGroupSlug` trong note/editorial until schema.

---

## Tham chiếu

- ADR-016 Information trust ladder: `.cursor/ADR-016-interest-waitlist-nurture-lane.md`
- Media + Sở allowlist: `docs/INFO_TRUST_LADDER_ALLOWLIST.md`
- Ops claim: `docs/OPS_PLAYBOOK.md` §4b-5
- SC-8: `docs/SALES_CONVERSION_BACKLOG.md`
