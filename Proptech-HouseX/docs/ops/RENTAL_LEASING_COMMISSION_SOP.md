# SOP — Hoa hồng tìm khách thuê (Lớp 2)

> **ADR-018** · Pain P2 · Wave 0  
> **Đối tượng:** Minh An Land · CTV · Ops telesales nhận lead `rentalIntent=LANDLORD`  
> **Không áp dụng:** Lớp 3 quản lý vận hành (chưa mở) · thuê lại / master lease (**cấm**)

---

## 1. Mô hình kiếm tiền

| Việc | Ai | Doanh thu |
|------|-----|-----------|
| Đăng tin / gói QC (Lớp 1) | House X | Phí ads (phụ) |
| **Tìm khách thuê / bán phòng** | **Minh An + CTV/đối tác** | **Hoa hồng** khi chốt HĐ thuê |
| Quản lý vận hành | — | Chưa bán — chỉ ghi nhận `NEED_PM` |

**Trước khi đẩy lead nóng cho CTV:** đã có thỏa thuận hoa hồng với chủ nhà / đối tác ( % một tháng thuê hoặc số tháng — ghi note Ops).

---

## 2. Pain tag (bắt buộc trên mọi cuộc gọi / note)

Gắn **một** mã chính vào ghi chú Ops hoặc SalesActivity:

| Mã | Nghĩa | Hướng xử lý |
|----|--------|-------------|
| `P1` | Tin ảo / không phản hồi / chất lượng tin | QA tin · SLA phản hồi |
| `P2` | Trống căn / cần tìm khách | Pipeline hoa hồng Lớp 2 |
| `P3` | Sợ thuế / cần kế toán | Referral KT — không “tư vấn thuế thay luật” |
| `P4` | Cần người quản lý căn | Ghi `NEED_PM` waitlist — **không hứa QL** |
| `P7` | Mất tin / sợ bị spam | Consent · không cold-call waitlist |

Có thể thêm mã phụ sau dấu `|` (vd. `P2|P3`).

---

## 3. LOST / đóng lead — mã lý do

Khi `status=LOST`, ghi reason trong note (một trong các mã):

- `no_response` — không nghe máy / không phản hồi  
- `price` — giá thuê không khớp  
- `tax_fear` — sợ thuế, chưa sẵn sàng  
- `want_pm_only` — chỉ muốn QL, chưa cần tìm khách  
- `legal_block` — pháp lý / HĐ  
- `other` — ghi thêm 1 câu  

---

## 4. Checklist trước nhận lead LANDLORD

1. [ ] Đọc `rentalIntent` trên lead (`LANDLORD` / `TENANT` / `TAX_HELP` / `NEED_PM`).  
2. [ ] SLA gợi ý: lead **LANDLORD** mới → liên hệ **≤ 4 giờ** giờ hành chính (board Ops hiện cảnh báo overdue). Tách khỏi HOT NOXH ≤ 2h nếu cần ưu tiên NOXH.  
3. [ ] Xác nhận khu vực + loại căn + giá kỳ vọng.  
4. [ ] Chốt / nhắc thỏa thuận hoa hồng trước khi đăng tin hoặc đẩy CTV.  
5. [ ] Copy với chủ: House X **kết nối tin + tìm khách** — **không** đang quản lý căn hộ họ.  
6. [ ] Nếu hỏi QL đầy đủ → ghi `P4` + `NEED_PM`, đưa vào danh sách chờ — không bán Lớp 3.

---

## 5. Cấm

- Hứa «House X / Minh An quản lý thu tiền / sửa chữa» khi chưa có HĐ Lớp 3 + P&L.  
- Thuê lại căn để kinh doanh (master lease).  
- Ép chủ ký QL mới được đăng tin / nhận lead.  
- Spam Zalo / gọi waitlist không consent.

---

## 6. Liên kết

- ADR: `.cursor/ADR-018-rental-advertising-partner-lane.md`  
- Pain doctrine: `docs/strategy/MARKET_PAIN_GOVERNANCE.md`  
- Impl plan: `docs/strategy/RENTAL_IMPL_PLAN_2026-07.md`  
- Playbook Ops chung: `docs/OPS_PLAYBOOK.md`
|
