/**
 * 4 bài SEO chuyên mục CTV — `/affiliate-bat-dong-san/[slug]`.
 * Không công bố bảng hoa hồng theo cấp / số tiền cố định.
 */

import { CTV_AFFILIATE_PATH } from "@/lib/content/ctv-affiliate-landing";

export type CtvAffiliateArticle = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  seoTitle: string;
  seoDesc: string;
  publishedAt: string;
};

const HUB = CTV_AFFILIATE_PATH;
const SLUG_PILLAR = "cat-mau-hoa-hong-moi-gioi-va-cong-tac-vien-minh-bach";
const SLUG_MODEL = "mo-hinh-cong-tac-vien-bat-dong-san-house-x";
const SLUG_PERSONA = "chan-dung-doi-tac-cong-tac-vien-bds";
const SLUG_GUIDE = "dang-ky-ctv-ban-hang-lien-ket-huong-dan";

export const CTV_AFFILIATE_ARTICLE_SLUGS = [
  SLUG_PILLAR,
  SLUG_MODEL,
  SLUG_PERSONA,
  SLUG_GUIDE,
] as const;

export function ctvAffiliateArticlePath(slug: string): string {
  return `${HUB}/${slug}`;
}

const CTA_BLOCK = `## Đăng ký cộng tác viên House X

Tạo [tài khoản cộng tác viên](/dang-ky/moi-gioi?next=/moi-gioi/dang-ky-ctv), nộp [hồ sơ CTV](/moi-gioi/dang-ky-ctv), hoặc [liên hệ](/lien-he) nếu bạn muốn hỏi trước. Cơ chế thưởng chi tiết mở sau khi hồ sơ được duyệt — không công bố bảng số trên trang công khai.

Xem tổng quan chương trình: [${HUB}](${HUB}).`;

export const CTV_AFFILIATE_ARTICLES: readonly CtvAffiliateArticle[] = [
  {
    slug: SLUG_PILLAR,
    title:
      "Cắt máu hoa hồng môi giới là gì? Vì sao cuộc đua này hại cả người bán lẫn người mua",
    excerpt:
      "Cắt máu — trả lại phần lớn hoa hồng cá nhân để chốt deal — đẩy nghề xuống đáy: mất hậu mãi, phí ngầm, niềm tin sụp. Có đường khác: cộng tác viên minh bạch trên House X.",
    seoTitle: "Cắt máu hoa hồng môi giới — vòng xoáy và lối ra CTV | House X",
    seoDesc:
      "Cắt máu hoa hồng là gì, vì sao hại cả nghề và khách hàng, và cộng tác viên House X khác cuộc đua ngoài luồng thế nào — không hứa bảng thưởng công khai.",
    publishedAt: "2026-07-27T10:00:00.000Z",
    body: `## Cắt máu hoa hồng đang biến nghề thành cuộc đua xuống đáy

Trong bất động sản, “cắt máu” là khi người làm trung gian tự nguyện trả lại một phần — đôi khi gần hết — hoa hồng cá nhân cho khách để đổi lấy cái gật đầu chốt cọc. Nhiều người mua coi đó là “bớt lộc” xứng đáng. Nhiều người bán coi đó là “linh hoạt để sống”.

Dưới góc nhìn thực tế nghề, đây là cuộc đua xuống đáy: các bên kéo nhau vào vòng xoáy tự hủy giá trị lao động. Một khi biên thưởng bị ép về mức gần bằng không, chuỗi trách nhiệm sau ký cũng mỏng đi.

## Hai hệ lụy đen khi đã cắt máu để tranh khách

### Hậu mãi và pháp lý bị cắt theo

Hoa hồng không phải tiền từ trên trời. Đó là chi phí cho thời gian, chất xám và trách nhiệm dài hạn quanh hồ sơ, tranh chấp, cấp sổ. Khi lợi nhuận sau cắt máu kiệt quệ, động lực đồng hành sau ký thường biến mất: khách bị bỏ rơi, không còn người rà soát, không ai cầm tay làm thủ tục. Số tiền tưởng “tiết kiệm” thực chất có thể là khoản cắt đi từ sự an toàn pháp lý của chính giao dịch.

### Bù đắp sai lệch và phí ngầm

Để sống sau khi đã cắt máu tranh khách, một bộ phận bất chính tìm cách bù: bóp méo thông tin, “vẽ bùa” thủ tục để thu phí dịch vụ vài triệu vô căn cứ, hoặc đẩy khách vào hợp đồng biến tướng. Cắt máu ngoài luồng biến mối quan hệ tư vấn dựa trên niềm tin thành trò rượt đuổi mập mờ — làm xấu hình ảnh người làm nghề chân chính.

## Khách “hời” thật không?

Khách nghĩ mình thắng vì nhận lại một phần hoa hồng. Thực tế họ thường đánh đổi:

- Ít hỗ trợ sau ký hơn khi biên thưởng của bên kia đã cạn.
- Rủi ro phí hồ sơ / lời hứa ngoài hợp đồng CĐT.
- Khó phân biệt ưu đãi dự án chính thức với cắt hoa hồng cá nhân ngoài luồng.

Muốn tối ưu chi phí đúng luật, hãy tách: chính sách dự án / đợt mở bán (có công bố) khác với đòi cắt hoa hồng cá nhân không kiểm chứng được.

## Lối ra: cộng tác viên minh bạch, không đua cắt máu

Thay vì giấu thưởng rồi bị ép cắt ngoài luồng, House X mở chương trình [cộng tác viên / bán hàng liên kết](${HUB}): đăng ký, hoàn tất hồ sơ, được duyệt — rồi mới xem cơ chế thưởng trong hệ thống. Bạn có thể giới thiệu, bán hoặc mua cho mình trên cùng luật chơi rõ ràng.

Đọc tiếp:

- [Mô hình cộng tác viên BĐS House X](${ctvAffiliateArticlePath(SLUG_MODEL)})
- [Chân dung đối tác phù hợp](${ctvAffiliateArticlePath(SLUG_PERSONA)})
- [Hướng dẫn đăng ký CTV](${ctvAffiliateArticlePath(SLUG_GUIDE)})

${CTA_BLOCK}
`,
  },
  {
    slug: SLUG_MODEL,
    title:
      "Mô hình cộng tác viên bất động sản House X: từ đối thủ ngoài luồng thành đối tác có hồ sơ",
    excerpt:
      "CTV House X: đăng ký tài khoản, nộp hồ sơ, duyệt mã — rồi giới thiệu hoặc mua đúng kênh. Thưởng theo quy trình sau duyệt; không đua cắt máu ngoài luồng.",
    seoTitle: "Mô hình cộng tác viên BĐS House X — luật chơi minh bạch | House X",
    seoDesc:
      "Cộng tác viên bất động sản House X vận hành thế nào: đăng ký, hồ sơ, duyệt mã, giới thiệu hoặc mua — cơ chế thưởng sau duyệt, không bảng số công khai.",
    publishedAt: "2026-07-27T11:00:00.000Z",
    body: `## Vì sao cần mô hình khác cuộc đua cắt máu?

Khi hoa hồng bị mặc cả ngoài luồng, cả người bán lẫn người mua đều khó tin quy trình. House X tái cấu trúc bằng chương trình cộng tác viên: ghi nhận giới thiệu / bán hàng liên kết qua hồ sơ và mã — thay vì “bớt lộc” miệng.

Xem gốc nỗi đau: [Cắt máu hoa hồng môi giới](${ctvAffiliateArticlePath(SLUG_PILLAR)}).

## Luật chơi bốn bước (không lộ bảng thưởng công khai)

1. Tạo tài khoản cộng tác viên — đăng ký bán hàng liên kết trên House X.
2. Nộp và hoàn tất hồ sơ CTV — vùng làm việc, kinh nghiệm, động lực; khóa hội nhập khi được yêu cầu.
3. Được duyệt và nhận mã — admin cấp mã khi đủ điều kiện; lúc này mới mở cơ chế thưởng chi tiết trong tài khoản.
4. Giới thiệu, bán hoặc mua đúng kênh — lead gắn mã; mức hỗ trợ tư vấn/chốt từ House X tùy năng lực và chứng chỉ (xem sau duyệt).

House X không đăng bảng hoa hồng hay “cấp thưởng” trên trang công khai. Điều đó tránh hiểu nhầm và giữ đúng quy trình nội bộ.

## Bạn làm gì được sau khi có mã?

- Giới thiệu người thân / khách — House X có thể hỗ trợ tư vấn và chốt nếu bạn không muốn đóng vai bán hàng.
- Bán hàng liên kết trên sản phẩm / dự án đang mở theo quy trình claim.
- Mua cho chính mình trên cùng luật chơi minh bạch — không ép ai cắt máu để “ưu đãi”.

## Khác gì môi giới chỉ đăng tin?

Đăng tin đưa sản phẩm lên sàn. Cộng tác viên gắn mã giới thiệu, claim và thưởng theo quy trình House X. Bạn có thể làm cả hai khi đủ điều kiện tài khoản. Chi tiết bước: [Hướng dẫn đăng ký CTV](${ctvAffiliateArticlePath(SLUG_GUIDE)}).

Ai phù hợp: [Chân dung đối tác](${ctvAffiliateArticlePath(SLUG_PERSONA)}).

${CTA_BLOCK}
`,
  },
  {
    slug: SLUG_PERSONA,
    title:
      "Chân dung đối tác cộng tác viên BĐS: ai nên tham gia chương trình House X?",
    excerpt:
      "Nhân viên ngân hàng, bảo hiểm, chứng khoán, môi giới tự do, người chỉ muốn giới thiệu, người mua cho mình — chân dung rõ để tự nhận diện trước khi đăng ký CTV.",
    seoTitle: "Chân dung cộng tác viên BĐS House X — ai phù hợp? | House X",
    seoDesc:
      "Đối tượng cộng tác viên House X: ngân hàng, bảo hiểm, chứng khoán, MG tự do, giới thiệu người thân, tự mua — nỗi đau và việc làm trên hệ thống.",
    publishedAt: "2026-07-27T12:00:00.000Z",
    body: `## Không chỉ dành cho môi giới bất động sản

Chương trình cộng tác viên House X mở cho ai có mạng lưới, nhu cầu mua, hoặc muốn giới thiệu đúng kênh — sau khi hoàn tất hồ sơ. Dưới đây là chân dung thường gặp.

Tổng quan mô hình: [Mô hình CTV House X](${ctvAffiliateArticlePath(SLUG_MODEL)}).

## Nhân viên ngân hàng, bảo hiểm, chứng khoán

Nỗi đau: Khách tin bạn về tài chính nhưng hỏi nhà / NOXH / dự án — bạn không muốn (hoặc không được) đóng vai “cò cắt máu”.

Trên House X: Giới thiệu đúng kênh; sau duyệt mã, lead được ghi nhận. Bạn giữ vai trò người tin cậy; đội ngũ House X hỗ trợ tư vấn sản phẩm tùy mức sau duyệt.

## Môi giới bất động sản tự do

Nỗi đau: Bị kéo vào đua cắt máu; mất giá trị tư vấn và hậu mãi.

Trên House X: Bán trên nền tảng có quy trình claim; tập trung chuyên môn pháp lý / lựa chọn căn — không lấy “cắt nhiều nhất” làm lợi thế cạnh tranh. Đọc thêm [vòng xoáy cắt máu](${ctvAffiliateArticlePath(SLUG_PILLAR)}).

## Người có mạng lưới nhưng ngại bán

Nỗi đau: Người thân / đồng nghiệp muốn mua; bạn ngại ra mặt tư vấn và sợ bị kéo vào mặc cả hoa hồng.

Trên House X: Chỉ giới thiệu; House X hỗ trợ tư vấn và chốt theo quy trình sau duyệt. Bạn không phải diễn vai môi giới nếu không muốn.

## Người mua cho chính mình

Nỗi đau: Không muốn ép môi giới cắt máu; cũng không tin “bớt lộc” thiếu minh bạch.

Trên House X: Đi cùng luật chơi CTV — thưởng / ưu đãi (nếu có) theo hồ sơ sau duyệt, không dựa trên thỏa thuận miệng ngoài luồng.

## Truyền thông, HR, công đoàn, mạng lưới KCN

Nỗi đau: Có đối tượng quan tâm nhà ở / NOXH nhưng thiếu kênh sản phẩm và quy trình sạch.

Trên House X: Giới thiệu có kiểm chứng; gắn mã sau duyệt; đồng hành nội dung / dự án khi phù hợp.

## Bạn thuộc nhóm nào — bước tiếp theo

1. Đối chiếu chân dung ở trên.
2. Đọc [hướng dẫn đăng ký](${ctvAffiliateArticlePath(SLUG_GUIDE)}).
3. Nộp hồ sơ; cơ chế thưởng chi tiết chỉ mở sau duyệt.

${CTA_BLOCK}
`,
  },
  {
    slug: SLUG_GUIDE,
    title:
      "Đăng ký CTV bán hàng liên kết House X: hướng dẫn từng bước và câu hỏi thường gặp",
    excerpt:
      "Từ tạo tài khoản đến nộp hồ sơ CTV, duyệt mã và bắt đầu giới thiệu — checklist thực tế, FAQ, CTA. Không kèm bảng hoa hồng công khai.",
    seoTitle: "Đăng ký CTV bán hàng liên kết House X — hướng dẫn | House X",
    seoDesc:
      "Cách đăng ký cộng tác viên House X: tài khoản, hồ sơ CTV, duyệt mã, FAQ — cơ chế thưởng sau duyệt, không bảng số trên trang công khai.",
    publishedAt: "2026-07-27T13:00:00.000Z",
    body: `## Bạn sẽ đi những bước nào?

1. Đọc [tổng quan chương trình](${HUB}) và [mô hình CTV](${ctvAffiliateArticlePath(SLUG_MODEL)}).
2. [Đăng ký tài khoản cộng tác viên](/dang-ky/moi-gioi?next=/moi-gioi/dang-ky-ctv).
3. [Nộp hồ sơ CTV](/moi-gioi/dang-ky-ctv) (cần đã đăng nhập tài khoản).
4. Hoàn thành khóa hội nhập nếu được yêu cầu; chờ admin duyệt và cấp mã.
5. Sau duyệt: xem cơ chế thưởng trong tài khoản; bắt đầu giới thiệu / bán / mua đúng kênh.

## Checklist trước khi nộp hồ sơ

- Biết mình thuộc chân dung nào: [Chân dung đối tác](${ctvAffiliateArticlePath(SLUG_PERSONA)}).
- Chuẩn bị mô tả vùng làm việc / mạng lưới / động lực (form yêu cầu).
- Không kỳ vọng thấy bảng hoa hồng trên trang marketing — chỉ sau duyệt.

## Câu hỏi thường gặp

### Tôi chưa làm môi giới BĐS có đăng ký được không?

Được quan tâm và nộp hồ sơ nếu bạn có nhu cầu giới thiệu, bán hàng liên kết hoặc mua qua House X. Điều kiện duyệt do House X xác nhận theo hồ sơ.

### Có cần chứng chỉ môi giới ngay từ đầu?

Không bắt buộc để đăng ký quan tâm. Mức hỗ trợ và cơ chế thưởng sau duyệt có thể khác nhau tùy bạn tự tư vấn/chốt hay nhờ House X, và tùy chứng chỉ — chi tiết trong tài khoản sau duyệt.

### Khi nào biết mức thưởng?

Sau khi hoàn tất hồ sơ và được admin duyệt. Trang công khai không đăng bảng số.

### Khác gì chỉ đăng tin?

Đăng tin = đưa sản phẩm lên sàn. CTV = mã giới thiệu + claim + thưởng theo quy trình. Có thể làm cả hai khi đủ điều kiện.

### Tôi chỉ muốn hỏi trước khi đăng ký?

Dùng [liên hệ](/lien-he) hoặc đọc lại [hub cộng tác viên](${HUB}).

${CTA_BLOCK}
`,
  },
];

export function getCtvAffiliateArticle(
  slug: string,
): CtvAffiliateArticle | undefined {
  return CTV_AFFILIATE_ARTICLES.find((a) => a.slug === slug);
}

export function listCtvAffiliateArticleCards(): {
  slug: string;
  title: string;
  excerpt: string;
  href: string;
  publishedAt: string;
}[] {
  return CTV_AFFILIATE_ARTICLES.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    href: ctvAffiliateArticlePath(a.slug),
    publishedAt: a.publishedAt,
  }));
}
