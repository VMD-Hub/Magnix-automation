import { articlePath } from "@/lib/content/article-routes";
import { NOXH_SUPPORT_CLOSING } from "@/lib/content/articles/article-editorial-voice";
import { NOXH_TAG_DU_AN_GIA } from "@/lib/content/articles/noxh-handbook-tags";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import type { ArticleDetail } from "@/lib/data/article-types";
import {
  HN_FLC_DAI_MO_SLUG,
  HN_GREEN_TOWER_ME_TRI_SLUG,
  HN_HIM_LAM_THUONG_THANH_SLUG,
  HN_RICE_CITY_SONG_HONG_SLUG,
  HN_RICE_CITY_TO_HUU_SLUG,
} from "@/lib/preview/noxh-hanoi-projects";
import { HANOI_GROWTH_CORRIDORS_PILLAR_SLUG } from "@/lib/content/growth-corridors-hanoi";

const PUBLISHED = new Date("2026-07-28T00:00:00.000Z");
const TAG = NOXH_TAG_DU_AN_GIA;
const PILLAR_HN = `/tin-tuc/kien-thuc/${HANOI_GROWTH_CORRIDORS_PILLAR_SLUG}`;
const WEST_AN_CU =
  "/tin-tuc/kien-thuc/an-cu-phia-tay-nam-tu-liem-my-dinh-2026";
const EAST_REALITY =
  "/tin-tuc/kien-thuc/du-an-dai-do-thi-chung-cu-truc-phia-dong-ha-noi-2026";

export const SLUG_HN_WEST_NOXH_HUB =
  "noxh-phia-tay-ha-noi-dai-mo-to-huu-me-tri-2026" as const;
export const SLUG_HN_EAST_NOXH_HUB =
  "noxh-long-bien-him-lam-phuc-loi-rice-city-2026" as const;

/**
 * P1 — hub SEO lite cho cụm NOXH Hà Nội đang tăng tìm kiếm (Trends).
 * Không bịa giá / số căn; nối landing + điều kiện + đăng ký.
 */
export const NOXH_HANOI_TRENDING_HUB_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-hn-noxh-west-hub-2026",
    slug: SLUG_HN_WEST_NOXH_HUB,
    title:
      "NOXH phía Tây Hà Nội: Đại Mỗ, Tố Hữu và Mễ Trì — bản đồ tên gọi & bước kiểm tra",
    excerpt:
      "Cụm nhà ở xã hội Nam Từ Liêm đang được tìm nhiều: FLC / Green Tower Đại Mỗ, Rice City Tố Hữu, Green Tower Mễ Trì (Tây Nam Mễ Trì). Bài này khớp tên gọi, vị trí và bước rà điều kiện — không công bố giá khi chưa có số chính thức.",
    body: `## Vì sao cụm Đại Mỗ – Tố Hữu – Mễ Trì đang được tìm nhiều?

Phía Tây nội đô (Nam Từ Liêm – Mỹ Đình – Đại Mỗ – Tố Hữu) tập trung việc làm, hạ tầng và quỹ nhà chung cư mới. Trên tìm kiếm, người mua thường gõ tên thương mại hoặc biệt danh khu vực trước khi tìm đúng slug dự án nhà ở xã hội. Ba điểm cần khớp trước khi nộp hồ sơ: đúng địa chỉ CĐT, đúng đợt mở bán, đúng điều kiện đối tượng.

Bối cảnh an cư phía Tây: [An cư Nam Từ Liêm – Mỹ Đình](${WEST_AN_CU}) · Khung vùng: [Năm trục tăng trưởng Vùng Thủ đô](${PILLAR_HN}).

${EDITORIAL_FIGURES.hcmSkyline}

## Ba dự án trên House X — tên gọi thường gặp

| Tên trên tìm kiếm | Tên trên House X | Địa bàn | Trang dự án |
| --- | --- | --- | --- |
| Green Tower Đại Mỗ / FLC Đại Mỗ | FLC Garden City (HH1/HH4) | Đại Mỗ, Nam Từ Liêm | [/du-an/${HN_FLC_DAI_MO_SLUG}](/du-an/${HN_FLC_DAI_MO_SLUG}) |
| Rice City Tố Hữu | Rice City Tố Hữu | Mễ Trì – Trung Văn | [/du-an/${HN_RICE_CITY_TO_HUU_SLUG}](/du-an/${HN_RICE_CITY_TO_HUU_SLUG}) |
| Tây Nam Mễ Trì / Green Tower Mễ Trì | Green Tower Mễ Trì | Mễ Trì, Nam Từ Liêm | [/du-an/${HN_GREEN_TOWER_ME_TRI_SLUG}](/du-an/${HN_GREEN_TOWER_ME_TRI_SLUG}) |

Green Tower Đại Mỗ và FLC Garden City trên inventory là cùng địa điểm (không phải hai dự án khác nhau). Tây Nam Mễ Trì là cụm khu vực — luôn đối chiếu địa chỉ trên trang dự án và thông báo CĐT.

## Giá và suất đang ở trạng thái nào?

House X chưa công bố bảng giá hay số suất cho các dự án này trên trang dự án, vì số liệu chính thức phải đến từ Sở Xây dựng Hà Nội hoặc chủ đầu tư. Trang dự án ghi rõ đang xác minh — tránh đặt cọc / giữ suất ngoài kênh công bố.

Khi có công bố, House X cập nhật landing; trước đó hãy dùng điều kiện pháp lý chung để tự loại hồ sơ không đạt.

## Nên kiểm tra gì trước khi đăng ký?

1. Đủ ba trụ đối tượng – nhà ở – thu nhập: [Điều kiện mua nhà ở xã hội 2026](${articlePath("dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat")}) · [/cong-cu/dieu-kien-noxh](/cong-cu/dieu-kien-noxh).
2. Thứ tự hồ sơ / đơn mẫu: [Đăng ký nhà ở xã hội](${articlePath("dang-ky-nha-o-xa-hoi")}).
3. Chọn đúng một dự án trong đợt — đọc FAQ alias trên từng landing để khỏi nhầm tên.
4. Theo dõi thông báo mở bán; không chuyển khoản “giữ chỗ” cho tài khoản cá nhân ngoài hợp đồng chính thức.

Danh mục tỉnh: [/du-an/nha-o-xa-hoi/ha-noi](/du-an/nha-o-xa-hoi/ha-noi).

${NOXH_SUPPORT_CLOSING}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "NOXH Đại Mỗ, Tố Hữu, Mễ Trì — tên gọi & bước kiểm tra | House X",
    seoDesc:
      "Green Tower Đại Mỗ / FLC, Rice City Tố Hữu, Tây Nam Mễ Trì: khớp tên gọi với trang dự án House X, bước điều kiện và đăng ký — chưa công bố giá khi chưa có số chính thức.",
    tags: [{ slug: TAG.slug, name: TAG.name }],
    projects: [
      {
        slug: HN_FLC_DAI_MO_SLUG,
        name: "Nhà ở xã hội FLC Garden City Đại Mỗ",
      },
      {
        slug: HN_RICE_CITY_TO_HUU_SLUG,
        name: "Nhà ở xã hội Rice City Tố Hữu",
      },
      {
        slug: HN_GREEN_TOWER_ME_TRI_SLUG,
        name: "Nhà ở xã hội Green Tower Mễ Trì",
      },
    ],
  },
  {
    id: "article-hn-noxh-east-hub-2026",
    slug: SLUG_HN_EAST_NOXH_HUB,
    title:
      "NOXH Long Biên: Him Lam Phúc Lợi và Rice City Thạch Bàn — khớp tên & bước hồ sơ",
    excerpt:
      "Hai dự án nhà ở xã hội Long Biên đang tăng tìm kiếm: Him Lam Phúc Lợi (Him Lam Thượng Thanh) và Rice City Thạch Bàn (Rice City Sông Hồng). Bài khớp alias, vị trí bờ Đông và lộ trình kiểm tra điều kiện.",
    body: `## Long Biên đang hút tìm kiếm nhà ở xã hội vì đâu?

Long Biên nằm trên hướng Đông sông Hồng — cửa ngõ nội đô trước khi nối tiếp Gia Lâm / Hưng Yên trên hành lang Đông – Đông Nam Vùng Thủ đô. Người tìm nhà ở xã hội thường gõ tên thương mại (Him Lam Phúc Lợi, Rice City Thạch Bàn) trước khi tìm đúng trang dự án.

Bối cảnh đô thị phía Đông: [Dự án đại đô thị / chung cư trục phía Đông](${EAST_REALITY}) · [Năm trục tăng trưởng Vùng Thủ đô](${PILLAR_HN}).

${EDITORIAL_FIGURES.hcmSkyline}

## Hai dự án — tên gọi trên tìm kiếm và trên House X

| Tên trên tìm kiếm | Tên trên House X | Địa bàn | Trang dự án |
| --- | --- | --- | --- |
| Him Lam Phúc Lợi | Him Lam Thượng Thanh | Thượng Thanh, Long Biên | [/du-an/${HN_HIM_LAM_THUONG_THANH_SLUG}](/du-an/${HN_HIM_LAM_THUONG_THANH_SLUG}) |
| Rice City Thạch Bàn | Rice City Sông Hồng | Thạch Bàn, Long Biên | [/du-an/${HN_RICE_CITY_SONG_HONG_SLUG}](/du-an/${HN_RICE_CITY_SONG_HONG_SLUG}) |

Him Lam Phúc Lợi và Him Lam Thượng Thanh là cùng dự án trên inventory. Rice City Thạch Bàn là alias theo phường của Rice City Sông Hồng.

## Giá đã công bố chưa?

Chưa trên trang House X. Landing ghi trạng thái đang xác minh theo công bố Sở / CĐT. Không dùng tin đồn giá trên mạng để đặt cọc.

## Việc nên làm trước khi nộp hồ sơ Long Biên

1. [Nhà ở xã hội là gì?](${articlePath("nha-o-xa-hoi-la-gi")}) — nắm mua / thuê / thuê mua.
2. [Điều kiện mua 2026](${articlePath("dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat")}) và [/cong-cu/dieu-kien-noxh](/cong-cu/dieu-kien-noxh).
3. [Đăng ký nhà ở xã hội](${articlePath("dang-ky-nha-o-xa-hoi")}) — đơn mẫu và thứ tự nộp.
4. Mở đúng landing ở bảng trên; đọc FAQ alias để tránh nộp nhầm dự án.
5. Hub tỉnh: [/du-an/nha-o-xa-hoi/ha-noi](/du-an/nha-o-xa-hoi/ha-noi).

${NOXH_SUPPORT_CLOSING}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "NOXH Long Biên: Him Lam Phúc Lợi & Rice City Thạch Bàn | House X",
    seoDesc:
      "Him Lam Phúc Lợi (Thượng Thanh) và Rice City Thạch Bàn (Sông Hồng): khớp tên gọi với trang dự án, bước điều kiện và đăng ký hồ sơ — giá đang xác minh.",
    tags: [{ slug: TAG.slug, name: TAG.name }],
    projects: [
      {
        slug: HN_HIM_LAM_THUONG_THANH_SLUG,
        name: "Nhà ở xã hội Him Lam Thượng Thanh",
      },
      {
        slug: HN_RICE_CITY_SONG_HONG_SLUG,
        name: "Nhà ở xã hội Rice City Sông Hồng",
      },
    ],
  },
];
