# Queue pack — Full cluster 6+1 (L3 ready)

> Body: `docs/content/drafts/00` … `06-*.md`  
> Machine pack: `docs/content/LUAT_NHA_O_CCTM_QUEUE_PACK_V1.json`

## Nạp Postgres (khuyến nghị)

```bash
cd Proptech-HouseX
# Kiểm tra draft + CTA không cần DB:
npm run db:seed:cctm-luat-nha-o-queue:dry
# Ghi content_queue_items (cần Postgres + .env):
npm run db:seed:cctm-luat-nha-o-queue
```

Sau seed: `/admin/content-queue` → L2 `/devil` → `submit_l3` → `approve` → `publish_web` theo A0→G5.

**Nạp toàn bộ draft 00–13 (khuyến nghị trên VPS):**

```bash
npm run db:seed:content-queue-all:dry
npm run db:seed:content-queue-all
```

Thứ tự đưa queue: A0 → B2 → C1 → D3 → E4 → F6 → G5.

## Item A — Pillar (P0)

| Field | Value |
| --- | --- |
| title | Luật Nhà ở 2023 và dự thảo sửa đổi 2026 thay đổi những gì? |
| slug | `luat-nha-o-2023-va-du-thao-sua-doi-2026-thay-doi-gi` |
| painPoint | Dự thảo Luật Nhà ở sửa đổi 2026 đang đề xuất thay đổi gì so với Luật 2023, và tôi có mất quyền sở hữu căn hộ không? |
| ctaToolId | `noxh-check` |
| ctaLabel | Kiểm tra miễn phí bạn có đủ điều kiện NƠXH không |
| body file | `docs/content/drafts/00-pillar-luat-nha-o-2023-du-thao-2026.md` |

## Item B — Kiểm định (P0)

| Field | Value |
| --- | --- |
| title | Kiểm định chung cư bắt buộc: tuổi tòa nhà bao nhiêu thì phải kiểm định? |
| slug | `kiem-dinh-chung-cu-bat-buoc-tuoi-toa-nha-bao-nhieu` |
| painPoint | Tòa nhà chung cư bao nhiêu tuổi thì bắt buộc kiểm định, và kết quả kiểm định đạt có nghĩa là an toàn dài hạn không? |
| ctaToolId | `noxh-check` |
| body file | `docs/content/drafts/02-kiem-dinh-chung-cu-tuoi-toa-nha.md` |

## Item C — Quyền sở hữu (P1)

| Field | Value |
| --- | --- |
| title | Quyền sở hữu căn hộ chung cư là có thời hạn hay không xác định thời hạn? |
| slug | `quyen-so-huu-can-ho-chung-cu-co-thoi-han-hay-khong` |
| painPoint | Căn hộ chung cư của tôi sở hữu bao lâu, hết niên hạn tòa nhà thì có bị mất quyền sở hữu không? |
| ctaToolId | `noxh-check` |
| body file | `docs/content/drafts/01-quyen-so-huu-can-ho-chung-cu.md` |

## Item D — Phá dỡ (P1)

| Field | Value |
| --- | --- |
| title | Chung cư bị phá dỡ bắt buộc trong những trường hợp nào? |
| slug | `pha-do-chung-cu-bat-buoc-can-cu-va-quy-trinh` |
| painPoint | Chung cư nào bị phá dỡ bắt buộc, cư dân được gì và cần chuẩn bị giấy tờ gì? |
| ctaToolId | `noxh-check` |
| body file | `docs/content/drafts/03-pha-do-chung-cu-bat-buoc.md` |

## Item E — Tái định cư (P2)

| Field | Value |
| --- | --- |
| title | Tái định cư chung cư: nên nhận nhà tại chỗ hay nhận tiền bồi thường? |
| slug | `tai-dinh-cu-chung-cu-nhan-nha-hay-nhan-tien` |
| painPoint | Khi chung cư bị phá dỡ, nên chọn nhận nhà tái định cư hay nhận tiền bồi thường? |
| ctaToolId | `noxh-check` |
| body file | `docs/content/drafts/04-tai-dinh-cu-nhan-nha-hay-nhan-tien.md` |

## Item F — Quản lý vận hành (P2)

| Field | Value |
| --- | --- |
| title | Quản lý vận hành nhà chung cư: trách nhiệm thuộc về ai? |
| slug | `quan-ly-van-hanh-chung-cu-trach-nhiem-cua-ai` |
| painPoint | Phí quản lý chung cư do ai quyết, cư dân thay đơn vị quản lý thế nào, và ai chịu trách nhiệm khi tòa đến hạn kiểm định? |
| ctaToolId | `noxh-check` |
| body file | `docs/content/drafts/06-quan-ly-van-hanh-chung-cu.md` |

## Item G — Nhà ở cho thuê (P3)

| Field | Value |
| --- | --- |
| title | Nhà ở cho thuê theo dự thảo 2026: điều kiện và ưu đãi gồm những gì? |
| slug | `nha-o-cho-thue-du-thao-2026-dieu-kien-va-uu-dai` |
| painPoint | Cho thuê căn hộ theo luật mới cần điều kiện gì, có ưu đãi nào, và khác gì nhà ở xã hội cho thuê? |
| ctaToolId | `noxh-loan-quick` |
| ctaLabel | Kiểm tra nhanh khả năng vay NƠXH (60 giây) |
| body file | `docs/content/drafts/05-nha-o-cho-thue-du-thao-2026.md` |

## Meta chung mọi item

| Field | Value |
| --- | --- |
| content_type | `GENERAL_POLICY` |
| requires_legal_qa | `true` |
| channel | `blog_seo` |
| checklist.pain | true |
| checklist.ctaTool | true |
| checklist.ctaCopy | true |

## L3 note cho Super

1. L2 `/devil` toàn cluster — nhấn dự thảo ≠ luật đã ban hành; đề xuất sở hữu có thời hạn đã rút (14/07/2026).
2. Bài 3: không thêm danh sách tòa “nguy cơ”. Bài 4: không bịa mức bồi thường m². Bài 5: không yield / cam kết lợi nhuận.
3. Bài 5 dùng `noxh-loan-quick`; các bài còn lại `noxh-check`.
4. Publish theo thứ tự A→G để internal link sống dần; hoặc publish cả cụm cùng đợt.
5. `publish_web` → route CMS hiện hành.
