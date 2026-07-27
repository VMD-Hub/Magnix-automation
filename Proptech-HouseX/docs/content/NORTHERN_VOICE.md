# Giọng biên tập miền Bắc (Vùng Thủ đô)

SoR: [`lib/content/articles/northern-editorial-voice.ts`](../../lib/content/articles/northern-editorial-voice.ts)

Áp dụng cho series **5 trục Vùng Thủ đô Hà Nội** — tách tone khỏi series HCMC.

## Độc giả mục tiêu

Người Hà Nội / Vùng Thủ đô quan tâm **chính trị – quy hoạch – hạ tầng** trước khẩu hiệu thị trường. Bài phải cung cấp kiến thức chuyên gia (thể chế, cấu trúc không gian, phân kỳ hạ tầng), không nội dung hời hợt hay giọng “bình dân bán hàng”.

## Lexicon

| Ưu tiên (Bắc / chuyên ngành) | Tránh |
|------------------------------|-------|
| ô đất, thửa đất, mặt đường, lòng đường, vỉa hè | nền đất, lộ giới, mặt tiền |
| nhà chung cư, căn hộ, sổ đỏ, pháp lý an toàn | officetel (trừ SP thật), cam kết lợi nhuận, vị trí kim cương |
| đồ án quy hoạch, đô thị vệ tinh / đối trọng, hành lang kinh tế, phân kỳ đầu tư | phễu, mỏ vàng, đón sóng, giọng điềm tĩnh, phù hợp người mua miền Bắc |

## Tone chuyên gia

1. Trang trọng, lập luận nhân–quả theo quy hoạch; số liệu (km, phút, tháng/năm) khi có nguồn chính thống.
2. Neo thể chế khi có: ví dụ QĐ 1569/QĐ-TTg (Quy hoạch Thủ đô 2021–2030, tầm nhìn 2050); mô hình chùm đô thị hướng tâm; đô thị vệ tinh / đối trọng — **không bịa** số hiệu văn bản.
3. Ba lớp đọc **nội bộ** (không viết chữ “phễu” trên bài): quy hoạch–thể chế → dịch chuyển không gian/nhu cầu → thẩm định dự án–pháp lý + CTA `/lien-he`.
4. Không lộ meta biên tập; không checklist marketing rỗng.

## QA

`assertNorthernEditorialBody(body, slug)` — dùng trong `tests/growth-corridors-hanoi.test.ts`.

*Cập nhật: 2026-07-27*
