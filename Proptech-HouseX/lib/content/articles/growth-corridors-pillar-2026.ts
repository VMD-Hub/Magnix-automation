import { NOXH_TAG_HA_TANG } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { GROWTH_CORRIDORS_PILLAR_SLUG } from "@/lib/content/growth-corridors";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");

/**
 * Pillar SEO — 6 trục tăng trưởng HCMC / liên vùng + phễu Vĩ mô → Tiềm năng → Thực tế.
 * Giữ slug URL cũ để không gãy featured / backlink.
 */
export const GROWTH_CORRIDORS_PILLAR_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-growth-corridors-01",
    slug: GROWTH_CORRIDORS_PILLAR_SLUG,
    title:
      "Sáu trục tăng trưởng đô thị TP.HCM: sông Sài Gòn, Đông–Tây, biển Đông, Vành đai, sân bay và QL13",
    excerpt:
      "An cư theo quy hoạch liên vùng: Bắc–Nam dọc sông, Đông–Tây VVK–MCT, kinh tế biển phía Đông, Vành đai 3–4, hành lang sân bay Long Thành, và Đại lộ tài chính QL13 — mỗi trục một phễu Vĩ mô → Tiềm năng → Thực tế.",
    body: `## Vì sao chọn nhà theo trục tăng trưởng, không theo “tin đồn hạ tầng”?

Thị trường nhà ở quanh TP.HCM và vùng phụ cận đang mở theo nhiều hành lang cùng lúc, bám quy hoạch quốc gia và liên vùng. Mỗi trục có động lực riêng: sông và hướng biển phía Nam; đại lộ Đông–Tây nối thủ phủ công nghiệp; logistics biển Đông; vành đai đô thị vệ tinh; liên cảng hàng không Long Thành – Tân Sơn Nhất; và Đại lộ tài chính Quốc lộ 13 Đông Bắc.

Chuỗi nội dung House X theo ba lớp: Vĩ mô (nhận diện hạ tầng / quy hoạch) → Tiềm năng (dòng tiền / biên độ) → Thực tế (dự án / giá / pháp lý). Chọn đúng trục trước, rồi mới so sánh dự án trong cùng hành lang — tránh đặt ID Town cạnh Emerald 68 như cùng một thị trường.

${EDITORIAL_FIGURES.hcmSkyline}

## Phễu nội dung trên mỗi trục hoạt động thế nào?

| Tầng | Câu hỏi người đọc | Loại bài |
|------|-------------------|----------|
| Vĩ mô | Hạ tầng / TOD đang mở ở đâu? | Quy hoạch, tiến độ tuyến |
| Tiềm năng | Dòng tiền và biên độ giá đi về đâu? | Phân tích thị trường |
| Thực tế | Dự án nào đang / sắp bán, giá ra sao? | Review, bảng giá, landing |

## Trục 1 — Bắc – Nam dọc sông Sài Gòn hướng biển?

Từ Củ Chi về Nhà Bè – Cần Giờ: hành lang kinh tế dịch vụ, du lịch và giao thông thủy. BĐS ven sông Nam Sài Gòn và siêu cảng trung chuyển Cần Giờ là động lực dài hạn — khác cửa ngõ QL13 và khác đô thị sân bay Long Thành.

Chủ đề: [/tin-tuc/kien-thuc/chu-de/hanh-lang-bac-nam-song-sai-gon](/tin-tuc/kien-thuc/chu-de/hanh-lang-bac-nam-song-sai-gon). Neo nhẹ trên House X: [Thủ Thiêm Green House](/du-an/thu-thiem-green-house-thu-duc) (mặt tiền Võ Chí Công / chân cầu Phú Mỹ). Các bài chi tiết sẽ được bổ sung theo từng lớp nội dung.

## Trục 2 — Đông – Tây Võ Văn Kiệt – Mai Chí Thọ?

Xương sống liên kết vùng: Long An xuyên lõi trung tâm đến Đồng Nai — cửa ngõ công nghiệp hai đầu. An cư / đầu tư dọc đại lộ hưởng lợi thời gian về trung tâm ngắn, khác hành lang biển Đông và khác Vành đai vệ tinh.

Chủ đề: [/tin-tuc/kien-thuc/chu-de/hanh-lang-dong-tay-vvk-mct](/tin-tuc/kien-thuc/chu-de/hanh-lang-dong-tay-vvk-mct).

## Trục 3 — Kinh tế biển phía Đông (hướng Bà Rịa – Vũng Tàu)?

Chuỗi logistics TP.HCM – Nhơn Trạch – Long Thành – Cái Mép – Thị Vải, đồng bộ cao tốc Biên Hòa – Vũng Tàu và Bến Lức – Long Thành. Đây là trục của đô thị vệ tinh / NOXH gần KCN — không phải “sân bay city” thuần túy.

Neo House X: [DTA Happy Home Nhơn Trạch](/du-an/dta-happy-home-nhon-trach). Đã publish tầng Tiềm năng: [Nhơn Trạch cực tăng trưởng hạ tầng](/tin-tuc/kien-thuc/nhon-trach-cu-tang-truong-ha-tang-tod-2026).

Chủ đề: [/tin-tuc/kien-thuc/chu-de/hanh-lang-kinh-te-bien-phia-dong](/tin-tuc/kien-thuc/chu-de/hanh-lang-kinh-te-bien-phia-dong).

## Trục 4 — Vành đai 3 & Vành đai 4?

Chuỗi đô thị vệ tinh quanh vành đai: Thủ Đức, Củ Chi, Bình Chánh, Thuận An và các điểm nút Bình Dương / Đồng Nai / Long An. TOD quanh nút giao Vành đai 3 là lớp “tiềm năng”; săn đất nền / nhà phố đón thông xe là lớp “thực tế”.

Chủ đề: [/tin-tuc/kien-thuc/chu-de/hanh-lang-vanh-dai-3-4](/tin-tuc/kien-thuc/chu-de/hanh-lang-vanh-dai-3-4).

## Trục 5 — Kết nối sân bay Long Thành & Tân Sơn Nhất?

Trục liên cảng hàng không và đường sắt Thủ Thiêm – Long Thành. Đô thị sân bay trong bán kính 5–10 km có logic cho thuê / thương mại riêng — không gộp với QL13 Lái Thiêu.

Neo House X: [ID Town Long Thành](/du-an/id-town-long-thanh) trong iD Junction. Đã publish: [Metro / đường sắt TTLT](/tin-tuc/kien-thuc/metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026) (Vĩ mô) · [hạ tầng ID Town](/tin-tuc/kien-thuc/id-town-long-thanh-ha-tang-san-bay-metro-2026) (Thực tế).

Chủ đề: [/tin-tuc/kien-thuc/chu-de/hanh-lang-san-bay-long-thanh](/tin-tuc/kien-thuc/chu-de/hanh-lang-san-bay-long-thanh).

${EDITORIAL_FIGURES.metroHub}

## Trục đặc biệt — Đại lộ tài chính Quốc lộ 13 Đông Bắc?

Mở rộng QL13, Metro số 2, cửa ngõ Thủ Đức – Lái Thiêu – Thuận An. Văn hóa phố thị – ven sông – vườn trái cây Lái Thiêu; nhu cầu thuê từ chuyên gia KCN VSIP — động lực khác hẳn Long Thành.

Neo: [Hồ Gươm Xanh NOXH](/du-an/nha-o-xa-hoi-ho-guom-xanh-thuan-an) · [Emerald 68](/du-an/the-emerald-68-thuan-an) · [A&T Sky Garden](/du-an/at-sky-garden-lai-thieu) · [Astral City](/du-an/astral-city-thuan-an) · [Emerald Boulevard](/du-an/the-emerald-boulevard-thuan-an).

Phễu đã có bài: [quy hoạch Lái Thiêu 2040](/tin-tuc/kien-thuc/lai-thieu-quy-hoach-2040-phuong-trung-tam-metro-2026) (Vĩ mô) · [ở thực hay cho thuê](/tin-tuc/kien-thuc/mua-can-ho-lai-thieu-o-thuc-hay-dau-tu-cho-thue-2026) (Tiềm năng) · [căn hộ QL13 đang mở bán](/tin-tuc/kien-thuc/can-ho-lai-thieu-quoc-lo-13-du-an-noi-bat-2026) (Thực tế) · [Metro số 2 QL13 & TOD](/tin-tuc/kien-thuc/ho-guom-xanh-metro-so-2-ql13-tod-2026).

Chủ đề: [/tin-tuc/kien-thuc/chu-de/truc-quoc-lo-13-dong-bac](/tin-tuc/kien-thuc/chu-de/truc-quoc-lo-13-dong-bac).

## Làm sao chọn trục trước khi xem dự án?

| Câu hỏi | Trục gợi ý |
|---------|------------|
| Ven sông / Nam Sài Gòn – Cần Giờ? | Bắc – Nam sông Sài Gòn |
| Di chuyển Đông–Tây, gần đại lộ VVK–MCT? | Đông – Tây |
| Làm KCN Nhơn Trạch / logistics biển Đông? | Kinh tế biển phía Đông (DTA) |
| Đón Vành đai 3–4 / đô thị vệ tinh nút giao? | Vành đai 3 & 4 |
| Gắn sân bay Long Thành / đô thị sân bay? | Hành lang sân bay (ID Town) |
| Cửa ngõ QL13 / Lái Thiêu / chuyên gia VSIP? | Đại lộ tài chính QL13 |

Sau khi chốt trục, đối chiếu dự án trong cùng hành lang. House X tư vấn hồ sơ nhà ở xã hội miễn phí và cập nhật tiến độ — [đăng ký ngay](/lien-he).

${EDITORIAL_FIGURES.bitexcoMetro}

Bài khung liên quan: [TOD xương sống đô thị Việt Nam](/tin-tuc/tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045) · [Quy hoạch tổng thể TP.HCM 100 năm](/tin-tuc/quy-hoach-tong-the-tphcm-tam-nhin-100-nam-sieu-do-thi)

*Bản đồ 6 trục mang tính định hướng biên tập theo quy hoạch liên vùng — tiến độ hạ tầng theo công bố cơ quan nhà nước và CĐT.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T16:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/hcmc-skyline-river-day.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "6 trục tăng trưởng TP.HCM — sông, Đông–Tây, biển Đông, Vành đai, sân bay, QL13 | HouseX",
    seoDesc:
      "Phễu Vĩ mô → Tiềm năng → Thực tế trên 6 hành lang quy hoạch: ID Town (sân bay), DTA (biển Đông), Hồ Gươm Xanh & căn hộ QL13 — chọn đúng trục trước khi so sánh dự án.",
    tags: [NOXH_TAG_HA_TANG],
    projects: [],
  },
];
