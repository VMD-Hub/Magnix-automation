import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
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
      "UBND TP.HCM phê duyệt đề cương 2025–2050, GRDP ~1.200 tỷ USD. Hạ tầng metro, đường sắt và kết nối vùng ven là trụ cột tổ chức không gian mới.",
    body: `## TP.HCM chốt đề cương quy hoạch tổng thể — tầm nhìn 100 năm

UBND TP.HCM vừa phê duyệt **Đề cương Quy hoạch tổng thể thời kỳ 2025–2050, tầm nhìn 100 năm** — tham khảo [Thư viện Pháp luật](https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/chi-dao-dieu-hanh/1177/phe-duyet-de-cuong-quy-hoach-tong-the-tp-ho-chi-minh-thoi-ky-2021-2050-tam-nhin-100-nam), [Tuổi Trẻ](https://tuoitre.vn/tp-hcm-duyet-de-cuong-quy-hach-tong-the-voi-du-bao-tang-truong-2-con-so-trong-25-nam-20260515163627718.htm) và [Thanh Niên](https://thanhnien.vn/tphcm-quy-hoach-sieu-do-thi-22-trieu-dan-vao-nam-2050-185260515172649304.htm).

Mục tiêu đến **2050**: dân số khoảng **20–22 triệu người**, GRDP ~**1.200 tỷ USD**, TP.HCM thuộc nhóm **100 thành phố có chất lượng sống tốt nhất thế giới** — theo định hướng siêu đô thị **đa trung tâm**, không còn phụ thuộc một lõi nội đô duy nhất.

${EDITORIAL_FIGURES.hcmSkyline}

## Hạ tầng giao thông — “nền móng” tái cấu trúc không gian

Điểm đáng chú ý trong đề cương: **phát triển mạng lưới giao thông đa phương thức** — liên thông đường bộ, đường sắt, cảng biển và hàng không. Các hành lang chiến lược được nhắc tới gồm kết nối **Tân Sơn Nhất – Long Thành**, tuyến **TP.HCM – Cần Thơ**, **TP.HCM – Lộc Ninh** — [CafeLand](https://cafeland.vn/tin-tuc/quy-hoach-tong-the-tphcm-muc-tieu-22-trieu-dan-quy-mo-kinh-te-1200-ty-usd-151566.html) ghi nhận mô hình **TOD** (Transit-Oriented Development) gắn các hành lang này.

**Góc nhìn thực tế:** khi siêu đô thị mở rộng theo trục giao thông, **vùng ven có hạ tầng hoàn thiện sớm** (Nhơn Trạch, Long Thành…) không còn là “xa xôi” mà trở thành **đô thị vệ tinh** hứng dòng cư dân và lao động giãn từ nội thành.

## Liên hệ với Nhơn Trạch và NOXH

Người lao động đang tìm **an cư giá phải chăng** nên theo dõi song song hai trục: (1) quy hoạch macro TP.HCM 100 năm; (2) dự án NOXH tại **vùng ven đã có quy hoạch giao thông rõ** — ví dụ [DTA Happy Home Nhơn Trạch](/du-an/dta-happy-home-nhon-trach) trong Khu đô thị DTA City.

Đọc tiếp: [TOD — xương sống chiến lược đô thị Việt Nam](/tin-tuc/tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045) · [Metro Thủ Thiêm – Long Thành 175.000 tỷ](/tin-tuc/metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026)

*HouseX tổng hợp từ nguồn báo chí và văn bản quy hoạch — không phải công bố chính thức của cơ quan nhà nước.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-03T00:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl:
      "https://dtanhontrach.com/wp-content/uploads/2018/01/header-bg-1.jpg.webp",
    authorName: "HouseX Biên tập",
    seoTitle:
      "Quy hoạch TP.HCM 100 năm — siêu đô thị 22 triệu dân & hạ tầng | HouseX",
    seoDesc:
      "Tổng hợp đề cương quy hoạch TP.HCM 2025–2050: GRDP 1.200 tỷ USD, giao thông đa phương thức, TOD và đô thị vệ tinh.",
    tags: [
      { slug: "goc-chuyen-gia", name: "Góc chuyên gia" },
      { slug: "ha-tang-giao-thong", name: "Hạ tầng & giao thông" },
      { slug: "do-thi-ve-tinh-tod", name: "Đô thị vệ tinh & TOD" },
    ],
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

**TOD** (Transit-Oriented Development — phát triển đô thị định hướng giao thông công cộng) lấy **nhà ga / điểm kết nối giao thông** làm trung tâm, tập trung dân cư — thương mại — dịch vụ trong vùng phụ cận, giảm phụ thuộc xe cá nhân.

Theo [Ashui.com](https://ashui.com/phat-trien-do-thi-tod-viet-nam-da-chin-muoi-chua/), TS Nguyễn Văn Đính (Phó chủ tịch Hiệp hội Bất động sản Việt Nam) nhận định **TOD sẽ là xương sống chiến lược phát triển đô thị mới của Việt Nam giai đoạn 2025–2045**, giải quyết ùn tắc và mở rộng không gian đô thị bền vững.

${EDITORIAL_FIGURES.metroHub}

## Luật Đường sắt 2025 — bước ngoặt pháp lý

Từ **01/01/2026**, [Luật Đường sắt 2025](https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/chinh-sach-moi/88784/phat-trien-do-thi-theo-mo-hinh-tod-doi-voi-duong-sat-tu-01-01-2026) luật hóa phát triển đô thị theo mô hình TOD: UBND cấp tỉnh có thẩm quyền lập **quy hoạch khu vực TOD** quanh ga đường sắt, điều chỉnh chỉ tiêu kinh tế — kỹ thuật để thu hút đầu tư.

[Báo Xây dựng](https://baoxaydung.vn/tai-cau-truc-do-thi-bang-chia-khoa-tod-192260408083045583.htm) gọi TOD là **“chìa khóa” tái cấu trúc đô thị** — chuyển từ cấu trúc phân tán, phụ thuộc xe máy sang đô thị nén, thông minh hơn.

## TP.HCM đi đầu — từ metro nội thành tới tuyến liên vùng

[Vietnam Mới](https://vietnammoi.vn/tim-chia-khoa-vao-mo-vang-tod-202621394312163.htm) nêu TP.HCM đã ban hành kế hoạch TOD dọc **metro Bến Thành – Tham Lương**, đồng thời các tuyến **đường sắt liên vùng** (Thủ Thiêm – Long Thành…) mở thêm lớp TOD **vùng ven**.

**Góc nhìn người mua nhà:** TOD không chỉ là từ khóa đầu tư. Với công nhân, người trẻ, “TOD thật” là **sống gần ga quy hoạch** — đi làm bằng tuyến công cộng thay vì chịu ùn tắc hàng giờ. Khu vực **Nhơn Trạch** với **7 ga quy hoạch** trên tuyến Thủ Thiêm – Long Thành ([Tiền Phong](https://tienphong.vn/vi-tri-12-nha-ga-cua-tuyen-duong-sat-thu-thiem-long-thanh-tren-dia-ban-tinh-dong-nai-post1684699.tpo)) là ví dụ đô thị vệ tinh đang “nằm trên bản đồ TOD”.

## An cư NOXH trong vùng TOD tương lai

[DTA Happy Home](/du-an/dta-happy-home-nhon-trach) — dự án NOXH trong **DTA City Nhơn Trạch** — nằm ở vùng được quy hoạch gắn hạ tầng đường sắt và KCN. Không phải cam kết đầu tư, nhưng là **phương án an cư** để độc giả tự đối chiếu vị trí với bản đồ ga quy hoạch.

Đọc tiếp: [5 khu TOD metro số 2 TP.HCM](/tin-tuc/tp-hcm-5-khu-tod-metro-so-2-ben-thanh-tham-luong) · [Nhơn Trạch — cực tăng trưởng mới](/tin-tuc/nhon-trach-cu-tang-truong-ha-tang-tod-2026)

*Thông tin ga và quy hoạch TOD có thể điều chỉnh khi phê duyệt chi tiết — người đọc nên theo dõi văn bản chính thức.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-02T12:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.jpg",
    authorName: "HouseX Biên tập",
    seoTitle: "TOD xương sống phát triển đô thị Việt Nam 2025–2045 | HouseX",
    seoDesc:
      "Phân tích TOD, Luật Đường sắt 2025 và chiến lược đô thị Việt Nam — góc nhìn chọn nơi an cư gần ga quy hoạch.",
    tags: [
      { slug: "goc-chuyen-gia", name: "Góc chuyên gia" },
      { slug: "do-thi-ve-tinh-tod", name: "Đô thị vệ tinh & TOD" },
      { slug: "phap-ly", name: "Pháp lý & chính sách" },
    ],
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

UBND TP.HCM vừa **phê duyệt ranh giới lập quy hoạch 5 khu vực TOD** dọc **tuyến metro số 2 (Bến Thành – Tham Lương)**, tổng diện tích gần **940 ha** — theo [Vietnam.vn](https://www.vietnam.vn/tp-hcm-duyet-ranh-quy-hoach-do-thi-tod-5-khu-vuc-doc-metro-so-2) và [Vietnam Mới](https://vietnammoi.vn/tim-chia-khoa-vao-mo-vang-tod-202621394312163.htm).

Các khu vực ưu tiên gồm **Depot Tham Lương** (~293 ha), **ga Phạm Văn Bạch**, **ga Tân Bình**, **ga Bảy Hiền** và **ga Bến Thành** — tập trung tái phân bổ không gian quanh ga metro đang khởi công (tuyến dài hơn 11 km, dự kiến hoàn thành **2030**).

${EDITORIAL_FIGURES.bitexcoMetro}

## TOD nội thành: giá trị cao, cạnh tranh gay gắt

5 khu TOD metro số 2 hưởng lợi trực tiếp từ **ga metro đã có lộ trình thi công** — phù hợp nhà đầu tư và người mua có ngân sách lớn. Tuy nhiên, **giá đất – giá nhà nội thành** và áp lực hồ sơ (như các dự án NOXH trung tâm) khiến nhiều người lao động khó tiếp cận.

## So sánh ngầm: TOD vùng ven trên tuyến liên vùng

Song song metro số 2, TP.HCM — Đồng Nai đang thúc tiến **đường sắt Thủ Thiêm – Long Thành** với **hàng chục ga** trên địa bàn Nhơn Trạch ([Báo Đồng Nai](https://baodongnai.com.vn/tin-moi/202410/12-nha-ga-duong-sat-thu-thiem-long-thanh-qua-dong-nai-duoc-de-xuat-xay-dung-o-nhung-vi-tri-nao-125513a/)). Đây là lớp TOD **thứ hai**: không nằm trong lõi Quận 1, mà ở **đô thị vệ tinh công nghiệp – sân bay**.

Người đọc đang cân nhắc NOXH có thể đặt câu hỏi: *“TOD nội thành hay TOD vùng ven — lựa chọn nào phù hợp thu nhập thực tế?”*

→ Gợi ý tra cứu: [DTA Happy Home Nhơn Trạch](/du-an/dta-happy-home-nhon-trach) (448–700 triệu/căn) trong hệ sinh thái **DTA City** — vùng Nhơn Trạch được [Tuổi Trẻ](https://tuoitre.vn/san-bay-cau-va-mot-chu-ky-moi-nhon-trach-doi-vai-20260409185353036.htm) mô tả đang “đổi vai” nhờ hạ tầng.

Đọc tiếp: [Quy hoạch 100 năm TP.HCM](/tin-tuc/quy-hoach-tong-the-tphcm-tam-nhin-100-nam-sieu-do-thi) · [Metro 175.000 tỷ Thủ Thiêm – Long Thành](/tin-tuc/metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026)

*Ranh quy hoạch TOD có thể điều chỉnh ở giai đoạn quy hoạch chi tiết 1/500 — theo Vietnam.vn.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-02T06:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-01-civic-center.jpg",
    authorName: "HouseX Biên tập",
    seoTitle:
      "5 khu TOD metro số 2 TP.HCM — 940 ha Bến Thành Tham Lương | HouseX",
    seoDesc:
      "TP.HCM duyệt 5 khu TOD dọc metro số 2. So sánh TOD nội thành vs vùng ven Nhơn Trạch trên tuyến Thủ Thiêm – Long Thành.",
    tags: [
      { slug: "ha-tang-giao-thong", name: "Hạ tầng & giao thông" },
      { slug: "do-thi-ve-tinh-tod", name: "Đô thị vệ tinh & TOD" },
      { slug: "dau-tu", name: "Kiến thức đầu tư" },
    ],
    projects: [{ slug: DTA_HAPPY_HOME_SLUG, name: DTA_HAPPY_HOME_NAME }],
  },
  {
    id: "article-tod-04",
    slug: "metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026",
    title:
      "Tuyến metro Thủ Thiêm – Long Thành ~175.000 tỷ đồng: 19 ga, dự kiến khởi công quý III/2026",
    excerpt:
      "Dân trí và Tuổi Trẻ: tuyến dài ~47,7 km nối Thủ Thiêm với sân bay Long Thành. 7 ga quy hoạch tại Nhơn Trạch — trục TOD liên vùng mới.",
    body: `## Dự án hạ tầng “tỷ đô” kết nối hai sân bay và trung tâm TP.HCM

Tuyến **đường sắt đô thị Thủ Thiêm – Long Thành** có tổng mức đầu tư dự kiến **~175.714 tỷ đồng** (gồm GPMB và lãi vay) — [Dân trí](https://dantri.com.vn/thoi-su/du-chi-hon-175000-ty-dong-lam-metro-thu-thiem-long-thanh-20260620175929563.htm), [Vietnam Mới](https://vietnammoi.vn/ke-hoach-lam-duong-sat-thu-thiem-long-thanh-hon-175000-ty-cua-dai-quang-minh-2026711070130.htm).

Theo [Vietnam.vn](https://www.vietnam.vn/tp-ho-chi-minh-chuan-bi-cac-dieu-kien-de-khoi-cong-tuyen-duong-sat-thu-thiem-long-thanh) và [Tuổi Trẻ](https://b2.tuoitre.vn/tuyen-duong-sat-thu-thiem-long-thanh-co-khoang-19-ga-khoi-cong-truoc-dip-2-7-20260514182522021.htm):

- Chiều dài khoảng **47,7 km** (TP.HCM ~11,5 km; Đồng Nai ~36,2 km)
- Dự kiến **~19 ga** (2 ga ngầm, 17 ga trên cao)
- Mục tiêu **khởi công trước 2/7/2026** (kỷ niệm 50 năm TP mang tên Bác); nhiều nguồn cập nhật **quý III/2026**
- Vận hành thương mại dự kiến **2030**

${EDITORIAL_FIGURES.thuThiem}

CĐT chuẩn bị dự án: **Công ty CP Đầu tư Địa ốc Đại Quang Minh** — [Báo Xây dựng](https://baoxaydung.vn/du-kien-khoi-cong-tuyen-duong-sat-thu-thiem-long-thanh-truoc-2-7-192260605171801623.htm) mô tả tuyến bám **Vành đai 3**, vượt sông Đồng Nai gần **cầu Nhơn Trạch** rồi hướng sân bay Long Thành.

## Ga tại Nhơn Trạch — mảnh ghép TOD vùng ven

[Báo Đồng Nai](https://baodongnai.com.vn/tin-moi/202410/12-nha-ga-duong-sat-thu-thiem-long-thanh-qua-dong-nai-duoc-de-xuat-xay-dung-o-nhung-vi-tri-nao-125513a/) liệt kê **7 ga trên cao** tại Nhơn Trạch, gồm **ga S12 – Nhơn Trạch** (xã Phú Hội), **ga S13 – Phú Hội**, **ga S15 – Hiệp Phước**…

[CafeLand](https://cafeland.vn/tin-tuc/ba-tuyen-duong-sat-ket-noi-san-bay-long-thanh-nha-ga-se-duoc-dat-o-dau-152640.html) ghi nhận giai đoạn 1 có thể triển khai trước **14 ga**, trong đó có **Nhơn Trạch, Phú Thạnh, Long Tân** — tức hạ tầng “chạm” tới vùng KCN và đô thị mới.

## Góc nhìn người mua nhà: “ngầm hiểu” vị trí DTA City

**DTA Happy Home** nằm tại **DTA City, xã Phước An, Nhơn Trạch** — thuộc vùng được quy hoạch gắn tuyến đường sắt và trục **25B/25C** nối sân bay ([UBND Nhơn Trạch](https://nhontrach.dongnai.gov.vn/vi/news/hoat-dong-chinh-quyen-nha-nuoc/nhon-trach-but-pha-ha-tang-giao-thong-tao-dot-pha-phat-trien-do-thi-cong-nghiep-ve-tinh-san-bay-431.html)).

Theo phương án tư vấn FEED, các ga **S12/S13** nằm tại **Phú Hội** — liền kề vùng **Phước An** trên bản đồ hành chính Nhơn Trạch. Khoảng cách đường bộ tới ga quy hoạch **ước tính trong bán kính khoảng 5 km**; thời gian di chuyển **có thể dưới 10 phút** khi hạ tầng nối ga hoàn thiện — *con số tham khảo quy hoạch, chưa phải cam kết vận hành*.

→ Tra cứu dự án NOXH: [/du-an/dta-happy-home-nhon-trach](/du-an/dta-happy-home-nhon-trach) · [Tính khoản vay](/cong-cu/tinh-khoan-vay)

Đọc tiếp: [Nhơn Trạch bứt phá hạ tầng](/tin-tuc/nhon-trach-cu-tang-truong-ha-tang-tod-2026) · [TOD — xương sống đô thị Việt Nam](/tin-tuc/tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045)

*Vị trí ga và tiến độ có thể thay đổi theo báo cáo nghiên cứu khả thi được phê duyệt.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-01T18:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-thu-thiem-civic-center-night.jpg",
    authorName: "HouseX Biên tập",
    seoTitle:
      "Metro Thủ Thiêm Long Thành 175.000 tỷ — khởi công 2026 | HouseX",
    seoDesc:
      "Tổng hợp tuyến đường sắt Thủ Thiêm – Long Thành: 47,7 km, 19 ga, 7 ga Nhơn Trạch. Góc nhìn TOD vùng ven & DTA Happy Home.",
    tags: [
      { slug: "ha-tang-giao-thong", name: "Hạ tầng & giao thông" },
      { slug: "tien-do-du-an", name: "Tiến độ dự án" },
      { slug: "dta-happy-home-nhon-trach", name: "DTA Happy Home" },
    ],
    projects: [{ slug: DTA_HAPPY_HOME_SLUG, name: DTA_HAPPY_HOME_NAME }],
  },
  {
    id: "article-tod-05",
    slug: "nhon-trach-cu-tang-truong-ha-tang-tod-2026",
    title:
      "Nhơn Trạch hướng tới cực tăng trưởng mới: Hạ tầng 25B, Vành đai 3 và đô thị TOD vệ tinh sân bay",
    excerpt:
      "Tuổi Trẻ & UBND Nhơn Trạch: cầu Nhơn Trạch thông xe, 25B 10 làn sắp khai thác, ga đường sắt quy hoạch. NOXH DTA Happy Home — an cư gần KCN & trục TOD tương lai.",
    body: `## Nhơn Trạch “đổi vai”: từ KCN thuần túy sang đô thị vệ tinh sân bay

[Tuổi Trẻ](https://tuoitre.vn/san-bay-cau-va-mot-chu-ky-moi-nhon-trach-doi-vai-20260409185353036.htm) mô tả Nhơn Trạch đang bước vào **chu kỳ mới**: Sân bay Long Thành khai thác thương mại dự kiến **quý IV/2026**, **cầu Nhơn Trạch** (Vành đai 3) đã khai thác, **cầu Cát Lái** khởi công, **đường 25B** (Tôn Đức Thắng) đẩy nhanh tiến độ.

[UBND Nhơn Trạch](https://nhontrach.dongnai.gov.vn/vi/news/hoat-dong-chinh-quyen-nha-nuoc/nhon-trach-but-pha-ha-tang-giao-thong-tao-dot-pha-phat-trien-do-thi-cong-nghiep-ve-tinh-san-bay-431.html) nhấn mạnh **25B và 25C** tạo hệ giao thông đồng bộ nối **Sân bay Long Thành – Quốc lộ 51 – Vành đai 3 – TP.HCM**, giảm tải cao tốc HCM – Long Thành – Dầu Giây.

[Lao Động](https://laodong.vn/xa-hoi/dien-mao-tuyen-duong-10-lan-xe-o-dong-nai-noi-tphcm-sap-thong-xe-1683724.ldo) ghi nhận **25B** lộ giới rộng, **10 làn xe**, mục tiêu thông xe **06/2026** — “xương sống” nối trung tâm Nhơn Trạch thẳng tới sân bay.

${EDITORIAL_FIGURES.nhonTrachInfra}

${EDITORIAL_FIGURES.dtaMap}

## TOD tại Nhơn Trạch — không chỉ là đường bộ

Khi **đường sắt Thủ Thiêm – Long Thành** ([Dân trí](https://dantri.com.vn/thoi-su/du-chi-hon-175000-ty-dong-lam-metro-thu-thiem-long-thanh-20260620175929563.htm)) vận hành, Nhơn Trạch có thêm lớp **giao thông đa phương thức**: đường bộ + đường sắt nhanh. Tuổi Trẻ nhận định đây là mảnh ghép **mô hình TOD** — phát triển đô thị quanh ga, thu hút dân cư và lao động KCN.

Theo phương án ga quy hoạch ([Tiền Phong](https://tienphong.vn/vi-tri-12-nha-ga-cua-tuyen-duong-sat-thu-thiem-long-thanh-tren-dia-ban-tinh-dong-nai-post1684699.tpo)), **ga S12 Nhơn Trạch / ga S13 Phú Hội** nằm tại vùng liền kề **xã Phước An** — nơi đặt **Khu đô thị DTA City**.

## DTA Happy Home — NOXH trong “tam giác” hạ tầng

**DTA Happy Home Nhơn Trạch** ([trang dự án HouseX](/du-an/dta-happy-home-nhon-trach)) là dự án **nhà ở xã hội** trong DTA City:

- **Giá CĐT:** 448–700 triệu/căn (32–52 m²)
- **Quy mô:** 2.192 căn — phục vụ công nhân KCN Nhơn Trạch
- **Kết nối hiện tại:** cao tốc Biên Hòa – Vũng Tàu ~10 phút; 25C → Long Thành ~20 phút (theo thông tin CĐT)
- **Tương lai TOD:** vùng phụ cận ga quy hoạch tuyến Thủ Thiêm – Long Thành — **bán kính ~5 km**, di chuyển tới ga **dự kiến dưới 10 phút** khi hạ tầng nối hoàn thiện (*tham khảo quy hoạch*)

Đây không phải lời khuyên đầu tư, mà là **bản đồ hạ tầng** để người lao động tự trả lời: *“Nếu làm việc tại KCN Nhơn Trạch hoặc hướng sân bay Long Thành, tôi có nên an cư tại đây trước khi TOD hình thành?”*

## Hành động tiếp theo trên HouseX

- Xem **Block A10** đang mở bán: [/tin-dang/DTA-HH-A10511](/tin-dang/DTA-HH-A10511)
- [Tính khoản vay NOXH](/cong-cu/tinh-khoan-vay) · [Tư vấn hồ sơ](/lien-he)
- Đọc lại tuyến bài: [Quy hoạch 100 năm TP.HCM](/tin-tuc/quy-hoach-tong-the-tphcm-tam-nhin-100-nam-sieu-do-thi) · [So sánh giá NOXH nội thành](/tin-tuc/so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026)

*HouseX tổng hợp — số liệu ga, tiến độ thi công và giá căn có thể thay đổi theo công bố chính thức.*`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-01T12:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl:
      "https://dtanhontrach.com/wp-content/webp-express/webp-images/themes/template/img/pt2.jpg.webp",
    authorName: "HouseX Biên tập",
    seoTitle:
      "Nhơn Trạch cực tăng trưởng — hạ tầng TOD & DTA Happy Home | HouseX",
    seoDesc:
      "Phân tích Nhơn Trạch: 25B, Vành đai 3, ga đường sắt quy hoạch. Góc nhìn NOXH DTA Happy Home trong vùng TOD vệ tinh sân bay.",
    tags: [
      { slug: "ha-tang-giao-thong", name: "Hạ tầng & giao thông" },
      { slug: "do-thi-ve-tinh-tod", name: "Đô thị vệ tinh & TOD" },
      { slug: "dta-happy-home-nhon-trach", name: "DTA Happy Home" },
      { slug: "noxh", name: "Nhà ở xã hội" },
    ],
    projects: [{ slug: DTA_HAPPY_HOME_SLUG, name: DTA_HAPPY_HOME_NAME }],
  },
];
