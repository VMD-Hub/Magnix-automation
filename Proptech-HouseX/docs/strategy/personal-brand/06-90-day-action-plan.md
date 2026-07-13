# 06 — Kế hoạch 90 ngày & nối House X / Airtable / n8n

> **Mục tiêu số 1:** Chốt deal BĐS. Xem master plan: [08-MASTER-PLAN-INTEGRATED.md](./08-MASTER-PLAN-INTEGRATED.md)

## Mục tiêu 90 ngày (deal-first)

| KPI | Target gợi ý | Cách đo |
|-----|--------------|---------|
| **Cọc / HĐ ký** | **3–8 deal** *(bạn calibrate)* | Hợp đồng + CRM |
| **Hồ sơ NOXH M1+** | 8–15 | `/admin/noxh-cases` |
| **Lead QUALIFIED** | 20–40 | `/admin/ops-leads` |
| **Buổi rà soát 15 phút** | 15–25 buổi | Calendar + CRM |
| **Referral rate** | ≥30% lead mới | `referral_source` |
| **Case study publish** | 6–9 bài | Editorial log |
| **Network kích hoạt** | 30–50 người 1-1 | Checklist network |

---

## Tuần 1–2: Network + Sale kit

### Network (ưu tiên #1)

1. Lập danh sách 30–50 người: đồng nghiệp cũ, đối tác kinh tế, khách luật/tài chính trước đây
2. Liên hệ **gọi điện / gặp mặt** — không broadcast Zalo
3. Script mở đầu:
   > *"Em/anh chuyển sang tư vấn BĐS với focus rà soát rủi ro pháp lý trước khi xuống tiền. Nếu anh/chị hoặc người quen đang định mua NOXH, em offer 15 phút rà soát miễn phí — không bán dự án."*

### Sale kit

In bộ 4 món tối thiểu (xem [05-sale-kit-hardcopy.md](./05-sale-kit-hardcopy.md)).

---

## Tuần 2–4: Lead magnet

- Checklist *"5–10 điểm rủi ro pháp lý NOXH"* — PDF trên House X + bản in
- CTA: Zalo OA / form Mini App → tag `lead_source: checklist_noxh`
- Disclaimer pháp lý ngắn trên mọi bản

**Repo:** có thể landing tại `/cong-cu/` hoặc trang NOXH handbook — liên kết từ Zalo OA menu.

---

## Tuần 3–6: Agentic CRM (không mua tool mới)

### Airtable — field bổ sung (gợi ý)

| Field | Mục đích |
|-------|----------|
| `last_contact_at` | Tính im lặng |
| `silence_days` | Formula |
| `referral_source` | Network / referral / inbound / miniapp |
| `free_review_done` | Boolean — đã rà soát 15 phút |
| `segment` | NOXH / CCTM |

### n8n workflows

1. **Silence 14d:** `silence_days >= 14` → tạo draft message → queue human approve
2. **HOT return:** Mini App event → flag CRM
3. **Milestone:** đã có `housex-noxh-lead-route` — đảm bảo CTV nhận in-app

**Quy tắc:** không auto-send Zalo cho khách VIP / network cũ — chỉ draft.

---

## Tuần 4–12: Content

- 2–3 bài/tháng: case thật ẩn danh
- Format: video ngắn bạn nói trực tiếp + bài text Q&A (H2/H3 câu hỏi — khớp Magnix content SEO)
- AI: draft → bạn sửa → publish
- Phân phối: Zalo status (hẹp) + gửi cho network relevant + House X blog nếu phù hợp editorial

---

## Liên tục: Trợ lý vay NOXH (House X)

- Polish UX công cụ hiện có: `timnhaxahoi.com/cong-cu/kiem-tra-noxh`, tính vay
- QR trên name card + checklist in
- Pattern đúng các dự án lớn VN — **utility tool**, tránh vướng quy định sàn

---

## Không làm trong 90 ngày đầu

- Mua CRM / AI tool mới
- Virtual staging
- Zalo broadcast voice AI hàng loạt
- Content hàng ngày kiểu môi giới trẻ
- Đua phủ rộng CCTM + NOXH song song

---

## Sau 90 ngày — review

- Referral rate có tăng không?
- Buổi rà soát 15 phút → bao nhiêu % chuyển pipeline?
- Có case BĐS thật để thay dần case luật trong sổ case?
- Có cần thêm món sale kit (quy hoạch A3) cho CCTM?
