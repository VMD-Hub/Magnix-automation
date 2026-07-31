/**
 * E-contract khung hợp tác đối tác — SoT affiliate §1.4.
 * Không lộ % HH / bảng chiết khấu.
 */

export const PARTNER_CONTRACT_VERSION = "HX-PC-2026-08";

export const PARTNER_CONTRACT_TITLE =
  "Thỏa thuận khung hợp tác đối tác House X";

/** Plain text điều khoản (snapshot + UI). */
export const PARTNER_CONTRACT_TERMS_TEXT = `
${PARTNER_CONTRACT_TITLE}
Phiên bản ${PARTNER_CONTRACT_VERSION}

1. Phạm vi
House X (Proptech HouseX) cung cấp nền tảng kết nối, hỗ trợ hồ sơ và vận hành
đối soát cho đối tác giới thiệu / đồng hành giao dịch nhà ở (NOXH và sản phẩm
liên quan). Đối tác tự chọn mức hợp tác trên từng deal khi khai báo.

2. Vai trò đối tác
- Khai báo trung thực thông tin khách và dự án.
- Ghi nhận chăm sóc (CS) có bằng chứng theo hướng dẫn hệ thống.
- Không thu phí ẩn / cắt bớt quyền lợi khách ngoài chính sách House X đã công bố
  nội bộ với đối tác.

3. Độc quyền lead
House X áp dụng cửa sổ độc quyền theo lịch dương (trần và quy tắc im lặng)
được mô tả trong chương trình nội bộ. Vi phạm CS giả hoặc im quá hạn có thể
khiến quyền độc quyền bị nhả.

4. Hoa hồng
Hoa hồng nội bộ tính sau khi có hợp đồng mua bán (HĐMB) và Ops nhập giá căn
hợp lệ. Đối tác theo dõi tiến độ deal trên hệ thống; số chi xuất hiện sau khi
đủ điều kiện đối soát — không công bố bảng % trên kênh công khai.

5. Dữ liệu & bảo mật
Đối tác không được chia sẻ SĐT đầy đủ / PII khách ngoài luồng House X khi chưa
được phép. Mọi tư vấn pháp lý sâu do chuyên viên House X phụ trách theo mức
deal.

6. Hiệu lực
Việc xác nhận OTP (và chữ ký tay nếu có) trên phiên bản điều khoản này tạo
thỏa thuận điện tử lưu trong hồ sơ tài khoản đối tác. House X có thể cập nhật
phiên bản điều khoản; đối tác được yêu cầu xác nhận lại khi cần.

7. Liên hệ hỗ trợ
Kênh hỗ trợ đối tác theo cấu hình Help trên Mini App / web môi giới.
`.trim();

export function buildPartnerContractSnapshotHtml(input: {
  brokerName: string;
  brokerId: string;
  signedAtIso: string;
  hasCanvasSignature: boolean;
}): string {
  const paragraphs = PARTNER_CONTRACT_TERMS_TEXT.split("\n\n")
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
  return `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"/><title>${escapeHtml(PARTNER_CONTRACT_TITLE)}</title></head><body>
<h1>${escapeHtml(PARTNER_CONTRACT_TITLE)}</h1>
<p><strong>Phiên bản:</strong> ${escapeHtml(PARTNER_CONTRACT_VERSION)}</p>
<p><strong>Đối tác:</strong> ${escapeHtml(input.brokerName)} (${escapeHtml(input.brokerId)})</p>
<p><strong>Thời điểm ký:</strong> ${escapeHtml(input.signedAtIso)}</p>
<p><strong>Chữ ký canvas:</strong> ${input.hasCanvasSignature ? "Có" : "Không"}</p>
<hr/>
${paragraphs}
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
