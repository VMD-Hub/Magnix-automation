/**
 * Trang Về đội ngũ & Biên tập — E-E-A-T, placeholder ảnh/LinkedIn.
 * Cập nhật portraitSrc và profileHref từng thành viên khi có hồ sơ.
 */

export type TeamMemberProfile = {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  /** Ảnh chân dung — null = placeholder initials. */
  portraitSrc?: string | null;
  /** LinkedIn hoặc /chuyen-gia/[slug] — null = ẩn link. */
  profileHref?: string | null;
  profileLabel?: string;
};

export type EditorialRole = {
  title: string;
  desc: string;
};

export const TEAM_EDITORIAL_PAGE = {
  metaTitle: "Về đội ngũ & Biên tập | House X",
  metaDescription:
    "Đội ngũ House X: ban lãnh đạo, biên tập viên kiểm duyệt và chuyên gia rà soát — cam kết thông tin BĐS rõ ràng, chuẩn xác và minh bạch.",
  title: "Về đội ngũ & Biên tập",
  intro:
    "Chúng tôi tin rằng công nghệ mạnh chỉ khi đi cùng con người có trách nhiệm. Đội ngũ House X là tập hợp những người làm sản phẩm, biên tập viên chuyên môn và chuyên gia ngành — cùng cam kết mang đến thông tin BĐS rõ ràng, chuẩn xác và dễ hiểu cho người dùng.",

  leadership: {
    heading: "Ban lãnh đạo",
    members: [
      {
        id: "leo-duong",
        name: "Leo Duong",
        role: "Người sáng lập",
        bio: "Tầm nhìn sản phẩm và chiến lược phát triển nền tảng. Hơn 10 năm trong lĩnh vực Proptech, marketing và công nghệ — xây House X từ nhu cầu thực tế của người tìm nhà.",
        initials: "LD",
        portraitSrc: null,
        profileHref: null,
        profileLabel: "Hồ sơ chuyên môn",
      },
      {
        id: "nguyen-thanh-vu",
        name: "Nguyễn Thanh Vũ",
        role: "Giám đốc vận hành",
        bio: "Chịu trách nhiệm vận hành nền tảng, quy trình kiểm duyệt tin và hợp tác với môi giới, chủ nhà và đối tác dịch vụ.",
        initials: "TV",
        portraitSrc: null,
        profileHref: null,
        profileLabel: "LinkedIn",
      },
      {
        id: "nguyen-gia-viet",
        name: "Nguyễn Gia Việt",
        role: "Giám đốc công nghệ",
        bio: "Dẫn dắt phát triển hệ thống đối chiếu địa chỉ, ảnh và giá; kiến trúc bảo mật dữ liệu và cơ chế bảo vệ liên hệ trên sàn.",
        initials: "GV",
        portraitSrc: null,
        profileHref: null,
        profileLabel: "LinkedIn",
      },
    ] satisfies TeamMemberProfile[],
  },

  editorialTeam: {
    heading: "Đội ngũ biên tập & kiểm duyệt",
    intro:
      "House X có đội ngũ biên tập viên chuyên trách kiểm tra nội dung tin đăng trước khi hiển thị. Mỗi tin trải qua cả bước tự động và bước rà soát thủ công để đảm bảo tiêu chuẩn chất lượng.",
    roles: [
      {
        title: "Biên tập viên nội dung",
        desc: "Rà soát mô tả, tiêu đề, phân loại tin và chuẩn hóa thông tin hiển thị.",
      },
      {
        title: "Biên tập viên hình ảnh",
        desc: "Kiểm tra ảnh thật, phát hiện ảnh stock hoặc sao chép; yêu cầu bổ sung hình khi cần.",
      },
      {
        title: "Biên tập viên pháp lý & chuyên môn",
        desc: "Rà soát tin phức tạp về pháp lý, NOXH và dự án quy hoạch.",
      },
      {
        title: "Quản lý chất lượng (QA)",
        desc: "Giám sát KPI kiểm duyệt và xử lý báo cáo từ người dùng.",
      },
    ] satisfies EditorialRole[],
  },

  advisoryExperts: {
    heading: "Chuyên gia tư vấn độc lập",
    intro:
      "Để nâng cao độ chính xác ở các mảng chuyên sâu, House X hợp tác với chuyên gia nghề nghiệp — kèm hồ sơ công khai, vai trò rà soát và tần suất tham gia.",
    /** slug khớp HOUSEX_EXPERTS — bổ sung slug khác khi có hồ sơ. */
    expertSlugs: ["noxh-policy"] as const,
  },

  responsibilities: {
    heading: "Vai trò và trách nhiệm biên tập",
    items: [
      "Chuẩn hóa thông tin: đảm bảo vị trí, diện tích, số phòng, tiện ích và giá nhắc đúng chuẩn hiển thị.",
      "Kiểm chứng hình ảnh: yêu cầu ảnh thực tại bất động sản; loại bỏ ảnh stock hoặc không liên quan.",
      "Ghi nhãn trạng thái tin: hiển thị trạng thái kiểm chứng (Đã xác minh / Chờ xác minh / Chưa xác minh).",
      "Xử lý báo cáo: phản hồi báo cáo sai sót từ người dùng trong SLA đã công bố (48–72 giờ làm việc).",
      "Bảo vệ quyền riêng tư: mã hóa thông tin liên hệ, chỉ hiển thị theo cơ chế an toàn.",
    ],
  },

  workflow: {
    heading: "Quy trình làm việc (tóm tắt)",
    steps: [
      "Nhận tin: tiếp nhận từ môi giới, chủ nhà, CTV hoặc nguồn tự động.",
      "Kiểm tra tự động: hệ thống đối chiếu địa chỉ, so sánh giá và rà soát ảnh.",
      "Kiểm duyệt thủ công: biên tập viên kiểm tra nội dung, bổ sung yêu cầu nếu thiếu.",
      "Hiển thị có nhãn: tin được đăng kèm trạng thái kiểm chứng.",
      "Theo dõi & cập nhật: nhận báo cáo từ cộng đồng, chỉnh sửa hoặc gỡ bỏ khi cần.",
    ],
  },

  culture: {
    heading: "Văn hóa đội ngũ",
    items: [
      "Tôn trọng người dùng: đặt quyền lợi người mua làm trọng tâm mọi quyết định sản phẩm.",
      "Minh bạch và chịu trách nhiệm: công khai tiêu chí kiểm duyệt và sẵn sàng giải thích quyết định biên tập.",
      "Liên tục cải tiến: lắng nghe phản hồi, cập nhật thuật toán và tiêu chuẩn dựa trên dữ liệu thực tế.",
    ],
  },

  contact: {
    heading: "Cách gặp gỡ & liên hệ đội ngũ biên tập",
    channels: [
      {
        title: "Báo tin sai / đề nghị chỉnh sửa",
        desc: "Dùng nút báo cáo trên tin đăng hoặc gửi qua trang Liên hệ — ghi rõ mã tin để xử lý nhanh hơn.",
        href: "/lien-he",
        linkLabel: "Liên hệ biên tập",
      },
      {
        title: "Hợp tác chuyên gia / truyền thông",
        desc: "Đối tác dự án, môi giới và truyền thông — xem trang Hợp tác hoặc gửi form liên hệ.",
        href: "/hop-tac",
        linkLabel: "Hợp tác với House X",
      },
      {
        title: "Tuyển dụng",
        desc: "Muốn gia nhập đội ngũ House X? Gửi CV qua trang Liên hệ — chúng tôi phản hồi khi có vị trí phù hợp.",
        href: "/lien-he?dich-vu=tuyen-dung",
        linkLabel: "Liên hệ tuyển dụng",
      },
    ],
  },

  cta: {
    title: "Hãy hợp tác với House X",
    body: "Nếu bạn là chủ đầu tư dự án, chủ nhà hoặc môi giới muốn nâng cao chất lượng tin — cùng chúng tôi xây thị trường minh bạch hơn.",
    primary: { label: "Đăng ký hợp tác ngay", href: "/hop-tac" },
    secondary: { label: "Phương pháp biên tập", href: "/gioi-thieu/phuong-phap-bien-tap" },
  },
} as const;

/** Ảnh thành viên — ưu tiên portraitSrc trong config, sau đó env NEXT_PUBLIC_TEAM_PORTRAIT_{ID}. */
export function getTeamMemberPortraitSrc(member: TeamMemberProfile): string | null {
  if (member.portraitSrc) return member.portraitSrc;
  const envKey = `NEXT_PUBLIC_TEAM_PORTRAIT_${member.id.replace(/-/g, "_").toUpperCase()}`;
  const fromEnv = process.env[envKey]?.trim();
  if (fromEnv) return fromEnv;
  if (member.id === "leo-duong") {
    const founder = process.env.NEXT_PUBLIC_FOUNDER_PORTRAIT_URL?.trim();
    if (founder) return founder;
  }
  return null;
}
