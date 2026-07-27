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
 * Trục sân bay Long Thành — tầng Tiềm năng (airport city / cho thuê định tính).
 * Vĩ mô đã publish: metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026.
 * Thực tế đã publish: id-town-long-thanh-ha-tang-san-bay-metro-2026.
 */
export const AIRPORT_CORRIDOR_POTENTIAL_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-airport-potential-01",
    slug: "bds-thanh-pho-san-bay-long-thanh-mo-hinh-sinh-loi-2026",
    title:
      'BĐS "thành phố sân bay" Long Thành: Mô hình cho thuê – thương mại bán kính 5–10 km',
    excerpt:
      "ACV hướng khai thác thương mại Long Thành giai đoạn 1 từ 1/12/2026; hoàn thành xây dựng muộn nhất tháng 9; ORAT 3 đợt; ưu đãi phí dịch vụ hàng không 20–50% (2026–2027). Logic sinh lời định tính quanh airport city — neo ID Town.",
    body: `## “Thành phố sân bay” Long Thành sinh lời theo cơ chế nào?

Mô hình airport city nhìn dòng tiền từ dịch vụ hàng không, logistic, khách sạn / căn hộ dịch vụ và nhà ở cho lao động quanh sân bay trong bán kính khoảng 5–10 km — khác săn đất nền đón Vành đai thuần túy và khác NOXH vệ tinh logistics biển Đông (Nhơn Trạch / DTA).

Pillar 6 trục: [Sáu trục tăng trưởng đô thị TP.HCM](/wiki-nha-o-xa-hoi/bon-cuc-tang-truong-do-thi-tp-hcm-2026). Vĩ mô đường sắt liên vùng: [Metro Thủ Thiêm – Long Thành ~175.000 tỷ](/tin-tuc/metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026).

${EDITORIAL_FIGURES.thuThiem}

## ACV đặt mốc khai thác thương mại Long Thành giai đoạn 1 khi nào?

Tổng công ty Cảng hàng không Việt Nam (ACV) báo cáo hướng đưa Cảng hàng không quốc tế Long Thành giai đoạn 1 vào khai thác thương mại từ ngày 1/12/2026; quyết tâm hoàn thành toàn bộ công tác xây dựng / lắp đặt muộn nhất trong tháng 9/2026 — [Nhân Dân](https://nhandan.vn/quyet-tam-khai-thac-thuong-mai-cang-hang-khong-quoc-te-long-thanh-dau-thang-12-toi-post975427.html), [Báo Đầu tư](https://baodautu.vn/acv-chot-moc-khai-thac-thuong-mai-san-bay-long-thanh-tu-ngay-1122026-d642966.html), [Vietnam News / Bizhub](https://bizhub.vietnamnews.vn/acv-proposes-december-1-commercial-opening-for-long-thanh-airport-post408967.html).

Chương trình vận hành thử ORAT (Operational Readiness and Airport Transfer) được mô tả theo ba đợt khoảng tháng 9–10–11/2026 trước khi khai thác thương mại. Song song, ACV đề xuất gói ưu đãi “Long Thanh Launch” giảm khoảng 20–50% giá dịch vụ hàng không trong giai đoạn 2026–2027 nhằm thu hút hãng chuyển / mở đường bay từ Tân Sơn Nhất.

${EDITORIAL_FIGURES.metroViaduct}

## Kết nối Bến Lức – Long Thành, Vành đai 3 và 25B/25C đóng vai trò gì?

Để airport city vận hành, lớp đường bộ phải khớp mốc sân bay: cao tốc Bến Lức – Long Thành, Vành đai 3, trục 25B/25C và các đường dẫn T1/T2 vào nhà ga được báo chí nhắc là điều kiện kết nối trước khi khai thác thương mại cuối 2026 ([VIR](https://vir.com.vn/acv-pushes-to-complete-long-thanh-airport-phase-one-by-september-156760.html), [Thanh Niên / kết nối đa phương thức](https://thanhnien.vn/ket-noi-giao-thong-tphcm-voi-san-bay-long-thanh-se-dong-bo-vao-cuoi-nam-2026-1852605141443214.htm)).

Đây là lý do BĐS trong bán kính 5–10 km được bàn theo logic cho thuê / dịch vụ / an cư lao động sân bay — chứ không chỉ “nghe tin sân bay là mua đất”.

## Cho thuê và thương mại bán kính 5–10 km — đọc định tính thế nào?

| Nhóm nhu cầu | Logic định tính quanh Long Thành |
|--------------|----------------------------------|
| Lao động vận hành / dịch vụ sân bay | Nhu cầu ở gần, thuê hoặc NOXH trong bán kính di chuyển ngắn |
| Khách công tác / trung chuyển | Căn hộ dịch vụ, khách sạn — phụ thuộc slot bay và tiến độ ORAT |
| Logistic / phụ trợ hàng không | Mặt bằng kho / văn phòng gần trục T1–T2 và QL51 |

House X không đưa % tăng giá căn hộ hay đất nền quanh sân bay khi chưa có chuỗi số liệu giao dịch độc lập công bố. Tiềm năng ở đây là khớp cung – cầu dịch vụ khi khai thác thương mại và ưu đãi hãng bay — không phải cam kết biên độ giá.

${EDITORIAL_FIGURES.idTownPhoiCanh}

## ID Town minh họa thực tế NOXH trên hành lang sân bay thế nào?

Phân khu NOXH [ID Town Long Thành](/du-an/id-town-long-thanh) trong iD Junction được mô tả khoảng 5 km tới khu vực sân bay và khoảng 1,5–2 km tới ga quy hoạch Long Thành 1 — bài thực tế hạ tầng: [ID Town Long Thành — sân bay & metro](/tin-tuc/id-town-long-thanh-ha-tang-san-bay-metro-2026).

Đối chiếu nhanh với hành lang khác:

- Biển Đông / DTA: [Nhơn Trạch cực tăng trưởng](/tin-tuc/nhon-trach-cu-tang-truong-ha-tang-tod-2026)
- Không gộp QL13 Lái Thiêu vào cùng “sóng sân bay”

${EDITORIAL_FIGURES.idTownMap}

${ID_TOWN_PR_CLOSINGS.haTangKetNoi}

Cần tư vấn hồ sơ NOXH trên hành lang sân bay — [liên hệ](/lien-he).

*Mốc khai thác, ORAT và gói ưu đãi phí theo báo cáo / đề xuất ACV — có thể điều chỉnh khi cơ quan nhà nước phê duyệt chính thức.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T14:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/projects/id-town/hero.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "BĐS thành phố sân bay Long Thành — mô hình sinh lời 2026 | HouseX",
    seoDesc:
      "ACV hướng khai thác Long Thành từ 1/12/2026, ORAT, ưu đãi phí 20–50%. Logic cho thuê/thương mại bán kính 5–10 km; neo ID Town. Không nêu % tăng giá giả.",
    tags: [NOXH_TAG_AIRPORT],
    projects: [{ slug: ID_TOWN_SLUG, name: ID_TOWN_NAME }],
  },
];
