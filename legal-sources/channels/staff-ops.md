# Kênh 3 — Nhân viên: tra cứu & phương pháp điền hồ sơ mẫu

> **Đối tượng:** Nhân viên tư vấn / hỗ trợ hồ sơ nội bộ.  
> **Mục tiêu:** Tra đúng quy trình, in checklist, hướng dẫn khách viết tay — không lưu PII khách vào repo.

---

## Bộ công cụ nhân viên

| Tài liệu | Khi dùng |
|----------|----------|
| `counseling-topic-index.md` | Điểm vào — tra chủ đề |
| `application-dossier-checklist.md` | Số bộ photo, danh mục giấy |
| `mau-01-handwriting-sample-guide.md` | Quy tắc viết tay, nơi cấp, xuống dòng, mục 9 |
| `samples/mau-01-sample-filled-reference.md` | **Bản tham chiếu in đậm** — khách đối chiếu, không nộp |
| `object-classification-cbccvc-hdld.md` | Phân k5/k6/k8 |
| `application-form-mau-01-guide.md` | Giải thích từng phần A–G |
| `buildApplicationCounselingPack(intake)` | Sinh checklist theo case (không lưu intake vào git) |

---

## Quy trình hỗ trợ khách (SOP)

### Bước 1 — Thu thông tin (ghi nội bộ, không commit)

Điền form theo `registration-intake-schema.json` trên Sheet nội bộ hoặc giấy.

### Bước 2 — Chốt đối tượng

```bash
node scripts/build-noxh-application-counseling.mjs \
  --project_province_code tp_ho_chi_minh \
  --employment_status dang_hdld \
  --employer_type enterprise_worker \
  --marital_status vo_chong \
  --housing_path chua_co_nha_gcn
```

Đọc `article_76_resolution` trong JSON output.

### Bước 3 — Giao khách

1. In **Mẫu 01 trống** từ CĐT/Công báo  
2. Mở bản mẫu Magnix (`samples/…`) trên màn hình — chỉ **tham chiếu**  
3. Đánh dấu checklist từ `section_guidance` + `checklist` trong pack  
4. Nhắc: photo đủ bộ theo **thông báo dự án**; CT07 scan hay sao y — hỏi CĐT

### Bước 4 — Rà soát trước nộp

- [ ] Vợ/chồng đã khai (nếu kết hôn)  
- [ ] Mục 11.1 vs 11.2 khớp k5–k8 / k7  
- [ ] Giấy xác nhận &lt; 12 tháng  
- [ ] Chữ ký, không tẩy xóa  
- [ ] CCCD kèm đơn  

---

## Ma trận “khách hỏi NV” → tài liệu

| Tình huống | Tài liệu + hành động |
|------------|----------------------|
| Công nhân KCN | `object-classification` → k6; bảng tiền công đơn vị |
| Cán bộ xã | k8; QĐ tuyển dụng / HĐ viên chức — không nhầm HĐLĐ |
| Tự do / nghỉ hưu | k5 + CA xã; `retired-beyond-working-age-counseling.md` |
| Vợ chồng khác nhóm đối tượng | `married-mixed-object-counseling.md` |
| Con 18+ thu nhập cao | `parent-adult-child-household-income-counseling.md` |
| Ô nơi cấp ngắn | `mau-01-handwriting-sample-guide.md` § mục 3 |

---

## Cảnh báo nội bộ

- **Không** photo bản mẫu Magnix (chữ in đậm) nộp thay hồ sơ thật.  
- **Không** paste CCCD đầy đủ vào group chat công ty.  
- Mọi cam kết “chắc đủ điều kiện” — **cấm**; chỉ CĐT/Sở XD quyết định.

---

## Pack kỹ thuật

`buildChannelPack('staff_ops', { topic, province_code })` — kèm link đầy đủ tới guides + samples.
