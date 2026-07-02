import {
  buildOverviewData,
  defaultProjectLanding,
  type ProjectLanding,
} from "@/lib/content/project-landing";
import {
  DTA_HAPPY_HOME_IMAGES,
  dtaHappyHomeGallery,
} from "@/lib/content/dta-happy-home-images";

export const DTA_HAPPY_HOME_SLUG = "dta-happy-home-nhon-trach" as const;
export const DTA_HAPPY_HOME_NAME = "DTA Happy Home Nhơn Trạch" as const;

export const DTA_LOCATION_NOTES = `DTA Happy Home nằm trong Khu đô thị DTA City, mặt tiền đường Nguyễn Văn Cừ, xã Phước An, huyện Nhơn Trạch — cửa ngõ khu công nghiệp Nhơn Trạch – Đồng Nai, thuận tiện cho công nhân và người lao động an cư gần nơi làm việc.

Kết nối giao thông:
• Cao tốc Biên Hòa – Vũng Tàu: khoảng 10 phút
• Quốc lộ 51: khoảng 15 phút
• Đường 25C (Nguyễn Ái Quốc) → Sân bay Long Thành: khoảng 20 phút
• Hướng TP.HCM (Quận 2): khoảng 40 phút
• Tuyến đường sắt Thủ Thiêm – Long Thành (quy hoạch): vùng phụ cận ga S12/S13 tại Nhơn Trạch — khoảng cách tới ga dự kiến trong bán kính ~5 km (tham khảo quy hoạch FEED, chưa vận hành)

Tiện ích ngoại khu DTA City: chợ truyền thống DTA, Bệnh viện Đa khoa Quốc tế DTA, Trường Mầm non & Tiểu học Quốc tế DTA.`;

export const DTA_PROJECT_DESCRIPTION =
  "DTA Happy Home là dự án nhà ở xã hội do Công ty Cổ phần Đệ Tam triển khai tại Khu đô thị DTA City Nhơn Trạch. Quy mô 2.192 căn, 16 block cao 5 tầng, diện tích 30–52 m². Giá bán 448–700 triệu/căn; đã bàn giao 4 block (560 căn), tiếp tục triển khai thêm khoảng 1.600 căn. Ba phương thức thanh toán linh hoạt; hỗ trợ vay ngân hàng liên kết tới 70% giá trị căn, thời hạn tối đa 20 năm.";

export function buildDtaHappyHomeLanding(): ProjectLanding {
  const landing = defaultProjectLanding(DTA_HAPPY_HOME_NAME);
  landing.heroSubtitle =
    "Khu căn hộ NOXH trong DTA City — 2.192 căn, giá 448–700 triệu/căn, mặt bằng & nhà mẫu rõ ràng, hỗ trợ vay ngân hàng liên kết";
  landing.heroImage = { ...DTA_HAPPY_HOME_IMAGES.hero };
  landing.locationMapImage = { ...DTA_HAPPY_HOME_IMAGES.locationMap };
  landing.locationNotes = DTA_LOCATION_NOTES;
  landing.highlights = [
    {
      title: "NOXH đúng chính sách — sổ hồng lâu dài",
      text: "Dự án nhà ở xã hội trong DTA City, phục vụ công nhân KCN và các nhóm đối tượng theo Luật Nhà ở. Căn 30–52 m² (1PN & 2PN), thiết kế tối ưu cho gia đình trẻ.",
    },
    {
      title: "Giá 448–700 triệu/căn",
      text: "Bảng giá công bố theo diện tích: căn 1PN từ 448 triệu; 2PN compact từ ~520 triệu; 2PN rộng tới ~700 triệu. Xem loại hình sản phẩm và mặt bằng trên trang dự án.",
    },
    {
      title: "3 phương thức thanh toán",
      text: "Thanh toán theo tiến độ (không vay), thanh toán khi tham gia vay ngân hàng, hoặc lịch linh hoạt theo block — phù hợp dòng tiền từng hộ.",
    },
    {
      title: "Vay ngân hàng liên kết — từ 30% vốn tự có",
      text: "Vay tối đa 70% giá trị căn, thời hạn tối đa 20 năm; lãi suất ưu đãi 5,5%/năm 6 tháng đầu (theo website CĐT). Không cần thế chấp thêm ngoài căn hộ.",
    },
    {
      title: "Tiện ích nội khu + hệ sinh thái DTA",
      text: "TTTM 4 tầng, nhà trẻ, SH cộng đồng, công viên, 2 thang máy/tòa, an ninh 24/7, nhà xe 3 tầng; ngoại khu có BV, trường học, chợ DTA.",
    },
    {
      title: "2.192 căn — bàn giao từng giai đoạn",
      text: "16 block cao 5 tầng; đã bàn giao 4 block (560 căn), tiếp tục triển khai thêm khoảng 1.600 căn.",
    },
  ];
  landing.amenities = [
    "Trung tâm thương mại 4 tầng",
    "Nhà trẻ",
    "Phòng sinh hoạt cộng đồng",
    "Công viên cây xanh & khu vui chơi trẻ em",
    "2 thang máy/tòa",
    "An ninh 24/7",
    "Nhà xe cao 3 tầng",
    "Chợ truyền thống DTA",
    "Bệnh viện Quốc tế DTA",
    "Trường Mầm non & Tiểu học Quốc tế DTA",
  ];
  landing.faqs = [
    {
      q: "DTA Happy Home có phải nhà ở xã hội không?",
      a: "Đúng. Happy Home là dự án nhà ở xã hội thuộc Khu đô thị DTA City do Công ty Cổ phần Đệ Tam làm chủ đầu tư, dành cho công nhân KCN, người thu nhập thấp và các nhóm đối tượng theo Luật Nhà ở.",
    },
    {
      q: "Ai được mua DTA Happy Home?",
      a: "Người thuộc các nhóm đối tượng NOXH theo quy định (công nhân trong/ngoài KCN, người thu nhập thấp tại đô thị, hộ nghèo/cận nghèo, CBCCVC…). Mỗi hộ/cá nhân chỉ đăng ký một dự án NOXH.",
    },
    {
      q: "Giá DTA Happy Home bao nhiêu?",
      a: "Theo website CĐT, giá bán khoảng 448–700 triệu/căn tùy diện tích (32–52 m²). Liên hệ tư vấn để nhận bảng giá block đang mở bán.",
    },
    {
      q: "Phương thức thanh toán có những lựa chọn nào?",
      a: "Có 3 hình thức: thanh toán theo tiến độ (không vay), thanh toán khi tham gia vay ngân hàng tài trợ, và lịch linh hoạt theo block. Xem minh hoạ trong gallery mặt bằng & phương thức thanh toán trên trang dự án.",
    },
    {
      q: "DTA Happy Home hỗ trợ vay thế nào?",
      a: "Vốn tự có từ 30%, vay tối đa 70% giá trị căn, thời hạn tối đa 20 năm. Lãi suất ưu đãi 5,5%/năm trong 6 tháng đầu; sau đó theo lãi suất thả nổi cạnh tranh. Có thể tất toán sớm sau 3 năm với phí 0% (theo chính sách CĐT công bố).",
    },
    {
      q: "Tiến độ bàn giao DTA Happy Home?",
      a: "Đã bàn giao 4 block (560 căn); các suất Block A10 và giai đoạn tiếp theo bàn giao dự kiến Quý IV/2027 theo tiến độ CĐT.",
    },
    {
      q: "Diện tích và mặt bằng căn hộ?",
      a: "Căn 1PN và 2PN từ khoảng 30–52 m². Xem mặt bằng tổng thể, mặt bằng tầng và nhà mẫu trong gallery — nguồn website CĐT.",
    },
  ];
  landing.services = [
    {
      title: "Tính khoản vay mua nhà",
      text: "Ước tính trả góp hàng tháng theo giá căn DTA Happy Home — miễn phí trên HouseX.",
      href: "/cong-cu/tinh-khoan-vay",
    },
    {
      title: "Tư vấn tài chính & hồ sơ vay",
      text: "Đội ngũ HouseX hỗ trợ chuẩn bị hồ sơ và kết nối gói vay phù hợp NOXH.",
      href: "/tai-chinh",
    },
    {
      title: "Đăng ký tư vấn suất mua",
      text: "Nhận hướng dẫn điều kiện NOXH và quy trình đăng ký suất mua Happy Home.",
      href: "/lien-he",
    },
  ];
  landing.gallery = dtaHappyHomeGallery();
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn bảng giá, phương thức thanh toán và hồ sơ vay — liên hệ HouseX.";
  return landing;
}

export function buildDtaHappyHomeOverviewData() {
  return buildOverviewData(null, {
    totalUnits: 2192,
    blocks: 16,
    landing: buildDtaHappyHomeLanding(),
  });
}
