# Nguyên tắc viết FAQ / Hỏi–Đáp (House X)

Dùng cho `faqs[]` landing dự án, accordion Q&A, H2 dạng câu hỏi trong bài wiki/tin.

**Cursor rule:** `.cursor/rules/housex-faq-answer-focus.mdc`

## Tóm tắt

| Làm | Không làm |
|-----|-----------|
| Trả lời đúng đúng câu hỏi được hỏi | Lan man sang disclaimer kênh House X / CĐT |
| Một FAQ = một ý | Gộp “giá chưa có” với “điều kiện chưa có” |
| CTA chỉ khi câu hỏi cần bước tiếp (giá, liên hệ) | Nhét hotline vào mọi câu |
| Giọng người mua, rõ ràng | `USP`, “tham chiếu công khai”, “người đọc nên…”, “không thay thế CĐT” |

## Checklist ship

1. Đọc câu hỏi → câu trả lời có trả lời được không nếu cắt hết phần sau dấu “—” / ngoặc đơn?
2. Có cảm giác đổ trách nhiệm / vô trách nhiệm không?
3. Có lộ ghi chú biên tập hoặc so sánh kênh bán không?

## CTA chuẩn (đồng nhất mọi landing NOXH)

Dùng `HOUSEX_NOXH_CTA` / `HOUSEX_NOXH_CTA_MESSAGE` trong `lib/content/noxh-editorial.ts`:

> House X tư vấn hồ sơ mua nhà ở xã hội miễn phí và cập nhật tiến độ dự án. Đăng ký ngay!

Không viết lại biến thể mơ hồ (“hỗ trợ tư vấn điều kiện”, “đồng hành…”, “liên hệ với chúng tôi”).

## Liên quan AIO / đề xuất AI

FAQ và đoạn ngắn trên landing là nguồn AI Overview hay trích. Câu disclaimer nội bộ (“không thay thế CĐT”, “không dùng hotline CĐT”, “không thu đặt cọc…”) dễ bị AI nhắc lại → web trông thiếu tin cậy. Giữ ghi chú ops trong `docs/` / comment code.

*Cập nhật từ biên tập landing Hồ Gươm Xanh — 2026-07-27 · rà AIO 2026-07-27.*
