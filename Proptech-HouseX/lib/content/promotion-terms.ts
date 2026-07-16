import { PROMOTION_LIMITS } from "@/lib/promotion/constants";

export const PROMOTION_TERMS_VERSION = "2026-03-v2";

export type PromotionTermsInput = {
  campaignName: string;
  startAt: Date;
  endAt: Date;
  maxSpinsPerAccount?: number;
  maxSpinsPerDay?: number;
  prizeTableRows?: PromotionPrizeTermsRow[];
};

export type PromotionPrizeTermsRow = {
  rank: string;
  name: string;
  detail: string;
  quantity: string;
  validity: string;
};

const DEFAULT_PRIZE_ROWS: PromotionPrizeTermsRow[] = [
  {
    rank: "Giải Đặc Biệt",
    name: "Tủ lạnh",
    detail: "Thiết bị gia dụng cao cấp — trao sau giao dịch",
    quantity: "1",
    validity: "Khi ký HĐMB & hoàn thành nghĩa vụ tài chính đợt đầu",
  },
  {
    rank: "Giải Nhất",
    name: "Bếp điện từ đôi",
    detail: "Thiết bị bếp công nghệ cao",
    quantity: "3",
    validity: "Khi ký HĐMB & hoàn thành nghĩa vụ tài chính đợt đầu",
  },
  {
    rank: "Giải Nhì",
    name: "Nồi chiên không dầu",
    detail: "Quà tặng gia dụng thông minh",
    quantity: "20",
    validity: "Khi ký HĐMB & hoàn thành nghĩa vụ tài chính đợt đầu",
  },
  {
    rank: "Giải Ba",
    name: "3 gói hỗ trợ hồ sơ NOXH 1:1",
    detail: "Tư vấn chuyên sâu từ chuyên gia HouseX (trị giá 1,5 triệu đồng/gói)",
    quantity: "100",
    validity: "**Áp dụng ngay** khi làm hồ sơ mua bán qua HouseX",
  },
  {
    rank: "Giải Khuyến khích",
    name: "Voucher 500.000đ",
    detail: "Khấu trừ trực tiếp vào hợp đồng mua bán",
    quantity: "500",
    validity: "Khi ký HĐMB qua HouseX",
  },
];

function fmtDate(d: Date): string {
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function prizeTableMarkdown(rows: PromotionPrizeTermsRow[]): string {
  const header =
    "| STT | Hạng giải | Chi tiết quà tặng | Số lượng | Quy đổi tiền mặt | Hiệu lực áp dụng |\n| --- | --- | --- | --- | --- | --- |";
  const body = rows
    .map(
      (r, i) =>
        `| ${i + 1} | **${r.rank}** — ${r.name} | ${r.detail} | ${r.quantity} | **Tuyệt đối không** | ${r.validity} |`,
    )
    .join("\n");
  return `${header}\n${body}`;
}

/** Thể lệ pháp lý Lucky Wheel — nguồn mặc định cho seed & admin. */
export function buildPromotionTermsMarkdown(input: PromotionTermsInput): string {
  const maxAccount = input.maxSpinsPerAccount ?? PROMOTION_LIMITS.maxSpinsPerAccount;
  const maxDay = input.maxSpinsPerDay ?? PROMOTION_LIMITS.maxSpinsPerDay;
  const rows = input.prizeTableRows ?? DEFAULT_PRIZE_ROWS;

  return `# THỂ LỆ CHƯƠNG TRÌNH KHUYẾN MẠI: VÒNG QUAY MAY MẮN

**(HOUSEX.VN — LUCKY WHEEL)**

## 1. Thông tin chung về chương trình

- **Tên chương trình:** Vòng Quay May Mắn — ${input.campaignName} cùng HouseX.vn.
- **Hình thức khuyến mại:** Quay số trúng thưởng trực tuyến (mang tính may rủi).
- **Thời gian diễn ra:** Từ ngày **${fmtDate(input.startAt)}** đến hết ngày **${fmtDate(input.endAt)}**.
- **Phạm vi áp dụng:** Toàn quốc, thực hiện trực tuyến qua website chính thức **HouseX.vn** (housex.vn / timnhaxahoi.com).
- **Phân hệ sản phẩm:** Chương trình **chỉ áp dụng** cho khách hàng tham gia mua **nhà ở xã hội (NOXH)** qua phân hệ dự án NOXH trên HouseX. **Không áp dụng** cho dự án nhà ở thương mại, cho thuê, môi giới bất động sản thương mại, hoặc các dịch vụ khác (định giá, thiết kế nội thất, tư vấn vay thương mại, v.v.).
- **Đối tượng tham gia:** Khách hàng đã đăng ký tài khoản thành viên hợp lệ, xác minh email và số điện thoại, hoàn thành công cụ kiểm tra điều kiện mua **nhà ở xã hội (NOXH)** với kết quả **Đủ điều kiện**, và đáp ứng điều kiện giao dịch tại Mục 3.

## 2. Cơ cấu giải thưởng

${prizeTableMarkdown(rows)}

> **Quy định chung về quà tặng:** Mọi quà tặng/giải thưởng thuộc mọi hạng đều **không có giá trị quy đổi thành tiền mặt** trong mọi trường hợp.

## 3. Điều kiện cốt lõi để quà tặng có giá trị hiệu lực

Kết quả trúng thưởng chỉ được công nhận **hợp lệ và có giá trị thực hiện** khi khách hàng đáp ứng đầy đủ:

1. **Giao dịch trực tiếp:** Quà tặng **chỉ có giá trị** đối với giao dịch mua bán/thuê mua bất động sản được thực hiện và ghi nhận **thành công trực tiếp với HouseX.vn**.
2. **Loại trừ môi giới bên thứ ba:** Chương trình **không áp dụng** khi khách hàng ký hợp đồng hoặc giao dịch qua bất kỳ sàn, đơn vị môi giới hoặc cá nhân môi giới nào **ngoài hệ thống HouseX.vn**, *kể cả cùng dự án, block hoặc sản phẩm tương đương*.
3. **Loại trừ nhà ở thương mại & dịch vụ:** Quà tặng **không có giá trị** đối với giao dịch mua/thuê **nhà ở thương mại**, căn hộ đầu tư, đất nền thương mại, hoặc khi khách chỉ sử dụng dịch vụ tư vấn/định giá/thiết kế **không** gắn với mua NOXH qua HouseX.
4. **Tính chính chủ:** Tài khoản trúng thưởng phải trùng khớp thông tin cá nhân (Họ tên, CMND/CCCD/Hộ chiếu, Số điện thoại) với người đứng tên trên Hợp đồng giao dịch bất động sản.
5. **Không chuyển nhượng quà:** Quà không được chuyển nhượng, trừ vợ/chồng, con, cha/mẹ ruột (cần xác minh khi trao quà).

## 4. Cách thức tham gia

1. Truy cập mục **Khuyến mãi / Vòng Quay May Mắn** trên HouseX.vn.
2. Nhấn **Quay** — được phép trải nghiệm vòng quay trước khi đăng nhập; kết quả chỉ được ghi nhận vào tài khoản khi đã đăng nhập, xác minh email và hoàn thành kiểm tra điều kiện mua nhà ở xã hội (NOXH) với kết quả đủ điều kiện.
3. Kết quả trúng thưởng được lưu tại mục **Quà tặng** trong tài khoản khách hàng sau khi hoàn tất bước lưu.
4. **Giới hạn lượt quay:** Tối đa **${maxDay} lượt/ngày**, tối đa **${maxAccount} lượt/chiến dịch** (cộng thêm 1 lượt nếu chia sẻ chương trình theo quy định hiện hành).
5. **Giới hạn phần quà:** Mỗi tài khoản chỉ được nhận **một (01)** phần quà trong suốt chiến dịch.

## 5. Thời gian, địa điểm và thủ tục nhận quà

### Gói hỗ trợ tư vấn 1:1

- **Thời gian:** Kích hoạt **ngay** khi khách bắt đầu quy trình lập, nộp và hoàn thiện hồ sơ mua bán phối hợp cùng HouseX.vn.
- **Hình thức:** Liên hệ Hotline hoặc chuyên gia HouseX theo mã trúng thưởng trên hệ thống.

### Các giải thưởng khác (hiện vật, voucher, quà giá trị cao)

- **Thời gian trao quà:** Chỉ bàn giao **sau khi** khách ký **HĐMB chính thức** và **hoàn thành nghĩa vụ tài chính đợt đầu/theo tiến độ** trong HĐMB.
- **Thời hạn tối đa:** Trong **30 ngày** kể từ ngày đủ điều kiện, HouseX.vn bàn giao tại văn phòng hoặc gửi bảo đảm theo địa chỉ khách cung cấp.
- **Quà vật lý:** Trao tận nơi sau khi giao dịch thành công; voucher khấu trừ trực tiếp vào HĐMB.

## 6. Quyền hạn của Ban tổ chức (HouseX.vn)

- Từ chối trao giải hoặc hủy kết quả nếu phát hiện gian lận (hack, phần mềm can thiệp), tài khoản ảo, hoặc giao dịch bị hủy cọc/hủy HĐMB.
- Dữ liệu hệ thống HouseX.vn là căn cứ **duy nhất** xác định tính hợp lệ phần thưởng.
- Tranh chấp về điều kiện môi giới hoặc quy trình ký kết: quyết định Ban quản trị HouseX.vn là **cuối cùng** và ràng buộc các bên.

## 7. Khiếu nại và liên hệ

Mọi khiếu nại liên quan chương trình vui lòng liên hệ bộ phận Chăm sóc khách hàng HouseX qua mục **Liên hệ** trên website hoặc email hỗ trợ chính thức.

---

*Bằng việc tham gia vòng quay, khách hàng xác nhận đã đọc, hiểu và đồng ý toàn bộ thể lệ này.*
`;
}

/** Dòng đồng ý hiển thị dưới vòng quay (UX). */
export const PROMOTION_SPIN_CONSENT_LINE =
  "Bằng việc nhấn Quay, bạn đã đọc và đồng ý với Thể lệ chương trình — áp dụng riêng cho phân hệ NOXH, quà chỉ có hiệu lực khi ký HĐMB mua NOXH trực tiếp qua HouseX.vn.";
