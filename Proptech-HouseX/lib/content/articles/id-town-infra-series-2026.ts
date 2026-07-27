import { NOXH_TAG_AIRPORT } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { ID_TOWN_PR_CLOSINGS } from "@/lib/content/articles/article-editorial-voice";
import {
  ID_TOWN_NAME,
  ID_TOWN_SLUG,
} from "@/lib/content/id-town-landing";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");

/**
 * Bài hạ tầng — ID Town Long Thành (iD Junction).
 * Promote kết nối sân bay / cao tốc / đường sắt Thủ Thiêm – Long Thành.
 * Số liệu khoảng cách: tổng hợp CĐT + báo chí — admin xác minh trước L3 nếu đổi nguồn.
 */
export const ID_TOWN_INFRA_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-id-town-infra-01",
    slug: "id-town-long-thanh-ha-tang-san-bay-metro-2026",
    title:
      "ID Town Long Thành: Cách sân bay ~5 km, ga đường sắt ~1,5–2 km và nút giao cao tốc – QL51",
    excerpt:
      "Phân khu NOXH trong iD Junction (Phạm Văn Đồng, Long Thành): kết nối sân bay Long Thành ~10 phút, về Thủ Đức/Q.1 khoảng 30–40 phút, cận ga Long Thành 1 trên tuyến Thủ Thiêm – Long Thành.",
    body: `## ID Town nằm ở đâu — vì sao vị trí được gọi là nút giao chiến lược?

ID Town (tên đầy đủ thường dùng: phân khu nhà ở xã hội iD Town) nằm trong khu đô thị iD Junction rộng khoảng 40,7 ha, mặt tiền đường Phạm Văn Đồng, thị trấn Long Thành, Đồng Nai — theo [website dự án](https://id-town.com.vn/) và [iD Junction](https://junction.com.vn).

Điểm then chốt không chỉ là “gần sân bay”, mà là nút giao của cao tốc TP.HCM – Long Thành – Dầu Giây với Quốc lộ 51: hai trục xương sống nối Đồng Nai với TP.HCM và hành lang dịch vụ quanh sân bay quốc tế Long Thành.

${EDITORIAL_FIGURES.idTownMap}

${EDITORIAL_FIGURES.idTownPhoiCanh}

## Cách sân bay Long Thành bao xa — đi mất bao lâu?

Theo công bố CĐT và các bài tổng hợp vị trí dự án, cư dân từ ID Town đến khu vực cổng/dịch vụ phụ trợ sân bay quốc tế Long Thành khoảng 5 km — tương đương khoảng 10 phút di chuyển bằng xe cá nhân khi điều kiện giao thông thuận lợi ([id-town.com.vn](https://id-town.com.vn)).

Các lớp kết nối đang đồng bộ:

- Trục T1/T2 dẫn vào nhà ga hành khách: đang được đẩy tiến độ để khớp lộ trình khai thác sân bay ([CafeLand](https://cafeland.vn/tin-tuc/noi-tphcm-voi-san-bay-long-thanh-bang-ha-tang-da-phuong-thuc-146701.html), [Thanh Niên](https://thanhnien.vn/ket-noi-giao-thong-tphcm-voi-san-bay-long-thanh-se-dong-bo-vao-cuoi-nam-2026-1852605141443214.htm)).
- Quốc lộ 51 và ĐT 769: tuyến hiện hữu bọc quanh khu vực, hỗ trợ xe máy/ô tô tới dịch vụ phụ trợ quanh sân bay.

Với người làm việc tại cụm logistic – dịch vụ sân bay hoặc cần đi công tác thường xuyên, khoảng cách ~5 km là lợi thế thực tế hơn lời hứa “gần trung tâm” mơ hồ.

## Về trung tâm TP.HCM mất bao lâu — cao tốc và Vành đai đóng vai trò gì?

Khoảng cách tham chiếu từ khu vực dự án về lõi Quận 1 hoặc TP. Thủ Đức khoảng 28 km. Thời gian ô tô thường được ước lượng khoảng 30–40 phút khi cao tốc thông suốt — phụ thuộc giờ cao điểm và điểm đến cụ thể ([id-town.com.vn](https://id-town.com.vn)).

Các hạng mục liên vùng cần theo dõi:

| Hạ tầng | Vai trò với ID Town | Trạng thái tham chiếu |
|---------|---------------------|------------------------|
| Cao tốc HCM – Long Thành – Dầu Giây | Tiếp giáp phía Bắc khu đô thị; rút ngắn về nút An Phú (Thủ Đức) | Đang khai thác |
| Vành đai 3 & Vành đai 4 TP.HCM | Giảm tải quốc lộ, liên thông đa phương thức | Đang tăng tốc hoàn thiện (mục tiêu quanh cuối 2026 theo báo chí) |
| Đường sắt Thủ Thiêm – Long Thành + Metro số 2 | Kết nối lõi Thủ Thiêm với hành lang sân bay | Đang thúc thủ tục / lộ trình khởi công |

Nguồn tiến độ hạ tầng đa phương thức: [CafeLand](https://cafeland.vn/tin-tuc/noi-tphcm-voi-san-bay-long-thanh-bang-ha-tang-da-phuong-thuc-146701.html), [Thanh Niên](https://thanhnien.vn/ket-noi-giao-thong-tphcm-voi-san-bay-long-thanh-se-dong-bo-vao-cuoi-nam-2026-1852605141443214.htm).

${EDITORIAL_FIGURES.metroViaduct}

## Đường sắt Thủ Thiêm – Long Thành cách ID Town bao xa?

Tuyến đường sắt Thủ Thiêm – Long Thành (đồng bộ quy hoạch với hướng kết nối Metro số 2) không cắt xuyên qua lòng iD Junction. Hướng tuyến đi dọc đường 25B, vượt QL51 rồi vào dải phân cách trục T1 dẫn vào sân bay — theo các phương án được báo chí tổng hợp ([Báo Lâm Đồng](https://baolamdong.vn/du-an-duong-sat-thu-thiem-long-thanh-175000-ty-dong-quy-hoach-chi-tiet-va-tien-do-455872.html), [CafeLand](https://cafeland.vn/tin-tuc/ba-tuyen-duong-sat-ket-noi-san-bay-long-thanh-nha-ga-se-duoc-dat-o-dau-152640.html)).

Ga gần dự án nhất thường được nhắc tới là ga Long Thành 1 (giai đoạn ưu tiên): bố trí gần nút QL51 – đường dẫn T1 vào sân bay. Từ ID Town (mặt tiền Phạm Văn Đồng, gần nút QL51 – cao tốc) đến ga này khoảng 1,5–2 km — tương đương khoảng 3–5 phút xe máy/ô tô theo ước lượng tổng hợp từ bản đồ quy hoạch và bài viết vị trí ga ([VnExpress](https://vnexpress.net/tp-hcm-de-xuat-xay-truoc-14-ga-duong-sat-thu-thiem-long-thanh-5082399.html), [Thanh Niên](https://thanhnien.vn/metro-thu-thiem-long-thanh-se-co-doan-di-ngam-khoi-cong-ngay-thang-sau-185260605165659639.htm)).

Hai ý quan trọng khi đọc khoảng cách này:

1. Khoảng cách dưới ~2 km tới ga quy hoạch thuộc nhóm “cận kề giao thông công cộng” — dễ trung chuyển về Thủ Thiêm hoặc vào sân bay khi tuyến vận hành, nhưng chưa phải lõi TOD đi bộ chặt (thường tối đa ~1–1,5 km quanh ga).
2. Tuyến không xuyên khu đô thị giúp giảm rủi ro tiếng ồn và rung khi tàu chạy — cư dân vẫn giữ không gian sống của iD Junction (hồ cảnh quan, mật độ xây dựng thấp hơn chung cư cao tầng nội đô).

${EDITORIAL_FIGURES.thuThiem}

Bài liên quan về tuyến: [Metro Thủ Thiêm – Long Thành ~175.000 tỷ](/tin-tuc/metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026) · [TOD — chiến lược đô thị Việt Nam](/tin-tuc/tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045)

## ID Town là dự án NOXH thế nào trong iD Junction?

Theo công bố trên [id-town.com.vn](https://id-town.com.vn/) (cần đối chiếu đợt mở bán cụ thể):

| Hạng mục | Thông tin tham chiếu |
|----------|----------------------|
| Chủ đầu tư | Công ty Cổ phần Long Thành Riverside (Tây Hồ Group) |
| Quy mô phân khu | ~2,5 ha — 4 block cao 7 tầng — khoảng 628 căn |
| Mật độ xây dựng | ~35% (ưu tiên mảng xanh, hồ nước) |
| Loại hình | Căn 2PN và 3PN (diện tích theo bảng giá từng đợt) |
| Giá tham chiếu | Khoảng 22 triệu/m² (khối C/D công bố đầu 2026 trên kênh CĐT — đã gồm VAT theo thông tin công bố) |
| Tiện ích thừa hưởng | Hồ trung tâm, clubhouse, hồ bơi, trường học quốc tế nội khu iD Junction |

${EDITORIAL_FIGURES.idTownTienIch}

${ID_TOWN_PR_CLOSINGS.haTangKetNoi}

Tra cứu mặt bằng, gallery và FAQ dự án: [/du-an/id-town-long-thanh](/du-an/id-town-long-thanh) · Hub tỉnh: [/du-an/nha-o-xa-hoi/dong-nai](/du-an/nha-o-xa-hoi/dong-nai)

ID Town thuộc hành lang kết nối sân bay Long Thành – Tân Sơn Nhất — không nằm trên trục Quốc lộ 13 (Lái Thiêu / Thuận An) và khác hành lang kinh tế biển phía Đông (Nhơn Trạch / DTA). Bản đồ 6 trục: [Sáu trục tăng trưởng đô thị TP.HCM](/wiki-nha-o-xa-hoi/bon-cuc-tang-truong-do-thi-tp-hcm-2026).

*Vị trí ga, tiến độ đường sắt/Vành đai và bảng giá căn có thể thay đổi theo phê duyệt và đợt mở bán.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T08:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/projects/id-town/hero.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "ID Town Long Thành — hạ tầng sân bay 5km, ga metro 1,5–2km | HouseX",
    seoDesc:
      "Phân tích kết nối ID Town (iD Junction): sân bay Long Thành ~5 km, cao tốc & QL51, ga Long Thành 1 ~1,5–2 km trên tuyến Thủ Thiêm – Long Thành.",
    tags: [NOXH_TAG_AIRPORT],
    projects: [{ slug: ID_TOWN_SLUG, name: ID_TOWN_NAME }],
  },
];
