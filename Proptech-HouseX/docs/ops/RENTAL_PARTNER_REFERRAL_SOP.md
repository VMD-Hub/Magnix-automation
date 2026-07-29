# SOP — Referral kế toán / pháp lý HĐ thuê (ADR-018 Wave 2)

> **Đối tượng:** Ops Minh An · telesales nhận lead `rentalIntent=TAX_HELP`  
> **Pháp nhân:** Minh An Land chuyển tiếp → đối tác KT/PL (không tư vấn thuế thay KTV/luật sư)

## 1. Nguyên tắc consent (ADR-015)

1. Checkbox «đồng ý chuyển đối tác» trên form = **bằng chứng** → `ConsentRecord` purpose=`partner_referral`, channel=`partner`.  
2. Không có consent → **không** gửi SĐT/email cho partner ngoài Minh An. Vẫn được liên hệ nội bộ để làm rõ nhu cầu.  
3. Không suy consent từ UTM, source, hoặc «đã gọi được».  
4. Log Ops chỉ ghi `normalized_key` / mã lead — không paste CCCD / HĐ đầy đủ vào note công khai.

## 2. Luồng

```
Form /cho-thue hoặc /cong-cu/dong-tien-cho-thue (TAX_HELP)
  → Lead SoR + (optional) ConsentRecord partner_referral
  → Queue Ops filter «Thuế»
  → Minh An: làm rõ nhu cầu (thuế TNCN cho thuê / HĐ thuê / cả hai)
  → Nếu có consent: chuyển partner → bấm «Đã chuyển partner» trên Ops
  → SalesActivity RENTAL_PARTNER_REFERRAL|status=HANDED
```

## 3. Checklist Ops

1. [ ] Đọc `rentalIntent=TAX_HELP` và message (số căn, khu vực).  
2. [ ] Kiểm tra consent partner trên detail / lịch sử consent (nếu UI chưa hiện: hỏi lại khách trước khi share).  
3. [ ] Không hứa «bao thuế / chắc chắn hợp pháp» — chỉ referral.  
4. [ ] Sau khi partner nhận: ghi «Đã chuyển partner» + loại ACCOUNTING / LEGAL / BOTH.  
5. [ ] Nếu khách chỉ cần dòng tiền: hướng `/cong-cu/dong-tien-cho-thue`, không ép partner.

## 4. Pain tag

| Tag | Khi nào |
|-----|---------|
| `P3` | Sợ thuế / cần hiểu dòng tiền ròng → CTA tool + TAX_HELP |
| `P4` | Hỏi QL căn → chuyển `NEED_PM` waitlist, **không** bán Lớp 3 |

## 5. KPI liên quan

Admin `/admin/rental-kpi` — `taxHelpLeadsInWindow`, `partnerHandedInWindow`, `taxHelpOpenQueue`.
