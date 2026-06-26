# NOXH Legal KB — Kiến trúc 3 kênh phục vụ

> **Nguyên tắc:** Một **nguồn pháp lý chuẩn** (`legal-sources/noxh/`) — ba **cách phân phối** khác nhau về độ sâu, giọng văn, QA và intake. Không nhân đôi claim; không sửa luật theo kênh.

---

## Sơ đồ tổng thể

```
                    ┌─────────────────────────────────────┐
                    │  CANON — legal-sources/noxh/        │
                    │  claims · Q&A · guides · intake     │
                    └─────────────────┬───────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
   ┌──────────────┐           ┌──────────────┐           ┌──────────────┐
   │ Kênh 1       │           │ Kênh 2       │           │ Kênh 3       │
   │ AIO / SEO    │           │ Inbox tư vấn │           │ Nhân viên    │
   │ Website+Page │           │ Page chat    │           │ Ops / điền mẫu│
   └──────┬───────┘           └──────┬───────┘           └──────┬───────┘
          │                           │                           │
          ▼                           ▼                           ▼
   content-draft              application-counseling        staff SOP +
   magnix-inbound-copywriter  pack + intake chat          mẫu viết tay
```

---

## Ba kênh — so sánh nhanh

| | **Kênh 1 — AIO/SEO** | **Kênh 2 — Inbox** | **Kênh 3 — Staff** |
|---|----------------------|--------------------|--------------------|
| **Mục đích** | Bài website, Page post tối ưu tìm kiếm & AI overview | Trả lời khách inbox/DM trực tiếp | Hỗ trợ NV tra cứu + hướng dẫn điền hồ sơ mẫu |
| **Đối tượng đọc** | Công dân lạ (organic) | Khách đang hỏi case cụ thể | Nhân viên nội bộ |
| **Nguồn chính** | `qa-knowledge.*.json`, claims ngắn | `counseling-topic-index`, guides, `buildApplicationCounselingPack` | `samples/`, handwriting guide, checklist, classification |
| **Intake** | Topic + tỉnh (tùy bài) — **không PII** | `registration-intake-schema` — hỏi dần | Case nội bộ — **không log PII vào repo** |
| **Output** | `website_article`, FAQ schema, H2 câu hỏi | Tin nhắn ngắn, 1–3 câu + CTA hỏi thêm | Checklist in, bản mẫu in đậm, ma trận mục đơn |
| **QA** | L2 `/devil` + L3 trước publish | L2 khi NOXH/vay/định giá; không cam kết duyệt | Dùng KB `human_verified`; NV chịu trách nhiệm ký |
| **Entry doc** | `legal-sources/channels/aio-seo.md` | `legal-sources/channels/inbox-counseling.md` | `legal-sources/channels/staff-ops.md` |

---

## Phân lớp dữ liệu (dùng chung)

| Lớp | Vai trò | Kênh 1 | Kênh 2 | Kênh 3 |
|-----|---------|--------|--------|--------|
| **Legal sources** | Văn bản gốc trích | Tham chiếu | Khi cần đối chiếu | Khi tranh chấp nội bộ |
| **Atomic claims** | Chống bịa | Pack ngắn | Pack + forbidden | Tra `claim_id` |
| **Q&A** | Câu hỏi người thật | **Chính** | Rút `short_answer` | Ít dùng (quá marketing) |
| **Counseling guides** | Thủ tục sâu | Link “xem thêm” | **Chính** | **Chính** |
| **Samples** | Mẫu điền tay | Không publish | Gửi link nội bộ | **Chính** |
| **Intake + rule engine** | Suy đối tượng | Không | **Chính** | NV nhập tay |

---

## Luồng vận hành đề xuất

### Kênh 1 — Viết bài (Agent 3 / copywriter)

1. Social listening / editorial brief → `topic` + `segment`
2. `buildChannelPack('aio_seo', { topic, province })`
3. LLM viết Q&A — chỉ claim trong pack
4. L2 devil → L3 → đăng website / Page

### Kênh 2 — Inbox Page

1. Tin nhắn khách → classify `noxh_income` / `noxh_documents`
2. Hỏi intake tối thiểu (tỉnh dự án, hôn nhân, việc làm, nhà ở)
3. `buildApplicationCounselingPack(intake)` + `buildChannelPack('inbox_counseling')`
4. Trả lời ngắn + câu hỏi tiếp theo — **không** điền CCCD thật vào chat log công khai

### Kênh 3 — Nhân viên

1. NV mở `staff-ops.md` hoặc tra `counseling-topic-index`
2. `buildChannelPack('staff_ops', { topic })` + pack đầy đủ nếu có intake
3. In checklist / mẫu tham chiếu — khách tự viết tay trên Mẫu 01 trống

---

## File điều hướng

| File | Mô tả |
|------|--------|
| `legal-sources/channels/registry.json` | Metadata máy đọc — agent/n8n |
| `legal-sources/channels/aio-seo.md` | Playbook kênh 1 |
| `legal-sources/channels/inbox-counseling.md` | Playbook kênh 2 |
| `legal-sources/channels/staff-ops.md` | Playbook kênh 3 |
| `scripts/lib/legal-channel-pack.mjs` | `buildChannelPack(channelId, opts)` |

Chi tiết Legal KB gốc: `docs/LEGAL_KB_ARCHITECTURE.md` · Sản phẩm content: `docs/CONTENT_PRODUCT_OUTPUTS.md`.
