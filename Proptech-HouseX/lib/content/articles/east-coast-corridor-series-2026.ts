import { NOXH_TAG_EAST_COAST } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { DTA_PR_CLOSINGS } from "@/lib/content/articles/article-editorial-voice";
import {
  DTA_HAPPY_HOME_NAME,
  DTA_HAPPY_HOME_SLUG,
} from "@/lib/content/dta-happy-home-landing";

const UPDATED = new Date("2026-07-27T00:00:00.000Z");

/**
 * Trục kinh tế biển phía Đông — phễu Vĩ mô + Thực tế (DTA Happy Home).
 * Tiềm năng đã publish: nhon-trach-cu-tang-truong-ha-tang-tod-2026.
 */
export const EAST_COAST_CORRIDOR_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-east-coast-01",
    slug: "hanh-lang-kinh-te-bien-phia-dong-tphcm-cai-mep-2026",
    title:
      "Hành lang kinh tế biển phía Đông: Bệ phóng logistics TP.HCM – Nhơn Trạch – Long Thành – Cái Mép",
    excerpt:
      "Chuỗi cảng – cao tốc – đô thị vệ tinh từ TP.HCM qua Nhơn Trạch, Long Thành tới Cái Mép – Thị Vải. Cao tốc Biên Hòa – Vũng Tàu ~54 km thông xe tạm toàn tuyến từ 18/5/2026; vốn >21.500 tỷ — khác hành lang sân bay (ID Town) và trục QL13.",
    body: `## Hành lang kinh tế biển phía Đông là gì — khác sân bay và QL13 thế nào?

Hành lang kinh tế biển phía Đông là chuỗi logistics và đô thị vệ tinh nối TP.HCM với Nhơn Trạch – Long Thành rồi xuống cụm cảng nước sâu Cái Mép – Thị Vải (hướng Bà Rịa – Vũng Tàu). Động lực chính là hàng hóa, KCN và cao tốc ven biển — không phải “thành phố sân bay” thuần túy quanh Long Thành, cũng không phải cửa ngõ tài chính – metro Quốc lộ 13 (Lái Thiêu / Thuận An).

Bản đồ 6 trục để chọn đúng hành lang trước khi xem dự án: [Sáu trục tăng trưởng đô thị TP.HCM](/wiki-nha-o-xa-hoi/bon-cuc-tang-truong-do-thi-tp-hcm-2026).

${EDITORIAL_FIGURES.hcmSkyline}

## Cao tốc Biên Hòa – Vũng Tàu đã thông xe toàn tuyến chưa?

Từ 17 giờ ngày 18/5/2026, cao tốc Biên Hòa – Vũng Tàu được tổ chức khai thác tạm toàn tuyến chính dài khoảng 54 km — [Thanh Niên](https://thanhnien.vn/thong-xe-toan-tuyen-cao-toc-bien-hoa-vung-tau-185260518153741601.htm), [VOV](https://vov.vn/xa-hoi/54km-cao-toc-bien-hoa-vung-tau-chinh-thuc-van-hanh-dong-bo-post1292950.vov). Đây là phương án khai thác tạm trong lúc hoàn thiện hạng mục phụ trợ; giai đoạn đầu chủ yếu cho ô tô dưới 9 chỗ, tốc độ tối đa khoảng 80 km/h theo thông báo địa phương.

Tác động thực tế được báo chí nhấn mạnh: rút ngắn Biên Hòa – Bà Rịa, giảm tải Quốc lộ 51 và tạo thêm lớp kết nối vùng cảng – KCN phía Đông. Tổng mức đầu tư chủ trương đã điều chỉnh lên khoảng 21.551 tỷ đồng ([Tuổi Trẻ](https://b2.tuoitre.vn/trinh-quoc-hoi-tang-von-dau-tu-cao-toc-bien-hoa-vung-tau-len-21-551-ti-dong-20250515093105651.htm), [Nhân Dân](https://nhandan.vn/ocop/tang-them-hon-3700-ty-dong-dau-tu-cho-duong-cao-toc-bien-hoa-vung-tau-post962937.html)).

${EDITORIAL_FIGURES.nhonTrachInfra}

## Chuỗi TP.HCM – Nhơn Trạch – Long Thành – Cái Mép vận hành ra sao?

Ba lớp hạ tầng cần đọc cùng lúc:

| Lớp | Vai trò trên hành lang biển Đông |
|-----|-----------------------------------|
| Cảng Cái Mép – Thị Vải | Cửa ngõ container nước sâu; nút giao cao tốc hướng cảng giảm tải QL51 |
| Cao tốc Biên Hòa – Vũng Tàu + Bến Lức – Long Thành | Xương sống đường bộ liên vùng Đông Nam Bộ |
| Đô thị vệ tinh / KCN Nhơn Trạch – Long Thành | Nhà ở + lao động phục vụ logistics và sản xuất |

Nhơn Trạch đang “đổi vai” từ KCN thuần túy sang đô thị vệ tinh gắn cầu Vành đai 3, trục 25B/25C và hành lang ga đường sắt — chi tiết: [Nhơn Trạch cực tăng trưởng hạ tầng](/tin-tuc/nhon-trach-cu-tang-truong-ha-tang-tod-2026).

## Vì sao không gộp với hành lang sân bay (ID Town) hay QL13?

- Hành lang sân bay Long Thành – Tân Sơn Nhất lấy liên cảng hàng không và đường sắt Thủ Thiêm – Long Thành làm trục; neo House X là [ID Town Long Thành](/tin-tuc/id-town-long-thanh-ha-tang-san-bay-metro-2026).
- Trục QL13 Đông Bắc lấy mở rộng quốc lộ, Metro số 2 và nhu cầu thuê chuyên gia VSIP / Lái Thiêu.
- Biển phía Đông lấy logistics cảng – cao tốc – KCN; NOXH vệ tinh gần KCN (như DTA) thuộc logic này, không phải “đất sân bay city” hay “căn hộ QL13”.

Tuyến đường sắt liên vùng vẫn giao cắt bức tranh Đông Nam Bộ — xem [Metro Thủ Thiêm – Long Thành ~175.000 tỷ](/tin-tuc/metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026) — nhưng vị trí dự án trên hành lang biển Đông vẫn phải đọc qua khoảng cách tới KCN / cao tốc / cảng, không chỉ khoảng cách tới nhà ga.

${EDITORIAL_FIGURES.metroViaduct}

${DTA_PR_CLOSINGS.quyHoachVen}

House X tư vấn hồ sơ nhà ở xã hội miễn phí — [đăng ký ngay](/lien-he).

*Tiến độ khai thác tạm, nút giao và hạng mục phụ trợ có thể điều chỉnh theo công bố chủ đầu tư / địa phương.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T09:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/projects/dta-happy-home/hero.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Hành lang kinh tế biển phía Đông TP.HCM – Cái Mép 2026 | HouseX",
    seoDesc:
      "Logistics TP.HCM – Nhơn Trạch – Long Thành – Cái Mép; cao tốc Biên Hòa – Vũng Tàu ~54 km thông xe tạm 18/5/2026, vốn ~21.551 tỷ. Khác hành lang sân bay và QL13.",
    tags: [NOXH_TAG_EAST_COAST],
    projects: [{ slug: DTA_HAPPY_HOME_SLUG, name: DTA_HAPPY_HOME_NAME }],
  },
  {
    id: "article-east-coast-02",
    slug: "bds-do-thi-bien-phia-dong-cua-ngo-dau-tu-dai-han-2026",
    title:
      "BĐS đô thị biển phía Đông: DTA Happy Home — NOXH vệ tinh cửa ngõ dài hạn",
    excerpt:
      "Logic đầu tư dài hạn trên hành lang KCN – logistics biển Đông: DTA Happy Home (448–700 triệu/căn) cách vùng ga quy hoạch ~3–5 km — đô thị vệ tinh, không phải lõi TOD. Checklist pháp lý và CTA tư vấn hồ sơ.",
    body: `## Đầu tư dài hạn trên hành lang biển Đông nên nhìn gì trước?

Trên hành lang kinh tế biển phía Đông, dòng tiền dài hạn gắn lao động KCN, logistics cảng và cao tốc — không phụ thuộc một “mốc tăng giá %” chưa có số liệu công bố độc lập. Câu hỏi thực tế hơn: có chỗ ở hợp pháp gần nơi làm việc không, kết nối đường bộ / đường sắt tương lai ra sao, và pháp lý NOXH có đủ điều kiện mua không?

Khung trục: [Sáu trục tăng trưởng đô thị TP.HCM](/wiki-nha-o-xa-hoi/bon-cuc-tang-truong-do-thi-tp-hcm-2026) · Vĩ mô hành lang: [Hành lang kinh tế biển phía Đông – Cái Mép](/tin-tuc/hanh-lang-kinh-te-bien-phia-dong-tphcm-cai-mep-2026).

${EDITORIAL_FIGURES.dtaPhoiCanh}

## DTA Happy Home là gì trong logic đô thị vệ tinh?

[DTA Happy Home](/du-an/dta-happy-home-nhon-trach) là dự án nhà ở xã hội trong DTA City (Nhơn Trạch): giá CĐT công bố khoảng 448–700 triệu/căn (diện tích khoảng 32–52 m²), phục vụ nhóm lao động gần KCN. Theo các bài hạ tầng đã xác lập trên House X, dự án cách vùng ga đường sắt quy hoạch khoảng 3–5 km — thuộc đô thị vệ tinh hưởng lợi giao thông công cộng, không phải lõi TOD đi bộ (~1–1,5 km quanh ga).

${EDITORIAL_FIGURES.dtaMatBang}

${EDITORIAL_FIGURES.dtaMap}

## Vì sao gọi là “cửa ngõ dài hạn”, không phải cược thông xe ngắn hạn?

1. Cao tốc Biên Hòa – Vũng Tàu đã khai thác tạm toàn tuyến (~54 km từ 18/5/2026) — lớp đường bộ phục vụ logistics biển Đông đã mở, dù hạng mục phụ trợ còn hoàn thiện ([VOV](https://vov.vn/kinh-te/khai-thac-tam-toan-tuyen-cao-toc-bien-hoa-vung-tau-tu-17h-ngay-185-post1292616.vov)).
2. Nhơn Trạch tiếp tục đồng bộ cầu / 25B / 25C và hành lang ga — xem [Nhơn Trạch cực tăng trưởng](/tin-tuc/nhon-trach-cu-tang-truong-ha-tang-tod-2026).
3. Đường sắt Thủ Thiêm – Long Thành là lớp trung–dài hạn — [Metro TTLT ~175.000 tỷ](/tin-tuc/metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026).

Không nên gộp với mô hình thuê / thương mại bán kính 5–10 km quanh sân bay (ID Town / iD Junction) — bài thực tế sân bay: [ID Town Long Thành hạ tầng](/tin-tuc/id-town-long-thanh-ha-tang-san-bay-metro-2026).

## Checklist trước khi đặt cọc NOXH vệ tinh?

| Hạng mục | Việc cần làm |
|----------|--------------|
| Điều kiện mua NOXH | Đối chiếu thu nhập, nhà ở, hợp đồng lao động theo khung pháp lý hiện hành |
| Giá & block đang mở | Xác nhận bảng giá CĐT / đợt mở bán (không dùng tin đồn) |
| Khoảng cách thực tế | Đo tới KCN, cao tốc, vùng ga quy hoạch trên bản đồ — không chỉ slogan “gần TOD” |
| Pháp lý & tiến độ bàn giao | Hợp đồng, giấy tờ dự án, lịch bàn giao block |

${DTA_PR_CLOSINGS.nhonTrachTod}

Cần đối chiếu hồ sơ và quỹ căn đang mở: [đăng ký tư vấn](/lien-he) · Tra cứu mẫu: [/tin-dang/DTA-HH-A10511](/tin-dang/DTA-HH-A10511) · [Tính khoản vay](/tinh-tra-gop).

*Giá căn, tiến độ block và vị trí ga quy hoạch có thể thay đổi theo công bố CĐT và phê duyệt chính thức — House X không dự báo % tăng giá.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T10:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/projects/dta-happy-home/thanh-toan-2.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "BĐS đô thị biển Đông — DTA Happy Home NOXH vệ tinh 2026 | HouseX",
    seoDesc:
      "DTA Happy Home 448–700 triệu/căn: logic đô thị vệ tinh trên hành lang logistics biển Đông, ~3–5 km tới ga quy hoạch — checklist pháp lý, CTA tư vấn.",
    tags: [NOXH_TAG_EAST_COAST],
    projects: [{ slug: DTA_HAPPY_HOME_SLUG, name: DTA_HAPPY_HOME_NAME }],
  },
];
