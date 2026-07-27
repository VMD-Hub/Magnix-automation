import { NOXH_TAG_HA_TANG } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { HGX_PR_CLOSINGS } from "@/lib/content/articles/article-editorial-voice";
import {
  HGX_PROJECT_NAME,
  HGX_PROJECT_SLUG,
} from "@/lib/preview/ho-guom-xanh-mock";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");

/**
 * Bài hạ tầng — NOXH Hồ Gươm Xanh (Thuận An).
 * Trọng điểm: Metro số 2 Bình Dương – TP.HCM dọc QL13 + TOD tương lai; lồng điểm nổi bật NOXH.
 * Số liệu ga/khoảng cách: tổng hợp báo chí + CĐT — admin xác minh trước L3 nếu đổi nguồn.
 */
export const HGX_INFRA_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-hgx-infra-01",
    slug: "ho-guom-xanh-metro-so-2-ql13-tod-2026",
    title:
      "Hồ Gươm Xanh Thuận An: Metro số 2 dọc QL13 trước cửa, ga Lái Thiêu và TOD tương lai cho NOXH",
    excerpt:
      "Phân khu NOXH trong KĐT ~26,4 ha TBS Land tại 136 Đại lộ Bình Dương: QL13 mở rộng 8 làn, cửa ngõ Thủ Đức, quy hoạch Metro số 2 Bình Dương – TP.HCM chạy thẳng trước mặt — bán kính tiếp cận ga Lái Thiêu vài trăm mét.",
    body: `## Hồ Gươm Xanh nằm ở đâu — vì sao gắn với cửa ngõ Bình Dương – TP.HCM?

Nhà ở xã hội Hồ Gươm Xanh là phân khu chung cư NOXH (block 5–12 tầng) trong Khu đô thị sinh thái Hồ Gươm Xanh Thuận An City rộng khoảng 26,4 ha, do TBS Land (TBS Group) làm chủ đầu tư — địa chỉ 136 Đại lộ Bình Dương (Quốc lộ 13), phường Lái Thiêu, TP. Thuận An, Bình Dương ([hoguom-xanh.vn](https://hoguom-xanh.vn/), [Angialand](https://angialand.com.vn/ho-guom-xanh-thuan-an-city.html)).

Điểm then chốt: dự án sát ranh giới với TP. Thủ Đức trên trục giao thương huyết mạch vùng kinh tế phía Nam. Cư dân theo công bố tổng hợp vị trí chỉ mất khoảng 20–30 phút qua QL13 về hướng trung tâm Quận 1, hoặc theo đại lộ Phạm Văn Đồng hướng sân bay Tân Sơn Nhất — tùy giờ và điểm đến cụ thể.

${EDITORIAL_FIGURES.hgxPhoiCanh}

${EDITORIAL_FIGURES.hgxKetNoi}

## Quốc lộ 13 trước mặt đang thay đổi thế nào?

Trục trước mặt dự án không chỉ là “đường lớn”: QL13 / Đại lộ Bình Dương đang được nâng cấp, mở rộng hướng tới 8 làn xe nhằm giảm ùn tắc và tăng tốc độ liên vùng ([VnEconomy](https://vneconomy.vn/thuan-an-tro-thanh-khu-vuc-dang-dau-tu-nhat-khi-quoc-lo-13-khoi-cong.htm), [Thanh Niên](https://thanhnien.vn/metro-truoc-nha-quoc-lo-rong-loi-tin-vui-cho-khu-dong-bac-tphcm-185251217141315415.htm)).

Với người mua NOXH — thường phụ thuộc xe máy/ô tô trong giai đoạn trước khi metro vận hành — việc mở rộng lộ giới trước cửa nhà là lợi thế thực tế ngay từ hôm nay, không chỉ lời hứa quy hoạch.

Trong bán kính khoảng 500 m – 2 km, cư dân dễ tiếp cận AEON Mall Bình Dương, Lotte Mart, sân golf Sông Bé, bệnh viện quốc tế Becamex và hệ thống trường học các cấp (tổng hợp từ các kênh giới thiệu KĐT — khoảng cách tham chiếu, không thay bản đồ đo đạc).

## Metro số 2 Bình Dương – TP.HCM chạy thế nào so với Hồ Gươm Xanh?

Theo quy hoạch mạng lưới đường sắt đô thị liên vùng, tuyến Metro số 2 Bình Dương (hướng Thủ Dầu Một – TP.HCM) được định hướng chạy dọc Đại lộ Bình Dương / QL13, đi qua địa bàn Lái Thiêu — tức cùng trục đường trước mặt KĐT Hồ Gươm Xanh ([CafeF](https://cafef.vn/thong-tin-moi-nhat-ve-tien-do-trien-khai-tuyen-metro-so-2-doc-truc-ql13-188250915212701769.chn), [Thanh Niên](https://thanhnien.vn/metro-truoc-nha-quoc-lo-rong-loi-tin-vui-cho-khu-dong-bac-tphcm-185251217141315415.htm)).

UBND tỉnh đã có bước phê duyệt hướng tuyến và vị trí nhà ga trên trục này; ga số 2 thuộc địa bàn phường Lái Thiêu được báo chí và tài liệu quy hoạch nhắc tới như điểm dừng gần khu vực dự án ([thitruongdiaoc.vn](https://thitruongdiaoc.vn/van-ban-phe-duyet-dieu-chinh-quy-hoach-nha-ga-metro-so-2-tren-truc-ql13-di-qua-phuong-lai-thieu-a26385.html)). Tổng hợp vị trí công bố: cư dân phân khu NOXH có thể tiếp cận trạm dừng trong bán kính vài trăm mét — đi bộ hoặc di chuyển rất ngắn bằng xe cá nhân.

Đây là điểm khác biệt so với nhiều dự án NOXH vùng ven chỉ “hưởng lợi hành lang” cách ga 3–5 km: Hồ Gươm Xanh nằm đúng trên trục ga quy hoạch — gần tiêu chí lõi TOD (bán kính đi bộ thường tối đa ~1–1,5 km quanh ga) hơn nhóm đô thị vệ tinh xa ga.

${EDITORIAL_FIGURES.metroHub}

## Liên thông vào lõi TP.HCM — Tao Đàn và Metro số 2 nội thành?

Theo các phương án điều chỉnh được báo chí cập nhật, hướng tuyến dọc QL13 từ Bình Dương đi qua Hiệp Bình Phước và hướng nối vào hệ Metro số 2 TP.HCM (điểm nút thường được nhắc: khu vực Tao Đàn / Quận 1) — nhằm tạo hành lang tàu điện xuyên suốt từ Thuận An vào trung tâm mà không phụ thuộc ùn tắc đường bộ ([Dân trí](https://dantri.com.vn/thoi-su/tphcm-them-tuyen-metro-ket-noi-binh-duong-ben-thanh-vao-nhom-uu-tien-dau-tu-20260605221130643.htm), [VnExpress](https://vnexpress.net/nghien-cuu-keo-dai-tuyen-metro-thu-dau-mot-vao-trung-tam-tp-hcm-5081925.html)).

Tuyến được xếp vào nhóm dự án hạ tầng ưu tiên đầu tư. Tiến độ thực tế phụ thuộc phê duyệt, GPMB và bố trí vốn — mốc hoàn thành sẽ theo công bố của cơ quan nhà nước và chủ đầu tư dự án metro.

Bài liên quan nội thành: [5 khu TOD metro số 2 Bến Thành – Tham Lương](/tin-tuc/tp-hcm-5-khu-tod-metro-so-2-ben-thanh-tham-luong) · [TOD — chiến lược đô thị Việt Nam](/tin-tuc/tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045)

${EDITORIAL_FIGURES.bitexcoMetro}

## Ngoài metro trước cửa — phân khu NOXH Hồ Gươm Xanh còn những điểm gì?

Hạ tầng chỉ là một nửa câu chuyện. Khi cân nhắc suất nhà ở xã hội trong KĐT Hồ Gươm Xanh, các điểm sau thường được đối chiếu cùng lúc:

| Hạng mục | Thông tin tham chiếu |
|----------|----------------------|
| Mô hình đô thị đồng bộ | NOXH 5–12 tầng nằm trong KĐT ~26,4 ha (~4.200 sản phẩm, dân số ước ~10.500) — không phải block đơn lẻ ven đường |
| Cảnh quan nội khu | Hồ cảnh quan trung tâm, công viên, phố đi bộ và tiện ích giáo dục, thương mại, thể thao |
| Tách rõ NOXH / thương mại | KĐT còn nhà phố, biệt thự, cao tầng thương mại tới ~40 tầng và tổ hợp khách sạn–TTTM — giá & điều kiện khác hẳn NOXH |
| Tiến độ | Khởi công khoảng 27/06/2025; bàn giao tham chiếu khoảng 2028 (theo kênh công bố — xác nhận từng đợt) |
| Giá nhà ở xã hội | Chưa niêm yết trên website dự án |
| Pháp lý đối tượng | Theo Luật Nhà ở và thông báo từng đợt mở bán |

${EDITORIAL_FIGURES.hgxTienIch}

${HGX_PR_CLOSINGS.metroTod}

Tra cứu landing dự án: [/du-an/nha-o-xa-hoi-ho-guom-xanh-thuan-an](/du-an/nha-o-xa-hoi-ho-guom-xanh-thuan-an) · Điều kiện mua: [/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat](/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat)

*Vị trí ga, tiến độ Metro số 2 / mở rộng QL13 và bảng giá căn có thể thay đổi theo phê duyệt và đợt mở bán.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T10:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Hồ Gươm Xanh — Metro số 2 QL13, ga Lái Thiêu & TOD NOXH | HouseX",
    seoDesc:
      "NOXH Hồ Gươm Xanh Thuận An: Metro số 2 dọc QL13 trước cửa, ga Lái Thiêu vài trăm mét, QL13 8 làn, cửa ngõ Thủ Đức — KĐT 26,4 ha TBS Land.",
    tags: [NOXH_TAG_HA_TANG],
    projects: [{ slug: HGX_PROJECT_SLUG, name: HGX_PROJECT_NAME }],
  },
];
