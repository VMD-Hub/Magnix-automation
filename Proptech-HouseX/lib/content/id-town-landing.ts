import {
  buildOverviewData,
  defaultProjectLanding,
  type ProjectLanding,
} from "@/lib/content/project-landing";
import { ID_TOWN_IMAGES } from "@/lib/content/id-town-images";

export const ID_TOWN_SLUG = "id-town-long-thanh" as const;
export const ID_TOWN_NAME = "ID Town Long Thành" as const;

/** MST stub — admin thay bằng MST thật CTCP Long Thành Riverside khi xác minh. */
export const ID_TOWN_DEVELOPER_TAX_CODE = "3600999901" as const;

/** Giá tham chiếu ~22 triệu/m² (công bố khối C, D — Sở Xây dựng Đồng Nai / báo chí 01/2026). */
export const ID_TOWN_PRICE_PER_SQM = 22_000_000;

export const ID_TOWN_LOCATION_NOTES = `ID Town (tên thương mại khu nhà ở xã hội thuộc Dự án Khu dân cư theo quy hoạch tại xã Long Thành) nằm trong khu đô thị iD Junction, mặt tiền đường Phạm Văn Đồng, thị trấn/xã Long Thành, tỉnh Đồng Nai — cửa ngõ logistics phía Đông TP.HCM.

Kết nối vùng (theo website dự án):
• ~5 phút tới trung tâm thị trấn Long Thành (chợ, bệnh viện, trường học, Vincom Plaza)
• ~10 phút tới sân bay quốc tế Long Thành (~5 km)
• 30–40 phút tới Quận 1 TP.HCM qua cao tốc TP.HCM – Long Thành – Dầu Giây
• Gần cao tốc Long Thành – Dầu Giây, Quốc lộ 51, cụm cảng Cái Mép – Thị Vải
• Thuận tiện cho lao động KCN Long Thành, Long Đức, Lộc An – Bình Sơn, Nhơn Trạch

Tứ cận (theo CĐT): Bắc giáp cao tốc hướng sân bay; Nam giáp ĐT 769 (Lý Thái Tổ); Đông giáp hành lang kỹ thuật điện; Tây giáp sông Đồng Môn.`;

export const ID_TOWN_PROJECT_DESCRIPTION =
  "ID Town là phân khu căn hộ nhà ở xã hội trong khu đô thị iD Junction tại đường Phạm Văn Đồng, Long Thành, Đồng Nai do Công ty Cổ phần Long Thành Riverside phát triển. Quy mô 2,5 ha, 4 block cao 7 tầng, 628 căn; mật độ xây dựng 35%. Giá tham chiếu từ hơn 22 triệu/m² (khối C, D công bố 01/2026); bàn giao dự kiến Q4/2026.";

export function buildIdTownLanding(): ProjectLanding {
  const landing = defaultProjectLanding(ID_TOWN_NAME);
  landing.heroSubtitle =
    "NOXH chuẩn thương mại tại Long Thành — 628 căn, 4 block 7 tầng trong iD Junction, gần sân bay Long Thành, giá từ ~22 triệu/m²";
  landing.heroImage = { ...ID_TOWN_IMAGES.hero };
  landing.locationMapImage = { ...ID_TOWN_IMAGES.locationMap };
  landing.locationNotes = ID_TOWN_LOCATION_NOTES;
  landing.highlights = [
    {
      title: "NOXH chuẩn thương mại đầu tiên tại Long Thành",
      text: "Phân khu căn hộ nhà ở xã hội trong tổng thể khu đô thị iD Junction — định vị chất lượng sống tương đương phân khúc thương mại trung cấp theo thông tin CĐT.",
    },
    {
      title: "Gần sân bay Long Thành — kết nối tam giác logistics",
      text: "Mặt tiền Phạm Văn Đồng; khoảng 5 km / ~10 phút tới sân bay quốc tế Long Thành; gần cao tốc HCM – Long Thành – Dầu Giây, QL51 và cụm cảng Cái Mép – Thị Vải.",
    },
    {
      title: "628 căn trên 2,5 ha — mật độ xây dựng 35%",
      text: "4 block cao 7 tầng; phần lớn diện tích dành cho cảnh quan, tiện ích công cộng và không gian xanh nội khu.",
    },
    {
      title: "Giá tham chiếu từ ~22 triệu/m²",
      text: "Khối C, D (314 căn) đã được công bố giá bán bình quân hơn 22 triệu/m² (đã gồm VAT, chưa gồm bảo trì/QLVH) theo thông tin Sở/CĐT 01/2026. Diện tích công bố khoảng 48–77 m².",
    },
    {
      title: "3 vòng tiện ích — nội khu + iD Junction + ngoại khu",
      text: "Hồ bơi điện phân muối, quảng trường, sân chơi, thể thao ngoài trời; thừa hưởng hồ trung tâm ~2 ha, TTTM, trường học nội khu iD Junction; gần Vincom Plaza và BVĐK Long Thành.",
    },
    {
      title: "Bàn giao dự kiến Q4/2026",
      text: "Nhiều block đã cất nóc / đang hoàn thiện theo cập nhật CĐT. Theo dõi tiến độ và hồ sơ mở bán qua House X hoặc kênh chính thức id-town.com.vn.",
    },
  ];
  landing.amenities = [
    "Hồ bơi điện phân muối",
    "Quảng trường trung tâm",
    "Sân chơi trẻ em",
    "Khu thể thao ngoài trời",
    "Vườn cảnh quan & đường dạo",
    "Bãi xe tách biệt",
    "An ninh 24/7",
    "Hồ trung tâm iD Junction (~2 ha)",
    "TTTM / siêu thị nội khu đô thị",
    "Trường mầm non – tiểu học nội khu",
    "Clubhouse & BBQ ngoài trời",
    "Vincom Plaza Long Thành (ngoại khu)",
  ];
  landing.faqs = [
    {
      q: "ID Town có phải nhà ở xã hội không?",
      a: "Đúng. ID Town là tên thương mại khu nhà ở xã hội thuộc Dự án Khu dân cư theo quy hoạch tại xã Long Thành, nằm trong khu đô thị iD Junction, do Công ty Cổ phần Long Thành Riverside làm chủ đầu tư.",
    },
    {
      q: "ID Town nằm ở đâu?",
      a: "Đường Phạm Văn Đồng, thị trấn/xã Long Thành, tỉnh Đồng Nai — trong khu đô thị iD Junction. Cách sân bay quốc tế Long Thành khoảng 5 km.",
    },
    {
      q: "Quy mô dự án ID Town thế nào?",
      a: "Quy mô khoảng 2,5 ha; 4 block chung cư cao 7 tầng; tổng 628 căn hộ; mật độ xây dựng khoảng 35% theo thông tin website dự án.",
    },
    {
      q: "Giá ID Town bao nhiêu?",
      a: "Theo công bố giá khối C, D (01/2026), đơn giá bình quân hơn 22 triệu/m² (đã gồm VAT). Căn khoảng 48–77 m² tương đương khoảng hơn 1 tỷ đến ~1,7 tỷ/căn tùy diện tích. Liên hệ tư vấn để nhận bảng giá block đang mở bán.",
    },
    {
      q: "Loại căn hộ ID Town có những loại nào?",
      a: "Theo website dự án: phổ biến là căn 2PN–1WC hoặc 2WC; một số căn góc view rộng. Trang mặt bằng nêu tham chiếu khoảng ~59 m² (2PN 1WC), ~69–73 m² (2PN 2WC) và một số căn 3PN hạn chế.",
    },
    {
      q: "ID Town bàn giao khi nào?",
      a: "Theo thông tin CĐT / báo chí: nhiều block đã cất nóc; bàn giao dự kiến từ quý 4/2026. House X cập nhật khi có thông báo chính thức mới.",
    },
    {
      q: "Ai được mua ID Town?",
      a: "Người thuộc các nhóm đối tượng nhà ở xã hội theo Luật Nhà ở và quy định địa phương (công nhân KCN, người thu nhập thấp, CBCCVC…). Mỗi hộ/cá nhân chỉ được hưởng hỗ trợ NOXH theo quy định. Liên hệ tư vấn để rà điều kiện trước khi nộp hồ sơ.",
    },
  ];
  landing.gallery = ID_TOWN_IMAGES.gallery.map((g) => ({ ...g }));
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn chi tiết hơn về dự án — liên hệ với chúng tôi.";
  return landing;
}

export function buildIdTownOverviewData() {
  return buildOverviewData(null, {
    totalUnits: 628,
    blocks: 4,
    landing: buildIdTownLanding(),
  });
}
