import { NOXH_TAG_HA_TANG } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import {
  DTA_PR_CLOSINGS,
  TOD_CONCEPT_EDITORIAL,
} from "@/lib/content/articles/article-editorial-voice";
import {
  DTA_HAPPY_HOME_NAME,
  DTA_HAPPY_HOME_SLUG,
} from "@/lib/content/dta-happy-home-landing";

const UPDATED = new Date("2026-07-03T00:00:00.000Z");

/** Tuyến 5 bài hạ tầng — TOD — Nhơn Trạch — dẫn dắt ngầm DTA Happy Home. */
export const TOD_NHON_TRACH_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-tod-01",
    slug: "quy-hoach-tong-the-tphcm-tam-nhin-100-nam-sieu-do-thi",
    title:
      "Quy hoạch tổng thể TP.HCM tầm nhìn 100 năm: Siêu đô thị 22 triệu dân và hành lang giao thông đa phương thức",
    excerpt:
      "UBND TP.HCM phê duyệt đề cương 2025–2050, GRDP ~1.200 tỷ USD. Hạ tầng metro, đường sắt và kết nối vùng ven là trục tổ chức không gian mới.",
    body: `## TP.HCM chốt đề cương quy hoạch tổng thể — tầm nhìn 100 năm

UBND TP.HCM vừa phê duyệt Đề cương Quy hoạch tổng thể thời kỳ 2025–2050, tầm nhìn 100 năm — tham khảo [Thư viện Pháp luật](https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/chi-dao-dieu-hanh/1177/phe-duyet-de-cuong-quy-hoach-tong-the-tp-ho-chi-minh-thoi-ky-2021-2050-tam-nhin-100-nam), [Tuổi Trẻ](https://tuoitre.vn/tp-hcm-duyet-de-cuong-quy-hach-tong-the-voi-du-bao-tang-truong-2-con-so-trong-25-nam-20260515163627718.htm) và [Thanh Niên](https://thanhnien.vn/tphcm-quy-hoach-sieu-do-thi-22-trieu-dan-vao-nam-2050-185260515172649304.htm).

Mục tiêu đến 2050: dân số khoảng 20–22 triệu người, GRDP ~1.200 tỷ USD, TP.HCM hướng tới nhóm 100 thành phố có chất lượng sống tốt nhất thế giới — theo mô hình siêu đô thị đa trung tâm, không còn phụ thuộc một lõi nội đô duy nhất.

${EDITORIAL_FIGURES.hcmSkyline}

## Hạ tầng giao thông — nền tảng tái cấu trúc không gian

Điểm đáng chú ý trong đề cương: phát triển mạng lưới giao thông đa phương thức — liên thông đường bộ, đường sắt, cảng biển và hàng không. Các hành lang chiến lược được nhắc tới gồm kết nối Tân Sơn Nhất – Long Thành, tuyến TP.HCM – Cần Thơ, TP.HCM – Lộc Ninh — [CafeLand](https://cafeland.vn/tin-tuc/quy-hoach-tong-the-tphcm-muc-tieu-22-trieu-dan-quy-mo-kinh-te-1200-ty-usd-151566.html) ghi nhận mô hình TOD (Transit-Oriented Development) gắn các hành lang này.

Khi siêu đô thị mở rộng theo trục giao thông, vùng ven có hạ tầng hoàn thiện sớm — Nhơn Trạch, Long Thành — không còn bị xem là “xa xôi” mà trở thành đô thị vệ tinh hứng dòng cư dân và lao động giãn từ nội thành.

## Vùng ven và nhà ở xã hội

${DTA_PR_CLOSINGS.quyHoachVen}

Bài liên quan: [TOD — chiến lược phát triển đô thị Việt Nam](/tin-tuc/tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045) · [Metro Thủ Thiêm – Long Thành](/tin-tuc/metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026)

*HouseX tổng hợp từ nguồn báo chí và văn bản quy hoạch — không phải công bố chính thức của cơ quan nhà nước.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-03T00:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl:
      "/images/projects/dta-happy-home/hero.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Quy hoạch TP.HCM 100 năm — siêu đô thị 22 triệu dân & hạ tầng | HouseX",
    seoDesc:
      "Tổng hợp đề cương quy hoạch TP.HCM 2025–2050: GRDP 1.200 tỷ USD, giao thông đa phương thức, TOD và đô thị vệ tinh.",
    tags: [NOXH_TAG_HA_TANG],
    projects: [{ slug: DTA_HAPPY_HOME_SLUG, name: DTA_HAPPY_HOME_NAME }],
  },
  {
    id: "article-tod-02",
    slug: "tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045",
    title:
      "TOD là “xương sống” chiến lược phát triển đô thị Việt Nam giai đoạn 2025–2045",
    excerpt:
      "Luật Đường sắt 2025 hiệu lực 1/1/2026 luật hóa TOD. TP.HCM thí điểm quanh metro — mô hình định hướng giao thông công cộng thay đổi cách chọn nơi ở.",
    body: `## TOD là gì — và vì sao Việt Nam “chín muồi” hơn trước?

TOD (Transit-Oriented Development — phát triển đô thị định hướng giao thông công cộng) lấy nhà ga hoặc điểm kết nối giao thông làm trung tâm, tập trung dân cư, thương mại và dịch vụ trong vùng phụ cận đi bộ, giảm phụ thuộc xe cá nhân.

${TOD_CONCEPT_EDITORIAL}

Theo [Ashui.com](https://ashui.com/phat-trien-do-thi-tod-viet-nam-da-chin-muoi-chua/), TS Nguyễn Văn Đính (Phó chủ tịch Hiệp hội Bất động sản Việt Nam) nhận định TOD sẽ là xương sống chiến lược phát triển đô thị mới của Việt Nam giai đoạn 2025–2045, giải quyết ùn tắc và mở rộng không gian đô thị bền vững.

${EDITORIAL_FIGURES.metroHub}

## Luật Đường sắt 2025 — bước ngoặt pháp lý

Từ 01/01/2026, [Luật Đường sắt 2025](https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/chinh-sach-moi/88784/phat-trien-do-thi-theo-mo-hinh-tod-doi-voi-duong-sat-tu-01-01-2026) luật hóa phát triển đô thị theo mô hình TOD: UBND cấp tỉnh có thẩm quyền lập quy hoạch khu vực TOD quanh ga đường sắt, điều chỉnh chỉ tiêu kinh tế — kỹ thuật để thu hút đầu tư.

[Báo Xây dựng](https://baoxaydung.vn/tai-cau-truc-do-thi-bang-chia-khoa-tod-192260408083045583.htm) gọi TOD là “chìa khóa” tái cấu trúc đô thị — chuyển từ cấu trúc phân tán, phụ thuộc xe máy sang đô thị nén, thông minh hơn.

## TP.HCM đi đầu — từ metro nội thành tới tuyến liên vùng

[Vietnam Mới](https://vietnammoi.vn/tim-chia-khoa-vao-mo-vang-tod-202621394312163.htm) nêu TP.HCM đã ban hành kế hoạch TOD dọc metro Bến Thành – Tham Lương, đồng thời các tuyến đường sắt liên vùng (Thủ Thiêm – Long Thành…) tạo thêm hành lang ga ở vùng ven.

Với công nhân và người trẻ, TOD đúng nghĩa là sống trong bán kính đi bộ quanh ga (thường tối đa ~1–1,5 km) — đi làm bằng tuyến công cộng mà không cần xe cá nhân. Khu vực Nhơn Trạch với 7 ga quy hoạch trên tuyến Thủ Thiêm – Long Thành ([Tiền Phong](https://tienphong.vn/vi-tri-12-nha-ga-cua-tuyen-duong-sat-thu-thiem-long-thanh-tren-dia-ban-tinh-dong-nai-post1684699.tpo)) là ví dụ đô thị vệ tinh nằm trên hành lang ga quốc gia — hưởng lợi giao thông công cộng nhưng không phải lõi TOD quanh từng ga.

${DTA_PR_CLOSINGS.todAnCu}

Bài liên quan: [5 khu TOD metro số 2 TP.HCM](/tin-tuc/tp-hcm-5-khu-tod-metro-so-2-ben-thanh-tham-luong) · [Nhơn Trạch — cực tăng trưởng mới](/tin-tuc/nhon-trach-cu-tang-truong-ha-tang-tod-2026)

*Thông tin ga và quy hoạch TOD có thể điều chỉnh khi phê duyệt chi tiết — người đọc nên theo dõi văn bản chính thức.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-02T12:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.jpg",
    authorName: "Ban biên tập House X",
    seoTitle: "TOD xương sống phát triển đô thị Việt Nam 2025–2045 | HouseX",
    seoDesc:
      "Phân tích TOD (bán kính đi bộ ~1–1,5 km), Luật Đường sắt 2025 và phân biệt đô thị vệ tinh hưởng lợi giao thông công cộng.",
    tags: [NOXH_TAG_HA_TANG],
    projects: [{ slug: DTA_HAPPY_HOME_SLUG, name: DTA_HAPPY_HOME_NAME }],
  },
  {
    id: "article-tod-03",
    slug: "tp-hcm-5-khu-tod-metro-so-2-ben-thanh-tham-luong",
    title:
      "TP.HCM duyệt 5 khu TOD dọc metro số 2 — gần 940 ha quanh ga Bến Thành, Tham Lương",
    excerpt:
      "UBND TP.HCM phê duyệt ranh 5 khu vực TOD trên tuyến metro Bến Thành – Tham Lương. Thí điểm nội thành vs cơ hội vùng ven gần ga đường sắt liên vùng.",
    body: `## 5 khu TOD — thí điểm lớn nhất TP.HCM trên metro số 2

UBND TP.HCM vừa phê duyệt ranh giới lập quy hoạch 5 khu vực TOD dọc tuyến metro số 2 (Bến Thành – Tham Lương), tổng diện tích gần 940 ha — theo [Vietnam.vn](https://www.vietnam.vn/tp-hcm-duyet-ranh-quy-hoach-do-thi-tod-5-khu-vuc-doc-metro-so-2) và [Vietnam Mới](https://vietnammoi.vn/tim-chia-khoa-vao-mo-vang-tod-202621394312163.htm).

Các khu vực ưu tiên gồm Depot Tham Lương (~293 ha), ga Phạm Văn Bạch, ga Tân Bình, ga Bảy Hiền và ga Bến Thành — tập trung tái phân bổ không gian quanh ga metro đang khởi công (tuyến dài hơn 11 km, dự kiến hoàn thành 2030).

${EDITORIAL_FIGURES.bitexcoMetro}

## TOD nội thành: giá trị cao, cạnh tranh gay gắt

5 khu TOD metro số 2 hưởng lợi trực tiếp từ ga metro đã có lộ trình thi công — phù hợp nhà đầu tư và người mua có ngân sách lớn. Tuy nhiên, giá đất – giá nhà nội thành và áp lực hồ sơ (như các dự án NOXH trung tâm) khiến nhiều người lao động khó tiếp cận.

## Đô thị vệ tinh trên hành lang ga — khác TOD đúng nghĩa

Song song metro số 2, TP.HCM — Đồng Nai đang thúc tiến đường sắt Thủ Thiêm – Long Thành với hàng chục ga trên địa bàn Nhơn Trạch ([Báo Đồng Nai](https://baodongnai.com.vn/tin-moi/202410/12-nha-ga-duong-sat-thu-thiem-long-thanh-qua-dong-nai-duoc-de-xuat-xay-dung-o-nhung-vi-tri-nao-125513a/)). Lõi TOD sẽ tập trung quanh từng ga (bán kính đi bộ ~1–1,5 km); các khu cách ga 3–5 km — như nhiều dự án NOXH tại DTA City — thuộc nhóm đô thị vệ tinh hưởng lợi giao thông công cộng, không phải TOD đúng nghĩa.

Nhiều người lao động đặt câu hỏi: lõi TOD nội thành hay đô thị vệ tinh vùng ven — lựa chọn nào phù hợp thu nhập thực tế?

${DTA_PR_CLOSINGS.todNoiThanhVsVen}

Bài liên quan: [Quy hoạch 100 năm TP.HCM](/tin-tuc/quy-hoach-tong-the-tphcm-tam-nhin-100-nam-sieu-do-thi) · [Metro 175.000 tỷ Thủ Thiêm – Long Thành](/tin-tuc/metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026)

*Ranh quy hoạch TOD có thể điều chỉnh ở giai đoạn quy hoạch chi tiết 1/500 — theo Vietnam.vn.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-02T06:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-01-civic-center.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "5 khu TOD metro số 2 TP.HCM — 940 ha Bến Thành Tham Lương | HouseX",
    seoDesc:
      "TP.HCM duyệt 5 khu TOD dọc metro số 2. Phân biệt lõi TOD nội thành vs đô thị vệ tinh Nhơn Trạch trên tuyến Thủ Thiêm – Long Thành.",
    tags: [NOXH_TAG_HA_TANG],
    projects: [{ slug: DTA_HAPPY_HOME_SLUG, name: DTA_HAPPY_HOME_NAME }],
  },
  {
    id: "article-tod-04",
    slug: "metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026",
    title:
      "Tuyến metro Thủ Thiêm – Long Thành ~175.000 tỷ đồng: 19 ga, dự kiến khởi công quý III/2026",
    excerpt:
      "Dân trí và Tuổi Trẻ: tuyến dài ~47,7 km nối Thủ Thiêm với sân bay Long Thành. 7 ga quy hoạch tại Nhơn Trạch — hành lang đô thị vệ tinh hưởng lợi giao thông công cộng.",
    body: `## Dự án hạ tầng “tỷ đô” kết nối hai sân bay và trung tâm TP.HCM

Tuyến đường sắt đô thị Thủ Thiêm – Long Thành có tổng mức đầu tư dự kiến ~175.714 tỷ đồng (gồm GPMB và lãi vay) — [Dân trí](https://dantri.com.vn/thoi-su/du-chi-hon-175000-ty-dong-lam-metro-thu-thiem-long-thanh-20260620175929563.htm), [Vietnam Mới](https://vietnammoi.vn/ke-hoach-lam-duong-sat-thu-thiem-long-thanh-hon-175000-ty-cua-dai-quang-minh-2026711070130.htm).

Theo [Vietnam.vn](https://www.vietnam.vn/tp-ho-chi-minh-chuan-bi-cac-dieu-kien-de-khoi-cong-tuyen-duong-sat-thu-thiem-long-thanh) và [Tuổi Trẻ](https://b2.tuoitre.vn/tuyen-duong-sat-thu-thiem-long-thanh-co-khoang-19-ga-khoi-cong-truoc-dip-2-7-20260514182522021.htm):

- Chiều dài khoảng 47,7 km (TP.HCM ~11,5 km; Đồng Nai ~36,2 km)
- Dự kiến ~19 ga (2 ga ngầm, 17 ga trên cao)
- Mục tiêu khởi công trước 2/7/2026 (kỷ niệm 50 năm TP mang tên Bác); nhiều nguồn cập nhật quý III/2026
- Vận hành thương mại dự kiến 2030

${EDITORIAL_FIGURES.thuThiem}

CĐT chuẩn bị dự án: Công ty CP Đầu tư Địa ốc Đại Quang Minh — [Báo Xây dựng](https://baoxaydung.vn/du-kien-khoi-cong-tuyen-duong-sat-thu-thiem-long-thanh-truoc-2-7-192260605171801623.htm) mô tả tuyến bám Vành đai 3, vượt sông Đồng Nai gần cầu Nhơn Trạch rồi hướng sân bay Long Thành.

## Ga tại Nhơn Trạch — lõi TOD quanh ga vs đô thị vệ tinh xung quanh

[Báo Đồng Nai](https://baodongnai.com.vn/tin-moi/202410/12-nha-ga-duong-sat-thu-thiem-long-thanh-qua-dong-nai-duoc-de-xuat-xay-dung-o-nhung-vi-tri-nao-125513a/) liệt kê 7 ga trên cao tại Nhơn Trạch, gồm ga S12 – Nhơn Trạch (xã Phú Hội), ga S13 – Phú Hội, ga S15 – Hiệp Phước… Mỗi ga là trung tâm phát triển TOD đúng nghĩa trong bán kính đi bộ ~1–1,5 km.

[CafeLand](https://cafeland.vn/tin-tuc/ba-tuyen-duong-sat-ket-noi-san-bay-long-thanh-nha-ga-se-duoc-dat-o-dau-152640.html) ghi nhận giai đoạn 1 có thể triển khai trước 14 ga, trong đó có Nhơn Trạch, Phú Thạnh, Long Tân — tức hạ tầng “chạm” tới vùng KCN và đô thị mới.

## Vị trí DTA City — đô thị vệ tinh, không phải lõi TOD

DTA Happy Home nằm tại DTA City, xã Phước An, Nhơn Trạch — thuộc vùng được quy hoạch gắn tuyến đường sắt và trục 25B/25C nối sân bay ([UBND Nhơn Trạch](https://nhontrach.dongnai.gov.vn/vi/news/hoat-dong-chinh-quyen-nha-nuoc/nhon-trach-but-pha-ha-tang-giao-thong-tao-dot-pha-phat-trien-do-thi-cong-nghiep-ve-tinh-san-bay-431.html)).

Theo phương án tư vấn FEED, các ga S12/S13 nằm tại Phú Hội — liền kề xã Phước An trên bản đồ hành chính, nhưng DTA City cách vùng ga quy hoạch khoảng 3–5 km (đường thẳng, tham khảo bản đồ). Khoảng cách này vượt bán kính TOD đúng nghĩa; dự án thuộc nhóm đô thị vệ tinh hưởng lợi giao thông công cộng.

${DTA_PR_CLOSINGS.gaQuyHoach}

Bài liên quan: [Nhơn Trạch bứt phá hạ tầng](/tin-tuc/nhon-trach-cu-tang-truong-ha-tang-tod-2026) · [TOD — chiến lược đô thị Việt Nam](/tin-tuc/tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045)

*Vị trí ga và tiến độ có thể thay đổi theo báo cáo nghiên cứu khả thi được phê duyệt.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-01T18:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-thu-thiem-civic-center-night.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Metro Thủ Thiêm Long Thành 175.000 tỷ — khởi công 2026 | HouseX",
    seoDesc:
      "Tổng hợp tuyến đường sắt Thủ Thiêm – Long Thành: 47,7 km, 19 ga, 7 ga Nhơn Trạch. Phân biệt lõi TOD quanh ga vs DTA Happy Home (đô thị vệ tinh ~3–5 km).",
    tags: [NOXH_TAG_HA_TANG],
    projects: [{ slug: DTA_HAPPY_HOME_SLUG, name: DTA_HAPPY_HOME_NAME }],
  },
  {
    id: "article-tod-05",
    slug: "nhon-trach-cu-tang-truong-ha-tang-tod-2026",
    title:
      "Nhơn Trạch hướng tới cực tăng trưởng mới: Hạ tầng 25B, Vành đai 3 và đô thị vệ tinh hưởng lợi giao thông công cộng",
    excerpt:
      "Tuổi Trẻ & UBND Nhơn Trạch: cầu Nhơn Trạch thông xe, 25B 10 làn sắp khai thác, ga đường sắt quy hoạch. NOXH DTA Happy Home — an cư gần KCN, hưởng lợi hành lang ga (không phải lõi TOD).",
    body: `## Nhơn Trạch “đổi vai”: từ KCN thuần túy sang đô thị vệ tinh sân bay

[Tuổi Trẻ](https://tuoitre.vn/san-bay-cau-va-mot-chu-ky-moi-nhon-trach-doi-vai-20260409185353036.htm) mô tả Nhơn Trạch đang bước vào chu kỳ mới: Sân bay Long Thành khai thác thương mại dự kiến quý IV/2026, cầu Nhơn Trạch (Vành đai 3) đã khai thác, cầu Cát Lái khởi công, đường 25B (Tôn Đức Thắng) đẩy nhanh tiến độ.

[UBND Nhơn Trạch](https://nhontrach.dongnai.gov.vn/vi/news/hoat-dong-chinh-quyen-nha-nuoc/nhon-trach-but-pha-ha-tang-giao-thong-tao-dot-pha-phat-trien-do-thi-cong-nghiep-ve-tinh-san-bay-431.html) nhấn mạnh 25B và 25C tạo hệ giao thông đồng bộ nối Sân bay Long Thành – Quốc lộ 51 – Vành đai 3 – TP.HCM, giảm tải cao tốc HCM – Long Thành – Dầu Giày.

[Lao Động](https://laodong.vn/xa-hoi/dien-mao-tuyen-duong-10-lan-xe-o-dong-nai-noi-tphcm-sap-thong-xe-1683724.ldo) ghi nhận 25B lộ giới rộng, 10 làn xe, mục tiêu thông xe 06/2026 — “xương sống” nối trung tâm Nhơn Trạch thẳng tới sân bay.

${EDITORIAL_FIGURES.nhonTrachInfra}

${EDITORIAL_FIGURES.dtaMap}

## Hành lang ga tại Nhơn Trạch — không chỉ là đường bộ

Khi đường sắt Thủ Thiêm – Long Thành ([Dân trí](https://dantri.com.vn/thoi-su/du-chi-hon-175000-ty-dong-lam-metro-thu-thiem-long-thanh-20260620175929563.htm)) vận hành, Nhơn Trạch có thêm lớp giao thông đa phương thức: đường bộ + đường sắt nhanh. Lõi TOD sẽ hình thành quanh từng ga (bán kính đi bộ ~1–1,5 km); các khu cách xa hơn — như DTA City — thuộc đô thị vệ tinh hưởng lợi giao thông công cộng.

Theo phương án ga quy hoạch ([Tiền Phong](https://tienphong.vn/vi-tri-12-nha-ga-cua-tuyen-duong-sat-thu-thiem-long-thanh-tren-dia-ban-tinh-dong-nai-post1684699.tpo)), ga S12 Nhơn Trạch / ga S13 Phú Hội nằm tại xã Phú Hội — liền kề xã Phước An trên bản đồ hành chính, nơi đặt Khu đô thị DTA City, nhưng cách ga dự kiến khoảng 3–5 km.

## DTA Happy Home — NOXH trong tam giác hạ tầng

DTA Happy Home Nhơn Trạch là dự án nhà ở xã hội trong DTA City: giá CĐT 448–700 triệu/căn (32–52 m²), quy mô 2.192 căn, phục vụ công nhân KCN Nhơn Trạch. Kết nối hiện tại: cao tốc Biên Hòa – Vũng Tàu khoảng 10 phút; trục 25C hướng Long Thành khoảng 20 phút (theo thông tin CĐT).

${DTA_PR_CLOSINGS.nhonTrachTod}

Tra cứu suất Block A10: [/tin-dang/DTA-HH-A10511](/tin-dang/DTA-HH-A10511) · [Tính khoản vay](/tinh-tra-gop)

*HouseX tổng hợp — số liệu ga, tiến độ thi công và giá căn có thể thay đổi theo công bố chính thức.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-01T12:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl:
      "/images/projects/dta-happy-home/thanh-toan-2.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Nhơn Trạch cực tăng trưởng — hạ tầng ga & DTA Happy Home | HouseX",
    seoDesc:
      "Phân tích Nhơn Trạch: 25B, Vành đai 3, ga đường sắt quy hoạch. DTA Happy Home — đô thị vệ tinh hưởng lợi giao thông công cộng (~3–5 km tới ga).",
    tags: [NOXH_TAG_HA_TANG],
    projects: [{ slug: DTA_HAPPY_HOME_SLUG, name: DTA_HAPPY_HOME_NAME }],
  },
];
