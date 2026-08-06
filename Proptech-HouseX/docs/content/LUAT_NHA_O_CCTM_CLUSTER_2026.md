# Cluster Luật Nhà ở 2023 & Dự thảo sửa đổi 2026 — Brief biên tập (CCTM)

> Trạng thái: **Full draft ready (6+1)** · 07/2026 · Tài liệu vận hành, **không** render lên `timnhaxahoi.com`  
> Phạm vi: 1 pillar + 6 cluster về chung cư thương mại (CCTM), sở hữu, kiểm định, phá dỡ, tái định cư, cho thuê, quản lý vận hành.

## 1. Positioning

House X viết từ **góc nhìn pháp lý** — giải thích quy định, chỉ ra rủi ro, hướng dẫn cách tự kiểm tra hồ sơ.  
**Không** nhận vai "đơn vị tư vấn pháp lý", không thay cơ quan có thẩm quyền, không nhận việc tranh tụng.

| Nhóm đọc | Nỗi đau | Vai của bài |
|----------|---------|-------------|
| Chủ sở hữu CCTM | Sợ mất nhà, sợ phá dỡ, sợ phí tăng | Gỡ hiểu nhầm bằng điều khoản + cách tra cứu |
| Người sắp mua | Không biết đọc gì trong sổ / HĐMB | Checklist kiểm tra trước khi xuống tiền |
| CĐT / công ty QL | Chuẩn bị cho quy định mới | Đối chiếu nghĩa vụ 2023 vs dự thảo |
| Người đang cân nhắc NƠXH | So sánh CCTM vs NƠXH | Cầu nối sang tool NƠXH |

## 2. Ràng buộc hệ thống

| Hạng mục | Giá trị |
|----------|---------|
| `content_type` | `GENERAL_POLICY` (nhánh so sánh NƠXH → bật `requires_legal_qa: true`) |
| `segment` | `general_inbound`; bài có cầu NƠXH → `noxh_income` |
| `channel` | `blog_seo` |
| Trust ladder (ADR-016) | Dự thảo 14/07/2026 = **T1 (báo/dự thảo)** — chưa có hiệu lực |
| QA | L0 + **L2 `/devil`** toàn cluster + **L3 human** trước publish |
| CTA gate | `content_queue` yêu cầu đúng 1 `cta_tool_id` ∈ `noxh-check` \| `noxh-loan-quick` |

### 2.1 Xử lý CTA gate

Cluster CCTM không tự nhiên map vào 2 tool NƠXH. Chốt cho phase 1: **mỗi bài phải có một section so sánh CCTM ↔ NƠXH thật** (không nhồi), lấy đó làm nỗi đau NƠXH cho checklist L3.  
Backlog kiến trúc: mở allowlist CTA cho nội dung `GENERAL_POLICY` (checklist tải / waitlist theo dõi nghị định) — cần sửa `lib/content/noxh-cta-tools.ts` + gate API, **không** làm trong phase này.

### 2.2 Citation bắt buộc

Mỗi bài tối thiểu:

1. Luật Nhà ở 2023 — số điều/khoản + link `vanban.chinhphu.vn`.
2. Dự thảo sửa đổi (bản 14/07/2026) — nêu rõ **"dự thảo, chưa có hiệu lực"** ngay đoạn mở.
3. Nghị định/thông tư hướng dẫn nếu viện dẫn con số.

Disclaimer cuối bài: *"Thông tin mang tính tham khảo theo quy định hiện hành và bản dự thảo tại thời điểm đăng; quyết định cụ thể căn cứ văn bản có hiệu lực và hồ sơ thực tế."*

## 3. Quy tắc tiêu đề

- H1/H2/H3 là **câu hỏi viết đủ**, không rút gọn.  
  Đúng: *"Tuổi tòa nhà bao nhiêu thì phải kiểm định?"* — Sai: *"Tuổi tòa bao nhiêu phải kiểm định?"*
- Title/meta phải dùng chữ **"dự thảo"** / **"đề xuất"** khi nói nội dung sửa đổi; không viết như thể "Luật Nhà ở 2026" đã ban hành.
- Mỗi H2 mở bằng đáp ngắn 40–60 từ (featured snippet), rồi mới bullet chi tiết.

## 4. Inventory 6 + 1

| # | Vai trò | Slug | Ưu tiên | CTA tool | Lead magnet | Trạng thái |
|---|---------|------|---------|----------|-------------|------------|
| 0 | Pillar | `luat-nha-o-2023-va-du-thao-sua-doi-2026-thay-doi-gi` | P0 | `noxh-check` | Bảng đối chiếu 6 thay đổi (1 trang) | Draft ready — `docs/content/drafts/00-pillar-*.md` |
| 2 | Cluster | `kiem-dinh-chung-cu-bat-buoc-tuoi-toa-nha-bao-nhieu` | P0 | `noxh-check` | Checklist hồ sơ kiểm định trước khi mua | Draft ready — `docs/content/drafts/02-kiem-dinh-*.md` |
| 1 | Cluster | `quyen-so-huu-can-ho-chung-cu-co-thoi-han-hay-khong` | P1 | `noxh-check` | Checklist đọc sổ hồng + HĐMB | Draft ready — `docs/content/drafts/01-quyen-so-huu-*.md` |
| 3 | Cluster | `pha-do-chung-cu-bat-buoc-can-cu-va-quy-trinh` | P1 | `noxh-check` | Hướng dẫn tự tra quy hoạch + hồ sơ chứng minh sở hữu | Draft ready — `docs/content/drafts/03-pha-do-*.md` |
| 4 | Cluster | `tai-dinh-cu-chung-cu-nhan-nha-hay-nhan-tien` | P2 | `noxh-check` | Phương án bố trí, bồi thường, tạm cư, checklist giấy tờ | Owner rewrite — `docs/content/drafts/04-tai-dinh-cu-*.md` · `npm run db:upsert:cctm-tai-dinh-cu` |
| 6 | Cluster | `quan-ly-van-hanh-chung-cu-trach-nhiem-cua-ai` | P2 | `noxh-check` | Checklist hội nghị nhà chung cư | Draft ready — `docs/content/drafts/06-quan-ly-*.md` |
| 5 | Cluster | `nha-o-cho-thue-du-thao-2026-dieu-kien-va-uu-dai` | P3 | `noxh-loan-quick` | Bảng điều kiện pháp lý nhà ở cho thuê | Draft ready — `docs/content/drafts/05-nha-o-cho-thue-*.md` |

Thứ tự ship: **0 → 2 → 1 → 3 → 4 → 6 → 5**.  
Tag: `phap-ly`, `chung-cu`; pillar thêm `goc-chuyen-gia`.

## 5. Outline từng bài

### Bài 0 — Pillar

**H1:** Luật Nhà ở 2023 và dự thảo sửa đổi 2026 thay đổi những gì?

- Dự thảo sửa đổi Luật Nhà ở 2026 đang đề xuất những nhóm thay đổi nào?
- Khi nào các nội dung trong dự thảo có thể có hiệu lực?
- Những thay đổi này ảnh hưởng thế nào tới người đang sở hữu căn hộ?
- Người sắp mua nhà nên theo dõi điều gì trước khi ký hợp đồng?
- Chung cư thương mại và nhà ở xã hội chịu tác động khác nhau ra sao?

Chức năng: hub — mỗi H2 link xuống 1 cluster tương ứng.

### Bài 2 — Kiểm định chung cư (P0)

**H1:** Kiểm định chung cư bắt buộc: tuổi tòa nhà bao nhiêu thì phải kiểm định?

- Kiểm định chung cư là gì và khác gì với bảo trì, sửa chữa?
- Tuổi tòa nhà bao nhiêu thì phải kiểm định?
- Ai chịu trách nhiệm tổ chức kiểm định và ai trả chi phí?
- Kết quả kiểm định đạt có nghĩa là tòa nhà an toàn trong bao lâu?
- Người mua kiểm tra hồ sơ kiểm định của tòa nhà ở đâu?
- Nhà ở xã hội có bị áp cùng yêu cầu kiểm định như chung cư thương mại không?

Góc phá hiểu nhầm: "vừa kiểm định xong = an toàn 10 năm" là sai.

### Bài 1 — Quyền sở hữu (P1)

**H1:** Quyền sở hữu căn hộ chung cư là có thời hạn hay không xác định thời hạn?

- Luật Nhà ở 2023 quy định thế nào về thời hạn sở hữu căn hộ?
- Sở hữu căn hộ khác gì với quyền sử dụng đất chung của tòa nhà?
- "Sở hữu không xác định thời hạn" có đồng nghĩa với "sở hữu vĩnh viễn" không?
- Nhà bị phá dỡ thì quyền sở hữu của cư dân còn lại là gì?
- Thời hạn sở hữu nhà ở xã hội có khác chung cư thương mại không?
- Trước khi mua, cần đọc những mục nào trong sổ hồng và hợp đồng mua bán?

### Bài 3 — Phá dỡ (P1)

**H1:** Chung cư bị phá dỡ bắt buộc trong những trường hợp nào?

- Căn cứ pháp lý nào cho phép phá dỡ nhà chung cư?
- Ai là người ra quyết định phá dỡ và cư dân có quyền gì trong quy trình đó?
- Dự thảo 2026 đề xuất bổ sung trường hợp phá dỡ nào?
- Quy trình từ khi có kết luận kiểm định đến khi phá dỡ diễn ra thế nào?
- Chủ sở hữu tự kiểm tra tòa nhà của mình có nằm trong quy hoạch cải tạo không bằng cách nào?
- Cần chuẩn bị sẵn giấy tờ gì để bảo vệ quyền lợi khi có quyết định phá dỡ?

**Lằn ranh:** không liệt kê danh sách tòa nhà "nguy cơ phá dỡ" khi chưa có nguồn cấp Sở/hồ sơ (T2–T3). Chỉ dạy tiêu chí + cách tra cứu.

### Bài 4 — Tái định cư (P2)

**H1:** Cải tạo, tái định cư chung cư cũ: Cư dân sẽ được sắp xếp và đền bù như thế nào theo pháp luật?

**Slug giữ nguyên:** `tai-dinh-cu-chung-cu-nhan-nha-hay-nhan-tien` · **Upsert:** `npm run db:upsert:cctm-tai-dinh-cu`

- Tái định cư / bồi thường / tạm cư khác nhau thế nào?
- Cư dân có quyền chọn nhà hay tiền không?
- Nhận nhà tại chỗ: được gì và rủi ro gì?
- Tiền bồi thường dựa trên căn cứ nào?
- Chi phí tạm cư do ai chi trả?
- NƠXH trong chung cư cũ có điểm gì khác?
- Checklist giấy tờ bảo vệ quyền lợi

**Lằn ranh:** không nêu mức bồi thường m² cố định; bám phương án phê duyệt.

### Bài 6 — Quản lý vận hành (P2)

**H1:** Quản lý vận hành nhà chung cư: trách nhiệm thuộc về ai?

- Luật quy định thế nào về vai trò của đơn vị quản lý vận hành?
- Ban quản trị và cư dân có những quyền gì đối với đơn vị quản lý?
- Phí quản lý được xác định và công khai như thế nào?
- Kinh phí bảo trì 2% được sử dụng và giám sát ra sao?
- Cư dân muốn thay đổi đơn vị quản lý vận hành thì làm theo trình tự nào?
- Dự thảo 2026 đề xuất siết thêm yêu cầu gì với đơn vị quản lý?

### Bài 5 — Nhà ở cho thuê (P3)

**H1:** Nhà ở cho thuê theo dự thảo 2026: điều kiện và ưu đãi gồm những gì?

- Pháp luật định nghĩa "nhà ở cho thuê" như thế nào?
- Cho thuê căn hộ cần đáp ứng những điều kiện pháp lý nào?
- Dự thảo 2026 đề xuất mở rộng ưu đãi cho nhóm nào?
- Chi phí và nghĩa vụ thuế khi cho thuê được tính ra sao?
- Nhà ở xã hội cho thuê khác chung cư thương mại cho thuê ở điểm nào?
- Những trường hợp nào bị hạn chế hoặc không được phép cho thuê?

**Lằn ranh:** chỉ trình bày **cách tính** chi phí/nghĩa vụ. Không nêu con số lợi nhuận, rental yield kỳ vọng, hay so sánh "lãi hơn gửi ngân hàng" — vi phạm L0.

## 6. Liên kết nội bộ

```
Pillar (bài 0)
├── Bài 1 ↔ Bài 3   (sở hữu ↔ phá dỡ)
├── Bài 2 → Bài 3   (kiểm định → căn cứ phá dỡ)
├── Bài 3 → Bài 4   (phá dỡ → tái định cư)
├── Bài 6 → Bài 2   (quản lý → kiểm định định kỳ)
├── Bài 5 (độc lập, link ngược pillar)
└── Mọi bài → /cong-cu/dieu-kien-noxh (qua section so sánh NƠXH)
```

Mỗi cluster link ngược pillar ở đoạn mở; pillar link xuống đủ 6 cluster.

## 7. Lằn ranh compliance (áp cho cả cluster)

| Cấm | Lý do |
|-----|-------|
| Gọi House X là "đơn vị tư vấn pháp lý" | Vượt phạm vi; `.cursorrules` + agent copywriter |
| Viết "Luật Nhà ở 2026" như đã ban hành | Sai sự thật — fail `/devil` |
| Danh sách tòa nhà "sắp bị phá dỡ" | Nguồn T1, rủi ro pháp lý và uy tín |
| Con số lợi nhuận / yield cho thuê | L0 cấm cam kết lợi nhuận |
| Mức bồi thường cụ thể theo m² | Phụ thuộc phương án từng dự án — chỉ nêu căn cứ tính |
| Urgency giả ("chốt trước khi luật đổi") | Trái Value-First |

## 8. Quy trình vận hành

1. Brief + full draft trong `docs/content/drafts/` (đã xong 6+1).
2. Nạp queue (idempotent):

```bash
cd Proptech-HouseX
npm run db:seed:cctm-luat-nha-o-queue
```

   Pack: `docs/content/LUAT_NHA_O_CCTM_QUEUE_PACK_V1.json` · Script: `scripts/seed-cctm-luat-nha-o-queue.ts`
3. L2 `/devil` (claim pháp lý, citation, disclaimer) — `requires_legal_qa: true`.
4. Super tại `/admin/content-queue`: `submit_l3` → `approve` → `publish_web` (thứ tự A0→B2→C1→D3→E4→F6→G5).
5. Sau publish: cập nhật trạng thái inventory §4.

## 9. Backlog phát sinh

| Ưu tiên | Việc | Ghi chú |
|---------|------|---------|
| P1 | Mở allowlist CTA cho `GENERAL_POLICY` | `lib/content/noxh-cta-tools.ts` + gate API + test |
| P2 | Hub tag `chung-cu` trên `/tin-tuc/chu-de` | Nếu chưa có tag |
| P2 | FAQPage JSON-LD cho pillar | Tương tự hub NOXH |
| P3 | Waitlist "theo dõi nghị định hướng dẫn" (ADR-016) | Lane interest, không telesales nóng |
