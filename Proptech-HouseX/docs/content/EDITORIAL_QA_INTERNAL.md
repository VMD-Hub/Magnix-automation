# QA biên tập nội bộ (không công bố trên web)

Tài liệu vận hành Magnix / House X — **không** render lên `timnhaxahoi.com`.  
Trang công khai: `/gioi-thieu/phuong-phap-bien-tap` (`lib/content/editorial-methodology.ts`).

## Phân tầng QA

| Tầng | Nhiệm vụ |
|------|----------|
| L0 | Giọng bài báo người đọc: lede tin cứng; H2 declarative; không heading meta/SoR (“Ai đang chịu tác động”, “Bài này quan sát…”); không markdown thô; không CTA gắt; không tự khen so với CafeLand trên body |
| L1 | Đối chiếu số liệu pháp lý với `CURRENT_NOXH_RULES` (`lib/finance/noxh-rules`) |
| L2 | Rà soát chủ đề nhạy cảm (thu nhập, vay, đối tượng) — `/devil` khi cần; **bắt buộc đọc** [`GHI_CHU_BAT_BUOC_TRUOC_KHI_BIEN_TAP.md`](./GHI_CHU_BAT_BUOC_TRUOC_KHI_BIEN_TAP.md) trước khi viết / duyệt bài giá–quy hoạch–pháp lý–đầu tư |
| L3 | Duyệt người trước publish (bài trend, số liệu giá mới) |

## Đồng bộ kỹ thuật

- FAQ + công cụ NOXH: trỏ `CURRENT_NOXH_RULES` trong mã nguồn; đổi khi có NĐ mới.
- Test: `npm test` — `article-editorial-voice.test.ts`, `editorial-methodology.test.ts`.

## Ranh giới copy công khai

Không đưa lên web: mã L0–L3, đường dẫn `lib/…`, tên biến `CURRENT_NOXH_RULES`, checklist agent.

## Ghi chú bắt buộc trước khi viết

Mọi bài giá / quy hoạch / pháp lý / tư vấn đầu tư: đọc hết [`GHI_CHU_BAT_BUOC_TRUOC_KHI_BIEN_TAP.md`](./GHI_CHU_BAT_BUOC_TRUOC_KHI_BIEN_TAP.md) rồi mới soạn hoặc duyệt L2.

---

## Content queue — duyệt L2/L3 như người đọc


| Tab / vùng | Ai thấy | Quy tắc |
|------------|---------|---------|
| **Như người đọc** | Reviewer L2/L3 | Markdown đã render (`**` → in đậm). Đây là chuẩn duyệt cảm nhận bài. |
| **Sửa markdown** | Biên tập | Nguồn thô; không dùng để “đọc” bài. |
| **Ghi chú Ops** | Admin only | `/devil`, neo văn bản — **không** dán vào body bài. |
| **Khối chốt CTA tool** | Ops | Copy-paste nội bộ — không đăng nguyên khối. |

**Cấm lộ trên body / H2 công khai:** nhãn `(CTA)`, frontmatter YAML, `editorial_note`, hướng dẫn seed, path kỹ thuật, H2 kiểu “Ai đang chịu tác động…”, đoạn mở “Bài này quan sát và trình bày…”.

**L0 bài báo:** tab **Như người đọc** phải cảm như tin — không cảm như checklist nội bộ.

Publish đi qua `normalizeQueueBodyForReader` + `ArticleBody` (bỏ `(CTA)` / H2 SoR nếu còn sót).
