# Playbook: Zalo UID → Hook Value-First → A / W / C

> **Mục tiêu:** Biến quặng `inbound_uid_leads` (`uid_source=zalo_group_raw`, score ~25) thành awareness → warm → contact, **không** cold-call / spam.
> **SoR:** Postgres House X · UI: `/admin/inbound-leads` · Telesales chỉ khi có Contact (SĐT / opt-in rõ).

---

## 1. Định nghĩa 3 tầng (A / W / C)

| Tầng | Tên | Tín hiệu chấp nhận | Hệ quả vận hành |
|------|-----|--------------------|-----------------|
| **A** | Awareness | Xem / lưu hook, follow OA, mở link lead magnet (chưa chat) | Giữ UID; `score` có thể +5–10; **không** gọi |
| **W** | Warm | Reply hỏi thêm, xin file, comment KEYWORD unlock, inbox câu hỏi | `ops_status=reviewing`; nurture; **chưa** gọi trừ khi họ xin gọi |
| **C** | Contact | Để SĐT / form / “nhờ gọi lại” / ConsentRecord purpose=contact | Promote → Ops Lead `NEW`; telesales |

**Quy tắc cứng:** Có trong group ≠ Contact. `consent_basis=partner` chỉ là provenance thu nhận.

---

## 1b. Phân loại nhóm mục tiêu (bắt buộc khi đo hook)

**Có — phải tách cohort theo loại nhóm.** Pool lẫn (Nhơn Trạch dân cư + Kế toán ĐN + Xanh SM…) làm KPI A/W/C **không đọc được**: không biết hook yếu hay audience sai.

### Taxonomy `meta.group_class` (gắn lúc dump / trước cut cohort)

| `group_class` | Ví dụ nhóm | Mục tiêu chính | Hook phù hợp | **Không** làm |
|---------------|------------|----------------|--------------|---------------|
| **geo_resident** | Dân cư Nhơn Trạch, Tôi là Người Nhơn Trạch | Người mua / ở thật tại khu | H1 checklist + **project-local** (tiến độ, pháp lý khu, so sánh khu) — VD DTA Happy Home | Hard sell căn; spam dự án mỗi ngày |
| **geo_work** | Kế toán–Nhân sự Đồng Nai, văn phòng DN | Thu nhập ổn / hồ sơ vay–NOXH | H1/H2 (điều kiện thu nhập, dòng tiền) — **không** gắn 1 dự án ngay | Pitch dự án địa lý xa / không liên quan |
| **topic_finance** | Tài chính, chứng khoán, vay | Intent tiền / đòn bẩy | H2 dòng tiền, H3 định giá | Affiliate recruit làm CTA đầu |
| **channel_partner** | Môi giới, BĐS CTV, “tuyển sale” | **Affiliate / CTV** | Kit cộng tác: hoa hồng khung, checklist bán, link đăng ký CTV | Coi như end-buyer; gọi “mua nhà đi” |
| **noise_broad** | Xanh SM, bán sỉ lẫn, off-topic | Chỉ awareness thương hiệu / lọc sau | Soft brand + lead magnet chung; cohort nhỏ | Đo C-rate như geo_resident |

Một dump UID: `uid_source` vẫn `zalo_group_raw`; **tách** bằng `meta.group_class` + `meta.group_hint` (tên nhóm, không PII).  
Cohort: `cohort_id = zalo-awc-{class}-{YYYYMMDD}-vN` — **1 class × 1 hook × 1 vòng**.

### So sánh đo (ví dụ bạn nêu)

| Cohort | Class | Hook | Kỳ vọng |
|--------|-------|------|---------|
| A | `geo_resident` Nhơn Trạch | Checklist + góc Happy Home / khu NT (Value-First, L2/L3) | A/W cao hơn nếu đúng dân cư; C = để SĐT tư vấn khu |
| B | `geo_work` KT–NS Đồng Nai | H1/H2 thu nhập–hồ sơ (chưa ép dự án) | W xin file; C form — **không** so C-rate trực tiếp với cohort A |

**Không gộp A+B** khi kết luận “hook có ngon không”.

### Hai phễu kịch bản (tách cứng)

```
Phễu BUYER (geo_resident / geo_work / topic_finance)
  Hook giá trị → W → C (SĐT) → Ops telesales / tư vấn dự án

Phễu PARTNER (channel_partner)
  Hook kit CTV → W (xin tài liệu) → C (đăng ký CTV / SĐT cộng tác)
  → lane CTV/affiliate — KHÔNG nhét dial list buyer
```

| | BUYER | PARTNER (affiliate/CTV) |
|--|-------|-------------------------|
| Giọng | Trợ lý hồ sơ / khu | Đồng nghiệp bán — tool + quy trình |
| CTA Warm | CHECKLIST / DONG_TIEN | KIT_CTV / HOAHONG |
| CTA Contact | Để SĐT tư vấn / form lead | Form đăng ký CTV / Zalo OA partner |
| Sau C | Ops Lead `source` phù hợp buyer | CTV onboard — không gọi “chốt căn” như khách |
| Cấm | Tuyển CTV xen trong post bán | Pitch “bạn mua giúp” thay vì cộng tác |

### Kịch bản tiếp cận ngắn (sau W, trước gọi)

**BUYER — geo_resident (VD Nhơn Trạch)**  
1. Gửi / chỉ checklist + 2–3 điểm pháp lý–tiến độ **khu** (không cam kết giá/lãi).  
2. Hỏi 1 câu: đang tìm ở hay đầu tư?  
3. Xin SĐT chỉ khi họ muốn được giải thích hồ sơ / đợt — ghi Consent.

**BUYER — geo_work (KT–NS)**  
1. Gửi checklist điều kiện / dòng tiền.  
2. Không mở đầu bằng tên dự án; nếu hỏi “ở đâu” → mới gắn khu phù hợp.  
3. SĐT → Ops; segment theo intent.

**PARTNER — affiliate/CTV**  
1. Kit: checklist khách + link đăng ký CTV + rule hoa hồng khung (L3).  
2. Không dump SĐT buyer cho CTV khi chưa claim đúng rule Ops.  
3. Contact = đăng ký cộng tác, không phải lead mua.


## 2. Cohort chuẩn (pilot trước khi scale dump)

| Tham số | Giá trị mặc định |
|---------|------------------|
| Cỡ cohort | **300–500** UID / vòng |
| Nguồn | **Một** `group_class` / vòng (xem §1b); không random lẫn class |
| Tag cohort | `meta.cohort_id = zalo-awc-{class}-{YYYYMMDD}-vN` + `meta.group_class` |
| Thời gian đo | **14 ngày** sau lần touch hook đầu |
| Song song | Tối đa **1 hook product** / cohort (tránh nhiễu attribution) |

Ghi `cohort_id` vào note ops hoặc sheet mirror khi chạy thủ công; ingest sau gắn `meta.cohort_id` nếu batch có gắn.

---

## 3. Hook product (chuẩn Magnix Value-First)

Chọn **một** lead magnet / vòng (L2 `/devil` nếu NOXH–vay–định giá · L3 trước publish):

| ID | Hook | CTA ấm (W) | CTA Contact (C) |
|----|------|------------|-----------------|
| **H1** | Checklist hồ sơ NOXH (Markdown/PDF) | “Comment / inbox **CHECKLIST** để nhận file” | Form / “Để SĐT — gửi bản điền mẫu” |
| **H2** | Excel ước dòng tiền vay (không cam kết duyệt) | Inbox **DONG_TIEN** | Form SĐT + “muốn được giải thích file” |
| **H3** | Khung câu hỏi thẩm định độc lập | Inbox **DINH_GIA** | Form + lịch tư vấn (opt-in gọi) |

### Giọng & cấm

- Vai **trợ lý mang giải pháp** — không chèo kéo bán.
- L0 cấm: cam kết duyệt, lãi % chắc chắn, “tốt nhất / không thể bỏ lỡ”.
- Không cold DM hàng loạt; ưu tiên: content OA / post hệ sinh thái / comment-unlock **có** ngữ cảnh giá trị (xem `.cursor/HOOK_RULES.md`).

### Kịch bản chạm cohort (1 vòng)

```
D0   Publish hook (OA / Page) + soft invite cohort (nếu channel cho phép)
D0–3  Thu A (view/save/follow) + W (keyword / inbox)
D3–7  Gửi artifact cho W; hỏi 1 câu mở (không ép SĐT)
D7–14 Thu C (form); promote Contact → Ops
D14   Chốt KPI A/W/C → quyết định scale
```

---

## 4. Đo KPI (mẫu số / cohort)

Gọi:

- \(N\) = size cohort  
- \(A\) = số UID/user có ≥1 tín hiệu Awareness  
- \(W\) = số có ≥1 tín hiệu Warm  
- \(C\) = số Contact (form/SĐT/opt-in gọi)

| Metric | Công thức | Ngưỡng pilot “đáng scale” |
|--------|-----------|---------------------------|
| **A-rate** | \(A / N\) | ≥ **8%** |
| **W-rate** | \(W / N\) | ≥ **2%** |
| **C-rate** | \(C / N\) | ≥ **0.5%** (hoặc ≥ **2 Contact** tuyệt đối nếu \(N\)=300) |
| **W→C** | \(C / W\) (nếu \(W>0\)) | ≥ **15%** |

**Quyết định sau D14:**

| Kết quả | Hành động |
|---------|-----------|
| Đạt ≥2/3 ngưỡng A/W/C | Giữ hook; mở rộng dump UID + cohort lớn hơn |
| A đạt, W/C thấp | Đổi CTA / artifact / kênh — **không** đổ thêm UID |
| A thấp | Hook/channel sai — rewrite L3, đừng scale dump |
| C đạt nhưng W ảo | Siết định nghĩa W (bỏ like-only) |

Log KPI: sheet ops hoặc `scripts/_tmp-zalo-awc-kpi-YYYYMMDD.json` (local, không commit PII).

---

## 5. Map sang House X

| Sự kiện | Cập nhật gợi ý |
|---------|----------------|
| Touch hook / A | `meta.last_touch_at`, optional `score += 5` (cap 40 nếu chưa W) |
| Warm | `ops_status=reviewing`, `score` 40–59, `interest_key` theo hook |
| Contact + SĐT | Promote `/admin/inbound-leads` → platform Lead; ConsentRecord purpose contact |
| Không phản hồi D14 | Giữ `pending`; có thể vào vòng hook khác sau ≥30 ngày |

Telesales **chỉ** queue Lead từ tầng **C** (và W nếu họ chủ động xin gọi).

---

## 6. Checklist chạy 1 vòng (owner)

- [ ] Chọn hook H1/H2/H3 + L0–L3 pass  
- [ ] Cắt cohort 300–500, gắn `cohort_id`  
- [ ] Publish + tracking link/KEYWORD riêng cohort  
- [ ] Sheet đếm A / W / C theo ngày  
- [ ] D14: tính 4 metric → quyết định scale dump / đổi hook  
- [ ] Promote C → Ops; không import UID còn lại vào dial list  

---

## 7. Ranh giới

- **Magnix inbound** — không blast trade / không dùng chung bot trade.  
- Dump UID thêm = mở rộng **pool A**; ROI nằm ở **hook + W/C**, không ở số UID tuyệt đối.  
- Ads vẫn dùng khi cần intent mới; UID = audience owned để hạ CAC awareness/warm.
