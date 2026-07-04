# QA biên tập nội bộ (không công bố trên web)

Tài liệu vận hành Magnix / House X — **không** render lên `timnhaxahoi.com`.  
Trang công khai: `/gioi-thieu/phuong-phap-bien-tap` (`lib/content/editorial-methodology.ts`).

## Phân tầng QA

| Tầng | Nhiệm vụ |
|------|----------|
| L0 | Kiểm tra giọng biên tập: không heading meta, không markdown thô, không CTA gắt |
| L1 | Đối chiếu số liệu pháp lý với `CURRENT_NOXH_RULES` (`lib/finance/noxh-rules`) |
| L2 | Rà soát chủ đề nhạy cảm (thu nhập, vay, đối tượng) — `/devil` khi cần |
| L3 | Duyệt người trước publish (bài trend, số liệu giá mới) |

## Đồng bộ kỹ thuật

- FAQ + công cụ NOXH: trỏ `CURRENT_NOXH_RULES` trong mã nguồn; đổi khi có NĐ mới.
- Test: `npm test` — `article-editorial-voice.test.ts`, `editorial-methodology.test.ts`.

## Ranh giới copy công khai

Không đưa lên web: mã L0–L3, đường dẫn `lib/…`, tên biến `CURRENT_NOXH_RULES`, checklist agent.
