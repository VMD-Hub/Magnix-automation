import {
  NOXH_TAG_CHON_NHA,
  NOXH_TAG_DU_AN_GIA,
  NOXH_TAG_HA_TANG,
} from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { LAI_THIEU_PR_CLOSINGS } from "@/lib/content/articles/article-editorial-voice";
import {
  HGX_PROJECT_NAME,
  HGX_PROJECT_SLUG,
} from "@/lib/preview/ho-guom-xanh-mock";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");
const HGX_HREF = `/du-an/${HGX_PROJECT_SLUG}`;

/**
 * Series khu vực Lái Thiêu (Thuận An) — SEO / AIO + truyền cảm hứng an cư.
 * Số liệu quy hoạch / giá / thuê: tổng hợp báo chí & tài liệu công bố — admin xác minh trước L3.
 */
export const LAI_THIEU_AREA_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-lai-thieu-01",
    slug: "lai-thieu-quy-hoach-2040-phuong-trung-tam-metro-2026",
    title:
      "Quy hoạch Lái Thiêu đến 2040: phường trung tâm, Metro QL13 và đô thị sinh thái ven sông",
    excerpt:
      "Sau sáp nhập, Lái Thiêu mở rộng ~15,46 km² với hơn 118.000 dân; QL13 hướng 8 làn, Metro dọc Đại lộ Bình Dương, đường ven sông Sài Gòn và mô hình đô thị vườn trái cây — cửa ngõ thương mại Bắc lõi đô thị phía Nam.",
    body: `## Lái Thiêu đang chuyển mình thế nào trong quy hoạch đến 2040?

Phường Lái Thiêu — cửa ngõ Bình Dương tiếp giáp TP.HCM — đang được định vị lại mạnh mẽ trong Đồ án quy hoạch chung TP. Thuận An đến năm 2040 và tầm nhìn xa hơn. Thay vì chỉ là “vùng đệm” ven Quốc lộ 13, khu vực được hướng tới vai trò phường trung tâm lớn phía Bắc vùng lõi đô thị: thương mại – dịch vụ sầm uất, hạ tầng đa phương thức và bản sắc đô thị sinh thái gắn vườn trái cây truyền thống ([Đại hội Đảng toàn quốc](https://daihoidangtoanquoc.vn/lai-thieu-phat-huy-vai-tro-phuong-trung-tam-phia-bac-thanh-pho-ho-chi-minh-post2754.html), [Phát Đạt / công bố quy hoạch Thuận An](https://www.phatdat.com.vn/news/binh-duong-cong-bo-quy-hoach-tp-thuan-an-den-nam-2040)).

Với người tìm chỗ ở lâu dài, câu chuyện không chỉ là “mua căn hộ gần đường lớn”, mà là sống trong một lõi đô thị đang được thiết kế lại: rộng hơn về hành chính, dày hơn về hạ tầng, và rõ hơn về bản sắc sống gần sông – gần xanh.

${EDITORIAL_FIGURES.metroHub}

## Sau sáp nhập đơn vị hành chính, Lái Thiêu lớn đến mức nào?

Phường Lái Thiêu mới được hợp nhất diện tích từ phường Bình Nhâm, phường Lái Thiêu cũ và một phần phường Vĩnh Phú. Quy mô dân số tham chiếu vượt 118.000 người trên tổng diện tích tự nhiên khoảng 15,46 km² — đủ lớn để vận hành như một trung tâm đô thị đa chức năng, không còn là “điểm dừng” nhỏ trên trục QL13 ([Nhà Tốt / tổng hợp khu vực](https://www.nhatot.com/khu-vuc-phuong-lai-thieu-tphcm-sd6a0e)).

Về chức năng kinh tế, Lái Thiêu được xác định là trung tâm thúc đẩy thương mại – dịch vụ sầm uất nhất phía Bắc vùng lõi đô thị. Khu đô thị truyền thống quanh chợ Lái Thiêu cũ (khoảng 99,72 ha) được định hướng cải tạo bài bản — giữ nhịp sống phố cũ đồng thời nâng chất không gian công cộng ([Nhân Kiệt / đồ án quy hoạch Thuận An 2040](https://nhankiet.vn/en/w3463/DO-AN-QUY-HOACH-CHUNG-CUA-THANH-PHO-THUAN-AN-DEN-NAM-2040.html)).

## Hạ tầng giao thông Lái Thiêu đổi ra sao — QL13, Metro và đường ven sông?

Ba mũi nhọn thường được nhắc cùng lúc:

| Trụ | Nội dung tham chiếu |
|-----|---------------------|
| Đại lộ Bình Dương / QL13 | Mở rộng lộ giới hướng tới 8 làn; hai bên quy hoạch dải đất hỗn hợp cao tầng (văn phòng, căn hộ, dịch vụ lớn) |
| Metro dọc Đại lộ | Tuyến đường sắt đô thị chạy dọc Đại lộ Bình Dương, bố trí ga tại Lái Thiêu; hướng kết nối chuyển tiếp Metro số 2 TP.HCM vào trung tâm |
| Đường ven sông Sài Gòn | GPMB và đồng bộ cảnh quan đoạn qua Lái Thiêu – Bình Nhâm — khai thác quỹ đất mặt nước |

Nguồn tổng hợp quy hoạch giao thông công cộng và bản đồ khu vực: [Guland Lái Thiêu](https://guland.vn/kho-ban-do/quy-hoach/binh-duong/thanh-pho-thuan-an/phuong-lai-thieu), [CafeF / Metro số 2 dọc QL13](https://cafef.vn/thong-tin-moi-nhat-ve-tien-do-trien-khai-tuyen-metro-so-2-doc-truc-ql13-188250915212701769.chn), [Thanh Niên](https://thanhnien.vn/metro-truoc-nha-quoc-lo-rong-loi-tin-vui-cho-khu-dong-bac-tphcm-185251217141315415.htm).

Với cư dân tương lai, QL13 mở rộng là lợi thế “ở được ngay hôm nay”; metro và đường ven sông là lớp giá trị trung–dài hạn — khi tuyến vận hành và dải cảnh quan hoàn thiện.

${EDITORIAL_FIGURES.bitexcoMetro}

## Vì sao Lái Thiêu giữ mô hình đô thị sinh thái “vườn trái cây”?

Khác nhiều hành lang công nghiệp nặng, Lái Thiêu được định hướng giữ bản sắc văn hóa đặc trưng: đô thị sinh thái kết hợp nhà ở / homestay gắn thương hiệu vườn trái cây truyền thống. Song song là chuỗi phố đi bộ, chợ đêm, nhà hàng và khách sạn ven sông phục vụ du lịch trong và ngoài nước ([Houze / cân bằng hiện đại – truyền thống Thuận An](https://blog.houze.vn/blog/quy-hoach-tp-thuan-an-can-bang-giua-phat-trien-hien-dai-va-gin-giu-truyen-thong)).

Đó là điểm khác biệt cảm xúc: không chỉ “gần chỗ làm”, mà còn gần không gian xanh – sông nước – trải nghiệm cuối tuần trong bán kính sống hàng ngày.

## Thị trường cao tầng Lái Thiêu đang dịch chuyển thế nào?

Nhờ hạ tầng đổi nhanh, quỹ đất trống dọc QL13 và ven rạch Cầu Đình ưu tiên chuyển đổi thành khu đô thị cao tầng và căn hộ tầm trung đến cao cấp — hút kỹ sư, chuyên gia và gia đình trẻ làm việc tại KCN kế cận về an cư ([CafeF / căn hộ dọc QL13](https://cafef.vn/hang-chuc-du-an-can-ho-dua-nhau-moc-len-doc-doan-quoc-lo-188260615182537089.chn)).

Trong bức tranh đó, tổ hợp đô thị tích hợp như [Hồ Gươm Xanh](${HGX_HREF}) (TBS Land, ~26,4 ha tại 136 Đại lộ Bình Dương) minh họa mô hình “sống trong đô thị đồng bộ” — có cả phân khu nhà ở xã hội và sản phẩm thương mại. Chi tiết hành lang metro trước cửa: [Hồ Gươm Xanh — Metro số 2 QL13 & TOD](/wiki-nha-o-xa-hoi/ho-guom-xanh-metro-so-2-ql13-tod-2026).

${EDITORIAL_FIGURES.hgxPhoiCanh}

${LAI_THIEU_PR_CLOSINGS.quyHoach}

Bài liên quan: [5 khu TOD metro số 2 Bến Thành – Tham Lương](/tin-tuc/tp-hcm-5-khu-tod-metro-so-2-ben-thanh-tham-luong) · [TOD — chiến lược đô thị Việt Nam](/tin-tuc/tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045)

*Quy mô dân số, lộ giới và tiến độ metro / đường ven sông có thể thay đổi theo phê duyệt và công bố của cơ quan nhà nước.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T11:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Quy hoạch Lái Thiêu 2040 — phường trung tâm, Metro QL13, ven sông | HouseX",
    seoDesc:
      "Lái Thiêu sau sáp nhập ~15,46 km², hơn 118.000 dân; QL13 8 làn, Metro dọc Đại lộ Bình Dương, đường ven sông và đô thị vườn trái cây — cửa ngõ Bình Dương–TP.HCM.",
    tags: [NOXH_TAG_HA_TANG],
    projects: [{ slug: HGX_PROJECT_SLUG, name: HGX_PROJECT_NAME }],
  },
  {
    id: "article-lai-thieu-02",
    slug: "can-ho-lai-thieu-quoc-lo-13-du-an-noi-bat-2026",
    title:
      "Căn hộ thương mại QL13 2026: Emerald 68, A&T Sky Garden và Astral City đang mở bán",
    excerpt:
      "Ba dự án căn hộ cao cấp đang thi công / mở bán trên trục Quốc lộ 13 Thuận An: Emerald 68 (42–48 tr/m²), A&T Sky Garden (31–35 tr/m²) và Astral City (48–55 tr/m²) — đón sóng QL13 và Metro.",
    body: `## Những dự án căn hộ thương mại nào đang mở bán trên Quốc lộ 13 năm 2026?

Trục Đại lộ Bình Dương (Quốc lộ 13) đoạn Thuận An – Lái Thiêu đang có cuộc đua căn hộ cao tầng. Danh mục dưới đây chỉ gồm dự án đang mở bán hoặc thi công rầm rộ trong năm 2026 — đã loại các dự án cũ đã bàn giao ([CafeF](https://cafef.vn/hang-chuc-du-an-can-ho-dua-nhau-moc-len-doc-doan-quoc-lo-188260615182537089.chn)).

Ba lực đẩy chung: lõi Lái Thiêu mở rộng sau sáp nhập, lộ giới QL13 hướng 8 làn, và Metro quy hoạch dọc Đại lộ kết nối TP.HCM. Chi tiết quy hoạch khu vực: [Quy hoạch Lái Thiêu 2040](/wiki-nha-o-xa-hoi/lai-thieu-quy-hoach-2040-phuong-trung-tam-metro-2026).

${EDITORIAL_FIGURES.hcmSkyline}

## The Emerald 68 (Ngọc Lục Bảo) — cửa ngõ gần TP.HCM nhất?

[The Emerald 68](/du-an/the-emerald-68-thuan-an) do Lê Phong Group phối hợp Coteccons (tổng thầu kiêm đồng phát triển theo công bố kênh dự án) nằm mặt tiền Quốc lộ 13, phường Vĩnh Phú, Thuận An — sát cổng chào Bình Dương, giáp TP. Thủ Đức ([theemerald-68.vn](https://theemerald-68.vn/)).

Đang đẩy tiến độ tầng cao; bàn giao tham chiếu khoảng Quý 3/2027 hoặc năm 2028. Điểm nổi bật: vị trí cửa ngõ gần TP.HCM, 3 mặt hướng sông Sài Gòn — phù hợp ở thực lẫn cho chuyên gia thuê. Giá trần tham khảo khoảng 42–48 triệu/m².

## A&T Sky Garden — giá cạnh tranh tại lõi Lái Thiêu?

[A&T Sky Garden](/du-an/at-sky-garden-lai-thieu) của A&T Group cách mặt tiền QL13 vài bước chân, ngay lõi trung tâm Lái Thiêu — sát khu đô thị Hồ Gươm Xanh. Định vị “3 mặt hướng thủy” (sông Sài Gòn, sông Lái Thiêu, hồ Hồ Gươm Xanh) kèm thiết kế xanh kiểu sinh thái.

Đang thi công phần thân cao tầng, bung tháp mới với thanh toán giãn. Bàn giao tham chiếu khoảng Quý 1/2026. Giá trần tham khảo khoảng 31–35 triệu/m² — mức cạnh tranh trong nhóm cao cấp đang mở bán trên trục.

## Astral City — phức hợp lớn gần Lotte Mart?

[Astral City](/du-an/astral-city-thuan-an) (Phát Đạt & Danh Khôi) mặt tiền QL13, phường Bình Hòa, Thuận An — gần Lotte Mart. Sau tái khởi động, dự án đang mở bán các block tháp trung tâm cao cấp còn lại.

Phức hợp thương mại – căn hộ quy mô lớn (~3,7 ha) với phố đi bộ mua sắm nội khu dài khoảng 300 m. Giá trần tham khảo khoảng 48–55 triệu/m².

${EDITORIAL_FIGURES.metroHub}

## So nhanh 3 dự án đang mở bán?

| Dự án | Vị trí | Giá tham chiếu | Bàn giao (tham chiếu) | Landing House X |
|-------|--------|----------------|------------------------|-----------------|
| Emerald 68 | Vĩnh Phú — cổng chào BD | 42–48 tr/m² | ~Q3/2027–2028 | [/du-an/the-emerald-68-thuan-an](/du-an/the-emerald-68-thuan-an) |
| A&T Sky Garden | Lõi Lái Thiêu — sát HGX | 31–35 tr/m² | ~Q1/2026 | [/du-an/at-sky-garden-lai-thieu](/du-an/at-sky-garden-lai-thieu) |
| Astral City | Bình Hòa — gần Lotte | 48–55 tr/m² | Theo từng tháp | [/du-an/astral-city-thuan-an](/du-an/astral-city-thuan-an) |

Dự án sắp mở bán (Emerald Boulevard, phân khu cao cấp Hồ Gươm Xanh): [bài cập nhật sắp mở bán](/wiki-nha-o-xa-hoi/can-ho-lai-thieu-sap-mo-ban-emerald-boulevard-hgx-2026). Phân khu nhà ở xã hội trong cùng KĐT: [${HGX_PROJECT_NAME}](${HGX_HREF}).

${LAI_THIEU_PR_CLOSINGS.duAn}

*Giá và tiến độ là tham chiếu thị trường / CĐT tại thời điểm biên tập — xác nhận trước khi đặt cọc.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T12:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/urban-skyline-golden-hour.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Căn hộ QL13 2026 — Emerald 68, A&T Sky Garden, Astral City | HouseX",
    seoDesc:
      "3 dự án căn hộ thương mại đang mở bán trên Quốc lộ 13 Thuận An: Emerald 68, A&T Sky Garden, Astral City — giá, tiến độ, landing House X.",
    tags: [NOXH_TAG_DU_AN_GIA],
    projects: [{ slug: HGX_PROJECT_SLUG, name: HGX_PROJECT_NAME }],
  },
  {
    id: "article-lai-thieu-03",
    slug: "mua-can-ho-lai-thieu-o-thuc-hay-dau-tu-cho-thue-2026",
    title:
      "Mua căn hộ Lái Thiêu: ở thực hay đầu tư cho thuê đón sóng hạ tầng?",
    excerpt:
      "Hai lộ trình trên QL13: ở thực với A&T / Emerald 68 / Astral; đầu tư thuê đón chuyên gia KCN. Checklist 3 bước trước khi xuống tiền.",
    body: `## Ở thực và đầu tư cho thuê tại Lái Thiêu khác nhau chỗ nào?

Cùng một trục Quốc lộ 13, tiêu chí chọn căn đổi hoàn toàn theo mục đích. Ở thực ưu tiên tiến độ nhận nhà, uy tín chủ đầu tư, không gian gia đình và bán kính trường học / siêu thị. Đầu tư cho thuê ưu tiên hấp thụ thuê, nhóm khách mục tiêu (chuyên gia KCN VSIP / Việt Hương, nhân sự đi làm TP.HCM qua QL13) và tối ưu tổng vốn – nội thất – đòn bẩy.

Lái Thiêu có lợi thế hấp thụ nhờ giáp ranh TP.HCM và tiện ích đồng bộ (AEON Mall, Lotte Mart, sân golf Sông Bé).

${EDITORIAL_FIGURES.noxhEligibility}

## Nếu mua để ở thực — chọn dự án đang mở bán nào?

Nhận nhà sớm hơn trong nhóm đang bán: [A&T Sky Garden](/du-an/at-sky-garden-lai-thieu) — bàn giao tham chiếu khoảng Q1/2026, giá 31–35 triệu/m², lõi Lái Thiêu sát Hồ Gươm Xanh.

Thanh toán giãn, cửa ngõ TP.HCM: [The Emerald 68](/du-an/the-emerald-68-thuan-an) — Coteccons đồng phát triển, view sông, giá 42–48 triệu/m², bàn giao ~2027–2028.

Phức hợp tiện ích gần Lotte: [Astral City](/du-an/astral-city-thuan-an) — ~3,7 ha, phố đi bộ nội khu, giá 48–55 triệu/m².

Nếu thuộc đối tượng nhà ở xã hội, phân khu NOXH trong [Hồ Gươm Xanh](${HGX_HREF}) là hướng đối chiếu riêng: [/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat](/wiki-nha-o-xa-hoi/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat).

## Nếu đầu tư cho thuê đón sóng hạ tầng — dòng tiền tham chiếu ra sao?

Giá thuê tham chiếu căn hộ 2 phòng ngủ (~60 m²) tại Lái Thiêu: nhà trống / nội thất cơ bản khoảng 7–9 triệu/tháng; full nội thất cao cấp hướng chuyên gia khoảng 11–14 triệu/tháng. Tỷ suất từ giá thuê thường được nhắc khoảng 5,5%–6,5%/năm — chưa tính biên độ tăng giá theo tiến độ QL13 và Metro (kỳ vọng kênh thị trường, không phải cam kết).

Chiến lược nhận nhà sớm hơn để cho thuê: ưu tiên A&T Sky Garden nếu tiến độ Q1/2026 giữ được — hoặc các tháp Astral đã đủ điều kiện bàn giao từng đợt.

Chiến lược cuốn chiếu đón Metro / cửa ngõ: Emerald 68 — thanh toán theo tiến độ, vị trí chuyên gia ưa chuộng; đổi lại chờ bàn giao ~2027–2028. Nhóm sắp mở bán hạng sang (Emerald Boulevard): [bài sắp mở bán](/wiki-nha-o-xa-hoi/can-ho-lai-thieu-sap-mo-ban-emerald-boulevard-hgx-2026).

## Công thức tối ưu lợi nhuận cho nhà đầu tư thuê?

1. Ưu tiên căn diện tích nhỏ (1PN hoặc 2PN–1WC khoảng 45–55 m²): tổng giá thấp, thanh khoản cao.
2. Gói nội thất “chuẩn chuyên gia”: chênh lệch thuê có thể cao hơn vài triệu/tháng.
3. Đòn bẩy hợp lý: ân hạn gốc / hỗ trợ lãi theo chính sách dự án — cân dòng tiền trước khi ký.

## Ba bước kiểm tra trước khi xuống tiền mua ở thực?

1. Chạy xe thử từ dự án đến nơi làm việc và trường học vào khung 7–8h sáng và 17–18h trên QL13.
2. Khảo sát tiện ích bán kính ~1 km: chợ hoặc siêu thị (Lotte / AEON), hiệu thuốc, trường.
3. Ưu tiên hướng Đông, Đông Nam hoặc Nam cho cửa chính / ban công khi ở lâu dài.

${EDITORIAL_FIGURES.hgxKetNoi}

${LAI_THIEU_PR_CLOSINGS.oThucDauTu}

Đối chiếu: [3 dự án đang mở bán](/wiki-nha-o-xa-hoi/can-ho-lai-thieu-quoc-lo-13-du-an-noi-bat-2026) · [quy hoạch Lái Thiêu 2040](/wiki-nha-o-xa-hoi/lai-thieu-quy-hoach-2040-phuong-trung-tam-metro-2026)

*Giá thuê và tỷ suất là tham chiếu thị trường — không phải cam kết lợi nhuận.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T13:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/hcmc-skyline-river-day.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Căn hộ Lái Thiêu: ở thực hay cho thuê đón hạ tầng? | HouseX",
    seoDesc:
      "Ở thực với A&T Sky Garden, Emerald 68, Astral City; đầu tư cho thuê đón chuyên gia KCN trên QL13 — checklist 3 bước.",
    tags: [NOXH_TAG_CHON_NHA],
    projects: [{ slug: HGX_PROJECT_SLUG, name: HGX_PROJECT_NAME }],
  },
  {
    id: "article-lai-thieu-04",
    slug: "can-ho-lai-thieu-sap-mo-ban-emerald-boulevard-hgx-2026",
    title:
      "Căn hộ Lái Thiêu sắp mở bán: Emerald Boulevard và phân khu cao cấp Hồ Gươm Xanh",
    excerpt:
      "Hai quỹ sắp ra mắt trên trục QL13: The Emerald Boulevard (Lê Phong, view sân golf Sông Bé, ~62 tr/m²) và phân khu căn hộ thương mại cao cấp Hồ Gươm Xanh (TBS Land) quanh hồ ~7 ha.",
    body: `## Dự án căn hộ nào sắp mở bán trên hành lang Lái Thiêu – QL13?

Ngoài nhóm đang thi công / mở bán (Emerald 68, A&T Sky Garden, Astral City), thị trường đang theo dõi hai quỹ sắp công bố hoặc nhận đặt chỗ: The Emerald Boulevard (Lê Phong) và phân khu căn hộ thương mại cao cấp trong KĐT Hồ Gươm Xanh (TBS Land).

Đối chiếu nhóm đang bán: [căn hộ QL13 đang mở bán 2026](/wiki-nha-o-xa-hoi/can-ho-lai-thieu-quoc-lo-13-du-an-noi-bat-2026).

${EDITORIAL_FIGURES.metroHub}

## The Emerald Boulevard (ex Emerald 2) khác Emerald 68 thế nào?

[The Emerald Boulevard](/du-an/the-emerald-boulevard-thuan-an) do Lê Phong Group phát triển trên mặt tiền Quốc lộ 13, Thuận An — đoạn đối diện sân golf Sông Bé ~104 ha. Trạng thái: đang hoàn thiện pháp lý cuối để mở bán giai đoạn 1.

Định vị hạng sang với tầm nhìn trực diện mảng xanh sân golf. Giá trần dự kiến từ khoảng 62 triệu/m² — cao hơn The Emerald 68 (đang bán tại Vĩnh Phú, 42–48 triệu/m²). Đây là hai sản phẩm khác vị trí và phân khúc trong cùng hệ Lê Phong trên trục.

## Phân khu căn hộ cao cấp Hồ Gươm Xanh chuẩn bị ra mắt ra sao?

Sau hạ tầng thấp tầng và phân khu nhà ở xã hội, TBS Land đang chuẩn bị các bước ra mắt phân khu căn hộ thương mại cao cấp bao quanh hồ nội khu rộng khoảng 7 ha trong KĐT ~26,4 ha tại 136 Đại lộ Bình Dương ([hoguom-xanh.vn](https://hoguom-xanh.vn/)).

Điểm khác biệt: sống trong đại đô thị đồng bộ lớn nhất Lái Thiêu — không gian nghỉ dưỡng khép kín. Phân khu này là sản phẩm thương mại, điều kiện và giá khác hẳn nhà ở xã hội.

Tra cứu phân khu NOXH (đối tượng Luật Nhà ở): [${HGX_PROJECT_NAME}](${HGX_HREF}) · [Metro số 2 QL13 & TOD](/wiki-nha-o-xa-hoi/ho-guom-xanh-metro-so-2-ql13-tod-2026).

${EDITORIAL_FIGURES.hgxPhoiCanh}

${EDITORIAL_FIGURES.hgxTienIch}

## Nên theo dõi quỹ nào nếu chưa cần nhận nhà ngay?

| Quỹ | Điểm mạnh | Lưu ý |
|-----|-----------|--------|
| Emerald Boulevard | View sân golf, hạng sang, cùng hệ Lê Phong | Chờ pháp lý / bảng giá chính thức |
| Cao cấp Hồ Gươm Xanh | Đô thị tích hợp, hồ ~7 ha, tiện ích nội khu | Phân biệt với NOXH; lịch ra mắt theo CĐT |

House X cập nhật lịch mở bán và bảng giá tham chiếu khi CĐT công bố — [đăng ký ngay](/lien-he).

${LAI_THIEU_PR_CLOSINGS.sapMoBan}

*Trạng thái “sắp mở bán” có thể thay đổi theo phê duyệt pháp lý và lịch CĐT.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T14:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Emerald Boulevard & HGX cao cấp — căn hộ Lái Thiêu sắp mở bán | HouseX",
    seoDesc:
      "Theo dõi The Emerald Boulevard (view sân golf Sông Bé, ~62 tr/m²) và phân khu căn hộ thương mại cao cấp Hồ Gươm Xanh quanh hồ 7 ha.",
    tags: [NOXH_TAG_DU_AN_GIA],
    projects: [{ slug: HGX_PROJECT_SLUG, name: HGX_PROJECT_NAME }],
  },
];
