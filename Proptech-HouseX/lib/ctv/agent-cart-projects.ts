/** Kho sản phẩm hợp tác — Giỏ hàng web (parity Mini static catalog). */
export type AgentCartProject = {
  id: string;
  name: string;
  kind: string;
  lane: "noxh" | "cctm";
  area: string;
  price: string;
  tag: string;
};

export const AGENT_CART_PROJECTS: AgentCartProject[] = [
  {
    id: "noxh-1",
    name: "NOXH An Bình",
    kind: "Nhà ở xã hội",
    lane: "noxh",
    area: "Bình Dương",
    price: "Từ 980 triệu",
    tag: "Đang mở bán",
  },
  {
    id: "noxh-2",
    name: "NOXH Phú Lợi",
    kind: "Nhà ở xã hội",
    lane: "noxh",
    area: "TP.HCM",
    price: "Từ 1,15 tỷ",
    tag: "Ưu tiên CTV",
  },
  {
    id: "cctm-1",
    name: "Chung cư tầm trung Riverside",
    kind: "CCTM",
    lane: "cctm",
    area: "Thủ Đức",
    price: "Từ 2,1 tỷ",
    tag: "Còn quỹ",
  },
  {
    id: "cctm-2",
    name: "CCTM Green Park",
    kind: "Chung cư tầm trung",
    lane: "cctm",
    area: "Hà Nội",
    price: "Từ 1,8 tỷ",
    tag: "Sắp mở",
  },
];
