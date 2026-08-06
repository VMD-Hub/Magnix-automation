import type { ArticleDetail } from "@/lib/data/article-types";
import { DTA_HAPPY_HOME_IMAGES } from "@/lib/content/dta-happy-home-images";
import { ID_TOWN_IMAGES } from "@/lib/content/id-town-images";
import { PHU_THO_DMC_IMAGES } from "@/lib/content/phu-tho-dmc-images";

const HERO = {
  civic: "/images/hero/housex-hero-slide-01-civic-center.webp",
  metroHub: "/images/hero/housex-hero-slide-02-metro-hub.webp",
  thuThiemNight: "/images/hero/housex-thu-thiem-civic-center-night.webp",
  thuThiemDay: "/images/hero/housex-thu-thiem-civic-center-day.webp",
  skyline: "/images/hero/hcmc-skyline-river-day.webp",
  bitexcoMetro: "/images/hero/hcmc-bitexco-metro-day.webp",
  viaduct: "/images/hero/concept-b-metro-viaduct-day.png",
  urban: "/images/hero/urban-skyline-golden-hour.jpg",
} as const;

/** Ảnh minh họa NOXH Hồ Gươm Xanh — stock local (chưa nội bộ hóa ảnh CĐT). */
const HGX = {
  phoiCanh: HERO.urban,
  ketNoi: HERO.metroHub,
  tienIch: HERO.skyline,
} as const;

export type EditorialFigure = {
  url: string;
  alt: string;
  caption: string;
  source?: string;
};

export type EditorialCover = {
  url: string;
  alt: string;
  caption: string;
};

/** Ảnh đại diện + metadata báo chí theo slug. */
export const ARTICLE_EDITORIAL_COVERS: Record<string, EditorialCover> = {
  "tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc": {
    url: PHU_THO_DMC_IMAGES.hero.url,
    alt: PHU_THO_DMC_IMAGES.hero.alt,
    caption:
      "Phối cảnh Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) — dự án NOXH được quan tâm nhất TP.HCM đầu 2026.",
  },
  "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026": {
    url: PHU_THO_DMC_IMAGES.gallery[0].url,
    alt: "Phối cảnh block NOXH Lý Thường Kiệt",
    caption: "Công trình NOXH tại 324 Lý Thường Kiệt, Quận 10 — bàn giao dự kiến 08/2026.",
  },
  "ho-so-mua-noxh-ly-thuong-kiet-doi-tuong-checklist-2026": {
    url: PHU_THO_DMC_IMAGES.gallery[2].url,
    alt: "Thiết kế căn hộ NOXH Lý Thường Kiệt — minh họa đối tượng hồ sơ",
    caption:
      "Hồ sơ mua NOXH Lý Thường Kiệt — đối chiếu đối tượng, nhà ở và thu nhập theo Luật Nhà ở.",
  },
  "vi-sao-noxh-ly-thuong-kiet-sot-so-sanh-gia-quan-10-2026": {
    url: PHU_THO_DMC_IMAGES.locationMap.url,
    alt: PHU_THO_DMC_IMAGES.locationMap.alt,
    caption:
      "Vị trí 324 Lý Thường Kiệt gần Nhà thi đấu Phú Thọ và tiện ích trung tâm Quận 10.",
  },
  "canh-bao-lua-dao-suat-noi-bo-noxh-ly-thuong-kiet-2026": {
    url: PHU_THO_DMC_IMAGES.gallery[1].url,
    alt: "Mặt tiền dự án NOXH Lý Thường Kiệt — cảnh báo giao dịch ngoài luồng",
    caption:
      "Chỉ giao dịch qua hợp đồng và kênh chính thức CĐT Đức Mạnh / Sở Xây dựng — tránh suất nội bộ trên mạng.",
  },
  "giai-ma-4-don-thao-tung-tam-ly-suat-noi-bo-noxh-ly-thuong-kiet-2026": {
    url: PHU_THO_DMC_IMAGES.gallery[6].url,
    alt: "Tiện ích nội khu NOXH Lý Thường Kiệt — minh họa bài giải mã thao túng tâm lý",
    caption:
      "Giải mã bốn đòn thao túng tâm lý quanh suất nội bộ NOXH — đọc cùng người thân trước khi xuống tiền.",
  },
  "mua-noxh-ly-thuong-kiet-co-kho-khong-canh-giac-ve-bua-thu-tuc-2026": {
    url: PHU_THO_DMC_IMAGES.hero.url,
    alt: PHU_THO_DMC_IMAGES.hero.alt,
    caption:
      "Phối cảnh Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) — thủ tục công khai; khó ở cạnh tranh suất, không phải phí bôi trơn hồ sơ.",
  },
  "so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026": {
    url: DTA_HAPPY_HOME_IMAGES.hero.url,
    alt: DTA_HAPPY_HOME_IMAGES.hero.alt,
    caption:
      "DTA Happy Home Nhơn Trạch — lựa chọn NOXH vùng ven so với NOXH nội thành Lý Thường Kiệt.",
  },
  "lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026": {
    url: DTA_HAPPY_HOME_IMAGES.paymentPlans[1].url,
    alt: "Minh họa phương thức thanh toán vay NOXH DTA Happy Home",
    caption:
      "Gói vay ngân hàng liên kết — tham khảo chính sách CĐT, kết hợp khung ưu đãi NHNN.",
  },
  "quy-hoach-tong-the-tphcm-tam-nhin-100-nam-sieu-do-thi": {
    url: HERO.skyline,
    alt: "Toàn cảnh đường chân trời TP.HCM — minh họa siêu đô thị đa trung tâm",
    caption:
      "Đề cương quy hoạch 2025–2050 hướng tới siêu đô thị 20–22 triệu dân và GRDP ~1.200 tỷ USD.",
  },
  "tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045": {
    url: HERO.metroHub,
    alt: "Minh họa trung tâm giao thông công cộng và phát triển đô thị TOD",
    caption:
      "TOD (Transit-Oriented Development) — phát triển mật độ cao trong bán kính đi bộ ~1–1,5 km quanh ga.",
  },
  "tp-hcm-5-khu-tod-metro-so-2-ben-thanh-tham-luong": {
    url: HERO.bitexcoMetro,
    alt: "Minh họa metro và cao ốc trung tâm TP.HCM",
    caption:
      "TP.HCM duyệt ~940 ha quy hoạch TOD dọc tuyến metro số 2 Bến Thành – Tham Lương.",
  },
  "metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026": {
    url: HERO.thuThiemNight,
    alt: "Khu vực Thủ Thiêm về đêm — điểm đầu tuyến đường sắt Thủ Thiêm – Long Thành",
    caption:
      "Tuyến đường sắt ~47,7 km, tổng mức đầu tư dự kiến ~175.000 tỷ đồng, khởi công Q3/2026.",
  },
  "nhon-trach-cu-tang-truong-ha-tang-tod-2026": {
    url: DTA_HAPPY_HOME_IMAGES.hero.url,
    alt: "DTA City Nhơn Trạch — khu đô thị vệ tinh gần hành lang sân bay Long Thành",
    caption:
      "Nhơn Trạch bứt phá hạ tầng 25B, Vành đai 3 và ga đường sắt quy hoạch — đô thị vệ tinh hưởng lợi giao thông công cộng.",
  },
  "tien-do-noxh-kdc-chang-song-phuoc-tan-2026": {
    url: "/images/articles/kdc-chang-song-noxh.webp",
    alt: "Phối cảnh NOXH KDC Chàng Sông Phước Tân",
    caption: "Dự án NOXH tại Phước Tân, Biên Hòa — giai đoạn hạ tầng và móng.",
  },
  "nha-o-xa-hoi-la-gi": {
    url: HERO.urban,
    alt: "Minh họa nhà ở đô thị và an cư",
    caption: "Nhà ở xã hội là gì — định nghĩa và khác biệt với căn thương mại.",
  },
  "dang-ky-nha-o-xa-hoi": {
    url: HERO.civic,
    alt: "Minh họa đăng ký hồ sơ nhà ở xã hội",
    caption: "Đăng ký nhà ở xã hội — hồ sơ, đơn mẫu và thứ tự nộp.",
  },
  "noxh-phia-tay-ha-noi-dai-mo-to-huu-me-tri-2026": {
    url: HERO.skyline,
    alt: "Minh họa đô thị phía Tây Hà Nội",
    caption: "Cụm NOXH Nam Từ Liêm: Đại Mỗ, Tố Hữu, Mễ Trì — khớp tên gọi và bước kiểm tra.",
  },
  "noxh-long-bien-him-lam-phuc-loi-rice-city-2026": {
    url: HERO.metroHub,
    alt: "Minh họa đô thị Long Biên / phía Đông Hà Nội",
    caption: "NOXH Long Biên: Him Lam Phúc Lợi và Rice City Thạch Bàn.",
  },
  "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat": {
    url: HERO.urban,
    alt: "Minh họa an cư và nhà ở đô thị",
    caption: "Tóm tắt điều kiện mua nhà ở xã hội theo Luật Nhà ở — cập nhật 2026.",
  },
  "quy-trinh-mua-thue-mua-noxh-2026": {
    url: HERO.civic,
    alt: "Minh họa quy trình hành chính và nhà ở xã hội",
    caption: "Quy trình mua/thuê mua NOXH — từ đăng ký đến ký hợp đồng.",
  },
  "vay-noxh-goi-120000-ty-nhcsxh-2026": {
    url: DTA_HAPPY_HOME_IMAGES.paymentPlans[1].url,
    alt: "Minh họa phương thức thanh toán và vay NOXH",
    caption: "Gói tín dụng 120.000 tỷ NHCSXH — tham chiếu vay mua NOXH.",
  },
  "dieu-kien-nha-o-mua-noxh-dieu-77-2026": {
    url: HERO.urban,
    alt: "Minh họa điều kiện nhà ở khi mua NOXH",
    caption: "Điều kiện nhà ở Điều 78 — 15 m²/người, một căn/hộ.",
  },
  "phuc-loc-tho-block-c-noxh-gia-ho-so-2026": {
    url: HERO.urban,
    alt: "Chung cư Phúc Lộc Thọ Block C NOXH Thủ Đức",
    caption: "NOXH Block C — 35 Lê Văn Chí, giá ~35,3 triệu/m².",
  },
  "noxh-long-an-6-du-an-mien-nam-2026": {
    url: HERO.skyline,
    alt: "Minh họa khu đô thị vùng ven miền Nam",
    caption: "Danh mục 6 dự án NOXH Long An — vùng đệm TP.HCM.",
  },
  "id-town-long-thanh-ha-tang-san-bay-metro-2026": {
    url: ID_TOWN_IMAGES.hero.url,
    alt: ID_TOWN_IMAGES.hero.alt,
    caption:
      "ID Town Long Thành trong iD Junction — NOXH cận nút cao tốc HCM – Long Thành – Dầu Giây và QL51.",
  },
  "ho-guom-xanh-metro-so-2-ql13-tod-2026": {
    url: HGX.ketNoi,
    alt: "Minh họa metro và kết nối đô thị — hành lang Metro số 2 dọc Quốc lộ 13",
    caption:
      "NOXH Hồ Gươm Xanh Thuận An — mặt tiền Đại lộ Bình Dương / QL13, gần ga Metro số 2 quy hoạch tại Lái Thiêu.",
  },
  "lai-thieu-quy-hoach-2040-phuong-trung-tam-metro-2026": {
    url: HERO.metroHub,
    alt: "Minh họa metro và cửa ngõ đô thị — hành lang Quốc lộ 13 Lái Thiêu",
    caption:
      "Quy hoạch Lái Thiêu đến 2040: phường trung tâm, QL13 hướng 8 làn và Metro dọc Đại lộ Bình Dương.",
  },
  "can-ho-lai-thieu-quoc-lo-13-du-an-noi-bat-2026": {
    url: HERO.urban,
    alt: "Minh họa skyline căn hộ cao tầng vùng cửa ngõ TP.HCM – Bình Dương",
    caption:
      "Cuộc đua căn hộ dọc Quốc lộ 13 / Đại lộ Bình Dương đoạn Lái Thiêu — cao cấp ven sông đến tầm trung.",
  },
  "mua-can-ho-lai-thieu-o-thuc-hay-dau-tu-cho-thue-2026": {
    url: HERO.skyline,
    alt: "Minh họa an cư và đầu tư căn hộ vùng đô thị mở rộng",
    caption:
      "Hai lộ trình tại Lái Thiêu: mua để ở thực hoặc đầu tư cho thuê đón sóng hạ tầng QL13 – Metro.",
  },
  "can-ho-lai-thieu-sap-mo-ban-emerald-boulevard-hgx-2026": {
    url: HERO.metroHub,
    alt: "Minh họa đô thị cửa ngõ và quỹ căn hộ sắp mở bán trên Quốc lộ 13",
    caption:
      "Emerald Boulevard (view sân golf Sông Bé) và phân khu cao cấp Hồ Gươm Xanh — quỹ sắp mở bán Lái Thiêu.",
  },
  "bon-cuc-tang-truong-do-thi-tp-hcm-2026": {
    url: HERO.skyline,
    alt: "Toàn cảnh đô thị TP.HCM — minh họa sáu trục tăng trưởng liên vùng",
    caption:
      "Sáu trục: Bắc–Nam sông Sài Gòn, Đông–Tây VVK–MCT, biển Đông, Vành đai 3–4, sân bay Long Thành, và QL13 Đông Bắc.",
  },
  "truc-doc-song-sai-gon-hanh-lang-kinh-te-ty-do-2026": {
    url: HERO.skyline,
    alt: "Toàn cảnh TP.HCM ven sông — hành lang Bắc–Nam dọc sông Sài Gòn",
    caption:
      "Quyết định 1125/QĐ-TTg: hành lang dọc sông Sài Gòn là mặt tiền đô thị đến 2040–2060.",
  },
  "ly-tam-bds-nam-sai-gon-can-gio-dong-tien-2026": {
    url: HERO.thuThiemDay,
    alt: "Không gian đô thị phía Đông – Nam TP.HCM — minh họa ly tâm Nam Sài Gòn",
    caption:
      "Siêu cảng Cần Giờ và hành lang Nam Sài Gòn – Cần Giờ trong dòng tiền ly tâm dài hạn.",
  },
  "top-du-an-can-ho-biet-thu-ven-song-nam-sai-gon-2026": {
    url: HERO.thuThiemNight,
    alt: "Thủ Thiêm và cửa ngõ phía Đông — neo an cư ven sông / cầu Phú Mỹ",
    caption:
      "Đối chiếu thực tế: Thủ Thiêm Green House và khung chọn dự án ven sông Nam Sài Gòn.",
  },
  "truc-dong-tay-tphcm-vo-van-kiet-mai-chi-tho-2026": {
    url: HERO.metroHub,
    alt: "Trục giao thông đô thị TP.HCM — minh họa hành lang Đông–Tây",
    caption:
      "Võ Văn Kiệt – Mai Chí Thọ: xương sống liên kết Long An – lõi – Đồng Nai.",
  },
  "bds-truc-dong-tay-bien-do-gia-cua-ngo-2026": {
    url: HERO.urban,
    alt: "Cảnh quan đô thị cửa ngõ — minh họa biên độ BĐS trục Đông–Tây",
    caption:
      "Cửa ngõ Tây và Đông trên đại lộ VVK–MCT: logic dòng tiền định tính, không cam kết biên độ.",
  },
  "can-ho-vo-van-kiet-mai-chi-tho-an-cu-dau-tu-2026": {
    url: HERO.bitexcoMetro,
    alt: "Trung tâm TP.HCM và metro — lợi thế an cư trên trục Đông–Tây",
    caption:
      "Checklist chọn căn hộ gần Võ Văn Kiệt – Mai Chí Thọ; neo Thủ Thiêm Green House.",
  },
  "hanh-lang-kinh-te-bien-phia-dong-tphcm-cai-mep-2026": {
    url: HERO.viaduct,
    alt: "Hạ tầng giao thông liên vùng phía Đông — minh họa hành lang biển",
    caption:
      "Cao tốc Biên Hòa – Vũng Tàu và chuỗi logistics tới Cái Mép – Thị Vải.",
  },
  "bds-do-thi-bien-phia-dong-cua-ngo-dau-tu-dai-han-2026": {
    url: HERO.urban,
    alt: "Đô thị vệ tinh phía Đông — minh họa an cư gần KCN Nhơn Trạch",
    caption:
      "DTA Happy Home: NOXH đô thị vệ tinh trên hành lang kinh tế biển phía Đông.",
  },
  "tien-do-vanh-dai-3-vanh-dai-4-do-thi-ve-tinh-2026": {
    url: HERO.viaduct,
    alt: "Công trình giao thông vành đai — minh họa Vành đai 3 & 4",
    caption:
      "Vành đai 3 hướng hoàn thành theo đoạn trong 2026; Vành đai 4 đang GPMB / khởi công.",
  },
  "tod-doc-vanh-dai-3-mo-vang-nha-dau-tu-2026": {
    url: HERO.metroHub,
    alt: "Ga và nút giao đô thị — minh họa TOD quanh Vành đai 3",
    caption:
      "Phân biệt lõi TOD quanh nút giao với đô thị vệ tinh hưởng lợi vành đai.",
  },
  "dat-nen-nha-pho-don-dau-thong-xe-vanh-dai-3-2026": {
    url: HERO.urban,
    alt: "Không gian đô thị vệ tinh — minh họa săn đất nền đón Vành đai 3",
    caption:
      "Checklist Thủ Đức, Củ Chi, Bình Chánh, Thuận An — thẩm định pháp lý trước khi xuống tiền.",
  },
  "bds-thanh-pho-san-bay-long-thanh-mo-hinh-sinh-loi-2026": {
    url: HERO.thuThiemNight,
    alt: "Hạ tầng kết nối vùng phía Đông — minh họa thành phố sân bay Long Thành",
    caption:
      "ACV hướng khai thác thương mại Long Thành giai đoạn 1 từ 1/12/2026; bán kính 5–10 km.",
  },
  "nam-truc-tang-truong-vung-thu-do-ha-noi-2026": {
    url: HERO.skyline,
    alt: "Toàn cảnh đô thị — minh họa năm trục tăng trưởng Vùng Thủ đô Hà Nội",
    caption:
      "Đô thị chùm: Đông – Đông Nam, Nội Bài, Vành đai 4, Đại lộ Thăng Long và Tây Nam Hà Nam.",
  },
  "cao-toc-5b-hanh-lang-kinh-te-ven-bien-dong-nam-vung-thu-do-2026": {
    url: HERO.viaduct,
    alt: "Hạ tầng cao tốc liên vùng — minh họa hành lang Đông – Đông Nam Vùng Thủ đô",
    caption:
      "Cao tốc / QL5B và hành lang kinh tế ven biển Hà Nội – Hải Phòng – Quảng Ninh.",
  },
  "di-dan-quan-phia-dong-hung-yen-dong-tien-2026": {
    url: HERO.urban,
    alt: "Không gian đô thị mở rộng — minh họa ly tâm bờ Đông sông Hồng / Hưng Yên",
    caption:
      "Hưng Yên như cửa ngõ “quận phía Đông”: dòng tiền trung hạn theo phút di chuyển và pháp lý.",
  },
  "du-an-dai-do-thi-chung-cu-truc-phia-dong-ha-noi-2026": {
    url: HERO.skyline,
    alt: "Nhà chung cư đại đô thị — minh họa trục phía Đông Hà Nội / Hưng Yên",
    caption:
      "Review định tính Ocean Park và nhà chung cư trục Đông — không bịa bảng giá.",
  },
  "quy-hoach-nhat-tan-noi-bai-dai-lo-vo-nguyen-giap-2026": {
    url: HERO.metroHub,
    alt: "Trục giao thông cửa ngõ sân bay — minh họa Nhật Tân – Nội Bài",
    caption:
      "Đại lộ Võ Nguyên Giáp và định hướng đô thị Bắc sông Hồng / Đông Anh.",
  },
  "bds-thanh-pho-san-bay-noi-bai-bac-song-hong-2026": {
    url: HERO.thuThiemNight,
    alt: "Đô thị gần sân bay — minh họa thành phố sân bay Nội Bài",
    caption:
      "Nhu cầu căn hộ và thương mại phục vụ chuyên gia KCN Đông Anh – Sóc Sơn – Mê Linh.",
  },
  "du-an-can-ho-dat-nen-dong-anh-me-linh-2026": {
    url: HERO.urban,
    alt: "An cư Bắc sông Hồng — minh họa Đông Anh / Mê Linh",
    caption:
      "Checklist pháp lý căn hộ và thửa đất; soft link NOXH Mê Linh trên House X.",
  },
  "tien-do-vanh-dai-4-vung-thu-do-2026": {
    url: HERO.viaduct,
    alt: "Công trình vành đai liên tỉnh — minh họa Vành đai 4 Vùng Thủ đô",
    caption:
      "Tuyến ~113,5 km qua Hà Nội, Hưng Yên, Bắc Ninh — tiến độ theo công bố chính thống.",
  },
  "tod-doc-vanh-dai-4-vung-thu-do-2026": {
    url: HERO.metroHub,
    alt: "Nút giao đô thị vệ tinh — minh họa TOD dọc Vành đai 4",
    caption:
      "Quỹ đất quanh nút giao VD4: phân biệt lõi TOD và vùng hưởng lợi vệ tinh.",
  },
  "dat-nen-nha-pho-don-dau-vanh-dai-4-bac-ninh-hung-yen-2026": {
    url: HERO.urban,
    alt: "Thửa đất và nhà phố vệ tinh — minh họa đón Vành đai 4",
    caption:
      "Bắc Ninh, Hưng Yên, Mê Linh: pháp lý an toàn trước khi so sánh giá định tính.",
  },
  "quy-hoach-truc-phia-tay-dai-lo-thang-long-hoa-lac-2026": {
    url: HERO.bitexcoMetro,
    alt: "Hành lang phía Tây Thủ đô — minh họa Đại lộ Thăng Long / Hòa Lạc",
    caption:
      "Trung tâm công nghệ – giáo dục Hòa Lạc và tiến độ hạ tầng dọc Thăng Long.",
  },
  "an-cu-phia-tay-nam-tu-liem-my-dinh-2026": {
    url: HERO.skyline,
    alt: "An cư lõi phía Tây — minh họa Nam Từ Liêm / Mỹ Đình",
    caption:
      "Thanh khoản cao tầng nhờ tiện ích xã hội đồng bộ và bài toán tài chính trung thực.",
  },
  "can-ho-cao-cap-dai-lo-thang-long-dang-mo-ban-2026": {
    url: HERO.thuThiemDay,
    alt: "Căn hộ cao cấp hành lang Tây — minh họa mở bán dọc Thăng Long",
    caption:
      "So sánh định tính chính sách thanh toán / ân hạn — CTA tư vấn House X.",
  },
  "quy-hoach-truc-phia-nam-ha-nam-ve-tinh-2026": {
    url: HERO.viaduct,
    alt: "Hành lang QL1A phía Nam — minh họa Hà Nam vệ tinh Thủ đô",
    caption:
      "Pháp Vân – Cầu Giẽ / QL1A: Hà Nam trong khung đô thị vệ tinh công nghiệp – dịch vụ.",
  },
  "dat-nen-nha-pho-kcn-sach-phia-nam-ha-noi-2026": {
    url: HERO.urban,
    alt: "Nhà phố ven KCN sạch — minh họa phía Nam Hà Nội / Hà Nam",
    caption:
      "Nhu cầu nhà ở chuyên gia khi FDI / nhà máy dịch chuyển về hành lang Tây Nam.",
  },
  "bds-sinh-thai-do-thi-dich-vu-tay-nam-vung-thu-do-2026": {
    url: HERO.civic,
    alt: "Đô thị dịch vụ – sinh thái — minh họa trục Tây Nam Vùng Thủ đô",
    caption:
      "Khung chọn dự án Phủ Lý, Duy Tiên, Thường Tín, Thanh Trì — pháp lý trước giá.",
  },
  "mo-hinh-build-to-rent-nha-o-cho-thue-dai-han-tai-cau-truc-2026": {
    url: HERO.skyline,
    alt: "Đô thị cao tầng — minh họa mô hình Build-to-Rent / nhà ở cho thuê dài hạn",
    caption:
      "BTR: xây để cho thuê dài hạn chuyên nghiệp — khác mua lẻ rồi cho thuê lại.",
  },
  "chinh-sach-nha-o-cho-thue-dai-han-tru-cot-an-cu-2030": {
    url: HERO.civic,
    alt: "Không gian đô thị — minh họa chính sách nhà ở cho thuê dài hạn đến 2030",
    caption:
      "Trụ cột an cư quốc gia: thuê dài hạn bên cạnh nhà để bán và nhà ở xã hội.",
  },
  "hop-dong-thue-nha-dai-han-15-20-nam-lech-pha-cung-cau-2026": {
    url: HERO.metroHub,
    alt: "Cửa ngõ đô thị — minh họa hợp đồng thuê nhà dài hạn 15–20 năm",
    caption:
      "Khung thuê dài hạn giúp an cư mà không chịu áp lực mua đứt ngay.",
  },
  "gia-nha-vuot-kha-nang-co-nen-thue-dai-han-2026": {
    url: HERO.urban,
    alt: "Skyline đô thị — minh họa bài toán giá nhà vượt khả năng chi trả",
    caption:
      "Thuê dài hạn như lựa chọn bảo toàn dòng tiền khi giá nội đô vượt thu nhập.",
  },
  "thue-can-ho-dai-han-vs-chung-cu-mini-phong-tro-2026": {
    url: HERO.thuThiemDay,
    alt: "Không gian sống đô thị — so sánh thuê dài hạn với mini / phòng trọ",
    caption:
      "Đối chiếu PCCC, vận hành và ổn định hợp đồng trước khi ký thuê.",
  },
  "quyen-loi-nguoi-thue-nha-o-cho-thue-the-he-moi-2026": {
    url: HERO.bitexcoMetro,
    alt: "Đô thị hiện đại — minh họa quyền lợi người thuê thế hệ mới",
    caption:
      "Giá thuê ổn định theo khung hợp đồng và vận hành chuyên nghiệp.",
  },
  "tod-vanh-dai-nha-o-cho-thue-dai-han-2026": {
    url: HERO.viaduct,
    alt: "Hạ tầng metro / vành đai — minh họa TOD gắn nhà ở cho thuê",
    caption:
      "Ưu tiên quỹ đất quanh ga và nút giao cho sản phẩm thuê dài hạn.",
  },
  "can-ho-cho-thue-chuyen-gia-truc-ql13-vanh-dai-4-2026": {
    url: HERO.urban,
    alt: "Cửa ngõ công nghiệp — minh họa căn hộ cho thuê chuyên gia QL13",
    caption:
      "Nhu cầu KCN trên hành lang QL13 và vành đai — không bịa giá thuê.",
  },
  "dong-von-dau-tu-can-ho-cho-thue-dai-han-2026": {
    url: HERO.skyline,
    alt: "Toàn cảnh đô thị — minh họa dòng vốn dài hạn vào căn hộ cho thuê",
    caption:
      "Logic quỹ và NĐT: dòng tiền đều, bảo toàn dòng vốn — không cam kết lợi nhuận.",
  },
  "du-an-can-ho-van-hanh-cho-thue-dai-han-2026": {
    url: HERO.thuThiemNight,
    alt: "Chọn căn hộ cho thuê dài hạn — năm tiêu chí vị trí, bố trí, nội thất, phí và pháp lý",
    caption:
      "Đối chiếu vị trí việc làm, bố trí căn và phí quản lý trước khi mua để cho thuê.",
  },
  "tinh-dong-tien-don-bay-can-ho-cho-thue-2026": {
    url: HERO.civic,
    alt: "Căn hộ cho thuê — tách tiền thuê thu về và tiền còn lại sau phí, thuế, vay",
    caption:
      "Doanh thu gộp khác dòng tiền ròng: trừ phí, thuế, trả góp và dự phòng tháng trống.",
  },
  "thue-cho-thue-nha-2026-ma-nganh-68103": {
    url: HERO.metroHub,
    alt: "Chủ nhà cần biết ngưỡng miễn thuế và cách kê khai thuế cho thuê nhà đúng quy định",
    caption:
      "Dưới 100 triệu/năm miễn thuế; trên ngưỡng kê khai theo mẫu 01/TTS tại Chi cục Thuế nơi có bất động sản.",
  },
};

/** Khối markdown ảnh minh hoạ trong thân bài (chuẩn báo chí). */
export function editorialFigure(f: EditorialFigure): string {
  const source = f.source ? ` — Nguồn: ${f.source}` : "";
  return `![${f.alt}](${f.url})\n\n*Ảnh: ${f.caption}${source}*`;
}

export const EDITORIAL_FIGURES = {
  ltkPhoiCanh: editorialFigure({
    url: PHU_THO_DMC_IMAGES.hero.url,
    alt: PHU_THO_DMC_IMAGES.hero.alt,
    caption: "Phối cảnh Phú Thọ DMC tại 324 Lý Thường Kiệt, Quận 10",
    source: "minh họa dự án",
  }),
  ltkMatBang: editorialFigure({
    url: PHU_THO_DMC_IMAGES.gallery[4].url,
    alt: "Mặt bằng tầng NOXH Lý Thường Kiệt",
    caption: "Layout căn Studio / 1PN / 2PN — diện tích 34,5–77 m²",
    source: "minh họa dự án",
  }),
  dtaPhoiCanh: editorialFigure({
    url: DTA_HAPPY_HOME_IMAGES.hero.url,
    alt: DTA_HAPPY_HOME_IMAGES.hero.alt,
    caption: "Khu NOXH DTA Happy Home trong DTA City Nhơn Trạch",
    source: "CĐT Đệ Tam",
  }),
  dtaMatBang: editorialFigure({
    url: DTA_HAPPY_HOME_IMAGES.floorPlans.master.url,
    alt: "Mặt bằng tổng thể DTA Happy Home",
    caption: "Quy mô 2.192 căn NOXH — giá CĐT 448–700 triệu/căn",
    source: "CĐT Đệ Tam",
  }),
  noxhEligibility: editorialFigure({
    url: HERO.urban,
    alt: "Minh họa an cư đô thị và nhà ở xã hội",
    caption:
      "Khung pháp lý NOXH: Luật Nhà ở 2023, NĐ 100/2024 và NĐ 136/2026 (mức trần thu nhập từ 07/04/2026).",
    source: "minh họa",
  }),
  dtaMap: editorialFigure({
    url: DTA_HAPPY_HOME_IMAGES.locationMap.url,
    alt: DTA_HAPPY_HOME_IMAGES.locationMap.alt,
    caption: DTA_HAPPY_HOME_IMAGES.locationMap.caption,
  }),
  hcmSkyline: editorialFigure({
    url: HERO.skyline,
    alt: "Toàn cảnh TP.HCM — minh họa siêu đô thị",
    caption: "Quy hoạch tổng thể hướng tới siêu đô thị đa trung tâm",
    source: "HouseX",
  }),
  metroHub: editorialFigure({
    url: HERO.metroHub,
    alt: "Minh họa ga metro và trung tâm giao thông",
    caption: "TOD lấy ga làm trung tâm phát triển dân cư mật độ cao trong bán kính đi bộ ~1–1,5 km",
    source: "HouseX",
  }),
  metroViaduct: editorialFigure({
    url: HERO.viaduct,
    alt: "Minh họa đường sắt đô thị trên cao",
    caption: "Hạ tầng đường sắt liên vùng mở không gian đô thị vệ tinh",
    source: "HouseX",
  }),
  thuThiem: editorialFigure({
    url: HERO.thuThiemDay,
    alt: "Khu Thủ Thiêm — điểm đầu tuyến đường sắt Thủ Thiêm – Long Thành",
    caption: "Ga Thủ Thiêm kết nối metro số 2 và tuyến tới sân bay Long Thành",
    source: "HouseX",
  }),
  bitexcoMetro: editorialFigure({
    url: HERO.bitexcoMetro,
    alt: "Minh họa metro trung tâm TP.HCM",
    caption: "5 khu TOD dọc metro số 2 — tổng diện tích gần 940 ha",
    source: "HouseX",
  }),
  nhonTrachInfra: editorialFigure({
    url: DTA_HAPPY_HOME_IMAGES.progress[0].url,
    alt: "Tiến độ Khu đô thị DTA City Nhơn Trạch",
    caption: "Hạ tầng KCN – đô thị vệ tinh sân bay Long Thành đang hoàn thiện",
    source: "CĐT Đệ Tam",
  }),
  idTownPhoiCanh: editorialFigure({
    url: ID_TOWN_IMAGES.hero.url,
    alt: ID_TOWN_IMAGES.hero.alt,
    caption: "Phối cảnh phân khu NOXH ID Town trong khu đô thị iD Junction Long Thành",
    source: "id-town.com.vn",
  }),
  idTownMap: editorialFigure({
    url: ID_TOWN_IMAGES.locationMap.url,
    alt: ID_TOWN_IMAGES.locationMap.alt,
    caption: ID_TOWN_IMAGES.locationMap.caption,
    source: "id-town.com.vn",
  }),
  idTownTienIch: editorialFigure({
    url: ID_TOWN_IMAGES.gallery[2].url,
    alt: "Tiện ích nội khu ID Town Long Thành",
    caption: "Hồ bơi và cảnh quan nội khu — mật độ xây dựng khoảng 35%",
    source: "id-town.com.vn",
  }),
  hgxPhoiCanh: editorialFigure({
    url: HGX.phoiCanh,
    alt: "Nhà ở xã hội Hồ Gươm Xanh Thuận An — chung cư NOXH 5–12 tầng trong KĐT TBS Land",
    caption:
      "Phân khu NOXH trong KĐT Hồ Gươm Xanh ~26,4 ha tại 136 Đại lộ Bình Dương, Lái Thiêu",
    source: "minh họa",
  }),
  hgxKetNoi: editorialFigure({
    url: HGX.ketNoi,
    alt: "Kết nối Metro và Quốc lộ 13 — cửa ngõ Bình Dương – TP.HCM",
    caption:
      "Trục QL13 / Đại lộ Bình Dương trước mặt dự án — hướng tuyến Metro số 2 Bình Dương – TP.HCM",
    source: "minh họa",
  }),
  hgxTienIch: editorialFigure({
    url: HGX.tienIch,
    alt: "Tiện ích và cảnh quan đô thị vùng ven — minh họa KĐT Hồ Gươm Xanh",
    caption:
      "Hồ cảnh quan, công viên và tiện ích đô thị đồng bộ trong masterplan TBS Land",
    source: "minh họa",
  }),
} as const;

export function applyEditorialMedia(article: ArticleDetail): ArticleDetail {
  const cover = ARTICLE_EDITORIAL_COVERS[article.slug];
  if (!cover) return article;
  return {
    ...article,
    coverImageUrl: cover.url,
    coverImageAlt: cover.alt,
    coverImageCaption: cover.caption,
  };
}

export function absoluteArticleImageUrl(
  url: string,
  siteUrl: string,
): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${siteUrl.replace(/\/$/, "")}${url}`;
  return url;
}
