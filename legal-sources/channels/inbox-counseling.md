# Kênh 2 — Page inbox: tư vấn chat trực tiếp

> **Đối tượng:** Khách đã inbox / comment cần trả lời nhanh.  
> **Mục tiêu:** Hướng dẫn đúng hướng + thu intake — không thay khách nộp hồ sơ.

---

## Luồng hội thoại (bắt buộc)

```
Chào + xác nhận chủ đề
    → Hỏi TỈNH DỰ ÁN NOXH (không chỉ nơi ở)
    → Hình thức: mua / thuê mua / thuê
    → Hôn nhân: độc thân / vợ chồng
    → Việc làm: employment_status + has_hdld + employer_type (nếu có HĐLĐ)
    → Nhà ở tại tỉnh dự án: chưa có / 15m² / xa nơi làm
    → (Tùy) vay, CT07, số bộ hồ sơ theo CĐT
    → Tóm tắt đối tượng + checklist giấy — disclaimer
```

Thứ tự chi tiết: `counseling-topic-index.md` § “Thứ tự hỏi tư vấn”.

---

## Công cụ kỹ thuật

| Thành phần | Dùng khi |
|------------|----------|
| `registration-intake-schema.json` | Map câu hỏi → field |
| `inferArticle76Clause` / `buildApplicationCounselingPack` | Đủ employment → suy k5/k6/k7/k8 |
| `buildLegalRetrievalPack` | Fact pháp lý ngắn |
| `counseling-topic-index.md` | Chọn guide chuyên đề |
| Agent prompt | `n8n__noxh-application-form-draft.md` |

**Gọi pack:**

```javascript
import { buildApplicationCounselingPack } from 'scripts/lib/noxh-application-draft.mjs';
import { buildChannelPack } from 'scripts/lib/legal-channel-pack.mjs';

const counseling = buildApplicationCounselingPack(intake);
const channel = buildChannelPack('inbox_counseling', { topic: 'noxh_documents', province_code });
```

---

## Giọng trả lời

- **Ngắn:** 3–8 câu; 1 ý chính / tin.
- **Hỏi lại:** Nếu `article_76_resolution.needs_fields` có `employer_type` → hỏi “Anh/chị là công nhân công ty/KCN hay cán bộ xã/công chức?”
- **Không chốt** số bộ 3/4 nếu `dossier_copy_sets: unknown`.
- **Không** nhắn full CCCD/SĐT trong thread công khai — nhắc khách gửi riêng nếu CĐT yêu cầu.

---

## Chủ đề → guide nhanh

| Khách hỏi | Mở file |
|-----------|---------|
| Điền đơn / Mẫu 01 | `application-form-mau-01-guide.md` |
| Viết tay / nơi cấp | `mau-01-handwriting-sample-guide.md` |
| Vợ chồng khác tỉnh | `spouses-different-residence-counseling.md` |
| CT07 | `ct07-residence-confirmation-guide.md` |
| Vay / CIC | `noxh-loan-nhcsxh-counseling.md`, `bank-credit-appraisal-counseling.md` |

---

## QA

- L0: parse + không PII trong log  
- L2: khi khẳng định thu nhập trần, vay, điều kiện nhà ở  
- **Không L3** mỗi tin — chỉ khi chuyển thành bài publish (kênh 1)
