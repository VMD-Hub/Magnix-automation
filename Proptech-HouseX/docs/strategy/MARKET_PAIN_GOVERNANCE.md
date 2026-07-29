# Quản trị nỗi đau thị trường — House X / Minh An

| Field | Value |
|-------|-------|
| **Date** | 2026-07-29 |
| **Status** | Operating doctrine (gắn ADR-018) |
| **Canvas** | `canvases/market-pain-governance.canvas.tsx` |
| **Depends on** | ADR-015, ADR-016, ADR-018, research rental PM |

---

## 1. Vì sao đây là bài toán “quản trị”, không chỉ “giải”

Thị trường đóng băng / thanh khoản đáy tạo **nhiều nỗi đau cùng lúc**. Nếu chỉ “làm thêm dịch vụ” mà không có hệ quản trị:

- Hứa Lớp 3 (QL) khi mới có Lớp 1–2 → **tạo thêm nỗi đau** (mất tin).
- Content lan man → ads rác, không giảm đau thật.
- Hoa hồng chase deal → bỏ pain thuế / pháp lý mà chủ nhà đang sợ.

**Quản trị nỗi đau** = chọn pain nào mình **sở hữu**, pain nào **chuyển partner**, pain nào **không đụng**, rồi đo xem đau có giảm không.

---

## 2. Vòng quản trị (bắt buộc lặp)

```
SENSE (cảm nhận)     → tin hiệu từ lead, tin, call, bài đọc, LOST reason
    ↓
OWN (sở hữu)         → pain này thuộc Lớp 1 / 2 / 3 / Partner / Ngoài phạm vi?
    ↓
TREAT (trị liệu)     → tool · content · quy trình · HĐ hoa hồng · referral
    ↓
MEASURE (đo)         → KPI pain-relief, không chỉ KPI vanity
    ↓
GOVERN (kiểm soát)   → QA L0–L3 · Legal Gate · consent · không overpromise
```

Mỗi pain trên backlog phải có: **persona · lớp sở hữu · trị liệu · KPI · điều kiện dừng**.

---

## 3. Bản đồ nỗi đau ưu tiên (chu kỳ 2–5 năm)

Gắn chiến lược cố vấn + ADR-018 (thuê) + NOXH/inbound sẵn có.

| ID | Nỗi đau | Ai đau | Lớp sở hữu | Trị liệu chính | KPI giảm đau |
|----|---------|--------|------------|----------------|--------------|
| P1 | Tin ảo / tin rác / không phản hồi | Khách thuê, chủ thật | **L1** House X | QA listing, fingerprint, SLA phản hồi lead, badge Advertising rõ | % tin bị reject · thời gian phản hồi lead · complaint |
| P2 | Trống căn lâu, không biết giá thuê đúng | Chủ nhà, CHDV | **L1+L2** | Tin chuẩn + tìm khách/hoa hồng Minh An | Ngày trống trung bình · # deal hoa hồng |
| P3 | Sợ thuế / sai sót kê khai khi nhà nước siết | Chủ nhà (đặc biệt lớn tuổi) | **L1 content/tool + Partner kế toán** | Checklist thuế, dòng tiền ròng, referral Minh An→KT | # lead “cần kế toán” · attach rate referral |
| P4 | Không có người vận hành (thu tiền, sửa chữa) | Chủ xa / lớn tuổi / nhiều căn | **L3 sau P&L** hoặc partner QL | Trung thực: “chưa QL” → tìm khách trước; mở L3 khi đủ quy mô | Không KPI L3 sớm; khi mở: phí QL margin |
| P5 | Không dám mua / vay vì lãi & giá cao | Người mua thật, NOXH | **Magnix + NOXH Case + tools** (đã có) | Điều kiện NOXH, DTI, waitlist ADR-016 | Case milestone · waitlist→tư vấn |
| P6 | Cần thanh khoản / hàng ngợp nhưng sợ rủi ro pháp lý | Cash buyer, chủ đuối | **L2 tư vấn + (sau) NPL desk** | Định giá, pháp lý, không hard-sell | Deal có checklist pháp lý · LOST reason có cấu trúc |
| P7 | Môi giới / CTV chỉ biết “chốt” → mất trust | Toàn hệ | **Đào tạo + brand** | SOP cố vấn, L2 `/devil` content, không spam | QA nội dung · tỷ lệ consent withdraw |

**P0–P1 tập trung trị:** P1, P2, P3 (+ P5 nếu song song NOXH).  
**P4:** cảm nhận + danh sách chờ — **không** bán như đã có.  
**P6:** sau khi Lớp 2 thuê ổn hoặc ADR NPL riêng.

---

## 4. Cơ chế quản trị theo lớp ADR-018

| Lớp | Pain được phép “nhận sở hữu” | Cách trị | Cấm |
|-----|------------------------------|----------|-----|
| **1 Nền tảng QC** | Tin kém, match lệch, thiếu thông tin | Chuẩn field tin, QA, ranking, tool thuế/dòng tiền | Giả làm đơn vị QL |
| **2 Hoa hồng tìm khách** | Trống căn, khó tìm khách đúng | Lead taxonomy, SLA dẫn xem, HĐ hoa hồng rõ | Ép chủ ký QL để được đăng tin |
| **3 QL vận hành** | Gánh nặng ops khi đã đủ P&L | HĐ QL + partner SaaS nếu cần | Thuê lại; nhận QL khi margin âm |
| **Partner KT/PL** | Thuế, sổ, tranh chấp HĐ | Referral có consent | House X tự “tư vấn thuế thay luật” không disclaimer |

---

## 5. Nguyên tắc cứng khi “giải đau”

1. **Một pain → một owner → một KPI.** Không “cả team chịu trách nhiệm chung chung”.
2. **Không trị pain bằng hứa lớp trên.** L1/L2 không được copy như L3.
3. **Value-first trước hoa hồng.** Magnix: giải thích thuế/rủi ro trước CTA tìm khách.
4. **Consent & không spam** (ADR-015/016/017). Đau tin tưởng > đau trống căn ngắn hạn.
5. **LOST / từ chối phải có mã lý do** gắn pain (thuế, giá, pháp lý, không phản hồi…) để Sense vòng sau.
6. **P&L là van an toàn Lớp 3.** Đau P4 có thật nhưng nhận sai → phá hệ.

---

## 6. Bảng Sense (tín hiệu vận hành tối thiểu)

| Nguồn | Bắt gì | Đổ vào |
|-------|--------|--------|
| Lead form / Mini App | Intent: landlord / tenant / tax_help / need_pm | Taxonomy + queue |
| Listing QA | Reject reason (ảnh, giá ảo, mô tả) | P1 dashboard |
| Call / CTV note | Pain tag + next step | SalesActivity |
| Content Magnix | Topic nào được đọc / save | Ưu tiên P3/P5 copy |
| Referral KT | Attach / từ chối | P3 health |
| Deal hoa hồng | Time-to-lease, nguồn tin | P2 health |

---

## 7. Việc làm ngay (không cần PMS)

1. Chốt **3 pain P0:** P1 tin sạch · P2 tìm khách · P3 thuế/compliance.  
2. Gắn mỗi pain một owner (ops / content / Minh An).  
3. Thêm **pain tag + LOST reason** vào SOP CTV (dù chưa đủ schema).  
4. Copy public & sales: nói đúng Lớp 1–2; Lớp 3 = “đăng ký quan tâm khi đủ quy mô”.  
5. Field nhẹ: 5 cuộc gọi chủ nhà — xác nhận P2 vs P3 vs P4 cái nào đau nhất trước khi build lớn.

---

## References

- `.cursor/ADR-018-rental-advertising-partner-lane.md`
- `Proptech-HouseX/docs/research/RENTAL_PM_RESEARCH_EVAL_2026-07.md`
- `.cursor/QA_TIERS.md` · ADR-015/016
|
