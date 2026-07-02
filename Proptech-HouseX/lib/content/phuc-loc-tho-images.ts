/** Ảnh tham chiếu dự án (mogivi.vn / tư liệu công khai) — admin host CDN HouseX trước go-live. */
const MOGIVI_CMS = "https://abtgroupcms.mogivi.vn/media";
const MOGIVI_CDN = "https://cdn.mogivi.vn";

export const PHUC_LOC_THO_PUBLISHED_IMAGES = {
  hero: {
    url: `${MOGIVI_CMS}/qyobje4c/chung-cu-phuc-loc-tho.jpg`,
    alt: "Chung cư Phúc Lộc Thọ — 35 Lê Văn Chí, Thủ Đức",
  },
  developerLogo: `${MOGIVI_CMS}/duohtb3v/emerald-apartment.jpg`,
  locationMap: {
    url: `${MOGIVI_CDN}/702A67EA-4752-44C4-8FAD-FBAB0A6A840E.jpg`,
    alt: "Vị trí Chung cư Phúc Lộc Thọ — ngã tư Thủ Đức, Lê Văn Chí",
    caption: "Minh hoạ kết nối vùng — tham khảo theo tư liệu dự án",
  },
  gallery: [
    {
      url: `${MOGIVI_CMS}/qyobje4c/chung-cu-phuc-loc-tho.jpg`,
      caption: "Tổng quan chung cư Phúc Lộc Thọ (Emerald Apartment)",
    },
    {
      url: `${MOGIVI_CDN}/945C8547-DCE6-4702-8AF2-091117530860.jpg`,
      caption: "Phối cảnh block cao 16 tầng",
    },
    {
      url: `${MOGIVI_CDN}/867C7405-056F-43A8-9498-AD32309B8B62.jpg`,
      caption: "Khu vực dự án mặt tiền Lê Văn Chí",
    },
    {
      url: `${MOGIVI_CDN}/484C20DF-FFD7-46C7-AA49-B38C09A2E311.jpg`,
      caption: "Không gian sống nội khu",
    },
    {
      url: `${MOGIVI_CDN}/BB377948-E13D-46A6-A68B-762675B7E9AF.jpg`,
      caption: "Tiện ích & cảnh quan xung quanh",
    },
    {
      url: `${MOGIVI_CDN}/702A67EA-4752-44C4-8FAD-FBAB0A6A840E.jpg`,
      caption: "Kết nối giao thông khu vực Thủ Đức",
    },
  ],
} as const;
